// Unidad 6 — ¡Feliz Navidad! (Madrid de noche · Puerta del Sol · mercado navideño)
// Axe 4 (le réel et l'imaginaire : fêtes). PNJ madrilènes : Nacho, Rosa (déjà connus), Paloma, Chema.
// Grammaire : impératif simple (tú, quelques irréguliers, vosotros), hay que / tener que.
import { W, G, quest, flash, match, lcV, lcI, lcT as lcT0, dict, fill, reord, conj, dlg, read as read0, speak, tf, gram, writeFree, cine, P, L, C, NARR } from './lib.mjs';

// Varie la position de la bonne réponse (0, 1, 2…) des écoutes et des lectures pour qu'elle ne soit pas devinable.
let rot = 2;
const place = (opts, ok) => {
  const k = rot++ % opts.length;
  const rest = opts.filter((_, i) => i !== ok);
  rest.splice(k, 0, opts[ok]);
  return [rest, k];
};
const lcT = (say, voz, opts, ok, o) => { const [a, k] = place(opts, ok); return lcT0(say, voz, a, k, o); };
const read = (texto, voz, tFr, qs, o) => read0(texto, voz, tFr, qs.map(([q, qfr, opts, ok]) => { const [a, k] = place(opts, ok); return [q, qfr, a, k]; }), o);

export default function build() {
  const N = NARR;

  // ───────────── Vocabulario (46) ─────────────
  const vocab = [
    // fiestas
    W('navidad', 'Navidad', 'Noël (le 25 décembre ; on dit aussi « las Navidades » pour toute la période des fêtes)', '🎄', 'fiestas', 'En Navidad vamos a casa de los abuelos.', 'À Noël, nous allons chez les grands-parents.', { genero: 'f' }),
    W('nochebuena', 'Nochebuena', 'veille de Noël : le soir du 24 décembre, grand dîner en famille', '🌟', 'fiestas', 'La cena de Nochebuena es el veinticuatro de diciembre.', 'Le dîner de Nochebuena est le vingt-quatre décembre.', { genero: 'f' }),
    W('nochevieja', 'Nochevieja', 'réveillon du Nouvel An (le soir du 31 décembre)', '🎆', 'fiestas', 'En Nochevieja comemos doce uvas.', 'Le soir du 31, nous mangeons douze raisins.', { genero: 'f' }),
    W('ano_nuevo', 'Año Nuevo', 'Nouvel An (le 1er janvier)', '🎇', 'fiestas', '¡Feliz Año Nuevo!', 'Bonne année !', { genero: 'm' }),
    W('reyes_magos', 'Reyes Magos', 'Rois mages : Melchor, Gaspar et Baltasar, qui apportent les cadeaux le 6 janvier', '👑', 'fiestas', 'Los Reyes Magos traen los regalos el seis de enero.', 'Les Rois mages apportent les cadeaux le six janvier.', { genero: 'm', soloPlural: true }),
    W('cabalgata', 'cabalgata', 'défilé (la cabalgata de Reyes : le défilé des Rois mages, le soir du 5 janvier)', '🐪', 'fiestas', 'La cabalgata de Reyes es el cinco de enero.', 'Le défilé des Rois est le cinq janvier.', { genero: 'f', plural: 'cabalgatas' }),
    W('feliz', 'feliz', 'heureux, joyeux (¡Feliz Navidad ! = Joyeux Noël)', '😊', 'fiestas', '¡Feliz Navidad, Marina!', 'Joyeux Noël, Marina !', { adj: true, genero: 'mf', plural: 'felices' }),
    W('arbol_navidad', 'árbol de Navidad', 'sapin de Noël', '🎄', 'fiestas', 'El árbol de Navidad tiene luces y una estrella.', 'Le sapin de Noël a des lumières et une étoile.', { genero: 'm', plural: 'árboles de Navidad' }),
    W('estrella', 'estrella', 'étoile', '⭐', 'fiestas', 'La estrella brilla en lo alto del árbol.', 'L’étoile brille tout en haut du sapin.', { genero: 'f', plural: 'estrellas' }),
    W('luces', 'luces', 'lumières, guirlandes lumineuses (singulier : la luz)', '💡', 'fiestas', 'Las luces de Navidad iluminan la calle.', 'Les lumières de Noël éclairent la rue.', { genero: 'f', soloPlural: true }),
    W('villancico', 'villancico', 'chant de Noël', '🎶', 'fiestas', 'Cantamos un villancico en Nochebuena.', 'Nous chantons un chant de Noël à Nochebuena.', { genero: 'm', plural: 'villancicos' }),
    W('campanadas', 'campanadas', 'coups de cloche (les douze coups de minuit de Nochevieja)', '🔔', 'fiestas', 'Las campanadas suenan a medianoche.', 'Les coups de cloche sonnent à minuit.', { genero: 'f', soloPlural: true }),
    W('uva', 'uva', 'grain de raisin (en Nochevieja : douze grains, un par coup de cloche)', '🍇', 'fiestas', 'Comemos una uva con cada campanada.', 'Nous mangeons un raisin à chaque coup de cloche.', { genero: 'f', plural: 'uvas' }),
    W('belen', 'belén', 'crèche de Noël (le « belén » : la scène de la Nativité en figurines)', null, 'fiestas', 'En la plaza hay un belén enorme.', 'Sur la place, il y a une énorme crèche.', { genero: 'm', plural: 'belenes', ilustracion: 'Une crèche de Noël en figurines : la Vierge, Joseph, l’enfant Jésus dans la paille, un âne, un bœuf et une étoile au-dessus de l’étable' }),
    // regalos y lotería
    W('regalo', 'regalo', 'cadeau', '🎁', 'regalos', 'Mi regalo favorito es un libro.', 'Mon cadeau préféré est un livre.', { genero: 'm', plural: 'regalos' }),
    W('carta', 'carta', 'lettre (courrier)', '✉️', 'regalos', 'Escribo una carta a los Reyes Magos.', 'J’écris une lettre aux Rois mages.', { genero: 'f', plural: 'cartas' }),
    W('loteria', 'lotería', 'loterie (la Lotería de Navidad, le 22 décembre)', '🎟️', 'regalos', 'La Lotería de Navidad es el veintidós de diciembre.', 'La Loterie de Noël a lieu le vingt-deux décembre.', { genero: 'f', exVoz: 'paloma' }),
    W('premio', 'premio', 'prix, lot', '🏆', 'regalos', 'El primer premio se llama el Gordo.', 'Le premier prix s’appelle le Gordo (« le Gros »).', { genero: 'm', plural: 'premios', exVoz: 'paloma' }),
    W('numero', 'número', 'numéro, nombre', '🔢', 'regalos', 'Mi número favorito es el siete.', 'Mon numéro préféré est le sept.', { genero: 'm', plural: 'números' }),
    W('comprar', 'comprar', 'acheter', '🛒', 'verbos', 'Tengo que comprar los regalos.', 'Je dois acheter les cadeaux.'),
    W('todos', 'todos', 'tous, tout le monde (todos = masculin pluriel ; todas = féminin)', '👥', 'regalos', 'Todos cantan villancicos.', 'Tout le monde chante des chants de Noël.', { genero: 'm', soloPlural: true }),
    // comida y frío
    W('roscon', 'roscón', 'roscón : grande brioche en couronne, avec fruits confits, mangée le 6 janvier (roscón de Reyes)', null, 'comida', 'El roscón de Reyes tiene una sorpresa dentro.', 'Le roscón des Rois a une surprise à l’intérieur.', { genero: 'm', plural: 'roscones', ilustracion: 'Un roscón de Reyes : une grande brioche en forme de couronne, décorée de fruits confits colorés et de sucre', exVoz: 'chema', voz: 'chema' }),
    W('turron', 'turrón', 'turrón : nougat de Noël aux amandes et au miel', null, 'comida', 'El turrón es un dulce de almendras y miel.', 'Le turrón est une sucrerie aux amandes et au miel.', { genero: 'm', plural: 'turrones', ilustracion: 'Des tablettes de turrón : un nougat blanc aux amandes et un nougat brun, posés sur une assiette', exVoz: 'chema' }),
    W('marisco', 'marisco', 'fruits de mer (plat typique de Nochebuena)', '🦐', 'comida', 'En Nochebuena muchas familias cenan marisco.', 'À Nochebuena, beaucoup de familles dînent de fruits de mer.', { genero: 'm', plural: 'mariscos' }),
    W('churros', 'churros', 'churros : beignets allongés, qu’on trempe dans du chocolat chaud', null, 'comida', 'Rosa vende los mejores churros de Madrid.', 'Rosa vend les meilleurs churros de Madrid.', { genero: 'm', soloPlural: true, ilustracion: 'Une assiette de churros dorés, longs et striés, avec une tasse de chocolat chaud épais à côté', voz: 'rosa', exVoz: 'rosa' }),
    W('chocolate_nav', 'chocolate', 'chocolat (chocolate caliente : chocolat chaud épais, pour tremper les churros)', '🍫', 'comida', 'Tomo chocolate caliente con churros.', 'Je prends un chocolat chaud avec des churros.', { genero: 'm', plural: 'chocolates' }),
    W('dulce_nav', 'dulce', 'sucrerie, gâteau sucré (un dulce) ; aussi : sucré', '🍬', 'comida', 'En Navidad comemos muchos dulces.', 'À Noël, nous mangeons beaucoup de sucreries.', { genero: 'm', plural: 'dulces' }),
    W('hace_frio', 'hace frío', 'il fait froid (météo) ; pour une personne : tengo frío = j’ai froid', '🥶', 'tiempo', 'En diciembre hace frío en Madrid.', 'En décembre, il fait froid à Madrid.'),
    W('abrigo', 'abrigo', 'manteau', '🧥', 'ropa', 'Llevo un abrigo negro y una bufanda.', 'Je porte un manteau noir et une écharpe.', { genero: 'm', plural: 'abrigos' }),
    W('bufanda', 'bufanda', 'écharpe', '🧣', 'ropa', 'La bufanda de Marina es roja.', 'L’écharpe de Marina est rouge.', { genero: 'f', plural: 'bufandas' }),
    // verbos de órdenes
    W('mirar', 'mirar', 'regarder (mira ! = regarde !)', '👀', 'verbos', 'Mira las luces de Madrid.', 'Regarde les lumières de Madrid.'),
    W('cantar', 'cantar', 'chanter (canta ! = chante !)', '🎤', 'verbos', 'Canta con nosotros.', 'Chante avec nous.'),
    W('poner', 'poner', 'mettre, poser (pon ! = mets !)', '📌', 'verbos', 'Pon la mesa para la cena.', 'Mets la table pour le dîner.'),
    W('venir', 'venir', 'venir (ven ! = viens !)', '🙋', 'verbos', 'Ven aquí, Nacho.', 'Viens ici, Nacho.'),
    W('decir', 'decir', 'dire (di ! = dis !)', '🗣️', 'verbos', 'Di «feliz Navidad».', 'Dis « joyeux Noël ».'),
    W('abrir', 'abrir', 'ouvrir (abre ! = ouvre !)', '📭', 'verbos', 'Abre tu regalo.', 'Ouvre ton cadeau.'),
    W('probar_nav', 'probar', 'goûter, essayer (prueba ! = goûte !)', '😋', 'verbos', 'Prueba el turrón de Chema.', 'Goûte le turrón de Chema.'),
    W('encender', 'encender', 'allumer (enciende ! = allume !)', '🔆', 'verbos', 'Enciende las luces, por favor.', 'Allume les lumières, s’il te plaît.'),
    W('apagar', 'apagar', 'éteindre', '🔌', 'verbos', 'La Sombra apaga las luces.', 'La Sombra éteint les lumières.'),
    W('ayudar', 'ayudar', 'aider (ayuda ! = aide !)', '🤝', 'verbos', 'Marina ayuda a Chema.', 'Marina aide Chema.'),
    W('cortar', 'cortar', 'couper', '✂️', 'verbos', 'Corta el roscón con cuidado.', 'Coupe le roscón avec précaution.', { exVoz: 'chema' }),
    W('tomar', 'tomar', 'prendre ; boire ou manger (tomar chocolate)', '☕', 'verbos', 'Tomo un chocolate caliente.', 'Je prends un chocolat chaud.'),
    W('rapido', 'rápido', 'vite, rapide (¡rápido ! = vite !)', '⚡', 'verbos', '¡Rápido, que son las doce menos cinco!', 'Vite, il est minuit moins cinq !', { adj: true, genero: 'm', femenino: 'rápida' }),
    W('cuidado', 'cuidado', 'attention ! (¡cuidado! = fais attention !)', '⚠️', 'verbos', '¡Cuidado, que quema!', 'Attention, ça brûle !', { genero: 'm' }),
    // obligación
    W('hay_que', 'hay que', 'il faut + infinitif (obligation pour tout le monde)', '👉', 'obligacion', 'Hay que encender las luces.', 'Il faut allumer les lumières.'),
    W('tener_que', 'tener que', 'devoir + infinitif (obligation personnelle : tengo que, tienes que…)', '📋', 'obligacion', 'Tengo que comprar los regalos.', 'Je dois acheter les cadeaux.'),
  ];

  // ───────────── Gramática ─────────────
  const gramatica = [
    G('g_imperativo', 'Mira, come, abre', 'L’impératif : donner un ordre à « tú »', [
      ['Mira las luces de Madrid.', 'Regarde les lumières de Madrid.', 'paloma', ['Mira']],
      ['Come las doce uvas.', 'Mange les douze raisins.', 'chema', ['Come']],
      ['Abre tu regalo.', 'Ouvre ton cadeau.', 'nacho', ['Abre']],
      ['Escucha el villancico y canta con nosotros.', 'Écoute le chant de Noël et chante avec nous.', 'rosa', ['Escucha', 'canta']],
      ['Chicos, esperad aquí, por favor.', 'Les enfants, attendez ici, s’il vous plaît.', 'paloma', ['esperad']],
    ], 'Para dar una orden a «tú», usamos la forma de «él» del presente: él mira → ¡mira!; él come → ¡come!; él abre → ¡abre! Para «vosotros»: la r del infinitivo cambia por d: mirad, comed, abrid.',
    'Pour donner un ordre à « tú », on utilise la forme « él » du présent : él mira → ¡mira ! ; él come → ¡come ! ; él abre → ¡abre ! Pour « vosotros » : le r de l’infinitif devient d : mirad, comed, abrid.',
    "L'impératif affirmatif sert à donner un ordre, un conseil ou une consigne (tu en connais déjà plusieurs de l'école : escucha, lee, abre, repite). Pour « tú » (une seule personne que tu tutoies), la forme est identique à la troisième personne du singulier du présent : él habla → ¡habla!, él come → ¡come!, él escribe → ¡escribe! Pour « vosotros » (plusieurs personnes que tu tutoies, en Espagne), on remplace le -r final de l'infinitif par -d : hablad, comed, escribid. Il n'y a pas de pronom sujet (on ne dit pas « tú mira »). Le « por favor » adoucit l'ordre. Pour dire « ne fais pas… », la forme change complètement (no mires, no comas…) : on la verra plus tard. Au Mexique et en Amérique latine, on dit « ustedes » (¡miren!) à la place de vosotros ; en Argentine, le « vos » donne ¡mirá!, ¡comé! (tu entendras ça à Buenos Aires).",
    { encabezado: ['Infinitivo', 'tú', 'vosotros'], filas: [['mirar', 'mira', 'mirad'], ['cantar', 'canta', 'cantad'], ['comer', 'come', 'comed'], ['abrir', 'abre', 'abrid'], ['esperar', 'espera', 'esperad']] }),
    G('g_imperativo_irr', 'Ven, pon, di, enciende', 'Les impératifs irréguliers à connaître', [
      ['Ven aquí, Nacho.', 'Viens ici, Nacho.', 'paloma', ['Ven']],
      ['Pon el regalo en la mesa.', 'Mets le cadeau sur la table.', 'chema', ['Pon']],
      ['Di «feliz Navidad».', 'Dis « joyeux Noël ».', 'rosa', ['Di']],
      ['Enciende las luces, por favor.', 'Allume les lumières, s’il te plaît.', 'nacho', ['Enciende']],
      ['Prueba el turrón, está muy rico.', 'Goûte le turrón, il est très bon.', 'chema', ['Prueba']],
    ], 'Algunos verbos tienen un imperativo especial: venir → ven, poner → pon, decir → di, ir → ve. Y los verbos con cambio de vocal lo mantienen: encender → enciende, probar → prueba.',
    'Certains verbes ont un impératif spécial : venir → ven, poner → pon, decir → di, ir → ve. Et les verbes qui changent de voyelle la gardent : encender → enciende, probar → prueba.',
    "Huit verbes courants ont un impératif « tú » irrégulier : venir → ven, poner → pon, decir → di, ir → ve, hacer → haz, salir → sal, ser → sé, tener → ten. Apprends-les par cœur (tu en as besoin tous les jours : « ven aquí », « di la verdad », « ten cuidado »). Les verbes à diphtongue (e→ie, o→ue) gardent la diphtongue à l'impératif tú, puisque la forme est celle de « él » : encender → enciende, probar → prueba, contar → cuenta, empezar → empieza. Attention : pour « vosotros », ces verbes sont réguliers : venid, poned, decid, id (et encended, probad : pas de diphtongue, comme nosotros). Les accents d'orthographe : « di » et « ve » n'ont pas d'accent ; « sé » (verbe ser) en a un pour le distinguer de « se ».",
    { encabezado: ['Infinitivo', 'tú', 'vosotros'], filas: [['venir', 'ven', 'venid'], ['poner', 'pon', 'poned'], ['decir', 'di', 'decid'], ['ir', 've', 'id'], ['encender', 'enciende', 'encended'], ['probar', 'prueba', 'probad']] }),
    G('g_hay_que', 'Hay que encender las luces', 'Il faut… : hay que + infinitif', [
      ['Hay que encender las luces.', 'Il faut allumer les lumières.', 'paloma', ['Hay que encender']],
      ['En Nochevieja hay que comer doce uvas.', 'Le soir du 31, il faut manger douze raisins.', 'nacho', ['hay que comer']],
      ['Hay que esperar las campanadas.', 'Il faut attendre les coups de cloche.', 'rosa', ['Hay que esperar']],
      ['Para ganar un premio, hay que comprar un número.', 'Pour gagner un prix, il faut acheter un numéro.', 'paloma', ['hay que comprar']],
    ], 'Para decir que algo es necesario para todos, usamos hay que + infinitivo: hay que encender, hay que esperar. «Hay que» no cambia nunca.',
    'Pour dire que quelque chose est nécessaire pour tout le monde, on utilise hay que + infinitif : hay que encender, hay que esperar. « Hay que » ne change jamais.',
    "« Hay que + infinitif » = il faut + infinitif. C'est une obligation générale, impersonnelle, pour tout le monde (il n'y a pas de personne précise). Cette expression ne se conjugue pas : on dit toujours « hay que », jamais « tengo que » dans ce sens-là. C'est le « hay » de « hay un libro » (il y a) suivi de « que » + infinitif. Exemples : « Hay que ser puntual » (il faut être ponctuel), « Hay que comer doce uvas ». Pour une obligation qui concerne une personne précise (moi, toi, elle), on utilise « tener que » (carte suivante). Pour la négation : « no hay que » = il ne faut pas.",
    { encabezado: ['Expresión', 'Significado'], filas: [['hay que comer', 'il faut manger'], ['hay que esperar', 'il faut attendre'], ['no hay que gritar', 'il ne faut pas crier'], ['hay que ayudar', 'il faut aider']] }),
    G('g_tener_que', 'Tengo que comprar regalos', 'Je dois… : tener que + infinitif', [
      ['Tengo que comprar los regalos.', 'Je dois acheter les cadeaux.', 'viajero', ['Tengo que comprar']],
      ['Tienes que probar el turrón.', 'Tu dois goûter le turrón.', 'chema', ['Tienes que probar']],
      ['Marina tiene que ayudar a Chema.', 'Marina doit aider Chema.', 'nacho', ['tiene que ayudar']],
      ['Tenemos que estar en la Puerta del Sol a medianoche.', 'Nous devons être à la Puerta del Sol à minuit.', 'paloma', ['Tenemos que estar']],
    ], 'Para una obligación personal usamos tener que + infinitivo: tengo que, tienes que, tiene que, tenemos que… El verbo «tener» cambia (tengo, tienes, tiene), «que» no.',
    'Pour une obligation personnelle, on utilise tener que + infinitif : tengo que, tienes que, tiene que, tenemos que… Le verbe « tener » change (tengo, tienes, tiene), « que » ne change pas.',
    "« Tener que + infinitif » = devoir + infinitif, pour une personne précise : tengo que estudiar (je dois étudier), Marina tiene que ayudar (Marina doit aider). On conjugue « tener » (c'est un verbe à diphtongue irrégulier : tengo, tienes, tiene, tenemos, tenéis, tienen) et « que » + infinitif restent. Tu connais déjà « tener » pour l'âge (tengo doce años) ; ne confonds pas « tengo que ir » (je dois y aller) et « voy a ir » (je vais y aller). Différence avec « hay que » : « hay que » est général (il faut, pour tout le monde), « tener que » concerne une personne (je dois, tu dois). Le « que » est obligatoire : « tengo estudiar » est faux. Avec « mañana » (demain), on parle d'une obligation à venir : « mañana tengo que comprar un regalo ».",
    { encabezado: ['Pronombre', 'tener que + comprar'], filas: [['yo', 'tengo que comprar'], ['tú', 'tienes que comprar'], ['él / ella', 'tiene que comprar'], ['nosotros', 'tenemos que comprar'], ['vosotros', 'tenéis que comprar'], ['ellos / ellas', 'tienen que comprar']] }),
  ];

  // ───────────── Cinemáticas ─────────────
  const intro = cine('u06-intro', 'intro', 'Capítulo 6 · ¡Feliz Navidad! · Madrid', [
    P(3, "La carte du monde en papel picado : la ligne dorée remonte la côte espagnole et rejoint Madrid, zoom sur la ville de nuit ; carte-titre « Capítulo 6 · ¡Feliz Navidad! · Madrid ».", [L(N, 'Capítulo seis: ¡feliz Navidad!', 'Chapitre six : joyeux Noël !')], { rotulo: 'Capítulo 6 · ¡Feliz Navidad! · Madrid', camara: 'zoom avant progressif' }),
    P(5, "Madrid de nuit en décembre : la Gran Vía illuminée, la Puerta del Sol et son sapin, le marché de Noël de la Plaza Mayor avec ses stands de crèches, des enfants en écharpe, une brume de froid.", [L(N, 'Madrid de noche. En diciembre, la ciudad brilla con miles de luces.', 'Madrid de nuit. En décembre, la ville brille de milliers de lumières.'), L(N, 'Pero esta noche… algo no funciona.', 'Mais cette nuit… quelque chose ne va pas.')], { camara: 'travelling lent dans la rue illuminée' }),
  ]);
  const historia = cine('u06-historia', 'historia', 'Madrid a oscuras', [
    P(7, "Plaza Mayor, marché de Noël : les lumières sont éteintes, les stands à peine éclairés par des bougies. Nacho arrive en trottinette devant Álex, Marina et le Quetzal.", [
      L('nacho', '¡Hola otra vez, viajeros! ¡Madrid está a oscuras! Las luces de Navidad están apagadas.', 'Salut encore, voyageurs ! Madrid est dans le noir ! Les lumières de Noël sont éteintes.'),
      L('marina', '¿A oscuras? ¡Pero si es Navidad!', 'Dans le noir ? Mais c’est Noël !'),
    ], { personajes: ['nacho', 'marina', 'quetzal', 'viajero'], camara: 'plan large puis champ / contre-champ' }),
    P(7, "Le stand de Rosa, la churrera : de la vapeur, des churros dorés, personne dans la file. Rosa tend des tasses de chocolat chaud.", [
      L('rosa', 'Hace mucho frío y no hay luces. Mis churros no se venden. Tomad un chocolate caliente.', 'Il fait très froid et il n’y a pas de lumières. Mes churros ne se vendent pas. Prenez un chocolat chaud.'),
      L('nacho', 'Y las campanadas no suenan. ¡Sin campanadas, no hay Nochevieja!', 'Et les coups de cloche ne sonnent pas. Sans coups de cloche, pas de Nochevieja !'),
    ], { personajes: ['rosa', 'nacho'], camara: 'plan moyen sur le stand, buée des tasses' }),
    P(7, "Au centre de la place, un immense sapin éteint. Une ombre noire éteint une à une les dernières guirlandes. Paloma, la vendeuse de loterie, serre ses billets contre elle.", [
      L('sombra', 'Sin luces, no hay fiesta. Sin ruido, no hay Navidad. Silencio…', 'Sans lumières, pas de fête. Sans bruit, pas de Noël. Silence…'),
      L('paloma', '¡Esa Sombra se lleva hasta mis villancicos! Chicos, hay que encender las luces.', 'Cette Sombra emporte même mes chants de Noël ! Les enfants, il faut allumer les lumières.'),
    ], { personajes: ['sombra', 'paloma'], musica: 'tension douce, boîte à musique et guitare' }),
    P(7, "En haut du sapin, l’étoile est éteinte : un reflet vert y brille. Le Quetzal la montre du bec.", [
      L('quetzal', 'La pluma está en la estrella del gran árbol.', 'La plume est dans l’étoile du grand sapin.'),
      L('paloma', 'Entonces, ¡ayudadnos! Tenemos que encender todas las luces.', 'Alors, aidez-nous ! Nous devons allumer toutes les lumières.'),
    ], { personajes: ['quetzal', 'paloma'], musica: 'thème d’aventure, clochettes' }),
  ]);
  const capsula = cine('u06-capsula-uvas-reyes', 'capsula', 'Las doce uvas y los Reyes Magos', [
    P(4, "Style explainer, papier découpé : la Puerta del Sol de nuit, l’horloge de la Real Casa de Correos éclairée, la foule en bonnets et écharpes.", [L(N, 'Nochevieja, 31 de diciembre. En la Puerta del Sol de Madrid, miles de personas esperan las campanadas.', 'Nochevieja, 31 décembre. À la Puerta del Sol de Madrid, des milliers de personnes attendent les coups de cloche.')], { camara: 'plan fixe, animations de papier découpé' }),
    P(5, "Douze raisins dans un gobelet ; l’horloge sonne : un raisin disparaît à chaque coup, un compteur de 1 à 12 et douze mois du calendrier.", [L(N, 'A medianoche suenan doce campanadas. Con cada campanada, se come una uva: doce uvas, doce meses de suerte.', 'À minuit, douze coups de cloche sonnent. À chaque coup, on mange un raisin : douze raisins, douze mois de chance.')]),
    P(5, "Un grand théâtre et des enfants en uniforme qui chantent des chiffres ; boules de loterie qui tournent ; affiche « 22 de diciembre ».", [L(N, 'El 22 de diciembre es el sorteo de la Lotería de Navidad. Unos niños cantan los números y los premios. El primer premio se llama «el Gordo».', 'Le 22 décembre a lieu le tirage de la Loterie de Noël. Des enfants chantent les numéros et les prix. Le premier prix s’appelle « el Gordo » (« le Gros »).')]),
    P(5, "Une cabalgata dans la nuit : trois rois sur des chars, chameaux en carton, bonbons lancés à la foule ; calendrier « 5 de enero ».", [L(N, 'El cinco de enero hay cabalgatas en muchas ciudades. Los Reyes Magos, Melchor, Gaspar y Baltasar, llegan con regalos.', 'Le cinq janvier, il y a des défilés dans de nombreuses villes. Les Rois mages, Melchor, Gaspar et Baltasar, arrivent avec des cadeaux.')]),
    P(5, "Des chaussures alignées devant une porte, des lettres adressées aux Rois, puis un roscón coupé : une petite figurine et une fève sèche apparaissent dans la mie.", [L(N, 'El seis de enero se come el roscón de Reyes. Dentro hay una sorpresa y un haba. ¡Quien encuentra el haba paga el roscón!', 'Le six janvier, on mange le roscón des Rois. À l’intérieur, il y a une surprise et une fève. Celui qui trouve la fève paie le roscón !')]),
  ]);
  const pluma = cine('u06-pluma', 'pluma', 'Sexta pluma', [
    P(3, "Toutes les lumières de Madrid s’allument d’un coup ; l’étoile du sapin s’ouvre et une plume verte tombe doucement dans la main d’Álex. Les douze coups résonnent.", [L('paloma', '¡Las luces! ¡Las campanadas! ¡Feliz Navidad, viajeros!', 'Les lumières ! Les coups de cloche ! Joyeux Noël, voyageurs !')], { personajes: ['paloma', 'nacho', 'rosa'] }),
    P(3, "Le Quetzal volète autour du sapin, ses plumes brillent comme des guirlandes.", [L('quetzal', 'Seis plumas. ¡Mis alas brillan como las luces!', 'Six plumes. Mes ailes brillent comme les lumières !')], { personajes: ['quetzal'] }),
    P(2, "Don Ignacio en hologramme, en short et sous un parasol, ce qui fait rire Marina ; la carte bascule vers l’hémisphère sud.", [L('ignacio', 'La siguiente pluma está en Buenos Aires. Allí, en enero, ¡es verano!', 'La prochaine plume est à Buenos Aires. Là-bas, en janvier, c’est l’été !')], { personajes: ['ignacio'] }),
  ]);

  // ───────────── Misiones ─────────────
  const quests = [];

  // 1 — Cinemática
  quests.push(quest('u06', 1, 'cinematica', 'Madrid a oscuras', '🌃',
    ['nacho', '¡Bienvenidos otra vez a Madrid! Pero esta noche… no hay luces.', 'Bienvenue encore à Madrid ! Mais cette nuit… il n’y a pas de lumières.'],
    'Retour à Madrid, de nuit et en hiver : tu retrouves Nacho et Rosa, et tu découvres que la Sombra a éteint les lumières de Noël.', ['escuchar', 'cultura', 'hablar'], 10, [
      intro,
      tf('Madrid es la capital de España.', true, N, { tr: 'Madrid est la capitale de l’Espagne.' }),
      tf('En Madrid hace mucho calor en diciembre.', false, N, { tr: 'À Madrid, il fait très chaud en décembre.' }),
      historia,
      flash('abrigo', 'bufanda'),
      flash('encender', 'apagar', 'ayudar', 'cortar', 'tomar', 'rapido', 'cuidado'),
      lcT('¡Madrid está a oscuras! Las luces de Navidad están apagadas.', 'nacho', ['La ciudad no tiene luz esta noche.', 'Las luces están más bonitas que nunca.', 'Nacho tiene frío y necesita una bufanda.'], 0),
      lcT('Hace mucho frío y no hay luces. Mis churros no se venden.', 'rosa', ['Rosa tiene problemas con su negocio esta noche.', 'Rosa tiene mucho calor y muchos clientes.', 'Rosa vende zapatos de Navidad.'], 0),
      tf('Rosa vende churros en Madrid.', true, N, { tr: 'Rosa vend des churros à Madrid.' }),
      dlg('nacho', '¡Hola otra vez, viajeros! ¿Qué tal?', 'Salut encore, voyageurs ! Ça va ?', [
        ['¡Hola, Nacho! Estoy bien, gracias. ¿Y tú?', 1, 'Yo, un poco preocupado, pero contento de veros.', 'Moi, un peu inquiet, mais content de vous voir.', 'Salut, Nacho ! Je vais bien, merci. Et toi ?'],
        ['Son las doce en punto.', 0, 'Ya, pero yo te pregunto qué tal estás.', 'Oui, mais moi je te demande comment tu vas.', 'Il est douze heures pile.'],
        ['Me llamo Madrid.', 0, '¿Tú te llamas Madrid? ¡Como mi ciudad!', 'Toi, tu t’appelles Madrid ? Comme ma ville !', 'Je m’appelle Madrid.'],
      ]),
      dlg('rosa', '¿Tenéis frío, chicos?', 'Vous avez froid, les enfants ?', [
        ['Sí, tenemos mucho frío.', 1, 'Pues tomad este chocolate caliente.', 'Alors prenez ce chocolat chaud.', 'Oui, nous avons très froid.'],
        ['Sí, somos frío.', 0, 'Con «frío» usamos «tener»: «tenemos frío».', 'Avec « frío », on utilise « tener » : « tenemos frío ».', 'Oui, nous sommes froid.'],
        ['No, hace sed.', 0, 'No, hace frío. La sed es otra cosa.', 'Non, il fait froid. La soif, c’est autre chose.', 'Non, il fait soif.'],
      ]),
      reord('Madrid está a oscuras esta noche.', 'nacho', { tr: 'Madrid est dans le noir cette nuit.' }),
      speak('Hola, Nacho. Me llamo Álex y tengo frío.', 'viajero', { tr: 'Salut, Nacho. Je m’appelle Álex et j’ai froid. (dis ton prénom)', nombre: 'Álex', hechizo: ['Hechizo del abrigo', 'Una bufanda caliente aparece alrededor de tu cuello'] }),
    ]));

  // 2 — Las fiestas
  quests.push(quest('u06', 2, 'vocabulario', 'Las fiestas de invierno', '🎄',
    ['paloma', '¡Feliz Navidad, chicos! Aquí hay muchas fiestas en pocas semanas.', 'Joyeux Noël, les enfants ! Ici, il y a beaucoup de fêtes en quelques semaines.'],
    'Les fêtes d’hiver en Espagne (Navidad, Nochebuena, Nochevieja, Reyes) et leur vocabulaire ; les dates de décembre-janvier ; tu parles de TES fêtes.', ['leer', 'escuchar', 'hablar', 'escribir'], 15, [
      flash('navidad', 'nochebuena', 'nochevieja', 'ano_nuevo', 'reyes_magos', 'cabalgata', 'feliz'),
      flash('arbol_navidad', 'estrella', 'luces', 'villancico', 'campanadas', 'uva', 'belen'),
      match(['arbol_navidad', 'estrella', 'luces', 'campanadas', 'uva', 'villancico']),
      lcV('uva', ['uva', 'estrella', 'campanadas']),
      lcT('La Nochebuena es el veinticuatro de diciembre.', 'paloma', ['24/12', '25/12', '31/12'], 0),
      lcT('Nochevieja es el treinta y uno de diciembre.', 'chema', ['1/1', '24/12', '31/12'], 2),
      lcT('Los Reyes Magos traen los regalos el seis de enero.', 'paloma', ['6/1', '5/12', '1/1'], 0),
      fill('En ___ comemos doce uvas.', 'Nochevieja', 'nacho', { opts: ['Nochevieja', 'Nochebuena', 'cabalgata'], tr: 'Le soir du 31, nous mangeons douze raisins.' }),
      fill('El veinticuatro de diciembre es ___.', 'Nochebuena', 'paloma', { opts: ['Nochebuena', 'Nochevieja', 'Año Nuevo'], tr: 'Le vingt-quatre décembre, c’est Nochebuena.' }),
      fill('¡Feliz ___!', 'Navidad', 'rosa', { opts: ['Navidad', 'cabalgata', 'estrella'], tr: 'Joyeux Noël !' }),
      tf('La cabalgata de Reyes es en agosto.', false, N, { tr: 'La cabalgata de Reyes est en août.', expl: ['Es el cinco de enero, por la noche.', 'Elle a lieu le cinq janvier, le soir.'] }),
      dlg('paloma', '¡Feliz Navidad, chicos! ¿Qué día es Nochebuena?', 'Joyeux Noël, les enfants ! Quel jour est Nochebuena ?', [
        ['Es el veinticuatro de diciembre.', 1, '¡Exacto! Esa noche cenamos en familia.', 'Exact ! Ce soir-là, nous dînons en famille.', 'C’est le vingt-quatre décembre.'],
        ['Es el treinta y uno de diciembre.', 0, 'Ese día es Nochevieja, no Nochebuena.', 'Ce jour-là, c’est Nochevieja, pas Nochebuena.', 'C’est le trente et un décembre.'],
        ['Es el seis de enero.', 0, 'El seis de enero es el día de los Reyes Magos.', 'Le six janvier, c’est le jour des Rois mages.', 'C’est le six janvier.'],
      ]),
      speak('¡Feliz Navidad!', 'viajero', { libre: 'Navidad', es: 'Escucha y felicita a alguien.', fr: 'Écoute et félicite : change « Navidad » (por ejemplo « ¡Feliz Año Nuevo! » ou « ¡Feliz cumpleaños! »).', tr: 'Joyeux Noël ! (change la fête)', hechizo: ['Hechizo del deseo', 'Luces de colores bailan sobre tu cabeza'] }),
      writeFree('En Navidad como ___ con ___. Mi regalo favorito es ___.', [
        { id: 'comida', pista: 'Que manges-tu à Noël ? (turrón, marisco, pavo, pollo, chocolate…)', tipo: 'texto' },
        { id: 'con', pista: 'Avec qui ? (mi familia, mis abuelos, mis amigos…)', tipo: 'texto' },
        { id: 'regalo', pista: 'Ton cadeau préféré, avec son article (un libro, una guitarra, un balón…)', tipo: 'texto' },
      ], 'En Navidad como turrón con mi familia. Mi regalo favorito es un libro.', 'À Noël, je mange du turrón avec ma famille. Mon cadeau préféré est un livre.', 'viajero', C('Escribe cómo celebras la Navidad.', 'Écris comment tu fêtes Noël.')),
    ]));

  // 3 — La pastelería de Chema
  quests.push(quest('u06', 3, 'dialogo', 'La pastelería de Chema', '🥐',
    ['chema', 'Buenas noches. En diciembre trabajo de noche: tengo roscones, turrones y mucho chocolate.', 'Bonsoir. En décembre, je travaille de nuit : j’ai des roscones, des turrones et beaucoup de chocolat.'],
    'Les douceurs et plats de Noël (turrón, roscón, marisco, churros, chocolate), et « hace frío / tengo frío » ; tu commandes et tu comprends un menu de Nochebuena.', ['hablar', 'leer', 'escuchar'], 14, [
      flash('roscon', 'turron', 'marisco', 'churros', 'chocolate_nav', 'dulce_nav', 'hace_frio'),
      match(['roscon', 'turron', 'marisco', 'churros', 'chocolate_nav', 'uva']),
      lcV('churros', ['roscon', 'churros', 'turron']),
      dlg('chema', 'Buenas noches. ¿Qué queréis? Tengo roscón, turrón y chocolate caliente.', 'Bonsoir. Que voulez-vous ? J’ai du roscón, du turrón et du chocolat chaud.', [
        ['Quiero un chocolate caliente, por favor.', 1, '¡Marchando! Con este frío, es lo mejor.', 'C’est parti ! Avec ce froid, c’est ce qu’il y a de mieux.', 'Je veux un chocolat chaud, s’il vous plaît.'],
        ['Quiero una bufanda, por favor.', 0, 'Esto es una pastelería, no una tienda de ropa.', 'Ici, c’est une pâtisserie, pas un magasin de vêtements.', 'Je veux une écharpe, s’il vous plaît.'],
        ['Tengo turrón de doce años.', 0, 'Ja, ja. Entonces ya está muy duro.', 'Ha, ha. Alors il est déjà très dur.', 'J’ai du turrón de douze ans.'],
      ]),
      dlg('rosa', '¿Queréis churros con el chocolate?', 'Vous voulez des churros avec le chocolat ?', [
        ['Sí, queremos churros con chocolate.', 1, '¡Perfecto! Los churros de Rosa son los mejores.', 'Parfait ! Les churros de Rosa sont les meilleurs.', 'Oui, nous voulons des churros avec du chocolat.'],
        ['No, gracias, hace calor.', 0, '¿Calor? ¡Si hace mucho frío!', 'Chaud ? Mais il fait très froid !', 'Non, merci, il fait chaud.'],
        ['Sí, quiero ir a churros.', 0, 'Ir a churros… no. Mejor: «quiero churros».', 'Aller à churros… non. Mieux : « quiero churros ».', 'Oui, je veux aller à churros.'],
      ]),
      lcT('En Nochebuena mucha gente cena marisco con la familia.', 'chema', ['Es una cena especial en casa con platos del mar.', 'Es un desayuno de playa con amigos.', 'Es una merienda de turrón y chocolate.'], 0),
      read('En Navidad, en España, comemos muchos dulces. El turrón es un dulce de almendras y miel. También hay roscón, polvorones y mazapán. En Nochebuena, muchas familias cenan marisco o cordero. Después de la cena, todos cantan villancicos.', 'chema',
        'À Noël, en Espagne, nous mangeons beaucoup de sucreries. Le turrón est une sucrerie aux amandes et au miel. Il y a aussi du roscón, des polvorones (petits sablés) et du mazapán (massepain). À Nochebuena, beaucoup de familles dînent de fruits de mer ou d’agneau. Après le dîner, tout le monde chante des chants de Noël.', [
          ['¿Con qué se hace el turrón?', 'Avec quoi fait-on le turrón ?', ['Con almendras y miel.', 'Con arroz y pollo.', 'Con tomate y pan.'], 0],
          ['¿Qué cenan muchas familias en Nochebuena?', 'Que dînent beaucoup de familles à Nochebuena ?', ['Marisco o cordero.', 'Solo ensalada.', 'Churros con chocolate.'], 0],
          ['¿Qué hacen después de la cena?', 'Que font-ils après le dîner ?', ['Cantan villancicos.', 'Duermen la siesta.', 'Van al colegio.'], 0],
        ]),
      fill('Tengo mucho ___: necesito un abrigo.', 'frío', 'nacho', { opts: ['frío', 'calor', 'hambre'], tr: 'J’ai très froid : j’ai besoin d’un manteau.' }),
      fill('Hoy ___ mucho frío en Madrid.', 'hace', 'rosa', { opts: ['hace', 'tiene', 'está'], tr: 'Aujourd’hui, il fait très froid à Madrid. (météo → hacer)' }),
      fill('Para beber, un ___ caliente.', 'chocolate', 'chema', { opts: ['chocolate', 'turrón', 'roscón'], tr: 'Pour boire, un chocolat chaud.' }),
      tf('En España, el roscón de Reyes se come el veinticinco de diciembre.', false, N, { tr: 'En Espagne, le roscón des Rois se mange le vingt-cinq décembre.', expl: ['Se come el seis de enero (y a veces el cinco por la noche).', 'On le mange le six janvier (et parfois le soir du cinq).'] }),
      reord('Quiero chocolate caliente y churros.', 'viajero', { tr: 'Je veux du chocolat chaud et des churros.' }),
      speak('Quiero un turrón, por favor.', 'viajero', { libre: 'turrón', es: 'Escucha y pide algo en la pastelería.', fr: 'Écoute et demande ce que TU veux (un roscón, un chocolate, un zumo…). Change seulement « turrón » (garde « un »).', tr: 'Je veux un turrón, s’il vous plaît. (change le mot)', hechizo: ['Hechizo del dulce', 'Una lluvia de azúcar cae sobre la pastelería'] }),
      dict('Hace mucho frío esta noche.', 'rosa', { acept: ['hace mucho frío esta noche'] }),
    ]));

  // 4 — Forja : imperativo
  quests.push(quest('u06', 4, 'forja', 'La Forja: el imperativo', '⚒️',
    ['quetzal', '¡Mira! ¡Abre! ¡Canta! Ordenes. ¡Forja conmigo!', 'Regarde ! Ouvre ! Chante ! Des ordres. Forge avec moi !'],
    'L’impératif affirmatif : la forme « él » pour tú (mira, come, abre), -d pour vosotros (mirad), et les irréguliers à connaître (ven, pon, di, ve, enciende, prueba).', ['escribir', 'leer', 'hablar'], 15, [
      flash('mirar', 'cantar', 'poner', 'venir', 'decir', 'abrir', 'probar_nav'),
      gram('g_imperativo'),
      fill('___ las luces, Nacho.', 'Mira', 'paloma', { opts: ['Mira', 'Miras', 'Mirar'], tr: 'Regarde les lumières, Nacho.' }),
      fill('___ tu regalo, por favor.', 'Abre', 'chema', { opts: ['Abre', 'Abres', 'Abrir'], tr: 'Ouvre ton cadeau, s’il te plaît.' }),
      fill('Chicos, ___ aquí con nosotros.', 'venid', 'paloma', { opts: ['venid', 'vienen', 'vengo'], tr: 'Les enfants, venez ici avec nous. (vosotros : venir → venid)' }),
      gram('g_imperativo_irr'),
      fill('___ aquí, Marina.', 'Ven', 'nacho', { opts: ['Ven', 'Viene', 'Venir'], tr: 'Viens ici, Marina.' }),
      fill('___ «feliz Navidad», Álex.', 'Di', 'rosa', { opts: ['Di', 'Dice', 'Decir'], tr: 'Dis « joyeux Noël », Álex.' }),
      fill('___ la mesa para la cena.', 'Pon', 'chema', { opts: ['Pon', 'Pone', 'Poner'], tr: 'Mets la table pour le dîner.' }),
      fill('___ las luces, por favor.', 'Enciende', 'paloma', { opts: ['Enciende', 'Encende', 'Encender'], tr: 'Allume les lumières, s’il te plaît. (encender → enciende : diphtongue)' }),
      fill('___ el turrón, está muy rico.', 'Prueba', 'chema', { opts: ['Prueba', 'Probar', 'Pruebo'], tr: 'Goûte le turrón, il est très bon. (probar → prueba)' }),
      lcT('Chicos, mirad las luces y cantad con nosotros.', 'paloma', ['Paloma da dos órdenes a los chicos.', 'Paloma hace una pregunta a los chicos.', 'Paloma habla de un regalo.'], 0),
      dlg('chema', 'Corta el roscón, por favor. Yo tengo las manos ocupadas.', 'Coupe le roscón, s’il te plaît. Moi, j’ai les mains prises.', [
        ['Vale, ahora corto el roscón.', 1, '¡Gracias! Cuidado con el cuchillo.', 'Merci ! Fais attention au couteau.', 'D’accord, je coupe le roscón maintenant.'],
        ['Vale, soy un roscón.', 0, '¿Un roscón? Entonces te corto yo a ti.', 'Un roscón ? Alors c’est moi qui te coupe.', 'D’accord, je suis un roscón.'],
        ['Vale, el roscón es azul.', 0, 'Mmm… no es azul. Y tienes que cortarlo.', 'Mmm… il n’est pas bleu. Et tu dois le couper.', 'D’accord, le roscón est bleu.'],
      ]),
      reord('Enciende las luces del árbol de Navidad.', 'paloma', { tr: 'Allume les lumières du sapin de Noël.' }),
      speak('Ven aquí y mira el árbol.', 'viajero', { tr: 'Viens ici et regarde le sapin.', hechizo: ['Hechizo de la orden', 'Las luces del árbol obedecen a tu voz'] }),
    ]));

  // 5 — Forja : hay que / tener que
  quests.push(quest('u06', 5, 'forja', 'La Forja: hay que y tener que', '⚒️',
    ['quetzal', 'Hay que encender. Tengo que ayudar. ¡Forja!', 'Il faut allumer. Je dois aider. Forge !'],
    'Deux façons de dire une obligation : hay que + infinitif (général : « il faut ») et tener que + infinitif (personnel : « je dois ») ; conjugaison de tener (tengo, tienes, tiene…).', ['escribir', 'leer', 'hablar'], 15, [
      flash('hay_que', 'tener_que'),
      gram('g_hay_que'),
      gram('g_tener_que'),
      conj('tener', 'yo', 'teng', 'o', ['o', 'es', 'e'], 'viajero', { tr: 'Moi, j’ai…' }),
      conj('tener', 'tú', 'tien', 'es', ['o', 'es', 'e'], 'paloma', { tr: 'Toi, tu as…' }),
      conj('tener', 'nosotros', 'ten', 'emos', ['emos', 'éis', 'en'], 'marina', { tr: 'Nous, nous avons…' }),
      conj('tener', 'ellos', 'tien', 'en', ['emos', 'éis', 'en'], 'nacho', { tr: 'Eux, ils ont…' }),
      fill('___ que encender las luces.', 'Hay', 'paloma', { opts: ['Hay', 'Hace', 'Está'], tr: 'Il faut allumer les lumières. (obligation générale)' }),
      fill('Tengo que ___ los regalos.', 'comprar', 'viajero', { opts: ['comprar', 'compro', 'comprando'], tr: 'Je dois acheter les cadeaux. (tener que + infinitif)' }),
      fill('Marina ___ que ayudar a Chema.', 'tiene', 'nacho', { opts: ['tiene', 'tengo', 'hay'], tr: 'Marina doit aider Chema. (obligation personnelle)' }),
      fill('Tenemos que estar en la Puerta del Sol ___ las doce.', 'a', 'paloma', { opts: ['a', 'en', 'de'], tr: 'Nous devons être à la Puerta del Sol à douze heures.' }),
      lcT('Para ganar un premio, hay que comprar un número.', 'paloma', ['Sin número, no hay premio.', 'El premio siempre es un regalo gratis.', 'Hay muchos premios en la cabalgata.'], 0),
      dlg('chema', '¿Podéis ayudarme? Tengo que preparar cien roscones para mañana.', 'Pouvez-vous m’aider ? Je dois préparer cent roscones pour demain.', [
        ['Claro, vamos a ayudarte.', 1, '¡Qué buenos sois! Tomad un delantal.', 'Que vous êtes gentils ! Prenez un tablier.', 'Bien sûr, nous allons t’aider.'],
        ['Claro, tengo cien roscones.', 0, '¿Tú tienes cien roscones? ¡Entonces ayúdame a comerlos!', 'Toi, tu as cent roscones ? Alors aide-moi à les manger !', 'Bien sûr, j’ai cent roscones.'],
        ['No, soy un roscón.', 0, '¿Un roscón? Entonces no puedes ayudar.', 'Un roscón ? Alors tu ne peux pas aider.', 'Non, je suis un roscón.'],
      ]),
      speak('Tengo que estudiar esta tarde.', 'viajero', { libre: 'estudiar', es: 'Escucha y di qué tienes que hacer TÚ.', fr: 'Écoute et dis ce que TU dois faire (esperar a mi madre, ayudar en casa, estudiar español…). Change seulement « estudiar » (jusqu’à trois mots).', tr: 'Je dois étudier cet après-midi. (dis ce que tu dois faire)', hechizo: ['Hechizo del deber', 'Una lista de tareas flota en el aire y se borra sola'] }),
      writeFree('Hoy tengo que ___ y mañana tengo que ___.', [
        { id: 'hoy', pista: 'Que dois-tu faire aujourd’hui ? Un verbe à l’infinitif (estudiar, ayudar, comprar un regalo…)', tipo: 'texto' },
        { id: 'manana', pista: 'Que dois-tu faire demain ? Un verbe à l’infinitif (levantarme temprano, ir al colegio…)', tipo: 'texto' },
      ], 'Hoy tengo que estudiar y mañana tengo que comprar un regalo.', 'Aujourd’hui, je dois étudier et demain, je dois acheter un cadeau.', 'viajero', C('Escribe lo que tienes que hacer.', 'Écris ce que tu dois faire.')),
    ]));

  // 6 — Cartas y regalos
  quests.push(quest('u06', 6, 'lectura', 'Cartas, regalos y lotería', '🎁',
    ['paloma', 'Los niños escriben cartas a los Reyes Magos. ¡Y yo vendo lotería para tener suerte!', 'Les enfants écrivent des lettres aux Rois mages. Et moi, je vends de la loterie pour avoir de la chance !'],
    'Les cadeaux, la lettre aux Rois mages, la loterie de Noël ; compréhension d’une lettre, et tu écris TA lettre aux Rois.', ['leer', 'escribir', 'hablar', 'escuchar'], 13, [
      flash('regalo', 'carta', 'loteria', 'premio', 'numero', 'comprar', 'todos'),
      lcV('regalo', ['regalo', 'carta', 'estrella']),
      read('Queridos Reyes Magos: Me llamo Lola y tengo seis años. Quiero una bici rosa, un libro de gatos y un patinete. También quiero un regalo para mi gato Churro. Gracias. Besos. Lola.', 'paloma',
        'Chers Rois mages : Je m’appelle Lola et j’ai six ans. Je veux un vélo rose, un livre de chats et une trottinette. Je veux aussi un cadeau pour mon chat Churro. Merci. Bisous. Lola. (« bici » = bicicleta, vélo ; « patinete » = trottinette)', [
          ['¿Cuántos años tiene Lola?', 'Quel âge a Lola ?', ['Seis.', 'Doce.', 'Diez.'], 0],
          ['¿Para quién quiere Lola otro regalo?', 'Pour qui Lola veut-elle un autre cadeau ?', ['Para su gato Churro.', 'Para su abuela.', 'Para Nacho.'], 0],
          ['¿A quién escribe Lola?', 'À qui Lola écrit-elle ?', ['A los Reyes Magos.', 'A Papá Noel.', 'A su profesora.'], 0],
        ]),
      lcT('Mis padres compran los regalos y yo escribo una carta a los Reyes.', 'nacho', ['Nacho pide cosas a los Reyes Magos por escrito.', 'Nacho abre sus regalos el veinticuatro.', 'Nacho no escribe cartas nunca.'], 0),
      lcT('El primer premio de la Lotería de Navidad se llama el Gordo.', 'paloma', ['El premio más importante tiene un nombre especial.', 'El premio más pequeño es un turrón.', 'No hay premios en la Lotería de Navidad.'], 0),
      fill('Escribo una ___ a los Reyes Magos.', 'carta', 'nacho', { opts: ['carta', 'estrella', 'cabalgata'], tr: 'J’écris une lettre aux Rois mages.' }),
      fill('Los Reyes Magos traen un ___ para cada niño.', 'regalo', 'paloma', { opts: ['regalo', 'villancico', 'turrón'], tr: 'Les Rois mages apportent un cadeau pour chaque enfant.' }),
      tf('Los Reyes Magos llegan el veinticinco de diciembre.', false, N, { tr: 'Les Rois mages arrivent le vingt-cinq décembre.', expl: ['Llegan el cinco de enero por la noche, y los regalos están el seis por la mañana.', 'Ils arrivent le soir du cinq janvier, et les cadeaux sont là le matin du six.'] }),
      tf('Los niños dejan los zapatos para recibir regalos.', true, N, { tr: 'Les enfants laissent leurs chaussures pour recevoir des cadeaux.' }),
      dlg('paloma', '¿Quieres un número de lotería? ¡Este año toca el Gordo!', 'Tu veux un numéro de loterie ? Cette année, le Gordo va tomber ici ! (« tocar » = être gagné, à la loterie)', [
        ['Sí, quiero un número, por favor.', 1, '¡Aquí tienes! Seguro que tienes suerte.', 'Tiens ! Tu vas sûrement avoir de la chance.', 'Oui, je veux un numéro, s’il vous plaît.'],
        ['Sí, compro la lotería de la cabalgata.', 0, 'La lotería no es de la cabalgata. Pero gracias.', 'La loterie n’est pas celle du défilé. Mais merci.', 'Oui, j’achète la loterie du défilé.'],
        ['No, soy un número.', 0, '¡Ja, ja! Entonces tienes premio seguro.', 'Ha, ha ! Alors tu as un lot assuré.', 'Non, je suis un numéro.'],
      ]),
      speak('Quiero un libro para Navidad.', 'viajero', { libre: 'un libro', es: 'Escucha y di qué quieres TÚ para Navidad.', fr: 'Écoute et dis ce que TU veux pour Noël (una guitarra, un balón, unas zapatillas…). Change « un libro » (avec son article).', tr: 'Je veux un livre pour Noël. (dis ton cadeau)', hechizo: ['Hechizo del regalo', 'Un paquete con un lazo dorado aparece a tus pies'] }),
      writeFree('Queridos Reyes Magos: Me llamo ___. Quiero ___ y ___. ¡Feliz Navidad!', [
        { id: 'nombre', pista: 'Ton prénom', tipo: 'texto' },
        { id: 'regalo1', pista: 'Un premier cadeau, avec son article (un libro, una guitarra…)', tipo: 'texto' },
        { id: 'regalo2', pista: 'Un deuxième cadeau, avec son article (un balón, unas zapatillas…)', tipo: 'texto' },
      ], 'Queridos Reyes Magos: Me llamo Álex. Quiero un libro y una guitarra. ¡Feliz Navidad!', 'Chers Rois mages : Je m’appelle Álex. Je veux un livre et une guitare. Joyeux Noël !', 'viajero', C('Escribe tu carta a los Reyes Magos.', 'Écris ta lettre aux Rois mages.')),
      dict('Escribo una carta a los Reyes Magos.', 'nacho', { acept: ['escribo una carta a los reyes magos'] }),
    ]));

  // 7 — Cultura
  quests.push(quest('u06', 7, 'cultura', 'Nochevieja y Reyes Magos', '🍇',
    ['paloma', 'En Madrid, en Nochevieja, ¡hay que comer rápido las doce uvas!', 'À Madrid, à Nochevieja, il faut manger vite les douze raisins !'],
    'Les traditions espagnoles de fin d’année : les douze raisins à la Puerta del Sol, la Loterie de Noël du 22 décembre, la cabalgata et les Reyes Magos du 6 janvier, le roscón ; puis tu parles de TA fête préférée.', ['cultura', 'leer', 'escribir', 'hablar'], 14, [
      capsula,
      tf('En Nochevieja se comen doce uvas con las campanadas.', true, N, { tr: 'À Nochevieja, on mange douze raisins avec les coups de cloche.' }),
      tf('La Lotería de Navidad es el seis de enero.', false, N, { tr: 'La Loterie de Noël est le six janvier.', expl: ['Es el veintidós de diciembre.', 'Elle a lieu le vingt-deux décembre.'] }),
      tf('Quien encuentra el haba paga el roscón.', true, N, { tr: 'Celui qui trouve la fève paie le roscón.' }),
      read('En España, la noche del treinta y uno de diciembre, muchas familias comen doce uvas con las doce campanadas de medianoche. Una uva por cada campanada: doce uvas, doce meses de suerte. En Madrid, miles de personas esperan las campanadas en la Puerta del Sol. ¡Hay que comer rápido!', 'paloma',
        'En Espagne, la nuit du trente et un décembre, beaucoup de familles mangent douze raisins avec les douze coups de cloche de minuit. Un raisin par coup de cloche : douze raisins, douze mois de chance. À Madrid, des milliers de personnes attendent les coups de cloche à la Puerta del Sol. Il faut manger vite !', [
          ['¿Cuántas uvas comen las familias?', 'Combien de raisins les familles mangent-elles ?', ['Doce.', 'Veinte.', 'Cien.'], 0],
          ['¿Dónde esperan las campanadas miles de personas en Madrid?', 'Où des milliers de personnes attendent-elles les coups de cloche à Madrid ?', ['En la Puerta del Sol.', 'En el colegio.', 'En un museo.'], 0],
          ['¿Qué significan las doce uvas?', 'Que signifient les douze raisins ?', ['Doce meses de suerte.', 'Doce amigos.', 'Doce regalos.'], 0],
        ]),
      read('El cinco de enero hay cabalgatas en muchas ciudades. Los Reyes Magos, Melchor, Gaspar y Baltasar, llegan con regalos para los niños. Por la noche, los niños dejan sus zapatos y se acuestan temprano. El seis de enero por la mañana, ¡hay regalos! Se come el roscón de Reyes. Dentro hay una sorpresa y un haba: quien encuentra el haba paga el roscón.', 'chema',
        'Le cinq janvier, il y a des défilés dans beaucoup de villes. Les Rois mages, Melchor, Gaspar et Baltasar, arrivent avec des cadeaux pour les enfants. Le soir, les enfants laissent leurs chaussures et se couchent tôt. Le matin du six janvier, il y a des cadeaux ! On mange le roscón des Rois. À l’intérieur, il y a une surprise et une fève : celui qui trouve la fève paie le roscón.', [
          ['¿Cómo se llaman los tres Reyes Magos?', 'Comment s’appellent les trois Rois mages ?', ['Melchor, Gaspar y Baltasar.', 'Marcos, Pablo y Pedro.', 'Nacho, Chema y Rosa.'], 0],
          ['¿Qué hacen los niños por la noche?', 'Que font les enfants le soir ?', ['Dejan los zapatos y se acuestan temprano.', 'Cantan en la Puerta del Sol.', 'Comen doce uvas.'], 0],
          ['¿Qué pasa si encuentras el haba?', 'Que se passe-t-il si tu trouves la fève ?', ['Pagas el roscón.', 'Ganas la lotería.', 'Abres los regalos antes.'], 0],
        ]),
      lcT('El veintidós de diciembre, unos niños cantan los números de la lotería.', 'paloma', ['Hay una fiesta de la suerte en diciembre con voces de niños.', 'Los niños venden la lotería en el colegio.', 'En diciembre nadie compra lotería.'], 0),
      dlg('chema', '¿Cuántas uvas comemos en Nochevieja?', 'Combien de raisins mangeons-nous à Nochevieja ?', [
        ['Comemos doce uvas.', 1, '¡Exacto! Una con cada campanada.', 'Exact ! Une avec chaque coup de cloche.', 'Nous mangeons douze raisins.'],
        ['Comemos cien uvas.', 0, '¡Cien uvas! Te vas a poner malo.', 'Cent raisins ! Tu vas être malade.', 'Nous mangeons cent raisins.'],
        ['Comemos una paella.', 0, 'La paella es de Valencia, no de Nochevieja.', 'La paella est de Valence, pas de Nochevieja.', 'Nous mangeons une paella.'],
      ]),
      dlg('rosa', '¿Cuándo llegan los Reyes Magos?', 'Quand arrivent les Rois mages ?', [
        ['Llegan el cinco de enero, por la noche.', 1, '¡Eso es! Y el seis hay regalos.', 'Voilà ! Et le six, il y a des cadeaux.', 'Ils arrivent le cinq janvier, le soir.'],
        ['Llegan el veinticinco de agosto.', 0, '¿En agosto? ¡Con ese calor no hay roscón!', 'En août ? Avec cette chaleur, pas de roscón !', 'Ils arrivent le vingt-cinq août.'],
        ['Llegan el treinta y uno de diciembre.', 0, 'Esa noche son las uvas, no los Reyes.', 'Cette nuit-là, ce sont les raisins, pas les Rois.', 'Ils arrivent le trente et un décembre.'],
      ]),
      fill('Para el desayuno del seis de enero, comemos el ___ de Reyes.', 'roscón', 'chema', { opts: ['roscón', 'árbol', 'villancico'], tr: 'Pour le petit-déjeuner du six janvier, nous mangeons le roscón des Rois.' }),
      fill('Con cada campanada comemos una ___.', 'uva', 'paloma', { opts: ['uva', 'carta', 'luz'], tr: 'À chaque coup de cloche, nous mangeons un raisin.' }),
      writeFree('Mi fiesta favorita es ___. Celebro con ___. Comemos ___.', [
        { id: 'fiesta', pista: 'Ta fête préférée (Navidad, mi cumpleaños, Nochevieja…)', tipo: 'texto' },
        { id: 'con', pista: 'Avec qui la fêtes-tu ? (mi familia, mis amigos, mis abuelos…)', tipo: 'texto' },
        { id: 'comida', pista: 'Que manges-tu ? (turrón, pizza, pastel, marisco…)', tipo: 'texto' },
      ], 'Mi fiesta favorita es Navidad. Celebro con mi familia. Comemos turrón.', 'Ma fête préférée est Noël. Je la fête avec ma famille. Nous mangeons du turrón.', 'viajero', C('Escribe sobre tu fiesta favorita.', 'Écris sur ta fête préférée.')),
      speak('Mi fiesta favorita es la Navidad.', 'viajero', { libre: 'Navidad', es: 'Escucha y di cuál es TU fiesta favorita.', fr: 'Écoute et dis quelle est TA fête préférée. Change « Navidad » (mi cumpleaños, Nochevieja…). Garde la structure.', tr: 'Ma fête préférée est Noël. (dis la tienne)', hechizo: ['Hechizo de la fiesta', 'Confeti de colores cae sobre la Puerta del Sol'] }),
      dict('Hay doce campanadas a medianoche.', 'paloma', { acept: ['hay doce campanadas a medianoche'] }),
    ]));

  // 8 — Desafío
  quests.push(quest('u06', 8, 'desafio', 'Las luces de la Sombra', '🌟',
    ['sombra', 'Sin luces, no hay fiesta. Sin fiesta, no hay palabras. Yo apago Madrid.', 'Sans lumières, pas de fête. Sans fête, pas de mots. Moi, j’éteins Madrid.'],
    'Boss de Madrid : révision mixte des unités 1 à 6 (présentation, famille, description, heure, ir a, impératif, hay que / tener que, fêtes) pour rallumer les lumières de Noël.', ['escuchar', 'hablar', 'leer', 'escribir'], 15, [
      dlg('sombra', 'Las luces están apagadas. ¿Qué hay que hacer?', 'Les lumières sont éteintes. Que faut-il faire ?', [
        ['Hay que encender las luces.', 1, '¡Grr! Una luz más…', 'Grr ! Une lumière de plus…', 'Il faut allumer les lumières.'],
        ['Hay que dormir la siesta.', 0, 'Eso no enciende nada.', 'Ça n’allume rien.', 'Il faut faire la sieste.'],
        ['Tengo luces de doce años.', 0, 'No es una respuesta. ¡Otra vez!', 'Ce n’est pas une réponse. Encore une fois !', 'J’ai des lumières de douze ans.'],
      ]),
      dlg('sombra', 'Dime una orden para encender el árbol.', 'Dis-moi un ordre pour allumer le sapin.', [
        ['Enciende las luces, por favor.', 1, '¡Aaah! El árbol brilla otra vez…', 'Aaah ! Le sapin brille de nouveau…', 'Allume les lumières, s’il te plaît.'],
        ['Enciendes las luces ahora.', 0, 'Eso no es una orden, es una afirmación.', 'Ça, ce n’est pas un ordre, c’est une affirmation.', 'Tu allumes les lumières maintenant.'],
        ['Encender luces yo.', 0, 'Eso no tiene sentido. ¡Otra vez!', 'Ça n’a aucun sens. Encore une fois !', 'Allumer lumières moi.'],
      ]),
      lcT('Son las doce menos cinco.', 'sombra', ['11:55', '12:05', '12:55'], 0),
      lcT('Mi tía es alta, rubia y lleva un abrigo rojo.', 'rosa', ['La tía no es baja y su pelo no es oscuro.', 'La tía tiene el pelo largo y negro.', 'La tía lleva un vestido azul.'], 0),
      lcT('Mis abuelos viven en Sevilla y mi tío Rafa es cocinero.', 'marina', ['Un familiar de la persona trabaja con la comida.', 'Todos los abuelos son cocineros.', 'La familia vive en México.'], 0),
      match(['regalo', 'carta', 'chocolate_nav', 'abrigo', 'bufanda', 'marisco']),
      fill('Marina ___ que comprar un regalo para su abuela.', 'tiene', 'viajero', { opts: ['tiene', 'hay', 'va'], tr: 'Marina doit acheter un cadeau pour sa grand-mère.' }),
      fill('Mañana vamos ___ cenar con los abuelos.', 'a', 'marina', { opts: ['a', 'al', 'en'], tr: 'Demain, nous allons dîner avec les grands-parents.' }),
      fill('Mi hermano ___ muchos regalos.', 'quiere', 'nacho', { opts: ['quiere', 'quieres', 'queremos'], tr: 'Mon frère veut beaucoup de cadeaux.' }),
      fill('¡___ aquí, Marina! Mira las luces.', 'Ven', 'nacho', { opts: ['Ven', 'Viene', 'Vienes'], tr: 'Viens ici, Marina ! Regarde les lumières.' }),
      conj('tener', 'tú', 'tien', 'es', ['o', 'es', 'e'], 'paloma', { tr: 'Toi, tu as…' }),
      read('Hola, soy Nacho. Tengo trece años y vivo en Madrid. En Nochebuena ceno con mi familia a las diez. Después abrimos algunos regalos. En Nochevieja como las doce uvas con las campanadas. El seis de enero me levanto temprano para ver los regalos de los Reyes.', 'nacho',
        'Salut, c’est Nacho. J’ai treize ans et j’habite à Madrid. À Nochebuena, je dîne avec ma famille à dix heures. Ensuite, nous ouvrons quelques cadeaux. À Nochevieja, je mange les douze raisins avec les coups de cloche. Le six janvier, je me lève tôt pour voir les cadeaux des Rois.', [
          ['¿A qué hora cena Nacho en Nochebuena?', 'À quelle heure Nacho dîne-t-il à Nochebuena ?', ['A las diez.', 'A las seis.', 'A las tres.'], 0],
          ['¿Qué come Nacho en Nochevieja?', 'Que mange Nacho à Nochevieja ?', ['Doce uvas.', 'Paella.', 'Churros.'], 0],
          ['¿Cuándo se levanta temprano?', 'Quand se lève-t-il tôt ?', ['El seis de enero.', 'El veinticinco de agosto.', 'Todos los domingos.'], 0],
        ]),
      reord('Hay que encender las luces del árbol.', 'paloma', { tr: 'Il faut allumer les lumières du sapin.' }),
      speak('Hola, me llamo Álex. ¡Feliz Navidad!', 'viajero', { tr: 'Salut, je m’appelle Álex. Joyeux Noël ! (dis ton prénom)', nombre: 'Álex', hechizo: ['Hechizo final', '¡Madrid brilla otra vez con todas sus luces!'] }),
      pluma,
    ], { jefe: { personaje: 'sombra', vidas: 10 } }));

  return {
    id: 'u06', numero: 6, titulo: '¡Feliz Navidad!', lugar: 'Madrid de noche', emoji: '🎄', ejes: [4], periodo: 'dic-ene',
    objetivos: [
      { es: 'Conocer las fiestas de invierno: Navidad, Nochebuena, Nochevieja, Reyes Magos.', fr: 'Connaître les fêtes d’hiver : Noël, Nochebuena, Nochevieja, les Rois mages.' },
      { es: 'Dar órdenes sencillas con el imperativo: mira, abre, ven, pon, di.', fr: 'Donner des ordres simples avec l’impératif : mira, abre, ven, pon, di.' },
      { es: 'Decir lo que hay que hacer (hay que) y lo que tengo que hacer (tener que).', fr: 'Dire ce qu’il faut faire (hay que) et ce que je dois faire (tener que).' },
      { es: 'Hablar de comida y de regalos de Navidad, y escribir una carta a los Reyes Magos.', fr: 'Parler de nourriture et de cadeaux de Noël, et écrire une lettre aux Rois mages.' },
      { es: 'Desear felices fiestas y hablar de mi fiesta favorita.', fr: 'Souhaiter de bonnes fêtes et parler de ma fête préférée.' },
      { es: 'Conocer las doce uvas, la Lotería de Navidad, la cabalgata y el roscón.', fr: 'Connaître les douze raisins, la Loterie de Noël, la cabalgata et le roscón.' },
    ],
    vocab, gramatica, quests,
    pluma: { numero: 6, nombre: 'Pluma de las Luces', descripcion: L('quetzal', 'Seis plumas. Las luces vuelven… ¡y mis alas brillan!', 'Six plumes. Les lumières reviennent… et mes ailes brillent !') },
  };
}
