// CosmoKlub — Our Team page logic.
// Nav now mirrors the shared "compact" bar used on the rest of the site
// (Tools / Use cases dropdowns + Sign in / Register) instead of the old
// language-switcher nav.

const { createApp } = Vue;

const I = {
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

      // ── Team roster ──────────────────────────────────────────────────
      // Every card on the page (Project Lead, Developer Team, Research
      // Team) is generated from these three arrays — nothing about a
      // person is hardcoded in team.html. To add, remove, or edit someone,
      // just edit the objects below:
      //   name  → shown as the card title
      //   role  → shown as the small uppercase label under the name
      //   img   → path to their photo (see note below)
      //   bio   → optional one-line description; leave '' to hide it
      //
      // Photos: put image files in assets/images/team/ and name them
      // 1.png, 2.png, 3.png… in the same order as the entries below
      // (currently 1–7, one file per person across all three teams
      // combined). To update someone's headshot, just overwrite their
      // numbered file in assets/images/team/ — no code change needed.
      // To add a new person, add an entry with the next free number,
      // e.g. img: 'assets/images/team/8.png', and drop the file in
      // that folder.
      projectLead: [
        { name: 'Kittikawin Sawanglab', role: 'Project Lead', img: 'assets/images/team/1.png', bio: '' },
      ],
      developerTeam: [
        { name: 'Kritsadaphas Sangthong', role: 'Developer', img: 'assets/images/team/2.jpg', bio: '' },
        { name: 'Siraphop Larbninjinda', role: 'Developer', img: 'assets/images/team/3.jpg', bio: '' },
        { name: 'Weerawit Watjanarat', role: 'Creative', img: 'assets/images/team/4.jpg', bio: '' },
      ],
      researchTeam: [
        { name: 'Pattanan Naosaran', role: 'Researcher', img: 'assets/images/team/5.jpg', bio: '' },
        { name: 'Watcharaphon Pisutwatthanasakul', role: 'Researcher', img: 'assets/images/team/6.jpg', bio: '' },
        { name: 'Thanaphat Chaipanukiat', role: 'Project Helper', img: 'assets/images/team/7.jpg', bio: '' },
      ],
    };
  },

  computed: {
    // Same Tools / Use cases dropdown content as index.html, resources.html
    // and the tools/usecases subpages, with root-relative hrefs since
    // team.html lives at the project root.
    navMenus() {
      return {
        tools: {
          label: 'Tools for exploring the sky',
          items: [
            { title: 'Forum', desc: 'Ask questions and share observations with other members.', href: 'tools/forum.html', icon: I.forum },
            { title: 'Library', desc: 'Browse NASA images, media and mission archives.', href: 'tools/library.html', icon: I.book },
            { title: 'Calculator & Graphing', desc: 'Plot functions and run astronomical calculations.', href: 'tools/calcgraph.html', icon: I.chart },
            { title: 'Community Server', desc: 'Join the live chat and observation sessions.', href: 'tools/comserver.html', icon: I.server }
          ]
        },
        usecases: {
          label: 'User personas',
          items: [
            { title: 'Student', desc: 'Follow guided lessons and track your progress.', href: 'usecases/student.html', icon: I.cap },
            { title: 'Professor', desc: 'Build courses and monitor your class in one place.', href: 'usecases/professor.html', icon: I.users },
            { title: 'Tutor', desc: 'Run sessions and share material with your learners.', href: 'usecases/tutor.html', icon: I.chart },
            { title: 'Hobbyist', desc: 'Plan observations and log what you find in the sky.', href: 'usecases/hobbyist.html', icon: I.scope }
          ]
        }
      };
    },
    // Same footer link groups as index.html, resources.html and the
    // tools/usecases subpages, with root-relative hrefs since team.html
    // lives at the project root.
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
          { text: 'Terms of Service', href: 'index.html#tos' },
          { text: 'Privacy Policy', href: 'index.html#privacy' },
          { text: 'Community Guidelines', href: '#' },
          { text: 'Cookie Policy', href: '#' } ] }
      ];
    }
  },

  methods: {
    toggleMenu(key) { this.openMenu = this.openMenu === key ? null : key; },
    closeMenu() { this.openMenu = null; }
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
}).mount('#team-app');
