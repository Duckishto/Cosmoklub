-- ---------------------------------------------------------------------------
-- CosmoKlub — undo for schema-social.sql
--
-- Removes exactly what that file added and nothing else. Keep it around; run
-- it only if you want the follow graph and the private messages gone.
--
-- Supabase -> SQL Editor -> New query -> paste -> Run.
--
-- ⚠️ This deletes every follow and every private message anyone has sent.
-- That is the point of it — but there is no undo for the undo. It is safe to
-- run right after schema-social.sql, while the tables are still empty;
-- running it later throws real conversations away.
--
-- It does NOT touch profiles, public_profiles, the forum tables, progress,
-- badges, cosmetics, staff_applications or bug_reports. None of them is
-- named below.
-- ---------------------------------------------------------------------------

-- The view first — it depends on the tables underneath.
drop view if exists public.dm_overview;

-- Take the table out of the realtime publication before dropping it, so the
-- publication is not left referring to something that no longer exists.
do $$ begin
  alter publication supabase_realtime drop table public.dm_messages;
exception
  when undefined_object then null;
  when undefined_table  then null;
end $$;

drop trigger if exists dm_messages_touch_thread on public.dm_messages;

drop function if exists public.dm_touch_thread();
drop function if exists public.dm_open(uuid);
drop function if exists public.is_dm_member(bigint, uuid);

-- cascade clears the foreign keys between these three and nothing outside
-- them: dm_members and dm_messages both point at dm_threads, and both are on
-- this list.
drop table if exists public.dm_messages cascade;
drop table if exists public.dm_members  cascade;
drop table if exists public.dm_threads  cascade;

drop table if exists public.follows cascade;
