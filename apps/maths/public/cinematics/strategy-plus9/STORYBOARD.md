# strategy-plus9 — Zone 7 : +9 = +10 puis −1 (11,8 s, 1920x1200)

Cadre commun, voix et régénération : voir `strategy-echauffement/STORYBOARD.md`. Scène : `tools/cinematics/strategy/scenes/plus9.js`.
Idée : 8 + 9 : l'équipe de 9 est « presque 10 » (une place vide) ; 8 + 10 = 18 ; un joueur sort (−1) → 17 ; famille : 17 − 9 = 8.

| Phrase | Début → durée | Texte |
|---|---|---|
| 0 | 0,30 s → 2,45 s | « Plus neuf : presque plus dix ! » |
| 1 | 2,87 s → 2,38 s | « Huit plus dix, dix-huit. » |
| 2 | 5,37 s → 3,40 s | « Un joueur sort : moins un. Dix-sept ! » |
| 3 | 8,89 s → 2,38 s | « Dix-sept moins neuf, huit. » |

## Plans

| Plan | Mouvement |
|---|---|
| P0 | 8 rouges (2 x 4) en pop, gros « 8 » ; « 8 + 9 » ; le cadre à 10 apparaît, 9 bleus se placent (pop échelonné 0,06 s) : le 10e poste reste vide en pointillés ; gros « 9 » doré (T0+0,8). |
| P1 | « 8 + 10 » ; « 9 » → « 10 » ; le 10e joueur (jaune) arrive par la droite (x 760 → 0, `power2.out` 0,5 s, 2 bonds) ; « = 18 » pop (T1+0,55) + anneau. |
| P2 | « 18 − 1 » ; étiquette « −1 » rose ; le joueur jaune ressort à droite (`power2.in` 0,6 s) ; « 10 » → « 9 » ; « = 17 » (T2+0,62) + anneau. |
| P3 | « 17 − 9 » ; les 9 bleus quittent le cadre vers la droite (`power2.in` 0,45 s, échelonné 0,04 s), le cadre s'efface ; « = 8 » (T3+0,7), le « 8 » rebondit, `celebration`. |

Sons : `pop` T0+0,02 et T0+0,4 · `swoosh-in` T1+0,1 · `star` T1+0,55 · `swoosh-out` T2+0,25 · `star` T2+0,65 · `level-up` T3+0,72.
