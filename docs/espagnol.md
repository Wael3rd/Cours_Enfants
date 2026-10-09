# La Leyenda del Quetzal — spec (app espagnol, 12 ans, 5e)

## Cadre pédagogique

- Élève de 5e à Paris, espagnol **LVB débutant** (1re année). **Nouveau programme collège 2026** (annexe 9,
  applicable en 5e à la rentrée 2026) : cible fin de 5e **A1+** (A1, avec A2 dans au moins une activité).
- 6 axes culturels en 5e, 5 à traiter dont **l'axe 6 "Le Mexique" obligatoire** : 1 Portrait/autoportrait ·
  2 Le quotidien (lieux, rythmes, saisons) · 3 École et loisirs · 4 Le réel et l'imaginaire (fêtes, héros, légendes) ·
  5 Des langues, des lieux, des histoires · 6 Le Mexique (nature, patrimoine, saveurs, Día de Muertos).
- Activités : compréhension orale/écrite, expression orale/écrite, interaction orale/écrite, médiation.
  Insistance du programme : phonologie (accent tonique, intonation), imitation/mémorisation de modèles, jeu, saynètes.
- Enseignante absente de septembre 2026 à janvier 2027 → **priorité absolue aux unités 1 à 7** (rattrapage
  sept-oct en cours, puis suivre le rythme). Sources : `docs/espagnol-programme.md`.

## Unités (une région du monde = une unité)

| # | Unité | Lieu (région du jeu) | Axe | Lexique | Grammaire | Culture | Période |
|---|---|---|---|---|---|---|---|
| 1 | ¡Hola! Me presento | Madrid | 1 | saludos, alfabeto, números 0-100, nacionalidades, me llamo / soy de / vivo en | pronombres sujeto, ser, llamarse, tener (edad), preguntas | pays hispanophones, carte | sept |
| 2 | Mi clase, mi cole | Salamanca | 3 | material, asignaturas, consignas, días, meses | artículos, género/número, hay, presente -ar | école espagnole | sept-oct |
| 3 | Mi familia | Sevilla | 1 | familia, profesiones básicas, la casa | posesivos, presente -er/-ir, tener, ser | portraits de familles | oct |
| 4 | ¿Cómo eres? | Ciudad de México (Coyoacán) | 1+6 | físico, carácter, ropa, colores | concordancia adjetivos, ser/estar, llevar | Frida Kahlo, Casa Azul | oct-nov |
| ★ | Evento: Día de Muertos | Oaxaca | 4+6 | ofrenda, calavera, cempasúchil, pan de muerto | — (révision) | fête des morts | 25 oct → 2 nov |
| 5 | ¿Qué hora es? | Valencia | 2 | la hora, rutina, comidas | ser (hora), diptongación (querer, poder), ir, ir a + inf., estar + gerundio | horaires espagnols | nov-déc |
| 6 | ¡Feliz Navidad! | Madrid de noche | 4 | fiestas, comida, regalos | imperativo, hay que / tener que | Navidad, Nochevieja (12 uvas), Reyes Magos | déc → 6 janv |
| 7 | Me gusta… | Buenos Aires | 3 | deportes, ocio, instrumentos | gustar/encantar (sing./pl.), preferir, porque | loisirs, fútbol, tango | janv-fév |
| 8 | Mi casa y mi barrio | Bogotá | 2 | casa, ciudad, preposiciones de lugar | estar (lugar), hay/está(n), comparativo | villes hispaniques | fév-mars |
| 9 | ¡Viva México! | Yucatán | 6 | naturaleza, patrimonio, gastronomía | repaso presente, primer pasado compuesto | Mayas, Aztecas, maïs, cacao | mars-avr |
| 10 | Leyendas y héroes | Cusco / Andes | 4+5 | cuentos, héroes, el español en el mundo | relato simple, conectores | légendes, monuments | mai-juin |

Les événements (★ Día de Muertos, Navidad/Reyes) s'activent selon la date réelle — quêtes "live" façon jeu vidéo.

## Concept RPG

Les plumes du **Quetzal** (oiseau sacré, lien avec l'axe Mexique) ont été dispersées dans le monde hispanique.
Le joueur, apprenti **viajero** de l'Academia de Viajeros, parcourt une carte du monde ; chaque région = une unité,
une chaîne de quêtes (6–8 quêtes de 10–15 min) qui se termine par un **Desafío** (boss) et la récupération d'une plume.

- **Stats RPG = activités langagières** : Escuchar, Hablar, Leer, Escribir (+ Cultura). XP par stat, niveau du joueur.
- **Inventaire = vocabulaire** : chaque mot appris devient une carte-objet (image + audio + genre), avec rareté.
- **La Forja** (grammaire) : forger les formes verbales (radical + terminaison), découverte de la règle par
  observation puis entraînement.
- **Diálogos** : conversations à choix avec des PNJ (interaction), réponses PNJ en audio.
- **Hechizos** (expression orale) : lancer un sort en prononçant une phrase — reconnaissance vocale Web Speech
  (es-ES) sur Chrome Android ; repli auto-évaluation si indisponible. Cible : accent tonique, j, ll, r/rr, ñ.
- **Desafío** (boss) : révision mixte, chaque bonne réponse = attaque.
- **Misión del día** : 5 min de répétition espacée (mots + structures) — la boucle quotidienne.
- Avatar personnalisable (tenues débloquées par région : poncho, sombrero vueltiao, maillot de Boca…).

## Immersion (règles strictes)

- **Interface 100 % en espagnol**, appuyée par images, icônes et audio.
- Le français n'apparaît que via le bouton **Pista** (traduction / explication courte), libre mais comptabilisé ;
  petit bonus d'XP sans pista.
- Tout texte espagnol est **touchable pour être entendu** ; bouton **lento** (tortue) pour ralentir.
- Voix neuronales pré-générées (edge-tts), une voix par personnage ; personnages principaux en espagnol d'Espagne
  (castillan, celui du collège), PNJ régionaux avec leur accent (es-MX, es-AR, es-CO).
- Clavier d'aide pour á é í ó ú ñ ü ¿ ¡ dans les exercices d'écriture.

## Cinématiques HyperFrames (1920×1200)

- **Intro de région** (~8 s, style documentaire/voyage) : survol de carte vers la ville, carte-titre
  "Capítulo 1 · ¡Hola! · Madrid", silhouettes de monuments, voix off espagnole.
- **Scènes d'histoire** (5–10 s par plan) : PNJ, bulles/sous-titres espagnols synchronisés à la voix.
- **Cápsulas culturales** (style explainer Vox / documentaire : carte, chiffres, call-outs) : Día de Muertos,
  horaires espagnols, Reyes Magos, Frida Kahlo, 12 uvas…
- **Level up / plume récupérée / boss intro** (2–4 s).

## Direction artistique

Langage visuel : JRPG d'aventure moderne (cartes et boîtes de dialogue façon Zelda / Sea of Stars / Pokémon) croisé
avec l'affiche de voyage et le **papel picado** / azulejos (motifs hispaniques). Couleurs chaudes (terracotta, jaune
soleil, turquoise, magenta Día de Muertos, vert quetzal), textures papier légères. Portraits de PNJ et objets :
Fluent Emoji 3D (MIT). Typo titre à caractère (ex. "Rye" / "Lilita One"), texte très lisible ("Nunito").
Ton : ado, pas enfantin.

## Espace parent

Progression par unité, temps passé, stats, mots difficiles, couverture des attendus A1+ du programme, sauvegarde.

## Format des contenus

`apps/espagnol/src/content/units/uXX.json` — voir le schéma dans `apps/espagnol/src/content/schema.ts` (référence
unique). L'audio est généré à partir des contenus (`tools/tts`).
