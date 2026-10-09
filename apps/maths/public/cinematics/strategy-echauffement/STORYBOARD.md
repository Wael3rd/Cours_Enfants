# strategy-echauffement — Zone 1 : +0 et +1 (10,7 s, 1920x1200)

Aucune donnée dynamique (voix pré-générée, pas de prénom). Source de vérité : `tools/cinematics/strategy-scripts.json` + `strategy/scenes/echauffement.js`
(`node tools/cinematics/strategy-build.mjs echauffement` régénère `index.html`, voix, timings, SFX).
Idée : +0 = personne n'entre, +1 = un joueur entre sur le terrain, −1 = un joueur sort (famille 7+1=8 → 8−1=7).

Cadre commun (toutes les `strategy-*`) : fond marine + halo, médaillon doré de la zone (« +1 ») + « ZONE 1 / Échauffement » à gauche, Coach (pose `explique`,
respiration `idleCycle`, petit rebond `bounce.out` au début de chaque phrase, pose `celebration` sur le résultat final), terrain vu de dessus (1360x800) à droite,
plaque d'équation (Anton 200 px, opérateurs rose, résultat jaune) dessous. Entrées en `pop` (`back.out(2.2)`, 0,3 s), sorties `power2.in` 0,22 s. Fondu marine 0,3 s en entrée et en sortie.

Voix (Henri +8 %, +3 Hz) : un mp3 par phrase, durées mesurées (ffprobe) → `PLAN.t` / `PLAN.d` ; `T(i,f)` = début de la phrase i + f × sa durée.

| Phrase | Début → durée | Texte |
|---|---|---|
| 0 | 0,30 s → 2,76 s | « Plus zéro, rien ne change : sept. » |
| 1 | 3,18 s → 2,02 s | « Plus un : un joueur entre ! » |
| 2 | 5,32 s → 2,02 s | « Sept plus un, huit ! » |
| 3 | 7,46 s → 2,73 s | « Un joueur sort : huit moins un, sept ! » |

## Plans

| Plan | Mouvement |
|---|---|
| P0 (T0 → T0+2,7) **7 joueurs, +0** | 7 maillots rouges n° 2–8 arrivent en pop échelonné (0,07 s). Gros « 7 » doré (pop). Équation « 7 + 0 » puis « = 7 » (T0+0,74). Étiquette « +0 » + fantôme pointillé « 0 » qui rétrécit et sort à gauche (`power2.in` 0,5 s) : rien ne change. |
| P1 (T1) **+1 : il entre** | « 7 + 0 = 7 » rétrécit (unpop) ; « 7 + 1 » pop. Un joueur jaune n° 8 court du bord droit à sa place (x 640 → 0, `power2.out` 1,0 s) avec 4 petits bonds de 28 px. Étiquette « +1 » jaune. |
| P2 (T2) **huit !** | « = 8 » pop (T2+0,45). « 7 » → « 8 » (unpop 0,18 s, pop `back.out(3)`). Le nouveau joueur saute (−40 px `power2.out` 0,18 s, retour `bounce.out`). |
| P3 (T3) **−1** | « 7 + 1 = 8 » sort ; « 8 − 1 » pop, étiquette « −1 » rose. Le joueur jaune ressort à droite (`power2.in` 0,9 s, 4 bonds). « 8 » → « 7 » ; « = 7 » pop à T3+0,78 ; le Coach saute de joie (`celebration`). |

Sons (volume) : `pop` T0+0,05 (0,5) · `swoosh-in` T1+0,10 (0,6) · `star` T2+0,55 (0,7) · `swoosh-out` T3+0,12 (0,6) · `level-up` T3+0,80 (0,6).
Vérifs : `npx hyperframes check` à 0 ; snapshots `node tools/cinematics/strategy-snap.mjs echauffement` (une image à la fin de chaque phrase).
