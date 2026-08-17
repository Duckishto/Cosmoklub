// ---------------------------------------------------------------------------
// CosmoKlub — auth guard for signed-in-only pages.
//
// Load this in <head>, AFTER api/supabase-client.js, on every page that needs
// a session:
//
//   <script src="api/supabase-client.js"></script>
//   <script src="auth-guard.js"></script>
//
// Public pages (index.html, team.html, staff-application.html) must NOT load
// it — they are meant to be reachable signed out.
//
// It hides the page until the session check finishes, so a signed-out visitor
// never sees a flash of the app before being sent away. On failure they land
// on index.html?login=1, which main.js reads to open the login modal for them.
//
// Note this is a navigation/UX guard, not the security boundary — Row Level
// Security in supabase/schema.sql is what actually protects the data. That is
// why an infrastructure failure below lets the page through instead of
// locking people out of a site whose landing page can't sign them in either.
// ---------------------------------------------------------------------------

(function () {
  const REDIRECT_TO = 'index.html?login=1';
  const REVEAL_TIMEOUT_MS = 8000;

  const root = document.documentElement;

  // Runs from <head>, so this lands before <body> ever paints.
  root.classList.add('auth-pending');

  const style = document.createElement('style');
  style.textContent = 'html.auth-pending body{visibility:hidden!important}';
  document.head.appendChild(style);

  function reveal() {
    root.classList.remove('auth-pending');
  }

  function redirectToLogin() {
    // replace() so this page never enters history — otherwise pressing Back
    // from the landing page bounces the visitor straight back into the guard.
    window.location.replace(REDIRECT_TO);
  }

  // If Supabase never answers (offline, config endpoint down) don't leave the
  // page invisible forever.
  const failSafe = setTimeout(reveal, REVEAL_TIMEOUT_MS);

  (async function guard() {
    try {
      const client =
        window.supabaseClient ||
        (window.supabaseReady ? await window.supabaseReady : null);

      clearTimeout(failSafe);

      if (!client) {
        console.warn(
          '[CosmoKlub] Auth guard: Supabase is unavailable, letting the page ' +
          'through. Sign-in is broken everywhere in this state, so bouncing ' +
          'to the landing page would just trap people in a redirect loop.'
        );
        reveal();
        return;
      }

      const { data } = await client.auth.getSession();

      if (data && data.session) {
        reveal();
      } else {
        redirectToLogin();
      }
    } catch (error) {
      clearTimeout(failSafe);
      console.warn('[CosmoKlub] Auth guard could not verify the session.', error);
      reveal();
    }
  })();
})();
