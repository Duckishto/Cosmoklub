// CosmoKlub — Profile tab.
//
// The public-facing half of a user: who they are, what they've posted, how
// far they've got, and who they follow. Account controls (rename, sign out)
// live in components/settings.js, reachable from the ACCOUNT group in the
// sidebar.
//
// Shows EITHER your own profile or somebody else's. Which one is decided by
// the `userId` prop, fed from ?user=<uuid> in app.js — clicking an author's
// name anywhere in the Forum routes through here. No id means yours.
//
// Laid out on the shared page primitives in dashboard-shell.css (.pg-head,
// .ck-card, .ck-seg, .ck-empty): cards, a segmented switcher, empty states.
// Everything page-specific is prefixed .pf- and lives in assets/css/profile.css.
//
// Data sources, and why each one:
//   • your own identity      profiles, via the session
//   • someone else's         public_profiles — the view exists so email and
//                            gender can't leak onto a page meant for other
//                            people; see supabase/schema-progress.sql
//   • posts and likes        lib/forum-api.js (threadsByUser, likeCountForUser)
//   • followers/following    lib/social-api.js, backed by schema-social.sql
//   • your progression       progress.js, which already computes levels/ranks
//   • someone else's XP      the `leaderboard` view — progress.js only ever
//                            knows about the signed-in user, so the headline
//                            rank for a stranger comes from there instead
//
// forum-api.js and social-api.js must both load before this file;
// dashboard.html orders them that way.
//
// One deliberate choice, unchanged from the first version: the headline level
// and rank come from getLevelProgress(totalXP) rather than
// getOverallProgress().averageLevel. Both exist in progress.js, but
// averageLevel is the mean of the six category levels, which would disagree
// with the XP bar sitting right underneath it.

const Profile = {
  name: 'Profile',

  props: {
    // Whose profile to show. null/absent = the signed-in user's own.
    userId: {
      type: String,
      default: null,
    },
  },

  template: `
  <div class="profile-tab pg">

    <div v-if="loading" class="ck-loading-row">
      <span class="ck-spinner"></span>
      <span class="ck-loading-text">{{ isSelf ? 'Loading your profile…' : 'Loading profile…' }}</span>
    </div>

    <template v-else>

      <p v-if="loadError" class="ck-msg ck-msg-error">{{ loadError }}</p>

      <!-- Viewing someone else. The sidebar's Profile entry goes to your own,
           but this is the shorter way back and it keeps the browser's Back
           button meaning what it usually means. -->
      <button v-if="!isSelf" type="button" class="pf-back" @click="openMyProfile">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        Back to your profile
      </button>

      <!-- ─────────────── Identity ─────────────── -->
      <section class="ck-card pf-identity">
        <span class="pf-avatar" :class="rankClass" :style="avatarStyle">
          <template v-if="!avatarUrl">{{ initial }}</template>
        </span>

        <div class="pf-identity-body">
          <h2 class="pf-name">{{ displayName || 'Astronomer' }}</h2>
          <div class="pf-identity-meta">
            <span class="pf-rank" :class="rankClass">{{ level.rank }}</span>
            <span class="ck-badge ck-badge-muted">Level {{ level.level }}</span>
            <span class="pf-handle" v-if="username">&#64;{{ username }}</span>
          </div>

          <!-- Only ever on someone else's page: there is nothing to follow or
               message on your own. -->
          <div class="pf-actions" v-if="!isSelf">
            <button
              type="button"
              class="ck-btn ck-btn-sm pf-follow"
              :class="{ 'is-following': isFollowing }"
              :disabled="followBusy"
              @click="toggleFollow"
            >
              <span v-if="followBusy">Working…</span>
              <span v-else-if="isFollowing">Following</span>
              <span v-else>Follow</span>
            </button>

            <button type="button" class="ck-btn ck-btn-sm" @click="chatWithThem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8A8.5 8.5 0 0 1 21 11.5z"/></svg>
              Chat
            </button>
          </div>
        </div>

        <!-- Buttons, not labels: the counts are the way into the two lists,
             the same as every other social site. -->
        <div class="pf-counts">
          <button type="button" class="pf-count" :class="{ 'is-active': view === 'following' }"
                  @click="view = 'following'">
            <span class="pf-count-value">{{ social.following.toLocaleString() }}</span>
            <span class="pf-count-label">Following</span>
          </button>
          <button type="button" class="pf-count" :class="{ 'is-active': view === 'followers' }"
                  @click="view = 'followers'">
            <span class="pf-count-value">{{ social.followers.toLocaleString() }}</span>
            <span class="pf-count-label">Followers</span>
          </button>
          <div class="pf-count pf-count-static">
            <span class="pf-count-value">{{ social.likes.toLocaleString() }}</span>
            <span class="pf-count-label">Likes</span>
          </div>
        </div>
      </section>

      <!-- ─────────────── Sub-tabs ─────────────── -->
      <div class="ck-seg pf-seg">
        <button type="button" class="ck-seg-btn" :class="{ 'is-active': view === 'posts' }"
                @click="view = 'posts'">Posts</button>
        <button type="button" class="ck-seg-btn" v-if="isSelf" :class="{ 'is-active': view === 'progression' }"
                @click="view = 'progression'">Progression</button>
        <button type="button" class="ck-seg-btn" :class="{ 'is-active': view === 'followers' }"
                @click="view = 'followers'">Followers</button>
        <button type="button" class="ck-seg-btn" :class="{ 'is-active': view === 'following' }"
                @click="view = 'following'">Following</button>
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
          <p class="ck-empty-sub" v-if="isSelf">
            Anything you post in the Forum shows up here.
          </p>
          <p class="ck-empty-sub" v-else>
            {{ displayName }} hasn't posted in the Forum yet.
          </p>
        </div>
      </section>

      <!-- ─────────────── Followers / Following ─────────────── -->
      <section v-else-if="view === 'followers' || view === 'following'" class="ck-card">
        <div class="ck-card-head">
          <h3 class="ck-card-title">{{ view === 'followers' ? 'Followers' : 'Following' }}</h3>
          <p class="ck-card-sub">
            <template v-if="view === 'followers'">
              {{ isSelf ? 'People who follow you.' : 'People who follow ' + displayName + '.' }}
            </template>
            <template v-else>
              {{ isSelf ? 'People you follow.' : 'People ' + displayName + ' follows.' }}
            </template>
          </p>
        </div>

        <div v-if="peopleLoading" class="ck-loading-row">
          <span class="ck-spinner"></span>
          <span class="ck-loading-text">Loading…</span>
        </div>

        <div v-else-if="people.length" class="pf-people">
          <button
            type="button"
            class="pf-person"
            v-for="person in people"
            :key="person.id"
            @click="openProfile(person.id)"
          >
            <span class="pf-person-av" :style="personAvatarStyle(person)">
              <template v-if="!person.avatarUrl">{{ person.initial }}</template>
            </span>
            <span class="pf-person-text">
              <span class="pf-person-name">{{ person.name }}</span>
              <span class="pf-person-handle" v-if="person.username">&#64;{{ person.username }}</span>
            </span>
          </button>
        </div>

        <div v-else class="ck-empty">
          <span class="ck-empty-ic">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.5 3.6-8 8-8s8 3.5 8 8"/></svg>
          </span>
          <p class="ck-empty-title">
            {{ view === 'followers' ? 'No followers yet' : 'Not following anyone yet' }}
          </p>
          <p class="ck-empty-sub" v-if="view === 'following'">
            Open someone's profile from the Forum and press Follow.
          </p>
        </div>
      </section>

      <!-- ─────────────── Progression (your own only) ─────────────── -->
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
      loadError: '',
      view: 'posts',

      // The signed-in person, whoever is being looked at.
      myId: null,

      // The person on screen. Equal to myId when no prop was passed.
      username: '',
      displayName: '',
      avatarUrl: '',

      social: { following: 0, followers: 0, likes: 0 },
      isFollowing: false,
      followBusy: false,

      people: [],
      peopleLoading: false,

      posts: [],

      // Your own progression, from progress.js.
      overall: null,
      categories: [],

      // Somebody else's total XP, from the leaderboard view. progress.js
      // only ever knows about the signed-in user, so this is what gives a
      // stranger's identity card a real rank instead of yours.
      otherXp: 0,
    };
  },

  computed: {
    // The prop is authoritative, but a prop that happens to be your own id
    // (following a link to yourself) should still behave as your own page.
    isSelf() {
      return !this.userId || this.userId === this.myId;
    },

    targetId() {
      return this.userId || this.myId;
    },

    initial() {
      return (this.displayName || '?').trim().charAt(0).toUpperCase() || '?';
    },

    // Inline so it beats the gradient the .pf-avatar class paints. Without a
    // picture the class wins and the initial shows through, which is the
    // original behaviour.
    avatarStyle() {
      if (!this.avatarUrl) return {};
      return {
        backgroundImage: `url("${this.avatarUrl}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    },

    // Level/rank/bar all derived from total XP — see the note at the top.
    level() {
      const xp = this.isSelf
        ? (this.overall ? this.overall.totalXP : 0)
        : this.otherXp;

      return window.getLevelProgress(xp);
    },

    rankClass() {
      return this.level.rankClass;
    },

    nextRank() {
      return window.getNextRank(this.level.level);
    },
  },

  watch: {
    // Clicking a second name while already on a profile changes the prop
    // without remounting the component, so the reload has to be explicit.
    userId() {
      this.view = 'posts';
      this.reload();
    },

    // The lists are fetched lazily: opening a profile shouldn't cost two
    // extra queries for panels nobody looked at.
    view(next) {
      if (next === 'followers' || next === 'following') {
        this.loadPeople(next);
      }
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
      if (this.isSelf && event.detail && event.detail.username) {
        this.username = event.detail.username;
        this.displayName = event.detail.username;
      }
    };
    window.addEventListener('cosmoklub-profile-changed', this._onProfileChanged);

    await this.reload();
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
    // ---- Navigation ------------------------------------------------------

    openSettings() {
      if (window.CosmoKlub && typeof window.CosmoKlub.setTab === 'function') {
        window.CosmoKlub.setTab('settings');
      }
    },

    openProfile(userId) {
      if (window.CosmoKlub && typeof window.CosmoKlub.openProfile === 'function') {
        window.CosmoKlub.openProfile(userId);
      }
    },

    openMyProfile() {
      this.openProfile(null);
    },

    // Hands over to the Chat tab, which opens (or creates) the one-to-one
    // room with this person — see dm_open() in supabase/schema-social.sql.
    chatWithThem() {
      if (window.CosmoKlub && typeof window.CosmoKlub.openChatWith === 'function') {
        window.CosmoKlub.openChatWith(this.targetId);
      }
    },

    // ---- Loading ---------------------------------------------------------

    async reload() {
      this.loading = true;
      this.loadError = '';
      this.people = [];

      await this.loadIdentity();

      if (!this.targetId) {
        this.loading = false;
        return;
      }

      await Promise.all([
        this.loadSocial(),
        this.loadPosts(),
        this.isSelf ? Promise.resolve() : this.loadOtherXp(),
      ]);

      this.loading = false;

      // Deep-linking straight to ?user=… while a list tab is selected.
      if (this.view === 'followers' || this.view === 'following') {
        this.loadPeople(this.view);
      }
    },

    // Two paths on purpose: your own row comes from `profiles` through the
    // session, someone else's from the public_profiles view so their email
    // and gender are never on the wire.
    async loadIdentity() {
      try {
        const client = window.supabaseClient || (window.supabaseReady ? await window.supabaseReady : null);
        if (!client) return;

        const { data: sessionData } = await client.auth.getSession();
        const user = sessionData && sessionData.session && sessionData.session.user;
        if (user) this.myId = user.id;

        if (this.userId && this.userId !== this.myId) {
          const res = await window.SocialAPI.profileFor(this.userId);

          if (!res.ok || !res.profile) {
            this.loadError = res.error || 'That profile could not be found.';
            this.username = '';
            this.displayName = 'Astronomer';
            this.avatarUrl = '';
            return;
          }

          this.username = res.profile.username;
          this.displayName = res.profile.name;
          this.avatarUrl = res.profile.avatarUrl;
          this.isFollowing = await window.SocialAPI.isFollowing(this.userId);
          return;
        }

        if (!user) return;

        const { data, error } = await client
          .from('profiles')
          .select('username, avatar_url')
          .eq('uid', user.id)
          .single();

        if (error) {
          console.warn('[CosmoKlub] Could not load the profile row.', error);
        }

        this.username =
          (data && data.username) ||
          (user.user_metadata && user.user_metadata.username) ||
          (user.email || '').split('@')[0];

        this.displayName = this.username;
        this.avatarUrl = (data && data.avatar_url) || '';
        this.isFollowing = false;
      } catch (error) {
        console.warn('[CosmoKlub] Could not load the account details.', error);
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

    // The leaderboard view already sums user_progress per person, so a
    // stranger's headline XP is one small read rather than a reimplementation
    // of progress.js against someone else's rows.
    async loadOtherXp() {
      try {
        const client = window.supabaseClient || (window.supabaseReady ? await window.supabaseReady : null);
        if (!client) return;

        const { data, error } = await client
          .from('leaderboard')
          .select('total_xp')
          .eq('uid', this.targetId)
          .maybeSingle();

        if (error) {
          console.warn('[CosmoKlub] Could not read that person’s XP.', error);
          return;
        }

        this.otherXp = (data && data.total_xp) || 0;
      } catch (error) {
        console.warn('[CosmoKlub] Could not read that person’s XP.', error);
      }
    },

    async loadSocial() {
      const [counts, likes] = await Promise.all([
        window.SocialAPI.followCounts(this.targetId),
        window.ForumAPI.likeCountForUser(this.targetId),
      ]);

      this.social = { following: counts.following, followers: counts.followers, likes };
    },

    async loadPosts() {
      const res = await window.ForumAPI.threadsByUser(this.targetId, { limit: 50 });
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

    async loadPeople(which) {
      if (!this.targetId) return;

      this.peopleLoading = true;
      this.people = [];

      const res = which === 'followers'
        ? await window.SocialAPI.listFollowers(this.targetId)
        : await window.SocialAPI.listFollowing(this.targetId);

      // The view may have been switched again while this was in flight.
      if (this.view === which) {
        this.people = res.people || [];
      }

      this.peopleLoading = false;
    },

    personAvatarStyle(person) {
      if (!person.avatarUrl) return {};
      return {
        backgroundImage: `url("${person.avatarUrl}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    },

    // ---- Following -------------------------------------------------------

    // Optimistic: the button and the count both move immediately and are put
    // back if the write is refused, so a follow never feels like it lagged.
    async toggleFollow() {
      if (this.followBusy || this.isSelf) return;

      const wasFollowing = this.isFollowing;
      this.followBusy = true;
      this.isFollowing = !wasFollowing;
      this.social.followers += wasFollowing ? -1 : 1;

      const res = wasFollowing
        ? await window.SocialAPI.unfollow(this.targetId)
        : await window.SocialAPI.follow(this.targetId);

      this.followBusy = false;

      if (!res.ok) {
        this.isFollowing = wasFollowing;
        this.social.followers += wasFollowing ? 1 : -1;
        this.loadError = res.error || 'That did not go through.';
        return;
      }

      this.loadError = '';

      // The list on screen is now out of date if it was the followers one.
      if (this.view === 'followers') {
        this.loadPeople('followers');
      }
    },
  },
};
