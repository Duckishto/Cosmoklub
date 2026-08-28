-- ---------------------------------------------------------------------------
-- CosmoKlub — social schema: follows + private direct messages.
--
-- Run once in the Supabase SQL editor: SQL Editor -> New query -> paste -> Run.
--
-- Safe to re-run. Every `create table` is `if not exists`, every function is
-- `create or replace`, and every policy/trigger is wrapped in a block that
-- swallows `duplicate_object`. Nothing here drops, truncates or deletes, so
-- the SQL editor will not flag it as destructive.
--
-- Depends on:
--   supabase/schema.sql          — public.profiles
--   supabase/schema-progress.sql — public.public_profiles (the view this reads
--                                  other people's details from, so email and
--                                  gender can never leak into the UI)
--
-- Two independent features:
--   A. follows      — the social graph behind Following/Followers
--   B. dm_*         — one-to-one private messages
-- ---------------------------------------------------------------------------


-- ===========================================================================
-- A. FOLLOWS
--
-- One row per "A follows B". The primary key is the pair, so following twice
-- is impossible at the database level rather than something the client has to
-- police — the same shape as forum_likes.
-- ===========================================================================

create table if not exists public.follows (
  follower_id uuid not null references auth.users(id) on delete cascade,
  followee_id uuid not null references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (follower_id, followee_id),
  constraint follows_no_self check (follower_id <> followee_id)
);

create index if not exists follows_followee_idx on public.follows (followee_id, created_at desc);
create index if not exists follows_follower_idx on public.follows (follower_id, created_at desc);

alter table public.follows enable row level security;

-- Who follows whom is public information inside the club — the counts and the
-- lists on a profile page need to be readable for people other than yourself.
do $$ begin
  create policy "follows are readable by signed-in users"
    on public.follows for select
    using (auth.role() = 'authenticated');
exception when duplicate_object then null;
end $$;

-- You can only ever create or remove a follow in your own name. A forged
-- request that names someone else as the follower is refused here, not just
-- hidden in the UI.
do $$ begin
  create policy "people follow as themselves"
    on public.follows for insert
    with check (auth.uid() = follower_id);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "people unfollow as themselves"
    on public.follows for delete
    using (auth.uid() = follower_id);
exception when duplicate_object then null;
end $$;

-- Nothing about a follow is editable — you either follow or you don't — so
-- there is deliberately no update policy.


-- ===========================================================================
-- B. DIRECT MESSAGES
--
-- Three tables:
--   dm_threads   one room
--   dm_members   who is in it (two people; group chat is not built)
--   dm_messages  what was said
--
-- pair_key is what makes "open a chat with this person" idempotent AND
-- race-safe: it is the two user ids sorted and joined, so both people
-- generate the same key and the unique constraint collapses a double-open
-- into one room instead of two half-empty ones.
-- ===========================================================================

create table if not exists public.dm_threads (
  id              bigint generated always as identity primary key,

  -- 'uuidA:uuidB', sorted. Only meaningful for one-to-one rooms; left null if
  -- group chats are ever added, which is why it is nullable rather than
  -- not-null. Unique treats nulls as distinct, so that stays possible.
  pair_key        text unique,

  created_at      timestamptz not null default now(),
  last_message_at timestamptz not null default now()
);

create table if not exists public.dm_members (
  thread_id    bigint not null references public.dm_threads(id) on delete cascade,
  user_id      uuid   not null references auth.users(id) on delete cascade,

  -- Everything newer than this, from anyone else, counts as unread. Null
  -- means "never opened", so the whole room is unread.
  last_read_at timestamptz,

  joined_at    timestamptz not null default now(),
  primary key (thread_id, user_id)
);

create index if not exists dm_members_user_idx on public.dm_members (user_id);

create table if not exists public.dm_messages (
  id         bigint generated always as identity primary key,
  thread_id  bigint not null references public.dm_threads(id) on delete cascade,
  sender_id  uuid   not null references auth.users(id) on delete cascade,
  body       text   not null check (char_length(trim(body)) between 1 and 4000),
  created_at timestamptz not null default now()
);

create index if not exists dm_messages_thread_idx on public.dm_messages (thread_id, created_at);

alter table public.dm_threads  enable row level security;
alter table public.dm_members  enable row level security;
alter table public.dm_messages enable row level security;


-- ---------------------------------------------------------------------------
-- Membership test
--
-- Every policy below is "are you in this room?", and the answer lives in
-- dm_members — which is itself a table with policies on it. Asking that
-- question directly inside dm_members' own policy is infinite recursion, and
-- Postgres refuses the query outright.
--
-- security definer is the way out: the function runs as its owner and so
-- reads dm_members without RLS, answers one boolean, and the recursion never
-- starts. It takes the user id as an argument rather than calling auth.uid()
-- internally so the policies stay readable about whose membership they mean.
-- ---------------------------------------------------------------------------

create or replace function public.is_dm_member(p_thread bigint, p_user uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.dm_members m
    where m.thread_id = p_thread
      and m.user_id   = p_user
  );
$$;

-- anon is granted execute alongside authenticated on purpose. Policy
-- expressions run as the querying role, so a signed-out request that touches
-- one of these tables would fail with "permission denied for function"
-- instead of the empty result it should get. auth.uid() is null for anon, so
-- the function simply answers false and the policy denies the row cleanly.
revoke execute on function public.is_dm_member(bigint, uuid) from public;
grant  execute on function public.is_dm_member(bigint, uuid) to authenticated, anon;


-- ---------------------------------------------------------------------------
-- Policies
--
-- The whole privacy guarantee is these three select policies: a room, its
-- membership and its messages are visible only to people who are in it. A
-- hand-crafted request for someone else's thread id returns zero rows.
-- ---------------------------------------------------------------------------

do $$ begin
  create policy "members read their own rooms"
    on public.dm_threads for select
    using (public.is_dm_member(id, auth.uid()));
exception when duplicate_object then null;
end $$;

-- Rooms are created only through dm_open() below, which is security definer.
-- No insert/update/delete policy exists here on purpose, so a client cannot
-- conjure a room or add itself to one.

do $$ begin
  create policy "members see who else is in their rooms"
    on public.dm_members for select
    using (public.is_dm_member(thread_id, auth.uid()));
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "members mark their own row read"
    on public.dm_members for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

-- The update policy above checks the ROW. This column grant restricts which
-- COLUMNS may appear in a SET clause at all, so "mark as read" cannot be
-- turned into "move myself to another thread". Same pairing schema-progress
-- uses on profiles.
revoke update on public.dm_members from anon, authenticated;
grant  update (last_read_at) on public.dm_members to authenticated;

do $$ begin
  create policy "members read their room's messages"
    on public.dm_messages for select
    using (public.is_dm_member(thread_id, auth.uid()));
exception when duplicate_object then null;
end $$;

-- Both halves matter: you must be the sender, AND the room must be yours.
-- Without the second test someone could post into a stranger's room as
-- themselves.
do $$ begin
  create policy "members send as themselves"
    on public.dm_messages for insert
    with check (
      auth.uid() = sender_id
      and public.is_dm_member(thread_id, auth.uid())
    );
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "senders delete their own messages"
    on public.dm_messages for delete
    using (auth.uid() = sender_id);
exception when duplicate_object then null;
end $$;

-- Messages are not editable after the fact — no update policy on purpose.


-- ---------------------------------------------------------------------------
-- Keep dm_threads.last_message_at current
--
-- security definer because the sender has no update policy on dm_threads —
-- and shouldn't; ordering the conversation list is the database's job, not
-- something a client should be able to set by hand.
-- ---------------------------------------------------------------------------

create or replace function public.dm_touch_thread()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.dm_threads
  set last_message_at = new.created_at
  where id = new.thread_id;

  return new;
end;
$$;

do $$ begin
  create trigger dm_messages_touch_thread
    after insert on public.dm_messages
    for each row execute function public.dm_touch_thread();
exception when duplicate_object then null;
end $$;


-- ---------------------------------------------------------------------------
-- dm_open(other) — the only way a room is ever created
--
-- Returns the existing room between you and `other`, or makes one. Security
-- definer because it has to insert the OTHER person's membership row, which
-- no RLS policy allows a client to do (and shouldn't — that is how you would
-- add yourself to a stranger's conversation).
--
-- The `on conflict do nothing` + re-select is what handles two people
-- pressing Message at the same instant: one insert wins, the other reads the
-- winner's row instead of creating a duplicate room.
-- ---------------------------------------------------------------------------

create or replace function public.dm_open(p_other uuid)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_me     uuid := auth.uid();
  v_key    text;
  v_thread bigint;
begin
  if v_me is null then
    raise exception 'Sign in to send a message.' using errcode = '28000';
  end if;

  if p_other is null or p_other = v_me then
    raise exception 'Pick someone else to message.' using errcode = '22023';
  end if;

  if not exists (select 1 from public.profiles where uid = p_other) then
    raise exception 'That account does not exist.' using errcode = '22023';
  end if;

  v_key := case
             when v_me < p_other then v_me::text || ':' || p_other::text
             else                     p_other::text || ':' || v_me::text
           end;

  select id into v_thread from public.dm_threads where pair_key = v_key;
  if v_thread is not null then
    return v_thread;
  end if;

  insert into public.dm_threads (pair_key)
  values (v_key)
  on conflict (pair_key) do nothing
  returning id into v_thread;

  if v_thread is null then
    -- Someone else created it between the select and the insert.
    select id into v_thread from public.dm_threads where pair_key = v_key;
    return v_thread;
  end if;

  insert into public.dm_members (thread_id, user_id)
  values (v_thread, v_me), (v_thread, p_other);

  return v_thread;
end;
$$;

revoke execute on function public.dm_open(uuid) from public;
grant  execute on function public.dm_open(uuid) to authenticated;


-- ---------------------------------------------------------------------------
-- dm_overview — one query for the whole conversation list
--
-- Room, the other person, the last thing said and how much of it is unread.
-- Without this the client needs four round trips per render.
--
-- security_invoker means it is read with the caller's own permissions, so the
-- policies above still apply through it: you only ever see rows for rooms you
-- are in. The client still filters on viewer_id, because a room has two
-- member rows and only one of them is yours.
-- ---------------------------------------------------------------------------

create or replace view public.dm_overview
with (security_invoker = true) as
select
  t.id                 as thread_id,
  me.user_id           as viewer_id,
  me.last_read_at,
  t.last_message_at,
  other.user_id        as other_id,
  p.username           as other_username,
  p.avatar_url         as other_avatar_url,
  lm.body              as last_body,
  lm.sender_id         as last_sender_id,
  lm.created_at        as last_created_at,
  (
    select count(*)
    from public.dm_messages m
    where m.thread_id  = t.id
      and m.sender_id <> me.user_id
      and m.created_at > coalesce(me.last_read_at, '-infinity'::timestamptz)
  )                    as unread_count
from public.dm_threads t
join public.dm_members me
  on me.thread_id = t.id
join public.dm_members other
  on other.thread_id = t.id
 and other.user_id  <> me.user_id
left join public.public_profiles p
  on p.uid = other.user_id
left join lateral (
  select m.body, m.sender_id, m.created_at
  from public.dm_messages m
  where m.thread_id = t.id
  order by m.created_at desc, m.id desc
  limit 1
) lm on true;

grant select on public.dm_overview to authenticated;


-- ---------------------------------------------------------------------------
-- Realtime
--
-- Messages stream to the other person's open tab instead of waiting for a
-- poll. RLS still applies to the stream, so a subscriber is only ever sent
-- rows from rooms they are in.
--
-- Wrapped because adding a table that is already in the publication is an
-- error, and this file is meant to be safe to re-run.
-- ---------------------------------------------------------------------------

do $$ begin
  alter publication supabase_realtime add table public.dm_messages;
exception
  when duplicate_object then null;
  when undefined_object then null;  -- publication missing entirely
end $$;
