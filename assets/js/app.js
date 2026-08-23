const { createApp } = Vue;

window.CosmoKlub = window.CosmoKlub || {};

// Every one of these is reachable from the sidebar: the first four from
// the top group, Profile and Settings from the ACCOUNT group underneath.
// They all share the ?tab= routing and Back behaviour.
//
// 'docs' is the one exception — it's a tab (so it gets a URL and a
// component like everything else here) but it's reachable only from the
// header's Docs link, not the sidebar. See PRIMARY_NAV/ACCOUNT_NAV below.
const VALID_TABS = [
  'forum',
  'library',
  'calculator',
  'chat',
  'profile',
  'settings',
  'docs'
];

// Icons for the sidebar. Forum/Library/Calculator/Chat reuse the exact
// glyphs already used elsewhere in the dashboard; the rest are new.
const NAV_ICONS = {
  forum: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/></svg>`,
  library: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  calculator: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="8" y2="10"/><line x1="12" y1="10" x2="12" y2="10"/><line x1="16" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="8" y2="14"/><line x1="12" y1="14" x2="12" y2="14"/><line x1="16" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="16" y2="18"/></svg>`,
  chat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
  profile: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.5 3.6-8 8-8s8 3.5 8 8"/></svg>`,
  minigames: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="11" rx="5.5"/><path d="M7 10v5M4.5 12.5h5"/><circle cx="16" cy="10.5" r="1"/><circle cx="18.5" cy="13" r="1"/></svg>`,
  docs: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M9 21V12h6v9"/></svg>`,
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  logout: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`
};

// The sidebar, in two groups — the working tabs on top, an ACCOUNT group
// underneath, exactly the shape OpenRouter uses. `tab: null` marks a
// destination that doesn't exist yet (Minigames): it renders with a "Soon"
// pill and is intentionally not clickable.
const PRIMARY_NAV = [
  { key: 'forum', label: 'Forum', tab: 'forum', icon: NAV_ICONS.forum },
  { key: 'library', label: 'Library', tab: 'library', icon: NAV_ICONS.library },
  { key: 'calculator', label: 'Calculator', tab: 'calculator', icon: NAV_ICONS.calculator },
  { key: 'chat', label: 'Chat', tab: 'chat', icon: NAV_ICONS.chat },
  { key: 'minigames', label: 'Minigames', tab: null, icon: NAV_ICONS.minigames }
];

// "Log out" is a Settings destination rather than a tab of its own — it
// opens Settings already scrolled to its log-out section, so the confirm
// step is never skipped.
const ACCOUNT_NAV = [
  { key: 'profile', label: 'Profile', tab: 'profile', icon: NAV_ICONS.profile },
  { key: 'settings', label: 'Settings', tab: 'settings', icon: NAV_ICONS.settings },
  { key: 'logout', label: 'Log out', tab: 'settings', section: 'logout', danger: true, icon: NAV_ICONS.logout }
];

// Titles shown in the slim header above the content column.
const TAB_TITLES = {
  forum: 'Forum',
  library: 'Library',
  calculator: 'Calculator',
  chat: 'Chat',
  profile: 'Profile',
  settings: 'Settings',
  docs: 'Docs'
};

// The header search overlay's result list — every place "Search" can jump
// you. Keeps the sidebar/header destinations as the single source of truth
// for what's searchable, rather than indexing content inside each tab.
const SEARCH_INDEX = [
  { key: 'forum', label: 'Forum', hint: 'Ask questions & share your astrophotos', tab: 'forum', icon: NAV_ICONS.forum },
  { key: 'library', label: 'Library', hint: 'Guided astronomy course & roadmap', tab: 'library', icon: NAV_ICONS.library },
  { key: 'calculator', label: 'Calculator', hint: 'Telescope & imaging calculators', tab: 'calculator', icon: NAV_ICONS.calculator },
  { key: 'chat', label: 'Chat', hint: 'Your direct messages', tab: 'chat', icon: NAV_ICONS.chat },
  { key: 'profile', label: 'Profile', hint: 'Your public identity & progression', tab: 'profile', icon: NAV_ICONS.profile },
  { key: 'settings', label: 'Settings', hint: 'Account & security', tab: 'settings', icon: NAV_ICONS.settings },
  { key: 'docs', label: 'Docs', hint: 'Guides for using CosmoKlub', tab: 'docs', icon: NAV_ICONS.docs },
  { key: 'home', label: 'Home', hint: 'cosmoklub.com — leaves the dashboard', href: 'index.html', icon: NAV_ICONS.home }
];

// Below this width the sidebar is off-canvas, so navigating has to close
// it or the destination stays hidden behind the panel.
const SIDEBAR_BREAKPOINT = 980;

function getTabFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const tab = params.get('tab');

  return VALID_TABS.includes(tab)
    ? tab
    : 'forum';
}

function setUrlTab(tab, replace = false) {
  const url = new URL(window.location.href);

  if (url.searchParams.get('tab') === tab) {
    return;
  }

  url.searchParams.set('tab', tab);

  if (replace) {
    window.history.replaceState(
      { tab },
      '',
      url
    );
  } else {
    window.history.pushState(
      { tab },
      '',
      url
    );
  }
}

createApp({
  data() {
    return {
      activeTab: getTabFromUrl(),

      // Only meaningful below SIDEBAR_BREAKPOINT, where the sidebar is
      // off-canvas. On desktop the rail is always in flow and this is
      // ignored.
      sidebarOpen: false,

      // Drives the sidebar chip and the header chip. Filled by
      // loadAccount(); stays as the signed-out placeholder if there's no
      // session, rather than rendering an empty pill.
      account: {
        signedIn: false,
        username: 'Guest',
        avatarUrl: '',
        initial: 'G'
      },

      // Rank/level shown in the header. `ready` gates rendering so the
      // pill doesn't flash "Level 0" before progress.js has resolved.
      progress: {
        ready: false,
        level: 0,
        rank: '',
        rankClass: '',
        xp: 0,
        percent: 0,
        isMaxLevel: false,
        toNext: 0
      },

      tabComponents: {
        forum: Forum,
        library: Library,
        chat: Chat,
        calculator: Calculator,
        profile: Profile,
        settings: Settings,
        docs: Docs
      },

      // Header search overlay. Not wired to any tab's internal state —
      // it only ever jumps you to one of SEARCH_INDEX's destinations.
      searchOpen: false,
      searchQuery: ''
    };
  },

  watch: {
    activeTab(newTab) {
      if (!VALID_TABS.includes(newTab)) {
        this.activeTab = 'forum';
        return;
      }

      setUrlTab(newTab);

      // On mobile the sidebar covers the page it just navigated to.
      if (window.innerWidth <= SIDEBAR_BREAKPOINT) {
        this.sidebarOpen = false;
      }
    }
  },

  computed: {
    primaryNav() {
      return PRIMARY_NAV;
    },

    accountNav() {
      return ACCOUNT_NAV;
    },

    pageTitle() {
      return TAB_TITLES[this.activeTab] || 'CosmoKlub';
    },

    // Native tooltip on the header pill — the detail that doesn't fit.
    xpTitle() {
      if (!this.progress.ready) return '';

      return this.progress.isMaxLevel
        ? `${this.progress.rank} · level ${this.progress.level} · max level reached`
        : `${this.progress.rank} · level ${this.progress.level} · ` +
          `${this.progress.toNext.toLocaleString()} XP to level ${this.progress.level + 1}`;
    },

    // Substring match against label + hint; empty query shows everything,
    // so the overlay is never empty the moment it opens.
    filteredSearchResults() {
      const q = this.searchQuery.trim().toLowerCase();

      if (!q) {
        return SEARCH_INDEX;
      }

      return SEARCH_INDEX.filter((r) =>
        r.label.toLowerCase().includes(q) ||
        (r.hint || '').toLowerCase().includes(q)
      );
    }
  },

  methods: {
    setTab(tab) {
      if (!VALID_TABS.includes(tab)) {
        return;
      }

      this.activeTab = tab;
    },

    // Sidebar item click. Destinations without a tab (Minigames) don't
    // exist yet, so this intentionally does nothing for them — they're
    // listed for visibility but not linked anywhere.
    //
    // A destination may also carry a `section`, which is a request to open
    // a particular part of the target tab (Log out -> Settings' log-out
    // section). The component may or may not be mounted yet, so the
    // request is both stashed for a fresh mount to pick up and broadcast
    // for an already-mounted one.
    goToDestination(dest) {
      if (!dest || !dest.tab) {
        return;
      }

      if (dest.section) {
        window.CosmoKlub.pendingSettingsSection = dest.section;

        window.dispatchEvent(
          new CustomEvent('cosmoklub-settings-section', {
            detail: { section: dest.section }
          })
        );
      }

      this.setTab(dest.tab);
    },

    closeSidebar() {
      if (this.sidebarOpen) {
        this.sidebarOpen = false;
      }
    },

    // Header search overlay.
    openSearch() {
      this.searchOpen = true;
      this.searchQuery = '';

      this.$nextTick(() => {
        if (this.$refs.searchInput) {
          this.$refs.searchInput.focus();
        }
      });
    },

    closeSearch() {
      this.searchOpen = false;
    },

    // A result either has a tab (stays in the SPA) or an href (Home —
    // leaves the dashboard for the marketing site).
    goSearchResult(result) {
      if (!result) {
        return;
      }

      if (result.href) {
        window.location.href = result.href;
        return;
      }

      if (result.tab) {
        this.setTab(result.tab);
      }

      this.closeSearch();
    },

    // Name + picture for the two account chips. Best-effort: any failure
    // just leaves the signed-out placeholder in place, since nothing on
    // the page depends on it.
    async loadAccount() {
      try {
        const client =
          window.supabaseClient ||
          (window.supabaseReady ? await window.supabaseReady : null);

        if (!client) {
          return;
        }

        const { data: sessionData } = await client.auth.getSession();
        const user = sessionData && sessionData.session && sessionData.session.user;

        if (!user) {
          return;
        }

        const meta = user.user_metadata || {};

        const { data: row } = await client
          .from('profiles')
          .select('username, avatar_url')
          .eq('uid', user.id)
          .single();

        this.applyAccount({
          signedIn: true,
          username:
            (row && row.username) ||
            meta.username ||
            (user.email || '').split('@')[0] ||
            'Astronomer',
          avatarUrl: (row && row.avatar_url) || meta.avatar_url || meta.picture || ''
        });
      } catch (error) {
        console.warn('[CosmoKlub] Could not load the account chip.', error);
      }
    },

    // Same source the Profile tab reads, so the two always agree: level
    // and rank from total XP rather than the mean of the category levels.
    async loadProgress() {
      try {
        if (window.progressReady) {
          await window.progressReady;
        }

        if (typeof window.getOverallProgress !== 'function' ||
            typeof window.getLevelProgress !== 'function') {
          return;
        }

        const overall = window.getOverallProgress();
        const level = window.getLevelProgress(overall ? overall.totalXP : 0);

        this.progress = {
          ready: true,
          level: level.level,
          rank: level.rank,
          rankClass: level.rankClass,
          xp: level.xp,
          percent: level.progress,
          isMaxLevel: level.isMaxLevel,
          toNext: level.xpForNextLevel
        };
      } catch (error) {
        console.warn('[CosmoKlub] Could not read progress for the header.', error);
      }
    },

    applyAccount(next) {
      const username = next.username || this.account.username;

      this.account = {
        signedIn: next.signedIn !== undefined ? next.signedIn : this.account.signedIn,
        username,
        avatarUrl: next.avatarUrl !== undefined ? next.avatarUrl : this.account.avatarUrl,
        initial: (username || '?').trim().charAt(0).toUpperCase() || '?'
      };
    },

    handlePopState() {
      const tab = getTabFromUrl();

      if (this.activeTab !== tab) {
        this.activeTab = tab;
      }
    }
  },

  mounted() {
    const params = new URLSearchParams(window.location.search);

    if (!VALID_TABS.includes(params.get('tab'))) {
      setUrlTab(this.activeTab, true);
    }

    window.addEventListener(
      'popstate',
      this.handlePopState
    );

    // Let the tab components navigate — Profile's "Edit profile" button
    // hands over to Settings, for instance — without each one needing a
    // reference to this instance.
    window.CosmoKlub.setTab = (tab) => this.setTab(tab);

    this.loadAccount();
    this.loadProgress();

    // XP earned in the Library should move the header pill without a reload.
    this._onProgressChanged = () => this.loadProgress();
    window.addEventListener('cosmoklub-progress-changed', this._onProgressChanged);

    // Settings renames the account and changes the picture; both chips
    // should follow without a reload.
    this._onProfileChanged = (event) => {
      const detail = (event && event.detail) || {};
      const next = {};

      if (detail.username) next.username = detail.username;
      if (detail.avatarUrl !== undefined) next.avatarUrl = detail.avatarUrl;

      if (Object.keys(next).length) this.applyAccount(next);
    };
    window.addEventListener('cosmoklub-profile-changed', this._onProfileChanged);

    // Clicking the page body or pressing Escape dismisses the off-canvas
    // sidebar. The sidebar itself and the hamburger stop propagation, so
    // neither closes it on the way in.
    document.addEventListener('click', this.closeSidebar);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeSidebar();
    });

    // "/" opens search from anywhere, same convention as GitHub/Slack —
    // unless the person is already typing in a field (forum composer, chat
    // box, a settings input…), in which case it should just type a slash.
    this._onSearchShortcut = (e) => {
      if (e.key === '/' && !this.searchOpen) {
        const active = document.activeElement;
        const tag = active ? active.tagName : '';
        const typing =
          tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' ||
          (active && active.isContentEditable);

        if (!typing) {
          e.preventDefault();
          this.openSearch();
        }
      } else if (e.key === 'Escape' && this.searchOpen) {
        this.closeSearch();
      }
    };
    window.addEventListener('keydown', this._onSearchShortcut);

    if (
      window.CosmoKlub &&
      typeof window.CosmoKlub.initStarfield === 'function'
    ) {
      window.CosmoKlub.initStarfield();
    }
  },

  beforeUnmount() {
    window.removeEventListener(
      'popstate',
      this.handlePopState
    );

    if (this._onProfileChanged) {
      window.removeEventListener(
        'cosmoklub-profile-changed',
        this._onProfileChanged
      );
    }

    if (this._onProgressChanged) {
      window.removeEventListener(
        'cosmoklub-progress-changed',
        this._onProgressChanged
      );
    }

    if (this._onSearchShortcut) {
      window.removeEventListener('keydown', this._onSearchShortcut);
    }
  }
}).mount('#app');
