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

// Solar System Object Catalog — a static, curated list of notable moons per
// planet. This is deliberately NOT a live API feed: moon orbits don't change
// week to week, so there's no need to burn a NASA request (or tie the page
// to a date range) just to show what's already settled astronomy. distanceKm
// is the moon's average distance from its parent planet — i.e. "closeness" —
// and entries are pre-sorted ascending by that distance within each planet.
const SOLAR_MOONS = [
  // Earth
  { id: 'moon', name: 'The Moon', parent: 'Earth', distanceKm: 384400, diameterKm: 3474.8, orbitalPeriodDays: 27.3, discovered: 'Known since antiquity', note: "Earth's only natural satellite, and the fifth-largest moon in the solar system." },
  // Mars
  { id: 'phobos', name: 'Phobos', parent: 'Mars', distanceKm: 9376, diameterKm: 22.2, orbitalPeriodDays: 0.32, discovered: 'Asaph Hall, 1877', note: 'Orbits so close and fast that it crosses the Martian sky three times a day.' },
  { id: 'deimos', name: 'Deimos', parent: 'Mars', distanceKm: 23463, diameterKm: 12.4, orbitalPeriodDays: 1.26, discovered: 'Asaph Hall, 1877', note: "The smaller and more distant of Mars's two moons." },
  // Jupiter — the four Galilean moons
  { id: 'io', name: 'Io', parent: 'Jupiter', distanceKm: 421700, diameterKm: 3643.2, orbitalPeriodDays: 1.77, discovered: 'Galileo Galilei, 1610', note: 'The most volcanically active body in the solar system.' },
  { id: 'europa', name: 'Europa', parent: 'Jupiter', distanceKm: 671100, diameterKm: 3121.6, orbitalPeriodDays: 3.55, discovered: 'Galileo Galilei, 1610', note: 'An icy shell likely hides a global ocean of liquid water underneath.' },
  { id: 'ganymede', name: 'Ganymede', parent: 'Jupiter', distanceKm: 1070400, diameterKm: 5268.2, orbitalPeriodDays: 7.15, discovered: 'Galileo Galilei, 1610', note: 'The largest moon in the solar system — bigger than the planet Mercury.' },
  { id: 'callisto', name: 'Callisto', parent: 'Jupiter', distanceKm: 1882700, diameterKm: 4820.6, orbitalPeriodDays: 16.69, discovered: 'Galileo Galilei, 1610', note: 'One of the most heavily cratered surfaces in the solar system.' },
  // Saturn
  { id: 'mimas', name: 'Mimas', parent: 'Saturn', distanceKm: 185540, diameterKm: 396.4, orbitalPeriodDays: 0.94, discovered: 'William Herschel, 1789', note: 'Its giant Herschel crater gives it a "Death Star" look.' },
  { id: 'enceladus', name: 'Enceladus', parent: 'Saturn', distanceKm: 238040, diameterKm: 504.2, orbitalPeriodDays: 1.37, discovered: 'William Herschel, 1789', note: 'Geysers at its south pole spray water-ice plumes into space.' },
  { id: 'tethys', name: 'Tethys', parent: 'Saturn', distanceKm: 294670, diameterKm: 1062, orbitalPeriodDays: 1.89, discovered: 'Giovanni Domenico Cassini, 1684', note: 'Almost entirely made of water ice.' },
  { id: 'dione', name: 'Dione', parent: 'Saturn', distanceKm: 377420, diameterKm: 1122.8, orbitalPeriodDays: 2.74, discovered: 'Giovanni Domenico Cassini, 1684', note: 'Wispy bright streaks across its surface are actually ice cliffs.' },
  { id: 'rhea', name: 'Rhea', parent: 'Saturn', distanceKm: 527070, diameterKm: 1527.6, orbitalPeriodDays: 4.52, discovered: 'Giovanni Domenico Cassini, 1672', note: "Saturn's second-largest moon." },
  { id: 'titan', name: 'Titan', parent: 'Saturn', distanceKm: 1221870, diameterKm: 5149.5, orbitalPeriodDays: 15.95, discovered: 'Christiaan Huygens, 1655', note: "Saturn's largest moon, with a thick atmosphere and lakes of liquid methane." },
  { id: 'iapetus', name: 'Iapetus', parent: 'Saturn', distanceKm: 3560820, diameterKm: 1469, orbitalPeriodDays: 79.3, discovered: 'Giovanni Domenico Cassini, 1671', note: 'One hemisphere is bright ice, the other dark as coal.' },
  // Uranus
  { id: 'miranda', name: 'Miranda', parent: 'Uranus', distanceKm: 129390, diameterKm: 471.6, orbitalPeriodDays: 1.41, discovered: 'Gerard Kuiper, 1948', note: 'Home to some of the tallest known cliffs in the solar system.' },
  { id: 'ariel', name: 'Ariel', parent: 'Uranus', distanceKm: 190900, diameterKm: 1157.8, orbitalPeriodDays: 2.52, discovered: 'William Lassell, 1851', note: "The brightest of Uranus's major moons." },
  { id: 'umbriel', name: 'Umbriel', parent: 'Uranus', distanceKm: 266000, diameterKm: 1169.4, orbitalPeriodDays: 4.14, discovered: 'William Lassell, 1851', note: 'One of the darkest moons in the solar system.' },
  { id: 'titania', name: 'Titania', parent: 'Uranus', distanceKm: 436300, diameterKm: 1576.8, orbitalPeriodDays: 8.71, discovered: 'William Herschel, 1787', note: "Uranus's largest moon." },
  { id: 'oberon', name: 'Oberon', parent: 'Uranus', distanceKm: 583500, diameterKm: 1522.8, orbitalPeriodDays: 13.46, discovered: 'William Herschel, 1787', note: 'The outermost of the major Uranian moons.' },
  // Neptune
  { id: 'triton', name: 'Triton', parent: 'Neptune', distanceKm: 354800, diameterKm: 2706.8, orbitalPeriodDays: 5.88, discovered: 'William Lassell, 1846', note: 'Orbits backwards (retrograde) and has active nitrogen geysers.' },
  { id: 'nereid', name: 'Nereid', parent: 'Neptune', distanceKm: 5513400, diameterKm: 340, orbitalPeriodDays: 360.1, discovered: 'Gerard Kuiper, 1949', note: 'One of the most eccentric, elongated orbits of any moon.' },
];

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

      search: { q: '', items: [], page: 1, total: 0, hasMore: false, loading: false, loadingMore: false, error: '', mediaTypes: { image: false, video: false, audio: false } },

      searchFilters: [
        { label: 'Images', value: 'image' },
        { label: 'Video', value: 'video' },
        { label: 'Audio', value: 'audio' },
      ],

      apod: { date: todayISO(), data: null, loading: false, error: '', imgLoaded: false, yearScope: 'all' },

      neo: { items: SOLAR_MOONS, selected: null, bodyFilter: 'all' },

      neoBodies: [
        { label: 'All', value: 'all' },
        { label: '☿ Mercury', value: 'Mercury' },
        { label: '♀ Venus', value: 'Venus' },
        { label: '🌍 Earth', value: 'Earth' },
        { label: '♂ Mars', value: 'Mars' },
        { label: '♃ Jupiter', value: 'Jupiter' },
        { label: '♄ Saturn', value: 'Saturn' },
        { label: '⛢ Uranus', value: 'Uranus' },
        { label: '♆ Neptune', value: 'Neptune' },
      ],

      mars: { rover: 'curiosity', camera: '', photos: [], loading: false, error: '' },

      epic: { items: [], date: '', loading: false, error: '' },

      detail: { open: false, loading: false, data: null, descExpanded: false },
    };
  },

  computed: {
    marsCamerasForRover() {
      return MARS_CAMERAS[this.mars.rover] || [];
    },
    // Which media-type checkboxes are ticked. Empty array = no filter = all results.
    activeMediaTypes() {
      return Object.keys(this.search.mediaTypes).filter(k => this.search.mediaTypes[k]);
    },
    // Short preview of the audio item's description, expanded via "Read full description".
    truncatedDescription() {
      const d = (this.detail.data && this.detail.data.description) || '';
      if (d.length <= 220) return d;
      return d.slice(0, 220).trimEnd() + '…';
    },
    filteredNeoItems() {
      if (this.neo.bodyFilter === 'all') return this.neo.items;
      return this.neo.items.filter(obj => obj.parent === this.neo.bodyFilter);
    },
    totalCatalogObjects() {
      return this.neo.items.length;
    },
  },

  watch: {
    tab(newTab) {
      // Lazy-load each tab's data the first time it's opened.
      if (newTab === 'apod' && !this.apod.data) this.loadApod();
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
    stripHtml(str) {
      if (!str) return '';
      // Remove all HTML tags, collapse whitespace
      return str.replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
    },
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
        const checked = this.activeMediaTypes;
        const mediaType = checked.length ? `&media_type=${checked.join(',')}` : '';
        const url = `${PROXY}?endpoint=images_search&q=${encodeURIComponent(this.search.q)}${mediaType}&page=${this.search.page}`;
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
            description: this.stripHtml(d.description),
            keywords: d.keywords,
            date_created: d.date_created,
            media_type: d.media_type,
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
      this.detail.descExpanded = false;
      try {
        const res = await fetch(`${PROXY}?endpoint=images_asset&nasa_id=${encodeURIComponent(item.nasa_id)}`);
        const data = await res.json();
        const assets = data.collection?.items?.map(i => i.href) || [];
        const audioUrl = assets.find(a => /\.(mp3|wav|ogg|m4a|flac)$/i.test(a));
        const hiRes = assets.find(a => /orig|large/i.test(a)) || assets[0];
        this.detail.data = {
          title: item.title,
          description: this.stripHtml(item.description),
          date_created: item.date_created,
          center: item.center,
          nasa_id: item.nasa_id,
          keywords: item.keywords || [],
          image: item.thumb,
          hiResUrl: hiRes,
          media_type: item.media_type,
          audioUrl: audioUrl || null,
        };
      } catch {
        this.detail.data = { ...item, image: item.thumb, hiResUrl: null, media_type: item.media_type, audioUrl: null };
      }
      this.detail.loading = false;
    },

    // ----------------------------------------------------------------- APOD
    async loadApod() {
      this.apod.loading = true;
      this.apod.error = '';
      this.apod.imgLoaded = false;
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
      const APOD_START = '1995-06-16';
      const scopeMap = {
        all:  [APOD_START,   null],
        1995: [APOD_START,   '1999-12-31'],
        2000: ['2000-01-01', '2009-12-31'],
        2010: ['2010-01-01', '2019-12-31'],
        2020: ['2020-01-01', null],
      };
      const [startStr, endStr] = scopeMap[this.apod.yearScope] || scopeMap.all;
      const start = new Date(startStr).getTime();
      const end   = endStr ? new Date(endStr).getTime() : Date.now();
      const randomTime = start + Math.random() * (end - start);
      this.apod.date = new Date(randomTime).toISOString().slice(0, 10);
      this.loadApod();
    },

    // ----------------------------------------------- Solar System Object Catalog
    // Static data (see SOLAR_MOONS above) — no fetch, no date window needed.
    isClosestMoon(obj) {
      const siblings = this.neo.items.filter(o => o.parent === obj.parent);
      if (!siblings.length) return false;
      const minDist = Math.min(...siblings.map(o => o.distanceKm));
      return obj.distanceKm === minDist;
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
