# u09-historia — « Las piedras mudas » (7 compositions `-1` … `-7`, ≈ 7,2 + 9,1 + 8,2 + 5,7 + 7,5 + 7,6 + 9,6 s)

Selva (sentier) → pied d'**El Castillo** (murs de pierre lisses) → le Sombra sur le temple, elle aspire les glyphes → le **cénote sacré** (la plume brille au fond).
Les répliques longues (> 12 s au total pour un plan) imposent plus de parties que de plans : les plans 1 à 4 sont découpés par réplique (`{ n, lines }` dans `CINES`).
Décors du kit `15-yucatan.js` : `selvaSentier` (3200×1200 : arbres à lianes, fougères, sentier, ruine dans la brume), `elCastillo` (3200×1500 : pyramide 9 gradins, escalier, temple ; **panneaux vides** = `slots` où l'on pose `yuGlyph`), `templeCima` (2400×1200 : façade du temple vue de près, frise et pilastres = 9 `slots`), `cenote` (2400×1200 : caverne, ouverture sur la selva, rayon de lumière, eau, rebord de pierre, `glow` = position du reflet vert).
Personnages : Itzel (huipil blanc brodé, tresses, panier), Don Chan (chapeau de paille, guayabera, moustache grise) — `08f-characters-yucatan.js` ; Álex, Marina, le Quetzal, la Sombra. Glyphes mayas **génériques** (motifs inventés). Bordure papel picado. Mouvement sûr : aucun flash, rayons du cénote ≤ 0,25 en opacité, lueur de la plume qui respire ≥ 1,4 s/cycle.

## -1 · Quetzal « México… ¡Estoy en casa! Pero la selva está muy callada. » (≈ 7,2 s) — la selva
- **Caméra** : plan large (centre 1500,660, ×0,72) qui se resserre sur le groupe (×0,92). Álex et Marina sur le sentier, feuilles qui tombent (14).
- ≈ 0,5 s : le **Quetzal sort de l'épaule de Marina**, vole de tronc en tronc (MotionPath, 8 points), bat des ailes ; sur « callada » Álex et Marina se regardent, soucieux ; il se repose près d'eux.

## -2 · Itzel « ¡Hola! Me llamo Itzel y vivo cerca de Chichén Itzá. Hablo maya con mi abuela y español con mis amigos. » (≈ 9,1 s)
- **Itzel arrive en trottinant** par la droite (x 3000 → 1690, 1,9 s), panier au bras, salue (« ¡Hola! »), tend le bras vers la forêt sur « Chichén ». Le Quetzal sur l'épaule de Marina se gonfle de joie. Caméra : plan large à droite → plan moyen sur le groupe (×1,0 → ×1,12). Sous-titres réduits (46 px) pour tenir sur deux lignes.

## -3 · Don Chan « Las piedras hablaban, pero ahora están mudas. Los dibujos de los mayas han desaparecido. » (≈ 8,2 s) — El Castillo
- **Caméra** : plan large de la pyramide (×0,58) qui descend vers Don Chan et le mur (×0,92 → ×1,06). Il **passe la main sur la pierre vide** (bras qui balaie 6 fois), sourcils inquiets sur « mudas » ; les **glyphes fantômes** (très pâles, 13 %) palpitent une fois sur « dibujos ». Les autres reculent d'un hochement.

## -4 · Itzel « Es la Sombra. Se lleva las historias. » (≈ 5,7 s)
- Itzel lève le bras vers le sommet sur « Sombra » ; **la caméra monte** le long de la pyramide (×1,06 → ×0,95 → ×1,3 sur le temple) ; la **Sombra** apparaît devant la porte (fumée, puis deux yeux), gouttes d'encre ; la lumière baisse un peu (voile ≤ 0,22).

## -5 · Sombra « Sin historia, no hay memoria. Sin memoria, nadie habla. » (≈ 7,5 s) — le sommet
- Façade du temple en gros plan (×0,86 → ×1,08) ; la Sombra (620 px) flotte devant la porte. **Les 9 glyphes** (encre rouille) se détachent un par un (≈ 0,6 s d'écart), glissent en arc vers elle et s'y fondent ; à chaque capture elle gonfle de 3,5 % (0,18 s). Les panneaux restent vides. Les yeux se plissent puis se rouvrent.

## -6 · Chan « ¡No! Esas piedras tienen mil años. » + Quetzal « La pluma… está en el agua. » (≈ 7,6 s)
- **Plan 3** : Don Chan, en bas des marches du temple, lève les deux bras, saute (« ¡No! »), les bras tremblent ; la Sombra plane à droite. **Fondu enchaîné** (0,3 s) vers le **cénote** : le groupe sur le rebord, le Quetzal perché sur Marina ; sur « agua » le **reflet vert** (plume + halo) monte dans l'eau.

## -7 · Itzel « Es el cenote sagrado. Para devolver la memoria a las piedras, tienen que conocer la historia de México. ¡Vamos! » (≈ 9,6 s)
- Cénote, caméra lente (×0,95 → ×1,04). Itzel tend le bras vers l'eau (« cenote »), le reflet de la plume palpite. Sur « ¡Vamos! » : tout le groupe bondit, le Quetzal s'envole vers le cénote. Rides de l'eau (cycles ≥ 1,6 s).
