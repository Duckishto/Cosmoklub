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
  }
}).mount('#app');
