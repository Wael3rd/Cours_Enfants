# u02-intro — « Capítulo 2 · Mi clase, mi cole · Salamanca » (1920×1200, ≈ 9,9 s, 1 composition)

Intro de région, même gabarit que `u01-intro` (affiche de voyage × JRPG). Voix off `narrador` (3 répliques). Les temps sont ceux du dernier build (`window.PLAN`, `tools/cinematics/es-build.mjs`) :
animations calées sur les ancres (début de plan, mots). Bordure : **frise d'azulejos « salamanca »** (grès doré, ocre/terracotta) — jamais de papel picado hors Mexique. Confettis de la carte-titre = éclats de carreaux (crème, ocre, cobalt, terracotta).
Données : canal `player` `{name}` (initiale du pion de carte). Typo : Alfa Slab One / Nunito.

## Plan 1 — La carte d'Espagne (0 → 4,1 s) · « Capítulo dos: mi clase, mi cole. »
- **Caméra** : départ large sur la carte (×0,74, roulis −2,5°) → zoom serré sur Salamanca (×3,4, `power3.inOut`, 0,1 → 2,4 s, roulis → 0, `power2.out`), Salamanca ancrée en haut du cadre (la carte-titre occupe le centre), puis lente dérive ×1,05 jusqu'au whip.
- **Ligne dorée** Madrid → Salamanca : pointillé qui se trace (0,5 → 2,0 s) pendant que le pion d'Álex le suit (petit saut d'arrivée) ; le brouillard de Salamanca s'écarte (`mapFogClear`, 1,8 → 3,5 s) ; anneau doré qui pulse.
- **Carte-titre** : le fond s'assombrit (`#mapdim` → .55) ; « CAPÍTULO 2 » (kicker or) au mot « Capítulo » ; sur « mi » la boîte azulejo se déroule (`scaleY` .05 → 1, `back.out(1.4)`), **MI CLASE, MI COLE** claque en deux lignes (échelle 2,6 → 1, `expo.out`) + éclair + secousse (±16 px) + rayons dorés + 44 éclats de carreaux + 8 étincelles ; ruban terracotta « SALAMANCA » (clip-path).
- Sons : `ui/swoosh-in`, `jingles/steel00` + `rpg/spell-cast` sur « mi ».

## Transition — whip-pan (4,1 s)
Plan 1 part à gauche (x −2300, skew −16°, `power3.in` .34 s), plan 2 entre par la droite (x 2300 → 0, `power3.out` .5 s), 7 traînées blanches. Son `ui/swoosh-out`.

## Plan 2 — Salamanca, la ciudad dorada (4,1 → 9,9 s) · « Salamanca, la ciudad dorada. » · « Aquí hay un colegio muy especial. »
- **Caméra** : travelling latéral lent gauche → droite, **parallaxe 5 calques** (ciel −120 px, soleil −160, lointain −320, façades −700, premier plan −1280, `power1.inOut`) + push-out 1,06 → 1,0. Départ sur l'espadaña de gauche (nid de cigogne + **cloche muette**), arrivée sur la façade plateresque de l'Université à droite.
- Décor (kit `salamancaSkyline`) : ciel d'après-midi, soleil bas aux rayons lents, cathédrale en brume, Plaza Mayor à arcades et pavillon à horloge, façade de l'Université, toits de tuiles, lampadaires.
- **Cigognes** : 3 cigognes traversent le ciel (battements 0,5 s, `none` linéaire, hauteurs et vitesses différentes) ; deux restent sur leurs nids.
- **La cloche reste muette** : elle oscille à peine (±3°) au mot « especial » ; une note ♪ barrée (gris) monte et s'éteint à côté — aucun son.
- Pastille « SALAMANCA, ESPAÑA » (glisse de la gauche, `expo.out`), repart avant la fin. Son `ui/star` en fin de réplique 1, `ui/pop` sur « especial ».

Fondus depuis/vers l'encre, frise d'azulejos qui se balance (fanions), grain, vignette. Sous-titres mot à mot (mot actif en or, aucun reflow).
