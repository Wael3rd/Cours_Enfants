# match-intro — écran VERSUS (4,0 s, 1920x1200)

Données (canal `match-intro`) : `{ home:{name,primary,secondary,initials}, away:{…} }`. Défauts : Lions rouge/blanc `LB`, Aigles bleu/jaune `AZ`.
Idée : deux moitiés de couleur qui se percutent sur une diagonale, deux blasons qui arrivent en whip-pan, un "VS" qui éclate, un bandeau jaune "COUP D'ENVOI", puis les panneaux s'écartent sur le stade.

Grammaire : diagonale à -12° (le "slash" de l'habillage TV), flou directionnel pendant les whip-pans (filtre `blur` sur x, retombe à 0 à l'arrivée), jamais plus de deux mouvements simultanés.

| t (s) | Plan / mouvement | Détail |
|---|---|---|
| 0.00 | **Plan fixe** sur le stade (flou + assombri) | Le stade de fond (foule, pelouse) filtré `brightness(.55) blur(6px)`. |
| 0.00 – 0.45 | **Panneaux de couleur** | Moitié gauche (couleur club maison) entre depuis x -1100 → 0, moitié droite (extérieur) depuis x +1100 → 0, `expo.out` 0.45 s ; découpe diagonale -12° (clip-path polygon). La couture blanche (barre lumineuse) apparaît au contact (opacité 0 → 1, 0.08 s) à 0.40. `swoosh-in` à 0.00, `hit05` à 0.42. Lignes de vitesse horizontales défilent (x +420 → -420, 0.8 s `none`). |
| 0.30 – 1.00 | **Whip-pan des blasons** | Blason maison (560 px) arrive de la gauche : x -1300 → 0, flou 28 px → 0, `expo.out` 0.55 s, puis rebond `back.out(1.5)` sur scale 0.9 → 1 ; blason extérieur symétrique, décalé de 0.10 s. Ils se posent à x 520 / 1400 (centres), y 560. Les noms (Anton 130 px) montent sous chaque blason (y +60 → 0, opacité, `power3.out` 0.4 s) à 0.80 / 0.88. |
| 1.00 – 1.45 | **VS** | "VS" (Anton 420 px, jaune, contour marine) scale 4.5 → 1 (`expo.out` 0.3 s), rotation -10° → -4° ; flash blanc plein cadre (0.9 → 0, 0.35 s) ; secousse 16 px ; anneau de choc jaune. `hit08` à 1.00, `ball-hit` à 1.00 (basse). |
| 1.45 – 2.90 | **Push-in lent** (scale 1.00 → 1.06, `sine.inOut`) | Les blasons flottent (y ±12 px, `sine.inOut`, déphasés), reflet diagonal qui balaie chaque blason à 1.7 / 1.95 (0.5 s `power2.inOut`). |
| 2.90 – 3.35 | **Bandeau COUP D'ENVOI** | Bande jaune inclinée -4° entre depuis la droite (x 1900 → 0, `expo.out` 0.4 s) en bas (y ≈ 900), texte Anton 150 px marine "COUP D'ENVOI" qui se révèle (clip-path). `whistle-short` à 3.05, `roar-short` à 3.05 (fondu). |
| 3.55 – 4.00 | **Ouverture** | Panneaux gauche/droite repartent x ∓1300 (`power3.in` 0.4 s), blasons et VS s'éclipsent (scale 0.6, opacité 0) : on retrouve le stade net (flou/assombrissement retombent à 0). |

Marges de sécurité 5 % : bandeau à y 880–1080, x ≥ 96.
