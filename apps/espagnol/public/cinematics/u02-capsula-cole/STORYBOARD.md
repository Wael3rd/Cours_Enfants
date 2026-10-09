# u02-capsula-cole — « Mil y una escuelas » (3 compositions `-1`, `-2`, `-3`, ≈ 9,3 + 8,1 + 5,7 s)

Cápsula cultural, style explainer en **papier découpé** sur fond indigo à points (comme `u01-capsula-hispanos`), accents or / terracotta / turquoise, ombres portées de papier. Voix off `narrador` (4 répliques).
Aucune donnée dynamique. Helpers : `_shared/qcap.js` (fond à points, bloc titre, pastilles, « pop » de papier, étincelles). Bordure : frise d'azulejos « salamanca ». Persos : bustes du kit (`QArt.character(…, { view: 'bust' })`).
Le bloc titre (barre or + kicker « CÁPSULA CULTURAL » + « Mil y una escuelas ») se pose sous la frise, en haut à gauche, et s'efface à la transition.

## -1 · plan 1 « En el recreo, muchos alumnos comen un bocadillo. » · plan 2 « Las notas van de cero a diez. Con un cinco, ¡aprobado! » (9,3 s)
- **Plan 1 — caméra fixe** (plan fixe, animations de papier) : quatre médaillons-papier (Álex, Marina, Diego, Lola) montent du bas en rebondissant (`back.out(1.7)`, décalage .12 s), chacun avec un **bocadillo**. Sur « recreo » la pastille « el recreo » (or) claque en haut à droite ; sur « comen » les bocadillos montent à la bouche et les bustes mâchent (rebonds .14 s) ; sur « bocadillo » un grand bocadillo tombe au centre avec la pastille « el bocadillo » et des étincelles. Sons : `ui/pop` sur les médaillons, `ui/pop` ×2 sur « comen » / « bocadillo ».
- **Transition** : le plan 1 glisse vers le haut et s'efface (`power3.in`, .35 s), le plan 2 monte du bas.
- **Plan 2 — caméra fixe** sur un **bulletin** (carte crème, filet or) : l'échelle de notes 0 → 10 (11 cases, rouge pâle pour 0-4, turquoise pour 5-10) se déploie case par case de « cero » à « diez » (`back.out(2)`, .06 s) ; sur « cinco » un anneau vert se trace autour du 5 et la case se soulève (+24 px, échelle 1,12) ; sur « ¡aprobado! » le **tampon APROBADO** (vert, bord double, incliné −8°) claque (échelle 2,4 → 1, `expo.out`) avec secousse et étincelles. Sons : `ui/tick`, `ui/star`, `ui/correct`.

## -2 · plan 3 « En los colegios públicos, normalmente no hay uniforme. Y los alumnos dicen « profe » y « cole ». » (8,1 s)
- **Caméra fixe**. Doña Pilar (buste, à gauche, « la profe ») et quatre élèves en vêtements normaux (pas d'uniforme) sur une rangée de pupitres de papier. À « uniforme » : un blazer d'uniforme (bleu marine, boutons dorés) apparaît au centre et est **barré d'une croix rouge** (trait qui se trace, `back.out`), puis rapetisse et s'efface. À « profe » : bulle « ¡profe! » sort du premier élève vers Pilar ; à « cole » : bulle « ¡cole! » au-dessus d'un petit collège de papier. Chaque bulle : `back.out(2)`, flottement. Sons : `ui/pop` sur les deux mots.

## -3 · plan 4 « En Salamanca hay una universidad con más de ochocientos años. » (5,7 s)
- **Caméra** : plan large de la **façade de l'Université** (kit `fachadaUniversidad`, pierre dorée) qui pousse lentement (×1,0 → ×1,12, `sine.inOut`, toute la partie) vers le médaillon central ; la grenouille de pierre pulse en vert très doux.
- Pastille « SALAMANCA » (épingle) à « Salamanca » ; **compteur 0 → 1218** (Alfa 150 px, `power2.out`) de « con » à « años », carte sombre (contraste), « AÑO DE FUNDACIÓN » ; sur « ochocientos » la pastille « +800 años » rebondit. Son `rpg/level-up` à la fin.
