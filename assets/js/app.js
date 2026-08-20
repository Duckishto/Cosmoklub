const { createApp } = Vue;

window.CosmoKlub = window.CosmoKlub || {};

const VALID_TABS = [
  'forum',
  'library',
  'planetarium',
  'chat'
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
    }
  },

  methods: {
    setTab(tab) {
      if (!VALID_TABS.includes(tab)) {
        return;
      }

      this.activeTab = tab;
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
