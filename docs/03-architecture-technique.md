# 03 — Architecture technique

## 1. Principe directeur : **offline-first + sync**

Le défi central d'une app de voyage : **on l'utilise surtout là où il n'y a pas de réseau**
(avion, métro étranger, montagne, pas de forfait data). L'architecture est donc inversée
par rapport à une app classique :

- L'app lit et écrit **toujours dans une base locale** (SQLite sur l'appareil).
- Un moteur de **synchronisation** réconcilie la base locale avec le cloud quand le réseau revient.
- L'UI ne « charge » jamais : elle affiche le local instantanément.

```
┌───────────────────────────────────────────────────────────┐
│                    APPAREIL (Théo)                         │
│  ┌──────────┐   lit/écrit   ┌──────────────┐              │
│  │   UI     │ ◀───────────▶ │ SQLite local │              │
│  │ (RN/Expo)│               │  (Drizzle)   │              │
│  └──────────┘               └──────┬───────┘              │
│                                    │ sync engine          │
└────────────────────────────────────┼──────────────────────┘
                                     │  (delta, file queue)
                          ┌──────────▼───────────┐
                          │      SUPABASE        │
                          │  ┌────────────────┐  │
                          │  │ Postgres+PostGIS│  │  ← données + géo
                          │  │ Realtime        │  │  ← collab live
                          │  │ Auth (RLS)      │  │  ← sécurité par foyer
                          │  │ Storage         │  │  ← photos/docs
                          │  │ Edge Functions  │  │  ← logique serveur
                          │  └────────────────┘  │
                          └──────────┬───────────┘
                                     │  realtime push
┌────────────────────────────────────┼──────────────────────┐
│                    APPAREIL (sa copine)  — sync miroir     │
└───────────────────────────────────────────────────────────┘
```

## 2. Les trois flux à résoudre

### a) Données structurées (itinéraire, dépenses, journal)
- **Local** : SQLite via Drizzle ORM.
- **Sync** : pull/push de deltas (`updated_at`, soft-delete via `deleted_at`).
- **Conflits** : Last-Write-Wins au niveau **champ** suffit pour un couple (faible concurrence).
  Pour le planning édité simultanément, voir (b).

### b) Édition collaborative temps réel (planning)
Deux options, selon le niveau d'ambition :
- **MVP — Supabase Realtime** : abonnement aux changements de la table `itinerary_items`.
  Présence (« qui est en ligne ») via Realtime Presence. LWW par champ. Simple, suffisant.
- **V2 — CRDT (Yjs)** : édition vraiment simultanée sans conflit (type Google Docs) si on veut
  un éditeur de notes riche partagé. À n'introduire que si le besoin se confirme.

### c) Fichiers lourds (photos, vidéos, docs)
- Capture → stockage **local immédiat** + vignette générée localement.
- **File d'upload** en arrière-plan vers Supabase Storage quand wifi/réseau dispo.
- Métadonnées (EXIF : date, GPS) extraites localement → alimentent le classement auto et la carte.
- CDN + transformation d'images (redimensionnement à la volée) pour la galerie.

## 3. Découpage en modules (bounded contexts)

```
core/        auth, foyer (couple), sync engine, offline queue
trips/       voyages, itinéraire, planning collaboratif
places/      lieux, carte, géo (PostGIS), tracé du parcours
media/       photos, vidéos, souvenirs, galerie, EXIF
journal/     entrées de journal, humeur, météo archivée
money/       budget, dépenses, split, devises
prepare/     check-lists, documents, réservations
memories/    timeline, stats, recaps, "il y a un an", time capsule
notify/      notifications, rappels, widgets
```

Chaque module = ses tables, ses écrans, sa logique de sync. Permet de livrer le MVP
puis d'ajouter des modules sans tout casser.

## 4. Sécurité & vie privée (non négociable)

- **Row Level Security (RLS) Postgres** : toute donnée appartient à un `household_id`.
  Une politique RLS garantit qu'on ne lit/écrit que les données de SON foyer. C'est la
  pierre angulaire — même une faille applicative ne laisse pas fuiter les données d'un autre couple.
- **Storage privé** : buckets non publics, accès via URLs signées à durée limitée.
- **Documents sensibles** (passeports) : chiffrement côté client avant upload (option V1).
- **Auth** : e-mail/OTP + social login (Apple obligatoire pour publier sur iOS, Google).
- **Aucune revente de données, aucun tracking publicitaire.** C'est un argument produit.
- **Export & suppression** : l'utilisateur peut tout exporter et tout supprimer (RGPD by design).

## 5. Performance & expérience premium

- **60 fps garantis** : animations sur le thread UI via Reanimated 3 (pas de pont JS).
- **Rendu carte** : Mapbox GL natif, clustering des épingles, style vectoriel custom.
- **Listes** : virtualisation (FlashList) pour des galeries de milliers de photos.
- **Démarrage instantané** : données locales, pas d'écran de chargement réseau.
- **Optimistic UI** : chaque action s'affiche immédiatement, la sync suit en silence.

## 6. Observabilité & qualité

- **Erreurs** : Sentry (crash + erreurs JS).
- **Analytics produit** : PostHog (auto-hébergeable, respectueux vie privée) sur la North Star.
- **CI/CD** : EAS Build + GitHub Actions ; mises à jour OTA via EAS Update (corriger sans repasser par les stores).
- **Tests** : unitaires (logique sync, split de dépenses, calcul de stats) + e2e (Maestro) sur les parcours clés.
