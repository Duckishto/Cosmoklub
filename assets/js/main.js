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
  planetarium: `<svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><defs><radialGradient id="hp-sky" cx="50%" cy="42%" r="70%"><stop offset="0%" stop-color="#1a0f3d"/><stop offset="100%" stop-color="#08040f"/></radialGradient><radialGradient id="hp-planet" cx="38%" cy="34%" r="70%"><stop offset="0%" stop-color="#c084fc"/><stop offset="55%" stop-color="#7c3aed"/><stop offset="100%" stop-color="#2a0f5c"/></radialGradient></defs><rect width="320" height="200" fill="url(#hp-sky)"/><g fill="#e9d5ff"><circle cx="34" cy="30" r="1.1" opacity=".8"/><circle cx="286" cy="26" r="1.3" opacity=".7"/><circle cx="250" cy="60" r="0.9" opacity=".6"/><circle cx="60" cy="150" r="1" opacity=".7"/><circle cx="290" cy="150" r="1.2" opacity=".6"/><circle cx="18" cy="96" r="0.9" opacity=".5"/><circle cx="140" cy="24" r="0.9" opacity=".6"/></g><ellipse cx="160" cy="112" rx="86" ry="28" stroke="#a855f7" stroke-width="1.4" opacity=".45" fill="none" stroke-dasharray="4 4"/><ellipse cx="160" cy="112" rx="58" ry="18" stroke="#c084fc" stroke-width="1.2" opacity=".35" fill="none"/><circle cx="160" cy="104" r="34" fill="url(#hp-planet)"/><ellipse cx="160" cy="104" rx="52" ry="13" stroke="#e9d5ff" stroke-width="3" opacity=".55" fill="none" transform="rotate(-14 160 104)"/><circle cx="218" cy="112" r="4" fill="#e9d5ff" opacity=".9"/></svg>`,
  // Community / forum mock
  community: `<svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><rect width="320" height="200" fill="#0c0820"/><g><rect x="20" y="26" width="200" height="46" rx="10" fill="rgba(168,85,247,0.10)" stroke="rgba(168,85,247,0.30)"/><circle cx="42" cy="49" r="12" fill="#7c3aed"/><rect x="62" y="40" width="70" height="7" rx="3.5" fill="#c084fc" opacity=".85"/><rect x="62" y="53" width="140" height="6" rx="3" fill="#5b4a7d"/></g><g><rect x="60" y="86" width="240" height="46" rx="10" fill="rgba(192,132,252,0.10)" stroke="rgba(192,132,252,0.30)"/><circle cx="278" cy="109" r="12" fill="#a855f7"/><rect x="150" y="100" width="60" height="7" rx="3.5" fill="#e9d5ff" opacity=".8"/><rect x="80" y="113" width="180" height="6" rx="3" fill="#5b4a7d"/></g><g><rect x="20" y="146" width="200" height="40" rx="10" fill="rgba(168,85,247,0.10)" stroke="rgba(168,85,247,0.30)"/><circle cx="42" cy="166" r="11" fill="#7c3aed"/><rect x="62" y="160" width="120" height="6" rx="3" fill="#c084fc" opacity=".8"/><rect x="62" y="171" width="150" height="5" rx="2.5" fill="#5b4a7d"/></g></svg>`,
  // Observer profile mock (new left-side floating card)
  observer: `<svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><rect width="320" height="220" fill="#0c0820"/><circle cx="160" cy="62" r="30" fill="rgba(168,85,247,0.16)" stroke="rgba(192,132,252,0.4)" stroke-width="1.5"/><circle cx="160" cy="54" r="11" fill="#c084fc" opacity=".85"/><path d="M136 84c4-12 14-18 24-18s20 6 24 18" stroke="#a855f7" stroke-width="2" stroke-linecap="round" fill="none" opacity=".7"/><rect x="110" y="108" width="100" height="10" rx="5" fill="#e9d5ff" opacity=".85"/><rect x="130" y="126" width="60" height="6" rx="3" fill="#5b4a7d"/><rect x="70" y="150" width="80" height="22" rx="11" fill="rgba(124,58,237,0.18)" stroke="rgba(168,85,247,0.35)"/><circle cx="86" cy="161" r="4" fill="#22d3a5"/><rect x="98" y="156" width="42" height="6" rx="3" fill="#c084fc" opacity=".8"/><rect x="170" y="150" width="80" height="22" rx="11" fill="rgba(192,132,252,0.10)" stroke="rgba(192,132,252,0.28)"/><rect x="184" y="156" width="52" height="6" rx="3" fill="#e9d5ff" opacity=".7"/><rect x="40" y="190" width="240" height="1" fill="rgba(168,85,247,0.2)"/></svg>`,
  // Object browser mock (main hero screenshot)
  objectBrowser: `<svg viewBox="0 0 640 318" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><defs>
<linearGradient id="sob-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#120a2e"/><stop offset="100%" stop-color="#08040f"/></linearGradient>
<radialGradient id="sob-th1" cx="35%" cy="30%" r="75%"><stop offset="0%" stop-color="#e9d5ff"/><stop offset="45%" stop-color="#a855f7"/><stop offset="100%" stop-color="#3b1370"/></radialGradient>
<radialGradient id="sob-th2" cx="60%" cy="65%" r="80%"><stop offset="0%" stop-color="#c084fc"/><stop offset="55%" stop-color="#6d28d9"/><stop offset="100%" stop-color="#1e0a42"/></radialGradient>
<radialGradient id="sob-th3" cx="40%" cy="40%" r="70%"><stop offset="0%" stop-color="#f5f3ff"/><stop offset="40%" stop-color="#c084fc"/><stop offset="100%" stop-color="#4c1d95"/></radialGradient>
<radialGradient id="sob-th4" cx="55%" cy="35%" r="75%"><stop offset="0%" stop-color="#d8b4fe"/><stop offset="50%" stop-color="#7c3aed"/><stop offset="100%" stop-color="#1e0a42"/></radialGradient>
</defs><rect x="0.0" y="0.0" width="640.0" height="318.0" rx="0" fill="url(#sob-bg)"  /><rect x="0.0" y="0.0" width="150.0" height="318.0" rx="0" fill="rgba(124,58,237,0.05)"  /><line x1="150" y1="0" x2="150" y2="318" stroke="rgba(168,85,247,0.16)" stroke-width="1"/><circle cx="30" cy="26" r="6" fill="#a855f7" opacity="0.9"/><rect x="44.0" y="22.0" width="72.0" height="7.0" rx="3.5" fill="rgba(245,243,255,0.55)"  /><rect x="10.0" y="48.0" width="132.0" height="34.0" rx="9" fill="rgba(124,58,237,0.28)"  /><rect x="10.0" y="48.0" width="3.0" height="34.0" rx="2" fill="#c084fc"  /><circle cx="30" cy="65" r="8" fill="#a855f7"/><rect x="46.0" y="61.0" width="66.0" height="7.0" rx="3.5" fill="rgba(245,243,255,0.5)"  /><circle cx="30" cy="103" r="8" fill="rgba(168,85,247,0.35)"/><rect x="46.0" y="99.0" width="58.0" height="7.0" rx="3.5" fill="rgba(139,122,168,0.55)"  /><circle cx="30" cy="141" r="8" fill="rgba(168,85,247,0.35)"/><rect x="46.0" y="137.0" width="58.0" height="7.0" rx="3.5" fill="rgba(139,122,168,0.55)"  /><circle cx="30" cy="179" r="8" fill="rgba(168,85,247,0.35)"/><rect x="46.0" y="175.0" width="58.0" height="7.0" rx="3.5" fill="rgba(139,122,168,0.55)"  /><circle cx="30" cy="217" r="8" fill="rgba(168,85,247,0.35)"/><rect x="46.0" y="213.0" width="58.0" height="7.0" rx="3.5" fill="rgba(139,122,168,0.55)"  /><rect x="168.0" y="18.0" width="268.0" height="32.0" rx="16" fill="rgba(255,255,255,0.035)" stroke="rgba(168,85,247,0.28)" stroke-width="1.2" /><circle cx="188" cy="34" r="5.5" fill="none" stroke="rgba(232,220,255,0.6)" stroke-width="1.6"/><line x1="192" y1="38" x2="196" y2="42" stroke="rgba(232,220,255,0.6)" stroke-width="1.6" stroke-linecap="round"/><rect x="204.0" y="28.0" width="120.0" height="7.0" rx="3.5" fill="rgba(139,122,168,0.55)"  /><rect x="452.0" y="18.0" width="58.0" height="32.0" rx="16" fill="rgba(124,58,237,0.10)" stroke="rgba(168,85,247,0.3)" stroke-width="1.2" /><rect x="466.0" y="31.0" width="30.0" height="6.0" rx="3" fill="rgba(232,220,255,0.5)"  /><rect x="518.0" y="18.0" width="102.0" height="32.0" rx="16" fill="url(#sob-th4)"  /><rect x="534.0" y="30.0" width="70.0" height="8.0" rx="4" fill="rgba(8,4,15,0.55)"  /><rect x="168.0" y="68.0" width="104.0" height="108.0" rx="11" fill="rgba(255,255,255,0.018)" stroke="rgba(168,85,247,0.14)" stroke-width="1" /><rect x="174.0" y="74.0" width="92.0" height="62.0" rx="7" fill="url(#sob-th1)"  /><circle cx="248.9" cy="112.9" r="0.9" fill="#fff" opacity="0.50"/><circle cx="220.9" cy="96.6" r="1.1" fill="#fff" opacity="0.52"/><circle cx="218.0" cy="104.8" r="1.1" fill="#fff" opacity="0.60"/><rect x="176.0" y="144.0" width="72.0" height="7.0" rx="3.5" fill="rgba(233,213,255,0.55)"  /><rect x="176.0" y="155.0" width="58.0" height="5.0" rx="2.5" fill="rgba(139,122,168,0.5)"  /><rect x="286.0" y="68.0" width="104.0" height="108.0" rx="11" fill="rgba(255,255,255,0.018)" stroke="rgba(168,85,247,0.14)" stroke-width="1" /><rect x="292.0" y="74.0" width="92.0" height="62.0" rx="7" fill="url(#sob-th2)"  /><circle cx="307.3" cy="117.0" r="1.1" fill="#fff" opacity="0.50"/><circle cx="337.6" cy="98.7" r="1.0" fill="#fff" opacity="0.72"/><circle cx="303.9" cy="79.3" r="1.1" fill="#fff" opacity="0.57"/><rect x="294.0" y="144.0" width="72.0" height="7.0" rx="3.5" fill="rgba(233,213,255,0.55)"  /><rect x="294.0" y="155.0" width="58.0" height="5.0" rx="2.5" fill="rgba(139,122,168,0.5)"  /><circle cx="376" cy="84" r="7" fill="rgba(8,4,15,0.55)" stroke="rgba(192,132,252,0.6)" stroke-width="1"/><path d="M373 84 l1.6 1.6 l3 -3.4" stroke="#e9d5ff" stroke-width="1.3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="404.0" y="68.0" width="104.0" height="108.0" rx="11" fill="rgba(255,255,255,0.018)" stroke="rgba(168,85,247,0.14)" stroke-width="1" /><rect x="410.0" y="74.0" width="92.0" height="62.0" rx="7" fill="url(#sob-th3)"  /><circle cx="494.3" cy="121.6" r="0.6" fill="#fff" opacity="0.43"/><circle cx="484.2" cy="111.9" r="1.0" fill="#fff" opacity="0.52"/><circle cx="464.9" cy="105.9" r="0.9" fill="#fff" opacity="0.46"/><rect x="412.0" y="144.0" width="72.0" height="7.0" rx="3.5" fill="rgba(233,213,255,0.55)"  /><rect x="412.0" y="155.0" width="58.0" height="5.0" rx="2.5" fill="rgba(139,122,168,0.5)"  /><rect x="522.0" y="68.0" width="104.0" height="108.0" rx="11" fill="rgba(255,255,255,0.018)" stroke="rgba(168,85,247,0.14)" stroke-width="1" /><rect x="528.0" y="74.0" width="92.0" height="62.0" rx="7" fill="url(#sob-th4)"  /><circle cx="552.0" cy="103.0" r="0.8" fill="#fff" opacity="0.64"/><circle cx="584.6" cy="81.0" r="0.6" fill="#fff" opacity="0.73"/><circle cx="553.8" cy="88.8" r="1.2" fill="#fff" opacity="0.59"/><rect x="530.0" y="144.0" width="72.0" height="7.0" rx="3.5" fill="rgba(233,213,255,0.55)"  /><rect x="530.0" y="155.0" width="58.0" height="5.0" rx="2.5" fill="rgba(139,122,168,0.5)"  /><circle cx="612" cy="84" r="7" fill="rgba(8,4,15,0.55)" stroke="rgba(192,132,252,0.6)" stroke-width="1"/><path d="M609 84 l1.6 1.6 l3 -3.4" stroke="#e9d5ff" stroke-width="1.3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="168.0" y="190.0" width="104.0" height="108.0" rx="11" fill="rgba(255,255,255,0.018)" stroke="rgba(168,85,247,0.14)" stroke-width="1" /><rect x="174.0" y="196.0" width="92.0" height="62.0" rx="7" fill="url(#sob-th1)"  /><circle cx="197.8" cy="204.7" r="0.8" fill="#fff" opacity="0.46"/><circle cx="183.6" cy="218.5" r="1.2" fill="#fff" opacity="0.72"/><circle cx="242.3" cy="210.2" r="0.9" fill="#fff" opacity="0.51"/><rect x="176.0" y="266.0" width="72.0" height="7.0" rx="3.5" fill="rgba(233,213,255,0.55)"  /><rect x="176.0" y="277.0" width="58.0" height="5.0" rx="2.5" fill="rgba(139,122,168,0.5)"  /><rect x="286.0" y="190.0" width="104.0" height="108.0" rx="11" fill="rgba(255,255,255,0.018)" stroke="rgba(168,85,247,0.14)" stroke-width="1" /><rect x="292.0" y="196.0" width="92.0" height="62.0" rx="7" fill="url(#sob-th2)"  /><circle cx="348.3" cy="234.1" r="1.1" fill="#fff" opacity="0.78"/><circle cx="358.2" cy="242.4" r="0.6" fill="#fff" opacity="0.59"/><circle cx="375.2" cy="229.9" r="1.1" fill="#fff" opacity="0.45"/><rect x="294.0" y="266.0" width="72.0" height="7.0" rx="3.5" fill="rgba(233,213,255,0.55)"  /><rect x="294.0" y="277.0" width="58.0" height="5.0" rx="2.5" fill="rgba(139,122,168,0.5)"  /><rect x="404.0" y="190.0" width="104.0" height="108.0" rx="11" fill="rgba(255,255,255,0.018)" stroke="rgba(168,85,247,0.14)" stroke-width="1" /><rect x="410.0" y="196.0" width="92.0" height="62.0" rx="7" fill="url(#sob-th3)"  /><circle cx="480.6" cy="237.8" r="0.9" fill="#fff" opacity="0.50"/><circle cx="414.0" cy="230.5" r="0.9" fill="#fff" opacity="0.70"/><circle cx="445.3" cy="235.4" r="0.8" fill="#fff" opacity="0.72"/><rect x="412.0" y="266.0" width="72.0" height="7.0" rx="3.5" fill="rgba(233,213,255,0.55)"  /><rect x="412.0" y="277.0" width="58.0" height="5.0" rx="2.5" fill="rgba(139,122,168,0.5)"  /><circle cx="494" cy="206" r="7" fill="rgba(8,4,15,0.55)" stroke="rgba(192,132,252,0.6)" stroke-width="1"/><path d="M491 206 l1.6 1.6 l3 -3.4" stroke="#e9d5ff" stroke-width="1.3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="522.0" y="190.0" width="104.0" height="108.0" rx="11" fill="rgba(255,255,255,0.018)" stroke="rgba(168,85,247,0.14)" stroke-width="1" /><rect x="528.0" y="196.0" width="92.0" height="62.0" rx="7" fill="url(#sob-th4)"  /><circle cx="559.2" cy="206.9" r="1.0" fill="#fff" opacity="0.43"/><circle cx="577.0" cy="216.8" r="0.6" fill="#fff" opacity="0.60"/><circle cx="535.1" cy="219.9" r="0.6" fill="#fff" opacity="0.44"/><rect x="530.0" y="266.0" width="72.0" height="7.0" rx="3.5" fill="rgba(233,213,255,0.55)"  /><rect x="530.0" y="277.0" width="58.0" height="5.0" rx="2.5" fill="rgba(139,122,168,0.5)"  /></svg>`,
  // Astronomy Picture of the Day mock
  apod: `<svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><defs>
<linearGradient id="sap-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#140b30"/><stop offset="100%" stop-color="#08040f"/></linearGradient>
<radialGradient id="sap-neb" cx="42%" cy="55%" r="75%"><stop offset="0%" stop-color="#f5f3ff"/><stop offset="30%" stop-color="#e9d5ff"/><stop offset="55%" stop-color="#a855f7"/><stop offset="80%" stop-color="#5b21b6"/><stop offset="100%" stop-color="#180835"/></radialGradient>
<radialGradient id="sap-glow2" cx="70%" cy="30%" r="40%"><stop offset="0%" stop-color="#c084fc" stop-opacity="0.55"/><stop offset="100%" stop-color="#c084fc" stop-opacity="0"/></radialGradient>
</defs><linearGradient id="sap-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#08040f" stop-opacity="0"/><stop offset="100%" stop-color="#08040f" stop-opacity="1"/></linearGradient><rect x="0.0" y="0.0" width="320.0" height="200.0" rx="0" fill="url(#sap-bg)"  /><rect x="0.0" y="0.0" width="320.0" height="124.0" rx="0" fill="url(#sap-neb)"  /><rect x="0.0" y="0.0" width="320.0" height="124.0" rx="0" fill="url(#sap-glow2)"  /><circle cx="103.6" cy="18.7" r="1.1" fill="#fff" opacity="0.34"/><circle cx="171.5" cy="45.3" r="0.6" fill="#fff" opacity="0.55"/><circle cx="12.0" cy="53.8" r="0.6" fill="#fff" opacity="0.35"/><circle cx="135.8" cy="102.5" r="0.6" fill="#fff" opacity="0.41"/><circle cx="200.8" cy="117.5" r="1.0" fill="#fff" opacity="0.50"/><circle cx="312.4" cy="5.8" r="1.3" fill="#fff" opacity="0.44"/><circle cx="46.2" cy="14.6" r="0.8" fill="#fff" opacity="0.71"/><circle cx="57.8" cy="72.1" r="1.1" fill="#fff" opacity="0.49"/><circle cx="175.3" cy="7.8" r="0.6" fill="#fff" opacity="0.40"/><circle cx="217.7" cy="53.0" r="0.8" fill="#fff" opacity="0.59"/><circle cx="145.0" cy="37.2" r="1.2" fill="#fff" opacity="0.65"/><circle cx="78.1" cy="71.2" r="1.0" fill="#fff" opacity="0.74"/><circle cx="233.4" cy="35.7" r="1.4" fill="#fff" opacity="0.36"/><circle cx="133.8" cy="93.9" r="0.6" fill="#fff" opacity="0.54"/><circle cx="12.5" cy="82.9" r="1.2" fill="#fff" opacity="0.59"/><circle cx="280.2" cy="38.9" r="1.1" fill="#fff" opacity="0.60"/><circle cx="185.6" cy="56.6" r="1.3" fill="#fff" opacity="0.77"/><circle cx="151.7" cy="82.4" r="0.6" fill="#fff" opacity="0.65"/><circle cx="207.1" cy="123.1" r="1.2" fill="#fff" opacity="0.44"/><circle cx="123.5" cy="82.9" r="0.5" fill="#fff" opacity="0.53"/><circle cx="53.8" cy="14.5" r="0.6" fill="#fff" opacity="0.68"/><circle cx="41.4" cy="30.7" r="0.9" fill="#fff" opacity="0.74"/><rect x="10.0" y="10.0" width="84.0" height="20.0" rx="10" fill="rgba(8,4,15,0.55)" stroke="rgba(232,220,255,0.4)" stroke-width="1" /><circle cx="24" cy="20" r="3.4" fill="#c084fc"/><rect x="34.0" y="17.0" width="52.0" height="6.0" rx="3" fill="rgba(245,243,255,0.75)"  /><rect x="0" y="94" width="320" height="30" fill="url(#sap-fade)"/><rect x="16.0" y="138.0" width="180.0" height="10.0" rx="5" fill="rgba(233,213,255,0.6)"  /><rect x="16.0" y="154.0" width="220.0" height="7.0" rx="3.5" fill="rgba(139,122,168,0.55)"  /><rect x="16.0" y="166.0" width="150.0" height="7.0" rx="3.5" fill="rgba(139,122,168,0.4)"  /><rect x="16.0" y="180.0" width="60.0" height="14.0" rx="7" fill="rgba(124,58,237,0.14)" stroke="rgba(168,85,247,0.3)" stroke-width="1" /><rect x="28.0" y="185.0" width="36.0" height="4.5" rx="2.2" fill="rgba(232,220,255,0.6)"  /><path d="M214 183 l1.5 3.2 l3.5 0.4 l-2.6 2.4 l0.7 3.5 l-3.1 -1.8 l-3.1 1.8 l0.7 -3.5 l-2.6 -2.4 l3.5 -0.4 z" fill="#c084fc"/><path d="M228 183 l1.5 3.2 l3.5 0.4 l-2.6 2.4 l0.7 3.5 l-3.1 -1.8 l-3.1 1.8 l0.7 -3.5 l-2.6 -2.4 l3.5 -0.4 z" fill="#c084fc"/><path d="M242 183 l1.5 3.2 l3.5 0.4 l-2.6 2.4 l0.7 3.5 l-3.1 -1.8 l-3.1 1.8 l0.7 -3.5 l-2.6 -2.4 l3.5 -0.4 z" fill="#c084fc"/><path d="M256 183 l1.5 3.2 l3.5 0.4 l-2.6 2.4 l0.7 3.5 l-3.1 -1.8 l-3.1 1.8 l0.7 -3.5 l-2.6 -2.4 l3.5 -0.4 z" fill="#c084fc"/><path d="M270 183 l1.5 3.2 l3.5 0.4 l-2.6 2.4 l0.7 3.5 l-3.1 -1.8 l-3.1 1.8 l0.7 -3.5 l-2.6 -2.4 l3.5 -0.4 z" fill="rgba(139,122,168,0.4)"/></svg>`,
  // Function grapher / orbit plot mock
  grapher: `<svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><defs>
<linearGradient id="sgr-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#12082c"/><stop offset="100%" stop-color="#08040f"/></linearGradient>
<linearGradient id="sgr-curve" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#7c3aed"/><stop offset="55%" stop-color="#c084fc"/><stop offset="100%" stop-color="#f5f3ff"/></linearGradient>
<linearGradient id="sgr-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#a855f7" stop-opacity="0.32"/><stop offset="100%" stop-color="#a855f7" stop-opacity="0"/></linearGradient>
</defs><rect x="0.0" y="0.0" width="320.0" height="200.0" rx="0" fill="url(#sgr-bg)"  /><rect x="16.0" y="14.0" width="120.0" height="7.0" rx="3.5" fill="rgba(233,213,255,0.55)"  /><rect x="228.0" y="10.0" width="76.0" height="20.0" rx="10" fill="rgba(124,58,237,0.14)" stroke="rgba(168,85,247,0.3)" stroke-width="1" /><circle cx="242" cy="20" r="3" fill="#c084fc"/><rect x="250.0" y="17.0" width="46.0" height="6.0" rx="3" fill="rgba(232,220,255,0.55)"  /><circle cx="16.0" cy="42.0" r="1" fill="rgba(168,85,247,0.18)"/><circle cx="16.0" cy="72.0" r="1" fill="rgba(168,85,247,0.18)"/><circle cx="16.0" cy="102.0" r="1" fill="rgba(168,85,247,0.18)"/><circle cx="16.0" cy="132.0" r="1" fill="rgba(168,85,247,0.18)"/><circle cx="16.0" cy="162.0" r="1" fill="rgba(168,85,247,0.18)"/><circle cx="64.0" cy="42.0" r="1" fill="rgba(168,85,247,0.18)"/><circle cx="64.0" cy="72.0" r="1" fill="rgba(168,85,247,0.18)"/><circle cx="64.0" cy="102.0" r="1" fill="rgba(168,85,247,0.18)"/><circle cx="64.0" cy="132.0" r="1" fill="rgba(168,85,247,0.18)"/><circle cx="64.0" cy="162.0" r="1" fill="rgba(168,85,247,0.18)"/><circle cx="112.0" cy="42.0" r="1" fill="rgba(168,85,247,0.18)"/><circle cx="112.0" cy="72.0" r="1" fill="rgba(168,85,247,0.18)"/><circle cx="112.0" cy="102.0" r="1" fill="rgba(168,85,247,0.18)"/><circle cx="112.0" cy="132.0" r="1" fill="rgba(168,85,247,0.18)"/><circle cx="112.0" cy="162.0" r="1" fill="rgba(168,85,247,0.18)"/><circle cx="160.0" cy="42.0" r="1" fill="rgba(168,85,247,0.18)"/><circle cx="160.0" cy="72.0" r="1" fill="rgba(168,85,247,0.18)"/><circle cx="160.0" cy="102.0" r="1" fill="rgba(168,85,247,0.18)"/><circle cx="160.0" cy="132.0" r="1" fill="rgba(168,85,247,0.18)"/><circle cx="160.0" cy="162.0" r="1" fill="rgba(168,85,247,0.18)"/><circle cx="208.0" cy="42.0" r="1" fill="rgba(168,85,247,0.18)"/><circle cx="208.0" cy="72.0" r="1" fill="rgba(168,85,247,0.18)"/><circle cx="208.0" cy="102.0" r="1" fill="rgba(168,85,247,0.18)"/><circle cx="208.0" cy="132.0" r="1" fill="rgba(168,85,247,0.18)"/><circle cx="208.0" cy="162.0" r="1" fill="rgba(168,85,247,0.18)"/><circle cx="256.0" cy="42.0" r="1" fill="rgba(168,85,247,0.18)"/><circle cx="256.0" cy="72.0" r="1" fill="rgba(168,85,247,0.18)"/><circle cx="256.0" cy="102.0" r="1" fill="rgba(168,85,247,0.18)"/><circle cx="256.0" cy="132.0" r="1" fill="rgba(168,85,247,0.18)"/><circle cx="256.0" cy="162.0" r="1" fill="rgba(168,85,247,0.18)"/><circle cx="304.0" cy="42.0" r="1" fill="rgba(168,85,247,0.18)"/><circle cx="304.0" cy="72.0" r="1" fill="rgba(168,85,247,0.18)"/><circle cx="304.0" cy="102.0" r="1" fill="rgba(168,85,247,0.18)"/><circle cx="304.0" cy="132.0" r="1" fill="rgba(168,85,247,0.18)"/><circle cx="304.0" cy="162.0" r="1" fill="rgba(168,85,247,0.18)"/><line x1="16" y1="162" x2="304" y2="162" stroke="rgba(168,85,247,0.3)" stroke-width="1.2"/><line x1="16" y1="42" x2="16" y2="162" stroke="rgba(168,85,247,0.3)" stroke-width="1.2"/><path d="M 16.0 104.4 L 23.2 111.1 L 30.4 117.5 L 37.6 123.6 L 44.8 129.0 L 52.0 133.8 L 59.2 137.7 L 66.4 140.7 L 73.6 142.8 L 80.8 143.7 L 88.0 143.6 L 95.2 142.4 L 102.4 140.2 L 109.6 137.0 L 116.8 133.0 L 124.0 128.3 L 131.2 122.9 L 138.4 117.1 L 145.6 111.0 L 152.8 104.7 L 160.0 98.5 L 167.2 92.5 L 174.4 86.8 L 181.6 81.7 L 188.8 77.2 L 196.0 73.5 L 203.2 70.7 L 210.4 68.8 L 217.6 67.8 L 224.8 67.9 L 232.0 68.9 L 239.2 71.0 L 246.4 73.8 L 253.6 77.5 L 260.8 81.9 L 268.0 86.9 L 275.2 92.3 L 282.4 98.0 L 289.6 103.8 L 296.8 109.6 L 304.0 115.3 L 304.0 162.0 L 16.0 162.0 Z" fill="url(#sgr-fill)"/><path d="M 16.0 104.4 L 23.2 111.1 L 30.4 117.5 L 37.6 123.6 L 44.8 129.0 L 52.0 133.8 L 59.2 137.7 L 66.4 140.7 L 73.6 142.8 L 80.8 143.7 L 88.0 143.6 L 95.2 142.4 L 102.4 140.2 L 109.6 137.0 L 116.8 133.0 L 124.0 128.3 L 131.2 122.9 L 138.4 117.1 L 145.6 111.0 L 152.8 104.7 L 160.0 98.5 L 167.2 92.5 L 174.4 86.8 L 181.6 81.7 L 188.8 77.2 L 196.0 73.5 L 203.2 70.7 L 210.4 68.8 L 217.6 67.8 L 224.8 67.9 L 232.0 68.9 L 239.2 71.0 L 246.4 73.8 L 253.6 77.5 L 260.8 81.9 L 268.0 86.9 L 275.2 92.3 L 282.4 98.0 L 289.6 103.8 L 296.8 109.6 L 304.0 115.3" fill="none" stroke="url(#sgr-curve)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="73.6" cy="142.8" r="3.2" fill="#08040f" stroke="#e9d5ff" stroke-width="1.4"/><circle cx="174.4" cy="86.8" r="3.2" fill="#08040f" stroke="#e9d5ff" stroke-width="1.4"/><circle cx="253.6" cy="77.5" r="3.2" fill="#08040f" stroke="#e9d5ff" stroke-width="1.4"/><rect x="220.0" y="46.0" width="84.0" height="22.0" rx="8" fill="rgba(8,4,15,0.55)" stroke="rgba(168,85,247,0.25)" stroke-width="1" /><line x1="230" y1="57" x2="246" y2="57" stroke="#c084fc" stroke-width="2.4" stroke-linecap="round"/><rect x="252.0" y="54.0" width="26.0" height="6.0" rx="3" fill="rgba(232,220,255,0.6)"  /></svg>`,
  // Media gallery mock
  gallery: `<svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><defs>
<linearGradient id="sgl-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#120a2e"/><stop offset="100%" stop-color="#08040f"/></linearGradient>
<radialGradient id="sgl-t1" cx="35%" cy="30%" r="75%"><stop offset="0%" stop-color="#e9d5ff"/><stop offset="50%" stop-color="#8b5cf6"/><stop offset="100%" stop-color="#241154"/></radialGradient>
<radialGradient id="sgl-t2" cx="60%" cy="60%" r="80%"><stop offset="0%" stop-color="#c084fc"/><stop offset="55%" stop-color="#6d28d9"/><stop offset="100%" stop-color="#180835"/></radialGradient>
<radialGradient id="sgl-t3" cx="45%" cy="40%" r="70%"><stop offset="0%" stop-color="#d8b4fe"/><stop offset="50%" stop-color="#7c3aed"/><stop offset="100%" stop-color="#1e0a42"/></radialGradient>
</defs><rect x="0.0" y="0.0" width="320.0" height="200.0" rx="0" fill="url(#sgl-bg)"  /><rect x="16.0" y="14.0" width="110.0" height="8.0" rx="4" fill="rgba(233,213,255,0.55)"  /><rect x="266.0" y="12.0" width="16.0" height="16.0" rx="4" fill="rgba(124,58,237,0.22)" stroke="rgba(168,85,247,0.35)" stroke-width="1" /><rect x="288.0" y="12.0" width="16.0" height="16.0" rx="4" fill="rgba(255,255,255,0.03)" stroke="rgba(168,85,247,0.2)" stroke-width="1" /><rect x="16.0" y="40.0" width="120.0" height="124.0" rx="10" fill="url(#sgl-t1)"  /><circle cx="46.7" cy="107.1" r="0.7" fill="#fff" opacity="0.59"/><circle cx="90.1" cy="51.6" r="0.5" fill="#fff" opacity="0.68"/><circle cx="49.0" cy="71.2" r="1.1" fill="#fff" opacity="0.54"/><circle cx="113.7" cy="99.3" r="0.9" fill="#fff" opacity="0.41"/><circle cx="91.1" cy="144.7" r="0.8" fill="#fff" opacity="0.65"/><circle cx="95.2" cy="51.4" r="1.0" fill="#fff" opacity="0.59"/><rect x="24.0" y="142.0" width="60.0" height="7.0" rx="3.5" fill="rgba(8,4,15,0.5)"  /><rect x="24.0" y="48.0" width="54.0" height="16.0" rx="8" fill="rgba(8,4,15,0.45)"  /><rect x="32.0" y="53.0" width="38.0" height="6.0" rx="3" fill="rgba(245,243,255,0.7)"  /><rect x="144.0" y="40.0" width="72.0" height="58.0" rx="9" fill="url(#sgl-t2)"  /><circle cx="167.3" cy="45.6" r="1.0" fill="#fff" opacity="0.54"/><circle cx="194.0" cy="87.9" r="0.9" fill="#fff" opacity="0.72"/><circle cx="173.3" cy="84.0" r="0.8" fill="#fff" opacity="0.72"/><rect x="222.0" y="40.0" width="82.0" height="58.0" rx="9" fill="url(#sgl-t3)"  /><circle cx="291.0" cy="48.9" r="0.6" fill="#fff" opacity="0.44"/><circle cx="297.4" cy="65.8" r="0.9" fill="#fff" opacity="0.47"/><circle cx="263.5" cy="63.3" r="0.7" fill="#fff" opacity="0.58"/><rect x="144.0" y="104.0" width="72.0" height="60.0" rx="9" fill="url(#sgl-t3)"  /><circle cx="185.4" cy="155.0" r="0.9" fill="#fff" opacity="0.72"/><circle cx="202.8" cy="159.5" r="0.9" fill="#fff" opacity="0.42"/><circle cx="203.1" cy="158.2" r="1.0" fill="#fff" opacity="0.58"/><rect x="222.0" y="104.0" width="82.0" height="60.0" rx="9" fill="url(#sgl-t2)"  /><circle cx="278.8" cy="119.0" r="1.0" fill="#fff" opacity="0.58"/><circle cx="247.1" cy="111.3" r="1.0" fill="#fff" opacity="0.75"/><circle cx="232.6" cy="149.6" r="0.7" fill="#fff" opacity="0.41"/></svg>`,
  // small pill icons
  pinGrid: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.4"/><rect x="14" y="3" width="7" height="7" rx="1.4"/><rect x="3" y="14" width="7" height="7" rx="1.4"/><rect x="14" y="14" width="7" height="7" rx="1.4"/></svg>`,
  image: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
  grid: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
  graph: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M19 9l-5 5-4-4-4 4"/></svg>`,
  orbit: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(-25 12 12)"/></svg>`,
  chat: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8A8.5 8.5 0 0 1 21 11.5z"/></svg>`
};

// ---------- Complete Translations ----------
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
      sectionImages: {
        featurePanel: '',
        ctaBanner: ''
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
      return [
        { key: 'shotObject',   descKey: 'shotObjectDesc',   svg: HERO_SVGS.objectBrowser, href: 'object.html' },
        { key: 'shotApod',     descKey: 'shotApodDesc',     pos: 'tr', svg: HERO_SVGS.apod,        href: 'object.html' },
        { key: 'shotGraph',    descKey: 'shotGraphDesc',    pos: 'tl', svg: HERO_SVGS.grapher,     href: 'object.html' },
        { key: 'shotGallery',  descKey: 'shotGalleryDesc',  pos: 'bl', svg: HERO_SVGS.gallery,      href: 'object.html' },
        { key: 'shotPlanet',   descKey: 'shotPlanetDesc',   pos: 'br', svg: HERO_SVGS.planetarium,  href: 'object.html' },
        { key: 'shotForum',    descKey: 'shotForumDesc',    pos: 'rb', svg: HERO_SVGS.community,    href: 'object.html' },
        { key: 'shotObserver', descKey: 'shotObserverDesc', pos: 'll', svg: HERO_SVGS.observer,      href: 'object.html' }
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
  methods: {
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
      if (featuresSection) {
        const rect = featuresSection.getBoundingClientRect();
        this.navCompact = rect.top <= nav.offsetHeight + 220;
      }
    }, { passive: true });
    // Background starfield (shared helper — see common.js). 220 keeps the
    // slightly denser star count this page originally shipped with.
    window.CosmoKlub.initStarfield(220);
  }
}).mount('#app');