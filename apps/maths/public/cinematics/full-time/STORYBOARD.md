# full-time — tableau d'affichage final (6,0 s, 1920x1200)

Données (canal `full-time`) : `{ home, away, scoreHome, scoreAway, win, goals, avgTime, bestStreak, stars }`
(`home`/`away` = `{name,primary,secondary,initials}` ; `win` bool ; `goals` entier ; `avgTime` ex. `"1,9 s"` ; `bestStreak` entier ; `stars` 0 à 3).
Défauts : Lions 3 – 2 Aigles, victoire, 4 buts, `1,9 s`, série 5, 2 étoiles.
Idée : le tableau de fin de match de la télé : coup de sifflet, le score se construit, le verdict claque, puis les stats se déposent comme des tuiles et les étoiles s'allument. Le joueur du club réagit (joie / déçu mais fier).

| t (s) | Plan / mouvement | Détail |
|---|---|---|
| 0.00 – 0.40 | **Plan fixe** stade assombri (brightness .45, flou 5 px) | Coup de sifflet triple (`whistle-triple` à 0.00). Bandeau « Coup de sifflet final » (jaune, Fredoka 700 56 px, marine) tombe du haut (y -200 → 0, `back.out(1.6)` 0.4 s). |
| 0.40 – 1.20 | **Entrée du tableau** | Panneau marine central (1400 x 430, coins coupés) monte depuis le bas (y +700 → 0, `expo.out` 0.6 s) ; les deux blasons (260 px) s'y posent en glissant depuis l'extérieur (x ∓500 → 0, `expo.out` 0.5 s, décalés de 0.08 s). `swoosh-in` à 0.40. |
| 1.00 – 1.90 | **Score** | Les deux scores (Anton 300 px) comptent de 0 à leur valeur (`countUp`, `power2.out`, domicile 1.00 → 1.45, extérieur 1.30 → 1.75) avec `tick` à chaque incrément ; pop (scale 1.4 → 1, `back.out(4)`) à la fin de chaque compteur. Le vainqueur reste en jaune, l'autre en blanc (`win` : domicile gagne). |
| 1.90 – 2.50 | **Verdict** | Plaque inclinée sous le tableau : « VICTOIRE ! » (vert pelouse + jaune) / « MATCH NUL » (bleu nuit) / « BEAU MATCH ! » (corail doux), scale 2.4 → 1 (`expo.out` 0.35 s) + secousse 12 px + anneau. Si `win` : confettis (70) et `roar-short`. Sinon : `crowd-ohhh` adouci. |
| 2.30 – 3.30 | **Stat-tuiles** | 3 tuiles (Buts / Temps moyen / Meilleure série, 480 x 230) montent du bas (y +260 → 0, `back.out(1.4)`, décalage 0.18 s) à 2.30 / 2.48 / 2.66 ; leurs chiffres comptent (Anton 130 px) pendant 0.6 s après chaque entrée (`goals`, `bestStreak` entiers ; `avgTime` décompte décimal avec virgule). `ui/streak-3` à chaque tuile. |
| 3.30 – 4.40 | **Étoiles** | 3 étoiles (180 px) sous le tableau : s'allument une à une (3.40 / 3.75 / 4.10) — scale 0 → 1.35 → 1 (`back.out(3)`), rotation -30° → 0, éclat (sparkle) ; les étoiles non gagnées restent en contour gris. `ui/star` à chaque étoile gagnée. |
| 0.00 – 6.00 | **Push-in très lent** (scale 1.00 → 1.05) | Le joueur (grosse tête, 380 px, en bas-gauche) : `celebration` si victoire (saut en boucle de 0.8 s) sinon `decu` (tête basse) qui passe à `idle` + sourire à 4.6 s (« courage »). Respiration en continu. |
| 5.40 – 6.00 | Sortie | Tuiles et étoiles gardent la pose ; le tableau fait un léger zoom de sortie (1.00 → 0.97) et le noir marine monte (opacité 0 → 1, 0.35 s). |

Sons : `whistle-triple` 0.00 · `swoosh-in` 0.40 · `tick` ×6 (compteurs) · `combo` 1.9 · `roar-short` (win) 1.95 · `streak-3` ×3 · `star` ×(étoiles gagnées, max 3).
Marges 5 % : bandeau y ≥ 60, tuiles bas ≤ 1120.
