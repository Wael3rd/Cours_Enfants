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

## Hébergement

Site statique unique (`/`, `/maths/`, `/espagnol/`). L'installation PWA sur Android exige HTTPS → hébergement à décider
avec Wael (GitHub Pages / Cloudflare Pages). En local : `npm run preview` + `localhost`.
