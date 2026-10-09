# strategy-ligue — Zone 9 : Ligue des Champions, dizaines puis unités (11,1 s, 1920x1200)

Cadre commun, voix et régénération : voir `strategy-echauffement/STORYBOARD.md`. Scène : `tools/cinematics/strategy/scenes/ligue.js`.
Idée : 35 + 24 avec des paquets de 10 ballons (dizaines) et des ballons seuls (unités) : 3 + 2 paquets = 50, 5 + 4 ballons = 9, total 59. (Pas de famille de nombres : le calcul à 2 chiffres n'a pas de faits inverses mémorisés.)

| Phrase | Début → durée | Texte |
|---|---|---|
| 0 | 0,30 s → 2,00 s | « Trente-cinq plus vingt-quatre ! » |
| 1 | 2,42 s → 3,17 s | « Les paquets de dix : trois plus deux, cinq. » |
| 2 | 5,71 s → 3,10 s | « Les ballons seuls : cinq plus quatre, neuf. » |
| 3 | 8,92 s → 1,70 s | « Cinquante-neuf ! » |

## Plans

| Plan | Mouvement |
|---|---|
| P0 | Groupe gauche : « 35 », 3 paquets « 10 » (caisses bleues, 10 ballons dessinés) + 5 ballons seuls ; « + » doré au centre ; groupe droit : « 24 », 2 paquets + 4 ballons (pop échelonné 0,05 s) ; plaque « 35 + 24 ». |
| P1 | Les ballons seuls s'estompent ; les 5 paquets glissent au centre en une rangée (`power2.inOut` 0,55 s, échelonné 0,05 s) ; « 5 » doré ; plaque « 30 + 20 = 50 » (T1+0,82) + anneau. |
| P2 | Les paquets s'estompent, les ballons reviennent et se rangent en une rangée de 9 (`power2.inOut` 0,5 s) ; « 9 » doré ; plaque « 5 + 4 = 9 » + anneau cyan (T2+0,8). |
| P3 | Les paquets reviennent ; plaque « 50 + 9 » puis « = 59 » en gros (`back.out(3)`, T3+0,4) ; tout le monde fait un bond (24 px) + anneau ; `celebration`. |

Sons : `pop` T0+0,02 et T0+0,45 · `swoosh-in` T1+0,2 · `star` T1+0,82 · `swoosh-in` T2+0,18 · `star` T2+0,8 · `level-up-big` T3+0,4.
