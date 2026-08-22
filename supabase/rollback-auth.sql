-- ---------------------------------------------------------------------------
-- CosmoKlub — emergency rollback for schema-auth.sql
--
-- Run this ONLY if sign-up breaks after running schema-auth.sql. It puts
-- handle_new_user() back exactly as schema.sql defines it, which is the state
-- the live site has been running on all along.
--
-- Supabase -> SQL Editor -> New query -> paste -> Run. Takes a second.
--
-- What it does NOT undo, on purpose:
--   * the avatar_url column       — harmless, and dropping it would lose data
--   * cosmoklub_unique_username() — nothing calls it once this runs
--   * the backfilled avatar URLs  — harmless
--
-- After this, e-mail sign-up works again and Google sign-up goes back to
-- failing (which is where it was before today).
-- ---------------------------------------------------------------------------

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
