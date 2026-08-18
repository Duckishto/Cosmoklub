-- ---------------------------------------------------------------------------
-- CosmoKlub — Supabase schema.
--
-- Run this once in: Supabase Dashboard → SQL Editor → New query → Run.
-- The table/trigger/function statements are safe to re-run, but the
-- `create policy` statements are not (Postgres has no "or replace" for
-- policies) — if you ever need to re-run this whole file, drop the
-- existing policies first or re-run only the parts you changed.
--
-- Two independent pieces:
--   A. Account registration / login (profiles table + auto-create trigger)
--   B. Staff applications (staff_applications table) — see that section
--      further down for details.
--
-- What this does:
--   1. Creates a `profiles` table that stores, for every user:
--        - uid       (= auth.users.id, the Supabase Auth UID)
--        - username
--        - email
--        - gender
--        - created_at
--   2. Adds Row Level Security so users can only read/write their OWN row.
--   3. Adds a trigger that automatically creates the profile row the moment
--      someone signs up via supabase.auth.signUp(), using the username/
--      gender passed in as "user metadata" from the frontend.
--
-- Passwords are NEVER stored here — Supabase Auth (auth.users) already
-- handles password hashing/storage internally. This table only stores the
-- extra fields CosmoKlub needs (username, gender) plus a copy of the email
-- and the user's UID for easy querying.
-- ---------------------------------------------------------------------------

-- 1. Table -------------------------------------------------------------------
create table if not exists public.profiles (
  uid        uuid primary key references auth.users(id) on delete cascade,
  username   text not null unique,
  email      text not null,
  gender     text not null check (gender in ('male', 'female', 'other', 'prefer_not_to_say')),
  created_at timestamptz not null default now()
);

-- 2. Row Level Security -------------------------------------------------------
alter table public.profiles enable row level security;

-- Anyone signed in can read profiles (needed for usernames to show up in
-- forum/chat). Remove/restrict this policy if profiles should be private.
create policy "Profiles are viewable by authenticated users"
  on public.profiles for select
  using (auth.role() = 'authenticated');

-- Users can only insert their OWN profile row (uid must match their auth uid).
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = uid);

-- Users can only update their OWN profile row.
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = uid);

-- 3. Auto-create profile row on signup ---------------------------------------
-- supabase.auth.signUp() is called from the frontend with:
--   options: { data: { username, gender } }
-- That data lands in raw_user_meta_data on the new auth.users row. This
-- trigger copies it (plus the new user's id/email) into public.profiles
-- automatically, so the frontend never has to do a separate insert.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (uid, username, email, gender)
  values (
    new.id,
    new.raw_user_meta_data ->> 'username',
    new.email,
    coalesce(new.raw_user_meta_data ->> 'gender', 'prefer_not_to_say')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Staff applications (staff-application.html / staff-application.js)
--
-- Applying is intentionally NOT gated behind an account — anyone can submit
-- one without signing in, so this uses the Supabase anon key directly
-- rather than auth.uid(). Rows can be inserted by anyone but not read back
-- by anyone (no select policy for anon/authenticated); review submissions
-- from the Supabase Dashboard → Table Editor, which uses your project's
-- privileged access and bypasses RLS.
-- ---------------------------------------------------------------------------

-- 1. Table -------------------------------------------------------------------
create table if not exists public.staff_applications (
  id           bigint generated always as identity primary key,
  full_name    text not null,
  email        text not null,
  discord      text,
  role_applied text not null check (role_applied in ('developer', 'researcher', 'creative', 'moderator', 'other')),
  links        text,
  why          text not null,
  experience   text,
  availability text,
  status       text not null default 'pending' check (status in ('pending', 'reviewing', 'accepted', 'rejected')),
  created_at   timestamptz not null default now()
);

-- 2. Row Level Security -------------------------------------------------------
alter table public.staff_applications enable row level security;

-- Anyone (including anonymous visitors) can submit an application.
create policy "Anyone can submit a staff application"
  on public.staff_applications for insert
  with check (true);

-- No select/update/delete policy is defined for anon or authenticated —
-- applications are only readable via the Dashboard (service role), so
-- applicants can't see each other's submissions or their status here.
