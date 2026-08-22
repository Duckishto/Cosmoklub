-- ---------------------------------------------------------------------------
-- CosmoKlub — auth fixes for Google sign-in and profile pictures.
--
-- Run once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
-- Safe to run again; every statement is idempotent.
--
-- Run supabase/schema.sql first — this patches what that file creates.
--
-- WHY THIS EXISTS
--
-- handle_new_user() in schema.sql reads the username straight out of the
-- sign-up metadata:
--
--     new.raw_user_meta_data ->> 'username'
--
-- Our own registration form sends that field, so email sign-ups work. Google
-- does not: it sends `name`, `full_name`, `picture` and so on, with no
-- `username` anywhere. The value comes back NULL, hits `username text not
-- null`, and the INSERT fails — which aborts the whole sign-up transaction.
-- The account is never created and the person just sees an error.
--
-- So Google sign-in cannot work until this runs, no matter what is configured
-- in the Supabase or Google dashboards.
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- 1. Profile pictures
--
-- Google hands us an avatar URL at sign-in. Somewhere to keep it.
-- ---------------------------------------------------------------------------

alter table public.profiles
  add column if not exists avatar_url text;

-- ---------------------------------------------------------------------------
-- 2. A username that always exists and is always unique
--
-- Tries, in order: the username our form sends, Google's name fields, then
-- the local part of the email. Whatever it lands on is slugified, and if that
-- is already taken a numeric suffix is added until it isn't.
--
-- The loop is bounded — after 50 collisions it falls back to a random suffix
-- rather than spinning forever.
-- ---------------------------------------------------------------------------

create or replace function public.cosmoklub_unique_username(seed text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  base      text;
  candidate text;
  n         int := 0;
begin
  -- Keep letters, digits, underscore and dot; collapse the rest away.
  base := lower(coalesce(nullif(trim(seed), ''), 'stargazer'));
  base := regexp_replace(base, '[^a-z0-9_.]+', '', 'g');

  if base is null or length(base) < 3 then
    base := 'stargazer';
  end if;

  base := left(base, 20);
  candidate := base;

  while exists (select 1 from public.profiles where username = candidate) loop
    n := n + 1;

    if n > 50 then
      candidate := base || floor(random() * 1000000)::text;
      exit;
    end if;

    candidate := base || n::text;
  end loop;

  return candidate;
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. The replacement trigger
--
-- Same job as before, but it can no longer be handed a NULL username, it
-- stores the avatar when the provider gives us one, and it will not fail a
-- sign-up if a profile row somehow already exists.
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta       jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  chosen     text  := nullif(meta ->> 'username', '');
  final_name text;
begin
  -- Two different situations, and they must not be treated the same.
  --
  -- Our own registration form sends `username` — a name the person typed and
  -- expects to get. Store it exactly as typed. If it collides, the unique
  -- constraint raises and login.js reports "that name is taken", which is the
  -- behaviour that already exists and the right one: silently handing someone
  -- `funblox1` because `funblox` was gone would be worse than telling them.
  --
  -- Google sends no username at all, only `name` / `full_name` / `picture`.
  -- There is nobody to ask mid-sign-in, so derive something usable and make
  -- it unique automatically.
  if chosen is not null then
    final_name := chosen;
  else
    final_name := public.cosmoklub_unique_username(
      coalesce(
        nullif(meta ->> 'full_name', ''),
        nullif(meta ->> 'name',      ''),
        split_part(coalesce(new.email, ''), '@', 1)
      )
    );
  end if;

  insert into public.profiles (uid, username, email, gender, avatar_url)
  values (
    new.id,
    final_name,
    new.email,
    coalesce(nullif(meta ->> 'gender', ''), 'prefer_not_to_say'),
    coalesce(
      nullif(meta ->> 'avatar_url', ''),
      nullif(meta ->> 'picture',    '')
    )
  )
  -- Linking a second provider to an existing account fires this again; the
  -- profile is already there and should be left alone.
  on conflict (uid) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 4. Let people change their own avatar
--
-- schema.sql already allows updating your own profile row, but only if that
-- policy covers every column. This re-states it so avatar_url is included.
-- ---------------------------------------------------------------------------

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = uid)
  with check (auth.uid() = uid);

-- ---------------------------------------------------------------------------
-- 5. Backfill
--
-- Anyone who signed up before this ran keeps whatever username they have;
-- this only fills in an avatar for accounts that already had one in their
-- auth metadata but no copy on the profile.
-- ---------------------------------------------------------------------------

update public.profiles p
set avatar_url = coalesce(
      nullif(u.raw_user_meta_data ->> 'avatar_url', ''),
      nullif(u.raw_user_meta_data ->> 'picture',    '')
    )
from auth.users u
where u.id = p.uid
  and p.avatar_url is null
  and coalesce(
        nullif(u.raw_user_meta_data ->> 'avatar_url', ''),
        nullif(u.raw_user_meta_data ->> 'picture',    '')
      ) is not null;

-- ---------------------------------------------------------------------------
-- AFTER RUNNING THIS, still to do in the dashboards:
--
--   Google Cloud Console
--     APIs & Services -> Credentials -> Create OAuth client ID (Web)
--     Authorised redirect URI:
--       https://<your-project-ref>.supabase.co/auth/v1/callback
--
--   Supabase -> Authentication -> Providers -> Google
--     Enable, paste the Client ID and Client Secret
--
--   Supabase -> Authentication -> URL Configuration
--     Site URL:       https://cosmoklub.pages.dev
--     Redirect URLs:  https://cosmoklub.pages.dev/**
--                     http://localhost:8788/**
--
--   Supabase -> Authentication -> Sign In / Providers
--     Turn on "Allow manual linking" — the Security tab in Settings uses
--     linkIdentity() to attach Google to an existing email account, and that
--     call is rejected while manual linking is off.
-- ---------------------------------------------------------------------------
