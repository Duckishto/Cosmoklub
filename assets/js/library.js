const Library={
  name:'Library',

  template:`
    <div class="library-roadmap">

      <div class="section library-hero">

        <div class="rank-summary">

          <div>
            <div class="rank-kicker">
              Study Roadmap
            </div>

            <h2 class="rank-title">
              Level up each category to unlock deeper space knowledge.
            </h2>
          </div>

          <div
            class="rank-panel liquid-rank-panel"
            ref="rankPanel"
          >
            <div class="rank-panel-label">
              Overall Rank
            </div>

            <div class="rank-panel-rank">
              <span class="rank-panel-emoji">
                {{ overallRankEmoji }}
              </span>

              <span>
                {{ overallRank }}
              </span>
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

            <div class="card-mouse-light"></div>

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
          svg:`
            <svg
              viewBox="0 0 24 24"
              fill="#facc15"
            >
              <path
                d="m12 2 2.9 6.15 6.6.8-4.85 4.5 1.25 6.55L12 16.75 6.1 20l1.25-6.55-4.85-4.5 6.6-.8L12 2z"
              />
            </svg>
          `
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
          svg:`
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#c084fc"
              stroke-width="1.7"
              stroke-linecap="round"
            >
              <path d="M4 14c4.8-7.4 12.3-8 16-2.8"/>
              <path d="M3 18c5-3.8 12-3.5 18 1"/>
              <path d="M7 9c3.2 3.4 6.8 4 10.8 1.5"/>
            </svg>
          `
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
          svg:`
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#93c5fd"
              stroke-width="1.6"
              stroke-linecap="round"
            >
              <path d="M12 3v18"/>
              <path d="M4 12h16"/>
              <path d="m5 5 14 14"/>
              <path d="m19 5-14 14"/>
              <circle cx="12" cy="12" r="2.2"/>
            </svg>
          `
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
          svg:`
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#67e8f9"
              stroke-width="1.6"
              stroke-linecap="round"
            >
              <circle cx="12" cy="12" r="5.2"/>
              <path
                d="M3.2 14.2c2.8 2.2 9.4 1.7 14.6-1.1 2.1-1.1 3.2-2.3 3-3.2-.3-1.1-2.6-1.2-5.5-.4"
              />
            </svg>
          `
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
          svg:`
            <svg
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M7 15.5c-2.2 0-4-1.3-4-3.2 0-1.7 1.4-3 3.2-3.2C7 6.8 9.2 5.5 11.7 6c1.7.3 3.1 1.4 3.8 2.9.4-.1.8-.2 1.3-.2 2.3 0 4.2 1.5 4.2 3.5s-1.9 3.4-4.2 3.4H7z"
                fill="#d8b4fe"
              />
              <circle cx="9" cy="11" r="1" fill="#fff"/>
              <circle cx="15" cy="13" r="1.2" fill="#fff"/>
            </svg>
          `
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
    },

    overallRankEmoji(){
      const emojis={
        BRONZE:'🥉',
        SILVER:'🥈',
        GOLD:'🥇',
        PLATINUM:'💠',
        DIAMOND:'💎'
      };

      return emojis[this.overallRank]||'🥉';
    }

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

      // Touch/coarse-pointer devices fire pointer events on tap but have
      // no reliable "un-hover" gesture, which left this liquid-glass tilt
      // effect stuck mid-animation after a tap on phones and tablets. Only
      // attach it for devices with genuine hover + a fine pointer (mouse,
      // trackpad, stylus).
      if(
        !window.matchMedia||
        !window.matchMedia(
          '(hover: hover) and (pointer: fine)'
        ).matches
      ){
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

      // Same reasoning as attachLiquidRankPanel(): skip the mouse-tilt /
      // spotlight / hover-expand interactions entirely on touch devices so
      // a tapped card can never get left mid-tilt, scaled up, or stuck in
      // the "expanded + siblings blurred" state. Tapping still navigates
      // via the @click handler in the template, which is unaffected.
      if(
        !window.matchMedia||
        !window.matchMedia(
          '(hover: hover) and (pointer: fine)'
        ).matches
      ){
        return;
      }

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
          max-width:720px;
        }

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

          border-radius:18px;

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
              ),

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
              75%
              80%,

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
            saturate(210%);

          backdrop-filter:
            blur(22px)
            saturate(210%);

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
            transform;
        }

        .liquid-rank-panel>*{
          position:relative;
          z-index:2;
        }

        .rank-panel-label{
          color:var(--muted);
          font-size:10px;
          font-weight:800;
          letter-spacing:.12em;
          text-transform:uppercase;
        }

        .rank-panel-rank{
          color:var(--stardust);
          font-size:26px;
          font-weight:900;
          margin-top:9px;

          display:flex;
          align-items:center;
          gap:9px;
        }

        .rank-panel-emoji{
          display:inline-flex;
          align-items:center;
          justify-content:center;

          font-size:25px;
          line-height:1;

          filter:
            drop-shadow(
              0 2px 5px
              rgba(0,0,0,.28)
            );
        }

        .rank-panel-meta{
          color:var(--muted);
          font-size:11px;
          margin-top:8px;
        }

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

          transform-origin:center;
          transform-style:
            preserve-3d;

          will-change:
            transform;

          transition:
            border-color
            var(--tr),

            background
            var(--tr),

            box-shadow
            .2s ease;
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

          z-index:1;
        }

        .card-mouse-light{

          --light-x:50%;
          --light-y:50%;

          position:absolute;

          left:0;
          top:0;

          width:100%;
          height:100%;

          pointer-events:none;

          z-index:2;

          opacity:0;

          background:

            radial-gradient(
              circle
              170px
              at
              var(--light-x)
              var(--light-y),

              rgba(
                255,
                255,
                255,
                .085
              )
              0%,

              rgba(
                192,
                132,
                252,
                .055
              )
              32%,

              rgba(
                124,
                58,
                237,
                .025
              )
              53%,

              transparent
              72%
            );

          transition:
            opacity
            .2s ease;
        }

        .roadmap-card.card-liquid-hover{

          box-shadow:

            0 12px 30px

            rgba(
              0,
              0,
              0,
              .18
            );
        }

        .roadmap-card>*:not(
          .card-mouse-light
        ){

          position:relative;

          z-index:3;
        }

        .roadmap-card-top{
          display:flex;
          align-items:flex-start;
          justify-content:
            space-between;
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
          justify-content:
            space-between;
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
          .roadmap-grid{

            grid-template-columns:
              1fr;
          }
        }

        @media(
          prefers-reduced-motion:
          reduce
        ){

          .roadmap-card{
            transform:
              none!important;
          }

          .card-mouse-light{
            display:none;
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
