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

      query: '',
      activeQuery: '',
      feed: [],
      feedLoading: true,
      feedError: '',
      page: 1,
      totalHits: 0
    };
  },
  computed: {
    canLoadMore() {
      return this.feed.length < this.totalHits;
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
            { title: 'Student', desc: 'Follow guided lessons and track your progress.', href: 'lesson.html', icon: ICONS.cap },
            { title: 'Professor', desc: 'Build courses and monitor your class in one place.', href: 'team.html', icon: ICONS.users },
            { title: 'Tutor', desc: 'Run sessions and share material with your learners.', href: 'team.html', icon: ICONS.chart },
            { title: 'Hobbyist', desc: 'Plan observations and log what you find in the sky.', href: 'roadmap.html', icon: ICONS.telescope }
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
      try {
        const r = await fetch(`${PROXY}?endpoint=apod`);
        if (!r.ok) throw new Error('NASA returned ' + r.status);
        const d = await r.json();
        const item = Array.isArray(d) ? d[0] : d;
        this.apod = {
          title: item.title || 'Astronomy Picture of the Day',
          summary: trim(item.explanation, 420),
          image: item.media_type === 'video' ? item.url : (item.hdurl || item.url),
          mediaType: item.media_type === 'video' ? 'video' : 'image',
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
      this.feedLoading = true;
      this.feedError = '';
      if (reset) {
        this.page = 1;
        this.feed = [];
      }
      const q = this.activeQuery || 'nebula galaxy mission';
      try {
        const url = `${PROXY}?endpoint=images_search&q=${encodeURIComponent(q)}` +
                    `&media_type=image&page=${this.page}&page_size=${PAGE_SIZE}`;
        const r = await fetch(url);
        if (!r.ok) throw new Error('NASA returned ' + r.status);
        const d = await r.json();
        const coll = (d && d.collection) || {};
        this.totalHits = coll.metadata ? coll.metadata.total_hits : 0;

        const mapped = (coll.items || [])
          .map(it => {
            const meta = (it.data && it.data[0]) || {};
            const link = (it.links || []).find(l => l.render === 'image') || (it.links || [])[0];
            if (!link || !link.href) return null;
            return {
              id: meta.nasa_id || link.href,
              title: trim(meta.title, 90) || 'Untitled',
              summary: trim(meta.description, 180),
              image: link.href,
              date: tidyDate(meta.date_created),
              center: meta.center || '',
              link: 'https://images.nasa.gov/details/' + encodeURIComponent(meta.nasa_id || '')
            };
          })
          .filter(Boolean);

        this.feed = reset ? mapped : this.feed.concat(mapped);
        if (!this.feed.length) this.feedError = 'Nothing found — try a different search.';
      } catch (err) {
        this.feedError = 'Could not reach the NASA image library (' + err.message + ').';
      } finally {
        this.feedLoading = false;
      }
    },

    runSearch() {
      this.activeQuery = this.query.trim();
      this.loadFeed(true);
    },
    clearSearch() {
      this.query = '';
      this.activeQuery = '';
      this.loadFeed(true);
    },
    loadMore() {
      this.page += 1;
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
