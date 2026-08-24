-- CosmoKlub - forum category expansion
--
-- Run once in the Supabase SQL editor. Replaces the CHECK constraint on
-- public.threads.category with the 54-category taxonomy: six parent topics,
-- eight children each.
--
-- Safe on existing data. The six original categories ARE the six parents and
-- stay valid, so every thread already in the table satisfies the new
-- constraint. No rows are read, rewritten or deleted.
--
-- Keep in step with CATEGORY_GROUPS in assets/js/lib/forum-api.js. Adding a
-- category to the JS without adding it here makes posts in that category
-- fail on insert with a check-constraint violation.

begin;

-- The original constraint was declared inline with the column, so it carries
-- a generated name. Look it up rather than guessing, and tolerate schemas
-- where it was named differently or is already gone.
do $$
declare
  con_name text;
begin
  select conname into con_name
  from pg_constraint
  where conrelid = 'public.threads'::regclass
    and contype = 'c'
    and pg_get_constraintdef(oid) ilike '%category%';

  if con_name is not null then
    execute format('alter table public.threads drop constraint %I', con_name);
  end if;
end $$;

alter table public.threads
  add constraint threads_category_check
  check (category in (
    -- Beginner Q&A
    'Beginner Q&A', 'Getting Started', 'First Telescope',
    'Star Hopping', 'Reading Star Charts', 'Observing Basics',
    'Terminology', 'Buying Advice', 'Common Mistakes',
    -- Equipment
    'Equipment', 'Telescopes', 'Mounts',
    'Eyepieces', 'Binoculars', 'Filters',
    'Astro Cameras', 'DIY & Mods', 'Maintenance',
    -- Astrophotography
    'Astrophotography', 'Deep Sky Imaging', 'Planetary Imaging',
    'Nightscapes', 'Guiding', 'Stacking',
    'Post-Processing', 'Smartphone Astro', 'Solar Imaging',
    -- Deep Sky
    'Deep Sky', 'Galaxies', 'Nebulae',
    'Open Clusters', 'Globular Clusters', 'Supernova Remnants',
    'Messier Objects', 'NGC & IC', 'Dark Sky Sites',
    -- Solar System
    'Solar System', 'The Moon', 'Sun & Solar',
    'Mars', 'Jupiter', 'Saturn',
    'Venus & Mercury', 'Comets', 'Meteor Showers',
    -- News
    'News', 'Missions & Launches', 'Discoveries',
    'Space Agencies', 'Eclipses & Transits', 'Satellites',
    'Research Papers', 'Star Parties', 'Community'
  ));

commit;

-- If the ALTER succeeded, every existing row already passes the new check --
-- Postgres validates the constraint against the whole table before adding it.
-- To see the distribution afterwards:
--
--   select category, count(*) from public.threads group by 1 order by 2 desc;
