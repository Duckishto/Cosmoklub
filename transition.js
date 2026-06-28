// Fade transition between Home <-> Object
// transition.css starts #app / #object-app at opacity:0 to prevent flash-of-content.
// This script fades them in on load and fades out before navigation.
(function () {
  var PT_MS = 280;

  var LINKS = { 'object.html': true, 'index.html': true };

  function currentPage() {
    return location.pathname.split('/').pop() || 'index.html';
  }

  function getRoot() {
    return document.getElementById('app') || document.getElementById('object-app');
  }

  // Fade in on load — CSS already has opacity:0 so no flash before this fires
  window.addEventListener('load', function () {
    var root = getRoot();
    if (!root) return;
    // Force a style recalc so the browser registers the starting opacity:0
    // from CSS before we begin transitioning to 1.
    root.getBoundingClientRect();
    root.style.transition = 'opacity ' + PT_MS + 'ms ease';
    root.style.opacity = '1';
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
