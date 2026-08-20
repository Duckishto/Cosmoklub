// CosmoKlub: Contact Us page logic.
// Nav mirrors the shared "compact" bar used across the rest of the site
// (Tools / Use cases dropdowns + Sign in / Register), same as
// staff-application.js/report-bug.js/team.js/resources.js. This page has
// no form/Supabase write of its own — it's two mailto/link cards, a
// social bar, and a static numbered FAQ — so there's no anti-spam layer
// to duplicate here.

const { createApp } = Vue;

// Nav dropdown + footer icon set, same as every other page's own script
// so the shared "compact" nav bar and site-footer render identically here.
const NAV_ICONS = {
  cap: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/></svg>`,
  users: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg>`,
  chart: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  scope: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  book: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  forum: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8A8.5 8.5 0 0 1 21 11.5z"/></svg>`,
  server: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="7" rx="2"/><rect x="2" y="14" width="20" height="7" rx="2"/><line x1="6" y1="6.5" x2="6.01" y2="6.5"/><line x1="6" y1="17.5" x2="6.01" y2="17.5"/></svg>`
};

createApp({
  data() {
    return {
      mobileMenuOpen: false,
      openMenu: null,
      rights: 'All rights reserved.',

      faqs: [
        {
          q: 'Not sure where to start?',
          a: "Take the free 30-minute onboarding — we'll walk you through the object browser, the calculator, and setting up your first observation log. No pressure, just a quick tour."
        },
        {
          q: 'Trying to pick a plan?',
          a: "Not sure if Explorers covers what you need, or if Lite, Pro, or Enterprise makes more sense? Tell us how you'd use CosmoKlub and we'll point you at the right one — no upsell."
        },
        {
          q: 'Want to partner or join the team?',
          a: 'Educators, observatories, and astronomy communities can partner with us. Prefer to build, research, or moderate instead? Check out our <a href="staff-application.html">staff applications</a>.'
        },
        {
          q: 'Found something broken?',
          a: "Spotted a bug or something that just doesn't work? Use the <a href=\"report-bug.html\">bug report form</a> so it goes straight to the right place — screenshots welcome."
        }
      ],
    };
  },

  computed: {
    // Same Tools / Use cases dropdown content as index.html, team.html,
    // resources.html, staff-application.html and report-bug.html, with
    // root-relative hrefs since this page lives at the project root.
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
    // Same footer link groups as the rest of the site, with root-relative
    // hrefs since this page lives at the project root.
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
  },
}).mount('#contact-app');
