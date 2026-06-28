// ---------- Home ⇄ Object swipe transition ----------
// Shared by index.html and object.html. Two halves:
//
//  1. ENTRANCE — if this page was just navigated to via a link we
//     intercepted below, a tiny inline <script> in <head> already set
//     html[data-pt-enter] before the first paint so the content wrapper
//     renders fully off-screen with no flash. Once this script runs we
//     animate it back into place.
//
//  2. EXIT — clicking a Home<->Object link slides the *current* page's
//     content wrapper off-screen first, then completes the real
//     navigation, so the two pages feel like one continuous swipe
//     instead of a hard page cut.
//
// PT_MS must match the --pt-duration value in transition.css.
(function () {
  var root = document.getElementById('app') || document.getElementById('object-app');
  var html = document.documentElement;
  var PT_MS = 420;

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------------------------------------------------------- entrance
  var enterDir = html.getAttribute('data-pt-enter');
  if (enterDir && root) {
    try { sessionStorage.removeItem('pt-enter'); } catch (e) {}

    if (reduceMotion) {
      html.removeAttribute('data-pt-enter');
    } else {
      // Double rAF: make sure the off-screen starting position from the
      // pre-paint CSS rule has actually been painted at least once before
      // we enable the transition and animate it back to left:0 — otherwise
      // the browser can coalesce both into a single frame and nothing
      // appears to move.
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          root.classList.add('pt-sliding');
          root.style.left = '0';

          var done = false;
          var clear = function () {
            if (done) return;
            done = true;
            root.classList.remove('pt-sliding');
            root.style.left = '';
            html.removeAttribute('data-pt-enter');
            root.removeEventListener('transitionend', clear);
          };
          root.addEventListener('transitionend', clear);
          setTimeout(clear, PT_MS + 100); // safety net if transitionend doesn't fire
        });
      });
    }
  }

  // -------------------------------------------------------------- exit
  // Only Home <-> Object links get the swipe; everything else (anchors,
  // external links, the language dropdown, etc.) navigates normally.
  var ROUTES = {
    '': { 'object.html': 'forward' },
    'index.html': { 'object.html': 'forward' },
    'object.html': { 'index.html': 'back' },
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
    var direction = map && map[href];
    if (!direction || !root) return;

    e.preventDefault();

    if (reduceMotion) {
      window.location.href = href;
      return;
    }

    try { sessionStorage.setItem('pt-enter', direction); } catch (err) {}

    // Start fetching the next page in the background while this one
    // slides out, so the swipe doesn't add a full network round-trip
    // of extra wait on top of the animation.
    var pre = document.createElement('link');
    pre.rel = 'prefetch';
    pre.href = href;
    document.head.appendChild(pre);

    root.classList.add('pt-sliding');
    root.style.left = direction === 'forward' ? '-100%' : '100%';

    setTimeout(function () {
      window.location.href = href;
    }, PT_MS);
  });
})();
