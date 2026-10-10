// Unidad 10 — Leyendas y héroes (Cusco · Machu Picchu · los Andes) — FINAL DE LA LEYENDA
// Axes 4 (le réel et l'imaginaire : légendes, héros) + 5 (des langues, des lieux, des histoires). PNJ péruviens : Killa, Don Huamán, Doña Paulina (es-PE).
// Espagnol d'Espagne pour Álex/Marina/le narrateur ; espagnol du Pérou pour les PNJ (« ustedes », mots quechuas, mots qui diffèrent signalés en français).
// Récit simple au présent (« présent de narration ») + formule « Había una vez » ; connecteurs pero / además / porque / entonces.
import { W as W0, reg, G, quest, flash, match, lcV, lcI, lcT, dict, fill, reord, conj, dlg, read, speak, tf, gram, writeFree, cine, P, L, C, NARR } from './lib.mjs';

export default function build() {
  const N = NARR;
  const ilu = (s) => ({ ilustracion: s });
  // Un mot déjà défini par une unité précédente (même id) est simplement réutilisé, jamais redéclaré.
  const W = (id, ...a) => (reg.has(id) ? null : W0(id, ...a));

  // ───────────── Vocabulario (53) ─────────────
  const vocab = [
    // cuentos y héroes
    W('leyenda', 'leyenda', 'légende', '📜', 'cuentos', 'Cusco tiene muchas leyendas.', 'Cusco a beaucoup de légendes.', { genero: 'f', plural: 'leyendas', voz: 'huaman', exVoz: 'huaman' }),
    W('cuento', 'cuento', 'conte, histoire', '📖', 'cuentos', 'Mi abuelo cuenta un cuento cada noche.', 'Mon grand-père raconte un conte chaque soir.', { genero: 'm', plural: 'cuentos' }),
    W('cuentacuentos', 'cuentacuentos', 'conteur, conteuse (invariable)', '🎙️', 'cuentos', 'Don Huamán es cuentacuentos.', 'Don Huamán est conteur.', { genero: 'mf' }),
    W('heroe', 'héroe', 'héros', '🦸', 'cuentos', 'El héroe es valiente y generoso.', 'Le héros est courageux et généreux.', { genero: 'm', plural: 'héroes', femenino: 'heroína' }),
    W('personaje', 'personaje', 'personnage (d’une histoire)', '🎭', 'cuentos', 'El Quetzal es el personaje principal.', 'Le Quetzal est le personnage principal.', { genero: 'm', plural: 'personajes' }),
    W('rey', 'rey', 'roi (pluriel : reyes)', '👑', 'cuentos', 'El rey vive en un castillo.', 'Le roi vit dans un château.', { genero: 'm', plural: 'reyes', femenino: 'reina' }),
    W('tesoro', 'tesoro', 'trésor', '💎', 'cuentos', 'El héroe busca un tesoro.', 'Le héros cherche un trésor.', { genero: 'm', plural: 'tesoros' }),
    W('magia', 'magia', 'magie', '🪄', 'cuentos', 'En los cuentos hay mucha magia.', 'Dans les contes, il y a beaucoup de magie.', { genero: 'f' }),
    // naturaleza andina
    W('valle', 'valle', 'vallée', '🏞️', 'andes', 'Machu Picchu está sobre un valle.', 'Machu Picchu est au-dessus d’une vallée.', { genero: 'm', plural: 'valles' }),
    W('lago', 'lago', 'lac', null, 'andes', 'El lago Titicaca es enorme.', 'Le lac Titicaca est énorme.', { genero: 'm', plural: 'lagos', ...ilu('Un grand lac bleu entouré de montagnes, avec une petite barque de roseaux') }),
    W('sol', 'sol', 'soleil', '☀️', 'andes', 'Para los incas, el sol es un dios.', 'Pour les Incas, le soleil est un dieu.', { genero: 'm' }),
    W('luna', 'luna', 'lune', '🌙', 'andes', 'Killa significa «luna».', 'Killa veut dire « lune ».', { genero: 'f' }),
    W('estrella', 'estrella', 'étoile', '⭐', 'andes', 'Hay miles de estrellas en el cielo.', 'Il y a des milliers d’étoiles dans le ciel.', { genero: 'f', plural: 'estrellas' }),
    W('cielo', 'cielo', 'ciel', '🌌', 'andes', 'El cóndor vuela en el cielo.', 'Le condor vole dans le ciel.', { genero: 'm', plural: 'cielos' }),
    W('condor', 'cóndor', 'condor (grand oiseau des Andes ; mot d’origine quechua)', '🦅', 'andes', 'El cóndor es muy grande.', 'Le condor est très grand.', { genero: 'm', plural: 'cóndores' }),
    W('puma', 'puma', 'puma (mot d’origine quechua)', '🐆', 'andes', 'El puma vive en las montañas.', 'Le puma vit dans les montagnes.', { genero: 'm', plural: 'pumas' }),
    W('llama', 'llama', 'lama (mot d’origine quechua)', '🦙', 'andes', 'La llama lleva la carga en la montaña.', 'Le lama porte la charge dans la montagne.', { genero: 'f', plural: 'llamas' }),
    W('viento', 'viento', 'vent', '🌬️', 'andes', 'Hay mucho viento en la montaña.', 'Il y a beaucoup de vent dans la montagne.', { genero: 'm', plural: 'vientos' }),
    W('nube', 'nube', 'nuage', '☁️', 'andes', 'Hay nubes bajas sobre Machu Picchu.', 'Il y a des nuages bas sur Machu Picchu.', { genero: 'f', plural: 'nubes' }),
    W('camino', 'camino', 'chemin, route', '🛤️', 'andes', 'El Camino Inca llega a Machu Picchu.', 'Le chemin de l’Inca arrive à Machu Picchu.', { genero: 'm', plural: 'caminos' }),
    W('oro', 'oro', 'or', '🥇', 'andes', 'El bastón es de oro.', 'Le bâton est en or.', { genero: 'm' }),
    W('cima', 'cima', 'sommet', '🏔️', 'andes', 'En la cima hace mucho frío.', 'Au sommet, il fait très froid.', { genero: 'f', plural: 'cimas' }),
    // cultura andina
    W('quechua', 'quechua', 'quechua : langue des Incas, encore parlée dans les Andes', '🗣️', 'cultura', 'Killa habla quechua en casa.', 'Killa parle quechua à la maison.', { genero: 'm', voz: 'killa', exVoz: 'killa' }),
    W('inca', 'inca', 'inca (peuple et adjectif ; « los incas »)', null, 'cultura', 'Machu Picchu es una ciudad inca.', 'Machu Picchu est une ville inca.', { adj: true, genero: 'mf', plural: 'incas', ...ilu('Un empereur inca avec une grande coiffe dorée et des bijoux, de profil') }),
    W('pachamama', 'Pachamama', 'Pachamama : la Terre-Mère, dans les croyances des Andes', '🌎', 'cultura', 'Para los incas, la Pachamama es la madre Tierra.', 'Pour les Incas, la Pachamama est la Terre-Mère.', { genero: 'f' }),
    W('papa', 'papa', 'pomme de terre (en Espagne : « patata ») ; attention : « el papa » = le pape, « papá » = papa', '🥔', 'cultura', 'En Perú hay miles de tipos de papa.', 'Au Pérou, il y a des milliers de variétés de pomme de terre.', { genero: 'f', plural: 'papas', voz: 'paulina', exVoz: 'paulina' }),
    W('quinua', 'quinua', 'quinoa (mot d’origine quechua ; « quinoa » aussi)', null, 'cultura', 'La quinua es un cereal de los Andes.', 'Le quinoa est une céréale des Andes.', { genero: 'f', ...ilu('Un épi de quinoa rouge et jaune dans un champ, montagnes en fond') }),
    W('lana', 'lana', 'laine', '🧶', 'cultura', 'La lana de alpaca es muy suave.', 'La laine d’alpaga est très douce.', { genero: 'f' }),
    W('tejido', 'tejido', 'tissu tissé, tissage ; « tejer » = tisser', null, 'cultura', 'Los tejidos de Chinchero tienen colores vivos.', 'Les tissages de Chinchero ont des couleurs vives.', { genero: 'm', plural: 'tejidos', ...ilu('Un tissage péruvien aux couleurs vives, avec des motifs géométriques et des animaux'), voz: 'paulina', exVoz: 'paulina' }),
    // el español en el mundo
    W('idioma', 'idioma', 'langue (= « lengua ») ; attention : le mot finit par -a mais « idioma » est masculin', '🌐', 'mundo', 'El español es un idioma muy hablado.', 'L’espagnol est une langue très parlée.', { genero: 'm', plural: 'idiomas' }),
    W('palabra', 'palabra', 'mot', '🔤', 'mundo', 'Mi palabra favorita es «mariposa».', 'Mon mot préféré est « mariposa ».', { genero: 'f', plural: 'palabras' }),
    W('mundo', 'mundo', 'monde', '🌍', 'mundo', 'El español se habla en todo el mundo.', 'L’espagnol se parle dans le monde entier.', { genero: 'm' }),
    W('pais', 'país', 'pays', '🏳️', 'mundo', 'Perú es un país de los Andes.', 'Le Pérou est un pays des Andes.', { genero: 'm', plural: 'países' }),
    W('hablante', 'hablante', 'locuteur, personne qui parle une langue', '🧑‍🤝‍🧑', 'mundo', 'Hay millones de hablantes de español.', 'Il y a des millions de locuteurs d’espagnol.', { genero: 'mf', plural: 'hablantes' }),
    W('continente', 'continente', 'continent', '🗺️', 'mundo', 'América es un continente grande.', 'L’Amérique est un grand continent.', { genero: 'm', plural: 'continentes' }),
    // conectores
    W('pero', 'pero', 'mais', null, 'conectores', 'Quiero volar, pero no tengo plumas.', 'Je veux voler, mais je n’ai pas de plumes.', { ...ilu('Deux flèches qui s’opposent, une verte et une rouge') }),
    W('ademas', 'además', 'en plus, de plus', null, 'conectores', 'Killa es simpática y además es muy lista.', 'Killa est sympa et en plus elle est très maligne.', { ...ilu('Un signe plus lumineux qui ajoute une étoile à une autre') }),
    W('entonces', 'entonces', 'alors, donc, à ce moment-là', null, 'conectores', 'Hay tormenta, entonces el héroe espera.', 'Il y a un orage, alors le héros attend.', { ...ilu('Une flèche qui mène d’un nuage de pluie à un parapluie ouvert') }),
    W('primero', 'primero', 'd’abord, en premier', null, 'conectores', 'Primero busco el camino.', 'D’abord, je cherche le chemin.', { ...ilu('Un chiffre 1 doré au début d’un chemin') }),
    W('luego', 'luego', 'ensuite, puis', null, 'conectores', 'Luego subo a la cima.', 'Ensuite, je monte au sommet.', { ...ilu('Un chiffre 2 doré au milieu d’un chemin') }),
    W('al_final', 'al final', 'à la fin, finalement', null, 'conectores', 'Al final, el héroe salva a todos.', 'À la fin, le héros sauve tout le monde.', { ...ilu('Un drapeau d’arrivée au bout d’un chemin') }),
    W('un_dia', 'un día', 'un jour (dans un récit)', '📆', 'conectores', 'Un día, el héroe encuentra un tesoro.', 'Un jour, le héros trouve un trésor.', { voz: 'huaman', exVoz: 'huaman' }),
    W('habia_una_vez', 'había una vez', 'il était une fois (formule pour commencer un conte)', '🏰', 'conectores', 'Había una vez un héroe muy valiente.', 'Il était une fois un héros très courageux.', { voz: 'huaman', exVoz: 'huaman' }),
    // verbos
    W('contar', 'contar', 'raconter ; compter (yo cuento : o → ue)', '🗣️', 'verbos', 'Mi abuelo cuenta leyendas.', 'Mon grand-père raconte des légendes.'),
    W('salvar', 'salvar', 'sauver', '🛟', 'verbos', 'El héroe salva a la princesa.', 'Le héros sauve la princesse.'),
    W('ayudar', 'ayudar', 'aider', '🤲', 'verbos', 'Ayudo a mi amigo.', 'J’aide mon ami.'),
    W('encontrar', 'encontrar', 'trouver, rencontrer (yo encuentro : o → ue)', '🔎', 'verbos', 'El héroe encuentra un camino.', 'Le héros trouve un chemin.'),
    W('volar', 'volar', 'voler (dans les airs ; yo vuelo : o → ue)', '🕊️', 'verbos', 'El cóndor vuela muy alto.', 'Le condor vole très haut.'),
    W('luchar', 'luchar', 'lutter, se battre', '🥊', 'verbos', 'El héroe lucha por su pueblo.', 'Le héros se bat pour son peuple.'),
    W('buscar', 'buscar', 'chercher', '🔍', 'verbos', 'Busco una pluma verde.', 'Je cherche une plume verte.'),
    W('cantar', 'cantar', 'chanter', '🎤', 'verbos', 'Quiero cantar otra vez.', 'Je veux chanter de nouveau.'),
  ].filter(Boolean);

  // ───────────── Gramática ─────────────
  const gramatica = [
    G('g_conectores', 'Pero, además, porque, entonces', 'Les connecteurs : relier ses idées', [
      ['Quiero volar, pero no tengo plumas.', 'Je veux voler, mais je n’ai pas de plumes.', 'quetzal', ['pero']],
      ['Killa es simpática y además es muy lista.', 'Killa est sympa et en plus elle est très maligne.', 'killa', ['además']],
      ['El Quetzal no vuela porque no tiene todas sus plumas.', 'Le Quetzal ne vole pas parce qu’il n’a pas toutes ses plumes.', 'marina', ['porque']],
      ['Hay una tormenta. Entonces el héroe busca un camino.', 'Il y a un orage. Alors le héros cherche un chemin.', 'huaman', ['Entonces']],
    ], 'Con «pero» decimos lo contrario. Con «además» añadimos algo más. Con «porque» damos la razón. Con «entonces» decimos la consecuencia.',
    'Avec « pero », on dit le contraire (mais). Avec « además », on ajoute quelque chose (en plus). Avec « porque », on donne la raison (parce que). Avec « entonces », on dit la conséquence (alors).',
    "Ces quatre petits mots rendent tes phrases beaucoup plus riches. PERO oppose deux idées (es pequeño, pero fuerte). ADEMÁS ajoute (es pequeño y además es rápido) ; il porte un accent sur le dernier a. PORQUE donne la cause et répond à « ¿por qué? » : — ¿Por qué estudias español? — Porque me gusta. Attention : « por qué » en deux mots avec accent sur « qué » sert à poser la question ; « porque » en un mot, sans accent, sert à répondre. ENTONCES donne la suite logique (llueve, entonces cojo el paraguas) et sert aussi à enchaîner un récit (entonces, el héroe sale).",
    { encabezado: ['Conector', 'Sirve para…', 'Ejemplo'], filas: [['pero', 'oponer', 'Es difícil, pero bonito.'], ['además', 'añadir', 'Es bonito y además útil.'], ['porque', 'dar la razón', 'Estudio porque me gusta.'], ['entonces', 'decir la consecuencia', 'Llueve, entonces espero.']] }),
    G('g_cuento', 'Había una vez…', 'Raconter une histoire', [
      ['Había una vez un héroe muy valiente.', 'Il était une fois un héros très courageux.', 'huaman', ['Había una vez']],
      ['Un día, el héroe encuentra un tesoro.', 'Un jour, le héros trouve un trésor.', 'huaman', ['Un día']],
      ['Primero busca un camino y luego sube a la montaña.', 'D’abord il cherche un chemin et ensuite il monte à la montagne.', 'killa', ['Primero', 'luego']],
      ['Al final, el héroe salva a todos.', 'À la fin, le héros sauve tout le monde.', 'huaman', ['Al final']],
    ], 'Para contar un cuento: «Había una vez…», «un día…», «primero… luego… entonces…», «al final…». Contamos en presente.',
    'Pour raconter un conte : « Había una vez… » (il était une fois), « un día… » (un jour), « primero… luego… entonces… » (d’abord… ensuite… alors…), « al final… » (à la fin). Ici, on raconte au présent.',
    "Un récit simple = un petit plan : 1) la formule d'ouverture HABÍA UNA VEZ (à apprendre par cœur, comme « il était une fois » ; « había » est un temps du passé que tu étudieras plus tard) ; 2) UN DÍA, il se passe quelque chose ; 3) PRIMERO… LUEGO… ENTONCES… pour les étapes ; 4) AL FINAL pour la fin. À ton niveau, on raconte les actions au PRÉSENT (le héros busca, sube, encuentra) : c'est le « présent de narration », très courant, aussi en français. Les contes espagnols se terminent souvent par « Y colorín colorado, este cuento se ha acabado » (comme « et ils vécurent heureux »). Rappel : les verbes à diphtongue o → ue changent au présent sauf à nosotros : cuento, cuentas, cuenta, contamos ; encuentro, encuentras, encuentra, encontramos.",
    { encabezado: ['Etapa', 'Se dice', 'Ejemplo'], filas: [['Principio', 'Había una vez…', 'Había una vez un héroe.'], ['Problema', 'Un día…', 'Un día, aparece un monstruo.'], ['Acciones', 'Primero… luego… entonces…', 'Primero busca, luego sube.'], ['Final', 'Al final…', 'Al final, salva a todos.']] }),
    G('g_se_habla', 'Se habla español', 'Dire « on parle » : se habla / se hablan', [
      ['En Perú se habla español y quechua.', 'Au Pérou, on parle espagnol et quechua.', 'killa', ['se habla']],
      ['En México se hablan muchas lenguas indígenas.', 'Au Mexique, on parle beaucoup de langues indigènes.', 'itzel', ['se hablan']],
      ['El español se habla en veinte países.', 'L’espagnol se parle dans vingt pays.', 'marina', ['se habla']],
      ['¿Qué idioma se habla en Colombia?', 'Quelle langue parle-t-on en Colombie ?', 'camila', ['se habla']],
    ], 'Con «se habla» decimos «la gente habla»: se habla español. Si hablamos de varias lenguas, decimos «se hablan»: se hablan dos lenguas.',
    'Avec « se habla », on dit « les gens parlent » (on parle) : se habla español. Pour plusieurs langues, on dit « se hablan » : se hablan dos lenguas.',
    "Le petit mot SE + verbe à la 3e personne permet de parler de ce que « on » fait en général, sans dire qui : se habla español (on parle espagnol / l'espagnol se parle). Le verbe s'accorde avec la chose dont on parle : se HABLA español (une langue → singulier), se HABLAN español y quechua (deux langues → pluriel). C'est la même construction pour d'autres phrases utiles : « se dice » (on dit), « se escribe » (ça s'écrit), « se come » (on mange). Ne confonds pas avec « me llamo / se llama », où « se » est le pronom de « llamarse ».",
    { encabezado: ['País', 'Se habla…'], filas: [['Perú', 'español y quechua'], ['México', 'español y muchas lenguas indígenas'], ['Guinea Ecuatorial', 'español (¡en África!)'], ['España', 'español, catalán, gallego, euskera']] }),
    G('g_numeros_grandes', 'Cien, mil, un millón', 'Les grands nombres (cien, mil, millón)', [
      ['Cusco está a más de tres mil metros.', 'Cusco est à plus de trois mille mètres d’altitude.', 'killa', ['tres mil']],
      ['Machu Picchu tiene más de quinientos años.', 'Machu Picchu a plus de cinq cents ans.', 'huaman', ['quinientos']],
      ['Más de quinientos millones de personas hablan español.', 'Plus de cinq cents millions de personnes parlent espagnol.', 'marina', ['quinientos millones de']],
      ['Hay doscientas llamas en la montaña.', 'Il y a deux cents lamas dans la montagne.', 'killa', ['doscientas']],
    ], 'Cien = 100 (ciento + otro número: ciento veinte). Doscientos, trescientos… hasta novecientos. Mil = 1000. Un millón de + nombre.',
    'Cien = 100 (ciento + autre nombre : ciento veinte). Doscientos, trescientos… jusqu’à novecientos. Mil = 1000. Un millón de + nom.',
    "Au-delà de 100, l'espagnol ajoute : 100 cien (seul) / ciento veinte (suivi d'un autre nombre) ; 200 doscientos, 300 trescientos, 400 cuatrocientos, 500 QUINIENTOS (et non « cincocientos »), 600 seiscientos, 700 SETECIENTOS, 800 ochocientos, 900 NOVECIENTOS. Les centaines s'accordent avec le nom féminin : doscientas llamas. MIL ne change jamais (tres mil, pas « tres miles »). MILLÓN est un nom : on dit « un millón DE personas », « dos millones DE personas » (avec de et pluriel, accent perdu à millones). Ce n'est pas au programme de 5e : retiens simplement de LES RECONNAÎTRE quand tu lis des chiffres.",
    { encabezado: ['Número', 'Se escribe'], filas: [['100', 'cien'], ['200', 'doscientos'], ['500', 'quinientos'], ['1000', 'mil'], ['1 000 000', 'un millón de']] }),
  ];

  // ───────────── Cinemáticas ─────────────
  const intro = cine('u10-intro', 'intro', 'Capítulo 10 · Leyendas y héroes · Cusco', [
    P(3, 'La carte du monde en papel picado : la ligne dorée quitte le Yucatán, longe la côte pacifique et grimpe dans les Andes du Pérou ; carte-titre « Capítulo 10 · Leyendas y héroes · Cusco ».', [L(N, 'Capítulo diez: leyendas y héroes.', 'Chapitre dix : légendes et héros.')], { rotulo: 'Capítulo 10 · Leyendas y héroes · Cusco', camara: 'zoom avant progressif' }),
    P(5, 'Cusco à l’heure dorée : toits de tuiles rouges, Plaza de Armas et sa cathédrale, murs de pierre inca parfaitement ajustés, des lamas sur un sentier, les montagnes violettes au loin et, très haut, un nuage qui cache Machu Picchu.', [L(N, 'Cusco, en los Andes de Perú, a más de tres mil metros de altura.', 'Cusco, dans les Andes du Pérou, à plus de trois mille mètres d’altitude.'), L(N, 'Aquí está la antigua capital de los incas.', 'Ici se trouve l’ancienne capitale des Incas.')], { camara: 'panoramique lent puis descente vers la place' }),
  ]);
  const historia = cine('u10-historia', 'historia', 'El cuentacuentos sin voz', [
    P(7, 'La Plaza de Armas de Cusco. Le Quetzal, presque entièrement vert, sort de la poche de Marina. Killa, 12 ans, avec un châle coloré (lliclla) et un petit lama tenu en laisse, vient à leur rencontre.', [
      L('quetzal', 'Nueve plumas. Solo falta una.', 'Neuf plumes. Il n’en manque plus qu’une.'),
      L('killa', '¡Hola! Me llamo Killa. En quechua, «killa» significa «luna». ¡Bienvenidos al Cusco!', 'Salut ! Je m’appelle Killa. En quechua, « killa » veut dire « lune ». Bienvenue à Cusco ! (« ustedes » est la forme de politesse au pluriel en Amérique latine.)'),
    ], { personajes: ['quetzal', 'killa', 'marina', 'viajero'], camara: 'plan large puis plan moyen sur Killa' }),
    P(7, 'Sur les marches d’une église, Don Huamán, un vieux conteur au bonnet tricoté, entouré d’enfants. Il ouvre la bouche pour raconter, mais aucun son ne sort ; les enfants attendent, déçus.', [
      L('killa', 'Don Huamán es el mejor cuentacuentos de Cusco, pero hoy no tiene voz.', 'Don Huamán est le meilleur conteur de Cusco, mais aujourd’hui il n’a plus de voix.'),
      L('huaman', '…las leyendas han desaparecido de mi memoria.', '… les légendes ont disparu de ma mémoire. (comme dans l’unité 9 : « han desaparecido » = ont disparu)'),
    ], { personajes: ['killa', 'huaman'], camara: 'plans rapprochés sur les enfants et sur le conteur' }),
    P(7, 'Sur un mur inca, la Sombra : petite, silencieuse, la voix lasse. Elle regarde les enfants sans oser s’approcher.', [
      L('sombra', 'Sin cuentos, nadie recuerda. Sin recuerdos, nadie habla.', 'Sans contes, personne ne se souvient. Sans souvenirs, personne ne parle.'),
      L('sombra', 'Nadie cuenta cuentos para mí.', 'Personne ne raconte de contes pour moi. (Elle a l’air triste et seule.)'),
    ], { personajes: ['sombra'], musica: 'tension douce, flûte andine et charango' }),
    P(7, 'Les montagnes dans la brume : au loin, au milieu des nuages, un point vert brille sur Machu Picchu. Le Quetzal le montre du bec.', [
      L('quetzal', 'La última pluma… está en Machu Picchu.', 'La dernière plume… est à Machu Picchu.'),
      L('killa', 'Para devolver las leyendas a Don Huamán, tienen que contar una historia. ¡Vamos a Machu Picchu!', 'Pour rendre les légendes à Don Huamán, il faut raconter une histoire. Allons à Machu Picchu !'),
    ], { personajes: ['quetzal', 'killa', 'marina', 'viajero'], musica: 'thème d’aventure, quena et charango' }),
  ]);
  const capsula = cine('u10-capsula-machu-picchu', 'capsula', 'Machu Picchu, los incas y el quechua', [
    P(4, 'Style explainer, papier découpé : une carte du Pérou, les Andes en relief, deux points : Cusco et Machu Picchu ; un curseur d’altitude affiche « 2 430 m ».', [L(N, 'Machu Picchu es una ciudad inca en las montañas de los Andes, a unos dos mil cuatrocientos metros de altura.', 'Machu Picchu est une ville inca dans les montagnes des Andes, à environ deux mille quatre cents mètres d’altitude.')], { camara: 'plan fixe, animations de papier découpé' }),
    P(5, 'Les terrasses de Machu Picchu, des lamas qui broutent, des murs de pierre sans mortier ; un calendrier retourne les siècles jusqu’au XVe.', [L(N, 'Los incas construyen Machu Picchu hace más de quinientos años. Hoy es patrimonio mundial.', 'Les Incas construisent Machu Picchu il y a plus de cinq cents ans. Aujourd’hui, c’est un patrimoine mondial (UNESCO, 1983).')]),
    P(5, 'Un soleil doré qui monte derrière une pierre sculptée (l’Intihuatana), puis une terre verte qui pousse : le soleil et la Terre-Mère.', [L(N, 'Para los incas, Inti, el sol, es un dios. Y la Pachamama es la madre Tierra.', 'Pour les Incas, Inti, le soleil, est un dieu. Et la Pachamama est la Terre-Mère.')]),
    P(5, 'Des mots quechuas flottent sur la carte des Andes : « Inti » (soleil), « Killa » (lune), « Wasi » (maison), « Mayu » (rivière) ; une bouche qui parle.', [L(N, 'Los incas hablan quechua. Hoy, millones de personas todavía lo hablan en los Andes.', 'Les Incas parlent quechua. Aujourd’hui, des millions de personnes le parlent encore dans les Andes.')]),
    P(5, 'Cinq mots qui voyagent d’un nuage « quechua » vers un nuage « español » puis un nuage « français » : papa, llama, puma, cóndor, quinua.', [L(N, 'Muchas palabras españolas vienen del quechua: llama, cóndor, puma, papa, quinua.', 'Beaucoup de mots espagnols viennent du quechua : lama, condor, puma, pomme de terre, quinoa.')]),
  ]);
  const finale = cine('u10-finale', 'pluma', 'Décima pluma · El final de la leyenda', [
    P(3, 'Au sommet de Machu Picchu, à l’aube, une mer de nuages. La Sombra, toute petite, face à Álex. Elle n’a plus de voix menaçante : seulement une voix très fragile.', [
      L('sombra', 'Estoy sola. Nadie me escucha.', 'Je suis seule. Personne ne m’écoute.'),
      L('viajero', 'Nosotros te escuchamos.', 'Nous, nous t’écoutons.'),
    ], { personajes: ['sombra', 'viajero'], camara: 'plan serré sur la Sombra, puis plan large' }),
    P(3, 'La Sombra se dissout en lumière dorée. Sa voix devient un écho qui traverse la vallée : le premier mot du voyage, « hola », renvoyé par les montagnes.', [
      L('sombra', 'Gracias… hola… hola…', 'Merci… salut… salut… (l’écho répète « hola », le premier mot que tu as appris)'),
    ], { personajes: ['sombra'], musica: 'thème du début du voyage, repris à la flûte andine' }),
    P(4, 'La dixième plume verte tombe dans la main d’Álex, qui la pose sur le Quetzal. Il déploie une longue queue éclatante : il est entier. Il s’envole au-dessus des nuages, la vallée entière ouverte sous lui.', [
      L('quetzal', 'Diez plumas. Ya puedo volar, cantar y hablar. Gracias, amigos.', 'Dix plumes. Maintenant je peux voler, chanter et parler. Merci, mes amis. (Le Quetzal parle enfin en phrases complètes.)'),
    ], { personajes: ['quetzal', 'viajero', 'marina'], camara: 'plan montant avec le Quetzal, vol libre' }),
    P(3, 'Sur le sommet, Don Ignacio apparaît en hologramme, ému, tandis que Marina et Álex regardent le Quetzal disparaître dans la lumière. Carton final : « La leyenda del Quetzal · Fin ».', [
      L('ignacio', '¡Bravo, viajeros! Y ahora… ¿dónde están mis gafas?', 'Bravo, voyageurs ! Et maintenant… où sont mes lunettes ?'),
      L('marina', 'En tu sombrero, Don Ignacio.', 'Sur ton chapeau, Don Ignacio.'),
    ], { personajes: ['ignacio', 'marina', 'viajero'], rotulo: 'La leyenda del Quetzal · Fin', musica: 'thème final, tous les instruments' }),
  ]);

  // ───────────── Misiones ─────────────
  const quests = [];

  // 1 — Cinemática
  quests.push(quest('u10', 1, 'cinematica', 'Llegada a Cusco', '🦙',
    ['killa', '¡Bienvenidos al Cusco! Yo soy Killa. Mi nombre significa «luna» en quechua.', 'Bienvenue à Cusco ! Moi, c’est Killa. Mon nom veut dire « lune » en quechua. (Les PNJ de cette unité parlent espagnol du Pérou ; ils disent « ustedes » pour « vous » au pluriel.)'],
    'Arrivée à Cusco, dans les Andes : tu rencontres Killa et Don Huamán, un conteur qui a perdu sa voix. La dernière plume est tout près !', ['escuchar', 'cultura', 'hablar'], 10, [
      intro,
      tf('Cusco está en Perú.', true, N, { tr: 'Cusco est au Pérou.' }),
      tf('Cusco está en la playa.', false, N, { tr: 'Cusco est à la plage. (Faux : Cusco est dans les montagnes des Andes.)' }),
      historia,
      lcT('Don Huamán es el mejor cuentacuentos de la ciudad, pero hoy no puede hablar.', 'killa', ['Hoy el cuentacuentos está en silencio.', 'Don Huamán cuenta tres leyendas esta mañana.', 'Los niños no quieren escuchar al cuentacuentos.'], 0),
      lcT('La última pluma está en Machu Picchu, en las montañas.', 'killa', ['El Quetzal tiene que subir a las alturas.', 'La pluma está en una playa del Caribe.', 'La pluma está en el mercado de Cusco.'], 0),
      tf('Killa significa «luna» en quechua.', true, N, { tr: 'Killa veut dire « lune » en quechua.' }),
      dlg('killa', '¡Hola! Yo soy Killa. ¿Y tú, cómo te llamas? ¿De dónde eres?', 'Salut ! Moi, c’est Killa. Et toi, comment tu t’appelles ? Tu es d’où ?', [
        ['Me llamo Álex y soy de París.', 1, '¡Qué chévere! Vienen de muy lejos. ¡Bienvenidos!', 'Trop bien ! (« chévere » = super, courant aussi au Pérou). Vous venez de très loin. Bienvenue !', 'Je m’appelle Álex et je suis de Paris.'],
        ['Soy una llama.', 0, '¿Una llama? ¡Yo tengo una llama también!', 'Un lama ? Moi aussi, j’ai un lama !', 'Je suis un lama.'],
        ['Tengo mil años.', 0, '¿Mil años? ¡Entonces eres más viejo que Machu Picchu!', 'Mille ans ? Alors tu es plus vieux que Machu Picchu !', 'J’ai mille ans.'],
      ]),
      reord('Cusco está en los Andes.', 'killa', { tr: 'Cusco est dans les Andes.' }),
      speak('Hola, me llamo Álex y estoy en Cusco.', 'viajero', { nombre: 'Álex', tr: 'Salut, je m’appelle Álex et je suis à Cusco. (dis ton prénom)', hechizo: ['Hechizo de la montaña', 'Un viento suave mueve las nubes de los Andes'] }),
    ]));

  // 2 — Cuentos y naturaleza andina
  quests.push(quest('u10', 2, 'vocabulario', 'Palabras de leyenda', '📜',
    ['huaman', 'Había una vez… Así empiezan las leyendas de los Andes. Aprendan las palabras de los cuentos.', 'Il était une fois… Ainsi commencent les légendes des Andes. Apprenez les mots des contes.'],
    'Le vocabulaire des contes et de la nature des Andes : héros, trésor, soleil, condor, puma, lama… Tu lis, tu écoutes et tu parles de TON héros préféré.', ['leer', 'escuchar', 'hablar'], 15, [
      flash('leyenda', 'cuento', 'cuentacuentos', 'heroe', 'personaje', 'rey', 'tesoro'),
      flash('magia', 'valle', 'lago', 'sol', 'luna', 'estrella', 'cielo'),
      flash('condor', 'puma', 'llama', 'viento', 'nube', 'camino', 'oro'),
      flash('cima'),
      match(['condor', 'puma', 'llama', 'sol', 'luna', 'estrella']),
      lcV('condor', ['puma', 'condor', 'llama']),
      lcI('El cóndor vuela alto, entre las nubes.', 'huaman', 'condor', ['puma', 'condor', 'llama']),
      lcT('El rey busca un tesoro de oro en la montaña.', 'huaman', ['Una persona importante busca oro en las alturas.', 'Un niño busca una pluma en el mar.', 'Un animal grande vive en el valle.'], 0),
      tf('Es una estrella.', true, N, { img: 'estrella', tr: 'C’est une étoile.' }),
      read('El condor, el puma y la serpiente son tres animales sagrados para los incas. El cóndor vive en el cielo, el puma vive en la tierra y la serpiente vive bajo la tierra. Para los incas, el mundo tiene tres partes.', 'huaman',
        'Le condor, le puma et le serpent sont trois animaux sacrés pour les Incas. Le condor vit dans le ciel, le puma vit sur la terre et le serpent vit sous la terre. Pour les Incas, le monde a trois parties. (Les trois mondes : Hanan Pacha, le ciel ; Kay Pacha, la terre ; Ukhu Pacha, le monde d’en bas.)', [
          ['¿Dónde vive el cóndor?', 'Où vit le condor ?', ['En el cielo.', 'Bajo la tierra.', 'En el lago.'], 0],
          ['¿Cuántas partes tiene el mundo para los incas?', 'Combien de parties le monde a-t-il pour les Incas ?', ['Tres.', 'Dos.', 'Diez.'], 0],
          ['¿Qué animal vive bajo la tierra?', 'Quel animal vit sous la terre ?', ['La serpiente.', 'El puma.', 'La llama.'], 0],
        ]),
      fill('El ___ vuela en el cielo de los Andes.', 'cóndor', 'huaman', { opts: ['cóndor', 'puma', 'lago'], tr: 'Le condor vole dans le ciel des Andes.' }),
      fill('En el cuento, el héroe busca un ___ de oro.', 'tesoro', 'huaman', { opts: ['tesoro', 'camino', 'viento'], tr: 'Dans le conte, le héros cherche un trésor en or.' }),
      dlg('huaman', '¿Quién es tu héroe o tu heroína favorito? ¿Por qué?', 'Qui est ton héros ou ton héroïne préféré(e) ? Pourquoi ?', [
        ['Mi héroe es el Quetzal, porque es muy valiente.', 1, '¡Qué buen héroe! Un pájaro valiente, claro que sí.', 'Quel bon héros ! Un oiseau courageux, bien sûr.', 'Mon héros, c’est le Quetzal, parce qu’il est très courageux.'],
        ['Mi héroe es una piedra.', 0, '¿Una piedra? Mmm… no es muy ágil.', 'Une pierre ? Mmm… ce n’est pas très agile.', 'Mon héros est une pierre.'],
        ['Mi heroína porque.', 0, 'Mmm… ¿tu heroína por qué? Dime una frase completa.', 'Mmm… ton héroïne pourquoi ? Dis-moi une phrase complète.', 'Mon héroïne parce que.'],
      ]),
      speak('Mi cuento favorito es la leyenda.', 'viajero', { libre: 'la leyenda', es: 'Escucha y di cuál es TU cuento favorito.', fr: 'Écoute et dis quel est TON conte (ou livre, ou film) préféré : Harry Potter, el Principito, Caperucita Roja…', tr: 'Mon conte préféré est la légende. (dis le tien : el Principito, Caperucita Roja…)', hechizo: ['Hechizo del cuento', 'Un libro de oro se abre en el aire'] }),
      dict('El cóndor vuela en el cielo.', 'huaman'),
    ]));

  // 3 — Escucha : la leyenda de Manco Cápac
  quests.push(quest('u10', 3, 'escucha', 'La leyenda de Manco Cápac', '🌞',
    ['huaman', 'Escuchen esta leyenda de los incas: la leyenda de la fundación de Cusco.', 'Écoutez cette légende des Incas : la légende de la fondation de Cusco.'],
    'Les verbes et les connecteurs du récit, puis une légende inca racontée par morceaux : tu écoutes et tu comprends l’histoire de la fondation de Cusco.', ['escuchar', 'leer', 'hablar'], 14, [
      flash('contar', 'salvar', 'ayudar', 'encontrar', 'volar', 'luchar', 'buscar'),
      flash('cantar', 'pero', 'ademas', 'entonces', 'primero', 'luego', 'al_final'),
      flash('un_dia', 'habia_una_vez'),
      lcT('Había una vez un dios, Inti, el sol. Inti mira la tierra y ve a las personas tristes, sin casa y sin comida.', 'huaman', ['Los habitantes de la tierra necesitan ayuda.', 'Inti vive en un lago.', 'Las personas están muy contentas.'], 0),
      lcT('Entonces Inti envía a su hijo Manco Cápac y a su hija Mama Ocllo. Salen del lago Titicaca con un bastón de oro.', 'huaman', ['Dos hijos del sol llegan desde un lago.', 'Inti viaja solo a la montaña.', 'Los hijos de Inti salen de una cueva sin nada.'], 0),
      lcT('Caminan mucho. Un día, el bastón de oro entra en la tierra. Es el lugar perfecto: allí fundan Cusco.', 'huaman', ['Al final de su viaje, nace una ciudad.', 'Los hijos de Inti vuelven al lago.', 'El bastón se pierde en el mar.'], 0),
      tf('Inti es el dios del sol.', true, N, { tr: 'Inti est le dieu du soleil.' }),
      tf('Manco Cápac y Mama Ocllo salen del lago Titicaca.', true, N, { tr: 'Manco Cápac et Mama Ocllo sortent du lac Titicaca.' }),
      tf('Los hijos de Inti fundan Madrid.', false, N, { tr: 'Les enfants d’Inti fondent Madrid. (Faux : ils fondent Cusco.)' }),
      fill('Manco Cápac y Mama Ocllo salen del ___ Titicaca.', 'lago', 'huaman', { opts: ['lago', 'cielo', 'mercado'], tr: 'Manco Cápac et Mama Ocllo sortent du lac Titicaca.' }),
      fill('El bastón es de ___.', 'oro', 'huaman', { opts: ['oro', 'papa', 'nube'], tr: 'Le bâton est en or.' }),
      reord('Primero buscan un lugar y luego fundan una ciudad.', 'killa', { tr: 'D’abord ils cherchent un endroit et ensuite ils fondent une ville.' }),
      dlg('huaman', '¿Te gusta la leyenda? ¿Cuál es tu parte favorita?', 'Tu aimes la légende ? Quelle est ta partie préférée ?', [
        ['Me gusta la parte del bastón de oro.', 1, '¡Esa también es mi parte favorita! El oro brilla en la tierra.', 'C’est aussi ma partie préférée ! L’or brille dans la terre.', 'J’aime la partie du bâton d’or.'],
        ['Me gusta el bastón de papa.', 0, '¿De papa? ¡Qué bastón más raro!', 'En pomme de terre ? Quel drôle de bâton !', 'J’aime le bâton de pomme de terre.'],
        ['Soy la leyenda favorita.', 0, '¿Tú eres una leyenda? ¡Todavía no!', 'Toi, tu es une légende ? Pas encore !', 'Je suis la légende préférée.'],
      ]),
      speak('Mi héroe favorito es Manco Cápac.', 'viajero', { libre: 'Manco Cápac', es: 'Escucha y di cuál es TU héroe favorito.', fr: 'Écoute et dis quel est TON héros (ou héroïne) préféré(e) : Spiderman, Messi, mi abuela…', tr: 'Mon héros préféré est Manco Cápac. (dis le tien)', hechizo: ['Hechizo del héroe', 'Una corona de luz aparece sobre tu cabeza'] }),
    ]));

  // 4 — Forja : conectores y relato
  quests.push(quest('u10', 4, 'forja', 'La Forja: el cuento', '⚒️',
    ['quetzal', 'Pero. Además. Porque. Entonces. ¡Forja el cuento conmigo!', 'Mais. En plus. Parce que. Alors. Forge le conte avec moi !'],
    'Les connecteurs pero / además / porque / entonces et la structure d’un récit simple (había una vez, un día, primero, luego, al final). Verbes à diphtongue : cuento, encuentro.', ['escribir', 'leer'], 15, [
      gram('g_conectores'),
      fill('Quiero volar, ___ no tengo plumas.', 'pero', 'quetzal', { opts: ['pero', 'además', 'entonces'], tr: 'Je veux voler, mais je n’ai pas de plumes.' }),
      fill('Killa es simpática y ___ es muy lista.', 'además', 'killa', { opts: ['además', 'pero', 'porque'], tr: 'Killa est sympa et en plus elle est très maligne.' }),
      fill('El Quetzal no vuela ___ no tiene todas sus plumas.', 'porque', 'marina', { opts: ['porque', 'pero', 'entonces'], tr: 'Le Quetzal ne vole pas parce qu’il n’a pas toutes ses plumes.' }),
      fill('Hay una tormenta. ___ el héroe busca un camino.', 'Entonces', 'huaman', { opts: ['Entonces', 'Porque', 'Pero'], tr: 'Il y a un orage. Alors le héros cherche un chemin.' }),
      reord('El héroe es valiente, pero tiene miedo.', 'huaman', { tr: 'Le héros est courageux, mais il a peur.' }),
      dlg('huaman', '¿Por qué te gustan las leyendas?', 'Pourquoi aimes-tu les légendes ?', [
        ['Porque son historias de héroes.', 1, '¡Exacto! Los héroes nos enseñan a ser valientes.', 'Exact ! Les héros nous apprennent à être courageux.', 'Parce que ce sont des histoires de héros.'],
        ['Por qué son historias de héroes.', 0, 'Para dar la razón se escribe «porque», en una palabra y sin acento.', 'Pour donner la raison, on écrit « porque », en un seul mot et sans accent.', 'Pourquoi ce sont des histoires de héros.'],
        ['Pero las leyendas son héroes.', 0, 'Mmm… «pero» no responde a «¿por qué?».', 'Mmm… « pero » ne répond pas à « ¿por qué? ».', 'Mais les légendes sont des héros.'],
      ]),
      conj('contar', 'yo', 'cuent', 'o', ['o', 'amos', 'an'], 'huaman', { tr: 'Moi, je raconte… (o → ue)' }),
      conj('contar', 'nosotros', 'cont', 'amos', ['amos', 'o', 'an'], 'huaman', { tr: 'Nous, nous racontons… (ici, pas de diphtongue)' }),
      conj('encontrar', 'él', 'encuentr', 'a', ['a', 'o', 'amos'], 'killa', { tr: 'Lui, il trouve… (o → ue)' }),
      gram('g_cuento'),
      fill('Primero cuento la leyenda y ___ canto una canción.', 'luego', 'killa', { opts: ['luego', 'pero', 'porque'], tr: 'D’abord je raconte la légende et ensuite je chante une chanson.' }),
      fill('Al ___, el héroe salva a todos.', 'final', 'huaman', { opts: ['final', 'día', 'vez'], tr: 'À la fin, le héros sauve tout le monde.' }),
      reord('Había una vez un héroe muy valiente.', 'huaman', { tr: 'Il était une fois un héros très courageux.' }),
      dict('Primero busca el camino y luego sube.', 'killa'),
    ]));

  // 5 — Lectura : Machu Picchu
  quests.push(quest('u10', 5, 'lectura', 'Machu Picchu', '🏔️',
    ['huaman', 'Estamos en los Andes, a más de tres mil metros. Aquí el aire es muy fino. ¡Vamos despacio!', 'Nous sommes dans les Andes, à plus de trois mille mètres. Ici l’air est très rare. Allons doucement !'],
    'Lecture sur Machu Picchu et sur Cusco, découverte des grands nombres (mil, quinientos, millón) à reconnaître, puis tu dis quel endroit TOI tu aimerais visiter.', ['leer', 'escuchar', 'hablar', 'cultura'], 14, [
      gram('g_numeros_grandes'),
      fill('Cusco está a más de tres ___ metros.', 'mil', 'killa', { opts: ['mil', 'cien', 'millón'], tr: 'Cusco est à plus de trois mille mètres d’altitude.' }),
      fill('Hay más de quinientos ___ de personas que hablan español.', 'millones', 'marina', { opts: ['millones', 'millón', 'miles'], tr: 'Il y a plus de cinq cents millions de personnes qui parlent espagnol.' }),
      lcT('Machu Picchu tiene más de quinientos años.', 'huaman', ['Machu Picchu es muy antiguo.', 'Machu Picchu es una ciudad moderna.', 'Machu Picchu es un edificio nuevo.'], 0),
      lcT('Cusco está a más de tres mil metros de altura.', 'killa', ['Cusco está muy alto, en las montañas.', 'Cusco está al nivel del mar.', 'Cusco está debajo de una montaña.'], 0),
      read('Machu Picchu es una ciudad inca en las montañas de Perú. Está a unos dos mil cuatrocientos metros de altura. Los incas la construyen hace más de quinientos años, con piedras enormes. Hoy es patrimonio mundial y miles de turistas la visitan cada año.', 'huaman',
        'Machu Picchu est une ville inca dans les montagnes du Pérou. Elle est à environ deux mille quatre cents mètres d’altitude. Les Incas la construisent il y a plus de cinq cents ans, avec d’énormes pierres. Aujourd’hui, c’est un patrimoine mondial et des milliers de touristes la visitent chaque année. (Machu Picchu fait partie des « Nouvelles sept merveilles du monde » depuis 2007.)', [
          ['¿Dónde está Machu Picchu?', 'Où est Machu Picchu ?', ['En las montañas de Perú.', 'En una playa de México.', 'En el centro de Madrid.'], 0],
          ['¿Quiénes construyen Machu Picchu?', 'Qui construit Machu Picchu ?', ['Los incas.', 'Los aztecas.', 'Los mayas.'], 0],
          ['¿Qué es Machu Picchu hoy?', 'Que est Machu Picchu aujourd’hui ?', ['Patrimonio mundial.', 'Un mercado.', 'Un colegio.'], 0],
        ]),
      read('Cusco es la antigua capital de los incas. Está a más de tres mil metros de altura. Cada 24 de junio, la gente celebra el Inti Raymi, la fiesta del sol. Hay música, bailes y trajes de colores. ¡Es una fiesta muy bonita!', 'killa',
        'Cusco est l’ancienne capitale des Incas. Elle est à plus de trois mille mètres d’altitude. Chaque 24 juin, les gens célèbrent l’Inti Raymi, la fête du soleil. Il y a de la musique, des danses et des costumes colorés. C’est une très belle fête ! (24 juin : solstice d’hiver dans l’hémisphère sud, le jour le plus court de l’année.)', [
          ['¿Qué es el Inti Raymi?', 'Qu’est-ce que l’Inti Raymi ?', ['La fiesta del sol.', 'Un animal.', 'Un plato típico.'], 0],
          ['¿Cuándo es el Inti Raymi?', 'Quand a lieu l’Inti Raymi ?', ['El 24 de junio.', 'El 25 de diciembre.', 'El 1 de enero.'], 0],
          ['¿Qué hay en la fiesta?', 'Qu’y a-t-il à la fête ?', ['Música, bailes y trajes de colores.', 'Solo comida.', 'Nada.'], 0],
        ]),
      tf('Machu Picchu está en Perú.', true, N, { tr: 'Machu Picchu est au Pérou.' }),
      tf('Machu Picchu está en el mar.', false, N, { tr: 'Machu Picchu est dans la mer. (Faux : il est dans les montagnes.)' }),
      tf('Cusco es la antigua capital de los incas.', true, N, { tr: 'Cusco est l’ancienne capitale des Incas.' }),
      reord('Machu Picchu está entre las nubes.', 'huaman', { tr: 'Machu Picchu est entre les nuages.' }),
      dlg('huaman', 'Estamos muy altos. ¿Cómo estás? ¿Estás cansado?', 'Nous sommes très haut. Comment vas-tu ? Tu es fatigué ?', [
        ['Estoy un poco cansado, pero contento.', 1, '¡Perfecto! Con un poquito de té de coca se pasa todo.', 'Parfait ! Avec un peu de thé de coca, tout passe. (Dans les Andes, on boit du « mate de coca » contre le mal des montagnes, le « soroche ».)', 'Je suis un peu fatigué, mais content.'],
        ['Soy cansado.', 0, 'Con «cansado» usamos «estar»: «estoy cansado».', 'Avec « cansado », on utilise « estar » : « estoy cansado ».', 'Je suis (ser) fatigué.'],
        ['Estoy muy alto en el cielo.', 0, '¡Casi! Pero se dice «estamos en las montañas».', 'Presque ! Mais on dit « nous sommes dans les montagnes ».', 'Je suis très haut dans le ciel.'],
      ]),
      speak('Me gustaría visitar Machu Picchu.', 'viajero', { libre: 'Machu Picchu', es: 'Escucha y di qué lugar te gustaría visitar a TI.', fr: 'Écoute et dis quel endroit TU aimerais visiter (Madrid, Cartagena, Buenos Aires…). « Me gustaría » = j’aimerais.', tr: 'J’aimerais visiter Machu Picchu. (dis le tien)', foco: 'Machu Picchu : le « ch » se dit « tch » (MA-tchou PIK-tchou). Le « cc » de « Picchu » n’existe pas en espagnol : c’est un « cch », donc « tch ».', hechizo: ['Hechizo del viaje', 'Un camino dorado aparece entre las nubes'] }),
    ]));

  // 6 — Diálogo : el español en el mundo y el quechua
  quests.push(quest('u10', 6, 'dialogo', 'El español en el mundo', '🌍',
    ['killa', 'En mi casa hablamos quechua, pero en el colegio hablamos español. ¿Y tú, qué idiomas hablas?', 'À la maison, nous parlons quechua, mais au collège nous parlons espagnol. Et toi, quelles langues parles-tu ?'],
    'L’espagnol dans le monde (se habla, vingt pays, plus de cinq cents millions de locuteurs), le quechua et ses mots dans nos langues ; puis tu parles de TES langues.', ['hablar', 'leer', 'escribir', 'cultura'], 15, [
      flash('idioma', 'palabra', 'mundo', 'pais', 'hablante', 'continente', 'quechua'),
      flash('inca', 'pachamama', 'papa', 'quinua', 'lana', 'tejido'),
      gram('g_se_habla'),
      fill('En Perú ___ español y quechua.', 'se habla', 'killa', { opts: ['se habla', 'se hablan', 'hablan'], tr: 'Au Pérou, on parle espagnol et quechua.' }),
      fill('En México ___ muchas lenguas indígenas.', 'se hablan', 'itzel', { opts: ['se habla', 'se hablan', 'hablo'], tr: 'Au Mexique, on parle beaucoup de langues indigènes. (plusieurs langues → se hablan)' }),
      read('El español es la lengua oficial de veinte países. Se habla en España, en América y también en África, en Guinea Ecuatorial. Más de quinientos millones de personas hablan español. Es uno de los idiomas más hablados del mundo.', 'killa',
        'L’espagnol est la langue officielle de vingt pays. On le parle en Espagne, en Amérique et aussi en Afrique, en Guinée équatoriale. Plus de cinq cents millions de personnes parlent espagnol. C’est une des langues les plus parlées au monde. (Vingt pays, plus Porto Rico, territoire des États-Unis.)', [
          ['¿En cuántos países es oficial el español?', 'Dans combien de pays l’espagnol est-il officiel ?', ['En veinte.', 'En tres.', 'En mil.'], 0],
          ['¿Dónde se habla español en África?', 'Où parle-t-on espagnol en Afrique ?', ['En Guinea Ecuatorial.', 'En Marruecos.', 'En Egipto.'], 0],
          ['¿Cuántas personas hablan español?', 'Combien de personnes parlent espagnol ?', ['Más de quinientos millones.', 'Cien personas.', 'Dos mil.'], 0],
        ]),
      read('En mi casa hablamos quechua, pero en el colegio hablamos español. El quechua es una lengua de los Andes y millones de personas lo hablan. Muchas palabras españolas vienen del quechua: papa, llama, puma, cóndor, quinua. ¡También en francés decimos lama, puma, condor y quinoa!', 'killa',
        'À la maison, nous parlons quechua, mais au collège nous parlons espagnol. Le quechua est une langue des Andes et des millions de personnes le parlent. Beaucoup de mots espagnols viennent du quechua : pomme de terre, lama, puma, condor, quinoa. En français aussi, on dit lama, puma, condor et quinoa ! (« papa » = pomme de terre en Amérique latine ; en Espagne, on dit « patata ».)', [
          ['¿Qué hablan en casa de Killa?', 'Que parle-t-on chez Killa ?', ['Quechua.', 'Francés.', 'Inglés.'], 0],
          ['¿Qué significa «papa» en América?', 'Que veut dire « papa » en Amérique ?', ['Pomme de terre.', 'Pain.', 'Tomate.'], 0],
          ['¿Qué palabras del quechua usamos también en francés?', 'Quels mots du quechua utilise-t-on aussi en français ?', ['Puma y cóndor.', 'Casa y mesa.', 'Libro y silla.'], 0],
        ]),
      tf('El quechua es una lengua de los Andes.', true, N, { tr: 'Le quechua est une langue des Andes.' }),
      tf('El español solo se habla en España.', false, N, { tr: 'L’espagnol ne se parle qu’en Espagne. (Faux : il se parle en Espagne, en Amérique latine et en Guinée équatoriale.)' }),
      lcT('En mi casa hablamos quechua y en el colegio hablamos español.', 'killa', ['Killa usa un idioma diferente en casa y en el cole.', 'Killa solo habla inglés.', 'Killa no va al colegio.'], 0),
      dlg('killa', '¿Qué idiomas hablas tú?', 'Quelles langues parles-tu ?', [
        ['Hablo francés y un poco de español.', 1, '¡Genial! Con dos idiomas tienes dos mundos.', 'Génial ! Avec deux langues, tu as deux mondes.', 'Je parle français et un peu d’espagnol.'],
        ['Hablo piedras y pirámides.', 0, '¿Piedras? Mmm… las piedras no hablan.', 'Des pierres ? Mmm… les pierres ne parlent pas.', 'Je parle pierres et pyramides.'],
        ['Hablo hablo.', 0, 'No entiendo. ¿Qué idiomas?', 'Je ne comprends pas. Quelles langues ?', 'Je parle je parle.'],
      ]),
      speak('Hablo francés y español.', 'viajero', { libre: 'francés y español', es: 'Escucha y di qué idiomas hablas TÚ.', fr: 'Écoute et dis quelles langues TU parles (francés, inglés, español, árabe, italiano…). Tu peux en citer jusqu’à trois mots.', tr: 'Je parle français et espagnol. (dis tes langues)', foco: 'Le « ñ » de « español » : comme « gn » dans « montagne ». Le « ll » de « llama » : comme un « y » (YA-ma).', hechizo: ['Hechizo de las lenguas', 'Muchas lenguas bailan alrededor de tu cabeza'] }),
      writeFree('Hablo ___. Quiero aprender ___. Mi palabra favorita en español es ___.', [
        { id: 'hablo', pista: 'Les langues que tu parles (francés, inglés, español…)', tipo: 'texto' },
        { id: 'aprender', pista: 'Une langue que tu veux apprendre (italiano, quechua, japonés…)', tipo: 'texto' },
        { id: 'palabra', pista: 'Ton mot préféré en espagnol (mariposa, chévere, amigo…)', tipo: 'texto' },
      ], 'Hablo francés y un poco de español. Quiero aprender italiano. Mi palabra favorita en español es mariposa.', 'Je parle français et un peu d’espagnol. Je veux apprendre l’italien. Mon mot préféré en espagnol est mariposa.', 'viajero', C('Escribe sobre tus idiomas.', 'Écris sur tes langues.')),
    ]));

  // 7 — Cultura : contar una leyenda
  quests.push(quest('u10', 7, 'cultura', 'Contar una leyenda', '🔥',
    ['paulina', 'Mis tejidos cuentan historias: cada dibujo tiene un significado. ¿Y tú, qué historia cuentas?', 'Mes tissages racontent des histoires : chaque dessin a un sens. Et toi, quelle histoire racontes-tu ?'],
    'Machu Picchu et le quechua en images ; la légende du quetzal au Guatemala (Tecún Umán) ; puis TOI, tu inventes et tu racontes ta propre légende.', ['cultura', 'leer', 'escribir', 'hablar'], 14, [
      capsula,
      tf('Machu Picchu es una ciudad inca.', true, N, { tr: 'Machu Picchu est une ville inca.' }),
      tf('Los incas hablan quechua.', true, N, { tr: 'Les Incas parlent quechua.' }),
      tf('La papa es de origen quechua.', true, N, { tr: 'Le mot « papa » vient du quechua. (« papa » = pomme de terre, et c’est un aliment originaire des Andes.)' }),
      read('En Guatemala, el quetzal es el pájaro nacional y también el nombre de la moneda. Hay una leyenda: Tecún Umán, un héroe maya, es muy valiente y defiende a su pueblo. Cuando cae, un quetzal vuela hasta él, y desde ese día su pecho es rojo. Por eso, el quetzal es un símbolo de libertad.', 'paulina',
        'Au Guatemala, le quetzal est l’oiseau national et aussi le nom de la monnaie. Il y a une légende : Tecún Umán, un héros maya, est très courageux et défend son peuple. Quand il tombe, un quetzal vole jusqu’à lui, et depuis ce jour sa poitrine est rouge. C’est pourquoi le quetzal est un symbole de liberté. (Tecún Umán est un chef k’iche’ du XVIe siècle ; l’histoire de l’oiseau est une légende.)', [
          ['¿Qué es el quetzal en Guatemala?', 'Qu’est-ce que le quetzal au Guatemala ?', ['El pájaro nacional y la moneda.', 'Una montaña.', 'Un plato típico.'], 0],
          ['¿Cómo es Tecún Umán?', 'Comment est Tecún Umán ?', ['Un héroe muy valiente.', 'Un rey muy rico.', 'Un monstruo.'], 0],
          ['¿De qué color es el pecho del quetzal en la leyenda?', 'De quelle couleur est la poitrine du quetzal dans la légende ?', ['Rojo.', 'Azul.', 'Negro.'], 0],
        ]),
      lcT('Cuando Tecún Umán cae, un quetzal vuela hasta él.', 'paulina', ['Un pájaro acompaña al héroe en su final.', 'El héroe llega a un lago.', 'Un puma ayuda a un niño.'], 0),
      dlg('paulina', 'Cada dibujo de mis tejidos cuenta algo: la montaña, el sol, el cóndor… ¿Qué dibujas tú?', 'Chaque dessin de mes tissages raconte quelque chose : la montagne, le soleil, le condor… Et toi, que dessines-tu ?', [
        ['Dibujo mi casa y mi familia.', 1, '¡Qué hermoso! Una familia también es una historia.', 'Que c’est beau ! Une famille aussi est une histoire. (« hermoso » = beau, très courant en Amérique latine)', 'Je dessine ma maison et ma famille.'],
        ['Dibujo una pizza voladora.', 1, '¡Qué divertido! En un tejido cabe todo.', 'Comme c’est amusant ! Dans un tissage, tout a sa place.', 'Je dessine une pizza volante.'],
        ['Dibujo hablo.', 0, 'Mmm… no entiendo. ¿Qué dibujas?', 'Mmm… je ne comprends pas. Que dessines-tu ?', 'Je dessine je parle.'],
      ]),
      reord('Mis tejidos cuentan historias de los Andes.', 'paulina', { tr: 'Mes tissages racontent des histoires des Andes.' }),
      fill('Para los incas, el ___ es un dios.', 'sol', 'killa', { opts: ['sol', 'tejido', 'lago'], tr: 'Pour les Incas, le soleil est un dieu.' }),
      writeFree('Había una vez un héroe que se llama ___. Es muy ___. Un día, ___. Al final, ___.', [
        { id: 'heroe', pista: 'Le nom de ton héros ou de ton héroïne (Quetzal, Killa, Marina, ton prénom…)', tipo: 'texto' },
        { id: 'como', pista: 'Comment est-il ? (valiente, inteligente, fuerte, simpático… ; au féminin : valiente, inteligente, fuerte, simpática)', tipo: 'texto' },
        { id: 'accion', pista: 'Ce qui se passe un jour : une phrase au présent (encuentra un tesoro, busca un camino, vuela hasta la cima…)', tipo: 'texto' },
        { id: 'final', pista: 'La fin : une phrase au présent (salva a todos, canta una canción, vuelve a casa…)', tipo: 'texto' },
      ], 'Había una vez un héroe que se llama Quetzal. Es muy valiente. Un día, encuentra un tesoro. Al final, salva a todos.', 'Il était une fois un héros qui s’appelle Quetzal. Il est très courageux. Un jour, il trouve un trésor. À la fin, il sauve tout le monde.', 'viajero', C('Escribe tu leyenda.', 'Écris ta légende.')),
      speak('Había una vez un héroe muy valiente.', 'viajero', { libre: 'valiente', es: 'Escucha y cuenta tu cuento: ¿cómo es TU héroe?', fr: 'Écoute puis commence TON conte à voix haute : change « valiente » par un autre adjectif (inteligente, fuerte, simpático…).', tr: 'Il était une fois un héros très courageux. (change l’adjectif)', hechizo: ['Hechizo del cuento', 'Tu héroe aparece en la montaña, lleno de luz'] }),
      speak('Al final, el héroe salva a todos.', 'viajero', { libre: 'salva', es: 'Escucha y termina TU cuento.', fr: 'Écoute et termine TON conte : remplace « salva » par une autre action (canta, vuela, ayuda…). Pas de pression : l’important, c’est de parler !', tr: 'À la fin, le héros sauve tout le monde. (change l’action)' }),
      dict('Y colorín colorado, este cuento se ha acabado.', 'huaman', { acept: ['y colorín colorado este cuento se ha acabado'] }),
    ]));

  // 8 — Desafío
  quests.push(quest('u10', 8, 'desafio', 'La Sombra del Silencio', '👤',
    ['sombra', 'Sin cuentos, nadie recuerda. Sin palabras, nadie me molesta. Este es mi último silencio.', 'Sans contes, personne ne se souvient. Sans mots, personne ne me dérange. Voici mon dernier silence.'],
    'Boss final de la légende : révision mixte des unités 1 à 10 (présentation, description, maison, présent, goûts, lieux, légendes) pour affronter la Sombra du Silence… et l’écouter.', ['escuchar', 'hablar', 'leer', 'escribir'], 15, [
      dlg('sombra', 'Sin nombre no hay cuento. ¿Cómo te llamas y de dónde eres?', 'Sans nom, pas de conte. Comment tu t’appelles et d’où viens-tu ?', [
        ['Me llamo Álex y soy de París.', 1, '¡Grr! Un nombre… Hace mucho que nadie me dice su nombre.', 'Grr ! Un nom… Ça fait longtemps que personne ne me dit son nom.', 'Je m’appelle Álex et je suis de Paris.'],
        ['Tengo doce años y tres amigos.', 0, 'No es lo que pregunto. Responde bien.', 'Ce n’est pas ce que je demande. Réponds correctement.', 'J’ai douze ans et trois amis.'],
        ['Adiós, hasta luego.', 0, 'No te vas sin responder.', 'Tu ne pars pas sans répondre.', 'Au revoir, à tout à l’heure.'],
      ]),
      dlg('sombra', '¿Cómo eres? ¿Qué llevas hoy?', 'Comment es-tu ? Que portes-tu aujourd’hui ?', [
        ['Soy simpático y llevo una camiseta azul.', 1, '¡Aaah! Una cara más que vuelve… Es raro. No es desagradable.', 'Aaah ! Encore un visage qui revient… C’est étrange. Ce n’est pas désagréable.', 'Je suis sympathique et je porte un tee-shirt bleu.'],
        ['Tengo simpático y soy una camiseta.', 0, 'Eso no tiene sentido. ¡Otra vez!', 'Ça n’a aucun sens. Encore une fois !', 'J’ai sympathique et je suis un tee-shirt.'],
        ['Llevo doce años.', 0, '¡No! La edad se dice con «tener». ¡Otra vez!', 'Non ! L’âge se dit avec « tener ». Encore une fois !', 'Je porte douze ans.'],
      ]),
      lcT('Son las tres y media.', 'sombra', ['3:30', '3:15', '2:30'], 0),
      fill('A mí me ___ los cuentos de héroes.', 'gustan', 'marina', { opts: ['gusta', 'gustan', 'gustas'], tr: 'J’aime les contes de héros. (« los cuentos » est pluriel → gustan)' }),
      fill('Quiero volar, ___ no tengo plumas.', 'pero', 'quetzal', { opts: ['pero', 'además', 'porque'], tr: 'Je veux voler, mais je n’ai pas de plumes.' }),
      lcT('En Perú se habla español y quechua.', 'sombra', ['En Perú hay dos lenguas.', 'En Perú solo se habla inglés.', 'En Perú no hay idiomas.'], 0),
      match(['condor', 'puma', 'llama', 'estrella', 'nube', 'lago']),
      fill('Machu Picchu ___ en las montañas de Perú.', 'está', 'killa', { opts: ['es', 'está', 'hay'], tr: 'Machu Picchu est dans les montagnes du Pérou.' }),
      fill('Bogotá es ___ grande que Salamanca.', 'más', 'camila', { opts: ['más', 'menos', 'mejor'], tr: 'Bogotá est plus grande que Salamanque.' }),
      conj('ir', 'nosotros', '', 'vamos', ['vamos', 'vais', 'van'], 'marina', { tr: 'Nous, nous allons…' }),
      reord('Primero busco el camino y luego subo a la cima.', 'killa', { tr: 'D’abord je cherche le chemin et ensuite je monte au sommet.' }),
      dlg('sombra', '¿Por qué quieres hablar con los demás?', 'Pourquoi veux-tu parler avec les autres ?', [
        ['Porque con las palabras tengo amigos.', 1, 'Amigos… Yo no tengo ninguno. Estoy sola.', 'Des amis… Moi, je n’en ai aucun. Je suis seule. (« sola » : elle est une femme, féminin de « solo »)', 'Parce qu’avec les mots, j’ai des amis.'],
        ['Porque soy una montaña.', 0, '¿Una montaña? Las montañas también se quedan solas.', 'Une montagne ? Les montagnes aussi restent seules.', 'Parce que je suis une montagne.'],
        ['Porque no me gusta nada.', 0, 'Entonces… ¿para qué hablas?', 'Alors… pourquoi parles-tu ?', 'Parce que je n’aime rien.'],
      ]),
      read('Soy la Sombra del Silencio. Vivo en la montaña desde hace mucho tiempo. Nadie habla conmigo porque todos tienen miedo. Estoy sola y triste. Por eso quiero un mundo sin palabras: así nadie se ríe de mí.', 'sombra',
        'Je suis l’Ombre du Silence. Je vis dans la montagne depuis très longtemps. Personne ne me parle parce que tout le monde a peur. Je suis seule et triste. C’est pourquoi je veux un monde sans mots : comme ça, personne ne se moque de moi.', [
          ['¿Cómo está la Sombra?', 'Comment va l’Ombre ?', ['Sola y triste.', 'Contenta y cansada.', 'Enfadada y valiente.'], 0],
          ['¿Por qué nadie habla con ella?', 'Pourquoi personne ne lui parle-t-elle ?', ['Porque todos tienen miedo.', 'Porque vive en el mar.', 'Porque es muy pequeña.'], 0],
          ['¿Qué quiere la Sombra?', 'Que veut l’Ombre ?', ['Un mundo sin palabras.', 'Un tesoro de oro.', 'Una casa nueva.'], 0],
        ]),
      speak('Hola, me llamo Álex y te escucho.', 'viajero', { nombre: 'Álex', tr: 'Salut, je m’appelle Álex et je t’écoute. (dis ton prénom ; c’est ton dernier sort)', hechizo: ['Hechizo final', 'Tu voz abre la última puerta del silencio'] }),
      finale,
    ], { jefe: { personaje: 'sombra', vidas: 12 } }));

  return {
    id: 'u10', numero: 10, titulo: 'Leyendas y héroes', lugar: 'Cusco', emoji: '🦙', ejes: [4, 5], periodo: 'mai-juin',
    objetivos: [
      { es: 'Contar un cuento sencillo con «había una vez», «un día», «primero», «luego» y «al final».', fr: 'Raconter un conte simple avec « había una vez », « un día », « primero », « luego » et « al final ».' },
      { es: 'Unir ideas con «pero», «además», «porque» y «entonces».', fr: 'Relier des idées avec « pero », « además », « porque » et « entonces ».' },
      { es: 'Conocer leyendas y héroes de los Andes y de América.', fr: 'Connaître des légendes et des héros des Andes et d’Amérique.' },
      { es: 'Conocer Machu Picchu, Cusco, los incas y el quechua.', fr: 'Connaître Machu Picchu, Cusco, les Incas et le quechua.' },
      { es: 'Saber dónde y cuánta gente habla español en el mundo: «se habla».', fr: 'Savoir où et combien de personnes parlent espagnol dans le monde : « se habla ».' },
      { es: 'Hablar de mis idiomas y escribir mi propia leyenda.', fr: 'Parler de mes langues et écrire ma propre légende.' },
    ],
    vocab, gramatica, quests,
    pluma: { numero: 10, nombre: 'Pluma del Eco', descripcion: L('quetzal', 'Diez plumas. Ya tengo mi voz, mis alas… y muchos amigos.', 'Dix plumes. J’ai ma voix, mes ailes… et beaucoup d’amis.') },
  };
}
