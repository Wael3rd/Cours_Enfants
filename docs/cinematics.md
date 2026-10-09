# Cinématiques HyperFrames — mode d'emploi

Une cinématique = une composition HTML autonome (`apps/<app>/public/cinematics/<id>/index.html`), jouée en direct dans
l'app par `<hyperframes-player>` (via `@ce/core`), et rendable en MP4. Référence vivante : `proof-goal` (app maths).

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

`proof-goal` utilise les deux : `data-var-text` (défauts + rendu MP4) et le handler `goal` (live).

## 6. Rendre en MP4

```
npx hyperframes render apps/maths/public/cinematics/<id> --variables '{"name":"Inès","calc":"8 + 6 = 14"}' -f 30 -o renders/<id>.mp4
```

`-q draft|looks|delivery`, `--format mp4|webm|mov|gif`. `renders/` est gitignoré. `proof-goal` : 3 s, ~15 s de rendu, 1,2 Mo.

## Vérification e2e

`npm run build && npm run e2e` : sert `dist/`, ouvre `/maths/` (1280×800), joue la cinématique, vérifie prénom injecté, aucune requête
hors origine, puis recharge hors-ligne depuis le cache SW et rejoue. Screenshots dans `tools/e2e/out/`.
