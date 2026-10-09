// Unidad 1 — ¡Hola! Me presento (Madrid)
import { W, G, quest, flash, match, lcV, lcI, lcT, dict, fill, reord, conj, dlg, read, speak, tf, gram, writeFree, cine, P, L, C, NARR } from './lib.mjs';

export default function build() {
  const N = NARR;

  // ───────────── Vocabulario (59) ─────────────
  const vocab = [
    // saludos
    W('hola', 'hola', 'salut, bonjour', '👋', 'saludos', '¡Hola, Marina!', 'Salut, Marina !'),
    W('adios', 'adiós', 'au revoir', '🚪', 'saludos', 'Adiós, don Ignacio.', 'Au revoir, don Ignacio.'),
    W('buenos_dias', 'buenos días', 'bonjour (le matin)', '🌅', 'saludos', '¡Buenos días, Rosa!', 'Bonjour, Rosa !'),
    W('buenas_tardes', 'buenas tardes', "bonjour (l'après-midi), bonsoir (avant la nuit)", '🌇', 'saludos', 'Buenas tardes, Nacho.', "Bonjour, Nacho. (l'après-midi)"),
    W('buenas_noches', 'buenas noches', 'bonne nuit, bonsoir (tard)', '🌙', 'saludos', 'Buenas noches, Quetzal.', 'Bonne nuit, Quetzal.'),
    W('que_tal', '¿qué tal?', 'comment ça va ?', '🤙', 'saludos', 'Hola, Álex, ¿qué tal?', 'Salut Álex, ça va ?'),
    W('hasta_luego', 'hasta luego', "à tout à l'heure, à bientôt", '🔜', 'saludos', 'Adiós, hasta luego.', "Au revoir, à tout à l'heure."),
    W('por_favor', 'por favor', "s'il te plaît, s'il vous plaît", '🙏', 'saludos', 'Un churro, por favor.', "Un churro, s'il vous plaît."),
    W('gracias', 'gracias', 'merci', '💐', 'saludos', 'Gracias, Rosa.', 'Merci, Rosa.'),
    W('de_nada', 'de nada', 'de rien', '👍', 'saludos', '—Gracias. —De nada.', '— Merci. — De rien.'),
    W('perdon', 'perdón', 'pardon, excuse-moi', '🙇', 'saludos', 'Perdón, don Ignacio.', 'Pardon, don Ignacio.'),
    W('encantado', 'encantado', 'enchanté', '🤝', 'saludos', 'Hola, Marina. Encantado.', 'Salut, Marina. Enchanté.', { adj: true, genero: 'm', femenino: 'encantada' }),
    W('bien', 'bien', 'bien', '😄', 'saludos', '—¿Qué tal? —Bien, gracias.', '— Ça va ? — Bien, merci.'),
    W('regular', 'regular', 'comme ci, comme ça', '😐', 'saludos', '—¿Qué tal? —Regular.', '— Ça va ? — Comme ci, comme ça.'),
    W('mal', 'mal', 'mal, pas bien', '😞', 'saludos', '—¿Qué tal? —Mal.', '— Ça va ? — Pas bien.'),
    // presentacion
    W('me_llamo', 'me llamo', "je m'appelle", '🏷️', 'presentacion', 'Me llamo Álex.', "Je m'appelle Álex."),
    W('como_te_llamas', '¿cómo te llamas?', "comment tu t'appelles ?", '🗣️', 'presentacion', 'Hola, ¿cómo te llamas?', "Salut, comment tu t'appelles ?"),
    W('soy', 'soy', 'je suis', '🙋', 'presentacion', 'Soy Marina.', 'Je suis Marina.'),
    W('de_donde_eres', '¿de dónde eres?', "tu viens d'où ?", '🧭', 'presentacion', '¿De dónde eres, Nacho?', "Tu viens d'où, Nacho ?"),
    W('vivo_en', 'vivo en', "j'habite à / en", '🏠', 'presentacion', 'Vivo en Madrid.', "J'habite à Madrid."),
    W('tengo', 'tengo', "j'ai", '✋', 'presentacion', 'Tengo una mochila.', "J'ai un sac à dos."),
    W('anos', 'años', 'ans', '🎂', 'presentacion', '¿Cuántos años tienes?', 'Quel âge as-tu ?', { genero: 'm', soloPlural: true }),
    W('nombre', 'nombre', 'prénom, nom', '📛', 'presentacion', 'Mi nombre es Marina.', "Mon prénom est Marina.", { genero: 'm' }),
    W('amigo', 'amigo', 'ami', '🧑‍🤝‍🧑', 'presentacion', 'Nacho es mi amigo.', 'Nacho est mon ami.', { genero: 'm', femenino: 'amiga' }),
    W('chico', 'chico', 'garçon', '👦', 'personas', 'Nacho es un chico de Madrid.', 'Nacho est un garçon de Madrid.', { genero: 'm' }),
    W('chica', 'chica', 'fille', '👧', 'personas', 'Marina es una chica de Sevilla.', 'Marina est une fille de Séville.', { genero: 'f' }),
    // pronombres
    W('yo', 'yo', 'je, moi', '☝️', 'pronombres', 'Yo soy Álex.', 'Moi, je suis Álex.'),
    W('tu', 'tú', 'tu, toi', '👉', 'pronombres', 'Tú eres de París.', 'Toi, tu es de Paris.'),
    W('el_pron', 'él', 'il, lui', '👨', 'pronombres', 'Él es Nacho.', 'Lui, c’est Nacho.'),
    W('ella', 'ella', 'elle', '👩', 'pronombres', 'Ella es Marina.', 'Elle, c’est Marina.'),
    // paises
    W('espana', 'España', 'Espagne', '🇪🇸', 'paises', 'Madrid es la capital de España.', 'Madrid est la capitale de l’Espagne.'),
    W('francia', 'Francia', 'France', '🇫🇷', 'paises', 'París es la capital de Francia.', 'Paris est la capitale de la France.'),
    W('mexico', 'México', 'Mexique', '🇲🇽', 'paises', 'El Quetzal es de México.', 'Le Quetzal vient du Mexique.'),
    W('argentina', 'Argentina', 'Argentine', '🇦🇷', 'paises', 'Buenos Aires es la capital de Argentina.', 'Buenos Aires est la capitale de l’Argentine.'),
    // nacionalidades
    W('espanol', 'español', 'espagnol', '🥘', 'nacionalidades', 'Nacho es español.', 'Nacho est espagnol.', { adj: true, genero: 'm', femenino: 'española' }),
    W('frances', 'francés', 'français', '🥖', 'nacionalidades', 'Álex es francés.', 'Álex est français.', { adj: true, genero: 'm', femenino: 'francesa' }),
    W('mexicano', 'mexicano', 'mexicain', '🌮', 'nacionalidades', 'Mi amigo es mexicano.', 'Mon ami est mexicain.', { adj: true, genero: 'm', femenino: 'mexicana' }),
    W('argentino', 'argentino', 'argentin', '🧉', 'nacionalidades', 'Messi es argentino.', 'Messi est argentin.', { adj: true, genero: 'm', femenino: 'argentina' }),
    // numeros
    W('cero', 'cero', 'zéro', '0️⃣', 'numeros', 'Cero problemas.', 'Zéro problème.'),
    W('uno', 'uno', 'un', '1️⃣', 'numeros', 'Uno, dos, tres… ¡ya!', 'Un, deux, trois… partez !'),
    W('dos', 'dos', 'deux', '2️⃣', 'numeros', 'Tengo dos amigos.', "J'ai deux amis."),
    W('tres', 'tres', 'trois', '3️⃣', 'numeros', 'Tres churros, por favor.', "Trois churros, s'il vous plaît."),
    W('cuatro', 'cuatro', 'quatre', '4️⃣', 'numeros', 'Cuatro más cuatro son ocho.', 'Quatre plus quatre font huit.'),
    W('cinco', 'cinco', 'cinq', '5️⃣', 'numeros', 'Cinco churros, por favor.', "Cinq churros, s'il vous plaît."),
    W('seis', 'seis', 'six', '6️⃣', 'numeros', 'Seis y cuatro son diez.', 'Six et quatre font dix.'),
    W('siete', 'siete', 'sept', '7️⃣', 'numeros', 'Tengo siete amigos.', "J'ai sept amis."),
    W('ocho', 'ocho', 'huit', '8️⃣', 'numeros', 'Ocho más dos son diez.', 'Huit plus deux font dix.'),
    W('nueve', 'nueve', 'neuf', '9️⃣', 'numeros', 'Nueve menos cuatro son cinco.', 'Neuf moins quatre font cinq.'),
    W('diez', 'diez', 'dix', '🔟', 'numeros', 'Diez churros para Nacho.', 'Dix churros pour Nacho.'),
    W('once', 'once', 'onze', null, 'numeros', 'Tengo once años.', "J'ai onze ans.", { ilustracion: 'Le nombre 11 en gros chiffres colorés' }),
    W('doce', 'doce', 'douze', null, 'numeros', 'Marina tiene doce años.', 'Marina a douze ans.', { ilustracion: 'Le nombre 12 en gros chiffres colorés' }),
    W('trece', 'trece', 'treize', null, 'numeros', 'Nacho tiene trece años.', 'Nacho a treize ans.', { ilustracion: 'Le nombre 13 en gros chiffres colorés' }),
    W('catorce', 'catorce', 'quatorze', null, 'numeros', 'Mi amigo tiene catorce años.', 'Mon ami a quatorze ans.', { ilustracion: 'Le nombre 14 en gros chiffres colorés' }),
    W('quince', 'quince', 'quinze', null, 'numeros', 'Mi amiga tiene quince años.', 'Mon amie a quinze ans.', { ilustracion: 'Le nombre 15 en gros chiffres colorés' }),
    W('veinte', 'veinte', 'vingt', null, 'numeros', 'Veinte churros, por favor.', "Vingt churros, s'il vous plaît.", { ilustracion: 'Le nombre 20 en gros chiffres colorés' }),
    W('treinta', 'treinta', 'trente', null, 'numeros', 'Treinta personas en la plaza.', 'Trente personnes sur la place.', { ilustracion: 'Le nombre 30 en gros chiffres colorés' }),
    W('cuarenta', 'cuarenta', 'quarante', null, 'numeros', 'Cuarenta y dos minutos.', 'Quarante-deux minutes.', { ilustracion: 'Le nombre 40 en gros chiffres colorés' }),
    W('cincuenta', 'cincuenta', 'cinquante', null, 'numeros', 'Rosa tiene cincuenta años.', 'Rosa a cinquante ans.', { ilustracion: 'Le nombre 50 en gros chiffres colorés' }),
    W('cien', 'cien', 'cent', '💯', 'numeros', 'Cien años de historia.', 'Cent ans d’histoire.'),
  ];

  // ───────────── Gramática ─────────────
  const T = (a, b) => [a, b];
  const gramatica = [
    G('g_abecedario', 'El abecedario', "L'alphabet", [
      ['a, be, ce, de, e, efe, ge, hache, i, jota', 'a, b, c, d, e, f, g, h, i, j (les noms des lettres)'],
      ['eme, a, erre, i, ene, a', 'M, A, R, I, N, A : Marina épelée'],
      ['¿Cómo se escribe «Álex»?', 'Comment s’écrit « Álex » ?', 'nacho'],
      ['A con tilde, ele, e, equis.', 'A avec accent, L, E, X.', 'viajero', ['con tilde']],
    ], 'El abecedario tiene veintisiete letras. La hache no suena. La eñe es una letra especial.', "L'alphabet a vingt-sept lettres. Le h ne se prononce pas. Le ñ est une lettre spéciale.",
    "27 lettres : le ñ (« eñe ») s'ajoute à notre alphabet. Le h est muet. K et W n'existent presque que dans des mots étrangers. Pour épeler, on dit le nom des lettres : Marina = eme, a, erre, i, ene, a (pour le R, on entend aussi « ere »). Une lettre avec un accent écrit se dit « con tilde » : Á = a con tilde. CH et LL ne sont plus des lettres à part : ce sont deux lettres qui forment un son.",
    { encabezado: ['Letra', 'Nombre'], filas: [['A','a'],['B','be'],['C','ce'],['D','de'],['E','e'],['F','efe'],['G','ge'],['H','hache'],['I','i'],['J','jota'],['K','ka'],['L','ele'],['M','eme'],['N','ene'],['Ñ','eñe'],['O','o'],['P','pe'],['Q','cu'],['R','erre'],['S','ese'],['T','te'],['U','u'],['V','uve'],['W','uve doble'],['X','equis'],['Y','ye'],['Z','zeta']] }),
    G('g_pronunciacion', 'Suena así', 'Ça se prononce comme ça', [
      ['La jota: José, jamón, jirafa.', 'Le J : José, jambon, girafe.', 'marina', ['j']],
      ['La hache no suena: hola, hotel.', 'Le H est muet : hola, hotel.', 'marina', ['hola', 'hotel']],
      ['La eñe: España, mañana, niño.', 'Le Ñ : España, mañana, niño.', 'marina', ['ñ']],
      ['La erre doble: perro, guitarra.', 'Le RR roulé : perro (chien), guitarra (guitare).', 'marina', ['rr']],
      ['La elle: me llamo, calle.', 'Le LL : me llamo, calle (rue).', 'marina', ['ll']],
    ], 'La jota suena fuerte. La hache no suena. La eñe suena como «ni». La erre doble vibra. La elle suena casi como la ye.',
    'Le J est dur, au fond de la gorge. Le H est muet. Le Ñ sonne « gn ». Le RR roule. Le LL ressemble à « y ».',
    "Pièges des francophones : le J n'est pas le « j » français (c'est un « h » soufflé, rude, du fond de la gorge) et le H est muet. Accent tonique : un mot terminé par une voyelle, -n ou -s porte l'accent sur l'avant-dernière syllabe (Ma-RI-na, LU-nes) ; terminé par une autre consonne, sur la dernière (es-pa-ÑOL, Ma-DRID). Sinon, un accent écrit montre la syllabe forte (a-DIÓS, MÉ-xi-co).", null),
    G('g_numeros', 'Los números', 'Les nombres', [
      ['dieciséis, diecisiete, dieciocho, diecinueve', '16, 17, 18, 19', N, ['dieci']],
      ['veintiuno, veintidós, veintitrés, veinticuatro', '21, 22, 23, 24', N, ['veinti']],
      ['treinta y cinco', '35', N, ['y']],
      ['cuarenta y ocho', '48', N, ['y']],
      ['sesenta, setenta, ochenta, noventa, cien', '60, 70, 80, 90, 100', N, ['sesenta', 'setenta']],
    ], 'Del dieciséis al diecinueve: dieci más el número. Del veintiuno al veintinueve: veinti más el número. Desde el treinta y uno: la decena, «y» y el número.',
    'De 16 à 19 : dieci + le nombre. De 21 à 29 : veinti + le nombre. À partir de 31 : dizaine + y + unité.',
    "Les accents : dieciséis, veintidós, veintitrés, veintiséis. Entre 16 et 29, un seul mot ; à partir de 31, trois mots avec « y » (treinta y cinco). Les dizaines : treinta, cuarenta, cincuenta, sesenta, setenta, ochenta, noventa ; attention, sesenta (60) ≠ setenta (70). 100 = cien.",
    { encabezado: ['Cifra', 'Se forma', 'Se dice'], filas: [['16', 'dieci + seis', 'dieciséis'], ['21', 'veinti + uno', 'veintiuno'], ['35', 'treinta + y + cinco', 'treinta y cinco'], ['48', 'cuarenta + y + ocho', 'cuarenta y ocho'], ['60 · 70', 'decena', 'sesenta · setenta'], ['80 · 90', 'decena', 'ochenta · noventa'], ['99', 'noventa + y + nueve', 'noventa y nueve'], ['100', '—', 'cien']] }),
    G('g_nacionalidad', '¿Eres español o española?', 'Espagnol ou espagnole ?', [
      ['Álex es francés.', 'Álex est français.', 'marina', ['francés']],
      ['Marina es española.', 'Marina est espagnole.', 'marina', ['española']],
      ['Leo es mexicano.', 'Leo est mexicain.', 'marina', ['mexicano']],
      ['Sofía es argentina.', 'Sofía est argentine.', 'marina', ['argentina']],
    ], 'Para un chico: español, francés, mexicano. Para una chica: española, francesa, mexicana. Las nacionalidades se escriben con minúscula.',
    "Pour un garçon : español, francés, mexicano. Pour une fille : española, francesa, mexicana. Pas de majuscule pour les nationalités.",
    "L'adjectif s'accorde : -o devient -a, et les mots en consonne ajoutent -a (francés → francesa : l'accent écrit disparaît). Pas de majuscule pour les nationalités ni les langues.",
    { encabezado: ['', 'español', 'francés', 'mexicano', 'argentino'], filas: [['él', 'español', 'francés', 'mexicano', 'argentino'], ['ella', 'española', 'francesa', 'mexicana', 'argentina']] }),
    G('g_pronombres_ser', 'Yo soy, tú eres', 'Je suis, tu es', [
      ['Yo soy Álex.', 'Moi, je suis Álex.', 'viajero', ['soy']],
      ['Tú eres de Francia.', 'Toi, tu es de France.', 'marina', ['eres']],
      ['Él es Nacho.', 'Lui, c’est Nacho.', 'marina', ['es']],
      ['Ella es Marina.', 'Elle, c’est Marina.', 'marina', ['es']],
    ], 'Con «ser» decimos quiénes somos y de dónde somos: yo soy, tú eres, él es, ella es.',
    'Avec « ser », on dit qui on est et d’où on vient : yo soy, tú eres, él es, ella es.',
    "Ser = être (identité, origine, nationalité). On omet souvent le pronom : « Soy Álex » suffit. Tú (avec accent) = tu ; tu (sans accent) = ton/ta.",
    { encabezado: ['Pronombre', 'ser'], filas: [['yo', 'soy'], ['tú', 'eres'], ['él / ella', 'es']] }),
    G('g_llamarse', 'Me llamo…', "Je m'appelle…", [
      ['Me llamo Álex.', "Je m'appelle Álex.", 'viajero', ['llamo']],
      ['¿Cómo te llamas?', "Comment tu t'appelles ?", 'marina', ['llamas']],
      ['Se llama Nacho.', "Il s'appelle Nacho.", 'marina', ['llama']],
    ], 'Para decir tu nombre: «me llamo» y tu nombre. Para preguntar: «¿cómo te llamas?».',
    'Pour dire ton prénom : « me llamo » + ton prénom. Pour demander : « ¿cómo te llamas? ».',
    "Llamarse = s'appeler. Me / te / se accompagnent toujours le verbe. Radical llam- + terminaison -o, -as, -a. Cómo prend un accent dans une question.",
    { encabezado: ['Pronombre', 'llamarse'], filas: [['yo', 'me llamo'], ['tú', 'te llamas'], ['él / ella', 'se llama']] }),
    G('g_tener_edad', 'Tengo doce años', "J'ai douze ans", [
      ['Tengo doce años.', "J'ai douze ans.", 'viajero', ['tengo']],
      ['¿Cuántos años tienes?', "Quel âge as-tu ?", 'marina', ['tienes']],
      ['Marina tiene doce años.', 'Marina a douze ans.', 'marina', ['tiene']],
    ], 'Para la edad usamos «tener», no «ser»: tengo doce años.',
    "Pour l'âge, on utilise « tener », pas « ser » : tengo doce años.",
    "Comme en français, on « a » un âge : jamais « soy doce años ». Tener est irrégulier : tengo (avec un g), puis tienes, tiene (le e devient ie).",
    { encabezado: ['Pronombre', 'tener'], filas: [['yo', 'tengo'], ['tú', 'tienes'], ['él / ella', 'tiene']] }),
    G('g_preguntas', 'Las preguntas', 'Les questions', [
      ['¿Cómo te llamas?', "Comment tu t'appelles ?", 'marina', ['¿Cómo']],
      ['¿De dónde eres?', "D'où viens-tu ?", 'marina', ['¿De dónde']],
      ['¿Cuántos años tienes?', 'Quel âge as-tu ?', 'marina', ['¿Cuántos']],
      ['¿Qué tal?', 'Comment ça va ?', 'marina', ['¿Qué']],
    ], 'En español, una pregunta tiene dos signos: uno al principio y otro al final. Las palabras para preguntar llevan tilde: cómo, dónde, cuántos, qué.',
    "En espagnol, une question a deux signes : ¿ au début et ? à la fin. Les mots interrogatifs portent un accent écrit : cómo, dónde, cuántos, qué.",
    "Le point d'interrogation s'ouvre à l'envers (¿) au début de la question — et de même ¡ ... ! pour l'exclamation. Les mots interrogatifs ont toujours un accent écrit.", null),
  ];

  // ───────────── Cinemáticas ─────────────
  const intro = cine('u01-intro', 'intro', 'Capítulo 1 · ¡Hola! · Madrid', [
    P(3, "Carte du monde en papel picado qui zoome sur l'Espagne puis sur Madrid ; un point doré pulse. Carte-titre « Capítulo 1 · ¡Hola! · Madrid ».", [L(N, 'Capítulo uno: ¡Hola!', 'Chapitre un : salut !')], { rotulo: 'Capítulo 1 · ¡Hola! · Madrid', camara: 'zoom avant progressif' }),
    P(5, "Silhouettes dorées de la Puerta de Alcalá, du Palacio Real et de la Plaza Mayor qui défilent sur un coucher de soleil, bordure de papel picado.", [L(N, 'Madrid, la capital de España.', "Madrid, la capitale de l'Espagne."), L(N, 'Aquí empieza tu aventura.', 'Ici commence ton aventure.')], { camara: 'travelling latéral lent' }),
  ]);
  const historia = cine('u01-historia', 'historia', 'La Academia de Viajeros', [
    P(7, "Intérieur de l'Academia de Viajeros : bibliothèque, globes, lumière dorée. Don Ignacio (moustache, chapeau) accueille Álex vu de dos, sac à dos sur l'épaule.", [
      L('ignacio', '¡Bienvenido a la Academia de Viajeros! Me llamo Ignacio.', "Bienvenue à l'Académie des Voyageurs ! Je m'appelle Ignacio."),
      L('ignacio', 'Y tú, ¿cómo te llamas?', 'Et toi, comment tu t’appelles ?'),
      L('viajero', 'Me llamo Álex.', "Je m'appelle Álex."),
    ], { personajes: ['ignacio', 'viajero'], camara: 'plan moyen, légère contre-plongée' }),
    P(7, "Une plume verte tombe du plafond. Le Quetzal, presque sans plumes, entre en titubant et se pose sur le bureau.", [
      L('ignacio', 'Mira, es el Quetzal. Está muy cansado.', 'Regarde, c’est le Quetzal. Il est très fatigué.'),
      L('quetzal', 'Hola… Sin plumas… no puedo volar.', 'Salut… Sans plumes… je ne peux pas voler.'),
    ], { personajes: ['ignacio', 'quetzal'], camara: 'gros plan sur le Quetzal' }),
    P(7, "Gros plan sur Ignacio ; derrière lui, la carte du monde avec des points lumineux (les plumes) et une ombre qui passe dessus.", [
      L('ignacio', 'La Sombra del Silencio tiene las plumas del Quetzal. Quiere un mundo sin palabras.', "L'Ombre du Silence a les plumes du Quetzal. Elle veut un monde sans mots."),
      L('quetzal', '¡Ayúdame, por favor!', 'Aide-moi, s’il te plaît !'),
    ], { personajes: ['ignacio', 'quetzal'], musica: 'tension douce, cordes' }),
    P(7, "Marina entre en courant, sac à dos, grand sourire. Plan à quatre personnages.", [
      L('marina', '¡Hola! Me llamo Marina. Soy de Sevilla, pero vivo en Madrid.', 'Salut ! Je m’appelle Marina. Je suis de Séville, mais j’habite à Madrid.'),
      L('ignacio', 'La primera pluma está en Madrid. ¡Vamos!', 'La première plume est à Madrid. En route !'),
    ], { personajes: ['marina', 'ignacio', 'viajero', 'quetzal'], musica: 'thème d’aventure' }),
  ]);
  const capsula = cine('u01-capsula-hispanos', 'capsula', 'El español en el mundo', [
    P(4, "Planisphère animé (style explainer Vox) : l'Espagne, les pays hispanophones d'Amérique (du Mexique à l'Argentine, Cuba, Porto Rico… mais PAS le Brésil, lusophone) et la Guinée équatoriale s'illuminent en turquoise.", [L(N, 'El español se habla en muchos países.', 'On parle espagnol dans beaucoup de pays.')], { camara: 'plan fixe sur la carte' }),
    P(5, "Compteur animé qui monte jusqu'à « 600 000 000 », call-out « personas » (source : Instituto Cervantes, environ 600 millions de locuteurs, dont environ 500 millions de langue maternelle).", [L(N, 'Unos seiscientos millones de personas hablan español.', 'Environ six cents millions de personnes parlent espagnol.')]),
    P(5, "Zoom sur l'Espagne, le Mexique et l'Argentine : drapeaux et silhouettes (Sagrada Familia, pyramide, obélisque).", [L(N, 'España, México, Argentina… ¡y muchos más!', 'Espagne, Mexique, Argentine… et bien d’autres !')]),
    P(4, "Retour sur la carte : la plume du Quetzal s'envole vers l'ouest.", [L(N, 'El viaje del Quetzal empieza en España.', 'Le voyage du Quetzal commence en Espagne.')]),
  ]);
  const pluma = cine('u01-pluma', 'pluma', 'Primera pluma', [
    P(3, "La Sombra se dissout en poussière dorée ; une plume verte brillante tombe lentement et Álex la rattrape. Flash de lumière.", [L('quetzal', '¡Gracias, amigo! ¡Hola!', 'Merci, ami ! Salut !')], { personajes: ['quetzal', 'viajero'] }),
    P(2, "La carte du monde : une empreinte lumineuse indique Salamanca.", [L('ignacio', 'Ahora, a Salamanca.', 'Maintenant, direction Salamanque.')], { personajes: ['ignacio'] }),
  ]);

  // ───────────── Misiones ─────────────
  const quests = [];

  // 1 — Cinemática
  quests.push(quest('u01', 1, 'cinematica', 'Llegada a Madrid', '🏛️',
    ['ignacio', '¡Bienvenido a Madrid, viajero! Tu aventura empieza aquí.', 'Bienvenue à Madrid, voyageur ! Ton aventure commence ici.'],
    "Découverte de Madrid et de l'Académie ; tu comprends l'histoire sans tout traduire.", ['escuchar', 'cultura'], 10, [
      intro,
      tf('Madrid es una ciudad de España.', true, N, { tr: 'Madrid est une ville d’Espagne.' }),
      tf('Madrid es la capital de Francia.', false, N, { tr: 'Madrid est la capitale de la France.' }),
      historia,
      lcT('Soy de Sevilla, pero vivo en Madrid.', 'marina', ['Marina vive en Sevilla.', 'Marina es de Sevilla y vive en Madrid.', 'Marina es de Madrid.'], 1),
      tf('El Quetzal puede volar.', false, N, { tr: 'Le Quetzal peut voler.' }),
      dlg('ignacio', '¡Bienvenido! Me llamo Ignacio. Y tú, ¿cómo te llamas?', 'Bienvenue ! Je m’appelle Ignacio. Et toi, comment tu t’appelles ?', [
        ['Me llamo Álex.', 1, '¡Encantado, Álex! Tienes nombre de héroe.', 'Enchanté, Álex ! Tu as un nom de héros.', 'Je m’appelle Álex.'],
        ['Adiós.', 0, '¿Adiós? ¡Si acabas de llegar!', 'Au revoir ? Mais tu viens d’arriver !', 'Au revoir.'],
        ['Buenas noches.', 0, '¿Buenas noches? ¡Todavía es de día!', 'Bonne nuit ? Il fait encore jour !', 'Bonne nuit.'],
      ]),
      dlg('marina', 'Hola, ¿qué tal?', 'Salut, ça va ?', [
        ['Bien, gracias.', 1, '¡Muy bien! Vamos.', 'Très bien ! On y va.', 'Bien, merci.'],
        ['Me llamo bien.', 0, '¿Te llamas «bien»? ¡Qué nombre más raro!', 'Tu t’appelles « bien » ? Quel nom bizarre !', 'Je m’appelle bien.'],
        ['Perdón.', 0, '¿Perdón? No pasa nada, tranquilo.', 'Pardon ? Ce n’est pas grave, détends-toi.', 'Pardon.'],
      ]),
      reord('Me llamo Álex.', 'viajero', { tr: 'Je m’appelle Álex.' }),
      speak('Hola, me llamo Álex.', 'viajero', { tr: 'Salut, je m’appelle Álex. (dis ton prénom)', nombre: 'Álex', hechizo: ['Hechizo del saludo', 'Una luz dorada abre la puerta de la Academia'] }),
    ]));

  // 2 — Saludos
  quests.push(quest('u01', 2, 'vocabulario', 'Hola, ¿qué tal?', '👋',
    ['rosa', '¡Buenos días! Soy Rosa. Aquí primero se saluda. ¡Después se comen churros!', 'Bonjour ! Je suis Rosa. Ici, on salue d’abord. Les churros, ensuite !'],
    'Les salutations et les formules de politesse, avec Rosa la churrera.', ['leer', 'escuchar', 'hablar'], 12, [
      flash('hola', 'adios', 'buenos_dias', 'buenas_tardes', 'buenas_noches'),
      lcV('buenos_dias', ['buenas_noches', 'buenos_dias', 'hola']),
      match(['hola', 'adios', 'buenos_dias', 'buenas_tardes', 'buenas_noches']),
      tf('Esta imagen es «buenas noches».', true, N, { img: 'buenas_noches', tr: 'Cette image, c’est « buenas noches ».' }),
      tf('Esta imagen es «adiós».', false, N, { img: 'buenos_dias', tr: 'Cette image, c’est « adiós ».' }),
      flash('por_favor', 'gracias', 'de_nada', 'perdon', 'que_tal', 'hasta_luego', 'encantado'),
      flash('bien', 'regular', 'mal'),
      lcT('Gracias.', N, ['De nada.', 'Hasta luego.', 'Buenos días.'], 0, { es: 'Escucha y elige la respuesta.', fr: 'Écoute et choisis la réponse.' }),
      lcT('¿Qué tal?', 'marina', ['De nada.', 'Bien, gracias.', 'Adiós.'], 1, { es: 'Escucha y elige la respuesta.', fr: 'Écoute et choisis la réponse.' }),
      dlg('rosa', '¡Buenos días! ¿Qué tal?', 'Bonjour ! Ça va ?', [
        ['Bien, gracias.', 1, '¡Estupendo! Hoy hay churros calentitos.', 'Super ! Aujourd’hui il y a des churros bien chauds.', 'Bien, merci.'],
        ['Adiós.', 0, '¿Adiós? Pero si todavía no has comprado nada.', 'Au revoir ? Mais tu n’as encore rien acheté.', 'Au revoir.'],
        ['De nada.', 0, '¿De nada? Yo no te he dicho «gracias».', 'De rien ? Je ne t’ai pas dit « merci ».', 'De rien.'],
      ]),
      dlg('rosa', 'Aquí tienes: tres churros.', 'Voilà : trois churros.', [
        ['Gracias.', 1, '¡De nada! Hasta luego.', 'De rien ! À tout à l’heure.', 'Merci.'],
        ['Perdón.', 0, '¿Perdón? ¿Por qué? ¡Los churros no muerden!', 'Pardon ? Pourquoi ? Les churros ne mordent pas !', 'Pardon.'],
        ['Buenas noches.', 0, 'Son las once de la mañana, cariño.', 'Il est onze heures du matin, mon petit.', 'Bonne nuit.'],
      ]),
      fill('___ días, Rosa.', 'Buenos', N, { opts: ['Buenos', 'Buenas', 'Bueno'], tr: 'Bonjour, Rosa.' }),
      reord('Hola, ¿qué tal?', 'marina', { tr: 'Salut, ça va ?' }),
      dict('Buenas noches', N, { acept: ['buenas noches'] }),
      speak('Buenos días, ¿qué tal?', 'rosa', { tr: 'Bonjour, ça va ?', hechizo: ['Hechizo del churro', 'Un churro dorado aparece en tu inventario'] }),
    ]));

  // 3 — Abecedario
  const letra = C('Escucha la letra y elige.', 'Écoute la lettre et choisis.');
  const dictLetras = (es, voz, resp, acept) => ({ ...dict(es, voz, { resp, acept }), consigna: C('Escucha las letras y escribe el nombre.', 'Écoute les lettres et écris le prénom.') });
  quests.push(quest('u01', 3, 'hechizo', 'El hechizo del abecedario', '🔤',
    ['marina', 'Para viajar necesitas el abecedario. ¡Es tu primer hechizo!', 'Pour voyager, il te faut l’alphabet. C’est ton premier sort !'],
    "L'alphabet espagnol, l'épellation de ton prénom et les sons difficiles (j, h, ñ, rr, ll).", ['escuchar', 'hablar', 'escribir'], 14, [
      gram('g_abecedario'),
      { ...lcT('jota', N, ['J', 'G', 'H'], 0), consigna: letra },
      { ...lcT('hache', N, ['J', 'H', 'A'], 1), consigna: letra },
      dictLetras('a con tilde, ele, e, equis', 'viajero', 'Álex', ['álex']),
      dictLetras('eme, a, erre, i, ene, a', 'marina', 'Marina', ['marina']),
      // SON prénom : objectif de l'unité (épeler son nom) — à l'écrit puis à l'oral
      writeFree('Mi nombre es ___. Se escribe: ___.', [
        { id: 'nombre', pista: 'Ton prénom', tipo: 'texto' },
        { id: 'letras', pista: 'Ton prénom lettre par lettre, séparées par des virgules (ex. M, A, R, I, N, A)', tipo: 'texto' },
      ], 'Mi nombre es Marina. Se escribe: eme, a, erre, i, ene, a.', 'Mon prénom est Marina. Il s’écrit : M, A, R, I, N, A.', 'marina',
      C('Escribe tu nombre letra por letra.', 'Écris ton prénom lettre par lettre.')),
      speak('Mi nombre empieza por la letra a.', 'viajero', { libre: 'a', es: 'Escucha y di con qué letra empieza TU nombre.', fr: 'Écoute et dis avec quelle lettre commence TON prénom (le nom de la lettre : eme, ene, pe…).', tr: 'Mon prénom commence par la lettre A. (dis la tienne)', hechizo: ['Hechizo de la inicial', 'La primera letra de tu nombre brilla en el aire'] }),
      speak('Mi nombre tiene cuatro letras.', 'viajero', { libre: 'cuatro', es: 'Escucha y di cuántas letras tiene TU nombre.', fr: 'Écoute et dis combien de lettres a TON prénom.', tr: 'Mon prénom a quatre lettres. (dis le nombre du tien)', acept: ['mi nombre tiene 4 letras'], hechizo: ['Hechizo de las letras', 'Las letras de tu nombre bailan a tu alrededor'] }),
      gram('g_pronunciacion'),
      speak('Mi amigo José', 'marina', { tr: 'Mon ami José', acept: ['mi amigo jose'], foco: 'La j espagnole est rude : un « h » soufflé du fond de la gorge, bien plus fort qu’en anglais.', hechizo: ['Hechizo de la jota', 'Un viento fuerte sopla sobre la plaza'] }),
      speak('El perro de Rosa', 'marina', { tr: 'Le chien de Rosa', foco: 'Le rr (perro) est roulé avec la pointe de la langue : r-r-r. Le r simple (Rosa, au début d’un mot) se roule aussi.', hechizo: ['Hechizo de la erre', 'El suelo vibra bajo tus pies'] }),
      speak('Mañana en España', 'marina', { tr: 'Demain en Espagne', foco: 'Le ñ se prononce « gn » comme dans « montagne » : ma-GNA-na, es-PA-gna.', hechizo: ['Hechizo de la eñe', 'Una ola de luz recorre la calle'] }),
      speak('Me llamo Guillermo', 'marina', { tr: 'Je m’appelle Guillermo', foco: 'Le ll se prononce presque comme un « y » : me YA-mo. Dans « Guillermo », le u est muet : gi-YER-mo.', hechizo: ['Hechizo de la elle', 'Tu nombre brilla en el aire'] }),
      reord('¿Cómo se escribe tu nombre?', 'nacho', { tr: 'Comment s’écrit ton prénom ?' }),
      dlg('nacho', 'Hola, me llamo Nacho. ¿Cómo se escribe tu nombre?', 'Salut, je m’appelle Nacho. Comment s’écrit ton prénom ?', [
        ['A con tilde, ele, e, equis.', 1, '¡Perfecto! Álex, con tilde. ¡Qué elegante!', 'Parfait ! Álex, avec l’accent. Quelle élégance !', 'A avec accent, L, E, X.'],
        ['Se escribe pizza.', 0, '¿Pizza? ¡Me has dado hambre!', 'Pizza ? Tu m’as donné faim !', 'Ça s’écrit pizza.'],
        ['Me llamo Nacho.', 0, 'Eso ya lo sé: Nacho soy yo.', 'Ça, je le sais déjà : Nacho, c’est moi.', 'Je m’appelle Nacho.'],
      ]),
    ]));

  // 4 — Números
  quests.push(quest('u01', 4, 'escucha', 'Los números mágicos', '🔢',
    ['nacho', 'Los números están por toda la ciudad. ¿Los contamos juntos?', 'Les nombres sont partout dans la ville. On les compte ensemble ?'],
    'Les nombres de 0 à 100, à l’oreille d’abord, puis à l’écrit.', ['escuchar', 'leer', 'hablar'], 14, [
      flash('cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco'),
      flash('seis', 'siete', 'ocho', 'nueve', 'diez'),
      lcV('siete', ['cinco', 'siete', 'nueve']),
      match(['tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho']),
      dict('ocho', N, { es: 'Escucha y escribe el número en letras.', fr: 'Écoute et écris le nombre en lettres.' }),
      flash('once', 'doce', 'trece', 'catorce', 'quince', 'veinte'),
      lcT('doce', 'nacho', ['2', '12', '20'], 1),
      lcT('quince', 'nacho', ['5', '15', '50'], 1),
      gram('g_numeros'),
      flash('treinta', 'cuarenta', 'cincuenta', 'cien'),
      lcT('Treinta y cinco.', 'rosa', ['25', '35', '45'], 1),
      fill('Veinte, treinta, cuarenta, cincuenta, ___.', 'sesenta', N, { opts: ['sesenta', 'setenta', 'seis'], tr: '20, 30, 40, 50, 60.' }),
      dict('dieciséis', N, { es: 'Escucha y escribe el número en letras.', fr: 'Écoute et écris le nombre en lettres (attention à l’accent).' }),
      lcT('Mi número de la suerte es el veintisiete.', 'marina', ['17', '27', '37'], 1),
      speak('Tres, dos, uno… ¡cero!', 'nacho', { tr: 'Trois, deux, un… zéro !', acept: ['3 2 1 0', '3 2 1 cero'], hechizo: ['Hechizo de la cuenta atrás', 'Un cohete de papel sale volando'] }),
    ]));

  // 5 — Cultura
  quests.push(quest('u01', 5, 'cultura', 'El mundo en español', '🌎',
    ['ignacio', 'El español es la lengua de muchos países. Vamos a conocerlos.', 'L’espagnol est la langue de nombreux pays. Allons les découvrir.'],
    'Le monde hispanophone : pays et nationalités.', ['cultura', 'leer', 'escuchar'], 12, [
      capsula,
      tf('El español se habla en un solo país.', false, N, { tr: 'On parle espagnol dans un seul pays.' }),
      tf('En México se habla español.', true, N, { tr: 'Au Mexique, on parle espagnol.' }),
      flash('espana', 'francia', 'mexico', 'argentina'),
      match(['espana', 'francia', 'mexico', 'argentina']),
      lcV('mexico', ['espana', 'mexico', 'argentina']),
      flash('espanol', 'frances', 'mexicano', 'argentino'),
      gram('g_nacionalidad'),
      match(['espanol', 'frances', 'mexicano', 'argentino']),
      lcT('Hola, soy Camila. Soy de Argentina.', N, ['Camila es mexicana.', 'Camila es argentina.', 'Camila es española.'], 1),
      read('Hola, me llamo Sofía. Soy argentina, de Buenos Aires. Tengo doce años. Mi amigo Leo es mexicano y vive en Oaxaca.', N,
        'Salut, je m’appelle Sofía. Je suis argentine, de Buenos Aires. J’ai douze ans. Mon ami Leo est mexicain et habite à Oaxaca.', [
          ['¿De dónde es Sofía?', 'D’où vient Sofía ?', ['De México.', 'De Argentina.', 'De España.'], 1],
          ['¿Cuántos años tiene Sofía?', 'Quel âge a Sofía ?', ['Doce.', 'Trece.', 'Quince.'], 0],
          ['¿Leo es argentino?', 'Leo est-il argentin ?', ['Sí, es argentino.', 'No, es mexicano.', 'No, es español.'], 1],
        ]),
      fill('Marina es de Sevilla. Es ___.', 'española', 'marina', { opts: ['español', 'española', 'francesa'], tr: 'Marina est de Séville. Elle est espagnole.' }),
      fill('Álex es de París. Es ___.', 'francés', 'marina', { opts: ['francés', 'francesa', 'mexicano'], tr: 'Álex est de Paris. Il est français.' }),
      reord('Nacho es español y yo soy francés.', 'viajero', { tr: 'Nacho est espagnol et moi je suis français.' }),
    ]));

  // 6 — Forja
  quests.push(quest('u01', 6, 'forja', 'La Forja: soy, me llamo, tengo', '⚒️',
    ['quetzal', 'Palabras… poder. Forja conmigo: soy, me llamo, tengo.', 'Les mots… ont du pouvoir. Forge avec moi : soy, me llamo, tengo.'],
    'Les verbes ser, llamarse et tener au présent : découverte puis forge.', ['escribir', 'leer'], 14, [
      flash('yo', 'tu', 'el_pron', 'ella'),
      gram('g_pronombres_ser'),
      conj('ser', 'yo', '', 'soy', ['soy', 'eres', 'es'], 'viajero', { tr: 'Moi, je suis…' }),
      conj('ser', 'tú', '', 'eres', ['soy', 'eres', 'es'], 'marina', { tr: 'Toi, tu es…' }),
      conj('ser', 'él', '', 'es', ['soy', 'eres', 'es'], 'marina', { tr: 'Lui, il est…' }),
      gram('g_llamarse'),
      conj('llamarse', 'yo', 'me llam', 'o', ['o', 'as', 'a'], 'viajero', { tr: 'Moi, je m’appelle…' }),
      conj('llamarse', 'tú', 'te llam', 'as', ['o', 'as', 'a'], 'marina', { tr: 'Toi, tu t’appelles…' }),
      conj('llamarse', 'ella', 'se llam', 'a', ['o', 'as', 'a'], 'marina', { tr: 'Elle s’appelle…' }),
      fill('Y tú, ¿cómo te ___?', 'llamas', 'marina', { opts: ['llamas', 'llamo', 'llama'], tr: 'Et toi, comment tu t’appelles ?' }),
      gram('g_tener_edad'),
      conj('tener', 'yo', 'teng', 'o', ['o', 'es', 'e'], 'viajero', { tr: 'Moi, j’ai…' }),
      conj('tener', 'tú', 'tien', 'es', ['o', 'es', 'e'], 'marina', { tr: 'Toi, tu as…' }),
      conj('tener', 'él', 'tien', 'e', ['o', 'es', 'e'], 'nacho', { tr: 'Lui, il a…' }),
      fill('Marina ___ doce años.', 'tiene', 'marina', { opts: ['tengo', 'tienes', 'tiene'], tr: 'Marina a douze ans.' }),
    ]));

  // 7 — Diálogo
  quests.push(quest('u01', 7, 'dialogo', 'Me presento', '💬',
    ['marina', 'Es hora de presentarte. ¡Yo te ayudo!', 'C’est l’heure de te présenter. Je t’aide !'],
    'Te présenter : prénom, âge, origine, lieu de vie. Dialogues à choix puis écriture et prise de parole.', ['hablar', 'escribir', 'escuchar'], 15, [
      flash('me_llamo', 'como_te_llamas', 'soy', 'de_donde_eres', 'vivo_en', 'tengo', 'anos'),
      flash('nombre', 'amigo', 'chico', 'chica'),
      gram('g_preguntas'),
      dlg('nacho', '¡Hola! Me llamo Nacho. ¿Cómo te llamas?', 'Salut ! Je m’appelle Nacho. Et toi, comment tu t’appelles ?', [
        ['Me llamo Álex.', 1, '¡Encantado, Álex!', 'Enchanté, Álex !', 'Je m’appelle Álex.'],
        ['Soy Nacho.', 0, '¡Pero Nacho soy yo! ¿Tú eres otro Nacho? ¡Qué lío!', 'Mais Nacho, c’est moi ! Tu es un autre Nacho ? Quel bazar !', 'Je suis Nacho.'],
        ['Bien, gracias.', 0, 'Me alegro, pero te pregunto tu nombre.', 'Tant mieux, mais je te demande ton prénom.', 'Bien, merci.'],
      ]),
      dlg('nacho', '¿De dónde eres?', 'D’où viens-tu ?', [
        ['Soy de París.', 1, '¡París! Muy bonito. Yo soy de Madrid.', 'Paris ! Très joli. Moi, je suis de Madrid.', 'Je suis de Paris.'],
        ['Tengo doce años.', 0, 'Vale, pero te pregunto de dónde eres.', 'D’accord, mais je te demande d’où tu viens.', 'J’ai douze ans.'],
        ['Gracias.', 0, 'De nada… ¿pero de dónde eres?', 'De rien… mais d’où viens-tu ?', 'Merci.'],
      ]),
      dlg('nacho', '¿Cuántos años tienes?', 'Quel âge as-tu ?', [
        ['Tengo doce años.', 1, '¡Como Marina! Yo tengo trece.', 'Comme Marina ! Moi j’ai treize ans.', 'J’ai douze ans.'],
        ['Soy doce años.', 0, '¿Eres doce años? ¡Con «ser» no! Con «tener».', 'Tu es douze ans ? Pas avec « ser » ! Avec « tener ».', 'Je suis douze ans.'],
        ['Me llamo doce.', 0, '¿Te llamas Doce? ¡Qué original!', 'Tu t’appelles Douze ? Quelle originalité !', 'Je m’appelle douze.'],
      ]),
      dlg('marina', 'Yo soy de Sevilla, pero vivo en Madrid. ¿Y tú? ¿Dónde vives?', 'Moi, je suis de Séville, mais j’habite à Madrid. Et toi ? Où habites-tu ?', [
        ['Vivo en París.', 1, '¡Qué bien! París y Madrid, dos capitales.', 'Super ! Paris et Madrid, deux capitales.', 'J’habite à Paris.'],
        ['Me llamo París.', 0, '¿Te llamas París? Hola, París.', 'Tu t’appelles Paris ? Salut, Paris.', 'Je m’appelle Paris.'],
        ['Tengo París.', 0, '¿Tienes París? ¡Qué suerte!', 'Tu as Paris ? Quelle chance !', 'J’ai Paris.'],
      ]),
      dlg('rosa', 'Yo soy Rosa. Soy de Madrid. ¿Eres español?', 'Moi, c’est Rosa. Je suis de Madrid. Tu es espagnol ?', [
        ['No, soy francés. Vivo en París.', 1, '¡Francés! Entonces los churros te van a encantar.', 'Français ! Alors les churros vont te plaire.', 'Non, je suis français. J’habite à Paris.'],
        ['Sí, soy francesa.', 0, '¿Francesa? Tú eres un chico: francés.', 'Française ? Tu es un garçon : « francés ».', 'Oui, je suis française.'],
        ['Sí, me llamo español.', 0, '¿Te llamas Español? ¡Qué nombre!', 'Tu t’appelles Español ? Quel nom !', 'Oui, je m’appelle espagnol.'],
      ]),
      lcT('Me llamo Nacho, tengo trece años y vivo en Madrid.', 'nacho', ['Nacho tiene doce años.', 'Nacho tiene trece años.', 'Nacho vive en París.'], 1),
      reord('Me llamo Álex y tengo doce años.', 'viajero', { tr: 'Je m’appelle Álex et j’ai douze ans.' }),
      reord('Soy francés y vivo en París.', 'viajero', { tr: 'Je suis français et j’habite à Paris.' }),
      fill('Vivo ___ Madrid.', 'en', 'marina', { opts: ['en', 'de', 'tengo'], tr: 'J’habite à Madrid.' }),
      dict('Tengo doce años.', 'marina', { acept: ['tengo 12 años'] }),
      writeFree('Me llamo ___. Tengo ___ años. Soy de ___. Vivo en ___.', [
        { id: 'nombre', pista: 'Ton prénom', tipo: 'texto' },
        { id: 'edad', pista: 'Ton âge (un nombre)', tipo: 'numero' },
        { id: 'origen', pista: 'Ta ville ou ton pays d’origine', tipo: 'texto' },
        { id: 'residencia', pista: 'La ville où tu habites', tipo: 'texto' },
      ], 'Me llamo Marina. Tengo doce años. Soy de Sevilla. Vivo en Madrid.', 'Je m’appelle Marina. J’ai douze ans. Je suis de Séville. J’habite à Madrid.'),
      speak('Hola, me llamo Álex. Tengo doce años. Vivo en París.', 'viajero', { tr: 'Salut, je m’appelle Álex. J’ai douze ans. J’habite à Paris. (dis ton prénom)', nombre: 'Álex', acept: ['hola me llamo álex tengo 12 años vivo en parís', 'hola me llamo álex tengo doce años vivo en paris', 'hola me llamo álex tengo 12 años vivo en paris'], hechizo: ['Hechizo de la presentación', 'La Sombra retrocede un paso'] }),
    ]));

  // 8 — Desafío
  quests.push(quest('u01', 8, 'desafio', 'La Sombra del Silencio', '👤',
    ['sombra', 'Silencio. Nadie habla aquí. Solo yo.', 'Silence. Personne ne parle ici. Seulement moi.'],
    'Boss de la région : révision mixte de l’unité 1. Chaque bonne réponse est une attaque.', ['escuchar', 'hablar', 'leer', 'escribir'], 15, [
      dlg('sombra', 'Soy la Sombra. ¿Cómo te llamas?', 'Je suis l’Ombre. Comment tu t’appelles ?', [
        ['Me llamo Álex.', 1, '¡Grr! Tu voz me molesta…', 'Grr ! Ta voix me dérange…', 'Je m’appelle Álex.'],
        ['Adiós.', 0, 'No puedes irte. Responde.', 'Tu ne peux pas partir. Réponds.', 'Au revoir.'],
        ['Tengo cinco.', 0, '¿Cinco qué? Responde bien.', 'Cinq quoi ? Réponds correctement.', 'J’ai cinq.'],
      ]),
      dlg('sombra', '¿De dónde eres?', 'D’où viens-tu ?', [
        ['Soy francés, de París.', 1, '¡Aaah! Más palabras no, por favor…', 'Aaah ! Pas d’autres mots, s’il te plaît…', 'Je suis français, de Paris.'],
        ['Buenas tardes.', 0, 'Las tardes no son un país.', 'L’après-midi n’est pas un pays.', 'Bonjour. (l’après-midi)'],
        ['Soy español, de Argentina.', 0, '¿De Argentina? Entonces eres argentino, no español.', 'D’Argentine ? Alors tu es argentin, pas espagnol.', 'Je suis espagnol, d’Argentine.'],
      ]),
      lcV('veinte', ['quince', 'veinte', 'cuarenta']),
      lcT('Treinta y siete.', 'sombra', ['27', '37', '47'], 1),
      match(['hola', 'gracias', 'adios', 'perdon', 'buenas_noches']),
      fill('¿De ___ eres?', 'dónde', 'marina', { opts: ['dónde', 'cómo', 'qué'], tr: 'D’où viens-tu ?' }),
      conj('tener', 'tú', 'tien', 'es', ['o', 'es', 'e'], 'marina', { tr: 'Toi, tu as…' }),
      reord('Nacho es español y tiene trece años.', 'marina', { tr: 'Nacho est espagnol et a treize ans.' }),
      dict('Hasta luego, buenas noches.', N, { acept: ['hasta luego buenas noches'] }),
      tf('México es un país de Europa.', false, N, { tr: 'Le Mexique est un pays d’Europe.' }),
      read('Hola, soy Nacho. Tengo trece años. Soy español y vivo en Madrid. Mi amiga se llama Marina.', 'nacho',
        'Salut, c’est Nacho. J’ai treize ans. Je suis espagnol et j’habite à Madrid. Mon amie s’appelle Marina.', [
          ['¿Cuántos años tiene Nacho?', 'Quel âge a Nacho ?', ['Doce.', 'Trece.', 'Catorce.'], 1],
          ['¿Cómo se llama su amiga?', 'Comment s’appelle son amie ?', ['Rosa.', 'Marina.', 'Pilar.'], 1],
        ]),
      dlg('sombra', 'Última pregunta: ¿cómo se escribe tu nombre?', 'Dernière question : comment s’écrit ton prénom ?', [
        ['A con tilde, ele, e, equis.', 1, '¡NOOO! ¡Ya no puedo con tantas letras!', 'NOOON ! Je n’en peux plus, trop de lettres !', 'A avec accent, L, E, X.'],
        ['Se escribe con tinta.', 0, 'Qué gracioso… pero no.', 'Très drôle… mais non.', 'Ça s’écrit à l’encre.'],
        ['Tengo doce años.', 0, 'Eso no es una letra.', 'Ce n’est pas une lettre.', 'J’ai douze ans.'],
      ]),
      speak('Hola, me llamo Álex. Soy francés y tengo doce años.', 'viajero', { tr: 'Salut, je m’appelle Álex. Je suis français et j’ai douze ans. (dis ton prénom)', nombre: 'Álex', acept: ['hola me llamo álex soy francés y tengo 12 años'], hechizo: ['Hechizo final', '¡La Sombra se rompe en mil trozos de luz!'] }),
      pluma,
    ], { jefe: { personaje: 'sombra', vidas: 6 } }));

  return {
    id: 'u01', numero: 1, titulo: '¡Hola! Me presento', lugar: 'Madrid', emoji: '🏛️', ejes: [1], periodo: 'sept',
    objetivos: [
      { es: 'Saludar y despedirse con educación.', fr: 'Saluer et prendre congé poliment.' },
      { es: 'Presentarme: nombre, edad, nacionalidad y lugar donde vivo.', fr: 'Me présenter : prénom, âge, nationalité, lieu de vie.' },
      { es: 'Deletrear mi nombre con el abecedario.', fr: 'Épeler mon prénom avec l’alphabet.' },
      { es: 'Contar de 0 a 100.', fr: 'Compter de 0 à 100.' },
      { es: 'Hacer y contestar preguntas sencillas: ¿cómo te llamas?, ¿de dónde eres?, ¿cuántos años tienes?', fr: 'Poser et répondre à des questions simples.' },
      { es: 'Reconocer los países y las nacionalidades hispanas.', fr: 'Reconnaître pays et nationalités hispaniques.' },
    ],
    vocab, gramatica, quests,
    pluma: { numero: 1, nombre: 'Pluma de la Voz', descripcion: L('quetzal', 'Esta pluma es mi voz. ¡Ahora puedo decir hola!', 'Cette plume est ma voix. Maintenant je peux dire salut !') },
  };
}
