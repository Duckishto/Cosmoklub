// ---------- Home <-> Object fade transition ----------
(function () {
  var PT_MS = 350;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Entrance: html opacity was set to 0 by the inline <head> script ──
  // Fade it back to 1 now that the page is ready.
  try {
    if (sessionStorage.getItem('pt-enter')) {
      sessionStorage.removeItem('pt-enter');
      if (!reduceMotion) {
        var h = document.documentElement;
        // Use rAF so the opacity:0 has actually been painted before we animate
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            h.style.transition = 'opacity ' + PT_MS + 'ms ease';
            h.style.opacity = '1';
            setTimeout(function () {
              h.style.transition = '';
              h.style.background = '';
            }, PT_MS + 50);
          });
        });
      } else {
        document.documentElement.style.opacity = '1';
        document.documentElement.style.background = '';
      }
    }
  } catch (e) {}

  // ── Exit: fade out before navigating ─────────────────────────────────
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

    e.preventDefault();

    if (reduceMotion) { window.location.href = href; return; }

    try { sessionStorage.setItem('pt-enter', '1'); } catch (err) {}

    var h = document.documentElement;
    h.style.transition = 'opacity ' + PT_MS + 'ms ease';
    h.style.opacity = '0';

    setTimeout(function () { window.location.href = href; }, PT_MS);
  });
})();
