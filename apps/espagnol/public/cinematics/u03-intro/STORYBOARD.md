# u03-intro — « Capítulo 3 · Mi familia · Sevilla » (1920×1200, ≈ 10,1 s, 1 composition)

Intro de région, même gabarit que `u01-intro` / `u02-intro`. Voix off `narrador` (3 répliques). Temps = dernier build (`window.PLAN`, `tools/cinematics/es-build.mjs`), animations calées sur les ancres.
Bordure : **frise d'azulejos « sevilla »** (cobalt / jaune / blanc, fanions sobres) ; confettis de la carte-titre = éclats d'azulejo (blanc, cobalt, jaune, vert). Données : canal `player` `{name}` (initiale du pion).

## Plan 1 — La carte d'Espagne (0 → 4,0 s) · « Capítulo tres: mi familia. »
- **Caméra** : départ large (×0,74, roulis −2,5°) → zoom serré sur Sevilla (×3,4, `power2.inOut`, 0 → 1,3 s, roulis → 0) ; la ligne dorée **descend** de Salamanca vers Sevilla (`mapTravel` .25 → 1,2 s), le brouillard de Sevilla s'écarte (`mapFogClear`), dérive ×1,05 jusqu'au whip.
- **Carte-titre** (bleu nuit, bandeau d'azulejos) : « CAPÍTULO 3 » au mot « Capítulo », **MI FAMILIA** claque (échelle 2,6 → 1, `expo.out`) sur « mi », éclair + secousse + rayons + 44 éclats d'azulejo + 8 étincelles, ruban terracotta « SEVILLA ». Sons : `ui/swoosh-in`, `jingles/steel00` + `rpg/spell-cast`.

## Transition — whip-pan (4,0 s)
Plan 1 part à gauche (x −2300, skew −16°, `power3.in` .34 s), plan 2 entre par la droite (`power3.out` .5 s), 7 traînées. Son `ui/swoosh-out`.

## Plan 2 — Triana à l'heure dorée (4,0 → 10 s) · « Sevilla, la ciudad de los azulejos. » · « Aquí vive la familia de Marina. »
- **Caméra** : **travelling latéral** gauche → droite au-dessus du fleuve, parallaxe 5 calques (ciel −120, soleil −160, lointain −320, berge de Triana −700, balustrade d'azulejos −1280, `power1.inOut`) + push-out 1,06 → 1,0.
- Décor (kit `sevillaSkyline`) : ciel turquoise → pêche, soleil bas, la **Giralda** et la cathédrale en silhouette, la **Torre del Oro**, façades blanches de Triana à volets bleus, orangers, **Guadalquivir** (reflets inversés + traits de lumière qui scintillent), terrasse à balustres et panneaux d'azulejos (esprit Plaza de España), branches d'oranger en surplomb ; hirondelles qui traversent, fenêtres qui scintillent.
- Pastille « SEVILLA, ESPAÑA » (glisse de la gauche, `expo.out`), repart avant la fin. Sons : `ui/star` après « azulejos », `ui/pop` sur « familia ».

Fondus depuis/vers l'encre, frise qui se balance, grain, vignette. Sous-titres mot à mot (mot actif en or, aucun reflow).
