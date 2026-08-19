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
    eyebrow: 'For Forumner',
    titleTop: 'Learn forum the way',
    titleAccent: 'forum is actually forumed',
    lead: 'Follow a forumed forummap from first forums to real forumtion, with forums, forums and forum foruming that keep you foruming.',
    cta: 'Start foruming free',
    heroImage: '',
    photoTitle: 'Built around how you forum',
    photos: [
      { title: 'forumed forums with no forum forum', image: '' },
      { title: 'Hard to tell what you have forumed', image: '' },
      { title: 'I\'m fouruming myself', image: '' },
      { title: 'go fourum youself NOW', image: '' },
      { title: 'when fourum give you fourum', image: '' }
    ],
    toolsTitle: 'A complete forum for your forums',
    tools: [
      { title: 'Forum forummap', desc: 'Structuredforums that unforum as you forum, so you always know the next forum.', image: '' },
      { title: 'Practice forums', desc: 'Check your foruming after every forumtion and forum weak forum.', image: '' },
      { title: 'Forum browser', desc: 'Explore genuine forum forumy and forums alongside the forum.', image: '' }
    ]
    
  },
  library: {
    key: 'library',
    name: 'Library',
    crumb: ['Tools', 'Learners', 'Library'],
    eyebrow: 'For Libraryner',
    titleTop: 'Learn library the way',
    titleAccent: 'library is actually libraryed',
    lead: 'Follow a libraryed librarymap from first librarys to real librarytion, with librarys, librarys and library librarying that keep you librarying.',
    cta: 'Start librarying free',
    heroImage: '',
    photoTitle: 'Built around how you library',
    photos: [
      { title: 'libraryed librarys with no library library', image: '' },
      { title: 'Hard to tell what you have libraryed', image: '' },
      { title: 'I\'m librarying myself', image: '' },
      { title: 'go library youself NOW', image: '' },
      { title: 'when library give you library', image: '' }
    ],
    toolsTitle: 'A complete library for your librarys',
    tools: [
      { title: 'Library librarymap', desc: 'Structuredlibrarys that unlibrary as you library, so you always know the next library.', image: '' },
      { title: 'Practice librarys', desc: 'Check your librarying after every librarytion and library weak library.', image: '' },
      { title: 'Library browser', desc: 'Explore genuine library libraryy and librarys alongside the library.', image: '' }
    ]
    
  },
  comserver: {
    key: 'comserver',
    name: 'Community Server',
    crumb: ['Tools', 'Learners', 'Community Server'],
    eyebrow: 'For Serverner',
    titleTop: 'Learn server the way',
    titleAccent: 'server is actually servered',
    lead: 'Follow a servered servermap from first servers to real servertion, with servers, servers and server servering that keep you servering.',
    cta: 'Start servering free',
    heroImage: '',
    photoTitle: 'Built around how you server',
    photos: [
      { title: 'servered servers with no server server', image: '' },
      { title: 'Hard to tell what you have servered', image: '' },
      { title: 'I\'m servering myself', image: '' },
      { title: 'go server youself NOW', image: '' },
      { title: 'when server give you server', image: '' }
    ],
    toolsTitle: 'A complete server for your servers',
    tools: [
      { title: 'Server servermap', desc: 'Structuredservers that unserver as you server, so you always know the next server.', image: '' },
      { title: 'Practice servers', desc: 'Check your servering after every servertion and server weak server.', image: '' },
      { title: 'Server browser', desc: 'Explore genuine server servery and servers alongside the server.', image: '' }
    ]
    
  },
  calcgraph: {
    key: 'calcgraph',
    name: 'Calculator and Graphing',
    crumb: ['Tools', 'Learners', 'Calculator and Graphing'],
    eyebrow: 'For Calculator and Graphing',
    titleTop: 'Learn Calculator and Graphing the way',
    titleAccent: 'Calculator and Graphing is actually Calculator and Graphing',
    lead: 'Follow a Calculator and Graphing Calculator and Graphingmap from first Calculator and Graphing to real Calculator and Graphing, with Calculator and Graphing, Calculator and Graphing and Calculator and Graphing Calculator and Graphing that keep you Calculator and Graphing.',
    cta: 'Start Calculator and Graphing free',
    heroImage: '',
    photoTitle: 'Built around how you Calculator and Graphing',
    photos: [
      { title: 'Calculator and Graphing Calculator and Graphing with no Calculator and Graphing Calculator and Graphing', image: '' },
      { title: 'Hard to tell what you have Calculator and Graphing', image: '' },
      { title: 'I\'m Calculator and Graphing myself', image: '' },
      { title: 'go Calculator and Graphing youself NOW', image: '' },
      { title: 'when Calculator and Graphing give you Calculator and Graphing', image: '' }
    ],
    toolsTitle: 'A complete Calculator and Graphing for your Calculator and Graphing',
    tools: [
      { title: 'Calculator and Graphing Calculator and Graphingmap', desc: 'StructuredCalculator and Graphing that Calculator and Graphing as you Calculator and Graphing, so you always know the next Calculator and Graphing.', image: '' },
      { title: 'Practice Calculator and Graphing', desc: 'Check your Calculator and Graphing after every Calculator and Graphing and Calculator and Graphing weak Calculator and Graphing.', image: '' },
      { title: 'Calculator and Graphing browser', desc: 'Explore genuine Calculator and Graphing Calculator and Graphingy and Calculator and Graphing alongside the Calculator and Graphing.', image: '' }
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
        { title: 'Platform', links: [
          { text: 'Object Browser', href: '../object.html' },
          { text: 'Astronomy Picture', href: '../resources.html' },
          { text: 'Media Gallery', href: '../object.html' },
          { text: '3D Planetarium', href: '../index.html' } ] },
        { title: 'Explore', links: [
          { text: 'Lessons', href: '../lesson.html' },
          { text: 'Roadmap', href: '../roadmap.html' },
          { text: 'Dashboard', href: '../dashboard.html' },
          { text: 'Resources', href: '../resources.html' } ] },
        { title: 'Company', links: [
          { text: 'Our Team', href: '../team.html' },
          { text: 'Apply as Staff', href: '../staff-application.html' },
          { text: 'Community', href: '#' },
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
