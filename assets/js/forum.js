// Forum tab: tonight's-sky strip, category chips, thread feed.
// Includes subtle 3D cursor interaction on thread cards.
// No mouse highlight.

const Forum = {
  name: 'Forum',

  template: `
    <div class="fxd">

      <!-- Tonight's sky strip (kept) -->
      <div class="sky-strip">
        <div class="sb-icon">◐</div>
        <div class="sky-strip-text">
          <div class="sky-strip-title">Waxing gibbous, 78% lit</div>
          <div class="sky-strip-sub">Good night for Saturn, rises 21:40, Bangkok sky</div>
        </div>
        <div class="sky-strip-cta">TONIGHT'S SKY</div>
      </div>

      <!-- Catalog shell: filter sidebar + card grid -->
      <div class="fxd-shell">

        <!-- ============ Filters (visual only) ============ -->
        <aside class="fxd-side">
          <div class="fxd-side-head">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="10" y1="18" x2="14" y2="18"/></svg>
            <span>Filters</span>
          </div>

          <div class="fxd-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Search threads" aria-label="Search threads" />
          </div>

          <div class="fxd-select">
            <select aria-label="Sort by">
              <option>Most recent</option>
              <option>Most replies</option>
              <option>Most upvoted</option>
              <option>Solved first</option>
            </select>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </div>

          <div class="fxd-group">
            <div class="fxd-group-head">Category</div>
            <div class="fxd-pills">
              <button class="fxd-pill" :class="{ 'is-active': activeChip === 'All' }" @click="activeChip = 'All'">All</button>
              <button class="fxd-pill" v-for="tag in tags" :key="tag" :class="{ 'is-active': activeChip === tag }" @click="activeChip = tag">{{ tag }}</button>
            </div>
          </div>

          <div class="fxd-group">
            <div class="fxd-group-head">Status</div>
            <div class="fxd-pills">
              <button class="fxd-pill is-active">All</button>
              <button class="fxd-pill">Solved</button>
              <button class="fxd-pill">Unanswered</button>
            </div>
          </div>
        </aside>

        <!-- ============ Thread catalog ============ -->
        <section class="fxd-main">

          <div class="fxd-toolbar">
            <h2 class="fxd-title">Discussions</h2>
            <span class="fxd-count">{{ filteredThreads.length }} threads</span>
          </div>

          <div class="fxd-tabs">
            <button class="fxd-tab is-active">All</button>
            <button class="fxd-tab">Following</button>
            <button class="fxd-tab">Popular</button>
          </div>

          <div class="fxd-grid">

            <article class="fxd-card" v-for="t in filteredThreads" :key="t.id">

              <div class="fxd-card-media">
                <span class="fxd-badge" v-if="t.solved">SOLVED</span>
                <button class="fxd-fav" aria-label="Save thread">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
                </button>
                <img src="assets/images/pensiaplaceholder.png" alt="" draggable="false" loading="lazy" />
              </div>

              <div class="fxd-card-body">
                <span class="fxd-card-tag">{{ t.tag }}</span>
                <h3 class="fxd-card-title">{{ t.title }}</h3>
                <p class="fxd-card-desc">{{ t.body }}</p>

                <div class="fxd-card-author">
                  <span class="fxd-avatar" :style="{ background: t.color }">{{ t.initial }}</span>
                  <span class="fxd-author-name">{{ t.author }}</span>
                  <span class="fxd-lvl">{{ t.level }}</span>
                </div>

                <div class="fxd-card-meta">
                  <span class="fxd-stat">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8A8.5 8.5 0 0 1 21 11.5z"/></svg>
                    {{ t.replies }}
                  </span>
                  <span class="fxd-stat">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                    {{ t.upvotes }}
                  </span>
                  <span class="fxd-time">{{ t.time }}</span>
                </div>
              </div>

            </article>

          </div>
        </section>
      </div>
    </div>
  `,


  data() {
    return {
      activeChip: 'All',

      tags: [
        'Beginner Q&A',
        'Equipment',
        'Astrophotography',
        'Deep Sky',
        'Solar System',
        'News'
      ],

      threads: [
        {
          id: 1,
          author: 'galileo_jr',
          initial: 'G',
          color: '#7c3aed',
          level: 'Lv. 4',
          time: '2h ago',
          replies: 14,
          upvotes: 38,
          tag: 'Equipment',

          title:
            "Is a 6\" Dobsonian enough to actually see Saturn's rings, or am I being too hopeful?",

          body:
            'Picking up a used Apertura AD6 this weekend. Mainly want planetary views from a Bortle 5 backyard, realistic expectations for Saturn and Jupiter at 150x?',

          solved: false
        },

        {
          id: 2,
          author: 'nebula_noor',
          initial: 'N',
          color: '#a855f7',
          level: 'Lv. 9',
          time: '5h ago',
          replies: 27,
          upvotes: 102,
          tag: 'Astrophotography',

          title:
            'First decent capture of the Orion Nebula, 2hr integration, stacked in Siril',

          body:
            "Finally got the cooling box working on my old DSLR. Still a lot of gradient in the corners I couldn't fully remove, tips welcome on the flat frames.",

          solved: false
        },

        {
          id: 3,
          author: 'stardust_mei',
          initial: 'M',
          color: '#5b21b6',
          level: 'Lv. 2',
          time: '7h ago',
          replies: 6,
          upvotes: 19,
          tag: 'Beginner Q&A',

          title:
            'What does "magnitude" actually mean? Keep seeing it but the scale confuses me',

          body:
            'I get that lower numbers are brighter, but why are some negative? And how do I use it to figure out if something is naked-eye visible from a suburban sky?',

          solved: true
        },

        {
          id: 4,
          author: 'redgiant_theo',
          initial: 'T',
          color: '#9333ea',
          level: 'Lv. 6',
          time: '11h ago',
          replies: 9,
          upvotes: 54,
          tag: 'Solar System',

          title:
            'Mars opposition prep: best filters for surface detail on a 8" SCT?',

          body:
            'Planning a session for the upcoming opposition. Currently have a basic moon filter only. Would a Wratten #21 orange make a noticeable difference for polar caps and Syrtis Major?',

          solved: false
        },

        {
          id: 5,
          author: 'pleiades_anya',
          initial: 'A',
          color: '#c084fc',
          level: 'Lv. 5',
          time: '1d ago',
          replies: 21,
          upvotes: 67,
          tag: 'Deep Sky',

          title:
            'Pleiades nebulosity: am I actually seeing the reflection nebula visually?',

          body:
            'Through my 8" dob last night under fairly dark skies I thought I caught faint wisps around Merope. Could this realistically be visual, or is it more likely scatter/eye strain?',

          solved: true
        },

        {
          id: 6,
          author: 'cosmic_leo',
          initial: 'L',
          color: '#f97316',
          level: 'Lv. 7',
          time: '2d ago',
          replies: 34,
          upvotes: 89,
          tag: 'Equipment',

          title:
            'Best budget astrophotography camera under $500?',

          body:
            'Looking to start deep-sky with a used DSLR vs dedicated astro camera. Anyone have experience with the ZWO ASI120MC?',

          solved: false
        },

        {
          id: 7,
          author: 'lunar_emily',
          initial: 'E',
          color: '#14b8a6',
          level: 'Lv. 3',
          time: '2d ago',
          replies: 12,
          upvotes: 28,
          tag: 'Beginner Q&A',

          title:
            'Why do some stars twinkle more than others?',

          body:
            "I know it's atmospheric turbulence, but Arcturus twinkles wildly while Vega is steady. Is it just altitude?",

          solved: true
        },

        {
          id: 8,
          author: 'deepsky_dave',
          initial: 'D',
          color: '#3b82f6',
          level: 'Lv. 12',
          time: '3d ago',
          replies: 56,
          upvotes: 203,
          tag: 'Deep Sky',

          title:
            'First light with 16" truss dob – Veil Nebula blew my mind',

          body:
            'Observed from a Bortle 4 site. The Eastern Veil with OIII filter was like a glowing cosmic snake. Anyone else prefer unfiltered views?',

          solved: false
        },

        {
          id: 9,
          author: 'astro_jessi',
          initial: 'J',
          color: '#ec489a',
          level: 'Lv. 8',
          time: '3d ago',
          replies: 19,
          upvotes: 76,
          tag: 'Astrophotography',

          title:
            'My first mosaic of the Cygnus region – 12 panels',

          body:
            'Captured with a 50mm lens and modded DSLR. Processing the seams was tough but worth it. Feedback appreciated!',

          solved: false
        },

        {
          id: 10,
          author: 'planet_hunter',
          initial: 'P',
          color: '#8b5cf6',
          level: 'Lv. 10',
          time: '4d ago',
          replies: 41,
          upvotes: 115,
          tag: 'Solar System',

          title:
            'Jupiter Io transit tonight – grabbed some lucky imaging',

          body:
            "Seeing was average but caught the shadow transit. Stacked 2000 frames. Io's shadow looked like a sharp black dot.",

          solved: false
        },

        {
          id: 11,
          author: 'nova_chaser',
          initial: 'N',
          color: '#ef4444',
          level: 'Lv. 5',
          time: '4d ago',
          replies: 8,
          upvotes: 22,
          tag: 'News',

          title:
            'New supernova in M101? Anyone confirm?',

          body:
            'Saw reports of a possible brightening. Checked with my 10" dob – could be a new transient near the core. Not yet in official catalogs.',

          solved: false
        },

        {
          id: 12,
          author: 'astrophotons',
          initial: 'A',
          color: '#10b981',
          level: 'Lv. 11',
          time: '5d ago',
          replies: 33,
          upvotes: 144,
          tag: 'Astrophotography',

          title:
            'Andromeda core with 135mm lens – dramatic dust lanes',

          body:
            '2 hours integration, Bortle 8. Surprised how much dust detail I could pull out with gradients removal.',

          solved: false
        },

        {
          id: 13,
          author: 'moonwatcher',
          initial: 'M',
          color: '#f59e0b',
          level: 'Lv. 4',
          time: '5d ago',
          replies: 7,
          upvotes: 18,
          tag: 'Equipment',

          title:
            'Which lunar atlas is best for sketching?',

          body:
            'Printed vs app? I like sketching at the eyepiece but need a detailed reference for rilles and domes.',

          solved: true
        },

        {
          id: 14,
          author: 'exoplanet_ella',
          initial: 'E',
          color: '#06b6d4',
          level: 'Lv. 9',
          time: '6d ago',
          replies: 23,
          upvotes: 92,
          tag: 'Deep Sky',

          title:
            'Transit of HD 189733b with a small telescope? Possible?',

          body:
            "Has anyone managed to detect an exoplanet transit visually or with a DSLR on a 6\" scope? I've seen tutorials but curious about real-world results.",

          solved: false
        },

        {
          id: 15,
          author: 'spacetime_steve',
          initial: 'S',
          color: '#6b7280',
          level: 'Lv. 13',
          time: '6d ago',
          replies: 45,
          upvotes: 188,
          tag: 'Astrophotography',

          title:
            'My best image yet – 20 hours on the Horsehead Nebula',

          body:
            'Used a cooled astro camera and narrowband filters. The hydrogen alpha detail around Alnitak is finally controlled without halos.',

          solved: false
        }
      ]
    };
  },


  computed: {
    filteredThreads() {
      if (this.activeChip === 'All') {
        return this.threads;
      }

      return this.threads.filter(
        thread =>
          thread.tag === this.activeChip
      );
    }
  },




  methods: {

    /* =========================================
       THREAD CARD INTERACTION
       ========================================= */

    attachForumCardInteractions() {
      const cards = [
        ...this.$el.querySelectorAll(
          '.thread-card'
        )
      ];


      cards.forEach(card => {
        if (
          card.dataset.liquidAttached ===
          'true'
        ) {
          return;
        }


        card.dataset.liquidAttached =
          'true';


        let previousX = null;
        let previousY = null;

        let previousTime =
          performance.now();


        let currentX = 0;
        let currentY = 0;

        let currentRotateX = 0;
        let currentRotateY = 0;

        let currentScaleX = 1;
        let currentScaleY = 1;


        let targetX = 0;
        let targetY = 0;

        let targetRotateX = 0;
        let targetRotateY = 0;

        let targetScaleX = 1;
        let targetScaleY = 1;


        let frame = null;


        const animate = () => {
          /*
            Softer / calmer than
            the previous version.
          */

          const spring = 0.13;


          currentX +=
            (
              targetX -
              currentX
            ) *
            spring;


          currentY +=
            (
              targetY -
              currentY
            ) *
            spring;


          currentRotateX +=
            (
              targetRotateX -
              currentRotateX
            ) *
            spring;


          currentRotateY +=
            (
              targetRotateY -
              currentRotateY
            ) *
            spring;


          currentScaleX +=
            (
              targetScaleX -
              currentScaleX
            ) *
            spring;


          currentScaleY +=
            (
              targetScaleY -
              currentScaleY
            ) *
            spring;


          card.style.transform = `
            perspective(1000px)

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


          const moving =
            Math.abs(
              currentX -
              targetX
            ) > 0.01 ||

            Math.abs(
              currentY -
              targetY
            ) > 0.01 ||

            Math.abs(
              currentRotateX -
              targetRotateX
            ) > 0.01 ||

            Math.abs(
              currentRotateY -
              targetRotateY
            ) > 0.01 ||

            Math.abs(
              currentScaleX -
              targetScaleX
            ) > 0.001 ||

            Math.abs(
              currentScaleY -
              targetScaleY
            ) > 0.001;


          if (moving) {
            frame =
              requestAnimationFrame(
                animate
              );
          } else {
            frame = null;
          }
        };


        const startAnimation = () => {
          if (!frame) {
            frame =
              requestAnimationFrame(
                animate
              );
          }
        };


        const handleMove = event => {
          const rect =
            card.getBoundingClientRect();


          const localX =
            event.clientX -
            rect.left;


          const localY =
            event.clientY -
            rect.top;


          const nx =
            (
              localX /
              rect.width -
              0.5
            ) *
            2;


          const ny =
            (
              localY /
              rect.height -
              0.5
            ) *
            2;


          /*
            Reduced movement.

            Previous:
            X = 5.5px
            Y = 4px

            New:
            X = 3px
            Y = 2px
          */

          targetX =
            nx * 3;


          targetY =
            ny * 2;


          /*
            Reduced 3D tilt.

            Previous:
            2.6° / 2°

            New:
            1.35° / 1°
          */

          targetRotateY =
            nx * 1.35;


          targetRotateX =
            ny * -1;


          /*
            Very small hover scale.
          */

          targetScaleX =
            1.003;


          targetScaleY =
            1.003;


          /*
            Small velocity stretch.
          */

          const now =
            performance.now();


          const deltaTime =
            Math.max(
              8,
              now -
              previousTime
            );


          if (
            previousX !== null &&
            previousY !== null
          ) {

            const velocityX =
              (
                event.clientX -
                previousX
              ) /
              deltaTime;


            const velocityY =
              (
                event.clientY -
                previousY
              ) /
              deltaTime;


            const speedX =
              Math.min(
                0.009,
                Math.abs(
                  velocityX
                ) *
                0.012
              );


            const speedY =
              Math.min(
                0.009,
                Math.abs(
                  velocityY
                ) *
                0.012
              );


            targetScaleX =
              1.003 +
              speedX;


            targetScaleY =
              1.003 +
              speedY;


            if (
              Math.abs(
                velocityX
              ) >
              Math.abs(
                velocityY
              )
            ) {

              targetScaleY =
                1.003 -
                speedX *
                0.35;

            } else {

              targetScaleX =
                1.003 -
                speedY *
                0.35;

            }

          }


          previousX =
            event.clientX;


          previousY =
            event.clientY;


          previousTime =
            now;


          startAnimation();
        };


        const handleLeave = () => {
          previousX = null;
          previousY = null;


          targetX = 0;
          targetY = 0;


          targetRotateX = 0;
          targetRotateY = 0;


          targetScaleX = 1;
          targetScaleY = 1;


          startAnimation();
        };


        const handleDown = () => {
          targetScaleX = 0.995;
          targetScaleY = 0.99;

          startAnimation();
        };


        const handleUp = () => {
          targetScaleX = 1.003;
          targetScaleY = 1.003;

          startAnimation();
        };


        card.addEventListener(
          'pointermove',
          handleMove
        );


        card.addEventListener(
          'pointerleave',
          handleLeave
        );


        card.addEventListener(
          'pointercancel',
          handleLeave
        );


        card.addEventListener(
          'pointerdown',
          handleDown
        );


        card.addEventListener(
          'pointerup',
          handleUp
        );
      });
    },


    injectForumInteractionStyles() {
      if (
        document.getElementById(
          'forum-liquid-interaction-styles'
        )
      ) {
        return;
      }


      const style =
        document.createElement(
          'style'
        );


      style.id =
        'forum-liquid-interaction-styles';


      style.textContent = `

        /*
          Interaction only.
          No Forum colors are changed.
        */

        .thread-card {
          position: relative;

          transform-origin: center;

          transform-style:
            preserve-3d;

          will-change:
            transform;
        }


        @media (
          prefers-reduced-motion:
          reduce
        ) {

          .thread-card {
            transform:
              none !important;
          }

        }

      `;


      document.head.appendChild(
        style
      );
    }
  },


  mounted() {}
};
