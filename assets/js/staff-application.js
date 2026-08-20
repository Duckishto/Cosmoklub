// CosmoKlub: Staff Application page logic.
// Nav mirrors the shared "compact" bar used across the rest of the site
// (Tools / Use cases dropdowns + Sign in / Register), same as team.js and
// resources.js, plus a form that inserts into the `staff_applications` table (see
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

// Nav dropdown + footer icon set, same as team.js/resources.js so the
// shared "compact" nav bar and site-footer render identically here.
const NAV_ICONS = {
  cap: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/></svg>`,
  users: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg>`,
  chart: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  scope: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  book: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  forum: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8A8.5 8.5 0 0 1 21 11.5z"/></svg>`,
  server: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="7" rx="2"/><rect x="2" y="14" width="20" height="7" rx="2"/><line x1="6" y1="6.5" x2="6.01" y2="6.5"/><line x1="6" y1="17.5" x2="6.01" y2="17.5"/></svg>`
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
      openMenu: null,
      rights: 'All rights reserved.',

      ICONS,
      form: emptyForm(),
      honeypot: '',
      formLoadedAt: 0,
      errors: {},
      loading: false,
      success: false,
    };
  },

  computed: {
    // Same Tools / Use cases dropdown content as index.html, team.html and
    // resources.html, with root-relative hrefs since this page lives at
    // the project root.
    navMenus() {
      return {
        tools: {
          label: 'Tools for exploring the sky',
          items: [
            { title: 'Forum', desc: 'Ask questions and share observations with other members.', href: 'tools/forum.html', icon: NAV_ICONS.forum },
            { title: 'Library', desc: 'Browse NASA images, media and mission archives.', href: 'tools/library.html', icon: NAV_ICONS.book },
            { title: 'Calculator & Graphing', desc: 'Plot functions and run astronomical calculations.', href: 'tools/calcgraph.html', icon: NAV_ICONS.chart },
            { title: 'Community Server', desc: 'Join the live chat and observation sessions.', href: 'tools/comserver.html', icon: NAV_ICONS.server }
          ]
        },
        usecases: {
          label: 'User personas',
          items: [
            { title: 'Student', desc: 'Follow guided lessons and track your progress.', href: 'usecases/student.html', icon: NAV_ICONS.cap },
            { title: 'Professor', desc: 'Build courses and monitor your class in one place.', href: 'usecases/professor.html', icon: NAV_ICONS.users },
            { title: 'Tutor', desc: 'Run sessions and share material with your learners.', href: 'usecases/tutor.html', icon: NAV_ICONS.chart },
            { title: 'Hobbyist', desc: 'Plan observations and log what you find in the sky.', href: 'usecases/hobbyist.html', icon: NAV_ICONS.scope }
          ]
        }
      };
    },
    // Same footer link groups as index.html, team.html and resources.html,
    // with root-relative hrefs since this page lives at the project root.
    footerCols() {
      return [
        { title: 'Tools', links: [
          { text: 'Forum', href: 'tools/forum.html' },
          { text: 'Library', href: 'tools/library.html' },
          { text: 'Calculator & Graphing', href: 'tools/calcgraph.html' },
          { text: 'Community Server', href: 'tools/comserver.html' } ] },
        { title: 'Use Cases', links: [
          { text: 'Student', href: 'usecases/student.html' },
          { text: 'Professor', href: 'usecases/professor.html' },
          { text: 'Tutor', href: 'usecases/tutor.html' },
          { text: 'Hobbyist', href: 'usecases/hobbyist.html' } ] },
        { title: 'Project', links: [
          { text: 'Our Team', href: 'team.html' },
          { text: 'Apply as Staff', href: 'staff-application.html' },
          { text: 'Report Bug', href: 'report-bug.html' },
          { text: 'Contact', href: 'contact.html' } ] },
        { title: 'Legal', links: [
          { text: 'Terms of Service', href: 'legal.html#tos' },
          { text: 'Privacy Policy', href: 'legal.html#privacy' },
          { text: 'Community Guidelines', href: 'legal.html#community' },
          { text: 'Cookie Policy', href: 'legal.html#cookies' } ] }
      ];
    }
  },

  mounted() {
    window.CosmoKlub.initStarfield();
    this.formLoadedAt = Date.now();
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-has-menu')) this.openMenu = null;
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.openMenu = null;
    });
  },

  methods: {
    toggleMenu(key) { this.openMenu = this.openMenu === key ? null : key; },
    closeMenu() { this.openMenu = null; },

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
