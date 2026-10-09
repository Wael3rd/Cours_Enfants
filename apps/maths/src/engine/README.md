# Moteur d'apprentissage — API pour les écrans

TypeScript pur (aucune dépendance UI), déterministe (RNG seedable), testé dans `apps/maths/tests/`.
Tout s'importe depuis `./engine/index.ts`. L'état persistant et le store Svelte sont dans `../state/` (`app`).

## Brancher un écran (via le store)

```ts
import { app } from './state/store.svelte.ts';
await app.load();                         // une fois au démarrage (App.svelte le fait déjà)

const s = app.start('match');             // 'match' | 'sprint' | 'penalties' | 'training'
let q = s.next();                         // Question | null (null = fini -> finish())
const fb = s.submit(valeurTapee, tempsMs);// temps = du moment où le calcul s'affiche à la validation
q = s.next();
// ...
const result = app.finishSession(s);      // bilan + persiste (zones, étoiles, historique, série)
```

Sans store (tests / hors Svelte) : `startSession(profile, settings, mode, opts)` (`profile` = `app.state.profile`,
`settings` = `app.state.settings`). `opts` : `{ seed, now, zone, questions }`.

`next()` renvoie la **même** question tant qu'on n'a pas répondu. `submit()` mute le profil immédiatement
(un enfant qui quitte en cours de route garde ce qu'il a appris) ; `finish()` (idempotent) fait zones/étoiles/historique.

## Question

```ts
{ kind:'fact', id:'7+8', text:'7 + 8', op:'+', left:7, right:8, answer:15, digits:2,
  zone:8, isNew:boolean, isRetry:boolean, fact }          // faits (zones 1-9)
{ kind:'mental', id:'m:two-one-carry:38 + 7', cat, text:'38 + 7', op, left, right|null, answer, digits } // zone 10
```
- `text` est prêt à afficher (le « − » est le vrai signe moins ; compléments : `"37 + ? = 40"`).
- `digits` = nombre de chiffres de la réponse -> **validation automatique** du pavé quand autant de chiffres sont saisis.
- `isNew` : 1re rencontre du fait -> en Entraînement, montrer `s.hint()` AVANT de demander.
- `isRetry` : fait qui revient après une erreur / répétition incrémentale.

## Feedback de `submit(answer, ms)`

`{ correct, fluent, expected, hint, modelMs, becameFluent, index, total, goal?, rivalGoal?, score?, sprint?, shot? }`
- Juste ET `ms <= seuil` = **fluent**. `ms` est plafonné à 20 s.
- **Erreur** : `hint` = `VisualHint` à afficher `modelMs` (1500 ms) avec la bonne réponse (jamais punitif), puis
  `next()`. Le fait revient 2 à 4 questions plus tard ; les erreurs de fin de session sont reposées (max +3).
  Pas d'`hint` en Sprint (mesure pure).
- **Match** : `goal` = réponse fluente (« BUT ! » — une juste mais lente fait juste avancer le ballon) ;
  `rivalGoal` = but adverse ; `score {goals, rival}`. Niveau rival = `s.rivalLevel` (taux de fluence récent).
- **Sprint** : `sprint {elapsedMs, ghostMs, leadMs, errors}` -> `ghostMs` = temps cumulé du fantome (record perso) à la
  même question, `leadMs > 0` = devant le fantôme. Erreur = +3 s de pénalité, on passe à la suite.
- **Tirs au but** : `shot {scored, topCorner}` (juste = tir cadré/but ; fluent = lucarne).

## Indice visuel

`s.hint(q?)` (ou `hintFor(fact | mentalQuestion)`) -> `{ kind, zone, a, b, result, steps[{label,value}], caption, showMs }`.
`kind` : `plus-zero` · `number-line` (sauts du terrain) · `doubles` (2 équipes en miroir) · `ten-frame` (cadre à 10,
formation) · `make-ten` (amoureux de 10) · `near-double` · `plus-ten` · `plus-nine` (+10 puis −1) · `bridge-ten`
(8+5 = 8+2+3) · `fact-family` (3+5=8 -> 8−5, 8−3). `a`/`b` = quantités à dessiner, `steps` = étapes de l'animation
(`value` = position atteinte), `caption` = phrase FR à afficher/dire.

## Résultat de fin — `SessionResult`

`{ mode, questions, correct, errors, fluent, accuracy, fluentRate, avgMs, bestStreak, durationMs, stars,
newFluentFacts[], zonesWon[], missed[], newAvatarItems[], packsAvailable, streak{current,best}, perQuestion[] }`
+ Match : `goals, rivalGoals, outcome('win'|'draw'|'loss'), rivalLevel`
+ Sprint : `totalMs, medal('bronze'|'argent'|'or'|null), isRecord` (record = sans faute et plus rapide)
+ Tirs : `shotsScored`.
`zonesWon` non vide = **trophée** à fêter (cinématique `trophy`, `trophyName(zone)`), puis la zone suivante est déjà débloquée.

## Modes

| Mode | Questions | Contenu |
|---|---|---|
| `match` | minutes × 10 (réglage parent, 2/3/5 min) | mélange ~15 % nouveaux (max 2 non maîtrisés à la fois) / ~60 % dus ou non fluents / ~25 % fluents ; en zone 10 : 50 % calcul mental |
| `sprint` | 10 | faits connus, tous différents ; `profile.sprint.ghost` = fantôme |
| `penalties` | 5 | les 5 faits les plus difficiles (erreurs, lenteur, boîte basse) |
| `training` | 15 (`zone` choisie, défaut zone en cours) | uniquement les faits de la zone ; zone 10 = mental seul |

Médailles Sprint (`sprintMedal`, ref = 10 × seuil) : bronze ≤ ref (≤ 2 erreurs) · argent ≤ 0,8 ref et ≤ 1,1 × record
(≤ 1 erreur) · or ≤ 0,6 ref, ou record battu sous 0,8 ref (0 erreur).

## Match de détection (1er lancement)

```ts
const ps = app.startPlacement();          // ~2 min, 3 sondes par zone, arrêt après 2 zones ratées de suite
while ((q = ps.next())) ps.submit(valeur, ms);   // retour { correct, fluent, expected, zone, index } (pas d'indice)
const r = app.finishSession(ps);          // { zonesPassed, focusZone, prefilled, zonesWon, stars }
```
Pré-remplit les faits des zones réussies (boîte 3, `inferred`), place l'enfant dans la 1re zone non réussie.

## Zones, progression, parent

`ZONES` (10), `zoneFacts(z)`, `FACT_ZONE`. `app.state.profile.progress` : `focusZone` (zone en cours), `maxUnlocked`,
`zonesWon`. Zone gagnée = ≥ 80 % de faits fluents (fluent = juste ET ≤ seuil, 2 fois de suite). `app.forceZone(z)` =
forçage parent. Stats : `heatmap(progress,'+'|'-',T)`, `avgTimeSeries(history)`, `summary(profile,T)`.

## Récompenses (`profile.rewards`)

- Étoiles par session (`computeStars`) : 1 + précision ≥ 80 % + fluence ≥ 50 % + bonus de mode (victoire / médaille
  argent+ / ≥ 4 tirs) + zone gagnée, max 5. `PACK_COST` = 6 étoiles par paquet.
- Cartes : `CARDS` (48 joueurs fictifs, `cards.json`, raretés bronze/argent/or/legende), `packsAvailable(rewards)`,
  `openPack(rewards, rng, now)` -> `Card | null` (jamais de doublon), `starsToNextPack`.
- Avatar : `AVATAR_ITEMS`, `unlockedAvatarIds({rewards, zonesWon})`, `setAvatar(ctx, 'jersey'|'boots', id)`.
- Série de jours douce : `rewards.streak` (1 jour manqué ne casse rien ; au-delà elle repart à 1, le record reste).

## À savoir

- Après un `finish()`, appeler `app.save()` n'est pas nécessaire (`finishSession` persiste). Si vous mutez l'état
  autrement, appelez `app.save()`.
- Horloge et hasard injectables (`opts.now`, `opts.seed`/`opts.rng`) pour les tests et les captures.
- Seuil de fluence réglable : 3 / 2,5 / 2 s (`settings.thresholdMs`) ; les statuts se recalculent à la volée.
