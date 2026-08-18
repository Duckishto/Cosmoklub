const { createApp } = Vue;

// ---------- Feature flags ----------
// Login/Register system is disabled (hidden) for now, per request.
// Nothing below this file or in index.html was deleted — the auth modal
// markup, translations, form validation, Supabase calls, and session
// listener are all still in place. This single flag just stops any of
// it from being reachable: openModal() refuses to open 'login'/'register',
// startExploring() skips straight to the dashboard instead of requiring
// an account, and the session-restore listener in mounted() is skipped.
// To bring the system back, set this to true.
const AUTH_ENABLED = true;

// ---------- SVG Icon Templates ----------
const SVGS = {
  telescope: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  satellite: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><line x1="12" y1="3" x2="12" y2="9"/><line x1="12" y1="15" x2="12" y2="21"/><line x1="3" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/></svg>`,
  layers: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
  chart: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  cpu: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>`,
  book: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
};

const OBJ_SVGS = {
  galaxy: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none"><ellipse cx="20" cy="20" rx="18" ry="7" stroke="#a855f7" stroke-width="1.2" opacity="0.6" transform="rotate(-25 20 20)"/><ellipse cx="20" cy="20" rx="12" ry="4" stroke="#c084fc" stroke-width="1" opacity="0.5" transform="rotate(-25 20 20)"/><circle cx="20" cy="20" r="2.5" fill="#e9d5ff" opacity="0.9"/></svg>`,
  nebula: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none"><radialGradient id="nb" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#e9d5ff" stop-opacity="0.8"/><stop offset="60%" stop-color="#a855f7" stop-opacity="0.4"/><stop offset="100%" stop-color="#7c3aed" stop-opacity="0"/></radialGradient><circle cx="20" cy="20" r="18" fill="url(#nb)"/><circle cx="20" cy="20" r="4" fill="#e9d5ff" opacity="0.9"/></svg>`,
  cluster: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="1.8" fill="#f5f3ff"/><circle cx="14" cy="16" r="1.4" fill="#e9d5ff" opacity="0.9"/><circle cx="26" cy="16" r="1.4" fill="#e9d5ff" opacity="0.9"/><circle cx="14" cy="24" r="1.4" fill="#e9d5ff" opacity="0.8"/><circle cx="26" cy="24" r="1.4" fill="#e9d5ff" opacity="0.8"/><circle cx="20" cy="12" r="1.2" fill="#c084fc" opacity="0.8"/><circle cx="20" cy="28" r="1.2" fill="#c084fc" opacity="0.8"/></svg>`,
  ring: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="14" stroke="#a855f7" stroke-width="1.5" opacity="0.5" stroke-dasharray="3 2"/><circle cx="20" cy="20" r="9" stroke="#c084fc" stroke-width="2" opacity="0.6"/><circle cx="20" cy="20" r="4" fill="#e9d5ff" opacity="0.85"/></svg>`,
  supernova: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="5" fill="#f5f3ff" opacity="0.95"/><line x1="20" y1="4" x2="20" y2="12" stroke="#e9d5ff" stroke-width="1.5" stroke-linecap="round"/><line x1="20" y1="28" x2="20" y2="36" stroke="#e9d5ff" stroke-width="1.5" stroke-linecap="round"/><line x1="4" y1="20" x2="12" y2="20" stroke="#e9d5ff" stroke-width="1.5" stroke-linecap="round"/><line x1="28" y1="20" x2="36" y2="20" stroke="#e9d5ff" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  whirlpool: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M20 20 Q28 10 32 20 Q28 32 20 28 Q12 24 14 16 Q18 8 26 12" stroke="#a855f7" stroke-width="1.4" fill="none" opacity="0.7" stroke-linecap="round"/><circle cx="20" cy="20" r="3" fill="#c084fc" opacity="0.9"/></svg>`,
  globular: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="14" fill="none" stroke="#7c3aed" stroke-width="0.8" opacity="0.3"/><circle cx="20" cy="20" r="3" fill="#f5f3ff" opacity="0.95"/><circle cx="20" cy="12" r="1.5" fill="#e9d5ff" opacity="0.85"/><circle cx="20" cy="28" r="1.5" fill="#e9d5ff" opacity="0.85"/><circle cx="12" cy="20" r="1.5" fill="#e9d5ff" opacity="0.85"/><circle cx="28" cy="20" r="1.5" fill="#e9d5ff" opacity="0.85"/></svg>`,
  lagoon: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none"><radialGradient id="lg" cx="45%" cy="55%" r="50%"><stop offset="0%" stop-color="#c084fc" stop-opacity="0.8"/><stop offset="70%" stop-color="#7c3aed" stop-opacity="0.3"/><stop offset="100%" stop-color="#7c3aed" stop-opacity="0"/></radialGradient><ellipse cx="20" cy="22" rx="16" ry="11" fill="url(#lg)"/><circle cx="18" cy="20" r="2.5" fill="#f5f3ff" opacity="0.9"/></svg>`,
};

// ---------- Hero product-card art + pill icons ----------
// All six hero cards are drawn UI so they scale crisply at any size and
// never depend on external screenshot assets.
const HERO_SVGS = {
  // 3D planetarium viewer mock
  // Community / forum mock
  // Observer profile mock (new left-side floating card)
  // Object browser mock (main hero screenshot)
  // Astronomy Picture of the Day mock
  // Function grapher / orbit plot mock
  // Media gallery mock
  // small pill icons
  pinGrid: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.4"/><rect x="14" y="3" width="7" height="7" rx="1.4"/><rect x="3" y="14" width="7" height="7" rx="1.4"/><rect x="14" y="14" width="7" height="7" rx="1.4"/></svg>`,
  image: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
  grid: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
  graph: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M19 9l-5 5-4-4-4 4"/></svg>`,
  orbit: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(-25 12 12)"/></svg>`,
  chat: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8A8.5 8.5 0 0 1 21 11.5z"/></svg>`
};

// ---------- Complete Translations ----------
const GAME_SVGS = {
  moonNew: `<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="15" fill="#141033" stroke="#5b4a8a" stroke-width="1.4"/></svg>`,
  moonWaxCres: `<svg viewBox="0 0 40 40" fill="none"><defs><clipPath id="gwc"><circle cx="20" cy="20" r="15"/></clipPath></defs><circle cx="20" cy="20" r="15" fill="#141033" stroke="#5b4a8a" stroke-width="1.4"/><g clip-path="url(#gwc)"><ellipse cx="27" cy="20" rx="12" ry="15" fill="#e9dcff"/></g></svg>`,
  moonFirstQ: `<svg viewBox="0 0 40 40" fill="none"><defs><clipPath id="gfq"><circle cx="20" cy="20" r="15"/></clipPath></defs><circle cx="20" cy="20" r="15" fill="#141033" stroke="#5b4a8a" stroke-width="1.4"/><g clip-path="url(#gfq)"><rect x="20" y="5" width="15" height="30" fill="#e9dcff"/></g></svg>`,
  moonWaxGib: `<svg viewBox="0 0 40 40" fill="none"><defs><clipPath id="gwg"><circle cx="20" cy="20" r="15"/></clipPath></defs><circle cx="20" cy="20" r="15" fill="#e9dcff" stroke="#5b4a8a" stroke-width="1.4"/><g clip-path="url(#gwg)"><ellipse cx="13" cy="20" rx="8" ry="15" fill="#141033"/></g></svg>`,
  moonFull: `<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="15" fill="#e9dcff" stroke="#a855f7" stroke-width="1.4"/><circle cx="15" cy="16" r="3" fill="#cbb8ef" opacity=".55"/><circle cx="24" cy="24" r="2.2" fill="#cbb8ef" opacity=".45"/></svg>`,
  moonWanGib: `<svg viewBox="0 0 40 40" fill="none"><defs><clipPath id="gng"><circle cx="20" cy="20" r="15"/></clipPath></defs><circle cx="20" cy="20" r="15" fill="#e9dcff" stroke="#5b4a8a" stroke-width="1.4"/><g clip-path="url(#gng)"><ellipse cx="27" cy="20" rx="8" ry="15" fill="#141033"/></g></svg>`,
  moonLastQ: `<svg viewBox="0 0 40 40" fill="none"><defs><clipPath id="glq"><circle cx="20" cy="20" r="15"/></clipPath></defs><circle cx="20" cy="20" r="15" fill="#141033" stroke="#5b4a8a" stroke-width="1.4"/><g clip-path="url(#glq)"><rect x="5" y="5" width="15" height="30" fill="#e9dcff"/></g></svg>`,
  moonWanCres: `<svg viewBox="0 0 40 40" fill="none"><defs><clipPath id="gnc"><circle cx="20" cy="20" r="15"/></clipPath></defs><circle cx="20" cy="20" r="15" fill="#141033" stroke="#5b4a8a" stroke-width="1.4"/><g clip-path="url(#gnc)"><ellipse cx="13" cy="20" rx="12" ry="15" fill="#e9dcff"/></g></svg>`,
  starMain: `<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="9" fill="#fde68a"/><circle cx="20" cy="20" r="13" fill="#fde68a" opacity=".22"/></svg>`,
  starRedGiant: `<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="15" fill="#f87171" opacity=".9"/><circle cx="20" cy="20" r="15" fill="#f87171" opacity=".25"/></svg>`,
  nebulaPuff: `<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="16" fill="#c084fc" opacity=".16"/><circle cx="20" cy="20" r="16" stroke="#c084fc" stroke-width="1.3" stroke-dasharray="3 3" opacity=".7"/><circle cx="20" cy="20" r="10" fill="#a855f7" opacity=".28"/><circle cx="20" cy="20" r="4" fill="#fde68a"/></svg>`,
  whiteDwarf: `<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="6" fill="#ffffff"/><circle cx="20" cy="20" r="11" fill="#ffffff" opacity=".18"/></svg>`,
  supernova: `<svg viewBox="0 0 40 40" fill="none"><g stroke="#fbbf24" stroke-width="2" stroke-linecap="round"><line x1="20" y1="4" x2="20" y2="12"/><line x1="20" y1="28" x2="20" y2="36"/><line x1="4" y1="20" x2="12" y2="20"/><line x1="28" y1="20" x2="36" y2="20"/><line x1="9" y1="9" x2="14" y2="14"/><line x1="26" y1="26" x2="31" y2="31"/><line x1="31" y1="9" x2="26" y2="14"/><line x1="14" y1="26" x2="9" y2="31"/></g><circle cx="20" cy="20" r="6" fill="#fde68a"/></svg>`,
  blackHole: `<svg viewBox="0 0 40 40" fill="none"><ellipse cx="20" cy="20" rx="16" ry="5" stroke="#c084fc" stroke-width="1.6" opacity=".8"/><circle cx="20" cy="20" r="7.5" fill="#07061a" stroke="#a855f7" stroke-width="1.4"/></svg>`,
  cometIce: `<svg viewBox="0 0 40 40" fill="none"><path d="M20 9 L28 14 L27 25 L20 31 L13 25 L12 14 Z" fill="#bae6fd" stroke="#e0f2fe" stroke-width="1.3" stroke-linejoin="round"/><path d="M20 9 v22 M12 14 l16 11 M28 14 l-16 11" stroke="#7dd3fc" stroke-width="0.9" opacity=".7"/></svg>`,
  comet: `<svg viewBox="0 0 40 40" fill="none"><path d="M30 10 L14 26" stroke="#93c5fd" stroke-width="3" stroke-linecap="round" opacity=".6"/><circle cx="29" cy="11" r="5" fill="#e0f2fe"/></svg>`,
  cometTail: `<svg viewBox="0 0 40 40" fill="none"><g stroke="#93c5fd" stroke-width="2" stroke-linecap="round" opacity=".75"><path d="M28 12 L8 28"/><path d="M31 16 L13 30"/><path d="M24 8 L6 22"/></g><circle cx="30" cy="11" r="4.5" fill="#e0f2fe"/></svg>`,
  sun: `<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="10" fill="#fbbf24"/><g stroke="#fbbf24" stroke-width="2" stroke-linecap="round" opacity=".8"><line x1="20" y1="3" x2="20" y2="8"/><line x1="20" y1="32" x2="20" y2="37"/><line x1="3" y1="20" x2="8" y2="20"/><line x1="32" y1="20" x2="37" y2="20"/></g></svg>`,
  eclipse: `<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="14" fill="#fbbf24" opacity=".35"/><circle cx="20" cy="20" r="11" fill="#07061a" stroke="#fde68a" stroke-width="1.6"/></svg>`,
  cloud: `<svg viewBox="0 0 40 40" fill="none"><path d="M11 27 a6 6 0 0 1 .6-11.9 8 8 0 0 1 15.3-1.6A6.5 6.5 0 0 1 29 27 Z" fill="#8b93a7" opacity=".55" stroke="#aab2c4" stroke-width="1.2" stroke-linejoin="round"/></svg>`,
  collapse: `<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="5" fill="#c084fc"/><g stroke="#c084fc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 3 v6"/><path d="M17 6 l3 3 3-3"/><path d="M20 37 v-6"/><path d="M17 34 l3-3 3 3"/><path d="M3 20 h6"/><path d="M6 17 l3 3-3 3"/><path d="M37 20 h-6"/><path d="M34 17 l-3 3 3 3"/></g></svg>`,
  sparkle: `<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="7" fill="#fde68a"/><circle cx="20" cy="20" r="11" fill="#fde68a" opacity=".2"/><g stroke="#fde68a" stroke-width="1.8" stroke-linecap="round" opacity=".85"><line x1="20" y1="4" x2="20" y2="10"/><line x1="20" y1="30" x2="20" y2="36"/><line x1="4" y1="20" x2="10" y2="20"/><line x1="30" y1="20" x2="36" y2="20"/></g></svg>`,
  galaxy: `<svg viewBox="0 0 40 40" fill="none"><ellipse cx="20" cy="20" rx="15" ry="7" transform="rotate(-20 20 20)" fill="#a855f7" opacity=".3"/><ellipse cx="20" cy="20" rx="9" ry="4" transform="rotate(-20 20 20)" fill="#c084fc" opacity=".55"/><circle cx="20" cy="20" r="2.6" fill="#ffffff"/></svg>`,
  merge: `<svg viewBox="0 0 40 40" fill="none"><ellipse cx="12" cy="20" rx="8" ry="4" transform="rotate(-18 12 20)" fill="#c084fc" opacity=".55"/><circle cx="12" cy="20" r="2" fill="#fff"/><ellipse cx="28" cy="20" rx="8" ry="4" transform="rotate(18 28 20)" fill="#a855f7" opacity=".55"/><circle cx="28" cy="20" r="2" fill="#fff"/><path d="M17 20 h6" stroke="#e9dcff" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="2 2"/></svg>`,
  rainbow: `<svg viewBox="0 0 40 40" fill="none"><path d="M7 29 a13 13 0 0 1 26 0" stroke="#f472b6" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M11.5 29 a8.5 8.5 0 0 1 17 0" stroke="#fbbf24" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M16 29 a4 4 0 0 1 8 0" stroke="#34d399" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`,
  planet: `<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="9" fill="#c084fc"/><ellipse cx="20" cy="20" rx="16" ry="5" stroke="#e9dcff" stroke-width="1.4" opacity=".75"/></svg>`
};

const translations = {
  EN: {
    eyebrow: 'Next-Gen Astronomy Platform',
    heroLine1: 'Explore the', heroAccent: 'Night Sky', heroLine2: 'with Precision',
    heroSub: 'Discover celestial objects, plan observations, analyze astronomical data, and connect with the <span class="kw">global astronomy community</span>.',
    startBtn: 'Start Exploring', learnBtn: 'Learn more',
    openTool: 'Open tool',
    heroTagCategory: 'Astronomy', heroTagBuilder: 'Object Browser',
    shotObject: 'Object Browser', shotObjectDesc: 'Search 22,000+ NASA images, videos, and mission media in one place.',
    shotApod: 'Astronomy Picture', shotApodDesc: 'A new featured image every day, with the full story behind it.',
    shotGallery: 'Media Gallery', shotGalleryDesc: 'Browse curated collections from the Moon, Mars, and deep space.',
    shotGraph: 'Function Grapher', shotGraphDesc: 'Plot equations and explore orbits with an interactive graphing tool.',
    shotPlanet: '3D Planetarium', shotPlanetDesc: 'Spin real planet models and trace their orbits in your browser.',
    shotForum: 'Community', shotForumDesc: 'Share observations and talk astronomy with the CosmoKlub crew.',
    shotObserver: 'Observer Profile', shotObserverDesc: 'Track your logged sessions, badges, and standing in the CosmoKlub community.',
    featLabel: 'Features', featTitle: 'Everything the cosmos demands',
    featSub: '<span class="kw">Precision tools</span> for amateur observers and professional researchers alike.',
    objLabel: 'Objects', objTitle: 'Deep-sky catalogue',
    objSub: '<span class="kw">Thousands of catalogued objects</span> from our expanding database.',
    signIn: 'Sign in', register: 'Register',
    createAcc: 'Create Account', welcomeBack: 'Welcome back',
    loginSub: 'Sign in to your observatory', joinUs: 'Join thousands of astronomers',
    firstName: 'First Name', lastName: 'Last Name', firstPH: 'Galileo', lastPH: 'Galilei',
    usernameLabel: 'Username', usernamePH: 'galileo_g',
    genderLabel: 'Gender', genderPH: 'Select gender',
    genderMale: 'Male', genderFemale: 'Female', genderOther: 'Other', genderPNTS: 'Prefer not to say',
    emailLabel: 'Email', emailPH: 'you@cosmos.space', passLabel: 'Password',
    passPH: 'Min. 8 characters', confirmPass: 'Confirm Password', confirmPH: 'Repeat password',
    tosAgree: 'I agree to the', tosAnd: 'and', forgotPass: 'Forgot password?',
    orContinue: 'or continue with', loading: 'Loading...',
    successReg: 'Welcome to CosmoKlub', successLogin: 'Welcome back',
    confirmEmailTitle: 'Check your inbox', confirmEmailSub: "We've sent a confirmation link to",
    gotIt: 'Got it',
    successSub: 'Your observatory is ready. Start exploring the cosmos.',
    exploreNow: 'Explore Now',
    tos: 'Terms of Service', privacy: 'Privacy Policy', applyStaff: 'Staff Application',
    rights: 'All rights reserved.', tosDate: 'Last updated June 2026',
    accept: 'I Accept',
    tos1Title: 'Acceptance of Terms',
    tos1Body: 'By accessing or using CosmoKlub ("the Service"), you confirm that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to all of these terms, you must not use the Service. We may update these Terms at any time; continued use after changes constitutes your acceptance of the revised Terms.',
    tos2Title: 'Eligibility & Account Responsibility',
    tos2Body: 'You must be at least 13 years old to create an account. You are responsible for keeping your login credentials confidential and for all activity that occurs under your account. Notify us immediately at hello@cosmoklub.space if you suspect any unauthorised access. CosmoKlub is not liable for losses arising from your failure to protect your credentials.',
    tos3Title: 'Permitted Use of the Service',
    tos3Body: 'CosmoKlub grants you a personal, non-exclusive, non-transferable licence to use the Service for lawful astronomical observation, research, education, and community discussion. You may not use the Service to violate any applicable law, infringe third-party rights, distribute malware, scrape data without permission, or engage in any activity that disrupts or damages the platform.',
    tos4Title: 'Community Chat & Messaging',
    tos4Body: 'Our chat and messaging features are provided to foster a respectful astronomy community. You agree not to send spam, unsolicited promotions, hate speech, harassment, threats, sexually explicit content, or any content that targets individuals on the basis of race, religion, gender, sexual orientation, disability, or nationality. CosmoKlub may monitor messages for safety purposes and reserves the right to remove content or terminate accounts that violate these standards without prior notice.',
    tos5Title: 'User-Generated Content & Posts',
    tos5Body: 'You retain ownership of content you post (observations, photos, comments, logbook entries). By posting, you grant CosmoKlub a worldwide, royalty-free, sublicensable licence to display, distribute, and promote that content within the Service. You represent that you own or have the necessary rights to all content you submit, and that it does not infringe any copyright, trademark, privacy, or other rights. CosmoKlub may remove any content that violates these Terms or that we deem harmful, misleading, or off-topic.',
    tos6Title: 'AI Features & Automated Tools',
    tos6Body: 'CosmoKlub offers AI-powered features including Pensia (our astronomy AI assistant) and AI Object Recognition for astrophotographs. These tools are provided as-is and may produce inaccurate, incomplete, or outdated results. Do not rely solely on AI output for critical decisions. You may not attempt to reverse-engineer, manipulate, or misuse AI features. Content submitted to AI tools (e.g., uploaded photos) may be processed by third-party model providers subject to their own data handling policies; no personally identifiable information is stored beyond session duration.',
    tos7Title: 'Data, Privacy & Cookies',
    tos7Body: 'We collect only the data necessary to operate, improve, and personalise the Service (account information, usage logs, observation data). Your personal information is never sold to third parties. We use cookies for authentication and analytics; you may disable non-essential cookies in your browser settings. Full details are in our Privacy Policy. Users in the EU/EEA have the right to access, correct, or delete their personal data by contacting hello@cosmoklub.space.',
    tos8Title: 'Intellectual Property',
    tos8Body: 'All original content, software, databases, 3D models, visual designs, and tools within the Service are the intellectual property of CosmoKlub and its licensors, protected by international copyright, trademark, and database laws. You may not copy, redistribute, or create derivative works from any CosmoKlub content without prior written permission. Astronomical data sourced from public catalogues (NASA, ESA, IAU) remains subject to their respective licences.',
    tos9Title: 'Limitation of Liability & Disclaimers',
    tos9Body: 'The Service and all astronomical data are provided "as is" without warranties of any kind, express or implied, including accuracy, completeness, or fitness for a particular purpose. To the maximum extent permitted by law, CosmoKlub shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the Service, even if advised of the possibility of such damages.',
    tos10Title: 'Termination & Governing Law',
    tos10Body: 'CosmoKlub reserves the right to suspend or permanently terminate your account at any time for breach of these Terms, without notice or liability. You may delete your account at any time via account settings. These Terms are governed by the laws of the jurisdiction in which CosmoKlub operates, and any disputes shall be resolved in the competent courts of that jurisdiction. If any provision of these Terms is found unenforceable, the remaining provisions remain in full effect.',
    tos11Title: 'Third-Party Services & Indemnification',
    tos11Body: 'CosmoKlub may link to or rely on third-party services, astronomical catalogues, or mapping data that we do not own or control; we are not responsible for their content, accuracy, or availability, and accessing them is at your own risk. You agree to indemnify and hold CosmoKlub and its team harmless from any claims, damages, or expenses (including reasonable legal fees) arising from your use of the Service, your content, or your violation of these Terms.',
    tos12Title: 'Changes to These Terms & Contact',
    tos12Body: 'We may revise these Terms from time to time to reflect changes to the Service or applicable law; the "Last updated" date above will always show the latest version, and continued use of the Service after changes constitutes acceptance. These Terms, together with our Privacy Policy, constitute the entire agreement between you and CosmoKlub regarding the Service. If you have any questions, reach out to us at hello@cosmoklub.space.',
    privacy1Title: 'Information We Collect',
    privacy1Body: 'We collect information you provide directly (name, email, password, profile details, observation logs, photos you upload) and information collected automatically (device type, browser, IP address, approximate location, pages visited, and usage patterns). If you use AI features such as Pensia or AI Object Recognition, we also process the content you submit to those tools for the duration needed to generate a response.',
    privacy2Title: 'How We Use Your Information',
    privacy2Body: 'We use your information to operate and improve the Service, personalise your dashboard and recommendations, authenticate your account, respond to support requests, send service-related notifications, and analyse usage trends. We do not use your personal information for purposes incompatible with these stated uses without first asking for your consent.',
    privacy3Title: 'Cookies & Tracking Technologies',
    privacy3Body: 'CosmoKlub uses cookies and similar technologies for authentication, session management, and analytics. Essential cookies are required for the Service to function; analytics cookies help us understand how the Service is used. You can disable non-essential cookies through your browser settings, though this may affect certain features.',
    privacy4Title: 'AI Features & Data Processing',
    privacy4Body: 'Content you submit to AI-powered features, including chat messages to Pensia and photos uploaded for AI Object Recognition, may be processed by third-party model providers strictly to generate a response. We do not use this content to train models beyond your session, and no personally identifiable information is retained by these providers beyond what is required to deliver the feature.',
    privacy5Title: 'How We Share Your Information',
    privacy5Body: 'We do not sell your personal information. We may share data with service providers who help us operate the platform (hosting, analytics, email delivery) under confidentiality obligations, or when required by law, to enforce our Terms of Service, or to protect the rights, safety, and property of CosmoKlub and our users. Aggregated or anonymised data may be shared publicly or with partners.',
    privacy6Title: 'Data Security',
    privacy6Body: 'We use industry-standard safeguards, including encryption in transit and access controls, to protect your information against unauthorised access, alteration, or loss. No method of transmission or storage is completely secure, and we encourage you to use a strong, unique password for your account.',
    privacy7Title: 'Data Retention & Deletion',
    privacy7Body: 'We retain your personal information for as long as your account is active or as needed to provide the Service. You may delete your account at any time through account settings; upon deletion, we remove or anonymise your personal data within a reasonable period, except where retention is required for legal, security, or legitimate business purposes.',
    privacy8Title: 'Your Rights & Choices',
    privacy8Body: 'Depending on your location, you may have the right to access, correct, export, or delete your personal data, and to object to or restrict certain processing. Users in the EU/EEA, UK, and other regions with similar laws may exercise these rights by contacting hello@cosmoklub.space; we will respond within the timeframe required by applicable law.',
    privacy9Title: "Children's Privacy",
    privacy9Body: 'CosmoKlub is not directed at children under 13, and we do not knowingly collect personal information from them. If we learn that a child under 13 has provided us with personal information, we will delete it promptly. Parents or guardians who believe their child has provided us with information should contact hello@cosmoklub.space.',
    privacy10Title: 'International Data Transfers',
    privacy10Body: 'Your information may be transferred to and processed in countries other than your own, which may have different data protection laws. Where required, we rely on appropriate safeguards, such as standard contractual clauses, to ensure your data receives an adequate level of protection wherever it is processed.',
    privacy11Title: 'Changes to This Policy & Contact',
    privacy11Body: 'We may update this Privacy Policy from time to time to reflect changes to our practices or applicable law; the "Last updated" date will always show the latest version, and continued use of the Service after changes constitutes acceptance. If you have questions about this Policy or how we handle your data, contact us at hello@cosmoklub.space.',
    errFirst: 'First name is required', errLast: 'Last name is required',
    errUsername: 'Username is required', errUsernameShort: 'Username must be at least 3 characters',
    errGender: 'Please select a gender',
    errEmail: 'A valid email is required', errPass: 'Password must be at least 8 characters',
    errConfirm: 'Passwords do not match', errTos: 'You must accept the Terms of Service',
    errNoSupabase: 'Sign-up is not configured yet. Please try again later.',
    toastReg: 'Account created. Welcome to CosmoKlub.', toastLogin: 'Signed in successfully.'
  }
};

// ---------- Vue App ----------
createApp({
  data() {
    return {
      modal: null,
      authTab: 'register',
      billing: 'monthly',
      openFaq: null,
      gameRoundIndex: 0,
      gamePicked: null,
      gameStreak: 0,
      gameUnlocked: [],
      gameSolved: 0,
      sectionImages: {
        featurePanel: '',
        ctaBanner: ''
      },
      heroImages: {
        objectBrowser: '',
        apod: '',
        grapher: '',
        gallery: '',
        planetarium: '',
        community: '',
        observer: ''
      },
      stats: { objects: null, asteroids: null, apodDays: null },
      pensiaOpen: false,
      pensiaLoading: false,
      pensiaMsg: '',
      pensiaHeadline: '',
      pensiaCloseTimer: null,
      pensiaArticle: null,
      pensiaArticleOpen: false,
      pensiaImageLoaded: false,
      pensiaPos: { x: 0, y: 0 },
      pensiaReady: false,
      pensiaTilt: 0,
      pensiaDragging: false,
      pensiaBubbleFlip: { below: false, left: false },
      form: { firstName: '', lastName: '', username: '', gender: '', email: '', password: '', confirm: '', tos: false },
      errors: {},
      loading: false,
      socialLoading: false,
      success: false,
      currentUser: null,
      pendingEmailConfirm: false,
      toast: null,
      legalScrolled: false,
      navScrolled: false,
      navCompact: false,
      navLeaving: false,
      mobileMenuOpen: false,
      activeShot: 0,
      shotModal: null
    };
  },
  computed: {
    t() { return translations.EN; },
    features() {
      return [
        { svg: SVGS.telescope, title: 'Interactive Sky Map', desc: 'Real-time star map synchronized with your location, time, and viewing conditions.' },
        { svg: SVGS.satellite, title: 'Observation Planner', desc: 'Find the best objects visible tonight based on your telescope, location, and weather.' },
        { svg: SVGS.layers, title: 'Deep-Sky Catalogue', desc: 'Explore Messier, NGC, IC, planets, comets, asteroids, and thousands of celestial objects.' },
        { svg: SVGS.chart, title: 'Observing Conditions', desc: 'Moon phase, cloud cover, seeing, transparency, and light pollution forecasts.' },
        { svg: SVGS.cpu, title: 'AI Object Recognition', desc: 'Upload astrophotos and our model identifies every star, galaxy, and nebula automatically.' },
        { svg: SVGS.book, title: 'Observation Logbook', desc: 'Track observations, equipment used, sketches, notes, and achievements.' }
      ];
    },
    steps() {
      return [
        {
          title: 'Create your account',
          img: '',
          desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Set up your profile in minutes.',
          bullets: [
            { svg: SVGS.telescope, text: 'Lorem ipsum dolor' },
            { svg: SVGS.satellite, text: 'Consectetur adipiscing' },
            { svg: SVGS.layers, text: 'Sed do eiusmod' }
          ]
        },
        {
          title: 'Configure your tools',
          img: '',
          desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tailor everything to your workflow.',
          bullets: [
            { svg: SVGS.chart, text: 'Tempor incididunt' },
            { svg: SVGS.cpu, text: 'Ut labore et dolore' },
            { svg: SVGS.book, text: 'Magna aliqua enim' }
          ]
        },
        {
          title: 'Start exploring',
          img: '',
          desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dive into the night sky right away.',
          bullets: [
            { svg: SVGS.telescope, text: 'Ad minim veniam' },
            { svg: SVGS.layers, text: 'Quis nostrud exercitation' },
            { svg: SVGS.chart, text: 'Ullamco laboris nisi' }
          ]
        }
      ];
    },
    manage() {
      const panel = {
        title: 'Bring your learners on board with ease',
        img: '',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Add members one by one or import a CSV — everything is registered and ready without any manual work on your side.',
        bullets: [
          { svg: SVGS.satellite, text: 'Add members instantly' },
          { svg: SVGS.layers, text: 'Bulk-import via CSV' },
          { svg: SVGS.cpu, text: 'Migrate from other platforms' }
        ]
      };
      return [
        { ...panel, img: '' },
        { ...panel, img: '' },
        { ...panel, img: '' }
      ];
    },
    plans() {
      return [
        {
          name: 'Explorers',
          tagline: 'Everything you need to launch your first course.',
          free: true,
          popular: false,
          cta: 'Get started',
          features: [
            'Lorem ipsum (~2 courses with video)',
            'Consectetur adipiscing elit',
            'Sed do eiusmod tempor',
            'Incididunt ut labore',
            'Dolore magna aliqua',
            'Enim ad minim veniam'
          ]
        },
        {
          name: 'Lite',
          tagline: 'Everything in Free, plus:',
          monthly: 840, yearly: 758,
          popular: false,
          cta: 'Get started',
          features: [
            'Lorem ipsum (~5 courses with video)',
            'Quis nostrud exercitation',
            'Ullamco laboris nisi',
            'Ut aliquip ex ea commodo',
            'Duis aute irure dolor',
            'Reprehenderit voluptate'
          ]
        },
        {
          name: 'Pro',
          tagline: 'Everything in Lite, plus:',
          monthly: 3900, yearly: 3510,
          popular: true,
          cta: 'Get started',
          features: [
            'Lorem ipsum (~25 courses with video)',
            'Velit esse cillum dolore',
            '4K video quality (2160p)',
            'Excepteur sint occaecat',
            'Cupidatat non proident',
            'Sunt in culpa qui officia'
          ]
        },
        {
          name: 'Enterprise',
          tagline: 'Everything in Pro, plus:',
          custom: true,
          popular: false,
          cta: 'Contact us',
          features: [
            'Lorem ipsum (custom volume)',
            'Deserunt mollit anim id est',
            'Laborum sed ut perspiciatis',
            'Unde omnis iste natus',
            'Error sit voluptatem',
            'Accusantium doloremque'
          ]
        }
      ];
    },
    faqs() {
      return [
        {
          q: 'What is CosmoKlub and what features does it offer?',
          a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'
        },
        {
          q: 'Do I need any technical background to get started?',
          a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
        },
        {
          q: 'How long does it take to set everything up?',
          a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        {
          q: 'Can I import my existing data and content?',
          a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.'
        },
        {
          q: 'Is there a free trial, and how do I cancel?',
          a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur.'
        }
      ];
    },
    gameRounds() {
      const G = GAME_SVGS;
      return [
        {
          prompt: 'The Moon is waxing. What comes next?',
          sequence: [G.moonNew, G.moonWaxCres, G.moonFirstQ, G.moonWaxGib],
          options: [G.moonFull, G.moonLastQ, G.moonWanCres],
          labels: ['Full', 'Last quarter', 'Waning crescent'],
          answer: 0,
          badge: G.moonFull, badgeName: 'Full Circle',
          why: 'A waxing Moon grows toward full, so waxing gibbous is followed by the full Moon.'
        },
        {
          prompt: 'The Moon is waning. What comes next?',
          sequence: [G.moonFull, G.moonWanGib, G.moonLastQ, G.moonWanCres],
          options: [G.moonFirstQ, G.moonNew, G.moonWaxGib],
          labels: ['First quarter', 'New Moon', 'Waxing gibbous'],
          answer: 1,
          badge: G.moonNew, badgeName: 'Night Watcher',
          why: 'A waning Moon shrinks toward new, so the crescent is followed by the new Moon.'
        },
        {
          prompt: 'A Sun-like star runs out of core hydrogen. What comes next?',
          sequence: [G.starMain, G.starRedGiant, G.nebulaPuff],
          options: [G.blackHole, G.whiteDwarf, G.rainbow],
          labels: ['Black hole', 'White dwarf', 'Rainbow'],
          answer: 1,
          badge: G.whiteDwarf, badgeName: 'Stellar Undertaker',
          why: 'A Sun-like star swells into a red giant, sheds its layers, and leaves a white dwarf behind.'
        },
        {
          prompt: 'A massive star reaches core collapse. What comes next?',
          sequence: [G.starMain, G.starRedGiant, G.supernova],
          options: [G.blackHole, G.whiteDwarf, G.comet],
          labels: ['Black hole', 'White dwarf', 'Comet'],
          answer: 0,
          badge: G.blackHole, badgeName: 'Event Horizon',
          why: 'The most massive cores keep collapsing past neutron-star density and become black holes.'
        },
        {
          prompt: 'An icy comet falls toward the Sun. What comes next?',
          sequence: [G.cometIce, G.comet, G.sun],
          options: [G.planet, G.cometTail, G.galaxy],
          labels: ['Planet', 'Comet tail', 'Galaxy'],
          answer: 1,
          badge: G.comet, badgeName: 'Tail Chaser',
          why: 'Solar heating sublimates the icy nucleus, blowing dust and gas into a long bright tail.'
        },
        {
          prompt: 'The new Moon slides between Earth and the Sun. What comes next?',
          sequence: [G.sun, G.moonWanCres, G.moonNew],
          options: [G.eclipse, G.moonFull, G.sparkle],
          labels: ['Solar eclipse', 'Full Moon', 'Protostar'],
          answer: 0,
          badge: G.eclipse, badgeName: 'Eclipse Hunter',
          why: 'When the new Moon crosses directly in front of the Sun you get a solar eclipse.'
        },
        {
          prompt: 'A dense cloud inside a nebula collapses. What comes next?',
          sequence: [G.cloud, G.collapse, G.sparkle],
          options: [G.starMain, G.blackHole, G.planet],
          labels: ['New star', 'Black hole', 'Planet'],
          answer: 0,
          badge: G.starMain, badgeName: 'Star Midwife',
          why: 'Collapsing clouds heat up until hydrogen fusion ignites and a new star switches on.'
        },
        {
          prompt: 'Two galaxies drift into each other. What comes next?',
          sequence: [G.galaxy, G.merge, G.collapse],
          options: [G.moonFull, G.sparkle, G.cometIce],
          labels: ['Full Moon', 'Starburst', 'Icy nucleus'],
          answer: 1,
          badge: G.galaxy, badgeName: 'Galaxy Wrangler',
          why: 'Gravity pulls them into a merger, triggering intense bursts of new star formation.'
        }
      ];
    },
    gameRound() {
      return this.gameRounds[this.gameRoundIndex];
    },
    gameAnswered() {
      return this.gamePicked !== null;
    },
    gameCorrect() {
      return this.gameAnswered && this.gamePicked === this.gameRound.answer;
    },
    gameAnswerSvg() {
      return this.gameRound.options[this.gameRound.answer];
    },
    gameProgressLabel() {
      return this.gameSolved + ' / ' + this.gameRounds.length + ' solved';
    },
    gameProgressPct() {
      return Math.round((this.gameSolved / this.gameRounds.length) * 100);
    },
    footerCols() {
      return [
        {
          title: 'Platform',
          links: [
            { text: 'Object Browser', href: 'object.html' },
            { text: 'Astronomy Picture', href: 'object.html' },
            { text: 'Media Gallery', href: 'object.html' },
            { text: '3D Planetarium', href: 'object.html' }
          ]
        },
        {
          title: 'Explore',
          links: [
            { text: 'Lessons', href: 'lesson.html' },
            { text: 'Roadmap', href: 'roadmap.html' },
            { text: 'Dashboard', href: 'dashboard.html' },
            { text: 'Function Grapher', href: 'object.html' }
          ]
        },
        {
          title: 'Company',
          links: [
            { text: 'Our Team', href: 'team.html' },
            { text: 'Apply as Staff', href: 'staff-application.html' },
            { text: 'Community', href: '#' },
            { text: 'Contact', href: 'mailto:hello@cosmoklub.space' }
          ]
        },
        {
          title: 'Legal',
          links: [
            { text: 'Terms of Service', modal: 'tos' },
            { text: 'Privacy Policy', modal: 'privacy' },
            { text: 'Community Guidelines', href: '#' },
            { text: 'Cookie Policy', href: '#' }
          ]
        }
      ];
    },
    objects() {
      return [
        { svg: OBJ_SVGS.galaxy, type: 'Galaxy', name: 'Andromeda (M31)', desc: 'Nearest major galaxy, 2.5M light-years away.' },
        { svg: OBJ_SVGS.nebula, type: 'Nebula', name: 'Orion Nebula (M42)', desc: 'Active stellar nursery in the sword of Orion.' },
        { svg: OBJ_SVGS.cluster, type: 'Cluster', name: 'Pleiades (M45)', desc: 'Seven Sisters open cluster, visible to the naked eye.' },
        { svg: OBJ_SVGS.ring, type: 'Nebula', name: 'Ring Nebula (M57)', desc: 'Classic planetary nebula in Lyra.' },
        { svg: OBJ_SVGS.supernova, type: 'Supernova', name: 'Crab Nebula (M1)', desc: 'Remnant of SN 1054, powered by a pulsar.' },
        { svg: OBJ_SVGS.whirlpool, type: 'Galaxy', name: 'Whirlpool (M51)', desc: 'Interacting galaxy pair in Canes Venatici.' },
        { svg: OBJ_SVGS.globular, type: 'Cluster', name: 'Hercules Cluster (M13)', desc: 'Brightest globular cluster in the northern sky.' },
        { svg: OBJ_SVGS.lagoon, type: 'Nebula', name: 'Lagoon Nebula (M8)', desc: 'Emission nebula and open cluster in Sagittarius.' }
      ];
    },
    // Floating product cards in the hero — all six are drawn UI mocks so
    // they scale crisply and never depend on external screenshot assets.
    // `pos` drives placement (see .sc-* rules in style.css). Cards open a
    // lightbox on click; `href` cards also deep-link into the app tool.
    heroShots() {
      // `img` takes priority over `svg`. Drop a real screenshot into
      // assets/images/hero/ and set the path here; the SVG stays as a
      // fallback until an image is supplied.
      const H = this.heroImages;
      return [
        { key: 'shotObject',   descKey: 'shotObjectDesc',   img: H.objectBrowser, href: 'object.html' },
        { key: 'shotApod',     descKey: 'shotApodDesc',     pos: 'tr', img: H.apod,        href: 'object.html' },
        { key: 'shotGraph',    descKey: 'shotGraphDesc',    pos: 'tl', img: H.grapher,     href: 'object.html' },
        { key: 'shotGallery',  descKey: 'shotGalleryDesc',  pos: 'bl', img: H.gallery,     href: 'object.html' },
        { key: 'shotPlanet',   descKey: 'shotPlanetDesc',   pos: 'br', img: H.planetarium, href: 'object.html' },
        { key: 'shotForum',    descKey: 'shotForumDesc',    pos: 'rb', img: H.community,   href: 'object.html' },
        { key: 'shotObserver', descKey: 'shotObserverDesc', pos: 'll', img: H.observer,    href: 'object.html' }
      ];
    },
    // Everything except the big central image (index 0). `idx` keeps the
    // original heroShots index so activeShot / pill highlighting stays in sync.
    satelliteShots() {
      return this.heroShots.slice(1).map((s, i) => ({ ...s, idx: i + 1 }));
    },
    // Tool pills under the CTA — each focuses its matching card.
    heroTools() {
      return [
        { key: 'shotObject',  svg: HERO_SVGS.pinGrid },
        { key: 'shotApod',    svg: HERO_SVGS.image },
        { key: 'shotGallery', svg: HERO_SVGS.grid },
        { key: 'shotGraph',   svg: HERO_SVGS.graph },
        { key: 'shotPlanet',  svg: HERO_SVGS.orbit }
      ];
    }
  },
  watch: {
    navCompact(now, before) {
      // switching compact->normal flips position:fixed to absolute, which is
      // instant. Play a slide-up first so the bar leaves smoothly.
      if (before && !now) {
        this.navLeaving = true;
        clearTimeout(this._navLeaveT);
        this._navLeaveT = setTimeout(() => { this.navLeaving = false; }, 360);
      }
    }
  },
  methods: {
    pickGameOption(opt) {
      if (this.gameAnswered) return;
      this.gamePicked = opt;
      if (opt === this.gameRound.answer) {
        this.gameStreak += 1;
        const b = this.gameRound;
        if (!this.gameUnlocked.some(u => u.name === b.badgeName)) {
          this.gameUnlocked.push({ icon: b.badge, name: b.badgeName });
          this.gameSolved += 1;
        }
      } else {
        this.gameStreak = 0;
      }
    },
    resetGame() {
      this.gamePicked = null;
      this.gameRoundIndex = 0;
      this.gameStreak = 0;
      this.gameUnlocked = [];
      this.gameSolved = 0;
    },
    nextGameRound() {
      this.gamePicked = null;
      this.gameRoundIndex = (this.gameRoundIndex + 1) % this.gameRounds.length;
    },
    // --- Pensia drag-to-move ---
    onPensiaPointerDown(e) {
      e.currentTarget.setPointerCapture(e.pointerId);
      this._pensiaDrag = {
        startX: e.clientX,
        startY: e.clientY,
        baseX: this.pensiaPos.x,
        baseY: this.pensiaPos.y,
        moved: false
      };
    },
    onPensiaPointerMove(e) {
      const d = this._pensiaDrag;
      if (!d) return;
      const dx = e.clientX - d.startX;
      const dy = e.clientY - d.startY;
      if (!d.moved && Math.hypot(dx, dy) > 4) {
        d.moved = true;
        this.pensiaDragging = true;
        // dragging takes priority over the chat bubble — close it now
        // even if its auto-dismiss timer hasn't run out yet
        clearTimeout(this.pensiaCloseTimer);
        this.pensiaOpen = false;
      }
      if (d.moved) {
        const bounds = this.pensiaBounds();
        this.pensiaPos = {
          x: Math.min(Math.max(8, d.baseX + dx), bounds.maxX),
          y: Math.min(Math.max(8, d.baseY + dy), bounds.maxY)
        };
        // lean in the direction of horizontal motion, like she's
        // swinging as she's carried — clamped to a believable range
        const stepX = e.clientX - (d.lastX ?? e.clientX);
        d.lastX = e.clientX;
        const targetTilt = Math.max(-18, Math.min(18, stepX * 2.2));
        this.pensiaTilt += (targetTilt - this.pensiaTilt) * 0.35;
      }
    },
    onPensiaPointerUp() {
      const d = this._pensiaDrag;
      if (!d) return;
      this._pensiaDrag = null;
      this.pensiaDragging = false;
      this.pensiaTilt = 0;
      if (!d.moved) {
        // no real movement happened — treat it as a click/tap
        this.pensiaClick();
      }
      // note: by design, her position is NOT remembered between visits —
      // she resets to her default spot next to the Features heading every load
    },
    pensiaBounds() {
      const el = this.$refs.pensiaWrap;
      const w = el ? el.offsetWidth : 160;
      const h = el ? el.offsetHeight : 160;
      return {
        maxX: Math.max(8, document.documentElement.clientWidth - w - 8),
        maxY: Math.max(8, document.documentElement.scrollHeight - h - 8)
      };
    },
    clampPensiaPos() {
      const bounds = this.pensiaBounds();
      this.pensiaPos = {
        x: Math.min(Math.max(8, this.pensiaPos.x), bounds.maxX),
        y: Math.min(Math.max(8, this.pensiaPos.y), bounds.maxY)
      };
    },
    // Pensia's default home: to the right of "Everything the cosmos
    // demands" (the Features heading), same spot the original design
    // had her in. Re-run on load/resize/font-swap so she always lands
    // here and never gets stuck wherever the last layout pass left her.
    resetPensiaToDefault() {
      const headerEl = document.querySelector('.features-header-row');
      const el = this.$refs.pensiaWrap;
      if (!headerEl || !el || !el.offsetWidth) return;
      const rect = headerEl.getBoundingClientRect();
      if (!rect.width && !rect.height) return; // section not laid out yet
      const w = el.offsetWidth, h = el.offsetHeight;
      const bounds = this.pensiaBounds();
      const x = Math.round(rect.right + window.scrollX - w);
      const y = Math.round(rect.top + window.scrollY + (rect.height - h) / 2);
      this.pensiaPos = {
        x: Math.min(Math.max(8, x), bounds.maxX),
        y: Math.max(8, y)
      };
      this.pensiaReady = true;
    },
    async pensiaClick() {
      // the full-article modal owns the screen while it's open — ignore
      // taps on Pensia herself so we can't end up with the bubble closed
      // underneath an open modal and an orphaned scroll lock
      if (this.pensiaArticleOpen) return;
      clearTimeout(this.pensiaCloseTimer);
      if (!this.pensiaOpen) {
        // about to open — snapshot her current screen position so the
        // bubble can flip to whichever side keeps it fully visible
        const el = this.$refs.pensiaWrap;
        if (el) {
          const r = el.getBoundingClientRect();
          this.pensiaBubbleFlip = { below: r.top < 170, left: r.left < 200 };
        }
      }
      this.pensiaOpen = !this.pensiaOpen;
      if (!this.pensiaOpen) return;
      this.pensiaLoading = true;
      this.pensiaMsg = '';
      this.pensiaHeadline = '';
      this.pensiaArticle = null;
      this.pensiaImageLoaded = false;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4500);
        // Routed through our own /api/nasa proxy (Cloudflare Pages Function)
        // so the real NASA API key stays server-side as an environment
        // secret and is never shipped in client-side JS.
        const apodRes = await fetch(`/api/nasa?endpoint=apod&count=3`, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (!apodRes.ok) throw new Error(`NASA APOD request failed (${apodRes.status})`);
        const apodData = await apodRes.json();
        const pick = apodData[Math.floor(Math.random() * apodData.length)];
        const { headline, opinion, hasMore } = this.pensiaVoice(pick.title, pick.explanation || '');
        this.pensiaHeadline = headline;
        this.pensiaMsg = opinion;
        if (hasMore) {
          this.pensiaArticle = {
            title: pick.title,
            date: pick.date,
            // prefer the standard-res image — hdurl can be enormous
            // (multiple MB, sometimes 4000px+ on a side) and the modal
            // never displays it bigger than half a ~900px-wide card
            image: pick.media_type === 'image' ? (pick.url || pick.hdurl) : null,
            explanation: pick.explanation || '',
            headline,
            copyright: pick.copyright || null
          };
        }
      } catch (e) {
        const f = this.pensiaFallback();
        this.pensiaHeadline = f.h;
        this.pensiaMsg = f.m;
      }
      this.pensiaLoading = false;
      this.pensiaCloseTimer = setTimeout(() => {
        this.pensiaOpen = false;
      }, 8000);
    },
    pensiaVoice(title, explanation) {
      const openers = [
        "Ooh, today's pick:", "Just waddled past this one:", "My favourite today:",
        "This stopped me mid-slide:", "Look what NASA found:", "Beak-drop moment:",
        "I've been staring at this all morning:", "Fresh off the telescope:",
      ];
      const reactions = [
        "I can't stop thinking about it!", "My flippers are tingling!",
        "I'm adding this to my logbook immediately.", "Ten out of ten, no notes.",
        "This is exactly why I love this job.", "I did a little happy waddle.",
        "Filed under: absolutely wild.", "Honestly, my best find all week.",
      ];
      const emojis = ['🌌', '✨', '🪐', '☄️', '🔭', '🌠', '🛰️', '🌙', '⭐'];

      const opener   = openers[Math.floor(Math.random() * openers.length)];
      const reaction = reactions[Math.floor(Math.random() * reactions.length)];
      const emoji    = emojis[Math.floor(Math.random() * emojis.length)];

      const firstSentence = (explanation.match(/^.*?[.!?](?=\s|$)/) || [explanation])[0] || '';
      const snippet    = firstSentence.length > 95 ? firstSentence.slice(0, 95).trim() + '…' : firstSentence;
      const shortTitle = title.length > 30 ? title.slice(0, 30).trim() + '…' : title;
      // there's more to read if the full explanation runs longer than
      // the one-sentence snippet we're showing in the chat bubble
      const hasMore = explanation.trim().length > snippet.replace(/…$/, '').trim().length;

      return {
        headline: `${emoji} ${shortTitle}`,
        opinion: `${opener} ${snippet} ${reaction}`.trim(),
        hasMore,
      };
    },
    pensiaFallback() {
      const facts = [
        { h: '🌌 Galaxy count!', m: 'There are over 2 trillion galaxies in the observable universe. That\'s more galaxies than grains of sand on all Earth\'s beaches!' },
        { h: '☀️ Sun size!', m: 'About 1.3 million Earths could fit inside the Sun — and it\'s considered a medium-sized star. Wild, right?!' },
        { h: '🪐 Saturn floats!', m: 'Saturn is so light for its size it would actually float on water. I want to see that swimming pool!' },
        { h: '⭐ Old star light!', m: 'The light from the nearest star takes 4.2 years to reach us. We\'re literally seeing the past every night!' },
        { h: '🌕 Moon footprints!', m: 'Footprints left on the Moon will likely still be there in a million years — no wind or rain to wipe them away.' },
        { h: '🚀 Voyager 1!', m: 'Voyager 1 is over 24 billion km from home and still phoning in after almost 50 years in space. Respect.' },
        { h: '🌑 Venus day!', m: 'A day on Venus is longer than its year — it spins so slowly that sunrise to sunrise takes 117 Earth days!' },
        { h: '💫 Neutron stars!', m: 'A neutron star is so dense a teaspoon of it would weigh about a billion tons. My scale would not survive that.' },
      ];
      return facts[Math.floor(Math.random() * facts.length)];
    },
    openPensiaArticle() {
      if (!this.pensiaArticle) return;
      // the full-article modal takes over — stop the bubble's
      // auto-dismiss timer so it doesn't vanish underneath it
      clearTimeout(this.pensiaCloseTimer);
      this.pensiaArticleOpen = true;
      this.syncScrollLock();
    },
    closePensiaArticle() {
      this.pensiaArticleOpen = false;
      this.syncScrollLock();
      // give the bubble a fresh, shorter window to auto-dismiss now
      // that the reader's done, rather than lingering forever
      clearTimeout(this.pensiaCloseTimer);
      this.pensiaCloseTimer = setTimeout(() => {
        this.pensiaOpen = false;
      }, 4000);
    },
    openModal(m) {
      // Login/register is hidden for now — see AUTH_ENABLED at the top of
      // this file. 'tos' and 'privacy' still work as before.
      if (!AUTH_ENABLED && (m === 'login' || m === 'register')) return;
      this.modal = m; this.authTab = m === 'login' ? 'login' : 'register'; this.clearForm(); this.success = false; this.legalScrolled = false; this.syncScrollLock();
    },
    focusShot(i) {
      this.activeShot = i;
      const shot = this.heroShots[i];
      if (shot) this.openShot(shot);
    },
    openShot(shot) {
      this.shotModal = shot;
      this.syncScrollLock();
    },
    closeShot() {
      this.shotModal = null;
      this.syncScrollLock();
    },
    scrollToFeatures() {
      const el = document.getElementById('features');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    startExploring() {
      if (!AUTH_ENABLED) {
        window.location.href = 'dashboard.html';
        return;
      }
      if (this.currentUser) {
        window.location.href = 'dashboard.html';
      } else {
        this.openModal('register');
      }
    },
    goToDashboard() { window.location.href = 'dashboard.html'; },
    closeModal() { this.modal = null; this.success = false; this.syncScrollLock(); },
    onLegalScroll(e) {
      const el = e.target;
      if (!this.legalScrolled && el.scrollTop + el.clientHeight >= el.scrollHeight - 24) {
        this.legalScrolled = true;
      }
    },
    // single source of truth for the body scroll lock — recomputed from
    // whatever modals/overlays are currently open, so closing one of
    // several open surfaces can never leave a stray lock behind
    syncScrollLock() {
      const shouldLock = !!this.modal || this.pensiaArticleOpen || !!this.shotModal;
      // Compensate for the scrollbar disappearing when we lock scroll, so
      // the (centered) layout doesn't jump sideways. scrollbar-gutter:stable
      // handles this in modern browsers; this padding is the fallback.
      const sbw = window.innerWidth - document.documentElement.clientWidth;
      const value = shouldLock ? 'hidden' : '';
      document.documentElement.style.overflow = value;
      document.body.style.overflow = value;
      document.body.style.paddingRight = shouldLock && sbw > 0 ? sbw + 'px' : '';
    },
    clearForm() { this.form = { firstName: '', lastName: '', username: '', gender: '', email: '', password: '', confirm: '', tos: false }; this.errors = {}; this.pendingEmailConfirm = false; },
    validateRegister() {
      const e = {};
      const t = this.t;
      if (!this.form.firstName.trim()) e.firstName = t.errFirst;
      if (!this.form.lastName.trim()) e.lastName = t.errLast;
      if (!this.form.username.trim()) e.username = t.errUsername;
      else if (this.form.username.trim().length < 3) e.username = t.errUsernameShort;
      if (!this.form.gender) e.gender = t.errGender;
      if (!this.form.email.includes('@')) e.email = t.errEmail;
      if (this.form.password.length < 8) e.password = t.errPass;
      if (this.form.password !== this.form.confirm) e.confirm = t.errConfirm;
      if (!this.form.tos) e.tos = t.errTos;
      this.errors = e;
      return !Object.keys(e).length;
    },
    validateLogin() {
      const e = {};
      const t = this.t;
      if (!this.form.email.includes('@')) e.email = t.errEmail;
      if (!this.form.password) e.password = t.errPass;
      this.errors = e;
      return !Object.keys(e).length;
    },
    async submitRegister() {
      if (!this.validateRegister()) return;
      const client = window.supabaseClient || await window.supabaseReady;
      if (!client) {
        this.errors = { submit: this.t.errNoSupabase };
        return;
      }
      this.loading = true;
      this.errors = {};
      try {
        const username = this.form.username.trim();
        const { data, error } = await client.auth.signUp({
          email: this.form.email.trim(),
          password: this.form.password,
          options: {
            data: {
              username,
              gender: this.form.gender,
              first_name: this.form.firstName.trim(),
              last_name: this.form.lastName.trim()
            }
          }
        });
        if (error) {
          this.errors = { submit: error.message };
          this.loading = false;
          return;
        }
        // If "Confirm email" is enabled in Supabase, signUp() returns a user
        // but NO session — the account exists but isn't usable yet until the
        // person clicks the link in their inbox. Treat that as a distinct
        // state instead of pretending they're logged in and ready to go.
        // The `profiles` row is still created right away by the DB trigger
        // (see supabase/schema.sql), so username/gender are saved either way.
        if (data.session) {
          this.currentUser = data.user;
          this.pendingEmailConfirm = false;
          this.showToast(this.t.toastReg);
        } else {
          this.currentUser = null;
          this.pendingEmailConfirm = true;
        }
        this.loading = false;
        this.success = true;
      } catch (err) {
        this.errors = { submit: err.message || String(err) };
        this.loading = false;
      }
    },
    async submitLogin() {
      if (!this.validateLogin()) return;
      const client = window.supabaseClient || await window.supabaseReady;
      if (!client) {
        this.errors = { submit: this.t.errNoSupabase };
        return;
      }
      this.loading = true;
      this.errors = {};
      try {
        const { data, error } = await client.auth.signInWithPassword({
          email: this.form.email.trim(),
          password: this.form.password
        });
        if (error) {
          this.errors = { submit: error.message };
          this.loading = false;
          return;
        }
        this.currentUser = data.user;
        this.loading = false;
        this.success = true;
        this.showToast(this.t.toastLogin);
      } catch (err) {
        this.errors = { submit: err.message || String(err) };
        this.loading = false;
      }
    },
    async socialLogin(provider) {
      const client = window.supabaseClient || await window.supabaseReady;
      if (!client) {
        this.errors = { social: this.t.errNoSupabase };
        return;
      }
      this.socialLoading = true;
      this.errors = {};
      try {
        // signInWithOAuth navigates the browser away to the provider's
        // consent screen, then back to redirectTo with a session in the
        // URL — there's no in-page session to read here. dashboard.html
        // will pick it up via supabase-js's own auth-state listener.
        const { error } = await client.auth.signInWithOAuth({
          provider,
          options: { redirectTo: window.location.origin + '/dashboard.html' }
        });
        if (error) {
          this.errors = { social: error.message };
          this.socialLoading = false;
        }
        // No success branch / no socialLoading reset on the happy path —
        // the page is navigating away.
      } catch (err) {
        this.errors = { social: err.message || String(err) };
        this.socialLoading = false;
      }
    },
    async logout() {
      const client = window.supabaseClient || await window.supabaseReady;
      if (client) await client.auth.signOut();
      this.currentUser = null;
    },
    showToast(msg) { this.toast = msg; setTimeout(() => { this.toast = null; }, 3400); },
    async loadStats() {
      // APOD days: archive started June 16 1995 — calculate immediately, no API needed
      const start = new Date('1995-06-16');
      const days = Math.floor((Date.now() - start) / 86400000);
      this.stats.apodDays = days.toLocaleString() + '+';

      // Objects: NASA Image & Video Library total hits
      try {
        const r = await fetch('/api/nasa?endpoint=images_search&q=space&page_size=1');
        if (r.ok) {
          const d = await r.json();
          const total = d.collection?.metadata?.total_hits;
          if (total) this.stats.objects = total >= 1000 ? Math.round(total / 1000) + 'K+' : total + '+';
        }
      } catch (e) {}

      // Asteroids: NASA Near-Earth Object total
      try {
        const r = await fetch('/api/nasa?endpoint=neo_browse');
        if (r.ok) {
          const d = await r.json();
          const total = d.page?.total_elements;
          if (total) this.stats.asteroids = total >= 1000 ? Math.round(total / 1000) + 'K+' : total + '+';
        }
      } catch (e) {}
    },
  },
  mounted() {
    // Open the Terms / Privacy modal when arriving from another page's footer
    // (e.g. team.html / staff-application.html link to index.html#tos and
    // index.html#privacy). Runs once on load; clears the hash afterwards so a
    // refresh doesn't reopen it.
    const legalFromHash = () => {
      const h = (window.location.hash || '').replace('#', '');
      if (h === 'tos' || h === 'privacy') {
        this.openModal(h);
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    };
    legalFromHash();

    // Restore any existing Supabase session (e.g. user refreshed the page
    // after logging in) so currentUser is populated without a re-login.
    // window.supabaseReady resolves once /api/supabase-config has loaded
    // (or to null if Supabase isn't configured / unreachable).
    if (AUTH_ENABLED && window.supabaseReady) {
      window.supabaseReady.then(client => {
        if (!client) return;
        client.auth.getSession().then(({ data }) => {
          if (data && data.session) this.currentUser = data.session.user;
        });
        client.auth.onAuthStateChange((_event, session) => {
          this.currentUser = session ? session.user : null;
        });
      });
    }
    // Wait for web fonts + a real layout/paint pass before placing Pensia.
    // Measuring against the page before Inter has swapped in (or before
    // images/canvas above the fold have settled their height) gives a
    // stale rect and she ends up stranded near the top-left corner. She
    // stays hidden (pensiaReady=false) until this succeeds, so there's
    // no flash at her old (0,0) spot on first paint.
    const placePensia = () => {
      this.$nextTick(() => {
        requestAnimationFrame(() => this.resetPensiaToDefault());
      });
    };
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(placePensia);
    } else {
      placePensia();
    }
    // Safety net: keep retrying every 150ms until she's actually placed
    // (covers slow image/font loads), capped at ~5s so it can't run forever.
    let tries = 0;
    const poll = setInterval(() => {
      tries++;
      if (this.pensiaReady || tries > 30) { clearInterval(poll); return; }
      placePensia();
    }, 150);
    // Extra safety net: run again shortly after load in case anything
    // above the Features section (hero art, stat badges, planet canvas)
    // shifts height after fonts/images finish.
    window.addEventListener('load', placePensia);
    setTimeout(placePensia, 600);
    // On resize, re-anchor to the heading rather than just clamping —
    // otherwise resizing can leave her drifted away from her home spot.
    // Skip while she's being dragged or her bubble is open so we don't
    // yank her out from under the user mid-interaction.
    window.addEventListener('resize', () => {
      if (this.pensiaDragging || this.pensiaOpen) {
        this.clampPensiaPos();
      } else {
        this.resetPensiaToDefault();
      }
    });
    document.addEventListener('contextmenu', e => {
      if (e.target && e.target.tagName === 'IMG') e.preventDefault();
    });
    document.addEventListener('dragstart', e => {
      if (e.target && e.target.tagName === 'IMG') e.preventDefault();
    });
    this.loadStats();
    // Escape always gets you out — a guaranteed exit for any modal or
    // overlay so nothing can ever trap the page with scroll locked
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      if (this.shotModal) { this.shotModal = null; this.syncScrollLock(); }
      else if (this.pensiaArticleOpen) this.closePensiaArticle();
      else if (this.modal) this.closeModal();
    });
    const nav = document.querySelector('nav');
    const featuresSection = document.getElementById('features');
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      // scrolled: subtle shadow/border on any scroll
      this.navScrolled = y > 20;
      // compact: switch to the centered bar slightly before the Features
      // section reaches the top (larger offset = triggers earlier/higher up)
      // squeeze in exactly when the Features heading ("Everything the
      // cosmos demands") reaches the top of the viewport
      const anchor = (featuresSection && featuresSection.querySelector('h2')) || featuresSection;
      if (anchor) {
        const rect = anchor.getBoundingClientRect();
        this.navCompact = rect.top <= nav.offsetHeight;
      }
    }, { passive: true });
    // Background starfield (shared helper — see common.js). 220 keeps the
    // slightly denser star count this page originally shipped with.
    window.CosmoKlub.initStarfield(220);
  }
}).mount('#app');
