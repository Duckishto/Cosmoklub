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
  // The category taxonomy. Six parent topics, each with eight children —
  // 54 categories in all. Parents are themselves valid categories, so every
  // thread posted before the children existed is still legal.
  //
  // This list is the source of truth for the UI, but NOT for the database:
  // threads.category carries a CHECK constraint that has to be kept in step.
  // See supabase/migration-forum-categories.sql — adding a category here
  // without running that migration means posts in it are rejected on insert.
  const CATEGORY_GROUPS = [
    { name: "Beginner Q&A", hue: "violet", children: ["Getting Started", "First Telescope", "Star Hopping", "Reading Star Charts", "Observing Basics", "Terminology", "Buying Advice", "Common Mistakes"] },
    { name: "Equipment", hue: "blue", children: ["Telescopes", "Mounts", "Eyepieces", "Binoculars", "Filters", "Astro Cameras", "DIY & Mods", "Maintenance"] },
    { name: "Astrophotography", hue: "pink", children: ["Deep Sky Imaging", "Planetary Imaging", "Nightscapes", "Guiding", "Stacking", "Post-Processing", "Smartphone Astro", "Solar Imaging"] },
    { name: "Deep Sky", hue: "cyan", children: ["Galaxies", "Nebulae", "Open Clusters", "Globular Clusters", "Supernova Remnants", "Messier Objects", "NGC & IC", "Dark Sky Sites"] },
    { name: "Solar System", hue: "amber", children: ["The Moon", "Sun & Solar", "Mars", "Jupiter", "Saturn", "Venus & Mercury", "Comets", "Meteor Showers"] },
    { name: "News", hue: "green", children: ["Missions & Launches", "Discoveries", "Space Agencies", "Eclipses & Transits", "Satellites", "Research Papers", "Star Parties", "Community"] }
  ];

  // Flat list, parents first within each group. Used for validation.
  const CATEGORIES = CATEGORY_GROUPS.flatMap(g => [g.name, ...g.children]);

  // 'Deep Sky Imaging' -> 'Astrophotography'. Used by the filter row so
  // picking a parent also matches everything filed underneath it.
  const CATEGORY_PARENT = (() => {
    const map = {};
    CATEGORY_GROUPS.forEach(g => {
      map[g.name] = g.name;
      g.children.forEach(c => { map[c] = g.name; });
    });
    return map;
  })();

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

  // Look up display names for a set of user ids.
  //
  // Deliberately a second query rather than a PostgREST embed: author_id has
  // a foreign key to auth.users, not to profiles, so `profiles:author_id(...)`
  // is rejected with PGRST200 — there is no relationship for it to follow.
  // The thread feed gets away with a join only because the view spells it out
  // in SQL.
  async function usernamesFor(userIds) {
    const ids = [...new Set((userIds || []).filter(Boolean))];
    if (!ids.length) return {};

    const c = await client();
    if (!c) return {};

    const { data, error } = await c
      .from('profiles')
      .select('uid, username, avatar_url')
      .in('uid', ids);

    if (error) {
      fail(error);
      return {};
    }

    const byId = {};
    (data || []).forEach(row => {
      byId[row.uid] = { username: row.username, avatarUrl: row.avatar_url || '' };
    });
    return byId;
  }

  async function listReplies(threadId) {
    const c = await client();
    if (!c) return { ok: false, error: 'Not connected.', replies: [] };

    const { data, error } = await c
      .from('forum_replies')
      .select('id, thread_id, author_id, parent_id, body, created_at')
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true });

    if (error) return { ...fail(error), replies: [] };

    const rows = data || [];
    const names = await usernamesFor(rows.map(r => r.author_id));

    return {
      ok: true,
      replies: rows.map(r => ({
        id: r.id,
        threadId: r.thread_id,
        authorId: r.author_id,
        parentId: r.parent_id || null,
        author: (names[r.author_id] && names[r.author_id].username) || 'Someone',
        avatarUrl: (names[r.author_id] && names[r.author_id].avatarUrl) || '',
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

  // Only the author can close their own question — enforced by the RLS update
  // policy, so a forged request is refused by the database, not just the UI.
  async function setSolved(threadId, solved) {
    const c = await client();
    if (!c) return { ok: false, error: 'Not connected.' };

    const { error } = await c
      .from('forum_threads')
      .update({ solved: !!solved, updated_at: new Date().toISOString() })
      .eq('id', threadId);

    if (error) return fail(error);
    return { ok: true, solved: !!solved };
  }

  async function createThread({ title, body, category, solved = false }) {
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
      .insert({
        author_id: user.id,
        title: cleanTitle,
        body: cleanBody,
        category,
        // Only questions can be marked solved; anything else is stored false.
        solved: category === 'Beginner Q&A' ? !!solved : false,
      })
      .select('id')
      .single();

    if (error) return fail(error);
    return { ok: true, id: data.id };
  }

  async function addReply(threadId, body, parentId = null) {
    const c = await client();
    const user = await currentUser();
    if (!c) return { ok: false, error: 'Not connected.' };
    if (!user) return { ok: false, error: 'Sign in to reply.' };

    const cleanBody = (body || '').trim();
    if (!cleanBody) return { ok: false, error: 'Write something first.' };

    const { error } = await c
      .from('forum_replies')
      .insert({
        thread_id: threadId,
        author_id: user.id,
        body: cleanBody,
        // null for a top-level comment, otherwise the comment being answered
        parent_id: parentId,
      });

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

  // Deleting is guarded by RLS: the policies only allow a row whose author_id
  // matches auth.uid(), so someone else's post cannot be removed even with a
  // hand-crafted request.
  //
  // forum_replies, forum_likes and notifications all reference the thread with
  // `on delete cascade`, so removing a post takes its comments and likes with
  // it rather than leaving orphans behind.
  async function deleteThread(threadId) {
    const c = await client();
    const user = await currentUser();
    if (!c) return { ok: false, error: 'Not connected.' };
    if (!user) return { ok: false, error: 'Sign in first.' };

    const { error } = await c
      .from('forum_threads')
      .delete()
      .eq('id', threadId)
      .eq('author_id', user.id);

    if (error) return fail(error);
    return { ok: true };
  }

  // Answers to a comment cascade away with it, same as above.
  async function deleteReply(replyId) {
    const c = await client();
    const user = await currentUser();
    if (!c) return { ok: false, error: 'Not connected.' };
    if (!user) return { ok: false, error: 'Sign in first.' };

    const { error } = await c
      .from('forum_replies')
      .delete()
      .eq('id', replyId)
      .eq('author_id', user.id);

    if (error) return fail(error);
    return { ok: true };
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
    CATEGORY_GROUPS,
    CATEGORY_PARENT,
    CATEGORIES,
    currentUser,
    listThreads,
    listReplies,
    usernamesFor,
    likedThreadIds,
    createThread,
    setSolved,
    addReply,
    deleteThread,
    deleteReply,
    toggleLike,
    listNotifications,
    markAllRead,
    threadsByUser,
    likeCountForUser,
    timeAgo,
  };
})();
