// CosmoKlub — signed-in state for the public site's navigation.
//
// Every marketing page ships the same "Sign in / Register" pair in its nav.
// Once someone has an account those two buttons are noise, so this swaps them
// for the person's name and avatar, linking through to their profile.
//
// Drop it into any public page, after the Supabase client:
//
//   <script src="assets/js/lib/supabase-client.js"></script>
//   <script src="assets/js/lib/nav-auth.js"></script>
//
// (Pages inside tools/ and usecases/ use ../assets/... — the depth is worked
// out below, so the same file serves every page.)
//
// Not for dashboard.html: the app shell has its own profile entry point.
//
// Plain DOM rather than a Vue component on purpose — these pages are separate
// Vue apps with different data shapes, and some are static. Touching only the
// nav keeps one implementation working across all of them.

(function () {
  const SIGNED_OUT_SELECTORS = '.nav-auth .nav-signin, .nav-auth .nav-signup, li.nav-link-auth';

  // tools/x.html and usecases/x.html sit one level down; everything else is at
  // the root. Work out the prefix so links resolve from either depth.
  //
  // Cloudflare Pages serves /tools/library.html as /tools/library, so the last
  // segment can't be identified by a file extension — only a trailing slash
  // tells us the URL names a directory rather than a page.
  function basePrefix() {
    const path = window.location.pathname;
    const segments = path.split('/').filter(Boolean);
    const endsWithSlash = path.endsWith('/');
    const depth = Math.max(0, endsWithSlash ? segments.length : segments.length - 1);
    return '../'.repeat(depth);
  }

  function injectStyles() {
    if (document.getElementById('nav-auth-styles')) return;

    const style = document.createElement('style');
    style.id = 'nav-auth-styles';
    style.textContent = `
      .nav-user {
        display: inline-flex;
        align-items: center;
        gap: 9px;
        padding: 5px 14px 5px 5px;
        border-radius: 999px;
        text-decoration: none;
        color: #f5f3ff;
        background: rgba(168, 85, 247, 0.12);
        border: 1px solid rgba(168, 85, 247, 0.32);
        transition: background 0.2s ease, border-color 0.2s ease;
        max-width: 210px;
      }
      .nav-user:hover {
        background: rgba(168, 85, 247, 0.2);
        border-color: rgba(168, 85, 247, 0.55);
      }
      .nav-user-avatar {
        flex: 0 0 auto;
        width: 26px;
        height: 26px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        font-size: 12.5px;
        font-weight: 800;
        color: #08040f;
        background: linear-gradient(140deg, #c084fc, #7c3aed);
      }
      .nav-user-avatar img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
      }
      .nav-user-name {
        font-size: 13.5px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      /* Mobile dropdown variant — the nav collapses into a list there. The
         <li> also carries .nav-link-auth so it hides on desktop, which means
         .nav-link-auth a would otherwise restyle the chip; these win on
         specificity and put it back. */
      li.nav-user-item { list-style: none; }
      li.nav-user-item .nav-user {
        width: 100%;
        max-width: none;
        justify-content: flex-start;
        padding: 6px 14px 6px 6px;
        background: rgba(168, 85, 247, 0.12);
        border: 1px solid rgba(168, 85, 247, 0.32);
        border-radius: 999px;
      }
    `;
    document.head.appendChild(style);
  }

  function buildChip(name, avatarUrl, href) {
    const link = document.createElement('a');
    link.className = 'nav-user';
    link.href = href;
    link.title = `Signed in as ${name}`;

    const avatar = document.createElement('span');
    avatar.className = 'nav-user-avatar';

    if (avatarUrl) {
      const img = document.createElement('img');
      img.src = avatarUrl;
      img.alt = '';
      avatar.appendChild(img);
    } else {
      avatar.textContent = (name || '?').trim().charAt(0).toUpperCase() || '?';
    }

    const label = document.createElement('span');
    label.className = 'nav-user-name';
    label.textContent = name;

    link.append(avatar, label);
    return link;
  }

  function render(name, avatarUrl) {
    const href = basePrefix() + 'dashboard.html?tab=profile';

    // Drop the signed-out controls first so the two states can't both show.
    document.querySelectorAll(SIGNED_OUT_SELECTORS).forEach(el => el.remove());

    const navAuth = document.querySelector('.nav-auth');
    if (navAuth && !navAuth.querySelector('.nav-user')) {
      navAuth.appendChild(buildChip(name, avatarUrl, href));
    }

    // The mobile menu lists the same actions as <li> items. It carries
    // .nav-link-auth so it inherits `display: none` on desktop (style.css) —
    // otherwise the chip would show twice up there, once inline in the links
    // and once in the top-right corner.
    const navLinks = document.querySelector('.nav-links');
    if (navLinks && !navLinks.querySelector('.nav-user')) {
      const li = document.createElement('li');
      li.className = 'nav-link-auth nav-user-item';
      li.appendChild(buildChip(name, avatarUrl, href));
      navLinks.appendChild(li);
    }
  }

  async function run() {
    try {
      const client =
        window.supabaseClient ||
        (window.supabaseReady ? await window.supabaseReady : null);
      if (!client) return;

      const { data } = await client.auth.getSession();
      const user = data && data.session && data.session.user;
      if (!user) return;

      // profiles.username is the name people chose; fall back through the
      // sign-up metadata and then the email local part so the chip is never
      // blank while the row is still being created by the DB trigger.
      let name = '';
      let avatarUrl = '';

      try {
        const { data: row } = await client
          .from('profiles')
          .select('username')
          .eq('uid', user.id)
          .single();
        if (row) name = row.username || '';
      } catch (error) {
        console.warn('[CosmoKlub] nav-auth could not read the profile row.', error);
      }

      const meta = user.user_metadata || {};
      name = name || meta.username || (user.email || '').split('@')[0] || 'Account';
      avatarUrl = meta.avatar_url || meta.picture || '';

      injectStyles();

      // Vue renders the nav on these pages; wait a tick so we edit the mounted
      // DOM rather than markup that is about to be replaced.
      requestAnimationFrame(() => render(name, avatarUrl));
    } catch (error) {
      console.warn('[CosmoKlub] nav-auth failed; leaving the signed-out nav in place.', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
