# Voyage — *L'application de voyage pour les couples*

> Une plateforme qui vous accompagne **avant**, **pendant** et **après** chaque voyage.
> Pensée pour deux. Conçue pour durer des années.

---

## Le pitch en une phrase

**Polarsteps × Notion × Apple Photos, mais pour un couple** : préparez vos voyages à deux,
vivez-les ensemble en temps réel, et conservez chaque souvenir dans une mémoire commune
qui se bonifie avec le temps.

## Pourquoi maintenant, pourquoi ce produit

Les apps existantes sont **mono-usage** :
- TripIt gère les réservations mais oublie les souvenirs.
- Polarsteps trace le parcours mais n'aide pas à préparer.
- Google Photos stocke mais ne raconte rien.
- Notion est flexible mais froid et non géolocalisé.

Aucune ne traite le voyage comme une **histoire à deux qui s'étale dans le temps**.
Voyage couvre le cycle complet et place le **couple** au centre : un espace partagé,
collaboratif en temps réel, privé, et émotionnel.

## Le cœur différenciant (notre « moat »)

1. **L'espace couple** — pas des comptes individuels, un *foyer* à deux. Présence en temps réel,
   contributions attribuées, mémoire commune.
2. **Le cycle complet** — préparer → vivre → se souvenir, sans changer d'app.
3. **Offline-first** — tout fonctionne sans réseau (avion, montagne, étranger sans data).
4. **L'émotion** — recaps automatiques, « il y a un an », bande-son du voyage, time capsules.
   On ne range pas des données, on cultive des souvenirs.

---

## Structure du dossier de conception

| Document | Contenu |
|---|---|
| [`docs/01-vision-produit.md`](docs/01-vision-produit.md) | Vision, positionnement, persona, principes |
| [`docs/02-fonctionnalites.md`](docs/02-fonctionnalites.md) | Toutes les fonctionnalités + idées que tu n'avais pas envisagées |
| [`docs/03-architecture-technique.md`](docs/03-architecture-technique.md) | Architecture système, offline-first, temps réel, sécurité |
| [`docs/04-stack-technologique.md`](docs/04-stack-technologique.md) | Choix de technologies, justifiés et chiffrés |
| [`docs/05-base-de-donnees.md`](docs/05-base-de-donnees.md) | Modèle de données complet (schéma SQL + PostGIS) |
| [`docs/06-ux-et-ecrans.md`](docs/06-ux-et-ecrans.md) | Écrans, navigation, parcours utilisateur, design system |
| [`docs/07-roadmap.md`](docs/07-roadmap.md) | MVP → V1 → V2, calé sur ton voyage d'octobre/novembre |
| [`docs/08-business-startup.md`](docs/08-business-startup.md) | Modèle économique, coûts, go-to-market, risques |

---

## TL;DR technique

- **App** : React Native + Expo (TypeScript), une seule base de code pour iOS, Android et web.
- **Animations premium** : Reanimated 3 + Skia + Moti.
- **Backend** : Supabase (Postgres + PostGIS + Auth + Realtime + Storage + Edge Functions).
- **Offline-first** : base locale SQLite (Drizzle/WatermelonDB) synchronisée avec Supabase.
- **Cartes** : Mapbox (style sur-mesure + cartes hors ligne).
- **Push** : Expo Notifications. **Météo** : Open-Meteo. **IA** : Claude API (planificateur, recaps).

> Roadmap réaliste : un **MVP utilisable pour votre voyage d'octobre/novembre 2026** est
> atteignable. Voir [`docs/07-roadmap.md`](docs/07-roadmap.md).
