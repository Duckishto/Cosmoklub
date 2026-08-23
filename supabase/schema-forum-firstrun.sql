-- ---------------------------------------------------------------------------
-- CosmoKlub — forum schema (FIRST RUN version)
--
-- Identical to schema-forum.sql with every `drop policy` / `drop trigger`
-- line taken out. Those lines only exist so the original can be re-run
-- safely; on a database that has never had the forum tables there is nothing
-- for them to drop. Removing them means the Supabase SQL editor no longer
-- flags the query as destructive — because now it genuinely contains no
-- destructive statement at all.
--
-- This file only ever CREATES. It does not drop, truncate or delete anything,
-- and it never mentions profiles, user_progress, lesson_completions, badges,
-- user_badges, cosmetic_items, user_cosmetics, staff_applications or
-- bug_reports except to read a username.
--
-- Use this one for the first run. If you ever need to re-run after editing,
-- use schema-forum.sql instead — it tolerates objects that already exist.
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- Threads
-- ---------------------------------------------------------------------------

create table if not exists public.forum_threads (
  id          bigint generated always as identity primary key,
  author_id   uuid not null references auth.users(id) on delete cascade,
  title       text not null check (char_length(trim(title)) between 4 and 160),
  body        text not null check (char_length(trim(body)) between 1 and 8000),

  -- Kept in step with the chip row in assets/js/components/forum.js. Adding a
  -- category means editing both.
  category    text not null check (category in (
                'Beginner Q&A', 'Equipment', 'Astrophotography',
                'Deep Sky', 'Solar System', 'News'
              )),

  -- Questions can be closed off by whoever asked. Only meaningful for
  -- 'Beginner Q&A'; the UI hides the control on every other category, and a
  -- post that is not a question simply stays false.
  solved      boolean not null default false,

  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Existing installs: add the column without touching anything else.
alter table public.forum_threads
  add column if not exists solved boolean not null default false;

create index if not exists forum_threads_created_idx  on public.forum_threads (created_at desc);
create index if not exists forum_threads_category_idx on public.forum_threads (category, created_at desc);
create index if not exists forum_threads_author_idx   on public.forum_threads (author_id, created_at desc);

alter table public.forum_threads enable row level security;

create policy "threads are readable by everyone"
  on public.forum_threads for select
  using (true);

create policy "signed-in users can post"
  on public.forum_threads for insert
  with check (auth.uid() = author_id);

create policy "authors can edit their own threads"
  on public.forum_threads for update
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

create policy "authors can delete their own threads"
  on public.forum_threads for delete
  using (auth.uid() = author_id);

-- ---------------------------------------------------------------------------
-- Replies
-- ---------------------------------------------------------------------------

create table if not exists public.forum_replies (
  id          bigint generated always as identity primary key,
  thread_id   bigint not null references public.forum_threads(id) on delete cascade,
  author_id   uuid   not null references auth.users(id) on delete cascade,
  body        text   not null check (char_length(trim(body)) between 1 and 4000),
  created_at  timestamptz not null default now()
);

create index if not exists forum_replies_thread_idx on public.forum_replies (thread_id, created_at);
create index if not exists forum_replies_author_idx on public.forum_replies (author_id, created_at desc);

alter table public.forum_replies enable row level security;

create policy "replies are readable by everyone"
  on public.forum_replies for select
  using (true);

create policy "signed-in users can reply"
  on public.forum_replies for insert
  with check (auth.uid() = author_id);

create policy "authors can delete their own replies"
  on public.forum_replies for delete
  using (auth.uid() = author_id);

-- ---------------------------------------------------------------------------
-- Likes
--
-- The primary key is (thread_id, user_id), so liking twice is impossible at
-- the database level rather than something the client has to police.
-- ---------------------------------------------------------------------------

create table if not exists public.forum_likes (
  thread_id   bigint not null references public.forum_threads(id) on delete cascade,
  user_id     uuid   not null references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (thread_id, user_id)
);

create index if not exists forum_likes_user_idx on public.forum_likes (user_id);

alter table public.forum_likes enable row level security;

create policy "likes are readable by everyone"
  on public.forum_likes for select
  using (true);

create policy "signed-in users can like"
  on public.forum_likes for insert
  with check (auth.uid() = user_id);

create policy "people can remove their own like"
  on public.forum_likes for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Notifications
--
-- Written only by the triggers below, never by the client — hence no insert
-- policy. The triggers are security definer so they can write a row owned by
-- the recipient rather than the person who caused it.
-- ---------------------------------------------------------------------------

create table if not exists public.notifications (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  actor_id    uuid references auth.users(id) on delete set null,
  type        text not null check (type in ('reply', 'like')),
  thread_id   bigint references public.forum_threads(id) on delete cascade,
  reply_id    bigint references public.forum_replies(id) on delete cascade,
  read        boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists notifications_user_idx
  on public.notifications (user_id, read, created_at desc);

alter table public.notifications enable row level security;

create policy "people read their own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "people mark their own notifications read"
  on public.notifications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "people delete their own notifications"
  on public.notifications for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Notification triggers
--
-- Both skip the case where you act on your own thread — nobody wants to be
-- told they replied to themselves.
-- ---------------------------------------------------------------------------

create or replace function public.notify_thread_reply()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  thread_author uuid;
begin
  select author_id into thread_author
  from public.forum_threads
  where id = new.thread_id;

  if thread_author is not null and thread_author <> new.author_id then
    insert into public.notifications (user_id, actor_id, type, thread_id, reply_id)
    values (thread_author, new.author_id, 'reply', new.thread_id, new.id);
  end if;

  return new;
end;
$$;

create trigger on_forum_reply_created
  after insert on public.forum_replies
  for each row execute function public.notify_thread_reply();

create or replace function public.notify_thread_like()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  thread_author uuid;
begin
  select author_id into thread_author
  from public.forum_threads
  where id = new.thread_id;

  if thread_author is not null and thread_author <> new.user_id then
    insert into public.notifications (user_id, actor_id, type, thread_id)
    values (thread_author, new.user_id, 'like', new.thread_id);
  end if;

  return new;
end;
$$;

create trigger on_forum_like_created
  after insert on public.forum_likes
  for each row execute function public.notify_thread_like();

-- ---------------------------------------------------------------------------
-- Feed view
--
-- One query for the thread list: the post, its author's username, and the
-- counts. security_invoker means the view is read with the caller's own
-- permissions, so the RLS policies above still apply through it.
-- ---------------------------------------------------------------------------

create or replace view public.forum_thread_feed
with (security_invoker = true) as
select
  t.id,
  t.author_id,
  t.title,
  t.body,
  t.category,
  t.solved,
  t.created_at,
  t.updated_at,
  p.username           as author_username,
  p.avatar_url         as author_avatar_url,
  coalesce(r.reply_count, 0) as reply_count,
  coalesce(l.like_count, 0)  as like_count
from public.forum_threads t
left join public.profiles p
  on p.uid = t.author_id
left join (
  select thread_id, count(*) as reply_count
  from public.forum_replies
  group by thread_id
) r on r.thread_id = t.id
left join (
  select thread_id, count(*) as like_count
  from public.forum_likes
  group by thread_id
) l on l.thread_id = t.id;

-- ---------------------------------------------------------------------------
-- Realtime (optional)
--
-- Uncomment to have new threads/replies/notifications stream to open tabs
-- without a refresh. Safe to leave off — the client re-fetches after every
-- action it performs itself.
-- ---------------------------------------------------------------------------

-- alter publication supabase_realtime add table public.forum_threads;
-- alter publication supabase_realtime add table public.forum_replies;
-- alter publication supabase_realtime add table public.notifications;
