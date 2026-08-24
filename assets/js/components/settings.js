// CosmoKlub — Settings tab.
//
// Opens from the ACCOUNT group in the dashboard sidebar, or from the gear
// in the header. A normal tab underneath (?tab=settings) so it shares the
// app's routing and Back behaviour.
//
// The page's own section list used to be a second sidebar on the left,
// which now duplicates the app sidebar sitting right beside it. It's a
// segmented switcher across the top instead, on the shared .ck-seg
// primitive. Signing out is still its own section rather than a button
// among the others, so it can't be hit while reading through settings.
//
//   Account   — picture, display name, email
//   Security  — which sign-in methods are attached to this account
//   Log out   — confirm, then go
//
// Built from the shared page primitives in dashboard-shell.css
// (.pg-head, .ck-card, .ck-input, .ck-btn…). Anything page-specific is
// prefixed .st- and lives in assets/css/settings.css.
//
// Provider linking uses supabase-js's identity API (getUserIdentities,
// linkIdentity, unlinkIdentity). Linking needs "Allow manual linking" turned
// on in Supabase → Authentication → Sign In / Providers; the UI says so
// plainly when the call comes back refused rather than failing silently.
//
// Avatars come from whatever the provider gave us (Google supplies one) via
// profiles.avatar_url — see supabase/schema-auth.sql. Accounts without a
// picture fall back to the first letter of the name.

const SETTINGS_NAME_MIN = 3;
const SETTINGS_NAME_MAX = 24;

// `available` is whether the provider is actually switched on in Supabase.
// Google is not yet, so it renders as "Coming soon" rather than a Connect
// button that would fail. Flip it to true once the provider is configured —
// link()/unlink() below already work.
const SETTINGS_PROVIDERS = {
  email: {
    available: true,
    label: 'Email and password',
    hint: 'Sign in with your email address.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>',
  },
  google: {
    available: false,
    label: 'Google',
    hint: 'Not available yet — sign in with your email for now.',
    icon: '<svg viewBox="0 0 24 24"><path fill="#4285F4" d="M21.6 12.2c0-.6-.1-1.3-.2-1.9H12v3.6h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.2z"/><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.7-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z"/><path fill="#FBBC05" d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1a10 10 0 0 0 0 9.2L6.4 14z"/><path fill="#EA4335" d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 3.1 7.4L6.4 10c.8-2.4 3-4.1 5.6-4.1z"/></svg>',
  },
};

const Settings = {
  name: 'Settings',

  template: `
  <div class="settings-tab pg">

    <div v-if="loading" class="ck-loading-row">
      <span class="ck-spinner"></span> Loading your account…
    </div>

    <template v-else>

      <!-- No page header here: the shell's top bar already shows "Settings",
           so a title and subtitle underneath it just said the same thing
           twice. The section switcher below is the first thing on the page. -->

      <!-- ─────────────── Section switcher ─────────────── -->
      <div class="ck-seg st-seg">
        <button type="button" class="ck-seg-btn" :class="{ 'is-active': section === 'account' }"
                @click="section = 'account'">Account</button>
        <button type="button" class="ck-seg-btn" :class="{ 'is-active': section === 'security' }"
                @click="section = 'security'">Security</button>
        <button type="button" class="ck-seg-btn st-seg-danger" :class="{ 'is-active': section === 'logout' }"
                @click="section = 'logout'">Log out</button>
      </div>

      <!-- ============ Account ============ -->
      <template v-if="section === 'account'">

        <section class="ck-card">
          <div class="ck-card-head">
            <h3 class="ck-card-title">Profile picture</h3>
            <p class="ck-card-sub">Shown next to your name across CosmoKlub.</p>
          </div>

          <div class="st-identity">
            <span class="st-avatar" :class="{ 'has-img': !!avatarUrl }">
              <img v-if="avatarUrl" :src="avatarUrl" :alt="username" referrerpolicy="no-referrer" />
              <template v-else>{{ initial }}</template>
              <span class="st-avatar-busy" v-if="avatarBusy"></span>
            </span>

            <div class="st-identity-body">
              <div class="st-identity-name">{{ username }}</div>
              <div class="st-identity-mail">{{ email || 'Not set' }}</div>

              <!-- Uploading needs the avatars storage bucket, which is not
                   created yet (supabase/schema-storage.sql). Shown as
                   pending rather than hidden, so the feature reads as
                   planned instead of missing. onAvatarPicked() and the rest
                   below still work — drop the disabled attribute once the
                   bucket exists. -->
              <div class="st-avatar-actions">
                <button class="ck-btn ck-btn-sm" type="button" disabled>
                  Upload photo
                  <span class="ck-badge ck-badge-muted">Soon</span>
                </button>

                <button
                  v-if="avatarUrl"
                  class="ck-btn ck-btn-sm ck-btn-danger"
                  type="button"
                  :disabled="avatarBusy"
                  @click="removeAvatar()"
                >Remove</button>
              </div>

              <p class="ck-msg ck-msg-error" v-if="avatarError">{{ avatarError }}</p>
              <p class="ck-msg ck-msg-ok" v-else-if="avatarOk">{{ avatarOk }}</p>
              <p class="ck-hint" v-else>No picture just shows your initial.</p>
            </div>
          </div>
        </section>

        <section class="ck-card">
          <div class="ck-card-head">
            <h3 class="ck-card-title">Account details</h3>
            <p class="ck-card-sub">Everyone in the community sees your display name.</p>
          </div>

          <label class="ck-label" for="set-name">Display name</label>
          <div class="ck-field-row">
            <input
              id="set-name"
              class="ck-input"
              type="text"
              v-model="nameInput"
              :maxlength="nameMax"
              :disabled="saving"
              @keyup.enter="saveName()"
              placeholder="Your name"
            />
            <button class="pg-action" :disabled="saving || !nameChanged" @click="saveName()">
              {{ saving ? 'Saving…' : 'Save' }}
            </button>
          </div>

          <div v-if="saveError" class="ck-msg ck-msg-error">{{ saveError }}</div>
          <div v-else-if="saveOk" class="ck-msg ck-msg-ok">Name updated.</div>
          <div v-else class="ck-hint">{{ nameMin }}–{{ nameMax }} characters.</div>

          <label class="ck-label ck-label-spaced">Email</label>
          <div class="ck-readonly">{{ email || 'Not set' }}</div>
          <div class="ck-hint">Your email can't be changed here yet.</div>
        </section>
      </template>

      <!-- ============ Security ============ -->
      <template v-else-if="section === 'security'">

        <section class="ck-card">
          <div class="ck-card-head">
            <h3 class="ck-card-title">Sign-in methods</h3>
            <p class="ck-card-sub">Ways you can get into this account. Keep at least one.</p>
          </div>

          <div class="st-provider" v-for="p in providerRows" :key="p.id">
            <span class="st-provider-ic" v-html="p.icon"></span>

            <div class="st-provider-body">
              <div class="st-provider-name">
                {{ p.label }}
                <span class="ck-badge" v-if="p.connected">Connected</span>
              </div>
              <div class="st-provider-hint">{{ p.connected ? p.email || p.hint : p.hint }}</div>
            </div>

            <!-- Google is not configured in Supabase yet, so Connect would
                 only ever fail. Shown as pending instead of offering an
                 action that cannot work. -->
            <span v-if="!p.connected && !p.available" class="ck-badge ck-badge-muted">Soon</span>

            <button
              v-else-if="!p.connected"
              class="ck-btn ck-btn-sm"
              :disabled="linking"
              @click="link(p.id)"
            >{{ linking ? 'Opening…' : 'Connect' }}</button>

            <button
              v-else-if="canUnlink"
              class="ck-btn ck-btn-sm ck-btn-danger"
              :disabled="linking"
              @click="unlink(p.id)"
            >Disconnect</button>

            <span v-else class="ck-badge ck-badge-muted">Only method</span>
          </div>

          <div v-if="linkError" class="ck-msg ck-msg-error">{{ linkError }}</div>
          <div v-else-if="linkOk" class="ck-msg ck-msg-ok">{{ linkOk }}</div>
        </section>

        <section class="ck-card">
          <div class="ck-card-head">
            <h3 class="ck-card-title">Password</h3>
            <p class="ck-card-sub">We'll email you a link to set a new one.</p>
          </div>

          <button class="ck-btn" :disabled="resetting || !email" @click="sendPasswordReset()">
            {{ resetting ? 'Sending…' : 'Send reset link' }}
          </button>
          <div v-if="resetMsg" class="ck-msg" :class="resetOk ? 'ck-msg-ok' : 'ck-msg-error'">{{ resetMsg }}</div>
        </section>
      </template>

      <!-- ============ Log out ============ -->
      <template v-else>
        <section class="ck-card st-danger-card">
          <div class="ck-card-head">
            <h3 class="ck-card-title">Log out</h3>
            <p class="ck-card-sub">
              You'll be signed out on this device and sent back to the landing page.
              Your progress stays on your account.
            </p>
          </div>

          <button class="ck-btn ck-btn-solid-danger" :disabled="signingOut" @click="signOut()">
            {{ signingOut ? 'Signing out…' : 'Log out' }}
          </button>
        </section>
      </template>

    </template>
  </div>
  `,

  data() {
    return {
      loading: true,
      section: 'account',

      userId: null,
      email: '',
      username: '',
      avatarUrl: '',

      avatarBusy: false,
      avatarError: '',
      avatarOk: '',

      identities: [],

      nameInput: '',
      nameMin: SETTINGS_NAME_MIN,
      nameMax: SETTINGS_NAME_MAX,
      saving: false,
      saveError: '',
      saveOk: false,

      linking: false,
      linkError: '',
      linkOk: '',

      resetting: false,
      resetMsg: '',
      resetOk: false,

      signingOut: false,
    };
  },

  computed: {
    initial() {
      return (this.username || '?').trim().charAt(0).toUpperCase() || '?';
    },

    nameChanged() {
      const next = this.nameInput.trim();
      return next.length > 0 && next !== this.username;
    },

    providerRows() {
      return Object.keys(SETTINGS_PROVIDERS).map(id => {
        const found = this.identities.find(i => i.provider === id);
        return {
          id,
          ...SETTINGS_PROVIDERS[id],
          connected: !!found,
          email: found && found.identity_data ? found.identity_data.email : '',
        };
      });
    },

    // Removing the last way in would lock the account, so the final one can't
    // be disconnected.
    canUnlink() {
      return this.identities.length > 1;
    },

    // The picture Google gave us, if that account is connected. Offered as a
    // one-click alternative to uploading something.
    googlePicture() {
      const google = this.identities.find(i => i.provider === 'google');
      const data = (google && google.identity_data) || {};
      return data.avatar_url || data.picture || '';
    },
  },

  async mounted() {
    // The sidebar's "Log out" item opens this tab already on the log-out
    // section. app.js stashes the request on window.CosmoKlub for a fresh
    // mount and broadcasts it for an already-mounted one, so handle both.
    this.applyPendingSection();

    this._onSectionRequest = (event) => {
      const requested = event && event.detail && event.detail.section;
      if (requested) this.section = requested;
    };
    window.addEventListener('cosmoklub-settings-section', this._onSectionRequest);

    await this.loadAccount();
    this.loading = false;
  },

  beforeUnmount() {
    if (this._onSectionRequest) {
      window.removeEventListener('cosmoklub-settings-section', this._onSectionRequest);
    }
  },

  methods: {
    applyPendingSection() {
      const pending = window.CosmoKlub && window.CosmoKlub.pendingSettingsSection;
      if (!pending) return;

      this.section = pending;
      window.CosmoKlub.pendingSettingsSection = null;
    },

    async client() {
      return window.supabaseClient || (window.supabaseReady ? await window.supabaseReady : null);
    },

    async loadAccount() {
      try {
        const client = await this.client();
        if (!client) return;

        const { data: sessionData } = await client.auth.getSession();
        const user = sessionData && sessionData.session && sessionData.session.user;
        if (!user) return;

        this.userId = user.id;
        this.email = user.email || '';

        const meta = user.user_metadata || {};

        const { data: row, error } = await client
          .from('profiles')
          .select('username, avatar_url')
          .eq('uid', user.id)
          .single();

        if (error) console.warn('[CosmoKlub] Could not load the profile row.', error);

        this.username =
          (row && row.username) ||
          meta.username ||
          (user.email || '').split('@')[0];

        this.avatarUrl = (row && row.avatar_url) || meta.avatar_url || meta.picture || '';
        this.nameInput = this.username;

        await this.loadIdentities();
      } catch (error) {
        console.warn('[CosmoKlub] Could not load the account details.', error);
      }
    },

    async loadIdentities() {
      try {
        const client = await this.client();
        if (!client || !client.auth.getUserIdentities) return;

        const { data, error } = await client.auth.getUserIdentities();
        if (error) {
          console.warn('[CosmoKlub] Could not read linked identities.', error);
          return;
        }
        this.identities = (data && data.identities) || [];
      } catch (error) {
        console.warn('[CosmoKlub] Identity list unavailable.', error);
      }
    },

    // ---- Profile picture -------------------------------------------------

    // Write the URL (or null) to profiles and tell the rest of the app.
    async setAvatar(url) {
      const client = await this.client();
      if (!client || !this.userId) throw new Error("Can't reach the server right now.");

      const { error } = await client
        .from('profiles')
        .update({ avatar_url: url })
        .eq('uid', this.userId);

      if (error) throw new Error(error.message || 'Could not save the picture.');

      this.avatarUrl = url || '';
      window.dispatchEvent(
        new CustomEvent('cosmoklub-profile-changed', { detail: { avatarUrl: this.avatarUrl } })
      );
    },

    // Shrink and re-encode before uploading. A phone photo is several MB and
    // 4000px wide; the largest this is ever drawn is 66px. Uploading the
    // original would blow the 2 MB bucket limit and waste everyone's data.
    async downscale(file, max = 512) {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
      const w = Math.round(bitmap.width * scale);
      const h = Math.round(bitmap.height * scale);

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);

      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', 0.9));
      bitmap.close && bitmap.close();

      if (!blob) throw new Error('Could not read that image.');
      return blob;
    },

    async onAvatarPicked(event) {
      const file = event.target.files && event.target.files[0];
      // Clear it either way so picking the same file twice fires again.
      event.target.value = '';
      if (!file) return;

      this.avatarError = '';
      this.avatarOk = '';

      if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
        this.avatarError = 'Pick a JPG, PNG or WebP image.';
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        this.avatarError = 'That image is very large — pick one under 8 MB.';
        return;
      }

      this.avatarBusy = true;

      try {
        const client = await this.client();
        if (!client || !this.userId) throw new Error("Can't reach the server right now.");

        const blob = await this.downscale(file);

        // Filed under the owner's uid — the storage policy checks that first
        // path segment against auth.uid(). A fresh name each time so caches
        // and CDNs can't serve the old picture.
        const path = `${this.userId}/${Date.now()}.webp`;

        const { error: uploadError } = await client.storage
          .from('avatars')
          .upload(path, blob, { contentType: 'image/webp', upsert: true });

        if (uploadError) {
          // The bucket only exists once schema-storage.sql has been run.
          throw new Error(
            /bucket|not found/i.test(uploadError.message || '')
              ? 'Picture storage is not set up yet. Run supabase/schema-storage.sql in the Supabase SQL editor.'
              : uploadError.message || 'Upload failed.'
          );
        }

        const { data } = client.storage.from('avatars').getPublicUrl(path);
        await this.setAvatar(data.publicUrl);

        this.avatarOk = 'Picture updated.';
      } catch (error) {
        this.avatarError = error.message || 'Could not update your picture.';
      }

      this.avatarBusy = false;
    },

    async useGooglePicture() {
      this.avatarError = '';
      this.avatarOk = '';
      this.avatarBusy = true;

      try {
        await this.setAvatar(this.googlePicture);
        this.avatarOk = 'Now using your Google picture.';
      } catch (error) {
        this.avatarError = error.message || 'Could not use that picture.';
      }

      this.avatarBusy = false;
    },

    async removeAvatar() {
      this.avatarError = '';
      this.avatarOk = '';
      this.avatarBusy = true;

      try {
        await this.setAvatar(null);
        this.avatarOk = 'Picture removed — showing your initial instead.';
      } catch (error) {
        this.avatarError = error.message || 'Could not remove your picture.';
      }

      this.avatarBusy = false;
    },

    // ---- Account ---------------------------------------------------------

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
        const client = await this.client();
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
          // profiles.username is UNIQUE — Postgres raises 23505 on a clash.
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

        window.dispatchEvent(
          new CustomEvent('cosmoklub-profile-changed', { detail: { username: next } })
        );
      } catch (error) {
        this.saveError = error.message || 'Could not save your name.';
      }

      this.saving = false;
    },

    // ---- Security --------------------------------------------------------

    async link(provider) {
      this.linkError = '';
      this.linkOk = '';
      this.linking = true;

      try {
        const client = await this.client();
        if (!client || !client.auth.linkIdentity) {
          this.linkError = 'This version of the app cannot link accounts.';
          this.linking = false;
          return;
        }

        const { error } = await client.auth.linkIdentity({
          provider,
          options: { redirectTo: window.location.origin + '/dashboard.html?tab=settings' },
        });

        if (error) {
          // Supabase refuses linkIdentity outright while manual linking is
          // off, and the raw message doesn't say where to turn it on.
          this.linkError = /manual linking|not enabled|disabled/i.test(error.message || '')
            ? 'Account linking is turned off for this project. Enable "Allow manual linking" in Supabase → Authentication → Sign In / Providers.'
            : error.message || 'Could not start linking.';
          this.linking = false;
          return;
        }
        // On success the browser leaves for the provider's consent screen.
      } catch (error) {
        this.linkError = error.message || 'Could not start linking.';
        this.linking = false;
      }
    },

    async unlink(provider) {
      this.linkError = '';
      this.linkOk = '';

      const identity = this.identities.find(i => i.provider === provider);
      if (!identity) return;

      if (!this.canUnlink) {
        this.linkError = "That's the only way into this account — connect another method first.";
        return;
      }

      this.linking = true;

      try {
        const client = await this.client();
        const { error } = await client.auth.unlinkIdentity(identity);

        if (error) {
          this.linkError = error.message || 'Could not disconnect that method.';
        } else {
          this.linkOk = `${SETTINGS_PROVIDERS[provider].label} disconnected.`;
          await this.loadIdentities();
        }
      } catch (error) {
        this.linkError = error.message || 'Could not disconnect that method.';
      }

      this.linking = false;
    },

    async sendPasswordReset() {
      this.resetMsg = '';
      this.resetOk = false;
      this.resetting = true;

      try {
        const client = await this.client();
        const { error } = await client.auth.resetPasswordForEmail(this.email, {
          redirectTo: window.location.origin + '/login.html',
        });

        if (error) {
          this.resetMsg = error.message || 'Could not send the reset link.';
        } else {
          this.resetOk = true;
          this.resetMsg = `Sent to ${this.email}. Check your inbox.`;
        }
      } catch (error) {
        this.resetMsg = error.message || 'Could not send the reset link.';
      }

      this.resetting = false;
    },

    // ---- Log out ---------------------------------------------------------

    async signOut() {
      this.signingOut = true;
      try {
        const client = await this.client();
        if (client) await client.auth.signOut();
      } catch (error) {
        console.warn('[CosmoKlub] Sign-out failed.', error);
      }
      window.location.replace('index.html');
    },
  },
};
