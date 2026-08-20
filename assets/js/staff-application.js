// CosmoKlub: Staff Application page logic.
// Mirrors the lightweight nav/starfield/lang setup used on team.js/object.js,
// plus a form that inserts into the `staff_applications` table (see
// supabase/schema.sql) using the same Supabase client index.html's
// register/login form uses (loaded via /assets/js/lib/supabase-client.js below).
//
// If Supabase isn't configured yet (no SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY
// env vars set, see assets/js/lib/supabase-client.js for setup steps), submitting
// shows a fallback message pointing people at hello@cosmoklub.space instead
// of silently failing.
//
// Anti-spam: two lightweight, no-backend traps plus a resubmission cooldown.
//   1. Honeypot (`honeypot` below, rendered as .hp-field in the HTML): an
//      input real visitors never see or reach, but that simple bots fill in
//      because it looks like a normal field to them. Any value in it means
//      the submission is dropped without ever reaching Supabase.
//   2. Minimum fill time (`formLoadedAt`): bots that skip the honeypot
//      often still submit near-instantly. Anything submitted within
//      MIN_FILL_MS of the page loading is treated as spam.
//   3. Resubmission cooldown: after a real submission succeeds, further
//      submissions from the same browser are blocked for COOLDOWN_MS via
//      localStorage, so "Submit another" can't be used to flood the table.

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

// Anti-spam tuning, see the file header comment above for what each does.
const MIN_FILL_MS = 2500;                          // faster than this = bot
const COOLDOWN_MS = 10 * 60 * 1000;                 // 10 minutes between submits
const COOLDOWN_KEY = 'cosmoklub-staff-app-last-submit';

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
      honeypot: '',
      formLoadedAt: 0,
      errors: {},
      loading: false,
      success: false,
    };
  },

  mounted() {
    window.CosmoKlub.initStarfield();
    this.formLoadedAt = Date.now();
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
      // Honeypot: real visitors never see or reach this field (see
      // .hp-field in staff-application.css). Anything in it means a bot
      // filled it in, drop the submission without hitting Supabase, and
      // fake success so the bot has no signal it was caught.
      if (this.honeypot.trim()) {
        this.success = true;
        return;
      }

      if (!this.validate()) return;

      // Minimum fill time: a real person needs at least a few seconds to
      // read the form and type into it. Anything submitted faster than
      // that, past the honeypot, is almost certainly a bot.
      if (Date.now() - this.formLoadedAt < MIN_FILL_MS) {
        this.errors = { submit: 'That went through a little too fast. Give the form a moment and try again.' };
        return;
      }

      // Resubmission cooldown: stop the same browser from using "Submit
      // another" to flood the table with repeated applications.
      const cooldown = this.cooldownRemainingMs();
      if (cooldown > 0) {
        const mins = Math.ceil(cooldown / 60000);
        this.errors = { submit: `You've already sent an application recently. Try again in about ${mins} minute${mins === 1 ? '' : 's'}.` };
        return;
      }

      this.loading = true;
      this.errors = {};

      const client = window.supabaseClient || (window.supabaseReady ? await window.supabaseReady : null);
      if (!client) {
        this.loading = false;
        this.errors = {
          submit: "Applications aren't connected yet. Email hello@cosmoklub.space with your name, the track you're applying for, and why you'd like to join."
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
        this.markSubmitted();
        this.loading = false;
        this.success = true;
      } catch (err) {
        this.errors = { submit: err.message || String(err) };
        this.loading = false;
      }
    },

    // How much of the resubmission cooldown is left, in ms (0 = clear to
    // submit). Wrapped in try/catch since localStorage can throw in some
    // private-browsing modes, if that happens we just don't cooldown-gate
    // rather than blocking real applicants over it.
    cooldownRemainingMs() {
      try {
        const last = Number(localStorage.getItem(COOLDOWN_KEY) || 0);
        const remaining = COOLDOWN_MS - (Date.now() - last);
        return remaining > 0 ? remaining : 0;
      } catch (err) {
        return 0;
      }
    },

    markSubmitted() {
      try { localStorage.setItem(COOLDOWN_KEY, String(Date.now())); } catch (err) { /* ignore */ }
    },

    resetForm() {
      this.form = emptyForm();
      this.honeypot = '';
      this.formLoadedAt = Date.now();
      this.errors = {};
      this.success = false;
    },
  },
}).mount('#staff-app');
