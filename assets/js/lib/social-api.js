// CosmoKlub — social data layer: the follow graph and public profiles.
//
// Everything the Profile tab needs to show someone who is not you: their
// public details, their follower counts, and the follow button's state.
// Components above it (components/profile.js, components/forum.js) stay about
// rendering.
//
// Backed by supabase/schema-social.sql — run that in the Supabase SQL editor
// before any of this works. Until then every call resolves to an empty result
// with `ok: false` rather than throwing, exactly like forum-api.js, so the UI
// can show an honest message instead of breaking.
//
// Other people's details come from the public_profiles VIEW, never from
// `profiles` directly. The view exists precisely so email and gender cannot
// leak into a page meant for someone else's eyes — see the note above it in
// supabase/schema-progress.sql.
//
// Load after lib/supabase-client.js:
//   <script src="assets/js/lib/supabase-client.js"></script>
//   <script src="assets/js/lib/social-api.js"></script>

window.SocialAPI = (function () {
  async function client() {
    return window.supabaseClient || (window.supabaseReady ? await window.supabaseReady : null);
  }

  async function currentUser() {
    const c = await client();
    if (!c) return null;
    const { data } = await c.auth.getSession();
    return (data && data.session && data.session.user) || null;
  }

  // 42P01 = "relation does not exist", i.e. schema-social.sql has not been
  // run. Worth calling out separately: it is a setup step, not a bug.
  function describeError(error) {
    if (!error) return '';
    if (error.code === '42P01') {
      return 'The social tables are missing. Run supabase/schema-social.sql in the Supabase SQL editor.';
    }
    return error.message || 'Something went wrong talking to the server.';
  }

  function fail(error) {
    console.warn('[CosmoKlub] social-api:', error);
    return { ok: false, error: describeError(error) };
  }

  // One shape for a person everywhere in the UI, whether they came from a
  // follower list, a search or a profile page.
  function shapePerson(row) {
    const name = (row && (row.display_name || row.username)) || 'Astronomer';
    return {
      id: row.uid,
      username: row.username || '',
      name,
      initial: name.trim().charAt(0).toUpperCase() || '?',
      avatarUrl: row.avatar_url || '',
      bio: row.bio || '',
      joinedAt: row.created_at || null,
    };
  }

  // ---- Profiles ---------------------------------------------------------

  async function profileFor(userId) {
    const c = await client();
    if (!c || !userId) return { ok: false, profile: null };

    const { data, error } = await c
      .from('public_profiles')
      .select('uid, username, display_name, avatar_url, bio, created_at')
      .eq('uid', userId)
      .single();

    if (error) return { ...fail(error), profile: null };
    return { ok: true, profile: shapePerson(data) };
  }

  // Powers the "New message" people picker. Matches the start of a username
  // rather than anywhere inside it, so typing "st" offers StarDust before
  // everyone with an s and a t somewhere in their name.
  async function searchPeople(query, { limit = 12 } = {}) {
    const c = await client();
    const me = await currentUser();
    const needle = (query || '').trim();

    if (!c || needle.length < 1) return { ok: true, people: [] };

    const { data, error } = await c
      .from('public_profiles')
      .select('uid, username, display_name, avatar_url, bio, created_at')
      .ilike('username', `${needle}%`)
      .limit(limit + 1);

    if (error) return { ...fail(error), people: [] };

    // You are never a search result for your own message picker.
    const people = (data || [])
      .filter(row => !me || row.uid !== me.id)
      .slice(0, limit)
      .map(shapePerson);

    return { ok: true, people };
  }

  // ---- Counts and state -------------------------------------------------

  // head:true asks for the count without transferring a single row, which is
  // what makes this cheap enough to run on every profile open.
  async function followCounts(userId) {
    const c = await client();
    if (!c || !userId) return { followers: 0, following: 0 };

    const [followersRes, followingRes] = await Promise.all([
      c.from('follows').select('*', { count: 'exact', head: true }).eq('followee_id', userId),
      c.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', userId),
    ]);

    if (followersRes.error) fail(followersRes.error);
    if (followingRes.error) fail(followingRes.error);

    return {
      followers: followersRes.count || 0,
      following: followingRes.count || 0,
    };
  }

  // Whether the signed-in person follows `userId`. maybeSingle() rather than
  // single() because "no row" is the ordinary answer here, not an error.
  async function isFollowing(userId) {
    const c = await client();
    const me = await currentUser();
    if (!c || !me || !userId || me.id === userId) return false;

    const { data, error } = await c
      .from('follows')
      .select('followee_id')
      .eq('follower_id', me.id)
      .eq('followee_id', userId)
      .maybeSingle();

    if (error) {
      fail(error);
      return false;
    }
    return !!data;
  }

  // ---- Writing ----------------------------------------------------------

  // Returns the resulting state so the caller can update one button rather
  // than re-reading the whole profile.
  async function follow(userId) {
    const c = await client();
    const me = await currentUser();
    if (!c) return { ok: false, error: 'Not connected.' };
    if (!me) return { ok: false, error: 'Sign in to follow people.' };
    if (me.id === userId) return { ok: false, error: 'You cannot follow yourself.' };

    const { error } = await c
      .from('follows')
      .insert({ follower_id: me.id, followee_id: userId });

    // 23505 = already following (the composite primary key did its job).
    // Treat it as success — the end state is what the caller wanted.
    if (error && error.code !== '23505') return fail(error);
    return { ok: true, following: true };
  }

  async function unfollow(userId) {
    const c = await client();
    const me = await currentUser();
    if (!c) return { ok: false, error: 'Not connected.' };
    if (!me) return { ok: false, error: 'Sign in first.' };

    const { error } = await c
      .from('follows')
      .delete()
      .eq('follower_id', me.id)
      .eq('followee_id', userId);

    if (error) return fail(error);
    return { ok: true, following: false };
  }

  // ---- Lists ------------------------------------------------------------

  // Two queries rather than a PostgREST embed, for the same reason
  // forum-api.js looks names up separately: follower_id/followee_id have a
  // foreign key to auth.users, not to profiles, so `profiles:follower_id(...)`
  // is rejected with PGRST200 — there is no relationship to follow.
  async function peopleFor(ids) {
    const unique = [...new Set((ids || []).filter(Boolean))];
    if (!unique.length) return [];

    const c = await client();
    if (!c) return [];

    const { data, error } = await c
      .from('public_profiles')
      .select('uid, username, display_name, avatar_url, bio, created_at')
      .in('uid', unique);

    if (error) {
      fail(error);
      return [];
    }

    // Keep the caller's order — the follow lists are newest-first, and a
    // straight `in` query comes back in whatever order the planner likes.
    const byId = {};
    (data || []).forEach(row => { byId[row.uid] = shapePerson(row); });
    return unique.map(id => byId[id]).filter(Boolean);
  }

  async function listFollowers(userId, { limit = 100 } = {}) {
    const c = await client();
    if (!c || !userId) return { ok: false, people: [] };

    const { data, error } = await c
      .from('follows')
      .select('follower_id')
      .eq('followee_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) return { ...fail(error), people: [] };
    return { ok: true, people: await peopleFor((data || []).map(r => r.follower_id)) };
  }

  async function listFollowing(userId, { limit = 100 } = {}) {
    const c = await client();
    if (!c || !userId) return { ok: false, people: [] };

    const { data, error } = await c
      .from('follows')
      .select('followee_id')
      .eq('follower_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) return { ...fail(error), people: [] };
    return { ok: true, people: await peopleFor((data || []).map(r => r.followee_id)) };
  }

  return {
    currentUser,
    profileFor,
    searchPeople,
    followCounts,
    isFollowing,
    follow,
    unfollow,
    listFollowers,
    listFollowing,
    peopleFor,
  };
})();
