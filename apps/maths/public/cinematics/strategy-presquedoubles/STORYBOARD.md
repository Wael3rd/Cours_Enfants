# strategy-presquedoubles — Zone 5 : presque-doubles (10,0 s, 1920x1200)

Cadre commun, voix et régénération : voir `strategy-echauffement/STORYBOARD.md`. Scène : `tools/cinematics/strategy/scenes/presquedoubles.js`.
Idée : 6 + 7 = le double 6 + 6 (deux équipes en miroir) plus un remplaçant jaune qui arrive ; famille : 13 − 7 = 6.

| Phrase | Début → durée | Texte |
|---|---|---|
| 0 | 0,30 s → 3,84 s | « Six plus sept ? Six plus six, douze. » |
| 1 | 4,26 s → 2,90 s | « Un remplaçant arrive : plus un, treize ! » |
| 2 | 7,27 s → 2,26 s | « Treize moins sept, six. » |

## Plans

| Plan | Mouvement |
|---|---|
| P0 | Plaque « 6 + 7 » (T0+0,05). Équipe rouge en pop (T0+0,35), ligne de miroir qui se déroule (T0+0,5, `power2.out` 0,35 s), équipe bleue (T0+0,62). « 6 + 7 » sort (T0+0,58) ; « 6 + 6 » puis « = 12 » + gros « 12 » (T0+0,74 / 0,93). |
| P1 | « 6 + 6 = 12 » sort ; « 6 + 7 » pop. Le remplaçant jaune n° 7 entre en bas, sur la ligne (x 700 → 0, `power2.out` 0,8 s, 4 bonds de 24 px) ; étiquette « +1 » ; « = 13 » + gros « 13 » (T1+0,72), anneau jaune. |
| P2 | « 6 + 7 = 13 » sort ; « 13 − 7 » pop ; les 7 joueurs bleus/jaune sortent (unpop échelonné 0,05 s), la ligne s'efface ; « = 6 » + « 6 » doré (T2+0,65), anneau, `celebration`. |

Sons : `pop` T0+0,35 et T0+0,62 · `swoosh-in` T1+0,05 · `star` T1+0,72 · `swoosh-out` T2+0,2 · `level-up` T2+0,7.
