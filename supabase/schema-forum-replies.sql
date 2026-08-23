-- ---------------------------------------------------------------------------
-- CosmoKlub — replying to a comment
--
-- Supabase -> SQL Editor -> New query -> paste -> Run.
--
-- Adds one column. No drop, no truncate, no delete. Existing comments keep
-- working: parent_id is null on all of them, which is exactly what a
-- top-level comment means.
--
-- Run supabase/schema-forum-firstrun.sql first.
-- ---------------------------------------------------------------------------

-- Which comment this one is answering. Null means it answers the post itself.
--
-- The self-reference is what makes a thread of replies possible, and
-- `on delete cascade` means deleting a comment takes its answers with it
-- rather than leaving them pointing at nothing.
alter table public.forum_replies
  add column if not exists parent_id bigint
    references public.forum_replies(id) on delete cascade;

-- Fetching one comment's answers should not scan the table.
create index if not exists forum_replies_parent_idx
  on public.forum_replies (parent_id);
