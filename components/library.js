// Library tab: roadmap-style astronomy lessons + saved objects placeholder.
const Library = {
  name: 'Library',
  template: `
    <div class="library-roadmap">
      <div class="section library-hero">
        <div class="section-eyebrow-row">
          
          <div class="section-rule"></div>
         
        </div>
        <div class="rank-summary">
          <div>
            <div class="rank-kicker">Study Roadmap</div>
            <h2 class="rank-title">Level up each category to unlock deeper space knowledge.</h2>
           
          </div>
          <div class="rank-panel">
            <div class="rank-panel-label">Overall Rank</div>
            <div class="rank-panel-rank">{{ overallRank }}</div>
            <div class="rank-panel-meta">{{ totalCompleted }} / {{ totalLessons }} lessons complete</div>
          </div>
        </div>
        <div class="rank-ladder" aria-label="Rank ladder">
          <div v-for="rank in ranks" :key="rank.name" class="rank-step" :class="[rank.className, { active: rank.name === overallRank }]">
            <span class="rank-dot"></span><span>{{ rank.name }}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="lessons-grid roadmap-grid">
          <div class="lesson-card roadmap-card" v-for="lesson in lessons" :key="lesson.id" @click="startLesson(lesson)">
            <div class="roadmap-card-top">
              <div class="lesson-icon roadmap-icon" v-html="lesson.svg"></div>
              <div class="lesson-tier" :class="lesson.tierClass">{{ lesson.rank }}</div>
            </div>
            <div class="lesson-title">{{ lesson.title }}</div>
            <div class="lesson-desc">{{ lesson.desc }}</div>
            <div class="lesson-progress-row"><span>Level {{ lesson.level }}</span><span>{{ lesson.completedLessons }} / {{ lesson.totalLessons }}</span></div>
            <div class="lesson-progress-track"><div class="lesson-progress-fill" :style="{ width: progressPercent(lesson) + '%' }"></div></div>
            <div class="unlock-row">
              <div class="unlock-pill is-open">Active learning</div>
              <div class="unlock-pill" :class="{ 'is-open': lesson.quizUnlocked }">Quiz</div>
              <div class="unlock-pill" :class="{ 'is-open': lesson.nextUnlocked }">Next lesson</div>
            </div>
            <div class="lesson-next"><span>{{ lesson.nextLabel }}</span><strong>{{ lesson.xp }} XP</strong></div>
          </div>
        </div>
      </div>

      <div class="section saved-wip">
        <div class="section-eyebrow-row">
          <span class="section-label">Your Saved Objects</span>
          <div class="section-rule"></div>
          <span class="section-link" @click="clearAllSaved">Clear all</span>
        </div>
        <div class="saved-wip-note">WIP - object saving will connect here later.</div>
        <div v-if="savedItems.length > 0" class="library-grid saved-grid">
          <div v-for="(item, idx) in savedItems" :key="item.name" class="library-item saved-item">
            <div class="library-icon saved-icon" v-html="objectSvg"></div>
            <div class="library-info"><div class="library-name">{{ item.name }}</div><div class="library-meta">{{ item.type }} | Saved {{ item.date }}</div></div>
            <div class="remove-btn" @click.stop="removeSavedItem(idx)">Remove</div>
          </div>
        </div>
        <div v-else class="empty-library">
          <div class="empty-icon" v-html="objectSvg"></div>
          <p>Your saved objects area is waiting.</p>
          <p class="empty-sub">This will be connected after the learning roadmap is finished.</p>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      ranks: [
        { name: 'BRONZE', className: 'rank-bronze', minLevel: 1 },
        { name: 'SILVER', className: 'rank-silver', minLevel: 5 },
        { name: 'GOLD', className: 'rank-gold', minLevel: 9 },
        { name: 'PLATINUM', className: 'rank-platinum', minLevel: 13 },
        { name: 'DIAMOND', className: 'rank-diamond', minLevel: 17 }
      ],
      objectSvg: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
      savedItems: [
        { name: 'Orion Nebula (M42)', type: 'Emission Nebula', date: '2 days ago' },
        { name: 'Andromeda Galaxy (M31)', type: 'Spiral Galaxy', date: '5 days ago' },
        { name: 'Saturn Rings', type: 'Planetary Feature', date: '1 week ago' },
        { name: 'Pleiades (M45)', type: 'Open Cluster', date: '2 weeks ago' }
      ],
      lessons: [
        { id: 'stars', title: 'Stars', desc: 'Birth, life, and death of stars from protostars to supernovae.', completedLessons: 0, totalLessons: 20, level: 1, xp: 0, rank: 'BRONZE', tierClass: 'tier-bronze', quizUnlocked: true, nextUnlocked: true, nextLabel: 'Next: Stellar evolution', svg: '<svg viewBox="0 0 24 24" fill="#facc15"><path d="m12 2 2.9 6.15 6.6.8-4.85 4.5 1.25 6.55L12 16.75 6.1 20l1.25-6.55-4.85-4.5 6.6-.8L12 2z"/></svg>' },
        { id: 'galaxies', title: 'Galaxies', desc: 'Island universes: spirals, ellipticals, and the Milky Way.', completedLessons: 0, totalLessons: 20, level: 1, xp: 0, rank: 'BRONZE', tierClass: 'tier-bronze', quizUnlocked: true, nextUnlocked: true, nextLabel: 'Next: Galaxy mergers', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="1.7" stroke-linecap="round"><path d="M4 14c4.8-7.4 12.3-8 16-2.8"/><path d="M3 18c5-3.8 12-3.5 18 1"/><path d="M7 9c3.2 3.4 6.8 4 10.8 1.5"/></svg>' },
        { id: 'cosmology', title: 'Cosmology', desc: 'The origin, evolution, and fate of the universe.', completedLessons: 0, totalLessons: 20, level: 1, xp: 0, rank: 'BRONZE', tierClass: 'tier-bronze', quizUnlocked: true, nextUnlocked: true, nextLabel: 'Next: Dark energy', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="#c084fc" stroke-width="1.6" stroke-linecap="round"><path d="M12 3v18"/><path d="M4 12h16"/><path d="m5 5 14 14"/><path d="m19 5-14 14"/><circle cx="12" cy="12" r="2.2"/></svg>' },
        { id: 'planets', title: 'Planets', desc: "Our solar system's worlds and the hunt for exoplanets.", completedLessons: 0, totalLessons: 20, level: 1, xp: 0, rank: 'BRONZE', tierClass: 'tier-bronze', quizUnlocked: true, nextUnlocked: true, nextLabel: 'Next: Exoplanet detection', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="#fb923c" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="5.2"/><path d="M3.2 14.2c2.8 2.2 9.4 1.7 14.6-1.1 2.1-1.1 3.2-2.3 3-3.2-.3-1.1-2.6-1.2-5.5-.4"/></svg>' },
        { id: 'nebulae', title: 'Nebulae', desc: 'Cosmic clouds where stars and planets are forged.', completedLessons: 0, totalLessons: 20, level: 1, xp: 0, rank: 'BRONZE', tierClass: 'tier-bronze', quizUnlocked: true, nextUnlocked: true, nextLabel: 'Next: Star-forming regions', svg: '<svg viewBox="0 0 24 24" fill="none"><path d="M7 15.5c-2.2 0-4-1.3-4-3.2 0-1.7 1.4-3 3.2-3.2C7 6.8 9.2 5.5 11.7 6c1.7.3 3.1 1.4 3.8 2.9.4-.1.8-.2 1.3-.2 2.3 0 4.2 1.5 4.2 3.5s-1.9 3.4-4.2 3.4H7z" fill="#d8b4fe"/><circle cx="9" cy="11" r="1" fill="#fff"/><circle cx="15" cy="13" r="1.2" fill="#fff"/></svg>' },
        { id: 'observing', title: 'Observing', desc: 'Tips for naked-eye, binocular, and telescope astronomy.', completedLessons: 0, totalLessons: 20, level: 1, xp: 0, rank: 'BRONZE', tierClass: 'tier-bronze', quizUnlocked: true, nextUnlocked: false, nextLabel: 'Pass quiz to unlock next', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="#fde68a" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4 3 16"/><path d="m6 10 9 4"/><path d="m11 5 9 4"/><path d="m15 14 3 6"/><path d="M12 13 9 20"/><path d="M16 8l2-4"/></svg>' }
      ]
    };
  },
  computed: {
    totalCompleted() { return this.lessons.reduce((sum, lesson) => sum + lesson.completedLessons, 0); },
    totalLessons() { return this.lessons.reduce((sum, lesson) => sum + lesson.totalLessons, 0); },
    averageLevel() { return Math.round(this.lessons.reduce((sum, lesson) => sum + lesson.level, 0) / this.lessons.length); },
    overallRank() { return this.rankForLevel(this.averageLevel).name; }
  },
  methods: {
    removeSavedItem(index) { this.savedItems.splice(index, 1); },
    clearAllSaved() { this.savedItems = []; },
    progressPercent(lesson) { return Math.round((lesson.completedLessons / lesson.totalLessons) * 100); },
    rankForLevel(level) { return [...this.ranks].reverse().find(rank => level >= rank.minLevel) || this.ranks[0]; },
    startLesson(lesson) { alert(lesson.title + '\n\nRank: ' + lesson.rank + '\nLevel: ' + lesson.level + '\nProgress: ' + lesson.completedLessons + '/' + lesson.totalLessons + ' lessons\n' + lesson.nextLabel); },
    injectLibraryStyles() {
      if (document.getElementById('library-roadmap-styles')) return;
      const style = document.createElement('style');
      style.id = 'library-roadmap-styles';
      style.textContent = `
        .library-roadmap .section { margin-bottom: 20px; }
        .library-hero { padding: 2px 0 4px; }
        .rank-summary { display: grid; grid-template-columns: minmax(0, 1fr) 220px; gap: 14px; align-items: stretch; margin-bottom: 14px; }
        .rank-kicker { color: var(--violet); font-size: 11px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 5px; }
        .rank-title { color: var(--stardust); font-size: clamp(22px, 4vw, 34px); line-height: 1.05; letter-spacing: 0; max-width: 720px; }
        .rank-copy { color: var(--muted); font-size: 13px; line-height: 1.65; max-width: 620px; margin-top: 8px; }
        .rank-panel { background: rgba(124, 58, 237, 0.1); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px; display: flex; flex-direction: column; justify-content: center; min-height: 118px; box-shadow: inset 0 1px 0 rgba(255,255,255,0.04); }
        .rank-panel-label { color: var(--muted); font-size: 10px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; }
        .rank-panel-rank { color: var(--stardust); font-size: 26px; font-weight: 900; line-height: 1; margin-top: 9px; }
        .rank-panel-meta { color: var(--muted); font-size: 11px; margin-top: 8px; }
        .rank-ladder { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 8px; }
        .rank-step { display: flex; align-items: center; justify-content: center; gap: 7px; min-height: 36px; border: 1px solid var(--border); border-radius: 8px; background: rgba(255,255,255,0.035); color: var(--muted); font-size: 10px; font-weight: 800; letter-spacing: 0.08em; }
        .rank-step.active { color: var(--stardust); border-color: rgba(192,132,252,0.7); box-shadow: 0 0 18px rgba(168,85,247,0.22); }
        .rank-dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
        .roadmap-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
        .roadmap-card { min-height: 216px; display: flex; flex-direction: column; gap: 9px; background: linear-gradient(135deg, rgba(14, 42, 74, 0.34), rgba(42, 15, 61, 0.3)), rgba(124,58,237,0.07); position: relative; overflow: hidden; }
        .roadmap-card::after { content: ''; position: absolute; inset: 0; background-image: linear-gradient(rgba(124,58,237,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.045) 1px, transparent 1px); background-size: 32px 32px; pointer-events: none; }
        .roadmap-card > * { position: relative; z-index: 1; }
        .roadmap-card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
        .roadmap-icon { width: 34px; height: 34px; margin-bottom: 0; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); }
        .roadmap-icon svg { width: 21px; height: 21px; }
        .lesson-progress-row, .lesson-next { display: flex; align-items: center; justify-content: space-between; gap: 10px; color: var(--muted); font-size: 11px; }
        .lesson-progress-track { height: 6px; border-radius: 999px; background: rgba(255,255,255,0.07); overflow: hidden; }
        .lesson-progress-fill { height: 100%; border-radius: inherit; background: linear-gradient(90deg, var(--purple), var(--glow)); }
        .unlock-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: auto; }
        .unlock-pill { border: 1px solid rgba(139,122,168,0.25); border-radius: 999px; color: rgba(139,122,168,0.7); font-size: 10px; font-weight: 700; padding: 3px 8px; }
        .unlock-pill.is-open { color: #d8b4fe; border-color: rgba(168,85,247,0.4); background: rgba(168,85,247,0.12); }
        .lesson-next strong { color: var(--glow); white-space: nowrap; }
        .tier-bronze { color: #f59e0b; background: rgba(245,158,11,0.12); border: 1px solid rgba(245,158,11,0.22); }
        .tier-silver { color: #cbd5e1; background: rgba(203,213,225,0.1); border: 1px solid rgba(203,213,225,0.2); }
        .tier-gold { color: #facc15; background: rgba(250,204,21,0.12); border: 1px solid rgba(250,204,21,0.24); }
        .tier-platinum { color: #67e8f9; background: rgba(103,232,249,0.1); border: 1px solid rgba(103,232,249,0.22); }
        .tier-diamond { color: #93c5fd; background: rgba(147,197,253,0.12); border: 1px solid rgba(147,197,253,0.25); }
        .saved-wip { opacity: 0.82; }
        .saved-wip-note { color: var(--muted); font-size: 12px; margin: -4px 0 10px; }
        .saved-grid { gap: 10px; }
        .saved-item { min-height: 66px; }
        .saved-icon, .empty-icon { display: flex; color: var(--violet); }
        .empty-sub { font-size: 12px; margin-top: 6px; }
        @media (max-width: 760px) { .rank-summary, .roadmap-grid, .library-grid { grid-template-columns: 1fr; } .rank-ladder { grid-template-columns: repeat(2, minmax(0, 1fr)); } .rank-step:last-child { grid-column: 1 / -1; } }
      `;
      document.head.appendChild(style);
    }
  },
  mounted() { this.injectLibraryStyles(); }
};
