# strategy-plus2 — Zone 2 : +2 = deux passes (9,2 s, 1920x1200)

Cadre commun, voix et régénération : voir `strategy-echauffement/STORYBOARD.md` (même gabarit). Scène : `tools/cinematics/strategy/scenes/plus2.js`.
Idée : 6 + 2 = deux passes de ballon sur trois plots numérotés 6 → 7 → 8, puis le ballon revient (8 − 2 = 6).

| Phrase | Début → durée | Texte |
|---|---|---|
| 0 | 0,30 s → 2,07 s | « Plus deux : deux passes ! » |
| 1 | 2,49 s → 3,82 s | « Une passe : sept. Encore une : huit ! » |
| 2 | 6,43 s → 2,23 s | « Et huit moins deux, six. » |

## Plans

| Plan | Mouvement |
|---|---|
| P0 | Plot « 6 » + joueur n° 1 en pop (T0). « 6 + 2 » (T0+0,15), étiquette « +2 » (T0+0,3), ballon (T0+0,5). Les plots 7 et 8 apparaissent estompés (opacité .35, `back.out(2)` 0,35 s) pour montrer le chemin. |
| P1 | Passe 1 à T1+0,02 : arc 400 px, sommet 190 px (`power2.out` montée / `power2.in` descente, 0,55 s), ballon qui tourne (360°). Étiquette « +1 » à mi-vol. Arrivée : plot 7 allumé, joueur 2 en pop. Passe 2 à T1+0,52 (même arc) vers le plot 8 ; « = 8 » pop à T1+0,8 + anneau jaune. |
| P2 | « 6 + 2 = 8 » sort ; « 8 − 2 » pop ; le ballon revient en 2 petits arcs (0,42 s, sommet 160 px) avec étiquettes « −1 » roses ; les plots 7/8 s'estompent derrière lui ; « = 6 » pop (T2+0,66), anneau, Coach en `celebration`. |

Sons : `pop` T0+0,05 · `kick` T1+0,03 et T1+0,53 (0,45) · `star` T1+0,8 · `kick` T2+0,2 (0,4) · `level-up` T2+0,7.
