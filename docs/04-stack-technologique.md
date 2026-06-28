# 04 — Stack technologique

## Vue d'ensemble

| Couche | Choix | Pourquoi (en bref) |
|---|---|---|
| **App mobile + web** | React Native + **Expo** (TypeScript) | 1 base de code → iOS, Android, web. Écosystème mûr, OTA. |
| **Navigation** | Expo Router | Routage par fichiers, deep links, web gratuit. |
| **State / data** | TanStack Query + Zustand | Cache, optimistic UI, état léger. |
| **Base locale** | SQLite (expo-sqlite) + **Drizzle ORM** | Offline-first typé, migrations propres. |
| **Animations** | **Reanimated 3 + Moti + Skia** | 60 fps natif, transitions premium, effets canvas. |
| **Cartes** | **Mapbox** (`@rnmapbox/maps`) | Style sur-mesure + **cartes hors ligne** (clé). |
| **Backend** | **Supabase** | Postgres + PostGIS + Auth + Realtime + Storage + Edge Functions, en un. |
| **Push** | Expo Notifications | Multiplateforme, simple. |
| **Météo** | **Open-Meteo** | Gratuit, sans clé, prévisions + historique. |
| **IA** | **Claude API** (`claude-opus-4-8` / `claude-haiku-4-5`) | Planificateur, recaps, transcription de notes. |
| **Build/Deploy** | EAS Build + EAS Update | Build cloud, mises à jour OTA. |
| **Erreurs / Analytics** | Sentry + PostHog | Stabilité + métrique nord. |

---

## 1. Pourquoi React Native + Expo (et pas Flutter ou natif)

- **Une équipe de 1-2 personnes** ne peut pas maintenir iOS + Android + web séparément. RN/Expo
  donne les trois avec une base de code.
- **Web gratuit** via React Native Web : utile pour un portail de consultation des souvenirs
  sur grand écran et pour le partage.
- **Premium possible** : Reanimated + Skia permettent des animations dignes d'Apple. Le mythe
  « RN n'est pas fluide » est faux depuis la New Architecture.
- **OTA Updates** : corriger un bug pendant votre voyage sans attendre la validation App Store.
- *Alternative honnête* : **Flutter** est excellent pour l'animation et la perf. On choisit RN
  pour l'écosystème JS, le web, et l'intégration Supabase/Claude plus directe. Si tu préfères
  Dart et un rendu 100 % custom, Flutter est un choix défendable.

## 2. Pourquoi Supabase (et pas Firebase ou un backend maison)

- **Postgres = PostGIS gratuit** : on a besoin de **géo** (lieux, distances, parcours, « pays
  visités »). PostGIS calcule les km parcourus et les pays côté base. Firebase ne fait pas ça.
- **Realtime intégré** : collaboration live du planning sans serveur à écrire.
- **Row Level Security** : sécurité par foyer directement dans la base (cf. doc 03).
- **Storage + Auth + Edge Functions** inclus : pas de glue à maintenir.
- **Pas de backend à coder** au début : on parle directement à Supabase depuis l'app, on ajoute
  des Edge Functions seulement pour la logique sensible (parsing d'e-mails, appels Claude, génération de recaps).
- **Auto-hébergeable** : pas de lock-in, on peut migrer ses données (c'est du Postgres standard).

## 3. Le moteur de synchronisation

Ne pas réinventer une roue complexe. Par ordre de préférence :
1. **Maison léger** (recommandé pour démarrer) : tables avec `updated_at` / `deleted_at`,
   pull des deltas depuis `last_sync`, push de la file locale, LWW par champ. ~300 lignes, total contrôle.
2. **WatermelonDB** : si le volume de données explose, son moteur de sync est éprouvé.
3. **PowerSync / ElectricSQL** : solutions de sync Postgres↔SQLite clés en main, à considérer en V2
   si le maison devient lourd à maintenir.

## 4. Intégrations tierces (par module)

| Besoin | Service | Note |
|---|---|---|
| Vols temps réel | AeroDataBox / FlightAware | V2, payant à l'usage |
| Géocodage / lieux | Mapbox Search ou Google Places | Autocomplétion d'adresses |
| Musique | Spotify Web API | Playlist du voyage (OAuth) |
| Parsing e-mails résa | Edge Function + Claude | Forward d'e-mail → itinéraire |
| Photobook | Peecho / API d'impression | Monétisation V2 |
| Devises | exchangerate.host | Conversion dépenses |

## 5. Coût d'infrastructure (réaliste)

- **Phase MVP (vous deux)** : ~**0 €/mois**. Supabase free, Expo free, Mapbox free (50k chargements/mois),
  Open-Meteo gratuit. Seul coût : **99 €/an** compte développeur Apple (+ 25 $ une fois Google).
- **Phase lancement public (1 000 couples)** : ~**50–80 €/mois** (Supabase Pro 25 $, stockage photos, Mapbox).
- Le stockage photos est le poste qui grandit — d'où l'option **Cloudflare R2** (egress gratuit) en V2
  si les volumes montent.

## 6. Récapitulatif des versions clés à épingler

```jsonc
// orientation (à figer au démarrage du projet)
"expo": "SDK le plus récent stable",
"react-native": "New Architecture activée",
"react-native-reanimated": "^3",
"@rnmapbox/maps": "dernière stable",
"@supabase/supabase-js": "^2",
"drizzle-orm": "dernière stable",
"@tanstack/react-query": "^5"
```
