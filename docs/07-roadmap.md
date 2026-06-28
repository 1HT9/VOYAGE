# 07 — Roadmap de développement

**Contrainte réelle** : aujourd'hui = **28 juin 2026**. Votre voyage = **octobre/novembre 2026**.
→ ~**3,5 mois** pour un MVP utilisable *pendant* le voyage. La roadmap est calée là-dessus.

---

## Phase 0 — Fondations (semaines 1–2, début juillet)

But : poser le socle, rien de visible mais tout en dépend.
- [ ] Projet Expo (TypeScript) + Expo Router + design tokens.
- [ ] Supabase : projet, schéma cœur (`users`, `households`, `members`, `trips`, `places`), RLS.
- [ ] Auth (Apple/Google/OTP) + création/invitation du foyer.
- [ ] Socle offline : SQLite + Drizzle + moteur de sync minimal (1 table de test).
- [ ] CI/CD : EAS Build, build de dev sur vos deux téléphones.

**Jalon** : Théo et sa copine sont connectés au **même foyer**, données synchronisées.

## Phase 1 — MVP « prêt pour le voyage » (semaines 3–10, juillet → mi-septembre)

But : tout le 🟢 de la doc 02. L'app doit être **vécue** en octobre.

**Préparer**
- [ ] Création de voyage (Japon/votre destination), dates, couverture.
- [ ] Budget (enveloppes, prévu vs réel).
- [ ] Réservations (vol/hôtel, PDF joint).
- [ ] Check-lists partagées + assignation.
- [ ] Coffre à documents **hors ligne** + rappels d'expiration.

**Vivre**
- [ ] Planning collaboratif jour par jour, **temps réel** (Supabase Realtime) + présence.
- [ ] Capture rapide (photo / note / dépense / lieu) — le bouton « + ».
- [ ] Photos classées auto par jour & lieu (EXIF), galerie.
- [ ] Journal de voyage (texte, ressenti, météo du jour).
- [ ] Carte du parcours (Mapbox) + épingles des lieux.
- [ ] **Cartes hors ligne** + file de sync robuste (le test ultime du MVP).

**Transverse**
- [ ] Notifications/rappels (check-in, départ, document).
- [ ] Polissage : animations clés, mode sombre, vide states soignés.

**Jalons**
- *Mi-août* : version interne complète, vous l'utilisez pour finir de préparer le voyage.
- *Mi-septembre* : **feature freeze**, bug-bash, on n'ajoute plus rien — on stabilise.
- *Fin septembre* : cartes hors ligne testées en conditions « avion ».

> ⚠️ Discipline : si une fonctionnalité n'est pas 🟢, elle **ne va pas** dans le MVP. Le risque
> n'est pas d'en faire trop peu, c'est d'arriver en octobre avec une app instable. Mieux vaut
> 8 fonctions solides que 15 fragiles pendant votre voyage.

## Phase 2 — V1 « après le voyage » (octobre–décembre 2026)

But : exploiter les souvenirs ramenés + combler le 🟡. Vous revenez avec des milliers de photos
et des données : on les sublime.
- [ ] Système de souvenirs (tickets, billets, resto, musique).
- [ ] Timeline des voyages au fil des années.
- [ ] Statistiques (pays, km via PostGIS, villes, jours) + carte du monde / passeport.
- [ ] Suivi des dépenses + **split** « qui doit combien » multi-devises.
- [ ] Météo archivée enrichie, galerie avancée (favoris, recherche).
- [ ] **Recap auto du voyage** (1er moment « waouh » post-voyage).

**Jalon** : *31 décembre 2026* → premier **« Votre année de voyage »**.

## Phase 3 — V2 « avancé & émotionnel » (2027)

Les différenciants long terme, par vagues :
- [ ] « Il y a un an » + resurgissement de souvenirs.
- [ ] Import auto des e-mails de réservation (Edge Function + Claude).
- [ ] Planificateur IA (Claude) + suggestions d'activités.
- [ ] Bande-son du voyage (Spotify) + notes vocales transcrites.
- [ ] Bucket list / défis à deux avec preuve photo.
- [ ] Time capsules.
- [ ] Photobook imprimable (et 1er levier de monétisation).
- [ ] Widgets écran d'accueil, app Apple Watch.
- [ ] Suivi de vol temps réel, partage de position live.

## Phase 4 — Si « vraie startup » (2027+)

Décision à prendre seulement si vous *vivez* l'app et qu'elle vous manque ailleurs :
- [ ] Beta publique fermée (amis voyageurs en couple).
- [ ] Freemium (cf. doc 08), photobook, stockage premium.
- [ ] App Store / Play Store, ASO, landing page.
- [ ] Boucles de croissance (invitation = 2e utilisateur intégré par design).

---

## Estimation d'effort (1–2 personnes)

| Phase | Durée | Charge |
|---|---|---|
| 0 — Fondations | 2 sem. | Élevée mais courte |
| 1 — MVP | 8 sem. | **Le gros morceau** |
| 2 — V1 | ~3 mois | Moyenne |
| 3 — V2 | étalé sur 2027 | Par vagues |

**Chemin critique du MVP** (à sécuriser en premier, dans l'ordre) :
`foyer + sync offline` → `voyage + planning temps réel` → `capture rapide + photos EXIF` →
`carte + cartes hors ligne`. Tout le reste se greffe dessus. Si un seul maillon doit être
parfait, c'est **la sync offline** : c'est elle qui fait ou défait l'app en voyage.
