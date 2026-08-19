const { createApp } = Vue;

const PROXY = '/api/nasa';
const PAGE_SIZE = 12;

const ICONS = {
  forum: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8A8.5 8.5 0 0 1 21 11.5z"/></svg>`,
  book: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  chart: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  server: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="7" rx="2"/><rect x="2" y="14" width="20" height="7" rx="2"/><line x1="6" y1="6.5" x2="6.01" y2="6.5"/><line x1="6" y1="17.5" x2="6.01" y2="17.5"/></svg>`,
  cap: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/></svg>`,
  users: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg>`,
  telescope: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`
};

function tidyDate(raw) {
  if (!raw) return '';
  const d = new Date(raw);
  if (isNaN(d)) return raw;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function trim(text, max) {
  if (!text) return '';
  const clean = String(text).replace(/\s+/g, ' ').trim();
  return clean.length > max ? clean.slice(0, max).trimEnd() + '…' : clean;
}

createApp({
  data() {
    return {
      mobileMenuOpen: false,
      openMenu: null,

      apod: null,
      apodLoading: true,
      apodError: '',
      apodImgReady: false,
      apodImgFailed: false,

      query: '',
      activeQuery: '',
      feed: [],
      feedLoading: true,
      feedError: '',
      page: 1,
      totalHits: 0,
      rights: 'All rights reserved.',
      mediaType: 'image',
      dateFrom: '',
      dateTo: '',
      loadingMore: false,
      moreClicks: 0
    };
  },
  computed: {
    mediaTypes() {
      return [
        { key: 'image', label: 'Images' },
        { key: 'video', label: 'Video' },
        { key: 'audio', label: 'Audio' }
      ];
    },
    hasDateFilter() {
      return !!(this.dateFrom || this.dateTo);
    },
    dateSummary() {
      if (!this.hasDateFilter) return '';
      const f = this.dateFrom ? tidyDate(this.dateFrom) : 'the earliest records';
      const t = this.dateTo ? tidyDate(this.dateTo) : 'today';
      return f + ' to ' + t;
    },
    canLoadMore() {
      // two extra pages per search keeps the list manageable
      return this.feed.length < this.totalHits && this.moreClicks < 2;
    },
    footerCols() {
      return [
        {
          title: 'Platform',
          links: [
            { text: 'Object Browser', href: 'object.html' },
            { text: 'Astronomy Picture', href: 'object.html' },
            { text: 'Media Gallery', href: 'object.html' },
            { text: '3D Planetarium', href: 'object.html' }
          ]
        },
        {
          title: 'Explore',
          links: [
            { text: 'Lessons', href: 'lesson.html' },
            { text: 'Roadmap', href: 'roadmap.html' },
            { text: 'Dashboard', href: 'dashboard.html' },
            { text: 'Function Grapher', href: 'object.html' }
          ]
        },
        {
          title: 'Company',
          links: [
            { text: 'Our Team', href: 'team.html' },
            { text: 'Apply as Staff', href: 'staff-application.html' },
            { text: 'Community', href: '#' },
            { text: 'Contact', href: 'mailto:hello@cosmoklub.space' }
          ]
        },
        {
          title: 'Legal',
          links: [
            { text: 'Terms of Service', href: 'index.html#tos' },
            { text: 'Privacy Policy', href: 'index.html#privacy' },
            { text: 'Community Guidelines', href: '#' },
            { text: 'Cookie Policy', href: '#' }
          ]
        }
      ];
    },
    navMenus() {
      return {
        tools: {
          label: 'Tools for exploring the sky',
          items: [
            { title: 'Forum', desc: 'Ask questions and share observations with other members.', href: 'object.html', icon: ICONS.forum },
            { title: 'Library', desc: 'Browse NASA images, media and mission archives.', href: 'object.html', icon: ICONS.book },
            { title: 'Calculator & Graphing', desc: 'Plot functions and run astronomical calculations.', href: 'object.html', icon: ICONS.chart },
            { title: 'Community Server', desc: 'Join the live chat and observation sessions.', href: 'object.html', icon: ICONS.server }
          ]
        },
        usecases: {
          label: 'User personas',
          items: [
            { title: 'Student', desc: 'Follow guided lessons and track your progress.', href: 'usecases/student.html', icon: ICONS.cap },
            { title: 'Professor', desc: 'Build courses and monitor your class in one place.', href: 'usecases/professor.html', icon: ICONS.users },
            { title: 'Tutor', desc: 'Run sessions and share material with your learners.', href: 'usecases/tutor.html', icon: ICONS.chart },
            { title: 'Hobbyist', desc: 'Plan observations and log what you find in the sky.', href: 'usecases/hobbyist.html', icon: ICONS.telescope }
          ]
        }
      };
    }
  },
  methods: {
    toggleMenu(key) { this.openMenu = this.openMenu === key ? null : key; },
    closeMenu() { this.openMenu = null; },

    async loadApod() {
      this.apodLoading = true;
      this.apodError = '';
      this.apodImgReady = false;
      this.apodImgFailed = false;
      try {
        const r = await fetch(`${PROXY}?endpoint=apod`);
        if (!r.ok) throw new Error('NASA returned ' + r.status);
        const d = await r.json();
        const item = Array.isArray(d) ? d[0] : d;
        this.apod = {
          title: item.title || 'Astronomy Picture of the Day',
          summary: trim(item.explanation, 420),
          image: item.media_type === 'video' ? item.url : (item.url || item.hdurl),
          full: item.hdurl || item.url,
          // apod.nasa.gov sends X-Frame-Options, so its own pages cannot be
          // iframed ("refused to connect"). Only embed hosts that allow it.
          mediaType: item.media_type === 'video'
            ? (/youtube\.com|youtu\.be|vimeo\.com|player\./i.test(item.url || '') ? 'video' : 'link')
            : 'image',
          date: tidyDate(item.date),
          credit: item.copyright ? item.copyright.replace(/\n/g, ' ').trim() : 'NASA',
          link: 'https://apod.nasa.gov/apod/astropix.html'
        };
      } catch (err) {
        this.apodError = 'Could not load today’s picture (' + err.message + ').';
      } finally {
        this.apodLoading = false;
      }
    },

    async loadFeed(reset = true) {
      // keep the existing cards on screen while appending, otherwise the list
      // collapses to skeletons and the page jumps back to the top
      if (reset) {
        this.feedLoading = true;
        this.page = 1;
        this.feed = [];
        this.moreClicks = 0;
      } else {
        this.loadingMore = true;
      }
      this.feedError = '';

      const q = this.activeQuery || 'nebula galaxy mission';
      try {
        let url = `${PROXY}?endpoint=images_search&q=${encodeURIComponent(q)}` +
                  `&media_type=${encodeURIComponent(this.mediaType)}` +
                  `&page=${this.page}&page_size=${PAGE_SIZE}`;
        // NASA only filters by year, so send the year window and narrow to the
        // exact days client-side below
        if (this.dateFrom) url += `&year_start=${this.dateFrom.slice(0, 4)}`;
        if (this.dateTo)   url += `&year_end=${this.dateTo.slice(0, 4)}`;

        const r = await fetch(url);
        if (!r.ok) throw new Error('NASA returned ' + r.status);
        const d = await r.json();
        const coll = (d && d.collection) || {};
        this.totalHits = coll.metadata ? coll.metadata.total_hits : 0;

        const mapped = (coll.items || [])
          .map(it => {
            const meta = (it.data && it.data[0]) || {};
            const link = (it.links || []).find(l => l.render === 'image') || (it.links || [])[0];
            const thumb = link && link.href
              ? link.href
                  .replace(/~orig\.(jpg|png)$/i, '~thumb.$1')
                  .replace(/~large\.(jpg|png)$/i, '~thumb.$1')
                  .replace(/~medium\.(jpg|png)$/i, '~thumb.$1')
              : '';
            return {
              id: meta.nasa_id || (link && link.href) || Math.random().toString(36),
              title: trim(meta.title, 90) || 'Untitled',
              summary: trim(meta.description, 180),
              image: thumb,
              kind: meta.media_type || this.mediaType,
              date: tidyDate(meta.date_created),
              raw: meta.date_created || '',
              center: meta.center || '',
              ready: false,
              failed: !thumb,
              link: 'https://images.nasa.gov/details/' + encodeURIComponent(meta.nasa_id || '')
            };
          });

        // exact-day narrowing that the API cannot do itself
        const from = this.dateFrom ? new Date(this.dateFrom + 'T00:00:00') : null;
        const to   = this.dateTo   ? new Date(this.dateTo   + 'T23:59:59') : null;
        const inRange = mapped.filter(it => {
          if (!from && !to) return true;
          if (!it.raw) return false;
          const d = new Date(it.raw);
          if (isNaN(d)) return false;
          if (from && d < from) return false;
          if (to && d > to) return false;
          return true;
        });

        this.feed = reset ? inRange : this.feed.concat(inRange);
      } catch (err) {
        this.feedError = 'Could not reach the NASA library (' + err.message + ').';
      } finally {
        this.feedLoading = false;
        this.loadingMore = false;
      }
    },
    setMediaType(key) {
      if (this.mediaType === key) return;
      this.mediaType = key;
      this.loadFeed(true);
    },
    applyDates() {
      // guard against a reversed range
      if (this.dateFrom && this.dateTo && this.dateFrom > this.dateTo) {
        const t = this.dateFrom;
        this.dateFrom = this.dateTo;
        this.dateTo = t;
      }
      this.loadFeed(true);
    },
    clearDates() {
      if (!this.dateFrom && !this.dateTo) return;
      this.dateFrom = '';
      this.dateTo = '';
      this.loadFeed(true);
    },
    runSearch() {
      this.activeQuery = this.query.trim();
      this.loadFeed(true);
    },
    clearSearch() {
      this.query = '';
      this.activeQuery = '';
      this.mediaType = 'image';
      this.dateFrom = '';
      this.dateTo = '';
      this.loadFeed(true);
    },
    loadMore() {
      if (!this.canLoadMore) return;
      this.page += 1;
      this.moreClicks += 1;
      this.loadFeed(false);
    }
  },
  mounted() {
    this.loadApod();
    this.loadFeed(true);

    document.addEventListener('click', e => {
      if (!e.target.closest('.nav-has-menu')) this.openMenu = null;
    });
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      this.openMenu = null;
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
