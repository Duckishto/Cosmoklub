const Library={
  name:'Library',

  template:`
    <div class="library-roadmap">

      <div class="section library-hero">

        <div
          class="rank-summary liquid-rank-panel"
          ref="rankPanel"
        >

          <div class="rank-summary-text">
            <div class="rank-kicker">
              Study Roadmap
            </div>

            <h2 class="rank-title">
              Level up each category to unlock deeper space knowledge.
            </h2>
          </div>

          <div class="rank-summary-divider"></div>

          <div class="rank-panel">

            <div class="rank-panel-badge">
              <span class="rank-panel-badge-ring" :class="'ring-'+overallRank.toLowerCase()"></span>
              <span class="rank-panel-badge-glyph" :class="'glyph-'+overallRank.toLowerCase()"></span>
            </div>

            <div class="rank-panel-info">
              <div class="rank-panel-label">
                Overall Rank
              </div>

              <div class="rank-panel-rank">
                {{ overallRank }}
              </div>

              <div class="rank-panel-meta">
                {{ totalCompleted }} / {{ totalLessons }} lessons complete
              </div>
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

            <div class="card-mouse-light"></div>

            <div
              class="roadmap-banner"
              :class="'banner-'+lesson.id"
            >

              <span class="banner-blob banner-blob-a"></span>
              <span class="banner-blob banner-blob-b"></span>

              <div class="banner-level-pill">
                LV {{ lesson.level }}
              </div>

              <div
                class="banner-tier-pill"
                :class="lesson.tierClass"
              >
                {{ lesson.rank }}
              </div>

            </div>

            <div class="roadmap-body">

              <div class="lesson-title">
                {{ lesson.title }}
              </div>

              <div class="lesson-desc">
                {{ lesson.desc }}
              </div>

              <div class="lesson-meta-row">

                <span class="meta-item">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                  {{ lesson.completedLessons }} / {{ lesson.totalLessons }} lessons
                </span>

                <span class="meta-item meta-item-xp">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 3 14h7l-1 8 11-13h-7l1-7z"/></svg>
                  {{ lesson.xp }} XP
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

                <span class="lesson-next-cta">
                  Continue
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>
                </span>

              </div>

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
          desc:
            'Birth, life, and death of stars from protostars to supernovae.',
          completedLessons:0,
          totalLessons:20,
          level:1,
          xp:0,
          rank:'BRONZE',
          tierClass:'tier-bronze',
          quizUnlocked:true,
          nextUnlocked:false,
          nextLabel:'Continue learning',
        },

        {
          id:'galaxies',
          title:'Galaxies',
          desc:
            'Explore galaxy structure, evolution, dark matter, and cosmic environments.',
          completedLessons:0,
          totalLessons:20,
          level:1,
          xp:0,
          rank:'BRONZE',
          tierClass:'tier-bronze',
          quizUnlocked:true,
          nextUnlocked:false,
          nextLabel:'Continue learning',
        },

        {
          id:'cosmology',
          title:'Cosmology',
          desc:
            'Study the origin, expansion, structure, and fate of the universe.',
          completedLessons:0,
          totalLessons:20,
          level:1,
          xp:0,
          rank:'BRONZE',
          tierClass:'tier-bronze',
          quizUnlocked:true,
          nextUnlocked:false,
          nextLabel:'Continue learning',
        },

        {
          id:'planets',
          title:'Planets',
          desc:
            'Learn how planets form, evolve, and compare across planetary systems.',
          completedLessons:0,
          totalLessons:20,
          level:1,
          xp:0,
          rank:'BRONZE',
          tierClass:'tier-bronze',
          quizUnlocked:true,
          nextUnlocked:false,
          nextLabel:'Continue learning',
        },

        {
          id:'nebulae',
          title:'Nebulae',
          desc:
            'Explore interstellar clouds, stellar nurseries, and glowing remnants.',
          completedLessons:0,
          totalLessons:20,
          level:1,
          xp:0,
          rank:'BRONZE',
          tierClass:'tier-bronze',
          quizUnlocked:true,
          nextUnlocked:false,
          nextLabel:'Continue learning',
        },

        {
          id:'observing',
          title:'Observing',
          desc:
            'Build practical skills with the night sky, telescopes, and astrophotography.',
          completedLessons:0,
          totalLessons:20,
          level:1,
          xp:0,
          rank:'BRONZE',
          tierClass:'tier-bronze',
          quizUnlocked:true,
          nextUnlocked:false,
          nextLabel:'Continue learning',
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
    },

  },

  methods:{

    progressPercent(lesson){
      return Math.round(
        (
          lesson.completedLessons/
          lesson.totalLessons
        )*
        100
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
        typeof window.getCategoryStats===
        'function'
      ){

        this.lessons.forEach(
          lesson=>{

            const stats=
              window.getCategoryStats(
                lesson.id
              );

            if(!stats){
              return;
            }

            lesson.completedLessons=
              stats.completedLessons??0;

            lesson.totalLessons=
              stats.totalLessons??20;

            lesson.level=
              stats.level??1;

            lesson.xp=
              stats.xp??0;

            lesson.rank=
              stats.rank||
              'BRONZE';

            lesson.tierClass=
              `tier-${
                String(
                  lesson.rank
                ).toLowerCase()
              }`;

            lesson.quizUnlocked=
              stats.quizUnlocked??
              true;

            lesson.nextUnlocked=
              stats.nextUnlocked??
              false;

            lesson.nextLabel=
              stats.nextLabel||
              'Continue learning';

          }
        );

        return;
      }

      if(
        typeof window.getCategoryProgress===
        'function'&&
        typeof window.getLevelProgress===
        'function'
      ){

        this.lessons.forEach(
          lesson=>{

            const progress=
              window.getCategoryProgress(
                lesson.id
              );

            const levelStats=
              window.getLevelProgress(
                progress.xp
              );

            lesson.completedLessons=
              progress.completedLessons
                ?.length||
              0;

            lesson.totalLessons=20;

            lesson.level=
              levelStats.level||
              1;

            lesson.xp=
              progress.xp||
              0;

            lesson.rank=
              levelStats.rank||
              'BRONZE';

            lesson.tierClass=
              `tier-${
                String(
                  lesson.rank
                ).toLowerCase()
              }`;

            lesson.nextLabel=
              lesson.completedLessons>0
                ?
                'Continue learning'
                :
                'Start learning';

          }
        );

      }

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

      let frame=null;

      const animate=()=>{

        currentStretchX+=
          (
            targetStretchX-
            currentStretchX
          )*
          .12;

        currentStretchY+=
          (
            targetStretchY-
            currentStretchY
          )*
          .12;

        currentRotate+=
          (
            targetRotate-
            currentRotate
          )*
          .12;

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
          frame=
            requestAnimationFrame(
              animate
            );
        }else{
          frame=null;
        }

      };

      const start=()=>{

        if(!frame){
          frame=
            requestAnimationFrame(
              animate
            );
        }

      };

      const move=event=>{

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
            )*
            100
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
            )*
            100
          )
        );

        const nx=
          (x-50)/50;

        const ny=
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
          nx.toFixed(3)
        );

        node.style.setProperty(
          '--rank-liquid-y',
          ny.toFixed(3)
        );

        node.style.setProperty(
          '--rank-highlight-x',
          `${50+nx*22}%`
        );

        node.style.setProperty(
          '--rank-highlight-y',
          `${30+ny*20}%`
        );

        const now=
          performance.now();

        const deltaTime=
          Math.max(
            8,
            now-
            previousTime
          );

        if(
          previousX!==null&&
          previousY!==null
        ){

          const vx=
            (
              event.clientX-
              previousX
            )/
            deltaTime;

          const vy=
            (
              event.clientY-
              previousY
            )/
            deltaTime;

          const speed=
            Math.min(
              1,
              Math.hypot(
                vx,
                vy
              )*
              .8
            );

          targetStretchX=
            1+
            Math.min(
              .025,
              Math.abs(vx)*
              .025
            );

          targetStretchY=
            1+
            Math.min(
              .025,
              Math.abs(vy)*
              .025
            );

          if(
            Math.abs(vx)>
            Math.abs(vy)
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
                vx*1.2
              )
            );

        }

        previousX=
          event.clientX;

        previousY=
          event.clientY;

        previousTime=
          now;

        node.classList.add(
          'rank-liquid-hover'
        );

        start();

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

        start();

      };

      node.addEventListener(
        'pointermove',
        move
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

    attachLiquidCardInteractions(){

      const cards=[
        ...this.$el.querySelectorAll(
          '.roadmap-card'
        )
      ];

      cards.forEach(card=>{

        const light=
          card.querySelector(
            '.card-mouse-light'
          );

        let previousX=null;
        let previousY=null;

        let previousTime=
          performance.now();

        let currentX=0;
        let currentY=0;

        let currentRotateX=0;
        let currentRotateY=0;

        let currentScaleX=1;
        let currentScaleY=1;

        let targetX=0;
        let targetY=0;

        let targetRotateX=0;
        let targetRotateY=0;

        let targetScaleX=1;
        let targetScaleY=1;

        let frame=null;

        const animate=()=>{

          const spring=.15;

          currentX+=
            (
              targetX-
              currentX
            )*
            spring;

          currentY+=
            (
              targetY-
              currentY
            )*
            spring;

          currentRotateX+=
            (
              targetRotateX-
              currentRotateX
            )*
            spring;

          currentRotateY+=
            (
              targetRotateY-
              currentRotateY
            )*
            spring;

          currentScaleX+=
            (
              targetScaleX-
              currentScaleX
            )*
            spring;

          currentScaleY+=
            (
              targetScaleY-
              currentScaleY
            )*
            spring;

          card.style.transform=`
            perspective(850px)

            translate3d(
              ${currentX}px,
              ${currentY}px,
              0
            )

            rotateX(
              ${currentRotateX}deg
            )

            rotateY(
              ${currentRotateY}deg
            )

            scaleX(
              ${currentScaleX}
            )

            scaleY(
              ${currentScaleY}
            )
          `;

          const moving=
            Math.abs(
              currentX-
              targetX
            )>.01||
            Math.abs(
              currentY-
              targetY
            )>.01||
            Math.abs(
              currentRotateX-
              targetRotateX
            )>.01||
            Math.abs(
              currentRotateY-
              targetRotateY
            )>.01||
            Math.abs(
              currentScaleX-
              targetScaleX
            )>.001||
            Math.abs(
              currentScaleY-
              targetScaleY
            )>.001;

          if(moving){

            frame=
              requestAnimationFrame(
                animate
              );

          }else{

            frame=null;

          }

        };

        const start=()=>{

          if(!frame){

            frame=
              requestAnimationFrame(
                animate
              );

          }

        };

        const move=event=>{

          const rect=
            card.getBoundingClientRect();

          const localX=
            event.clientX-
            rect.left;

          const localY=
            event.clientY-
            rect.top;

          const x=
            localX/
            rect.width;

          const y=
            localY/
            rect.height;

          const nx=
            (x-.5)*
            2;

          const ny=
            (y-.5)*
            2;

          targetX=
            nx*
            5.5;

          targetY=
            ny*
            4;

          targetRotateY=
            nx*
            2.6;

          targetRotateX=
            ny*
            -2;

          targetScaleX=
            1.008;

          targetScaleY=
            1.008;

          if(light){

            light.style.setProperty(
              '--light-x',
              `${localX}px`
            );

            light.style.setProperty(
              '--light-y',
              `${localY}px`
            );

            light.style.opacity='1';

          }

          const now=
            performance.now();

          const deltaTime=
            Math.max(
              8,
              now-
              previousTime
            );

          if(
            previousX!==null&&
            previousY!==null
          ){

            const vx=
              (
                event.clientX-
                previousX
              )/
              deltaTime;

            const vy=
              (
                event.clientY-
                previousY
              )/
              deltaTime;

            const speedX=
              Math.min(
                .022,
                Math.abs(vx)*
                .022
              );

            const speedY=
              Math.min(
                .022,
                Math.abs(vy)*
                .022
              );

            targetScaleX=
              1.008+
              speedX;

            targetScaleY=
              1.008+
              speedY;

            if(
              Math.abs(vx)>
              Math.abs(vy)
            ){

              targetScaleY=
                1.008-
                speedX*
                .55;

            }else{

              targetScaleX=
                1.008-
                speedY*
                .55;

            }

          }

          previousX=
            event.clientX;

          previousY=
            event.clientY;

          previousTime=
            now;

          card.classList.add(
            'card-liquid-hover'
          );

          start();

        };

        const leave=()=>{

          previousX=null;
          previousY=null;

          targetX=0;
          targetY=0;

          targetRotateX=0;
          targetRotateY=0;

          targetScaleX=1;
          targetScaleY=1;

          if(light){
            light.style.opacity='0';
          }

          card.classList.remove(
            'card-liquid-hover'
          );

          start();

        };

        const press=()=>{

          targetScaleX=.992;
          targetScaleY=.98;

          start();

        };

        const release=()=>{

          targetScaleX=1.008;
          targetScaleY=1.008;

          start();

        };

        card.addEventListener(
          'pointermove',
          move
        );

        card.addEventListener(
          'pointerleave',
          leave
        );

        card.addEventListener(
          'pointercancel',
          leave
        );

        card.addEventListener(
          'pointerdown',
          press
        );

        card.addEventListener(
          'pointerup',
          release
        );

      });

    },

  },

  mounted(){

    this.updateProgress();

    this.$nextTick(()=>{

      this.attachLiquidRankPanel();

      this.attachLiquidCardInteractions();

    });

    this._progressHandler=()=>{

      this.updateProgress();

    };

    // progress.js dispatches 'cosmoklub-progress-changed' (on the initial
    // async load, sign-in/sign-out, and every completed lesson) — this used
    // to listen for 'cosmoklub-progress', which is never dispatched, so
    // live updates never actually reached the library tab.
    window.addEventListener(
      'cosmoklub-progress-changed',
      this._progressHandler
    );

    window.addEventListener(
      'storage',
      this._progressHandler
    );

  },

  beforeUnmount(){

    window.removeEventListener(
      'cosmoklub-progress-changed',
      this._progressHandler
    );

    window.removeEventListener(
      'storage',
      this._progressHandler
    );

  }

};
