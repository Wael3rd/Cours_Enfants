# Calcul Champion — spec (app maths, 7 ans)

## Objectif pédagogique (demande de la maîtresse)

Une seule chose : **automatiser les tables d'addition et calculer additions / soustractions le plus vite possible**.
Le reste du programme est acquis. Tout le design sert la **fluence** (exactitude + vitesse de rappel), pas l'exploration.

- Faits d'addition : `a + b`, a, b ∈ [0..10] → 121 faits (a+b et b+a sont deux items, liés : réussir l'un donne un
  petit crédit à l'autre).
- Faits de soustraction : inverses, `c − a` avec c = a+b ≤ 20 → 121 faits.
- Niveau 2 "Ligue des Champions" (CE1/CE2, débloqué quand +/− sont fluents) : calcul mental à 2 chiffres généré
  (dizaines ± dizaines, 2 chiffres ± 1 chiffre sans puis avec passage de dizaine, compléments à la dizaine supérieure).
  Suivi par catégorie de compétence, pas par fait.

## Moteur d'apprentissage (le cœur — à tester unitairement, Vitest)

Par fait : tentatives, 5 derniers temps de réponse, série de réussites, boîte Leitner 0–5, dernière vue, dû (en sessions).

- **Fluent** = juste ET temps ≤ seuil T. T = 3 s par défaut, réglable par le parent (3 / 2,5 / 2 s).
- Juste & fluent → boîte +1. Juste mais lent → boîte inchangée (min 1). Faux → boîte 0 + **modélisation** :
  on montre la bonne réponse avec un visuel (cadre à 10 / ligne numérique) 1,5 s, puis le fait revient 2–4 questions
  plus tard dans la même session.
- Composition d'une session : ~15 % faits nouveaux de la zone en cours (jamais plus de 2 nouveaux non maîtrisés à la
  fois), ~60 % faits dus / non fluents, ~25 % faits fluents (confiance et rythme). Répétition incrémentale.
- **Zones** (ordre par stratégie — chaque zone = une compétition à gagner) :
  1. +0 et +1 (Échauffement) · 2. +2 · 3. Doubles · 4. Les amoureux de 10 (compléments à 10) ·
  5. Presque-doubles (6+7 = 6+6+1) · 6. +10 · 7. +9 (= +10 −1) · 8. Passer la dizaine (8+5 = 8+2+3) ·
  9. Soustractions par familles de nombres (3+5=8 → 8−5, 8−3) · 10. Ligue des Champions (calcul mental 2 chiffres)
- Zone suivante débloquée quand ≥ 80 % des faits de la zone sont fluents (le parent peut forcer).
- **Match de détection** au premier lancement (~2 min) pour pré-remplir les faits déjà connus et sauter les zones
  maîtrisées.

## Modes de jeu (accueil = vestiaire / stade du club)

1. **Match** (mode quotidien, ~3 min) : son équipe contre une équipe rivale dont le niveau = ses propres performances
   récentes (matchs serrés ; gagner = progresser). Réponse juste → le ballon avance ; réponse fluente → tir → **BUT !**
   (anim GSAP courte en jeu ; grande cinématique "but" HyperFrames aux moments clés). Coup de sifflet final → tableau
   des stats (buts, temps moyen, meilleure série).
2. **Sprint 100 m** : 10 calculs le plus vite possible, coureur qui avance à chaque réponse, **fantôme = record
   personnel**. Chrono, médailles bronze/argent/or. Mesure pure de la vitesse.
3. **Tirs au but** : 5 de ses faits les plus difficiles, gardien animé, tension. Court et ciblé.
4. **Entraînement** : apprendre la stratégie d'une zone — cinématique du coach + pratique guidée avec manipulables
   visuels (cadre à 10 = formation de joueurs, ligne numérique = terrain).

Récompenses : étoiles → **cartes joueurs à collectionner** (album façon vignettes, ouverture de paquet animée ;
joueurs fictifs, aucune vraie star ni marque), trophées par compétition, maillots/crampons pour son avatar,
série de jours d'entraînement (douce, sans punition).

## Interaction

- Calcul affiché en très grand, lisible d'un coup d'œil. Consignes **dites à voix haute** (voix française pré-générée).
- Pavé numérique géant (touches ≥ 88 px), à droite en paysage, en bas en portrait. **Validation automatique** quand le
  nombre de chiffres saisis = nombre de chiffres de la réponse. Touche effacer.
- Erreur : jamais punitive (pas de buzzer agressif) ; montrer, puis redemander plus tard.
- Prénom de l'enfant utilisé dans les cinématiques et les félicitations.

## Espace parent (porte : appui long 3 s + petit calcul de grand)

- **Carte de chaleur 11×11** pour + et pour − (gris = jamais vu, rouge = erreurs, orange = lent, vert = fluent) —
  montrable à la maîtresse.
- Courbe du temps moyen de réponse par session, historique, zones.
- Réglages : prénom, seuil de fluence, durée des sessions, son/voix, forcer une zone. Sauvegarde export/import.

## Direction artistique : "habillage TV sport pour enfants"

Référence de langage visuel : habillage des retransmissions de foot (Ligue des Champions, Téléfoot) + UI de jeu FIFA,
version enfant, colorée et chaleureuse.

- Palette : vert pelouse profond, bleu nuit de stade, jaune projecteur, blanc, accents orange/rose vifs. Lumières de stade,
  bandes diagonales, scoreboards, lower-thirds, wipes de replay.
- Typo : display condensée et sportive pour scores/titres (ex. "Bebas Neue" / "Anton"), ronde et très lisible pour
  le texte (ex. "Fredoka" / "Baloo 2"). Chiffres tabulaires.
- Personnages : footballeurs "grosse tête" (style Head Soccer / Mii) en SVG, couleurs de maillot personnalisables,
  animés (respiration, course, célébration). Objets : Fluent Emoji 3D (MIT).
- Son : sifflet, frappe, filet, foule qui monte, jingle de but — de qualité, jamais criard.

## Cinématiques HyperFrames (1920×1200, plans de 2 à 10 s)

| id | Durée | Contenu | Données |
|---|---|---|---|
| `intro-club` | ~7 s | Ouverture d'émission : balayage des projecteurs, push-in sur le stade, blason qui claque, "Bienvenue au club, {prénom} !" | prénom |
| `match-intro` | ~4 s | Écran VERSUS : blasons en whip-pan depuis les côtés, éclair diagonal, "COUP D'ENVOI" | équipes |
| `goal` | ~2,5 s | "BUUUT !" : typo qui claque avec overshoot, traînée du ballon, flash foule, confettis, lower-third "7 + 8 = 15 · 1,8 s" | calcul, temps, buteur |
| `full-time` | ~6 s | Tableau d'affichage final, stats qui comptent (count-up), étoiles gagnées | score, stats |
| `trophy` | ~6 s | Trophée qui monte sous les projecteurs, pluie de confettis, nom de la compétition | compétition |
| `card-pack` | ~3 s | Ouverture d'un paquet de cartes, carte qui se retourne avec reflet holographique | carte |
| `strategy-<zone>` | 8–15 s | Le coach explique la stratégie avec des joueurs/ballons (doubles en miroir, cadre à 10 qui se remplit, saut +10 puis −1 sur la ligne du terrain…), voix off FR | — |
