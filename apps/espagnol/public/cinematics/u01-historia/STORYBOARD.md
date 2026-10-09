# u01-historia — « La Academia de Viajeros » (4 compositions `u01-historia-1` … `-4`, 9,2 → 10,1 s chacune, ≈ 39 s)

Scène d'histoire jouée à la suite (l'app enchaîne les 4 parties, mêmes `data`). Chaque plan du scénario `u01.json` = une composition.
Décor : `academiaRoom` (mur ocre, azulejos, fenêtre au couchant, bibliothèques, carte stellaire du monde, bureau, tapis, valises) ; personnages vectoriels du kit
(Don Ignacio, Álex, Marina) + Quetzal. Caméra = `QStage.cam(px,py,zoom)` (cadre un point de la salle 2400×1200 au centre de l'écran). Sous-titres mot à mot avec portrait du locuteur.
Données : canal `player` `{name}` → mot « Álex » des sous-titres, plaque de l'orateur, étiquette au-dessus du joueur. Défaut `Álex`.

## Partie 1 — Accueil (ignacio ×2, viajero) · plan large qui descend, push-in, légère contre-plongée
- Caméra : départ haut (plafond/lanternes, zoom 1,0, roulis 1,4°) → descend et pousse vers la conversation (zoom 1,16 en `power2.inOut` jusqu'à la 2ᵉ réplique) puis `sine.inOut` 1,24.
- Carte de lieu « Capítulo 1 / La Academia de Viajeros » (glisse depuis la gauche, `expo.out`, repart à 3 s).
- Álex entre en marchant (cycle de marche du kit, 5 pas de 0,34 s, `power1.out`), Ignacio salue (bras levé qui oscille), étincelles d'accueil sur « Bienvenido », éclair doré léger.
- « Y tú, ¿cómo te llamas? » : Ignacio se penche, bulle « ¿? » (`back.out(2.6)`) ; « Me llamo Álex. » : étiquette-prénom pop au-dessus d'Álex + saut de joie.
- Sons : `rpg/door-open`, pas, `ui/open`, `ui/pop` sur le prénom, `ui/swoosh-out` en sortie.

## Partie 2 — La plume et le Quetzal (ignacio, quetzal) · gros plan sur le Quetzal
- La plume verte (lueur) tombe du plafond en spirale (MotionPath, `sine.inOut` 1,55 s) et se pose sur le bureau ; la caméra la suit (tilt vers le bas `power2.inOut`) puis resserre sur le bureau (zoom 1,5 → 1,6, `power3.inOut`).
- Le Quetzal presque sans plumes entre en titubant (zigzag MotionPath, roulis ±8°), atterrit (squash 0,86, poussière), pose « triste », plumes ternes, tremble, bec animé mot à mot.
- Ignacio désigne l'oiseau (bras tendu qui oscille), sourcils inquiets.
- Sons : `ui/swoosh-in`, `rpg/spell-magic` (plume), `rpg/step-00` (atterrissage), `rpg/item-get` doux.

## Partie 3 — La Sombra (ignacio, quetzal) · dolly lent puis push-in
- Caméra : dolly vers la droite (la carte) zoom 1,5, puis push-in vers le Quetzal (1,76) à sa supplique (`power2.inOut`). Roulis 1° → 0.
- Ambiance : la lumière baisse (`#dim`), teinte magenta, lanternes qui vacillent. **La Sombra** (silhouette de fumée, yeux magenta, lueur) glisse sur la carte en 3,4 s ; les points-plumes de la carte s'éteignent à son passage puis reviennent faibles.
- Ignacio : bras qui illustrent, tête qui hoche, sourcils inquiets ; Quetzal : pose « talk », petits sauts sur « ¡Ayúdame! », battements d'ailes.
- Sons : `rpg/spell-hit` (grave), `rpg/spell-magic`, `ui/pop`.

## Partie 4 — Marina (marina, ignacio) · whip-pan, plan large, pull-out
- Whip-pan : la caméra file de la gauche (zoom 1,1) vers le groupe (`expo.out` .7 s) avec skew −9° et 7 traînées ; Marina entre en courant (période de pas 0,22 s) puis rebondit.
- Marina se présente : étiquettes qui apparaissent sur les mots — « Marina », puis pastille « Sevilla » (pin magenta), puis « Madrid » (pin terracotta) ; elle salue, Álex lui répond.
- « La primera pluma está en Madrid » : le point de Madrid sur la carte grossit et pulse. **« ¡Vamos! »** : tout le monde saute (décalage 0,06 s), le Quetzal se redresse (pose « happy »), éclair doré, 36 confettis de papel picado, push-in 1,06 → 1,16 (`power3.out`).
- Sons : `ui/swoosh-in`, pas ×3, `ui/pop`, `jingles/nes04` sur « ¡Vamos! », `rpg/level-up`.

Musique `aventure-douce.mp3` continue d'une partie à l'autre (`data-media-start`), voix `viajero.*` inchangées.
