// CosmoKlub — Docs tab.
//
// Placeholder for now: reachable from the header's "Docs" link (see
// dashboard.html / dashboard-shell.css), the same way OpenRouter keeps Docs
// in its top strip rather than the workspace sidebar. Deliberately NOT in
// PRIMARY_NAV/ACCOUNT_NAV in app.js, so it doesn't also show up in the
// sidebar rail.
//
// Built on the shared page primitives from dashboard-shell.css (.pg-head,
// .ck-card, .ck-empty) so it matches Profile/Settings without its own
// stylesheet. Swap the .ck-empty block below for real content whenever the
// guide is ready.
const Docs = {
  name: 'Docs',

  template: `
  <div class="docs-tab pg">

    <header class="pg-head">
      <div class="pg-head-text">
        <h1 class="pg-title">Docs</h1>
        <p class="pg-sub">Guides for getting the most out of CosmoKlub.</p>
      </div>
    </header>

    <section class="ck-card">
      <div class="ck-empty">
        <span class="ck-empty-ic">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
        </span>
        <h2 class="ck-empty-title">Docs are on the way</h2>
        <p class="ck-empty-sub">
          Step-by-step guides for the Forum, Library, Calculator and Chat are still
          being written. Search above will jump you straight to any of them in the
          meantime.
        </p>
      </div>
    </section>

  </div>
  `
};
