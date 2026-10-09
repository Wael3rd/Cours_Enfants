# strategy-amoureux10 — Zone 4 : les amoureux de 10 (11,6 s, 1920x1200)

Cadre commun, voix et régénération : voir `strategy-echauffement/STORYBOARD.md`. Scène : `tools/cinematics/strategy/scenes/amoureux10.js`.
Idée : le cadre à 10 = une formation de 10 postes. 7 joueurs sont là, il en manque 3 ; 3 remplaçants jaunes courent combler (7 + 3 = 10) ; famille : 10 − 7 = 3.

| Phrase | Début → durée | Texte |
|---|---|---|
| 0 | 0,30 s → 3,14 s | « Amoureux de dix : ensemble, ça fait dix ! » |
| 1 | 3,56 s → 2,28 s | « Sept joueurs : il en manque trois ! » |
| 2 | 5,95 s → 2,19 s | « Sept plus trois, dix ! » |
| 3 | 8,26 s → 2,81 s | « Dix moins sept ? Trois ! » |

## Plans

| Plan | Mouvement |
|---|---|
| P0 | Le cadre à 10 (2 x 5 postes pointillés, 890 x 380 px) apparaît (pop 0,4 s). Gros « 10 » doré (pop `back.out(3)`) à droite + « 10 » seul dans la plaque (T0+0,6). |
| P1 | 7 joueurs rouges n° 1–7 prennent leurs postes (pop échelonné 0,06 s). Plaque : « 7 + ? = 10 » (le « ? » en cyan à T1+0,55). Les 3 postes vides restent en pointillés. |
| P2 | « 7 + ? » sort ; « 7 + 3 » pop. Les 3 remplaçants jaunes (n° 8–10) entrent par la droite (x 900 → 0, `power2.out` 0,55 s, 3 bonds de 22 px, échelonnés 0,13 s) et se placent. « = 10 » pop (T2+0,55), anneau jaune, cœur qui claque (`back.out(3)`), le « 10 » fait un bond d'échelle (1,25). |
| P3 | « 7 + 3 = 10 » sort ; « 10 − 7 » pop ; les 7 rouges s'estompent (opacité .55, 0,3 s), les 3 jaunes sautent (34 px) ; « = 3 » pop (T3+0,55), anneau, `celebration`. |

Sons : `pop` T0+0,02 et T1+0,02 · `swoosh-in` T2+0,1 · `star` T2+0,6 · `combo` T3+0,55 · `level-up` T3+0,62.
