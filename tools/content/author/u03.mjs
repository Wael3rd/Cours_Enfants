// Unidad 3 — Mi familia (Sevilla)
import { W, G, quest, flash, match, lcV, lcI, lcT, dict, fill, reord, conj, dlg, read, speak, tf, gram, writeFree, cine, P, L, C, NARR } from './lib.mjs';

export default function build() {
  const N = NARR;

  // ───────────── Vocabulario (49) ─────────────
  const ilu = (s) => ({ ilustracion: s });
  const vocab = [
    // familia
    W('familia', 'familia', 'famille', '👪', 'familia', 'La familia de Marina es grande.', 'La famille de Marina est grande.', { genero: 'f' }),
    W('padres', 'padres', 'parents (le père et la mère)', '👫', 'familia', 'Mis padres se llaman Ana y Javier.', 'Mes parents s’appellent Ana et Javier.', { genero: 'm', soloPlural: true }),
    W('madre', 'madre', 'mère', '👩‍👧', 'familia', 'Mi madre es médica.', 'Ma mère est médecin.', { genero: 'f' }),
    W('padre', 'padre', 'père', '👨‍👦', 'familia', 'Mi padre se llama Javier.', 'Mon père s’appelle Javier.', { genero: 'm' }),
    W('hermano', 'hermano', 'frère', null, 'familia', 'Marina tiene un hermano pequeño.', 'Marina a un petit frère.', { genero: 'm', femenino: 'hermana', ...ilu('Un garçon qui sourit, avec le même t-shirt que sa sœur') }),
    W('hermana', 'hermana', 'sœur', null, 'familia', '¿Tienes hermanos o hermanas?', 'As-tu des frères ou des sœurs ?', { genero: 'f', ...ilu('Une fille qui sourit, avec le même t-shirt que son frère') }),
    W('abuelo', 'abuelo', 'grand-père', '👴', 'familia', 'Mi abuelo vive en Sevilla.', 'Mon grand-père habite à Séville.', { genero: 'm' }),
    W('abuela', 'abuela', 'grand-mère', '👵', 'familia', 'Mi abuela Carmen pinta azulejos.', 'Ma grand-mère Carmen peint des azulejos.', { genero: 'f' }),
    W('tio', 'tío', 'oncle', null, 'familia', 'Mi tío Rafa es cocinero.', 'Mon oncle Rafa est cuisinier.', { genero: 'm', ...ilu('Un homme adulte souriant avec une guitare dans le dos (l’oncle)') }),
    W('tia', 'tía', 'tante', null, 'familia', 'Mi tía Elena es policía.', 'Ma tante Elena est policière.', { genero: 'f', ...ilu('Une femme adulte souriante, bras ouverts (la tante)') }),
    W('primo', 'primo', 'cousin', null, 'familia', 'Mi primo tiene ocho años.', 'Mon cousin a huit ans.', { genero: 'm', femenino: 'prima', ...ilu('Un garçon qui joue au ballon avec un cousin dans un patio') }),
    W('prima', 'prima', 'cousine', null, 'familia', 'Mi prima Lola tiene seis años.', 'Ma cousine Lola a six ans.', { genero: 'f', ...ilu('Une petite fille avec un chat orange dans les bras') }),
    W('foto', 'foto', 'photo', '📷', 'familia', 'Hay una foto de mi familia.', 'Il y a une photo de ma famille.', { genero: 'f' }),
    W('arbol', 'árbol genealógico', 'arbre généalogique', '🌳', 'familia', 'Este es el árbol genealógico de mi familia.', 'Voici l’arbre généalogique de ma famille.', { genero: 'm' }),
    W('apellido', 'apellido', 'nom de famille', '🪪', 'familia', 'Mi apellido es Ortega.', 'Mon nom de famille est Ortega.', { genero: 'm' }),
    W('perro', 'perro', 'chien', '🐶', 'mascotas', 'Mi perro se llama Toby.', 'Mon chien s’appelle Toby.', { genero: 'm' }),
    W('gato', 'gato', 'chat', '🐱', 'mascotas', 'El gato de Lola se llama Churro.', 'Le chat de Lola s’appelle Churro.', { genero: 'm' }),
    // profesiones
    W('medico', 'médico', 'médecin', '🧑‍⚕️', 'profesiones', 'El médico trabaja en un hospital.', 'Le médecin travaille dans un hôpital.', { genero: 'm', femenino: 'médica' }),
    W('ingeniero', 'ingeniero', 'ingénieur', '📐', 'profesiones', 'Mi padre es ingeniero.', 'Mon père est ingénieur.', { genero: 'm', femenino: 'ingeniera', ...ilu('Une ingénieure avec un casque jaune et des plans enroulés') }),
    W('cocinero', 'cocinero', 'cuisinier', '🧑‍🍳', 'profesiones', 'Rafa es cocinero.', 'Rafa est cuisinier.', { genero: 'm', femenino: 'cocinera' }),
    W('policia', 'policía', 'policier, policière', '👮', 'profesiones', 'Mi tía es policía.', 'Ma tante est policière.', { genero: 'mf' }),
    W('bombero', 'bombero', 'pompier', '🧑‍🚒', 'profesiones', 'Mi tío es bombero.', 'Mon oncle est pompier.', { genero: 'm', femenino: 'bombera' }),
    W('artista', 'artista', 'artiste', '🧑‍🎨', 'profesiones', 'Mi abuela es artista.', 'Ma grand-mère est artiste.', { genero: 'mf' }),
    W('conductor', 'conductor', 'conducteur', '🚍', 'profesiones', 'El conductor del autobús es simpático.', 'Le conducteur du bus est sympa.', { genero: 'm', femenino: 'conductora' }),
    W('panadero', 'panadero', 'boulanger', '🥐', 'profesiones', 'El panadero trabaja por la mañana.', 'Le boulanger travaille le matin.', { genero: 'm', femenino: 'panadera' }),
    // casa
    W('casa', 'casa', 'maison', '🏡', 'casa', 'La casa de la abuela tiene un patio.', 'La maison de la grand-mère a un patio.', { genero: 'f' }),
    W('salon', 'salón', 'salon', '🛋️', 'casa', 'En el salón hay un sofá.', 'Dans le salon, il y a un canapé.', { genero: 'm' }),
    W('cocina', 'cocina', 'cuisine', '🍳', 'casa', 'En la cocina hay una mesa.', 'Dans la cuisine, il y a une table.', { genero: 'f' }),
    W('dormitorio', 'dormitorio', 'chambre', '🛏️', 'casa', 'Mi dormitorio es pequeño.', 'Ma chambre est petite.', { genero: 'm' }),
    W('bano', 'baño', 'salle de bains', '🛁', 'casa', 'En el baño hay un espejo.', 'Dans la salle de bains, il y a un miroir.', { genero: 'm' }),
    W('jardin', 'jardín', 'jardin', '🌷', 'casa', 'Hay un jardín con flores.', 'Il y a un jardin avec des fleurs.', { genero: 'm' }),
    W('patio', 'patio', 'patio, cour intérieure', '⛲', 'casa', 'El patio de la abuela tiene flores.', 'Le patio de la grand-mère a des fleurs.', { genero: 'm', ...ilu('Un patio andalou avec fontaine, pots de géraniums et sol en mosaïque') }),
    // posesivos
    W('mi', 'mi', 'mon, ma (au pluriel : mis = mes)', null, 'posesivos', 'Mi madre se llama Ana.', 'Ma mère s’appelle Ana.', ilu('Une main qui pointe vers soi, avec le mot « mi »')),
    W('tu_pos', 'tu', 'ton, ta (au pluriel : tus = tes)', null, 'posesivos', '¿Cómo se llama tu padre?', 'Comment s’appelle ton père ?', ilu('Une main qui pointe vers l’autre personne, avec le mot « tu »')),
    W('su', 'su', 'son, sa, leur (au pluriel : sus = ses, leurs)', null, 'posesivos', 'Su abuela vive en Sevilla.', 'Sa grand-mère habite à Séville.', ilu('Une flèche qui part d’une personne vers un objet lointain, avec le mot « su »')),
    W('nuestro', 'nuestro', 'notre (nuestros, nuestras = nos)', null, 'posesivos', 'Nuestra casa está en Sevilla.', 'Notre maison est à Séville.', { femenino: 'nuestra', ...ilu('Deux personnes qui tiennent ensemble un même objet, avec le mot « nuestro »') }),
    // verbos
    W('comer', 'comer', 'manger', '🍽️', 'verbos', 'Comemos en el patio.', 'Nous mangeons dans le patio.'),
    W('beber', 'beber', 'boire', '🥤', 'verbos', 'Lola bebe leche.', 'Lola boit du lait.'),
    W('vivir', 'vivir', 'habiter, vivre', '🏘️', 'verbos', 'Mis abuelos viven en Sevilla.', 'Mes grands-parents habitent à Séville.'),
    W('leer', 'leer', 'lire', '📚', 'verbos', 'Mi padre lee un libro.', 'Mon père lit un livre.'),
    W('escribir', 'escribir', 'écrire', '📝', 'verbos', 'Escribo una carta a mi abuela.', 'J’écris une lettre à ma grand-mère.'),
    W('compartir', 'compartir', 'partager', '🍕', 'verbos', 'Compartimos la comida.', 'Nous partageons le repas.', ilu('Deux enfants se partagent une pizza')),
    W('trabajar', 'trabajar', 'travailler', '💼', 'verbos', 'Mi madre trabaja en un hospital.', 'Ma mère travaille dans un hôpital.'),
    // adjetivos y otros
    W('mayor', 'mayor', 'âgé, plus âgé, grand (frère/sœur)', '🧓', 'adjetivos', 'Mi abuelo es muy mayor.', 'Mon grand-père est très âgé.', { genero: 'mf' }),
    W('pequeno', 'pequeño', 'petit', '🐜', 'adjetivos', 'Mi hermano es pequeño.', 'Mon frère est petit.', { genero: 'm', femenino: 'pequeña' }),
    W('grande', 'grande', 'grand', '🐘', 'adjetivos', 'Mi familia es muy grande.', 'Ma famille est très grande.', { genero: 'mf' }),
    W('cuantos', '¿cuántos?', 'combien ? (masculin pluriel)', '🔢', 'preguntas', '¿Cuántos hermanos tienes?', 'Combien de frères et sœurs as-tu ?', { femenino: '¿cuántas?' }),
    W('tambien', 'también', 'aussi', '➕', 'conectores', 'Marina también tiene un gato.', 'Marina aussi a un chat.'),
  ];

  // ───────────── Gramática ─────────────
  const gramatica = [
    G('g_posesivos', 'Mi, tu, su', 'Mon, ton, son', [
      ['Mi madre se llama Ana.', 'Ma mère s’appelle Ana.', 'marina', ['Mi']],
      ['¿Cómo se llama tu padre?', 'Comment s’appelle ton père ?', 'lola', ['tu']],
      ['Su abuela es artista.', 'Sa grand-mère est artiste.', 'marina', ['Su']],
      ['Mis padres viven en Madrid.', 'Mes parents habitent à Madrid.', 'marina', ['Mis']],
    ], 'Mi, tu y su van antes del nombre. Con un nombre plural: mis, tus y sus. Para «nosotros»: nuestro y nuestra.',
    'Mi, tu et su se placent avant le nom. Avec un nom pluriel : mis, tus, sus. Pour « nous » : nuestro, nuestra.',
    "Pas d'accent sur ces possessifs (tu = ton/ta ; tú avec accent = toi). Ils s'accordent en nombre avec la chose possédée, pas avec le possesseur : mi madre (ma mère), mis padres (mes parents). Su = son, sa ou leur ; sus = ses ou leurs. Nuestro s'accorde aussi en genre : nuestro padre, nuestra casa.",
    { encabezado: ['', 'singular', 'plural'], filas: [['yo', 'mi', 'mis'], ['tú', 'tu', 'tus'], ['él / ella', 'su', 'sus'], ['nosotros', 'nuestro / nuestra', 'nuestros / nuestras']] }),
    G('g_profesion', 'Mi madre es médica', 'Les métiers', [
      ['Mi padre es médico.', 'Mon père est médecin.', 'marina', ['médico']],
      ['Mi madre es médica.', 'Ma mère est médecin.', 'marina', ['médica']],
      ['Mi tía es policía.', 'Ma tante est policière.', 'marina', ['policía']],
      ['Mi abuela es artista.', 'Ma grand-mère est artiste.', 'marina', ['artista']],
    ], 'Para las profesiones usamos «ser», sin «un» ni «una». Para un hombre: -o. Para una mujer: -a. Policía y artista no cambian.',
    'Pour les métiers, on utilise « ser », sans « un » ni « una ». Pour un homme : -o. Pour une femme : -a. Policía et artista ne changent pas.',
    "Métier avec ser et sans article : « Mi padre es médico » (pas « es un médico »). Féminin : -o → -a (cocinero → cocinera) ; consonne → + a (conductor → conductora). Les métiers en -ista (artista) et policía sont identiques au masculin et au féminin. On remet un article seulement si on ajoute un adjectif : « es un médico muy bueno ».",
    { encabezado: ['él', 'ella'], filas: [['médico', 'médica'], ['cocinero', 'cocinera'], ['bombero', 'bombera'], ['policía', 'policía'], ['artista', 'artista']] }),
    G('g_er_ir', 'Comer y vivir', 'Les verbes en -er et -ir', [
      ['Yo como en el patio.', 'Je mange dans le patio.', 'rafa', ['como']],
      ['Tú vives en Madrid.', 'Tu habites à Madrid.', 'marina', ['vives']],
      ['Mi abuelo bebe café.', 'Mon grand-père boit du café.', 'marina', ['bebe']],
      ['Nosotros compartimos la casa.', 'Nous partageons la maison.', 'marina', ['compartimos']],
    ], 'Los verbos en -er: como, comes, come, comemos, coméis, comen. Los verbos en -ir: vivo, vives, vive, vivimos, vivís, viven. Son iguales, menos con nosotros y vosotros.',
    'Verbes en -er : como, comes, come, comemos, coméis, comen. Verbes en -ir : vivo, vives, vive, vivimos, vivís, viven. Ce sont les mêmes terminaisons, sauf avec nosotros et vosotros.',
    "-er et -ir ont les mêmes terminaisons sauf à nosotros (-emos / -imos) et vosotros (-éis / -ís). Même logique qu'avec -ar : on retire l'infinitif et on ajoute la terminaison.",
    { encabezado: ['Pronombre', 'comer', 'vivir'], filas: [['yo', 'como', 'vivo'], ['tú', 'comes', 'vives'], ['él / ella', 'come', 'vive'], ['nosotros', 'comemos', 'vivimos'], ['vosotros', 'coméis', 'vivís'], ['ellos / ellas', 'comen', 'viven']] }),
    G('g_tener_ser', 'Tener y ser', 'Avoir et être', [
      ['Tengo dos hermanos.', 'J’ai deux frères et sœurs.', 'marina', ['Tengo']],
      ['Mi madre es médica.', 'Ma mère est médecin.', 'marina', ['es']],
      ['Mi tío Rafa tiene un gato.', 'Mon oncle Rafa a un chat.', 'marina', ['tiene']],
      ['Somos una familia grande.', 'Nous sommes une grande famille.', 'rafa', ['Somos']],
    ], 'Con «tener» decimos lo que tenemos: hermanos, un gato, una casa. Con «ser» decimos quién es una persona: su nombre, su profesión, su nacionalidad.',
    'Avec « tener », on dit ce qu’on a : des frères et sœurs, un chat, une maison. Avec « ser », on dit qui est une personne : son prénom, son métier, sa nationalité.',
    "Tener : tengo (irrégulier), tienes, tiene, tenemos, tenéis, tienen (e → ie, sauf nosotros et vosotros). Ser est irrégulier partout : soy, eres, es, somos, sois, son.",
    { encabezado: ['Pronombre', 'tener', 'ser'], filas: [['yo', 'tengo', 'soy'], ['tú', 'tienes', 'eres'], ['él / ella', 'tiene', 'es'], ['nosotros', 'tenemos', 'somos'], ['vosotros', 'tenéis', 'sois'], ['ellos / ellas', 'tienen', 'son']] }),
  ];

  // ───────────── Cinemáticas ─────────────
  const intro = cine('u03-intro', 'intro', 'Capítulo 3 · Mi familia · Sevilla', [
    P(3, "Carte d’Espagne : la ligne dorée descend de Madrid vers Sevilla ; carte-titre « Capítulo 3 · Mi familia · Sevilla ».", [L(N, 'Capítulo tres: mi familia.', 'Chapitre trois : ma famille.')], { rotulo: 'Capítulo 3 · Mi familia · Sevilla', camara: 'zoom avant sur la carte' }),
    P(5, "Triana à l’heure dorée : façades blanches, azulejos, orangers, la Giralda en silhouette au loin, le Guadalquivir.", [L(N, 'Sevilla, la ciudad de los azulejos.', 'Séville, la ville des azulejos.'), L(N, 'Aquí vive la familia de Marina.', 'Ici vit la famille de Marina.')], { camara: 'travelling au-dessus du fleuve' }),
  ]);
  const historia = cine('u03-historia', 'historia', 'El árbol sin nombres', [
    P(7, "Ruelle étroite de Triana, façades blanches, azulejos colorés, pots de fleurs. Marina court vers une porte bleue ; Álex la suit.", [
      L('marina', '¡Abuela! ¡Ya estamos aquí!', 'Grand-mère ! On est là !'),
      L('abuela_carmen', '¡Marina, cariño! ¡Qué alegría!', 'Marina, mon chou ! Quelle joie !'),
    ], { personajes: ['marina', 'abuela_carmen', 'viajero'], camara: 'suivi à hauteur d’enfant' }),
    P(7, "Patio andalou : fontaine, géraniums, sol en mosaïque. Abuela Carmen serre Marina dans ses bras. Lola arrive en courant avec un chat orange.", [
      L('abuela_carmen', 'Y este chico, ¿quién es?', 'Et ce garçon, qui est-ce ?'),
      L('viajero', 'Hola, me llamo Álex. Encantado.', 'Salut, je m’appelle Álex. Enchanté.'),
      L('lola', '¿Cómo te llamas? ¿De dónde eres? ¿Cuántos años tienes?', 'Comment tu t’appelles ? D’où viens-tu ? Quel âge as-tu ?'),
    ], { personajes: ['abuela_carmen', 'marina', 'lola', 'viajero'] }),
    P(7, "Atelier de céramique : au fond, une grande fresque d’azulejos « El árbol de la familia ». Les noms sont effacés par des taches d’ombre noire.", [
      L('abuela_carmen', 'Mira, es el árbol de nuestra familia. ¡Pero los nombres no están!', 'Regarde, c’est l’arbre de notre famille. Mais les noms ne sont plus là !'),
      L('sombra', 'Sin nombres, no hay familia…', 'Sans noms, pas de famille…'),
    ], { personajes: ['abuela_carmen', 'sombra'], musica: 'tension douce, guitare espagnole' }),
    P(7, "Gros plan sur le Quetzal : un carreau vert brille au centre de la fresque. Tío Rafa entre avec une guitare et une casserole.", [
      L('quetzal', 'La pluma… aquí. En el árbol.', 'La plume… ici. Dans l’arbre.'),
      L('rafa', 'Soy el tío Rafa. ¡Soy cocinero y hay comida para todos!', 'Je suis l’oncle Rafa. Je suis cuisinier et il y a à manger pour tout le monde !'),
    ], { personajes: ['quetzal', 'rafa'], musica: 'thème d’aventure, guitare' }),
  ]);
  const capsula = cine('u03-capsula-familias', 'capsula', 'Familias del mundo hispano', [
    P(5, "Table de famille nombreuse : grands-parents, parents, enfants, oncles, cousins qui mangent ensemble (style explainer, papier découpé).", [L(N, 'En muchas familias hispanas, los abuelos, los tíos y los primos comen juntos el domingo.', 'Dans beaucoup de familles hispaniques, les grands-parents, oncles et cousins mangent ensemble le dimanche.')], { camara: 'plan fixe, animations de papier découpé' }),
    P(5, "Un nom s’affiche : « Marina Ortega García » ; deux flèches colorées pointent « apellido del padre » et « apellido de la madre ».", [L(N, 'En España, las personas tienen dos apellidos: el del padre y el de la madre.', 'En Espagne, les gens ont deux noms de famille : celui du père et celui de la mère.')]),
    P(5, "Patio andalou : plantes, fontaine, carreaux de Triana.", [L(N, 'En Sevilla, muchas casas tienen un patio con flores y azulejos.', 'À Séville, beaucoup de maisons ont un patio avec des fleurs et des azulejos.')]),
    P(4, "Une mosaïque d’azulejos dessine un arbre ; une plume verte apparaît au centre.", [L(N, 'Y en cada azulejo hay una historia de familia.', 'Et sur chaque azulejo, il y a une histoire de famille.')]),
  ]);
  const pluma = cine('u03-pluma', 'pluma', 'Tercera pluma', [
    P(3, "La fresque d’azulejos retrouve tous ses noms dans une lumière dorée ; une plume verte se détache du carreau central.", [L('abuela_carmen', '¡Los nombres! ¡Gracias, cariño!', 'Les noms ! Merci, mon chou !')], { personajes: ['abuela_carmen'] }),
    P(3, "Le Quetzal s’envole pour la première fois et fait un tour du patio.", [L('quetzal', 'Tres plumas. ¡Puedo volar un poco!', 'Trois plumes. Je peux voler un peu !')], { personajes: ['quetzal'] }),
    P(2, "Sur la carte, une trajectoire lumineuse traverse l’océan vers l’ouest : México.", [L('marina', '¡Ahora, a México!', 'Maintenant, direction le Mexique !')], { personajes: ['marina'] }),
  ]);

  const quests = [];

  // 1 — Cinemática
  quests.push(quest('u03', 1, 'cinematica', 'Llegada a Sevilla', '🌇',
    ['marina', '¡Mi ciudad! Vamos a casa de mi abuela.', 'Ma ville ! Allons chez ma grand-mère.'],
    'Arrivée à Séville dans la famille de Marina ; l’histoire du Quetzal avance.', ['escuchar', 'cultura', 'hablar'], 10, [
      intro,
      tf('Marina es de Sevilla.', true, N, { tr: 'Marina est de Séville.' }),
      tf('La abuela de Marina vive en Madrid.', false, N, { tr: 'La grand-mère de Marina habite à Madrid.' }),
      historia,
      lcT('Tengo seis años y un gato.', 'lola', ['Lola tiene seis años.', 'Lola tiene dieciséis años.', 'Lola tiene un perro.'], 0),
      dlg('abuela_carmen', '¡Hola, cariño! ¿Cómo te llamas?', 'Salut, mon chou ! Comment tu t’appelles ?', [
        ['Me llamo Álex. Encantado.', 1, '¡Encantada, Álex! Estás en tu casa.', 'Enchantée, Álex ! Tu es chez toi.', 'Je m’appelle Álex. Enchanté.'],
        ['Soy Marina.', 0, 'Marina es mi nieta. ¿Y tú?', 'Marina est ma petite-fille. Et toi ?', 'Je suis Marina.'],
        ['Adiós.', 0, '¿Adiós? ¡Pero si acabas de llegar!', 'Au revoir ? Mais tu viens d’arriver !', 'Au revoir.'],
      ]),
      dlg('lola', 'Hola. ¿De dónde eres?', 'Salut. D’où viens-tu ?', [
        ['Soy de París. Soy francés.', 1, '¡París! ¿Hay gatos en París?', 'Paris ! Il y a des chats à Paris ?', 'Je suis de Paris. Je suis français.'],
        ['Tengo seis años.', 0, '¡Yo también tengo seis años! Pero ¿de dónde eres?', 'Moi aussi, j’ai six ans ! Mais d’où viens-tu ?', 'J’ai six ans.'],
        ['Me llamo gato.', 0, 'No, mi gato se llama Churro.', 'Non, mon chat s’appelle Churro.', 'Je m’appelle chat.'],
      ]),
      tf('Rafa es cocinero.', true, N, { tr: 'Rafa est cuisinier.' }),
      tf('El árbol de la familia tiene todos los nombres.', false, N, { tr: 'L’arbre de la famille a tous les noms.' }),
      reord('Esta es mi casa.', 'abuela_carmen', { tr: 'Voici ma maison.' }),
      speak('Encantado, me llamo Álex.', 'viajero', { tr: 'Enchanté, je m’appelle Álex. (dis ton prénom)', nombre: 'Álex', hechizo: ['Hechizo de la bienvenida', 'Los azulejos del patio brillan de colores'] }),
    ]));

  // 2 — Árbol genealógico
  quests.push(quest('u03', 2, 'vocabulario', 'El árbol genealógico', '👪',
    ['abuela_carmen', 'Cariño, aquí está el árbol de nuestra familia. ¿Conoces a todos?', 'Mon chou, voici l’arbre de notre famille. Tu connais tout le monde ?'],
    'La famille et les possessifs (mi, tu, su) pour nommer les membres de sa famille.', ['leer', 'escribir', 'hablar'], 14, [
      flash('familia', 'padres', 'madre', 'padre', 'abuelo', 'abuela'),
      flash('hermano', 'hermana', 'tio', 'tia', 'primo', 'prima'),
      lcV('madre', ['madre', 'abuela', 'padre']),
      match(['padre', 'madre', 'abuelo', 'abuela', 'familia', 'prima']),
      flash('foto', 'arbol', 'apellido'),
      flash('mi', 'tu_pos', 'su', 'nuestro'),
      gram('g_posesivos'),
      fill('___ madre se llama Ana.', 'Mi', 'marina', { opts: ['Mi', 'Mis', 'Mí'], tr: 'Ma mère s’appelle Ana.' }),
      fill('¿Cómo se llama ___ padre?', 'tu', 'lola', { opts: ['tu', 'tus', 'tú'], tr: 'Comment s’appelle ton père ?' }),
      fill('Mis ___ viven en Madrid.', 'padres', 'marina', { opts: ['padre', 'padres', 'madre'], tr: 'Mes parents habitent à Madrid.' }),
      reord('Mi abuela se llama Carmen.', 'marina', { tr: 'Ma grand-mère s’appelle Carmen.' }),
      dlg('lola', '¿Cómo se llama tu madre?', 'Comment s’appelle ta mère ?', [
        ['Mi madre se llama Claire.', 1, '¡Qué nombre más bonito!', 'Quel joli prénom !', 'Ma mère s’appelle Claire.'],
        ['Mi madre tiene doce años.', 0, '¿Doce años? ¡Tu madre es muy joven!', 'Douze ans ? Ta mère est très jeune !', 'Ma mère a douze ans.'],
        ['Soy madre.', 0, 'Tú no eres madre: eres un chico.', 'Tu n’es pas une mère : tu es un garçon.', 'Je suis mère.'],
      ]),
      dict('mi abuelo', 'marina', { acept: ['mi abuelo'] }),
      tf('La madre de mi madre es mi abuela.', true, 'marina', { tr: 'La mère de ma mère est ma grand-mère.' }),
      speak('Mi madre se llama Ana y mi padre se llama Javier.', 'marina', { tr: 'Ma mère s’appelle Ana et mon père s’appelle Javier.', hechizo: ['Hechizo del árbol', 'Los nombres brillan en las hojas del árbol'] }),
    ]));

  // 3 — Fotos de familia
  quests.push(quest('u03', 3, 'escucha', 'Fotos de familia', '📷',
    ['lola', '¡Mira, mira! ¡Tengo fotos! ¿Quieres ver a mi familia?', 'Regarde, regarde ! J’ai des photos ! Tu veux voir ma famille ?'],
    'Les animaux et les métiers de la famille ; tu comprends des descriptions de photos.', ['escuchar', 'leer', 'hablar'], 14, [
      flash('perro', 'gato'),
      flash('medico', 'ingeniero', 'cocinero', 'policia'),
      flash('bombero', 'artista', 'conductor', 'panadero'),
      gram('g_profesion'),
      lcV('medico', ['medico', 'cocinero', 'policia']),
      match(['medico', 'cocinero', 'policia', 'bombero', 'artista', 'panadero']),
      lcT('Mi madre es médica y trabaja en un hospital.', 'marina', ['La madre de Marina es médica.', 'La madre de Marina es cocinera.', 'La madre de Marina es policía.'], 0),
      lcT('Mi padre es ingeniero.', 'marina', ['El padre de Marina es médico.', 'El padre de Marina es ingeniero.', 'El padre de Marina es bombero.'], 1),
      lcT('Soy artista. Pinto azulejos.', 'abuela_carmen', ['Carmen es artista.', 'Carmen es conductora.', 'Carmen es médica.'], 0),
      read('Esta es mi familia. Mi padre se llama Javier y es ingeniero. Mi madre se llama Ana y es médica. Mi tío Rafa es cocinero. Mi tía Elena es policía. Mi abuela Carmen es artista.', 'marina',
        'Voici ma famille. Mon père s’appelle Javier et il est ingénieur. Ma mère s’appelle Ana et elle est médecin. Mon oncle Rafa est cuisinier. Ma tante Elena est policière. Ma grand-mère Carmen est artiste.', [
          ['¿Cómo se llama el padre de Marina?', 'Comment s’appelle le père de Marina ?', ['Javier.', 'Rafa.', 'Pablo.'], 0],
          ['¿Qué es Ana?', 'Quel est le métier d’Ana ?', ['Médica.', 'Policía.', 'Cocinera.'], 0],
          ['¿Quién es cocinero?', 'Qui est cuisinier ?', ['Rafa.', 'Javier.', 'Carmen.'], 0],
        ]),
      fill('Mi tía Elena es ___.', 'policía', 'marina', { opts: ['policía', 'policío', 'policías'], tr: 'Ma tante Elena est policière.' }),
      fill('Mi tío Rafa es ___.', 'cocinero', 'marina', { opts: ['cocinero', 'cocinera', 'cocineros'], tr: 'Mon oncle Rafa est cuisinier.' }),
      reord('Mi padre es ingeniero.', 'marina', { tr: 'Mon père est ingénieur.' }),
      dlg('lola', '¿Tienes un perro o un gato?', 'Tu as un chien ou un chat ?', [
        ['Tengo un gato.', 1, '¡Qué bien! Mi gato se llama Churro.', 'Super ! Mon chat s’appelle Churro.', 'J’ai un chat.'],
        ['Soy un perro.', 0, '¡Guau, guau! ¿De verdad?', 'Ouaf, ouaf ! Vraiment ?', 'Je suis un chien.'],
        ['Hola, buenas tardes.', 0, 'Hola… pero ¿perro o gato?', 'Salut… mais chien ou chat ?', 'Salut, bon après-midi.'],
      ]),
      speak('Mi madre es médica y mi padre es ingeniero.', 'marina', { tr: 'Ma mère est médecin et mon père est ingénieur.', hechizo: ['Hechizo de la profesión', 'Una bata blanca y un casco aparecen en el aire'] }),
    ]));

  // 4 — Forja -er / -ir
  quests.push(quest('u03', 4, 'forja', 'La Forja: comer, vivir, tener', '⚒️',
    ['quetzal', 'Comer, vivir… verbos importantes. ¡Forja, amigo!', 'Manger, habiter… des verbes importants. Forge, mon ami !'],
    'Le présent des verbes en -er / -ir, puis tener et ser.', ['escribir', 'leer'], 14, [
      flash('comer', 'beber', 'vivir', 'leer', 'escribir', 'compartir', 'trabajar'),
      gram('g_er_ir'),
      conj('comer', 'yo', 'com', 'o', ['o', 'es', 'e'], 'rafa', { tr: 'Moi, je mange…' }),
      conj('comer', 'tú', 'com', 'es', ['o', 'es', 'e'], 'rafa', { tr: 'Toi, tu manges…' }),
      conj('comer', 'ella', 'com', 'e', ['o', 'es', 'e'], 'marina', { tr: 'Elle mange…' }),
      conj('comer', 'nosotros', 'com', 'emos', ['emos', 'imos', 'en'], 'rafa', { tr: 'Nous, nous mangeons…' }),
      conj('vivir', 'yo', 'viv', 'o', ['o', 'es', 'e'], 'marina', { tr: 'Moi, j’habite…' }),
      conj('vivir', 'nosotros', 'viv', 'imos', ['emos', 'imos', 'en'], 'marina', { tr: 'Nous, nous habitons…' }),
      conj('vivir', 'ellos', 'viv', 'en', ['emos', 'imos', 'en'], 'marina', { tr: 'Eux, ils habitent…' }),
      fill('Mi madre ___ en un hospital.', 'trabaja', 'marina', { opts: ['trabajo', 'trabajas', 'trabaja'], tr: 'Ma mère travaille dans un hôpital.' }),
      gram('g_tener_ser'),
      conj('tener', 'nosotros', 'ten', 'emos', ['emos', 'imos', 'en'], 'lola', { tr: 'Nous, nous avons…' }),
      conj('ser', 'nosotros', '', 'somos', ['somos', 'sois', 'son'], 'rafa', { tr: 'Nous, nous sommes…' }),
      fill('Mi abuelo ___ en Sevilla.', 'vive', 'marina', { opts: ['vivo', 'vives', 'vive'], tr: 'Mon grand-père habite à Séville.' }),
      fill('Mis padres ___ en Madrid.', 'viven', 'marina', { opts: ['viven', 'vive', 'vivimos'], tr: 'Mes parents habitent à Madrid.' }),
    ]));

  // 5 — Casa
  quests.push(quest('u03', 5, 'lectura', 'La casa de la abuela', '🏡',
    ['rafa', 'Bienvenido a la casa de mi madre. ¡Aquí se come muy bien!', 'Bienvenue chez ma mère. Ici, on mange très bien !'],
    'Les pièces de la maison et quelques adjectifs ; lecture et écriture guidée.', ['leer', 'escribir', 'escuchar'], 14, [
      flash('casa', 'salon', 'cocina', 'dormitorio', 'bano', 'jardin', 'patio'),
      flash('mayor', 'pequeno', 'grande'),
      lcV('cocina', ['cocina', 'dormitorio', 'bano']),
      match(['casa', 'salon', 'cocina', 'dormitorio', 'bano', 'jardin']),
      lcT('En mi casa hay un patio con flores.', 'abuela_carmen', ['La casa de Carmen tiene un patio.', 'La casa de Carmen tiene un jardín.', 'La casa de Carmen no tiene patio.'], 0),
      read('La casa de mi abuela es grande. Hay un salón, una cocina, tres dormitorios y un patio con flores. En el patio comemos todos los domingos. Mi abuela es artista y su taller está en la casa.', 'marina',
        'La maison de ma grand-mère est grande. Il y a un salon, une cuisine, trois chambres et un patio avec des fleurs. Dans le patio, nous mangeons tous les dimanches. Ma grand-mère est artiste et son atelier est dans la maison.', [
          ['¿Cómo es la casa?', 'Comment est la maison ?', ['Grande.', 'Pequeña.', 'Muy mayor.'], 0],
          ['¿Cuántos dormitorios hay?', 'Combien de chambres y a-t-il ?', ['Dos.', 'Tres.', 'Cuatro.'], 1],
          ['¿Dónde comen los domingos?', 'Où mangent-ils les dimanches ?', ['En el salón.', 'En el patio.', 'En la cocina.'], 1],
        ]),
      fill('El tío Rafa cocina en la ___.', 'cocina', 'marina', { opts: ['cocina', 'dormitorio', 'patio'], tr: 'L’oncle Rafa cuisine dans la cuisine.' }),
      fill('Mi abuelo tiene cien años. ¡Es muy ___!', 'mayor', 'marina', { opts: ['mayor', 'pequeño', 'grande'], tr: 'Mon grand-père a cent ans. Il est très âgé !' }),
      dict('En el patio hay flores.', 'abuela_carmen', { acept: ['en el patio hay flores'] }),
      reord('Mi casa tiene un jardín grande.', 'marina', { tr: 'Ma maison a un grand jardin.' }),
      tf('En la casa de la abuela hay un patio.', true, N, { img: 'patio', tr: 'Dans la maison de la grand-mère, il y a un patio.' }),
      dlg('rafa', '¿Cómo es tu casa?', 'Comment est ta maison ?', [
        ['Mi casa es grande. Hay un jardín.', 1, '¡Qué bien! Una casa con jardín es un tesoro.', 'Super ! Une maison avec jardin, c’est un trésor.', 'Ma maison est grande. Il y a un jardin.'],
        ['Mi casa se llama jardín.', 0, 'Ja, ja… Una casa con nombre de planta.', 'Haha… Une maison avec un nom de plante.', 'Ma maison s’appelle jardin.'],
        ['Tengo una casa de doce años.', 0, 'Una casa de doce años… ¡es nueva!', 'Une maison de douze ans… elle est neuve !', 'J’ai une maison de douze ans.'],
      ]),
      writeFree('Mi casa es ___. En mi casa hay ___.', [
        { id: 'adjetivo', pista: 'Comment est ta maison ? (grande, pequeña…)', tipo: 'texto' },
        { id: 'hay', pista: 'Ce qu’il y a chez toi, avec l’article ou le nombre : un salón, una cocina, dos dormitorios, un jardín…', tipo: 'texto' },
      ], 'Mi casa es grande. En mi casa hay un salón, una cocina y tres dormitorios.', 'Ma maison est grande. Chez moi, il y a un salon, une cuisine et trois chambres.'),
      speak('En mi casa hay un salón.', 'viajero', { libre: 'un salón', es: 'Escucha y di una cosa que hay en TU casa.', fr: 'Écoute et dis une pièce qu’il y a chez TOI (avec un / una : una cocina, un baño…).', tr: 'Chez moi, il y a un salon. (dis ce qu’il y a chez toi)', hechizo: ['Hechizo de la casa', 'Las paredes se llenan de muebles dorados'] }),
    ]));

  // 6 — Diálogo
  quests.push(quest('u03', 6, 'dialogo', 'Presento a mi familia', '💬',
    ['marina', 'Ahora tú presentas a tu familia. ¡Yo te ayudo!', 'Maintenant, c’est toi qui présentes ta famille. Je t’aide !'],
    'Parler de sa famille : combien de frères et sœurs, métiers, où l’on habite.', ['hablar', 'escribir', 'escuchar'], 15, [
      flash('cuantos', 'tambien'),
      dlg('lola', '¿Cuántos hermanos tienes?', 'Combien de frères et sœurs as-tu ?', [
        ['Tengo un hermano.', 1, '¡Un hermano! Yo no tengo hermanos.', 'Un frère ! Moi, je n’ai pas de frères et sœurs.', 'J’ai un frère.'],
        ['Tengo dos hermanas.', 1, '¡Dos hermanas! ¡Qué suerte!', 'Deux sœurs ! Quelle chance !', 'J’ai deux sœurs.'],
        ['No tengo hermanos.', 1, '¡Como yo! Pero tengo un gato.', 'Comme moi ! Mais j’ai un chat.', 'Je n’ai pas de frères et sœurs.'],
        ['Soy de Francia.', 0, 'Eso ya lo sé. ¿Cuántos hermanos?', 'Ça, je le sais déjà. Combien de frères et sœurs ?', 'Je suis de France.'],
      ]),
      dlg('rafa', '¿Cómo se llama tu padre? ¿En qué trabaja?', 'Comment s’appelle ton père ? Quel est son métier ?', [
        ['Mi padre se llama Paul y es ingeniero.', 1, '¡Ingeniero! Entonces sabe hacer cosas.', 'Ingénieur ! Alors il sait construire des choses.', 'Mon père s’appelle Paul et il est ingénieur.'],
        ['Mi padre soy yo.', 0, 'Ja, ja… No, tu padre es otra persona.', 'Haha… Non, ton père est quelqu’un d’autre.', 'Mon père, c’est moi.'],
        ['Mi padre tiene un gato y una casa.', 0, 'Está bien, pero ¿cómo se llama?', 'D’accord, mais comment s’appelle-t-il ?', 'Mon père a un chat et une maison.'],
      ]),
      dlg('abuela_carmen', '¿Dónde vive tu familia, cariño?', 'Où habite ta famille, mon chou ?', [
        ['Mi familia vive en París.', 1, '¡París! Algún día voy a verla.', 'Paris ! Un jour, j’irai la voir.', 'Ma famille habite à Paris.'],
        ['Mi familia se llama París.', 0, '¿Tu familia se llama París? ¡Qué apellido tan raro!', 'Ta famille s’appelle Paris ? Quel drôle de nom !', 'Ma famille s’appelle Paris.'],
        ['Vivo en mi familia.', 0, 'No, cariño: vives en una casa.', 'Non, mon chou : tu habites dans une maison.', 'J’habite dans ma famille.'],
      ]),
      dlg('marina', 'Esta es mi familia: mis padres, mi hermano Pablo y yo. ¿Y tu familia?', 'Voici ma famille : mes parents, mon frère Pablo et moi. Et ta famille ?', [
        ['En mi familia somos cuatro: mis padres, mi hermana y yo.', 1, '¡Como mi familia! Nosotros también somos cuatro.', 'Comme ma famille ! Nous aussi, nous sommes quatre.', 'Dans ma famille, nous sommes quatre : mes parents, ma sœur et moi.'],
        ['Mi familia es un perro.', 0, 'Un perro es un buen amigo, pero no es toda la familia.', 'Un chien est un bon ami, mais pas toute la famille.', 'Ma famille, c’est un chien.'],
        ['Hola, me llamo Marina.', 0, '¡Marina me llamo yo! ¡No me copies!', 'Marina, c’est moi ! Ne me copie pas !', 'Salut, je m’appelle Marina.'],
      ]),
      lcT('Mi hermano Pablo tiene ocho años y también tiene un gato.', 'marina', ['El hermano de Marina tiene ocho años y un gato.', 'El hermano de Marina tiene doce años y un perro.', 'El hermano de Marina tiene ocho años y un perro.'], 0),
      lcT('Mi gato se llama Churro y mi prima se llama Marina.', 'lola', ['El gato de Lola se llama Marina.', 'El gato de Lola se llama Churro.', 'La prima de Lola se llama Churro.'], 1),
      reord('¿Cuántos hermanos tienes?', 'lola', { tr: 'Combien de frères et sœurs as-tu ?' }),
      speak('Mi madre se llama Claire.', 'viajero', { nombre: 'Claire', es: 'Escucha y di cómo se llama TU madre.', fr: 'Écoute et dis comment s’appelle TA mère.', tr: 'Ma mère s’appelle Claire. (dis le prénom de ta mère)', hechizo: ['Hechizo de la madre', 'Una hoja del árbol se ilumina'] }),
      speak('Tengo un hermano.', 'viajero', { libre: 'un hermano', acept: ['no tengo hermanos'], es: 'Escucha y di cuántos hermanos tienes TÚ.', fr: 'Écoute et dis combien de frères et sœurs tu as TOI (tengo dos hermanas… ou no tengo hermanos).', tr: 'J’ai un frère. (dis ta vraie situation)', hechizo: ['Hechizo de los hermanos', 'Dos hojas más aparecen en el árbol'] }),
      fill('Yo tengo un gato y Lola ___ tiene un gato.', 'también', 'marina', { opts: ['también', 'cuántos', 'mayor'], tr: 'J’ai un chat et Lola a aussi un chat.' }),
      fill('Mis abuelos ___ en Sevilla.', 'viven', 'marina', { opts: ['vive', 'viven', 'vivimos'], tr: 'Mes grands-parents habitent à Séville.' }),
      dict('Tengo un hermano pequeño.', 'viajero', { acept: ['tengo un hermano pequeño'] }),
      writeFree('En mi familia somos ___. Mi ___ es ___.', [
        { id: 'familia_numero', pista: 'Combien vous êtes dans ta famille, toi compris (en lettres : tres, cuatro…)', tipo: 'texto' },
        { id: 'familiar', pista: 'Une personne de ta famille (madre, padre, hermano, abuela, tío…)', tipo: 'texto' },
        { id: 'profesion', pista: 'Son métier, au féminin si c’est une femme (médica, cocinera, policía…)', tipo: 'texto' },
      ], 'En mi familia somos cuatro. Mi madre es médica.', 'Dans ma famille, nous sommes quatre. Ma mère est médecin.'),
      speak('En mi familia somos cuatro.', 'viajero', { libre: 'cuatro', es: 'Escucha y di cuántos sois en TU familia.', fr: 'Écoute et dis combien vous êtes dans TA famille (somos tres, cinco…).', tr: 'Dans ma famille, nous sommes quatre. (dis le nombre chez toi)', acept: ['en mi familia somos 4'], hechizo: ['Hechizo de la familia', 'Los nombres vuelven al árbol, uno a uno'] }),
    ]));

  // 7 — Cultura
  quests.push(quest('u03', 7, 'cultura', 'Familias del mundo hispano', '🌍',
    ['abuela_carmen', 'En España tenemos dos apellidos. ¡Y en Sevilla, patios con flores!', 'En Espagne, nous avons deux noms de famille. Et à Séville, des patios fleuris !'],
    'Portraits de familles : deux noms de famille (un du père, un de la mère ; depuis 2017 les parents choisissent l’ordre, mais le plus souvent celui du père vient en premier), repas du dimanche, patios et azulejos de Séville.', ['cultura', 'leer', 'escuchar'], 12, [
      capsula,
      tf('En España las personas tienen dos apellidos.', true, N, { tr: 'En Espagne, les gens ont deux noms de famille.' }),
      tf('Los dos apellidos son los dos del padre.', false, N, { tr: 'Les deux noms de famille sont les deux du père.' }),
      tf('En muchas casas de Sevilla hay un patio.', true, N, { tr: 'Dans beaucoup de maisons de Séville, il y a un patio.' }),
      read('Me llamo Marina Ortega García. Ortega es el apellido de mi padre. García es el apellido de mi madre. Los domingos comemos juntos: mis abuelos, mis tíos, mis primos y yo.', 'marina',
        'Je m’appelle Marina Ortega García. Ortega est le nom de famille de mon père. García est le nom de famille de ma mère. Le dimanche, nous mangeons ensemble : mes grands-parents, mes oncles, mes cousins et moi.', [
          ['¿Cuál es el apellido del padre de Marina?', 'Quel est le nom de famille du père de Marina ?', ['Ortega.', 'García.'], 0],
          ['¿Cuándo comen todos juntos?', 'Quand mangent-ils tous ensemble ?', ['El domingo.', 'El lunes.', 'El viernes.'], 0],
          ['¿Quién come con Marina?', 'Qui mange avec Marina ?', ['Su familia.', 'Sus profesores.', 'Sus compañeros.'], 0],
        ]),
      lcT('Me llamo Lucía Ruiz Pérez.', N, ['Su primer apellido es Ruiz.', 'Su primer apellido es Pérez.', 'Su nombre es Pérez.'], 0),
      fill('Marina Ortega García tiene ___ apellidos.', 'dos', N, { opts: ['uno', 'dos', 'tres'], tr: 'Marina Ortega García a deux noms de famille.' }),
      dlg('abuela_carmen', 'En mi casa, los domingos comemos todos juntos. ¿Y en tu casa?', 'Chez moi, le dimanche, nous mangeons tous ensemble. Et chez toi ?', [
        ['Nosotros también comemos juntos los domingos.', 1, '¡Qué bien, cariño! La familia es lo primero.', 'Super, mon chou ! La famille, c’est le plus important.', 'Nous aussi, nous mangeons ensemble le dimanche.'],
        ['No, el domingo no comemos juntos.', 1, 'Bueno, cada familia es diferente, cariño.', 'Bon, chaque famille est différente, mon chou.', 'Non, le dimanche, nous ne mangeons pas ensemble.'],
        ['Mi casa come el domingo.', 0, '¿Tu casa come? ¡Qué casa más rara!', 'Ta maison mange ? Quelle drôle de maison !', 'Ma maison mange le dimanche.'],
      ]),
      reord('Tengo dos apellidos.', 'marina', { tr: 'J’ai deux noms de famille.' }),
      dict('mis abuelos, mis tíos y mis primos', 'marina', { acept: ['mis abuelos mis tíos y mis primos'] }),
      fill('Los domingos, mi familia y yo ___ juntos.', 'comemos', 'marina', { opts: ['como', 'comemos', 'comen'], tr: 'Le dimanche, ma famille et moi, nous mangeons ensemble.' }),
      lcV('abuela', ['abuelo', 'abuela', 'madre']),
      speak('Los domingos comemos con mi familia.', 'marina', { tr: 'Le dimanche, nous mangeons avec ma famille.', hechizo: ['Hechizo del domingo', 'Una mesa enorme aparece en el patio'] }),
    ]));

  // 8 — Desafío
  quests.push(quest('u03', 8, 'desafio', 'El árbol sin nombres', '🌳',
    ['sombra', 'Sin nombres no hay familia. Sin familia no hay palabras.', 'Sans noms, pas de famille. Sans famille, pas de mots.'],
    'Boss de Séville : révision mixte des unités 1 à 3 pour rendre ses noms à l’arbre.', ['escuchar', 'hablar', 'leer', 'escribir'], 15, [
      dlg('sombra', 'Sin nombres no hay familia. ¿Cómo se llama tu madre?', 'Sans noms, pas de famille. Comment s’appelle ta mère ?', [
        ['Mi madre se llama Claire.', 1, '¡Grr! Un nombre más para el árbol…', 'Grr ! Un nom de plus pour l’arbre…', 'Ma mère s’appelle Claire.'],
        ['Mi madre soy yo.', 0, 'No. Tú eres su hijo.', 'Non. Tu es son fils.', 'Ma mère, c’est moi.'],
        ['Tengo doce años.', 0, 'No te pregunto la edad.', 'Je ne te demande pas ton âge.', 'J’ai douze ans.'],
      ]),
      dlg('sombra', '¿Tienes hermanos?', 'As-tu des frères et sœurs ?', [
        ['Sí, tengo un hermano.', 1, 'Otro nombre… ¡Basta!', 'Un autre nom… Ça suffit !', 'Oui, j’ai un frère.'],
        ['Mi hermano es un jardín.', 0, '¿Un jardín? Qué tontería.', 'Un jardin ? Quelle bêtise.', 'Mon frère est un jardin.'],
        ['Adiós, buenas noches.', 0, 'No te vas sin responder.', 'Tu ne pars pas sans répondre.', 'Au revoir, bonne nuit.'],
      ]),
      lcV('abuelo', ['abuelo', 'abuela', 'padre']),
      lcT('Mi tío es bombero y mi tía es policía.', 'sombra', ['Su tío es bombero y su tía es policía.', 'Su tío es policía y su tía es bombera.', 'Su tío es cocinero.'], 0),
      match(['madre', 'padre', 'perro', 'gato', 'casa', 'jardin']),
      fill('Mis ___ viven en Sevilla.', 'abuelos', 'marina', { opts: ['abuelo', 'abuelos', 'abuela'], tr: 'Mes grands-parents habitent à Séville.' }),
      fill('Mi madre es ___ y mi padre es cocinero.', 'ingeniera', 'marina', { opts: ['ingeniero', 'ingeniera', 'ingenieras'], tr: 'Ma mère est ingénieure et mon père est cuisinier.' }),
      conj('vivir', 'tú', 'viv', 'es', ['o', 'es', 'e'], 'rafa', { tr: 'Toi, tu habites…' }),
      conj('comer', 'nosotros', 'com', 'emos', ['emos', 'imos', 'en'], 'rafa', { tr: 'Nous, nous mangeons…' }),
      conj('tener', 'ellos', 'tien', 'en', ['emos', 'en', 'e'], 'rafa', { tr: 'Eux, ils ont…' }),
      reord('Mis abuelos viven en una casa con patio.', 'abuela_carmen', { tr: 'Mes grands-parents habitent dans une maison avec un patio.' }),
      dict('Mi familia es grande.', 'marina', { acept: ['mi familia es grande'] }),
      read('Hola, soy Lola. Tengo seis años. Mi padre se llama Rafa y es cocinero. Mi madre es policía. Tengo un gato. Se llama Churro.', 'lola',
        'Salut, c’est Lola. J’ai six ans. Mon père s’appelle Rafa et il est cuisinier. Ma mère est policière. J’ai un chat. Il s’appelle Churro.', [
          ['¿Cuántos años tiene Lola?', 'Quel âge a Lola ?', ['Cinco.', 'Seis.', 'Ocho.'], 1],
          ['¿Qué es la madre de Lola?', 'Quel est le métier de la mère de Lola ?', ['Policía.', 'Panadera.', 'Médica.'], 0],
          ['¿Cómo se llama su gato?', 'Comment s’appelle son chat ?', ['Churro.', 'Pablo.', 'Toby.'], 0],
        ]),
      speak('Mi familia es grande y mi casa tiene un patio.', 'marina', { tr: 'Ma famille est grande et ma maison a un patio.', hechizo: ['Hechizo final', '¡Los nombres vuelven al árbol y la Sombra se rompe!'] }),
      pluma,
    ], { jefe: { personaje: 'sombra', vidas: 8 } }));

  return {
    id: 'u03', numero: 3, titulo: 'Mi familia', lugar: 'Sevilla', emoji: '👪', ejes: [1], periodo: 'oct',
    objetivos: [
      { es: 'Presentar a los miembros de mi familia.', fr: 'Présenter les membres de ma famille.' },
      { es: 'Decir cuántos hermanos tengo y cómo se llaman mis padres.', fr: 'Dire combien de frères et sœurs j’ai et comment s’appellent mes parents.' },
      { es: 'Decir la profesión de una persona.', fr: 'Dire le métier d’une personne.' },
      { es: 'Describir brevemente mi casa.', fr: 'Décrire brièvement ma maison.' },
      { es: 'Usar mi, tu, su y los verbos en -er / -ir en frases sencillas.', fr: 'Utiliser mi, tu, su et les verbes en -er / -ir dans des phrases simples.' },
      { es: 'Descubrir cómo son las familias en el mundo hispano.', fr: 'Découvrir à quoi ressemblent les familles dans le monde hispanique.' },
    ],
    vocab, gramatica, quests,
    pluma: { numero: 3, nombre: 'Pluma de la Familia', descripcion: L('quetzal', 'Esta pluma es la familia. Tres plumas… ¡y vuelo!', 'Cette plume, c’est la famille. Trois plumes… et je vole !') },
  };
}
