-- ---------------------------------------------------------------------------
-- CosmoKlub — storage for profile pictures.
--
-- Run once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
-- Safe to run again.
--
-- Run supabase/schema-auth.sql first — that adds profiles.avatar_url, which is
-- where the resulting URL gets stored.
--
-- Creates a public `avatars` bucket. Public read is deliberate: a profile
-- picture is shown next to every post the person writes, including to signed-
-- out visitors reading the forum, so the URL has to work without a token.
-- Writing is another matter — the policies below let people touch only their
-- own folder.
--
-- Layout inside the bucket:
--
--     avatars/<user-uuid>/<timestamp>.<ext>
--
-- The first path segment is the owner's uid, which is what the policies check
-- against auth.uid(). Uploading under someone else's folder is rejected by the
-- database, not just by the UI.
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- 1. The bucket
--
-- 2 MB ceiling and a fixed list of image types, enforced server-side. The
-- client also downsizes before uploading, but a limit that only exists in
-- JavaScript is not a limit.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public             = excluded.public,
    file_size_limit    = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- ---------------------------------------------------------------------------
-- 2. Who can do what
--
-- storage.foldername(name) splits the object path, so [1] is the first folder
-- — the uid the file was filed under.
-- ---------------------------------------------------------------------------

drop policy if exists "Avatar images are publicly readable" on storage.objects;
create policy "Avatar images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'avatars');

drop policy if exists "Users can upload their own avatar" on storage.objects;
create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "Users can replace their own avatar" on storage.objects;
create policy "Users can replace their own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "Users can delete their own avatar" on storage.objects;
create policy "Users can delete their own avatar"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
