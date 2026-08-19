const { createApp } = Vue;

const I = {
  cap: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/></svg>`,
  users: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg>`,
  chart: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  scope: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  book: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  layers: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
  clock: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  forum: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8A8.5 8.5 0 0 1 21 11.5z"/></svg>`,
  server: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="7" rx="2"/><rect x="2" y="14" width="20" height="7" rx="2"/><line x1="6" y1="6.5" x2="6.01" y2="6.5"/><line x1="6" y1="17.5" x2="6.01" y2="17.5"/></svg>`
};

// Every image slot is intentionally empty — drop a path in and it renders.
const PERSONAS = {
  student: {
    key: 'student', name: 'Student', icon: I.cap,
    eyebrow: 'For students',
    title: 'Learn astronomy the way it is actually practised',
    lead: 'Follow a guided roadmap from first principles to real observation, with lessons, quizzes and progress tracking that keep you moving.',
    cta: 'Start learning free',
    heroImage: '',
    benefitsTitle: 'Built around how you study',
    benefits: [
      { icon: I.book, title: 'Guided roadmap', desc: 'Structured lessons that build on each other instead of scattered articles.' },
      { icon: I.chart, title: 'Progress tracking', desc: 'See exactly what you have covered and what comes next.' },
      { icon: I.scope, title: 'Real data', desc: 'Work with genuine NASA imagery and catalogues, not toy examples.' }
    ],
    panels: [
      { title: 'A roadmap that adapts to you',
        desc: 'Lessons unlock as you go, so you always know the next step rather than guessing where to start.',
        points: ['Foundation to expert stages', 'Quizzes after each section', 'Pick up exactly where you left off'],
        image: '' },
      { title: 'Practise with the real sky',
        desc: 'Browse the same object catalogues researchers use, then plan what to look for tonight.',
        points: ['22,000+ NASA images and media', 'Interactive 3D planetarium', 'Observation logbook'],
        image: '' }
    ]
  },
  professor: {
    key: 'professor', name: 'Professor', icon: I.users,
    eyebrow: 'For professors',
    title: 'Run your course and your class from one place',
    lead: 'Build structured material, publish it to your cohort, and see how everyone is progressing without stitching together five different tools.',
    cta: 'Set up your course',
    heroImage: '',
    benefitsTitle: 'Everything a teaching team needs',
    benefits: [
      { icon: I.layers, title: 'Course builder', desc: 'Assemble lessons, media and assessments into a coherent syllabus.' },
      { icon: I.users, title: 'Cohort management', desc: 'Group learners, set access, and track the whole class at a glance.' },
      { icon: I.chart, title: 'Analytics', desc: 'Spot where students stall so you can intervene early.' }
    ],
    panels: [
      { title: 'Publish once, teach many',
        desc: 'Write your material a single time and reuse it across cohorts and semesters.',
        points: ['Reusable lesson templates', 'Version your material', 'Bulk enrol by CSV'],
        image: '' },
      { title: 'See the whole class clearly',
        desc: 'Per-student and per-topic breakdowns show who needs help and which topics need rework.',
        points: ['Completion and score reporting', 'Per-topic difficulty signals', 'Export results'],
        image: '' }
    ]
  },
  tutor: {
    key: 'tutor', name: 'Tutor', icon: I.chart,
    eyebrow: 'For tutors',
    title: 'Run sharper sessions with material that is ready to go',
    lead: 'Bring a structured library into every session, share it with your learners, and keep track of what each one has covered.',
    cta: 'Start tutoring',
    heroImage: '',
    benefitsTitle: 'Made for one-to-one teaching',
    benefits: [
      { icon: I.clock, title: 'Session ready', desc: 'Pull up a topic and its visuals in seconds, mid-session.' },
      { icon: I.forum, title: 'Share instantly', desc: 'Send a lesson or an object view straight to your learner.' },
      { icon: I.scope, title: 'Visual explanations', desc: 'Use the 3D planetarium and grapher to show, not just tell.' }
    ],
    panels: [
      { title: 'A library you can teach straight from',
        desc: 'No prep scramble — the material, imagery and tools are already organised by topic.',
        points: ['Topic-indexed lessons', 'Function grapher for derivations', 'Real imagery for every object'],
        image: '' },
      { title: 'Keep each learner on track',
        desc: 'Track several learners separately so nobody repeats work or falls behind unnoticed.',
        points: ['Per-learner progress', 'Notes against each session', 'Shareable session links'],
        image: '' }
    ]
  },
  hobbyist: {
    key: 'hobbyist', name: 'Hobbyist', icon: I.scope,
    eyebrow: 'For hobbyists',
    title: 'Plan the night, then record what you actually saw',
    lead: 'Find what is visible from where you are, check the conditions, and keep a proper log of every session — no institution required.',
    cta: 'Start exploring free',
    heroImage: '',
    benefitsTitle: 'For observers, by observers',
    benefits: [
      { icon: I.scope, title: 'Observation planner', desc: 'What is up tonight for your location, telescope and weather.' },
      { icon: I.book, title: 'Logbook', desc: 'Record sessions, equipment, sketches and conditions.' },
      { icon: I.server, title: 'Community', desc: 'Compare notes with observers working on the same targets.' }
    ],
    panels: [
      { title: 'Know before you set up',
        desc: 'Moon phase, cloud cover, seeing and light pollution in one view, so a cold night is not wasted.',
        points: ['Location-aware visibility', 'Conditions forecast', 'Target suggestions for your gear'],
        image: '' },
      { title: 'Build a record worth keeping',
        desc: 'Every session logged and searchable, so your observing history becomes genuinely useful over time.',
        points: ['Equipment and conditions per entry', 'Sketches and photo attachments', 'Achievements as you progress'],
        image: '' }
    ]
  }
};

createApp({
  data() {
    // each page declares which persona it is via data-persona on #app;
    // the filename is a fallback so the pages still work if that is missing
    const el = document.getElementById('app');
    let key = (el && el.dataset.persona || '').toLowerCase();
    if (!PERSONAS[key]) {
      key = (window.location.pathname.split('/').pop() || '')
              .replace('.html', '').toLowerCase();
    }
    if (!PERSONAS[key]) key = 'student';
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
    personaList() { return Object.values(PERSONAS); },
    faqs() {
      return [
        { q: 'What is CosmoKlub and what features does it offer?',
          a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.' },
        { q: 'Do I need any technical background to get started?',
          a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' },
        { q: 'How long does it take to set everything up?',
          a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        { q: 'Can I import my existing data and content?',
          a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.' },
        { q: 'Is there a free trial, and how do I cancel?',
          a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur.' }
      ];
    },
    navMenus() {
      return {
        tools: {
          label: 'Tools for exploring the sky',
          items: [
            { title: 'Forum', desc: 'Ask questions and share observations with other members.', href: '../object.html', icon: I.forum },
            { title: 'Library', desc: 'Browse NASA images, media and mission archives.', href: '../object.html', icon: I.book },
            { title: 'Calculator & Graphing', desc: 'Plot functions and run astronomical calculations.', href: '../object.html', icon: I.chart },
            { title: 'Community Server', desc: 'Join the live chat and observation sessions.', href: '../object.html', icon: I.server }
          ]
        },
        usecases: {
          label: 'User personas',
          items: [
            { title: 'Student', desc: 'Follow guided lessons and track your progress.', href: 'student.html', icon: I.cap },
            { title: 'Professor', desc: 'Build courses and monitor your class in one place.', href: 'professor.html', icon: I.users },
            { title: 'Tutor', desc: 'Run sessions and share material with your learners.', href: 'tutor.html', icon: I.chart },
            { title: 'Hobbyist', desc: 'Plan observations and log what you find in the sky.', href: 'hobbyist.html', icon: I.scope }
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
