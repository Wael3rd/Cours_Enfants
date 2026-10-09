# e01-capsula-muertos — « Día de Muertos: una fiesta, no Halloween » (cápsula explainer, 4 compositions ≤ 12 s)

Style explainer papier découpé (fond indigo à points, `QCap`), voix `narrador` (5 répliques), bordure papel picado (`mexico`). Ton respectueux et joyeux ; **aucun logo ni marque réels** (le « sceau » du plan 5 est un laurier de papier générique), aucune moquerie envers Halloween (simple signe « ≠ » entre deux étiquettes).
Palette : cempasúchil #FF9F1C, magenta #D93472, turquoise #19B7AA, violet #6B3E9A, crème #F5E6C8.
**Mouvement sûr** : pas de flash (étincelles `QCap.sparks` = classe `.q-fx`, masquées en mode doux), bougies = halos qui respirent ≥ 0,8 s, confettis rares, aucun filtre animé.

## Partie 1 `e01-capsula-muertos-1` (plan 1, ≈ 8 s) — « En México, el uno de noviembre… el dos, a los adultos. »
- Plan fixe + animations de papier. Bloc titre en haut à gauche (« CÁPSULA CULTURAL » / titre) qui se retire au mot « uno » (x −60, 0,35 s).
- Mot 3 (« el ») : un **calendrier de papier** (carte crème, bandeau magenta « NOVIEMBRE ») pop depuis le bas (`back.out(1.5)`, 0,55 s, y +160 → 0). Mot 4 (« uno ») : grand **« 1 »** en tampon (échelle 2 → 1, `expo.out` 0,4 s). Mot 12 (« niños ») : pastille « los niños » + **Xóchitl (buste)** monte dans un cadre turquoise (`back.out(1.7)`), bobine douce ±10 px sur 1,4 s. Mot 19 (« dos ») : la page se tourne (rotation Y simulée par scaleX 1 → 0 → 1, 0,5 s) sur un grand **« 2 »** ; mot 22 (« adultos ») : pastille « los adultos » + **Doña Remedios et Beto (bustes)** dans des cadres magenta et orange.
- Fond : 3 grandes fleurs de cempasúchil en papier tournent lentement (rotation 25°/ 8 s). Sons : `ui/swoosh-in`, `ui/tick` sur « 1 » et « 2 », `ui/pop` sur chaque cadre.

## Partie 2 `e01-capsula-muertos-2` (plan 2, ≈ 7 s) — « En la ofrenda hay fotos, velas, flores, pan de muerto… »
- **Caméra** : push-in lent ×1,0 → ×1,08 (`sine.inOut`, toute la partie), centré sur l'autel.
- L'**ofrenda à trois étages** (kit `ofrendaSvg`) se construit : nappes de papel picado par étage (mot « ofrenda »), puis un objet par mot : **fotos** (cadres, tombent depuis le haut, `back.out(1.6)` 0,5 s), **velas** (flammes qui s'allument en fondu 0,4 s puis respirent), **flores** (cempasúchil, échelle 0 → 1), **pan de muerto**, **comida favorita** (assiette de mole + verre d'eau). Chaque objet reçoit sa pastille d'appel (« fotos », « velas », « flores », « pan de muerto », « la comida ») qui s'efface en 0,3 s.
- Papel picado qui flotte en haut de l'autel (balancement ±3°). Sons : `ui/pop` par objet, `rpg/item-get` doux sur « comida ».

## Partie 3 `e01-capsula-muertos-3` (plan 3, ≈ 11 s) — « Los pétalos de cempasúchil hacen un camino de color naranja… hasta su casa. »
- Nuit bleue, rue vue en plongée légère ; une maison à porte ouverte à droite (halo chaud qui respire 2 s).
- **Caméra** : travelling latéral gauche → droite le long du chemin (x −420 sur 10 s, `power1.inOut`) + zoom 1,0 → 1,1.
- Le **chemin de pétales** orange se dessine pétale par pétale de la rue vers la porte (cadence 0,06 s, fondu 0,3 s, `sine.out`), bougies qui s'allument tous les 3 pétales (fondu 0,4 s). Au mot « guía » : une **petite lueur dorée** (halo doux ≤ 0,5) suit le chemin jusqu'à la porte (MotionPath 3,2 s, `power1.inOut`), la porte s'illumine (halo 0,22 en 0,5 s). Pastille « el camino de cempasúchil ».
- Sons : `ui/tick` régulier (volume 0,2) sur le tracé, `rpg/door-open` sur « casa », `ui/star`.

## Partie 4 `e01-capsula-muertos-4` (plans 4 + 5, ≈ 11,8 s)
### Plan 4 (≈ 5,5 s) — « No es Halloween: es una fiesta alegre, con música, colores y comida. »
- Montage de papier sur 4 « cartes » qui entrent chacune sur un mot-clé (`back.out(1.6)`, 0,5 s, rotation ±4°) : **calavera de azúcar** colorée (« alegre »), **Catrina** stylisée (« música »), **guirlande de papel picado** (« colores »), **pan de muerto + tamal** (« comida »).
- Mot « Halloween » : étiquette grise-bleutée « Halloween » ; mot « es » suivant : signe **≠** (échelle 1,6 → 1, `expo.out`) puis étiquette chaude « Día de Muertos » ; aucune image effrayante.
- Transition vers le plan 5 : le papier glisse vers le haut (y −1300, 0,5 s, `power3.in`).
### Plan 5 (≈ 6,2 s) — « Desde 2008, esta tradición es Patrimonio Cultural Inmaterial de la Humanidad. »
- Planisphère explainer : le Mexique s'allume (`explainerMap` + `.x-hi-mx`, fondu 0,7 s) ; **zoom caméra** ×1 → ×2,4 sur le Mexique (`power2.inOut`, 1,4 s). **Sceau de papier** (laurier + sparkle + cempasúchil, sans symbole réel) pop à droite, ruban « 2008 », étiquette « Patrimonio Cultural Inmaterial de la Humanidad · 2008 » (pastille or, glisse depuis le bas, 0,5 s). Sons : `ui/star`, `rpg/level-up` sur « Humanidad ».
