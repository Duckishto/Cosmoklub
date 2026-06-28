// Cloudflare Pages Function — Supabase config provider
//
// Lives at:  /api/supabase-config
// Purpose:   Hands the browser the Supabase Project URL + publishable key
//            at request time, reading them from Cloudflare environment
//            variables instead of having them hardcoded/committed in
//            supabase-client.js.
//
// Setup (Cloudflare Pages dashboard):
//   Project → Settings → Environment variables → Add variable
//     Name:  SUPABASE_URL
//     Value: https://your-project-ref.supabase.co
//     Type:  Plain text (or Secret — either works, this isn't sensitive)
//
//     Name:  SUPABASE_PUBLISHABLE_KEY
//     Value: sb_publishable_xxxxxxxxxxxx   (or a legacy anon key, eyJ...)
//     Type:  Secret  (recommended, even though this key is safe to expose
//            to the browser — keeping it as a Cloudflare secret just means
//            it never sits in your repo or build logs)
//   Do this for both "Production" and "Preview" environments, then trigger
//   a fresh deployment — env var changes don't apply retroactively to
//   deployments that already ran.
//
// Local dev (wrangler):
//   wrangler pages dev .
//   — put SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY in a .dev.vars file
//   (untracked; see .dev.vars.example)
//
// Note: the value returned here (the publishable/anon key) is designed to
// be exposed to the browser — Row Level Security in supabase/schema.sql is
// what actually protects your data, not secrecy of this key. Putting it in
// a Cloudflare env var instead of committed source just keeps project-
// specific config out of git and lets you swap projects per environment.
// Never put a Supabase "secret" or "service_role" key in this file or any
// environment variable served to the browser like this — those must only
// ever be used in server-side code.

export async function onRequestGet({ env }) {
  const url = env.SUPABASE_URL || '';
  const key = env.SUPABASE_PUBLISHABLE_KEY || '';

  if (!url || !key) {
    return jsonResponse(
      {
        error: 'Supabase is not configured yet.',
        detail: 'Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY in your Cloudflare Pages project\u2019s environment variables, then redeploy.',
      },
      503
    );
  }

  return jsonResponse({ url, key });
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
    headers: {
      'Content-Type': 'application/json',
      // This config is per-deployment, not per-request — cache briefly at
      // the edge/browser so every page load isn't a fresh round trip.
      'Cache-Control': status === 200 ? 'public, max-age=300' : 'no-store',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
