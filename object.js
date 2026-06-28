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

// Solar System Object Catalog — expanded to cover every major category:
// planets, dwarf planets, notable asteroids, comets, and major moons.
// Every entry has wikiUrl and nasaUrl for "Learn more" links.
const SOLAR_CATALOG = [
  // ── PLANETS ────────────────────────────────────────────────────────────
  { id: 'mercury', name: 'Mercury', type: 'Planet', parent: 'Sun', distanceKm: 57900000, diameterKm: 4879, orbitalPeriodDays: 88, discovered: 'Known since antiquity', note: 'The smallest planet and closest to the Sun, with extreme temperature swings from -180 °C to 430 °C.', wikiUrl: 'https://en.wikipedia.org/wiki/Mercury_(planet)', nasaUrl: 'https://science.nasa.gov/mercury/' },
  { id: 'venus', name: 'Venus', type: 'Planet', parent: 'Sun', distanceKm: 108200000, diameterKm: 12104, orbitalPeriodDays: 225, discovered: 'Known since antiquity', note: 'The hottest planet (462 °C average), shrouded in thick clouds of sulfuric acid.', wikiUrl: 'https://en.wikipedia.org/wiki/Venus', nasaUrl: 'https://science.nasa.gov/venus/' },
  { id: 'earth', name: 'Earth', type: 'Planet', parent: 'Sun', distanceKm: 149600000, diameterKm: 12742, orbitalPeriodDays: 365.25, discovered: 'Known since antiquity', note: 'Our home — the only known planet to harbour life, with liquid water oceans covering 71% of its surface.', wikiUrl: 'https://en.wikipedia.org/wiki/Earth', nasaUrl: 'https://science.nasa.gov/earth/' },
  { id: 'mars-planet', name: 'Mars', type: 'Planet', parent: 'Sun', distanceKm: 227900000, diameterKm: 6779, orbitalPeriodDays: 687, discovered: 'Known since antiquity', note: 'The Red Planet, home to Olympus Mons — the tallest volcano in the solar system at 21 km.', wikiUrl: 'https://en.wikipedia.org/wiki/Mars', nasaUrl: 'https://science.nasa.gov/mars/' },
  { id: 'jupiter-planet', name: 'Jupiter', type: 'Planet', parent: 'Sun', distanceKm: 778500000, diameterKm: 139820, orbitalPeriodDays: 4333, discovered: 'Known since antiquity', note: 'The largest planet, with a Great Red Spot storm that has raged for over 350 years.', wikiUrl: 'https://en.wikipedia.org/wiki/Jupiter', nasaUrl: 'https://science.nasa.gov/jupiter/' },
  { id: 'saturn-planet', name: 'Saturn', type: 'Planet', parent: 'Sun', distanceKm: 1432000000, diameterKm: 116460, orbitalPeriodDays: 10759, discovered: 'Known since antiquity', note: 'Its iconic rings are made of ice and rock ranging from tiny grains to chunks as large as a house.', wikiUrl: 'https://en.wikipedia.org/wiki/Saturn', nasaUrl: 'https://science.nasa.gov/saturn/' },
  { id: 'uranus-planet', name: 'Uranus', type: 'Planet', parent: 'Sun', distanceKm: 2867000000, diameterKm: 50724, orbitalPeriodDays: 30589, discovered: 'William Herschel, 1781', note: 'Rotates on its side at 98° axial tilt, causing extreme 42-year-long seasons.', wikiUrl: 'https://en.wikipedia.org/wiki/Uranus', nasaUrl: 'https://science.nasa.gov/uranus/' },
  { id: 'neptune-planet', name: 'Neptune', type: 'Planet', parent: 'Sun', distanceKm: 4515000000, diameterKm: 49244, orbitalPeriodDays: 59800, discovered: 'Urbain Le Verrier & Johann Galle, 1846', note: 'The windiest planet — supersonic storms reach 2,100 km/h. Has one large retrograde moon, Triton.', wikiUrl: 'https://en.wikipedia.org/wiki/Neptune', nasaUrl: 'https://science.nasa.gov/neptune/' },

  // ── DWARF PLANETS ──────────────────────────────────────────────────────
  { id: 'pluto', name: 'Pluto', type: 'Dwarf Planet', parent: 'Sun', distanceKm: 5906000000, diameterKm: 2376, orbitalPeriodDays: 90560, discovered: 'Clyde Tombaugh, 1930', note: 'Reclassified as a dwarf planet in 2006. New Horizons revealed a heart-shaped nitrogen-ice plain in 2015.', wikiUrl: 'https://en.wikipedia.org/wiki/Pluto', nasaUrl: 'https://science.nasa.gov/pluto/' },
  { id: 'ceres', name: 'Ceres', type: 'Dwarf Planet', parent: 'Sun', distanceKm: 414000000, diameterKm: 945, orbitalPeriodDays: 1682, discovered: 'Giuseppe Piazzi, 1801', note: 'The largest object in the asteroid belt — bright salt deposits hint at a subsurface ocean.', wikiUrl: 'https://en.wikipedia.org/wiki/Ceres_(dwarf_planet)', nasaUrl: 'https://science.nasa.gov/dwarf-planets/ceres/' },
  { id: 'eris', name: 'Eris', type: 'Dwarf Planet', parent: 'Sun', distanceKm: 10210000000, diameterKm: 2326, orbitalPeriodDays: 204000, discovered: 'Mike Brown et al., 2005', note: 'More massive than Pluto and the catalyst that sparked the dwarf planet reclassification in 2006.', wikiUrl: 'https://en.wikipedia.org/wiki/Eris_(dwarf_planet)', nasaUrl: 'https://science.nasa.gov/dwarf-planets/eris/' },
  { id: 'makemake', name: 'Makemake', type: 'Dwarf Planet', parent: 'Sun', distanceKm: 6850000000, diameterKm: 1430, orbitalPeriodDays: 113165, discovered: 'Mike Brown et al., 2005', note: 'Named after the creator deity of the Rapa Nui people of Easter Island.', wikiUrl: 'https://en.wikipedia.org/wiki/Makemake', nasaUrl: 'https://science.nasa.gov/dwarf-planets/makemake/' },
  { id: 'haumea', name: 'Haumea', type: 'Dwarf Planet', parent: 'Sun', distanceKm: 6452000000, diameterKm: 1632, orbitalPeriodDays: 103774, discovered: 'Mike Brown et al., 2004', note: 'Spins so fast (once every 3.9 hours) that it has been squashed into an egg-like ellipsoid shape.', wikiUrl: 'https://en.wikipedia.org/wiki/Haumea', nasaUrl: 'https://science.nasa.gov/dwarf-planets/haumea/' },

  // ── NOTABLE ASTEROIDS ──────────────────────────────────────────────────
  { id: 'vesta', name: 'Vesta', type: 'Asteroid', parent: 'Asteroid Belt', distanceKm: 353400000, diameterKm: 525, orbitalPeriodDays: 1325, discovered: 'Heinrich Olbers, 1807', note: "The second-largest body in the asteroid belt, studied by NASA's Dawn spacecraft in 2011–2012.", wikiUrl: 'https://en.wikipedia.org/wiki/4_Vesta', nasaUrl: 'https://science.nasa.gov/solar-system/asteroids/4-vesta/' },
  { id: 'ryugu', name: 'Ryugu', type: 'Asteroid', parent: 'Sun', distanceKm: 226000000, diameterKm: 0.9, orbitalPeriodDays: 474, discovered: 'LINEAR survey, 1999', note: "Japan's Hayabusa2 mission returned 5.4 g of pristine samples from this carbon-rich near-Earth asteroid in 2020.", wikiUrl: 'https://en.wikipedia.org/wiki/162173_Ryugu', nasaUrl: 'https://science.nasa.gov/solar-system/asteroids/162173-ryugu/' },
  { id: 'bennu', name: 'Bennu', type: 'Asteroid', parent: 'Sun', distanceKm: 168000000, diameterKm: 0.49, orbitalPeriodDays: 437, discovered: 'LINEAR survey, 1999', note: "NASA's OSIRIS-REx mission collected a 121 g sample from this near-Earth asteroid in 2023.", wikiUrl: 'https://en.wikipedia.org/wiki/101955_Bennu', nasaUrl: 'https://science.nasa.gov/solar-system/asteroids/101955-bennu/' },

  // ── NOTABLE COMETS ─────────────────────────────────────────────────────
  { id: 'halley', name: "Halley's Comet", type: 'Comet', parent: 'Sun', distanceKm: 6000000000, diameterKm: 15, orbitalPeriodDays: 27507, discovered: 'Edmond Halley, 1705 (identified)', note: 'The most famous periodic comet, visible from Earth roughly every 75–76 years. Last perihelion: 1986.', wikiUrl: 'https://en.wikipedia.org/wiki/Halley%27s_Comet', nasaUrl: 'https://science.nasa.gov/solar-system/comets/1p-halley/' },
  { id: 'comet67p', name: '67P/Churyumov–Gerasimenko', type: 'Comet', parent: 'Sun', distanceKm: 500000000, diameterKm: 4, orbitalPeriodDays: 2389, discovered: 'Klim Churyumov & Svetlana Gerasimenko, 1969', note: "ESA's Rosetta mission orbited this duck-shaped comet for two years, deploying the Philae lander in 2014.", wikiUrl: 'https://en.wikipedia.org/wiki/67P/Churyumov%E2%80%93Gerasimenko', nasaUrl: 'https://science.nasa.gov/solar-system/comets/67p-churyumov-gerasimenko/' },

  // ── EARTH'S MOON ───────────────────────────────────────────────────────
  { id: 'the-moon', name: 'The Moon', type: 'Moon', parent: 'Earth', distanceKm: 384400, diameterKm: 3474.8, orbitalPeriodDays: 27.3, discovered: 'Known since antiquity', note: "Earth's only natural satellite — the fifth-largest moon in the solar system, and the only extraterrestrial body humans have walked on.", wikiUrl: 'https://en.wikipedia.org/wiki/Moon', nasaUrl: 'https://science.nasa.gov/moon/' },

  // ── MARS MOONS ─────────────────────────────────────────────────────────
  { id: 'phobos', name: 'Phobos', type: 'Moon', parent: 'Mars', distanceKm: 9376, diameterKm: 22.2, orbitalPeriodDays: 0.32, discovered: 'Asaph Hall, 1877', note: 'Orbits so close and fast that it crosses the Martian sky three times a day. Slowly spiralling inward.', wikiUrl: 'https://en.wikipedia.org/wiki/Phobos_(moon)', nasaUrl: 'https://science.nasa.gov/mars/moons/phobos/' },
  { id: 'deimos', name: 'Deimos', type: 'Moon', parent: 'Mars', distanceKm: 23463, diameterKm: 12.4, orbitalPeriodDays: 1.26, discovered: 'Asaph Hall, 1877', note: "The smaller and more distant of Mars's two moons — smooth, and slowly drifting away.", wikiUrl: 'https://en.wikipedia.org/wiki/Deimos_(moon)', nasaUrl: 'https://science.nasa.gov/mars/moons/deimos/' },

  // ── JUPITER MOONS ──────────────────────────────────────────────────────
  { id: 'io', name: 'Io', type: 'Moon', parent: 'Jupiter', distanceKm: 421700, diameterKm: 3643.2, orbitalPeriodDays: 1.77, discovered: 'Galileo Galilei, 1610', note: 'The most volcanically active body in the solar system, covered in hundreds of active volcanoes.', wikiUrl: 'https://en.wikipedia.org/wiki/Io_(moon)', nasaUrl: 'https://science.nasa.gov/jupiter/moons/io/' },
  { id: 'europa', name: 'Europa', type: 'Moon', parent: 'Jupiter', distanceKm: 671100, diameterKm: 3121.6, orbitalPeriodDays: 3.55, discovered: 'Galileo Galilei, 1610', note: 'An icy shell likely hides a global ocean of liquid water — a prime target in the search for life.', wikiUrl: 'https://en.wikipedia.org/wiki/Europa_(moon)', nasaUrl: 'https://science.nasa.gov/jupiter/moons/europa/' },
  { id: 'ganymede', name: 'Ganymede', type: 'Moon', parent: 'Jupiter', distanceKm: 1070400, diameterKm: 5268.2, orbitalPeriodDays: 7.15, discovered: 'Galileo Galilei, 1610', note: 'The largest moon in the solar system — bigger than the planet Mercury — and has its own magnetic field.', wikiUrl: 'https://en.wikipedia.org/wiki/Ganymede_(moon)', nasaUrl: 'https://science.nasa.gov/jupiter/moons/ganymede/' },
  { id: 'callisto', name: 'Callisto', type: 'Moon', parent: 'Jupiter', distanceKm: 1882700, diameterKm: 4820.6, orbitalPeriodDays: 16.69, discovered: 'Galileo Galilei, 1610', note: 'One of the most heavily cratered surfaces in the solar system, with an ancient icy surface.', wikiUrl: 'https://en.wikipedia.org/wiki/Callisto_(moon)', nasaUrl: 'https://science.nasa.gov/jupiter/moons/callisto/' },

  // ── SATURN MOONS ───────────────────────────────────────────────────────
  { id: 'mimas', name: 'Mimas', type: 'Moon', parent: 'Saturn', distanceKm: 185540, diameterKm: 396.4, orbitalPeriodDays: 0.94, discovered: 'William Herschel, 1789', note: 'Its giant Herschel crater gives it a striking "Death Star" appearance. Recent data suggests a hidden ocean.', wikiUrl: 'https://en.wikipedia.org/wiki/Mimas_(moon)', nasaUrl: 'https://science.nasa.gov/saturn/moons/mimas/' },
  { id: 'enceladus', name: 'Enceladus', type: 'Moon', parent: 'Saturn', distanceKm: 238040, diameterKm: 504.2, orbitalPeriodDays: 1.37, discovered: 'William Herschel, 1789', note: "Geysers at its south pole spray water-ice plumes into space, feeding Saturn's E ring.", wikiUrl: 'https://en.wikipedia.org/wiki/Enceladus', nasaUrl: 'https://science.nasa.gov/saturn/moons/enceladus/' },
  { id: 'tethys', name: 'Tethys', type: 'Moon', parent: 'Saturn', distanceKm: 294670, diameterKm: 1062, orbitalPeriodDays: 1.89, discovered: 'Giovanni Domenico Cassini, 1684', note: 'Almost entirely made of water ice, with a giant canyon system called Ithaca Chasma.', wikiUrl: 'https://en.wikipedia.org/wiki/Tethys_(moon)', nasaUrl: 'https://science.nasa.gov/saturn/moons/tethys/' },
  { id: 'dione', name: 'Dione', type: 'Moon', parent: 'Saturn', distanceKm: 377420, diameterKm: 1122.8, orbitalPeriodDays: 2.74, discovered: 'Giovanni Domenico Cassini, 1684', note: 'Wispy bright streaks across its surface are actually towering ice cliffs hundreds of metres tall.', wikiUrl: 'https://en.wikipedia.org/wiki/Dione_(moon)', nasaUrl: 'https://science.nasa.gov/saturn/moons/dione/' },
  { id: 'rhea', name: 'Rhea', type: 'Moon', parent: 'Saturn', distanceKm: 527070, diameterKm: 1527.6, orbitalPeriodDays: 4.52, discovered: 'Giovanni Domenico Cassini, 1672', note: "Saturn's second-largest moon, with a tenuous oxygen atmosphere.", wikiUrl: 'https://en.wikipedia.org/wiki/Rhea_(moon)', nasaUrl: 'https://science.nasa.gov/saturn/moons/rhea/' },
  { id: 'titan', name: 'Titan', type: 'Moon', parent: 'Saturn', distanceKm: 1221870, diameterKm: 5149.5, orbitalPeriodDays: 15.95, discovered: 'Christiaan Huygens, 1655', note: "Saturn's largest moon — the only moon with a thick atmosphere and lakes of liquid methane on its surface.", wikiUrl: 'https://en.wikipedia.org/wiki/Titan_(moon)', nasaUrl: 'https://science.nasa.gov/saturn/moons/titan/' },
  { id: 'iapetus', name: 'Iapetus', type: 'Moon', parent: 'Saturn', distanceKm: 3560820, diameterKm: 1469, orbitalPeriodDays: 79.3, discovered: 'Giovanni Domenico Cassini, 1671', note: 'One hemisphere is bright ice, the other as dark as coal — a mystery that puzzled astronomers for centuries.', wikiUrl: 'https://en.wikipedia.org/wiki/Iapetus_(moon)', nasaUrl: 'https://science.nasa.gov/saturn/moons/iapetus/' },

  // ── URANUS MOONS ───────────────────────────────────────────────────────
  { id: 'miranda', name: 'Miranda', type: 'Moon', parent: 'Uranus', distanceKm: 129390, diameterKm: 471.6, orbitalPeriodDays: 1.41, discovered: 'Gerard Kuiper, 1948', note: 'Home to Verona Rupes — some of the tallest known cliffs in the solar system, up to 20 km high.', wikiUrl: 'https://en.wikipedia.org/wiki/Miranda_(moon)', nasaUrl: 'https://science.nasa.gov/uranus/moons/miranda/' },
  { id: 'ariel', name: 'Ariel', type: 'Moon', parent: 'Uranus', distanceKm: 190900, diameterKm: 1157.8, orbitalPeriodDays: 2.52, discovered: 'William Lassell, 1851', note: "The brightest of Uranus's major moons, with a relatively young and geologically active surface.", wikiUrl: 'https://en.wikipedia.org/wiki/Ariel_(moon)', nasaUrl: 'https://science.nasa.gov/uranus/moons/ariel/' },
  { id: 'umbriel', name: 'Umbriel', type: 'Moon', parent: 'Uranus', distanceKm: 266000, diameterKm: 1169.4, orbitalPeriodDays: 4.14, discovered: 'William Lassell, 1851', note: 'One of the darkest moons in the solar system, ancient and heavily cratered.', wikiUrl: 'https://en.wikipedia.org/wiki/Umbriel_(moon)', nasaUrl: 'https://science.nasa.gov/uranus/moons/umbriel/' },
  { id: 'titania', name: 'Titania', type: 'Moon', parent: 'Uranus', distanceKm: 436300, diameterKm: 1576.8, orbitalPeriodDays: 8.71, discovered: 'William Herschel, 1787', note: "Uranus's largest moon, with a system of canyons that dwarf the Grand Canyon.", wikiUrl: 'https://en.wikipedia.org/wiki/Titania_(moon)', nasaUrl: 'https://science.nasa.gov/uranus/moons/titania/' },
  { id: 'oberon', name: 'Oberon', type: 'Moon', parent: 'Uranus', distanceKm: 583500, diameterKm: 1522.8, orbitalPeriodDays: 13.46, discovered: 'William Herschel, 1787', note: 'The outermost of the major Uranian moons, heavily cratered with dark reddish material in crater floors.', wikiUrl: 'https://en.wikipedia.org/wiki/Oberon_(moon)', nasaUrl: 'https://science.nasa.gov/uranus/moons/oberon/' },

  // ── NEPTUNE MOONS ──────────────────────────────────────────────────────
  { id: 'triton', name: 'Triton', type: 'Moon', parent: 'Neptune', distanceKm: 354800, diameterKm: 2706.8, orbitalPeriodDays: 5.88, discovered: 'William Lassell, 1846', note: "Orbits backwards (retrograde) — likely captured from the Kuiper Belt — and has active nitrogen geysers at its poles.", wikiUrl: 'https://en.wikipedia.org/wiki/Triton_(moon)', nasaUrl: 'https://science.nasa.gov/neptune/moons/triton/' },
  { id: 'nereid', name: 'Nereid', type: 'Moon', parent: 'Neptune', distanceKm: 5513400, diameterKm: 340, orbitalPeriodDays: 360.1, discovered: 'Gerard Kuiper, 1949', note: 'One of the most eccentric, elongated orbits of any known moon in the solar system.', wikiUrl: 'https://en.wikipedia.org/wiki/Nereid_(moon)', nasaUrl: 'https://science.nasa.gov/neptune/moons/nereid/' },
];

// Icon emoji per object type
function typeIcon(type) {
  const map = { 'Planet': '🪐', 'Dwarf Planet': '⚪', 'Moon': '🌙', 'Asteroid': '🪨', 'Comet': '☄️' };
  return map[type] || '🌌';
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function daysAgoISO(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function friendlyError(status, fallbackLabel) {
  if (status === 429) return 'NASA API rate limit reached. Wait a few minutes and try again.';
  if (status >= 500) return "NASA's servers are having trouble right now. Try again shortly.";
  return `${fallbackLabel} (${status})`;
}

createApp({
  data() {
    return {
      tab: 'search',
      todayStr: todayISO(),

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
        { label: 'Video',  value: 'video' },
        { label: 'Audio',  value: 'audio' },
      ],

      apod: { date: todayISO(), data: null, loading: false, error: '', imgLoaded: false, yearScope: 'all' },

      neo: { items: SOLAR_CATALOG, selected: null, typeFilter: 'all' },

      // Type filter buttons for the catalog — each shows count in label
      neoTypes: [
        { label: 'All', value: 'all' },
        { label: 'Planets', value: 'Planet' },
        { label: 'Dwarf Planets', value: 'Dwarf Planet' },
        { label: 'Moons', value: 'Moon' },
        { label: 'Asteroids', value: 'Asteroid' },
        { label: 'Comets', value: 'Comet' },
      ],

      mars: { rover: 'curiosity', camera: '', photos: [], loading: false, error: '' },
      epic: { items: [], date: '', loading: false, error: '' },
      detail: { open: false, loading: false, data: null, descExpanded: false },
    };
  },

  computed: {
    marsCamerasForRover() { return MARS_CAMERAS[this.mars.rover] || []; },
    truncatedDescription() {
      const d = (this.detail.data && this.detail.data.description) || '';
      if (d.length <= 220) return d;
      return d.slice(0, 220).trimEnd() + '…';
    },
    // Which media-type checkboxes are ticked. Empty array = no filter = all results.
    activeMediaTypes() {
      return Object.keys(this.search.mediaTypes).filter(k => this.search.mediaTypes[k]);
    },
    filteredNeoItems() {
      if (this.neo.typeFilter === 'all') return this.neo.items;
      return this.neo.items.filter(obj => obj.type === this.neo.typeFilter);
    },
    totalCatalogObjects() { return this.neo.items.length; },
    // Count per type for the filter button labels
    countByType() {
      const counts = {};
      this.neo.items.forEach(obj => { counts[obj.type] = (counts[obj.type] || 0) + 1; });
      return counts;
    },
    // Shows "Total 39 objects" always
    catalogCountLabel() {
      return `Total ${this.totalCatalogObjects} objects`;
    },
  },

  watch: {
    tab(newTab) {
      if (newTab === 'apod' && !this.apod.data) this.loadApod();
      if (newTab === 'mars' && this.mars.photos.length === 0) this.loadMars();
      if (newTab === 'epic' && this.epic.items.length === 0) this.loadEpic();
    },
  },

  mounted() {
    this.loadApod();
    this.initStarfield();
    window.addEventListener('scroll', () => { this.navScrolled = window.scrollY > 20; }, { passive: true });
    document.addEventListener('click', (e) => { if (!e.target.closest('.lang-wrap')) this.langOpen = false; });
  },

  methods: {
    setLang(l) { this.currentLang = l; this.langOpen = false; },
    typeIcon,

    stripHtml(str) {
      if (!str) return '';
      return str.replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
    },
    formatKm(n) {
      const num = parseFloat(n);
      if (Number.isNaN(num)) return n;
      return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
    },
    formatDate(iso) {
      try { return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }); }
      catch { return iso; }
    },

    // ------------------------------------------------ Image Library (no media type filter)
    async runSearch(loadMore = false) {
      if (!this.search.q.trim() && !loadMore) {
        this.search.error = 'Type something to search for: a planet, mission, telescope, anything.';
        return;
      }
      this.search.error = '';
      if (!loadMore) {
        this.search.loading = true;
        this.search.loadingMore = false;
        this.search.page = 1;
        this.search.items = [];
        this.search.total = 0;
        this.search.hasMore = false;
      } else {
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
      this.search.loading = false;
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
      this.apod.date = new Date(start + Math.random() * (end - start)).toISOString().slice(0, 10);
      this.loadApod();
    },

    // ----------------------------------------- Solar System Object Catalog
    countForType(typeValue) {
      if (typeValue === 'all') return this.neo.items.length;
      return this.neo.items.filter(o => o.type === typeValue).length;
    },
    isClosest(obj) {
      // Among objects of the same type orbiting the same parent, mark the smallest distance
      const siblings = this.neo.items.filter(o => o.parent === obj.parent && o.type === obj.type);
      if (siblings.length < 2) return false;
      const minDist = Math.min(...siblings.map(o => o.distanceKm));
      return obj.distanceKm === minDist;
    },

    // --------------------------------------------------------- Mars Rover
    async loadMars() {
      this.mars.loading = true;
      this.mars.error = '';
      this.mars.photos = [];
      try {
        let url = `${PROXY}?endpoint=mars_latest&rover=${this.mars.rover}`;
        if (this.mars.camera) url += `&camera=${this.mars.camera}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(friendlyError(res.status, 'Mars rover request failed'));
        const data = await res.json();
        let photos = data.latest_photos || [];
        if (this.mars.camera) photos = photos.filter(p => p.camera.name === this.mars.camera);
        this.mars.photos = photos.slice(0, 40);
      } catch (e) {
        this.mars.error = e.message || "Couldn't load rover photos.";
      }
      this.mars.loading = false;
    },

    // ------------------------------------------------------------- EPIC
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
          return { identifier: img.identifier, caption: img.caption, date: img.date, thumbUrl: url, fullUrl: url };
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
          x: Math.random() * canvas.width, y: Math.random() * canvas.height,
          r: Math.random() * 1.3 + 0.2, o: Math.random() * 0.75 + 0.1,
          s: Math.random() * 0.0025 + 0.001, t: Math.random() * Math.PI * 2,
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
