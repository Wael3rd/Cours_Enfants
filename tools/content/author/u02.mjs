// Unidad 2 — Mi clase, mi cole (Salamanca)
import { W, G, quest, flash, match, lcV, lcI, lcT, dict, fill, reord, conj, dlg, read, speak, tf, gram, writeFree, cine, P, L, C, NARR } from './lib.mjs';

export default function build() {
  const N = NARR;

  // ───────────── Vocabulario (51) ─────────────
  const vocab = [
    // material
    W('libro', 'libro', 'livre', '📖', 'material', 'Abre el libro, por favor.', 'Ouvre le livre, s’il te plaît.', { genero: 'm', plural: 'libros' }),
    W('cuaderno', 'cuaderno', 'cahier', '📓', 'material', 'Escribe en el cuaderno.', 'Écris dans le cahier.', { genero: 'm', plural: 'cuadernos' }),
    W('boligrafo', 'bolígrafo', 'stylo à bille', '🖊️', 'material', 'Tengo un bolígrafo azul.', 'J’ai un stylo bleu.', { genero: 'm', plural: 'bolígrafos' }),
    W('lapiz', 'lápiz', 'crayon', '✏️', 'material', 'Tengo un lápiz y una goma.', 'J’ai un crayon et une gomme.', { genero: 'm', plural: 'lápices' }),
    W('goma', 'goma', 'gomme', null, 'material', 'Mi goma es rosa.', 'Ma gomme est rose.', { genero: 'f', plural: 'gomas', ilustracion: 'Une gomme à effacer rose, posée à côté d’un crayon' }),
    W('regla', 'regla', 'règle', '📏', 'material', 'La regla tiene treinta centímetros.', 'La règle fait trente centimètres.', { genero: 'f', plural: 'reglas' }),
    W('mochila', 'mochila', 'sac à dos, cartable', '🎒', 'material', 'Tengo libros en la mochila.', 'J’ai des livres dans le sac à dos.', { genero: 'f', plural: 'mochilas' }),
    W('estuche', 'estuche', 'trousse', null, 'material', 'En el estuche hay tres bolígrafos.', 'Dans la trousse, il y a trois stylos.', { genero: 'm', plural: 'estuches', ilustracion: 'Une trousse d’école ouverte avec des stylos colorés' }),
    W('pizarra', 'pizarra', 'tableau', null, 'material', 'Escribe en la pizarra.', 'Écris au tableau.', { genero: 'f', plural: 'pizarras', ilustracion: 'Un tableau noir avec une craie et le mot « hola »' }),
    W('silla', 'silla', 'chaise', '🪑', 'material', 'Una silla para Álex.', 'Une chaise pour Álex.', { genero: 'f', plural: 'sillas' }),
    W('mesa', 'mesa', 'table, bureau', null, 'material', 'El cuaderno está en la mesa.', 'Le cahier est sur la table.', { genero: 'f', plural: 'mesas', ilustracion: 'Une table d’école en bois avec un cahier ouvert' }),
    W('ordenador', 'ordenador', 'ordinateur', '💻', 'material', 'Hay un ordenador en la clase.', 'Il y a un ordinateur dans la classe.', { genero: 'm', plural: 'ordenadores' }),
    // asignaturas
    W('matematicas', 'matemáticas', 'mathématiques', '➗', 'asignaturas', 'El lunes tengo matemáticas.', 'Le lundi, j’ai maths.', { genero: 'f' }),
    W('lengua', 'lengua', 'langue (le cours d’espagnol des élèves espagnols, comme notre cours de français)', '🔤', 'asignaturas', 'El martes tengo lengua.', 'Le mardi, j’ai cours de langue (espagnol).', { genero: 'f' }),
    W('ingles', 'inglés', 'anglais', '🇬🇧', 'asignaturas', 'Mi profesor de inglés es muy simpático.', 'Mon prof d’anglais est très sympa.', { genero: 'm' }),
    W('historia', 'historia', 'histoire', '🏰', 'asignaturas', 'La historia de España es larga.', 'L’histoire de l’Espagne est longue.', { genero: 'f' }),
    W('geografia', 'geografía', 'géographie', '🗺️', 'asignaturas', 'En geografía miramos mapas.', 'En géographie, on regarde des cartes.', { genero: 'f' }),
    W('ciencias', 'ciencias', 'sciences', '🔬', 'asignaturas', 'En ciencias hay experimentos.', 'En sciences, il y a des expériences.', { genero: 'f' }),
    W('educacion_fisica', 'educación física', 'éducation physique (EPS)', '🏃', 'asignaturas', 'El viernes tengo educación física.', 'Le vendredi, j’ai EPS.', { genero: 'f' }),
    W('musica', 'música', 'musique', '🎵', 'asignaturas', 'En música cantamos.', 'En musique, on chante.', { genero: 'f' }),
    // consignas
    W('abre', 'abre', 'ouvre', '📂', 'consignas', 'Abre el libro.', 'Ouvre le livre.', { voz: 'pilar' }),
    W('cierra', 'cierra', 'ferme', '📕', 'consignas', 'Cierra la mochila.', 'Ferme le sac à dos.', { voz: 'pilar' }),
    W('escucha', 'escucha', 'écoute', '👂', 'consignas', 'Escucha el audio.', 'Écoute l’audio.', { voz: 'pilar' }),
    W('repite', 'repite', 'répète', '🔁', 'consignas', 'Repite conmigo.', 'Répète avec moi.', { voz: 'pilar' }),
    W('lee', 'lee', 'lis', '👓', 'consignas', 'Lee el texto en voz alta.', 'Lis le texte à voix haute.', { voz: 'pilar' }),
    W('escribe', 'escribe', 'écris', '✍️', 'consignas', 'Escribe tu nombre.', 'Écris ton prénom.', { voz: 'pilar' }),
    // clase
    W('clase', 'clase', 'classe, cours', null, 'colegio', 'La clase empieza a las nueve.', 'Le cours commence à neuf heures.', { genero: 'f', plural: 'clases', ilustracion: 'Une salle de classe lumineuse avec des tables et un tableau' }),
    W('cole', 'cole', 'école, collège (familier)', '🏫', 'colegio', 'El cole de Diego es muy antiguo.', 'L’école de Diego est très ancienne.', { genero: 'm' }),
    W('profesor', 'profesor', 'professeur', '🧑‍🏫', 'colegio', 'Doña Pilar es profesora.', 'Doña Pilar est professeure.', { genero: 'm', femenino: 'profesora' }),
    W('companero', 'compañero', 'camarade de classe', '👥', 'colegio', 'Marina es mi compañera de clase.', 'Marina est ma camarade de classe.', { genero: 'm', femenino: 'compañera' }),
    W('hoy', 'hoy', 'aujourd’hui', '📆', 'tiempo', 'Hoy es lunes.', 'Aujourd’hui, c’est lundi.'),
    W('cumpleanos', 'cumpleaños', 'anniversaire', '🥳', 'tiempo', 'Mi cumpleaños es en mayo.', 'Mon anniversaire est en mai.', { genero: 'm' }),
    // dias
    W('lunes', 'lunes', 'lundi', '🌙', 'dias', 'El lunes tengo matemáticas.', 'Le lundi, j’ai maths.', { genero: 'm' }),
    W('martes', 'martes', 'mardi', '🔴', 'dias', 'El martes tengo lengua.', 'Le mardi, j’ai cours de langue.', { genero: 'm' }),
    W('miercoles', 'miércoles', 'mercredi', '⚪', 'dias', 'El miércoles tengo inglés.', 'Le mercredi, j’ai anglais.', { genero: 'm' }),
    W('jueves', 'jueves', 'jeudi', '🟠', 'dias', 'El jueves tengo música.', 'Le jeudi, j’ai musique.', { genero: 'm' }),
    W('viernes', 'viernes', 'vendredi', '🟡', 'dias', 'El viernes tengo educación física.', 'Le vendredi, j’ai EPS.', { genero: 'm' }),
    W('sabado', 'sábado', 'samedi', '🪐', 'dias', 'El sábado no hay clase.', 'Le samedi, il n’y a pas cours.', { genero: 'm' }),
    W('domingo', 'domingo', 'dimanche', '☀️', 'dias', 'El domingo no hay cole.', 'Le dimanche, il n’y a pas école.', { genero: 'm' }),
    // meses
    W('enero', 'enero', 'janvier', '⛄', 'meses', 'El año empieza en enero.', 'L’année commence en janvier.', { genero: 'm' }),
    W('febrero', 'febrero', 'février', '💘', 'meses', 'Febrero tiene veintiocho días.', 'Février a vingt-huit jours.', { genero: 'm' }),
    W('marzo', 'marzo', 'mars', '🌱', 'meses', 'En marzo empieza la primavera.', 'En mars, le printemps commence.', { genero: 'm' }),
    W('abril', 'abril', 'avril', '🌧️', 'meses', 'Abril tiene treinta días.', 'Avril a trente jours.', { genero: 'm' }),
    W('mayo', 'mayo', 'mai', '🌸', 'meses', 'Mayo es el mes de las flores.', 'Mai est le mois des fleurs.', { genero: 'm' }),
    W('junio', 'junio', 'juin', '🏊', 'meses', 'En junio terminan las clases.', 'En juin, les cours se terminent.', { genero: 'm' }),
    W('julio', 'julio', 'juillet', '🏖️', 'meses', 'En julio no hay clase.', 'En juillet, il n’y a pas cours.', { genero: 'm' }),
    W('agosto', 'agosto', 'août', '🌴', 'meses', 'En agosto hay vacaciones.', 'En août, il y a des vacances.', { genero: 'm' }),
    W('septiembre', 'septiembre', 'septembre', '🍇', 'meses', 'En septiembre empieza el cole.', 'En septembre, l’école commence.', { genero: 'm' }),
    W('octubre', 'octubre', 'octobre', '🎃', 'meses', 'El doce de octubre es fiesta en España.', 'Le 12 octobre est un jour férié en Espagne.', { genero: 'm' }),
    W('noviembre', 'noviembre', 'novembre', '🍂', 'meses', 'En México, el Día de Muertos es el uno y el dos de noviembre.', 'Au Mexique, le Jour des Morts, c’est le 1er et le 2 novembre.', { genero: 'm' }),
    W('diciembre', 'diciembre', 'décembre', '🎄', 'meses', 'En diciembre es Navidad.', 'En décembre, c’est Noël.', { genero: 'm' }),
  ];

  // ───────────── Gramática ─────────────
  const gramatica = [
    G('g_articulos', 'El, la, un, una', 'Le, la, un, une', [
      ['el libro, el cuaderno', 'le livre, le cahier', 'pilar', ['el']],
      ['la mochila, la regla', 'le sac à dos, la règle', 'pilar', ['la']],
      ['un lápiz, un bolígrafo', 'un crayon, un stylo', 'diego', ['un']],
      ['una goma, una silla', 'une gomme, une chaise', 'diego', ['una']],
    ], 'Los nombres son masculinos o femeninos. Para masculino: el y un. Para femenino: la y una.',
    'Les noms sont masculins ou féminins. Masculin : el, un. Féminin : la, una.',
    "Il n'y a pas de neutre : tout nom est masculin ou féminin. Souvent -o = masculin et -a = féminin, mais attention : el día, el mapa, la mano. Apprends toujours le mot AVEC son article.",
    { encabezado: ['', 'masculino', 'femenino'], filas: [['definido', 'el libro', 'la mesa'], ['indefinido', 'un libro', 'una mesa']] }),
    G('g_plural', 'Los libros, las mochilas', 'Le pluriel', [
      ['los libros, los cuadernos', 'les livres, les cahiers', 'pilar', ['los']],
      ['las sillas, las reglas', 'les chaises, les règles', 'pilar', ['las']],
      ['el profesor, los profesores', 'le professeur, les professeurs', 'diego', ['profesores']],
      ['el lápiz, los lápices', 'le crayon, les crayons', 'diego', ['lápices']],
    ], 'Para el plural: si el nombre termina en vocal, añadimos -s. Si termina en consonante, añadimos -es. Los artículos son los y las.',
    'Pour le pluriel : après une voyelle, on ajoute -s ; après une consonne, -es. Les articles : los et las.',
    "Pluriel : voyelle + s, consonne + es ; z devient c (lápiz → lápices). Articles : el/la → los/las ; un/una → unos/unas. L'accent peut disparaître : lección → lecciones.",
    { encabezado: ['singular', 'plural'], filas: [['el libro', 'los libros'], ['la silla', 'las sillas'], ['el profesor', 'los profesores'], ['el lápiz', 'los lápices']] }),
    G('g_hay', 'Hay', 'Il y a', [
      ['En la clase hay una pizarra.', 'Dans la classe, il y a un tableau.', 'pilar', ['hay']],
      ['En el estuche hay tres bolígrafos.', 'Dans la trousse, il y a trois stylos.', 'diego', ['hay']],
      ['No hay clase el domingo.', 'Il n’y a pas cours le dimanche.', 'diego', ['hay']],
      ['¿Hay un ordenador en la clase?', 'Y a-t-il un ordinateur dans la classe ?', 'pilar', ['Hay']],
    ], 'La palabra «hay» sirve para decir que algo existe. Es igual para uno o para muchos.',
    'Le mot « hay » sert à dire que quelque chose existe. Il est identique pour un ou plusieurs.',
    "hay = il y a (invariable : « hay una mesa », « hay dos mesas »). Après hay : un/una, un nombre (dos, tres…) ou pas d'article (hay flores). On ne dit pas « hay el libro » mais « hay un libro ».", null),
    G('g_ar', 'Los verbos en -ar', 'Les verbes en -ar', [
      ['Yo hablo español.', 'Je parle espagnol.', 'diego', ['hablo']],
      ['Tú estudias mucho.', 'Tu étudies beaucoup.', 'pilar', ['estudias']],
      ['Marina escucha música.', 'Marina écoute de la musique.', 'diego', ['escucha']],
      ['Nosotros cantamos en clase.', 'Nous chantons en classe.', 'pilar', ['cantamos']],
    ], 'Los verbos en -ar tienen estas terminaciones: -o, -as, -a, -amos, -áis, -an. Quitas -ar y añades la terminación.',
    'Les verbes en -ar ont ces terminaisons : -o, -as, -a, -amos, -áis, -an. On enlève -ar et on ajoute la terminaison.',
    "Même principe que les verbes en -er du français : on retire -ar et on ajoute la terminaison. Elle indique la personne, donc le pronom est facultatif (« hablo » suffit). Attention à l'accent : habláis.",
    { encabezado: ['Pronombre', 'hablar'], filas: [['yo', 'hablo'], ['tú', 'hablas'], ['él / ella', 'habla'], ['nosotros', 'hablamos'], ['vosotros', 'habláis'], ['ellos / ellas', 'hablan']] }),
    G('g_consignas', 'Las órdenes de clase', 'Les consignes de classe', [
      ['Abre el libro.', 'Ouvre le livre.', 'pilar', ['Abre']],
      ['Cierra la mochila.', 'Ferme le sac à dos.', 'pilar', ['Cierra']],
      ['Escucha y repite.', 'Écoute et répète.', 'pilar', ['Escucha', 'repite']],
      ['Lee y escribe, por favor.', 'Lis et écris, s’il te plaît.', 'pilar', ['Lee', 'escribe']],
    ], 'Para dar una orden a una persona, usamos la forma «tú»: abre, cierra, escucha. Con «por favor» es más amable.',
    'Pour donner un ordre à quelqu’un, on utilise la forme « tú » : abre, cierra, escucha. Avec « por favor », c’est plus poli.',
    "Impératif affirmatif (tu) = forme « él/ella » du présent : abre, cierra, escucha, repite, lee, escribe (sauf quelques verbes irréguliers que tu verras plus tard). Ce sont les ordres que tu entendras toute l'année en classe.", null),
    G('g_fecha', '¿Qué día es hoy?', 'La date', [
      ['Hoy es lunes.', 'Aujourd’hui, c’est lundi.', 'diego', ['lunes']],
      ['Hoy es lunes, doce de octubre.', 'Aujourd’hui, c’est lundi 12 octobre.', 'diego', ['doce de octubre']],
      ['Mi cumpleaños es el cuatro de mayo.', 'Mon anniversaire est le 4 mai.', 'marina', ['el cuatro de mayo']],
      ['El domingo no hay cole.', 'Le dimanche, il n’y a pas école.', 'diego', ['El domingo']],
    ], 'Para la fecha decimos: el, el número, de, el mes. Los días y los meses se escriben con minúscula.',
    'Pour la date, on dit : el + le nombre + de + le mois. Les jours et les mois s’écrivent sans majuscule.',
    "Format : « el cuatro de mayo » (el + nombre + de + mois). Pas de majuscule aux jours ni aux mois. Pour le 1er : « el uno de mayo » ou « el primero de mayo ». Devant un jour, on met l'article : « el lunes » = lundi (ce lundi-là, ou le lundi de ton emploi du temps) ; « los lunes » = tous les lundis.", null),
  ];

  // ───────────── Cinemáticas ─────────────
  const intro = cine('u02-intro', 'intro', 'Capítulo 2 · Mi clase, mi cole · Salamanca', [
    P(3, "Carte d’Espagne : une ligne dorée relie Madrid à Salamanca ; carte-titre « Capítulo 2 · Mi clase, mi cole · Salamanca ».", [L(N, 'Capítulo dos: mi clase, mi cole.', 'Chapitre deux : ma classe, mon école.')], { rotulo: 'Capítulo 2 · Mi clase, mi cole · Salamanca', camara: 'zoom avant sur la carte' }),
    P(5, "Façades en grès doré de la Plaza Mayor et de l’université, cigognes sur les clochers ; au loin, une cloche qui reste muette.", [L(N, 'Salamanca, la ciudad dorada.', 'Salamanque, la ville dorée.'), L(N, 'Aquí hay un colegio muy especial.', 'Ici, il y a une école très spéciale.')], { camara: 'panoramique lent, lumière d’après-midi' }),
  ]);
  const historia = cine('u02-historia', 'historia', 'La campana muda', [
    P(7, "Cour du Colegio Fray Luis de León : élèves immobiles, silence total. Doña Pilar tient une grande cloche de bronze muette. Diego arrive en courant avec un bocadillo.", [
      L('diego', '¡Perdón, perdón! ¡Llego tarde!', 'Pardon, pardon ! Je suis en retard !'),
      L('pilar', 'Buenos días, Diego. La campana no suena.', 'Bonjour, Diego. La cloche ne sonne pas.'),
    ], { personajes: ['pilar', 'diego'], camara: 'plan large puis travelling vers Pilar' }),
    P(7, "Marina et Álex entrent dans la cour, Diego se présente en finissant son bocadillo.", [
      L('diego', 'Hola, me llamo Diego. Tengo doce años. ¿Eres Álex? ¿Y tú eres Marina?', 'Salut, je m’appelle Diego. J’ai douze ans. Tu es Álex ? Et toi, tu es Marina ?'),
      L('marina', 'Sí, somos viajeros. Buscamos una pluma.', 'Oui, nous sommes des voyageurs. Nous cherchons une plume.'),
    ], { personajes: ['diego', 'marina', 'viajero'] }),
    P(7, "Salle de classe : tableau vide, mochilas sur les tables ; au tableau, écrit en cendre noire : « Sin palabras, no hay clase ».", [
      L('pilar', 'La Sombra quiere un colegio sin voces. Ayúdanos, por favor.', 'L’Ombre veut une école sans voix. Aide-nous, s’il te plaît.'),
      L('sombra', 'Sin palabras, no hay clase…', 'Sans mots, pas de cours…'),
    ], { personajes: ['pilar', 'sombra'], musica: 'tension douce, cordes' }),
    P(7, "Par la fenêtre : au loin, sur la façade de l’université, une petite grenouille de pierre brille d’un éclat vert. Le Quetzal sort du sac de Marina.", [
      L('quetzal', 'Una pluma… cerca. ¡Aquí!', 'Une plume… tout près. Ici !'),
      L('diego', 'La rana de la Universidad. ¡Vamos!', 'La grenouille de l’université. Allons-y !'),
    ], { personajes: ['quetzal', 'diego'], musica: 'thème d’aventure' }),
  ]);
  const capsula = cine('u02-capsula-cole', 'capsula', 'Mil y una escuelas', [
    P(4, "Cour de récré animée (style explainer), élèves avec des bocadillos, bulles de call-out.", [L(N, 'En el recreo, muchos alumnos comen un bocadillo.', 'À la récré, beaucoup d’élèves mangent un sandwich (un bocadillo).')], { camara: 'plan fixe, animations de papier découpé' }),
    P(5, "Un bulletin avec des notes de 0 à 10 ; le chiffre 5 est entouré en vert avec le mot « aprobado ».", [L(N, 'Las notas van de cero a diez. Con un cinco, ¡aprobado!', 'Les notes vont de zéro à dix. Avec un cinq, c’est réussi !')]),
    P(5, "Salle de classe d’un collège public, élèves en vêtements normaux (pas d’uniforme) ; deux call-outs « profe » et « cole » apparaissent.", [L(N, 'En los colegios públicos, normalmente no hay uniforme. Y los alumnos dicen «profe» y «cole».', 'Dans les écoles publiques, en général, il n’y a pas d’uniforme. Et les élèves disent « profe » (prof) et « cole » (école).')]),
    P(4, "Plan large de la façade de l’Universidad de Salamanca, pierre dorée au soleil, compteur « 1218 ».", [L(N, 'En Salamanca hay una universidad con más de ochocientos años.', 'À Salamanque, il y a une université de plus de huit cents ans.')]),
  ]);
  const pluma = cine('u02-pluma', 'pluma', 'Segunda pluma', [
    P(3, "La cloche de Doña Pilar se met à sonner à toute volée ; la grenouille de pierre s’ouvre et libère une plume verte brillante.", [L('pilar', '¡La campana suena! ¡Gracias, viajeros!', 'La cloche sonne ! Merci, voyageurs !')], { personajes: ['pilar'] }),
    P(3, "Sur la carte, l’empreinte lumineuse indique Sevilla ; le Quetzal, plus vert, bat des ailes.", [L('quetzal', 'Gracias, amigos. Ahora hablo más.', 'Merci, amis. Maintenant je parle plus.')], { personajes: ['quetzal'] }),
  ]);

  const quests = [];

  // 1 — Cinemática
  quests.push(quest('u02', 1, 'cinematica', 'Llegada a Salamanca', '🏰',
    ['marina', '¡Salamanca! Mira qué bonita… Pero ¿por qué hay tanto silencio?', 'Salamanque ! Regarde comme elle est jolie… Mais pourquoi y a-t-il autant de silence ?'],
    'Arrivée à Salamanque : tu rencontres Diego et doña Pilar, et l’histoire avance.', ['escuchar', 'cultura', 'hablar'], 10, [
      intro,
      tf('Salamanca es una ciudad de España.', true, N, { tr: 'Salamanque est une ville d’Espagne.' }),
      historia,
      tf('La campana del colegio suena.', false, N, { tr: 'La cloche de l’école sonne.' }),
      flash('clase', 'cole', 'profesor', 'companero'),
      lcT('Hola, me llamo Diego. Tengo doce años.', 'diego', ['Diego tiene doce años.', 'Diego tiene trece años.', 'Diego es profesor.'], 0),
      lcT('Hoy la campana no suena. No hay ruido.', 'pilar', ['Los alumnos cantan.', 'El cole está en silencio.', 'La clase termina.'], 1),
      dlg('pilar', 'Buenos días. Soy doña Pilar, la profesora. ¿Cómo te llamas?', 'Bonjour. Je suis doña Pilar, la professeure. Comment tu t’appelles ?', [
        ['Buenos días, doña Pilar. Me llamo Álex.', 1, 'Muy bien, Álex. Bienvenido al cole.', 'Très bien, Álex. Bienvenue à l’école.', 'Bonjour, doña Pilar. Je m’appelle Álex.'],
        ['Buenas noches, profesora.', 0, '¿Buenas noches? ¡Son las nueve de la mañana!', 'Bonne nuit ? Il est neuf heures du matin !', 'Bonne nuit, professeure.'],
        ['Adiós, profesora.', 0, '¿Ya te vas? ¡Pero si la clase no ha empezado!', 'Tu t’en vas déjà ? Mais le cours n’a pas commencé !', 'Au revoir, professeure.'],
      ]),
      dlg('diego', '¿De dónde eres?', 'D’où viens-tu ?', [
        ['Soy de París. Soy francés.', 1, '¡Qué guay! Yo soy de Salamanca.', 'Trop bien ! Moi, je suis de Salamanque.', 'Je suis de Paris. Je suis français.'],
        ['Soy de Salamanca.', 0, '¿De Salamanca? Pero si hablas con acento francés…', 'De Salamanque ? Mais tu parles avec un accent français…', 'Je suis de Salamanque.'],
        ['Tengo doce años.', 0, '¡Yo también! Pero ¿de dónde eres?', 'Moi aussi ! Mais d’où viens-tu ?', 'J’ai douze ans.'],
      ]),
      tf('Diego es profesor.', false, N, { tr: 'Diego est professeur.' }),
      speak('Buenos días, profesora.', 'viajero', { tr: 'Bonjour, professeure.', hechizo: ['Hechizo del respeto', 'La puerta del colegio se abre despacio'] }),
    ]));

  // 2 — Material
  quests.push(quest('u02', 2, 'vocabulario', 'La mochila de Álex', '🎒',
    ['diego', 'Para ir al cole necesitas una mochila. ¡Vamos a llenarla!', 'Pour aller à l’école, il te faut un sac à dos. Remplissons-le !'],
    'Le matériel scolaire et les articles (el, la, un, una).', ['leer', 'escuchar', 'escribir'], 14, [
      flash('libro', 'cuaderno', 'boligrafo', 'lapiz', 'goma', 'regla'),
      lcV('libro', ['cuaderno', 'libro', 'regla']),
      match(['libro', 'cuaderno', 'boligrafo', 'lapiz', 'goma', 'regla']),
      flash('mochila', 'estuche', 'pizarra', 'silla', 'mesa', 'ordenador'),
      match(['mochila', 'estuche', 'pizarra', 'silla', 'mesa', 'ordenador']),
      gram('g_articulos'),
      fill('Abre ___ libro.', 'el', 'pilar', { opts: ['el', 'la', 'una'], tr: 'Ouvre le livre.' }),
      fill('Tengo ___ goma en el estuche.', 'una', 'diego', { opts: ['un', 'una', 'el'], tr: 'J’ai une gomme dans la trousse.' }),
      fill('Marina tiene ___ ordenador.', 'un', 'diego', { opts: ['un', 'una', 'la'], tr: 'Marina a un ordinateur.' }),
      dlg('diego', '¿Qué tienes en la mochila?', 'Qu’as-tu dans ton sac à dos ?', [
        ['Tengo un cuaderno y una goma.', 1, '¡Genial! Yo tengo un bocadillo, pero eso no cuenta.', 'Génial ! Moi j’ai un sandwich, mais ça ne compte pas.', 'J’ai un cahier et une gomme.'],
        ['Soy un cuaderno.', 0, '¿Eres un cuaderno? ¡Qué cosa más rara!', 'Tu es un cahier ? Quelle drôle de chose !', 'Je suis un cahier.'],
        ['Me llamo mochila.', 0, 'Hola, Mochila. Encantado.', 'Salut, Mochila. Enchanté.', 'Je m’appelle sac à dos.'],
      ]),
      lcI('Tengo una regla.', 'diego', 'regla', ['regla', 'lapiz', 'libro']),
      reord('Tengo un estuche y una regla.', 'diego', { tr: 'J’ai une trousse et une règle.' }),
      gram('g_plural'),
      fill('En mi estuche hay tres ___.', 'lápices', 'diego', { opts: ['lápiz', 'lápizes', 'lápices'], tr: 'Dans ma trousse, il y a trois crayons.' }),
      speak('Tengo un libro y un cuaderno.', 'diego', { tr: 'J’ai un livre et un cahier.', hechizo: ['Hechizo de la mochila', 'Tu mochila se llena de objetos mágicos'] }),
    ]));

  // 3 — Horario
  quests.push(quest('u02', 3, 'escucha', 'Mi horario', '🗓️',
    ['diego', 'Mi horario es un caos. ¿Me ayudas a entenderlo?', 'Mon emploi du temps est un chaos. Tu m’aides à le comprendre ?'],
    'Les matières et les jours de la semaine, avec lecture d’un emploi du temps.', ['escuchar', 'leer', 'hablar'], 14, [
      flash('matematicas', 'lengua', 'ingles', 'historia'),
      flash('geografia', 'ciencias', 'educacion_fisica', 'musica'),
      lcV('matematicas', ['musica', 'matematicas', 'ciencias']),
      match(['matematicas', 'lengua', 'ingles', 'historia', 'geografia', 'ciencias']),
      flash('lunes', 'martes', 'miercoles', 'jueves', 'viernes'),
      flash('sabado', 'domingo', 'hoy'),
      lcT('El lunes tengo matemáticas.', 'diego', ['Diego estudia matemáticas el lunes.', 'Diego estudia matemáticas el martes.', 'Diego estudia música el lunes.'], 0),
      lcT('El miércoles tengo inglés.', 'diego', ['Diego estudia inglés el jueves.', 'Diego estudia inglés el miércoles.', 'Diego estudia historia el miércoles.'], 1),
      read('Mi horario. El lunes tengo matemáticas y lengua. El martes tengo inglés. El miércoles tengo historia y geografía. El jueves tengo música y ciencias. El viernes tengo educación física. El sábado y el domingo no hay cole.', 'diego',
        'Mon emploi du temps. Le lundi, j’ai maths et cours de langue (espagnol). Le mardi, j’ai anglais. Le mercredi, j’ai histoire et géographie. Le jeudi, j’ai musique et sciences. Le vendredi, j’ai EPS. Le samedi et le dimanche, il n’y a pas école.', [
          ['¿Qué día tiene inglés?', 'Quel jour a-t-il anglais ?', ['El lunes.', 'El martes.', 'El jueves.'], 1],
          ['¿Cuándo tiene música?', 'Quand a-t-il musique ?', ['El jueves.', 'El viernes.', 'El lunes.'], 0],
          ['¿Hay cole el sábado?', 'Y a-t-il école le samedi ?', ['Sí.', 'No.'], 1],
        ]),
      fill('El ___ tengo educación física.', 'viernes', 'diego', { opts: ['lunes', 'viernes', 'domingo'], tr: 'Le vendredi, j’ai EPS.', es: 'Mira el horario de Diego y completa.', fr: 'Regarde l’emploi du temps de Diego et complète.' }),
      fill('El sábado y el ___ no hay cole.', 'domingo', 'diego', { opts: ['martes', 'domingo', 'viernes'], tr: 'Le samedi et le dimanche, il n’y a pas école.' }),
      dict('El jueves tengo música.', 'diego'),
      reord('El martes tengo inglés.', 'diego', { tr: 'Le mardi, j’ai anglais.' }),
      dlg('diego', 'Hoy es lunes. ¿Qué tienes hoy?', 'Aujourd’hui, c’est lundi. Qu’as-tu aujourd’hui ?', [
        ['Hoy tengo matemáticas.', 1, '¡Qué suerte! Yo odio los lunes.', 'Quelle chance ! Moi, je déteste les lundis.', 'Aujourd’hui, j’ai maths.'],
        ['Hoy me llamo lunes.', 0, '¿Lunes? Prefiero «Viernes».', 'Lundi ? Je préfère « Vendredi ».', 'Aujourd’hui, je m’appelle lundi.'],
        ['Hoy soy matemáticas.', 0, 'Eres un chico, no una asignatura.', 'Tu es un garçon, pas une matière.', 'Aujourd’hui, je suis maths.'],
      ]),
      speak('Hoy es lunes y tengo matemáticas.', 'diego', { tr: 'Aujourd’hui, c’est lundi et j’ai maths.', hechizo: ['Hechizo del horario', 'Los días de la semana giran a tu alrededor'] }),
    ]));

  // 4 — Forja -ar
  quests.push(quest('u02', 4, 'forja', 'La Forja: verbos en -ar', '⚒️',
    ['quetzal', 'Yo hablo. Tú hablas. ¡Forja conmigo!', 'Je parle. Tu parles. Forge avec moi !'],
    'Le présent des verbes en -ar : hablar, escuchar, estudiar, cantar.', ['escribir', 'leer', 'hablar'], 14, [
      gram('g_ar'),
      conj('hablar', 'yo', 'habl', 'o', ['o', 'as', 'a'], 'diego', { tr: 'Moi, je parle…' }),
      conj('hablar', 'tú', 'habl', 'as', ['o', 'as', 'a'], 'pilar', { tr: 'Toi, tu parles…' }),
      conj('hablar', 'él', 'habl', 'a', ['o', 'as', 'a'], 'pilar', { tr: 'Lui, il parle…' }),
      conj('hablar', 'nosotros', 'habl', 'amos', ['amos', 'an', 'a'], 'diego', { tr: 'Nous, nous parlons…' }),
      conj('estudiar', 'ella', 'estudi', 'a', ['o', 'as', 'a'], 'pilar', { tr: 'Elle étudie…' }),
      conj('escuchar', 'yo', 'escuch', 'o', ['o', 'as', 'a'], 'diego', { tr: 'Moi, j’écoute…' }),
      conj('escuchar', 'ellos', 'escuch', 'an', ['amos', 'an', 'a'], 'pilar', { tr: 'Eux, ils écoutent…' }),
      conj('cantar', 'tú', 'cant', 'as', ['o', 'as', 'a'], 'diego', { tr: 'Toi, tu chantes…' }),
      fill('Marina ___ español.', 'habla', 'diego', { opts: ['hablo', 'hablas', 'habla'], tr: 'Marina parle espagnol.' }),
      fill('Nosotros ___ la lección.', 'escuchamos', 'pilar', { opts: ['escuchamos', 'escuchan', 'escucho'], tr: 'Nous écoutons la leçon.' }),
      fill('Yo ___ inglés los martes.', 'estudio', 'diego', { opts: ['estudio', 'estudias', 'estudia'], tr: 'J’étudie l’anglais le mardi.' }),
      reord('Nosotros hablamos español en clase.', 'pilar', { tr: 'Nous parlons espagnol en classe.' }),
      lcT('Los alumnos escuchan y la profesora habla.', 'pilar', ['Los chicos hablan con la profesora.', 'Los chicos escuchan a la profesora.', 'La profesora escucha a los chicos.'], 1),
      speak('Yo hablo español en clase.', 'diego', { tr: 'Je parle espagnol en classe.', hechizo: ['Hechizo del verbo', 'Las letras -ar brillan en el aire'] }),
    ]));

  // 5 — Órdenes en clase
  quests.push(quest('u02', 5, 'dialogo', 'Órdenes en clase', '📢',
    ['pilar', 'Silencio, por favor. Hoy practicamos las órdenes de clase.', 'Silence, s’il vous plaît. Aujourd’hui, on s’entraîne aux consignes de classe.'],
    'Les consignes de classe (impératif) et « hay » : écoute, obéis, puis réponds.', ['escuchar', 'hablar', 'leer'], 14, [
      flash('abre', 'cierra', 'escucha', 'repite', 'lee', 'escribe'),
      gram('g_consignas'),
      lcI('Abre el libro.', 'pilar', 'abre', ['abre', 'cierra', 'escucha'], { es: 'Escucha la orden y elige.', fr: 'Écoute l’ordre et choisis.' }),
      lcI('Cierra el cuaderno.', 'pilar', 'cierra', ['cierra', 'lee', 'escribe'], { es: 'Escucha la orden y elige.', fr: 'Écoute l’ordre et choisis.' }),
      lcI('Escribe tu nombre.', 'pilar', 'escribe', ['repite', 'escribe', 'abre'], { es: 'Escucha la orden y elige.', fr: 'Écoute l’ordre et choisis.' }),
      lcI('Repite, por favor.', 'pilar', 'repite', ['repite', 'lee', 'cierra'], { es: 'Escucha la orden y elige.', fr: 'Écoute l’ordre et choisis.' }),
      match(['abre', 'cierra', 'escucha', 'repite', 'lee', 'escribe']),
      gram('g_hay'),
      dlg('pilar', 'Álex, lee la frase de la pizarra, por favor.', 'Álex, lis la phrase du tableau, s’il te plaît.', [
        ['Sí, profesora. «Hola, me llamo Álex».', 1, 'Perfecto. Muy bien leído.', 'Parfait. Très bien lu.', 'Oui, professeure. « Hola, me llamo Álex ».'],
        ['Adiós, profesora.', 0, 'No he dicho «adiós». He dicho «lee».', 'Je n’ai pas dit « adiós ». J’ai dit « lee ».', 'Au revoir, professeure.'],
        ['Gracias, de nada.', 0, 'Gracias… ¿por qué? Todavía no has leído.', 'Merci… pourquoi ? Tu n’as pas encore lu.', 'Merci, de rien.'],
      ]),
      dlg('diego', 'En mi estuche hay un lápiz, una goma y una regla. ¿Y en tu estuche?', 'Dans ma trousse, il y a un crayon, une gomme et une règle. Et dans la tienne ?', [
        ['En mi estuche hay tres bolígrafos.', 1, '¡Tres! Eres un chico organizado.', 'Trois ! Tu es un garçon organisé.', 'Dans ma trousse, il y a trois stylos.'],
        ['En el estuche soy francés.', 0, 'Ja, ja… Eres muy gracioso.', 'Haha… Tu es très drôle.', 'Dans la trousse, je suis français.'],
        ['Mi estuche se llama Álex.', 0, 'Pobre estuche. ¡Qué nombre!', 'Pauvre trousse. Quel nom !', 'Ma trousse s’appelle Álex.'],
      ]),
      fill('En la clase ___ una pizarra.', 'hay', 'pilar', { opts: ['hay', 'tengo', 'soy'], tr: 'Dans la classe, il y a un tableau.' }),
      fill('No ___ clase el domingo.', 'hay', 'diego', { opts: ['hay', 'eres', 'llamo'], tr: 'Il n’y a pas cours le dimanche.' }),
      tf('En el estuche hay una silla.', false, N, { tr: 'Dans la trousse, il y a une chaise.' }),
      reord('Escucha y repite, por favor.', 'pilar', { tr: 'Écoute et répète, s’il te plaît.' }),
      speak('Abre el libro, por favor.', 'pilar', { tr: 'Ouvre le livre, s’il te plaît.', hechizo: ['Hechizo de la orden', 'La pizarra se enciende con letras doradas'] }),
    ]));

  // 6 — Calendario
  quests.push(quest('u02', 6, 'lectura', 'El calendario', '📅',
    ['diego', 'Los días y los meses se escriben todos con minúscula. ¡Vamos a ver el calendario!', 'Les jours et les mois s’écrivent tous en minuscule. Regardons le calendrier !'],
    'Les mois et la date : lire un calendrier et dire sa date d’anniversaire.', ['leer', 'escuchar', 'escribir'], 14, [
      flash('enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio'),
      flash('julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'),
      flash('cumpleanos'),
      match(['enero', 'febrero', 'mayo', 'julio', 'octubre', 'diciembre']),
      lcV('octubre', ['septiembre', 'octubre', 'noviembre']),
      gram('g_fecha'),
      lcT('El cuatro de mayo.', N, ['4 de mayo', '5 de abril', '4 de marzo'], 0),
      lcT('El treinta de octubre.', N, ['13 de octubre', '30 de octubre', '3 de octubre'], 1),
      read('Hoy es viernes, nueve de octubre. El lunes, doce de octubre, no hay cole: es fiesta. El martes tengo matemáticas.', 'diego',
        'Aujourd’hui, c’est vendredi 9 octobre. Le lundi 12 octobre, il n’y a pas école : c’est férié. Le mardi, j’ai maths.', [
          ['¿Qué día es hoy?', 'Quel jour est-on aujourd’hui ?', ['Viernes, nueve de octubre.', 'Lunes, doce de octubre.', 'Martes, trece de octubre.'], 0],
          ['¿Hay cole el doce de octubre?', 'Y a-t-il école le 12 octobre ?', ['Sí.', 'No.'], 1],
          ['¿Qué asignatura tiene Diego el martes?', 'Quelle matière Diego a-t-il le mardi ?', ['Matemáticas.', 'Música.', 'Historia.'], 0],
        ]),
      fill('Hoy es ___, nueve de octubre.', 'viernes', 'diego', { opts: ['lunes', 'viernes', 'sábado'], tr: 'Aujourd’hui, c’est vendredi 9 octobre.', es: 'Completa con el texto de Diego.', fr: 'Complète d’après le texte de Diego.' }),
      fill('Septiembre, octubre, ___.', 'noviembre', N, { opts: ['noviembre', 'enero', 'mayo'], tr: 'Septembre, octobre, novembre.' }),
      reord('Hoy es lunes, doce de octubre.', 'diego', { tr: 'Aujourd’hui, c’est lundi 12 octobre.' }),
      dlg('diego', 'Mi cumpleaños es el cuatro de mayo. ¿Cuándo es tu cumpleaños?', 'Mon anniversaire est le 4 mai. C’est quand, ton anniversaire ?', [
        ['Mi cumpleaños es el doce de octubre.', 1, '¡Qué casualidad! Ese día es fiesta en España.', 'Quelle coïncidence ! Ce jour-là, c’est férié en Espagne.', 'Mon anniversaire est le 12 octobre.'],
        ['Mi cumpleaños es lunes.', 0, 'Un lunes… pero ¿de qué mes?', 'Un lundi… mais de quel mois ?', 'Mon anniversaire est lundi.'],
        ['Mi cumpleaños tiene doce años.', 0, '¿Tu cumpleaños tiene doce años? ¡Qué cosas dices!', 'Ton anniversaire a douze ans ? Tu dis de ces choses !', 'Mon anniversaire a douze ans.'],
      ]),
      writeFree('Mi cumpleaños es el ___ de ___.', [
        { id: 'dia', pista: 'Le jour de ton anniversaire, en lettres (uno, cuatro, doce, veintitrés…)', tipo: 'texto' },
        { id: 'mes', pista: 'Le mois de ton anniversaire (sans majuscule)', tipo: 'texto' },
      ], 'Mi cumpleaños es el cuatro de mayo.', 'Mon anniversaire est le 4 mai.', 'diego'),
      speak('Hoy es viernes, nueve de octubre.', 'diego', { tr: 'Aujourd’hui, c’est vendredi 9 octobre.', acept: ['hoy es viernes 9 de octubre'], hechizo: ['Hechizo del calendario', 'Las hojas del calendario vuelan a tu alrededor'] }),
    ]));

  // 7 — Cultura
  quests.push(quest('u02', 7, 'cultura', 'Mil y una escuelas', '🏫',
    ['pilar', 'En el mundo hay mil y una escuelas. Vamos a conocer la nuestra.', 'Dans le monde, il y a mille et une écoles. Découvrons la nôtre.'],
    'L’école en Espagne (récré, notes sur 10 avec 5 pour réussir, souvent pas d’uniforme dans le public) et la légende de la grenouille de Salamanque.', ['cultura', 'leer', 'escuchar'], 12, [
      capsula,
      tf('Las notas en España van de cero a diez.', true, N, { tr: 'En Espagne, les notes vont de zéro à dix.' }),
      tf('En todos los colegios españoles hay uniforme.', false, N, { tr: 'Dans toutes les écoles espagnoles, il y a un uniforme.' }),
      tf('En el recreo, muchos alumnos comen un bocadillo.', true, N, { tr: 'À la récré, beaucoup d’élèves mangent un sandwich.' }),
      lcT('Tengo un nueve en matemáticas.', 'diego', ['9', '7', '19'], 0),
      lcT('Tengo un siete en lengua.', 'diego', ['6', '7', '17'], 1),
      read('Hola, soy Diego. En mi cole, las clases empiezan por la mañana. En el recreo como un bocadillo con mis compañeros. No hay uniforme. Mi profesora favorita se llama doña Pilar.', 'diego',
        'Salut, c’est Diego. Dans mon école, les cours commencent le matin. À la récré, je mange un sandwich avec mes camarades. Il n’y a pas d’uniforme. Ma prof préférée s’appelle doña Pilar.', [
          ['¿Hay uniforme en el cole de Diego?', 'Y a-t-il un uniforme dans l’école de Diego ?', ['Sí, hay uniforme.', 'No, no hay uniforme.'], 1],
          ['¿Qué come Diego en el recreo?', 'Que mange Diego à la récré ?', ['Un bocadillo.', 'Un churro.', 'Una regla.'], 0],
          ['¿Cómo se llama su profesora favorita?', 'Comment s’appelle sa prof préférée ?', ['Rosa.', 'Pilar.', 'Marina.'], 1],
        ]),
      read('En la Universidad de Salamanca hay una rana de piedra. Es muy pequeña y está en la fachada. Los estudiantes la buscan. Según la leyenda, si la encuentran, ¡aprueban los exámenes!', 'pilar',
        'À l’Université de Salamanque, il y a une grenouille de pierre. Elle est très petite et se trouve sur la façade. Les étudiants la cherchent. Selon la légende, s’ils la trouvent, ils réussissent leurs examens !', [
          ['¿Dónde hay una rana?', 'Où y a-t-il une grenouille ?', ['En la Universidad de Salamanca.', 'En el mercado.', 'En París.'], 0],
          ['¿Cómo es la rana?', 'Comment est la grenouille ?', ['Muy pequeña.', 'Muy grande.', 'Roja.'], 0],
          ['Según la leyenda, ¿qué pasa si los estudiantes la encuentran?', 'Selon la légende, que se passe-t-il si les étudiants la trouvent ?', ['Aprueban los exámenes.', 'Comen un bocadillo.', 'No tienen clase.'], 0],
        ]),
      tf('La rana es muy grande.', false, 'diego', { tr: 'La grenouille est très grande.' }),
      dlg('diego', 'Mira, ¡la fachada de la Universidad! ¿Ves la rana?', 'Regarde, la façade de l’Université ! Tu vois la grenouille ?', [
        ['Sí, ¡la veo! ¡Está aquí!', 1, '¡Increíble! Tienes ojos de águila.', 'Incroyable ! Tu as des yeux d’aigle.', 'Oui, je la vois ! Elle est ici !'],
        ['No, no hay rana.', 0, 'Mira bien. Es muy pequeña.', 'Regarde bien. Elle est très petite.', 'Non, il n’y a pas de grenouille.'],
        ['Sí, me llamo rana.', 0, 'Hola, Rana. Yo me llamo Diego.', 'Salut, Grenouille. Moi, je m’appelle Diego.', 'Oui, je m’appelle grenouille.'],
      ]),
      fill('Con un ___, ¡aprobado!', 'cinco', N, { opts: ['cinco', 'cero', 'cien'], tr: 'Avec un cinq, c’est réussi !' }),
      reord('Las notas van del cero al diez.', 'pilar', { tr: 'Les notes vont de zéro à dix.' }),
      speak('En el recreo como un bocadillo.', 'diego', { tr: 'À la récré, je mange un sandwich.', hechizo: ['Hechizo del recreo', 'Un bocadillo gigante cae del cielo'] }),
    ]));

  // 8 — Desafío
  quests.push(quest('u02', 8, 'desafio', 'El examen de la Sombra', '📝',
    ['sombra', 'Examen sorpresa. Nadie aprueba. Nadie.', 'Contrôle surprise. Personne ne réussit. Personne.'],
    'Boss de Salamanque : révision mixte des unités 1 et 2.', ['escuchar', 'hablar', 'leer', 'escribir'], 15, [
      dlg('sombra', 'Pregunta uno: ¿cómo te llamas y cuántos años tienes?', 'Question un : comment tu t’appelles et quel âge as-tu ?', [
        ['Me llamo Álex y tengo doce años.', 1, '¡Grr! Esa es correcta…', 'Grr ! Celle-là est juste…', 'Je m’appelle Álex et j’ai douze ans.'],
        ['Buenas noches, adiós.', 0, 'Eso no es una respuesta.', 'Ce n’est pas une réponse.', 'Bonne nuit, au revoir.'],
        ['Soy doce y me llamo años.', 0, 'Eso no tiene sentido.', 'Ça n’a aucun sens.', 'Je suis douze et je m’appelle ans.'],
      ]),
      dlg('sombra', 'Pregunta dos: ¿qué hay en tu mochila?', 'Question deux : qu’y a-t-il dans ton sac à dos ?', [
        ['Hay un libro, un cuaderno y una regla.', 1, '¡Aaah! ¡Otra respuesta correcta!', 'Aaah ! Une autre bonne réponse !', 'Il y a un livre, un cahier et une règle.'],
        ['Tengo veinte años.', 0, 'No te pregunto la edad.', 'Je ne te demande pas ton âge.', 'J’ai vingt ans.'],
        ['Me llamo mochila.', 0, 'Qué gracioso. No.', 'Très drôle. Non.', 'Je m’appelle sac à dos.'],
      ]),
      lcV('regla', ['regla', 'lapiz', 'goma']),
      lcT('El jueves tengo música.', 'sombra', ['Hay clase de música el jueves.', 'Hay clase de historia el jueves.', 'Hay clase de música el viernes.'], 0),
      match(['libro', 'mochila', 'ordenador', 'silla', 'estuche', 'regla']),
      fill('Tengo ___ estuche y una regla.', 'un', 'diego', { opts: ['un', 'una', 'la'], tr: 'J’ai une trousse et une règle.' }),
      fill('Tengo dos ___ en el estuche.', 'bolígrafos', 'diego', { opts: ['bolígrafo', 'bolígrafos', 'bolígrafas'], tr: 'J’ai deux stylos dans la trousse.' }),
      conj('hablar', 'nosotros', 'habl', 'amos', ['amos', 'an', 'a'], 'pilar', { tr: 'Nous, nous parlons…' }),
      conj('escuchar', 'tú', 'escuch', 'as', ['o', 'as', 'a'], 'pilar', { tr: 'Toi, tu écoutes…' }),
      reord('El domingo no hay cole.', 'diego', { tr: 'Le dimanche, il n’y a pas école.' }),
      dict('septiembre', N, { acept: ['setiembre'] }),
      read('Hola, soy Marina. Hoy es martes. Tengo matemáticas y lengua. En mi mochila hay un libro, dos cuadernos y un estuche.', 'marina',
        'Salut, c’est Marina. Aujourd’hui, c’est mardi. J’ai maths et langue. Dans mon sac à dos, il y a un livre, deux cahiers et une trousse.', [
          ['¿Qué día es hoy?', 'Quel jour est-on aujourd’hui ?', ['Lunes.', 'Martes.', 'Jueves.'], 1],
          ['¿Cuántos cuadernos hay en la mochila?', 'Combien de cahiers y a-t-il dans le sac à dos ?', ['Uno.', 'Dos.', 'Tres.'], 1],
        ]),
      tf('Las notas van de cero a veinte.', false, N, { tr: 'Les notes vont de zéro à vingt.' }),
      speak('En mi mochila hay un libro y dos cuadernos.', 'pilar', { tr: 'Dans mon sac à dos, il y a un livre et deux cahiers.', acept: ['en mi mochila hay un libro y 2 cuadernos'], hechizo: ['Hechizo final', '¡La campana vuelve a sonar!'] }),
      pluma,
    ], { jefe: { personaje: 'sombra', vidas: 7 } }));

  return {
    id: 'u02', numero: 2, titulo: 'Mi clase, mi cole', lugar: 'Salamanca', emoji: '🏰', ejes: [3], periodo: 'sept-oct',
    objetivos: [
      { es: 'Nombrar el material escolar y los objetos de la clase.', fr: 'Nommer le matériel scolaire et les objets de la classe.' },
      { es: 'Decir qué asignaturas tengo cada día.', fr: 'Dire quelles matières j’ai chaque jour.' },
      { es: 'Comprender y seguir las órdenes de clase.', fr: 'Comprendre et suivre les consignes de classe.' },
      { es: 'Decir qué día es hoy y la fecha de mi cumpleaños.', fr: 'Dire quel jour on est et la date de mon anniversaire.' },
      { es: 'Decir qué hay en un lugar (hay) y hablar de mis actividades con los verbos en -ar.', fr: 'Dire ce qu’il y a quelque part et parler de mes activités avec les verbes en -ar.' },
      { es: 'Descubrir cómo es una escuela en España.', fr: 'Découvrir à quoi ressemble une école en Espagne.' },
    ],
    vocab, gramatica, quests,
    pluma: { numero: 2, nombre: 'Pluma de la Campana', descripcion: L('quetzal', 'Dos plumas. Ahora hablo más. ¡Gracias!', 'Deux plumes. Maintenant je parle plus. Merci !') },
  };
}
