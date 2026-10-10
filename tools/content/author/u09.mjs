// Unidad 9 — ¡Viva México! (Yucatán · Chichén Itzá · cenotes)
// Axe 6 (Le Mexique : nature, patrimoine, saveurs). PNJ mexicains du Yucatán : Itzel, Don Chan, Doña Chabela (es-MX).
// Espagnol d'Espagne pour Álex/Marina/le narrateur ; espagnol du Mexique pour les PNJ (« ustedes », mots qui diffèrent signalés en français).
// Passé composé : simple découverte (reconnaître he / has / ha + participe), aucune exigence de maîtrise.
import { W as W0, reg, G, quest, flash, match, lcV, lcI, lcT, dict, fill, reord, conj, dlg, read, speak, tf, gram, writeFree, cine, P, L, C, NARR } from './lib.mjs';

export default function build() {
  const N = NARR;
  const ilu = (s) => ({ ilustracion: s });
  // Un mot déjà défini par une unité précédente (même id) est simplement réutilisé, jamais redéclaré.
  const W = (id, ...a) => (reg.has(id) ? null : W0(id, ...a));
  // Mots que u06 (Navidad) a déjà définis sous un autre id : on réutilise le sien (jamais de doublon).
  const Wx = (theirs, id, ...a) => (reg.has(theirs) ? null : W(id, ...a));
  const ref = (mine, theirs) => (reg.has(theirs) ? theirs : mine);
  const CHOC = ref('chocolate', 'chocolate_nav'), DULCE = ref('dulce', 'dulce_nav'), PROBAR = ref('probar', 'probar_nav'), NADAR = ref('nadar', 'nadar_dep'), VER = ref('ver', 'ver_tv');

  // ───────────── Vocabulario (47) ─────────────
  const vocab = [
    // naturaleza
    W('selva', 'selva', 'forêt tropicale, jungle', '🌴', 'naturaleza', 'En Yucatán hay una selva muy grande.', 'Au Yucatán, il y a une très grande forêt tropicale.', { genero: 'f', plural: 'selvas' }),
    W('cenote', 'cenote', 'cénote : puits naturel rempli d’eau, typique du Yucatán', null, 'naturaleza', 'Itzel nada en el cenote.', 'Itzel nage dans le cénote.', { genero: 'm', plural: 'cenotes', ...ilu('Un cénote : un grand trou rond dans la roche, avec de l’eau turquoise et un rayon de lumière qui tombe du plafond'), voz: 'itzel', exVoz: 'itzel' }),
    W('playa', 'playa', 'plage', '🏖️', 'naturaleza', 'En Yucatán hay playas muy bonitas.', 'Au Yucatán, il y a de très belles plages.', { genero: 'f', plural: 'playas' }),
    W('mar', 'mar', 'mer (« el mar » ; on dit parfois « la mar » en poésie)', '🌊', 'naturaleza', 'El mar es cálido en Yucatán.', 'La mer est chaude au Yucatán.', { genero: 'm' }),
    W('rio', 'río', 'fleuve, rivière', null, 'naturaleza', 'En Yucatán hay ríos bajo la tierra.', 'Au Yucatán, il y a des rivières sous la terre.', { genero: 'm', plural: 'ríos', ...ilu('Une rivière qui serpente entre des arbres verts') }),
    W('piedra', 'piedra', 'pierre', '🪨', 'naturaleza', 'La pirámide es de piedra.', 'La pyramide est en pierre.', { genero: 'f', plural: 'piedras' }),
    W('planta', 'planta', 'plante', '🌿', 'naturaleza', 'En la selva hay muchas plantas.', 'Dans la forêt tropicale, il y a beaucoup de plantes.', { genero: 'f', plural: 'plantas' }),
    W('animal', 'animal', 'animal', '🐾', 'naturaleza', 'El jaguar es un animal grande.', 'Le jaguar est un grand animal.', { genero: 'm', plural: 'animales' }),
    W('jaguar', 'jaguar', 'jaguar', null, 'naturaleza', 'El jaguar vive en la selva.', 'Le jaguar vit dans la forêt tropicale.', { genero: 'm', plural: 'jaguares', ...ilu('Un jaguar au pelage orange tacheté de noir, assis sur une branche dans la forêt') }),
    W('flamenco', 'flamenco', 'flamant rose', '🦩', 'naturaleza', 'Los flamencos son rosas.', 'Les flamants sont roses.', { genero: 'm', plural: 'flamencos' }),
    W('tortuga', 'tortuga', 'tortue', '🐢', 'naturaleza', 'La tortuga nada en el mar.', 'La tortue nage dans la mer.', { genero: 'f', plural: 'tortugas' }),
    W('serpiente', 'serpiente', 'serpent', '🐍', 'naturaleza', 'Kukulcán es una serpiente con plumas.', 'Kukulcán est un serpent à plumes.', { genero: 'f', plural: 'serpientes' }),
    W('pajaro', 'pájaro', 'oiseau', '🐦', 'naturaleza', 'El Quetzal es un pájaro sagrado.', 'Le Quetzal est un oiseau sacré.', { genero: 'm', plural: 'pájaros' }),
    W('mono', 'mono', 'singe', '🐒', 'naturaleza', 'Hay monos en los árboles.', 'Il y a des singes dans les arbres.', { genero: 'm', plural: 'monos' }),
    W('sagrado', 'sagrado', 'sacré', '✨', 'naturaleza', 'Para los mayas, el cenote es un lugar sagrado.', 'Pour les Mayas, le cénote est un lieu sacré.', { adj: true, genero: 'm', femenino: 'sagrada' }),
    W('lluvia', 'lluvia', 'pluie', '🌧️', 'naturaleza', 'En la selva hay mucha lluvia.', 'Dans la forêt tropicale, il y a beaucoup de pluie.', { genero: 'f' }),
    W('calor', 'calor', 'chaleur (hace calor = il fait chaud)', '🥵', 'naturaleza', 'En Yucatán hace mucho calor.', 'Au Yucatán, il fait très chaud.', { genero: 'm' }),
    // patrimonio
    W('maya', 'maya', 'maya (peuple et adjectif ; « los mayas »)', null, 'patrimonio', 'Los mayas construyen pirámides.', 'Les Mayas construisent des pyramides.', { adj: true, genero: 'mf', plural: 'mayas', ...ilu('Un portrait en pierre sculptée d’un dignitaire maya avec une grande coiffe de plumes'), voz: 'chan', exVoz: 'chan' }),
    W('azteca', 'azteca', 'aztèque (peuple et adjectif ; eux-mêmes se nommaient « mexicas »)', null, 'patrimonio', 'Los aztecas viven en el centro de México.', 'Les Aztèques vivent au centre du Mexique.', { adj: true, genero: 'mf', plural: 'aztecas', ...ilu('Un guerrier aztèque avec un grand casque de plumes vertes et un bouclier rond') }),
    W('piramide', 'pirámide', 'pyramide', null, 'patrimonio', 'La pirámide de Chichén Itzá es muy famosa.', 'La pyramide de Chichén Itzá est très célèbre.', { genero: 'f', plural: 'pirámides', ...ilu('Une pyramide maya à degrés avec un temple au sommet, sous un ciel bleu') }),
    W('templo', 'templo', 'temple', null, 'patrimonio', 'Hay un templo en lo alto de la pirámide.', 'Il y a un temple en haut de la pyramide.', { genero: 'm', plural: 'templos', ...ilu('Un petit temple en pierre avec des colonnes sculptées, au milieu de la jungle') }),
    W('ruinas', 'ruinas', 'ruines', '🏚️', 'patrimonio', 'Visitamos las ruinas de una ciudad maya.', 'Nous visitons les ruines d’une ville maya.', { genero: 'f', soloPlural: true }),
    W('dios', 'dios', 'dieu (pluriel : dioses)', null, 'patrimonio', 'Chaac es el dios maya de la lluvia.', 'Chaac est le dieu maya de la pluie.', { genero: 'm', plural: 'dioses', ...ilu('Un masque de dieu maya en pierre sculptée, avec un grand nez et des yeux ronds'), voz: 'chan', exVoz: 'chan' }),
    W('calendario', 'calendario', 'calendrier', '📅', 'patrimonio', 'Los mayas tienen un calendario muy preciso.', 'Les Mayas ont un calendrier très précis.', { genero: 'm', plural: 'calendarios' }),
    W('imperio', 'imperio', 'empire', null, 'patrimonio', 'Los aztecas tienen un gran imperio.', 'Les Aztèques ont un grand empire.', { genero: 'm', plural: 'imperios', ...ilu('Une carte ancienne avec une grande zone dorée qui s’étend, entourée de petites villes') }),
    W('pueblo', 'pueblo', 'village ; aussi « peuple » (los pueblos indígenas)', '🏘️', 'patrimonio', 'Itzel vive en un pueblo cerca de Chichén Itzá.', 'Itzel vit dans un village près de Chichén Itzá.', { genero: 'm', plural: 'pueblos' }),
    W('turista', 'turista', 'touriste', '📸', 'patrimonio', 'Hay muchos turistas en Chichén Itzá.', 'Il y a beaucoup de touristes à Chichén Itzá.', { genero: 'mf', plural: 'turistas' }),
    W('escalon', 'escalón', 'marche (d’un escalier)', null, 'patrimonio', 'La pirámide tiene muchos escalones.', 'La pyramide a beaucoup de marches.', { genero: 'm', plural: 'escalones', ...ilu('De grandes marches de pierre qui montent le long d’une pyramide') }),
    W('guia', 'guía', 'guide (personne) ; une « guía » = aussi un guide de voyage', null, 'patrimonio', 'Don Chan es guía de Chichén Itzá.', 'Don Chan est guide à Chichén Itzá.', { genero: 'mf', plural: 'guías', ...ilu('Un guide avec un chapeau de paille qui montre une pyramide à un petit groupe'), voz: 'chan', exVoz: 'chan' }),
    // gastronomía
    W('maiz', 'maíz', 'maïs', '🌽', 'gastronomia', 'El maíz es la base de la cocina mexicana.', 'Le maïs est la base de la cuisine mexicaine.', { genero: 'm' }),
    W('tortilla_mx', 'tortilla de maíz', 'tortilla mexicaine : galette de maïs (en Espagne, « tortilla » seule = omelette !)', '🫓', 'gastronomia', 'Chabela hace tortillas de maíz todos los días.', 'Chabela fait des tortillas de maïs tous les jours.', { genero: 'f', plural: 'tortillas de maíz', voz: 'chabela', exVoz: 'chabela' }),
    W('cacao', 'cacao', 'cacao', null, 'gastronomia', 'Los mayas cultivan el cacao.', 'Les Mayas cultivent le cacao.', { genero: 'm', ...ilu('Une cabosse de cacao jaune et rouge ouverte, avec ses graines brunes à l’intérieur') }),
    Wx('chocolate_nav', 'chocolate', 'chocolate', 'chocolat', '🍫', 'gastronomia', 'El chocolate de los mayas no es dulce.', 'Le chocolat des Mayas n’est pas sucré.', { genero: 'm', plural: 'chocolates' }),
    W('frijoles', 'frijoles', 'haricots (secs, rouges ou noirs) ; en Espagne, on dit « judías » ou « alubias »', '🫘', 'gastronomia', 'Comemos tortillas con frijoles.', 'Nous mangeons des tortillas avec des haricots.', { genero: 'm', soloPlural: true, voz: 'chabela', exVoz: 'chabela' }),
    W('tomate', 'tomate', 'tomate (le mot vient du nahuatl « tomatl »)', '🍅', 'gastronomia', 'La salsa lleva tomate y chile.', 'La sauce contient de la tomate et du piment.', { genero: 'm', plural: 'tomates' }),
    W('aguacate', 'aguacate', 'avocat (le mot vient du nahuatl « ahuacatl » ; en Argentine : « palta »)', '🥑', 'gastronomia', 'Me gusta el aguacate con tortilla.', 'J’aime l’avocat avec de la tortilla.', { genero: 'm', plural: 'aguacates' }),
    W('chile', 'chile', 'piment (légume) ; attention : « Chile » avec majuscule est le pays !', '🌶️', 'gastronomia', 'Este chile es muy picante.', 'Ce piment est très piquant.', { genero: 'm', plural: 'chiles' }),
    W('taco', 'taco', 'taco : tortilla garnie et pliée', '🌮', 'gastronomia', 'Quiero un taco de pollo.', 'Je veux un taco au poulet.', { genero: 'm', plural: 'tacos' }),
    W('salsa', 'salsa', 'sauce (souvent piquante au Mexique)', null, 'gastronomia', 'La salsa de Chabela es muy picante.', 'La sauce de Chabela est très piquante.', { genero: 'f', plural: 'salsas', ...ilu('Un bol en terre cuite rempli d’une sauce rouge avec des tomates et des piments'), voz: 'chabela', exVoz: 'chabela' }),
    W('cochinita', 'cochinita pibil', 'cochinita pibil : porc mariné cuit dans un four sous terre, plat typique du Yucatán', null, 'gastronomia', 'La cochinita pibil es un plato típico de Yucatán.', 'La cochinita pibil est un plat typique du Yucatán.', { genero: 'f', ...ilu('Un plat de viande de porc effilochée rouge-orangé avec des oignons roses, servie avec des tortillas') }),
    W('picante', 'picante', 'piquant, épicé', '🔥', 'gastronomia', 'La salsa de chile habanero es muy picante.', 'La sauce au piment habanero est très piquante.', { adj: true, genero: 'mf', plural: 'picantes' }),
    Wx('dulce_nav', 'dulce', 'dulce', 'sucré, doux', '🍬', 'gastronomia', 'Este chocolate es muy dulce.', 'Ce chocolat est très sucré.', { adj: true, genero: 'mf', plural: 'dulces' }),
    W('delicioso', 'delicioso', 'délicieux (on dit aussi « rico », en Espagne comme en Amérique)', '😋', 'gastronomia', 'Los tacos están deliciosos.', 'Les tacos sont délicieux.', { adj: true, genero: 'm', femenino: 'deliciosa' }),
    // verbos
    W('visitar', 'visitar', 'visiter, rendre visite à', '🧭', 'verbos', 'Visitamos Chichén Itzá.', 'Nous visitons Chichén Itzá.'),
    Wx('probar_nav', 'probar', 'probar', 'goûter, essayer (verbe à diphtongue : pruebo)', '👅', 'verbos', 'Quiero probar la salsa.', 'Je veux goûter la sauce.'),
    Wx('nadar_dep', 'nadar', 'nadar', 'nager', '🏊', 'verbos', 'Nadamos en el cenote.', 'Nous nageons dans le cénote.'),
    Wx('ver_tv', 'ver', 'ver', 'voir (yo veo)', '👁️', 'verbos', 'Veo un flamenco rosa.', 'Je vois un flamant rose.'),
    W('hacer', 'hacer', 'faire (yo hago)', '🛠️', 'verbos', 'Hago tortillas con mi abuela.', 'Je fais des tortillas avec ma grand-mère.'),
    W('conocer', 'conocer', 'connaître ; faire la connaissance de (yo conozco)', '🤝', 'verbos', 'Conozco la ciudad de Mérida.', 'Je connais la ville de Mérida.'),
    W('haber', 'haber', 'avoir (auxiliaire, pour le passé composé) : he, has, ha, hemos, habéis, han', '🧩', 'verbos', 'He visitado Chichén Itzá.', 'J’ai visité Chichén Itzá.'),
  ].filter(Boolean);

  // ───────────── Gramática ─────────────
  const gramatica = [
    G('g_repaso_presente', 'Hablo, como, vivo', 'Révision du présent : -ar, -er, -ir', [
      ['Itzel habla maya y español.', 'Itzel parle maya et espagnol.', 'itzel', ['habla']],
      ['Comemos tortillas con frijoles.', 'Nous mangeons des tortillas avec des haricots.', 'chabela', ['Comemos']],
      ['Mis abuelos viven en un pueblo.', 'Mes grands-parents vivent dans un village.', 'itzel', ['viven']],
      ['Visito Chichén Itzá con mi familia.', 'Je visite Chichén Itzá avec ma famille.', 'viajero', ['Visito']],
    ], 'Los verbos en -ar, -er, -ir tienen la misma terminación en «yo» (-o). Después cambian: -as / -es, -a / -e, -amos / -emos / -imos, -an / -en.',
    'Les verbes en -ar, -er, -ir ont la même terminaison à « yo » (-o). Ensuite elles changent : -as / -es, -a / -e, -amos / -emos / -imos, -an / -en.',
    "Révision : on enlève -ar / -er / -ir et on ajoute la terminaison. Piège classique : « nosotros » garde la voyelle du verbe (-AMOS, -EMOS, -IMOS) et « ellos » prend -an pour les verbes en -ar mais -en pour -er et -ir (hablan, comen, viven). « Tú » : -as pour -ar, -es pour -er / -ir. Vosotros (Espagne seulement) : -áis, -éis, -ís ; au Mexique et dans toute l'Amérique latine, on dit « ustedes » + forme en -an / -en (ustedes hablan). Le sujet est souvent omis car la terminaison suffit : « hablo » = « yo hablo ».",
    { encabezado: ['', 'hablar', 'comer', 'vivir'], filas: [['yo', 'hablo', 'como', 'vivo'], ['tú', 'hablas', 'comes', 'vives'], ['él / ella', 'habla', 'come', 'vive'], ['nosotros', 'hablamos', 'comemos', 'vivimos'], ['vosotros', 'habláis', 'coméis', 'vivís'], ['ellos / ustedes', 'hablan', 'comen', 'viven']] }),
    G('g_yo_irregular', 'Hago, veo, conozco', 'Verbes irréguliers seulement à « yo »', [
      ['Hago tortillas con mi abuela.', 'Je fais des tortillas avec ma grand-mère.', 'chabela', ['Hago']],
      ['Veo un jaguar en la selva.', 'Je vois un jaguar dans la forêt tropicale.', 'itzel', ['Veo']],
      ['Conozco Mérida, pero no conozco Cusco.', 'Je connais Mérida, mais je ne connais pas Cusco.', 'itzel', ['Conozco', 'conozco']],
      ['Tú haces, ella hace, nosotros hacemos.', 'Toi, tu fais ; elle, elle fait ; nous, nous faisons.', 'marina', ['haces', 'hace', 'hacemos']],
    ], 'Algunos verbos son irregulares solo en «yo»: hacer → hago, ver → veo, conocer → conozco. Las otras personas son regulares.',
    'Certains verbes sont irréguliers seulement à « yo » : hacer → hago, ver → veo, conocer → conozco. Les autres personnes sont régulières.',
    "À connaître : hacer (hago, haces, hace, hacemos, hacéis, hacen), ver (veo, ves, ve, vemos, veis, ven), conocer (conozco, conoces, conoce…). Seul « yo » change ; le reste suit la règle régulière. « Conocer » = connaître une personne ou un lieu (conozco Mérida) ; « saber » = savoir quelque chose (sé nadar). Autres verbes de la même famille que tu rencontreras : saber (sé), poner (pongo), salir (salgo). Attention à l'orthographe de « ver » : ves, ve, vemos, veis, ven s'écrivent sans accent.",
    { encabezado: ['', 'hacer', 'ver', 'conocer'], filas: [['yo', 'hago', 'veo', 'conozco'], ['tú', 'haces', 'ves', 'conoces'], ['él / ella', 'hace', 've', 'conoce'], ['nosotros', 'hacemos', 'vemos', 'conocemos']] }),
    G('g_describir_lugar', 'Es, está, hay', 'Décrire un lieu : ser, estar, hay', [
      ['Yucatán es una región cálida y verde.', 'Le Yucatán est une région chaude et verte.', 'itzel', ['es']],
      ['Yucatán está en el sureste de México.', 'Le Yucatán est dans le sud-est du Mexique.', 'itzel', ['está']],
      ['En Yucatán hay miles de cenotes.', 'Au Yucatán, il y a des milliers de cénotes.', 'itzel', ['hay']],
      ['Los cenotes son muy bonitos y están en la selva.', 'Les cénotes sont très beaux et ils sont dans la forêt tropicale.', 'chan', ['son', 'están']],
    ], 'Para describir un lugar usamos tres palabras: «es» (cómo es), «está» (dónde está) y «hay» (qué hay).',
    'Pour décrire un lieu, on utilise trois mots : « es » (comment il est), « está » (où il est) et « hay » (ce qu’il y a).',
    "Un petit rappel qui réunit les unités 4 et 8. SER décrit comment est un lieu (es grande, es bonito, es verde). Pour le climat, on dit « hace calor » ou « es una región cálida » (« caliente » s'emploie plutôt pour un objet : el café está caliente). ESTAR le situe (está en Yucatán, está cerca del mar). HAY dit ce qu'il contient (hay selva, hay cenotes, hay playas), toujours avec un, una, dos, muchos… et jamais avec l'article défini. Test rapide : ¿Cómo es? → es… ; ¿Dónde está? → está… ; ¿Qué hay? → hay…",
    { encabezado: ['Pregunta', 'Palabra', 'Ejemplo'], filas: [['¿Cómo es?', 'es / son', 'Es verde.'], ['¿Dónde está?', 'está / están', 'Está en Yucatán.'], ['¿Qué hay?', 'hay', 'Hay cenotes.']] }),
    G('g_pasado_compuesto', 'He visitado, has comido', 'Premier contact avec le passé composé', [
      ['He visitado Chichén Itzá.', 'J’ai visité Chichén Itzá.', 'viajero', ['He visitado']],
      ['¿Has probado la cochinita pibil?', 'As-tu goûté la cochinita pibil ?', 'itzel', ['Has probado']],
      ['Itzel ha nadado en el cenote.', 'Itzel a nagé dans le cénote.', 'marina', ['ha nadado']],
      ['Hemos comido muchos tacos.', 'Nous avons mangé beaucoup de tacos.', 'chabela', ['Hemos comido']],
    ], 'Para hablar de lo que hemos hecho: he / has / ha / hemos / han + participio. -ar → -ado (hablado), -er / -ir → -ido (comido, vivido).',
    'Pour parler de ce qu’on a fait : he / has / ha / hemos / han + participe. -ar → -ado (hablado), -er / -ir → -ido (comido, vivido).',
    "Ce n'est qu'une première découverte : retiens simplement de RECONNAÎTRE la forme. Le passé composé espagnol se forme presque comme en français : auxiliaire + participe passé. Mais l'auxiliaire est TOUJOURS HABER (he, has, ha, hemos, habéis, han), même là où le français prend « être » : he ido = je suis allé. Participe : -ar → -ADO (visitar → visitado), -er et -ir → -IDO (comer → comido, vivir → vivido). Deux irréguliers très courants : hacer → hecho (he hecho), ver → visto (he visto). Le participe ne s'accorde pas avec le sujet. Contrairement au français, on ne sépare jamais « he » du participe (pas de « he siempre visto »). Remarque importante : en Espagne, on emploie ce temps pour le passé récent (hoy he comido) ; au Mexique et dans toute l'Amérique latine, on préfère souvent un autre passé (« ¿Ya comiste? », « Hoy comí ») que tu apprendras plus tard.",
    { encabezado: ['haber', 'participio'], filas: [['yo he', 'visitado / comido / vivido'], ['tú has', 'visitado / comido / vivido'], ['él / ella ha', 'visitado / comido / vivido'], ['nosotros hemos', 'visitado / comido / vivido'], ['ellos han', 'visitado / comido / vivido'], ['irregulares', 'hecho (hacer) · visto (ver)']] }),
  ];

  // ───────────── Cinemáticas ─────────────
  const intro = cine('u09-intro', 'intro', 'Capítulo 9 · ¡Viva México! · Yucatán', [
    P(3, 'La carte du monde en papel picado : la ligne dorée quitte Bogotá, franchit la mer des Caraïbes et vient se poser sur la péninsule du Yucatán ; carte-titre « Capítulo 9 · ¡Viva México! · Yucatán ».', [L(N, 'Capítulo nueve: ¡Viva México!', 'Chapitre neuf : vive le Mexique !')], { rotulo: 'Capítulo 9 · ¡Viva México! · Yucatán', camara: 'zoom avant progressif' }),
    P(5, 'Vue aérienne de la forêt tropicale du Yucatán : la canopée verte, la pyramide de pierre qui sort des arbres, un cénote turquoise et, au bord d’une lagune, des flamants roses qui s’envolent.', [L(N, 'Yucatán, en el sureste de México.', 'Le Yucatán, dans le sud-est du Mexique.'), L(N, 'Selva, cenotes y pirámides: aquí viven los mayas desde hace miles de años.', 'Forêt tropicale, cénotes et pyramides : ici vivent les Mayas depuis des milliers d’années.')], { camara: 'survol lent en drone, puis descente vers la pyramide' }),
  ]);
  const historia = cine('u09-historia', 'historia', 'Las piedras mudas', [
    P(7, 'Un sentier dans la forêt tropicale, lumière verte. Le Quetzal sort du sac de Marina et vole d’un arbre à l’autre. Itzel, 12 ans, huipil blanc brodé de fleurs, un panier au bras, les accueille en souriant.', [
      L('quetzal', 'México… ¡Estoy en casa! Pero la selva está muy callada.', 'Le Mexique… Je suis chez moi ! Mais la forêt est très silencieuse.'),
      L('itzel', '¡Hola! Me llamo Itzel y vivo cerca de Chichén Itzá. Hablo maya con mi abuela y español con mis amigos.', 'Salut ! Je m’appelle Itzel et j’habite près de Chichén Itzá. Je parle maya avec ma grand-mère et espagnol avec mes amis.'),
    ], { personajes: ['quetzal', 'itzel', 'marina', 'viajero'], camara: 'plan large dans les arbres puis plan moyen sur Itzel' }),
    P(7, 'Au pied d’El Castillo, la grande pyramide : les murs de pierre sont lisses, sans aucun dessin. Don Chan, le guide, un chapeau de paille sur la tête, passe la main sur la pierre vide.', [
      L('chan', 'Las piedras hablaban, pero ahora están mudas. Los dibujos de los mayas han desaparecido.', 'Les pierres parlaient, mais maintenant elles sont muettes. Les dessins des Mayas ont disparu.'),
      L('itzel', 'Es la Sombra. Se lleva las historias.', 'C’est l’Ombre. Elle emporte les histoires.'),
    ], { personajes: ['chan', 'itzel'], camara: 'travelling le long du mur lisse' }),
    P(7, 'Tout en haut de l’escalier, la Sombra aspire les derniers glyphes qui coulent comme de l’encre noire hors de la pierre.', [
      L('sombra', 'Sin historia, no hay memoria. Sin memoria, nadie habla.', 'Sans histoire, pas de mémoire. Sans mémoire, personne ne parle.'),
      L('chan', '¡No! Esas piedras tienen mil años.', 'Non ! Ces pierres ont mille ans.'),
    ], { personajes: ['sombra', 'chan'], musica: 'tension douce, flûtes de roseau et tambour' }),
    P(7, 'Dans la forêt, un puits de lumière : un cénote turquoise où brille un reflet vert tout au fond. Le Quetzal le montre du bec.', [
      L('quetzal', 'La pluma… está en el agua.', 'La plume… est dans l’eau.'),
      L('itzel', 'Es el cenote sagrado. Para devolver la memoria a las piedras, tienen que conocer la historia de México. ¡Vamos!', 'C’est le cénote sacré. Pour rendre la mémoire aux pierres, il faut connaître l’histoire du Mexique. Allons-y !'),
    ], { personajes: ['quetzal', 'itzel', 'marina', 'viajero'], musica: 'thème d’aventure, marimba et flûte' }),
  ]);
  const capsula = cine('u09-capsula-mayas', 'capsula', 'Mayas y aztecas', [
    P(4, 'Style explainer, papier découpé : une carte du Mexique, le sud-est en vert pour les Mayas, le centre en orange pour les Aztèques.', [L(N, 'Mayas y aztecas son dos pueblos de México. Los mayas viven en el sureste y los aztecas en el centro.', 'Mayas et Aztèques sont deux peuples du Mexique. Les Mayas vivent dans le sud-est et les Aztèques au centre.')], { camara: 'plan fixe, animations de papier découpé' }),
    P(5, 'La pyramide d’El Castillo vue de face ; quatre escaliers s’illuminent, un compteur affiche « 91 × 4 + 1 = 365 ».', [L(N, 'La pirámide de Chichén Itzá tiene trescientos sesenta y cinco escalones, como los días del año.', 'La pyramide de Chichén Itzá a trois cent soixante-cinq marches, comme les jours de l’année.')]),
    P(5, 'À l’équinoxe de printemps ou d’automne, une ombre en dents de scie descend l’escalier nord de la pyramide et rejoint la tête de serpent en pierre au pied de l’escalier.', [L(N, 'En primavera y en otoño, la sombra de una serpiente baja por la pirámide: es Kukulcán.', 'Au printemps et en automne, l’ombre d’un serpent descend le long de la pyramide : c’est Kukulcán, le serpent à plumes.')]),
    P(5, 'Une île au milieu d’un lac, des chaussées, des canaux : Tenochtitlan ; fondu enchaîné vers un plan de Ciudad de México avec ses gratte-ciel.', [L(N, 'Los aztecas construyen Tenochtitlan en un lago. Hoy esa ciudad es Ciudad de México.', 'Les Aztèques construisent Tenochtitlan sur un lac. Aujourd’hui, cette ville est Mexico.')]),
    P(5, 'Des grains de cacao, un épi de maïs, des tortillas qui tournent ; une tasse de chocolat fumant avec un piment à côté.', [L(N, 'Mayas y aztecas comen maíz y beben chocolate. ¡Pero su chocolate no es dulce!', 'Mayas et Aztèques mangent du maïs et boivent du chocolat. Mais leur chocolat n’est pas sucré !')]),
  ]);
  const pluma = cine('u09-pluma', 'pluma', 'Novena pluma', [
    P(3, 'Dans le cénote, la plume verte monte lentement dans l’eau turquoise jusqu’au rayon de lumière. Là-haut, les dessins reviennent sur les pierres de la pyramide, un à un.', [L('itzel', '¡Las piedras hablan otra vez! ¡Gracias!', 'Les pierres parlent de nouveau ! Merci !')], { personajes: ['itzel'] }),
    P(3, 'Le Quetzal survole la forêt, la queue très longue et brillante, pour la première fois presque entier.', [L('quetzal', 'Nueve plumas. ¡Con una más, vuelvo a ser el gran Quetzal!', 'Neuf plumes. Avec une de plus, je redeviens le grand Quetzal !')], { personajes: ['quetzal'] }),
    P(2, 'Don Ignacio apparaît en hologramme au-dessus de la carte ; l’empreinte lumineuse longe la côte pacifique et grimpe vers les Andes du Pérou.', [L('ignacio', 'La última pluma está en Perú, en los Andes. ¡Vamos a Cusco!', 'La dernière plume est au Pérou, dans les Andes. Direction Cusco !')], { personajes: ['ignacio'] }),
  ]);

  // ───────────── Misiones ─────────────
  const quests = [];

  // 1 — Cinemática
  quests.push(quest('u09', 1, 'cinematica', 'Llegada a Yucatán', '🌴',
    ['itzel', '¡Bienvenidos a Yucatán! Yo soy Itzel. Estamos en la selva maya.', 'Bienvenue au Yucatán ! Moi, c’est Itzel. Nous sommes dans la forêt tropicale maya. (Au Mexique, on dit « ustedes » pour « vous » au pluriel.)'],
    'Arrivée au Yucatán, chez le Quetzal : tu rencontres Itzel et Don Chan, et tu découvres le problème des pierres sans dessins. Les PNJ parlent espagnol du Mexique.', ['escuchar', 'cultura', 'hablar'], 10, [
      intro,
      tf('Yucatán está en México.', true, N, { tr: 'Le Yucatán est au Mexique.' }),
      tf('Yucatán está en Argentina.', false, N, { tr: 'Le Yucatán est en Argentine.' }),
      historia,
      lcT('Hablo maya con mi abuela y español en el colegio.', 'itzel', ['Itzel habla dos lenguas.', 'Itzel solo habla español.', 'Itzel habla francés con su abuela.'], 0),
      lcT('Las piedras no tienen dibujos. Alguien los ha borrado.', 'chan', ['Los dibujos de la pirámide ya no están.', 'La pirámide tiene dibujos nuevos.', 'Los dibujos están en el cenote.'], 0),
      tf('El Quetzal está en México.', true, N, { tr: 'Le Quetzal est au Mexique.' }),
      dlg('itzel', '¡Qué onda! Soy Itzel. ¿Y ustedes, cómo se llaman?', 'Salut ! (« ¡Qué onda! » = salut, familier mexicain). Moi, c’est Itzel. Et vous, comment vous appelez-vous ?', [
        ['Me llamo Álex y ella es Marina.', 1, '¡Mucho gusto, Álex! ¡Mucho gusto, Marina!', 'Enchantée, Álex ! Enchantée, Marina ! (« mucho gusto » est la formule habituelle au Mexique)', 'Je m’appelle Álex et elle, c’est Marina.'],
        ['Tengo doce años.', 0, 'Está bien, pero ¿cómo se llaman?', 'C’est bien, mais comment vous appelez-vous ?', 'J’ai douze ans.'],
        ['Me llamo selva.', 0, '¿Te llamas Selva? ¡Qué nombre tan bonito!', 'Tu t’appelles Forêt ? Quel joli prénom !', 'Je m’appelle forêt.'],
      ]),
      reord('Yucatán está en el sureste de México.', 'itzel', { tr: 'Le Yucatán est dans le sud-est du Mexique.' }),
      speak('Mucho gusto, me llamo Álex.', 'viajero', { nombre: 'Álex', tr: 'Enchanté, je m’appelle Álex. (dis ton prénom)', hechizo: ['Hechizo de la selva', 'Los árboles de la selva se llenan de pájaros'] }),
    ]));

  // 2 — Naturaleza
  quests.push(quest('u09', 2, 'vocabulario', 'Selva y cenotes', '🦩',
    ['itzel', 'Mira: en Yucatán hay jaguares en la selva, flamencos en las lagunas, tortugas en el mar… ¡y miles de cenotes!', 'Regarde : au Yucatán, il y a des jaguars dans la forêt, des flamants roses dans les lagunes, des tortues dans la mer… et des milliers de cénotes !'],
    'La nature du Yucatán : forêt, mer, animaux et cénotes. Tu lis, tu écoutes et tu parles de ta nature à toi.', ['leer', 'escuchar', 'hablar', 'escribir'], 15, [
      flash('selva', 'cenote', 'playa', 'mar', 'rio', 'piedra', 'planta'),
      flash('animal', 'jaguar', 'flamenco', 'tortuga', 'serpiente', 'pajaro', 'mono'),
      flash('sagrado', 'lluvia', 'calor'),
      match(['jaguar', 'flamenco', 'tortuga', 'serpiente', 'mono', 'pajaro']),
      lcV('flamenco', ['flamenco', 'tortuga', 'mono']),
      lcI('Hay un jaguar en la selva.', 'itzel', 'jaguar', ['serpiente', 'jaguar', 'tortuga']),
      lcT('El jaguar es un animal grande y vive en la selva.', 'itzel', ['El jaguar vive en un bosque tropical.', 'El jaguar vive en el mar.', 'El jaguar es un animal pequeño.'], 0),
      tf('Es un flamenco.', true, N, { img: 'flamenco', tr: 'C’est un flamant rose.' }),
      read('En Yucatán no hay ríos en la superficie, pero hay miles de cenotes. Un cenote es un pozo natural con agua muy limpia. Para los mayas, los cenotes son lugares sagrados. Hoy puedes nadar en muchos cenotes.', 'itzel',
        'Au Yucatán, il n’y a pas de rivières en surface, mais il y a des milliers de cénotes. Un cénote est un puits naturel avec une eau très propre. Pour les Mayas, les cénotes sont des lieux sacrés. Aujourd’hui, tu peux nager dans beaucoup de cénotes. (Les rivières du Yucatán coulent sous la terre, dans la roche calcaire.)', [
          ['¿Qué es un cenote?', 'Qu’est-ce qu’un cénote ?', ['Un pozo natural con agua.', 'Una pirámide.', 'Un animal.'], 0],
          ['¿Para los mayas, cómo son los cenotes?', 'Pour les Mayas, comment sont les cénotes ?', ['Sagrados.', 'Peligrosos.', 'Pequeños.'], 0],
          ['¿Qué puedes hacer hoy en un cenote?', 'Que peux-tu faire aujourd’hui dans un cénote ?', ['Nadar.', 'Dormir.', 'Comprar ropa.'], 0],
        ]),
      fill('Los flamencos son de color ___.', 'rosa', 'itzel', { opts: ['rosa', 'negro', 'azul'], tr: 'Les flamants roses sont de couleur rose.' }),
      fill('Un ___ es un pozo natural con agua.', 'cenote', 'itzel', { opts: ['cenote', 'jaguar', 'taco'], tr: 'Un cénote est un puits naturel avec de l’eau.' }),
      dlg('itzel', 'En tu país, ¿hay selvas o montañas?', 'Dans ton pays, il y a des forêts tropicales ou des montagnes ?', [
        ['En Francia hay montañas, playas y ríos.', 1, '¡Qué bien! Hay de todo.', 'Super ! Il y en a de toutes sortes.', 'En France, il y a des montagnes, des plages et des rivières.'],
        ['En París hay selvas con jaguares.', 0, '¿En París? Mmm… no creo. Los jaguares viven en la selva.', 'À Paris ? Mmm… je ne crois pas. Les jaguars vivent dans la forêt tropicale.', 'À Paris, il y a des forêts tropicales avec des jaguars.'],
        ['En Francia soy un río.', 0, '¿Tú eres un río? ¡Qué cosa más rara!', 'Toi, tu es un fleuve ? Quelle drôle de chose !', 'En France, je suis un fleuve.'],
      ]),
      speak('Mi animal favorito es el jaguar.', 'viajero', { libre: 'el jaguar', es: 'Escucha y di cuál es TU animal favorito.', fr: 'Écoute et dis quel est TON animal préféré (el perro, el gato, el caballo…).', tr: 'Mon animal préféré est le jaguar. (dis le tien)', hechizo: ['Hechizo del animal', 'Tu animal favorito aparece entre las plantas'] }),
      writeFree('En mi país hay ___. Mi animal favorito es ___.', [
        { id: 'natura', pista: 'Ce qu’il y a dans ton pays (montañas, playas, ríos, bosques…)', tipo: 'texto' },
        { id: 'animal', pista: 'Ton animal préféré, avec l’article (el perro, el gato, la tortuga…)', tipo: 'texto' },
      ], 'En mi país hay montañas y playas. Mi animal favorito es el gato.', 'Dans mon pays, il y a des montagnes et des plages. Mon animal préféré est le chat.', 'marina', C('Escribe sobre la naturaleza de tu país.', 'Écris sur la nature de ton pays.')),
      dict('Los flamencos son rosas.', 'itzel'),
    ]));

  // 3 — Patrimonio
  quests.push(quest('u09', 3, 'escucha', 'Mayas y aztecas', '🏛️',
    ['chan', 'Soy Don Chan, guía de Chichén Itzá. Esta ciudad es de los mayas. Es muy, muy antigua.', 'Je suis Don Chan, guide de Chichén Itzá. Cette ville est maya. Elle est très, très ancienne.'],
    'Mayas et Aztèques : pyramides, temples, calendrier, empire. Tu écoutes le guide, tu lis une histoire courte, puis tu dis quel endroit TOI tu veux visiter.', ['escuchar', 'leer', 'cultura', 'hablar'], 14, [
      flash('maya', 'azteca', 'piramide', 'templo', 'ruinas', 'dios', 'calendario'),
      flash('imperio', 'pueblo', 'turista', 'escalon', 'guia'),
      match(['maya', 'azteca', 'piramide', 'templo', 'ruinas', 'calendario']),
      lcV('piramide', ['templo', 'piramide', 'ruinas']),
      lcT('Los mayas estudian el sol y las estrellas para hacer un calendario.', 'chan', ['Los mayas miran el cielo para saber qué día es.', 'Los mayas no tienen calendario.', 'Los mayas estudian en un museo de Madrid.'], 0),
      read('Los mayas viven en el sureste de México desde hace muchos siglos. Construyen pirámides y templos de piedra. Estudian el sol y las estrellas y tienen un calendario muy preciso. Los aztecas viven en el centro de México. Su capital se llama Tenochtitlan y hoy es Ciudad de México.', 'chan',
        'Les Mayas vivent dans le sud-est du Mexique depuis de nombreux siècles. Ils construisent des pyramides et des temples en pierre. Ils étudient le soleil et les étoiles et ont un calendrier très précis. Les Aztèques vivent au centre du Mexique. Leur capitale s’appelle Tenochtitlan et aujourd’hui c’est Mexico. (Le texte est au présent : c’est le « présent de narration » pour raconter l’histoire.)', [
          ['¿Dónde viven los mayas?', 'Où vivent les Mayas ?', ['En el sureste de México.', 'En el centro de México.', 'En Madrid.'], 0],
          ['¿Cómo se llama la capital de los aztecas?', 'Comment s’appelle la capitale des Aztèques ?', ['Tenochtitlan.', 'Chichén Itzá.', 'Bogotá.'], 0],
          ['¿Qué ciudad es hoy Tenochtitlan?', 'Quelle ville est aujourd’hui Tenochtitlan ?', ['Ciudad de México.', 'Mérida.', 'Cancún.'], 0],
        ]),
      tf('Chichén Itzá es una ciudad maya.', true, N, { tr: 'Chichén Itzá est une ville maya.' }),
      tf('Los aztecas viven en Yucatán.', false, N, { tr: 'Les Aztèques vivent au Yucatán. (Faux : ils vivaient au centre du Mexique.)' }),
      fill('La capital de los aztecas se llama ___.', 'Tenochtitlan', 'chan', { opts: ['Tenochtitlan', 'Chichén Itzá', 'Bogotá'], tr: 'La capitale des Aztèques s’appelle Tenochtitlan.' }),
      fill('Los mayas construyen ___ de piedra.', 'pirámides', 'chan', { opts: ['pirámides', 'neveras', 'bicicletas'], tr: 'Les Mayas construisent des pyramides en pierre.' }),
      dlg('chan', 'Mira esta pirámide. ¿Qué es? ¿Un templo o un mercado?', 'Regarde cette pyramide. Qu’est-ce que c’est ? Un temple ou un marché ?', [
        ['Es un templo maya.', 1, '¡Exacto! Aquí hay un templo en lo alto.', 'Exact ! Ici, il y a un temple tout en haut.', 'C’est un temple maya.'],
        ['Es un mercado grande.', 0, 'No, no. En un mercado hay frutas, no dioses.', 'Non, non. Dans un marché, il y a des fruits, pas des dieux.', 'C’est un grand marché.'],
        ['Es una pizza.', 0, '¿Una pizza de piedra? ¡Qué idea!', 'Une pizza en pierre ? Quelle idée !', 'C’est une pizza.'],
      ]),
      reord('Los aztecas viven en el centro de México.', 'chan', { tr: 'Les Aztèques vivent au centre du Mexique.' }),
      speak('Quiero visitar Chichén Itzá.', 'viajero', { libre: 'Chichén Itzá', es: 'Escucha y di qué lugar quieres visitar TÚ.', fr: 'Écoute et dis quel endroit TU veux visiter (Machu Picchu, Madrid, Cartagena…).', tr: 'Je veux visiter Chichén Itzá. (dis ton endroit)', foco: 'Chichén Itzá : le « ch » se dit « tch » (tchi-TCHEN it-SÁ), avec l’accent sur « chén » et sur « zá ». Le « z » se dit « s » au Mexique (et comme le « th » anglais en Espagne).', hechizo: ['Hechizo del viaje', 'Un mapa dorado se despliega ante ti'] }),
      dict('Los mayas tienen un calendario.', 'chan'),
    ]));

  // 4 — Gastronomía
  quests.push(quest('u09', 4, 'vocabulario', 'Maíz, cacao y chile', '🌽',
    ['chabela', '¡Pasen a mi cocina! Hoy hacemos tortillas con maíz, como hace miles de años.', 'Entrez dans ma cuisine ! Aujourd’hui, on fait des tortillas avec du maïs, comme il y a des milliers d’années.'],
    'Les saveurs du Mexique : maïs, tortillas, cacao, piment, cochinita pibil. Tu lis, tu goûtes (en mots) et tu dis ce que TOI tu aimes manger.', ['leer', 'escuchar', 'hablar', 'escribir', 'cultura'], 15, [
      flash('maiz', 'tortilla_mx', 'cacao', CHOC, 'frijoles', 'tomate', 'aguacate'),
      flash('chile', 'taco', 'salsa', 'cochinita', 'picante', DULCE, 'delicioso'),
      match(['maiz', 'tortilla_mx', CHOC, 'tomate', 'aguacate', 'chile']),
      lcV('aguacate', ['tomate', 'aguacate', 'maiz']),
      lcT('La salsa de chile habanero es muy picante.', 'chabela', ['Esa salsa tiene mucho picante.', 'Esa salsa es dulce.', 'Esa salsa no lleva chile.'], 0),
      read('Hago tortillas todos los días con maíz. Primero preparo la masa y después hago las tortillas en el comal. Comemos las tortillas con frijoles y salsa. Los mayas y los aztecas también comen maíz desde hace miles de años. ¡Es la base de la cocina mexicana!', 'chabela',
        'Je fais des tortillas tous les jours avec du maïs. D’abord je prépare la pâte (« la masa ») et ensuite je fais les tortillas sur le « comal » (la plaque de cuisson). Nous mangeons les tortillas avec des haricots et de la sauce. Les Mayas et les Aztèques mangent aussi du maïs depuis des milliers d’années. C’est la base de la cuisine mexicaine !', [
          ['¿Con qué hace Chabela las tortillas?', 'Avec quoi Chabela fait-elle les tortillas ?', ['Con maíz.', 'Con chocolate.', 'Con tomate.'], 0],
          ['¿Qué comen con las tortillas?', 'Que mangent-ils avec les tortillas ?', ['Frijoles y salsa.', 'Pan y jamón.', 'Helado.'], 0],
          ['¿Desde cuándo comen maíz en México?', 'Depuis quand mange-t-on du maïs au Mexique ?', ['Desde hace miles de años.', 'Desde ayer.', 'Desde 1950.'], 0],
        ]),
      read('El cacao es una planta de América. Los mayas y los aztecas beben chocolate, pero su chocolate no es dulce: lleva chile y es un poco amargo. Para los aztecas, los granos de cacao también son dinero.', 'chabela',
        'Le cacao est une plante d’Amérique. Les Mayas et les Aztèques boivent du chocolat, mais leur chocolat n’est pas sucré : il contient du piment et il est un peu amer. Pour les Aztèques, les graines de cacao sont aussi de l’argent.', [
          ['¿El chocolate de los mayas es dulce?', 'Le chocolat des Mayas est-il sucré ?', ['No.', 'Sí, mucho.', 'Solo en Navidad.'], 0],
          ['¿Qué lleva el chocolate antiguo?', 'Que contient le chocolat ancien ?', ['Chile.', 'Queso.', 'Aguacate.'], 0],
          ['¿Qué más son los granos de cacao para los aztecas?', 'Que sont aussi les graines de cacao pour les Aztèques ?', ['Dinero.', 'Zapatos.', 'Un animal.'], 0],
        ]),
      fill('Hago tortillas con ___.', 'maíz', 'chabela', { opts: ['maíz', 'chocolate', 'tomate'], tr: 'Je fais des tortillas avec du maïs.' }),
      fill('El chocolate de los mayas no es ___.', 'dulce', 'chabela', { opts: ['dulce', 'picante', 'rojo'], tr: 'Le chocolat des Mayas n’est pas sucré.' }),
      dlg('chabela', '¿Quieres probar una salsa? Es un poco picante.', 'Tu veux goûter une sauce ? Elle est un peu piquante.', [
        ['Sí, gracias. Me gusta el picante.', 1, '¡Qué bueno! Aquí tienes. Con tortilla está más rica.', 'Super ! Tiens. Avec de la tortilla, elle est encore meilleure. (« rica » = délicieuse)', 'Oui, merci. J’aime le piquant.'],
        ['Sí, gracias. Soy muy picante.', 0, '¿Tú eres picante? ¡Ja, ja! Querrás decir: «me gusta el picante».', 'Toi, tu es piquant ? Ha, ha ! Tu veux dire : « me gusta el picante » (j’aime le piquant).', 'Oui, merci. Je suis très piquant.'],
        ['No, gracias, yo soy una tortilla.', 0, '¿Una tortilla? ¡Entonces te como yo!', 'Une tortilla ? Alors c’est moi qui te mange !', 'Non, merci, je suis une tortilla.'],
      ]),
      speak('Mi comida favorita es la pizza.', 'viajero', { libre: 'la pizza', es: 'Escucha y di cuál es TU comida favorita.', fr: 'Écoute et dis quel est TON plat préféré (los espaguetis, el pollo, las crepes…).', tr: 'Mon plat préféré est la pizza. (dis le tien)', hechizo: ['Hechizo de la cocina', 'Tu plato favorito aparece humeante sobre la mesa'] }),
      writeFree('Mi comida favorita es ___. Me gusta ___. No me gusta ___.', [
        { id: 'favorita', pista: 'Ton plat préféré, avec l’article (la pizza, el pollo…)', tipo: 'texto' },
        { id: 'gusta', pista: 'Ce que tu aimes (el chocolate, el aguacate, los tacos…)', tipo: 'texto' },
        { id: 'nogusta', pista: 'Ce que tu n’aimes pas (el picante, el tomate…)', tipo: 'texto' },
      ], 'Mi comida favorita es la pizza. Me gusta el chocolate. No me gusta el picante.', 'Mon plat préféré est la pizza. J’aime le chocolat. Je n’aime pas le piquant.', 'viajero', C('Escribe qué te gusta comer.', 'Écris ce que tu aimes manger.')),
      dict('La cochinita pibil es deliciosa.', 'chabela'),
    ]));

  // 5 — Forja : repaso del presente
  quests.push(quest('u09', 5, 'forja', 'La Forja: el presente', '⚒️',
    ['quetzal', 'Hablo. Como. Vivo. ¡Forja el presente conmigo!', 'Je parle. Je mange. J’habite. Forge le présent avec moi !'],
    'Révision du présent (-ar, -er, -ir) et trois verbes irréguliers seulement à « yo » : hago, veo, conozco.', ['escribir', 'leer'], 15, [
      flash('visitar', PROBAR, NADAR, VER, 'hacer', 'conocer'),
      gram('g_repaso_presente'),
      conj('visitar', 'yo', 'visit', 'o', ['o', 'as', 'a'], 'viajero', { tr: 'Moi, je visite…' }),
      conj('comer', 'nosotros', 'com', 'emos', ['emos', 'amos', 'imos'], 'chabela', { tr: 'Nous, nous mangeons…' }),
      conj('vivir', 'ellos', 'viv', 'en', ['en', 'an', 'es'], 'itzel', { tr: 'Eux, ils habitent…' }),
      conj('preparar', 'ella', 'prepar', 'a', ['o', 'a', 'amos'], 'chabela', { tr: 'Elle prépare…' }),
      fill('Tú ___ en el cenote.', 'nadas', 'itzel', { opts: ['nado', 'nadas', 'nada'], tr: 'Toi, tu nages dans le cénote.' }),
      gram('g_yo_irregular'),
      conj('hacer', 'yo', 'hag', 'o', ['o', 'go', 'zo'], 'chabela', { tr: 'Moi, je fais…' }),
      conj('ver', 'yo', 've', 'o', ['o', 'a', 'e'], 'itzel', { tr: 'Moi, je vois…' }),
      conj('conocer', 'yo', 'cono', 'zco', ['zco', 'co', 'zo'], 'itzel', { tr: 'Moi, je connais…' }),
      fill('Yo ___ tortillas con mi abuela.', 'hago', 'chabela', { opts: ['hago', 'hace', 'hacer'], tr: 'Je fais des tortillas avec ma grand-mère.' }),
      fill('¿Tú ___ la ciudad de Mérida?', 'conoces', 'itzel', { opts: ['conozco', 'conoces', 'conoce'], tr: 'Tu connais la ville de Mérida ?' }),
      reord('Veo un flamenco rosa en el mar.', 'itzel', { tr: 'Je vois un flamant rose dans la mer.' }),
      dict('Mis primos viven en Mérida.', 'itzel'),
    ]));

  // 6 — Pasado compuesto (découverte)
  quests.push(quest('u09', 6, 'lectura', '¿Has probado…?', '🧩',
    ['itzel', '¿Has visto un jaguar? ¿Has probado la cochinita pibil? ¡Cuéntame!', 'Tu as déjà vu un jaguar ? Tu as déjà goûté la cochinita pibil ? Raconte-moi !'],
    'Première découverte du passé composé (he visitado, has probado, ha nadado) : tu reconnais la forme, tu lis un petit récit et tu dis ce que TOI tu as fait. Aucune exigence de maîtrise.', ['leer', 'hablar', 'escribir'], 15, [
      flash('haber'),
      gram('g_pasado_compuesto'),
      fill('Hoy ___ visitado la pirámide.', 'he', 'viajero', { opts: ['he', 'has', 'ha'], tr: 'Aujourd’hui, j’ai visité la pyramide.' }),
      fill('Itzel ___ nadado en el cenote.', 'ha', 'marina', { opts: ['he', 'has', 'ha'], tr: 'Itzel a nagé dans le cénote.' }),
      fill('¿Has ___ la cochinita pibil?', 'probado', 'itzel', { opts: ['probado', 'probar', 'pruebo'], tr: 'As-tu goûté la cochinita pibil ?' }),
      fill('Hemos ___ muchos tacos.', 'comido', 'chabela', { opts: ['comido', 'comado', 'comer'], tr: 'Nous avons mangé beaucoup de tacos.' }),
      lcT('Hoy he visto un jaguar en la selva.', 'itzel', ['Itzel ha visto un animal grande.', 'Itzel ha comido un taco.', 'Itzel ha nadado en el mar.'], 0),
      read('Hoy hemos visitado Chichén Itzá. Hemos visto la pirámide y hemos nadado en un cenote. Álex ha probado un taco muy picante. ¡Ha bebido mucha agua después!', 'itzel',
        'Aujourd’hui, nous avons visité Chichén Itzá. Nous avons vu la pyramide et nous avons nagé dans un cénote. Álex a goûté un taco très piquant. Il a bu beaucoup d’eau ensuite ! (« bebido » vient de « beber » ; ce sont des phrases à comprendre, pas à produire. Itzel parle ici comme en Espagne pour t’aider : au Mexique, on dirait plutôt « hoy visitamos », un autre passé que tu apprendras plus tard.)', [
          ['¿Qué han visitado hoy?', 'Qu’ont-ils visité aujourd’hui ?', ['Chichén Itzá.', 'Madrid.', 'Una biblioteca.'], 0],
          ['¿Dónde han nadado?', 'Où ont-ils nagé ?', ['En un cenote.', 'En una piscina.', 'En el río de Bogotá.'], 0],
          ['¿Qué ha probado Álex?', 'Qu’a goûté Álex ?', ['Un taco picante.', 'Un chocolate dulce.', 'Un jaguar.'], 0],
        ]),
      tf('Para «comer», el participio es «comido».', true, N, { tr: 'Pour « comer », le participe est « comido » (j’ai mangé = he comido).' }),
      tf('Para «hablar», el participio es «hablido».', false, N, { tr: 'Pour « hablar », le participe est « hablado » (les verbes en -ar font -ado).' }),
      reord('Hemos visitado Chichén Itzá.', 'itzel', { tr: 'Nous avons visité Chichén Itzá.' }),
      dlg('itzel', '¿Has probado la cochinita pibil?', 'Tu as déjà goûté la cochinita pibil ?', [
        ['Sí, he probado la cochinita pibil. ¡Es deliciosa!', 1, '¡Qué bueno! Es el plato más típico de Yucatán.', 'Super ! C’est le plat le plus typique du Yucatán.', 'Oui, j’ai goûté la cochinita pibil. Elle est délicieuse !'],
        ['Sí, he probar la cochinita pibil.', 0, 'Casi… Se dice «he probado»: haber + participio.', 'Presque… On dit « he probado » : haber + participe.', 'Oui, j’ai goûter la cochinita pibil.'],
        ['Sí, he sido una cochinita.', 0, '¿Tú, una cochinita? ¡Qué divertido!', 'Toi, une cochinita ? Comme c’est drôle !', 'Oui, j’ai été une cochinita.'],
      ]),
      speak('He probado los tacos.', 'viajero', { libre: 'los tacos', es: 'Escucha y di qué has probado TÚ.', fr: 'Écoute et dis ce que TU as déjà goûté (los espaguetis, la paella, el chocolate…). Tu peux dire une vérité ou t’amuser.', tr: 'J’ai goûté les tacos. (dis ce que tu as goûté)', hechizo: ['Hechizo del sabor', 'Un perfume de especias llena el aire'] }),
      writeFree('He visitado ___. He probado ___. He visto ___.', [
        { id: 'lugar', pista: 'Un endroit que tu as visité (París, Madrid, un museo…)', tipo: 'texto' },
        { id: 'comida', pista: 'Un plat que tu as goûté (la paella, los tacos, el chocolate…)', tipo: 'texto' },
        { id: 'cosa', pista: 'Quelque chose que tu as vu (un delfín, un volcán, un castillo…, avec l’article)', tipo: 'texto' },
      ], 'He visitado Madrid. He probado los tacos. He visto un delfín.', 'J’ai visité Madrid. J’ai goûté les tacos. J’ai vu un dauphin.', 'viajero', C('Escribe qué has hecho en tu vida.', 'Écris ce que tu as déjà fait dans ta vie.')),
    ]));

  // 7 — Cultura
  quests.push(quest('u09', 7, 'cultura', 'Chichén Itzá y los cenotes', '🔺',
    ['chan', 'Esta es la pirámide de Kukulcán, la serpiente con plumas. ¡Como el Quetzal!', 'Voici la pyramide de Kukulcán, le serpent à plumes. Comme le Quetzal !'],
    'Chichén Itzá (patrimoine mondial), Kukulcán, les cénotes, les Mayas d’aujourd’hui ; puis tu décris un lieu de TON pays avec es, está et hay.', ['cultura', 'leer', 'escribir', 'hablar'], 15, [
      capsula,
      tf('Kukulcán es una serpiente con plumas.', true, N, { tr: 'Kukulcán est un serpent à plumes.' }),
      tf('Los cenotes están en Argentina.', false, N, { tr: 'Les cénotes sont en Argentine. (Faux : ils sont au Yucatán, au Mexique.)' }),
      tf('Hoy ya no hay mayas en México.', false, N, { tr: 'Aujourd’hui, il n’y a plus de Mayas au Mexique. (Faux : des millions de Mayas vivent au Mexique et au Guatemala, et beaucoup parlent encore le maya.)' }),
      gram('g_describir_lugar'),
      read('Chichén Itzá es una antigua ciudad maya en Yucatán. Su pirámide más famosa se llama El Castillo o pirámide de Kukulcán. Kukulcán es una serpiente con plumas, como el Quetzal. En primavera y en otoño, el sol y la sombra dibujan una serpiente en la escalera de la pirámide.', 'chan',
        'Chichén Itzá est une ancienne ville maya au Yucatán. Sa pyramide la plus célèbre s’appelle El Castillo ou pyramide de Kukulcán. Kukulcán est un serpent à plumes, comme le Quetzal. Au printemps et en automne, le soleil et l’ombre dessinent un serpent sur l’escalier de la pyramide. (Chichén Itzá est inscrite au patrimoine mondial de l’UNESCO depuis 1988 ; son nom vient du maya : « à la bouche du puits des Itzá ».)', [
          ['¿Dónde está Chichén Itzá?', 'Où est Chichén Itzá ?', ['En Yucatán.', 'En Perú.', 'En Colombia.'], 0],
          ['¿Quién es Kukulcán?', 'Qui est Kukulcán ?', ['Una serpiente con plumas.', 'Un jaguar enorme.', 'Un guía de museo.'], 0],
          ['¿Cuándo aparece la serpiente de sombra?', 'Quand apparaît le serpent d’ombre ?', ['En primavera y en otoño.', 'Solo en Navidad.', 'Todos los lunes.'], 0],
        ]),
      read('Un cenote es un pozo natural. En Yucatán hay miles. El agua es muy limpia y fresca. Para los mayas, los cenotes son lugares sagrados: allí viven los dioses del agua y de la lluvia. Hoy muchos turistas nadan en ellos, pero tienen que cuidar el agua.', 'itzel',
        'Un cénote est un puits naturel. Au Yucatán, il y en a des milliers. L’eau est très propre et fraîche. Pour les Mayas, les cénotes sont des lieux sacrés : les dieux de l’eau et de la pluie y vivent. Aujourd’hui, de nombreux touristes y nagent, mais ils doivent protéger l’eau.', [
          ['¿Cómo es el agua de un cenote?', 'Comment est l’eau d’un cénote ?', ['Limpia y fresca.', 'Caliente y sucia.', 'Dulce y roja.'], 0],
          ['¿Quién vive allí, para los mayas?', 'Qui y vit, pour les Mayas ?', ['Los dioses del agua y de la lluvia.', 'Los aztecas.', 'Los jaguares blancos.'], 0],
        ]),
      lcT('Muchos mayas de hoy hablan maya y español.', 'chan', ['Hoy en México hay personas que hablan dos lenguas.', 'Los mayas ya no existen.', 'Todos hablan solo maya.'], 0),
      dlg('chan', 'En Yucatán hace mucho calor. ¿Cómo es tu región?', 'Au Yucatán, il fait très chaud. Comment est ta région ?', [
        ['Mi región es tranquila y verde.', 1, '¡Qué bonito! Me gustaría visitarla.', 'Que c’est beau ! J’aimerais la visiter.', 'Ma région est calme et verte.'],
        ['Mi región está verde y grande.', 0, 'Para decir cómo es, usamos «es»: mi región es verde y grande.', 'Pour dire comment elle est, on utilise « es » : mi región es verde y grande (ce sont des caractéristiques).', 'Ma région est (estar) verte et grande.'],
        ['Mi región hay montañas.', 0, 'Con «hay» no decimos «mi región hay». ¡Otra vez!', 'Avec « hay », on ne dit pas « mi región hay ». Encore une fois !', 'Ma région il y a des montagnes.'],
      ]),
      fill('En Yucatán ___ miles de cenotes.', 'hay', 'itzel', { opts: ['hay', 'es', 'está'], tr: 'Au Yucatán, il y a des milliers de cénotes.' }),
      fill('Chichén Itzá ___ en el sureste de México.', 'está', 'chan', { opts: ['es', 'está', 'hay'], tr: 'Chichén Itzá est dans le sud-est du Mexique.' }),
      writeFree('Mi ciudad es ___. Está en ___. Hay ___.', [
        { id: 'como', pista: 'Comment est ta ville ? (grande, bonita, tranquila, antigua…, au féminin)', tipo: 'texto' },
        { id: 'donde', pista: 'Où est-elle ? (el norte de Francia, el centro del país…)', tipo: 'texto' },
        { id: 'hay', pista: 'Ce qu’il y a (un río, muchos parques, un museo…)', tipo: 'texto' },
      ], 'Mi ciudad es grande y bonita. Está en el centro de Francia. Hay un río y muchos parques.', 'Ma ville est grande et jolie. Elle est au centre de la France. Il y a une rivière et beaucoup de parcs.', 'viajero', C('Describe tu ciudad.', 'Décris ta ville.')),
      speak('Mi ciudad es muy grande.', 'viajero', { libre: 'muy grande', es: 'Escucha y di cómo es TU ciudad.', fr: 'Écoute et dis comment est TA ville (muy bonita, pequeña, tranquila…). Attention : « ciudad » est féminin.', tr: 'Ma ville est très grande. (dis comment est la tienne)', hechizo: ['Hechizo del lugar', 'Tu ciudad aparece en un cenote de luz'] }),
    ]));

  // 8 — Desafío
  quests.push(quest('u09', 8, 'desafio', 'El silencio de las piedras', '🗿',
    ['sombra', 'Sin historia, nadie habla. Yo guardo las piedras mudas.', 'Sans histoire, personne ne parle. Je garde les pierres muettes.'],
    'Boss du Yucatán : révision mixte des unités 1 à 9 (présentation, description, maison, présent, nature, gastronomie, premier passé composé) pour rendre la parole aux pierres.', ['escuchar', 'hablar', 'leer', 'escribir'], 15, [
      dlg('sombra', '¿Cómo te llamas? ¿Cómo eres?', 'Comment tu t’appelles ? Comment es-tu ?', [
        ['Me llamo Álex. Tengo el pelo corto y soy simpático.', 1, '¡Grr! Ya conozco tu cara…', 'Grr ! Je connais déjà ton visage…', 'Je m’appelle Álex. J’ai les cheveux courts et je suis sympathique.'],
        ['Soy el pelo y tengo simpático.', 0, 'Eso no tiene sentido. ¡Otra vez!', 'Ça n’a aucun sens. Encore une fois !', 'Je suis les cheveux et j’ai sympathique.'],
        ['Adiós.', 0, 'No te vas sin responder.', 'Tu ne pars pas sans répondre.', 'Au revoir.'],
      ]),
      dlg('sombra', '¿Qué comes en México?', 'Que manges-tu au Mexique ?', [
        ['Como tacos y tortillas de maíz.', 1, '¡Aaah! Un sabor más que vuelve…', 'Aaah ! Encore une saveur qui revient…', 'Je mange des tacos et des tortillas de maïs.'],
        ['Como piedras y pirámides.', 0, 'Mmm… ¿tienes tanta hambre?', 'Mmm… tu as si faim que ça ?', 'Je mange des pierres et des pyramides.'],
        ['Como el cenote.', 0, 'Eso no se come. ¡Otra vez!', 'Ça ne se mange pas. Encore une fois !', 'Je mange le cénote.'],
      ]),
      lcV('cenote', ['selva', 'cenote', 'playa']),
      lcT('Los mayas y los aztecas beben chocolate con chile.', 'sombra', ['El chocolate antiguo de México es picante.', 'El chocolate antiguo de México es muy dulce.', 'El chocolate antiguo de México es azul.'], 0),
      match(['maiz', 'tortilla_mx', 'cacao', CHOC, 'aguacate', 'chile']),
      fill('Chichén Itzá ___ en Yucatán.', 'está', 'itzel', { opts: ['es', 'está', 'hay'], tr: 'Chichén Itzá est au Yucatán.' }),
      fill('Mis primos ___ en México.', 'viven', 'marina', { opts: ['viven', 'vive', 'vivo'], tr: 'Mes cousins habitent au Mexique.' }),
      fill('Itzel ___ maya y español.', 'habla', 'itzel', { opts: ['habla', 'hablo', 'hablan'], tr: 'Itzel parle maya et espagnol.' }),
      conj('conocer', 'yo', 'cono', 'zco', ['zco', 'co', 'zo'], 'itzel', { tr: 'Moi, je connais…' }),
      fill('Álex ___ probado un taco picante.', 'ha', 'marina', { opts: ['he', 'has', 'ha'], tr: 'Álex a goûté un taco piquant.' }),
      reord('Los mayas construyen pirámides de piedra.', 'chan', { tr: 'Les Mayas construisent des pyramides en pierre.' }),
      lcT('Mi cumpleaños es el veintiuno de marzo.', 'itzel', ['21 de marzo', '12 de marzo', '21 de mayo'], 0),
      read('Hola, soy Itzel. Tengo doce años y vivo cerca de Chichén Itzá. Mi casa es pequeña, con un patio y muchas flores. Mi abuela hace tortillas todos los días. Hoy estoy muy contenta: he conocido a dos viajeros.', 'itzel',
        'Salut, c’est Itzel. J’ai douze ans et j’habite près de Chichén Itzá. Ma maison est petite, avec un patio et beaucoup de fleurs. Ma grand-mère fait des tortillas tous les jours. Aujourd’hui, je suis très contente : j’ai fait la connaissance de deux voyageurs.', [
          ['¿Dónde vive Itzel?', 'Où habite Itzel ?', ['Cerca de Chichén Itzá.', 'En Bogotá.', 'En Madrid.'], 0],
          ['¿Cómo es su casa?', 'Comment est sa maison ?', ['Pequeña, con un patio.', 'Muy alta, sin patio.', 'Grande, con piscina.'], 0],
          ['¿Por qué está contenta hoy?', 'Pourquoi est-elle contente aujourd’hui ?', ['Ha conocido a dos viajeros.', 'Ha ganado un premio.', 'Tiene un jaguar.'], 0],
        ]),
      speak('Hola, me llamo Álex. Vivo en París y hoy estoy en México.', 'viajero', { nombre: 'Álex', tr: 'Salut, je m’appelle Álex. J’habite à Paris et aujourd’hui je suis au Mexique. (dis ton prénom)', hechizo: ['Hechizo final', '¡Las piedras de la pirámide recuperan sus dibujos!'] }),
      pluma,
    ], { jefe: { personaje: 'sombra', vidas: 10 } }));

  return {
    id: 'u09', numero: 9, titulo: '¡Viva México!', lugar: 'Yucatán', emoji: '🌴', ejes: [6], periodo: 'mars-avr',
    objetivos: [
      { es: 'Hablar de la naturaleza de México: selva, cenotes, animales.', fr: 'Parler de la nature du Mexique : forêt tropicale, cénotes, animaux.' },
      { es: 'Conocer el patrimonio maya y azteca: Chichén Itzá, Tenochtitlan, el calendario.', fr: 'Connaître le patrimoine maya et aztèque : Chichén Itzá, Tenochtitlan, le calendrier.' },
      { es: 'Conocer la gastronomía mexicana: maíz, tortilla, cacao, chile.', fr: 'Connaître la gastronomie mexicaine : maïs, tortilla, cacao, piment.' },
      { es: 'Repasar el presente de los verbos regulares y de hago, veo, conozco.', fr: 'Réviser le présent des verbes réguliers et de hago, veo, conozco.' },
      { es: 'Descubrir el pasado compuesto: he visitado, has probado, ha nadado.', fr: 'Découvrir le passé composé : he visitado, has probado, ha nadado.' },
      { es: 'Describir un lugar con «es», «está» y «hay».', fr: 'Décrire un lieu avec « es », « está » et « hay ».' },
    ],
    vocab, gramatica, quests,
    pluma: { numero: 9, nombre: 'Pluma de la Memoria', descripcion: L('quetzal', 'Nueve plumas. Las piedras hablan… ¡y yo recuerdo mi casa!', 'Neuf plumes. Les pierres parlent… et je me souviens de ma maison !') },
  };
}
