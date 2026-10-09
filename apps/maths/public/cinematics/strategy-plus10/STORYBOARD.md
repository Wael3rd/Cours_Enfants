# strategy-plus10 — Zone 6 : +10, une équipe entière arrive (11,9 s, 1920x1200)

Cadre commun, voix et régénération : voir `strategy-echauffement/STORYBOARD.md`. Scène : `tools/cinematics/strategy/scenes/plus10.js`.
Idée : 7 joueurs rouges ; une équipe de 10 bleus court prendre place dans un cadre à 10 ; 7 + 10 = 17 : le 7 ne bouge pas, un « 1 » arrive devant ; 17 − 10 = 7.

| Phrase | Début → durée | Texte |
|---|---|---|
| 0 | 0,30 s → 2,48 s | « Plus dix : une équipe entière arrive ! » |
| 1 | 2,90 s → 2,42 s | « Sept plus dix, dix-sept. » |
| 2 | 5,44 s → 3,43 s | « Le sept reste là. Un un arrive devant ! » |
| 3 | 8,99 s → 2,38 s | « Dix-sept moins dix, sept. » |

## Plans

| Plan | Mouvement |
|---|---|
| P0 | 7 rouges (2 rangées) en pop, gros « 7 » blanc ; « 7 + 10 » (T0+0,15) ; le cadre à 10 (pop T0+0,3) ; les 10 bleus entrent par la droite (x 760 → 0, `power2.out` 0,5 s, 2 bonds, échelonnés 0,1 s, dès T0+0,35). Gros « 10 » doré (T0+0,75). |
| P1 | « = 17 » pop (T1+0,5) + anneau jaune sur le cadre. |
| P2 | Le « 7 » fait un bond d'échelle (1,25) : il reste là. Un « 1 » doré (scale 1,4) part du cadre et glisse devant le 7 (x `power2.out` 0,5 s, y/scale `power3.inOut`, dès T2+0,4) → « 17 » ; le « 10 » du cadre s'efface ; anneau cyan. |
| P3 | « 7 + 10 = 17 » sort ; « 17 − 10 » pop ; les 10 bleus ressortent à droite (`power2.in` 0,5 s, échelonné 0,05 s), le « 1 » et le cadre s'effacent ; « = 7 » pop (T3+0,7), le « 7 » rebondit, `celebration`. |

Sons : `pop` T0+0,02 · `swoosh-in` T0+0,35 · `star` T1+0,5 · `swoosh-in` T2+0,4 · `swoosh-out` T3+0,15 · `level-up` T3+0,72.
