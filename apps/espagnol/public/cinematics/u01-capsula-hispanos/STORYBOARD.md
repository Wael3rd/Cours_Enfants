# u01-capsula-hispanos — « El español en el mundo » (2 compositions `-1`, `-2`, 9,0 + 8,7 s)

Cápsula cultural, style explainer (Vox / documentaire) sur fond indigo à points (« halftone »), pays hispanophones en turquoise, accents or. Voix off `narrador` (4 répliques).
Aucune donnée dynamique (le prénom n'apparaît pas). Source citée à l'écran : Instituto Cervantes (≈ 600 M de locuteurs, ≈ 500 M de langue maternelle).

## Partie 1 · plan 1 — « El español se habla en muchos países. » · **plan fixe** sur le planisphère (aucun mouvement de caméra)
- Titre en haut à gauche : barre or qui se trace (`expo.out`), kicker « CÁPSULA CULTURAL », titre « El español en el mundo » (monte + clip-path, `expo.out`).
- Cascade calée sur les mots : España (mot 1) → México y Centroamérica (« habla ») → Sudamérica (« muchos ») → Guinea Ecuatorial (« países »). Chaque pays : fondu + sur-luminosité qui retombe, double anneau qui se propage, pastille + trait (`back.out(2.4)`). Le Brésil (lusophone) reste sombre avec la pastille grise « Brasil: portugués ».
- Sons : `ui/swoosh-in`, `ui/star` sur chaque pays.

## Partie 1 · plan 2 — « Unos seiscientos millones de personas hablan español. »
- Transition : voile indigo (.82) sur la carte qui continue de pousser lentement (×1,2) en fond.
- Compteur **0 → 600 000 000** (`power2.out`) jusqu'à « millones », chiffre en Alfa 214 px avec ombre turquoise, rebond à l'arrivée ; « PERSONAS » en or sur le mot « personas ».
- Waffle de 100 points (1 point = 6 M) qui se remplissent au rythme du compteur : 83 or (≈ 500 M de langue maternelle) + 17 turquoise ; légende « 500 millones: lengua materna » + « Fuente: Instituto Cervantes ».
- Sons : `ui/tick`, `rpg/coins` (doux), `jingles/steel00` sur « seiscientos ».

## Partie 2 · plan 3 — « España, México, Argentina… ¡y muchos más! »
- Fond : la carte, tous les pays hispanophones allumés, voile .7, push lent ×1,06.
- Trois cartes-pays (drapeau, monument du kit — Sagrada Familia, pyramide, obélisque —, nom en Alfa) montent du bas avec roulis (`back.out(1.5)`), une par mot, puis flottent ; son `ui/pop` à chaque nom.
- « ¡y muchos más! » : les cartes reculent (×.72), 9 pastilles de pays (Colombia, Perú, Chile, Cuba, Venezuela, Ecuador, Guatemala, Bolivia, Uruguay) montent en gerbe (`back.out(1.9)`, décalage .12 s). Son `ui/combo`.

## Partie 2 · plan 4 — « El viaje del Quetzal empieza en España. »
- Fondu (0,45 s) vers la carte. **Caméra** : serrée sur l'Espagne (×1,6) avec le pin « Madrid » qui rebondit (`bounce.out`) + anneaux ; puis, au mot « empieza », **elle recule** (`power2.inOut`, ×1,6 → ×1,0) en suivant la plume du Quetzal qui s'envoie **vers l'ouest** sur un arc (MotionPath, `autoRotate`, battement) ; le pointillé turquoise se trace derrière (masque `strokeDashoffset`).
- Sons : `ui/swoosh-out`, `rpg/spell-magic`, `rpg/level-up` en fin.
