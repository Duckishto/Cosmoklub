// CosmoKlub: Legal Center — documentation-portal page logic.
//
// The shared "compact" top nav and the site footer are built from the
// same data shape as every other page (contact.js/team.js/resources.js)
// so they render identically. What's specific to this page is a docs
// layout: a left sidebar of legal documents grouped into sections, and
// a reading pane that shows the selected document. No real policy copy
// is published yet, so the pane always renders a skeleton placeholder.
//
// By request: no theme toggle and no language switcher on this page.

const { createApp } = Vue;

// Nav dropdown icon set — identical to the other pages' scripts so the
// shared nav bar looks the same here.
const NAV_ICONS = {
  cap: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/></svg>`,
  users: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg>`,
  chart: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  scope: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  book: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  forum: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8A8.5 8.5 0 0 1 21 11.5z"/></svg>`,
  server: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="7" rx="2"/><rect x="2" y="14" width="20" height="7" rx="2"/><line x1="6" y1="6.5" x2="6.01" y2="6.5"/><line x1="6" y1="17.5" x2="6.01" y2="17.5"/></svg>`
};

// One line-icon per legal document, in the same 1.8-stroke style.
const DOC_ICONS = {
  scroll: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v9"/><path d="M15 2v5h5"/><path d="M6 21a2 2 0 0 1-2-2v-3h4v3a2 2 0 0 1-2 2z"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>`,
  cookie: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5z"/><circle cx="8.5" cy="12.5" r=".8" fill="currentColor" stroke="none"/><circle cx="12.5" cy="16.5" r=".8" fill="currentColor" stroke="none"/><circle cx="15" cy="10" r=".8" fill="currentColor" stroke="none"/></svg>`,
  scale: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="M5 7h14"/><path d="M7 7l-3 6a3 3 0 0 0 6 0z"/><path d="M17 7l-3 6a3 3 0 0 0 6 0z"/><path d="M7 21h10"/></svg>`,
  lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  flag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>`
};

createApp({
  data() {
    return {
      mobileMenuOpen: false, // top nav (mobile)
      openMenu: null,        // top nav dropdown
      sidebarOpen: false,    // docs sidebar (mobile off-canvas)
      rights: 'All rights reserved.',

      // The sidebar's grouped document list — laid out like a docs
      // portal: a short "start here" group, the core documents, then
      // the broader policies. Every entry is still a placeholder; the
      // reading pane shows the same skeleton for whichever is active.
      sections: [
        {
          label: 'Core Legal Documents',
          docs: [
            { id: 'tos', label: 'Terms of Service', lead: 'The terms governing access to and use of the platform.', icon: DOC_ICONS.scroll },
            { id: 'privacy', label: 'Privacy Policy', lead: 'How we collect, use, and protect your personal information.', icon: DOC_ICONS.shield },
            { id: 'acceptable-use', label: 'Acceptable Use Policy', lead: 'What you may and may not do while using CosmoKlub.', icon: DOC_ICONS.scale },
            { id: 'community', label: 'Community Guidelines', lead: 'The standards that keep our community welcoming and safe.', icon: DOC_ICONS.heart }
          ]
        },
        {
          label: 'Policies & Agreements',
          docs: [
            { id: 'security', label: 'Security Policy', lead: 'Our approach to protecting the platform and your data.', icon: DOC_ICONS.lock },
            { id: 'cookies', label: 'Cookie Policy', lead: 'How and why CosmoKlub uses cookies and similar technologies.', icon: DOC_ICONS.cookie }
          ]
        }
      ],

      activeId: 'tos',
    };
  },

  computed: {
    // Flat list of every doc across all sidebar sections, so lookups
    // (active doc, deep-link matching) don't have to walk the groups.
    allDocs() {
      return this.sections.flatMap(s => s.docs);
    },
    activeDoc() {
      return this.allDocs.find(d => d.id === this.activeId) || this.allDocs[0];
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
    // deep-links into this page's own documents.
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

    // Deep-link support: legal.html#privacy opens straight to that doc.
    const hash = (location.hash || '').replace('#', '');
    if (this.allDocs.some(d => d.id === hash)) this.activeId = hash;

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-has-menu')) this.openMenu = null;
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { this.openMenu = null; this.sidebarOpen = false; }
    });
  },

  methods: {
    toggleMenu(key) { this.openMenu = this.openMenu === key ? null : key; },
    closeMenu() { this.openMenu = null; },

    // Select a document in the reading pane. Closes the mobile sidebar,
    // updates the URL hash, and scrolls the pane back to the top so the
    // new document starts from its header.
    selectDoc(id) {
      this.activeId = id;
      this.sidebarOpen = false;
      history.replaceState(null, '', `#${id}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    // Footer "Legal" links are plain #hash hrefs; intercept once Vue is
    // up so they select the doc instead of doing a native jump.
    onFooterLegalClick(e, href) {
      const id = href.replace('#', '');
      if (!this.allDocs.some(d => d.id === id)) return;
      e.preventDefault();
      this.selectDoc(id);
    },
  },
}).mount('#legal-app');
