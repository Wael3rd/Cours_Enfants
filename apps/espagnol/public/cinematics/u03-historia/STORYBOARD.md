# u03-historia — « El árbol sin nombres » (5 compositions `-1` … `-5`, ≈ 7,8 + 6,7 + 6,5 + 9,5 + 9,1 s)

Histoire jouée à Triana : ruelle chaulée à la **porte bleue** → **patio andalou** (fontaine, géraniums, sol de mosaïque) → **atelier de céramique** et sa fresque d'azulejos « El árbol de la familia » (noms effacés par des taches d'ombre).
Décors du kit : `callejonTriana`, `patioAndaluz`, `tallerCeramica` ; personnages : Marina, Álex, Abuela Carmen, Lola (+ chat orange), Tío Rafa (guitare, cazuela), la Sombra, le Quetzal. Bordure : frise d'azulejos « sevilla ». Caméra = `QStage.cam` (monde L×H, centre (px,py), zoom s). Données : canal `player` `{name}`.

## -1 · plan 1 « ¡Abuela! ¡Ya estamos aquí! / ¡Marina, cariño! ¡Qué alegría! » (7,8 s) — la ruelle
- **Caméra** : **suivi à hauteur d'enfant** (centre y 800, ×1,1) : elle part derrière Marina (x 700) et la suit pendant sa course vers la porte bleue (x → 2330, `power1.inOut`, 0 → 3,2 s) ; Álex court derrière. Marina appelle en courant (« ¡Abuela! »), freine devant la porte.
- La porte s'ouvre (battants qui se rabattent, `power2.out` .5 s, lumière chaude), **Abuela Carmen** apparaît dans l'encadrement, bras ouverts ; sur « ¡Qué alegría! » la caméra se recale sur le couple (×1,25, 1,0 s). Sons : pas, `rpg/door-open`, `ui/pop`.

## -2 · plan 2, répliques 1-2 « Y este chico, ¿quién es? / Hola, me llamo Álex. Encantado. » (6,7 s) — le patio
- **Caméra** : plan large du patio (fontaine au centre, ×0,95) → **push-in** vers le groupe (centre 1300,700, ×1,2, `sine.inOut`). Abuela serre Marina dans ses bras (étreinte : rapprochement + bras, rebond), puis se tourne vers Álex (« ¿quién es? ») ; Álex salue (bras levé) et se présente ; l'eau de la fontaine jaillit en continu.

## -3 · plan 2, réplique 3 « ¿Cómo te llamas? ¿De dónde eres? ¿Cuántos años tienes? » (6,5 s)
- **Caméra** : push-in lent sur Álex (centre 1500,700, ×1,15 → ×1,3). **Lola** déboule par la droite avec son **chat orange** dans les bras (x 2500 → 1900, 0,9 s), freine, enchaîne ses trois questions (rebonds sur chaque question) ; le chat remue la queue, Álex recule d'un pas, surpris.

## -4 · plan 3 « Mira, es el árbol de nuestra familia. ¡Pero los nombres no están! / Sin nombres, no hay familia… » (9,5 s) — l'atelier
- **Caméra** : plan large de la fresque (centre 1200,430, ×0,86) ; **dolly** vers Abuela au mot « nombres » (centre 760,650, ×1,15) ; sur la Sombra, **pan vif** vers l'arbre (centre 1200,430, ×1,05, 0,9 s, `power3.inOut`).
- Les 13 cartouches de noms sont recouverts de taches d'ombre noire (`fr-stain`) ; la Sombra sort de la fresque en fumée (yeux), les taches ondulent et s'assombrissent sur « familia » ; la lumière du four baisse (voile .3).

## -5 · plan 4 « La pluma… aquí. En el árbol. / Soy el tío Rafa. ¡Soy cocinero y hay comida para todos! » (9,1 s)
- **Caméra** : gros plan **sur le Quetzal** (centre 1200,420, ×1,6) perché devant la fresque ; le **carreau vert central** (`fr-feather`) s'allume (halo, anneaux) ; poussée ×2,4 sur le carreau (`power3.inOut`) puis **recul** (×1,0) quand **Tío Rafa** entre par la droite, guitare dans le dos et cazuela à la main ; il se présente (rebonds), Marina et Álex sourient. Sons : `ui/star`, `rpg/spell-magic`, `rpg/level-up`.
