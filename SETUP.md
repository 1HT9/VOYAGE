# Démarrage du projet Voyage

Squelette **Phase 0** (cf. [`docs/07-roadmap.md`](docs/07-roadmap.md)) : Expo Router +
Supabase + base locale offline-first. L'app tourne **sans backend** (mode hors-ligne) pour
développer l'UI ; configurez Supabase pour activer la sync et l'auth.

## 1. Prérequis
- Node 20+ et npm
- L'app **Expo Go** sur ton téléphone (iOS/Android), ou un simulateur

## 2. Installation
```bash
npm install
```

## 3. Lancer en mode hors-ligne (sans Supabase)
```bash
npm start
```
Scanne le QR code avec Expo Go. Tu peux créer/supprimer des voyages : tout est stocké en
local (SQLite). C'est suffisant pour développer toute l'UI.

## 4. Activer le cloud (Supabase)
1. Crée un projet sur [supabase.com](https://supabase.com).
2. SQL Editor → colle le contenu de [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) → Run.
3. `cp .env.example .env` puis renseigne `EXPO_PUBLIC_SUPABASE_URL` et `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   (Project Settings → API).
4. Relance `npm start`. L'auth par e-mail (OTP) et la sync deviennent actives.

## 5. Structure du code
```
app/                    Routes Expo Router
  _layout.tsx           Providers (thème, query, auth, init DB locale)
  index.tsx             Redirection auth
  (auth)/sign-in.tsx    Connexion e-mail (OTP)
  (tabs)/               Aujourd'hui · Voyages · Carte · Nous
src/
  core/
    theme/              Design tokens + ThemeProvider (cf. docs/06)
    supabase/           Client Supabase
    auth/               Store d'auth (zustand)
    db/                 Base locale SQLite + Drizzle (offline-first)
    sync/               Moteur de synchronisation (squelette)
  modules/
    trips/              1er module métier (CRUD voyages, local-first)
  ui/                   Primitives (Screen, Text, Card, Button)
supabase/migrations/    Schéma Postgres + PostGIS + RLS
```

## 6. Prochaines étapes (Phase 1)
Voir la checklist détaillée dans [`docs/07-roadmap.md`](docs/07-roadmap.md). Dans l'ordre du
chemin critique : invitation du partenaire → planning temps réel → capture rapide + photos EXIF
→ carte Mapbox + cartes hors ligne.

## Scripts
| Commande | Effet |
|---|---|
| `npm start` | Démarre Expo (QR code) |
| `npm run ios` / `android` / `web` | Cible une plateforme |
| `npm run typecheck` | Vérifie les types TypeScript |
