// Library tab: roadmap-style astronomy lessons.
const Library={
  name:'Library',

  template:`
    <div class="library-roadmap">
      <div class="section library-hero">
        <div class="rank-summary">

          <div>
            <div class="rank-kicker">Study Roadmap</div>
            <h2 class="rank-title">
              Level up each category to unlock deeper space knowledge.
            </h2>
          </div>

          <div
            class="rank-panel liquid-rank-panel"
            ref="rankPanel"
          >
            <div class="rank-panel-label">Overall Rank</div>

            <div class="rank-panel-rank">
              {{ overallRank }}
            </div>

            <div class="rank-panel-meta">
              {{ totalCompleted }} / {{ totalLessons }} lessons complete
            </div>
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
              <div
                class="lesson-icon roadmap-icon"
                v-html="lesson.svg"
              ></div>

              <div
                class="lesson-tier"
                :class="lesson.tierClass"
              >
                {{ lesson.rank }}
              </div>
            </div>

            <div class="lesson-title">
              {{ lesson.title }}
            </div>

            <div class="lesson-desc">
              {{ lesson.desc }}
            </div>

            <div class="lesson-progress-row">
              <span>
                Level {{ lesson.level }}
              </span>

              <span>
                {{ lesson.completedLessons }} /
                {{ lesson.totalLessons }}
              </span>
            </div>

            <div class="lesson-progress-track">
              <div
                class="lesson-progress-fill"
                :style="{
                  width:progressPercent(lesson)+'%'
                }"
              ></div>
            </div>

            <div class="unlock-row">
              <div class="unlock-pill is-open">
                Active learning
              </div>

              <div
                class="unlock-pill"
                :class="{
                  'is-open':lesson.quizUnlocked
                }"
              >
                Quiz
              </div>

              <div
                class="unlock-pill"
                :class="{
                  'is-open':lesson.nextUnlocked
                }"
              >
                Next lesson
              </div>
            </div>

            <div class="lesson-next">
              <span>
                {{ lesson.nextLabel }}
              </span>

              <strong>
                {{ lesson.xp }} XP
              </strong>
            </div>

          </div>

        </div>
      </div>
    </div>
  `,

  data(){
    return{
      ranks:[
        {
          name:'BRONZE',
          className:'rank-bronze',
          minLevel:1
        },
        {
          name:'SILVER',
          className:'rank-silver',
          minLevel:5
        },
        {
          name:'GOLD',
          className:'rank-gold',
          minLevel:9
        },
        {
          name:'PLATINUM',
          className:'rank-platinum',
          minLevel:13
        },
        {
          name:'DIAMOND',
          className:'rank-diamond',
          minLevel:17
        }
      ],

      lessons:[
        {
          id:'stars',
          title:'Stars',
          desc:'Birth, life, and death of stars from protostars to supernovae.',
          completedLessons:0,
          totalLessons:20,
          level:1,
          xp:0,
          rank:'BRONZE',
          tierClass:'tier-bronze',
          quizUnlocked:true,
          nextUnlocked:false,
          nextLabel:'Start your journey',
          svg:`
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fde68a"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 2v4"/>
              <path d="M12 18v4"/>
              <path d="m4.93 4.93 2.83 2.83"/>
              <path d="m16.24 16.24 2.83 2.83"/>
              <path d="M2 12h4"/>
              <path d="M18 12h4"/>
              <path d="m4.93 19.07 2.83-2.83"/>
              <path d="m16.24 7.76 2.83-2.83"/>
            </svg>
          `
        },

        {
          id:'galaxies',
          title:'Galaxies',
          desc:'Explore galaxy structure, evolution, dark matter, and cosmic environments.',
          completedLessons:0,
          totalLessons:20,
          level:1,
          xp:0,
          rank:'BRONZE',
          tierClass:'tier-bronze',
          quizUnlocked:true,
          nextUnlocked:false,
          nextLabel:'Start your journey',
          svg:`
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#c084fc"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <ellipse cx="12" cy="12" rx="9" ry="4"/>
              <ellipse
                cx="12"
                cy="12"
                rx="4"
                ry="9"
                transform="rotate(45 12 12)"
              />
              <circle cx="12" cy="12" r="1.5"/>
            </svg>
          `
        },

        {
          id:'cosmology',
          title:'Cosmology',
          desc:'Study the origin, expansion, structure, and fate of the universe.',
          completedLessons:0,
          totalLessons:20,
          level:1,
          xp:0,
          rank:'BRONZE',
          tierClass:'tier-bronze',
          quizUnlocked:true,
          nextUnlocked:false,
          nextLabel:'Start your journey',
          svg:`
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#93c5fd"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="2"/>
              <circle cx="12" cy="12" r="6"/>
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 2v20"/>
              <path d="M2 12h20"/>
            </svg>
          `
        },

        {
          id:'planets',
          title:'Planets',
          desc:'Learn how planets form, evolve, and compare across planetary systems.',
          completedLessons:0,
          totalLessons:20,
          level:1,
          xp:0,
          rank:'BRONZE',
          tierClass:'tier-bronze',
          quizUnlocked:true,
          nextUnlocked:false,
          nextLabel:'Start your journey',
          svg:`
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#67e8f9"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="5"/>
              <path d="M3 15c3-4 15-8 18-5"/>
              <path d="M3 15c1 3 10 4 18-5"/>
            </svg>
          `
        },

        {
          id:'nebulae',
          title:'Nebulae',
          desc:'Explore interstellar clouds, stellar nurseries, and glowing remnants.',
          completedLessons:0,
          totalLessons:20,
          level:1,
          xp:0,
          rank:'BRONZE',
          tierClass:'tier-bronze',
          quizUnlocked:true,
          nextUnlocked:false,
          nextLabel:'Start your journey',
          svg:`
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#f0abfc"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M4 15c-2-5 4-9 8-6"/>
              <path d="M8 9c1-5 9-5 10 0"/>
              <path d="M18 9c4 2 2 8-2 8"/>
              <path d="M16 17c-2 5-10 4-10-1"/>
              <circle cx="12" cy="13" r="2"/>
            </svg>
          `
        },

        {
          id:'observing',
          title:'Observing',
          desc:'Build practical skills with the night sky, telescopes, and astrophotography.',
          completedLessons:0,
          totalLessons:20,
          level:1,
          xp:0,
          rank:'BRONZE',
          tierClass:'tier-bronze',
          quizUnlocked:true,
          nextUnlocked:false,
          nextLabel:'Start your journey',
          svg:`
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fde68a"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M9 4 3 16"/>
              <path d="m6 10 9 4"/>
              <path d="m11 5 9 4"/>
              <path d="m15 14 3 6"/>
              <path d="M12 13 9 20"/>
              <path d="M16 8l2-4"/>
            </svg>
          `
        }
      ]
    };
  },

  computed:{
    totalCompleted(){
      return this.lessons.reduce(
        (sum,lesson)=>
          sum+lesson.completedLessons,
        0
      );
    },

    totalLessons(){
      return this.lessons.reduce(
        (sum,lesson)=>
          sum+lesson.totalLessons,
        0
      );
    },

    averageLevel(){
      return Math.round(
        this.lessons.reduce(
          (sum,lesson)=>
            sum+lesson.level,
          0
        )/
        this.lessons.length
      );
    },

    overallRank(){
      return this.rankForLevel(
        this.averageLevel
      ).name;
    }
  },

  methods:{
    progressPercent(lesson){
      return Math.round(
        (
          lesson.completedLessons/
          lesson.totalLessons
        )*100
      );
    },

    rankForLevel(level){
      return[
        ...this.ranks
      ]
      .reverse()
      .find(
        rank=>
          level>=rank.minLevel
      )||
      this.ranks[0];
    },

    startLesson(lesson){
      window.location.href=
        `roadmap.html?category=${lesson.id}`;
    },

    updateProgress(){
      if(
        typeof window.getCategoryStats!=='function'
      ){
        return;
      }

      this.lessons.forEach(lesson=>{
        const stats=
          window.getCategoryStats(
            lesson.id
          );

        if(!stats){
          return;
        }

        lesson.completedLessons=
          stats.completedLessons||0;

        lesson.totalLessons=
          stats.totalLessons||20;

        lesson.level=
          stats.level||1;

        lesson.xp=
          stats.xp||0;

        lesson.rank=
          stats.rank||'BRONZE';

        lesson.tierClass=
          `tier-${String(
            lesson.rank
          ).toLowerCase()}`;

        lesson.quizUnlocked=
          stats.quizUnlocked??true;

        lesson.nextUnlocked=
          stats.nextUnlocked??false;

        lesson.nextLabel=
          stats.nextLabel||
          'Continue learning';
      });
    },

    attachLiquidRankPanel(){
      const node=
        this.$refs.rankPanel;

      if(!node){
        return;
      }

      let previousX=null;
      let previousY=null;
      let previousTime=
        performance.now();

      let currentStretchX=1;
      let currentStretchY=1;

      let targetStretchX=1;
      let targetStretchY=1;

      let currentRotate=0;
      let targetRotate=0;

      let animationFrame=null;

      const animateLiquid=()=>{
        currentStretchX+=
          (
            targetStretchX-
            currentStretchX
          )*.12;

        currentStretchY+=
          (
            targetStretchY-
            currentStretchY
          )*.12;

        currentRotate+=
          (
            targetRotate-
            currentRotate
          )*.12;

        node.style.setProperty(
          '--rank-scale-x',
          currentStretchX.toFixed(4)
        );

        node.style.setProperty(
          '--rank-scale-y',
          currentStretchY.toFixed(4)
        );

        node.style.setProperty(
          '--rank-rotate',
          `${currentRotate.toFixed(2)}deg`
        );

        const moving=
          Math.abs(
            currentStretchX-
            targetStretchX
          )>.001||
          Math.abs(
            currentStretchY-
            targetStretchY
          )>.001||
          Math.abs(
            currentRotate-
            targetRotate
          )>.03;

        if(moving){
          animationFrame=
            requestAnimationFrame(
              animateLiquid
            );
        }else{
          animationFrame=null;
        }
      };

      const startAnimation=()=>{
        if(!animationFrame){
          animationFrame=
            requestAnimationFrame(
              animateLiquid
            );
        }
      };

      const pointerMove=event=>{
        const rect=
          node.getBoundingClientRect();

        const x=Math.max(
          0,
          Math.min(
            100,
            (
              (
                event.clientX-
                rect.left
              )/
              rect.width
            )*100
          )
        );

        const y=Math.max(
          0,
          Math.min(
            100,
            (
              (
                event.clientY-
                rect.top
              )/
              rect.height
            )*100
          )
        );

        const normalizedX=
          (x-50)/50;

        const normalizedY=
          (y-50)/50;

        node.style.setProperty(
          '--rank-glass-x',
          `${x}%`
        );

        node.style.setProperty(
          '--rank-glass-y',
          `${y}%`
        );

        node.style.setProperty(
          '--rank-liquid-x',
          normalizedX.toFixed(3)
        );

        node.style.setProperty(
          '--rank-liquid-y',
          normalizedY.toFixed(3)
        );

        node.style.setProperty(
          '--rank-highlight-x',
          `${
            50+
            normalizedX*22
          }%`
        );

        node.style.setProperty(
          '--rank-highlight-y',
          `${
            30+
            normalizedY*20
          }%`
        );

        const now=
          performance.now();

        const deltaTime=
          Math.max(
            8,
            now-previousTime
          );

        if(
          previousX!==null&&
          previousY!==null
        ){
          const velocityX=
            (
              event.clientX-
              previousX
            )/
            deltaTime;

          const velocityY=
            (
              event.clientY-
              previousY
            )/
            deltaTime;

          const speed=
            Math.min(
              1,
              Math.hypot(
                velocityX,
                velocityY
              )*.8
            );

          targetStretchX=
            1+
            Math.min(
              .025,
              Math.abs(
                velocityX
              )*.025
            );

          targetStretchY=
            1+
            Math.min(
              .025,
              Math.abs(
                velocityY
              )*.025
            );

          if(
            Math.abs(velocityX)>
            Math.abs(velocityY)
          ){
            targetStretchY=
              1-
              Math.min(
                .012,
                speed*.01
              );
          }else{
            targetStretchX=
              1-
              Math.min(
                .012,
                speed*.01
              );
          }

          targetRotate=
            Math.max(
              -1.2,
              Math.min(
                1.2,
                velocityX*1.2
              )
            );
        }

        previousX=
          event.clientX;

        previousY=
          event.clientY;

        previousTime=now;

        node.classList.add(
          'rank-liquid-hover'
        );

        startAnimation();
      };

      const reset=()=>{
        previousX=null;
        previousY=null;

        targetStretchX=1;
        targetStretchY=1;
        targetRotate=0;

        node.style.setProperty(
          '--rank-glass-x',
          '50%'
        );

        node.style.setProperty(
          '--rank-glass-y',
          '20%'
        );

        node.style.setProperty(
          '--rank-liquid-x',
          '0'
        );

        node.style.setProperty(
          '--rank-liquid-y',
          '0'
        );

        node.style.setProperty(
          '--rank-highlight-x',
          '50%'
        );

        node.style.setProperty(
          '--rank-highlight-y',
          '25%'
        );

        node.classList.remove(
          'rank-liquid-hover'
        );

        startAnimation();
      };

      node.addEventListener(
        'pointermove',
        pointerMove
      );

      node.addEventListener(
        'pointerleave',
        reset
      );

      node.addEventListener(
        'pointercancel',
        reset
      );
    },

    injectLibraryStyles(){
      if(
        document.getElementById(
          'library-roadmap-styles'
        )
      ){
        return;
      }

      const style=
        document.createElement(
          'style'
        );

      style.id=
        'library-roadmap-styles';

      style.textContent=`

        .library-roadmap .section{
          margin-bottom:20px;
        }

        .library-hero{
          padding:2px 0 4px;
        }

        .rank-summary{
          display:grid;
          grid-template-columns:
            minmax(0,1fr)
            220px;
          gap:14px;
          align-items:stretch;
          margin-bottom:14px;
        }

        .rank-kicker{
          color:var(--violet);
          font-size:11px;
          font-weight:800;
          letter-spacing:.12em;
          text-transform:uppercase;
          margin-bottom:5px;
        }

        .rank-title{
          color:var(--stardust);
          font-size:
            clamp(
              22px,
              4vw,
              34px
            );
          line-height:1.05;
          letter-spacing:0;
          max-width:720px;
        }

        /* =================================================
           LIQUID GLASS OVERALL RANK
           ================================================= */

        .liquid-rank-panel{
          --rank-glass-x:50%;
          --rank-glass-y:20%;

          --rank-highlight-x:50%;
          --rank-highlight-y:25%;

          --rank-liquid-x:0;
          --rank-liquid-y:0;

          --rank-scale-x:1;
          --rank-scale-y:1;

          --rank-rotate:0deg;

          min-height:118px;

          padding:14px;

          display:flex;
          flex-direction:column;
          justify-content:center;

          position:relative;
          isolation:isolate;
          overflow:hidden;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              .17
            );

          border-radius:
            calc(
              18px +
              var(--rank-liquid-y) *
              2px
            )
            calc(
              18px -
              var(--rank-liquid-x) *
              2px
            )
            calc(
              18px -
              var(--rank-liquid-y) *
              2px
            )
            calc(
              18px +
              var(--rank-liquid-x) *
              2px
            );

          background:
            radial-gradient(
              circle at
              var(--rank-glass-x)
              var(--rank-glass-y),

              rgba(
                255,
                255,
                255,
                .22
              )
              0%,

              rgba(
                255,
                255,
                255,
                .08
              )
              18%,

              transparent
              48%
            ),

            radial-gradient(
              circle at
              75% 80%,

              rgba(
                168,
                85,
                247,
                .20
              ),

              transparent
              52%
            ),

            linear-gradient(
              145deg,

              rgba(
                255,
                255,
                255,
                .09
              ),

              rgba(
                124,
                58,
                237,
                .035
              )
              48%,

              rgba(
                168,
                85,
                247,
                .12
              )
            );

          -webkit-backdrop-filter:
            blur(22px)
            saturate(210%)
            brightness(1.08);

          backdrop-filter:
            blur(22px)
            saturate(210%)
            brightness(1.08);

          box-shadow:
            0 14px 34px
            rgba(
              0,
              0,
              0,
              .22
            ),

            inset
            0 1px 0
            rgba(
              255,
              255,
              255,
              .38
            ),

            inset
            0 -1px 0
            rgba(
              168,
              85,
              247,
              .14
            ),

            0 0 0 1px
            rgba(
              124,
              58,
              237,
              .08
            ),

            0 0 28px
            rgba(
              168,
              85,
              247,
              .10
            );

          transform:
            rotate(
              var(--rank-rotate)
            )
            scaleX(
              var(--rank-scale-x)
            )
            scaleY(
              var(--rank-scale-y)
            );

          transform-origin:center;

          will-change:
            transform,
            border-radius;

          transition:
            border-radius
            .18s ease,

            border-color
            .2s ease,

            box-shadow
            .2s ease;
        }

        .liquid-rank-panel::before{
          content:'';

          position:absolute;

          z-index:-1;

          width:105%;
          height:115%;

          left:
            calc(
              -2.5% +
              var(--rank-liquid-x) *
              4%
            );

          top:
            calc(
              -7.5% +
              var(--rank-liquid-y) *
              4%
            );

          pointer-events:none;

          border-radius:
            32%
            68%
            47%
            53%
            /
            46%
            43%
            57%
            54%;

          background:
            radial-gradient(
              circle at
              var(--rank-highlight-x)
              var(--rank-highlight-y),

              rgba(
                255,
                255,
                255,
                .42
              )
              0 3%,

              rgba(
                255,
                255,
                255,
                .16
              )
              12%,

              rgba(
                192,
                132,
                252,
                .18
              )
              28%,

              transparent
              57%
            ),

            radial-gradient(
              circle at
              calc(
                72% -
                var(--rank-liquid-x) *
                10%
              )
              calc(
                72% -
                var(--rank-liquid-y) *
                10%
              ),

              rgba(
                124,
                58,
                237,
                .22
              ),

              transparent
              48%
            );

          filter:blur(8px);

          opacity:.9;

          animation:
            rankLiquidFloat
            6s
            ease-in-out
            infinite alternate;

          transition:
            left .1s linear,
            top .1s linear;
        }

        .liquid-rank-panel::after{
          content:'';

          position:absolute;

          z-index:1;

          inset:3px;

          pointer-events:none;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              .09
            );

          border-radius:inherit;

          background:
            radial-gradient(
              circle at
              var(--rank-highlight-x)
              var(--rank-highlight-y),

              rgba(
                255,
                255,
                255,
                .15
              ),

              transparent
              34%
            ),

            linear-gradient(
              145deg,

              rgba(
                255,
                255,
                255,
                .08
              ),

              transparent
              34% 67%,

              rgba(
                168,
                85,
                247,
                .07
              )
            );

          box-shadow:
            inset
            0 1px 1px
            rgba(
              255,
              255,
              255,
              .18
            ),

            inset
            0 -3px 8px
            rgba(
              0,
              0,
              0,
              .10
            );
        }

        .liquid-rank-panel > *{
          position:relative;
          z-index:3;
        }

        @keyframes rankLiquidFloat{
          0%{
            transform:
              translate3d(
                -3px,
                -2px,
                0
              )
              rotate(-1deg)
              scale(1);
          }

          50%{
            transform:
              translate3d(
                3px,
                2px,
                0
              )
              rotate(1deg)
              scale(1.035);
          }

          100%{
            transform:
              translate3d(
                -1px,
                3px,
                0
              )
              rotate(-.5deg)
              scale(.99);
          }
        }

        .liquid-rank-panel.rank-liquid-hover{
          border-color:
            rgba(
              255,
              255,
              255,
              .30
            );

          box-shadow:
            0 18px 42px
            rgba(
              0,
              0,
              0,
              .27
            ),

            inset
            0 1px 0
            rgba(
              255,
              255,
              255,
              .55
            ),

            inset
            0 -2px 8px
            rgba(
              168,
              85,
              247,
              .16
            ),

            0 0 0 1px
            rgba(
              168,
              85,
              247,
              .13
            ),

            0 0 38px
            rgba(
              168,
              85,
              247,
              .17
            );
        }

        .liquid-rank-panel.rank-liquid-hover::before{
          animation-duration:3.5s;

          filter:
            blur(7px)
            saturate(1.15);
        }

        .rank-panel-label{
          color:
            rgba(
              216,
              206,
              232,
              .72
            );

          font-size:10px;
          font-weight:800;
          letter-spacing:.12em;
          text-transform:uppercase;
        }

        .rank-panel-rank{
          margin-top:9px;

          color:
            var(--stardust);

          font-size:26px;
          font-weight:900;
          line-height:1;

          text-shadow:
            0 1px 3px
            rgba(
              0,
              0,
              0,
              .45
            ),

            0 0 18px
            rgba(
              192,
              132,
              252,
              .24
            );
        }

        .rank-panel-meta{
          margin-top:8px;

          color:
            rgba(
              216,
              206,
              232,
              .66
            );

          font-size:11px;
        }

        /* =================================================
           LESSON CARDS
           ================================================= */

        .roadmap-grid{
          grid-template-columns:
            repeat(
              2,
              minmax(0,1fr)
            );

          gap:12px;
        }

        .roadmap-card{
          min-height:216px;

          display:flex;
          flex-direction:column;

          gap:9px;

          background:
            linear-gradient(
              135deg,
              rgba(
                14,
                42,
                74,
                .34
              ),
              rgba(
                42,
                15,
                61,
                .3
              )
            ),

            rgba(
              124,
              58,
              237,
              .07
            );

          position:relative;
          overflow:hidden;
        }

        .roadmap-card::after{
          content:'';

          position:absolute;
          inset:0;

          background-image:
            linear-gradient(
              rgba(
                124,
                58,
                237,
                .045
              )
              1px,
              transparent
              1px
            ),

            linear-gradient(
              90deg,
              rgba(
                124,
                58,
                237,
                .045
              )
              1px,
              transparent
              1px
            );

          background-size:
            32px 32px;

          pointer-events:none;
        }

        .roadmap-card > *{
          position:relative;
          z-index:1;
        }

        .roadmap-card-top{
          display:flex;
          align-items:flex-start;
          justify-content:space-between;
          gap:10px;
        }

        .roadmap-icon{
          width:34px;
          height:34px;
          margin-bottom:0;

          background:
            rgba(
              255,
              255,
              255,
              .05
            );

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              .08
            );
        }

        .roadmap-icon svg{
          width:21px;
          height:21px;
        }

        .lesson-progress-row,
        .lesson-next{
          display:flex;
          align-items:center;
          justify-content:space-between;

          gap:10px;

          color:var(--muted);
          font-size:11px;
        }

        .lesson-progress-track{
          height:6px;

          border-radius:999px;

          background:
            rgba(
              255,
              255,
              255,
              .07
            );

          overflow:hidden;
        }

        .lesson-progress-fill{
          height:100%;

          border-radius:inherit;

          background:
            linear-gradient(
              90deg,
              var(--purple),
              var(--glow)
            );
        }

        .unlock-row{
          display:flex;
          flex-wrap:wrap;

          gap:6px;

          margin-top:auto;
        }

        .unlock-pill{
          border:
            1px solid
            rgba(
              139,
              122,
              168,
              .25
            );

          border-radius:999px;

          color:
            rgba(
              139,
              122,
              168,
              .7
            );

          font-size:10px;
          font-weight:700;

          padding:3px 8px;
        }

        .unlock-pill.is-open{
          color:#d8b4fe;

          border-color:
            rgba(
              168,
              85,
              247,
              .4
            );

          background:
            rgba(
              168,
              85,
              247,
              .12
            );
        }

        .lesson-next strong{
          color:var(--glow);
          white-space:nowrap;
        }

        .tier-bronze{
          color:#f59e0b;

          background:
            rgba(
              245,
              158,
              11,
              .12
            );

          border:
            1px solid
            rgba(
              245,
              158,
              11,
              .22
            );
        }

        .tier-silver{
          color:#cbd5e1;

          background:
            rgba(
              203,
              213,
              225,
              .1
            );

          border:
            1px solid
            rgba(
              203,
              213,
              225,
              .2
            );
        }

        .tier-gold{
          color:#facc15;

          background:
            rgba(
              250,
              204,
              21,
              .12
            );

          border:
            1px solid
            rgba(
              250,
              204,
              21,
              .24
            );
        }

        .tier-platinum{
          color:#67e8f9;

          background:
            rgba(
              103,
              232,
              249,
              .1
            );

          border:
            1px solid
            rgba(
              103,
              232,
              249,
              .22
            );
        }

        .tier-diamond{
          color:#93c5fd;

          background:
            rgba(
              147,
              197,
              253,
              .12
            );

          border:
            1px solid
            rgba(
              147,
              197,
              253,
              .25
            );
        }

        @media(max-width:760px){

          .rank-summary,
          .roadmap-grid,
          .library-grid{
            grid-template-columns:1fr;
          }

          .liquid-rank-panel{
            min-height:110px;
          }
        }

        @media(
          prefers-reduced-motion:
          reduce
        ){

          .liquid-rank-panel,
          .liquid-rank-panel::before,
          .liquid-rank-panel::after{
            animation:none!important;
            transition:none!important;
          }
        }
      `;

      document.head.appendChild(
        style
      );
    }
  },

  mounted(){
    this.injectLibraryStyles();
    this.updateProgress();

    this.$nextTick(()=>{
      this.attachLiquidRankPanel();
    });

    this._progressHandler=()=>{
      this.updateProgress();
    };

    window.addEventListener(
      'cosmoklub-progress',
      this._progressHandler
    );

    window.addEventListener(
      'storage',
      this._progressHandler
    );
  },

  beforeUnmount(){
    window.removeEventListener(
      'cosmoklub-progress',
      this._progressHandler
    );

    window.removeEventListener(
      'storage',
      this._progressHandler
    );
  }
};
