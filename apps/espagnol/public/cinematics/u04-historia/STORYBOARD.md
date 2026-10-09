# u04-historia — « Los autorretratos sin cara » (5 compositions `-1` … `-5`, ≈ 10,1 + 9,8 + 8,2 + 7,5 + 10,2 s)

Plaza Hidalgo (Coyoacán) → **Casa Azul** (patio cobalt, galerie d'autoportraits que la Sombra a « effacés ») → le dernier cadre vide.
Décors du kit : `plazaHidalgo` (3200×1200 : Parroquia, kiosque, étals à ballons, jacarandas), `casaAzulPatio` (2400×1200 : mur cobalt, 4 cadres, porte au fond) + `autorretrato` (figures **génériques**, fleurs dans les cheveux ; états `full` / `erased` / `blank`). Personnages : Mateo (casquette bleue, lunettes), Valentina, Marina, Álex, Doña Lupita (vendeuse, fond), le Quetzal, la Sombra. Bordure papel picado. Caméra = `QStage.cam` (monde L×H, centre px,py, zoom s). Mouvement sûr : aucun flash (`QCine.bloom`), lueur verte des cadres qui respire ≥ 1,2 s/cycle, étincelles ≥ 0,4 s.

## -1 · plan 1 « México… ¡Estoy en casa! / ¡Qué onda! Me llamo Mateo y soy de Coyoacán. ¿Ustedes son los viajeros? » (≈ 10,1 s) — la plaza
- **Caméra** : **plan large** de la plaza (centre 1500,650, ×0,66) qui pousse (`sine.inOut`, 3,4 s) vers le groupe à gauche (centre 1080,760, ×1,0) ; Álex et Marina (x 760 / 900) au bord de la place, Lupita derrière son étal (x 2650, fond), ballons qui flottent (±14 px, 2,6 s).
- ≈ 0,9 s : le **Quetzal sort de derrière l'épaule de Marina** (échelle 0 → 1, `back.out(1.8)`), ouvre grand les ailes sur « ¡Estoy en casa! » (battements .38 s).
- Fin de sa réplique : **Mateo arrive en trottinant** par la droite (x 2300 → 1250, 1,5 s, `power1.out`, marche .27 s/pas) ; la caméra le suit (**pan** vers la droite, centre 1250,760 ×1,1, 1,3 s) ; il lève la main (« ¡Qué onda! »), parle (rebonds par mot).
- Sons : `swoosh-in`, pas d'herbe, `pop`, pas ×3, `pop`.

## -2 · plan 2 « Soy alto y delgado, y siempre llevo una gorra azul. / Yo soy Marina. Tengo el pelo largo y negro. Y él es Álex. » (≈ 9,8 s) — champ / contre-champ
- **Champ** : plan moyen sur Mateo (centre 1280,780, ×1,45) ; sur « alto » il se dresse (échelle Y +4 %), sur « delgado » il serre les bras (jambes/bras fins), sur « gorra azul » il touche sa casquette (bras levé) ; aucun texte ajouté.
- **Contre-champ** (début de la 2ᵉ réplique) : **whip-pan** (0,5 s, `power3.inOut`) vers Marina + Álex + Quetzal sur son épaule (centre 820,770, ×1,3) ; Marina agite sa couette sur « pelo largo y negro », montre Álex sur « él es Álex » (bras tendu), Álex salue.

## -3 · plan 3, réplique 1 « Por favor, necesito ayuda. Los autorretratos no tienen cara. ¡Y no hay colores! » (≈ 8,2 s) — la Casa Azul
- **Caméra** : sur le **mur d'autoportraits** (centre 800,420, ×1,05) — 4 cadres : les 3 premiers ont une **tache grise** à la place du visage et des couleurs éteintes (voile gris), le 4ᵉ est vide. Panoramique lent vers la droite (centre 1250,520, 3,0 s, `sine.inOut`).
- ≈ 0,8 s : **Valentina** jaillit de la porte (x 2020 → 1500, 1,0 s, `power2.out`), fleurs dans les cheveux, mains jointes ; sur « ¡Y no hay colores! » elle écarte les bras (inquiète : sourcils `worry`). Álex, Marina, Mateo à gauche (x 700 / 880 / 1050) se retournent (rebond d'attention). La caméra recule (×0,9) pour les cadrer tous.

## -4 · plan 3, réplique 2 « Sin colores, no hay cara… Sin palabras, no hay retrato. » (≈ 7,5 s) — la Sombra
- **Caméra** : **push-in** lent (centre 1100,520, ×0,95 → ×1,25, `power2.in`) vers le mur. La **Sombra** sort du mur à droite (yeux, `sombraEyes`), plane devant les cadres ; sur « Sin colores » le voile gris du 3ᵉ cadre **s'épaissit** (0,6 s), sur « Sin palabras » le 4ᵉ cadre perd sa figure (`.ar-fig` → 0, 0,5 s). Lumière du patio qui baisse (voile .3). Mateo/Marina reculent d'un pas.

## -5 · plan 4 « La pluma… está en el último autorretrato. / Para devolver las caras, tienen que decir cómo son las personas. ¡Vamos! » (≈ 10,2 s)
- **Caméra** : **gros plan** sur le dernier cadre vide (centre 1445,410, ×1,9) : un **halo vert** (`.ar-glow`) monte lentement (0 → 0,7 en 0,9 s) et respire (1,3 s/cycle) ; le **Quetzal** vole jusqu'au cadre (MotionPath, 0,9 s) et le montre du bec. Sur la 2ᵉ réplique : **recul** (centre 1250,560, ×0,95, `power2.inOut`, 1,3 s) sur Valentina qui ouvre les bras (« ¡Vamos! ») et le groupe qui bondit (`hop`).
- Sons : `swoosh-in`, `spell-magic`, `star`, `pop`, `level-up`.
