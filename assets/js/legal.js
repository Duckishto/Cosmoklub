// CosmoKlub: Legal Center hub page logic.
// Nav mirrors the shared "compact" bar used across the rest of the site,
// same as contact.js/team.js/resources.js. This page has no form/Supabase
// write of its own — it's a sidebar of legal documents, each currently a
// "coming soon" placeholder (skeleton lines, no real policy text) until
// the actual Terms/Privacy/Guidelines/Cookie copy is ready to publish here.

const { createApp } = Vue;

// Nav dropdown icon set, same as every other page's own script so the
// shared "compact" nav bar renders identically here.
const NAV_ICONS = {
  cap: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/></svg>`,
  users: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg>`,
  chart: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  scope: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  book: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  forum: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8A8.5 8.5 0 0 1 21 11.5z"/></svg>`,
  server: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="7" rx="2"/><rect x="2" y="14" width="20" height="7" rx="2"/><line x1="6" y1="6.5" x2="6.01" y2="6.5"/><line x1="6" y1="17.5" x2="6.01" y2="17.5"/></svg>`
};

// One icon per legal document, drawn in the same 1.8-stroke line style as
// NAV_ICONS above so the sidebar reads as part of the same icon set.
const DOC_ICONS = {
  scroll: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v9"/><path d="M15 2v5h5"/><path d="M6 21a2 2 0 0 1-2-2v-3h4v3a2 2 0 0 1-2 2z"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>`,
  cookie: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5z"/><circle cx="8.5" cy="12.5" r=".8" fill="currentColor" stroke="none"/><circle cx="12.5" cy="16.5" r=".8" fill="currentColor" stroke="none"/><circle cx="15" cy="10" r=".8" fill="currentColor" stroke="none"/></svg>`
};

createApp({
  data() {
    return {
      mobileMenuOpen: false,
      openMenu: null,
      rights: 'All rights reserved.',

      // The four legal documents this hub collects. Every one of them is
      // a placeholder right now — icon/label/meta only, no drafted policy
      // text — the panel on the right always renders the same "coming
      // soon" skeleton regardless of which doc is active.
      docs: [
        { id: 'tos', label: 'Terms of Service', meta: 'Not yet published', icon: DOC_ICONS.scroll },
        { id: 'privacy', label: 'Privacy Policy', meta: 'Not yet published', icon: DOC_ICONS.shield },
        { id: 'community', label: 'Community Guidelines', meta: 'Not yet published', icon: DOC_ICONS.heart },
        { id: 'cookies', label: 'Cookie Policy', meta: 'Not yet published', icon: DOC_ICONS.cookie }
      ],
      activeDoc: 'tos',
    };
  },

  computed: {
    activeDocObj() {
      return this.docs.find(d => d.id === this.activeDoc) || this.docs[0];
    },
    // Same Tools / Use cases dropdown content as every other root page.
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
    // Same footer link groups as the rest of the site. The Legal column
    // now points at this page's own sections, matching the footer on
    // every other page (which links here instead of the old modal).
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
          { text: 'Terms of Service', href: '#tos' },
          { text: 'Privacy Policy', href: '#privacy' },
          { text: 'Community Guidelines', href: '#community' },
          { text: 'Cookie Policy', href: '#cookies' } ] }
      ];
    }
  },

  mounted() {
    window.CosmoKlub.initStarfield();

    // Deep-link support: legal.html#privacy opens straight on that doc.
    const hash = (location.hash || '').replace('#', '');
    if (this.docs.some(d => d.id === hash)) this.activeDoc = hash;

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

    selectDoc(id) {
      this.activeDoc = id;
      history.replaceState(null, '', `#${id}`);
    },

    // Footer "Legal" links use plain #hash hrefs so they still work if JS
    // is slow to boot; once Vue is up we intercept to avoid a jarring
    // native jump and just switch the active doc in place.
    onFooterLegalClick(e, href) {
      const id = href.replace('#', '');
      if (!this.docs.some(d => d.id === id)) return;
      e.preventDefault();
      this.selectDoc(id);
      document.querySelector('.legal-shell')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
  },
}).mount('#legal-app');
