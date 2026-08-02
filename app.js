const { createApp } = Vue;

createApp({
  data() {
    return {
      activeTab: 'forum',
      searchPlaceholder: 'Search the cosmos…',
      tabComponents: {
        forum:       Forum,
        library:     Library,
        chat:        Chat,
        planetarium: Planetarium,
      }
    };
  },
  mounted() {
    // Animated starfield backdrop (shared helper — see common.js), matching
    // the other pages. Draws onto the <canvas id="star-canvas"> in dashboard.html.
    window.CosmoKlub.initStarfield();
  }
}).mount('#app');
