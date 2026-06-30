// ---------------------------------------------------------------------------
// Supabase client setup for CosmoKlub.
//
// No project URL or key is hardcoded here. Instead, this file calls
// /api/supabase-config (a Cloudflare Pages Function — see
// functions/api/supabase-config.js) which reads SUPABASE_URL and
// SUPABASE_PUBLISHABLE_KEY from Cloudflare's environment variables and
// hands them back at request time.
//
// `window.supabaseReady` is a Promise that resolves to the initialized
// client (or null if not configured / the request failed). main.js awaits
// this before using `window.supabaseClient` for register / login / logout.
//
// SETUP — do this before auth will work:
//   1. Create a free project at https://supabase.com
//   2. Project → Settings → API Keys → copy "Project URL" and the
//      "Publishable key" (starts with sb_publishable_...). Older projects
//      may instead show a legacy "anon public" key (eyJ...) — that works
//      here too, no code change needed.
//   3. In the Cloudflare Pages dashboard: Settings → Environment variables
//      → add SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY (Production + Preview)
//      → redeploy. For local dev with `wrangler pages dev`, put them in a
//      .dev.vars file instead (see .dev.vars.example).
//   4. Run the SQL in supabase/schema.sql (Supabase dashboard → SQL Editor)
//      — creates the `profiles` table (username, email, gender, uid) and
//      the trigger that fills it in automatically on signup.
//   5. For the social login buttons (Google, Apple, GitHub, Facebook) on
//      the auth modal: Supabase dashboard → Authentication → Providers →
//      enable each one and fill in its Client ID / Secret from that
//      provider's own developer console. Each provider also needs the
//      callback URL Supabase shows you added to its allowed redirect
//      list. Until a given provider is enabled, clicking its button will
//      surface that provider's error message inline in the modal rather
//      than silently doing nothing.
// ---------------------------------------------------------------------------

window.supabaseClient = null;

window.supabaseReady = (async () => {
  try {
    const res = await fetch('/api/supabase-config');
    if (!res.ok) {
      console.warn(
        '[CosmoKlub] Supabase is not configured yet. ' +
        'Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY as environment ' +
        'variables on your Cloudflare Pages project, then redeploy.'
      );
      return null;
    }
    const { url, key } = await res.json();
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    window.supabaseClient = createClient(url, key);
    return window.supabaseClient;
  } catch (err) {
    console.warn('[CosmoKlub] Could not reach /api/supabase-config:', err);
    return null;
  }
})();
