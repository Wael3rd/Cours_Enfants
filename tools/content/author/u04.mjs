// Unidad 4 — ¿Cómo eres? (Ciudad de México · Coyoacán · Casa Azul de Frida Kahlo)
// Axes 1 (portrait / autoportrait) + 6 (Le Mexique). PNJ mexicains : Valentina, Mateo, Don Chucho, Doña Lupita.
// Espagnol d'Espagne pour Álex/Marina/le narrateur ; espagnol du Mexique pour les PNJ mexicains (mots qui diffèrent signalés en français).
import { W, G, quest, flash, match, lcV, lcI, lcT, dict, fill, reord, conj, dlg, read, speak, tf, gram, writeFree, cine, P, L, C, NARR } from './lib.mjs';

export default function build() {
  const N = NARR;
  const ilu = (s) => ({ ilustracion: s });

  // ───────────── Vocabulario (58) ─────────────
  const vocab = [
    // físico
    W('pelo', 'pelo', 'cheveux (on dit aussi « cabello », surtout au Mexique)', '💇', 'fisico', 'Marina tiene el pelo largo.', 'Marina a les cheveux longs.', { genero: 'm' }),
    W('ojos', 'ojos', 'yeux', '👀', 'fisico', 'Tengo los ojos marrones.', 'J’ai les yeux marron.', { genero: 'm' }),
    W('gafas', 'gafas', 'lunettes (au Mexique : « lentes »)', '👓', 'fisico', 'Mi profesor lleva gafas.', 'Mon prof porte des lunettes.', { genero: 'f' }),
    W('trenza', 'trenza', 'tresse', '🪢', 'fisico', 'Frida lleva trenzas con flores.', 'Frida porte des tresses avec des fleurs.', { genero: 'f', plural: 'trenzas' }),
    W('largo', 'largo', 'long', '📏', 'fisico', 'Tengo el pelo largo.', 'J’ai les cheveux longs.', { genero: 'm', femenino: 'larga' }),
    W('corto', 'corto', 'court', '✂️', 'fisico', 'Álex tiene el pelo corto.', 'Álex a les cheveux courts.', { genero: 'm', femenino: 'corta' }),
    W('rizado', 'rizado', 'bouclé (au Mexique, on dit souvent « chino » : el pelo chino)', '🧑‍🦱', 'fisico', 'Lola tiene el pelo rizado.', 'Lola a les cheveux bouclés.', { genero: 'm', femenino: 'rizada' }),
    W('alto', 'alto', 'grand (de taille)', '🦒', 'fisico', 'Mateo es muy alto.', 'Mateo est très grand.', { genero: 'm', femenino: 'alta' }),
    W('bajo', 'bajo', 'petit (de taille) ; « bajito » est plus gentil ; au Mexique, en familier : « chaparro »', null, 'fisico', 'Mi tío es bajo, pero muy fuerte.', 'Mon oncle est petit, mais très fort.', { genero: 'm', femenino: 'baja', ...ilu('Un garçon petit debout à côté d’une grande porte') }),
    W('delgado', 'delgado', 'mince', null, 'fisico', 'Mateo es alto y delgado.', 'Mateo est grand et mince.', { genero: 'm', femenino: 'delgada', ...ilu('Un garçon très mince, de profil, avec un grand sourire') }),
    W('rubio', 'rubio', 'blond (au Mexique, on dit souvent « güero / güera »)', '👱', 'fisico', 'Mi prima es rubia.', 'Ma cousine est blonde.', { genero: 'm', femenino: 'rubia' }),
    W('castano', 'castaño', 'châtain, brun', '🌰', 'fisico', 'Diego tiene el pelo castaño.', 'Diego a les cheveux châtains.', { genero: 'm', femenino: 'castaña' }),
    W('pelirrojo', 'pelirrojo', 'roux', '🧑‍🦰', 'fisico', 'Mi amigo es pelirrojo.', 'Mon ami est roux.', { genero: 'm', femenino: 'pelirroja' }),
    // colores
    W('color', 'color', 'couleur', '🎨', 'colores', '¿De qué color es tu mochila?', 'De quelle couleur est ton sac à dos ?', { genero: 'm', plural: 'colores' }),
    W('rojo', 'rojo', 'rouge', '🔴', 'colores', 'Una falda roja.', 'Une jupe rouge.', { genero: 'm', femenino: 'roja' }),
    W('azul', 'azul', 'bleu', '🔵', 'colores', 'La Casa Azul es azul.', 'La Casa Azul est bleue.', { genero: 'mf', plural: 'azules' }),
    W('verde', 'verde', 'vert', '🟢', 'colores', 'Las plumas del Quetzal son verdes.', 'Les plumes du Quetzal sont vertes.', { genero: 'mf', plural: 'verdes' }),
    W('amarillo', 'amarillo', 'jaune', '🟡', 'colores', 'El sol es amarillo.', 'Le soleil est jaune.', { genero: 'm', femenino: 'amarilla' }),
    W('naranja', 'naranja', 'orange', '🟠', 'colores', 'Tengo una camiseta naranja.', 'J’ai un t-shirt orange.', { genero: 'mf', plural: 'naranjas' }),
    W('rosa_c', 'rosa', 'rose', '🌸', 'colores', 'Lola lleva una falda rosa.', 'Lola porte une jupe rose.', { genero: 'mf' }),
    W('morado', 'morado', 'violet', '🟣', 'colores', 'Las flores moradas son bonitas.', 'Les fleurs violettes sont jolies.', { genero: 'm', femenino: 'morada' }),
    W('negro', 'negro', 'noir', '⚫', 'colores', 'Tengo un perro negro.', 'J’ai un chien noir.', { genero: 'm', femenino: 'negra' }),
    W('blanco', 'blanco', 'blanc', '⚪', 'colores', 'La camisa es blanca.', 'La chemise est blanche.', { genero: 'm', femenino: 'blanca' }),
    W('gris', 'gris', 'gris', '☁️', 'colores', 'Mi mochila es gris.', 'Mon sac à dos est gris.', { genero: 'mf', plural: 'grises' }),
    W('marron', 'marrón', 'marron (au Mexique, pour les yeux : « café » → los ojos cafés)', '🟤', 'colores', 'Mi gato es marrón.', 'Mon chat est marron.', { genero: 'mf', plural: 'marrones' }),
    // ropa
    W('ropa', 'ropa', 'vêtements', '👚', 'ropa', 'En el mercado hay ropa de colores.', 'Au marché, il y a des vêtements colorés.', { genero: 'f' }),
    W('camiseta', 'camiseta', 'tee-shirt (au Mexique : « playera »)', '👕', 'ropa', 'Álex lleva una camiseta verde.', 'Álex porte un tee-shirt vert.', { genero: 'f', plural: 'camisetas' }),
    W('pantalones', 'pantalones', 'pantalon (souvent au pluriel : « unos pantalones » = un pantalon ; on dit aussi « un pantalón »)', '👖', 'ropa', 'Mateo lleva pantalones negros.', 'Mateo porte un pantalon noir.', { genero: 'm' }),
    W('falda', 'falda', 'jupe', null, 'ropa', 'Marina lleva una falda azul.', 'Marina porte une jupe bleue.', { genero: 'f', plural: 'faldas', ...ilu('Une jupe rouge évasée qui tourne') }),
    W('vestido', 'vestido', 'robe', '👗', 'ropa', 'Frida lleva un vestido largo.', 'Frida porte une robe longue.', { genero: 'm', plural: 'vestidos' }),
    W('camisa', 'camisa', 'chemise', '👔', 'ropa', 'Mi padre lleva una camisa blanca.', 'Mon père porte une chemise blanche.', { genero: 'f', plural: 'camisas' }),
    W('chaqueta', 'chaqueta', 'veste (au Mexique : « chamarra »)', '🧥', 'ropa', 'Lleva una chaqueta negra.', 'Il porte une veste noire.', { genero: 'f', plural: 'chaquetas' }),
    W('zapatos', 'zapatos', 'chaussures', '👞', 'ropa', 'Los zapatos de Rafa son marrones.', 'Les chaussures de Rafa sont marron.', { genero: 'm', plural: 'zapatos' }),
    W('zapatillas', 'zapatillas', 'baskets (au Mexique : « tenis »)', '👟', 'ropa', 'Álex lleva zapatillas blancas.', 'Álex porte des baskets blanches.', { genero: 'f' }),
    W('sombrero', 'sombrero', 'chapeau', '👒', 'ropa', 'Don Ignacio lleva un sombrero.', 'Don Ignacio porte un chapeau.', { genero: 'm', plural: 'sombreros' }),
    W('gorra', 'gorra', 'casquette', '🧢', 'ropa', 'Mateo lleva una gorra azul.', 'Mateo porte une casquette bleue.', { genero: 'f', plural: 'gorras' }),
    W('blusa', 'blusa', 'chemisier, blouse (au Mexique, souvent brodée de fleurs)', null, 'ropa', 'Lupita lleva una blusa con flores.', 'Lupita porte une blouse avec des fleurs.', { genero: 'f', plural: 'blusas', ilustracion: 'Une blouse blanche brodée de fleurs colorées (style mexicain)', exVoz: 'lupita' }),
    W('rebozo', 'rebozo', 'rebozo : grand châle mexicain en tissu', null, 'ropa', 'El rebozo es una prenda tradicional de México.', 'Le rebozo est un vêtement traditionnel du Mexique.', { genero: 'm', plural: 'rebozos', ilustracion: 'Un rebozo bleu à franges posé sur les épaules d’une femme', voz: 'lupita' }),
    W('llevar', 'llevar', 'porter (un vêtement) ; aussi emporter, apporter', '🎽', 'verbos', 'Llevo una camiseta roja.', 'Je porte un tee-shirt rouge.'),
    // carácter y estados
    W('simpatico', 'simpático', 'sympathique', '😊', 'caracter', 'Mateo es muy simpático.', 'Mateo est très sympathique.', { genero: 'm', femenino: 'simpática' }),
    W('divertido', 'divertido', 'drôle, amusant', '🤣', 'caracter', 'Mi tío Rafa es muy divertido.', 'Mon oncle Rafa est très drôle.', { genero: 'm', femenino: 'divertida' }),
    W('timido', 'tímido', 'timide', '😳', 'caracter', 'Diego es un poco tímido.', 'Diego est un peu timide.', { genero: 'm', femenino: 'tímida' }),
    W('serio', 'serio', 'sérieux', '🧐', 'caracter', 'Doña Pilar es seria.', 'Doña Pilar est sérieuse.', { genero: 'm', femenino: 'seria' }),
    W('valiente', 'valiente', 'courageux', '🦁', 'caracter', 'El Quetzal es muy valiente.', 'Le Quetzal est très courageux.', { genero: 'mf', plural: 'valientes' }),
    W('inteligente', 'inteligente', 'intelligent', '🧠', 'caracter', 'Marina es muy inteligente.', 'Marina est très intelligente.', { genero: 'mf', plural: 'inteligentes' }),
    W('trabajador', 'trabajador', 'travailleur', '💪', 'caracter', 'Mi madre es muy trabajadora.', 'Ma mère est très travailleuse.', { genero: 'm', femenino: 'trabajadora' }),
    W('estar', 'estar', 'être (comment on va, où l’on se trouve)', '📍', 'verbos', 'Hoy estoy en Coyoacán.', 'Aujourd’hui, je suis à Coyoacán.'),
    W('contento', 'contento', 'content', '😁', 'estados', 'Hoy estoy muy contento.', 'Aujourd’hui, je suis très content.', { genero: 'm', femenino: 'contenta' }),
    W('triste', 'triste', 'triste', '😢', 'estados', 'Lola está triste.', 'Lola est triste.', { genero: 'mf', plural: 'tristes' }),
    W('cansado', 'cansado', 'fatigué', '😴', 'estados', 'Estoy cansado después del viaje.', 'Je suis fatigué après le voyage.', { genero: 'm', femenino: 'cansada' }),
    W('enfadado', 'enfadado', 'fâché (au Mexique : « enojado »)', '😠', 'estados', 'Doña Pilar no está enfadada.', 'Doña Pilar n’est pas fâchée.', { genero: 'm', femenino: 'enfadada' }),
    // cultura
    W('autorretrato', 'autorretrato', 'autoportrait', null, 'cultura', 'Frida pinta muchos autorretratos.', 'Frida peint beaucoup d’autoportraits.', { genero: 'm', plural: 'autorretratos', ilustracion: 'Une femme aux sourcils épais, tresses et fleurs dans les cheveux, qui se peint devant un miroir' }),
    W('cuadro', 'cuadro', 'tableau (peinture)', '🖼️', 'cultura', 'Hay un cuadro en la pared.', 'Il y a un tableau sur le mur.', { genero: 'm', plural: 'cuadros' }),
    W('museo', 'museo', 'musée', '🏛️', 'cultura', 'La Casa Azul es un museo.', 'La Casa Azul est un musée.', { genero: 'm', plural: 'museos' }),
    W('espejo', 'espejo', 'miroir', '🪞', 'cultura', 'Frida pinta con un espejo.', 'Frida peint avec un miroir.', { genero: 'm', plural: 'espejos' }),
    W('flor', 'flor', 'fleur', '🌺', 'cultura', 'Hay flores en el patio.', 'Il y a des fleurs dans le patio.', { genero: 'f', plural: 'flores' }),
    W('loro', 'loro', 'perroquet', '🦜', 'cultura', 'Frida tiene un loro en casa.', 'Frida a un perroquet chez elle.', { genero: 'm', plural: 'loros' }),
    W('pintar', 'pintar', 'peindre', '🖌️', 'verbos', 'Frida pinta cuadros y autorretratos.', 'Frida peint des tableaux et des autoportraits.'),
  ];

  // ───────────── Gramática ─────────────
  const gramatica = [
    G('g_concordancia', 'Negro, negra, negros, negras', 'L’accord de l’adjectif', [
      ['El gato es negro y la casa es blanca.', 'Le chat est noir et la maison est blanche.', 'lupita', ['negro', 'blanca']],
      ['Los libros son verdes.', 'Les livres sont verts.', 'mateo', ['verdes']],
      ['Las flores son amarillas.', 'Les fleurs sont jaunes.', 'lupita', ['amarillas']],
      ['Una casa azul y dos libros azules.', 'Une maison bleue et deux livres bleus.', 'valentina', ['azul', 'azules']],
      ['Álex es valiente y Marina es valiente.', 'Álex est courageux et Marina est courageuse.', 'marina', ['valiente']],
    ], 'El adjetivo cambia con el nombre: negro, negra, negros, negras. Azul y valiente no cambian en femenino. En plural, añadimos -s o -es.',
    'L’adjectif change avec le nom : negro, negra, negros, negras. Azul et valiente ne changent pas au féminin. Au pluriel, on ajoute -s ou -es.',
    "L'adjectif s'accorde en genre ET en nombre avec le nom, et se place le plus souvent APRÈS lui (una casa blanca, ojos verdes). Adjectifs en -o : -o / -a / -os / -as. Adjectifs en -e ou en consonne (verde, valiente, inteligente, azul, gris) : même forme au masculin et au féminin, seulement -s / -es au pluriel (verdes, azules, grises). Deux exceptions à connaître : les adjectifs en -or ajoutent -a (trabajador → trabajadora) et les nationalités aussi (francés → francesa, español → española). « Rosa » et « naranja » ne changent pas au féminin (una falda rosa). Marrón perd son accent au pluriel : marrones.",
    { encabezado: ['', 'masculino', 'femenino'], filas: [['-o (singular)', 'negro', 'negra'], ['-o (plural)', 'negros', 'negras'], ['-e', 'verde · verdes', 'verde · verdes'], ['consonante', 'azul · azules', 'azul · azules'], ['-or', 'trabajador · trabajadores', 'trabajadora · trabajadoras']] }),
    G('g_tener_pelo', 'Tengo el pelo largo', 'Décrire ses cheveux et ses yeux', [
      ['Tengo el pelo corto y los ojos marrones.', 'J’ai les cheveux courts et les yeux marron.', 'viajero', ['el pelo corto', 'los ojos marrones']],
      ['Marina tiene el pelo largo y negro.', 'Marina a les cheveux longs et noirs.', 'marina', ['tiene el pelo']],
      ['Valentina tiene los ojos verdes.', 'Valentina a les yeux verts.', 'valentina', ['los ojos verdes']],
      ['Mateo es alto y delgado.', 'Mateo est grand et mince.', 'mateo', ['es alto']],
    ], 'Para el pelo y los ojos decimos: tengo el pelo… y los ojos… Para la altura y el cuerpo usamos «ser»: soy alto, es delgado.',
    'Pour les cheveux et les yeux, on dit : tengo el pelo… y los ojos… Pour la taille et la silhouette, on utilise « ser » : soy alto, es delgado.',
    "Comme en français (j'ai les cheveux courts), l'espagnol met l'article défini : tengo el pelo corto, tengo los ojos verdes (pas « mi pelo »). L'adjectif suit le nom et s'accorde : el pelo castaño, los ojos verdes (pluriel). On peut aussi dire « soy rubio » avec ser. Au Mexique, rubio se dit souvent « güero / güera », pelo se dit aussi « cabello » et rizado « chino ». Taille et silhouette : ser (soy alto, es bajo, es delgada), jamais tener.",
    { encabezado: ['Quién', 'Se dice'], filas: [['yo', 'tengo el pelo corto'], ['tú', 'tienes los ojos verdes'], ['él / ella', 'tiene el pelo largo'], ['yo', 'soy alto · soy delgado']] }),
    G('g_llevar', 'Llevo una camiseta roja', 'Dire ce qu’on porte : llevar', [
      ['Llevo una camiseta roja.', 'Je porte un tee-shirt rouge.', 'viajero', ['Llevo']],
      ['¿Qué llevas hoy?', 'Qu’est-ce que tu portes aujourd’hui ?', 'marina', ['llevas']],
      ['Frida lleva un vestido largo y flores en el pelo.', 'Frida porte une robe longue et des fleurs dans les cheveux.', 'valentina', ['lleva']],
      ['Mateo lleva gafas y una gorra azul.', 'Mateo porte des lunettes et une casquette bleue.', 'marina', ['lleva']],
    ], 'Con «llevar» decimos qué ropa tenemos puesta: llevo, llevas, lleva. El color va después de la ropa y cambia: una falda roja, zapatos negros.',
    'Avec « llevar », on dit quels vêtements on porte : llevo, llevas, lleva. La couleur vient après le vêtement et s’accorde : una falda roja, zapatos negros.',
    "Llevar = porter (un vêtement) ; il veut aussi dire emporter / apporter (llevo mi mochila). Verbe régulier en -ar : llevo, llevas, lleva… Comme en français, on dit en général « llevo una camiseta roja » (je porte un tee-shirt rouge). Couleur après le nom et accordée : una falda roja, unos zapatos negros, camisas blancas. Au Mexique : playera (camiseta), chamarra (chaqueta), tenis (zapatillas), lentes (gafas).",
    { encabezado: ['Pronombre', 'llevar'], filas: [['yo', 'llevo'], ['tú', 'llevas'], ['él / ella', 'lleva'], ['nosotros', 'llevamos'], ['vosotros', 'lleváis'], ['ellos / ellas', 'llevan']] }),
    G('g_ser_estar', 'Ser y estar', 'Ser et estar : deux fois « être »', [
      ['Frida es valiente.', 'Frida est courageuse.', 'valentina', ['es']],
      ['Hoy estoy cansado.', 'Aujourd’hui, je suis fatigué.', 'viajero', ['estoy']],
      ['Mateo es simpático, pero hoy está cansado.', 'Mateo est sympa, mais aujourd’hui il est fatigué.', 'valentina', ['es simpático', 'está cansado']],
      ['La Casa Azul está en Coyoacán.', 'La Casa Azul est à Coyoacán.', 'valentina', ['está']],
    ], 'Con «ser» decimos quién es y cómo es una persona: es mexicano, es alto, es simpático. Con «estar» decimos cómo está hoy y dónde está: estoy cansado, está en Coyoacán.',
    'Avec « ser », on dit qui est une personne et comment elle est : il est mexicain, grand, sympa. Avec « estar », on dit comment elle va aujourd’hui et où elle se trouve : je suis fatigué, il est à Coyoacán.',
    "Le français n'a qu'un verbe « être », l'espagnol en a deux. SER dit QUI est quelqu'un et COMMENT il EST : identité, nationalité, origine (soy francés, es de Coyoacán), métier (es médica), physique et caractère (es alto, es simpático), et aussi la date (hoy es lunes). ESTAR dit COMMENT on VA, l'état dans lequel on se trouve (estoy cansado, está contento, estoy bien), et OÙ se trouve quelqu'un ou quelque chose (está en Coyoacán). Le bon test : « ¿Cómo es? » (il est comment, quel genre de personne ?) → ser ; « ¿Cómo está? » (comment va-t-il ?) et « ¿Dónde está? » (où est-il ?) → estar. Attention : la règle « ser = permanent, estar = temporaire » se trompe souvent (on dit « hoy es lunes », « soy joven ») ; ne l'utilise pas. Erreur classique : « soy bien » est faux, on dit « estoy bien ». Estar : estoy, estás, está, estamos, estáis, están (accents sur estás, está, estáis, están).",
    { encabezado: ['Pronombre', 'ser', 'estar'], filas: [['yo', 'soy', 'estoy'], ['tú', 'eres', 'estás'], ['él / ella', 'es', 'está'], ['nosotros', 'somos', 'estamos'], ['vosotros', 'sois', 'estáis'], ['ellos / ellas', 'son', 'están']] }),
  ];

  // ───────────── Cinemáticas ─────────────
  const intro = cine('u04-intro', 'intro', 'Capítulo 4 · ¿Cómo eres? · Ciudad de México', [
    P(3, "La carte du monde en papel picado : la ligne dorée traverse l’océan jusqu’au Mexique et zoome sur Ciudad de México ; carte-titre « Capítulo 4 · ¿Cómo eres? · Ciudad de México ».", [L(N, 'Capítulo cuatro: ¿cómo eres?', 'Chapitre quatre : comment es-tu ?')], { rotulo: 'Capítulo 4 · ¿Cómo eres? · Ciudad de México', camara: 'zoom avant progressif' }),
    P(5, "Coyoacán sous le soleil de fin d’après-midi : le Jardín Centenario et sa fontaine aux coyotes, le kiosque de la Plaza Hidalgo, les ruelles pavées et, au bout d’une rue, la Casa Azul d’un bleu cobalt intense, bordure de papel picado.", [L(N, 'Ciudad de México. Coyoacán, el barrio de Frida Kahlo.', 'Mexico. Coyoacán, le quartier de Frida Kahlo.'), L(N, 'Aquí, cada cara cuenta una historia.', 'Ici, chaque visage raconte une histoire.')], { camara: 'travelling lent dans la rue' }),
  ]);
  const historia = cine('u04-historia', 'historia', 'Los autorretratos sin cara', [
    P(7, "Plaza Hidalgo de Coyoacán : vendeurs, ballons, pigeons. Le Quetzal sort du sac de Marina, ouvre grand les ailes, ses plumes sont plus vertes. Mateo, 12 ans, grand et mince, casquette bleue, arrive en trottinant.", [
      L('quetzal', 'México… ¡Estoy en casa!', 'Le Mexique… Je suis chez moi !'),
      L('mateo', '¡Qué onda! Me llamo Mateo y soy de Coyoacán. ¿Ustedes son los viajeros?', 'Salut ! (« ¡Qué onda! » = salut, familier mexicain). Je m’appelle Mateo et je suis de Coyoacán. Vous êtes les voyageurs ? (au Mexique, « ustedes » sert pour tous les « vous » pluriels, même entre amis ; en Espagne, on dirait « ¿Vosotros sois los viajeros? »)'),
    ], { personajes: ['quetzal', 'mateo', 'marina', 'viajero'], camara: 'plan large puis plan moyen sur Mateo' }),
    P(7, "Mateo se présente en riant, Marina et Álex répondent : trois enfants dans la plaza, le Quetzal sur l’épaule de Marina.", [
      L('mateo', 'Soy alto y delgado, y siempre llevo una gorra azul.', 'Je suis grand et mince, et je porte toujours une casquette bleue.'),
      L('marina', 'Yo soy Marina. Tengo el pelo largo y negro. Y él es Álex.', 'Moi, c’est Marina. J’ai les cheveux longs et noirs. Et lui, c’est Álex.'),
    ], { personajes: ['mateo', 'marina', 'viajero'], camara: 'champ / contre-champ' }),
    P(7, "La Casa Azul : murs cobalt, patio plein de plantes. Valentina, la guide, sort en courant, des fleurs dans les cheveux. À l’intérieur, des autoportraits dont les visages sont devenus des taches grises.", [
      L('valentina', 'Por favor, necesito ayuda. Los autorretratos no tienen cara. ¡Y no hay colores!', 'S’il vous plaît, j’ai besoin d’aide. Les autoportraits n’ont plus de visage. Et il n’y a plus de couleurs !'),
      L('sombra', 'Sin colores, no hay cara… Sin palabras, no hay retrato.', 'Sans couleurs, pas de visage… Sans mots, pas de portrait.'),
    ], { personajes: ['valentina', 'sombra'], musica: 'tension douce, guitare et marimba' }),
    P(7, "Gros plan sur le dernier tableau, vide : un reflet vert brille dans le cadre. Le Quetzal le montre du bec.", [
      L('quetzal', 'La pluma… está en el último autorretrato.', 'La plume… est dans le dernier autoportrait.'),
      L('valentina', 'Para devolver las caras, tienen que decir cómo son las personas. ¡Vamos!', 'Pour rendre les visages, il faut dire comment sont les personnes. Allons-y !'),
    ], { personajes: ['quetzal', 'valentina'], musica: 'thème d’aventure, marimba' }),
  ]);
  const capsula = cine('u04-capsula-frida', 'capsula', 'Frida Kahlo y la Casa Azul', [
    P(4, "Style explainer, papier découpé : le nom « Frida Kahlo » s’écrit sur fond bleu cobalt ; la façade de la Casa Azul apparaît avec l’année « 1907 ».", [L(N, 'Frida Kahlo nace en 1907 en Coyoacán, en la Casa Azul.', 'Frida Kahlo naît en 1907 à Coyoacán, dans la Casa Azul.')], { camara: 'plan fixe, animations de papier découpé' }),
    P(5, "Mur de cadres : des autoportraits se multiplient, un compteur monte jusqu’à « +50 » ; une main tient un petit miroir.", [L(N, 'Frida pinta más de cincuenta autorretratos, muchas veces con un espejo.', 'Frida peint plus de cinquante autoportraits, souvent avec un miroir. (Après un grave accident de bus à 18 ans, elle peint allongée dans son lit, avec un miroir au-dessus d’elle.)')]),
    P(5, "Détails d’un portrait : sourcils épais, tresses avec des fleurs, longue robe brodée de tehuana ; une carte de l’État d’Oaxaca s’allume brièvement pour les robes traditionnelles.", [L(N, 'Lleva flores en el pelo y vestidos largos de colores. Muchos son vestidos tradicionales de Oaxaca.', 'Elle porte des fleurs dans les cheveux et des robes longues colorées. Beaucoup sont des robes traditionnelles de l’État d’Oaxaca (robes de « tehuana », de l’isthme de Tehuantepec).')]),
    P(5, "Le patio de la Casa Azul : singes, perroquets, chiens sans poils (xoloitzcuintles) entre les plantes, en papier découpé.", [L(N, 'En su casa viven monos, loros y perros.', 'Dans sa maison vivent des singes, des perroquets et des chiens. (présent de narration : à l’époque de Frida)')]),
    P(4, "Plan large de la Casa Azul, des visiteurs entrent, panneau « Museo Frida Kahlo » ; la carte revient sur Ciudad de México.", [L(N, 'Hoy la Casa Azul es un museo. Está en Coyoacán, en Ciudad de México.', 'Aujourd’hui, la Casa Azul est un musée. Elle est à Coyoacán, à Mexico.')]),
  ]);
  const pluma = cine('u04-pluma', 'pluma', 'Cuarta pluma', [
    P(3, "Le dernier autoportrait retrouve son visage et toutes ses couleurs ; une plume verte se détache du cadre et tombe dans la main d’Álex.", [L('valentina', '¡Los autorretratos tienen cara otra vez! ¡Gracias!', 'Les autoportraits ont de nouveau un visage ! Merci !')], { personajes: ['valentina'] }),
    P(3, "Le Quetzal tourne au-dessus du patio, ses plumes brillent de toutes les couleurs.", [L('quetzal', 'Cuatro plumas. ¡Vuelo más alto!', 'Quatre plumes. Je vole plus haut !')], { personajes: ['quetzal'] }),
    P(2, "Don Ignacio apparaît en hologramme au-dessus de la carte ; une empreinte lumineuse traverse l’océan jusqu’à Valencia.", [L('ignacio', 'La siguiente pluma está en Valencia. ¡Es hora de volver a España!', 'La prochaine plume est à Valence. Il est temps de retourner en Espagne !')], { personajes: ['ignacio'] }),
  ]);

  // ───────────── Misiones ─────────────
  const quests = [];

  // 1 — Cinemática
  quests.push(quest('u04', 1, 'cinematica', 'Llegada a Coyoacán', '🌆',
    ['mateo', '¡Bienvenidos a Coyoacán! Aquí empieza su aventura en México.', 'Bienvenue à Coyoacán ! C’est ici que commence votre aventure au Mexique. (Au Mexique, on dit « ustedes » pour « vous », même entre amis ; en Espagne : « vuestra aventura ».)'],
    'Arrivée à Mexico : tu rencontres Mateo et Valentina, et tu découvres le problème des autoportraits sans visage. Les PNJ parlent espagnol du Mexique : leurs mots qui diffèrent de l’Espagne sont signalés en français.', ['escuchar', 'cultura', 'hablar'], 10, [
      intro,
      tf('Coyoacán es un barrio de Ciudad de México.', true, N, { tr: 'Coyoacán est un quartier de Mexico.' }),
      tf('Ciudad de México está en Europa.', false, N, { tr: 'Mexico est en Europe.' }),
      historia,
      lcT('Hola, me llamo Mateo. Tengo doce años y soy de Coyoacán.', 'mateo', ['Mateo es un chico mexicano de doce años.', 'Mateo es un chico español de trece años.', 'Mateo es un chico mexicano de catorce años.'], 0),
      lcT('Los autorretratos de Frida no tienen cara. ¡No hay colores!', 'valentina', ['Los cuadros tienen muchos colores.', 'Hay muchas caras en los cuadros.', 'Los cuadros no tienen cara ni colores.'], 2),
      tf('El Quetzal está en México.', true, N, { tr: 'Le Quetzal est au Mexique.' }),
      dlg('mateo', '¡Qué onda! Me llamo Mateo. ¿Y tú, cómo te llamas?', 'Salut ! (« ¡Qué onda! » = salut, familier mexicain). Je m’appelle Mateo. Et toi, comment tu t’appelles ?', [
        ['Me llamo Álex.', 1, '¡Mucho gusto, Álex! Bienvenido a Coyoacán.', 'Enchanté, Álex ! (« mucho gusto » est la formule habituelle au Mexique ; en Espagne, on dit plutôt « encantado »). Bienvenue à Coyoacán.', 'Je m’appelle Álex.'],
        ['Soy Mateo.', 0, '¿Tú también eres Mateo? ¡Qué confusión!', 'Toi aussi tu es Mateo ? Quelle confusion !', 'Je suis Mateo.'],
        ['Buenas noches.', 0, '¿Buenas noches? ¡Pero si es de día!', 'Bonne nuit ? Mais il fait jour !', 'Bonne nuit.'],
      ]),
      dlg('valentina', 'Hola. Soy Valentina, la guía de la Casa Azul. ¿De dónde son ustedes?', 'Salut. Je suis Valentina, la guide de la Casa Azul. D’où venez-vous ?', [
        ['Yo soy de París y Marina es de Sevilla.', 1, '¡Qué bien! Vienen de muy lejos.', 'Super ! Vous venez de très loin.', 'Moi, je suis de Paris et Marina est de Séville.'],
        ['Me llamo París.', 0, '¿Te llamas París? ¡Qué nombre tan bonito!', 'Tu t’appelles Paris ? Quel joli prénom !', 'Je m’appelle Paris.'],
        ['Tengo doce años.', 0, 'Sí, pero ¿de dónde son?', 'Oui, mais vous venez d’où ?', 'J’ai douze ans.'],
      ]),
      reord('Me llamo Álex y soy francés.', 'viajero', { tr: 'Je m’appelle Álex et je suis français.' }),
      speak('Mucho gusto, me llamo Álex.', 'viajero', { tr: 'Enchanté, je m’appelle Álex. (dis ton prénom ; « mucho gusto » est très courant au Mexique)', nombre: 'Álex', hechizo: ['Hechizo de la bienvenida', 'Una lluvia de pétalos de colores cae sobre la plaza'] }),
    ]));

  // 2 — Colores
  quests.push(quest('u04', 2, 'vocabulario', 'Los colores de Coyoacán', '🎨',
    ['lupita', '¡Buenos días, jóvenes! Mi puesto tiene todos los colores de México.', 'Bonjour, les jeunes ! Mon étal a toutes les couleurs du Mexique.'],
    'Les couleurs, avec Doña Lupita au marché de Coyoacán ; découverte de l’accord de l’adjectif (negro, negra, negros, negras).', ['leer', 'escuchar', 'hablar'], 14, [
      flash('color', 'rojo', 'azul', 'verde', 'amarillo', 'naranja'),
      lcV('azul', ['verde', 'azul', 'rojo']),
      flash('rosa_c', 'morado', 'negro', 'blanco', 'gris', 'marron'),
      match(['rojo', 'azul', 'verde', 'amarillo', 'naranja', 'morado']),
      lcV('morado', ['rosa_c', 'gris', 'morado']),
      tf('Es el color amarillo.', true, N, { img: 'amarillo', tr: 'C’est la couleur jaune (amarillo).' }),
      tf('Es el color negro.', false, N, { img: 'blanco', tr: 'C’est la couleur noire (negro).' }),
      gram('g_concordancia'),
      fill('Mi gato es blanco y mi mochila es ___.', 'negra', 'lupita', { opts: ['negro', 'negra', 'negras'], tr: 'Mon chat est blanc et mon sac à dos est noir. (la mochila → negra)' }),
      fill('Las mochilas de Marina son ___.', 'amarillas', 'lupita', { opts: ['amarillo', 'amarilla', 'amarillas'], tr: 'Les sacs à dos de Marina sont jaunes.' }),
      fill('Tengo dos mochilas ___.', 'azules', 'mateo', { opts: ['azul', 'azules', 'azulas'], tr: 'J’ai deux sacs à dos bleus. (azul : pas de féminin, pluriel en -es)' }),
      lcT('Mi color favorito es el verde, como las plumas del Quetzal.', 'lupita', ['El color favorito de Lupita es el rojo.', 'El color favorito de Lupita es el verde.', 'El color favorito de Lupita es el amarillo.'], 1),
      dlg('lupita', '¿De qué color es tu mochila?', 'De quelle couleur est ton sac à dos ?', [
        ['Mi mochila es azul.', 1, '¡Qué bonito! Azul como la Casa Azul.', 'Que c’est joli ! Bleu comme la Casa Azul.', 'Mon sac à dos est bleu.'],
        ['Mi mochila es una casa.', 0, '¿Una casa? ¡Qué mochila tan grande!', 'Une maison ? Quel grand sac à dos !', 'Mon sac à dos est une maison.'],
        ['Mi mochila tiene doce años.', 0, 'Doce años… ¡qué mochila tan vieja!', 'Douze ans… quel vieux sac à dos !', 'Mon sac à dos a douze ans.'],
      ]),
      speak('Mi color favorito es el azul.', 'viajero', { libre: 'azul', es: 'Escucha y di cuál es TU color favorito.', fr: 'Écoute et dis quelle est TA couleur préférée (el verde, el rojo, el negro…).', tr: 'Ma couleur préférée est le bleu. (dis la tienne)', hechizo: ['Hechizo del color', 'Tu color favorito ilumina el puesto'] }),
      dict('amarillo', N, { es: 'Escucha y escribe el color.', fr: 'Écoute et écris la couleur.' }),
    ]));

  // 3 — ¿Quién es quién?
  quests.push(quest('u04', 3, 'escucha', '¿Quién es quién?', '🕵️',
    ['mateo', 'Yo describo a una persona y tú adivinas. ¿Jugamos?', 'Moi, je décris une personne et toi, tu devines. On joue ?'],
    'Le portrait physique : cheveux, yeux, taille. Tu comprends des descriptions et tu décris ton propre visage.', ['escuchar', 'hablar', 'escribir'], 15, [
      flash('pelo', 'ojos', 'gafas', 'trenza', 'largo', 'corto', 'rizado'),
      lcV('rizado', ['largo', 'rizado', 'corto']),
      flash('alto', 'bajo', 'delgado', 'rubio', 'castano', 'pelirrojo'),
      match(['alto', 'bajo', 'delgado', 'rubio', 'castano', 'pelirrojo']),
      gram('g_tener_pelo'),
      lcI('Mi amigo es bajo y pelirrojo.', 'mateo', 'pelirrojo', ['rubio', 'castano', 'pelirrojo']),
      lcT('Es una chica alta y delgada, con el pelo muy largo.', 'mateo', ['Es un chico bajo con el pelo corto.', 'Es una chica con el pelo corto y rizado.', 'Es una chica que no es baja y tiene el pelo largo.'], 2),
      lcT('Valentina tiene los ojos verdes.', 'marina', ['Los ojos de Valentina son azules.', 'El pelo de Valentina es verde.', 'Los ojos de Valentina son verdes.'], 2),
      fill('Tengo ___ pelo corto.', 'el', 'viajero', { opts: ['el', 'la', 'mi'], tr: 'J’ai les cheveux courts.' }),
      fill('Marina tiene los ojos ___.', 'marrones', 'marina', { opts: ['marrón', 'marrones', 'marrona'], tr: 'Marina a les yeux marron.' }),
      fill('Mateo es alto y ___.', 'delgado', 'mateo', { opts: ['delgados', 'delgada', 'delgado'], tr: 'Mateo est grand et mince.' }),
      reord('Valentina tiene el pelo largo y rizado.', 'marina', { tr: 'Valentina a les cheveux longs et bouclés.' }),
      dlg('mateo', 'Y tú, ¿cómo eres? Descríbete.', 'Et toi, comment es-tu ? Décris-toi.', [
        ['Soy alto y tengo el pelo corto.', 1, '¡Perfecto! Ya veo cómo eres.', 'Parfait ! Je vois comment tu es.', 'Je suis grand et j’ai les cheveux courts.'],
        ['Tengo los ojos verdes y el pelo castaño.', 1, '¡Qué padre! Ya veo cómo eres.', 'Trop bien ! (« padre » = génial, familier mexicain). Je vois comment tu es.', 'J’ai les yeux verts et les cheveux châtains.'],
        ['Tengo alto y soy el pelo.', 0, 'Mmm… no entiendo. Con la altura usamos «ser».', 'Mmm… je ne comprends pas. Pour la taille, on utilise « ser ».', 'J’ai grand et je suis les cheveux.'],
      ]),
      dict('Tiene el pelo largo y rizado.', 'marina', { acept: ['tiene el pelo largo y rizado'] }),
      speak('Tengo el pelo corto.', 'viajero', { libre: 'corto', es: 'Escucha y di cómo es TU pelo.', fr: 'Écoute et dis comment sont TES cheveux (largo, corto, rizado, castaño, rubio…). Tu peux en dire deux : « castaño y rizado ».', tr: 'J’ai les cheveux courts. (dis les tiens)', hechizo: ['Hechizo del retrato', 'Tu cara aparece dibujada en el aire'] }),
    ]));

  // 4 — Ropa
  quests.push(quest('u04', 4, 'lectura', 'La ropa del mercado', '👗',
    ['lupita', '¡Pasen, pasen! Tengo playeras, vestidos, rebozos… ¿Qué buscan?', 'Entrez, entrez ! J’ai des t-shirts (« playeras » au Mexique), des robes, des rebozos… Que cherchez-vous ?'],
    'Les vêtements et « llevar ». Mots qui changent : camiseta (Mexique : playera), chaqueta (chamarra), zapatillas (tenis), gafas (lentes).', ['leer', 'escribir', 'hablar'], 15, [
      flash('ropa', 'camiseta', 'pantalones', 'falda', 'vestido', 'camisa', 'chaqueta'),
      lcV('vestido', ['falda', 'vestido', 'camisa']),
      match(['camiseta', 'pantalones', 'falda', 'vestido', 'camisa', 'chaqueta']),
      flash('zapatos', 'zapatillas', 'sombrero', 'gorra', 'blusa', 'rebozo', 'llevar'),
      gram('g_llevar'),
      lcI('Mateo lleva una gorra.', 'lupita', 'gorra', ['sombrero', 'zapatos', 'gorra']),
      lcT('Busco una falda roja y una blusa blanca.', 'marina', ['La chica busca zapatos negros.', 'La chica busca un vestido azul.', 'La chica busca ropa roja y blanca.'], 2),
      read('En mi puesto hay ropa de muchos colores. Hay una falda roja, una blusa blanca con flores y dos rebozos azules. Las playeras son verdes, amarillas y naranjas. ¡Todo es muy bonito!', 'lupita',
        'Dans mon étal, il y a des vêtements de toutes les couleurs. Il y a une jupe rouge, une blouse blanche avec des fleurs et deux rebozos bleus. Les tee-shirts (« playeras » au Mexique) sont verts, jaunes et orange. Tout est très joli !', [
          ['¿De qué color es la falda?', 'De quelle couleur est la jupe ?', ['Roja.', 'Blanca.', 'Azul.'], 0],
          ['¿Cuántos rebozos azules hay?', 'Combien de rebozos bleus y a-t-il ?', ['Uno.', 'Dos.', 'Tres.'], 1],
          ['¿De qué colores son las playeras?', 'De quelles couleurs sont les t-shirts ?', ['Rojas y negras.', 'Verdes, amarillas y naranjas.', 'Blancas y azules.'], 1],
        ]),
      fill('Llevo una camiseta ___.', 'roja', 'viajero', { opts: ['rojo', 'roja', 'rojas'], tr: 'Je porte un tee-shirt rouge.' }),
      fill('Álex lleva zapatillas ___.', 'blancas', 'marina', { opts: ['blanco', 'blanca', 'blancas'], tr: 'Álex porte des baskets blanches.' }),
      fill('Marina ___ una falda azul.', 'lleva', 'marina', { opts: ['llevo', 'llevas', 'lleva'], tr: 'Marina porte une jupe bleue.' }),
      reord('Llevo una blusa blanca con flores.', 'lupita', { tr: 'Je porte une blouse blanche avec des fleurs.' }),
      dlg('lupita', '¡Buenos días, joven! ¿Qué necesitas?', 'Bonjour, jeune homme ! De quoi as-tu besoin ?', [
        ['Una chaqueta negra, por favor.', 1, 'Una chamarra negra, ¡claro! Aquí tienes.', 'Une veste noire, bien sûr ! Voilà. (Au Mexique, on dit « chamarra » pour « chaqueta »).', 'Une veste noire, s’il vous plaît.'],
        ['Soy una chaqueta negra.', 0, '¿Tú eres una chaqueta? ¡Qué cosa más rara!', 'Toi, tu es une veste ? Quelle drôle de chose !', 'Je suis une veste noire.'],
        ['Me llamo chaqueta.', 0, 'Hola, Chaqueta. Yo soy Lupita.', 'Salut, Veste. Moi, c’est Lupita.', 'Je m’appelle veste.'],
      ]),
      tf('En México, «chamarra» significa «chaqueta».', true, N, { tr: 'Au Mexique, « chamarra » veut dire « chaqueta » (veste).' }),
      speak('Llevo una camiseta azul.', 'viajero', { libre: 'una camiseta azul', es: 'Escucha y di qué llevas TÚ hoy.', fr: 'Écoute et dis ce que TU portes aujourd’hui (llevo pantalones negros, llevo una camisa blanca…).', tr: 'Je porte un tee-shirt bleu. (dis ce que tu portes)', foco: 'Le ll de « llevo » se prononce presque comme un « y » : YÉ-vo. Le z de « azul » : en Espagne, comme le « th » anglais (a-THOUL) ; au Mexique, comme un « s » (a-SOUL). Les deux sont corrects.', hechizo: ['Hechizo de la ropa', 'Tu ropa cambia de colores como un arcoíris'] }),
    ]));

  // 5 — Forja
  quests.push(quest('u04', 5, 'forja', 'La Forja: ser, estar y llevar', '⚒️',
    ['quetzal', 'Ser, estar, llevar. Tres verbos. ¡Forja conmigo!', 'Ser, estar, llevar. Trois verbes. Forge avec moi !'],
    'Introduction à ser / estar : ser pour dire qui on est et comment on est (¿cómo es?), estar pour dire comment on va et où l’on est (¿cómo está?, ¿dónde está?). Puis le présent de estar et de llevar.', ['escribir', 'leer'], 15, [
      flash('estar'),
      gram('g_ser_estar'),
      conj('estar', 'yo', 'est', 'oy', ['oy', 'ás', 'á'], 'viajero', { tr: 'Moi, je suis (à un moment donné)…' }),
      conj('estar', 'tú', 'est', 'ás', ['oy', 'ás', 'á'], 'marina', { tr: 'Toi, tu es…' }),
      conj('estar', 'él', 'est', 'á', ['oy', 'ás', 'á'], 'valentina', { tr: 'Lui, il est…' }),
      conj('estar', 'nosotros', 'est', 'amos', ['amos', 'áis', 'án'], 'mateo', { tr: 'Nous, nous sommes…' }),
      fill('Hoy yo ___ bien, gracias.', 'estoy', 'viajero', { opts: ['soy', 'estoy', 'tengo'], tr: 'Aujourd’hui, je vais bien, merci.' }),
      fill('Mateo ___ mexicano.', 'es', 'mateo', { opts: ['es', 'está', 'soy'], tr: 'Mateo est mexicain. (nationalité → ser)' }),
      fill('La Casa Azul ___ en Coyoacán.', 'está', 'valentina', { opts: ['es', 'está', 'soy'], tr: 'La Casa Azul est à Coyoacán.' }),
      fill('Nosotros ___ en México.', 'estamos', 'mateo', { opts: ['somos', 'estamos', 'estáis'], tr: 'Nous sommes au Mexique.' }),
      conj('llevar', 'yo', 'llev', 'o', ['o', 'as', 'a'], 'viajero', { tr: 'Moi, je porte…' }),
      conj('llevar', 'ella', 'llev', 'a', ['o', 'as', 'a'], 'valentina', { tr: 'Elle porte…' }),
      conj('llevar', 'nosotros', 'llev', 'amos', ['amos', 'an', 'a'], 'marina', { tr: 'Nous, nous portons…' }),
      conj('ser', 'él', '', 'es', ['soy', 'eres', 'es'], 'mateo', { tr: 'Lui, il est (caractère)…' }),
      reord('La Casa Azul está en Coyoacán.', 'valentina', { tr: 'La Casa Azul est à Coyoacán.' }),
    ]));

  // 6 — Diálogo : carácter y estados
  quests.push(quest('u04', 6, 'dialogo', '¿Cómo eres tú?', '💬',
    ['mateo', 'Ahora cuéntame cómo eres tú y cómo estás hoy.', 'Maintenant, raconte-moi comment tu es, et comment tu vas aujourd’hui.'],
    'Le caractère (ser) et l’état du moment (estar) : dialogues, puis tu parles et écris sur TOI.', ['hablar', 'escribir', 'escuchar'], 14, [
      flash('simpatico', 'divertido', 'timido', 'serio', 'valiente', 'inteligente', 'trabajador'),
      flash('contento', 'triste', 'cansado', 'enfadado'),
      match(['simpatico', 'timido', 'valiente', 'inteligente', 'contento', 'triste']),
      dlg('mateo', 'Hoy estoy muy cansado. ¿Y tú? ¿Cómo estás?', 'Aujourd’hui, je suis très fatigué. Et toi ? Comment vas-tu ?', [
        ['Estoy bien, gracias.', 1, '¡Qué bueno! Eso me alegra.', 'Tant mieux ! Ça me fait plaisir.', 'Je vais bien, merci.'],
        ['Soy bien, gracias.', 0, 'Con «bien» usamos «estar»: «estoy bien».', 'Avec « bien », on utilise « estar » : « estoy bien ».', 'Je suis bien, merci.'],
        ['Me llamo cansado.', 0, '¿Te llamas Cansado? ¡Qué nombre!', 'Tu t’appelles Fatigué ? Quel nom !', 'Je m’appelle fatigué.'],
      ]),
      dlg('valentina', 'Mateo es muy simpático. Y tú, ¿cómo eres?', 'Mateo est très sympa. Et toi, comment es-tu ?', [
        ['Soy divertido y un poco tímido.', 1, '¡Perfecto! Los divertidos y los tímidos son buenos amigos.', 'Parfait ! Les drôles et les timides font de bons amis.', 'Je suis drôle et un peu timide.'],
        ['Tengo divertido.', 0, 'No: con el carácter usamos «ser», «soy divertido».', 'Non : pour le caractère, on utilise « ser » : « soy divertido ».', 'J’ai drôle.'],
        ['Me llamo simpático.', 0, 'Hola, Simpático. Yo soy Valentina.', 'Salut, Sympathique. Moi, c’est Valentina.', 'Je m’appelle sympathique.'],
      ]),
      fill('Álex ___ valiente.', 'es', 'marina', { opts: ['es', 'está', 'soy'], tr: 'Álex est courageux.' }),
      fill('Hoy Marina ___ triste.', 'está', 'marina', { opts: ['es', 'está', 'están'], tr: 'Aujourd’hui, Marina est triste.' }),
      fill('Mis padres ___ muy trabajadores.', 'son', 'marina', { opts: ['son', 'están', 'es'], tr: 'Mes parents sont très travailleurs.' }),
      lcT('Hoy estoy un poco triste.', 'valentina', ['Valentina está cansada.', 'Valentina no está contenta.', 'Valentina está muy contenta.'], 1),
      lcT('Soy muy divertido, pero mi hermana es tímida.', 'mateo', ['Mateo es tímido.', 'La hermana de Mateo es muy divertida.', 'La hermana de Mateo es tímida.'], 2),
      speak('Soy simpático.', 'viajero', { libre: 'simpático', es: 'Escucha y di cómo eres TÚ.', fr: 'Écoute et dis comment TU es (soy tímido, soy divertido y serio…). Au féminin : simpática, tímida…', tr: 'Je suis sympathique. (dis comment tu es)', foco: 'L’accent écrit montre la syllabe qu’on appuie : sim-PÁ-ti-co, TÍ-mi-do. Sans accent écrit, un mot qui finit par une voyelle s’appuie sur l’avant-dernière syllabe : di-ver-TI-do, SE-rio.', hechizo: ['Hechizo del carácter', 'Tu retrato empieza a sonreír'] }),
      speak('Hoy estoy contento.', 'viajero', { libre: 'contento', es: 'Escucha y di cómo estás TÚ hoy.', fr: 'Écoute et dis comment TU vas aujourd’hui (estoy cansado, estoy bien…).', tr: 'Aujourd’hui, je suis content. (dis comment tu vas)', hechizo: ['Hechizo del humor', 'Una nube de colores rodea tu cabeza'] }),
      writeFree('Soy ___ y hoy estoy ___.', [
        { id: 'caracter', pista: 'Comment es-tu ? (simpático, tímido, divertido, serio… ; au féminin : simpática…)', tipo: 'texto' },
        { id: 'estado', pista: 'Comment vas-tu aujourd’hui ? (contento, cansado, triste, bien…)', tipo: 'texto' },
      ], 'Soy simpático y hoy estoy contento.', 'Je suis sympathique et aujourd’hui je suis content.', 'viajero', C('Escribe cómo eres y cómo estás hoy.', 'Écris comment tu es et comment tu vas aujourd’hui.')),
      dict('Valentina es simpática, pero hoy está triste.', 'mateo', { acept: ['valentina es simpática pero hoy está triste'] }),
    ]));

  // 7 — Cultura : Frida Kahlo
  quests.push(quest('u04', 7, 'cultura', 'Frida Kahlo y la Casa Azul', '🖼️',
    ['valentina', 'Esta es la Casa Azul, la casa de Frida Kahlo. Hoy es un museo.', 'Voici la Casa Azul, la maison de Frida Kahlo. Aujourd’hui, c’est un musée.'],
    'Frida Kahlo (1907-1954), ses autoportraits et sa maison de Coyoacán ; puis, comme elle, tu fais TON autoportrait (à l’écrit et à l’oral).', ['cultura', 'leer', 'escribir', 'hablar'], 15, [
      flash('autorretrato', 'cuadro', 'museo', 'espejo', 'flor', 'loro', 'pintar'),
      capsula,
      tf('La Casa Azul es de color rojo.', false, N, { tr: 'La Casa Azul est de couleur rouge.' }),
      tf('Frida pinta muchos autorretratos.', true, N, { tr: 'Frida peint beaucoup d’autoportraits.' }),
      tf('En la casa de Frida viven monos, loros y perros.', true, N, { tr: 'Dans la maison de Frida vivent des singes, des perroquets et des chiens (à l’époque de Frida).' }),
      read('Frida Kahlo es una pintora mexicana. Tiene las cejas negras y gruesas, y lleva flores en el pelo. Lleva vestidos largos de colores. Pinta muchos autorretratos con un espejo. Hoy su casa, la Casa Azul, es un museo.', 'valentina',
        'Frida Kahlo est une peintre mexicaine. Elle a les sourcils noirs et épais, et elle porte des fleurs dans les cheveux. Elle porte des robes longues colorées. Elle peint beaucoup d’autoportraits avec un miroir. Aujourd’hui, sa maison, la Casa Azul, est un musée.', [
          ['¿Qué lleva Frida en el pelo?', 'Que porte Frida dans les cheveux ?', ['Flores.', 'Una gorra.', 'Gafas.'], 0],
          ['¿Cómo pinta sus autorretratos?', 'Comment peint-elle ses autoportraits ?', ['Con un loro.', 'Con un espejo.', 'Con un museo.'], 1],
          ['¿Qué es hoy la Casa Azul?', 'Qu’est-ce que la Casa Azul aujourd’hui ?', ['Un mercado.', 'Un colegio.', 'Un museo.'], 2],
        ]),
      read('La Casa Azul es azul cobalto. Tiene un patio con muchas flores y plantas. En Coyoacán hay una plaza, un mercado y mucha gente. «Coyoacán» viene de una palabra náhuatl: significa «lugar de coyotes».', 'valentina',
        'La Casa Azul est bleu cobalt. Elle a un patio avec beaucoup de fleurs et de plantes. À Coyoacán, il y a une place, un marché et beaucoup de monde. « Coyoacán » vient d’un mot nahuatl (la langue des Aztèques, encore parlée aujourd’hui par plus d’un million de Mexicains) : il signifie « lieu des coyotes ».', [
          ['¿De qué color es la casa?', 'De quelle couleur est la maison ?', ['Azul.', 'Roja.', 'Verde.'], 0],
          ['¿Qué significa «Coyoacán»?', 'Que signifie « Coyoacán » ?', ['Lugar de coyotes.', 'Casa de flores.', 'Plaza azul.'], 0],
        ]),
      lcT('Frida lleva flores en el pelo y un vestido largo de color rojo.', 'valentina', ['Frida tiene flores en el pelo y su vestido es rojo.', 'Frida lleva una gorra y pantalones cortos.', 'Frida tiene el pelo corto y lleva gafas.'], 0),
      dlg('valentina', 'Mira este autorretrato. ¿Cómo es Frida?', 'Regarde cet autoportrait. Comment est Frida ?', [
        ['Frida tiene el pelo negro y lleva flores.', 1, '¡Exacto! Ya puedes pintar su cara.', 'Exact ! Tu peux déjà peindre son visage.', 'Frida a les cheveux noirs et porte des fleurs.'],
        ['Frida es una casa azul.', 0, 'La casa es azul, pero Frida es una persona.', 'La maison est bleue, mais Frida est une personne.', 'Frida est une maison bleue.'],
        ['Frida tiene doce años.', 0, 'No, Frida es una pintora famosa.', 'Non, Frida est une peintre célèbre.', 'Frida a douze ans.'],
      ]),
      fill('Frida pinta muchos ___.', 'autorretratos', 'valentina', { opts: ['autorretratos', 'museos', 'loros'], tr: 'Frida peint beaucoup d’autoportraits.' }),
      reord('Frida pinta con un espejo.', 'valentina', { tr: 'Frida peint avec un miroir.' }),
      writeFree('Soy ___. Tengo el pelo ___ y los ojos ___. Llevo ___.', [
        { id: 'soy', pista: 'Comment es-tu ? (alto, bajo, delgado, simpático, tímido…)', tipo: 'texto' },
        { id: 'pelo', pista: 'Tes cheveux (corto, largo, rizado, castaño, rubio…)', tipo: 'texto' },
        { id: 'ojos', pista: 'La couleur de tes yeux (marrones, verdes, azules…, au pluriel)', tipo: 'texto' },
        { id: 'ropa', pista: 'Ce que tu portes (una camiseta azul, pantalones negros…)', tipo: 'texto' },
      ], 'Soy alto y simpático. Tengo el pelo corto y los ojos marrones. Llevo una camiseta azul.', 'Je suis grand et sympathique. J’ai les cheveux courts et les yeux marron. Je porte un tee-shirt bleu.', 'viajero',
      C('Escribe tu autorretrato, como Frida.', 'Écris ton autoportrait, comme Frida.')),
      speak('Tengo los ojos marrones.', 'viajero', { libre: 'marrones', es: 'Escucha y di el color de TUS ojos.', fr: 'Écoute et dis la couleur de TES yeux (marrones, verdes, azules, grises…).', tr: 'J’ai les yeux marron. (dis la couleur des tiens)', hechizo: ['Hechizo del autorretrato', 'Tu autorretrato aparece en la pared de la Casa Azul'] }),
      dict('La Casa Azul está en Coyoacán.', 'valentina', { acept: ['la casa azul está en coyoacán'] }),
    ]));

  // 8 — Desafío
  quests.push(quest('u04', 8, 'desafio', 'El retrato de la Sombra', '👤',
    ['sombra', 'Sin cara, no hay retrato. Sin retrato, no hay nadie. Yo borro las caras.', 'Sans visage, pas de portrait. Sans portrait, personne. J’efface les visages.'],
    'Boss de Mexico : révision mixte des unités 1 à 4 (présentation, école, famille, description, vêtements, ser / estar) pour rendre leur visage aux portraits.', ['escuchar', 'hablar', 'leer', 'escribir'], 15, [
      dlg('sombra', 'Sin nombre no hay cara. ¿Cómo te llamas y de dónde eres?', 'Sans prénom, pas de visage. Comment tu t’appelles et d’où viens-tu ?', [
        ['Me llamo Álex y soy de París.', 1, '¡Grr! Ya tengo una cara menos…', 'Grr ! Voilà un visage de moins…', 'Je m’appelle Álex et je suis de Paris.'],
        ['Tengo doce años y tres amigos.', 0, 'No es lo que pregunto. Responde bien.', 'Ce n’est pas ce que je demande. Réponds correctement.', 'J’ai douze ans et trois amis.'],
        ['Adiós, hasta luego.', 0, 'No te vas sin responder.', 'Tu ne pars pas sans répondre.', 'Au revoir, à tout à l’heure.'],
      ]),
      dlg('sombra', '¿Cómo eres? Descríbete.', 'Comment es-tu ? Décris-toi.', [
        ['Soy alto y tengo el pelo corto.', 1, '¡Aaah! Una cara más que vuelve…', 'Aaah ! Encore un visage qui revient…', 'Je suis grand et j’ai les cheveux courts.'],
        ['Tengo alto y soy el pelo.', 0, 'Eso no tiene sentido. ¡Otra vez!', 'Ça n’a aucun sens. Encore une fois !', 'J’ai grand et je suis les cheveux.'],
        ['Llevo doce años.', 0, '¡No! La edad se dice con «tener»: tengo doce años. Y te pregunto cómo eres.', 'Non ! L’âge se dit avec « tener » : tengo doce años. Et je te demande comment tu es.', 'Je porte douze ans.'],
      ]),
      lcV('gris', ['negro', 'gris', 'blanco']),
      lcT('Mi hermano es bajo, rubio y muy serio.', 'sombra', ['El hermano es alto y pelirrojo.', 'El hermano es un chico rubio que no es alto.', 'El hermano es bajo y tiene el pelo castaño.'], 1),
      match(['camiseta', 'falda', 'chaqueta', 'sombrero', 'zapatos', 'vestido']),
      fill('En mi mochila hay un libro y dos ___.', 'cuadernos', 'diego', { opts: ['cuaderno', 'cuadernos', 'cuadernas'], tr: 'Dans mon sac à dos, il y a un livre et deux cahiers.' }),
      fill('Mi madre es médica y mi padre es ___.', 'cocinero', 'marina', { opts: ['cocinero', 'cocinera', 'cocineros'], tr: 'Ma mère est médecin et mon père est cuisinier.' }),
      fill('Hoy yo ___ muy cansado.', 'estoy', 'viajero', { opts: ['soy', 'estoy', 'estás'], tr: 'Aujourd’hui, je suis très fatigué.' }),
      conj('llevar', 'tú', 'llev', 'as', ['o', 'as', 'a'], 'marina', { tr: 'Toi, tu portes…' }),
      reord('Marina lleva una falda roja y zapatos negros.', 'marina', { tr: 'Marina porte une jupe rouge et des chaussures noires.' }),
      lcT('El treinta y uno de octubre.', 'sombra', ['13 de octubre', '31 de octubre', '30 de octubre'], 1),
      read('Hola, soy Mateo. Tengo doce años y vivo en Coyoacán. Mi mamá es médica y mi papá es cocinero. Soy alto y delgado, y llevo una gorra azul. Hoy estoy cansado, pero estoy contento.', 'mateo',
        'Salut, c’est Mateo. J’ai douze ans et j’habite à Coyoacán. Ma mère est médecin et mon père est cuisinier (au Mexique, on dit plus souvent « mi mamá, mi papá » que « mi madre, mi padre »). Je suis grand et mince, et je porte une casquette bleue. Aujourd’hui, je suis fatigué, mais je suis content.', [
          ['¿En qué trabaja el padre de Mateo?', 'Quel est le métier du père de Mateo ?', ['Es médico.', 'Es cocinero.', 'Es policía.'], 1],
          ['¿Cómo es Mateo?', 'Comment est Mateo ?', ['Bajo y rubio.', 'Alto y delgado.', 'Bajo y delgado.'], 1],
          ['¿Cómo está Mateo hoy?', 'Comment va Mateo aujourd’hui ?', ['Triste y enfadado.', 'Cansado, pero contento.', 'Nervioso y serio.'], 1],
        ]),
      speak('Hola, me llamo Álex. Soy de París y tengo doce años.', 'viajero', { tr: 'Salut, je m’appelle Álex. Je suis de Paris et j’ai douze ans. (dis ton prénom)', nombre: 'Álex', acept: ['hola me llamo álex soy de parís y tengo 12 años'], hechizo: ['Hechizo final', '¡Los autorretratos recuperan la cara y todos sus colores!'] }),
      pluma,
    ], { jefe: { personaje: 'sombra', vidas: 9 } }));

  return {
    id: 'u04', numero: 4, titulo: '¿Cómo eres?', lugar: 'Ciudad de México', emoji: '🎨', ejes: [1, 6], periodo: 'oct-nov',
    objetivos: [
      { es: 'Describir mi aspecto físico y el de otra persona: pelo, ojos, altura.', fr: 'Décrire mon apparence et celle d’une autre personne : cheveux, yeux, taille.' },
      { es: 'Decir qué ropa llevo y de qué color es.', fr: 'Dire quels vêtements je porte et de quelle couleur ils sont.' },
      { es: 'Decir cómo soy (carácter) y cómo estoy hoy, con ser y estar.', fr: 'Dire comment je suis (caractère) et comment je vais aujourd’hui, avec ser et estar.' },
      { es: 'Hacer concordar los adjetivos con el nombre: negro, negra, negros, negras.', fr: 'Accorder les adjectifs avec le nom : negro, negra, negros, negras.' },
      { es: 'Escribir y decir mi autorretrato.', fr: 'Écrire et dire mon autoportrait.' },
      { es: 'Conocer a Frida Kahlo, la Casa Azul y el barrio de Coyoacán.', fr: 'Connaître Frida Kahlo, la Casa Azul et le quartier de Coyoacán.' },
    ],
    vocab, gramatica, quests,
    pluma: { numero: 4, nombre: 'Pluma del Autorretrato', descripcion: L('quetzal', 'Cuatro plumas. Mis colores vuelven… ¡y vuelo más alto!', 'Quatre plumes. Mes couleurs reviennent… et je vole plus haut !') },
  };
}
