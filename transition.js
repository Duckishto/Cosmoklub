// Fade transition between Home <-> Object
// Fades the content wrapper only — never hides html/body so page always renders.
(function () {
  var PT_MS = 280;

  var LINKS = { 'object.html': true, 'index.html': true };

  function currentPage() {
    return location.pathname.split('/').pop() || 'index.html';
  }

  function getRoot() {
    return document.getElementById('app') || document.getElementById('object-app');
  }

  // Fade in on load
  window.addEventListener('load', function () {
    var root = getRoot();
    if (!root) return;
    root.style.opacity = '0';
    root.style.transition = 'none';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        root.style.transition = 'opacity ' + PT_MS + 'ms ease';
        root.style.opacity = '1';
        setTimeout(function () {
          root.style.transition = '';
          root.style.opacity = '';
        }, PT_MS + 100);
      });
    });
  });

  // Fade out before navigating
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var link = e.target.closest('a[href]');
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
    var href = link.getAttribute('href');
    if (!LINKS[href] || href === currentPage()) return;

    e.preventDefault();
    var root = getRoot();
    if (!root) { window.location.href = href; return; }

    root.style.transition = 'opacity ' + PT_MS + 'ms ease';
    root.style.opacity = '0';
    setTimeout(function () { window.location.href = href; }, PT_MS);
  });
})();
