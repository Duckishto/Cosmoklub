// Page starts at opacity:0 (set in inline <style> in <head>).
// This script fades it in, and fades it out before navigating.
(function () {
  var PT_MS = 300;

  // ── Fade IN — runs as soon as this script is parsed (bottom of body) ──
  // The page has been invisible since first paint. Now make it appear.
  var h = document.documentElement;
  h.style.transition = 'opacity ' + PT_MS + 'ms ease';
  h.style.opacity = '1';

  // ── Fade OUT before navigating ────────────────────────────────────────
  var LINKS = { 'object.html': true, 'index.html': true };

  function currentPage() {
    return location.pathname.split('/').pop() || 'index.html';
  }

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var link = e.target.closest('a[href]');
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
    var href = link.getAttribute('href');
    if (!LINKS[href] || href === currentPage()) return;

    e.preventDefault();
    h.style.transition = 'opacity ' + PT_MS + 'ms ease';
    h.style.opacity = '0';
    setTimeout(function () { window.location.href = href; }, PT_MS);
  });
})();
