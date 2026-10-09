# trophy — remise du trophée (6,0 s, 1920x1200)

Données (canal `trophy`) : `{ competition, name }`. Défauts : `Coupe des doubles`, `Léo`.
Idée : cérémonie de remise. Salle noire, deux faisceaux qui balayent, le trophée monte dans la lumière, flash et pluie de confettis, puis le nom de la compétition et le prénom du vainqueur s'inscrivent.

| t (s) | Plan / mouvement | Détail |
|---|---|---|
| 0.00 – 0.60 | **Plan fixe noir** + faisceaux | Fond marine très sombre (#050820) avec légère foule floue en bas (stade, brightness .25, blur 10 px). Deux faisceaux (triangles blancs doux, `mix-blend: screen`) partent des coins supérieurs, hors champ, à 0 → .55 d'opacité en 0.4 s ; ils **balayent** (rotation ±14°, `sine.inOut`) pendant 0.4 → 2.4 pour se rejoindre au centre. `murmur` dès 0 (volume .5). |
| 0.30 – 2.80 | **Crane up** (la caméra monte avec le trophée) | Monde `#cam` : y +320 → 0 (`power3.out`, 2.6 s), scale 1.18 → 1.0. Trophée (440 px de large) : monte de y +560 → 0 (`power3.out` 2.3 s, départ 0.4) en tournant très légèrement (rotation -4° → 0). Socle (marron foncé) en parallèle, légèrement derrière. Rayons dorés tournants derrière lui (opacité 0 → .5 en 1.5 s, rotation continue 28°). `ui/open` à 0.4 (montée), `steel00` à 2.55. |
| 2.60 – 3.10 | **Révélation** | Flash blanc (0.85 → 0 en 0.45 s) à 2.65 ; secousse 14 px ; éclat (sparkle 260 px) sur le bord de la coupe (scale 0 → 1.4 `back.out(3)` → 0 en 0.6 s) ; anneau doré (scale 0.3 → 3.2, 0.7 s `expo.out`). `level-up-big` à 2.62 + `roar-long` à 2.6 (fondu final). |
| 2.65 – 5.00 | **Pluie de confettis** | 130 confettis tombent du haut (origine y -100, x ±960 aléatoire gravé par seed, gravité 900, angle 90°) étalés sur 2.65 → 4.2, aux couleurs or / blanc / corail / cyan. 40 étincelles scintillent sur le trophée (deux vagues). |
| 3.00 – 3.70 | **Plaque compétition** | Bandeau d'or incliné -3° glisse depuis la gauche (x -1300 → 0, `expo.out` 0.55 s) à y ≈ 900 : nom de la compétition (Anton 120 px marine). Sous-ligne : « {prénom} remporte le trophée ! » (Fredoka 700 58 px, blanc sur plaque marine) qui se révèle en wipe à 3.4 (0.45 s). `swoosh-in` à 3.0, `streak-5` à 3.45. |
| 3.70 – 6.00 | **Push-in lent** (1.0 → 1.1) + brillance | Le trophée respire (y ±8 px, `sine.inOut`) ; reflet qui balaie la coupe à 4.2 (0.7 s) ; 2e vague d'étincelles à 4.6. Les faisceaux se refocalisent (rotation → 0). Fondu marine sur les 0.35 dernières secondes. |

Marges de sécurité 5 % : plaque x ≥ 96, bas ≤ 1100.
Sons : `murmur` 0 · `open` 0.4 · `steel00` 2.55 · `level-up-big` 2.62 · `roar-long` 2.6 · `swoosh-in` 3.0 · `streak-5` 3.45.
