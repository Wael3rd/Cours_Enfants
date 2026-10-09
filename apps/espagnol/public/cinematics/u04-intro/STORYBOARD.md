# u04-intro — « Capítulo 4 · ¿Cómo eres? · Ciudad de México » (1 composition, ≈ 11,8 s)

Intro de région (voir `u03-intro`) : carte → carte-titre → panorama. **Bordure = papel picado** (région `mexico`). Voix : `narrador` (3 répliques). Décor du kit : `coyoacanSkyline` (ciel, soleil, fond, milieu, premier plan). Données : canal `player` (initiale du pion), canal `motion` (mode doux).
Mouvement sûr dès la conception : la « claque » du titre = **lueur douce** `QCine.bloom` (≤ 0,22, montée 0,32 s), secousse `QCine.shake` ≤ 8 px, 30 confettis de papel picado, étincelles ≥ 0,4 s ; le passage d'un plan sombre à un plan clair se fait par **fondu** (0,45 s), jamais par un éclair.

## Plan 1 — la carte (0 → ≈ 4,0 s) · « Capítulo cuatro: ¿cómo eres? »
- **Caméra de carte** : vue d'ensemble (Atlantique, ×0,74) → **traversée** vers l'ouest puis **zoom sur Ciudad de México** (×3,4, 1,3 s, `power2.inOut`), léger roulis −2,5° → 0°. Le jeton d'Álex part de Sevilla, la ligne dorée pointillée traverse l'océan (tracé propre sevilla → cdmx, 0,25 → 1,5 s) ; le brouillard de CDMX se dissipe (`mapFogClear`) ; anneau pulsé 3×.
- Sur « cuatro » : voile sombre sur la carte (0,5 s), **carte-titre** (bandeaux de fanions découpés, « CAPÍTULO 4 », « ¿CÓMO ERES? » sur deux lignes, pastille « CIUDAD DE MÉXICO »), entrée par `scaleY` + `power3.out`, lueur douce, secousse légère, confettis, étincelles.
- **Transition** (≈ 3,8 s) : whip-pan — le plan 1 file à gauche (`power3.in`, skewX −16°, 0,34 s), stries de lumière, le plan 2 entre par la droite (0,7 s, `power3.out`) **en fondu** (0,45 s).

## Plan 2 — Coyoacán au soir (≈ 4,0 → 11,8 s) · « Ciudad de México. Coyoacán, el barrio de Frida Kahlo. / Aquí, cada cara cuenta una historia. »
- **Travelling latéral lent** dans la rue (parallaxe) : ciel −120 px, soleil −160, fond −320, milieu −700, premier plan −1280 sur toute la durée (`power1.inOut`) ; zoom d'entrée ×1,06 → ×1,0 (`sine.out`). On passe devant la fontaine aux coyotes, la Parroquia, le kiosque, les jacarandas, pour **arriver à la Casa Azul** (bleu cobalt) au centre-droit du cadre.
- Fin (« cada cara cuenta… ») : **push-in** doux vers la façade bleue (×1,0 → ×1,1, origine 62 % / 55 %).
- Ambiance : rayons du soleil qui tournent (≤ 22° sur la durée), soleil qui respire (±3 %), nuages qui dérivent, pétales de jacaranda qui tombent (24, chute 4–6 s, classe `.cf`), hirondelles, poussière dorée. Pastille de lieu « COYOACÁN, CDMX » (glisse à ≈ 4,4 s, repart avant la fin).
- Sons : `swoosh-in`, `steel00` + `spell-cast` (titre), `swoosh-out` (whip), `bell`, `star`, `pop`.
