# e01-intro — « Evento · Día de Muertos · Oaxaca » (1920×1200, 2 compositions : `e01-intro-1` ≈ 10 s, `e01-intro-2` ≈ 6,5 s)

Intro de l'événement (25 oct → 2 nov). Voix : `narrador` (2 répliques) puis `sombra` (« Sin recuerdos, no hay fiesta… Apago las velas. »). Temps = `window.PLAN` (es-build) ; animations calées sur les ancres.
Bordure : **papel picado** (région `mexico`, exclusivement mexicain). Ton : joyeux et respectueux, rien d'effrayant (la menace = la Sombra qui éteint les bougies, jamais un squelette qui bondit).
**Mouvement sûr dès la conception** : aucune lumière qui claque (`QCine.bloom` ≤ 0,25, montée ≥ 0,3 s ; `QCine.shake` ≤ 10 px), bougies = halos qui respirent en ≥ 0,8 s d'amplitude faible, pas de `mix-blend-mode` ni de filtre animé, confettis/étincelles en classes `.cf` / `.spark` (masquées en « Animations douces »).

## Partie 1 (`e01-intro-1`)

### Plan 1 — La carte du Mexique (0 → ≈ 3,9 s) · « Evento especial: Día de Muertos. »
- **Caméra** : carte large (×0,74, roulis −2,5°) → zoom serré sur Oaxaca (×3,4, `power2.inOut`, 0 → 1,3 s, roulis → 0) puis dérive ×1,05 jusqu'au whip. Le pion de la carte glisse de Ciudad de México à Oaxaca (`mapTravel` .25 → 1,2 s) ; **point orange qui pulse** sur Oaxaca (`mapPulse` ×3).
- **Carte-titre** (violet nuit, bandeau de losanges cempasúchil/magenta) sur **deux guirlandes de papel picado magenta et turquoise** qui traversent le cadre (balancement ±3°, 2,8 s) : « EVENTO » (mot « especial »), **DÍA DE MUERTOS** claque (échelle 2,2 → 1, `expo.out` 0,5 s) sur « Día », ruban terracotta « OAXACA » (clip-path, 0,45 s). Lueur douce chaude (`bloom` 0,2) + secousse 8 px + rayons orange (opacité ≤ 0,28, rotation 10° sur toute la durée) + 30 confettis de papier + 8 étincelles. Sons : `ui/swoosh-in`, `jingles/steel00` + `rpg/spell-cast` au mot clé.

### Transition — whip-pan (≈ 3,9 s) : plan 1 part à gauche (x −2300, skew −16°, `power3.in` 0,34 s), plan 2 entre par la droite (0,7 s, `power3.out`, fondu d'opacité 0,45 s), 7 traînées crème.

### Plan 2 — Oaxaca au crépuscule (≈ 3,9 → 10 s) · « Oaxaca, México. Una fiesta para recordar con alegría. »
- **Caméra** : **travelling latéral lent** gauche → droite, parallaxe 6 calques (ciel −100, lune −140, lointain −300, façades −700, personnages −1000, premier plan −1280 px ; `power1.inOut`) + push-out 1,06 → 1,0 (`sine.out`).
- Décor (kit `oaxacaSkyline`) : ciel violet → orange, premières étoiles ; collines et **église baroque en cantera** (silhouette) ; rue de maisons coloniales ocre / rose / turquoise aux fenêtres chaudes (halo qui respire 1,6–2,4 s), **guirlandes de papel picado** tendues d'une façade à l'autre ; devantures avec **pan de muerto** et **calaveras de azúcar** ; premier plan : pavés avec **pétales de cempasúchil** et bougies, étal de pan de muerto.
- **Personnages** (rient, balancent) : Xóchitl avec sa couronne de cempasúchil court en sautillant de gauche à droite (`S.walk`-like, 4 s), Doña Remedios dans l'encadrement d'une porte, Beto à son étal d'alebrijes. Mouvements d'enfants : sauts doux 40 px.
- Pastille « OAXACA, MÉXICO » (glisse de la gauche, `expo.out`). Sons : `ui/star` après « Oaxaca », `ui/pop` sur « fiesta ».

## Partie 2 (`e01-intro-2`)

### Plan 3 — La bougie qui s'éteint (≈ 0 → 6,5 s) · « Sin recuerdos, no hay fiesta… Apago las velas. » (Sombra, voix grave et lente)
- Décor (kit `patioOfrenda`) : patio d'Oaxaca de nuit, mur d'adobe ocre sombre, petit autel à gauche (nappe de papel picado, photo encadrée, cempasúchil, 5 bougies), arche de fond.
- **Caméra** : plan moyen sur l'autel, **push-in** lent ×1,0 → ×1,16 centré entre l'autel et Xóchitl (`power2.inOut`, 6 s), légère dérive vers la gauche (−60 px).
- 0,4 s : Xóchitl entre, serre une photo contre elle (bras croisés, `back.out(1.4)`), souffle d'inquiétude (sourcils). 1,1 s : l'**ombre de la Sombra** (silhouette plate violet foncé, opacité 0,5) glisse sur le mur de droite à gauche (x +900 → −400, `sine.inOut`, 4 s, léger étirement). Quand elle passe devant chaque bougie, la flamme **rétrécit et s'éteint en 0,5 s** (une par une, espacées de 0,35 s, `power2.in`), le voile de nuit passe à 0,35 (`sine.inOut`, 1,4 s) — jamais brusque. La voix de la Sombra démarre à 0,5 s.
- Fin : Xóchitl lève la tête, la dernière bougie reste (petite flamme) ; fondu vers l'encre (0,3 s). Sons : `rpg/spell-magic` bas (0,25), `ui/pop` ×2 par bougie éteinte (volume 0,25).
