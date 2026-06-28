// Cloudflare Pages Function — NASA API proxy
//
// Lives at:  /api/nasa
// Purpose:   Keeps the NASA API key server-side. The browser never sees it.
//            The frontend (object.js) calls /api/nasa?endpoint=...&...params
//            and this function attaches the real api_key from an environment
//            secret before forwarding the request to api.nasa.gov / its
//            sibling NASA hosts.
//
// Setup (Cloudflare Pages dashboard):
//   Project → Settings → Environment variables → Add variable
//     Name:  NASA_API_KEY
//     Value: <your key from https://api.nasa.gov/>
//     Type:  Secret  (do this for both "Production" and "Preview")
//   Then trigger a fresh deployment — env var changes don't apply
//   retroactively to deployments that already ran.
//
// Local dev (wrangler):
//   wrangler pages dev .
//   — put your real key in a .dev.vars file (untracked); see .dev.vars.example
//
// Debugging: every response carries an `X-NASA-Key-Source` header — "env"
// means your real key was used, "demo" means it fell back to NASA's shared
// DEMO_KEY (30 req/hour per IP, the usual cause of 429 errors). Check this
// in the Network tab before assuming the code is broken. There's also
// `X-Cache: HIT`/`MISS` showing whether this response came from Cloudflare's
// edge cache instead of a fresh call to NASA.
//
// Caching: successful responses are cached at Cloudflare's edge (not just
// via the Cache-Control header, which only affects the browser) so repeated
// identical requests — reloading a tab, multiple visitors hitting the same
// day's APOD — don't re-spend the rate limit. Daily/static data (APOD, EPIC
// imagery, image-library assets, rover manifests) is cached for an hour;
// everything else for 5 minutes. 429/error responses are never cached.
//
// Nothing in this repo or in git history contains a real key. If NASA_API_KEY
// is not set, requests fall back to NASA's shared "DEMO_KEY" (rate-limited to
// ~30 requests/hour/IP), so the page still works during initial setup.

const NASA_HOST = 'https://api.nasa.gov';
const IMAGES_HOST = 'https://images-api.nasa.gov';
const EONET_HOST = 'https://eonet.gsfc.nasa.gov';

// Allowlist of endpoints this proxy is willing to forward to. Keeps the
// function from becoming an open relay to arbitrary URLs.
const ENDPOINTS = {
  // Astronomy Picture of the Day — one new image per calendar day
  apod: { host: NASA_HOST, path: '/planetary/apod', needsKey: true, longCache: true },

  // Near Earth Object Web Service — browse / lookup / feed
  neo_feed: { host: NASA_HOST, path: '/neo/rest/v1/feed', needsKey: true },
  neo_lookup: { host: NASA_HOST, path: '/neo/rest/v1/neo/{id}', needsKey: true, longCache: true },
  neo_browse: { host: NASA_HOST, path: '/neo/rest/v1/neo/browse', needsKey: true },

  // Mars Rover Photos (Curiosity, Perseverance, Opportunity, Spirit)
  mars_photos: { host: NASA_HOST, path: '/mars-photos/api/v1/rovers/{rover}/photos', needsKey: true },
  mars_latest: { host: NASA_HOST, path: '/mars-photos/api/v1/rovers/{rover}/latest_photos', needsKey: true },
  mars_manifest: { host: NASA_HOST, path: '/mars-photos/api/v1/manifests/{rover}', needsKey: true, longCache: true },

  // EPIC — daily full-disc Earth imagery from DSCOVR
  epic_natural: { host: NASA_HOST, path: '/EPIC/api/natural/images', needsKey: true },
  epic_natural_date: { host: NASA_HOST, path: '/EPIC/api/natural/date/{date}', needsKey: true, longCache: true },
  epic_enhanced: { host: NASA_HOST, path: '/EPIC/api/enhanced/images', needsKey: true },
  // The actual PNG asset for a given EPIC image (binary passthrough below) —
  // a given date+image filename never changes once published.
  epic_image: { host: NASA_HOST, path: '/EPIC/archive/{collection}/{year}/{month}/{day}/png/{image}.png', needsKey: true, binary: true, longCache: true },

  // NASA Image and Video Library — full metadata library for any object/mission.
  // This host doesn't require an api_key at all.
  images_search: { host: IMAGES_HOST, path: '/search', needsKey: false },
  images_asset: { host: IMAGES_HOST, path: '/asset/{nasa_id}', needsKey: false, longCache: true },
  images_metadata: { host: IMAGES_HOST, path: '/metadata/{nasa_id}', needsKey: false, longCache: true },

  // EONET — natural events observed from orbit (storms, fires, volcanoes...)
  eonet_events: { host: EONET_HOST, path: '/api/v3/events', needsKey: false },
};

function buildUpstreamUrl(def, params) {
  let path = def.path;
  // Fill {placeholders} from query params, then drop them from the
  // forwarded query string so they don't appear twice.
  const used = new Set();
  path = path.replace(/\{(\w+)\}/g, (_, key) => {
    used.add(key);
    return encodeURIComponent(params.get(key) || '');
  });

  const url = new URL(def.host + path);
  for (const [key, value] of params.entries()) {
    if (key === 'endpoint' || used.has(key)) continue;
    url.searchParams.set(key, value);
  }
  return url;
}

export async function onRequestGet({ request, env }) {
  const reqUrl = new URL(request.url);
  const endpointKey = reqUrl.searchParams.get('endpoint');
  const def = endpointKey && ENDPOINTS[endpointKey];

  if (!def) {
    return jsonResponse(
      { error: 'Unknown or missing "endpoint" parameter.', allowed: Object.keys(ENDPOINTS) },
      400
    );
  }

  const upstream = buildUpstreamUrl(def, reqUrl.searchParams);

  let keySource = 'none';
  if (def.needsKey) {
    // env.NASA_API_KEY is a Cloudflare Pages secret — never hardcoded,
    // never present in client-side code or this repo.
    const hasRealKey = !!env.NASA_API_KEY && env.NASA_API_KEY !== 'DEMO_KEY';
    const key = hasRealKey ? env.NASA_API_KEY : 'DEMO_KEY';
    keySource = hasRealKey ? 'env' : 'demo';
    upstream.searchParams.set('api_key', key);
  }

  // ---- Edge cache: serve repeated identical requests without touching
  // NASA at all. This is what actually protects the (possibly shared/low)
  // rate limit during normal use — the Cache-Control header alone only
  // affects the browser's own cache, not Cloudflare's edge.
  const cacheKey = new Request(upstream.toString(), request);
  const cache = caches.default;
  const cached = await cache.match(cacheKey);
  if (cached) {
    const res = new Response(cached.body, cached);
    res.headers.set('X-Cache', 'HIT');
    res.headers.set('X-NASA-Key-Source', keySource);
    return res;
  }

  try {
    const upstreamRes = await fetch(upstream.toString(), {
      headers: { Accept: def.binary ? 'image/png,*/*' : 'application/json' },
    });

    // Binary endpoints (e.g. the actual EPIC PNG) are streamed through as-is.
    // Everything else is NASA JSON, forwarded as text.
    const body = def.binary ? upstreamRes.body : await upstreamRes.text();

    // Slow-changing data (APOD, daily imagery, rover photo libraries) can
    // sit at the edge much longer than NASA's own per-second freshness —
    // none of it updates faster than once a day.
    const ttl = def.longCache ? 3600 : 300;

    const response = new Response(body, {
      status: upstreamRes.status,
      headers: {
        'Content-Type': upstreamRes.headers.get('Content-Type') || (def.binary ? 'image/png' : 'application/json'),
        'Cache-Control': upstreamRes.ok ? `public, max-age=${ttl}` : 'no-store',
        'Access-Control-Allow-Origin': '*',
        'X-Cache': 'MISS',
        'X-NASA-Key-Source': keySource,
      },
    });

    // Only cache successful, non-429 responses — never cache a rate-limit
    // error, or every retry would be stuck replaying the same failure.
    if (upstreamRes.ok) {
      await cache.put(cacheKey, response.clone());
    }

    return response;
  } catch (err) {
    return jsonResponse({ error: 'Upstream request failed.', detail: String(err) }, 502);
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

function jsonResponse(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
}
