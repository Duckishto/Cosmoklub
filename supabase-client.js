// ---------------------------------------------------------------------------
// Supabase client setup for CosmoKlub.
//
// This file creates ONE shared Supabase client (`window.supabaseClient`) that
// main.js uses for register / login / logout.
//
// SETUP — do this before auth will work:
//   1. Create a free project at https://supabase.com
//   2. Project Settings → API → copy "Project URL" and "anon public" key
//   3. Paste them into SUPABASE_URL / SUPABASE_ANON_KEY below
//   4. Run the SQL in supabase/schema.sql (Supabase dashboard → SQL Editor)
//      — this creates the `profiles` table (username, email, gender, uid)
//      and the trigger that fills it in automatically on signup.
//
// The anon key is safe to expose in client-side code — it only allows what
// your Row Level Security policies (in schema.sql) permit. Never put the
// "service_role" key here.
// ---------------------------------------------------------------------------

const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL'; // e.g. https://abcdEFGH.supabase.co
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

window.supabaseClient = (SUPABASE_URL.startsWith('http'))
  ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

if (!window.supabaseClient) {
  console.warn(
    '[CosmoKlub] Supabase is not configured yet. ' +
    'Open supabase-client.js and set SUPABASE_URL / SUPABASE_ANON_KEY.'
  );
}
