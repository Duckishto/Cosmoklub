// ---------------------------------------------------------------------------
// CosmoKlub — shared front-end helpers.
//
// The pages use Vue's global (non-module) build and load their logic as plain
// <script> tags, so this file exposes its API on `window.CosmoKlub` rather than
// using ES module exports. Load it BEFORE each page's own script
// (main.js / object.js / team.js) so the API is ready when their Vue app mounts.
//
// It exists to hold code that was previously copy-pasted across those three
// pages: the language menu and the animated background starfield.
// ---------------------------------------------------------------------------

window.CosmoKlub = window.CosmoKlub || {};

// Language menu shown in the top-nav on every page. `currentLang` on each page
// starts as LANGS[0] (English); `setLang` just swaps in another entry.
window.CosmoKlub.LANGS = [
  { code: 'EN', name: 'English',  flag: '🇬🇧' },
  { code: 'ES', name: 'Español',  flag: '🇪🇸' },
  { code: 'FR', name: 'Français', flag: '🇫🇷' },
  { code: 'JA', name: '日本語',    flag: '🇯🇵' },
  { code: 'TH', name: 'ภาษาไทย',  flag: '🇹🇭' },
];

// Animated twinkling starfield drawn onto the shared <canvas id="star-canvas">.
// `count` is the number of stars (index.html historically used 220, the other
// pages 200 — pass the value to preserve each page's original density).
window.CosmoKlub.initStarfield = function initStarfield(count = 200) {
  const canvas = document.getElementById('star-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.3 + 0.2,
      o: Math.random() * 0.75 + 0.1,
      s: Math.random() * 0.0025 + 0.001,
      t: Math.random() * Math.PI * 2,
    }));
  };
  resize();
  window.addEventListener('resize', resize);
  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.t += s.s;
      const a = s.o * (0.5 + 0.5 * Math.sin(s.t));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(196,168,255,${a})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  };
  draw();
};
