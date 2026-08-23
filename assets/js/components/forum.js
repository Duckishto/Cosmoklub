// Forum tab: tonight's-sky strip, category chips, thread feed.
// Includes subtle 3D cursor interaction on thread cards.
// No mouse highlight.

// Forum tab — thread feed, composer, reader.
//
// All data comes from Supabase through assets/js/lib/forum-api.js, which is
// backed by supabase/schema-forum.sql. If those tables have not been created
// the API returns an empty list with an explanatory message, and the empty
// state below shows it rather than the tab looking broken.

const Forum = {
  name: 'Forum',

  template: `
    <div class="fxd">


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

              <!-- Only ever shown on your own post; the database refuses it
                   for anyone else regardless. -->
              <button
                v-if="isMine(reading) && confirmDeleteThread !== reading.id"
                class="fxd-del-btn"
                @click="askDeleteThread(reading)"
              >Delete post</button>

              <span v-else-if="isMine(reading)" class="fxd-del-confirm">
                Delete this post and its comments?
                <button class="fxd-del-yes" :disabled="deleting" @click="doDeleteThread(reading)">
                  {{ deleting ? 'Deleting…' : 'Delete' }}
                </button>
                <button class="fxd-del-no" @click="cancelDelete()">Cancel</button>
              </span>
            </div>

            <div class="fxd-comments">
              <div class="fxd-comment-thread" v-for="c in topLevelComments" :key="c.id">

                <div class="fxd-comment">
                  <span class="fxd-avatar fxd-avatar-sm" :style="{ background: c.color }">{{ c.initial }}</span>
                  <div class="fxd-comment-body">
                    <div class="fxd-comment-head">
                      <span class="fxd-author-name">{{ c.author }}</span>
                      <span class="fxd-time">{{ c.time }}</span>
                    </div>
                    <p>{{ c.body }}</p>
                    <div class="fxd-comment-actions">
                      <button class="fxd-reply-btn" @click="startReply(c)">Reply</button>

                      <button
                        v-if="isMyComment(c) && confirmDeleteComment !== c.id"
                        class="fxd-reply-btn fxd-reply-btn-danger"
                        @click="askDeleteComment(c)"
                      >Delete</button>

                      <span v-else-if="isMyComment(c)" class="fxd-del-confirm">
                        Delete?
                        <button class="fxd-del-yes" :disabled="deleting" @click="doDeleteComment(c)">Yes</button>
                        <button class="fxd-del-no" @click="cancelDelete()">No</button>
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Answers to this comment, indented one level. Deliberately
                     only one level deep: threads that nest without limit get
                     unreadable fast on a phone. -->
                <div class="fxd-comment fxd-comment-child" v-for="r in repliesTo(c.id)" :key="r.id">
                  <span class="fxd-avatar fxd-avatar-sm" :style="{ background: r.color }">{{ r.initial }}</span>
                  <div class="fxd-comment-body">
                    <div class="fxd-comment-head">
                      <span class="fxd-author-name">{{ r.author }}</span>
                      <span class="fxd-time">{{ r.time }}</span>
                    </div>
                    <p>{{ r.body }}</p>
                    <div class="fxd-comment-actions" v-if="isMyComment(r)">
                      <button
                        v-if="confirmDeleteComment !== r.id"
                        class="fxd-reply-btn fxd-reply-btn-danger"
                        @click="askDeleteComment(r)"
                      >Delete</button>
                      <span v-else class="fxd-del-confirm">
                        Delete?
                        <button class="fxd-del-yes" :disabled="deleting" @click="doDeleteComment(r)">Yes</button>
                        <button class="fxd-del-no" @click="cancelDelete()">No</button>
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Reply box, shown under whichever comment you chose. -->
                <div class="fxd-comment-form fxd-reply-form" v-if="replyingTo === c.id">
                  <span class="fxd-avatar fxd-avatar-sm">{{ myInitial }}</span>
                  <input
                    type="text"
                    v-model="replyDraft"
                    :placeholder="'Reply to ' + c.author + '…'"
                    @keyup.enter="submitReply(c)"
                    maxlength="4000"
                  />
                  <button @click="submitReply(c)" :disabled="!replyDraft.trim()">Send</button>
                  <button class="fxd-reply-cancel" @click="cancelReply()">Cancel</button>
                </div>

              </div>

              <p class="fxd-comments-empty" v-if="commentsLoading">Loading comments…</p>
              <p class="fxd-comments-empty" v-else-if="!commentCount(reading)">
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

      <!-- Catalog: single column now — filters live in a horizontal bar
           above the feed instead of a sidebar card, so they read as
           toolbar controls rather than a second nav rail next to the
           real sidebar. -->
      <div class="fxd-shell">
        <section class="fxd-main">

          <div class="sky-strip">
            <div class="sb-icon">◐</div>
            <div class="sky-strip-text">
              <div class="sky-strip-title">Waxing gibbous, 78% lit</div>
              <div class="sky-strip-sub">Good night for Saturn, rises 21:40, Bangkok sky</div>
            </div>
            <div class="sky-strip-cta">TONIGHT'S SKY</div>
          </div>

          <button class="fxd-newpost" @click="openComposer()">
            <span class="fxd-newpost-avatar">{{ myInitial }}</span>
            <span class="fxd-newpost-text">Share something with the club…</span>
            <span class="fxd-newpost-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              <span class="fxd-newpost-btn-label">New post</span>
            </span>
          </button>

          <!-- ============ Filters (visual only) — horizontal bar ============ -->
          <div class="fxd-filterbar">
            <div class="fxd-filterbar-row">
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
            </div>

            <div class="fxd-filterbar-row fxd-filterbar-pills">
              <div class="fxd-pillgroup">
                <span class="fxd-pill-label">Category</span>
                <button class="fxd-pill" :class="{ 'is-active': activeChip === 'All' }" @click="activeChip = 'All'">All</button>
                <button class="fxd-pill" v-for="tag in tags" :key="tag" :class="{ 'is-active': activeChip === tag }" @click="activeChip = tag">{{ tag }}</button>
              </div>

              <span class="fxd-pill-sep" aria-hidden="true"></span>

              <div class="fxd-pillgroup">
                <span class="fxd-pill-label">Status</span>
                <button
                  class="fxd-pill"
                  v-for="status in statuses"
                  :key="status"
                  :class="{ 'is-active': activeStatus === status }"
                  @click="activeStatus = status"
                >{{ status }}</button>
              </div>
            </div>
          </div>

          <div class="fxd-toolbar">
            <h2 class="fxd-title">Discussions</h2>
            <span class="fxd-count">{{ filteredThreads.length }} threads</span>
          </div>

          <div class="fxd-tabs">
            <button class="fxd-tab is-active">All</button>
            <button class="fxd-tab">Following</button>
            <button class="fxd-tab">Popular</button>
          </div>

          <!-- Three states before the grid: still fetching, something went
               wrong, or nothing matches the filters. -->
          <div class="fxd-state" v-if="loading">
            <span class="spinner"></span> Loading the forum…
          </div>

          <div class="fxd-state fxd-state-error" v-else-if="loadError">
            {{ loadError }}
          </div>

          <div class="fxd-state" v-else-if="!filteredThreads.length">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" width="52" height="52"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <p class="fxd-state-title">{{ threads.length ? 'Nothing matches these filters' : 'No posts yet' }}</p>
            <p class="fxd-state-sub">
              {{ threads.length ? 'Try another category or status.' : 'Be the first — use New post above.' }}
            </p>
          </div>

          <div class="fxd-grid" v-else>

            <article class="fxd-card" v-for="t in filteredThreads" :key="t.id" @click="openThread(t)">

              <!-- Only rendered when the post actually carries a picture.
                   This used to be an unconditional placeholder image, which
                   made every text post look like it had an attachment.
                   t.image is not populated by anything yet (attachments
                   aren't built), so in practice cards are text-only until
                   that lands, at which point this needs no further change. -->
              <div class="fxd-card-media" v-if="t.image">
                <span class="fxd-badge" v-if="t.solved">SOLVED</span>
                <img :src="t.image" alt="" draggable="false" loading="lazy" />
              </div>

              <div class="fxd-card-body">
                <!-- With no picture to overlay, SOLVED sits beside the
                     category instead. -->
                <div class="fxd-card-tagrow">
                  <span class="fxd-card-tag">{{ t.tag }}</span>
                  <span class="fxd-badge fxd-badge-flow" v-if="t.solved && !t.image">SOLVED</span>
                </div>
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
      // Keyed by thread id, fetched when a thread's reader is opened.
      comments: {},
      commentsLoading: false,

      reading: null,
      commentDraft: '',

      // Which comment the reply box is currently open under, and its text.
      replyingTo: null,
      replyDraft: '',

      // Id of the post or comment showing its "really delete?" row. Only one
      // at a time, and nothing is removed until it is confirmed.
      confirmDeleteThread: null,
      confirmDeleteComment: null,
      deleting: false,

      // Threads whose "Has this been solved?" prompt has been answered or
      // waved away, so it doesn't nag on every visit.
      solvePromptDismissed: [],

      // Composer. Still local-only: posting pushes onto `threads` below so the
      // flow can be judged on screen before assets/js/lib/forum-api.js and
      // supabase/schema-forum.sql take over the storage.
      composerOpen: false,
      myId: null,
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

      // Filled from Supabase in mounted(). Empty until then — the template
      // already has a loading state and an empty state for both cases.
      threads: [],
      loading: true,
      loadError: '',
      posting: false,
    };

    return state;
  },


  computed: {
    myInitial() {
      return (this.myName || '?').trim().charAt(0).toUpperCase() || '?';
    },

    // Comments arrive flat with a parentId; the reader groups them.
    topLevelComments() {
      return this.commentsFor(this.reading).filter(c => !c.parentId);
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
    // ---- Loading --------------------------------------------------------

    // Threads come from the forum_thread_feed view, which carries the author's
    // name and the reply/like counts already joined in — one request for the
    // whole board rather than one per card.
    async loadFeed() {
      this.loading = true;
      this.loadError = '';

      const res = await window.ForumAPI.listThreads({ limit: 100 });

      if (!res.ok) {
        this.loadError = res.error || 'Could not load the forum.';
        this.threads = [];
        this.loading = false;
        return;
      }

      this.threads = res.threads.map(this.shapeThread);

      // Which of these the signed-in person has already liked, so the hearts
      // render filled without a request per card.
      const liked = await window.ForumAPI.likedThreadIds(this.threads.map(t => t.id));
      this.likedIds = [...liked];

      this.loading = false;
    },

    // The view's column names differ from what this component has always
    // rendered; translating here keeps the template untouched.
    shapeThread(row) {
      const name = row.author_username || 'Someone';
      return {
        id: row.id,
        authorId: row.author_id,
        author: name,
        initial: name.trim().charAt(0).toUpperCase() || '?',
        avatar: row.author_avatar_url || '',
        color: '#7c3aed',
        level: '',
        time: window.ForumAPI.timeAgo(row.created_at),
        replies: row.reply_count || 0,
        upvotes: row.like_count || 0,
        tag: row.category,
        solved: !!row.solved,
        title: row.title,
        body: row.body,
      };
    },

    // ---- Solved state ---------------------------------------------------

    // Compared by id, not by name — a display name can be changed or
    // duplicated, and the database checks the same thing in its RLS policy.
    isMine(thread) {
      return !!thread && !!this.myId && thread.authorId === this.myId;
    },

    async markSolved(thread, solved) {
      if (!thread) return;

      const previous = thread.solved;
      thread.solved = !!solved;          // optimistic
      this.dismissSolvePrompt(thread);

      const res = await window.ForumAPI.setSolved(thread.id, solved);
      if (!res.ok) {
        thread.solved = previous;        // put it back if the server refused
        this.loadError = res.error || 'Could not update that.';
      }
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

    // Updated on screen straight away and rolled back if the write fails —
    // waiting for a round trip to fill in a heart feels broken.
    async toggleLike(thread) {
      if (!thread) return;

      const wasLiked = this.isLiked(thread);
      const at = this.likedIds.indexOf(thread.id);

      if (wasLiked) {
        this.likedIds.splice(at, 1);
        thread.upvotes = Math.max(0, thread.upvotes - 1);
      } else {
        this.likedIds.push(thread.id);
        thread.upvotes += 1;
      }

      const res = await window.ForumAPI.toggleLike(thread.id, wasLiked);

      if (!res.ok) {
        if (wasLiked) {
          this.likedIds.push(thread.id);
          thread.upvotes += 1;
        } else {
          const i = this.likedIds.indexOf(thread.id);
          if (i >= 0) this.likedIds.splice(i, 1);
          thread.upvotes = Math.max(0, thread.upvotes - 1);
        }
        this.loadError = res.error || 'Could not save that like.';
      }
    },

    // ---- Comments -------------------------------------------------------

    commentsFor(thread) {
      return (thread && this.comments[thread.id]) || [];
    },

    // The card shows the count the feed view computed; once the reader has
    // fetched the actual list, that is the more current number.
    commentCount(thread) {
      if (!thread) return 0;
      const list = this.comments[thread.id];
      return list ? list.length : (thread.replies || 0);
    },

    async openThread(thread) {
      this.reading = thread;
      this.commentDraft = '';
      this.replyingTo = null;
      this.replyDraft = '';

      this.commentsLoading = true;
      await this.refreshComments(thread);
      this.commentsLoading = false;
    },

    closeThread() {
      this.reading = null;
      this.commentDraft = '';
      this.replyingTo = null;
      this.replyDraft = '';
    },

    repliesTo(commentId) {
      return this.commentsFor(this.reading).filter(c => c.parentId === commentId);
    },

    startReply(comment) {
      this.replyingTo = comment.id;
      this.replyDraft = '';
    },

    cancelReply() {
      this.replyingTo = null;
      this.replyDraft = '';
    },

    async submitReply(comment) {
      const body = this.replyDraft.trim();
      if (!body || !this.reading) return;

      const thread = this.reading;
      this.replyDraft = '';
      this.replyingTo = null;

      const res = await window.ForumAPI.addReply(thread.id, body, comment.id);

      if (!res.ok) {
        this.replyDraft = body;          // hand it back rather than losing it
        this.replyingTo = comment.id;
        this.loadError = res.error || 'Could not post that reply.';
        return;
      }

      await this.refreshComments(thread);
    },

    // One place that re-reads a thread's comments, used after posting either
    // a comment or a reply.
    async refreshComments(thread) {
      const res = await window.ForumAPI.listReplies(thread.id);
      if (!res.ok) return;

      this.comments[thread.id] = res.replies.map(r => ({
        id: r.id,
        parentId: r.parentId,
        authorId: r.authorId,
        author: r.author,
        initial: (r.author || '?').trim().charAt(0).toUpperCase() || '?',
        color: '#7c3aed',
        time: window.ForumAPI.timeAgo(r.createdAt),
        body: r.body,
      }));

      thread.replies = this.comments[thread.id].length;
    },

    // ---- Deleting -------------------------------------------------------

    isMyComment(comment) {
      return !!comment && !!this.myId && comment.authorId === this.myId;
    },

    askDeleteThread(thread) {
      this.confirmDeleteThread = thread.id;
    },

    askDeleteComment(comment) {
      this.confirmDeleteComment = comment.id;
    },

    cancelDelete() {
      this.confirmDeleteThread = null;
      this.confirmDeleteComment = null;
    },

    async doDeleteThread(thread) {
      if (this.deleting) return;
      this.deleting = true;

      const res = await window.ForumAPI.deleteThread(thread.id);
      this.deleting = false;
      this.confirmDeleteThread = null;

      if (!res.ok) {
        this.loadError = res.error || 'Could not delete that post.';
        return;
      }

      // The reader is showing a post that no longer exists.
      this.closeThread();
      await this.loadFeed();
    },

    async doDeleteComment(comment) {
      if (this.deleting) return;
      this.deleting = true;

      const res = await window.ForumAPI.deleteReply(comment.id);
      this.deleting = false;
      this.confirmDeleteComment = null;

      if (!res.ok) {
        this.loadError = res.error || 'Could not delete that comment.';
        return;
      }

      await this.refreshComments(this.reading);
    },

    async submitComment() {
      const body = this.commentDraft.trim();
      if (!body || !this.reading) return;

      const thread = this.reading;
      this.commentDraft = '';

      const res = await window.ForumAPI.addReply(thread.id, body);

      if (!res.ok) {
        this.commentDraft = body;        // give it back so nothing is lost
        this.loadError = res.error || 'Could not post that comment.';
        return;
      }

      await this.refreshComments(thread);
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

    async submitPost() {
      if (this.posting) return;

      this.draft.error = '';
      this.posting = true;

      const res = await window.ForumAPI.createThread({
        title: this.draft.title,
        body: this.draft.body,
        category: this.draft.tag,
        solved: this.draft.solved,
      });

      this.posting = false;

      if (!res.ok) {
        this.draft.error = res.error || 'Could not post that.';
        return;
      }

      this.composerOpen = false;

      // Show the whole board again so the new post can't be hidden behind
      // whichever filter happened to be selected, then reload so the card
      // carries the real id, timestamp and counts.
      this.activeChip = 'All';
      this.activeStatus = 'All';
      await this.loadFeed();
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
    // Who is posting — shown in the composer, and the id is what decides
    // whether the "has this been solved?" prompt belongs to you.
    try {
      const client = window.supabaseClient || (window.supabaseReady ? await window.supabaseReady : null);

      if (client) {
        const { data } = await client.auth.getSession();
        const user = data && data.session && data.session.user;

        if (user) {
          this.myId = user.id;

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
        }
      }
    } catch (error) {
      console.warn('[CosmoKlub] forum could not read your account.', error);
    }

    await this.loadFeed();
  },

};
