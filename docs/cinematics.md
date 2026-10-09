# Cinématiques HyperFrames — mode d'emploi

Une cinématique = une composition HTML autonome (`apps/<app>/public/cinematics/<id>/index.html`), jouée en direct dans
l'app par `<hyperframes-player>` (via `@ce/core`), et rendable en MP4. Référence vivante : `goal` (app maths) ; les 7 cinématiques de l'app maths sont décrites en §7 (contrat de données) et chacune a son `STORYBOARD.md`.

## 1. Créer

1. Lire le skill `hyperframes-core` (`~/.claude/plugins/cache/hyperframes/hyperframes/0.8.143/skills/`).
2. Copier `apps/maths/public/cinematics/proof-goal/` vers `<id>/` (garder l'id = nom du dossier).
3. Contraintes du gabarit (ne pas les casser) :
   - racine `#root` avec `data-composition-id="<id>"`, `data-width="1920"`, `data-height="1200"` (16:10), `data-duration` (2 à 10 s) ;
   - une seule timeline GSAP `paused`, enregistrée **à la fin** : `window.__timelines["<id>"] = tl` ;
   - **hors-ligne** : aucun CDN. Dans le `<head>`, dans cet ordre :
     `./_shared/hyperframe.runtime.iife.js` puis `./_shared/gsap.min.js`, polices en `@font-face` sur `./_shared/*.woff2` ;
   - pas de `Math.random`, `Date.now`, réseau, `repeat: -1` non borné (voir `determinism-rules.md`) ;
   - pas de wrapper `<section class="clip">` autour de tout (warning `nested_structure_needs_subcomposition`) : éléments directement sous `#root`.
4. Pourquoi le runtime est inclus : sans lui, le player l'injecte depuis `cdn.jsdelivr.net` (cassé hors-ligne et refusé par notre test e2e).

### Dossier `_shared/` (piège)

Source de vérité : `apps/<app>/public/cinematics/_shared/` (gsap, runtime, polices). `hyperframes check/preview/render`
ne servent que le dossier de la composition (les `../` sont refusés), donc les compositions référencent `./_shared/…`
et `scripts/cinematics.mjs sync` copie `_shared/` dans chaque `<id>/_shared/` (copies **gitignorées**).
Au build, `scripts/cinematics.mjs stage` prépare un `publicDir` sans ces copies et réécrit `./_shared/` en `../_shared/` :
un seul runtime (500 Ko) par app dans `dist/` et dans le cache du service worker. `npm run dev:*` et `cinematics:check`
lancent le `sync` tout seuls. Nouvelle police/lib : la déposer dans `_shared/` + noter sa licence dans `assets/LICENSES.md`.

## 2. Prévisualiser

```
npm run cinematics:sync
npx hyperframes preview apps/maths/public/cinematics/<id>      # Studio (timeline, scrub)
```

Ou directement dans l'app : `npm run dev:maths` puis le bouton « Tester la cinématique » (adapter `CINE` dans `App.svelte`).

## 3. Valider (0 finding exigé)

```
npm run cinematics:check          # sync + `hyperframes check` sur chaque composition de chaque app
npx hyperframes check apps/maths/public/cinematics/<id>        # une seule
```

Lint + runtime + layout + motion + contraste WCAG. `npm test` vérifie en plus (Vitest) : pas de ressource réseau, id/timeline cohérents.
Piège : `check` doit recevoir le **dossier de la composition** (`[DIR]`), pas `apps/maths`.

## 4. Intégrer dans une app

```ts
import { playCinematic, preloadCinematic } from '@ce/core';

const src = `${import.meta.env.BASE_URL}cinematics/<id>/index.html`;
void preloadCinematic(src);                                   // au chargement de l'écran (optionnel)
const result = await playCinematic({ src, data: { goal: { name: 'Inès', calc: '8 + 6 = 14' } } });
// result : 'ended' | 'skipped' | 'error'   (jamais bloquant : timeout 8 s si la composition ne démarre pas)
```

Ou le composant `<Cinematic {src} {data} onend={(r) => …} />` (overlay plein écran, bouton « Passer » ≥ 64 px après 0,6 s, fondu).
Le service worker précache tout `public/` (`globPatterns` + `maximumFileSizeToCacheInBytes` = 30 Mo dans `packages/core/vite.ts`) :
rien d'autre à faire pour le hors-ligne.

## 5. Données dynamiques

Deux mécanismes, tous deux avec valeurs par défaut (la composition reste prévisualisable/rendable seule) :

- **Dans l'app (live)** : `player.setRuntimeData(canal, payload)`. Le player clone et retient le payload, le livre au runtime
  de la composition dès qu'il est prêt (rejoué si besoin). Canal = `[a-z][a-z0-9-]{0,63}`. Côté composition :
  ```js
  window.__hyperframes.registerRuntimeDataHandler("goal", (data) => { /* mettre à jour le DOM : textContent… */ });
  ```
  Le handler doit être enregistré **de façon synchrone** au chargement du script (le runtime local doit être déjà chargé,
  d'où l'ordre des `<script>`), et ne doit que poser des états statiques (texte, couleur) avant la lecture. `Cinematic`
  prend `data: { canal: payload }` et appelle `setRuntimeData` pour chaque entrée. Événements du player :
  `runtimedataapplied` / `runtimedataerror`.
- **Au rendu MP4** : variables HyperFrames — déclarées sur `<html data-composition-variables='[{id,type,label,default}]'>`,
  liées par `data-var-text="id"` (texte) / `data-var-src="id"` (image), ou lues avec `window.__hyperframes.getVariables()`.
  Valeurs : `--variables '{"name":"Inès"}'`.

Les cinématiques maths n'utilisent que le handler (live) : au rendu MP4 elles prennent leurs valeurs par défaut (déclarées en tête de script, `DEFAULTS`).

## 6. Rendre en MP4

```
npx hyperframes render apps/maths/public/cinematics/<id> --variables '{"name":"Inès","calc":"8 + 6 = 14"}' -f 30 -o renders/<id>.mp4
```

`-q draft|looks|delivery`, `--format mp4|webm|mov|gif`. `renders/` est gitignoré. 

## Vérification e2e

`npm run build && npm run e2e` : sert `dist/`, ouvre `/maths/` (1280×800), joue la cinématique, vérifie prénom injecté, aucune requête
hors origine, puis recharge hors-ligne depuis le cache SW et rejoue. Screenshots dans `tools/e2e/out/`.

## 6bis. Kit graphique `CEArt` : une source, deux usages

Le SVG des personnages, blasons, cage, stade, HUD, cartes, trophée, médaille… est écrit **une seule fois** dans
`apps/maths/src/art/core/src/*.js` (fonctions pures qui renvoient une chaîne SVG, sans import). `npm run art`
(lancé aussi par `cinematics:sync` / `check`) concatène ces fichiers en :

- `apps/maths/src/art/core/ceart.js` (+ `.d.ts`) : ESM, importé par les composants Svelte (`Player`, `Keeper`, `Coach`, `Crest`, `Ball`, `GoalNet`, `StadiumBackdrop`, `ScoreBug`, `LowerThird`, `PlayerCard`) et par `ArtDemo.svelte` (`/maths/#art`) ;
- `apps/maths/public/cinematics/_shared/ceart.js` : IIFE `window.CEArt`, chargé par les compositions (`<script src="./_shared/ceart.js">` après gsap).

Ne jamais éditer les deux fichiers générés (le test `tests/art.test.ts` vérifie qu'ils restent synchrones et que chaque SVG est bien formé).
Le rig du joueur expose des groupes `p-armL/p-armR/p-legL/p-legR/p-body/p-head/p-rig` ; `CEArt.setPose / toPose / idleCycle / runCycle`
prennent `gsap` en paramètre : mêmes animations dans l'app (boucle infinie) et dans une timeline HyperFrames (finie).
Effets déterministes : `CEArt.confetti` (balistique graine fixe), `shake`, `countUp` (piloté par la progression), `crowdFlashes`, `rays`, `sparkle`, `speedLines`.
Sons : `_shared/sfx/` (copie de `assets/sfx`, découpes avec fondus par `tools/assets/build-cine-sfx.sh`), `<audio id data-start data-duration src="./_shared/sfx/…">`.

### Patron d'une composition (à copier)

1. `DEFAULTS` + `cur` ; `registerRuntimeDataHandler(id, d => { cur = merge(d); if (ready) build(); })` **avant** la première construction.
2. `build()` : `tl.clear()` → `gsap.set(éléments, {clearProps})` → `render()` (injecte SVG/texte depuis `cur`) → ajoute les tweens → `tl.time(0)`. Appelée une fois à la fin du script, puis à chaque `setRuntimeData`.
   `clearProps: "transform,opacity"` (jamais `"all"` sur un élément dont `left/top/background` sont posés en ligne).
3. Les tweens ne ciblent que des conteneurs stables ou des éléments requêtés **dans** `build()` après `render()`.

### Pièges `hyperframes check` rencontrés

- Éléments cachés au départ : un `fromTo` doit mettre `opacity: 1` aussi dans les vars d'arrivée (`gsap_cold_seek_hidden_fromto_missing_reveal`). Plusieurs `fromTo` sur la même cible → utiliser `tl.set(…, 0)` (baseline) puis des `.to`. Deux tweens qui se touchent exactement (fin = début) déclenchent `overlapping_gsap_tweens` : décaler de 0.005 s.
- Élément à `opacity` 1 en `from` qui doit rester invisible avant son instant : utiliser `tl.set(el, {…}, t)` + `.to`, pas un `fromTo` (sinon il est visible dès t = 0).
- Texte **tourné** (`rotation`) : faux positif `text_occluded` (échantillons sur la boîte englobante) → ne pas faire tourner un bloc de texte réel, incliner via `clip-path`.
- Décors (stade, rayons, confettis, joueur) : `data-layout-ignore`. Déplacements volontaires hors cadre : `data-layout-allow-overflow`. Texte réel survolé par des confettis : `data-layout-allow-occlusion` sur les éléments texte.
- `#root, #root * { pointer-events: none }` (sinon un overlay transparent est vu comme occultant).
- Pas de texte dans les décors (panneaux LED…) : l'audit de contraste les compte.
- Secousse (`CEArt.shake`) sur un wrapper distinct de celui que la caméra anime en x/y.

## 7. Contrats de données des cinématiques maths (canal = id de la composition)

Toutes les clés sont optionnelles (valeurs par défaut) ; `team = { name, primary, secondary, initials }` (couleurs hex).

| id | durée | données | défauts |
|---|---|---|---|
| `intro-club` | 7 s | `{ name: string, club: team }` | `Léo`, Les Lions rouge/blanc `LB` |
| `match-intro` | 4 s | `{ home: team, away: team }` | Lions rouge/blanc, Aigles bleu/jaune |
| `goal` | 2,5 s | `{ name, calc, time, scoreHome, scoreAway, home?: team, away?: team }` (le score est celui **après** le but ; le bug affiche N-1 puis compte N) | `Léo`, `7 + 8 = 15`, `1,8 s`, 1-0 |
| `full-time` | 6 s | `{ home: team, away: team, scoreHome, scoreAway, win: bool, goals: int, avgTime: "1,9 s", bestStreak: int, stars: 0..3 }` | 3-2, victoire, 4, `1,9 s`, 5, 2 |
| `trophy` | 6 s | `{ competition: string, name: string }` | `Coupe des doubles`, `Léo` |
| `card-pack` | 3 s | `{ card: { name, number, position, rarity: "bronze"\|"argent"\|"or"\|"legende", primary, secondary } }` (le visage est dérivé du nom : `CEArt.avatarOf`) | Léo Martin, 10, ATT, `or`, rouge/blanc |
| `medal` | 4 s | `{ medal: "or"\|"argent"\|"bronze", time: "12,4 s", record: bool }` | `or`, `12,4 s`, `false` |

Appel : `playCinematic({ src, data: { '<id>': payload } })`. `win=false` avec score égal → « MATCH NUL » ; défaite → « BEAU MATCH ! » (jamais punitif).
Limites : au rendu MP4 les valeurs sont celles de `DEFAULTS` (pas de `--variables` câblé) ; les noms très longs sont réduits automatiquement (prénom ≤ ~12 lettres conseillé).

## 8. App espagnol — cinématiques de l'unité 1 (contrat de données)

Étape `cinematic_ref` de `u01.json` → `cinematica: "<id>"`. Une cinématique = **une ou plusieurs compositions** jouées **à la suite** par l'app
(≤ 12 s chacune, conseil HyperFrames : des plans, pas un film). Le découpage est lu dans `apps/espagnol/public/cinematics/manifest.json` :

```json
{ "u01-historia": { "parts": [ { "id": "u01-historia-1", "duration": 9.942 }, … ], "total": 39.2 } }
```

| `cinematica` (u01.json) | compositions (dossiers) | durée | contenu |
|---|---|---|---|
| `u01-intro` | `u01-intro` | 9,6 s | carte du monde (brouillard en nuages) → carte-titre « Capítulo 1 · ¡Hola! · Madrid » → skyline de Madrid, Quetzal en vol |
| `u01-historia` | `u01-historia-1` … `-4` | 9,9 + 10,0 + 9,2 + 10,1 s | Academia de Viajeros : accueil · plume + Quetzal · Sombra sur la carte · arrivée de Marina |
| `u01-capsula-hispanos` | `u01-capsula-hispanos-1`, `-2` | 9,0 + 8,7 s | planisphère explainer + compteur 600 M · 3 cartes-pays + plume vers l'ouest |
| `u01-pluma` | `u01-pluma` | 9,7 s | la Sombra se brise, plume rattrapée, le Quetzal repousse, carte → Salamanca (le brouillard se dissipe) |

Jouer = enchaîner `playCinematic({ src: '…/cinematics/<part.id>/index.html', data })` pour chaque `part`, avec les **mêmes** `data` ; `result` ≠ `'ended'` ⇒ stop.
Chaque partie démarre par un fondu depuis l'encre et finit par un fondu vers l'encre (≈ 0,3 s) : l'enchaînement est un fondu-croisé naturel.

**Données runtime** (canal `player`, `setRuntimeData('player', { name })`) — valeur par défaut `"Álex"` (rendu MP4 : `--variables '{"playerName":"Inès"}'`).
Seuls le prénom du **sous-titre** (mot « Álex » → `.pname`), la plaque d'orateur du joueur et l'initiale du pion de carte suivent le nom ;
**la voix reste `viajero.*` (« Álex »)** : les mp3 sont pré-générés (limite connue).

**Timings générés** — `node tools/cinematics/es-build.mjs` (`--check` : n'écrit rien, signale partie > 12 s / mp3 manquant). Il lit `u01.json` (répliques, titres, nom de la plume)
et la durée **réelle** des mp3 (`apps/espagnol/public/audio/es/<key>.mp3`, ffprobe + `silencedetect` pour recaler chaque mot sur les pauses de la voix), puis réécrit dans chaque `index.html` :
`window.PLAN` (plans, répliques `{who,es,key,t,d,words:[{w,t,d}]}`, SFX), les balises `<audio>` (voix copiées dans `<id>/assets/voz/`, SFX/musique dans `_shared/sfx|music/`,
musique `data-media-start` continue d'une partie à l'autre), `data-duration`, et `manifest.json`. Les animations lisent `PLAN` : **corriger une réplique ou régénérer un mp3 puis relancer le script suffit**.
La découpe en parties, les respirations (`lead`/`tail`/`min`) et les SFX (ancrés sur un plan `pN`, une réplique `lN.M` ou un mot `wN.M.K`) sont dans la constante `CINES` du script.
Un nouveau texte joué doit avoir son mp3 (`tools/tts/generate.py` avec les entrées de `audio-manifest.json`).

**Bibliothèques partagées** (`_shared/`, pas de réseau) : `qart.js` (généré par `npm run art` depuis `src/art/core/src/*.js` : `worldMap`, `explainerMap`, `madridSkyline`, `academiaRoom`,
`character` (Álex / Marina / Don Ignacio, chibis vectoriels : `charTalk`, `charWalk`, `charWave`, `charNod`, `charEmote`, `charBlink`), `quetzal*`, `sombra*`, `featherSvg`, `flagSvg`, `cloudSvg`/`mapFogHtml`, `moteField`…) ·
`qcine.js` (`QCine` : prénom du joueur, sous-titres mot à mot avec boîte JRPG + portrait + plaque d'orateur, cadre commun papel picado / grain / fondus, `talkChar`, `talkQuetzal`) ·
`qstage.js` (`QStage` : salle, personnages, caméra de salle `cam(px,py,zoom)`, ambiance).

**Pièges rencontrés** (à garder en tête pour les prochaines) :
- `gsap.fromTo` qui démarre plus tard applique son état « from » **dès t = 0** : ajouter `immediateRender: false` (flash, confettis, traits…) sinon l'élément est visible avant son tour.
- Caméra de carte : `Q.mapCamTo` passe `svgOrigin` dans le tween et **fait dériver x/y** (GSAP recale l'origine) → dans les compositions : `Q.mapCamSet(gsap, el, cible, s)` puis `Q.mapCamMove(tl, el, cible, s, at, dur, ease)` (nouveau, sans `svgOrigin`).
- Ne jamais tweener `transformOrigin` sur le conteneur de la caméra de salle (`.st-cam` : origine `0 0`, roulis via le parent `#stage`).
- `check` : `data-layout-allow-overflow` / `data-layout-allow-orbit` sur les calques volontairement plus grands que le cadre ou qui pivotent autour d'un point (bras, plumes) ; `visibility:hidden` sur le plan qui n'est pas à l'écran.
- Texte jamais fondu par `opacity` seul si possible (le contrôle de contraste échantillonne en plein fondu) : plaques d'orateur animées en `scale`.

**Brouillard de guerre de la carte** (`06-map.js`) : vrais nuages stylisés (3 couches fond indigo / lavande / crème, ombre indigo décalée, reflets, halo de traits translucides — sans filtre, léger sur tablette) ;
`mapFogClear` les écarte par couches (devant d'abord) en gonflant et en les effaçant, `mapFogDrift` les fait respirer, `mapFogHtml(id)` produit un banc pour une scène où la région n'est pas verrouillée.
Vérification visuelle : `npx hyperframes snapshot apps/espagnol/public/cinematics/<id> --at 1,3,5` (images dans `<id>/snapshots/`, gitignorées).

## 9. Cinématiques de stratégie maths (`strategy-<clé de zone>`, 9 compositions, 8,7 à 11,9 s)

Une par zone (clés de `engine/zones.ts` : echauffement, plus2, doubles, amoureux10, presquedoubles, plus10, plus9, passer-dizaine, ligue). Aucune donnée dynamique (voix pré-générée, pas de prénom).
**Les `index.html` sont générés** : `node tools/cinematics/strategy-build.mjs [--no-tts] [zone…]` assemble `tools/cinematics/strategy/template.html` + `strategy/scenes/<clé>.js` (la scène) + `strategy-scripts.json`
(phrases du Coach, badge, SFX `[phrase, fraction, fichier, volume]`). Une phrase = un mp3 Henri (`generate.py`, cache) dans `<id>/assets/vo-<i>.mp3` ; ffprobe mesure chaque durée → `window.PLAN = {t, d, total}`,
balises `<audio>`, `data-duration` (≤ 12 s, vérifié par `tests/strategy-cinematics.test.ts`). La scène lit `T(i, f)` = début de la phrase i + f × sa durée : corriger un texte puis relancer suffit.
Kit commun `_shared/strat.js` (`window.Strat` : petit joueur `token`, terrain, `frame10` = cadre à 10, `eq`, `pop/unpop/hop/arc`, Coach) + `strat.css`. Contrôle visuel : `node tools/cinematics/strategy-snap.mjs <clé…>` (une image à la fin de chaque phrase).
Branchement : `STRATEGY_CINEMATICS` (voice-lines.ts) → `playStrategy(zone)` (`lib/cine.ts`) joué dans l'Entraînement (à la place de la consigne vocale `strategy_N`) et à la 1re arrivée sur la zone de travail
(Home, 0,7 s après l'affichage ; `AppState.strategySeen` = zones déjà montrées).
