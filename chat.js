// Chat tab: direct-message conversation list + open chat window.
// Owns its own conversations data so this feature can be developed independently.
const Chat = {
  name: 'Chat',
  template: `
    <div>
      <div class="section">
        <div class="section-eyebrow-row">
          <span class="section-label">Direct Messages</span>
          <div class="section-rule"></div>
          <span class="section-link">New message</span>
        </div>
        <div class="chat-container">
          <!-- Conversation list (if no chat open) -->
          <div v-if="!selectedChat" class="conversation-list">
            <div class="conversation-item" v-for="conv in conversations" :key="conv.id" @click="openChat(conv)">
              <div class="conversation-avatar" :style="{background: conv.color}">{{ conv.initial }}</div>
              <div class="conversation-info">
                <div class="conversation-name">{{ conv.name }}</div>
                <div class="conversation-preview">{{ conv.lastMessage }}</div>
              </div>
              <div class="conversation-time">{{ conv.time }}</div>
            </div>
          </div>

          <!-- Chat window (when a conversation is selected) -->
          <div v-else class="chat-window">
            <div class="chat-header">
              <button class="chat-back" @click="selectedChat = null">←</button>
              <div class="conversation-avatar" :style="{background: selectedChat.color, width: '36px', height: '36px', fontSize: '0.9rem'}">{{ selectedChat.initial }}</div>
              <div><strong>{{ selectedChat.name }}</strong><br><span style="font-size:0.7rem; color:var(--muted)">Online</span></div>
            </div>
            <div class="chat-messages" ref="chatMessages">
              <div v-for="(msg, idx) in selectedChat.messages" :key="idx" :class="['message', msg.sender === 'me' ? 'message-outgoing' : 'message-incoming']">
                {{ msg.text }}
              </div>
            </div>
            <div class="chat-input-area">
              <input type="text" v-model="newMessage" @keyup.enter="sendMessage" class="chat-input" placeholder="Type a message...">
              <button class="chat-send" @click="sendMessage">Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      selectedChat: null,
      newMessage: '',
      conversations: [
        { id: 1, name: "NebulaNoor", initial: "N", color: "#a855f7", lastMessage: "Great image! Try taking flats next time.", time: "5m ago", messages: [{ sender: "them", text: "Hey! Loved your Orion Nebula shot." }, { sender: "me", text: "Thanks! Still learning flat frames." }, { sender: "them", text: "Great image! Try taking flats next time." }] },
        { id: 2, name: "GalileoJr", initial: "G", color: "#7c3aed", lastMessage: "Yes, 6\" Dob is fine for Saturn", time: "1h ago", messages: [{ sender: "them", text: "Is a 6\" Dobsonian enough for Saturn's rings?" }, { sender: "me", text: "Yes, 6\" Dob is fine for Saturn. At 150x you'll see the rings clearly!" }] },
        { id: 3, name: "StarDustMei", initial: "M", color: "#5b21b6", lastMessage: "Thanks for the magnitude explanation!", time: "3h ago", messages: [{ sender: "them", text: "Thanks for the magnitude explanation!" }, { sender: "me", text: "You're welcome! Negative magnitudes are brighter." }] }
      ]
    };
  },
  methods: {
    openChat(conv) {
      this.selectedChat = { ...conv, messages: conv.messages || [] };
      this.newMessage = '';
      this.$nextTick(() => { this.scrollToBottom(); });
    },
    sendMessage() {
      if (!this.newMessage.trim()) return;
      this.selectedChat.messages.push({ sender: "me", text: this.newMessage });
      this.newMessage = '';
      this.$nextTick(() => { this.scrollToBottom(); });
      // Simulate reply after 1 second (optional)
      setTimeout(() => {
        if (this.selectedChat) {
          this.selectedChat.messages.push({ sender: "them", text: "Thanks for your message! (auto-reply)" });
          this.$nextTick(() => { this.scrollToBottom(); });
        }
      }, 1000);
    },
    scrollToBottom() {
      const container = this.$refs.chatMessages;
      if (container) container.scrollTop = container.scrollHeight;
    }
  }
};
