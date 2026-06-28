// CosmoKlub — Object Library page logic.
//
// Every NASA request goes through our own /api/nasa proxy (see
// functions/api/nasa.js) so the real API key stays server-side as a
// Cloudflare Pages environment secret. Nothing here ever sees the key.

const { createApp } = Vue;

const PROXY = '/api/nasa';

const MARS_CAMERAS = {
  curiosity:     ['FHAZ', 'RHAZ', 'MAST', 'CHEMCAM', 'MAHLI', 'MARDI', 'NAVCAM'],
  perseverance:  ['EDL_RUCAM', 'EDL_RDCAM', 'EDL_DDCAM', 'EDL_PUCAM1', 'EDL_PUCAM2', 'NAVCAM_LEFT', 'NAVCAM_RIGHT', 'MCZ_RIGHT', 'MCZ_LEFT', 'FRONT_HAZCAM_LEFT_A', 'FRONT_HAZCAM_RIGHT_A', 'REAR_HAZCAM_LEFT', 'REAR_HAZCAM_RIGHT', 'SKYCAM', 'SHERLOC_WATSON'],
  opportunity:   ['FHAZ', 'RHAZ', 'NAVCAM', 'PANCAM', 'MINITES'],
  spirit:        ['FHAZ', 'RHAZ', 'NAVCAM', 'PANCAM', 'MINITES'],
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function daysAgoISO(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

// Turns a failed fetch/response into a consistent, friendly message —
// callers just do: throw new ProxyError(res) and catch it below, or call
// this directly with a caught error/response.
function friendlyError(status, fallbackLabel) {
  if (status === 429) {
    return "NASA API rate limit reached. Wait a few minutes and try again.";
  }
  if (status >= 500) {
    return "NASA's servers are having trouble right now. Try again shortly.";
  }
  return `${fallbackLabel} (${status})`;
}

createApp({
  data() {
    return {
      tab: 'search',
      todayStr: todayISO(),

      // Nav state — mirrors the main page's nav (logo, links, language switcher)
      mobileMenuOpen: false,
      langOpen: false,
      navScrolled: false,
      currentLang: { code: 'EN', name: 'English', flag: '🇬🇧' },
      langs: [
        { code: 'EN', name: 'English', flag: '🇬🇧' },
        { code: 'ES', name: 'Español', flag: '🇪🇸' },
        { code: 'FR', name: 'Français', flag: '🇫🇷' },
        { code: 'JA', name: '日本語', flag: '🇯🇵' },
        { code: 'TH', name: 'ภาษาไทย', flag: '🇹🇭' },
      ],

      search: { q: '', items: [], page: 1, total: 0, hasMore: false, loading: false, loadingMore: false, error: '' },

      apod: { date: todayISO(), data: null, loading: false, error: '' },

      neo: { items: [], startDate: '2026-07-04', endDate: '2026-07-10', selected: null, loading: false, error: '' },

      mars: { rover: 'curiosity', camera: '', photos: [], loading: false, error: '' },

      epic: { items: [], date: '', loading: false, error: '' },

      detail: { open: false, loading: false, data: null },
    };
  },

  computed: {
    marsCamerasForRover() {
      return MARS_CAMERAS[this.mars.rover] || [];
    },
  },

  watch: {
    tab(newTab) {
      // Lazy-load each tab's data the first time it's opened.
      if (newTab === 'apod' && !this.apod.data) this.loadApod();
      if (newTab === 'neo' && this.neo.items.length === 0) this.loadNeo();
      if (newTab === 'mars' && this.mars.photos.length === 0) this.loadMars();
      if (newTab === 'epic' && this.epic.items.length === 0) this.loadEpic();
    },
  },

  mounted() {
    this.loadApod();
    this.initStarfield();
    window.addEventListener('scroll', () => { this.navScrolled = window.scrollY > 20; }, { passive: true });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.lang-wrap')) this.langOpen = false;
    });
  },

  methods: {
    setLang(l) { this.currentLang = l; this.langOpen = false; },

    // ---------------------------------------------------------------- utils
    formatKm(n) {
      const num = parseFloat(n);
      if (Number.isNaN(num)) return n;
      return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
    },
    formatDate(iso) {
      try {
        return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
      } catch {
        return iso;
      }
    },
    openImageUrl(url) {
      if (url) window.open(url, '_blank', 'noopener');
    },

    // --------------------------------------------------- Image/Video Library
    async runSearch(loadMore = false) {
      if (!this.search.q.trim() && !loadMore) {
        this.search.error = 'Type something to search for: a planet, mission, telescope, anything.';
        return;
      }
      this.search.error = '';
      if (!loadMore) {
        // Initial search: clear results and show full-screen spinner
        this.search.loading    = true;
        this.search.loadingMore = false;
        this.search.page  = 1;
        this.search.items = [];
        this.search.total = 0;
        this.search.hasMore = false;
      } else {
        // Pagination: keep existing grid on screen, show inline spinner only
        this.search.loadingMore = true;
        this.search.page += 1;
      }

      try {
        const url = `${PROXY}?endpoint=images_search&q=${encodeURIComponent(this.search.q)}&media_type=image&page=${this.search.page}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(friendlyError(res.status, 'Search failed'));
        const data = await res.json();

        const items = (data.collection?.items || []).map((it) => {
          const d = it.data?.[0] || {};
          return {
            nasa_id: d.nasa_id,
            title: d.title,
            dateStr: d.date_created ? this.formatDate(d.date_created) : '',
            center: d.center,
            description: d.description,
            keywords: d.keywords,
            date_created: d.date_created,
            thumb: it.links?.find(l => l.rel === 'preview')?.href || null,
          };
        });

        this.search.items = loadMore ? this.search.items.concat(items) : items;
        this.search.total = data.collection?.metadata?.total_hits || items.length;
        this.search.hasMore = items.length > 0 && this.search.items.length < this.search.total;
      } catch (e) {
        this.search.error = e.message || "Couldn't reach the NASA image library.";
      }
      this.search.loading    = false;
      this.search.loadingMore = false;
    },

    async openImageItem(item) {
      this.detail.open = true;
      this.detail.loading = true;
      this.detail.data = null;
      try {
        const res = await fetch(`${PROXY}?endpoint=images_asset&nasa_id=${encodeURIComponent(item.nasa_id)}`);
        const data = await res.json();
        const assets = data.collection?.items?.map(i => i.href) || [];
        const hiRes = assets.find(a => /orig|large/i.test(a)) || assets[0];
        this.detail.data = {
          title: item.title,
          description: item.description,
          date_created: item.date_created,
          center: item.center,
          nasa_id: item.nasa_id,
          keywords: item.keywords || [],
          image: item.thumb,
          hiResUrl: hiRes,
        };
      } catch {
        this.detail.data = { ...item, image: item.thumb, hiResUrl: null };
      }
      this.detail.loading = false;
    },

    // ----------------------------------------------------------------- APOD
    async loadApod() {
      this.apod.loading = true;
      this.apod.error = '';
      try {
        const res = await fetch(`${PROXY}?endpoint=apod&date=${this.apod.date}`);
        if (!res.ok) throw new Error(friendlyError(res.status, 'APOD request failed'));
        this.apod.data = await res.json();
      } catch (e) {
        this.apod.error = e.message || "Couldn't load the picture of the day.";
      }
      this.apod.loading = false;
    },
    randomApod() {
      // APOD has existed since 1995-06-16.
      const start = new Date('1995-06-16').getTime();
      const end = Date.now();
      const randomTime = start + Math.random() * (end - start);
      this.apod.date = new Date(randomTime).toISOString().slice(0, 10);
      this.loadApod();
    },

    // ------------------------------------------------------ Near Earth Objects
    async loadNeo() {
      this.neo.loading = true;
      this.neo.error = '';
      const start = '2026-07-04';
      const end = (() => {
        const d = new Date('2026-07-04');
        d.setDate(d.getDate() + 6);
        return d.toISOString().slice(0, 10);
      })();
      this.neo.startDate = start;
      this.neo.endDate = end;
      try {
        const res = await fetch(`${PROXY}?endpoint=neo_feed&start_date=${start}&end_date=${end}`);
        if (!res.ok) throw new Error(friendlyError(res.status, 'NEO request failed'));
        const data = await res.json();
        const all = Object.values(data.near_earth_objects || {}).flat();
        // De-dupe (same object can appear on multiple close-approach days)
        // and sort by closest upcoming approach distance.
        const seen = new Map();
        all.forEach(o => { if (!seen.has(o.id)) seen.set(o.id, o); });
        this.neo.items = Array.from(seen.values()).sort((a, b) => {
          const da = parseFloat(a.close_approach_data?.[0]?.miss_distance?.kilometers || Infinity);
          const db = parseFloat(b.close_approach_data?.[0]?.miss_distance?.kilometers || Infinity);
          return da - db;
        });
      } catch (e) {
        this.neo.error = e.message || "Couldn't load near-Earth object data.";
      }
      this.neo.loading = false;
    },

    // --------------------------------------------------------- Mars Rover Photos
    async loadMars() {
      this.mars.loading = true;
      this.mars.error = '';
      this.mars.photos = [];
      try {
        // latest_photos gives the most recent sol without needing to know it ahead of time
        let url = `${PROXY}?endpoint=mars_latest&rover=${this.mars.rover}`;
        if (this.mars.camera) url += `&camera=${this.mars.camera}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(friendlyError(res.status, 'Mars rover request failed'));
        const data = await res.json();
        let photos = data.latest_photos || [];
        if (this.mars.camera) {
          photos = photos.filter(p => p.camera.name === this.mars.camera);
        }
        this.mars.photos = photos.slice(0, 40);
      } catch (e) {
        this.mars.error = e.message || "Couldn't load rover photos.";
      }
      this.mars.loading = false;
    },

    // ------------------------------------------------------------- EPIC Earth
    async loadEpic() {
      this.epic.loading = true;
      this.epic.error = '';
      try {
        const res = await fetch(`${PROXY}?endpoint=epic_natural`);
        if (!res.ok) throw new Error(friendlyError(res.status, 'EPIC request failed'));
        const data = await res.json();
        const items = (data || []).slice(0, 12).map(img => {
          const [date] = img.date.split(' ');
          const [y, m, d] = date.split('-');
          const url = `${PROXY}?endpoint=epic_image&collection=natural&year=${y}&month=${m}&day=${d}&image=${encodeURIComponent(img.image)}`;
          return {
            identifier: img.identifier,
            caption: img.caption,
            date: img.date,
            thumbUrl: url,
            fullUrl: url,
          };
        });
        this.epic.items = items;
        this.epic.date = items[0]?.date?.split(' ')[0] || '';
      } catch (e) {
        this.epic.error = e.message || "Couldn't load Earth imagery.";
      }
      this.epic.loading = false;
    },

    // -------------------------------------------------------------- starfield
    initStarfield() {
      const canvas = document.getElementById('star-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      let stars = [];
      const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        stars = Array.from({ length: 200 }, () => ({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.3 + 0.2,
          o: Math.random() * 0.75 + 0.1,
          s: Math.random() * 0.0025 + 0.001,
          t: Math.random() * Math.PI * 2,
        }));
      };
      resize();
      window.addEventListener('resize', resize);
      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(s => {
          s.t += s.s;
          const a = s.o * (0.5 + 0.5 * Math.sin(s.t));
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(196,168,255,${a})`;
          ctx.fill();
        });
        requestAnimationFrame(draw);
      };
      draw();
    },
  },
}).mount('#object-app');
