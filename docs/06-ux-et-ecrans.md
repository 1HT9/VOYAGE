# 06 — UX, écrans & design system

## 1. Architecture de navigation

Barre d'onglets adaptée au **cycle de vie du voyage** — l'app change de visage selon qu'on
prépare, vit ou se souvient.

```
┌─────────────────────────────────────────────┐
│              [ Onglet contextuel ]           │
│  Aujourd'hui  │  Voyages  │  Carte  │  Nous  │
└─────────────────────────────────────────────┘
         ▲ bouton flottant central "+" (capture rapide)
```

- **Aujourd'hui** — écran d'accueil intelligent qui s'adapte au contexte :
  - *Avant un voyage* : compte à rebours, check-lists à finir, prochaines réservations.
  - *Pendant* : programme du jour, météo, capture rapide, dépenses du jour.
  - *Hors voyage* : « il y a un an », wishlist, prochain voyage à planifier.
- **Voyages** — liste/timeline de tous les voyages (passés, en cours, futurs).
- **Carte** — carte du monde, parcours, lieux visités, pays coloriés.
- **Nous** — l'espace couple : stats, souvenirs, bucket list, profil du foyer.
- **« + » central** — *capture rapide* : photo / note / dépense / lieu en un geste (clé en voyage).

## 2. Les écrans (inventaire)

### Onboarding & couple
1. **Splash / accueil** — promesse émotionnelle, « commencer ».
2. **Auth** — Apple / Google / e-mail OTP.
3. **Créer/rejoindre le foyer** — inviter le/la partenaire par lien ou code. *Moment fondateur.*
4. **Personnalisation** — nom du couple, photo de couverture, premiers voyages.

### Préparation
5. **Détail voyage — onglet Préparer** — budget, réservations, check-lists, documents.
6. **Éditeur de budget** — enveloppes par catégorie, prévu vs réel (jauge animée).
7. **Réservations** — cartes vol/hôtel/activité, ajout, PDF joint.
8. **Check-list** — items cochables, assignation, templates.
9. **Coffre à documents** — grille de documents, badges d'expiration, accès hors ligne.

### Pendant le voyage
10. **Planning collaboratif** — vue jour par jour, drag & drop, présence live de l'autre.
11. **Carte du voyage** — tracé animé, épingles, sélection d'un lieu.
12. **Capture rapide** (modale du « + ») — 4 gros boutons : Photo, Note, Dépense, Lieu.
13. **Journal du jour** — éditeur, ressenti, météo auto, photos du jour.
14. **Dépenses** — liste, ajout rapide, vue « qui doit combien ».

### Souvenirs
15. **Galerie** — par voyage/jour/lieu, plein écran, favoris.
16. **Détail d'un lieu** — photos, journal, souvenirs (ticket, musique) rattachés.
17. **Recap de voyage** — diaporama auto généré, partageable.
18. **Timeline des voyages** — frise verticale au fil des années.
19. **Statistiques** — pays, km, villes, jours, carte du monde, tampons.
20. **Souvenirs** — mur des tickets/billets/musiques.
21. **Bucket list & défis** — objectifs, progression, preuve photo.
22. **Time capsules** — capsules verrouillées avec date de réouverture.
23. **Wishlist** — prochaines destinations, inspirations sauvegardées.

## 3. Parcours utilisateur de bout en bout

```
DÉCOUVERTE → FONDATION → PRÉPARATION → VOYAGE → MÉMOIRE → RITUEL
```

1. **Découverte** : Théo installe, est happé par la promesse émotionnelle.
2. **Fondation** : il crée le foyer, **invite sa copine** (activation = les *deux* sont dans l'app).
3. **Préparation** : ensemble, budget + vols + check-list + planning pour octobre. L'app envoie
   les rappels (« check-in dans 24h », « passeport ✓ »).
4. **Voyage** : chaque jour, capture rapide de photos/dépenses/notes. Le planning vit, la carte
   se dessine, le journal se remplit. **Tout marche hors ligne**, sync au wifi de l'hôtel.
5. **Mémoire** : au retour, l'app génère le **recap**. La galerie est déjà classée, les stats
   calculées. Option : commander le **photobook**.
6. **Rituel** : un an plus tard, « il y a un an à Kyoto » resurgit. Le 31/12, « votre année de
   voyage ». La wishlist appelle le prochain départ. → la boucle recommence.

C'est ce dernier point — **le rituel** — qui transforme un outil en habitude de couple, et
assure la rétention sur des années.

## 4. Design system

### Direction artistique
- **Inspiration** : Apple (clarté, profondeur, mouvement), Airbnb (chaleur, photo plein cadre),
  Notion (structure), Polarsteps (carte comme héros, tracé manuscrit).
- **Ton** : élégant, aérien, chaleureux. La **photo** est reine ; l'UI s'efface devant le souvenir.
- **Le héros, c'est le contenu** : grands visuels plein cadre, typographie soignée, beaucoup d'air.

### Tokens (orientation)
```
Couleurs
  Fond clair  #FBFAF7 (papier chaud)   Fond sombre  #0E1116
  Encre       #1A1A1A                   Accent       dégradé soleil → mer
  Accents secondaires dérivés de la photo de couverture du voyage (couleur dynamique)

Typographie
  Titres  serif éditoriale élégante (façon carnet de voyage)
  Texte   sans-serif géométrique très lisible (SF Pro / Inter)

Forme
  Rayons généreux (16–24px), ombres douces, cartes "papier"
  Mode clair ET sombre dès le départ
```

### Animations (l'effet « premium »)
- **Transitions partagées** : une photo de la grille s'agrandit en fluide vers le plein écran.
- **Parcours animé** : le tracé se dessine progressivement sur la carte (Skia).
- **Parallaxe** sur les couvertures de voyage au scroll.
- **Micro-interactions** : cocher un item, ajouter une dépense → petites célébrations (haptique + ressort).
- **Recap cinématique** : enchaînement rythmé photos/cartes/stats, façon story.
- Règle d'or : **toute animation tourne à 60 fps sur le thread UI** (Reanimated/Skia), jamais
  d'à-coups. Une animation qui rame est pire que pas d'animation.

### Accessibilité
- Contrastes AA minimum, tailles de police dynamiques, libellés VoiceOver, cibles tactiles ≥ 44px.
- Mode hors ligne clairement indiqué (jamais d'erreur anxiogène, juste « sera synchronisé »).
