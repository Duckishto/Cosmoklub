// ---------- Home <-> Object fade transition ----------
// EXIT:    fade current page out, then navigate
// ENTRANCE: page starts at opacity:0 (set by CSS via data-pt-enter),
//           then JS fades it in once the DOM is ready
(function () {
  var html = document.documentElement;
  var PT_MS = 350;

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function getRoot() {
    return document.getElementById('app') || document.getElementById('object-app');
  }

  // ── Entrance: fade in on page load ──────────────────────────────────
  var entering = html.getAttribute('data-pt-enter');
  if (entering) {
    try { sessionStorage.removeItem('pt-enter'); } catch (e) {}

    if (reduceMotion) {
      html.removeAttribute('data-pt-enter');
    } else {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          var root = getRoot();
          if (!root) { html.removeAttribute('data-pt-enter'); return; }
          root.classList.add('pt-fading');
          root.style.opacity = '1';

          var done = false;
          var clear = function () {
            if (done) return;
            done = true;
            root.classList.remove('pt-fading');
            root.style.opacity = '';
            html.removeAttribute('data-pt-enter');
            root.removeEventListener('transitionend', clear);
          };
          root.addEventListener('transitionend', clear);
          setTimeout(clear, PT_MS + 100);
        });
      });
    }
  }

  // ── Exit: fade out before navigating ────────────────────────────────
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
