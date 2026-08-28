// Chat tab: private one-to-one messages, laid out as a two-pane messenger —
// conversation list permanently on the left, open thread on the right.
//
// Everything here is real. The three mock conversations this file used to
// carry are gone; the list, the messages and the send button all go through
// assets/js/lib/dm-api.js, backed by supabase/schema-social.sql. If those
// tables have not been created the tab shows the setup message the API
// returns rather than looking broken.
//
// Privacy is the database's job, not this file's. dm_threads, dm_members and
// dm_messages each carry a select policy of "are you in this room?", so a
// request for someone else's conversation comes back empty however it was
// made — there is no filter here that could be removed to see more.
//
// Two ways in:
//   • the conversation list, for rooms that already exist
//   • the Chat button on somebody's profile, which routes through
//     window.CosmoKlub.openChatWith() in app.js and lands in
//     consumePendingChat() below. dm_open() creates the room if this is the
//     first time the two of you have spoken.
//
// Deliberately NO call buttons. The reference layout has phone and video
// icons in the thread header, but neither is implemented and a button that
// does nothing is worse than no button. The header carries identity only.
//
// Styles are injected below rather than living in dashboard.css: every class
// is prefixed .dm- and used nowhere else, so keeping them with the markup
// means the whole feature is one file. The outer element keeps the class
// .chat-container because dashboard-shell.css sizes it to the visible area.
const Chat = {
  name: 'Chat',

  template: `
    <div class="section chat-wrap">
      <div class="chat-inner">
        <div class="section-eyebrow-row">
          <span class="section-label">Direct Messages</span>
          <div class="section-rule"></div>
          <button type="button" class="section-link dm-new-link" @click="openPicker">New message</button>
        </div>

        <p class="dm-error" v-if="loadError">{{ loadError }}</p>

        <!-- dm-showing-thread only matters below 760px, where the two panes
             become one and this decides which of them is on screen. -->
        <div class="chat-container dm" :class="{ 'dm-showing-thread': !!selected }">

          <!-- ─────────── Conversation list ─────────── -->
          <aside class="dm-list">
            <div class="dm-list-head">
              <h3 class="dm-list-title">Chats</h3>
              <button class="dm-icon-btn" type="button" @click="openPicker" aria-label="New message" title="New message">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </div>

            <div class="dm-search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="search" v-model="query" placeholder="Search messages" aria-label="Search messages" />
            </div>

            <div class="dm-convos">
              <p class="dm-no-results" v-if="loading">Loading conversations…</p>

              <template v-else>
                <button
                  class="dm-convo"
                  v-for="conv in filteredConversations"
                  :key="conv.id"
                  :class="{ 'is-active': selectedId === conv.id }"
                  @click="openChat(conv)"
                >
                  <span class="dm-av" :style="avatarStyle(conv)">
                    <template v-if="!conv.avatarUrl">{{ conv.initial }}</template>
                  </span>
                  <span class="dm-convo-text">
                    <span class="dm-convo-name">{{ conv.name }}</span>
                    <span class="dm-convo-preview">{{ preview(conv) }}</span>
                  </span>
                  <span class="dm-convo-side">
                    <span class="dm-convo-time">{{ time(conv.lastAt) }}</span>
                    <span class="dm-unread" v-if="conv.unread">{{ conv.unread > 99 ? '99+' : conv.unread }}</span>
                  </span>
                </button>

                <p class="dm-no-results" v-if="!filteredConversations.length && query.trim()">
                  No conversations match “{{ query }}”.
                </p>

                <p class="dm-no-results" v-else-if="!conversations.length">
                  No conversations yet. Press <strong>New message</strong>, or open
                  someone's profile from the Forum and press Chat.
                </p>
              </template>
            </div>
          </aside>

          <!-- ─────────── Open thread ─────────── -->
          <section class="dm-thread" v-if="selected">
            <header class="dm-thread-head">
              <!-- Only reachable on a phone; on a desktop the list never left. -->
              <button class="dm-back" type="button" @click="closeChat" aria-label="Back to conversations">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>

              <!-- The whole identity block opens their profile, the same as a
                   name in the Forum does. -->
              <button type="button" class="dm-thread-who" @click="openProfile(selected.otherId)"
                      :aria-label="'View ' + selected.name + '\\u2019s profile'">
                <span class="dm-av dm-av-lg" :style="avatarStyle(selected)">
                  <template v-if="!selected.avatarUrl">{{ selected.initial }}</template>
                </span>
                <span class="dm-thread-id">
                  <span class="dm-thread-name">{{ selected.name }}</span>
                  <span class="dm-thread-status">View profile</span>
                </span>
              </button>
            </header>

            <div class="dm-messages" ref="chatMessages">
              <p class="dm-no-results" v-if="messagesLoading">Loading messages…</p>

              <p class="dm-thread-hint" v-else-if="!messages.length">
                This is the start of your conversation with {{ selected.name }}.
              </p>

              <!-- The avatar repeats beside incoming messages, as in a real
                   messenger. Outgoing ones don't need it — there is only ever
                   one of you in the thread. -->
              <div
                v-for="msg in messages"
                :key="msg.id"
                class="dm-row"
                :class="msg.mine ? 'dm-out' : 'dm-in'"
              >
                <span class="dm-av dm-av-sm" v-if="!msg.mine" :style="avatarStyle(selected)">
                  <template v-if="!selected.avatarUrl">{{ selected.initial }}</template>
                </span>
                <div class="dm-bubble" :title="fullTime(msg.createdAt)">{{ msg.body }}</div>
              </div>
            </div>

            <div class="dm-compose">
              <input
                type="text"
                v-model="newMessage"
                @keyup.enter="sendMessage"
                class="dm-compose-input"
                placeholder="Message"
                maxlength="4000"
                aria-label="Message"
              />
              <button class="dm-send" type="button" @click="sendMessage"
                      :disabled="!newMessage.trim() || sending" aria-label="Send">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
          </section>

          <!-- Desktop only: the right pane is always there, so it needs
               something to say before a conversation is picked. -->
          <section class="dm-thread dm-thread-empty" v-else>
            <span class="dm-empty-ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </span>
            <p class="dm-empty-title">{{ opening ? 'Opening conversation…' : 'Your messages' }}</p>
            <p class="dm-empty-sub">Pick a conversation on the left to start reading.</p>
          </section>

        </div>
      </div>

      <!-- ─────────── New message: who to ─────────── -->
      <div class="dm-picker-back" v-if="pickerOpen" @click.self="closePicker">
        <div class="dm-picker">
          <div class="dm-picker-head">
            <h3 class="dm-picker-title">New message</h3>
            <button class="dm-picker-x" type="button" @click="closePicker" aria-label="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div class="dm-search dm-picker-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input ref="pickerInput" type="search" v-model="pickerQuery"
                   placeholder="Search by username" aria-label="Search people" />
          </div>

          <div class="dm-picker-results">
            <p class="dm-no-results" v-if="pickerLoading">Searching…</p>

            <template v-else>
              <button
                class="dm-person"
                v-for="person in pickerResults"
                :key="person.id"
                @click="startChatWith(person.id)"
              >
                <span class="dm-av" :style="avatarStyle(person)">
                  <template v-if="!person.avatarUrl">{{ person.initial }}</template>
                </span>
                <span class="dm-convo-text">
                  <span class="dm-convo-name">{{ person.name }}</span>
                  <span class="dm-convo-preview" v-if="person.username">&#64;{{ person.username }}</span>
                </span>
              </button>

              <p class="dm-no-results" v-if="!pickerResults.length && pickerQuery.trim()">
                Nobody found for “{{ pickerQuery }}”.
              </p>
              <p class="dm-no-results" v-else-if="!pickerQuery.trim()">
                Start typing a username.
              </p>
            </template>
          </div>
        </div>
      </div>
    </div>
  `,

  data() {
    return {
      me: null,

      loading: true,
      loadError: '',

      conversations: [],

      // The open room is held by id, not by object reference: the list is
      // replaced wholesale on every refresh and a stored object would go
      // stale the moment a message arrived.
      selectedId: null,

      messages: [],
      messagesLoading: false,

      newMessage: '',
      sending: false,
      opening: false,

      query: '',

      // "New message" people picker.
      pickerOpen: false,
      pickerQuery: '',
      pickerResults: [],
      pickerLoading: false,
    };
  },

  computed: {
    selected() {
      return this.conversations.find(c => c.id === this.selectedId) || null;
    },

    // Matches the name and the last message, so searching for a topic finds
    // the thread it was discussed in, not just the person.
    filteredConversations() {
      const needle = this.query.trim().toLowerCase();
      if (!needle) return this.conversations;

      return this.conversations.filter(c =>
        (c.name + ' ' + (c.lastMessage || '')).toLowerCase().includes(needle)
      );
    },
  },

  watch: {
    // Debounced so a fast typist doesn't fire a query per keystroke.
    pickerQuery() {
      clearTimeout(this._pickerTimer);
      this._pickerTimer = setTimeout(() => this.searchPeople(), 220);
    },
  },

  async mounted() {
    this.me = await window.DMAPI.currentUser();

    await this.refreshConversations();
    this.loading = false;

    // The Chat button on a profile fires before this component exists when
    // the tab wasn't already open, so app.js leaves the request on
    // window.CosmoKlub for a fresh mount to pick up — and broadcasts it for
    // an already-mounted one. Both paths land here.
    this.consumePendingChat();

    this._onOpenChat = (event) => {
      const userId = event && event.detail && event.detail.userId;
      if (userId) {
        window.CosmoKlub.pendingChatUser = null;
        this.startChatWith(userId);
      }
    };
    window.addEventListener('cosmoklub-open-chat', this._onOpenChat);

    // Realtime delivers the other person's messages without a refresh.
    this._realtime = await window.DMAPI.subscribe((msg) => this.onIncoming(msg));

    // …and a slow poll covers the case where dm_messages was never added to
    // the supabase_realtime publication, so the tab degrades to a few
    // seconds' delay rather than to nothing at all.
    this._poll = setInterval(() => {
      this.refreshConversations({ quiet: true });
      if (this.selectedId) this.loadMessages({ quiet: true });
    }, 10000);
  },

  beforeUnmount() {
    if (this._onOpenChat) window.removeEventListener('cosmoklub-open-chat', this._onOpenChat);
    if (this._poll) clearInterval(this._poll);
    if (this._pickerTimer) clearTimeout(this._pickerTimer);
    if (this._realtime && typeof this._realtime.stop === 'function') this._realtime.stop();
  },

  methods: {
    // ---- Loading ---------------------------------------------------------

    // `quiet` is for the poll and for refreshes that happen underneath an
    // open thread: the list updates without the spinner flashing over it.
    async refreshConversations({ quiet = false } = {}) {
      const res = await window.DMAPI.listConversations();

      if (!res.ok) {
        if (!quiet) this.loadError = res.error || 'Could not load your messages.';
        return;
      }

      this.loadError = '';
      this.conversations = res.conversations;
    },

    async loadMessages({ quiet = false } = {}) {
      if (!this.selectedId) return;

      const threadId = this.selectedId;
      if (!quiet) this.messagesLoading = true;

      const res = await window.DMAPI.listMessages(threadId);

      // The room may have been switched while this was in flight.
      if (this.selectedId !== threadId) return;

      if (!quiet) this.messagesLoading = false;

      if (!res.ok) {
        this.loadError = res.error || 'Could not load that conversation.';
        return;
      }

      const wasAtBottom = this.isAtBottom();
      const grew = res.messages.length !== this.messages.length;
      this.messages = res.messages;

      // Don't yank someone out of the history they were scrolled back to.
      if (grew && wasAtBottom) this.$nextTick(() => this.scrollToBottom());
    },

    // ---- Opening a room --------------------------------------------------

    async openChat(conv) {
      this.selectedId = conv.id;
      this.newMessage = '';
      this.messages = [];

      await this.loadMessages();
      this.$nextTick(() => this.scrollToBottom());

      if (conv.unread) {
        conv.unread = 0;
        window.DMAPI.markRead(conv.id);
      }
    },

    closeChat() {
      this.selectedId = null;
      this.messages = [];
    },

    consumePendingChat() {
      const pending = window.CosmoKlub && window.CosmoKlub.pendingChatUser;
      if (!pending) return;

      window.CosmoKlub.pendingChatUser = null;
      this.startChatWith(pending);
    },

    // dm_open() returns the existing room or makes one, so pressing Chat on
    // the same person twice lands in the same conversation rather than
    // creating a second empty one.
    async startChatWith(userId) {
      if (!userId || this.opening) return;

      this.closePicker();
      this.opening = true;

      const res = await window.DMAPI.openWith(userId);

      if (!res.ok) {
        this.opening = false;
        this.loadError = res.error || 'Could not open that conversation.';
        return;
      }

      await this.refreshConversations();
      this.opening = false;

      const conv = this.conversations.find(c => c.id === res.threadId);

      if (!conv) {
        this.loadError = 'The conversation was created but could not be loaded. Try reloading.';
        return;
      }

      await this.openChat(conv);
    },

    // ---- Sending ---------------------------------------------------------

    async sendMessage() {
      const body = this.newMessage.trim();
      if (!body || this.sending || !this.selectedId) return;

      const threadId = this.selectedId;
      this.sending = true;
      this.newMessage = '';

      const res = await window.DMAPI.sendMessage(threadId, body);
      this.sending = false;

      if (!res.ok) {
        this.newMessage = body;          // hand it back rather than losing it
        this.loadError = res.error || 'That message did not send.';
        return;
      }

      this.loadError = '';

      // Realtime echoes your own insert back, so guard against showing it
      // twice — whichever arrives first wins and the other is ignored.
      if (this.selectedId === threadId && !this.messages.some(m => m.id === res.message.id)) {
        this.messages.push(res.message);
        this.$nextTick(() => this.scrollToBottom());
      }

      this.refreshConversations({ quiet: true });
    },

    // ---- Realtime --------------------------------------------------------

    onIncoming(msg) {
      if (this.selectedId === msg.threadId) {
        if (!this.messages.some(m => m.id === msg.id)) {
          const wasAtBottom = this.isAtBottom();
          this.messages.push(msg);
          if (wasAtBottom) this.$nextTick(() => this.scrollToBottom());
        }

        // Reading it as it arrives is what stops the badge appearing on a
        // conversation that is open on screen.
        if (!msg.mine) window.DMAPI.markRead(this.selectedId);
      }

      // The preview and the ordering in the list are now out of date whether
      // or not the room was the open one.
      this.refreshConversations({ quiet: true });
    },

    // ---- People picker ---------------------------------------------------

    openPicker() {
      this.pickerOpen = true;
      this.pickerQuery = '';
      this.pickerResults = [];

      this.$nextTick(() => {
        if (this.$refs.pickerInput) this.$refs.pickerInput.focus();
      });
    },

    closePicker() {
      this.pickerOpen = false;
    },

    async searchPeople() {
      const q = this.pickerQuery.trim();

      if (!q) {
        this.pickerResults = [];
        this.pickerLoading = false;
        return;
      }

      this.pickerLoading = true;
      const res = await window.SocialAPI.searchPeople(q);

      // A later keystroke may have already replaced this search.
      if (this.pickerQuery.trim() !== q) return;

      this.pickerLoading = false;
      this.pickerResults = res.people || [];
    },

    // ---- Presentation ----------------------------------------------------

    openProfile(userId) {
      if (window.CosmoKlub && typeof window.CosmoKlub.openProfile === 'function') {
        window.CosmoKlub.openProfile(userId);
      }
    },

    // Inline so it beats the gradient .dm-av paints; without a picture the
    // class wins and the initial shows through.
    avatarStyle(who) {
      if (!who || !who.avatarUrl) return {};
      return {
        backgroundImage: `url("${who.avatarUrl}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    },

    // "You: …" on your own last message, the way every messenger marks it.
    preview(conv) {
      if (!conv.lastMessage) return 'No messages yet';
      const mine = this.me && conv.lastSenderId === this.me.id;
      return mine ? `You: ${conv.lastMessage}` : conv.lastMessage;
    },

    time(iso) {
      return window.DMAPI.shortTime(iso);
    },

    fullTime(iso) {
      if (!iso) return '';
      return new Date(iso).toLocaleString();
    },

    // ---- Scrolling -------------------------------------------------------

    // Within 60px of the bottom counts as "following the conversation".
    isAtBottom() {
      const el = this.$refs.chatMessages;
      if (!el) return true;
      return el.scrollHeight - el.scrollTop - el.clientHeight < 60;
    },

    scrollToBottom() {
      const container = this.$refs.chatMessages;
      if (container) container.scrollTop = container.scrollHeight;
    },
  },
};

(function injectChatStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('ck-chat-styles')) return;

  const style = document.createElement('style');
  style.id = 'ck-chat-styles';
  style.textContent = `
    /* ---------- Fitting the viewport ----------
       dashboard-shell.css gives .chat-container the whole visible height:
       100dvh minus the header and .content's padding. But the eyebrow row
       (35px + 12px margin) sits ABOVE it and .section adds 24px below, so
       the tab was 71px taller than the space it had on every device — the
       composer sat just under the fold.

       Measuring from the parent instead of from the viewport fixes it at
       every size at once: .chat-wrap fills .content, the eyebrow row takes
       what it needs, and the panes take the remainder. min-height:0 on each
       level is what actually lets the inner scrollers shrink; without it a
       flex item refuses to go below its content size and the overflow just
       moves down a level. */
    .section.chat-wrap {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
      margin-bottom: 0;
    }
    .chat-wrap > .chat-inner {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      min-height: 0;
    }
    .chat-wrap > .chat-inner > .section-eyebrow-row { flex-shrink: 0; }

    /* Two panes: a fixed-width list, the thread taking the rest. */
    /* The floor lives on this selector, not on .dm — .chat-container.dm is
       two classes and would otherwise beat a .dm min-height and win at 0.
       A positive min-height here is the floor AND still lets the inner
       scrollers work, because each of those carries its own min-height:0. */
    .chat-container.dm {
      height: auto;
      flex: 1 1 auto;
      min-height: 320px;
    }

    .dm {
      /* Matches the Calculator, so the two tabs line up on a wide monitor
         instead of the chat stretching to 2000px. */
      max-width: 1180px;
      width: 100%;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 300px minmax(0, 1fr);
      gap: 0;
      overflow: hidden;
      background: rgba(10, 8, 24, 0.5);
      border: 1px solid var(--border);
      border-radius: 16px;
    }

    /* ---------- List ---------- */
    .dm-list {
      display: flex;
      flex-direction: column;
      min-height: 0;
      border-right: 1px solid var(--border);
      background: rgba(8, 6, 20, 0.45);
    }

    .dm-list-head {
      display: flex; align-items: center; gap: 10px;
      padding: 14px 14px 10px;
      flex-shrink: 0;
    }
    .dm-list-title {
      margin: 0; flex: 1;
      font-size: 0.98rem; font-weight: 800; letter-spacing: -0.01em;
      color: #f5f3ff;
    }
    .dm-icon-btn {
      width: 32px; height: 32px; flex-shrink: 0;
      display: grid; place-items: center;
      background: rgba(124,58,237,0.14);
      border: 1px solid rgba(124,58,237,0.28);
      border-radius: 9px;
      color: #d9d2f0; cursor: pointer;
      transition: background .18s, color .18s;
    }
    .dm-icon-btn svg { width: 16px; height: 16px; }
    .dm-icon-btn:hover { background: rgba(124,58,237,0.28); color: #fff; }

    .dm-search {
      position: relative; display: flex; align-items: center;
      margin: 0 12px 10px; flex-shrink: 0;
    }
    .dm-search svg {
      position: absolute; left: 11px;
      width: 15px; height: 15px; color: #8b7aa8; pointer-events: none;
    }
    .dm-search input {
      width: 100%; box-sizing: border-box; height: 34px;
      padding: 0 12px 0 33px;
      background: rgba(9,7,20,0.7);
      border: 1px solid var(--border); border-radius: 999px;
      color: #f5f3ff; font-family: inherit; font-size: 0.84rem; outline: none;
    }
    .dm-search input::placeholder { color: #8b7aa8; }
    .dm-search input:focus { border-color: rgba(168,85,247,0.55); }
    .dm-search input::-webkit-search-cancel-button { display: none; }

    .dm-convos {
      flex: 1; min-height: 0; overflow-y: auto;
      padding: 0 8px 10px;
      scrollbar-width: thin; scrollbar-color: var(--border) transparent;
    }
    .dm-convos::-webkit-scrollbar { width: 4px; }
    .dm-convos::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

    .dm-convo {
      width: 100%; display: flex; align-items: center; gap: 10px;
      padding: 8px 9px; margin-bottom: 2px;
      background: none; border: none; border-radius: 12px;
      font-family: inherit; text-align: left; cursor: pointer;
      transition: background .16s;
    }
    .dm-convo:hover { background: rgba(255,255,255,0.05); }
    /* The pill fill marks the open thread — the same cue the reference uses. */
    .dm-convo.is-active { background: linear-gradient(100deg, rgba(124,58,237,0.55), rgba(168,85,247,0.34)); }

    .dm-convo-text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
    .dm-convo-name {
      font-size: 0.82rem; font-weight: 700; color: #f5f3ff;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .dm-convo-preview {
      font-size: 0.72rem; color: #9d90bb;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .dm-convo.is-active .dm-convo-preview { color: rgba(255,255,255,0.75); }
    .dm-convo-time { flex-shrink: 0; font-size: 0.68rem; color: #7d719c; }
    .dm-convo.is-active .dm-convo-time { color: rgba(255,255,255,0.7); }

    .dm-no-results { padding: 22px 12px; font-size: 0.8rem; color: #8b7aa8; text-align: center; }

    /* ---------- Avatars ---------- */
    /* The whole component was a notch large: at 42px avatars and 0.86rem
       bubbles a three-message thread filled half an iPad. Everything below is
       one step down, which fits more conversation on screen and reads closer
       to a real messenger. */
    .dm-av {
      flex-shrink: 0;
      width: 36px; height: 36px; border-radius: 50%;
      display: grid; place-items: center;
      color: #fff; font-size: 0.82rem; font-weight: 800;
    }
    .dm-av-lg { width: 34px; height: 34px; font-size: 0.8rem; }
    .dm-av-sm { width: 24px; height: 24px; font-size: 0.64rem; }

    /* ---------- Thread ---------- */
    .dm-thread { display: flex; flex-direction: column; min-height: 0; min-width: 0; }

    .dm-thread-head {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 16px; flex-shrink: 0;
      border-bottom: 1px solid var(--border);
    }
    .dm-thread-id { display: flex; flex-direction: column; min-width: 0; }
    .dm-thread-name {
      font-size: 0.88rem; font-weight: 700; color: #f5f3ff;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .dm-thread-status { font-size: 0.7rem; color: #4ade80; }

    /* Hidden until the panes collapse — on a desktop there is nothing to go
       back to, because the list never went away. */
    .dm-back {
      display: none;
      width: 32px; height: 32px; flex-shrink: 0;
      place-items: center;
      background: none; border: none; border-radius: 8px;
      color: #b8a9d9; cursor: pointer;
    }
    .dm-back svg { width: 18px; height: 18px; }
    .dm-back:hover { background: rgba(255,255,255,0.06); color: #fff; }

    .dm-messages {
      flex: 1; min-height: 0; overflow-y: auto;
      display: flex; flex-direction: column; gap: 8px;
      padding: 16px 18px;
      scrollbar-width: thin; scrollbar-color: var(--border) transparent;
    }
    /* A short conversation used to sit at the top of a tall pane with a wall
       of empty space under it, which is what made the tab look unfinished.
       Chats grow upward from the composer, so the first message is pushed
       down by an auto margin.

       Deliberately NOT justify-content:flex-end — that positions overflowing
       content above the scrollport's top edge and the oldest messages become
       unreachable. An auto margin collapses to nothing once the thread is
       long enough to scroll, so it stays correct either way. */
    .dm-messages > .dm-row:first-child { margin-top: auto; }
    .dm-messages::-webkit-scrollbar { width: 4px; }
    .dm-messages::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

    /* 78% alone is fine on a phone and far too wide on a monitor — a line
       of 200 characters is unreadable. ch caps it by text length, which is
       what actually matters, and the % still governs narrow screens. */
    .dm-row {
      display: flex; align-items: flex-end; gap: 8px;
      max-width: min(78%, 62ch);
    }
    .dm-in { align-self: flex-start; }
    .dm-out { align-self: flex-end; }

    .dm-bubble {
      padding: 8px 13px;
      font-size: 0.82rem; line-height: 1.45;
      border-radius: 16px;
      word-break: break-word;
    }
    .dm-in .dm-bubble {
      background: rgba(255,255,255,0.07);
      border: 1px solid var(--border);
      color: #ece8f8;
      border-bottom-left-radius: 5px;
    }
    .dm-out .dm-bubble {
      background: linear-gradient(135deg, #7c3aed, #a855f7);
      color: #fff;
      border-bottom-right-radius: 5px;
    }

    .dm-compose {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 14px calc(10px + var(--safe-bot, 0px));
      flex-shrink: 0;
      border-top: 1px solid var(--border);
    }
    .dm-compose-input {
      flex: 1; min-width: 0; height: 38px;
      padding: 0 15px;
      background: rgba(9,7,20,0.7);
      border: 1px solid var(--border); border-radius: 999px;
      color: #f5f3ff; font-family: inherit; font-size: 0.86rem; outline: none;
    }
    .dm-compose-input::placeholder { color: #8b7aa8; }
    .dm-compose-input:focus { border-color: rgba(168,85,247,0.55); }

    .dm-send {
      width: 38px; height: 38px; flex-shrink: 0;
      display: grid; place-items: center;
      background: linear-gradient(135deg, #7c3aed, #a855f7);
      border: none; border-radius: 50%;
      color: #fff; cursor: pointer;
      transition: filter .16s, opacity .16s;
    }
    .dm-send svg { width: 17px; height: 17px; margin-right: 1px; }
    .dm-send:hover:not(:disabled) { filter: brightness(1.1); }
    .dm-send:disabled { opacity: 0.4; cursor: not-allowed; }

    /* ---------- Nothing open ---------- */
    .dm-thread-empty { align-items: center; justify-content: center; text-align: center; padding: 30px; }
    .dm-empty-ic {
      width: 52px; height: 52px; display: grid; place-items: center;
      border-radius: 14px;
      background: rgba(255,255,255,0.04); border: 1px solid var(--border);
      color: #8b7aa8; margin-bottom: 14px;
    }
    .dm-empty-ic svg { width: 24px; height: 24px; }
    .dm-empty-title { margin: 0; font-size: 1rem; font-weight: 700; color: #f5f3ff; }
    .dm-empty-sub { margin: 6px 0 0; font-size: 0.82rem; color: #8b7aa8; }

    /* ---------- One pane at a time ---------- */
    @media (max-width: 760px) {
      /* Both panes occupy the same cell; whichever is showing wins. Grid
         rather than display:none so the thread keeps its scroll position. */
      .dm { grid-template-columns: 1fr; }
      .dm-list, .dm-thread { grid-area: 1 / 1; }
      .dm-list { border-right: none; }

      .dm-thread { display: none; }
      .dm-showing-thread .dm-list { display: none; }
      .dm-showing-thread .dm-thread { display: flex; }

      /* With no list beside it, the thread needs its own way back. */
      .dm-back { display: grid; }

      /* The placeholder pane only makes sense when both are visible. */
      .dm-thread-empty { display: none !important; }

      .dm-row { max-width: 86%; }
    }

    /* ---------- Narrow phones (down to 320px) ---------- */
    @media (max-width: 380px) {
      .dm-list-head { padding: 12px 12px 10px; }
      .dm-search { margin: 0 10px 8px; }
      .dm-convos { padding: 0 6px 8px; }
      .dm-convo { gap: 9px; padding: 9px 8px; }
      .dm-av { width: 38px; height: 38px; font-size: 0.85rem; }

      /* The timestamp is the first thing to go: the name and the preview are
         what identify a conversation, and at 320px all three don't fit. */
      .dm-convo-time { display: none; }

      .dm-thread-head { padding: 10px 12px; gap: 9px; }
      .dm-messages { padding: 14px 12px; gap: 8px; }
      .dm-compose { padding: 10px 10px calc(10px + var(--safe-bot, 0px)); }
      .dm-compose-input { height: 38px; padding: 0 13px; }
      .dm-send { width: 38px; height: 38px; }
      .dm-row { max-width: 92%; }
    }

    /* ---------- Short viewports: landscape phones, split view ----------
       Keyed on height, not width, because a 740x360 landscape phone is
       "wide" by every width query yet has less vertical room than any
       portrait one. Chrome is trimmed so the messages keep some room. */
    @media (max-height: 520px) {
      .chat-container.dm { min-height: 240px; }
      .dm-list-head { padding: 10px 14px 8px; }
      .dm-list-title { font-size: 1rem; }
      .dm-search { margin: 0 12px 8px; }
      .dm-search input { height: 32px; }
      .dm-convo { padding: 8px 10px; }
      .dm-av { width: 34px; height: 34px; font-size: 0.8rem; }
      .dm-thread-head { padding: 8px 14px; }
      .dm-av-lg { width: 32px; height: 32px; }
      .dm-messages { padding: 12px 14px; gap: 7px; }
      .dm-compose { padding: 9px 12px calc(9px + var(--safe-bot, 0px)); }
      .dm-compose-input, .dm-send { height: 36px; }
      .dm-send { width: 36px; }
    }

    /* Very short AND wide — a landscape phone. Keeping both panes would
       leave the thread about 200px across, so it still collapses to one
       even though the width query wouldn't have caught it. */
    @media (max-height: 430px) and (max-width: 940px) {
      /* A landscape phone has ~200px to give. Trimmed chrome fits a usable
         thread in it, so let the pane shrink rather than forcing the page
         to scroll on top of an already-short screen. */
      .chat-container.dm { min-height: 190px; }
      .dm { grid-template-columns: 1fr; }
      .dm-list, .dm-thread { grid-area: 1 / 1; }
      .dm-list { border-right: none; }
      .dm-thread { display: none; }
      .dm-showing-thread .dm-list { display: none; }
      .dm-showing-thread .dm-thread { display: flex; }
      .dm-back { display: grid; }
      .dm-thread-empty { display: none !important; }
    }

    /* ---------- Tablet portrait ----------
       Two panes still fit, but 300px of list out of 768 is a third of the
       screen. Narrowing it gives the conversation the room. */
    @media (min-width: 761px) and (max-width: 1000px) {
      .dm { grid-template-columns: 250px minmax(0, 1fr); }
      .dm-av { width: 38px; height: 38px; font-size: 0.86rem; }
    }
    /* ---------- Added with the real data layer ----------
       Everything below arrived when the mock conversations were replaced by
       supabase/schema-social.sql: an unread count, a people picker for
       starting a new conversation, a place to show what the API said when a
       call fails, and a thread header that is now a link to a profile. */

    /* "New message" in the eyebrow row is a button now, not a label. */
    .dm-new-link {
      background: none;
      border: none;
      font: inherit;
      color: inherit;
      cursor: pointer;
      padding: 0;
    }
    .dm-new-link:hover { color: #d9c9ff; text-decoration: underline; }

    .dm-error {
      margin: 0 0 10px;
      padding: 9px 12px;
      flex-shrink: 0;
      background: rgba(248, 113, 133, 0.1);
      border: 1px solid rgba(248, 113, 133, 0.32);
      border-radius: 10px;
      color: #fb7185;
      font-size: 0.78rem;
    }

    /* Time and unread badge stack on the right of a conversation row. */
    .dm-convo-side {
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
    }

    .dm-unread {
      min-width: 18px;
      height: 18px;
      padding: 0 5px;
      box-sizing: border-box;
      display: grid;
      place-items: center;
      border-radius: 999px;
      background: linear-gradient(135deg, #7c3aed, #a855f7);
      color: #fff;
      font-size: 0.64rem;
      font-weight: 800;
    }
    /* On the open row the pill fill is already violet, so the badge needs to
       separate itself from it rather than blend in. */
    .dm-convo.is-active .dm-unread { background: #fff; color: #4c1d95; }

    /* The identity block in the thread header opens their profile. */
    .dm-thread-who {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
      padding: 0;
      background: none;
      border: none;
      font: inherit;
      text-align: left;
      cursor: pointer;
    }
    .dm-thread-who:hover .dm-thread-name { color: #fff; text-decoration: underline; }
    .dm-thread-who:hover .dm-thread-status { color: #c4b5fd; }
    /* Not a status any more — it says "View profile", so the green of an
       online indicator would be misleading. */
    .dm-thread-status { color: #9d90bb; }

    .dm-thread-hint {
      margin: auto auto 8px;
      padding: 0 12px;
      font-size: 0.76rem;
      color: #8b7aa8;
      text-align: center;
    }

    /* Avatars can carry a real picture now, set inline from avatar_url. */
    .dm-av { background: linear-gradient(140deg, #c084fc, #7c3aed); overflow: hidden; }

    /* ---------- People picker ---------- */
    .dm-picker-back {
      position: fixed;
      inset: 0;
      z-index: 60;
      display: grid;
      place-items: center;
      padding: 20px;
      background: rgba(4, 2, 12, 0.72);
      backdrop-filter: blur(3px);
    }

    .dm-picker {
      width: min(420px, 100%);
      max-height: min(70vh, 560px);
      display: flex;
      flex-direction: column;
      background: rgba(14, 11, 30, 0.98);
      border: 1px solid var(--border);
      border-radius: 16px;
      overflow: hidden;
    }

    .dm-picker-head {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 14px 10px;
      flex-shrink: 0;
    }
    .dm-picker-title {
      margin: 0;
      flex: 1;
      font-size: 0.98rem;
      font-weight: 800;
      color: #f5f3ff;
    }
    .dm-picker-x {
      width: 30px;
      height: 30px;
      display: grid;
      place-items: center;
      background: none;
      border: none;
      border-radius: 8px;
      color: #b8a9d9;
      cursor: pointer;
    }
    .dm-picker-x svg { width: 16px; height: 16px; }
    .dm-picker-x:hover { background: rgba(255,255,255,0.06); color: #fff; }

    .dm-picker-search { margin: 0 14px 10px; }

    .dm-picker-results {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      padding: 0 8px 10px;
      scrollbar-width: thin;
      scrollbar-color: var(--border) transparent;
    }
    .dm-picker-results::-webkit-scrollbar { width: 4px; }
    .dm-picker-results::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

    /* Same row as a conversation, minus the timestamp. */
    .dm-person {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 9px;
      margin-bottom: 2px;
      background: none;
      border: none;
      border-radius: 12px;
      font-family: inherit;
      text-align: left;
      cursor: pointer;
      transition: background .16s;
    }
    .dm-person:hover { background: rgba(255,255,255,0.05); }

  `;
  document.head.appendChild(style);
})();
