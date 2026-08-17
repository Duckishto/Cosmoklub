// CosmoKlub — Profile tab.
//
// The public-facing half of a user: who they are, what they've posted, and how
// far they've got. Account controls (rename, sign out) live in
// components/settings.js behind the gear in the top bar.
//
// Two sub-tabs, Posts and Progression, under a social-style header.
//
// ⚠️ The social numbers are placeholders on purpose. Followers, following and
// likes have no tables in Supabase at all, and components/forum.js is still a
// hardcoded array of 15 threads with no author or ownership. So the counts
// render 0 and Posts shows an empty state. Everything reads through
// loadSocial() / loadPosts() below — swap the bodies of those two methods for
// real queries once the forum schema exists (threads, replies, follows,
// likes) and the rest of this file needs no changes.
//
// The progression numbers, by contrast, are real: progress.js already computes
// levels/ranks and already syncs with Supabase for signed-in users.
//
// One deliberate choice: the headline level and rank come from
// getLevelProgress(totalXP) rather than getOverallProgress().averageLevel.
// Both exist in progress.js, but averageLevel is the mean of the six category
// levels, which would disagree with the XP bar sitting right underneath it.

const Profile = {
  name: 'Profile',

  template: `
  <div class="profile-tab">

    <div v-if="loading" class="profile-loading">
      <span class="spinner"></span> Loading your profile…
    </div>

    <template v-else>

      <!-- ─────────────── Header ─────────────── -->
      <section class="profile-card profile-identity">
        <div class="profile-avatar" :class="rankClass">{{ initial }}</div>
        <div class="profile-identity-body">
          <h2 class="profile-username">{{ username }}</h2>
          <div class="profile-badges">
            <span class="profile-rank-badge" :class="rankClass">{{ level.rank }}</span>
            <span class="profile-level">Level {{ level.level }}</span>
          </div>
        </div>
      </section>

      <!-- ─────────────── Social counts ─────────────── -->
      <section class="profile-card profile-social">
        <div class="profile-social-item">
          <div class="profile-social-value">{{ social.following.toLocaleString() }}</div>
          <div class="profile-social-label">Following</div>
        </div>
        <div class="profile-social-divider"></div>
        <div class="profile-social-item">
          <div class="profile-social-value">{{ social.followers.toLocaleString() }}</div>
          <div class="profile-social-label">Followers</div>
        </div>
        <div class="profile-social-divider"></div>
        <div class="profile-social-item">
          <div class="profile-social-value">{{ social.likes.toLocaleString() }}</div>
          <div class="profile-social-label">Likes</div>
        </div>
      </section>

      <!-- ─────────────── Sub-tabs ─────────────── -->
      <div class="profile-subtabs">
        <button
          class="profile-subtab"
          :class="{active: view === 'posts'}"
          @click="view = 'posts'"
        >Posts</button>
        <button
          class="profile-subtab"
          :class="{active: view === 'progression'}"
          @click="view = 'progression'"
        >Progression</button>
      </div>

      <!-- ─────────────── Posts ─────────────── -->
      <section v-if="view === 'posts'" class="profile-card">
        <div v-if="posts.length" class="profile-post-list">
          <article class="profile-post" v-for="post in posts" :key="post.id">
            <h4 class="profile-post-title">{{ post.title }}</h4>
            <p class="profile-post-body">{{ post.body }}</p>
            <div class="profile-post-meta">
              <span>{{ post.replies }} replies</span>
              <span>{{ post.likes }} likes</span>
            </div>
          </article>
        </div>

        <div v-else class="profile-empty">
          <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <p class="profile-empty-title">No posts yet</p>
          <p class="profile-empty-sub">
            Anything you post in the Forum will show up here once posting goes live.
          </p>
        </div>
      </section>

      <!-- ─────────────── Progression ─────────────── -->
      <template v-else>
        <section class="profile-card">
          <h3 class="profile-card-title">Progress</h3>

          <div class="profile-xp-head">
            <span class="profile-xp-total">{{ level.xp.toLocaleString() }} XP</span>
            <span v-if="level.isMaxLevel" class="profile-xp-next">Max level reached</span>
            <span v-else class="profile-xp-next">
              {{ level.xpForNextLevel.toLocaleString() }} XP to level {{ level.level + 1 }}
            </span>
          </div>

          <div class="profile-xp-bar">
            <div class="profile-xp-fill" :class="rankClass" :style="{ width: level.progress + '%' }"></div>
          </div>

          <div class="profile-next-rank" v-if="nextRank">
            Next rank: <strong>{{ nextRank.name }}</strong> at level {{ nextRank.minLevel }}
          </div>
          <div class="profile-next-rank" v-else>
            You've reached the highest rank.
          </div>

          <div class="profile-stat-row">
            <div class="profile-stat">
              <div class="profile-stat-value">{{ overall.totalCompleted }}</div>
              <div class="profile-stat-label">Lessons done</div>
            </div>
            <div class="profile-stat">
              <div class="profile-stat-value">{{ overall.totalLessons }}</div>
              <div class="profile-stat-label">Lessons total</div>
            </div>
            <div class="profile-stat">
              <div class="profile-stat-value">{{ overall.completionPercent }}%</div>
              <div class="profile-stat-label">Complete</div>
            </div>
          </div>
        </section>

        <section class="profile-card">
          <h3 class="profile-card-title">By topic</h3>
          <div class="profile-category" v-for="cat in categories" :key="cat.id">
            <div class="profile-category-head">
              <span class="profile-category-name">{{ cat.title }}</span>
              <span class="profile-category-meta">
                {{ cat.completedLessons }}/{{ cat.totalLessons }} · {{ cat.xp.toLocaleString() }} XP
              </span>
            </div>
            <div class="profile-cat-bar">
              <div class="profile-cat-fill" :style="{ width: cat.completionPercent + '%' }"></div>
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
      // Real version: count rows in `follows` (both directions) and `likes`
      // for this.userId.
      this.social = { following: 0, followers: 0, likes: 0 };
    },

    async loadPosts() {
      // Real version: select this user's rows from `threads`, newest first,
      // with reply and like counts joined in.
      this.posts = [];
    },
  },
};
