# Architecture — Cours_Enfants

Deux PWA éducatives de haut niveau pour deux enfants, installables séparément sur **tablette Android (Chrome)**,
100 % hors-ligne après la première visite, sans compte ni serveur.

| App | Enfant | Dossier | URL (base) | Univers |
|---|---|---|---|---|
| Calcul Champion | 7 ans (CE1/CE2) | `apps/maths` | `/maths/` | Foot / course — langage visuel "habillage TV sport" |
| La Leyenda del Quetzal | 12 ans (5e, espagnol LVB débutant) | `apps/espagnol` | `/espagnol/` | RPG d'aventure dans le monde hispanique |
| Hub | parent | `apps/hub` | `/` | page d'accueil sobre avec les 2 apps |

Specs détaillées : `docs/maths.md`, `docs/espagnol.md`.

## Stack (figée — ne pas changer sans accord)

- **npm workspaces** (`packages/*`, `apps/*`), Node 24.
- **Vite + Svelte 5 (runes) + TypeScript** pour chaque app.
- **vite-plugin-pwa** (Workbox, `generateSW`, `registerType: 'prompt'`) : precache de TOUT (JS, CSS, polices, images, audio,
  cinematiques). Chaque app a son propre manifest (`id`, `scope`, `start_url` = sa base), icônes 192/512 + maskable,
  `display: fullscreen`, `orientation: any`.
- **GSAP 3** (npm, tous les plugins sont gratuits : CustomEase, MotionPathPlugin, MorphSVG, SplitText, Physics2D, etc.)
  pour TOUTE l'animation d'interface en direct. Pas de mélange avec les transitions Svelte sauf fondus triviaux.
- **HyperFrames** (`hyperframes` CLI 0.8.143, plugin Claude Code installé au niveau projet) pour les **cinématiques** :
  compositions HTML + timeline GSAP, jouées **en direct dans l'app** via le web component `@hyperframes/player`
  (`<hyperframes-player>`), et rendables en MP4 si besoin (`npx hyperframes render`).
- **Howler.js** pour l'audio (SFX + voix), déverrouillé au premier toucher.
- **idb-keyval** pour la persistance (IndexedDB), état versionné + migrations, export/import JSON (sauvegarde parent).

## Arborescence

```
package.json                 workspaces + scripts racine (dev:maths, dev:espagnol, build, preview)
packages/core/               @ce/core — partagé par les apps
  src/audio.ts               SFX (Howler) + voix par clé -> fichier, fallback speechSynthesis
  src/storage.ts             état versionné par app (IndexedDB), export/import
  src/motion.ts              GSAP : enregistrement plugins, eases maison, helpers (pop, shake, countUp, burst)
  src/cinematic/             <Cinematic> : overlay plein écran autour de <hyperframes-player>, bouton passer,
                             promesse onEnded, injection de données (setRuntimeData), préchargement
  src/haptics.ts             navigator.vibrate (motifs nommés)
  src/pwa.ts                 mise à jour SW (toast), wake lock pendant les sessions, plein écran
  src/ui/                    composants de base Svelte (Button 3D pressable, Modal, ProgressRing, ParentGate…)
apps/<app>/
  public/cinematics/<id>/    une composition HyperFrames autonome par cinématique (index.html + assets)
  public/cinematics/_shared/ GSAP local, polices, sprites communs aux cinématiques de l'app
  public/audio/              voix générées (mp3) + sfx
  src/                       l'app
assets/                      ressources sources téléchargées + assets/LICENSES.md (licence de CHAQUE ressource)
tools/tts/                   génération des voix (edge-tts) depuis les manifestes audio des apps
docs/                        specs
```

## Règles HyperFrames (cinématiques)

- Lire `/hyperframes-core` avant d'écrire une composition (fichiers skills :
  `~/.claude/plugins/cache/hyperframes/hyperframes/0.8.143/skills/`). Animation : `/hyperframes-animation`,
  direction artistique : `/hyperframes-creative`, courts motion design : `/motion-graphics`.
- Une cinématique = une **composition autonome** (`data-composition-id`, `data-width`/`data-height`,
  `data-duration`), une seule timeline GSAP en pause enregistrée dans `window.__timelines[id]`.
- **Hors-ligne obligatoire** : aucune ressource réseau (pas de CDN). GSAP et polices servis localement
  (`_shared/`), `@font-face` dans le fichier.
- **Données dynamiques** (prénom, score, calcul, temps…) injectées par l'app (setRuntimeData / variables HyperFrames) ;
  chaque composition a des valeurs par défaut pour rester prévisualisable/rendable seule.
- `npx hyperframes check` doit passer à 0 finding sur chaque composition.
- **Plans courts** : 2 à 10 s par cinématique (conseil HyperFrames : générer des plans, pas des films entiers).
- **Mouvement précis, jamais "cinématique" vague** : chaque plan décrit ses mouvements de caméra (push-in, pan,
  whip-pan, plan fixe), ses entrées/sorties, ses eases et durées.
- Format : **1920×1200 (16:10, ratio des tablettes Android)**. Le player met à l'échelle ; marges de sécurité 5 %.

## Qualité & performance (tablette Android milieu de gamme, 60 fps)

- N'animer que `transform` et `opacity` dans l'app ; `backdrop-filter` avec parcimonie ; particules en `<canvas>`.
- Cibles tactiles ≥ 64 px (pavé numérique ≥ 88 px). Aucun survol requis. Retour immédiat (< 50 ms) à chaque toucher :
  enfoncement visuel + son + vibration légère.
- Interface enfant : `touch-action: manipulation`, pas de zoom, pas de pull-to-refresh (`overscroll-behavior: none`),
  pas de sélection de texte ni de menu appui long.
- Respecter `prefers-reduced-motion` (atténuer, pas supprimer le feedback).
- Durées : micro-interactions 120–250 ms, transitions d'écran 350–600 ms, célébrations 1,2–2,5 s.
- Budget : JS initial < 250 KB gzip par app hors cinématiques.
- Fonds lourds (stade : ~2 500 nœuds SVG) **rastérisés une fois en WebP** (`npm run art:raster` →
  `apps/maths/public/cinematics/_shared/img/`, commités) ; jamais de `mix-blend-mode` ni de `filter` animé
  (repeint complet à chaque image) : assombrir/flouter = image pré-floutée + voile dont on anime l'opacité.
  Boucles infinies uniquement en `transform`/`opacity` sur un conteneur composé (`will-change`), pas sur des groupes SVG.
- Mesure : `npm run perf:frames` (Playwright, CPU ralenti 4×, 1280×800 @1,5 : accueil + intro-club, goal, match-intro ;
  objectif p95 < 20 ms). Machine de dev chargée → `--runs 3` (médiane) et comparer en alternant (`--dist <autre build>`).

## Mouvement sûr (photosensibilité — WCAG 2.3.1 + confort d'un enfant de 7 ans)

Règle pour l'app maths (écrans, kit `CEArt`, 16 cinématiques), pour l'app espagnol (kit `QArt` / `QCine`, toutes les cinématiques `apps/espagnol/public/cinematics/`) et pour toute nouvelle animation. L'énergie « habillage TV »
vient du **mouvement** (push-in, glissements, overshoot, échelle), **pas de la lumière**.

- **≤ 3 flashs par seconde**, pour n'importe quel élément et pour l'écran entier (WCAG 2.3.1 : transition de luminance
  relative ≥ 0,1, côté sombre < 0,8, sur ≥ ~10 % de l'écran).
- **Pas de flash blanc plein écran.** À la place : `CEArt.bloom` (dégradé radial chaud, opacité ≤ 0,25, montée ≥ 0,3 s,
  descente 0,6 s). Aucune variation brutale de luminance sur une grande surface : fondus ≥ 0,3 s ; un gros élément clair
  qui « claque » (blason, « BUT ! », « VS ») arrive par l'échelle mais apparaît en fondu (0,2–0,3 s).
- **Flashs de foule rares, petits, doux** : `CEArt.crowdFlashes` = ≤ 2 par seconde, fondus 0,3 s / 0,45 s, emplacements
  tous différents (12 au maximum dans le stade) ; aucun en mode doux. Étincelles (`sparkle`) : apparition ≥ 0,35 s.
- **Aucun clignotement en boucle sur les écrans** : le fond de l'accueil est calme (projecteurs qui respirent en 3,4 s,
  rien d'autre) ; pas de reflets/balayages plus rapides que 1 par seconde.
- **Confettis sans papillotement** : retournement lent (≤ ~1 par seconde), 70 % du nombre demandé (30 % en mode doux).
- **Secousses modérées** : `CEArt.shake` plafonné à 10 px (cadre 1920), 6 oscillations douces ; rien en mode doux.
  Tremblements d'objets ≤ ±5°, oscillations ≥ 0,1 s. Rayons (`rays`) : opacité ≤ 0,3, rotation < 1 passage/s en un point.
- **« Animations douces »** (espace parent → Réglages ; forcé si `prefers-reduced-motion`) : `@ce/core`
  `setSoftMotion` (pop/shake/burst/countUp réduits), fond immobile, pas de respiration du bouton MATCH ; les cinématiques
  reçoivent `{ motion: { soft } }` (canal `motion`, chaque composition maths appelle `CEArt.setSoft` puis se reconstruit).
- **Espagnol** (même politique, kit commun `_shared/qcine.js`) : `QCine.bloom(tl, sel, at, peak, rise, fall)` (opacité ≤ 0,25, montée ≥ 0,3 s) remplace tout éclair ; `QCine.shake` ≤ 10 px, oscillations ≥ 0,11 s ; fondus d'ouverture ≥ 0,45 s ; transitions de plan par fondu enchaîné (jamais d'écran crème plein cadre) ; aucun `mix-blend-mode` ni `filter` animé (lueurs = dégradés radiaux en opacité) ; le **grain de papier** n'est plus un filtre `feTurbulence` plein cadre mais une tuile WebP rastérisée (`_shared/img/grain.webp`, `node tools/art/es-grain.mjs`) ; scintillements (lampes, rayons) ≥ 0,4 s par cycle ; confettis/étincelles/pétales/éclats (`.cf .spark .star .shard .dust`, `.q-fx`) apparaissent en ≥ 0,4 s. Les décors SVG du kit font ≤ ~1 000 nœuds par calque (rien à rastériser) ; seul le grain l'était.
  **« Animaciones suaves »** : `Ajustes` → réglage `settings.reducedMotion` → `@ce/core` `setSoftMotion` (`GameState.applySettings`, forcé si `prefers-reduced-motion`), transmis aux cinématiques par le canal `motion` (`CinematicRef.svelte` : `data: { player, motion: { soft } }`) ; `QCine.initPlayer` l'écoute (`QCine.setSoft` : classe `q-soft` sur `#root` qui masque lueurs/rayons/confettis/étincelles/poussière, `bloom`/`shake` à 0, timelines invalidées). Garde-fous statiques : `tests/safe-motion.test.ts` (kit commun + chaque composition espagnole).
- **Contrôle** : `npm run a11y:flash` (après `npm run build`) — `tools/a11y/flash-check.mjs` rend chaque cinématique image
  par image à 30 i/s (timeline positionnée comme le rendu HyperFrames), capture 10 s de l'accueil (screencast Playwright,
  MP4 de contrôle dans `tools/a11y/out/`) et mesure la luminance relative par image : **échec** si > 3 flashs généraux/s
  ou **éblouissement** (luminance moyenne de l'écran ou d'une moitié qui monte de > 0,2 en 0,1 s, soit plus vite qu'un
  fondu de 0,3 s depuis le noir) ; « scintillement »
  (petits éclats sur place) = indicateur seulement. Options : `espagnol`, `home`, `<dossier>`, `--video f.mp4`,
  `--only a,b`, `--soft` (maths : `CEArt.setSoft` ; espagnol : `QCine.setSoft`), `--json`, `--report-only`. Garde-fous statiques : `tests/safe-motion.test.ts`.

## Hébergement

Site statique unique (`/`, `/maths/`, `/espagnol/`). L'installation PWA sur Android exige HTTPS → hébergement à décider
avec Wael (GitHub Pages / Cloudflare Pages). En local : `npm run preview` + `localhost`.
