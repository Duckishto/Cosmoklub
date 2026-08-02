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
(function () {
  var PT_MS = 280;

  // filename -> id of that page's root Vue app element
  var ROOTS = {
    'index.html': 'app',
    'object.html': 'object-app',
    'team.html': 'team-app',
    'staff-application.html': 'staff-app'
  };

  function currentPage() {
    return location.pathname.split('/').pop() || 'index.html';
  }

  function getRoot() {
    var id = ROOTS[currentPage()];
    return id ? document.getElementById(id) : null;
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

  // Show the loading screen immediately — before images/models/fonts have
  // necessarily finished — since the app root is already hidden via CSS.
  var loader = getLoader();

  // Once the page is fully loaded, cross-fade the loader out and the app
  // root in.
  window.addEventListener('load', function () {
    var root = getRoot();
    if (root) {
      root.getBoundingClientRect(); // force recalc of the CSS opacity:0 start
      root.style.transition = 'opacity ' + PT_MS + 'ms ease';
      root.style.opacity = '1';
    }
    loader.classList.add('pt-hidden');
  });

  // Bring the loading screen back and fade content out before navigating to
  // another app page.
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var link = e.target.closest('a[href]');
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
    var href = link.getAttribute('href');
    if (!ROOTS[href] || href === currentPage()) return;

    e.preventDefault();
    var root = getRoot();

    loader.classList.remove('pt-hidden');
    if (root) {
      root.style.transition = 'opacity ' + PT_MS + 'ms ease';
      root.style.opacity = '0';
    }
    setTimeout(function () { window.location.href = href; }, PT_MS);
  });
})();
