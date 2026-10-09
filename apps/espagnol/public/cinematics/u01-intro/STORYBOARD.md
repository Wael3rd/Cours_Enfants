# u01-intro — « Capítulo 1 · ¡Hola! · Madrid » (1920×1200, 9,6 s, 1 composition)

Intro de région, style affiche de voyage × JRPG. Voix off `narrador` (3 répliques). Les temps ci-dessous sont ceux du dernier build (`window.PLAN`, généré par `tools/cinematics/es-build.mjs`) :
les animations sont calées sur les ancres (début de plan, mots), pas sur des secondes écrites à la main.
Données : canal `player` `{name}` (initiale du pion de carte), défaut `Álex`. Palette : nuit `#14173F`, sol `#FFC83D`, terracotta `#C9573B`, turquesa `#19B7AA`, papel `#F5E6C8`. Typo : Alfa Slab One / Nunito.

## Plan 1 — La carte (0 → 4,1 s) · voix « Capítulo uno: ¡Hola! » à 0,5 s
- **Caméra** : zoom avant progressif sur la carte du monde en papel (`mapCamSet` large 0,74 → `mapCamMove` sur Madrid ×3,4, 0,1 → 2,4 s, `power3.inOut`), roulis −2,5° → 0 (`power2.out`), puis dérive lente ×1,05 jusqu'au whip.
- Brouillard de guerre : vrais nuages (3 couches) sur les régions verrouillées, respiration `mapFogDrift`. Anneau doré qui pulse sur Madrid (`mapPulse`, 4 × 0,9 s).
- **Carte-titre** : à 1 mot de la fin, le fond s'assombrit (`#mapdim` 0 → .55) ; « CAPÍTULO 1 » (or, Alfa) monte avec le mot « Capítulo » ; sur le mot « ¡Hola! » : boîte azulejo qui se déroule (`scaleY` .05 → 1, `back.out(1.4)`), **¡HOLA!** claque (échelle 2,6 → 1, `expo.out` .5 s) + éclair blanc + secousse du plan (±16 px, 0,26 s) + rayons dorés + 44 confettis de papel picado en gerbe + 8 étincelles ; ruban terracotta « MADRID » se dévoile (clip-path, `power3.out`).
- Sons : `ui/swoosh-in` (zoom), `jingles/steel00` + `rpg/spell-cast` sur « ¡Hola! ».

## Transition — whip-pan (4,1 s)
Plan 1 part à gauche (x −2300, skew −16°, `power3.in` .34 s), plan 2 entre par la droite (x 2300 → 0, skew 16° → 0, `power3.out` .5 s), 7 traînées de vitesse blanches. Son : `ui/swoosh-out`.

## Plan 2 — Madrid au coucher du soleil (4,1 → 9,3 s) · « Madrid, la capital de España. » 4,7 s · « Aquí empieza tu aventura. » 7,0 s
- **Caméra** : travelling latéral lent gauche → droite avec **parallaxe 5 calques** (ciel −120 px, soleil −160, lointain −320, monuments −700, premier plan −1280, `power1.inOut` sur tout le plan) + léger push-out (1,06 → 1,0). On finit sur la Puerta de Alcalá, soleil couchant dans l'arche.
- Décors (kit `madridSkyline`) : dégradé nuit → magenta → orange, nuages de crépuscule, soleil qui respire + rayons qui tournent, sierra, Palacio Real / Metrópolis / Plaza Mayor dorés, toits, lampadaires, fenêtres qui scintillent ; poussière dorée et oiseaux.
- **Quetzal** (kit) traverse le ciel en arc (MotionPath, `power1.inOut`), battements 0,46 s, sillage d'étincelles vertes.
- Pastille « MADRID, ESPAÑA » (glisse de la gauche, `expo.out`), repart avant la fin.
- Sons : `rpg/bell` (doux), `ui/star` quand le Quetzal traverse le centre, `ui/pop` sur « aventura ».

Fondu depuis/vers l'encre (0,45 s / 0,28 s), frise d azulejos « madrid » et fanions sobres qui se balancent (papel picado réservé au Mexique), grain de papier, vignette. Sous-titres espagnols mot à mot (mot actif en or).
