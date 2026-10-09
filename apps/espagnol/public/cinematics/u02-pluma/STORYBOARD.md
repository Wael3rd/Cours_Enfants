# u02-pluma — « Segunda pluma » (1 composition, ≈ 10,2 s)

Même gabarit que `u01-pluma` (récompense : la Sombra recule, la plume est libérée, carte vers la région suivante). Voix `pilar` (« ¡La campana suena! ¡Gracias, viajeros! ») puis `quetzal` (« Gracias, amigos. Ahora hablo más. »).
Décors du kit : `colegioPatio` (enfants figés → vivants), `fachadaUniversidad` (grenouille), carte `worldMap` (brouillard de Sevilla). Bordure : frise d'azulejos « salamanca ».

## Plan 1 — La cloche sonne, la grenouille s'ouvre (0 → ≈ 6 s)
- **0 → 1,1 s — patio, plan large** (centre 1250,640, ×0,95) : la cloche de Doña Pilar vire du gris terne au **bronze** (flash doré, `rpg/bell`) et **sonne à toute volée** (±32°, battement .38 s). Des anneaux de son (4 ellipses dorées, `power2.out`) et des notes ♪ s'envolent ; les silhouettes figées des enfants se **colorent** (fondu .35 s) et sautent de joie (rebond ±14 px). Sons : trois coups de cloche + `ui/star`.
- **Caméra** : poussée continue sur Pilar (centre 1300,700, ×1,25, `sine.inOut`, jusqu'à « suena »).
- **« ¡La campana suena! »** : Pilar rit, bras levés au mot « suena ».
- **Whip-pan** (sur « ¡Gracias » − 0,2 s) : plan 1b — la **façade de l'Université** en gros plan, la **grenouille** au centre. Elle s'**ouvre** comme un couvercle (bascule −16° autour de sa charnière, `back.out(2)`), une lumière verte jaillit (halo, anneaux), une **plume verte** monte en tournoyant (`sine.inOut`), puis file vers le haut-droite et s'éteint. Caméra : poussée ×1,0 → ×1,25 centrée sur la grenouille. Sons : `rpg/spell-magic`, `rpg/item-get`, `rpg/level-up-big`.

## Plan 2 — La carte, Sevilla (≈ 6 → 10,2 s) · « Gracias, amigos. Ahora hablo más. »
- Whip-pan sur la carte d'Espagne. **Caméra** : cadrée sur Salamanca (×2,4) → recule au milieu du trajet (×2,0, `power2.out`) → **zoom sur Sevilla** (×3,2, `power2.inOut`, 1,6 s).
- Le pion d'Álex suit la ligne dorée Salamanca → Sevilla (`mapTravel`, 1,2 s) ; le brouillard de Sevilla s'écarte (`mapFogClear`) ; une **empreinte lumineuse** (anneau + étincelle) pulse sur Sevilla.
- Le **Quetzal, plus vert** (queue repoussée aux ⅔), bat des ailes au premier plan à gauche (battements .34 s) et **parle** (bec mot à mot). Sons : `ui/swoosh-out`, `ui/star`, `rpg/spell-cast`.
