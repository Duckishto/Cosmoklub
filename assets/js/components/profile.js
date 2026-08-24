// CosmoKlub — Profile tab.
//
// The public-facing half of a user: who they are, what they've posted, and how
// far they've got. Account controls (rename, sign out) live in
// components/settings.js, reachable from the ACCOUNT group in the sidebar
// and from the "Edit profile" button at the top of this page.
//
// Laid out on the shared page primitives in dashboard-shell.css (.pg-head,
// .ck-card, .ck-seg, .ck-empty): page title and description top-left, the
// action top-right, then cards. Everything page-specific is prefixed .pf-
// and lives in assets/css/profile.css.
//
// Two sub-tabs, Posts and Progression, under the identity card.
//
// Posts and the Likes count are real, read through lib/forum-api.js
// (threadsByUser, likeCountForUser) — so forum-api.js must load before this
// file; dashboard.html orders them that way.
//
// ⚠️ Followers and Following are still placeholders: neither has a table in
// Supabase, so both render 0. loadSocial() below is where they'd be counted
// once a `follows` table exists; nothing else in this file would change.
//
// The progression numbers are real too: progress.js already computes
// levels/ranks and already syncs with Supabase for signed-in users.
//
// One deliberate choice: the headline level and rank come from
// getLevelProgress(totalXP) rather than getOverallProgress().averageLevel.
// Both exist in progress.js, but averageLevel is the mean of the six category
// levels, which would disagree with the XP bar sitting right underneath it.

const Profile = {
  name: 'Profile',

  template: `
  <div class="profile-tab pg">

    <div v-if="loading" class="ck-loading-row">
      <span class="ck-spinner"></span>
      <span class="ck-loading-text">Loading your profile…</span>
    </div>

    <template v-else>

      <!-- No page header: the shell's top bar already names the page, so a
           title and description underneath just repeated it. -->

      <!-- ─────────────── Identity ─────────────── -->
      <section class="ck-card pf-identity">
        <span class="pf-avatar" :class="rankClass">{{ initial }}</span>

        <div class="pf-identity-body">
          <h2 class="pf-name">{{ username || 'Astronomer' }}</h2>
          <div class="pf-identity-meta">
            <span class="pf-rank" :class="rankClass">{{ level.rank }}</span>
            <span class="ck-badge ck-badge-muted">Level {{ level.level }}</span>
          </div>
        </div>

        <div class="pf-counts">
          <div class="pf-count">
            <span class="pf-count-value">{{ social.following.toLocaleString() }}</span>
            <span class="pf-count-label">Following</span>
          </div>
          <div class="pf-count">
            <span class="pf-count-value">{{ social.followers.toLocaleString() }}</span>
            <span class="pf-count-label">Followers</span>
          </div>
          <div class="pf-count">
            <span class="pf-count-value">{{ social.likes.toLocaleString() }}</span>
            <span class="pf-count-label">Likes</span>
          </div>
        </div>
      </section>

      <!-- ─────────────── Sub-tabs ─────────────── -->
      <div class="ck-seg pf-seg">
        <button type="button" class="ck-seg-btn" :class="{ 'is-active': view === 'posts' }"
                @click="view = 'posts'">Posts</button>
        <button type="button" class="ck-seg-btn" :class="{ 'is-active': view === 'progression' }"
                @click="view = 'progression'">Progression</button>
      </div>

      <!-- ─────────────── Posts ─────────────── -->
      <section v-if="view === 'posts'" class="ck-card">
        <div v-if="posts.length" class="pf-posts">
          <article class="pf-post" v-for="post in posts" :key="post.id">
            <div class="pf-post-head">
              <span class="pf-post-cat">{{ post.category }}</span>
              <span class="pf-post-solved" v-if="post.solved">Solved</span>
              <span class="pf-post-time">{{ post.time }}</span>
            </div>
            <h4 class="pf-post-title">{{ post.title }}</h4>
            <p class="pf-post-body">{{ post.body }}</p>
            <div class="pf-post-meta">
              <span>{{ post.replies }} {{ post.replies === 1 ? 'reply' : 'replies' }}</span>
              <span>{{ post.likes }} {{ post.likes === 1 ? 'like' : 'likes' }}</span>
            </div>
          </article>
        </div>

        <div v-else class="ck-empty">
          <span class="ck-empty-ic">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </span>
          <p class="ck-empty-title">No posts yet</p>
          <p class="ck-empty-sub">
            Anything you post in the Forum shows up here.
          </p>
        </div>
      </section>

      <!-- ─────────────── Progression ─────────────── -->
      <template v-else>
        <section class="ck-card">
          <div class="ck-card-head">
            <h3 class="ck-card-title">Progress</h3>
            <p class="ck-card-sub">Experience earned across every lesson you have finished.</p>
          </div>

          <div class="pf-xp-head">
            <span class="pf-xp-total">{{ level.xp.toLocaleString() }} XP</span>
            <span v-if="level.isMaxLevel" class="pf-xp-next">Max level reached</span>
            <span v-else class="pf-xp-next">
              {{ level.xpForNextLevel.toLocaleString() }} XP to level {{ level.level + 1 }}
            </span>
          </div>

          <div class="pf-bar">
            <div class="pf-bar-fill" :class="rankClass" :style="{ width: level.progress + '%' }"></div>
          </div>

          <p class="ck-hint" v-if="nextRank">
            Next rank: <strong>{{ nextRank.name }}</strong> at level {{ nextRank.minLevel }}
          </p>
          <p class="ck-hint" v-else>You have reached the highest rank.</p>

          <div class="pf-stats">
            <div class="pf-stat">
              <span class="pf-stat-value">{{ overall.totalCompleted }}</span>
              <span class="pf-stat-label">Lessons done</span>
            </div>
            <div class="pf-stat">
              <span class="pf-stat-value">{{ overall.totalLessons }}</span>
              <span class="pf-stat-label">Lessons total</span>
            </div>
            <div class="pf-stat">
              <span class="pf-stat-value">{{ overall.completionPercent }}%</span>
              <span class="pf-stat-label">Complete</span>
            </div>
          </div>
        </section>

        <section class="ck-card">
          <div class="ck-card-head">
            <h3 class="ck-card-title">By topic</h3>
            <p class="ck-card-sub">Where your XP has come from so far.</p>
          </div>

          <div class="pf-topic" v-for="cat in categories" :key="cat.id">
            <div class="pf-topic-head">
              <span class="pf-topic-name">{{ cat.title }}</span>
              <span class="pf-topic-meta">
                {{ cat.completedLessons }}/{{ cat.totalLessons }} · {{ cat.xp.toLocaleString() }} XP
              </span>
            </div>
            <div class="pf-bar pf-bar-sm">
              <div class="pf-bar-fill" :style="{ width: cat.completionPercent + '%' }"></div>
            </div>
          </div>
        </section>
      </template>

    </template>
  </div>
  `,

  data() {
    return {
      loading: true,
      view: 'posts',

      userId: null,
      username: '',

      social: { following: 0, followers: 0, likes: 0 },
      posts: [],

      overall: null,
      categories: [],
    };
  },

  computed: {
    initial() {
      return (this.username || '?').trim().charAt(0).toUpperCase() || '?';
    },
    // Level/rank/bar all derived from total XP — see the note at the top.
    level() {
      const xp = this.overall ? this.overall.totalXP : 0;
      return window.getLevelProgress(xp);
    },
    rankClass() {
      return this.level.rankClass;
    },
    nextRank() {
      return window.getNextRank(this.level.level);
    },
  },

  async mounted() {
    // progress.js resolves this once it knows whether to read localStorage or
    // Supabase. Reading the getters before it settles reports zeros.
    await window.progressReady;
    this.refreshProgress();

    // XP earned elsewhere in the app should show up here without a reload.
    this._onProgressChanged = () => this.refreshProgress();
    window.addEventListener('cosmoklub-progress-changed', this._onProgressChanged);

    // Settings renames the account; reflect it here without a reload too.
    this._onProfileChanged = (event) => {
      if (event.detail && event.detail.username) this.username = event.detail.username;
    };
    window.addEventListener('cosmoklub-profile-changed', this._onProfileChanged);

    await this.loadAccount();
    await Promise.all([this.loadSocial(), this.loadPosts()]);

    this.loading = false;
  },

  beforeUnmount() {
    if (this._onProgressChanged) {
      window.removeEventListener('cosmoklub-progress-changed', this._onProgressChanged);
    }
    if (this._onProfileChanged) {
      window.removeEventListener('cosmoklub-profile-changed', this._onProfileChanged);
    }
  },

  methods: {
    // The sidebar owns navigation now; app.js exposes setTab so a tab can
    // hand over to another one without holding a reference to the root.
    openSettings() {
      if (window.CosmoKlub && typeof window.CosmoKlub.setTab === 'function') {
        window.CosmoKlub.setTab('settings');
      }
    },

    refreshProgress() {
      const overall = window.getOverallProgress();
      this.overall = overall;

      // getAllCategoryStats() keys off ids; COURSE_DATA carries the readable
      // titles the Library tab shows, so the two screens agree on naming.
      this.categories = overall.categories.map(cat => ({
        ...cat,
        title:
          (typeof COURSE_DATA !== 'undefined' && COURSE_DATA[cat.id] && COURSE_DATA[cat.id].title) ||
          cat.id,
      }));
    },

    async loadAccount() {
      try {
        const client = window.supabaseClient || (window.supabaseReady ? await window.supabaseReady : null);
        if (!client) return;

        const { data: sessionData } = await client.auth.getSession();
        const user = sessionData && sessionData.session && sessionData.session.user;
        if (!user) return;

        this.userId = user.id;

        const { data, error } = await client
          .from('profiles')
          .select('username')
          .eq('uid', user.id)
          .single();

        if (error) {
          console.warn('[CosmoKlub] Could not load the profile row.', error);
        }

        this.username =
          (data && data.username) ||
          (user.user_metadata && user.user_metadata.username) ||
          (user.email || '').split('@')[0];
      } catch (error) {
        console.warn('[CosmoKlub] Could not load the account details.', error);
      }
    },

    // ---- Placeholders --------------------------------------------------
    // Both return empty until the forum has a real schema. See the note at
    // the top of this file; the template already handles populated data, so
    // only these two bodies need replacing.

    async loadSocial() {
      // Followers and following have no tables yet — that is a separate
      // feature. Likes are real: every like on everything this person wrote.
      const likes = await window.ForumAPI.likeCountForUser(this.userId);
      this.social = { following: 0, followers: 0, likes };
    },

    async loadPosts() {
      if (!this.userId) return;

      const res = await window.ForumAPI.threadsByUser(this.userId, { limit: 50 });
      if (!res.ok) return;

      this.posts = res.threads.map(row => ({
        id: row.id,
        title: row.title,
        body: row.body,
        category: row.category,
        solved: !!row.solved,
        time: window.ForumAPI.timeAgo(row.created_at),
        replies: row.reply_count || 0,
        likes: row.like_count || 0,
      }));
    },
  },
};
