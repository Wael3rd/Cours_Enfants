# medal — médaille du Sprint 100 m (4,0 s, 1920x1200)

Données (canal `medal`) : `{ medal:"or"|"argent"|"bronze", time, record }` (`time` ex. `"12,4 s"`, `record` booléen). Défauts : `or`, `12,4 s`, `false`.
Idée : l'arrivée sur la piste. Le chrono se fige, la médaille descend sur son ruban comme un pendule, le temps s'inscrit ; si c'est un record, un tampon « NOUVEAU RECORD ! » claque avec confettis.

| t (s) | Plan / mouvement | Détail |
|---|---|---|
| 0.00 – 0.50 | **Plan large piste** : tilt-down | Le monde `#cam` (piste en perspective, tribunes floues au fond) descend : y -260 → 0, scale 1.2 → 1.0 (`power3.out` 0.9 s). Piste rouge brique, couloirs blancs. Pistolet/arrivée : `whistle-short` à 0.00. |
| 0.20 – 0.80 | **Ruban + médaille** | Le ruban bleu/rouge entre du haut, la médaille (480 px de large, centre x 960) descend : y -1100 → 0 (`expo.out` 0.6 s). Elle se balance autour du point d'accroche en haut du ruban : rotation +16° → -11° → 7° → -4° → 0 (4 allers-retours amortis, 0.9 s total, `sine.inOut`), `transform-origin: 50% 0`. `steel00` à 0.70 (choc du métal). |
| 0.80 – 1.40 | **Éclat** | Flash blanc (0.6 → 0 en 0.35 s), anneau couleur du métal (scale .3 → 3, 0.6 s `expo.out`), 4 étincelles autour du disque, reflet (`.md-glint`) qui balaie la médaille (opacité .2 → 1 → .2). Rayons tournants derrière (couleur du métal, opacité 0 → .45). `level-up` (or) / `star`. |
| 1.30 – 2.00 | **Chrono** | Plaque marine « Ton temps » + chiffres Anton 200 px jaunes à droite de la médaille ; le temps compte 0,0 → valeur en 0.6 s (`power2.out`, décimale virgule). `tick` ×3 pendant le décompte. La plaque entre depuis la droite (x +900 → 0, `expo.out` 0.5 s). Position de la médaille décalée à gauche (x -300) pour laisser la place (`power3.inOut` 0.5 s à 1.2). |
| 2.00 – 3.00 | **Record** (si `record`) | Tampon « NOUVEAU RECORD ! » (rouge corail, Anton 130 px, contour blanc, rotation -8°) : scale 3.4 → 1 (`expo.out` 0.3 s) + secousse caméra 14 px ; confettis (90) aux couleurs or/blanc/corail ; étoiles qui pulsent. `level-up-big` + `roar-short`. Si pas de record : phrase « Bravo, continue comme ça ! » (Fredoka 700 70 px) à la place, entrée douce (y +40 → 0, 0.4 s). |
| 3.00 – 4.00 | Maintien + sortie | Push-in lent 1.0 → 1.06, médaille qui respire (scale 1 → 1.03), fondu marine sur les 0.3 dernières secondes. |

Rangs : or = 1, argent = 2, bronze = 3 (chiffre sur le disque). Marges 5 % : plaque temps y 480–800, x ≤ 1824.
Sons : `whistle-short` 0.00 · `steel00` 0.70 · `level-up` 0.82 · `tick` ×3 · `level-up-big` 2.0 · `roar-short` 2.0.
