-- Voyage — migration initiale (Phase 0)
-- Schéma cœur + PostGIS + Row Level Security par foyer.
-- Voir docs/05-base-de-donnees.md

create extension if not exists postgis;

-- ── Utilisateurs ────────────────────────────────────────────────────────────
-- On s'appuie sur auth.users (Supabase). `profiles` porte les infos publiques.
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- ── Foyer (le "couple") ─────────────────────────────────────────────────────
create table if not exists households (
  id uuid primary key default gen_random_uuid(),
  name text,
  cover_url text,
  created_at timestamptz not null default now()
);

create table if not exists household_members (
  household_id uuid not null references households(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'partner',
  joined_at timestamptz not null default now(),
  primary key (household_id, user_id)
);

-- Aide : foyers de l'utilisateur courant (utilisée par les policies).
create or replace function current_user_households()
returns setof uuid
language sql stable security definer set search_path = public as $$
  select household_id from household_members where user_id = auth.uid();
$$;

-- ── Voyages ─────────────────────────────────────────────────────────────────
create table if not exists trips (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households(id) on delete cascade,
  title text not null,
  cover_url text,
  start_date date,
  end_date date,
  status text not null default 'planning',
  budget_total numeric(12,2),
  currency text not null default 'EUR',
  destination_geom geography(point,4326),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- ── Lieux (géo) ─────────────────────────────────────────────────────────────
create table if not exists places (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households(id) on delete cascade,
  name text not null,
  category text,
  geom geography(point,4326) not null,
  address text,
  country_code text,
  city text,
  visited_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index if not exists places_geom_idx on places using gist (geom);

-- ── Planning collaboratif ───────────────────────────────────────────────────
create table if not exists itinerary_items (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade,
  household_id uuid not null references households(id) on delete cascade,
  day_date date,
  place_id uuid references places(id),
  title text not null,
  type text,
  start_time timestamptz,
  end_time timestamptz,
  notes text,
  cost numeric(12,2),
  sort_order int not null default 0,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- ── updated_at automatique ──────────────────────────────────────────────────
create or replace function touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

do $$
declare tbl text;
begin
  foreach tbl in array array['trips','places','itinerary_items'] loop
    execute format(
      'drop trigger if exists trg_touch_%1$s on %1$s;
       create trigger trg_touch_%1$s before update on %1$s
       for each row execute function touch_updated_at();', tbl);
  end loop;
end $$;

-- ── Row Level Security ──────────────────────────────────────────────────────
alter table profiles enable row level security;
alter table households enable row level security;
alter table household_members enable row level security;
alter table trips enable row level security;
alter table places enable row level security;
alter table itinerary_items enable row level security;

-- profil : chacun lit/écrit le sien
create policy profiles_self on profiles for all
  using (id = auth.uid()) with check (id = auth.uid());

-- membres : on voit les lignes de ses propres foyers
create policy members_own on household_members for select
  using (household_id in (select current_user_households()));

-- foyers : accès aux foyers dont on est membre
create policy households_member on households for all
  using (id in (select current_user_households()))
  with check (id in (select current_user_households()));

-- tables porteuses de household_id : politique uniforme "membre du foyer"
do $$
declare tbl text;
begin
  foreach tbl in array array['trips','places','itinerary_items'] loop
    execute format(
      'create policy %1$s_household on %1$s for all
         using (household_id in (select current_user_households()))
         with check (household_id in (select current_user_households()));', tbl);
  end loop;
end $$;

-- Realtime sur le planning collaboratif (cf. docs/03 §2b)
alter publication supabase_realtime add table itinerary_items;
