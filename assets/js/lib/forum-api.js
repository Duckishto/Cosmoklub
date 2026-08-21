// CosmoKlub — forum data layer.
//
// Every Supabase call the forum needs, in one place: threads, replies, likes
// and notifications. The components above it (components/forum.js,
// components/profile.js) stay about rendering.
//
// Backed by supabase/schema-forum.sql — run that in the Supabase SQL editor
// before any of this works. Until then every call resolves to an empty result
// with `ok: false` rather than throwing, so the UI can show an honest empty
// state instead of breaking.
//
// Load after lib/supabase-client.js:
//   <script src="assets/js/lib/supabase-client.js"></script>
//   <script src="assets/js/lib/forum-api.js"></script>

window.ForumAPI = (function () {
  const CATEGORIES = [
    'Beginner Q&A',
    'Equipment',
    'Astrophotography',
    'Deep Sky',
    'Solar System',
    'News',
  ];

  async function client() {
    return window.supabaseClient || (window.supabaseReady ? await window.supabaseReady : null);
  }

  async function currentUser() {
    const c = await client();
    if (!c) return null;
    const { data } = await c.auth.getSession();
    return (data && data.session && data.session.user) || null;
  }

  // Postgres 42P01 = "relation does not exist", i.e. schema-forum.sql has not
  // been run yet. Worth calling out separately: it is a setup step, not a bug.
  function describeError(error) {
    if (!error) return '';
    if (error.code === '42P01') {
      return 'The forum tables are missing. Run supabase/schema-forum.sql in the Supabase SQL editor.';
    }
    return error.message || 'Something went wrong talking to the server.';
  }

  function fail(error) {
    console.warn('[CosmoKlub] forum-api:', error);
    return { ok: false, error: describeError(error) };
  }

  // ---- Reading ----------------------------------------------------------

  async function listThreads({ category = null, limit = 50 } = {}) {
    const c = await client();
    if (!c) return { ok: false, error: 'Not connected.', threads: [] };

    let query = c
      .from('forum_thread_feed')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (category && category !== 'All') query = query.eq('category', category);

    const { data, error } = await query;
    if (error) return { ...fail(error), threads: [] };

    return { ok: true, threads: data || [] };
  }

  async function listReplies(threadId) {
    const c = await client();
    if (!c) return { ok: false, error: 'Not connected.', replies: [] };

    // profiles is joined through the author_id foreign key so each reply
    // arrives with its author's display name already attached.
    const { data, error } = await c
      .from('forum_replies')
      .select('id, thread_id, author_id, body, created_at, profiles:author_id (username)')
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true });

    if (error) return { ...fail(error), replies: [] };

    return {
      ok: true,
      replies: (data || []).map(r => ({
        id: r.id,
        threadId: r.thread_id,
        authorId: r.author_id,
        author: (r.profiles && r.profiles.username) || 'Someone',
        body: r.body,
        createdAt: r.created_at,
      })),
    };
  }

  // Which of these threads the signed-in person has already liked, so the
  // heart can render filled without a query per card.
  async function likedThreadIds(threadIds) {
    const c = await client();
    const user = await currentUser();
    if (!c || !user || !threadIds || !threadIds.length) return new Set();

    const { data, error } = await c
      .from('forum_likes')
      .select('thread_id')
      .eq('user_id', user.id)
      .in('thread_id', threadIds);

    if (error) {
      fail(error);
      return new Set();
    }
    return new Set((data || []).map(row => row.thread_id));
  }

  // ---- Writing ----------------------------------------------------------

  async function createThread({ title, body, category }) {
    const c = await client();
    const user = await currentUser();
    if (!c) return { ok: false, error: 'Not connected.' };
    if (!user) return { ok: false, error: 'Sign in to post.' };

    const cleanTitle = (title || '').trim();
    const cleanBody = (body || '').trim();

    if (cleanTitle.length < 4) return { ok: false, error: 'Give your post a title of at least 4 characters.' };
    if (cleanTitle.length > 160) return { ok: false, error: 'Titles are limited to 160 characters.' };
    if (!cleanBody) return { ok: false, error: 'Write something in the body.' };
    if (!CATEGORIES.includes(category)) return { ok: false, error: 'Pick a category.' };

    const { data, error } = await c
      .from('forum_threads')
      .insert({ author_id: user.id, title: cleanTitle, body: cleanBody, category })
      .select('id')
      .single();

    if (error) return fail(error);
    return { ok: true, id: data.id };
  }

  async function addReply(threadId, body) {
    const c = await client();
    const user = await currentUser();
    if (!c) return { ok: false, error: 'Not connected.' };
    if (!user) return { ok: false, error: 'Sign in to reply.' };

    const cleanBody = (body || '').trim();
    if (!cleanBody) return { ok: false, error: 'Write something first.' };

    const { error } = await c
      .from('forum_replies')
      .insert({ thread_id: threadId, author_id: user.id, body: cleanBody });

    if (error) return fail(error);
    return { ok: true };
  }

  // Returns the resulting state so the caller can update one card rather than
  // re-fetching the whole feed.
  async function toggleLike(threadId, currentlyLiked) {
    const c = await client();
    const user = await currentUser();
    if (!c) return { ok: false, error: 'Not connected.' };
    if (!user) return { ok: false, error: 'Sign in to like posts.' };

    if (currentlyLiked) {
      const { error } = await c
        .from('forum_likes')
        .delete()
        .eq('thread_id', threadId)
        .eq('user_id', user.id);
      if (error) return fail(error);
      return { ok: true, liked: false };
    }

    const { error } = await c
      .from('forum_likes')
      .insert({ thread_id: threadId, user_id: user.id });

    // 23505 = already liked (the composite primary key did its job). Treat it
    // as success — the end state is what the caller wanted.
    if (error && error.code !== '23505') return fail(error);
    return { ok: true, liked: true };
  }

  // ---- Notifications ----------------------------------------------------

  async function listNotifications({ limit = 30 } = {}) {
    const c = await client();
    const user = await currentUser();
    if (!c || !user) return { ok: false, notifications: [], unread: 0 };

    const { data, error } = await c
      .from('notifications')
      .select('id, type, read, created_at, thread_id, actor_id, profiles:actor_id (username), forum_threads:thread_id (title)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) return { ...fail(error), notifications: [], unread: 0 };

    const notifications = (data || []).map(n => ({
      id: n.id,
      type: n.type,
      read: n.read,
      createdAt: n.created_at,
      threadId: n.thread_id,
      actor: (n.profiles && n.profiles.username) || 'Someone',
      threadTitle: (n.forum_threads && n.forum_threads.title) || 'your post',
    }));

    return {
      ok: true,
      notifications,
      unread: notifications.filter(n => !n.read).length,
    };
  }

  async function markAllRead() {
    const c = await client();
    const user = await currentUser();
    if (!c || !user) return { ok: false };

    const { error } = await c
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false);

    if (error) return fail(error);
    return { ok: true };
  }

  // ---- Profile helpers --------------------------------------------------

  async function threadsByUser(userId, { limit = 30 } = {}) {
    const c = await client();
    if (!c || !userId) return { ok: false, threads: [] };

    const { data, error } = await c
      .from('forum_thread_feed')
      .select('*')
      .eq('author_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) return { ...fail(error), threads: [] };
    return { ok: true, threads: data || [] };
  }

  async function likeCountForUser(userId) {
    const c = await client();
    if (!c || !userId) return 0;

    // Every like on every thread this person wrote.
    const { data: threads, error: threadError } = await c
      .from('forum_threads')
      .select('id')
      .eq('author_id', userId);

    if (threadError || !threads || !threads.length) return 0;

    const { count, error } = await c
      .from('forum_likes')
      .select('*', { count: 'exact', head: true })
      .in('thread_id', threads.map(t => t.id));

    if (error) {
      fail(error);
      return 0;
    }
    return count || 0;
  }

  // ---- Formatting -------------------------------------------------------

  function timeAgo(iso) {
    const then = new Date(iso).getTime();
    if (Number.isNaN(then)) return '';

    const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000));
    if (seconds < 60) return 'just now';

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;

    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  return {
    CATEGORIES,
    currentUser,
    listThreads,
    listReplies,
    likedThreadIds,
    createThread,
    addReply,
    toggleLike,
    listNotifications,
    markAllRead,
    threadsByUser,
    likeCountForUser,
    timeAgo,
  };
})();
