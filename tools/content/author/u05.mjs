// Unidad 5 — ¿Qué hora es? (Valencia · Ciudad de las Artes y las Ciencias)
// Axe 2 (le quotidien : lieux, rythmes). PNJ valenciens (voix castillanes) : Neus, Vicent, Amparo.
// Grammaire : ser pour l'heure, ir, ir a + infinitif, diphtongue (querer, poder), estar + gérondif, verbes pronominaux de routine.
import { W, G, quest, flash, match, lcV, lcI, lcT as lcT0, dict, fill, reord, conj, dlg, read as read0, speak, tf, gram, writeFree, cine, P, L, C, NARR } from './lib.mjs';

// Varie la position de la bonne réponse (0, 1, 2…) des écoutes et des lectures pour qu'elle ne soit pas devinable.
let rot = 1;
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
  const ilu = (s) => ({ ilustracion: s });

  // ───────────── Vocabulario (54) ─────────────
  const vocab = [
    // la hora
    W('hora', 'hora', 'heure (¿qué hora es? = quelle heure est-il ?) ; aussi : moment', '🕒', 'hora', '¿A qué hora es la comida?', 'À quelle heure est le déjeuner ?', { genero: 'f', plural: 'horas' }),
    W('reloj', 'reloj', 'horloge, montre (tout ce qui donne l’heure)', '🕰️', 'hora', 'El reloj de Neus está parado.', 'La montre de Neus est arrêtée.', { genero: 'm', plural: 'relojes', exVoz: 'neus' }),
    W('minuto', 'minuto', 'minute', '⏱️', 'hora', 'Faltan cinco minutos para las dos.', 'Il manque cinq minutes avant deux heures.', { genero: 'm', plural: 'minutos' }),
    W('en_punto', 'en punto', 'pile (les trois heures pile)', '📌', 'hora', 'Son las seis en punto.', 'Il est six heures pile.'),
    W('y_media', 'y media', 'et demie (son las tres y media = 3 h 30)', '🌓', 'hora', 'Son las cuatro y media.', 'Il est quatre heures et demie.'),
    W('cuarto', 'cuarto', 'quart (y cuarto = et quart ; menos cuarto = moins le quart)', '🍰', 'hora', 'Es la una y cuarto.', 'Il est une heure et quart.', { genero: 'm', plural: 'cuartos' }),
    W('menos_h', 'menos', 'moins (son las dos menos diez = 1 h 50)', '➖', 'hora', 'Son las dos menos diez.', 'Il est deux heures moins dix.'),
    W('veinticinco', 'veinticinco', 'vingt-cinq (de 21 à 29, un seul mot : veintiuno, veintidós… veinticinco)', '🔢', 'hora', 'Son las cinco y veinticinco.', 'Il est cinq heures vingt-cinq.'),
    W('mediodia', 'mediodía', 'midi ; attention : en Espagne, « a mediodía » désigne souvent l’heure du déjeuner, vers 14 h', '☀️', 'hora', 'A mediodía comemos paella.', 'Au déjeuner (vers 14 h), nous mangeons de la paella.', { genero: 'm' }),
    W('medianoche', 'medianoche', 'minuit (24 h)', '🌑', 'hora', 'A medianoche todos duermen.', 'À minuit, tout le monde dort.', { genero: 'f' }),
    W('manana', 'mañana', 'matin (la mañana) ; aussi : demain (adverbe)', '🌅', 'hora', 'Por la mañana desayuno leche.', 'Le matin, je prends du lait au petit-déjeuner.', { genero: 'f' }),
    W('tarde', 'tarde', 'après-midi (la tarde) ; aussi : tard. En Espagne, la tarde dure jusqu’à environ 20 h-21 h', '🌇', 'hora', 'Por la tarde estudio con Marina.', 'L’après-midi, j’étudie avec Marina.', { genero: 'f' }),
    W('noche', 'noche', 'nuit, soir (quand il fait nuit)', '🌙', 'hora', 'Por la noche cenamos en casa.', 'Le soir, nous dînons à la maison.', { genero: 'f', plural: 'noches' }),
    W('temprano', 'temprano', 'tôt', '🐓', 'hora', 'Me levanto temprano.', 'Je me lève tôt.'),
    W('siempre', 'siempre', 'toujours', '♾️', 'hora', 'Siempre desayuno a las ocho.', 'Je prends toujours mon petit-déjeuner à huit heures.'),
    W('despues', 'después', 'après, ensuite', '➡️', 'hora', 'Después del colegio, juego en el patio.', 'Après l’école, je joue dans la cour.'),
    W('ahora', 'ahora', 'maintenant', '📍', 'hora', 'Ahora estoy comiendo.', 'En ce moment, je suis en train de manger.'),
    W('que_hora_es', '¿qué hora es?', 'quelle heure est-il ?', '🕐', 'hora', '—¿Qué hora es? —Son las tres.', '— Quelle heure est-il ? — Il est trois heures.'),
    W('a_que_hora', '¿a qué hora?', 'à quelle heure ?', '🕑', 'hora', '¿A qué hora empieza la clase?', 'À quelle heure commence le cours ?'),
    // rutina y verbos
    W('levantarse', 'levantarse', 'se lever (me levanto = je me lève)', '🌄', 'rutina', 'Me levanto a las siete y media.', 'Je me lève à sept heures et demie.'),
    W('acostarse', 'acostarse', 'se coucher (me acuesto = je me couche)', '🛌', 'rutina', 'Me acuesto a las diez.', 'Je me couche à dix heures.'),
    W('desayunar', 'desayunar', 'prendre le petit-déjeuner', '🥐', 'rutina', 'Desayuno leche y una tostada.', 'Je prends du lait et une tartine au petit-déjeuner.'),
    W('cenar', 'cenar', 'dîner', '🍴', 'rutina', 'Cenamos a las nueve.', 'Nous dînons à neuf heures.'),
    W('dormir', 'dormir', 'dormir (duermo = je dors)', '😴', 'rutina', 'Duermo nueve horas.', 'Je dors neuf heures.'),
    W('empezar', 'empezar', 'commencer (empieza = il commence)', '▶️', 'rutina', 'La clase empieza a las nueve.', 'Le cours commence à neuf heures.'),
    W('terminar', 'terminar', 'finir, terminer', '🏁', 'rutina', 'El cole termina a las dos.', 'L’école finit à deux heures.'),
    W('llegar', 'llegar', 'arriver', '🏃', 'rutina', 'Llego al cole a las nueve menos diez.', 'J’arrive à l’école à neuf heures moins dix.'),
    W('ir', 'ir', 'aller (voy, vas, va, vamos, vais, van)', '🚶', 'verbos', 'Voy al cole a las ocho y media.', 'Je vais à l’école à huit heures et demie.'),
    W('querer', 'querer', 'vouloir ; aimer bien (quiero = je veux)', '💛', 'verbos', 'Quiero una horchata, por favor.', 'Je veux une horchata, s’il vous plaît.'),
    W('poder', 'poder', 'pouvoir (puedo = je peux)', '💪', 'verbos', '¿Puedo comer ahora?', 'Je peux manger maintenant ?'),
    W('siesta', 'siesta', 'sieste', '😪', 'rutina', 'Mi abuelo duerme la siesta.', 'Mon grand-père fait la sieste.', { genero: 'f', plural: 'siestas', exVoz: 'neus' }),
    W('estudiar', 'estudiar', 'étudier, réviser', '📚', 'rutina', 'Por la tarde estudio con Neus.', 'L’après-midi, j’étudie avec Neus.'),
    W('preparar', 'preparar', 'préparer', '🧑‍🍳', 'rutina', 'Vicent prepara la paella.', 'Vicent prépare la paella.', { exVoz: 'vicent' }),
    W('esperar', 'esperar', 'attendre ; aussi : espérer', '⏳', 'rutina', 'Esperamos la cena.', 'Nous attendons le dîner.'),
    // comidas
    W('desayuno', 'desayuno', 'petit-déjeuner', '🍞', 'comidas', 'El desayuno es a las ocho.', 'Le petit-déjeuner est à huit heures.', { genero: 'm', plural: 'desayunos' }),
    W('merienda', 'merienda', 'goûter (vers 17 h)', '🍪', 'comidas', 'La merienda es a las cinco.', 'Le goûter est à cinq heures.', { genero: 'f', plural: 'meriendas' }),
    W('cena', 'cena', 'dîner (repas du soir)', '🌃', 'comidas', 'La cena es a las nueve.', 'Le dîner est à neuf heures.', { genero: 'f', plural: 'cenas' }),
    W('leche', 'leche', 'lait', '🥛', 'comidas', 'Bebo leche por la mañana.', 'Je bois du lait le matin.', { genero: 'f' }),
    W('tostada', 'tostada', 'tartine grillée (en Espagne, souvent avec huile d’olive et tomate)', '🍞', 'comidas', 'Desayuno una tostada con tomate.', 'Au petit-déjeuner, je mange une tartine à la tomate.', { genero: 'f', plural: 'tostadas' }),
    W('zumo', 'zumo', 'jus de fruit (en Amérique latine : « jugo »)', '🧃', 'comidas', 'Un zumo de naranja, por favor.', 'Un jus d’orange, s’il vous plaît.', { genero: 'm', plural: 'zumos' }),
    W('fruta', 'fruta', 'fruit(s)', '🍎', 'comidas', 'De postre, fruta.', 'En dessert, des fruits.', { genero: 'f', plural: 'frutas' }),
    W('bocadillo', 'bocadillo', 'sandwich (dans une demi-baguette), souvent à la récré', '🥖', 'comidas', 'A las once, como un bocadillo.', 'À onze heures, je mange un sandwich.', { genero: 'm', plural: 'bocadillos' }),
    W('ensalada', 'ensalada', 'salade', '🥗', 'comidas', 'Una ensalada para empezar.', 'Une salade pour commencer.', { genero: 'f', plural: 'ensaladas' }),
    W('arroz', 'arroz', 'riz', '🍚', 'comidas', 'En Valencia hay mucho arroz.', 'À Valence (la région), il y a beaucoup de riz.', { genero: 'm' }),
    W('pollo', 'pollo', 'poulet', '🍗', 'comidas', 'La paella lleva pollo.', 'La paella contient du poulet.', { genero: 'm' }),
    W('paella', 'paella', 'paella : plat de riz de Valence, cuit dans une grande poêle', '🥘', 'comidas', 'La paella es de Valencia.', 'La paella vient de Valence.', { genero: 'f', plural: 'paellas', exVoz: 'vicent' }),
    W('horchata', 'horchata', 'horchata : boisson fraîche et sucrée, à base de chufas (souchet), spécialité de Valence', null, 'comidas', 'La horchata está muy fría.', 'L’horchata est très fraîche.', { genero: 'f', ilustracion: 'Un grand verre d’horchata blanche et glacée, avec des fartons (petits gâteaux allongés) à côté', exVoz: 'amparo', voz: 'amparo' }),
    W('tortilla', 'tortilla', 'omelette (tortilla de patatas = omelette aux pommes de terre). Attention : au Mexique, « tortilla » = galette de maïs', '🍳', 'comidas', 'La tortilla de patatas es muy española.', 'La tortilla de pommes de terre est très espagnole.', { genero: 'f', plural: 'tortillas' }),
    W('hambre', 'hambre', 'faim (tener hambre = avoir faim)', '🤤', 'comidas', 'Tengo mucha hambre.', 'J’ai très faim.', { genero: 'f' }),
    W('sed', 'sed', 'soif (tener sed = avoir soif)', '🥵', 'comidas', 'Tengo sed: quiero agua.', 'J’ai soif : je veux de l’eau.', { genero: 'f' }),
    // Valencia
    W('falla', 'falla', 'falla : monument géant en carton-pâte et en bois, brûlé à la fin de la fête (les Fallas)', null, 'valencia', 'Las fallas son monumentos enormes.', 'Les fallas sont des monuments énormes.', { genero: 'f', plural: 'fallas', ilustracion: 'Un monument géant très coloré, avec des personnages caricaturaux en carton-pâte, au milieu d’une place' }),
    W('mascleta', 'mascletà', 'mascletà : concert de pétards qui retentit à 14 h pendant les Fallas (mot valencien)', '🎆', 'valencia', 'La mascletà suena a las dos de la tarde.', 'La mascletà retentit à deux heures de l’après-midi.', { genero: 'f', exVoz: 'neus' }),
    W('fuego', 'fuego', 'feu', '🔥', 'valencia', 'La paella se hace con fuego de leña.', 'La paella se prépare sur un feu de bois.', { genero: 'm', plural: 'fuegos' }),
    W('acuario', 'acuario', 'aquarium', '🐠', 'valencia', 'El Oceanogràfic es un acuario muy grande.', 'L’Oceanogràfic est un très grand aquarium.', { genero: 'm', plural: 'acuarios' }),
  ];

  // ───────────── Gramática ─────────────
  const gramatica = [
    G('g_hora', 'Son las tres y media', 'Dire l’heure : ser + las…', [
      ['Es la una.', 'Il est une heure.', 'neus', ['Es la una']],
      ['Son las dos y cuarto.', 'Il est deux heures et quart.', 'neus', ['Son las dos', 'y cuarto']],
      ['Son las ocho menos diez.', 'Il est huit heures moins dix.', 'marina', ['menos diez']],
      ['Son las doce en punto.', 'Il est douze heures pile.', 'viajero', ['en punto']],
      ['—¿A qué hora es la comida? —A las dos.', '— À quelle heure est le déjeuner ? — À deux heures.', 'amparo', ['¿A qué hora', 'A las dos']],
    ], 'Para decir la hora usamos «ser»: Es la una. Son las dos, las tres… Después añadimos y cuarto, y media, menos cuarto, menos diez. Para preguntar a qué hora pasa algo: ¿a qué hora? — A las dos.',
    'Pour dire l’heure, on utilise « ser » : Es la una. Son las dos, las tres… Puis on ajoute y cuarto, y media, menos cuarto, menos diez. Pour demander à quelle heure quelque chose a lieu : ¿a qué hora ? — A las dos.',
    "On dit l'heure avec SER (jamais « tener » ni « estar »). Une seule heure : « Es la una » (singulier, féminin). À partir de deux : « Son las dos, las tres… » (pluriel). Les minutes se disent avec « y » après l'heure jusqu'à la demie (y cinco, y diez, y cuarto, y veinte, y veinticinco, y media) et avec « menos » ensuite, en comptant ce qu'il reste avant l'heure suivante (las tres menos veinte = 2 h 40 ; las seis menos cuarto = 5 h 45). « En punto » = pile. Pour préciser le moment de la journée, on ajoute « de la mañana / de la tarde / de la noche » (dans la conversation, on utilise surtout les heures de 1 à 12 : 15 h = las tres de la tarde ; les heures de 13 à 24 servent pour les horaires écrits, les trains, la radio). Midi et minuit ont leur nom : mediodía, medianoche. Pour demander l'heure : « ¿Qué hora es? ». Pour demander quand a lieu un événement : « ¿A qué hora…? » et on répond « a la una / a las dos… » (avec « a » devant l'heure).",
    { encabezado: ['Hora', 'Se dice'], filas: [['1:00', 'Es la una'], ['2:00', 'Son las dos'], ['3:15', 'Son las tres y cuarto'], ['4:30', 'Son las cuatro y media'], ['5:45', 'Son las seis menos cuarto'], ['7:10', 'Son las siete y diez'], ['8:50', 'Son las nueve menos diez']] }),
    G('g_rutina', 'Me levanto a las siete', 'Ma routine : me levanto, me acuesto…', [
      ['Me levanto a las siete y media.', 'Je me lève à sept heures et demie.', 'viajero', ['Me levanto']],
      ['Neus se levanta temprano.', 'Neus se lève tôt.', 'neus', ['se levanta']],
      ['Mis padres se acuestan a las once.', 'Mes parents se couchent à onze heures.', 'marina', ['se acuestan']],
      ['Desayuno leche, como a las dos y ceno a las nueve.', 'Je prends du lait au petit-déjeuner, je déjeune à deux heures et je dîne à neuf heures.', 'neus', ['Desayuno', 'como', 'ceno']],
    ], 'Con levantarse y acostarse usamos me, te, se… delante del verbo: me levanto, te levantas, se levanta. Con desayunar, comer y cenar no hay «me»: desayuno, como, ceno.',
    'Avec levantarse et acostarse, on met me, te, se… devant le verbe : me levanto, te levantas, se levanta. Avec desayunar, comer et cenar, il n’y a pas de « me » : desayuno, como, ceno.',
    "Levantarse (se lever) et acostarse (se coucher) sont des verbes pronominaux, comme en français (je me lève) : le pronom vient avant le verbe et change avec la personne (me, te, se, nos, os, se). Les terminaisons sont celles des verbes en -ar que tu connais (levanto, levantas, levanta…). Attention : acostarse change de voyelle (me acuesto, te acuestas, se acuesta, nos acostamos : voir la carte sur la diphtongue). Pour les repas, les verbes ne sont pas pronominaux : desayunar, comer (= déjeuner, le repas de midi en Espagne : « comer » et « la comida »), cenar. Heures de la routine : « a las siete » = à sept heures ; « por la mañana / por la tarde / por la noche » = le matin / l'après-midi / le soir.",
    { encabezado: ['Pronombre', 'levantarse', 'acostarse'], filas: [['yo', 'me levanto', 'me acuesto'], ['tú', 'te levantas', 'te acuestas'], ['él / ella', 'se levanta', 'se acuesta'], ['nosotros', 'nos levantamos', 'nos acostamos'], ['vosotros', 'os levantáis', 'os acostáis'], ['ellos / ellas', 'se levantan', 'se acuestan']] }),
    G('g_ir', 'Voy, vas, va…', 'Le verbe aller : ir', [
      ['Voy al cole a las ocho y media.', 'Je vais à l’école à huit heures et demie.', 'viajero', ['Voy al']],
      ['¿Adónde vas, Neus?', 'Où vas-tu, Neus ?', 'marina', ['vas']],
      ['Marina va a casa de su abuela.', 'Marina va chez sa grand-mère.', 'neus', ['va']],
      ['Vamos al museo de las ciencias.', 'Nous allons au musée des sciences.', 'neus', ['Vamos al']],
      ['Los valencianos van a la playa en verano.', 'Les Valenciens vont à la plage en été.', 'vicent', ['van']],
    ], 'El verbo «ir» es irregular: voy, vas, va, vamos, vais, van. Después de «ir» ponemos «a»: voy a casa. Con «el» decimos «al»: voy al cole. Para preguntar el lugar: ¿adónde?',
    'Le verbe « ir » est irrégulier : voy, vas, va, vamos, vais, van. Après « ir », on met « a » : voy a casa. Avec « el », on dit « al » : voy al cole. Pour demander le lieu : ¿adónde ?',
    "« Ir » (aller) est très irrégulier : il faut l'apprendre par cœur (voy, vas, va, vamos, vais, van). Il est toujours suivi de la préposition « a » : voy a Madrid, vamos a casa. A + el = AL (voy al cole), mais a + la reste « a la » (voy a la playa). Pour demander la destination : « ¿Adónde vas? » (où vas-tu ?). Pour demander l'origine on dirait « ¿de dónde vienes? ». Ne pas confondre avec « estar » : « estoy en Valencia » (je suis à Valence) / « voy a Valencia » (je vais à Valence). Prononciation : le v espagnol se prononce comme un b (« boy »).",
    { encabezado: ['Pronombre', 'ir'], filas: [['yo', 'voy'], ['tú', 'vas'], ['él / ella', 'va'], ['nosotros', 'vamos'], ['vosotros', 'vais'], ['ellos / ellas', 'van']] }),
    G('g_ir_a', 'Voy a comer paella', 'Le futur proche : ir a + infinitif', [
      ['Voy a comer paella.', 'Je vais manger de la paella.', 'viajero', ['Voy a comer']],
      ['Esta noche vamos a cenar con Vicent.', 'Ce soir, nous allons dîner avec Vicent.', 'neus', ['vamos a cenar']],
      ['¿Qué vas a beber?', 'Qu’est-ce que tu vas boire ?', 'amparo', ['vas a beber']],
      ['Neus va a estudiar después de la comida.', 'Neus va étudier après le déjeuner.', 'marina', ['va a estudiar']],
    ], 'Para hablar del futuro cercano usamos ir + a + infinitivo: voy a comer, vas a beber, va a estudiar. Es como «aller + infinitif» en francés.',
    'Pour parler du futur proche, on utilise ir + a + infinitif : voy a comer, vas a beber, va a estudiar. C’est exactement comme « aller + infinitif » en français.',
    "Ir a + infinitif = aller + infinitif : c'est le futur proche, le plus utilisé à l'oral pour parler de ce qu'on va faire (voy a cenar = je vais dîner). Le verbe « ir » se conjugue (voy, vas, va, vamos, vais, van), le « a » ne change jamais, et le deuxième verbe reste à l'infinitif (voy a comer, jamais « voy a como »). Des mots utiles pour le futur : hoy (aujourd'hui), mañana (demain), esta tarde (cet après-midi), esta noche (ce soir), después (après). Pour la négation, « no » se place avant « ir » : no voy a cenar.",
    { encabezado: ['Pronombre', 'ir a + comer'], filas: [['yo', 'voy a comer'], ['tú', 'vas a comer'], ['él / ella', 'va a comer'], ['nosotros', 'vamos a comer'], ['vosotros', 'vais a comer'], ['ellos / ellas', 'van a comer']] }),
    G('g_diptongo', 'Quiero, puedo, empiezo', 'Quand la voyelle change : e→ie, o→ue', [
      ['Quiero una horchata, por favor.', 'Je veux une horchata, s’il vous plaît.', 'viajero', ['Quiero']],
      ['¿Puedes esperar cinco minutos?', 'Peux-tu attendre cinq minutes ?', 'neus', ['Puedes']],
      ['La mascletà empieza a las dos.', 'La mascletà commence à deux heures.', 'neus', ['empieza']],
      ['Queremos comer ahora, pero no podemos.', 'Nous voulons manger maintenant, mais nous ne pouvons pas.', 'vicent', ['Queremos', 'podemos']],
      ['Mi abuelo duerme la siesta.', 'Mon grand-père fait la sieste.', 'neus', ['duerme']],
    ], 'En algunos verbos, la vocal de la raíz cambia: querer → quiero, poder → puedo, empezar → empiezo, dormir → duermo. Cambia con yo, tú, él y ellos. Con nosotros y vosotros, no cambia: queremos, podemos.',
    'Dans certains verbes, la voyelle du radical change : querer → quiero, poder → puedo, empezar → empiezo, dormir → duermo. Elle change avec yo, tú, él et ellos. Avec nosotros et vosotros, elle ne change pas : queremos, podemos.',
    "Certains verbes diphtonguent : la voyelle accentuée du radical devient ie (e → ie : querer → quiero, empezar → empiezo, preferir → prefiero ; tener → tienes, tiene, mais « yo tengo » est irrégulier) ou ue (o → ue : poder → puedo, dormir → duermo, acostarse → me acuesto). On parle de « verbes à botte » : si on entoure sur un tableau les formes qui changent (yo, tú, él, ellos), on dessine une botte. Nosotros et vosotros gardent le radical car l'accent tombe sur la terminaison (que-RE-mos, po-DÉIS) : pas de diphtongue. Les terminaisons restent régulières. Querer + infinitif = vouloir faire (quiero comer) ; poder + infinitif = pouvoir (¿puedo comer?) ; « ¿puedo…? » sert aussi à demander la permission, en français « je peux… ? ». Attention : « querer » à lui seul peut aussi vouloir dire « aimer » (quiero a mi abuela = j'aime ma grand-mère).",
    { encabezado: ['Pronombre', 'querer (e→ie)', 'poder (o→ue)'], filas: [['yo', 'quiero', 'puedo'], ['tú', 'quieres', 'puedes'], ['él / ella', 'quiere', 'puede'], ['nosotros', 'queremos', 'podemos'], ['vosotros', 'queréis', 'podéis'], ['ellos / ellas', 'quieren', 'pueden']] }),
    G('g_gerundio', 'Estoy comiendo', 'Ce que je fais en ce moment : estar + gérondif', [
      ['Vicent está preparando la paella.', 'Vicent est en train de préparer la paella.', 'neus', ['está preparando']],
      ['Ahora estoy comiendo, no puedo hablar.', 'En ce moment, je suis en train de manger, je ne peux pas parler.', 'viajero', ['estoy comiendo']],
      ['¿Qué estás leyendo?', 'Qu’est-ce que tu es en train de lire ?', 'marina', ['estás leyendo']],
      ['Estamos esperando la cena.', 'Nous attendons le dîner (en ce moment).', 'amparo', ['Estamos esperando']],
    ], 'Para decir lo que hago ahora mismo: estar + gerundio. Verbos en -ar: -ando (hablando). Verbos en -er / -ir: -iendo (comiendo, viviendo). Leer → leyendo.',
    'Pour dire ce que je fais en ce moment : estar + gérondif. Verbes en -ar : -ando (hablando). Verbes en -er / -ir : -iendo (comiendo, viviendo). Leer → leyendo.',
    "Estar + gerundio = être en train de + infinitif : l'action se passe MAINTENANT (estoy comiendo = je suis en train de manger). Le gérondif se forme avec le radical + -ando (verbes en -ar : hablar → hablando) ou -iendo (verbes en -er et en -ir : comer → comiendo, vivir → viviendo, escribir → escribiendo). Quand le radical se termine par une voyelle, le i devient y : leer → leyendo. Quelques verbes sont irréguliers (dormir → durmiendo, pedir → pidiendo) mais on ne les étudie pas encore. Pour une habitude, on garde le présent simple : « como a las dos » (je déjeune toujours à 2 h) ; « estoy comiendo » = en ce moment précis. Estar se conjugue (estoy, estás, está, estamos, estáis, están), le gérondif ne change jamais (pas de -s, pas d'accord).",
    { encabezado: ['Infinitivo', 'Gerundio'], filas: [['hablar', 'hablando'], ['esperar', 'esperando'], ['comer', 'comiendo'], ['escribir', 'escribiendo'], ['leer', 'leyendo']] }),
  ];

  // ───────────── Cinemáticas ─────────────
  const intro = cine('u05-intro', 'intro', 'Capítulo 5 · ¿Qué hora es? · Valencia', [
    P(3, "La carte du monde en papel picado : la ligne dorée quitte le Mexique, traverse l’océan et se pose sur la côte est de l’Espagne, zoom sur Valencia ; carte-titre « Capítulo 5 · ¿Qué hora es? · Valencia ».", [L(N, 'Capítulo cinco: ¿qué hora es?', 'Chapitre cinq : quelle heure est-il ?')], { rotulo: 'Capítulo 5 · ¿Qué hora es? · Valencia', camara: 'zoom avant progressif' }),
    P(5, "Valencia en plein soleil : les arches blanches de la Ciudad de las Artes y las Ciencias se reflètent dans les bassins turquoise, le dôme en forme d’œil de l’Hemisfèric, le Palau de les Arts, des oranges sur un étal au premier plan.", [L(N, 'Valencia. Una ciudad con mar, sol y mucha luz.', 'Valence. Une ville avec la mer, du soleil et beaucoup de lumière.'), L(N, 'Aquí la comida es a las dos y la cena es a las nueve.', 'Ici, le déjeuner est à deux heures et le dîner à neuf heures.')], { camara: 'travelling lent le long des bassins' }),
  ]);
  const historia = cine('u05-historia', 'historia', 'Los relojes parados', [
    P(7, "Esplanade de la Ciudad de las Artes à midi, bassins et arches blanches. Álex, Marina et le Quetzal arrivent. Neus, 12 ans, un réveil digital au poignet, court vers eux.", [
      L('neus', '¡Hola! Me llamo Neus. ¡Necesito ayuda! Todos los relojes de Valencia están parados.', 'Salut ! Je m’appelle Neus. J’ai besoin d’aide ! Toutes les horloges de Valence sont arrêtées.'),
      L('marina', '¿Parados? ¿Y qué hora es?', 'Arrêtées ? Et quelle heure est-il ?'),
    ], { personajes: ['neus', 'marina', 'quetzal', 'viajero'], camara: 'plan large puis champ / contre-champ' }),
    P(7, "Neus montre son réveil digital qui affiche 12:05, puis une grande horloge dont les aiguilles ne bougent plus. Vicent, le paellero, remue en vain une immense poêle sur son feu de bois.", [
      L('neus', 'Mi reloj dice las doce y cinco. Siempre las doce y cinco.', 'Ma montre indique midi cinq. Toujours midi cinq.'),
      L('vicent', 'Mi paella no termina nunca. Son las doce y cinco… ¡desde ayer!', 'Ma paella ne finit jamais. Il est midi cinq… depuis hier !'),
    ], { personajes: ['neus', 'vicent'], camara: 'plan moyen sur la poêle de paella, fumée immobile' }),
    P(7, "La grande horloge : une ombre noire s’étire sur son cadran. Tous les passants sont figés, la fumée de la paella est suspendue.", [
      L('sombra', 'Sin horas no hay rutina. Sin rutina no hay palabras.', 'Sans heures, pas de routine. Sans routine, pas de mots.'),
      L('quetzal', 'La Sombra. Siento una pluma dentro del reloj.', 'La Sombra. Je sens une plume à l’intérieur de l’horloge.'),
    ], { personajes: ['sombra', 'quetzal'], musica: 'tension douce, tic-tac lent et guitare' }),
    P(7, "Gros plan sur le cadran : un reflet vert derrière le verre. Neus tend son réveil à Álex.", [
      L('neus', 'Para mover las agujas, tenemos que decir bien la hora. ¿Me ayudáis?', 'Pour faire bouger les aiguilles, nous devons dire correctement l’heure. Vous m’aidez ? (« ayudáis » : vous aidez, forme « vosotros » d’Espagne)'),
      L('viajero', '¡Claro! ¡Vamos!', 'Bien sûr ! Allons-y !'),
    ], { personajes: ['neus', 'viajero'], musica: 'thème d’aventure, guitare et castagnettes' }),
  ]);
  const capsula = cine('u05-capsula-horarios', 'capsula', 'Los horarios españoles y Valencia', [
    P(4, "Style explainer, papier découpé : une carte de l’Europe avec l’Espagne et la France ; deux horloges affichent la même heure, une flèche rappelle que l’Espagne est plus à l’ouest.", [L(N, 'España está más al oeste que Francia, pero tiene la misma hora.', 'L’Espagne est plus à l’ouest que la France, mais elle a la même heure (sauf les îles Canaries : une heure de moins). (Le soleil se couche donc plus tard en Espagne : c’est une des raisons des horaires tardifs.)')], { camara: 'plan fixe, animations de papier découpé' }),
    P(5, "Une frise d’une journée avec quatre assiettes qui s’allument : 8 h, 14 h, 17 h, 21 h.", [L(N, 'El desayuno es a las ocho, la comida a las dos o las tres, la merienda a las cinco y la cena a las nueve o más tarde.', 'Le petit-déjeuner est à huit heures, le déjeuner à deux ou trois heures, le goûter à cinq heures et le dîner à neuf heures ou plus tard.')]),
    P(5, "Un cartable et une horloge : une petite scène d’école, des élèves qui sortent à 14 h ; plus loin, un grand-père qui s’endort dans un fauteuil.", [L(N, 'Muchos alumnos terminan las clases a las dos. La siesta existe, pero hoy muchos españoles no duermen la siesta todos los días.', 'Beaucoup d’élèves finissent les cours à deux heures. La sieste existe, mais aujourd’hui beaucoup d’Espagnols ne font pas la sieste tous les jours.')]),
    P(5, "La paella dorée dans sa grande poêle sur un feu de bois : riz, poulet, haricots verts, tomate. Un cadran indique 14:00.", [L(N, 'En Valencia, la paella es un plato de mediodía. Lleva arroz, pollo, judías verdes y tomate.', 'À Valence, la paella est un plat du midi. Elle contient du riz, du poulet, des haricots verts et de la tomate.')]),
    P(5, "Place de l’Ayuntamiento en fête : monuments colorés de papier mâché, nuages de fumée de la mascletà, le cadran de 14:00 clignote ; calendrier 15-19 de marzo.", [L(N, 'Y en marzo, del quince al diecinueve, son las fallas. Cada día, a las dos de la tarde, suena la mascletà.', 'Et en mars, du 15 au 19, ce sont les Fallas. Chaque jour, à deux heures de l’après-midi, retentit la mascletà.')]),
    P(5, "La dernière nuit, le 19 mars : les grands monuments s’embrasent dans la nuit, des milliers de personnes les regardent.", [L(N, 'La noche del diecinueve, las fallas se queman. ¡Hay mucho fuego!', 'La nuit du 19, les fallas sont brûlées. Il y a beaucoup de feu ! (la « cremà », la fin de la fête)')]),
  ]);
  const pluma = cine('u05-pluma', 'pluma', 'Quinta pluma', [
    P(3, "Les aiguilles de l’horloge se remettent en marche, la fumée de la paella monte, les passants repartent ; une plume verte tombe du cadran dans la main d’Álex.", [L('neus', '¡Los relojes funcionan otra vez! ¡Gracias!', 'Les horloges fonctionnent de nouveau ! Merci !')], { personajes: ['neus', 'vicent'] }),
    P(3, "Le Quetzal fait une boucle au-dessus des bassins, ses plumes brillent comme des vitraux.", [L('quetzal', 'Cinco plumas. ¡Ahora vuelo y hablo más!', 'Cinq plumes. Maintenant je vole et je parle plus !')], { personajes: ['quetzal'] }),
    P(2, "Don Ignacio apparaît en hologramme, couvert d’une écharpe ; sur la carte, des étoiles dorées s’allument sur Madrid.", [L('ignacio', 'La siguiente pluma está en Madrid, de noche. ¡Es Navidad!', 'La prochaine plume est à Madrid, de nuit. C’est Noël !')], { personajes: ['ignacio'] }),
  ]);

  // ───────────── Misiones ─────────────
  const quests = [];

  // 1 — Cinemática
  quests.push(quest('u05', 1, 'cinematica', 'Llegada a Valencia', '🏙️',
    ['neus', '¡Bienvenidos a Valencia! Soy Neus. Aquí todo tiene su hora.', 'Bienvenue à Valence ! Je suis Neus. Ici, tout a son heure.'],
    'Arrivée à Valence : tu rencontres Neus et Vicent, et tu découvres le problème des horloges arrêtées. Les PNJ parlent espagnol d’Espagne.', ['escuchar', 'cultura', 'hablar'], 10, [
      intro,
      tf('Valencia está en España.', true, N, { tr: 'Valence est en Espagne.' }),
      tf('Valencia está en México.', false, N, { tr: 'Valence est au Mexique.' }),
      historia,
      flash('que_hora_es', 'veinticinco'),
      lcT('Todos los relojes de Valencia están parados.', 'neus', ['Hay un problema con la hora en la ciudad.', 'Neus tiene un reloj nuevo y muy bonito.', 'Los relojes funcionan muy bien hoy.'], 0),
      lcT('Mi paella no está lista. Siempre son las doce y cinco.', 'vicent', ['El paellero no puede terminar su plato.', 'El paellero cena a las doce y cinco.', 'La comida de Vicent ya está en la mesa.'], 0),
      tf('Neus dice: «Todos los relojes están parados».', true, N, { tr: 'Neus dit : « Toutes les horloges sont arrêtées ».' }),
      dlg('neus', '¡Hola! Soy Neus. ¿Vosotros sois los viajeros?', 'Salut ! Je suis Neus. Vous êtes les voyageurs ? (« vosotros » = vous, en Espagne)', [
        ['Sí, yo soy Álex y ella es Marina.', 1, '¡Qué bien! Mucho gusto.', 'Super ! Enchantée.', 'Oui, moi c’est Álex et elle, c’est Marina.'],
        ['Son las doce y cinco.', 0, 'Sí, siempre las doce y cinco… pero yo pregunto quiénes sois.', 'Oui, toujours midi cinq… mais je demande qui vous êtes.', 'Il est midi cinq.'],
        ['Me llamo Valencia.', 0, '¿Te llamas Valencia? ¡Como mi ciudad!', 'Tu t’appelles Valence ? Comme ma ville !', 'Je m’appelle Valence.'],
      ]),
      dlg('vicent', 'Buenos días, chicos. ¿De dónde sois?', 'Bonjour, les jeunes. D’où êtes-vous ?', [
        ['Yo soy de París y Marina es de Sevilla.', 1, '¡Caramba! Venís de lejos. Aquí en Valencia hay buena paella.', 'Mince alors ! Vous venez de loin. Ici à Valence, il y a de la bonne paella.', 'Moi, je suis de Paris et Marina est de Séville.'],
        ['Tengo doce años y un reloj.', 0, 'Muy bien, pero ¿de dónde sois?', 'Très bien, mais d’où êtes-vous ?', 'J’ai douze ans et une montre.'],
        ['Soy una paella.', 0, 'Ja, ja. ¡Y yo soy un arroz!', 'Ha, ha. Et moi, je suis un riz !', 'Je suis une paella.'],
      ]),
      reord('Todos los relojes están parados.', 'neus', { tr: 'Toutes les horloges sont arrêtées.' }),
      speak('Hola, Neus. Me llamo Álex y estoy en Valencia.', 'viajero', { tr: 'Salut, Neus. Je m’appelle Álex et je suis à Valence. (dis ton prénom)', nombre: 'Álex', hechizo: ['Hechizo de la llegada', 'Las agujas de todos los relojes tiemblan'] }),
    ]));

  // 2 — La hora
  quests.push(quest('u05', 2, 'vocabulario', '¿Qué hora es?', '🕒',
    ['neus', 'Mira mi reloj. ¿Sabes decir la hora?', 'Regarde ma montre. Sais-tu dire l’heure ?'],
    'Dire l’heure avec ser : es la una, son las dos, y cuarto, y media, menos cuarto. À quelle heure ? → ¿a qué hora ? — a las…', ['leer', 'escuchar', 'hablar'], 15, [
      flash('hora', 'reloj', 'minuto', 'en_punto', 'y_media', 'cuarto', 'menos_h'),
      lcV('reloj', ['hora', 'reloj', 'minuto']),
      flash('mediodia', 'medianoche', 'manana', 'tarde', 'noche', 'temprano', 'a_que_hora'),
      match(['mediodia', 'medianoche', 'manana', 'tarde', 'noche', 'reloj']),
      gram('g_hora'),
      lcT('Son las cuatro y media.', 'neus', ['4:30', '4:15', '3:30'], 0),
      lcT('Es la una menos cuarto.', 'amparo', ['1:15', '12:45', '1:45'], 1),
      lcT('Son las ocho y diez de la tarde.', 'neus', ['8:10 por la mañana', '8:50 por la tarde', '8:10 por la tarde'], 2),
      fill('Son las tres ___.', 'y media', 'neus', { opts: ['y media', 'y medio', 'menos media'], tr: 'Il est trois heures et demie.' }),
      fill('___ la una y cuarto.', 'Es', 'amparo', { opts: ['Es', 'Son', 'Está'], tr: 'Il est une heure et quart. (une seule heure → singulier)' }),
      fill('Son las nueve menos ___.', 'cuarto', 'neus', { opts: ['cuarto', 'media', 'medio'], tr: 'Il est neuf heures moins le quart. (on ne dit jamais « menos media »)' }),
      reord('Son las dos y cuarto de la tarde.', 'neus', { tr: 'Il est deux heures et quart de l’après-midi.' }),
      dlg('neus', 'Mi reloj digital dice 4:45. ¿Qué hora es?', 'Ma montre digitale indique 4:45. Quelle heure est-il ?', [
        ['Son las cinco menos cuarto.', 1, '¡Perfecto! ¡Las agujas se mueven un poco!', 'Parfait ! Les aiguilles… bougent un peu !', 'Il est cinq heures moins le quart.'],
        ['Son las cuatro y cuarto.', 0, 'Mmm, y cuarto es 4:15. Piensa en «menos cuarto».', 'Mmm, « y cuarto » c’est 4:15. Pense à « menos cuarto ».', 'Il est quatre heures et quart.'],
        ['Es la una y media.', 0, 'No: mi reloj dice casi las cinco.', 'Non : ma montre indique presque cinq heures.', 'Il est une heure et demie.'],
      ]),
      speak('Son las cuatro y cuarto.', 'viajero', { libre: 'cuatro', es: 'Escucha y di una hora a tu gusto.', fr: 'Écoute et dis l’heure de ton choix : change « cuatro » (par exemple « son las siete y cuarto »).', tr: 'Il est quatre heures et quart. (change l’heure)', hechizo: ['Hechizo de las agujas', 'Las agujas del gran reloj se mueven un minuto'] }),
      dict('Son las ocho menos diez.', 'neus', { acept: ['son las ocho menos diez'] }),
    ]));

  // 3 — La rutina
  quests.push(quest('u05', 3, 'lectura', 'Mi rutina', '🌄',
    ['neus', 'Te cuento mi día. Primero me levanto, luego desayuno… ¿y tú?', 'Je te raconte ma journée. D’abord je me lève, puis je prends mon petit-déjeuner… et toi ?'],
    'La routine du jour : se lever, déjeuner, aller à l’école, se coucher. Verbes pronominaux (me levanto), repas espagnols, et tu écris ta propre routine.', ['leer', 'escribir', 'hablar'], 15, [
      flash('levantarse', 'acostarse', 'desayunar', 'cenar', 'dormir', 'empezar', 'terminar'),
      flash('llegar', 'siesta', 'desayuno', 'merienda', 'cena', 'siempre', 'despues'),
      match(['desayuno', 'merienda', 'cena', 'levantarse', 'acostarse', 'dormir']),
      gram('g_rutina'),
      lcI('Me acuesto a las diez.', 'marina', 'acostarse', ['levantarse', 'acostarse', 'desayunar']),
      lcT('Me levanto temprano y desayuno tostadas con zumo.', 'neus', ['Neus se acuesta a las diez.', 'Neus come tostadas al empezar el día.', 'Neus bebe leche por la noche.'], 1),
      read('Me llamo Neus. Por la mañana me levanto a las siete y media. Desayuno leche y una tostada. El colegio empieza a las nueve y termina a las dos. Como en casa a las dos y media. Por la tarde estudio y juego. Ceno a las nueve y me acuesto a las diez.', 'neus',
        'Je m’appelle Neus. Le matin, je me lève à sept heures et demie. Je prends du lait et une tartine au petit-déjeuner. L’école commence à neuf heures et finit à deux heures. Je déjeune à la maison à deux heures et demie. L’après-midi, j’étudie et je joue. Je dîne à neuf heures et je me couche à dix heures.', [
          ['¿A qué hora se levanta Neus?', 'À quelle heure Neus se lève-t-elle ?', ['A las siete y media.', 'A las nueve.', 'A las dos.'], 0],
          ['¿Cuándo termina el colegio?', 'Quand l’école finit-elle ?', ['A las nueve.', 'A las dos.', 'A las diez.'], 1],
          ['¿Cuándo cena Neus?', 'Quand Neus dîne-t-elle ?', ['A las nueve.', 'A las dos y media.', 'A las diez.'], 0],
        ]),
      fill('Por la mañana yo ___ a las ocho.', 'me levanto', 'viajero', { opts: ['me levanto', 'se levanta', 'me levantas'], tr: 'Le matin, je me lève à huit heures.' }),
      fill('Mi hermana ___ a las diez de la noche.', 'se acuesta', 'marina', { opts: ['se acuesta', 'me acuesto', 'se acostan'], tr: 'Ma sœur se couche à dix heures du soir.' }),
      fill('El colegio ___ a las nueve.', 'empieza', 'neus', { opts: ['empieza', 'empiezo', 'empezamos'], tr: 'L’école commence à neuf heures.' }),
      reord('Mi familia cena a las nueve y media.', 'neus', { tr: 'Ma famille dîne à neuf heures et demie.' }),
      dlg('neus', '¿A qué hora te levantas tú?', 'À quelle heure te lèves-tu, toi ?', [
        ['Me levanto a las siete y cuarto.', 1, '¡Qué temprano! Yo me levanto un poco más tarde.', 'Quelle heure matinale ! Moi, je me lève un peu plus tard.', 'Je me lève à sept heures et quart.'],
        ['Son las siete y cuarto.', 0, 'Yo te pregunto a qué hora te levantas tú.', 'Moi, je te demande à quelle heure tu te lèves, toi.', 'Il est sept heures et quart.'],
        ['Me levanto el reloj.', 0, '¿Te levantas el reloj? ¡Qué cosa más rara!', 'Tu te lèves l’horloge ? Quelle drôle de chose !', 'Je me lève l’horloge.'],
      ]),
      dlg('amparo', 'Hola, cariño. ¿Qué desayunas por la mañana?', 'Salut, mon chou. Que prends-tu au petit-déjeuner le matin ?', [
        ['Desayuno leche y una tostada.', 1, '¡Muy bien! Un buen desayuno es importante.', 'Très bien ! Un bon petit-déjeuner est important.', 'Je prends du lait et une tartine.'],
        ['Desayuno a las diez de la noche.', 0, 'A las diez de la noche se cena, ¡no se desayuna!', 'À dix heures du soir, on dîne, on ne prend pas le petit-déjeuner !', 'Je prends mon petit-déjeuner à dix heures du soir.'],
        ['Desayuno una paella con el reloj.', 0, '¿Con el reloj? Pobre reloj…', 'Avec l’horloge ? Pauvre horloge…', 'Je prends une paella avec l’horloge au petit-déjeuner.'],
      ]),
      speak('Me levanto a las siete.', 'viajero', { libre: 'siete', es: 'Escucha y di a qué hora TE levantas.', fr: 'Écoute et dis à quelle heure TU te lèves (a las seis y media, a las ocho menos cuarto…). Change seulement « siete ».', tr: 'Je me lève à sept heures. (dis ton heure)', hechizo: ['Hechizo del despertar', 'Un rayo de sol atraviesa la plaza'] }),
      writeFree('Me levanto a las ___. Desayuno ___. Me acuesto a las ___.', [
        { id: 'hora1', pista: 'À quelle heure te lèves-tu ? (siete, siete y media, ocho menos cuarto…)', tipo: 'texto' },
        { id: 'desayuno', pista: 'Que prends-tu au petit-déjeuner ? (leche, cereales, una tostada, zumo…)', tipo: 'texto' },
        { id: 'hora2', pista: 'À quelle heure te couches-tu ? (nueve y media, diez…)', tipo: 'texto' },
      ], 'Me levanto a las siete y media. Desayuno leche y una tostada. Me acuesto a las diez.', 'Je me lève à sept heures et demie. Je prends du lait et une tartine. Je me couche à dix heures.', 'viajero', C('Escribe tu rutina.', 'Écris ta routine.')),
    ]));

  // 4 — Forja: ir e ir a
  quests.push(quest('u05', 4, 'forja', 'La Forja: ir e ir a', '⚒️',
    ['quetzal', 'Ir. Voy, vas, va. ¡Forja conmigo!', 'Ir. Voy, vas, va. Forge avec moi !'],
    'Le verbe irrégulier ir, puis le futur proche ir a + infinitif (voy a comer, vamos a cenar).', ['escribir', 'leer', 'hablar'], 14, [
      flash('ir'),
      gram('g_ir'),
      conj('ir', 'yo', 'v', 'oy', ['oy', 'as', 'a'], 'viajero', { tr: 'Moi, je vais…' }),
      conj('ir', 'tú', 'v', 'as', ['oy', 'as', 'a'], 'marina', { tr: 'Toi, tu vas…' }),
      conj('ir', 'ella', 'v', 'a', ['oy', 'as', 'a'], 'neus', { tr: 'Elle va…' }),
      conj('ir', 'nosotros', 'v', 'amos', ['amos', 'ais', 'an'], 'vicent', { tr: 'Nous, nous allons…' }),
      conj('ir', 'ellos', 'v', 'an', ['amos', 'ais', 'an'], 'neus', { tr: 'Eux, ils vont…' }),
      gram('g_ir_a'),
      fill('Hoy yo ___ a comer paella.', 'voy', 'viajero', { opts: ['voy', 'va', 'vas'], tr: 'Aujourd’hui, je vais manger de la paella.' }),
      fill('Marina y Álex ___ al museo.', 'van', 'neus', { opts: ['va', 'van', 'vamos'], tr: 'Marina et Álex vont au musée.' }),
      fill('Vamos ___ cenar a las nueve.', 'a', 'vicent', { opts: ['a', 'al', 'en'], tr: 'Nous allons dîner à neuf heures. (ir + a + infinitif)' }),
      lcT('Esta noche vamos a cenar paella en casa de Vicent.', 'marina', ['Van a comer en casa de Vicent por la noche.', 'Vicent va a su casa muy tarde.', 'Vicent prepara una cena para sus amigos de París.'], 0),
      dlg('neus', '¿Adónde vas esta tarde?', 'Où vas-tu cet après-midi ?', [
        ['Voy a la Ciudad de las Artes.', 1, '¡Genial! Yo voy contigo.', 'Génial ! J’y vais avec toi.', 'Je vais à la Ciudad de las Artes.'],
        ['Estoy a las cuatro.', 0, 'Yo te pregunto adónde vas.', 'Moi, je te demande où tu vas.', 'Je suis à quatre heures.'],
        ['Voy a ir yo.', 0, '¿Tú vas a ir… adónde?', 'Tu vas aller… où ?', 'Je vais aller moi.'],
      ]),
      speak('Voy a comer paella.', 'viajero', { libre: 'paella', es: 'Escucha y di qué vas a comer TÚ.', fr: 'Écoute et dis ce que TU vas manger (una tortilla, una ensalada, fruta…). Change seulement « paella ».', tr: 'Je vais manger de la paella. (dis ce que tu vas manger)', hechizo: ['Hechizo del futuro', 'Una paella gigante aparece en la plaza'] }),
    ]));

  // 5 — Forja: querer, poder, gerundio
  quests.push(quest('u05', 5, 'forja', 'La Forja: querer, poder y estar + gerundio', '⚒️',
    ['quetzal', 'Quiero. Puedo. ¡Estoy forjando!', 'Je veux. Je peux. Je suis en train de forger !'],
    'Les verbes qui diphtonguent (e→ie, o→ue : quiero, puedo, empieza), puis estar + gérondif pour dire ce qu’on fait en ce moment.', ['escribir', 'leer'], 15, [
      flash('querer', 'poder', 'estudiar', 'preparar', 'esperar', 'ahora'),
      gram('g_diptongo'),
      conj('querer', 'yo', 'quier', 'o', ['o', 'es', 'e'], 'viajero', { tr: 'Moi, je veux…' }),
      conj('poder', 'tú', 'pued', 'es', ['o', 'es', 'e'], 'marina', { tr: 'Toi, tu peux…' }),
      conj('querer', 'nosotros', 'quer', 'emos', ['emos', 'éis', 'en'], 'neus', { tr: 'Nous, nous voulons… (pas de diphtongue !)' }),
      conj('poder', 'ellos', 'pued', 'en', ['emos', 'éis', 'en'], 'vicent', { tr: 'Eux, ils peuvent…' }),
      conj('empezar', 'él', 'empiez', 'a', ['o', 'as', 'a'], 'neus', { tr: 'Lui, il commence…' }),
      fill('Yo ___ una horchata, por favor.', 'quiero', 'viajero', { opts: ['quiero', 'quero', 'quieres'], tr: 'Je veux une horchata, s’il vous plaît.' }),
      fill('¿___ comer ahora? Tengo hambre.', 'Puedo', 'viajero', { opts: ['Puedo', 'Podo', 'Podemos'], tr: 'Je peux manger maintenant ? J’ai faim.' }),
      fill('Nosotros ___ comer a las dos.', 'queremos', 'neus', { opts: ['quieremos', 'queremos', 'quieren'], tr: 'Nous voulons manger à deux heures. (nosotros : pas de diphtongue)' }),
      gram('g_gerundio'),
      fill('Ahora Vicent está ___ la paella.', 'preparando', 'neus', { opts: ['preparar', 'preparando', 'preparado'], tr: 'En ce moment, Vicent est en train de préparer la paella.' }),
      fill('Marina está ___ un bocadillo.', 'comiendo', 'marina', { opts: ['comendo', 'comiendo', 'comer'], tr: 'Marina est en train de manger un sandwich.' }),
      fill('Estoy ___ un libro.', 'leyendo', 'viajero', { opts: ['leiendo', 'leyendo', 'leendo'], tr: 'Je suis en train de lire un livre. (leer → leyendo)' }),
      lcT('Vicent está preparando una paella enorme.', 'neus', ['Vicent compra arroz en el mercado.', 'Ahora Vicent cocina un plato de arroz muy grande.', 'La paella de Vicent ya está en la mesa.'], 1),
    ]));

  // 6 — Diálogo : comidas
  quests.push(quest('u05', 6, 'dialogo', 'La paella de Vicent', '🥘',
    ['vicent', '¡Tengo hambre! Y vosotros también, ¿no? Pasad, pasad.', 'J’ai faim ! Et vous aussi, non ? Entrez, entrez.'],
    'Les repas et la nourriture : demander, commander (quiero, ¿puedo…?), parler de la faim et de la soif. Mini-lecture sur la paella valencienne.', ['hablar', 'leer', 'escuchar'], 15, [
      flash('leche', 'tostada', 'zumo', 'fruta', 'bocadillo', 'ensalada', 'arroz'),
      flash('pollo', 'paella', 'horchata', 'tortilla', 'hambre', 'sed'),
      match(['leche', 'tostada', 'zumo', 'fruta', 'bocadillo', 'ensalada']),
      lcV('paella', ['paella', 'ensalada', 'tortilla']),
      dlg('vicent', 'Buenas tardes. ¿Tenéis hambre?', 'Bonjour (l’après-midi). Vous avez faim ?', [
        ['Sí, tenemos mucha hambre.', 1, '¡Estupendo! La paella ya casi está.', 'Parfait ! La paella est presque prête.', 'Oui, nous avons très faim.'],
        ['Sí, somos hambre.', 0, 'Con «hambre» usamos «tener»: «tenemos hambre».', 'Avec « hambre », on utilise « tener » : « tenemos hambre ».', 'Oui, nous sommes faim.'],
        ['No, tengo doce años.', 0, 'Ja, ja. Pero la edad no quita el hambre.', 'Ha, ha. Mais l’âge ne coupe pas la faim.', 'Non, j’ai douze ans.'],
      ]),
      dlg('amparo', '¿Quieres una horchata? Es una bebida fría de Valencia.', 'Tu veux une horchata ? C’est une boisson fraîche de Valence.', [
        ['Sí, por favor. Quiero una horchata.', 1, '¡Aquí tienes, cariño! Con unos fartons.', 'Voilà, mon chou ! Avec des fartons (petits gâteaux à tremper dedans).', 'Oui, s’il vous plaît. Je veux une horchata.'],
        ['Sí, puedo una horchata.', 0, 'Con «puedo» necesitamos otro verbo: «puedo beber»… Mejor: «quiero una horchata».', 'Avec « puedo », il faut un autre verbe : « puedo beber »… Mieux : « quiero una horchata ».', 'Oui, je peux une horchata.'],
        ['No, gracias. Soy una horchata.', 0, 'Ja, ja. ¡Qué gracioso! Toma una horchata de verdad.', 'Ha, ha. Que tu es drôle ! Tiens, une vraie horchata.', 'Non, merci. Je suis une horchata.'],
      ]),
      read('La paella valenciana lleva arroz, pollo, judías verdes y tomate. Tradicionalmente, se cocina sobre fuego de leña, despacio. En Valencia se come a mediodía, a las dos o a las tres, muchas veces en familia, el domingo. La paella es un plato para la comida, no para la cena.', 'vicent',
        'La paella valencienne contient du riz, du poulet, des haricots verts et de la tomate. Traditionnellement, on la cuit sur un feu de bois, lentement. À Valence, on la mange à midi, à deux ou trois heures, souvent en famille, le dimanche. La paella est un plat pour le déjeuner, pas pour le dîner. (« lleva » = contient ; « llevar » veut aussi dire porter)', [
          ['¿Qué lleva la paella valenciana?', 'Que contient la paella valencienne ?', ['Arroz, pollo, judías verdes y tomate.', 'Solo pan y leche.', 'Pescado y chocolate.'], 0],
          ['¿Cuándo comen paella normalmente?', 'Quand mange-t-on la paella normalement ?', ['Por la noche.', 'A mediodía.', 'En el desayuno.'], 1],
          ['¿Con quién la comen muchas veces?', 'Avec qui la mange-t-on souvent ?', ['Con la familia.', 'Con un reloj.', 'Sola.'], 0],
        ]),
      fill('Tengo ___: quiero beber agua.', 'sed', 'vicent', { opts: ['sed', 'hambre', 'sueño'], tr: 'J’ai soif : je veux boire de l’eau.' }),
      fill('Para desayunar, quiero leche y una ___.', 'tostada', 'amparo', { opts: ['tostada', 'paella', 'cena'], tr: 'Pour le petit-déjeuner, je veux du lait et une tartine.' }),
      fill('Hoy vamos a comer ___ y arroz.', 'pollo', 'vicent', { opts: ['pollo', 'zumo', 'leche'], tr: 'Aujourd’hui, nous allons manger du poulet et du riz.' }),
      tf('En México, «tortilla» significa lo mismo que en España.', false, N, { tr: 'Au Mexique, « tortilla » ne veut pas dire la même chose qu’en Espagne.', expl: ['En España es una tortilla de huevos y patatas; en México es una tortilla de maíz.', 'En Espagne, c’est une omelette aux œufs et aux pommes de terre ; au Mexique, c’est une galette de maïs.'] }),
      lcT('Hoy, para la comida, tengo paella, ensalada y fruta.', 'vicent', ['Vicent ofrece tres cosas para comer al mediodía.', 'Vicent solo tiene bebidas frías.', 'Vicent cierra hoy su puesto.'], 0),
      speak('Quiero una horchata, por favor.', 'viajero', { libre: 'horchata', es: 'Escucha y pide algo de comer o beber.', fr: 'Écoute et demande ce que TU veux (un zumo, una tortilla, un bocadillo…). Change seulement « horchata » (ajoute « un / una »).', tr: 'Je veux une horchata, s’il vous plaît. (change le mot)', hechizo: ['Hechizo del apetito', 'Un aroma de azafrán llena la plaza'] }),
    ]));

  // 7 — Cultura
  quests.push(quest('u05', 7, 'cultura', 'Horarios, fallas y paella', '🔥',
    ['neus', 'En España, la vida tiene otros horarios. ¡Y Valencia tiene fuego!', 'En Espagne, la vie a d’autres horaires. Et Valence a du feu !'],
    'Les horaires espagnols (repas tardifs, sieste), la Ciudad de las Artes y las Ciencias et les Fallas de Valence (15-19 mars) ; puis tu écris TES horaires de repas.', ['cultura', 'leer', 'escribir', 'hablar'], 15, [
      flash('falla', 'mascleta', 'fuego', 'acuario'),
      capsula,
      tf('En España, la cena es a las siete de la tarde.', false, N, { tr: 'En Espagne, le dîner est à sept heures de l’après-midi.', expl: ['Normalmente la cena es a las nueve o más tarde.', 'Normalement, le dîner est à neuf heures ou plus tard.'] }),
      tf('En Madrid y en París es la misma hora.', true, N, { tr: 'À Madrid et à Paris, c’est la même heure.', expl: ['Sí, pero en las islas Canarias es una hora menos.', 'Oui, mais aux îles Canaries, il est une heure de moins.'] }),
      tf('La mascletà suena a las dos de la tarde.', true, N, { tr: 'La mascletà retentit à deux heures de l’après-midi.' }),
      read('Las fallas son la gran fiesta de Valencia. Se celebran en marzo, del quince al diecinueve. Hay monumentos enormes de cartón y madera, con figuras graciosas. Cada día, a las dos de la tarde, suena la mascletà. La noche del diecinueve de marzo, las fallas se queman. ¡Hay mucho fuego!', 'neus',
        'Les Fallas sont la grande fête de Valence. Elles ont lieu en mars, du quinze au dix-neuf. Il y a des monuments énormes en carton et en bois, avec des personnages amusants. Chaque jour, à deux heures de l’après-midi, retentit la mascletà. La nuit du dix-neuf mars, les fallas sont brûlées. Il y a beaucoup de feu !', [
          ['¿Cuándo se celebran las fallas?', 'Quand ont lieu les Fallas ?', ['En marzo.', 'En agosto.', 'En diciembre.'], 0],
          ['¿Cómo son los monumentos?', 'Comment sont les monuments ?', ['Pequeños y de azúcar.', 'Enormes, de cartón y madera.', 'Azules y de metal.'], 1],
          ['¿Qué pasa la noche del diecinueve?', 'Que se passe-t-il la nuit du dix-neuf ?', ['Las fallas se queman.', 'Las fallas empiezan.', 'Todos duermen la siesta.'], 0],
        ]),
      read('La Ciudad de las Artes y las Ciencias está en Valencia. Tiene un museo de ciencias, un cine con una pantalla gigante, un palacio para la ópera y el Oceanogràfic, un acuario muy grande. Los edificios son blancos y muy modernos. El arquitecto de casi todos es Santiago Calatrava, un valenciano.', 'neus',
        'La Ciudad de las Artes y las Ciencias est à Valence. Elle a un musée des sciences, un cinéma avec un écran géant, un palais pour l’opéra et l’Oceanogràfic, un très grand aquarium. Les bâtiments sont blancs et très modernes. L’architecte de presque tous est Santiago Calatrava, un Valencien. (L’Oceanogràfic est l’œuvre de Félix Candela.)', [
          ['¿Qué es el Oceanogràfic?', 'Qu’est-ce que l’Oceanogràfic ?', ['Un acuario.', 'Un museo de arte.', 'Un colegio.'], 0],
          ['¿Cómo son los edificios?', 'Comment sont les bâtiments ?', ['Rojos y viejos.', 'Blancos y modernos.', 'Pequeños y negros.'], 1],
          ['¿Quién es Santiago Calatrava?', 'Qui est Santiago Calatrava ?', ['El arquitecto.', 'El paellero.', 'El profesor de Neus.'], 0],
        ]),
      lcT('En mi casa comemos a las tres y cenamos muy tarde, a las diez.', 'neus', ['Neus come a las tres de la tarde y cena a las diez de la noche.', 'Neus come a las doce y cena a las siete.', 'Neus come a las tres y cena a las nueve.'], 0),
      dlg('neus', '¿Y en tu país? ¿A qué hora cenáis?', 'Et dans ton pays ? À quelle heure dînez-vous ?', [
        ['En Francia cenamos a las siete y media o a las ocho.', 1, '¡Qué temprano! Aquí la cena es mucho más tarde.', 'Quelle heure matinale pour dîner ! Ici, le dîner est beaucoup plus tard.', 'En France, nous dînons à sept heures et demie ou huit heures.'],
        ['En Francia cenamos a las tres de la mañana.', 0, '¡A las tres de la mañana! Eso es muy tarde, incluso para España.', 'À trois heures du matin ! C’est très tard, même pour l’Espagne.', 'En France, nous dînons à trois heures du matin.'],
        ['Cenamos el reloj.', 0, '¿El reloj? Mejor una tortilla.', 'L’horloge ? Mieux vaut une omelette.', 'Nous dînons l’horloge.'],
      ]),
      fill('En España, la ___ es a las dos o a las tres.', 'comida', 'neus', { opts: ['comida', 'cena', 'merienda'], tr: 'En Espagne, le déjeuner est à deux ou trois heures.' }),
      writeFree('Mi comida es a las ___ y mi cena es a las ___. Mi comida favorita es ___.', [
        { id: 'comida', pista: 'À quelle heure déjeunes-tu ? (doce y media, una…)', tipo: 'texto' },
        { id: 'cena', pista: 'À quelle heure dînes-tu ? (siete y media, ocho…)', tipo: 'texto' },
        { id: 'favorita', pista: 'Ton plat préféré ? (la pizza, la pasta, el pollo…)', tipo: 'texto' },
      ], 'Mi comida es a las doce y media y mi cena es a las ocho. Mi comida favorita es la pizza.', 'Mon déjeuner est à midi et demi et mon dîner est à huit heures. Mon plat préféré est la pizza.', 'viajero', C('Escribe tus horarios de comida.', 'Écris tes horaires de repas.')),
      speak('Mi cena es a las ocho.', 'viajero', { libre: 'ocho', es: 'Escucha y di a qué hora cenas TÚ.', fr: 'Écoute et dis à quelle heure TU dînes. Change seulement « ocho » (a las siete y media = « siete y media »).', tr: 'Mon dîner est à huit heures. (dis ton heure)', hechizo: ['Hechizo de la cena', 'Las campanas de la ciudad suenan al unísono'] }),
      dict('Las fallas son en marzo.', 'neus', { acept: ['las fallas son en marzo'] }),
    ]));

  // 8 — Desafío
  quests.push(quest('u05', 8, 'desafio', 'El reloj de la Sombra', '⏰',
    ['sombra', 'Sin horas no hay rutina. Sin rutina no hay palabras. Yo paro el tiempo.', 'Sans heures, pas de routine. Sans routine, pas de mots. Moi, j’arrête le temps.'],
    'Boss de Valence : révision mixte des unités 1 à 5 (présentation, école, famille, description, heure, routine, ir, querer / poder) pour remettre les horloges en marche.', ['escuchar', 'hablar', 'leer', 'escribir'], 15, [
      dlg('sombra', 'Mi reloj dice 6:45. ¿Qué hora es?', 'Ma montre indique 6:45. Quelle heure est-il ?', [
        ['Son las siete menos cuarto.', 1, '¡Grr! Una hora más que vuelve…', 'Grr ! Encore une heure qui revient…', 'Il est sept heures moins le quart.'],
        ['Son las seis y cuarto.', 0, 'Eso es 6:15. ¡Otra vez!', 'Ça, c’est 6:15. Encore une fois !', 'Il est six heures et quart.'],
        ['Es la una y media.', 0, 'Mi reloj no dice eso.', 'Ma montre ne dit pas ça.', 'Il est une heure et demie.'],
      ]),
      dlg('sombra', 'Sin rutina no hay nada. ¿A qué hora te levantas tú?', 'Sans routine, il n’y a rien. À quelle heure te lèves-tu, toi ?', [
        ['Me levanto a las siete.', 1, 'Aaah… otra rutina que vuelve.', 'Aaah… encore une routine qui revient.', 'Je me lève à sept heures.'],
        ['Soy a las siete.', 0, 'Eso no tiene sentido. ¡Otra vez!', 'Ça n’a aucun sens. Encore une fois !', 'Je suis à sept heures.'],
        ['Me llamo Álex.', 0, 'No te pregunto tu nombre.', 'Je ne te demande pas ton prénom.', 'Je m’appelle Álex.'],
      ]),
      lcT('Son las siete y cuarto.', 'sombra', ['6:15', '7:15', '7:45'], 1),
      lcT('Mi abuela tiene el pelo gris y lleva gafas.', 'neus', ['La abuela lleva gafas y su pelo no es negro.', 'La abuela tiene el pelo corto y rizado.', 'La abuela no lleva gafas ni sombrero.'], 0),
      match(['rojo', 'azul', 'verde', 'amarillo', 'negro', 'blanco']),
      fill('Mi padre ___ médico y mi madre es ingeniera.', 'es', 'marina', { opts: ['es', 'está', 'soy'], tr: 'Mon père est médecin et ma mère est ingénieure.' }),
      fill('Hoy yo ___ muy cansado.', 'estoy', 'viajero', { opts: ['soy', 'estoy', 'estás'], tr: 'Aujourd’hui, je suis très fatigué.' }),
      fill('Esta noche ___ a cenar a las nueve.', 'vamos', 'neus', { opts: ['vamos', 'van', 'voy'], tr: 'Ce soir, nous allons dîner à neuf heures.' }),
      conj('querer', 'yo', 'quier', 'o', ['o', 'es', 'e'], 'viajero', { tr: 'Moi, je veux…' }),
      reord('Marina lleva una falda azul y zapatos negros.', 'marina', { tr: 'Marina porte une jupe bleue et des chaussures noires.' }),
      read('Hola, soy Neus. Tengo doce años y vivo en Valencia. Mi madre es médica y mi padre es cocinero. Soy alta y delgada, y llevo siempre un reloj. Hoy estoy contenta porque los relojes funcionan. Hoy, a mediodía, voy a comer paella con mis nuevos amigos.', 'neus',
        'Salut, c’est Neus. J’ai douze ans et j’habite à Valence. Ma mère est médecin et mon père est cuisinier. Je suis grande et mince, et je porte toujours une montre. Aujourd’hui, je suis contente parce que les horloges fonctionnent. Aujourd’hui, au déjeuner, je vais manger de la paella avec mes nouveaux amis.', [
          ['¿Qué hace el padre de Neus?', 'Quel est le métier du père de Neus ?', ['Es médico.', 'Es cocinero.', 'Es profesor.'], 1],
          ['¿Qué lleva Neus siempre?', 'Que porte toujours Neus ?', ['Una gorra.', 'Un reloj.', 'Un vestido rojo.'], 1],
          ['¿Qué va a hacer hoy a mediodía?', 'Que va-t-elle faire aujourd’hui au déjeuner ?', ['Va a estudiar en el colegio.', 'Va a dormir la siesta.', 'Va a comer paella con amigos.'], 2],
        ]),
      speak('Hola, me llamo Álex y me levanto a las siete.', 'viajero', { tr: 'Salut, je m’appelle Álex et je me lève à sept heures. (dis ton prénom)', nombre: 'Álex', hechizo: ['Hechizo final', '¡Las agujas del gran reloj vuelven a moverse!'] }),
      pluma,
    ], { jefe: { personaje: 'sombra', vidas: 10 } }));

  return {
    id: 'u05', numero: 5, titulo: '¿Qué hora es?', lugar: 'Valencia', emoji: '🕒', ejes: [2], periodo: 'nov-dic',
    objetivos: [
      { es: 'Preguntar y decir la hora: es la una, son las dos y media, menos cuarto.', fr: 'Demander et dire l’heure : es la una, son las dos y media, menos cuarto.' },
      { es: 'Contar mi rutina y mis comidas con las horas: me levanto, desayuno, ceno.', fr: 'Raconter ma routine et mes repas avec les heures : me levanto, desayuno, ceno.' },
      { es: 'Usar el verbo ir y la estructura ir a + infinitivo.', fr: 'Utiliser le verbe ir et la structure ir a + infinitif.' },
      { es: 'Usar querer y poder (e→ie, o→ue) para pedir y proponer.', fr: 'Utiliser querer et poder (e→ie, o→ue) pour demander et proposer.' },
      { es: 'Decir lo que hago ahora con estar + gerundio.', fr: 'Dire ce que je fais en ce moment avec estar + gérondif.' },
      { es: 'Conocer los horarios españoles, la paella y las Fallas de Valencia.', fr: 'Connaître les horaires espagnols, la paella et les Fallas de Valence.' },
    ],
    vocab, gramatica, quests,
    pluma: { numero: 5, nombre: 'Pluma del Reloj', descripcion: L('quetzal', 'Cinco plumas. El tiempo vuelve a correr… ¡y yo hablo más!', 'Cinq plumes. Le temps recommence à couler… et je parle plus !') },
  };
}
