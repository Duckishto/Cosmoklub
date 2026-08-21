// Forum tab: tonight's-sky strip, category chips, thread feed.
// Includes subtle 3D cursor interaction on thread cards.
// No mouse highlight.

// Seeded comments for the mock feed, keyed by thread id. Threads missing from
// here genuinely have none, which is what makes the "Unanswered" filter show
// anything at all. Each thread's `replies` count is reconciled against this in
// data() so a card can never claim more comments than the reader will show.
const FORUM_MOCK_COMMENTS = {
  1: [
    { author: 'darkskydave', initial: 'D', color: '#22d3ee', time: '2h ago',
      body: "A 6\" will show the rings clearly and the Cassini division on a steady night. Don't expect Hubble, but you'll grin." },
    { author: 'rings_of_r', initial: 'R', color: '#a855f7', time: '1h ago',
      body: '150x is about right for that aperture. Let it cool outside for 30 minutes first — it makes a bigger difference than the eyepiece.' },
    { author: 'firstlight', initial: 'F', color: '#3b82f6', time: '44m ago',
      body: 'Bortle 5 is fine for planets. Light pollution barely touches them.' },
  ],
  3: [
    { author: 'coldfinger', initial: 'C', color: '#60a5fa', time: '5h ago',
      body: 'Check collimation before you blame the seeing. A reflector that has been in a car boot is almost never still aligned.' },
    { author: 'lens_lena', initial: 'L', color: '#ec4899', time: '3h ago',
      body: 'Had the same thing. Turned out I was using too much power for the night — dropped to 100x and it snapped into focus.' },
  ],
  5: [
    { author: 'nebula_nia', initial: 'N', color: '#8b5cf6', time: '1d ago',
      body: 'Gorgeous framing. What total integration time did this end up being?' },
  ],
  7: [
    { author: 'meteor_mo', initial: 'M', color: '#10b981', time: '2d ago',
      body: 'Saw the same thing from a much worse sky and still caught a dozen. Worth staying up for.' },
    { author: 'starhopper', initial: 'S', color: '#c084fc', time: '2d ago',
      body: 'Any tips for keeping warm on an all-nighter? Last time I gave up at 2am.' },
  ],
  10: [
    { author: 'solar_sam', initial: 'S', color: '#fbbf24', time: '4d ago',
      body: 'The shadow really does look like someone dotted the disc with a marker. Nice capture.' },
  ],
  16: [
    { author: 'archive_ada', initial: 'A', color: '#34d399', time: '5h ago',
      body: 'f/2 at ISO 3200 for 4s is a lot of light for a Kp7 display. Try ISO 800 and 2s next time.' },
    { author: 'coldfinger', initial: 'C', color: '#60a5fa', time: '4h ago',
      body: 'Also worth shooting raw and pulling the highlights back rather than chasing it in camera.' },
  ],
  18: [
    { author: 'quiet_quasar', initial: 'Q', color: '#f472b6', time: '9h ago',
      body: 'It is almost always the eyepiece being pushed past what the sky will allow. Try half the magnification.' },
  ],
  22: [
    { author: 'darkskydave', initial: 'D', color: '#22d3ee', time: '1d ago',
      body: 'Dew shield first, always. It is cheaper and solves most of it. Heater only if you are out past midnight regularly.' },
    { author: 'aurora_ann', initial: 'A', color: '#f59e0b', time: '22h ago',
      body: 'Seconding the shield. A strip of camping mat and some velcro cost me nothing and bought two extra hours.' },
    { author: 'firstlight', initial: 'F', color: '#3b82f6', time: '20h ago',
      body: 'If you do go heater, get one with a controller. Full power fogs your view with heat shimmer instead.' },
  ],
  27: [
    { author: 'nebula_nia', initial: 'N', color: '#8b5cf6', time: '3d ago',
      body: 'Twenty hours shows. The halo control around Alnitak is the hard part and you nailed it.' },
  ],
};

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

      <!-- Composer entry point, full width under the strip. -->
      <button class="fxd-newpost" @click="openComposer()">
        <span class="fxd-newpost-avatar">{{ myInitial }}</span>
        <span class="fxd-newpost-text">Share something with the club…</span>
        <span class="fxd-newpost-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <span class="fxd-newpost-btn-label">New post</span>
        </span>
      </button>

      <!-- ============ Composer ============ -->
      <transition name="fade">
        <div class="fxd-composer-back" v-if="composerOpen" @click.self="closeComposer()">
          <div class="fxd-composer">
            <div class="fxd-composer-head">
              <h3>New post</h3>
              <button class="fxd-composer-x" @click="closeComposer()" aria-label="Close">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <input
              class="fxd-composer-title"
              v-model="draft.title"
              type="text"
              maxlength="160"
              placeholder="Title — what's your question or find?"
            />

            <textarea
              class="fxd-composer-body"
              v-model="draft.body"
              rows="5"
              maxlength="8000"
              placeholder="Add the details. Gear, sky conditions, what you've already tried…"
            ></textarea>

            <div class="fxd-composer-field">
              <span class="fxd-composer-label">Category</span>
              <div class="fxd-pills">
                <button
                  class="fxd-pill"
                  v-for="tag in tags"
                  :key="tag"
                  :class="{ 'is-active': draft.tag === tag }"
                  @click="draft.tag = tag"
                >{{ tag }}</button>
              </div>
            </div>

            <!-- Only questions can be solved, so this appears for Q&A only. -->
            <div class="fxd-composer-field" v-if="draft.tag === 'Beginner Q&A'">
              <span class="fxd-composer-label">Status</span>
              <div class="fxd-pills">
                <button class="fxd-pill" :class="{ 'is-active': !draft.solved }" @click="draft.solved = false">Unsolved</button>
                <button class="fxd-pill" :class="{ 'is-active': draft.solved }" @click="draft.solved = true">Solved</button>
              </div>
            </div>

            <p class="fxd-composer-error" v-if="draft.error">{{ draft.error }}</p>

            <div class="fxd-composer-foot">
              <span class="fxd-composer-note">Posted as {{ myName }}</span>
              <button class="fxd-composer-post" @click="submitPost()">Post</button>
            </div>
          </div>
        </div>
      </transition>

      <!-- ============ Thread reader ============
           Opens from a click anywhere on a card, or on its comment count. -->
      <transition name="fade">
        <div class="fxd-composer-back" v-if="reading" @click.self="closeThread()">
          <div class="fxd-reader">

            <div class="fxd-composer-head">
              <span class="fxd-card-tag">{{ reading.tag }}</span>
              <button class="fxd-composer-x" @click="closeThread()" aria-label="Close">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <!-- Only the person who asked can say whether they got an answer,
                 so this shows on your own unsolved questions and nowhere else. -->
            <div class="fxd-solve-ask" v-if="showSolvePrompt">
              <span class="fxd-solve-ask-text">Has this been solved?</span>
              <div class="fxd-solve-ask-btns">
                <button class="fxd-solve-yes" @click="markSolved(reading, true)">Yes</button>
                <button class="fxd-solve-no" @click="dismissSolvePrompt(reading)">No</button>
              </div>
            </div>

            <h3 class="fxd-reader-title">
              {{ reading.title }}
              <span class="fxd-badge fxd-badge-inline" v-if="reading.solved">SOLVED</span>
              <button
                class="fxd-solve-undo"
                v-if="reading.solved && isMine(reading) && reading.tag === 'Beginner Q&A'"
                @click="markSolved(reading, false)"
              >Mark unsolved</button>
            </h3>

            <div class="fxd-card-author">
              <span class="fxd-avatar" :style="{ background: reading.color }">{{ reading.initial }}</span>
              <span class="fxd-author-name">{{ reading.author }}</span>
              <span class="fxd-lvl">{{ reading.level }}</span>
              <span class="fxd-time">{{ reading.time }}</span>
            </div>

            <p class="fxd-reader-body">{{ reading.body }}</p>

            <div class="fxd-reader-actions">
              <button
                class="fxd-stat fxd-stat-btn fxd-like"
                :class="{ 'is-liked': isLiked(reading) }"
                @click="toggleLike(reading)"
              >
                <svg viewBox="0 0 24 24" :fill="isLiked(reading) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
                {{ reading.upvotes }} {{ reading.upvotes === 1 ? 'like' : 'likes' }}
              </button>
              <span class="fxd-stat">{{ commentCount(reading) }} {{ commentCount(reading) === 1 ? 'comment' : 'comments' }}</span>
            </div>

            <div class="fxd-comments">
              <div class="fxd-comment" v-for="c in commentsFor(reading)" :key="c.id">
                <span class="fxd-avatar fxd-avatar-sm" :style="{ background: c.color }">{{ c.initial }}</span>
                <div class="fxd-comment-body">
                  <div class="fxd-comment-head">
                    <span class="fxd-author-name">{{ c.author }}</span>
                    <span class="fxd-time">{{ c.time }}</span>
                  </div>
                  <p>{{ c.body }}</p>
                </div>
              </div>

              <p class="fxd-comments-empty" v-if="!commentCount(reading)">
                No comments yet — be the first to reply.
              </p>
            </div>

            <div class="fxd-comment-form">
              <span class="fxd-avatar fxd-avatar-sm">{{ myInitial }}</span>
              <input
                type="text"
                v-model="commentDraft"
                placeholder="Write a comment…"
                @keyup.enter="submitComment()"
                maxlength="4000"
              />
              <button @click="submitComment()" :disabled="!commentDraft.trim()">Send</button>
            </div>

          </div>
        </div>
      </transition>

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
              <button
                class="fxd-pill"
                v-for="status in statuses"
                :key="status"
                :class="{ 'is-active': activeStatus === status }"
                @click="activeStatus = status"
              >{{ status }}</button>
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

            <article class="fxd-card" v-for="t in filteredThreads" :key="t.id" @click="openThread(t)">

              <div class="fxd-card-media">
                <span class="fxd-badge" v-if="t.solved">SOLVED</span>
                <button class="fxd-fav" aria-label="Save thread" @click.stop>
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
                  <button class="fxd-stat fxd-stat-btn" @click.stop="openThread(t)" :aria-label="'Comments on ' + t.title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8A8.5 8.5 0 0 1 21 11.5z"/></svg>
                    {{ commentCount(t) }}
                  </button>
                  <button
                    class="fxd-stat fxd-stat-btn fxd-like"
                    :class="{ 'is-liked': isLiked(t) }"
                    @click.stop="toggleLike(t)"
                    :aria-pressed="isLiked(t)"
                    aria-label="Like this post"
                  >
                    <svg viewBox="0 0 24 24" :fill="isLiked(t) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
                    {{ t.upvotes }}
                  </button>
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
    const state = {
      activeChip: 'All',

      // Sidebar status filter. 'Unanswered' means no comments yet, which is a
      // different thing from 'not solved' — a question can have ten replies
      // and still be open.
      activeStatus: 'All',
      statuses: ['All', 'Solved', 'Unanswered'],

      // Likes and comments are local for now, same as the threads themselves.
      // ForumAPI.toggleLike / addReply replace these once the tables exist.
      likedIds: [],
      comments: JSON.parse(JSON.stringify(FORUM_MOCK_COMMENTS)),

      reading: null,
      commentDraft: '',

      // Threads whose "Has this been solved?" prompt has been answered or
      // waved away, so it doesn't nag on every visit.
      solvePromptDismissed: [],

      // Composer. Still local-only: posting pushes onto `threads` below so the
      // flow can be judged on screen before assets/js/lib/forum-api.js and
      // supabase/schema-forum.sql take over the storage.
      composerOpen: false,
      myName: 'you',
      draft: {
        title: '',
        body: '',
        tag: 'Beginner Q&A',
        solved: false,
        error: '',
      },

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
          id: 16,
          author: 'aurora_ann',
          initial: 'A',
          color: '#f59e0b',
          level: 'Lv. 7',
          time: '6h ago',
          replies: 9,
          upvotes: 27,
          tag: 'Astrophotography',

          title:
            'First real aurora from 52°N — what settings would you have used?',

          body:
            'Kp hit 7 and the whole northern sky went green. I shot 4s at f/2 ISO 3200 and blew the highlights. Next time?',

          solved: false
        },

        {
          id: 17,
          author: 'darkskydave',
          initial: 'D',
          color: '#22d3ee',
          level: 'Lv. 12',
          time: '9h ago',
          replies: 22,
          upvotes: 64,
          tag: 'Deep Sky',

          title:
            'Bortle 4 vs Bortle 2 for faint galaxies — is the drive worth it?',

          body:
            'Two hours each way to the dark site. Ran the same target from both. Posting the stacks so you can judge for yourself.',

          solved: true
        },

        {
          id: 18,
          author: 'lens_lena',
          initial: 'L',
          color: '#ec4899',
          level: 'Lv. 3',
          time: '11h ago',
          replies: 5,
          upvotes: 12,
          tag: 'Beginner Q&A',

          title:
            'Why does my Moon look like a white blob at high power?',

          body:
            '130mm reflector, 6mm eyepiece. The Moon is just a bright smear. Is it collimation, seeing, or am I overpowering the scope?',

          solved: false
        },

        {
          id: 19,
          author: 'rings_of_r',
          initial: 'R',
          color: '#a855f7',
          level: 'Lv. 8',
          time: '14h ago',
          replies: 17,
          upvotes: 53,
          tag: 'Solar System',

          title:
            'Cassini division held steady for a full minute last night',

          body:
            'Best seeing I have had all year. 8" SCT at 220x. Saturn finally looked like the textbook photo.',

          solved: false
        },

        {
          id: 20,
          author: 'meteor_mo',
          initial: 'M',
          color: '#10b981',
          level: 'Lv. 5',
          time: '18h ago',
          replies: 31,
          upvotes: 88,
          tag: 'News',

          title:
            'Perseid outburst forecast — anyone planning an all-nighter?',

          body:
            'A couple of models are hinting at a secondary peak. Thinking of driving out Thursday if the cloud clears.',

          solved: false
        },

        {
          id: 21,
          author: 'firstlight',
          initial: 'F',
          color: '#3b82f6',
          level: 'Lv. 2',
          time: '1d ago',
          replies: 8,
          upvotes: 19,
          tag: 'Equipment',

          title:
            'Is a 2x Barlow worth it before buying more eyepieces?',

          body:
            'Budget is tight. Two decent eyepieces plus a Barlow, or four cheaper eyepieces? Leaning toward the former.',

          solved: true
        },

        {
          id: 22,
          author: 'nebula_nia',
          initial: 'N',
          color: '#8b5cf6',
          level: 'Lv. 9',
          time: '1d ago',
          replies: 14,
          upvotes: 47,
          tag: 'Deep Sky',

          title:
            'Veil Nebula in 6nm OIII — 9 hours integration',

          body:
            'Finally finished the mosaic. The filaments came out far better than my broadband attempt last summer.',

          solved: false
        },

        {
          id: 23,
          author: 'quiet_quasar',
          initial: 'Q',
          color: '#f472b6',
          level: 'Lv. 11',
          time: '2d ago',
          replies: 26,
          upvotes: 71,
          tag: 'Beginner Q&A',

          title:
            'What actually counts as "averted vision" and how do I practise it?',

          body:
            'Everyone says look slightly to the side. I tried and the object vanished entirely. What am I doing wrong?',

          solved: true
        },

        {
          id: 24,
          author: 'solar_sam',
          initial: 'S',
          color: '#fbbf24',
          level: 'Lv. 6',
          time: '2d ago',
          replies: 11,
          upvotes: 33,
          tag: 'Solar System',

          title:
            'Huge sunspot group rotating into view — white light shots',

          body:
            'AR3664 sized region coming round the limb. Herschel wedge on a 90mm refractor. Detail is incredible.',

          solved: false
        },

        {
          id: 25,
          author: 'coldfinger',
          initial: 'C',
          color: '#60a5fa',
          level: 'Lv. 10',
          time: '3d ago',
          replies: 19,
          upvotes: 58,
          tag: 'Astrophotography',

          title:
            'Dew heater or dew shield first? Losing half my sessions to fog',

          body:
            'Optical tube fogs about 90 minutes in. Trying to work out the cheapest fix that actually works in humid air.',

          solved: false
        },

        {
          id: 26,
          author: 'starhopper',
          initial: 'S',
          color: '#c084fc',
          level: 'Lv. 4',
          time: '3d ago',
          replies: 7,
          upvotes: 21,
          tag: 'Beginner Q&A',

          title:
            'Star hopping to M81 keeps failing — is my finder the problem?',

          body:
            'I get to the Big Dipper fine then lose the trail. Red dot finder only. Should I get a proper optical finder?',

          solved: false
        },

        {
          id: 27,
          author: 'archive_ada',
          initial: 'A',
          color: '#34d399',
          level: 'Lv. 13',
          time: '5d ago',
          replies: 38,
          upvotes: 102,
          tag: 'News',

          title:
            'JWST released a new deep field this morning',

          body:
            'The lensing arcs in the corner are unreal. Dropping the FITS links below for anyone who wants to process it themselves.',

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

    // A card's comment count and the reader's list must agree, so the seeded
    // `replies` numbers are replaced by the real count. Threads with no seeded
    // comments land on 0 — which is what the "Unanswered" filter looks for.
    state.threads.forEach(thread => {
      thread.replies = (state.comments[thread.id] || []).length;
    });

    // Stable keys for v-for.
    Object.keys(state.comments).forEach(id => {
      state.comments[id].forEach((comment, i) => {
        if (!comment.id) comment.id = 'seed-' + id + '-' + i;
      });
    });

    return state;
  },


  computed: {
    myInitial() {
      return (this.myName || '?').trim().charAt(0).toUpperCase() || '?';
    },

    // Your own question, still open, prompt not yet answered.
    showSolvePrompt() {
      const t = this.reading;
      return (
        !!t &&
        t.tag === 'Beginner Q&A' &&
        this.isMine(t) &&
        !t.solved &&
        !this.solvePromptDismissed.includes(t.id)
      );
    },

    filteredThreads() {
      return this.threads.filter(thread => {
        if (this.activeChip !== 'All' && thread.tag !== this.activeChip) return false;

        if (this.activeStatus === 'Solved') return !!thread.solved;
        if (this.activeStatus === 'Unanswered') return this.commentCount(thread) === 0;

        return true;
      });
    }
  },




  methods: {
    // ---- Solved state ---------------------------------------------------

    // Mock threads carry an author name rather than an id; once the forum is
    // on Supabase this becomes thread.author_id === user.id.
    isMine(thread) {
      return !!thread && thread.author === this.myName;
    },

    markSolved(thread, solved) {
      if (!thread) return;
      thread.solved = !!solved;
      // Answering the prompt either way retires it for this thread.
      this.dismissSolvePrompt(thread);
    },

    dismissSolvePrompt(thread) {
      if (thread && !this.solvePromptDismissed.includes(thread.id)) {
        this.solvePromptDismissed.push(thread.id);
      }
    },

    // ---- Likes ----------------------------------------------------------

    isLiked(thread) {
      return !!thread && this.likedIds.includes(thread.id);
    },

    toggleLike(thread) {
      if (!thread) return;

      const at = this.likedIds.indexOf(thread.id);

      if (at >= 0) {
        this.likedIds.splice(at, 1);
        thread.upvotes = Math.max(0, thread.upvotes - 1);
      } else {
        this.likedIds.push(thread.id);
        thread.upvotes += 1;
      }
    },

    // ---- Comments -------------------------------------------------------

    commentsFor(thread) {
      return (thread && this.comments[thread.id]) || [];
    },

    // The seeded mock threads carry a reply count that predates the comment
    // list, so fall back to it until someone actually comments.
    commentCount(thread) {
      if (!thread) return 0;
      const list = this.comments[thread.id];
      return list ? list.length : (thread.replies || 0);
    },

    openThread(thread) {
      this.reading = thread;
      this.commentDraft = '';
    },

    closeThread() {
      this.reading = null;
      this.commentDraft = '';
    },

    submitComment() {
      const body = this.commentDraft.trim();
      if (!body || !this.reading) return;

      const id = this.reading.id;
      // Seeding on first use keeps the mock thread list readable — no need to
      // hand-write an empty array on all 27 of them.
      if (!this.comments[id]) this.comments[id] = [];

      this.comments[id].push({
        id: Date.now(),
        author: this.myName,
        initial: this.myInitial,
        color: '#7c3aed',
        time: 'just now',
        body,
      });

      // The card's count now comes from the comment list, so keep the seeded
      // number in step rather than letting it jump backwards.
      this.reading.replies = this.comments[id].length;
      this.commentDraft = '';
    },

    openComposer() {
      this.draft = {
        title: '',
        body: '',
        tag: this.activeChip === 'All' ? 'Beginner Q&A' : this.activeChip,
        solved: false,
        error: '',
      };
      this.composerOpen = true;
    },

    closeComposer() {
      this.composerOpen = false;
    },

    submitPost() {
      const title = this.draft.title.trim();
      const body = this.draft.body.trim();

      if (title.length < 4) {
        this.draft.error = 'Give your post a title of at least 4 characters.';
        return;
      }
      if (!body) {
        this.draft.error = 'Write something in the body.';
        return;
      }

      // Local-only for now — swap this block for ForumAPI.createThread() once
      // the tables exist, and the rest of the component stays as it is.
      this.threads.unshift({
        id: Date.now(),
        author: this.myName,
        initial: this.myInitial,
        color: '#7c3aed',
        level: 'Lv. 1',
        time: 'just now',
        replies: 0,
        upvotes: 0,
        tag: this.draft.tag,
        // Only questions carry a solved state.
        solved: this.draft.tag === 'Beginner Q&A' ? this.draft.solved : false,
        title,
        body,
      });

      // Jump the filter to the new post's category so it can't vanish behind
      // whichever chip happened to be selected.
      this.activeChip = 'All';
      this.composerOpen = false;
    },


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


  async mounted() {
    // The composer shows who you're posting as. Threads are still mock data,
    // but the name is real — no reason to fake that part.
    try {
      const client = window.supabaseClient || (window.supabaseReady ? await window.supabaseReady : null);
      if (!client) return;

      const { data } = await client.auth.getSession();
      const user = data && data.session && data.session.user;
      if (!user) return;

      const { data: row } = await client
        .from('profiles')
        .select('username')
        .eq('uid', user.id)
        .single();

      this.myName =
        (row && row.username) ||
        (user.user_metadata && user.user_metadata.username) ||
        (user.email || '').split('@')[0] ||
        'you';
    } catch (error) {
      console.warn('[CosmoKlub] forum could not read your name; using a placeholder.', error);
    }
  }
};
