# u04-capsula-frida — « Frida Kahlo y la Casa Azul » (3 compositions `-1`, `-2`, `-3`, ≈ 11,2 + 8,4 + 10,9 s)

Cápsula culturelle en **papier découpé** sur fond indigo à points (comme `u03-capsula-familias`), `_shared/qcap.js` ; bordure papel picado ; voix `narrador`. Aucune donnée dynamique. Tous les « effets » sont des apparitions de papier (`Cap.pop`, ressort + roulis) ; aucun flash ; étincelles = `Cap.sparks` (≥ 0,45 s). Les autoportraits sont des figures **génériques** (pas de portrait réel).

## -1 · plans 1-2 « Frida Kahlo nace en 1907 en Coyoacán, en la Casa Azul. / Frida pinta más de cincuenta autorretratos, muchas veces con un espejo. » (≈ 11,2 s)
- **Plan 1 — caméra fixe** : le bloc titre (« FRIDA KAHLO ») s'écrit à gauche ; la **façade de la Casa Azul** (murs cobalt, porte verte) monte en papier (`back.out`) à droite ; sur « 1907 » une pastille or « 1907 » claque ; sur « Casa Azul » un cadre or entoure la façade.
- **Transition** : le plan 1 se rétracte (papier qui glisse à gauche, 0,35 s).
- **Plan 2 — caméra fixe** : un **mur de cadres** (grille 5 × 2 d'autoportraits génériques) se remplit cadre par cadre (`back.out`, 0,12 s d'écart) pendant qu'un **compteur** monte 0 → « +50 » (piloté par la progression) ; sur « espejo » un **miroir à main** entre par le bas, se balance ±6°. Pastilles « más de cincuenta », « un espejo ».

## -2 · plan 3 « Lleva flores en el pelo y vestidos largos de colores. Muchos son vestidos tradicionales de Oaxaca. » (≈ 8,4 s)
- **Caméra** : plan fixe sur **un grand autoportrait** (gauche) ; **push-in** léger (×1,0 → ×1,06). Sur « flores en el pelo » un **rond or** entoure la couronne de fleurs + pastille « flores » ; sur « vestidos largos » le **col brodé** est cerclé + pastille ; une **bande de broderies** (losanges découpés) se déroule à droite.
- Sur « Oaxaca » : la **carte du Mexique** (`explainerMap`, zoom sur le pays) apparaît à droite en papier et **Oaxaca s'allume** (anneau qui pulse 2×, 1,0 s/pulsation) + pastille « Oaxaca ».

## -3 · plans 4-5 « En su casa viven monos, loros y perros. / Hoy la Casa Azul es un museo. Está en Coyoacán, en Ciudad de México. » (≈ 10,9 s)
- **Plan 4 — caméra fixe** : le **patio** (kit `casaAzulPatio`, ×0,8) ; un **singe**, un **perroquet** et un **xolo** (`mxProp`) montent en papier (`back.out`) entre les plantes sur « monos », « loros », « perros » (pastilles), petits rebonds.
- **Transition** : fondu-enchaîné papier.
- **Plan 5 — caméra** : **plan large de la façade** (`coyoacanSkyline`, couches milieu + ciel, immobile) avec un **lent recul** (×1,12 → ×1,0, `sine.out`, 3,5 s) ; des **visiteurs** (bustes d'Álex, Marina, Mateo) montent devant la porte ; pastille « un museo » ; la **carte** revient en bas-droite avec CDMX qui pulse sur « Ciudad de México ».
