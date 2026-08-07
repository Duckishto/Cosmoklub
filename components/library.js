// Library tab: roadmap-style astronomy lessons connected to CosmoKlub progress.
const Library={
  name:'Library',
  template:`
    <div class="library-roadmap">
      <div class="section library-hero">
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
      </div>
      <div class="section">
        <div class="lessons-grid roadmap-grid">
          <div
            class="lesson-card roadmap-card"
            v-for="lesson in lessons"
            :key="lesson.id"
            @click="startLesson(lesson)"
          >
            <div class="roadmap-card-top">
              <div class="lesson-icon roadmap-icon" v-html="lesson.svg"></div>
              <div class="lesson-tier" :class="lesson.tierClass">{{ lesson.rank }}</div>
            </div>
            <div class="lesson-title">{{ lesson.title }}</div>
            <div class="lesson-desc">{{ lesson.desc }}</div>
            <div class="lesson-progress-row">
              <span>Level {{ lesson.level }}</span>
              <span>{{ lesson.completedLessons }} / {{ lesson.totalLessons }}</span>
            </div>
            <div class="lesson-progress-track">
              <div
                class="lesson-progress-fill"
                :style="{width:progressPercent(lesson)+'%'}"
              ></div>
            </div>
            <div class="unlock-row">
              <div class="unlock-pill is-open">Active learning</div>
              <div class="unlock-pill" :class="{'is-open':lesson.quizUnlocked}">Quiz</div>
              <div class="unlock-pill" :class="{'is-open':lesson.nextUnlocked}">Next lesson</div>
            </div>
            <div class="lesson-next">
              <span>{{ lesson.nextLabel }}</span>
              <strong>{{ lesson.xp }} XP</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  data(){
    return{
      progressRevision:0,
      progressListener:null,
      storageListener:null,
      ranks:[
        {name:'BRONZE',className:'rank-bronze',tierClass:'tier-bronze',minLevel:1},
        {name:'SILVER',className:'rank-silver',tierClass:'tier-silver',minLevel:5},
        {name:'GOLD',className:'rank-gold',tierClass:'tier-gold',minLevel:9},
        {name:'PLATINUM',className:'rank-platinum',tierClass:'tier-platinum',minLevel:13},
        {name:'DIAMOND',className:'rank-diamond',tierClass:'tier-diamond',minLevel:17}
      ],
      categoryConfigs:[
        {
          id:'stars',
          title:'Stars',
          desc:'Birth, life, and death of stars from protostars to supernovae.',
          totalLessons:20,
          svg:`<svg viewBox="0 0 24 24" fill="#facc15"><path d="m12 2 2.9 6.15 6.6.8-4.85 4.5 1.25 6.55L12 16.75 6.1 20l1.25-6.55-4.85-4.5 6.6-.8L12 2z"/></svg>`
        },
        {
          id:'galaxies',
          title:'Galaxies',
          desc:'Island universes: spirals, ellipticals, and the Milky Way.',
          totalLessons:20,
          svg:`<svg viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="1.7" stroke-linecap="round"><path d="M4 14c4.8-7.4 12.3-8 16-2.8"/><path d="M3 18c5-3.8 12-3.5 18 1"/><path d="M7 9c3.2 3.4 6.8 4 10.8 1.5"/></svg>`
        },
        {
          id:'cosmology',
          title:'Cosmology',
          desc:'The origin, evolution, and fate of the universe.',
          totalLessons:20,
          svg:`<svg viewBox="0 0 24 24" fill="none" stroke="#c084fc" stroke-width="1.6" stroke-linecap="round"><path d="M12 3v18"/><path d="M4 12h16"/><path d="m5 5 14 14"/><path d="m19 5-14 14"/><circle cx="12" cy="12" r="2.2"/></svg>`
        },
        {
          id:'planets',
          title:'Planets',
          desc:"Our solar system's worlds and the hunt for exoplanets.",
          totalLessons:20,
          svg:`<svg viewBox="0 0 24 24" fill="none" stroke="#fb923c" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="5.2"/><path d="M3.2 14.2c2.8 2.2 9.4 1.7 14.6-1.1 2.1-1.1 3.2-2.3 3-3.2-.3-1.1-2.6-1.2-5.5-.4"/></svg>`
        },
        {
          id:'nebulae',
          title:'Nebulae',
          desc:'Cosmic clouds where stars and planets are forged.',
          totalLessons:20,
          svg:`<svg viewBox="0 0 24 24" fill="none"><path d="M7 15.5c-2.2 0-4-1.3-4-3.2 0-1.7 1.4-3 3.2-3.2C7 6.8 9.2 5.5 11.7 6c1.7.3 3.1 1.4 3.8 2.9.4-.1.8-.2 1.3-.2 2.3 0 4.2 1.5 4.2 3.5s-1.9 3.4-4.2 3.4H7z" fill="#d8b4fe"/><circle cx="9" cy="11" r="1" fill="#fff"/><circle cx="15" cy="13" r="1.2" fill="#fff"/></svg>`
        },
        {
          id:'observing',
          title:'Observing',
          desc:'Tips for naked-eye, binocular, and telescope astronomy.',
          totalLessons:20,
          svg:`<svg viewBox="0 0 24 24" fill="none" stroke="#fde68a" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4 3 16"/><path d="m6 10 9 4"/><path d="m11 5 9 4"/><path d="m15 14 3 6"/><path d="M12 13 9 20"/><path d="M16 8l2-4"/></svg>`
        }
      ]
    };
  },
  computed:{
    lessons(){
      this.progressRevision;
      return this.categoryConfigs.map(config=>{
        const stats=this.categoryStats(config.id);
        const completedIds=stats.completedLessonIds||[];
        return{
          ...config,
          completedLessons:stats.completedLessons,
          totalLessons:stats.totalLessons||config.totalLessons,
          level:stats.level,
          xp:stats.xp,
          rank:stats.rank,
          tierClass:stats.tierClass,
          quizUnlocked:this.isQuizUnlocked(config.id,completedIds),
          nextUnlocked:this.isNextLessonUnlocked(config.id,completedIds),
          nextLabel:this.getNextLabel(config.id,completedIds)
        };
      });
    },
    overallProgress(){
      this.progressRevision;
      if(typeof window.getOverallProgress==='function'){
        return window.getOverallProgress();
      }
      const totalCompleted=this.lessons.reduce((sum,lesson)=>sum+lesson.completedLessons,0);
      const totalLessons=this.lessons.reduce((sum,lesson)=>sum+lesson.totalLessons,0);
      const averageLevel=this.lessons.length
        ?Math.round(this.lessons.reduce((sum,lesson)=>sum+lesson.level,0)/this.lessons.length)
        :1;
      return{
        totalCompleted,
        totalLessons,
        averageLevel,
        rank:this.rankForLevel(averageLevel).name
      };
    },
    totalCompleted(){
      return this.overallProgress.totalCompleted;
    },
    totalLessons(){
      return this.overallProgress.totalLessons;
    },
    averageLevel(){
      return this.overallProgress.averageLevel;
    },
    overallRank(){
      return this.overallProgress.rank;
    }
  },
  methods:{
    categoryStats(categoryId){
      this.progressRevision;
      if(typeof window.getCategoryStats==='function'){
        return window.getCategoryStats(categoryId);
      }
      const config=this.categoryConfigs.find(category=>category.id===categoryId);
      return{
        id:categoryId,
        xp:0,
        completedLessons:0,
        completedLessonIds:[],
        totalLessons:config?config.totalLessons:20,
        completionPercent:0,
        level:1,
        rank:'BRONZE',
        tierClass:'tier-bronze'
      };
    },
    getCourseLessons(categoryId){
      if(
        typeof COURSE_DATA==='undefined'||
        !COURSE_DATA[categoryId]||
        !Array.isArray(COURSE_DATA[categoryId].sections)
      ){
        return[];
      }
      return COURSE_DATA[categoryId].sections.flatMap(section=>{
        return Array.isArray(section.lessons)?section.lessons:[];
      });
    },
    isQuizUnlocked(categoryId,completedIds){
      const lessons=this.getCourseLessons(categoryId);
      const quizIndex=lessons.findIndex(lesson=>lesson.type==='quiz');
      if(quizIndex<0){
        return false;
      }
      if(quizIndex===0){
        return true;
      }
      return completedIds.includes(lessons[quizIndex-1].id);
    },
    isNextLessonUnlocked(categoryId,completedIds){
      const lessons=this.getCourseLessons(categoryId);
      if(lessons.length<2){
        return false;
      }
      return completedIds.includes(lessons[0].id);
    },
    getNextLabel(categoryId,completedIds){
      const lessons=this.getCourseLessons(categoryId);
      if(!lessons.length){
        return 'Start learning';
      }
      const nextLesson=lessons.find(lesson=>!completedIds.includes(lesson.id));
      if(!nextLesson){
        return 'Category complete';
      }
      return `Next: ${nextLesson.title}`;
    },
    progressPercent(lesson){
      if(!lesson.totalLessons){
        return 0;
      }
      return Math.max(
        0,
        Math.min(
          100,
          Math.round((lesson.completedLessons/lesson.totalLessons)*100)
        )
      );
    },
    rankForLevel(level){
      return[...this.ranks].reverse().find(rank=>level>=rank.minLevel)||this.ranks[0];
    },
    startLesson(lesson){
      window.location.href=`roadmap.html?category=${lesson.id}`;
    },
    refreshProgress(){
      this.progressRevision++;
    },
    injectLibraryStyles(){
      if(document.getElementById('library-roadmap-styles')){
        return;
      }
      const style=document.createElement('style');
      style.id='library-roadmap-styles';
      style.textContent=`
        .library-roadmap .section { margin-bottom: 20px; }
        .library-hero { padding: 2px 0 4px; }
        .rank-summary {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 220px;
          gap: 14px;
          align-items: stretch;
          margin-bottom: 14px;
        }
        .rank-kicker {
          color: var(--violet);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 5px;
        }
        .rank-title {
          color: var(--stardust);
          font-size: clamp(22px, 4vw, 34px);
          line-height: 1.05;
          letter-spacing: 0;
          max-width: 720px;
        }
        .rank-panel {
          background: rgba(124, 58, 237, 0.1);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 14px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 118px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
        }
        .rank-panel-label {
          color: var(--muted);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .rank-panel-rank {
          color: var(--stardust);
          font-size: 26px;
          font-weight: 900;
          line-height: 1;
          margin-top: 9px;
        }
        .rank-panel-meta {
          color: var(--muted);
          font-size: 11px;
          margin-top: 8px;
        }
        .roadmap-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }
        .roadmap-card {
          min-height: 216px;
          display: flex;
          flex-direction: column;
          gap: 9px;
          background:
            linear-gradient(
              135deg,
              rgba(14, 42, 74, 0.34),
              rgba(42, 15, 61, 0.3)
            ),
            rgba(124,58,237,0.07);
          position: relative;
          overflow: hidden;
        }
        .roadmap-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(124,58,237,0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124,58,237,0.045) 1px, transparent 1px);
          background-size: 32px 32px;
          pointer-events: none;
        }
        .roadmap-card > * {
          position: relative;
          z-index: 1;
        }
        .roadmap-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
        }
        .roadmap-icon {
          width: 34px;
          height: 34px;
          margin-bottom: 0;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .roadmap-icon svg {
          width: 21px;
          height: 21px;
        }
        .lesson-progress-row,
        .lesson-next {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          color: var(--muted);
          font-size: 11px;
        }
        .lesson-progress-track {
          height: 6px;
          border-radius: 999px;
          background: rgba(255,255,255,0.07);
          overflow: hidden;
        }
        .lesson-progress-fill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, var(--purple), var(--glow));
          transition: width 0.35s ease;
        }
        .unlock-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: auto;
        }
        .unlock-pill {
          border: 1px solid rgba(139,122,168,0.25);
          border-radius: 999px;
          color: rgba(139,122,168,0.7);
          font-size: 10px;
          font-weight: 700;
          padding: 3px 8px;
        }
        .unlock-pill.is-open {
          color: #d8b4fe;
          border-color: rgba(168,85,247,0.4);
          background: rgba(168,85,247,0.12);
        }
        .lesson-next strong {
          color: var(--glow);
          white-space: nowrap;
        }
        .tier-bronze {
          color: #f59e0b;
          background: rgba(245,158,11,0.12);
          border: 1px solid rgba(245,158,11,0.22);
        }
        .tier-silver {
          color: #cbd5e1;
          background: rgba(203,213,225,0.1);
          border: 1px solid rgba(203,213,225,0.2);
        }
        .tier-gold {
          color: #facc15;
          background: rgba(250,204,21,0.12);
          border: 1px solid rgba(250,204,21,0.24);
        }
        .tier-platinum {
          color: #67e8f9;
          background: rgba(103,232,249,0.1);
          border: 1px solid rgba(103,232,249,0.22);
        }
        .tier-diamond {
          color: #93c5fd;
          background: rgba(147,197,253,0.12);
          border: 1px solid rgba(147,197,253,0.25);
        }
        @media (max-width: 760px) {
          .rank-summary,
          .roadmap-grid {
            grid-template-columns: 1fr;
          }
        }
      `;
      document.head.appendChild(style);
    }
  },
  mounted(){
    this.injectLibraryStyles();
    this.progressListener=()=>{
      this.refreshProgress();
    };
    this.storageListener=event=>{
      if(!event.key||event.key.includes('cosmoklub')){
        this.refreshProgress();
      }
    };
    window.addEventListener('cosmoklub-progress-changed',this.progressListener);
    window.addEventListener('storage',this.storageListener);
    this.refreshProgress();
  },
  beforeUnmount(){
    if(this.progressListener){
      window.removeEventListener('cosmoklub-progress-changed',this.progressListener);
    }
    if(this.storageListener){
      window.removeEventListener('storage',this.storageListener);
    }
  }
};
