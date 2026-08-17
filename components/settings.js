// CosmoKlub — Settings tab.
//
// Opens from the gear in the dashboard top bar. A normal tab underneath
// (?tab=settings) so it shares the app's routing and Back behaviour.
//
// This is the account-facing half of what used to be one Profile page: the
// display name and signing out. Profile kept the public-facing half (posts,
// progression, follower counts), which is what other people would see.

const SETTINGS_NAME_MIN = 3;
const SETTINGS_NAME_MAX = 24;

const Settings = {
  name: 'Settings',

  template: `
  <div class="profile-tab settings-tab">

    <div v-if="loading" class="profile-loading">
      <span class="spinner"></span> Loading your account…
    </div>

    <template v-else>
      <section class="profile-card">
        <h3 class="profile-card-title">Account</h3>

        <div class="settings-readonly">
          <span class="settings-readonly-label">Signed in as</span>
          <span class="settings-readonly-value">{{ email || '—' }}</span>
        </div>

        <label class="profile-field-label" for="settings-name">Display name</label>
        <div class="profile-name-row">
          <input
            id="settings-name"
            class="profile-input"
            type="text"
            v-model="nameInput"
            :maxlength="nameMax"
            :disabled="saving"
            @keyup.enter="saveName()"
            placeholder="Your name"
          />
          <button
            class="profile-save-btn"
            :disabled="saving || !nameChanged"
            @click="saveName()"
          >{{ saving ? 'Saving…' : 'Save' }}</button>
        </div>

        <div v-if="saveError" class="profile-msg profile-msg-error">{{ saveError }}</div>
        <div v-else-if="saveOk" class="profile-msg profile-msg-ok">Name updated.</div>
        <div v-else class="profile-hint">
          {{ nameMin }}–{{ nameMax }} characters. Everyone sees this name.
        </div>
      </section>

      <section class="profile-card">
        <h3 class="profile-card-title">Session</h3>
        <p class="profile-hint" style="margin-top:0;">
          Signing out returns you to the landing page. Your progress stays on your account.
        </p>
        <div class="profile-signout-row">
          <button class="profile-signout-btn" :disabled="signingOut" @click="signOut()">
            {{ signingOut ? 'Signing out…' : 'Sign out' }}
          </button>
        </div>
      </section>
    </template>
  </div>
  `,

  data() {
    return {
      loading: true,
      userId: null,
      email: '',
      username: '',

      nameInput: '',
      nameMin: SETTINGS_NAME_MIN,
      nameMax: SETTINGS_NAME_MAX,
      saving: false,
      saveError: '',
      saveOk: false,

      signingOut: false,
    };
  },

  computed: {
    nameChanged() {
      const next = this.nameInput.trim();
      return next.length > 0 && next !== this.username;
    },
  },

  async mounted() {
    await this.loadAccount();
    this.loading = false;
  },

  methods: {
    async loadAccount() {
      try {
        const client = window.supabaseClient || (window.supabaseReady ? await window.supabaseReady : null);
        if (!client) return;

        const { data: sessionData } = await client.auth.getSession();
        const user = sessionData && sessionData.session && sessionData.session.user;
        if (!user) return;

        this.userId = user.id;
        this.email = user.email || '';

        const { data, error } = await client
          .from('profiles')
          .select('username')
          .eq('uid', user.id)
          .single();

        if (error) {
          console.warn('[CosmoKlub] Could not load the profile row.', error);
        }

        // Fall through the metadata captured at sign-up, then the email local
        // part, so the field is never blank.
        this.username =
          (data && data.username) ||
          (user.user_metadata && user.user_metadata.username) ||
          (user.email || '').split('@')[0];

        this.nameInput = this.username;
      } catch (error) {
        console.warn('[CosmoKlub] Could not load the account details.', error);
      }
    },

    async saveName() {
      const next = this.nameInput.trim();

      this.saveError = '';
      this.saveOk = false;

      if (next.length < SETTINGS_NAME_MIN) {
        this.saveError = `Name must be at least ${SETTINGS_NAME_MIN} characters.`;
        return;
      }
      if (next.length > SETTINGS_NAME_MAX) {
        this.saveError = `Name must be ${SETTINGS_NAME_MAX} characters or fewer.`;
        return;
      }
      if (next === this.username) return;

      this.saving = true;

      try {
        const client = window.supabaseClient || (window.supabaseReady ? await window.supabaseReady : null);
        if (!client || !this.userId) {
          this.saveError = "Can't reach the server right now. Try again in a moment.";
          this.saving = false;
          return;
        }

        const { error } = await client
          .from('profiles')
          .update({ username: next })
          .eq('uid', this.userId);

        if (error) {
          // profiles.username is UNIQUE (supabase/schema.sql) — Postgres raises
          // 23505 on a collision. Say what actually went wrong rather than
          // dumping the raw constraint error on the user.
          this.saveError =
            error.code === '23505'
              ? 'That name is already taken. Try another one.'
              : error.message || 'Could not save your name.';
          this.saving = false;
          return;
        }

        this.username = next;
        this.nameInput = next;
        this.saveOk = true;

        // Profile renders this name too — let it pick the change up without a
        // reload, the same way it already listens for XP changes.
        window.dispatchEvent(
          new CustomEvent('cosmoklub-profile-changed', { detail: { username: next } })
        );
      } catch (error) {
        this.saveError = error.message || 'Could not save your name.';
      }

      this.saving = false;
    },

    async signOut() {
      this.signingOut = true;
      try {
        const client = window.supabaseClient || (window.supabaseReady ? await window.supabaseReady : null);
        if (client) await client.auth.signOut();
      } catch (error) {
        console.warn('[CosmoKlub] Sign-out failed.', error);
      }
      // replace() so Back doesn't land on a dashboard the guard will just
      // bounce away from again.
      window.location.replace('index.html');
    },
  },
};
