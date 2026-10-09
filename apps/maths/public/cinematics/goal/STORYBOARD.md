# goal — "BUUUT !" (2,5 s, 1920x1200)

Données (canal `goal`) : `{ name, calc, time, scoreHome, scoreAway }`, défauts `Léo`, `7 + 8 = 15`, `1,8 s`, 1, 0.
Idée : le tir qu'on voit venir (ballon qui part de la caméra vers la cage), la caméra qui "tombe" dans le but avec lui, et l'explosion TV.

## Plans

| t (s) | Plan / mouvement | Détail |
|---|---|---|
| 0.00 – 0.55 | **Push-in** caméra sur la cage (scale 1.00 → 1.14, origine 50 % 58 %, `power2.in`) | Le ballon (220 px) part du bas-gauche (x 380, y 1000) et file vers la cage au fond du terrain en arc : x `power2.out`, y `power1.out` (monte puis se tasse), taille 220 → 62 px (perspective), rotation 900°. Traînée blanche derrière lui (étirée, `power1.in`). SFX `kick` à 0.00. Les rayons des projecteurs sont déjà allumés. |
| 0.55 | **Impact** | `ball-net` à 0.55. Flash blanc (opacité 0 → 0.95 en 0.05, retombe en 0.45 `power2.out`). Le fond du filet gonfle (scale 1.10, `elastic.out(1,0.4)` 0.5 s), secousse caméra amortie (18 px, 0.4 s). Onde de choc : anneau jaune qui s'agrandit (scale 0.2 → 3.4, opacité 1 → 0, 0.55 s `expo.out`). |
| 0.55 – 0.95 | **BUT !** claque | Mot "BUT !" (Anton 470 px, blanc, contour marine + extrusion corail) : scale 3.2 → 1 (`expo.out` 0.38 s) puis rebond (scale 1.06 → 1, `back.out(3)`), rotation -9° → -3°. Rayons dorés tournants derrière (rotation 40° sur toute la durée). Confettis balistiques : 90 morceaux depuis le haut de la cage (0.58). `crowd-goal` (monté, fondu en sortie) dès 0.5. Flashs d'appareils dans la foule 0.6 → 1.6 (densité 100 %). |
| 0.90 – 1.30 | **Score bug** | Descend du haut (y -240 → 0, `expo.out` 0.45). Le score maison passe de N-1 à N à 1.25 avec pop (scale 1.5 → 1, `back.out(4)`) + `ui/combo`. |
| 1.00 – 1.55 | **Lower-third** | Glisse depuis la gauche (x -1300 → 0, `expo.out` 0.55). Prénom (Anton) puis ligne calcul + temps : la ligne se révèle en wipe gauche → droite (clip-path inset, 0.4 s `power2.out`) à 1.28. `ui/swoosh-in` à 1.0, `ui/star` à 1.3. |
| 1.55 – 2.10 | Maintien | Le mot flotte (y -14, `sine.inOut`), la caméra continue de pousser lentement (→ 1.18). |
| 2.15 – 2.50 | Sortie | Mot : y -90, opacité → 0 (`power2.in` 0.3 s). Lower-third et score bug repartent vers la gauche / le haut (`power3.in` 0.3 s). Cadre fixe sur le stade vide à la fin. |

Sons : `kick` 0.00 · `ball-net` 0.52 · `crowd-goal` 0.50 (fondu 0.6 s) · `combo` 1.25 · `swoosh-in` 1.00 · `star` 1.30.
Marges de sécurité 5 % : le lower-third est à x ≥ 96, y ≤ 1104 ; le score bug à y ≥ 60.
