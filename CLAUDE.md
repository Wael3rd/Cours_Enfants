# Cours_Enfants

PWA éducatives pour les enfants de Wael, tablette Android, hors-ligne, animations haut de gamme (GSAP + HyperFrames).

- **Calcul Champion** (`apps/maths`, 7 ans) : fluence des tables d'addition + additions/soustractions rapides. Univers foot.
- **La Leyenda del Quetzal** (`apps/espagnol`, 12 ans, 5e LVB débutant) : programme 2026 de 5e en immersion. Univers RPG.

## Specs (lire avant de travailler)

- `docs/architecture.md` — stack figée, arborescence, règles HyperFrames, perf
- `docs/maths.md`, `docs/espagnol.md`, `docs/espagnol-programme.md`

## Règles

- Stack : npm workspaces, Vite + Svelte 5 + TS, GSAP, `@hyperframes/player`, Howler, idb-keyval, vite-plugin-pwa.
- Cinématiques = compositions HyperFrames autonomes dans `apps/<app>/public/cinematics/<id>/`, hors-ligne, `npx hyperframes check` à 0.
  Skills HyperFrames : `~/.claude/plugins/cache/hyperframes/hyperframes/0.8.143/skills/` (commencer par `hyperframes-core`).
- Toute ressource externe est notée avec sa licence dans `assets/LICENSES.md`. Aucune marque / vraie star / IP tierce.
- UI enfant : cibles ≥ 64 px, feedback < 50 ms, n'animer que transform/opacity, 60 fps sur tablette.

## State

- 2026-10-09 : specs écrites, HyperFrames installé (plugin projet). Fondations en cours.
- 2026-10-09 : app maths jouable de bout en bout (apps/maths/src/screens : Setup, Placement, Home, Match, Sprint, Penalties, Training, Rewards, Album, Trophies, AvatarScreen ; ui/ : GameButton, Keypad, CalcPanel, HintVisual, Pitch, Gauge). Voix : `npm run voices` (apps/maths/src/audio/voice-lines.ts -> public/audio/fr). E2E : `npm run build && npm run e2e` (tools/e2e/maths.mjs, screenshots `tools/e2e/out/maths-*.png`). Rythme : cinematique `goal` seulement pour le 1er but et le but decisif (reste = but en jeu <= 0,8 s) ; `match-intro` au coup d'envoi, `full-time` puis recompenses ; `trophy` (1 seule, la zone la plus haute) ; `card-pack` a l'ouverture ; `medal` en fin de sprint. Emplacement des strategies : `STRATEGY_CINEMATICS` dans voice-lines.ts.
