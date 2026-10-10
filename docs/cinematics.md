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
Effets déterministes : `CEArt.confetti` (balistique graine fixe), `shake`, `countUp` (piloté par la progression), `crowdFlashes`, `bloom`, `rays`, `sparkle`, `speedLines`.
**Mouvement sûr** (règles complètes : `docs/architecture.md`) : jamais de flash blanc plein écran (`CEArt.bloom(gsap, tl, "#flash", t, 0.22, 0.3)`
sur un `#flash` en dégradé radial chaud), `crowdFlashes` ≤ 2/s, pas de `filter` animé ni de `mix-blend-mode`. Stade :
`CEArt.stadium({ raster: "./_shared/img/", flashes: 8, lights: "img" })` (tribunes en WebP ; `lights` omis = projecteurs SVG animables,
cf. intro-club) ; fond flou = `./_shared/img/stadium-soft.webp` sous un voile noir. Chaque composition maths écoute le canal `motion`
(`registerRuntimeDataHandler("motion", d => { CEArt.setSoft(!!d.soft); if (ready) build(); })`) envoyé par `lib/cine.ts`.
Contrôle : `npm run a11y:flash` (0 échec exigé).
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

## 8. App espagnol — cinématiques des unités 1 à 4 et de l'événement Día de Muertos (contrat de données)

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
| `u02-intro` | `u02-intro` | 9,9 s | carte d'Espagne (ligne Madrid → Salamanca) → carte-titre « Capítulo 2 · Mi clase, mi cole · Salamanca » → panorama doré, cigognes, cloche muette |
| `u02-historia` | `u02-historia-1` … `-5` | 8,8 + 8,5 + 5,1 + 9,1 + 7,6 s | patio du colegio (enfants figés, cloche muette) · présentations de Diego · la plume de Marina · salle de classe + Sombra (« Sin palabras, no hay clase ») · la grenouille s'allume |
| `u02-capsula-cole` | `u02-capsula-cole-1` … `-3` | 9,3 + 8,1 + 5,7 s | el recreo / el bocadillo + boletín 0-10 (tampon « aprobado ») · pas d'uniforme, « profe », « cole » · Universidad (1218) |
| `u02-pluma` | `u02-pluma` | 10,2 s | la cloche sonne, les enfants reprennent des couleurs, la grenouille s'ouvre et libère la plume, carte → Sevilla |
| `u03-intro` | `u03-intro` | 10,1 s | carte (ligne → Sevilla) → carte-titre « Capítulo 3 · Mi familia · Sevilla » → Triana à l'heure dorée (Giralda, Torre del Oro, Guadalquivir) |
| `u03-historia` | `u03-historia-1` … `-5` | 7,8 + 6,7 + 6,5 + 9,5 + 9,1 s | ruelle et porte bleue · patio andalou (Abuela Carmen, Álex) · Lola et son chat · atelier, fresque aux noms effacés + Sombra · le carreau vert, tío Rafa |
| `u03-capsula-familias` | `u03-capsula-familias-1` … `-3` | 6,7 + 6,0 + 9,2 s | table dominicale (abuelos, tíos, primos) · « Marina Ortega García » (dos apellidos) · patio + mosaïque d'azulejos qui dessine un arbre |
| `u03-pluma` | `u03-pluma-1`, `-2` | 8,9 + 3,4 s | les noms reviennent, plume libérée, premier vol du Quetzal dans le patio · carte → México |
| `u04-intro` | `u04-intro` | 11,8 s | carte (Sevilla → Ciudad de México par-dessus l'Atlantique) → carte-titre « Capítulo 4 · ¿Cómo eres? · Ciudad de México » → travelling dans Coyoacán jusqu'à la Casa Azul |
| `u04-historia` | `u04-historia-1` … `-5` | 10,1 + 9,8 + 8,2 + 7,5 + 10,2 s | Plaza Hidalgo (Mateo arrive) · champ / contre-champ (« gorra azul ») · Casa Azul : Valentina et les autoportraits sans visage · la Sombra efface le dernier cadre · gros plan sur le cadre vide, plume verte |
| `u04-capsula-frida` | `u04-capsula-frida-1` … `-3` | 11,2 + 8,4 + 10,9 s | 1907 + façade de la Casa Azul · mur de +50 autoportraits (génériques) et miroir · fleurs, robes, carte du Mexique (Oaxaca) · singes, perroquets, xolos · façade, musée, carte |
| `u04-pluma` | `u04-pluma-1`, `-2` | 9,4 + 6,6 s | les visages et les couleurs reviennent, plume dans la main d'Álex, tour du patio du Quetzal · carte → Valencia (Don Ignacio en hologramme) |
| `e01-intro` | `e01-intro-1`, `-2` | 10,0 + 6,3 s | carte du Mexique → carte-titre « Evento · Día de Muertos · Oaxaca » → rue d'Oaxaca au crépuscule (Xóchitl, Doña Remedios, Beto) · une bougie s'éteint, l'ombre de la Sombra glisse sur le mur |
| `e01-capsula-muertos` | `e01-capsula-muertos-1` … `-4` | 7,7 + 6,6 + 10,3 + 10,4 s | calendrier 1er / 2 novembre · l'ofrenda se construit · chemin de pétales de cempasúchil · « no es Halloween » (calaveras, Catrina, ≠) + patrimoine (sceau de laurier générique, aucun logo réel) |

**Bordure régionale** (`QCine.frame`, `PLAN.meta.region` ← constante `region` de chaque entrée de `CINES`) : **le papel picado est exclusivement mexicain** (unités 4, 9, Día de Muertos : `region: 'mexico'`).
Espagne = **frise d'azulejos** (cenefa, festons en arcs, fanions sobres qui se balancent) : `QArt.azulejoFrieze` / `QArt.bunting(region, opts)`, palettes `FRIEZE_PAL` (`madrid`, `salamanca`, `sevilla`). Nouvelle région = ajouter une palette (ou un builder) dans `02-pattern.js`.
**Mouvement sûr** (spécifique à `QCine`, voir `docs/architecture.md`) : `QCine.bloom(tl, sel, at, peak, rise, fall)` (lueur douce : ≤ 0,25, montée ≥ 0,3 s) à la place de tout éclair, `QCine.shake(tl, sel, at, amp)` (≤ 10 px, oscillations ≥ 0,11 s), `QCine.setSoft` (canal `motion` = « Animaciones suaves » : classe `q-soft`, bloom/shake à 0, timelines invalidées), grain de papier = tuile WebP `_shared/img/grain.webp` (`node tools/art/es-grain.mjs`), pas de `mix-blend-mode`. Contrôle : `node tools/a11y/flash-check.mjs espagnol [--soft] [--only ids]` ; garde-fous statiques : `tests/safe-motion.test.ts`.
**Sous-titres** : mise en valeur du mot par la **couleur seule** (+ 4 px de saut en `transform`) ; mêmes `font`/graisse que le reste, espace réel entre les mots (nœud texte) : aucun reflow.
**Kit unité 4 / Mexique** (`12-mexico.js`, `08c-characters-mexico.js`) : `coyoacanSkyline` (panorama : Parroquia, kiosque, fontaine aux coyotes, jacarandas, Casa Azul à droite ; sol pavé), `plazaHidalgo` (décor de scène 3200×1200 ; `balloons` = positions, à poser avec `mxBalloonSvg` en éléments DOM), `casaAzulPatio` (2400×1200 : mur cobalt, 4 emplacements de cadres `frames`, porte au fond), `autorretrato` (figure **générique** encadrée ; états `full` / `erased` / `blank` ; `.ar-fig`, `.ar-dim`, `.ar-smudge`, `.ar-glow` animables), `casaAzulFachada` (façade isolée pour les capsules), `mxProp('mono'|'loro'|'xolo'|'espejo'|'cadre')` ; personnages Mateo, Valentina, Doña Lupita, Doña Remedios, Beto, Xóchitl (`CHARS` + `CHX`, `QStage.chr(layer, 'mateo', …)`, portraits de sous-titres déclarés dans `QCine` SPEAK). Bordure `mexico` = papel picado.
**Kit Día de Muertos / Oaxaca** (`13-oaxaca.js`, préfixe `ox`) : `oaxacaSkyline` (panorama nocturne), `patioOfrenda`, `ofrendaSvg`, `oaxacaPetalPath`, `oaxacaStall`, `oxProp` (calavera, pan de muerto, bougie…), `oxSeal` (sceau de laurier). Bougies = halos qui respirent ≥ 0,8 s ; ton joyeux et respectueux, rien d'effrayant.
**Kit unités 2-3** : `09-props.js` (`prop(campana|bocadillo|gato|guitarra|cazuela|rana|azulejo)`, `storkSvg`, `frozenKid`), `10-salamanca.js` (`fachadaUniversidad` + grenouille, `salamancaSkyline`, `colegioPatio`, `aula`), `11-sevilla.js` (`sevillaSkyline`, `callejonTriana`, `patioAndaluz`, `tallerCeramica`), `08b-characters-extra.js` (Diego, Doña Pilar, Lola, Abuela Carmen, Tío Rafa) ;
`QStage.set(root, décor)` (calques back/desks/qlayer/actors/front/light/motes, même caméra `S.camSet` / `S.cam`), `S.drift`, `S.fountain`, `S.prop` ; `_shared/qcap.js` (`QCap` : fond à points, bloc titre, pastilles, « pop » papier, étincelles) pour les capsules.
`es-build.mjs` : `--unit=u02` ne régénère qu'une unité ; une partie peut ne jouer que certaines répliques d'un plan (`plans: [{ n: 2, lines: [1] }]`).

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
Pièges supplémentaires (unité 4) : `Cap.css()` n'est appelé que par `Cap.bg`/`Cap.title` → l'appeler à la main dans une capsule sans fond ni titre (sinon les pastilles ne sont pas stylées) ; une pastille de capsule posée sur un décor clair doit apparaître par l'**échelle** (`tl.set` opacité 0 puis 1) et non par un fondu, sinon le contrôle de contraste échantillonne le fondu ; un calque de grain (`div` avec image) à opacité ≥ 0,6 est vu comme occultant par `hyperframes check` (garder ≤ 0,55) ; la carte `worldMap` est une loupe centrée sur le Mexique (zoom ×1 = Mexique ≈ 650 px de large : cadrer une carte de capsule à ×1,05, pas ×3).
Vérification visuelle : `npx hyperframes snapshot apps/espagnol/public/cinematics/<id> --at 1,3,5` (images dans `<id>/snapshots/`, gitignorées).

## 8bis. App espagnol — unités 5 à 10, finale, carte, sous-titres, plumes du Quetzal

**Une région = un kit de décors + une frise + 3 personnages** (même structure que la u04). Chaque unité a `uNN-intro`, `uNN-historia`, `uNN-capsula-<sujet>`, `uNN-pluma` (+ `u10-finale` et `u10-finale-sombra`).
La frise de bordure se choisit par `meta.region` (`QArt.bunting`, `QCine.frame`) ; elle suit la région, pas l'unité.

| Unité | Région (`meta.region` → frise) | Kit (`apps/espagnol/src/art/core/src/`) | Personnages (`QCine.speakers`) | Capsule |
|---|---|---|---|---|
| u05 | `valencia` → azulejos turquoise/orange | `14-valencia.js` (Ciudad de las Artes, horloges 12:05, paella, fallas) | Neus, Vicent, Nacho (`08d-chars-valencia.js`) | `capsula-horarios` |
| u06 | `madridnoche` → azulejos, fanions de Noël | `15-madrid-noel.js` (Plaza Mayor, marché, sapin ; lumières animables `.mn-lights`…) | Rosa, Paloma (`08e-chars-madrid.js`) | `capsula-uvas-reyes` |
| u07 | `argentina` → filete porteño | `16-buenosaires.js` (Obelisco, Caminito, San Telmo ; bandonéon, mate, tango) | Facu, Sol, Don Aníbal (`08f-chars-baires.js`) | `capsula-buenosaires` |
| u08 | `colombia` → tissage de mochila | `14-bogota.js` (Monserrate, La Candelaria, Museo del Oro) | Camila, Don Hernán, Doña Marta (`08d-characters-colombia.js`) | `capsula-candelaria` |
| u09 | `mexico` → papel picado | `15-yucatan.js` (selva, El Castillo, cenote ; glyphes génériques) | Itzel, Don Chan, Doña Chabela (`08f-characters-yucatan.js`) | `capsula-mayas` |
| u10 | `andes` → aguayo (`03b-frieze-andes.js`) | `16-cusco.js` (Plaza de Armas, murs incas, Machu Picchu à l'aube) | Killa, Don Huamán, Doña Paulina (`08e-characters-andes.js`) | `capsula-machu-picchu` |

**Finale (u10)** : `u10-finale` (« Décima pluma · El final de la leyenda » : le Quetzal a ses dix plumes) puis `u10-finale-sombra` (« El eco de la Sombra » : La Sombra, seule, est enfin écoutée) ; le Quetzal y porte les 10 plumes (`plumas` détecté par l'id).

**Carte** (`06-map.js`) : `MAP_REGIONS` = 10 médaillons (Madrid, Salamanca, Sevilla, Ciudad de México, **Oaxaca** (événement), Valencia, Buenos Aires, Bogotá, Yucatán, Cusco ; la Nochebuena de la u06 réutilise Madrid).
`MAP_ROUTE` = route principale dans l'ordre des unités : madrid → salamanca → sevilla → cdmx → valencia → **madrid** → baires → bogota → yucatan → cusco ; `MAP_SPUR` = branche de l'événement (cdmx → oaxaca → valencia) ;
`MAP_SEGMENTS` = les deux réunis (tous les segments pointillés sont dans le SVG de `worldMap`, `Q.mapTravel(tl, root, from, to, …)` trouve donc n'importe quel couple consécutif : plus de segment à recréer dans une composition).
App : `WorldMap.travel(from, to)` déplace le jeton **et la caméra** (recul vers le milieu du segment puis arrivée), le jeton ne capte plus le toucher (`pointer-events: none`) : la région courante reste cliquable.
Contrôle : `node tools/e2e/es-map.mjs` (progression forcée via `window.__q`, médaillons, segments, voyage cdmx → valencia, ouverture des unités 5 à 10 ; captures `tools/e2e/out/es-map-*.png`).

**Sous-titres** (`QCine.subs`) : taille de départ 56 px, **réduite par pas de 2 px (mini 30 px)** tant que la réplique dépasse la hauteur utile de la plaque (152 px) ; mesure à la construction, puis refaite quand la police est chargée ou que le prénom change.
Ne plus poser de `font-size` / `max-width` locaux sur `.sub-txt` (inutiles, et un `!important` local désactiverait l'ajustement). Les répliques les plus longues (≈ 170 caractères) tiennent sur 3 lignes à ≈ 40 px.

**Plumes du Quetzal** : `Q.quetzal({ plumas: N })` (0-10) → 1 à 6 plumes de queue supplémentaires (éventail), puis 7 à 10 = plumes de huppe supplémentaires. Par défaut `N` = numéro de la composition `uN-pluma*` / `uN-finale*`
(détecté via `data-composition-id`, donc automatique dans `S.quetzal`, les portraits de sous-titres, etc. ; 0 ailleurs et dans l'app sauf si on passe `plumas`). `QuetzalMascot` (carte) reçoit `plumas` = nombre de plumes gagnées.
`quetzalSet(…, 'bare')` / `quetzalRegrow` traitent aussi les plumes supplémentaires (classe `q-tail-x`, dans `.q-tail`).
**Piège `motionPath`** : le chemin est en coordonnées **absolues** par défaut ; pour un élément posé par `gsap.set({x, y})`, donner les points absolus (`u04-pluma-1` / `u08-pluma-1` les passaient relatifs : la plume partait en haut à gauche).

## 9. Cinématiques de stratégie maths (`strategy-<clé de zone>`, 9 compositions, 8,7 à 11,9 s)

Une par zone (clés de `engine/zones.ts` : echauffement, plus2, doubles, amoureux10, presquedoubles, plus10, plus9, passer-dizaine, ligue). Aucune donnée dynamique (voix pré-générée, pas de prénom).
**Les `index.html` sont générés** : `node tools/cinematics/strategy-build.mjs [--no-tts] [zone…]` assemble `tools/cinematics/strategy/template.html` + `strategy/scenes/<clé>.js` (la scène) + `strategy-scripts.json`
(phrases du Coach, badge, SFX `[phrase, fraction, fichier, volume]`). Une phrase = un mp3 Henri (`generate.py`, cache) dans `<id>/assets/vo-<i>.mp3` ; ffprobe mesure chaque durée → `window.PLAN = {t, d, total}`,
balises `<audio>`, `data-duration` (≤ 12 s, vérifié par `tests/strategy-cinematics.test.ts`). La scène lit `T(i, f)` = début de la phrase i + f × sa durée : corriger un texte puis relancer suffit.
Kit commun `_shared/strat.js` (`window.Strat` : petit joueur `token`, terrain, `frame10` = cadre à 10, `eq`, `pop/unpop/hop/arc`, Coach) + `strat.css`. Contrôle visuel : `node tools/cinematics/strategy-snap.mjs <clé…>` (une image à la fin de chaque phrase).
Branchement : `STRATEGY_CINEMATICS` (voice-lines.ts) → `playStrategy(zone)` (`lib/cine.ts`) joué dans l'Entraînement (à la place de la consigne vocale `strategy_N`) et à la 1re arrivée sur la zone de travail
(Home, 0,7 s après l'affichage ; `AppState.strategySeen` = zones déjà montrées).
