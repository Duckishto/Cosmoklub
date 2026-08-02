// CosmoKlub — Staff Application page logic.
// Mirrors the lightweight nav/starfield/lang setup used on team.js/object.js,
// plus a form that inserts into the `staff_applications` table (see
// supabase/schema.sql) using the same Supabase client index.html's
// register/login form uses (loaded via /api/supabase-client.js below).
//
// If Supabase isn't configured yet (no SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY
// env vars set — see api/supabase-client.js for setup steps), submitting
// shows a fallback message pointing people at hello@cosmoklub.space instead
// of silently failing.

const { createApp } = Vue;

const ICONS = {
  dev: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  research: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  creative: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r="0.5" fill="#a855f7"/><circle cx="17.5" cy="10.5" r="0.5" fill="#a855f7"/><circle cx="8.5" cy="7.5" r="0.5" fill="#a855f7"/><circle cx="6.5" cy="12.5" r="0.5" fill="#a855f7"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.5-.7 1.5-1.5 0-.4-.15-.75-.4-1.02-.24-.26-.4-.6-.4-.98 0-.83.67-1.5 1.5-1.5H16c3.3 0 6-2.7 6-6 0-4.42-4.5-8-10-8z"/></svg>`,
  mod: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 3 6v6c0 5 3.8 9.4 9 10 5.2-.6 9-5 9-10V6l-9-4z"/></svg>`,
};

const emptyForm = () => ({
  fullName: '', email: '', discord: '', role: '', links: '',
  why: '', experience: '', availability: '', consent: false,
});

createApp({
  data() {
    return {
      mobileMenuOpen: false,
      langOpen: false,
      navScrolled: false,
      navCompact: false,
      currentLang: window.CosmoKlub.LANGS[0],
      langs: window.CosmoKlub.LANGS,

      ICONS,
      form: emptyForm(),
      errors: {},
      loading: false,
      success: false,
    };
  },

  mounted() {
    window.CosmoKlub.initStarfield();
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      this.navScrolled = y > 20;
      this.navCompact = y > 80;
    }, { passive: true });
    document.addEventListener('click', (e) => { if (!e.target.closest('.lang-wrap')) this.langOpen = false; });
  },

  methods: {
    setLang(l) { this.currentLang = l; this.langOpen = false; },

    validate() {
      const e = {};
      if (!this.form.fullName.trim()) e.fullName = 'Enter your name.';
      if (!this.form.email.includes('@')) e.email = 'Enter a valid email.';
      if (!this.form.role) e.role = 'Pick a track.';
      if (!this.form.why.trim()) e.why = 'Tell us a little about why you want to join.';
      if (!this.form.consent) e.consent = 'Please confirm before submitting.';
      this.errors = e;
      return !Object.keys(e).length;
    },

    async submitApplication() {
      if (!this.validate()) return;
      this.loading = true;
      this.errors = {};

      const client = window.supabaseClient || (window.supabaseReady ? await window.supabaseReady : null);
      if (!client) {
        this.loading = false;
        this.errors = {
          submit: "Applications aren't connected yet — email hello@cosmoklub.space with your name, the track you're applying for, and why you'd like to join."
        };
        return;
      }

      try {
        const { error } = await client.from('staff_applications').insert({
          full_name: this.form.fullName.trim(),
          email: this.form.email.trim(),
          discord: this.form.discord.trim() || null,
          role_applied: this.form.role,
          links: this.form.links.trim() || null,
          why: this.form.why.trim(),
          experience: this.form.experience.trim() || null,
          availability: this.form.availability.trim() || null,
        });
        if (error) {
          this.errors = { submit: error.message };
          this.loading = false;
          return;
        }
        this.loading = false;
        this.success = true;
      } catch (err) {
        this.errors = { submit: err.message || String(err) };
        this.loading = false;
      }
    },

    resetForm() {
      this.form = emptyForm();
      this.errors = {};
      this.success = false;
    },
  },
}).mount('#staff-app');
