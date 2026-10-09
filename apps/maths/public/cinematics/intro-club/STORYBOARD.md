# intro-club — ouverture d'émission (7,0 s, 1920x1200)

Données (canal `intro-club`) : `{ name, club:{name, primary, secondary, initials} }`. Défauts : `Léo`, Lions rouge/blanc `LB`.
Idée : le générique d'une émission de foot. On "monte" de la pelouse vers les tribunes pendant que les projecteurs s'allument un à un, le blason claque au centre, puis le prénom de l'enfant est écrit lettre par lettre au-dessus d'un joueur qui entre en courant.

## Plan A — Allumage du stade (0.00 – 2.60)
- Fond : stade complet. Caméra : **crane up** (tilt vers le haut) : le monde `#cam` va de y +300 / scale 1.28 à y 0 / scale 1.0 (`power2.out`, 2.6 s). Départ sur la pelouse sombre.
- Tout est éteint au départ : couche stade `brightness(0.18) saturate(.6)`, faisceaux et halos à opacité 0.
- Les 4 projecteurs s'allument à 0.35 / 0.75 / 1.15 / 1.55 : halo (opacité 0 → 1 en 0.12 s avec 2 scintillements 1 → .4 → 1), faisceau (opacité → .85, `power2.out` 0.4 s), étincelle (sparkle scale 0 → 1.6 → 1 `back.out`) sur la lampe. SFX `hit00` à chaque allumage (volume croissant 0.35 → 0.8), `murmur` dès 0.
- À mesure que les projecteurs s'allument, la luminosité du stade monte (0.18 → 1.0, 1.9 s, `power1.in` jusqu'à 2.4).
- 1.6 – 2.6 : flashs d'appareils photo (densité 0 → 100 %), foule murmure qui monte.

## Plan B — Le blason claque (2.60 – 4.50)
- 2.55 : flash blanc (0.8 → 0, 0.4 s) + coupure : un voile marine (80 %) assombrit le stade (le blason doit ressortir), rayons dorés tournants au centre (rotation 30° sur 2 s).
- Blason (620 px de large, centre x 960, y 520) : scale 6.5 → 1 (`expo.out` 0.45 s), opacité 0 → 1 sur 0.08 s, rotation -8° → 0. SFX `steel03` + `ball-hit` à 2.60. Anneau de choc (couleur club, scale 0.3 → 3, 0.6 s `expo.out`), secousse caméra 20 px.
- 3.05 – 4.5 : le blason respire (scale 1 → 1.04, `sine.inOut`), reflet qui le balaie à 3.3 (0.5 s), 6 étincelles autour (apparition étagée 3.0 → 3.5).
- Caméra : **push-in** 1.00 → 1.08 de 2.6 à 4.6.

## Plan C — Bienvenue (4.50 – 7.00)
- 4.50 : le blason glisse en haut à droite (x +650, y -260) et rétrécit à 0.4 (`power3.inOut` 0.55 s) : il devient l'enseigne de l'émission.
- 4.60 : ligne 1 « Bienvenue au club, » (Fredoka 700, 96 px, blanche sur plaque marine) glisse depuis la gauche (x -300 → 0, `expo.out` 0.5 s).
- 4.80 → 5.40 : le prénom (Anton 300 px, jaune, contour marine) entre **lettre par lettre** (stagger 0.07 s : y +160 → 0, rotation ±12° → 0, `back.out(2.4)`), puis « ! » claque (scale 2 → 1) à 5.45. SFX `pop` sur chaque lettre (pitch via volume), `roar-short` à 4.6.
- 4.40 – 5.40 : un joueur du club entre en courant par la droite (x 2300 → 1420, `power2.out` 1.0 s), cycle de course (pas 0.42 s) puis frappe un saut de joie (pose `celebration`) à 5.5 avec confettis aux couleurs du club (70 pièces, 5.5), 6 étincelles.
- 5.6 – 7.0 : la caméra continue en **push-in lent** (1.08 → 1.14) ; le prénom flotte (y ±8) ; le nom du club en lower-third (SVG `lowerThird`, couleur club) glisse à 5.7 (x -1300 → 0). `roar-long` en fond jusqu'à 7.0 (fondu intégré). Sortie : fondu au marine des 0.3 dernières secondes.

Marges de sécurité 5 % : texte ≥ 96 px des bords.
Sons : `murmur` 0 · `hit00` ×4 · `steel03`+`ball-hit` 2.60 · `roar-short` 4.60 · `pop` ×(lettres) · `roar-long` 5.5.
