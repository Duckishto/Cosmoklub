// CosmoKlub — direct messages data layer.
//
// Every Supabase call the Chat tab makes: the conversation list, one room's
// messages, sending, marking read, and the realtime subscription that makes a
// reply appear without a refresh.
//
// Backed by supabase/schema-social.sql — run that in the Supabase SQL editor
// before any of this works. Until then every call resolves to an empty result
// with `ok: false` rather than throwing, like forum-api.js, so the tab shows
// an honest message instead of breaking.
//
// Privacy is enforced in the database, not here. dm_threads, dm_members and
// dm_messages each carry a select policy of "are you in this room?", so a
// request for a thread id you are not a member of comes back empty no matter
// how it was made. Nothing in this file is a security boundary — it is
// convenience on top of one.
//
// Load after lib/supabase-client.js:
//   <script src="assets/js/lib/supabase-client.js"></script>
//   <script src="assets/js/lib/dm-api.js"></script>

window.DMAPI = (function () {
  async function client() {
    return window.supabaseClient || (window.supabaseReady ? await window.supabaseReady : null);
  }

  async function currentUser() {
    const c = await client();
    if (!c) return null;
    const { data } = await c.auth.getSession();
    return (data && data.session && data.session.user) || null;
  }

  function describeError(error) {
    if (!error) return '';
    if (error.code === '42P01' || error.code === 'PGRST202') {
      return 'The messaging tables are missing. Run supabase/schema-social.sql in the Supabase SQL editor.';
    }
    return error.message || 'Something went wrong talking to the server.';
  }

  function fail(error) {
    console.warn('[CosmoKlub] dm-api:', error);
    return { ok: false, error: describeError(error) };
  }

  // ---- Reading ----------------------------------------------------------

  // The whole list in one request, from the dm_overview view: the room, the
  // other person, the last thing said and how much of it is unread. The
  // viewer_id filter is what picks your half of each room — a room has two
  // member rows and the view emits one line per member.
  async function listConversations({ limit = 50 } = {}) {
    const c = await client();
    const me = await currentUser();
    if (!c) return { ok: false, error: 'Not connected.', conversations: [] };
    if (!me) return { ok: false, error: 'Sign in to see your messages.', conversations: [] };

    const { data, error } = await c
      .from('dm_overview')
      .select('*')
      .eq('viewer_id', me.id)
      .order('last_message_at', { ascending: false })
      .limit(limit);

    if (error) return { ...fail(error), conversations: [] };

    return {
      ok: true,
      me: me.id,
      conversations: (data || []).map(shapeConversation),
    };
  }

  function shapeConversation(row) {
    const name = row.other_username || 'Astronomer';
    return {
      id: row.thread_id,
      otherId: row.other_id,
      name,
      initial: name.trim().charAt(0).toUpperCase() || '?',
      avatarUrl: row.other_avatar_url || '',
      lastMessage: row.last_body || '',
      lastSenderId: row.last_sender_id || null,
      lastAt: row.last_created_at || row.last_message_at,
      unread: Number(row.unread_count) || 0,
    };
  }

  // Oldest first — that is the order they are rendered in, and it means the
  // newest is simply the last element rather than a reversal on every poll.
  async function listMessages(threadId, { limit = 200 } = {}) {
    const c = await client();
    const me = await currentUser();
    if (!c || !me) return { ok: false, error: 'Not connected.', messages: [] };

    const { data, error } = await c
      .from('dm_messages')
      .select('id, thread_id, sender_id, body, created_at')
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) return { ...fail(error), messages: [] };

    return {
      ok: true,
      messages: (data || []).map(row => shapeMessage(row, me.id)),
    };
  }

  function shapeMessage(row, myId) {
    return {
      id: row.id,
      threadId: row.thread_id,
      senderId: row.sender_id,
      mine: row.sender_id === myId,
      body: row.body,
      createdAt: row.created_at,
    };
  }

  // ---- Writing ----------------------------------------------------------

  // Rooms are never created by an insert from here — dm_open() is a security
  // definer function precisely because it has to write the other person's
  // membership row, which no client-side policy allows. Calling it twice for
  // the same pair returns the same room.
  async function openWith(userId) {
    const c = await client();
    const me = await currentUser();
    if (!c) return { ok: false, error: 'Not connected.' };
    if (!me) return { ok: false, error: 'Sign in to send a message.' };
    if (me.id === userId) return { ok: false, error: 'You cannot message yourself.' };

    const { data, error } = await c.rpc('dm_open', { p_other: userId });

    if (error) return fail(error);
    return { ok: true, threadId: data };
  }

  async function sendMessage(threadId, body) {
    const c = await client();
    const me = await currentUser();
    if (!c) return { ok: false, error: 'Not connected.' };
    if (!me) return { ok: false, error: 'Sign in to send a message.' };

    const clean = (body || '').trim();
    if (!clean) return { ok: false, error: 'Write something first.' };
    if (clean.length > 4000) return { ok: false, error: 'Messages are limited to 4000 characters.' };

    const { data, error } = await c
      .from('dm_messages')
      .insert({ thread_id: threadId, sender_id: me.id, body: clean })
      .select('id, thread_id, sender_id, body, created_at')
      .single();

    if (error) return fail(error);
    return { ok: true, message: shapeMessage(data, me.id) };
  }

  // Everything newer than last_read_at, from anyone else, counts as unread —
  // so opening a room is just a matter of moving that timestamp to now.
  async function markRead(threadId) {
    const c = await client();
    const me = await currentUser();
    if (!c || !me) return { ok: false };

    const { error } = await c
      .from('dm_members')
      .update({ last_read_at: new Date().toISOString() })
      .eq('thread_id', threadId)
      .eq('user_id', me.id);

    if (error) return fail(error);
    return { ok: true };
  }

  async function deleteMessage(messageId) {
    const c = await client();
    const me = await currentUser();
    if (!c || !me) return { ok: false, error: 'Not connected.' };

    const { error } = await c
      .from('dm_messages')
      .delete()
      .eq('id', messageId)
      .eq('sender_id', me.id);

    if (error) return fail(error);
    return { ok: true };
  }

  // ---- Realtime ---------------------------------------------------------

  // Streams inserts on dm_messages to `onMessage`. RLS applies to the stream
  // as well, so a subscriber is only ever sent rows from rooms they are in —
  // there is no filter here that someone could remove to see more.
  //
  // Returns a stop() to call on unmount. If the table was never added to the
  // supabase_realtime publication the channel simply never fires; the Chat
  // tab polls as well, so the feature degrades to a few seconds' delay rather
  // than breaking.
  async function subscribe(onMessage) {
    const c = await client();
    const me = await currentUser();

    if (!c || !me) return { ok: false, stop() {} };

    const channel = c
      .channel('cosmoklub-dm')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'dm_messages' },
        (payload) => {
          if (payload && payload.new) onMessage(shapeMessage(payload.new, me.id));
        }
      )
      .subscribe();

    return {
      ok: true,
      stop() {
        try {
          c.removeChannel(channel);
        } catch (error) {
          console.warn('[CosmoKlub] dm-api: could not close the realtime channel.', error);
        }
      },
    };
  }

  // ---- Formatting -------------------------------------------------------

  // Shorter than forum-api's timeAgo: a conversation list has room for "5m",
  // not "5 minutes ago".
  function shortTime(iso) {
    if (!iso) return '';

    const then = new Date(iso).getTime();
    if (Number.isNaN(then)) return '';

    const minutes = Math.floor((Date.now() - then) / 60000);
    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;

    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  return {
    currentUser,
    listConversations,
    listMessages,
    openWith,
    sendMessage,
    markRead,
    deleteMessage,
    subscribe,
    shortTime,
  };
})();
