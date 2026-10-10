# u09-intro — « Capítulo 9 · ¡Viva México! · Yucatán » (2 compositions `-1`, `-2`, ≈ 7,0 + 6,2 s)

Carte du monde (papel picado) : de Bogotá au Yucatán → carte-titre → survol aérien de la selva (drone) qui descend vers El Castillo.
Kit : `worldMap` / `mapTravel` / `mapFogClear` (comme `u04-intro`), `yucatanSkyline` (`15-yucatan.js` : 5 calques de parallaxe sky / sun / far / mid / near ; la canopée en rangées, El Castillo, le cénote turquoise, la lagune), `yuFlamingo` (flamant, aile `.fl-wing`).
Bordure `mexico` = papel picado. Mouvement sûr : `QCine.bloom` (halo ≤ 0,25, montée ≥ 0,3 s) pour la carte-titre, `QCine.shake` ≤ 10 px ; battements d'ailes des flamants = transforms (≈ 2 Hz, petits objets).

## -1 · plan 1 « Capítulo nueve : ¡Viva México! » + plan 2 (1re réplique) « Yucatán, en el sureste de México. » (≈ 7,0 s)
- **Plan 1** : zoom de la carte sur Bogotá (×2,1) → recul (×1,3) → plongée sur le Yucatán (×3,0) ; la ligne dorée Bogotá → Yucatán se trace, le pion la suit, le brouillard de la région s'écarte. Sur « nueve » : carte-titre `CAPÍTULO 9 / ¡VIVA MÉXICO! / YUCATÁN` (bandeau de fanions, confettis, étincelles, `bloom`).
- **Whip-pan** vers le plan 2 (traînées).
- **Plan 2** : panorama de la canopée. Parallaxe (mid −1000 px) : le cénote turquoise passe à gauche, El Castillo apparaît à droite, la lagune entre dans le cadre et **7 flamants** s'envolent (battements d'ailes, trajectoire montante vers la gauche). Pastille de lieu « YUCATÁN, MÉXICO ».

## -2 · plan 2 (2ᵉ réplique) « Selva, cenotes y pirámides : aquí viven los mayas desde hace miles de años. » (≈ 6,2 s)
- Reprend exactement le décor de la fin de `-1` (la pyramide au centre) et **descend** : zoom ×1 → ×2,5 centré sur El Castillo (`power1.inOut`), la canopée et les palmes d'avant-plan défilent. Un 2ᵉ vol de flamants traverse le ciel d'est en ouest. Pastille « CHICHÉN ITZÁ » sur « pirámides ».
