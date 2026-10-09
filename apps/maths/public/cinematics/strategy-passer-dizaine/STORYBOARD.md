# strategy-passer-dizaine — Zone 8 : passer la dizaine (11,3 s, 1920x1200)

Cadre commun, voix et régénération : voir `strategy-echauffement/STORYBOARD.md`. Scène : `tools/cinematics/strategy/scenes/passer-dizaine.js`.
Idée : 8 + 5 = 8 + 2 + 3 : on remplit d'abord le 1er cadre à 10 avec 2 remplaçants, les 3 autres vont dans un 2e cadre ; 10 + 3 = 13 ; famille : 13 − 5 = 8.

| Phrase | Début → durée | Texte |
|---|---|---|
| 0 | 0,30 s → 2,81 s | « Huit plus cinq : remplis d'abord le cadre ! » |
| 1 | 3,23 s → 2,16 s | « Huit plus deux, dix. » |
| 2 | 5,51 s → 3,00 s | « Il reste trois : dix plus trois, treize ! » |
| 3 | 8,62 s → 2,21 s | « Treize moins cinq, huit. » |

## Plans

| Plan | Mouvement |
|---|---|
| P0 | Cadre A (2 x 5) en pop ; 8 rouges le remplissent (pop échelonné 0,05 s) ; gros « 8 » ; « 8 + 5 » ; 5 remplaçants jaunes sur le banc (en bas, pop échelonné 0,06 s) ; étiquette « 5 = 2 + 3 » (T0+0,85). |
| P1 | « 8 + 2 » : 2 remplaçants glissent du banc aux postes 9 et 10 de A (`power2.inOut` 0,55 s, décalés 0,14 s) ; « 8 » → « 10 » doré ; « = 10 » (T1+0,62) + anneau. |
| P2 | « 10 + 3 » ; cadre B en pop (T2+0,1) ; les 3 derniers glissent dans B ; « 3 » au-dessus de B ; « = 13 » + gros « 13 » (T2+0,68) + anneau. |
| P3 | « 13 − 5 » ; les 5 jaunes disparaissent (unpop échelonné 0,06 s), B s'efface ; « 8 » revient ; « = 8 » (T3+0,6), anneau, `celebration`. |

Sons : `pop` T0+0,1 · `swoosh-in` T1+0,12 · `star` T1+0,62 · `swoosh-in` T2+0,2 · `star` T2+0,68 · `swoosh-out` T3+0,15 · `level-up` T3+0,64.
