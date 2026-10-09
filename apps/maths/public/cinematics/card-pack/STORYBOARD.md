# card-pack — ouverture d'un paquet de cartes (3,0 s, 1920x1200)

Données (canal `card-pack`) : `{ card:{ name, number, position, rarity, primary, secondary } }` (`rarity` : `bronze|argent|or|legende`).
Défaut : « Léo Martin », n° 10, ATT, `or`, rouge/blanc.
Idée : le geste qu'on adore : le paquet tombe, ça tremble, ça se déchire, la lumière jaillit, la carte monte et se retourne avec un reflet. Plus la rareté est haute, plus l'explosion est grosse.

| t (s) | Plan / mouvement | Détail |
|---|---|---|
| 0.00 | **Plan fixe** sur un fond de studio (dégradé marine, vignette, rayons très doux, pas de stade) | Fond `radial-gradient` marine + halo bleu derrière le centre. |
| 0.00 – 0.50 | **Chute du paquet** | Paquet (480 px, centre x 960) tombe du haut : y -1100 → 0, `bounce.out`-like (`power2.in` 0.30 puis rebond `back.out(2)` 0.2) ; ombre au sol qui s'élargit (scale .4 → 1). Léger écrasement à l'arrivée (scaleY .93 → 1). `swoosh-in` à 0.00, `pop` à 0.32. |
| 0.50 – 0.95 | **Tremblement** (tension) | Rotation ±5° et x ±8 px, 6 oscillations de plus en plus rapides (0.07 s), halo doré qui monte derrière (opacité 0 → .8) ; `tick` ×3 à 0.55 / 0.7 / 0.85. |
| 0.95 – 1.20 | **Déchirure** | Le haut du paquet (`.pk-top`) saute : y -380, rotation 28°, x +260, opacité → 0 (0.3 s `power2.out`) ; le corps glisse vers le bas et s'efface (y +420, scale .85, `power2.in` 0.3 s). Flash blanc plein cadre (0.85 → 0, 0.3 s), anneau, rayons dorés (rotation + opacité 0 → .6). `ui/pop` + `hit05` à 0.95. |
| 1.05 – 1.65 | **La carte monte** | Carte (dos) 420 px apparaît au centre, monte de y +260 → 0 et grossit (scale .7 → 1.0, `expo.out` 0.55 s). |
| 1.55 – 2.05 | **Retournement** (rotationY, perspective 1600) | Dos : rotationY 0 → 90 (`power2.in` 0.25 s) ; face : -90 → 0 (`power2.out` 0.25 s) avec scale 1 → 1.18 → 1.12 (pic au milieu). Au moment de la face : `level-up` + `star`. Les couleurs de rareté éclatent : confettis (nombre = bronze 20 / argent 40 / or 70 / légende 120), étincelles (bronze 0 / argent 3 / or 5 / légende 8), anneau ; légende : onde de chroma (halo arc-en-ciel) + `crowd-cheer`. |
| 2.00 – 2.55 | **Reflet holographique** | Bande lumineuse oblique balaie la carte de gauche à droite (`power2.inOut` 0.55 s) ; pour la légende, deuxième passage 2.45. Léger flottement (y ±8, rotation ±1.2°). |
| 2.55 – 3.00 | Maintien + sortie | Plan quasi fixe, scale 1.12 → 1.15 ; fondu marine sur les 0.25 dernières secondes. |

Sons : `swoosh-in` 0.00 · `pop` 0.32 · `tick` ×3 · `pop` + `hit05` 0.95 · `level-up-big` 1.6 (légende) · `star` 1.62 · `roar-short` 1.65 (or + légende, volume modulé par la rareté côté mixage = fixe 0.5).
Marges 5 % : carte (420 x 588) centrée.
