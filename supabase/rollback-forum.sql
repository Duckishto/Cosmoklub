-- ---------------------------------------------------------------------------
-- CosmoKlub — undo for schema-forum.sql
--
-- Removes exactly what that file added and nothing else. Keep it around; run
-- it only if you want the forum tables gone.
--
-- Supabase -> SQL Editor -> New query -> paste -> Run.
--
-- ⚠️ This deletes every forum post, comment, like and notification. That is
-- the point of it — but there is no undo for the undo. It is safe to run
-- right after schema-forum.sql, while the tables are still empty; running it
-- once the forum has real posts in it throws those posts away.
--
-- It does NOT touch profiles, user_progress, lesson_completions, badges,
-- user_badges, cosmetic_items, user_cosmetics, staff_applications or
-- bug_reports. Those are named nowhere below.
-- ---------------------------------------------------------------------------

-- The view first — it depends on the tables underneath.
drop view if exists public.forum_thread_feed;

-- Triggers go with their tables, but drop them explicitly so the functions
-- can be removed cleanly.
drop trigger if exists on_forum_reply_created on public.forum_replies;
drop trigger if exists on_forum_like_created  on public.forum_likes;

drop function if exists public.notify_thread_reply();
drop function if exists public.notify_thread_like();

-- cascade clears the foreign keys between these four and nothing outside
-- them: forum_replies, forum_likes and notifications all point at
-- forum_threads, and every one of them is on this list.
drop table if exists public.notifications  cascade;
drop table if exists public.forum_likes    cascade;
drop table if exists public.forum_replies  cascade;
drop table if exists public.forum_threads  cascade;
