// Page-load & navigation transition for the whole app (Home, Object,
// Our Team, Staff Application).
//
// transition.css starts each page's root app div at opacity:0 so there's no
// flash of unstyled content. This script:
//   1. Shows a full-screen loading overlay the moment it runs.
//   2. Fades the overlay out / the page content in once the page has
//      actually finished loading (window 'load' — fonts, images, 3D models,
//      etc. included), so the "loading screen" stays up for as long as the
//      page is genuinely still rendering.
//   3. Reuses the same overlay as an outro: clicking a link to another app
//      page fades content out, brings the loader back, then navigates.
//
// Also guards against the two ways this kind of script usually goes blank:
//   - bfcache restores (hitting the browser Back/Forward button lands on a
//     page frozen mid-fade — 'load' never fires again for it).
//   - 'load' never firing / firing later than expected for any other reason.
(function () {
  var PT_MS = 280;
  var FALLBACK_MS = 4000; // hard ceiling — never leave the screen stuck blank

  var ROOT_IDS = ['app', 'object-app', 'team-app', 'staff-app'];
  var PAGES = ['index.html', 'object.html', 'team.html', 'staff-application.html'];

  function currentFile() {
    return location.pathname.split('/').pop() || 'index.html';
  }

  // Find whichever app root is actually on this page — based on the DOM,
  // not the URL, so it works regardless of how the page was addressed
  // (with/without .html, trailing slash, rewrites, etc).
  function getRoot() {
    for (var i = 0; i < ROOT_IDS.length; i++) {
      var el = document.getElementById(ROOT_IDS[i]);
      if (el) return el;
    }
    return null;
  }

  function getLoader() {
    var loader = document.querySelector('.pt-loader');
    if (loader) return loader;

    loader = document.createElement('div');
    loader.className = 'pt-loader';
    loader.setAttribute('role', 'status');
    loader.setAttribute('aria-label', 'Loading');
    loader.innerHTML =
      '<div class="pt-loader__dots" aria-hidden="true"><span></span><span></span><span></span></div>' +
      '<div class="pt-loader__text">Loading</div>';
    document.body.appendChild(loader);
    return loader;
  }

  var loader = getLoader();
  var root = getRoot();
  var revealed = false;
  var fallbackTimer = null;

  function reveal() {
    revealed = true;
    if (fallbackTimer) { clearTimeout(fallbackTimer); fallbackTimer = null; }
    if (root) {
      root.getBoundingClientRect(); // force recalc of the CSS opacity:0 start
      root.style.transition = 'opacity ' + PT_MS + 'ms ease';
      root.style.opacity = '1';
    }
    loader.classList.add('pt-hidden');
  }

  function revealOnce() {
    if (revealed) return;
    reveal();
  }

  // Normal path.
  window.addEventListener('load', revealOnce);
  // In case this script runs after the page has already finished loading
  // (e.g. an instant cache hit), don't wait for an event that already fired.
  if (document.readyState === 'complete') revealOnce();
  // Safety net: whatever else happens, don't leave the user on a blank
  // screen indefinitely.
  fallbackTimer = setTimeout(revealOnce, FALLBACK_MS);

  // bfcache fix: if this page is restored from the back/forward cache (e.g.
  // the user pressed Back right after this page had faded out to navigate
  // away), the DOM is thawed exactly as it was — mid-fade, loader showing —
  // and 'load' does not fire again. Force a re-reveal in that case, even
  // though `revealed` was already true before the page was frozen.
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) reveal();
  });

  // Outro: fade content out and bring the loader back before navigating to
  // another app page.
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var link = e.target.closest('a[href]');
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
    var href = link.getAttribute('href');
    if (PAGES.indexOf(href) === -1 || href === currentFile()) return;

    e.preventDefault();
    loader.classList.remove('pt-hidden');
    if (root) {
      root.style.transition = 'opacity ' + PT_MS + 'ms ease';
      root.style.opacity = '0';
    }
    setTimeout(function () { window.location.href = href; }, PT_MS);
  });
})();
