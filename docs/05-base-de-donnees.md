# 05 — Base de données

Modèle relationnel (Postgres + PostGIS). Toutes les tables portent un `household_id`
(la clé de la sécurité par foyer) et les colonnes de sync `created_at`, `updated_at`,
`deleted_at` (soft-delete pour la réconciliation offline).

## 1. Schéma conceptuel (relations)

```
households ──< household_members >── users
    │
    ├──< trips ──< trip_days
    │      │           │
    │      ├──< itinerary_items ─── places
    │      ├──< journal_entries ──< journal_blocks
    │      ├──< expenses ──< expense_shares
    │      ├──< bookings
    │      ├──< documents
    │      ├──< checklists ──< checklist_items
    │      └──< media ─── places
    │
    ├──< places (géo, PostGIS)
    ├──< wishlist_items
    ├──< memories (souvenirs : ticket, musique…)
    ├──< bucketlist_items
    └──< time_capsules
```

## 2. Tables (DDL simplifié)

### Cœur — foyer & utilisateurs
```sql
create table users (
  id            uuid primary key default gen_random_uuid(),
  email         text unique not null,
  display_name  text,
  avatar_url    text,
  created_at    timestamptz default now()
);

create table households (            -- le "couple"
  id            uuid primary key default gen_random_uuid(),
  name          text,                -- "Théo & ___"
  cover_url     text,
  created_at    timestamptz default now()
);

create table household_members (
  household_id  uuid references households(id) on delete cascade,
  user_id       uuid references users(id) on delete cascade,
  role          text default 'partner',   -- partner | owner
  joined_at     timestamptz default now(),
  primary key (household_id, user_id)
);
```

### Voyages & jours
```sql
create table trips (
  id            uuid primary key default gen_random_uuid(),
  household_id  uuid not null references households(id) on delete cascade,
  title         text not null,             -- "Japon 2026"
  cover_url     text,
  start_date    date,
  end_date      date,
  status        text default 'planning',   -- planning | ongoing | past
  budget_total  numeric(12,2),
  currency      text default 'EUR',
  destination_geom geography(point,4326),   -- centre pour la météo/carte
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

create table trip_days (
  id            uuid primary key default gen_random_uuid(),
  trip_id       uuid not null references trips(id) on delete cascade,
  date          date not null,
  weather_json  jsonb,                      -- météo archivée du jour
  mood          text,                       -- humeur du couple ce jour-là
  unique (trip_id, date)
);
```

### Lieux (géo — PostGIS)
```sql
create table places (
  id            uuid primary key default gen_random_uuid(),
  household_id  uuid not null references households(id) on delete cascade,
  name          text not null,
  category      text,                       -- resto | hôtel | musée | nature…
  geom          geography(point,4326) not null,
  address       text,
  country_code  text,                       -- alimente la stat "pays visités"
  city          text,
  visited_at    timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);
create index places_geom_idx on places using gist (geom);
```

### Planning collaboratif
```sql
create table itinerary_items (
  id            uuid primary key default gen_random_uuid(),
  trip_id       uuid not null references trips(id) on delete cascade,
  day_id        uuid references trip_days(id) on delete set null,
  place_id      uuid references places(id),
  title         text not null,
  type          text,                       -- activité | transport | repas | hébergement
  start_time    timestamptz,
  end_time      timestamptz,
  notes         text,
  cost          numeric(12,2),
  sort_order    int default 0,
  created_by    uuid references users(id),  -- attribution "qui a ajouté"
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);
```

### Journal
```sql
create table journal_entries (
  id            uuid primary key default gen_random_uuid(),
  trip_id       uuid not null references trips(id) on delete cascade,
  day_id        uuid references trip_days(id),
  author_id     uuid references users(id),
  title         text,
  body          text,                       -- markdown
  feeling       text,                       -- ressenti / humeur
  place_id      uuid references places(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);
-- journal_blocks (optionnel) pour un éditeur riche : texte/photo/carte/audio
```

### Médias & souvenirs
```sql
create table media (
  id            uuid primary key default gen_random_uuid(),
  household_id  uuid not null references households(id) on delete cascade,
  trip_id       uuid references trips(id) on delete cascade,
  day_id        uuid references trip_days(id),
  place_id      uuid references places(id),
  type          text,                       -- photo | video | audio
  storage_path  text not null,              -- chemin Supabase Storage
  thumb_path    text,
  taken_at      timestamptz,                -- EXIF → classement par jour
  geom          geography(point,4326),      -- EXIF GPS → carte
  uploaded_by   uuid references users(id),
  is_favorite   boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

create table memories (                     -- ticket, billet, resto, musique…
  id            uuid primary key default gen_random_uuid(),
  household_id  uuid not null references households(id) on delete cascade,
  trip_id       uuid references trips(id),
  place_id      uuid references places(id),
  kind          text,                       -- ticket | resto | musique | objet
  title         text,
  metadata      jsonb,                       -- ex: {spotify_track_id, restaurant, rating}
  media_id      uuid references media(id),   -- scan du ticket, pochette…
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);
```

### Argent
```sql
create table expenses (
  id            uuid primary key default gen_random_uuid(),
  trip_id       uuid not null references trips(id) on delete cascade,
  paid_by       uuid references users(id),
  amount        numeric(12,2) not null,
  currency      text default 'EUR',
  category      text,                       -- food | transport | hôtel | activité
  description   text,
  place_id      uuid references places(id),
  spent_at      timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

create table expense_shares (               -- qui doit quoi (split)
  expense_id    uuid references expenses(id) on delete cascade,
  user_id       uuid references users(id),
  share_amount  numeric(12,2) not null,
  primary key (expense_id, user_id)
);
```

### Préparation
```sql
create table bookings (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade,
  type text,                                -- flight | hotel | car | activity
  provider text, confirmation_code text,
  start_at timestamptz, end_at timestamptz,
  amount numeric(12,2), currency text,
  document_id uuid,                         -- PDF joint
  details jsonb,
  created_at timestamptz default now(), updated_at timestamptz default now(), deleted_at timestamptz
);

create table documents (                    -- coffre-fort
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households(id) on delete cascade,
  trip_id uuid references trips(id),
  kind text,                                -- passeport | visa | assurance | billet
  title text,
  storage_path text not null,               -- chiffré côté client (option)
  expires_on date,                          -- → rappel d'expiration
  created_at timestamptz default now(), updated_at timestamptz default now(), deleted_at timestamptz
);

create table checklists (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips(id) on delete cascade,
  household_id uuid not null references households(id),
  title text
);
create table checklist_items (
  id uuid primary key default gen_random_uuid(),
  checklist_id uuid references checklists(id) on delete cascade,
  label text not null,
  is_done boolean default false,
  assigned_to uuid references users(id),    -- "qui prend quoi"
  sort_order int default 0
);
```

### Souvenirs long terme & jeu
```sql
create table wishlist_items (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households(id) on delete cascade,
  title text, country_code text, geom geography(point,4326),
  notes text, source_url text, priority int,
  created_at timestamptz default now(), updated_at timestamptz default now(), deleted_at timestamptz
);

create table bucketlist_items (             -- défis à deux
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households(id) on delete cascade,
  title text not null,                      -- "voir une aurore boréale"
  is_done boolean default false,
  done_trip_id uuid references trips(id),
  proof_media_id uuid references media(id),
  created_at timestamptz default now()
);

create table time_capsules (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households(id) on delete cascade,
  trip_id uuid references trips(id),
  author_id uuid references users(id),
  body text,
  open_at date not null,                     -- date de réouverture
  is_opened boolean default false
);
```

## 3. Calculs côté base (PostGIS) — les stats « fun »

```sql
-- Distance totale parcourue d'un voyage (somme entre lieux successifs)
-- via ST_Distance sur les places ordonnées par visited_at.

-- Pays visités (distinct sur places.country_code).
-- Villes découvertes (distinct sur places.city).
-- Jours en voyage (somme des durées de trips).
```
Ces agrégats sont exposés via une **vue matérialisée** `household_stats` rafraîchie à la fin
de chaque voyage (alimente le tableau de stats et le recap annuel).

## 4. Sécurité (RLS) — exemple

```sql
alter table trips enable row level security;

create policy "membres du foyer seulement"
on trips for all
using (
  household_id in (
    select household_id from household_members where user_id = auth.uid()
  )
);
```
La même politique se décline sur **toutes** les tables porteuses de `household_id`.
C'est ce qui garantit qu'un couple ne voit jamais les données d'un autre.

## 5. Notes de modélisation

- **Soft-delete partout** (`deleted_at`) : indispensable pour synchroniser des suppressions offline.
- **`jsonb` pour le flou** (météo, détails de réservation, métadonnées de souvenir) : éviter
  d'over-modéliser ce qui varie.
- **Attribution systématique** (`created_by` / `author_id` / `paid_by`) : c'est ce qui rend
  l'expérience « à deux » — on sait toujours qui a contribué quoi.
- **`geography` plutôt que `geometry`** : calculs de distance en mètres réels sur la sphère.
