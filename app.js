const { createApp, reactive } = Vue;

// Shared reactive store so independent tab components can sync a little global
// state. Right now it just holds the top-bar search query: the top bar writes
// to `searchQuery`, and the Library tab reads it to filter its content.
const CosmoStore = reactive({ searchQuery: '' });
window.CosmoKlub = window.CosmoKlub || {};
window.CosmoKlub.store = CosmoStore;

createApp({
  data() {
    return {
      activeTab: 'forum',
      searchPlaceholder: 'Search the cosmos…',
      store: CosmoStore,
      tabComponents: {
        forum:       Forum,
        library:     Library,
        chat:        Chat,
        planetarium: Planetarium,
      }
    };
  },
  methods: {
    // Typing in the top bar sends the query to the Library page automatically
    // and jumps there so the user sees the filtered results.
    onSearchInput() {
      if (this.activeTab !== 'library') this.activeTab = 'library';
    },
  },
  mounted() {
    // Animated starfield backdrop (shared helper — see common.js), matching
    // the other pages. Draws onto the <canvas id="star-canvas"> in dashboard.html.
    window.CosmoKlub.initStarfield();
  }
}).mount('#app');
