// ---------- Home <-> Object fade transition ----------
// EXIT:     fade the app root to opacity 0, then navigate
// ENTRANCE: <html> starts at opacity 0 (via CSS data-pt-enter attr set
//           in the inline <head> script), then fades in via <html> itself
//           — avoids the v-cloak / display:none conflict on #app
(function () {
  var html = document.documentElement;
  var PT_MS = 350;

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function getRoot() {
    return document.getElementById('app') || document.getElementById('object-app');
  }

  // ── Entrance: fade in the whole page ────────────────────────────────
  if (html.getAttribute('data-pt-enter')) {
    try { sessionStorage.removeItem('pt-enter'); } catch (e) {}

    if (reduceMotion) {
      html.removeAttribute('data-pt-enter');
    } else {
      // Wait for paint with opacity:0 applied, then transition to 1
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          html.classList.add('pt-fading');
          html.style.opacity = '1';

          var done = false;
          var clear = function () {
            if (done) return;
            done = true;
            html.classList.remove('pt-fading');
            html.style.opacity = '';
            html.removeAttribute('data-pt-enter');
            html.removeEventListener('transitionend', clear);
          };
          html.addEventListener('transitionend', clear);
          setTimeout(clear, PT_MS + 100);
        });
      });
    }
  }

  // ── Exit: fade out app root before navigating ────────────────────────
  var ROUTES = {
    '':            { 'object.html': true },
    'index.html':  { 'object.html': true },
    'object.html': { 'index.html':  true },
  };

  function currentPage() {
    return location.pathname.split('/').pop() || '';
  }

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    var link = e.target.closest('a[href]');
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return;

    var href = link.getAttribute('href');
    var map = ROUTES[currentPage()];
    if (!map || !map[href]) return;

    var root = getRoot();
    if (!root) return;

    e.preventDefault();

    if (reduceMotion) {
      window.location.href = href;
      return;
    }

    try { sessionStorage.setItem('pt-enter', 'fade'); } catch (err) {}

    root.classList.add('pt-fading');
    root.style.opacity = '0';

    setTimeout(function () {
      window.location.href = href;
    }, PT_MS);
  });
})();
