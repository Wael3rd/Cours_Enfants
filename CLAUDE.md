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
- 2026-10-09 : app espagnol jouable de bout en bout (apps/espagnol/src/screens : Welcome, MapScreen, Region, QuestPlayer + Runner (coque de jeu, mode quest/boss/mission) + QuestEnd, Mission, Dictionary, Profile, Settings, Credits ; steps/ : un composant par type d'etape ; ui/ : nav, Emoji, SpeakText, Pista, drag...). Interface 100 % espagnol (le français n'apparait que dans la Pista). Contenu des unites charge a la demande (`engine/data.ts`, `content/units-index.json` genere par `tools/content/build-units-index.mjs` a chaque build). Unites evenement = champ explicite `evento: {desde, hasta}` uniquement. E2E : `node tools/e2e/es-game.mjs` (build + parcours complet + hors-ligne, screenshots `tools/e2e/out/es-*.png`), `node tools/e2e/es-parent.mjs` (espace parent via Ajustes) ; `?debug` dans l'URL expose `window.__q` (game, nav, content), `?now=AAAA-MM-JJ` force la date.
- 2026-10-09 : en ligne sur GitHub Pages (depot public Wael3rd/Cours_Enfants), deploiement auto a chaque push sur main (.github/workflows/pages.yml, CE_BASE_PREFIX=/Cours_Enfants/). URLs : https://wael3rd.github.io/Cours_Enfants/{maths,espagnol}/
- 2026-10-09 : 9 cinematiques `strategy-<zone>` (Coach + voix Henri, familles de nombres) jouees dans l'Entrainement et a la 1re arrivee sur une zone (`AppState.strategySeen`). Voir docs/cinematics.md §9 ; regenerer avec `node tools/cinematics/strategy-build.mjs`.
