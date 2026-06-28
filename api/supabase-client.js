// ---------------------------------------------------------------------------
// CosmoKlub — Supabase client initialiser
//
// Supabase is loaded via a dynamic import() from esm.sh — no separate
// <script> tag or committed library file needed.
//
// window.supabaseReady  — Promise that resolves to the client (or null)
// window.supabaseClient — set once the client is ready
// ---------------------------------------------------------------------------

window.supabaseClient = null;

window.supabaseReady = (async () => {
  try {
    // Fetch project URL + publishable key from the Cloudflare Pages function.
    // Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY in your CF Pages project:
    //   Settings → Environment variables → add both keys → redeploy.
    const res = await fetch('/api/supabase-config');
    if (!res.ok) {
      console.warn(
        '[CosmoKlub] Supabase is not configured yet. ' +
        'Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY in your Cloudflare ' +
        'Pages project environment variables, then redeploy.'
      );
      return null;
    }

    const { url, key } = await res.json();

    // Dynamically import the Supabase client from esm.sh.
    // This avoids needing a separate <script> tag or a committed library file,
    // and sidesteps browser tracking-prevention blocks on CDN UMD builds.
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');

    window.supabaseClient = createClient(url, key);
    return window.supabaseClient;
  } catch (err) {
    console.warn('[CosmoKlub] Could not initialise Supabase:', err);
    return null;
  }
})();
