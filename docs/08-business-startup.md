# 08 — Le volet startup

> À lire seulement si l'envie d'en faire un vrai produit se confirme. **Conseil franc** :
> construisez-le d'abord *pour vous deux*. Si après votre voyage il vous est devenu
> indispensable, alors vous tenez peut-être quelque chose. Le meilleur produit naît d'un
> besoin qu'on vit, pas d'un business plan.

## 1. Le marché

- Apps de voyage : marché énorme mais fragmenté entre *planification* (TripIt, Wanderlog),
  *tracking* (Polarsteps) et *stockage* (Google Photos).
- **L'angle vide** : le **couple** comme unité, et le **cycle complet** dans une seule app.
- Tendance porteuse : « slow travel », expériences vs possessions, journaling, nostalgie/souvenirs.

## 2. Le segment de départ : les couples

Commencer **niche** est une force :
- Boucle virale intégrée : pour utiliser l'app, on **invite forcément son/sa partenaire** →
  chaque activation amène un 2e utilisateur, gratuitement.
- Émotionnel et collant : une mémoire de couple ne se quitte pas (coût de départ très élevé).
- Élargissement possible plus tard : familles, groupes d'amis, voyageurs solo.

## 3. Modèle économique — Freemium

| | **Gratuit** | **Premium (≈ 5–7 €/mois ou 40 €/an par foyer)** |
|---|---|---|
| Voyages | illimités | illimités |
| Photos | stockage limité / qualité standard | **illimité, pleine qualité** |
| Cartes hors ligne | 1 à la fois | illimitées |
| Recaps & stats | basiques | **avancés + recap vidéo** |
| Planificateur IA | quelques requêtes | illimité |
| Time capsules, bande-son | — | inclus |

**Revenus additionnels** (sans pub, jamais) :
- **Photobooks imprimés** à la fin d'un voyage (marge sur l'impression — fort potentiel émotionnel d'achat).
- Affiliation **éthique et non intrusive** (assurance voyage, eSIM) — uniquement si réellement utile.

> Principe : on ne vend **jamais** les données. La vie privée est un argument de vente, pas une variable.

## 4. Coûts (rappel doc 04)

- MVP perso : ~0 €/mois (+ 99 €/an Apple).
- 1 000 couples : ~50–80 €/mois.
- Le poste qui scale = **stockage photos** → R2/CDN et le premium qui le finance.

## 5. Go-to-market (si lancement public)

1. **Beta fermée** : couples voyageurs autour de vous.
2. **Contenu** : la beauté des recaps est intrinsèquement partageable (TikTok/Insti « notre voyage »).
3. **Boucle d'invitation** : intégrée au produit (le partenaire).
4. **Saisonnalité** : pousser avant les grandes périodes de départ (été, fêtes).
5. **App Store** : ASO sur « journal de voyage », « voyage à deux », « carte des voyages ».

## 6. Risques & parades

| Risque | Parade |
|---|---|
| Sync offline complexe | Le traiter **en premier** (chemin critique), tester en conditions réelles |
| Coût stockage photos | Premium illimité + R2 ; compression intelligente |
| Sur-ingénierie / scope creep | Discipline MVP stricte (doc 07), ne pas tout construire |
| Rétention entre deux voyages | Le **rituel** : « il y a un an », recap annuel, wishlist active |
| Concurrence (Polarsteps…) | Le **couple** + le **cycle complet** + l'émotion : difficile à copier d'un coup |
| Dépendance Supabase/Mapbox | Postgres standard (portable), Mapbox remplaçable par MapLibre |

## 7. Jalons « startup » (signaux, pas objectifs de vanité)

1. **Vous deux** utilisez l'app à chaque voyage sans y penser (product-market fit personnel).
2. 10 couples l'utilisent sur **2 voyages** chacun (rétention prouvée).
3. Premier euro : un couple paie le premium ou commande un photobook.
4. Rétention à **J+365** > 40 % (le vrai test d'une app « pour des années »).

La North Star reste : **souvenirs créés par voyage par couple** (doc 01). Tout le reste en découle.
