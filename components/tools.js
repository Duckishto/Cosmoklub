// CosmoKlub — Tools tab.
//
// One home for every stand-alone instrument in the app. The Calculator used to
// sit in the bottom nav on its own (under the misleading id "planetarium"),
// while the three NASA tools lived on a separate page, object.html. Both are
// gathered here so a visitor never leaves the dashboard to use a tool.
//
// Four tools, switched by the chip row:
//   calculator — components/calculator.js (scientific + graphing, unchanged)
//   search     — NASA Image & Video Library
//   apod       — Astronomy Picture of the Day
//   neo        — Solar System Object Catalog (data: solar-catalog.js)
//
// Every NASA request goes through our own /api/nasa proxy (see
// functions/api/nasa.js) so the real API key stays server-side as a Cloudflare
// environment secret. Nothing here ever sees the key.
//
// Load order in dashboard.html: solar-catalog.js and calculator.js must come
// before this file — it reads SOLAR_CATALOG/typeIcon and registers Calculator.

const NASA_PROXY = '/api/nasa';

function toolsTodayISO() {
  return new Date().toISOString().slice(0, 10);
}

function nasaFriendlyError(status, fallbackLabel) {
  if (status === 429) return 'NASA API rate limit reached. Wait a few minutes and try again.';
  if (status >= 500) return "NASA's servers are having trouble right now. Try again shortly.";
  return `${fallbackLabel} (${status})`;
}

const Tools = {
  name: 'Tools',

  props: {
    // The public page (tools.html) shows only the three NASA tools, exactly
    // like the old object.html did. The Calculator stays behind sign-in.
    showCalculator: { type: Boolean, default: true },

    // 'launcher' opens on a grid of tool cards and drills into one at a time,
    // which suits the dashboard's app-like shell. 'chips' keeps the row of
    // tabs along the top — the layout the public page has always had.
    layout: {
      type: String,
      default: 'launcher',
      validator: (value) => ['launcher', 'chips'].includes(value),
    },
  },

  // Registered only when calculator.js is on the page. tools.html leaves that
  // 87 KB file out entirely, and the <Calculator> tag below sits inside a
  // v-if that never becomes true there, so it is never resolved.
  components: typeof Calculator !== 'undefined' ? { Calculator } : {},

  template: `
  <div class="tools-tab">

    <!-- ──────────────────────── Launcher grid ────────────────────────
         Shown only in 'launcher' layout, and only while no tool is open. -->
    <div v-if="isLauncher && !tool" class="tool-launcher">
      <button
        v-for="item in availableTools"
        :key="item.id"
        class="tool-card"
        @click="openTool(item.id)"
      >
        <span class="tool-card-icon" v-html="item.icon"></span>
        <span class="tool-card-title">{{ item.title }}</span>
        <span class="tool-card-desc">{{ item.desc }}</span>
      </button>
    </div>

    <template v-else>

      <!-- Back to the grid, or the classic chip row on the public page -->
      <button v-if="isLauncher" class="tool-back" @click="tool = null">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        All tools
      </button>

      <div v-else class="chip-row tools-chip-row">
        <div v-if="showCalculator" class="chip" :class="{active: tool === 'calculator'}" @click="tool = 'calculator'">Calculator</div>
        <div class="chip" :class="{active: tool === 'search'}" @click="tool = 'search'">Image Library</div>
        <div class="chip" :class="{active: tool === 'apod'}" @click="tool = 'apod'">Picture of the Day</div>
        <div class="chip" :class="{active: tool === 'neo'}" @click="tool = 'neo'">Object Catalog</div>
      </div>

    <!-- ──────────────────────── Calculator ──────────────────────── -->
    <!-- keep-alive so a half-typed expression and the graph view survive a
         trip to another tool and back -->
    <keep-alive>
      <Calculator v-if="tool === 'calculator'" />
    </keep-alive>

    <!-- ──────────────────────── Image & Video Library ──────────────────────── -->
    <div v-if="tool === 'search'" class="section">
      <div class="section-eyebrow-row">
        <h2 class="tab-section-title">Image &amp; Video Library</h2>
      </div>

      <div class="lib-search-wrap">
        <div class="lib-filter-row">
          <label
            v-for="f in searchFilters" :key="f.value"
            class="filter-checkbox"
            :class="{ active: search.mediaTypes[f.value] }"
          >
            <input type="checkbox" v-model="search.mediaTypes[f.value]" @change="search.items.length && runSearch()" />
            <span class="filter-checkbox-box"></span>
            {{ f.label }}
          </label>
        </div>
        <div class="search-bar">
          <input
            v-model="search.q"
            @keyup.enter="runSearch()"
            type="text"
            placeholder="Search any object, mission, or telescope…"
          />
          <button class="search-btn" @click="runSearch()">Search</button>
        </div>
      </div>

      <div v-if="search.total" class="result-count-row">
        <span class="result-count-badge">{{ search.total.toLocaleString() }} results</span>
      </div>

      <div v-if="search.loading" class="loading-row"><span class="spinner"></span> Searching the archive…</div>
      <div v-else-if="search.error && !search.items.length" class="error-row">{{ search.error }}</div>

      <div v-else-if="search.items.length" class="object-grid">
        <div class="object-card" v-for="item in search.items" :key="item.nasa_id" @click="openImageItem(item)">
          <div class="object-thumb">
            <img v-if="item.thumb" :src="item.thumb" :alt="item.title" loading="lazy" />
            <div v-else class="object-thumb-fallback">{{ item.media_type === 'audio' ? '🎧' : item.media_type === 'video' ? '🎬' : '🛰️' }}</div>
          </div>
          <div class="object-card-body">
            <div class="object-card-title">{{ item.title }}</div>
            <div class="object-card-meta">{{ item.dateStr }} • {{ item.center || 'NASA' }}</div>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <p>Search NASA's library of 100,000+ images, videos, and audio.</p>
        <p class="empty-sub">Try a planet, mission, telescope, or astronaut name.</p>
      </div>

      <div v-if="search.items.length && (search.hasMore || search.loadingMore)" class="load-more-row">
        <div v-if="search.loadingMore" class="loading-row"><span class="spinner"></span> Loading more…</div>
        <button v-else class="btn-secondary" @click="runSearch(true)">Load more</button>
      </div>
      <div v-if="search.error && search.items.length" class="error-row" style="margin-top:14px;">{{ search.error }}</div>
    </div>

    <!-- ──────────────────────── Astronomy Picture of the Day ──────────────────────── -->
    <div v-if="tool === 'apod'" class="section">
      <div class="section-eyebrow-row">
        <h2 class="tab-section-title">Astronomy Picture of the Day</h2>
      </div>

      <div class="apod-controls">
        <input type="date" v-model="apod.date" :max="todayStr" @change="loadApod()" />
        <select class="apod-year-scope" v-model="apod.yearScope">
          <option value="all">All years</option>
          <option value="1995">1995–1999</option>
          <option value="2000">2000–2009</option>
          <option value="2010">2010–2019</option>
          <option value="2020">2020–today</option>
        </select>
        <button class="btn-secondary apod-random-btn" @click="randomApod()">Random date</button>
      </div>

      <div v-if="apod.loading" class="loading-row"><span class="spinner"></span> Loading today's cosmic pick…</div>
      <div v-else-if="apod.error" class="error-row">{{ apod.error }}</div>

      <div v-else-if="apod.data" class="apod-card">
        <div class="apod-media-wrap" v-if="apod.data.media_type === 'image'">
          <div class="apod-media-shimmer" v-if="!apod.imgLoaded"></div>
          <img :src="apod.data.url" :alt="apod.data.title" class="apod-media" :class="{ loaded: apod.imgLoaded }" @load="apod.imgLoaded = true" />
        </div>
        <div v-else-if="apod.data.media_type === 'video'" class="apod-video-wrap">
          <iframe :src="apod.data.url" frameborder="0" allowfullscreen></iframe>
        </div>
        <div class="apod-body">
          <div class="apod-title-row">
            <div class="apod-title">{{ apod.data.title }}</div>
            <div class="apod-date">{{ apod.data.date }}<span v-if="apod.data.copyright"> • © {{ apod.data.copyright }}</span></div>
          </div>
          <p class="apod-explanation">{{ apod.data.explanation }}</p>
          <div v-if="apod.data.hdurl" class="apod-hd-row">
            <a :href="apod.data.hdurl" target="_blank" rel="noopener" class="apod-hd-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              View full resolution
            </a>
            <a :href="apod.data.hdurl" target="_blank" rel="noopener" class="apod-hd-url">{{ apod.data.hdurl }}</a>
          </div>
        </div>
      </div>
    </div>

    <!-- ──────────────────────── Solar System Object Catalog ──────────────────────── -->
    <div v-if="tool === 'neo'" class="section">
      <div class="section-eyebrow-row" style="margin-bottom:6px;">
        <h2 class="tab-section-title">Solar System Object Catalog</h2>
      </div>
      <div class="section-eyebrow-row">
        <div class="section-rule"></div>
        <span class="neo-date-range">{{ catalogCountLabel }}</span>
      </div>

      <div class="catalog-filter-row">
        <div class="catalog-chips">
          <button
            v-for="t in neoTypes" :key="t.value"
            class="filter-chip"
            :class="{ active: neo.typeFilter === t.value }"
            @click="neo.typeFilter = t.value"
          >
            {{ t.label }}
            <span class="filter-chip-count">{{ countForType(t.value) }}</span>
          </button>
        </div>
      </div>

      <div class="object-list">
        <div v-if="filteredNeoItems.length === 0" class="empty-state">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg>
          <p>No objects match this filter.</p>
        </div>

        <div
          class="neo-item"
          v-for="obj in filteredNeoItems"
          :key="obj.id"
          @click="neo.selected = (neo.selected === obj.id ? null : obj.id)"
        >
          <div class="neo-row">
            <div class="neo-icon">{{ typeIcon(obj.type) }}</div>
            <div class="neo-info">
              <div class="neo-name">
                {{ obj.name }}
                <span class="neo-type-badge">{{ obj.type }}</span>
                <span class="neo-parent">· orbits {{ obj.parent }}</span>
              </div>
              <div class="neo-meta">
                <span>{{ formatKm(obj.distanceKm) }} km from {{ obj.parent }}</span>
                <span>⌀ {{ formatKm(obj.diameterKm) }} km</span>
                <span v-if="isClosest(obj)" class="closest-tag">Closest {{ obj.type }} to {{ obj.parent }}</span>
              </div>
            </div>
            <div class="neo-chevron" :class="{open: neo.selected === obj.id}">▾</div>
          </div>

          <div v-if="neo.selected === obj.id" class="neo-detail" @click.stop>
            <p class="neo-note">{{ obj.note }}</p>
            <div class="neo-approach-grid">
              <div><span class="lbl">Distance from {{ obj.parent }}</span>{{ formatKm(obj.distanceKm) }} km</div>
              <div><span class="lbl">Diameter</span>{{ formatKm(obj.diameterKm) }} km</div>
              <div><span class="lbl">Orbital period</span>{{ obj.orbitalPeriodDays.toLocaleString() }} days</div>
            </div>
            <div class="neo-discovered">Discovered: {{ obj.discovered }}</div>
            <div class="neo-links">
              <a :href="obj.wikiUrl" target="_blank" rel="noopener" class="neo-link neo-link-wiki">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                Wikipedia
              </a>
              <a :href="obj.nasaUrl" target="_blank" rel="noopener" class="neo-link neo-link-nasa">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                NASA Science
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    </template>

    <!-- ─────────────── Detail modal (Image Library) ───────────────
         Outside the v-else so it can stay mounted regardless of layout. -->
    <transition name="fade">
      <div class="modal-backdrop" v-if="detail.open" @click.self="detail.open = false">
        <div class="modal-card">
          <button class="modal-close" @click="detail.open = false">✕</button>
          <div v-if="detail.loading" class="loading-row" style="padding:40px 0;"><span class="spinner"></span> Loading object data…</div>
          <template v-else-if="detail.data">
            <img v-if="detail.data.image && detail.data.media_type !== 'audio'" :src="detail.data.image" :alt="detail.data.title" class="modal-image" />
            <div class="modal-body">
              <template v-if="detail.data.media_type === 'audio'">
                <div class="audio-card">
                  <div class="audio-card-icon">
                    <img v-if="detail.data.image" :src="detail.data.image" :alt="detail.data.title" />
                    <span v-else>🎧</span>
                  </div>
                  <div class="audio-card-info">
                    <h2>{{ detail.data.title }}</h2>
                    <div class="modal-meta-row">
                      <span v-if="detail.data.date_created">{{ formatDate(detail.data.date_created) }}</span>
                      <span v-if="detail.data.center">• {{ detail.data.center }}</span>
                      <span v-if="detail.data.nasa_id">• ID: {{ detail.data.nasa_id }}</span>
                    </div>
                  </div>
                </div>
                <audio v-if="detail.data.audioUrl" :src="detail.data.audioUrl" controls preload="metadata" class="audio-player"></audio>
                <div v-else class="audio-player-missing">No playable audio asset was found for this item — try the link below.</div>
                <p class="modal-description">{{ detail.descExpanded ? detail.data.description : truncatedDescription }}</p>
                <button v-if="detail.data.description && detail.data.description.length > 220" class="read-full-btn" @click="detail.descExpanded = !detail.descExpanded">{{ detail.descExpanded ? 'Show less' : 'Read full description' }}</button>
                <div v-if="detail.data.keywords && detail.data.keywords.length" class="keyword-row">
                  <span class="keyword-chip" v-for="k in detail.data.keywords" :key="k">{{ k }}</span>
                </div>
                <a v-if="detail.data.hiResUrl" :href="detail.data.hiResUrl" target="_blank" rel="noopener" class="btn-secondary" style="display:inline-block;margin-top:14px;text-decoration:none;">Open original asset →</a>
              </template>
              <template v-else>
                <h2>{{ detail.data.title }}</h2>
                <div class="modal-meta-row">
                  <span v-if="detail.data.date_created">{{ formatDate(detail.data.date_created) }}</span>
                  <span v-if="detail.data.center">• {{ detail.data.center }}</span>
                  <span v-if="detail.data.nasa_id">• ID: {{ detail.data.nasa_id }}</span>
                </div>
                <p class="modal-description">{{ detail.data.description }}</p>
                <div v-if="detail.data.keywords && detail.data.keywords.length" class="keyword-row">
                  <span class="keyword-chip" v-for="k in detail.data.keywords" :key="k">{{ k }}</span>
                </div>
                <a v-if="detail.data.hiResUrl" :href="detail.data.hiResUrl" target="_blank" rel="noopener" class="btn-secondary" style="display:inline-block;margin-top:14px;text-decoration:none;">Open original asset →</a>
              </template>
            </div>
          </template>
        </div>
      </div>
    </transition>

  </div>
  `,

  data() {
    return {
      // Launcher opens on the grid (no tool chosen yet). The chip layout has
      // no grid to fall back to, so it opens on a tool: the Calculator, or
      // the Image Library when the Calculator isn't available — which is
      // where the old object.html landed.
      tool: this.layout === 'launcher'
        ? null
        : (this.showCalculator ? 'calculator' : 'search'),

      todayStr: toolsTodayISO(),

      search: { q: '', items: [], page: 1, total: 0, hasMore: false, loading: false, loadingMore: false, error: '', mediaTypes: { image: false, video: false, audio: false } },

      searchFilters: [
        { label: 'Images', value: 'image' },
        { label: 'Video',  value: 'video' },
        { label: 'Audio',  value: 'audio' },
      ],

      apod: { date: toolsTodayISO(), data: null, loading: false, error: '', imgLoaded: false, yearScope: 'all' },

      neo: { items: SOLAR_CATALOG, selected: null, typeFilter: 'all' },

      neoTypes: [
        { label: 'All', value: 'all' },
        { label: 'Planets', value: 'Planet' },
        { label: 'Dwarf Planets', value: 'Dwarf Planet' },
        { label: 'Moons', value: 'Moon' },
        { label: 'Asteroids', value: 'Asteroid' },
        { label: 'Comets', value: 'Comet' },
      ],

      detail: { open: false, loading: false, data: null, descExpanded: false },
    };
  },

  computed: {
    isLauncher() {
      return this.layout === 'launcher';
    },

    // Cards for the launcher grid. Icons are inline so the grid needs no
    // extra requests; descriptions say what the tool does, since a title
    // alone ("Object Catalog") doesn't tell you much on first visit.
    availableTools() {
      const all = [
        {
          id: 'calculator',
          title: 'Calculator',
          desc: 'Scientific calculator and function grapher.',
          icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="11" x2="8" y2="11"/><line x1="12" y1="11" x2="12" y2="11"/><line x1="16" y1="11" x2="16" y2="11"/><line x1="8" y1="15" x2="8" y2="15"/><line x1="12" y1="15" x2="12" y2="15"/><line x1="16" y1="15" x2="16" y2="15"/><line x1="8" y1="19" x2="16" y2="19"/></svg>',
        },
        {
          id: 'search',
          title: 'Image Library',
          desc: "Search NASA's 100,000+ images, videos and audio.",
          icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
        },
        {
          id: 'apod',
          title: 'Picture of the Day',
          desc: "NASA's daily astronomy photo, back to 1995.",
          icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
        },
        {
          id: 'neo',
          title: 'Object Catalog',
          desc: 'Planets, moons, asteroids and comets at a glance.',
          icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-20 12 12)"/></svg>',
        },
      ];

      return this.showCalculator ? all : all.filter(t => t.id !== 'calculator');
    },

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
    catalogCountLabel() {
      return `Total ${this.neo.items.length} objects`;
    },
  },

  watch: {
    // Fetch the picture of the day the first time someone opens that tool
    // rather than on mount — the Calculator is what the tab opens on, and an
    // unseen NASA request on every visit to Tools is wasted.
    tool(newTool) {
      if (newTool === 'apod' && !this.apod.data) this.loadApod();
    },
  },

  methods: {
    typeIcon,

    openTool(id) {
      this.tool = id;
      // Coming from the grid, the previous tool's scroll position is still on
      // the page — start the new one at the top.
      window.scrollTo({ top: 0 });
    },


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

    // ------------------------------------------------ Image & Video Library
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
        const url = `${NASA_PROXY}?endpoint=images_search&q=${encodeURIComponent(this.search.q)}${mediaType}&page=${this.search.page}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(nasaFriendlyError(res.status, 'Search failed'));
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
        const res = await fetch(`${NASA_PROXY}?endpoint=images_asset&nasa_id=${encodeURIComponent(item.nasa_id)}`);
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
        const res = await fetch(`${NASA_PROXY}?endpoint=apod&date=${this.apod.date}`);
        if (!res.ok) throw new Error(nasaFriendlyError(res.status, 'APOD request failed'));
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
  },
};
