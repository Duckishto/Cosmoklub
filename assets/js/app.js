const { createApp } = Vue;

window.CosmoKlub = window.CosmoKlub || {};

const VALID_TABS = [
  'forum',
  'library',
  'planetarium',
  'chat'
];

// Icons for the topbar hamburger dropdown. Forum/Library/Calculator/Chat
// reuse the exact glyphs already used elsewhere in the dashboard; Profile
// and Minigames are new since those destinations don't exist yet.
const NAV_ICONS = {
  forum: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/></svg>`,
  library: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  calculator: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="8" y2="10"/><line x1="12" y1="10" x2="12" y2="10"/><line x1="16" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="8" y2="14"/><line x1="12" y1="14" x2="12" y2="14"/><line x1="16" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="16" y2="18"/></svg>`,
  chat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
  profile: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.5 3.6-8 8-8s8 3.5 8 8"/></svg>`,
  minigames: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="11" rx="5.5"/><path d="M7 10v5M4.5 12.5h5"/><circle cx="16" cy="10.5" r="1"/><circle cx="18.5" cy="13" r="1"/></svg>`
};

// Destinations shown in the topbar hamburger dropdown, in the requested
// order. `tab` is null for pages that don't exist yet (Profile, Minigames)
// — they're listed for visibility but intentionally not linked anywhere.
const NAV_DESTINATIONS = [
  { key: 'forum', label: 'Forum', desc: 'Ask questions & share observations', tab: 'forum', icon: NAV_ICONS.forum },
  { key: 'library', label: 'Library', desc: 'NASA imagery & mission archives', tab: 'library', icon: NAV_ICONS.library },
  { key: 'calculator', label: 'Calculator', desc: 'Graph, solve & compute live', tab: 'planetarium', icon: NAV_ICONS.calculator },
  { key: 'chat', label: 'Chat', desc: 'Message the community', tab: 'chat', icon: NAV_ICONS.chat },
  { key: 'profile', label: 'Profile', desc: 'Your account & progress', tab: null, icon: NAV_ICONS.profile },
  { key: 'minigames', label: 'Minigames', desc: 'Space themed mini games', tab: null, icon: NAV_ICONS.minigames }
];

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

/* =========================================================
   LIQUID GLASS FAB
   ========================================================= */

function attachLiquidFab(node) {
  if (!node) {
    return;
  }

  let previousX = null;
  let previousY = null;
  let previousTime = performance.now();

  let currentStretchX = 1;
  let currentStretchY = 1;
  let targetStretchX = 1;
  let targetStretchY = 1;

  let currentRotate = 0;
  let targetRotate = 0;

  let animationFrame = null;

  function animateLiquid() {
    currentStretchX +=
      (targetStretchX - currentStretchX) * 0.15;

    currentStretchY +=
      (targetStretchY - currentStretchY) * 0.15;

    currentRotate +=
      (targetRotate - currentRotate) * 0.15;

    node.style.setProperty(
      '--fab-scale-x',
      currentStretchX.toFixed(4)
    );

    node.style.setProperty(
      '--fab-scale-y',
      currentStretchY.toFixed(4)
    );

    node.style.setProperty(
      '--fab-rotate',
      `${currentRotate.toFixed(2)}deg`
    );

    const moving =
      Math.abs(currentStretchX - targetStretchX) > 0.001 ||
      Math.abs(currentStretchY - targetStretchY) > 0.001 ||
      Math.abs(currentRotate - targetRotate) > 0.05;

    if (moving) {
      animationFrame = requestAnimationFrame(animateLiquid);
    } else {
      animationFrame = null;
    }
  }

  function startAnimation() {
    if (!animationFrame) {
      animationFrame = requestAnimationFrame(animateLiquid);
    }
  }

  function handlePointerMove(event) {
    const rect = node.getBoundingClientRect();

    const localX = event.clientX - rect.left;
    const localY = event.clientY - rect.top;

    const percentX = Math.max(
      0,
      Math.min(100, (localX / rect.width) * 100)
    );

    const percentY = Math.max(
      0,
      Math.min(100, (localY / rect.height) * 100)
    );

    const normalizedX = (percentX - 50) / 50;
    const normalizedY = (percentY - 50) / 50;

    node.style.setProperty('--fab-glass-x', `${percentX}%`);
    node.style.setProperty('--fab-glass-y', `${percentY}%`);
    node.style.setProperty('--fab-liquid-x', normalizedX.toFixed(3));
    node.style.setProperty('--fab-liquid-y', normalizedY.toFixed(3));
    node.style.setProperty(
      '--fab-highlight-x',
      `${50 + normalizedX * 21}%`
    );
    node.style.setProperty(
      '--fab-highlight-y',
      `${32 + normalizedY * 18}%`
    );

    const now = performance.now();
    const deltaTime = Math.max(8, now - previousTime);

    if (previousX !== null && previousY !== null) {
      const velocityX = (event.clientX - previousX) / deltaTime;
      const velocityY = (event.clientY - previousY) / deltaTime;

      const speed = Math.min(
        1,
        Math.hypot(velocityX, velocityY) * 0.9
      );

      targetStretchX =
        1 + Math.min(0.12, Math.abs(velocityX) * 0.085);

      targetStretchY =
        1 + Math.min(0.12, Math.abs(velocityY) * 0.085);

      if (Math.abs(velocityX) > Math.abs(velocityY)) {
        targetStretchY =
          1 - Math.min(0.055, speed * 0.045);
      } else {
        targetStretchX =
          1 - Math.min(0.055, speed * 0.045);
      }

      targetRotate = Math.max(
        -6,
        Math.min(6, velocityX * 5)
      );
    }

    previousX = event.clientX;
    previousY = event.clientY;
    previousTime = now;

    node.classList.add('liquid-fab-hover');
    startAnimation();
  }

  function resetLiquid() {
    previousX = null;
    previousY = null;

    targetStretchX = 1;
    targetStretchY = 1;
    targetRotate = 0;

    node.style.setProperty('--fab-glass-x', '50%');
    node.style.setProperty('--fab-glass-y', '25%');
    node.style.setProperty('--fab-liquid-x', '0');
    node.style.setProperty('--fab-liquid-y', '0');
    node.style.setProperty('--fab-highlight-x', '50%');
    node.style.setProperty('--fab-highlight-y', '28%');

    node.classList.remove('liquid-fab-hover');
    startAnimation();
  }

  node.addEventListener('pointermove', handlePointerMove);
  node.addEventListener('pointerleave', resetLiquid);
  node.addEventListener('pointercancel', resetLiquid);

  node.addEventListener('pointerdown', () => {
    node.classList.add('liquid-fab-pressed');
  });

  node.addEventListener('pointerup', () => {
    node.classList.remove('liquid-fab-pressed');
  });

  node.addEventListener('pointerleave', () => {
    node.classList.remove('liquid-fab-pressed');
  });
}

/* =========================================================
   DASHBOARD NAVIGATION TRANSFORMATION
   ========================================================= */

let detachDashboardNavigation = null;

function attachDashboardNavigation(scroller, navigation) {
  if (!scroller || !navigation) {
    return () => {};
  }

  const INITIAL_EXIT_AT = 24;
  const COMPACT_AT = 220;
  const LEAVING_DURATION = 360;

  let leavingTimer = null;

  function clearLeavingTimer() {
    if (leavingTimer !== null) {
      window.clearTimeout(leavingTimer);
      leavingTimer = null;
    }
  }

  function updateNavigation() {
    const scrollPosition = scroller.scrollTop;
    const shouldCompact = scrollPosition >= COMPACT_AT;
    const shouldHideInitial = scrollPosition > INITIAL_EXIT_AT;

    if (shouldCompact) {
      clearLeavingTimer();

      navigation.classList.remove(
        'nav-away',
        'nav-leaving'
      );

      navigation.classList.add('compact');
      return;
    }

    if (navigation.classList.contains('compact')) {
      navigation.classList.remove(
        'compact',
        'nav-away'
      );

      navigation.classList.add('nav-leaving');
      clearLeavingTimer();

      leavingTimer = window.setTimeout(() => {
        navigation.classList.remove('nav-leaving');

        navigation.classList.toggle(
          'nav-away',
          scroller.scrollTop > INITIAL_EXIT_AT
        );

        leavingTimer = null;
      }, LEAVING_DURATION);

      return;
    }

    if (!navigation.classList.contains('nav-leaving')) {
      navigation.classList.toggle(
        'nav-away',
        shouldHideInitial
      );
    }
  }

  scroller.addEventListener(
    'scroll',
    updateNavigation,
    { passive: true }
  );

  updateNavigation();

  return () => {
    clearLeavingTimer();

    scroller.removeEventListener(
      'scroll',
      updateNavigation
    );

    navigation.classList.remove(
      'compact',
      'nav-away',
      'nav-leaving'
    );
  };
}

createApp({
  data() {
    return {
      activeTab: getTabFromUrl(),

      // Topbar popups: the hamburger navigation panel and the
      // profile dropdown. Only one is open at a time.
      menuOpen: false,
      profileOpen: false,

      tabComponents: {
        forum: Forum,
        library: Library,
        chat: Chat,
        planetarium: Planetarium
      }
    };
  },

  watch: {
    activeTab(newTab) {
      if (!VALID_TABS.includes(newTab)) {
        this.activeTab = 'forum';
        return;
      }

      setUrlTab(newTab);
      this.menuOpen = false;
      this.profileOpen = false;
    },

    // Opening one topbar popup closes the other.
    menuOpen(open) { if (open) this.profileOpen = false; },
    profileOpen(open) { if (open) this.menuOpen = false; }
  },

  computed: {
    navDestinations() {
      return NAV_DESTINATIONS;
    }
  },

  methods: {
    setTab(tab) {
      if (!VALID_TABS.includes(tab)) {
        return;
      }

      this.activeTab = tab;
    },

    // Dropdown item click. Destinations without a tab (Profile, Minigames)
    // don't exist yet, so this intentionally does nothing for them —
    // they're listed but not linked anywhere.
    goToDestination(dest) {
      if (!dest || !dest.tab) {
        return;
      }

      this.setTab(dest.tab);
    },

    closeTopbarPopups() {
      this.menuOpen = false;
      this.profileOpen = false;
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

    // Clicking anywhere outside a popup, or pressing Escape, closes it.
    document.addEventListener('click', this.closeTopbarPopups);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeTopbarPopups();
    });

    if (
      window.CosmoKlub &&
      typeof window.CosmoKlub.initStarfield === 'function'
    ) {
      window.CosmoKlub.initStarfield();
    }

    this.$nextTick(() => {
      const fab = document.querySelector('.nav-fab');
      const contentScroller = document.querySelector('.content');
      const dashboardNavigation = document.querySelector('.bottom-nav');

      attachLiquidFab(fab);

      if (detachDashboardNavigation) {
        detachDashboardNavigation();
      }

      detachDashboardNavigation = attachDashboardNavigation(
        contentScroller,
        dashboardNavigation
      );
    });
  },

  beforeUnmount() {
    if (detachDashboardNavigation) {
      detachDashboardNavigation();
      detachDashboardNavigation = null;
    }

    window.removeEventListener(
      'popstate',
      this.handlePopState
    );
  }
}).mount('#app');
