-- ---------------------------------------------------------------------------
-- CosmoKlub — Progress / XP / Badges / Cosmetics schema.
--
-- Run this AFTER supabase/schema.sql (which creates `profiles`).
-- Run once in: Supabase Dashboard → SQL Editor → New query → Run.
-- Safe to re-run for the `create table if not exists` / `create or replace
-- function` / `create or replace view` statements. The `create policy` and
-- `alter table ... add column` statements are NOT safe to blindly re-run —
-- if you need to re-apply this file, drop the listed policies first and
-- comment out columns that already exist.
--
-- WHY THIS FILE EXISTS
-- progress.js currently keeps XP/levels/ranks entirely in localStorage.
-- That's fine for a solo demo, but it means progress isn't tied to an
-- account and can be edited freely from devtools. This migration moves the
-- source of truth server-side:
--   - lesson_completions / user_progress store what's actually been done
--   - badges / user_badges and cosmetic_items / user_cosmetics are unlocked
--     server-side based on real completions, never trusted from the client
--   - a single RPC, complete_lesson(category, lesson), is the only way to
--     earn XP — everything else (badge/cosmetic grants) happens inside it
--
-- IMPORTANT — this mirrors course-data.js exactly, so it can validate a
-- lesson_id/xp pair without trusting the client:
--   - 6 fixed categories: stars, galaxies, cosmology, planets, nebulae,
--     observing
--   - each category currently has 16 lessons (`{category}-1` .. `{category}-16`,
--     25 XP for lessons 1-4, 35 XP for lessons 5-16) plus 3 section quizzes
--     (`{category}-quiz-1` .. `{category}-quiz-3`, 60 XP) and 1 final quiz
--     (`{category}-final`, 100 XP)
-- If you add/remove lessons or sections in course-data.js, update the
-- constants inside complete_lesson() below to match, or the function will
-- reject (or under/over-pay) lessons that no longer line up.
-- ---------------------------------------------------------------------------

-- ===========================================================================
-- 0. Level / rank helpers
-- Mirrors COSMOKLUB_LEVEL_THRESHOLDS and COSMOKLUB_RANKS in progress.js
-- exactly, so SQL and the client always agree on level/rank for a given XP
-- total. Level/rank are never stored — always derived from xp at read time.
-- ===========================================================================

create or replace function public.level_for_xp(p_xp integer)
returns integer
language sql
immutable
as $$
  select count(*)::integer
  from unnest(array[0,20,50,80,120,160,200,240,285,330,375,420,470,520,570,620,675,730,785,840]) as t(threshold)
  where t.threshold <= greatest(p_xp, 0);
$$;

create or replace function public.rank_for_level(p_level integer)
returns text
language sql
immutable
as $$
  select case
    when p_level >= 17 then 'DIAMOND'
    when p_level >= 13 then 'PLATINUM'
    when p_level >= 9  then 'GOLD'
    when p_level >= 5  then 'SILVER'
    else 'BRONZE'
  end;
$$;

grant execute on function public.level_for_xp(integer) to anon, authenticated;
grant execute on function public.rank_for_level(integer) to anon, authenticated;

-- Generic "touch updated_at" trigger, reused by several tables below.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ===========================================================================
-- 1. user_progress — one row per user per category. This is the XP total
-- that level/rank get computed from. Never written to directly by clients.
-- ===========================================================================
create table if not exists public.user_progress (
  user_id     uuid not null references public.profiles(uid) on delete cascade,
  category_id text not null check (category_id in ('stars','galaxies','cosmology','planets','nebulae','observing')),
  xp          integer not null default 0 check (xp >= 0),
  updated_at  timestamptz not null default now(),
  primary key (user_id, category_id)
);

alter table public.user_progress enable row level security;

create trigger user_progress_touch_updated_at
  before update on public.user_progress
  for each row execute procedure public.touch_updated_at();

-- Anyone signed in can read anyone's XP (needed for leaderboards/public
-- profiles). No insert/update/delete policy exists for anon/authenticated,
-- so — with RLS enabled — those operations are rejected outright no matter
-- what table-level grants exist. Only complete_lesson() (security definer,
-- owned by postgres, which bypasses RLS) can write here.
create policy "Progress is viewable by authenticated users"
  on public.user_progress for select
  using (auth.role() = 'authenticated');

-- Explicit grants rather than relying on a project's default privileges:
-- SELECT is allowed (filtered by the policy above), writes are not.
grant select on public.user_progress to authenticated;
revoke insert, update, delete on public.user_progress from anon, authenticated;

-- ===========================================================================
-- 2. lesson_completions — append-only ledger of what's actually been done.
-- This is what gates XP: complete_lesson() checks this table before ever
-- touching user_progress.xp, so replaying/spoofing a lesson can't double-pay.
-- ===========================================================================
create table if not exists public.lesson_completions (
  id           bigint generated always as identity primary key,
  user_id      uuid not null references public.profiles(uid) on delete cascade,
  category_id  text not null check (category_id in ('stars','galaxies','cosmology','planets','nebulae','observing')),
  lesson_id    text not null,
  xp_awarded   integer not null check (xp_awarded >= 0),
  completed_at timestamptz not null default now(),
  unique (user_id, category_id, lesson_id)
);

create index if not exists lesson_completions_user_id_idx on public.lesson_completions (user_id);

alter table public.lesson_completions enable row level security;

create policy "Users can view their own lesson completions"
  on public.lesson_completions for select
  using (auth.uid() = user_id);

grant select on public.lesson_completions to authenticated;
revoke insert, update, delete on public.lesson_completions from anon, authenticated;

-- ===========================================================================
-- 3. badges — definitions (reference data, admin-managed from the Dashboard
-- Table Editor / service role — never written by clients).
-- criteria_type / criteria_value describe how check_and_grant_rewards()
-- below decides who's earned a badge:
--   'complete_category' | criteria_value = a category id, e.g. 'stars'
--                          → all 20 items (16 lessons + 3 quizzes + final)
--                          in that category completed
--   'category_rank'     | criteria_value = '{category}:{RANK}', e.g.
--                          'stars:DIAMOND' → that category reached the rank
--   'overall_rank'      | criteria_value = a rank name, e.g. 'DIAMOND'
--                          → average level across all 6 categories reaches it
-- ===========================================================================
create table if not exists public.badges (
  id             bigint generated always as identity primary key,
  slug           text not null unique,
  name           text not null,
  description    text,
  icon_url       text,
  criteria_type  text not null check (criteria_type in ('complete_category', 'category_rank', 'overall_rank')),
  criteria_value text not null,
  created_at     timestamptz not null default now()
);

alter table public.badges enable row level security;

-- Badge definitions are harmless to show to anyone (even logged-out
-- visitors browsing a "badges" page), so this is readable by all.
create policy "Badges are publicly viewable"
  on public.badges for select
  using (true);

grant select on public.badges to anon, authenticated;
revoke insert, update, delete on public.badges from anon, authenticated;

-- ===========================================================================
-- 4. user_badges — badges a user has actually earned. Only ever inserted by
-- check_and_grant_rewards() (called from complete_lesson()), never by a
-- direct client write.
-- ===========================================================================
create table if not exists public.user_badges (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references public.profiles(uid) on delete cascade,
  badge_id   bigint not null references public.badges(id) on delete cascade,
  earned_at  timestamptz not null default now(),
  unique (user_id, badge_id)
);

create index if not exists user_badges_user_id_idx on public.user_badges (user_id);

alter table public.user_badges enable row level security;

-- Viewable by any signed-in user so badges can show up on other people's
-- profiles, not just your own.
create policy "Earned badges are viewable by authenticated users"
  on public.user_badges for select
  using (auth.role() = 'authenticated');

grant select on public.user_badges to authenticated;
revoke insert, update, delete on public.user_badges from anon, authenticated;

-- ===========================================================================
-- 5. cosmetic_items — definitions (avatar frames, banners, titles, themes,
-- decorative badge icons). Reference data, admin-managed, never client-written.
-- unlock_type / unlock_requirement, checked in check_and_grant_rewards():
--   'level' | unlock_requirement = a level number as text, e.g. '10'
--             → granted once the relevant category reaches that level
--   'rank'  | unlock_requirement = a rank name, e.g. 'GOLD'
--             → granted once the relevant category reaches that rank
--   'badge' | unlock_requirement = a badge slug
--             → granted once the user owns that badge
--   'event' | anything else — NOT auto-granted; hand these out manually
--             from the Dashboard (seasonal/promo items)
-- ===========================================================================
create table if not exists public.cosmetic_items (
  id                 bigint generated always as identity primary key,
  slug               text not null unique,
  name               text not null,
  type               text not null check (type in ('avatar_frame', 'banner', 'title', 'theme', 'badge_icon')),
  rarity             text not null default 'common' check (rarity in ('common', 'rare', 'epic', 'legendary')),
  unlock_type        text not null check (unlock_type in ('level', 'rank', 'badge', 'event')),
  unlock_requirement text not null,
  image_url          text,
  created_at         timestamptz not null default now()
);

alter table public.cosmetic_items enable row level security;

create policy "Cosmetic items are publicly viewable"
  on public.cosmetic_items for select
  using (true);

grant select on public.cosmetic_items to anon, authenticated;
revoke insert, update, delete on public.cosmetic_items from anon, authenticated;

-- ===========================================================================
-- 6. user_cosmetics — a user's unlocked inventory. Ownership rows (which
-- cosmetic, when unlocked) are only ever inserted by check_and_grant_rewards().
-- The ONE thing a user can freely change is the `equipped` flag on a row
-- they already own — enforced below at the column-grant level, not just RLS,
-- so a user can never smuggle a change to cosmetic_id/user_id through an
-- update() call even if they craft the request by hand.
-- ===========================================================================
create table if not exists public.user_cosmetics (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references public.profiles(uid) on delete cascade,
  cosmetic_id bigint not null references public.cosmetic_items(id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  equipped    boolean not null default false,
  unique (user_id, cosmetic_id)
);

create index if not exists user_cosmetics_user_id_idx on public.user_cosmetics (user_id);

alter table public.user_cosmetics enable row level security;

create policy "Users can view their own cosmetics"
  on public.user_cosmetics for select
  using (auth.uid() = user_id);

create policy "Users can update their own cosmetics"
  on public.user_cosmetics for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select on public.user_cosmetics to authenticated;
revoke insert, delete on public.user_cosmetics from anon, authenticated;
revoke update on public.user_cosmetics from anon, authenticated;
grant update (equipped) on public.user_cosmetics to authenticated;

-- Equipping one avatar_frame/banner/theme/badge_icon should unequip any
-- other item of the same type the user already had equipped. This runs as
-- a side effect of the user's own allowed `equipped` update — it doesn't
-- require any extra privilege on their part.
create or replace function public.enforce_single_equipped_cosmetic()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.equipped = true then
    update public.user_cosmetics uc
    set equipped = false
    where uc.user_id = new.user_id
      and uc.id <> new.id
      and uc.equipped = true
      and uc.cosmetic_id in (
        select id from public.cosmetic_items
        where type = (select type from public.cosmetic_items where id = new.cosmetic_id)
      );
  end if;
  return new;
end;
$$;

drop trigger if exists user_cosmetics_single_equip on public.user_cosmetics;
create trigger user_cosmetics_single_equip
  after update of equipped on public.user_cosmetics
  for each row execute procedure public.enforce_single_equipped_cosmetic();

-- ===========================================================================
-- 7. profiles — extend the existing table (see supabase/schema.sql).
-- equipped_title_id / equipped_badge_id are deliberately NOT in the column
-- grant below — they point at things a user must actually own, so they can
-- only be changed through equip_title() / equip_badge() (which check
-- ownership) rather than a raw update() call.
-- ===========================================================================
alter table public.profiles
  add column if not exists display_name       text,
  add column if not exists avatar_url         text,
  add column if not exists banner_url         text,
  add column if not exists bio                text,
  add column if not exists equipped_title_id  bigint references public.cosmetic_items(id),
  add column if not exists equipped_badge_id  bigint references public.badges(id),
  add column if not exists streak_count       integer not null default 0,
  add column if not exists streak_last_date   date,
  add column if not exists updated_at         timestamptz not null default now();

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute procedure public.touch_updated_at();

-- The existing "Users can update their own profile" RLS policy from
-- schema.sql checks the ROW (auth.uid() = uid); this column-level grant
-- restricts which COLUMNS can appear in the SET clause at all, regardless
-- of RLS. Together they mean a user can only ever change these four fields
-- on their own row — not username, email, gender, equipped_*, streak_*, etc.
grant select on public.profiles to authenticated;
revoke update on public.profiles from anon, authenticated;
grant update (display_name, avatar_url, banner_url, bio) on public.profiles to authenticated;

-- ===========================================================================
-- 8. check_and_grant_rewards — internal helper called by complete_lesson().
-- Not directly callable by clients (see the revoke at the bottom): it takes
-- an arbitrary p_user, so it must only ever be invoked from another
-- security-definer function that's already pinned p_user to auth.uid().
-- ===========================================================================
create or replace function public.check_and_grant_rewards(p_user uuid, p_category text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_completed_count  integer;
  v_category_xp      integer;
  v_category_level   integer;
  v_category_rank    text;
  v_overall_rank     text;
  v_badge            record;
  v_cosmetic         record;
  v_granted_badges   jsonb := '[]'::jsonb;
  v_granted_cosmetics jsonb := '[]'::jsonb;
begin
  select count(*) into v_completed_count
  from public.lesson_completions
  where user_id = p_user and category_id = p_category;

  select coalesce(xp, 0) into v_category_xp
  from public.user_progress
  where user_id = p_user and category_id = p_category;

  v_category_level := public.level_for_xp(coalesce(v_category_xp, 0));
  v_category_rank  := public.rank_for_level(v_category_level);

  select public.rank_for_level(round(avg(public.level_for_xp(coalesce(up.xp, 0))))::int)
  into v_overall_rank
  from unnest(array['stars','galaxies','cosmology','planets','nebulae','observing']) as c(category_id)
  left join public.user_progress up
    on up.user_id = p_user and up.category_id = c.category_id;

  -- 16 lessons + 3 section quizzes + 1 final quiz = 20 completions per
  -- category once everything's done. Update this if course-data.js changes.
  for v_badge in
    select * from public.badges
    where not exists (
      select 1 from public.user_badges ub
      where ub.user_id = p_user and ub.badge_id = badges.id
    )
    and (
      (criteria_type = 'complete_category' and criteria_value = p_category and v_completed_count >= 20)
      or (criteria_type = 'category_rank' and criteria_value = p_category || ':' || v_category_rank)
      or (criteria_type = 'overall_rank' and criteria_value = v_overall_rank)
    )
  loop
    insert into public.user_badges (user_id, badge_id)
    values (p_user, v_badge.id)
    on conflict (user_id, badge_id) do nothing;

    if found then
      v_granted_badges := v_granted_badges || jsonb_build_object('slug', v_badge.slug, 'name', v_badge.name);
    end if;
  end loop;

  for v_cosmetic in
    select * from public.cosmetic_items ci
    where not exists (
      select 1 from public.user_cosmetics uc
      where uc.user_id = p_user and uc.cosmetic_id = ci.id
    )
    and (
      (ci.unlock_type = 'level' and ci.unlock_requirement ~ '^[0-9]+$' and ci.unlock_requirement::int <= v_category_level)
      or (ci.unlock_type = 'rank' and ci.unlock_requirement = v_category_rank)
      or (ci.unlock_type = 'badge' and exists (
            select 1 from public.user_badges ub
            join public.badges b on b.id = ub.badge_id
            where ub.user_id = p_user and b.slug = ci.unlock_requirement
          ))
    )
  loop
    insert into public.user_cosmetics (user_id, cosmetic_id, equipped)
    values (p_user, v_cosmetic.id, false)
    on conflict (user_id, cosmetic_id) do nothing;

    if found then
      v_granted_cosmetics := v_granted_cosmetics || jsonb_build_object('slug', v_cosmetic.slug, 'name', v_cosmetic.name, 'type', v_cosmetic.type);
    end if;
  end loop;

  return jsonb_build_object('badges', v_granted_badges, 'cosmetics', v_granted_cosmetics);
end;
$$;

revoke execute on function public.check_and_grant_rewards(uuid, text) from public, anon, authenticated;

-- ===========================================================================
-- 9. complete_lesson — the ONLY way XP is ever earned. This is the function
-- the frontend calls instead of writing to lesson_completions/user_progress
-- directly. It independently recomputes the XP for (category, lesson) from
-- the same rules course-data.js used to build them, so a forged/oversized
-- xpAmount from the client is never trusted.
-- ===========================================================================
create or replace function public.complete_lesson(p_category_id text, p_lesson_id text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid              uuid := auth.uid();
  v_xp               integer;
  v_number           integer;
  v_match            text[];
  v_inserted_id      bigint;
  v_total_xp         integer;
  v_level            integer;
  v_rank             text;
  v_newly_completed  boolean;
  v_rewards          jsonb := jsonb_build_object('badges', '[]'::jsonb, 'cosmetics', '[]'::jsonb);
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  if p_category_id not in ('stars','galaxies','cosmology','planets','nebulae','observing') then
    raise exception 'Unknown category: %', p_category_id;
  end if;

  -- Same numbering course-data.js uses: 16 lessons, then quiz-1..quiz-3
  -- per section, then a final. Keep these in sync with course-data.js.
  if p_lesson_id = p_category_id || '-final' then
    v_xp := 100;
  elsif p_lesson_id ~ ('^' || p_category_id || '-quiz-[1-3]$') then
    v_xp := 60;
  else
    v_match := regexp_match(p_lesson_id, '^' || p_category_id || '-([0-9]+)$');

    if v_match is null then
      raise exception 'Unknown lesson id % for category %', p_lesson_id, p_category_id;
    end if;

    v_number := v_match[1]::int;

    if v_number < 1 or v_number > 16 then
      raise exception 'Lesson number % out of range for category %', v_number, p_category_id;
    end if;

    v_xp := case when v_number <= 4 then 25 else 35 end;
  end if;

  insert into public.lesson_completions (user_id, category_id, lesson_id, xp_awarded)
  values (v_uid, p_category_id, p_lesson_id, v_xp)
  on conflict (user_id, category_id, lesson_id) do nothing
  returning id into v_inserted_id;

  v_newly_completed := v_inserted_id is not null;

  if v_newly_completed then
    insert into public.user_progress (user_id, category_id, xp)
    values (v_uid, p_category_id, v_xp)
    on conflict (user_id, category_id)
    do update set xp = public.user_progress.xp + excluded.xp;
  end if;

  select coalesce(xp, 0) into v_total_xp
  from public.user_progress
  where user_id = v_uid and category_id = p_category_id;

  v_total_xp := coalesce(v_total_xp, 0);
  v_level := public.level_for_xp(v_total_xp);
  v_rank  := public.rank_for_level(v_level);

  if v_newly_completed then
    v_rewards := public.check_and_grant_rewards(v_uid, p_category_id);
  end if;

  return jsonb_build_object(
    'category_id', p_category_id,
    'lesson_id', p_lesson_id,
    'newly_completed', v_newly_completed,
    'xp_awarded', case when v_newly_completed then v_xp else 0 end,
    'total_xp', v_total_xp,
    'level', v_level,
    'rank', v_rank,
    'new_badges', v_rewards -> 'badges',
    'new_cosmetics', v_rewards -> 'cosmetics'
  );
end;
$$;

grant execute on function public.complete_lesson(text, text) to authenticated;

-- ===========================================================================
-- 10. equip_title / equip_badge — the only way profiles.equipped_title_id /
-- equipped_badge_id can change. Pass null to unequip.
-- ===========================================================================
create or replace function public.equip_title(p_cosmetic_id bigint)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  if p_cosmetic_id is not null and not exists (
    select 1 from public.user_cosmetics uc
    join public.cosmetic_items ci on ci.id = uc.cosmetic_id
    where uc.user_id = v_uid and uc.cosmetic_id = p_cosmetic_id and ci.type = 'title'
  ) then
    raise exception 'You do not own that title';
  end if;

  update public.profiles set equipped_title_id = p_cosmetic_id where uid = v_uid;
end;
$$;

create or replace function public.equip_badge(p_badge_id bigint)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  if p_badge_id is not null and not exists (
    select 1 from public.user_badges where user_id = v_uid and badge_id = p_badge_id
  ) then
    raise exception 'You have not earned that badge';
  end if;

  update public.profiles set equipped_badge_id = p_badge_id where uid = v_uid;
end;
$$;

grant execute on function public.equip_title(bigint) to authenticated;
grant execute on function public.equip_badge(bigint) to authenticated;

-- ===========================================================================
-- 11. record_daily_login — optional streak tracking. Server-side date math
-- on purpose: a client-supplied "today" could be spoofed to farm streaks.
-- ===========================================================================
create or replace function public.record_daily_login()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid   uuid := auth.uid();
  v_today date := (now() at time zone 'utc')::date;
  v_last  date;
  v_count integer;
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  select streak_last_date, streak_count into v_last, v_count
  from public.profiles where uid = v_uid;

  if v_last = v_today then
    null; -- already recorded today, no change
  elsif v_last = v_today - 1 then
    v_count := coalesce(v_count, 0) + 1;
  else
    v_count := 1;
  end if;

  update public.profiles
  set streak_count = v_count, streak_last_date = v_today
  where uid = v_uid;

  return jsonb_build_object('streak_count', v_count, 'streak_last_date', v_today);
end;
$$;

grant execute on function public.record_daily_login() to authenticated;

-- ===========================================================================
-- 12. Public-facing views. Use these for anything shown to other users
-- (leaderboards, public profile pages) instead of querying `profiles`
-- directly, so email/gender can never leak even if a future policy change
-- on `profiles` is misconfigured.
-- ===========================================================================
create or replace view public.public_profiles as
select
  p.uid,
  p.username,
  p.display_name,
  p.avatar_url,
  p.banner_url,
  p.bio,
  p.equipped_title_id,
  p.equipped_badge_id,
  p.streak_count,
  p.created_at
from public.profiles p;

grant select on public.public_profiles to authenticated;

create or replace view public.leaderboard as
select
  pp.uid,
  pp.username,
  pp.display_name,
  pp.avatar_url,
  coalesce(sum(up.xp), 0)::integer as total_xp,
  public.rank_for_level(
    round(avg(public.level_for_xp(coalesce(up.xp, 0))))::int
  ) as overall_rank
from public.public_profiles pp
left join public.user_progress up on up.user_id = pp.uid
group by pp.uid, pp.username, pp.display_name, pp.avatar_url
order by total_xp desc;

grant select on public.leaderboard to authenticated;

-- ===========================================================================
-- Not built yet, kept out of scope for this migration:
--   - user_wallet (coins) — only needed once cosmetics are purchasable
--     rather than unlocked by progress; balance changes should go through a
--     server-side function exactly like XP does, never a direct update.
--   - friends / follows — a social graph table, needed if you add a social
--     feed later; straightforward to bolt on (follower_id, followee_id,
--     unique pair, RLS: insert/delete where follower_id = auth.uid()).
-- ===========================================================================
