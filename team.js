// CosmoKlub — Our Team page logic.
// Mirrors the lightweight nav/starfield/lang setup used on object.html.

const { createApp } = Vue;

createApp({
  data() {
    return {
      mobileMenuOpen: false,
      langOpen: false,
      navScrolled: false,
      currentLang: { code: 'EN', name: 'English', flag: '🇬🇧' },
      langs: [
        { code: 'EN', name: 'English', flag: '🇬🇧' },
        { code: 'ES', name: 'Español', flag: '🇪🇸' },
        { code: 'FR', name: 'Français', flag: '🇫🇷' },
        { code: 'JA', name: '日本語', flag: '🇯🇵' },
        { code: 'TH', name: 'ภาษาไทย', flag: '🇹🇭' },
      ],

      // ── Team roster ──────────────────────────────────────────────────
      // Photos live at team/1.png .. team/6.png — swap the files in that
      // folder to update headshots without touching this list.
      projectLead: [
        { name: 'Name Surname', role: 'Project Lead', img: 'team/1.png', bio: '' },
      ],
      developerTeam: [
        { name: 'Name Surname', role: 'Developer', img: 'team/2.png', bio: '' },
        { name: 'Name Surname', role: 'Developer', img: 'team/3.png', bio: '' },
        { name: 'Name Surname', role: 'Developer', img: 'team/4.png', bio: '' },
      ],
      researchTeam: [
        { name: 'Name Surname', role: 'Researcher', img: 'team/5.png', bio: '' },
        { name: 'Name Surname', role: 'Researcher', img: 'team/6.png', bio: '' },
      ],
    };
  },

  mounted() {
    this.initStarfield();
    window.addEventListener('scroll', () => { this.navScrolled = window.scrollY > 20; }, { passive: true });
    document.addEventListener('click', (e) => { if (!e.target.closest('.lang-wrap')) this.langOpen = false; });
  },

  methods: {
    setLang(l) { this.currentLang = l; this.langOpen = false; },

    initStarfield() {
      const canvas = document.getElementById('star-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      let stars = [];
      const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        stars = Array.from({ length: 200 }, () => ({
          x: Math.random() * canvas.width, y: Math.random() * canvas.height,
          r: Math.random() * 1.3 + 0.2, o: Math.random() * 0.75 + 0.1,
          s: Math.random() * 0.0025 + 0.001, t: Math.random() * Math.PI * 2,
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
    },
  },
}).mount('#team-app');
