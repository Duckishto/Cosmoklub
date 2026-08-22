// CosmoKlub — Settings tab.
//
// Opens from the gear in the dashboard top bar. A normal tab underneath
// (?tab=settings) so it shares the app's routing and Back behaviour.
//
// Laid out the way most apps do it: a list of sections on the left, the
// selected one on the right, and signing out kept apart from the rest so it
// can't be hit while reading through settings.
//
//   Account   — picture, display name, email
//   Security  — which sign-in methods are attached to this account
//   Log out   — confirm, then go
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
  <div class="settings-tab">

    <div v-if="loading" class="set-loading">
      <span class="spinner"></span> Loading your account…
    </div>

    <template v-else>
      <div class="set-shell">

        <!-- ─────────── Section list ─────────── -->
        <aside class="set-nav">
          <button
            class="set-nav-item"
            :class="{ 'is-active': section === 'account' }"
            @click="section = 'account'"
          >
            <span class="set-nav-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
            <span class="set-nav-text"><strong>Account</strong><em>Picture, name, email</em></span>
          </button>

          <button
            class="set-nav-item"
            :class="{ 'is-active': section === 'security' }"
            @click="section = 'security'"
          >
            <span class="set-nav-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></span>
            <span class="set-nav-text"><strong>Security</strong><em>Sign-in methods</em></span>
          </button>

          <button class="set-nav-item set-nav-danger" @click="section = 'logout'"
                  :class="{ 'is-active': section === 'logout' }">
            <span class="set-nav-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></span>
            <span class="set-nav-text"><strong>Log out</strong><em>Sign out of this device</em></span>
          </button>
        </aside>

        <!-- ─────────── Panel ─────────── -->
        <section class="set-panel">

          <!-- ============ Account ============ -->
          <template v-if="section === 'account'">
            <h3 class="set-panel-title">Account</h3>

            <div class="set-identity">
              <span class="set-avatar" :class="{ 'has-img': !!avatarUrl }">
                <img v-if="avatarUrl" :src="avatarUrl" :alt="username" referrerpolicy="no-referrer" />
                <template v-else>{{ initial }}</template>
                <span class="set-avatar-busy" v-if="avatarBusy"></span>
              </span>

              <div class="set-identity-body">
                <div class="set-identity-name">{{ username }}</div>
                <div class="set-identity-mail">{{ email || '—' }}</div>

                <!-- Uploading needs the avatars storage bucket, which is not
                     created yet (supabase/schema-storage.sql). Shown as
                     pending rather than hidden, so the feature reads as
                     planned instead of missing. onAvatarPicked() and the rest
                     below still work — drop the disabled attribute once the
                     bucket exists. -->
                <div class="set-avatar-actions">
                  <button class="set-btn-ghost set-btn-sm is-soon" type="button" disabled>
                    Upload photo
                    <span class="set-soon-tag">Coming soon</span>
                  </button>

                  <button
                    v-if="avatarUrl"
                    class="set-btn-danger-ghost set-btn-sm"
                    :disabled="avatarBusy"
                    @click="removeAvatar()"
                  >Remove</button>
                </div>

                <p class="set-avatar-note" v-if="avatarError">
                  <span class="set-msg-error">{{ avatarError }}</span>
                </p>
                <p class="set-avatar-note" v-else-if="avatarOk">
                  <span class="set-msg-ok">{{ avatarOk }}</span>
                </p>
                <p class="set-avatar-note" v-else>
                  No picture just shows your initial.
                </p>
              </div>
            </div>

            <label class="set-label" for="set-name">Display name</label>
            <div class="set-row">
              <input
                id="set-name"
                class="set-input"
                type="text"
                v-model="nameInput"
                :maxlength="nameMax"
                :disabled="saving"
                @keyup.enter="saveName()"
                placeholder="Your name"
              />
              <button class="set-btn-primary" :disabled="saving || !nameChanged" @click="saveName()">
                {{ saving ? 'Saving…' : 'Save' }}
              </button>
            </div>

            <div v-if="saveError" class="set-msg set-msg-error">{{ saveError }}</div>
            <div v-else-if="saveOk" class="set-msg set-msg-ok">Name updated.</div>
            <div v-else class="set-hint">{{ nameMin }}–{{ nameMax }} characters. Everyone sees this name.</div>

            <label class="set-label set-label-spaced">Email</label>
            <div class="set-readonly">{{ email || '—' }}</div>
            <div class="set-hint">Your email can't be changed here yet.</div>
          </template>

          <!-- ============ Security ============ -->
          <template v-else-if="section === 'security'">
            <h3 class="set-panel-title">Security</h3>
            <p class="set-panel-sub">Ways you can sign in to this account. Keep at least one.</p>

            <div class="set-provider" v-for="p in providerRows" :key="p.id">
              <span class="set-provider-ic" v-html="p.icon"></span>
              <div class="set-provider-body">
                <div class="set-provider-name">
                  {{ p.label }}
                  <span class="set-badge" v-if="p.connected">Connected</span>
                </div>
                <div class="set-provider-hint">{{ p.connected ? p.email || p.hint : p.hint }}</div>
              </div>

              <!-- Google is not configured in Supabase yet, so Connect would
                   only ever fail. Shown as pending instead of offering an
                   action that cannot work. -->
              <span v-if="!p.connected && !p.available" class="set-provider-soon">Coming soon</span>

              <button
                v-else-if="!p.connected"
                class="set-btn-ghost"
                :disabled="linking"
                @click="link(p.id)"
              >{{ linking ? 'Opening…' : 'Connect' }}</button>

              <button
                v-else-if="canUnlink"
                class="set-btn-danger-ghost"
                :disabled="linking"
                @click="unlink(p.id)"
              >Disconnect</button>

              <span v-else class="set-provider-locked">Only method</span>
            </div>

            <div v-if="linkError" class="set-msg set-msg-error">{{ linkError }}</div>
            <div v-else-if="linkOk" class="set-msg set-msg-ok">{{ linkOk }}</div>

            <div class="set-divider"></div>

            <h4 class="set-sub-title">Password</h4>
            <p class="set-hint" style="margin-top:0;">
              We'll email you a link to set a new one.
            </p>
            <button class="set-btn-ghost" :disabled="resetting || !email" @click="sendPasswordReset()">
              {{ resetting ? 'Sending…' : 'Send reset link' }}
            </button>
            <div v-if="resetMsg" class="set-msg" :class="resetOk ? 'set-msg-ok' : 'set-msg-error'">{{ resetMsg }}</div>
          </template>

          <!-- ============ Log out ============ -->
          <template v-else>
            <h3 class="set-panel-title">Log out</h3>
            <p class="set-panel-sub">
              You'll be signed out on this device and sent back to the landing page.
              Your progress stays on your account.
            </p>
            <button class="set-btn-danger" :disabled="signingOut" @click="signOut()">
              {{ signingOut ? 'Signing out…' : 'Log out' }}
            </button>
          </template>

        </section>
      </div>
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
    await this.loadAccount();
    this.loading = false;
  },

  methods: {
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
