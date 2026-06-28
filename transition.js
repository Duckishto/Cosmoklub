// Fade out the page before navigating between Home <-> Object
(function () {
  var PT_MS = 300;

  var LINKS = { 'object.html': true, 'index.html': true };

  function currentPage() {
    return location.pathname.split('/').pop() || 'index.html';
  }

  // Fade in on load — always, so arriving pages feel smooth
  document.addEventListener('DOMContentLoaded', function () {
    var h = document.documentElement;
    h.style.opacity = '0';
    h.style.transition = 'none';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        h.style.transition = 'opacity ' + PT_MS + 'ms ease';
        h.style.opacity = '1';
        setTimeout(function () { h.style.transition = ''; h.style.opacity = ''; }, PT_MS + 50);
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
    var h = document.documentElement;
    h.style.transition = 'opacity ' + PT_MS + 'ms ease';
    h.style.opacity = '0';
    setTimeout(function () { window.location.href = href; }, PT_MS);
  });
})();
