# strategy-doubles — Zone 3 : les doubles en miroir (8,7 s, 1920x1200)

Cadre commun, voix et régénération : voir `strategy-echauffement/STORYBOARD.md`. Scène : `tools/cinematics/strategy/scenes/doubles.js`.
Idée : deux équipes identiques de part et d'autre d'une ligne de miroir (6 rouges / 6 bleus, 2 rangées de 3) : 6 + 6 = 12 ; la moitié de 12 : 12 − 6 = 6.

| Phrase | Début → durée | Texte |
|---|---|---|
| 0 | 0,30 s → 2,54 s | « Les doubles : deux équipes en miroir ! » |
| 1 | 2,96 s → 2,09 s | « Six et six, douze ! » |
| 2 | 5,16 s → 3,07 s | « La moitié de douze ? Six ! » |

## Plans

| Plan | Mouvement |
|---|---|
| P0 | Équipe rouge en pop échelonné (0,07 s). « 6 » dans la plaque (T0+0,3). La ligne pointillée du miroir se déroule du haut vers le bas (scaleY 0 → 1, `power2.out` 0,4 s, T0+0,38). Équipe bleue en pop échelonné à T0+0,55, « + 6 » (T0+0,75). |
| P1 | « = 12 » pop (T1+0,5) ; gros « 12 » doré (160 px) sur la ligne ; les 12 joueurs font un bond (30 px, 0,4 s) ; anneau jaune. |
| P2 | « 6 + 6 = 12 » sort ; « 12 − 6 » pop ; l'équipe bleue disparaît (unpop 0,25 s, échelonné 0,06 s), la ligne s'efface ; « 6 » doré au centre, « = 6 » (T2+0,62), anneau, `celebration` du Coach. |

Sons : `pop` T0+0,02 · `swoosh-in` T0+0,4 (0,5) · `pop` T0+0,55 · `star` T1+0,5 · `swoosh-out` T2+0,3 · `level-up` T2+0,62.
