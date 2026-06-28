// ---------------------------------------------------------------------------
// CosmoKlub — Supabase client (local / static hosting version)
//
// HOW TO SET UP:
//   1. Create a free project at https://supabase.com
//   2. Go to Project Settings → API
//   3. Copy your "Project URL" and "anon public" key (starts with eyJ...)
//   4. Paste them into the two constants below, then save.
//
// NOTE: The api/supabase-config.js file is a Cloudflare Pages serverless
// function used in production to keep credentials out of source code.
// This file is the local/static equivalent — fill it in directly.
// ---------------------------------------------------------------------------

const SUPABASE_URL = '';   // e.g. 'https://xyzxyz.supabase.co'
const SUPABASE_KEY = '';   // e.g. 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

window.supabaseClient = null;

window.supabaseReady = (async () => {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn(
      '[CosmoKlub] Supabase is not configured. ' +
      'Open supabase-client.js and fill in SUPABASE_URL and SUPABASE_KEY ' +
      'with your project credentials from https://supabase.com → Settings → API.'
    );
    return null;
  }

  try {
    window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        // Store session in localStorage under a site-specific key.
        // Using persistSession: true (default) keeps users logged in across reloads.
        persistSession: true,
        storageKey: 'cosmoklub-auth',
      }
    });
    return window.supabaseClient;
  } catch (err) {
    console.error('[CosmoKlub] Failed to initialise Supabase client:', err);
    return null;
  }
})();
