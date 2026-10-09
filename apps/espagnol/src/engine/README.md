# Moteur du RPG — API pour les écrans

TS pur, déterministe, testé (`apps/espagnol/tests/`). Tout s'importe depuis `../engine` (index), les services depuis `../services/*`,
l'état depuis `../state/game.svelte`. Les écrans ne calculent JAMAIS la correction, l'XP ni la répétition espacée eux-mêmes.

## Boucle d'une étape (à reproduire dans l'écran de quête)

```ts
import { content } from '../engine/data';                // contenus indexés (Content)
import { gradeStep, applyStepResult, runEntry, completeQuest, type Answer } from '../engine';
import { game } from '../state/game.svelte';

const result = gradeStep(step, answer);                  // StepResult (pur)
const out = game.mutate((s) => applyStepResult(content, s, step, result, { hints, fields }));
// out.gain {stat,xp,bonus}, out.levelUps[], out.newItems[] (cartes d'inventaire nouvelles)
run.push(runEntry(step, result, hints));                  // accumule pour la fin de quête
// fin de quête :
const q = game.mutate((s) => completeQuest(content, s, quest.id, run));   // étoiles, plume, avatar, unitCompleted
```

`hints` = nombre de fois où le bouton Pista a été ouvert pour CETTE étape (0 = bonus +25 % XP). `fields` = champs de `write_free` (sauvés dans `state.profile.ficha`).

## Réponse attendue par type d'étape (`Answer`, champ `tipo` obligatoire)

| tipo | réponse |
|---|---|
| flashcard, grammar_card, cinematic_ref | `{tipo}` (toujours juste ; flashcard introduit les mots dans l'inventaire + SRS) |
| match_image | `{tipo, errors?: {vocabId: nbErreurs}}` |
| listen_choose, dialogue_choice | `{tipo, choice: indexOption}` |
| dictado, fill_blank | `{tipo, text}` |
| reorder_words | `{tipo, words: string[]}` (ordre choisi) |
| conjugar | `{tipo, terminacion}` ou `{tipo, text}` (forme complète) |
| read_answer | `{tipo, choices: number[]}` (un index par question) |
| speak | `{tipo, alts: (string \| {transcript,confidence})[]}` ou, en repli, `{tipo, self: 'bien'\|'casi'\|'no'}` |
| true_false | `{tipo, value}` |
| write_free | `{tipo, fields: {champId: valeur}}` |

`StepResult` : `outcome` ('correct' | 'partial' | 'wrong'), `score` 0..1, `warnings[]` (afficher tel quel, ex. « ¡Ojo con el acento! »),
`expected` (à montrer si pas exact), `speech` ('logrado' | 'casi' | 'repetir' | 'autoevaluacion'), `detail`, `filled` (write_free).

## Règles de correction

- **Normalisation** : minuscules, ponctuation (¿¡?!.,;:«»…-) retirée, espaces compactés. Aucune différence de casse.
- **Accent manquant ou en trop** (a/á, u/ü) = accepté, `partial`, score **0,75**, avertissement `¡Ojo con el acento!`. Le `ñ` est une vraie lettre (ano ≠ año).
- **Faute de frappe légère** : seulement pour `dictado` (distance de Damerau-Levenshtein ≤ 1 pour 5-11 lettres, ≤ 2 dès 12 ; aucun mot < 5 lettres), `partial`, score **0,6**. Pas pour `fill_blank` / `conjugar` (on teste justement la terminaison).
- **Variantes** : `respuesta` + `aceptadas`. `reorder_words` accepte `palabras.join(' ')` ou `habla.es`.
- **speak** : alternatives de la reconnaissance comparées à `objetivo.es` + `aceptadas` + `patrones` (prénom libre, jeton `{nombre}` = 1 à 3 mots quelconques). Chiffres convertis en mots (« 12 » = « doce »), accents pliés, score = LCS de mots (ordre respecté, mots à 1 faute tolérés) moins 0,25 × mots en trop. **≥ 0,85 réussi (score 1) · ≥ 0,6 presque (0,5) · sinon à refaire (0)**. Auto-évaluation = crédit plafonné (bien 0,6 / presque 0,35).
- **write_free** : un champ est valide s'il est non vide (`numero` : chiffres ou nombre en lettres 0-100) ; n'importe quel prénom est accepté.
- Items SRS dans `result.items` (`v:<vocabId>`, `p:<audio phrase>`, `g:<stepId conjugar>`) : alimentés automatiquement par `applyStepResult`.

## Progression

`unitStatus(c, s, unit, now)` → `locked | available | done | closed` ; `questStatus(c, s, questId, now)` → `locked | available | done` ;
`currentUnit(c, s)`, `nextQuest(c, s, unit)`, `activeEvents(c, s, now)` (événements ouverts), `unitProgress(s, unit)`.
Quêtes séquentielles ; unité suivante débloquée par la plume de la précédente ; unités **événement** (fenêtre `MM-DD → MM-DD`,
champ `evento: {desde, hasta}` sur l'unité, ou déduit de l'id/titre « Muertos », « Navidad ») ouvertes seulement dans la fenêtre,
hors de la séquence. Quête réussie si précision ≥ 50 % ; étoiles : ≥ 50 % → 1, ≥ 80 % → 2, ≥ 92 % → 3, moins une si pistes > 25 % des étapes
(min. 3). Meilleur résultat conservé. `bossLives(quest, nbFautes)` pour les `desafio`. Tout accepte un `now: Date` (tests / dev).

## Mision del día

```ts
const m = buildMission(content, game.state, { now, speech: speechSupport() === 'ok' && settings.speechEnabled });
// m.exercises[i] = { step, kind: 'review'|'new', items } — `step` est un Step ordinaire (ids `gen:*` pour les exercices générés)
const r = withItems(gradeStep(ex.step, answer), ex);          // rattache l'item SRS aux exercices générés
game.mutate((s) => applyStepResult(content, s, ex.step, r, { hints }));
game.mutate((s) => completeMission(s, now));                  // +25 XP, marque la journée
```

Ordre : dus d'abord (plus en retard d'abord), puis nouveaux mots de l'unité en cours (flashcard de 3 + exercice de vérification). ~15 exercices ≈ 5 min.
Exercices générés selon la maîtrise : 0-1 `listen_choose` image, 2 `listen_choose` texte (ou `match_image` x4), 3+ `dictado` ; phrases = `reorder_words` / `speak`, formes = `conjugar` d'origine.

## SRS (SM-2 simplifié) et inventaire

`srs.ts` : intervalles 1 j → 3 j → × EF (plafond 180 j), échec = retour à 0 et à revoir le jour même ; une réussite hors échéance (pratique en quête) n'allonge pas l'intervalle.
`mastery(card)` 0-5 ; `inventory(content, state)` → cartes (`rarityOf` : comun → legendario selon longueur / ñ, `mastery`).

## RPG

`xpFor(step, result, hints)`, `STAT_POR_DEFECTO` / `step.stat`, `levelInfo(xp, k)`, `playerLevel(s)`, `statLevel(s, stat)` (niveau n = k·n(n−1)/2 XP ; k = 60 par stat, 200 joueur).
Plume + élément d'avatar par région (`avatarRewardForUnit`) dans `state.unlocked` ; accessoires par niveau (`LEVEL_ITEMS`). Prénom : `playerName(state)`.

## Services

- `services/audio.ts` : `initAudio()` (une fois), `playHabla(habla.audio, {lento, text})`, `preloadHablas([...keys])`, `hasLento(key)`, `stopHabla()`.
- `services/speech.ts` : `speechSupport()` ('ok' | 'offline' | 'unsupported' | 'insecure') ; `const l = listen({onInterim, timeoutMs})` → `await l.result`
  (`{ok, alts[], failure, fallback}` ; `fallback: true` ⇒ proposer l'auto-évaluation), `l.stop()` / `l.abort()`.
- `services/accents.ts` : `ACCENT_ROW`, `layout(shift)`, `applyKey(editState, key)` (insertion au curseur, retour arrière, majuscule), `neededKeys(expected)`.
- `services/offline.ts` : audio par unité dans le cache `espagnol-audio-v1` (servi en CacheFirst par le SW ; `audio/**` n'est pas précaché).
  `game.downloadUnitAudio(unit)`, `game.autoDownload()` (unité en cours + suivante, si Wi-Fi/pas d'économiseur), `game.state.offline[unitId].status`, `game.downloads[unitId]` (progression).
- Hors-ligne, la reconnaissance vocale Chrome ne fonctionne PAS (serveurs Google) : `listen()` renvoie `failure: 'offline'`, `fallback: true`.

## État (`state/game.svelte.ts`)

`game.state` (réactif), `game.mutate(fn)` (reducer + sauvegarde différée), `game.init()` (déjà appelé par App), temps passé compté automatiquement
(app visible + toucher < 45 s). Persisté en IndexedDB (`ce:espagnol`, version `STATE_VERSION`, migrations dans `state/persist.ts`).
