# u02-historia — « La campana muda » (5 compositions `-1` … `-5`, ≈ 8,8 + 8,5 + 5,1 + 9,1 + 7,6 s)

Histoire jouée dans le **Colegio Fray Luis de León** (patio de pierre dorée, claustre à arcades, campanile au cadre de cloche **vide**) puis dans la salle de classe.
Décors du kit : `colegioPatio` (enfants **figés** en silhouettes de papier gris-bleu — le silence de la Sombra), `aula` (tableau vert, fenêtre qui donne sur la façade de l'Université et sa grenouille).
Personnages (chibis du kit) : Doña Pilar, Diego, Marina, Álex (`viajero`), la Sombra, le Quetzal. Bordure : frise d'azulejos « salamanca ». Caméra = `QStage.cam` (monde 2400×1200, centre (px,py), zoom s).
Données : canal `player` `{name}` (plaque d'orateur et sous-titre du joueur). Chaque partie ≤ 12 s, enchaînée par fondu depuis/vers l'encre.

## -1 · plan 1 « ¡Perdón, perdón! ¡Llego tarde! / Buenos días, Diego. La campana no suena. » (8,8 s)
- **Caméra** : plan large (centre 1300,640, ×0,84 → ×0,90, `sine.inOut`) sur le patio : on lit d'un coup d'œil les enfants figés (jeu de balle, corde à sauter, course : tous en arrêt) puis, pendant la réplique de Pilar, **travelling** vers elle (centre 1380,650, ×1,2, `power2.inOut`, ≈ 1,4 s).
- Diego déboule de la gauche en courant avec son bocadillo (x −300 → 760, 0,8 s, `power2.out`, jambes/bras du kit), freine (squash), parle (bouche mot à mot + rebonds). Pilar, immobile, tient la grande **cloche muette** (bronze terni) au bout du bras.
- Sur « suena » : la cloche oscille 3 fois (±14°) **sans aucun son** ; un ♪ barré gris monte et s'éteint. Sons : pas, `ui/pop`, `rpg/bell` très bas (étouffé).

## -2 · plan 2, réplique 1 « Hola, me llamo Diego. Tengo doce años… ¿Y tú eres Marina? » (8,5 s)
- **Caméra** : serrée sur Diego et Pilar (centre 1060,650, ×1,2), puis pan droite (centre 1500, ×1,1, 0,9 → 2,4 s, `power2.inOut`) quand Álex et Marina entrent par la droite (marche, x 2150 → 1500 / 1700), cadre final sur le trio (1250, ×1,15).
- Diego croque son bocadillo (mâche, avale) puis se présente ; sur « ¿Eres Álex? » il montre Álex (bras −70°) qui hoche la tête ; sur « ¿Y tú eres Marina? » il montre Marina qui salue.

## -3 · plan 2, réplique 2 « Sí, somos viajeros. Buscamos una pluma. » (5,1 s)
- **Caméra** : push-in lent sur Marina (centre 1560,640, ×1,15 → ×1,35, `sine.inOut`). Marina avance d'un pas ; sur « pluma » elle sort la plume du Quetzal de sa poche (plume verte lumineuse, `back.out`), halo vert ; Pilar et Diego ouvrent grand les yeux (`charEmote`).

## -4 · plan 3 « La Sombra quiere un colegio sin voces… / Sin palabras, no hay clase… » (9,1 s) — la salle de classe
- **Caméra** : plan large du tableau vide (centre 1200,560, ×0,85 → ×0,9) ; pendant la réplique de Pilar, **dolly** vers elle (centre 850,700, ×1,15, `power2.inOut`) ; à la réplique de la Sombra, **pan** vif vers le tableau (centre 1250,420, ×1,0, 0,9 s, `power3.inOut`) avec léger roulis (1,5° → 0).
- La Sombra (kit) monte du tableau en fumée, yeux violets ; l'inscription « SIN PALABRAS, NO HAY CLASE » s'écrit **en cendre noire**, mot à mot sur sa voix (wipe + éclats de cendre). Cartables sur les pupitres, silence : la lumière de la fenêtre baisse (voile indigo .35 sur la réplique de la Sombra).

## -5 · plan 4 « Una pluma… cerca. ¡Aquí! / La rana de la Universidad. ¡Vamos! » (7,6 s)
- **Caméra** : départ large côté fenêtre (centre 1600,560, ×1,0) ; le Quetzal sort du cartable posé sur le pupitre (vol vers la vitre) ; la caméra **pousse sur la grenouille** vue par la fenêtre (×2,6, `power3.inOut`, 3,4 s) pendant que son halo vert s'allume (anneaux qui rayonnent) ; puis **recule** (×1,05) sur Diego, Marina et Álex qui partent en courant (« ¡Vamos! »).
- Sons : `ui/star` + `rpg/spell-magic` quand la grenouille brille, `rpg/level-up` sur « ¡Vamos! ».
