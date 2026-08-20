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

const PERSONAS = {
  forum: {
    key: 'forum',
    name: 'Forum',
    crumb: ['Tools', 'Learners', 'Forum'],
    eyebrow: 'For the community',
    titleTop: 'Ask questions and get answers',
    titleAccent: 'from people who have been there',
    lead: 'Post what you are stuck on, share what you have observed, and get real answers from tutors, professors and fellow learners in one place.',
    cta: 'Join the forum',
    heroImage: '',
    photoTitle: 'Built around how you ask and answer',
    photos: [
      { title: 'Questions that get buried in group chats', image: '' },
      { title: 'No way to tell who actually knows the answer', image: '' },
      { title: 'Advice that does not fit your level', image: '' },
      { title: 'No record to search back through', image: '' }
    ],
    toolsTitle: 'A complete toolkit for the community',
    tools: [
      { title: 'Threaded discussions', desc: 'Keep every question and its answers organised by topic so nothing gets lost.', image: '' },
      { title: 'Verified educators', desc: 'See which replies come from tutors and professors so you know who to trust.', image: '' },
      { title: 'Searchable history', desc: 'Find answers to questions other learners have already asked before posting your own.', image: '' }
    ]

  },
  library: {
    key: 'library',
    name: 'Library',
    crumb: ['Tools', 'Learners', 'Library'],
    eyebrow: 'For explorers',
    titleTop: 'Browse the same imagery',
    titleAccent: 'astronomers actually use',
    lead: 'Search thousands of NASA images, mission archives and object catalogues, and drop straight into the lesson or tool that explains what you are looking at.',
    cta: 'Browse the library',
    heroImage: '',
    photoTitle: 'Built around how you research',
    photos: [
      { title: 'Images scattered across different sites', image: '' },
      { title: 'No context for what you are looking at', image: '' },
      { title: 'Hard to tell which sources are reliable', image: '' },
      { title: 'No way to save what you find', image: '' }
    ],
    toolsTitle: 'A complete toolkit for your research',
    tools: [
      { title: 'NASA image search', desc: 'Search official NASA and mission archives by object, date or keyword.', image: '' },
      { title: 'Object profiles', desc: 'Every image links back to the object catalogue entry that explains it.', image: '' },
      { title: 'Saved collections', desc: 'Bookmark images and media to revisit later or share with others.', image: '' }
    ]

  },
  comserver: {
    key: 'comserver',
    name: 'Community Server',
    crumb: ['Tools', 'Learners', 'Community Server'],
    eyebrow: 'For live sessions',
    titleTop: 'Join the conversation',
    titleAccent: 'while the sky is still out',
    lead: 'Drop into live chat during observation nights, ask questions in real time, and coordinate sessions with tutors and other learners.',
    cta: 'Join the server',
    heroImage: '',
    photoTitle: 'Built around how you connect',
    photos: [
      { title: 'Observation nights planned alone', image: '' },
      { title: 'No one to confirm what you are seeing', image: '' },
      { title: 'Advice that arrives after the moment has passed', image: '' },
      { title: 'Sessions that are never written down', image: '' }
    ],
    toolsTitle: 'A complete toolkit for staying connected',
    tools: [
      { title: 'Live chat', desc: 'Talk with other members in real time during lessons and observation sessions.', image: '' },
      { title: 'Session scheduling', desc: 'See upcoming group sessions and join the ones that fit your plans.', image: '' },
      { title: 'Direct access to staff', desc: 'Reach tutors and moderators directly when you need a fast answer.', image: '' }
    ]

  },
  calcgraph: {
    key: 'calcgraph',
    name: 'Calculator and Graphing',
    crumb: ['Tools', 'Learners', 'Calculator and Graphing'],
    eyebrow: 'For working through the maths',
    titleTop: 'Plot it, derive it,',
    titleAccent: 'understand it',
    lead: 'Graph functions live, run astronomical calculations, and see the reasoning step by step instead of just the final result.',
    cta: 'Open the calculator',
    heroImage: '',
    photoTitle: 'Built around how you calculate',
    photos: [
      { title: 'Formulas with no visual to check against', image: '' },
      { title: 'Switching between apps mid calculation', image: '' },
      { title: 'Results with no working shown', image: '' },
      { title: 'No way to save a calculation for later', image: '' }
    ],
    toolsTitle: 'A complete toolkit for the maths',
    tools: [
      { title: 'Function grapher', desc: 'Plot functions live and see how changing a variable changes the graph.', image: '' },
      { title: 'Astronomical calculators', desc: 'Run the calculations used throughout the lessons, from orbits to magnitudes.', image: '' },
      { title: 'Step by step working', desc: 'See the reasoning behind every result, not just the final number.', image: '' }
    ]

  },



  
};

createApp({
  data() {
    const el = document.getElementById('app');
    let key = (el && el.dataset.persona || '').toLowerCase();
    if (!PERSONAS[key]) {
      key = (window.location.pathname.split('/').pop() || '').replace('.html', '').toLowerCase();
    }
    if (!PERSONAS[key]) key = 'forum';
    return {
      mobileMenuOpen: false,
      openMenu: null,
      openFaq: null,
      personaKey: key,
      rights: 'All rights reserved.'
    };
  },
  computed: {
    persona() { return PERSONAS[this.personaKey]; },
    faqs() {
      return [
        { q: 'help? help? help? help? help? help? help? help? help? help? help? help? help? help?',
          a: 'WHAT!? WHAT!? WHAT!? WHAT!? WHAT!? WHAT!? WHAT!? WHAT!? WHAT!? WHAT!? WHAT!? WHAT!?' },
        { q: 'help? help? help? help? help? help? help? help? help? help? help? help? help? help?',
          a: 'WHAT!? WHAT!? WHAT!? WHAT!? WHAT!? WHAT!? WHAT!? WHAT!? WHAT!? WHAT!? WHAT!? WHAT!?' },
        { q: 'help? help? help? help? help? help? help? help? help? help? help? help? help? help?',
          a: 'WHAT!? WHAT!? WHAT!? WHAT!? WHAT!? WHAT!? WHAT!? WHAT!? WHAT!? WHAT!? WHAT!? WHAT!?' },
        { q: 'help? help? help? help? help? help? help? help? help? help? help? help? help? help?',
          a: 'WHAT!? WHAT!? WHAT!? WHAT!? WHAT!? WHAT!? WHAT!? WHAT!? WHAT!? WHAT!? WHAT!? WHAT!?' },
        { q: 'help? help? help? help? help? help? help? help? help? help? help? help? help? help?',
          a: 'WHAT!? WHAT!? WHAT!? WHAT!? WHAT!? WHAT!? WHAT!? WHAT!? WHAT!? WHAT!? WHAT!? WHAT!?' }
      ];
    },
    navMenus() {
      return {
        tools: {
          label: 'Tools for exploring the sky',
          items: [
            { title: 'Forum', desc: 'Ask questions and share observations with other members.', href: '../tools/forum.html', icon: I.forum },
            { title: 'Library', desc: 'Browse NASA images, media and mission archives.', href: '../tools/library.html', icon: I.book },
            { title: 'Calculator and Graphing', desc: 'Plot functions and run astronomical calculations.', href: '../tools/calcgraph.html', icon: I.chart },
            { title: 'Community Server', desc: 'Join the live chat and observation sessions.', href: '../tools/comserver.html', icon: I.server }
          ]
        },
        usecases: {
          label: 'User personas',
          items: [
            { title: 'Student', desc: 'Follow guided lessons and track your progress.', href: '../usecases/student.html', icon: I.cap },
            { title: 'Professor', desc: 'Build courses and monitor your class in one place.', href: '../usecases/professor.html', icon: I.users },
            { title: 'Tutor', desc: 'Run sessions and share material with your learners.', href: '../usecases/tutor.html', icon: I.chart },
            { title: 'Hobbyist', desc: 'Plan observations and log what you find in the sky.', href: '../usecases/hobbyist.html', icon: I.scope }
          ]
        }
      };
    },
    footerCols() {
      return [
        { title: 'Tools', links: [
          { text: 'Forum', href: 'forum.html' },
          { text: 'Library', href: 'library.html' },
          { text: 'Calculator & Graphing', href: 'calcgraph.html' },
          { text: 'Community Server', href: 'comserver.html' } ] },
        { title: 'Use Cases', links: [
          { text: 'Student', href: '../usecases/student.html' },
          { text: 'Professor', href: '../usecases/professor.html' },
          { text: 'Tutor', href: '../usecases/tutor.html' },
          { text: 'Hobbyist', href: '../usecases/hobbyist.html' } ] },
        { title: 'Project', links: [
          { text: 'Our Team', href: '../team.html' },
          { text: 'Apply as Staff', href: '../staff-application.html' },
          { text: 'Report Bug', href: '#' },
          { text: 'Contact', href: 'mailto:hello@cosmoklub.space' } ] },
        { title: 'Legal', links: [
          { text: 'Terms of Service', href: '../index.html#tos' },
          { text: 'Privacy Policy', href: '../index.html#privacy' },
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
    document.title = 'CosmoKlub: ' + this.persona.name;
    document.addEventListener('click', e => {
      if (!e.target.closest('.nav-has-menu')) this.openMenu = null;
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') this.openMenu = null;
    });
    document.addEventListener('contextmenu', e => {
      if (e.target && e.target.tagName === 'IMG') e.preventDefault();
    });
    document.addEventListener('dragstart', e => {
      if (e.target && e.target.tagName === 'IMG') e.preventDefault();
    });
    if (window.CosmoKlub && window.CosmoKlub.initStarfield) {
      window.CosmoKlub.initStarfield(160);
    }
  }
}).mount('#app');
