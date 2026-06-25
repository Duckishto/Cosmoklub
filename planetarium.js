// Planetarium tab: placeholder. Previously this nav item linked out to an
// external site (stellarium-web.org); it's now a real in-app tab so this
// feature can be built out independently. Replace this template/data/methods
// with the actual planetarium feature when ready.
const Planetarium = {
  name: 'Planetarium',
  template: `
    <div class="section">
      <div class="section-eyebrow-row">
        <span class="section-label">Planetarium</span>
        <div class="section-rule"></div>
      </div>
      <div class="empty-library">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="margin-bottom:1rem"><circle cx="12" cy="12" r="3.5"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>
        <p>Planetarium is coming soon</p>
        <p style="font-size:0.8rem; margin-top:0.5rem">This tab is reserved for the in-app sky map feature.</p>
      </div>
    </div>
  `,
  data() {
    return {};
  },
  methods: {}
};
