# u06-intro — « Capítulo 6 · ¡Feliz Navidad! · Madrid » (2 compositions : `u06-intro-1` ≈ 9,6 s, `u06-intro-2` ≈ 4,2 s)

Intro de région (voir `u04-intro`) : carte → carte-titre → panorama de Madrid de nuit. **Bordure = frise d'azulejos « madridnoche »** (rouge sombre / or, fanions crème). Voix : `narrador` (3 répliques). Décor du kit : `mnSkyline` (ciel étoilé, lune, fond, milieu = Gran Vía + Real Casa de Correos + sapin, premier plan = étals, promeneurs). Données : canal `player` (initiale du pion), canal `motion`.
Mouvement sûr dès la conception : le titre arrive par l'échelle + `QCine.bloom` (≤ 0,2, montée 0,32 s) + secousse ≤ 8 px ; les guirlandes (`.mn-lights`) s'allument en **fondu ≥ 0,8 s** ; la « panne » du plan 3 est un **fondu lent** des lumières (1,2 s) + voile sombre doux, jamais un clignotement.

## Partie 1 (0 → ≈ 9,6 s) — « Capítulo seis: ¡feliz Navidad! » / « Madrid de noche. En diciembre, la ciudad brilla con miles de luces. »
- **Plan 1 — carte** : vue d'ensemble → traversée vers Madrid (ligne dorée Valencia → Madrid, brouillard de Madrid qui s'écarte), pion, anneau pulsé. Sur « seis » : voile sombre, carte-titre « CAPÍTULO 6 / ¡FELIZ NAVIDAD! / MADRID », confettis (dorés / rouges), étincelles.
- **Transition** : whip-pan (plan 1 file à gauche 0,34 s, le plan 2 arrive en fondu 0,45 s).
- **Plan 2 — panorama** : travelling latéral lent (parallaxe ciel −120 / lune −160 / fond −320 / milieu −700 / près −1280). Les lumières s'allument par vagues (`.mn-lights` 0 → 1 en 0,9 s, deux vagues) pendant « miles de luces » ; lune qui respire ; pastille de lieu « MADRID · NAVIDAD ».

## Partie 2 (≈ 4,2 s) — « Pero esta noche… algo no funciona. »
- Même panorama, **suite du travelling** (zoom ×1,0 → ×1,06) : les lumières s'éteignent lentement (fondu 1,2 s, guirlandes d'abord puis fenêtres et sapin), voile nuit (opacité → 0,35 en 1,4 s), seules les bougies des étals restent. Ton : mystère doux, pas d'effroi.
- Sons : `swoosh`, `steel00` + `spell-cast` (titre), `bell` lointaine, `star`, `spell-hit` très bas à la panne.
