(function () {
  var PLANETS = [
    'mercury', 'venus', 'earth', 'mars',
    'jupiter', 'saturn', 'uranus', 'neptune'
  ];

  function pickThree() {
    var pool = PLANETS.slice();
    var out = [];
    for (var i = 0; i < 3; i++) {
      var n = Math.floor(Math.random() * pool.length);
      out.push(pool.splice(n, 1)[0]);
    }
    return out;
  }

  function buildPlanets() {
    var wrap = document.createElement('span');
    wrap.className = 'ck-planets';
    pickThree().forEach(function (name) {
      var dot = document.createElement('span');
      dot.className = 'ck-planet p-' + name;
      if (name === 'saturn' || name === 'uranus') {
        var ring = document.createElement('span');
        ring.className = 'ck-ring';
        dot.appendChild(ring);
      }
      wrap.appendChild(dot);
    });
    return wrap;
  }

  function render(target, label) {
    if (!target) return;
    target.innerHTML = '';
    target.classList.add('ck-loader');
    target.appendChild(buildPlanets());
    if (label) {
      var t = document.createElement('span');
      t.className = 'ck-loader-text';
      t.textContent = label;
      target.appendChild(t);
    }
  }

  function mountBoot() {
    if (document.querySelector('.ck-boot')) return;
    var boot = document.createElement('div');
    boot.className = 'ck-boot';
    boot.appendChild(buildPlanets());
    var t = document.createElement('span');
    t.className = 'ck-boot-text';
    t.textContent = 'Loading';
    boot.appendChild(t);
    (document.body || document.documentElement).appendChild(boot);

    var hide = function () {
      boot.classList.add('is-done');
      setTimeout(function () {
        if (boot.parentNode) boot.parentNode.removeChild(boot);
      }, 600);
    };

    if (document.readyState === 'complete') {
      setTimeout(hide, 350);
    } else {
      window.addEventListener('load', function () { setTimeout(hide, 350); });
    }
    setTimeout(hide, 6000);
  }

  window.CosmoKlub = window.CosmoKlub || {};
  window.CosmoKlub.planetLoader = buildPlanets;
  window.CosmoKlub.renderLoader = render;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountBoot);
  } else {
    mountBoot();
  }
})();
