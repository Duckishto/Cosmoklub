// Chat tab: direct messages, laid out as a two-pane messenger — conversation
// list permanently on the left, open thread on the right.
//
// This replaced a single-pane version that swapped the list out for the thread
// and needed a back button to return. On a desktop that wasted most of the
// width and hid the other conversations; the list is always visible now, and
// the panes only collapse to one on a phone, where there genuinely isn't room.
//
// Deliberately NO call buttons. The reference layout has phone and video icons
// in the thread header, but neither is implemented and a button that does
// nothing is worse than no button. The header carries identity only.
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
          <span class="section-link">New message</span>
        </div>

        <!-- dm-showing-thread only matters below 760px, where the two panes
             become one and this decides which of them is on screen. -->
        <div class="chat-container dm" :class="{ 'dm-showing-thread': !!selectedChat }">

          <!-- ─────────── Conversation list ─────────── -->
          <aside class="dm-list">
            <div class="dm-list-head">
              <h3 class="dm-list-title">Chats</h3>
              <button class="dm-icon-btn" type="button" aria-label="New message" title="New message">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </div>

            <div class="dm-search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="search" v-model="query" placeholder="Search messages" aria-label="Search messages" />
            </div>

            <div class="dm-convos">
              <button
                class="dm-convo"
                v-for="conv in filteredConversations"
                :key="conv.id"
                :class="{ 'is-active': selectedChat && selectedChat.id === conv.id }"
                @click="openChat(conv)"
              >
                <span class="dm-av" :style="{ background: conv.color }">{{ conv.initial }}</span>
                <span class="dm-convo-text">
                  <span class="dm-convo-name">{{ conv.name }}</span>
                  <span class="dm-convo-preview">{{ conv.lastMessage }}</span>
                </span>
                <span class="dm-convo-time">{{ conv.time }}</span>
              </button>

              <p class="dm-no-results" v-if="!filteredConversations.length">
                No conversations match “{{ query }}”.
              </p>
            </div>
          </aside>

          <!-- ─────────── Open thread ─────────── -->
          <section class="dm-thread" v-if="selectedChat">
            <header class="dm-thread-head">
              <!-- Only reachable on a phone; on a desktop the list never left. -->
              <button class="dm-back" type="button" @click="selectedChat = null" aria-label="Back to conversations">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <span class="dm-av dm-av-lg" :style="{ background: selectedChat.color }">{{ selectedChat.initial }}</span>
              <span class="dm-thread-id">
                <span class="dm-thread-name">{{ selectedChat.name }}</span>
                <span class="dm-thread-status">Online</span>
              </span>
            </header>

            <div class="dm-messages" ref="chatMessages">
              <!-- The avatar repeats beside incoming messages, as in a real
                   messenger. Outgoing ones don't need it — there is only ever
                   one of you in the thread. -->
              <div
                v-for="(msg, idx) in selectedChat.messages"
                :key="idx"
                class="dm-row"
                :class="msg.sender === 'me' ? 'dm-out' : 'dm-in'"
              >
                <span class="dm-av dm-av-sm" v-if="msg.sender !== 'me'" :style="{ background: selectedChat.color }">{{ selectedChat.initial }}</span>
                <div class="dm-bubble">{{ msg.text }}</div>
              </div>
            </div>

            <div class="dm-compose">
              <input
                type="text"
                v-model="newMessage"
                @keyup.enter="sendMessage"
                class="dm-compose-input"
                placeholder="Message"
                aria-label="Message"
              />
              <button class="dm-send" type="button" @click="sendMessage" :disabled="!newMessage.trim()" aria-label="Send">
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
            <p class="dm-empty-title">Your messages</p>
            <p class="dm-empty-sub">Pick a conversation on the left to start reading.</p>
          </section>

        </div>
      </div>
    </div>
  `,
  data() {
    return {
      selectedChat: null,
      newMessage: '',
      query: '',
      conversations: [
        { id: 1, name: "NebulaNoor", initial: "N", color: "#a855f7", lastMessage: "Great image! Try taking flats next time.", time: "5m", messages: [{ sender: "them", text: "Hey! Loved your Orion Nebula shot." }, { sender: "me", text: "Thanks! Still learning flat frames." }, { sender: "them", text: "Great image! Try taking flats next time." }] },
        { id: 2, name: "GalileoJr", initial: "G", color: "#7c3aed", lastMessage: "Yes, 6\" Dob is fine for Saturn", time: "1h", messages: [{ sender: "them", text: "Is a 6\" Dobsonian enough for Saturn's rings?" }, { sender: "me", text: "Yes, 6\" Dob is fine for Saturn. At 150x you'll see the rings clearly!" }] },
        { id: 3, name: "StarDustMei", initial: "M", color: "#5b21b6", lastMessage: "Thanks for the magnitude explanation!", time: "3h", messages: [{ sender: "them", text: "Thanks for the magnitude explanation!" }, { sender: "me", text: "You're welcome! Negative magnitudes are brighter." }] }
      ]
    };
  },
  computed: {
    // Matches the name and the last message, so searching for a topic finds
    // the thread it was discussed in, not just the person.
    filteredConversations() {
      const needle = this.query.trim().toLowerCase();
      if (!needle) return this.conversations;
      return this.conversations.filter(c =>
        (c.name + ' ' + c.lastMessage).toLowerCase().includes(needle)
      );
    }
  },
  methods: {
    openChat(conv) {
      // Keep the original object rather than a copy: a copy meant messages
      // sent in the thread never made it back to the list preview.
      this.selectedChat = conv;
      this.newMessage = '';
      this.$nextTick(() => { this.scrollToBottom(); });
    },
    sendMessage() {
      if (!this.newMessage.trim()) return;
      const text = this.newMessage.trim();
      this.selectedChat.messages.push({ sender: "me", text });
      this.selectedChat.lastMessage = text;
      this.selectedChat.time = 'now';
      this.newMessage = '';
      this.$nextTick(() => { this.scrollToBottom(); });
    },
    scrollToBottom() {
      const container = this.$refs.chatMessages;
      if (container) container.scrollTop = container.scrollHeight;
    }
  }
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
  `;
  document.head.appendChild(style);
})();
