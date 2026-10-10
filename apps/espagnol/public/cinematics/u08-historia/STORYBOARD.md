# u08-historia — « Las calles sin nombre » (4 compositions `-1` … `-4`, ≈ 10,6 + 7,9 + 9,2 + 10,7 s)

La Candelaria (rue pavée, maisons colorées à balcons de bois, Monserrate dans la brume) → panneaux et plans **sans lettres** → la Sombra sur un toit → le sanctuaire de Monserrate.
Décors du kit `14-bogota.js` : `calleCandelaria` (3200×1200 ; `bgSignPost` = poteaux à deux plaques, `bgCityMap` = plan mural, lettres = barres `.bg-let`, **aucun texte**), `bogotaSkyline` (panorama de crépuscule, utilisé au -4). Personnages : Camila (ruana rouge), Hernán (casquette verte), Marta (tablier fleuri), Marina, Álex, le Quetzal, la Sombra (`08d-characters-colombia.js`). Bordure : frise textile `colombia`. Mouvement sûr : aucun flash (`QCine.bloom` ≤ 0,2), halo du sommet ≥ 1,3 s/cycle, étincelles ≥ 0,45 s.

## -1 · plan 1 « Siete plumas… ¡Ya falta poco! / ¡Hola! Me llamo Camila y soy de Bogotá. ¡Bienvenidos a La Candelaria! » (≈ 10,6 s)
- **Caméra** : plan large de la rue (×0,66) qui pousse vers Álex et Marina (×0,95 puis ×1,1) ; Monserrate au fond, plan de la ville au mur à droite (sans noms).
- ≈ 0,9 s : le **Quetzal sort de l'épaule de Marina** (échelle 0 → 1, `back.out`), s'élève, parle. **Camila arrive en courant** par la droite (x 3100 → 1280, 1,5 s), freine (squash), salue (« ¡Hola! »), le groupe rebondit. Sons : swoosh, pas, pops.

## -2 · plan 2 « Pero hay un problema: los letreros no tienen letras y los mapas están en blanco. / ¿Y quién roba las letras? » (≈ 7,9 s)
- **Caméra** : groupe → **gros plan sur les deux poteaux** aux plaques vides (anneaux dorés qui s'ouvrent sur « letreros ») → **pan** vers le grand plan mural vierge (« mapas ») → recul.
- Camila montre du bras gauche puis du droit, sourcils inquiets ; **Hernán et Marta tournent en rond** au fond (marche, demi-tour, sourcils `worry`). Marina pose la question (saut, tête). Aucune lettre nulle part.

## -3 · plan 3 « Sin palabras, no hay mapas. Sin mapas, nadie sabe dónde está. / ¡Todos se pierden! » (≈ 9,2 s)
- Les plaques ont encore leurs lettres. **La Sombra** apparaît sur le toit d'en face (fumée, yeux qui s'allument) ; le soir tombe (voile #dim ≤ 0,22, 1,2 s).
- **12 lettres s'envolent** des plaques le long de courbes (MotionPath, 1 s chacune, échelle → 0.2) vers la Sombra comme de l'encre aspirée ; les plaques se vident (fondu 0,25 s). Volutes d'encre autour d'elle (≥ 1 s).
- **Caméra** : poteaux → pan vers le toit (×1,25 → ×1,5) → recul sur le groupe ; Camila sursaute sur « ¡Todos se pierden! » (bras levé, saut).

## -4 · plan 4 « La pluma… está arriba, en Monserrate. / Para devolver las palabras a las calles, tienen que decir dónde está cada cosa. ¡Vamos! » (≈ 10,7 s)
- Décor : `bogotaSkyline` (crépuscule), le **bus rouge** passe derrière les personnages. Les quatre au premier plan, regards levés.
- Le **Quetzal s'envole** (MotionPath, battements .38 s) vers le sanctuaire ; **caméra** : plan large → **push-in sur le sommet** (×2,1, 1,7 s) où le **point vert** apparaît et respire (halo ≥ 1,3 s/cycle, étincelles douces). Camila tend le bras (« arriba ») puis explique ; recul, le Quetzal revient, **« ¡Vamos! »** : trois sauts. Sons : swoosh, spell-magic, star, pop, level-up.
