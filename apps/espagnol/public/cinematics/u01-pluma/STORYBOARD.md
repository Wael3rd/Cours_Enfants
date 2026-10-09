# u01-pluma — « Primera pluma » (1 composition, 9,7 s)

Victoire du chapitre 1 : la Sombra se brise, la plume tombe, le Quetzal repousse, la carte indique Salamanca. Voix : `quetzal` (« ¡Gracias, amigo! ¡Hola! ») puis `ignacio` (« Ahora, a Salamanca. »).
Données : canal `player` `{name}` (initiale du pion de carte) ; nom de la plume lu dans `u01.json` (`pluma.nombre`, `pluma.numero`).

## Plan 1 — La Sombra se brise (0 → 6,5 s) · la voix du Quetzal arrive à 3,3 s (après l'action)
- **Caméra** : push-in tendu sur le duel (×1,0 → 1,1, `power2.in`, 1,7 s), **secousse** à l'explosion (±22 px, 0,28 s), puis respiration large (`power3.out`).
- 0,3 s : Álex lève le bras, un cercle runique doré s'allume devant lui (`back.out(1.8)`, tourne) ; rayon de lumière vers la Sombra (0,75 s, scintille). 0,9 → 1,5 s : 5 fissures de lumière se tracent sur la Sombra (dashoffset), elle tremble et blanchit.
- **1,7 s : explosion** — éclair blanc, 70 éclats triangulaires or/crème en gerbe + poussière d'étincelles qui monte, rayons dorés, le fond passe de la nuit à l'aube (`#dawn`, 1,4 s).
- 2,0 → 3,3 s : la plume verte (lueur) descend en tournoyant (MotionPath, `sine.inOut`), Álex saute et la rattrape (flash + 10 étincelles). Le Quetzal arrive en volant, la plume file vers lui et **ses plumes repoussent** (`quetzalRegrow` : queue en cascade élastique, huppe, couleurs) ; il parle (bec animé), salue.
- Bandeau « PLUMA 1 · Pluma de la Voz » (descend, `back.out(1.7)`, flotte) pendant sa réplique.
- Sons : `rpg/spell-cast`, `rpg/spell-magic`, `rpg/spell-hit` (1,7 s), `rpg/item-get` (prise), `rpg/level-up-big` sur la réplique.

## Transition — éclair de lumière (6,5 s) : flash crème (0,22 s) puis la carte.

## Plan 2 — La carte (6,5 → 9,4 s) · « Ahora, a Salamanca. »
- **Caméra** de carte : sur Madrid (×2,2) → cadre Madrid + Salamanca (×2,9, 0,9 s, `power2.out`) → se resserre sur Salamanca (×3,4, 1,6 s, `power2.inOut`).
- Le pion d'Álex part de Madrid et suit le pointillé jusqu'à Salamanca (saut, `mapTravel`) ; le **brouillard (nuages) de Salamanca se dissipe** (`mapFogClear` : couches qui s'écartent, gonflent, s'effacent), la médaille s'allume ; une empreinte lumineuse pulse sur la ville.
- Sons : `ui/swoosh-out`, `rpg/bell` + `ui/star` à l'arrivée.
