// Unidad 8 — Mi casa y mi barrio (Bogotá · La Candelaria · Monserrate)
// Axe 2 (le quotidien : lieux) ; villes hispaniques. PNJ colombiens : Camila, Don Hernán, Doña Marta (es-CO).
// Espagnol d'Espagne pour Álex/Marina/le narrateur ; espagnol de Colombie pour les PNJ (« ustedes », « usted », mots qui diffèrent signalés en français).
import { W as W0, reg, G, quest, flash, match, lcV, lcI, lcT, dict, fill, reord, conj, dlg, read, speak, tf, gram, writeFree, cine, P, L, C, NARR } from './lib.mjs';

export default function build() {
  const N = NARR;
  const ilu = (s) => ({ ilustracion: s });
  // Un mot déjà défini par une unité précédente (même id) est simplement réutilisé, jamais redéclaré.
  const W = (id, ...a) => (reg.has(id) ? null : W0(id, ...a));

  // ───────────── Vocabulario (55) ─────────────
  const vocab = [
    // la casa
    W('apartamento', 'apartamento', 'appartement (en Espagne on dit plutôt « piso »)', '🏢', 'casa', 'Camila vive en un apartamento.', 'Camila habite dans un appartement.', { genero: 'm', plural: 'apartamentos' }),
    W('piso', 'piso', 'étage ; en Espagne, aussi « appartement »', null, 'casa', 'Mi dormitorio está en el segundo piso.', 'Ma chambre est au deuxième étage.', { genero: 'm', plural: 'pisos', ...ilu('Un immeuble coupé en tranches qui montre trois étages empilés') }),
    W('ventana', 'ventana', 'fenêtre', '🪟', 'casa', 'La ventana está abierta.', 'La fenêtre est ouverte.', { genero: 'f', plural: 'ventanas' }),
    W('puerta', 'puerta', 'porte', '🚪', 'casa', 'La puerta de mi casa es azul.', 'La porte de ma maison est bleue.', { genero: 'f', plural: 'puertas' }),
    W('balcon', 'balcón', 'balcon', null, 'casa', 'Hay flores en el balcón.', 'Il y a des fleurs sur le balcon.', { genero: 'm', plural: 'balcones', ...ilu('Un balcon en fer forgé avec des pots de fleurs sur une façade colorée') }),
    W('escalera', 'escalera', 'escalier (souvent « las escaleras » au pluriel)', null, 'casa', 'Subo por la escalera.', 'Je monte par l’escalier.', { genero: 'f', plural: 'escaleras', ...ilu('Un escalier en bois qui monte vers l’étage') }),
    W('pared', 'pared', 'mur (d’une pièce)', '🧱', 'casa', 'Hay un cuadro en la pared.', 'Il y a un tableau sur le mur.', { genero: 'f', plural: 'paredes' }),
    W('cama', 'cama', 'lit', '🛏️', 'casa', 'Mi cama es muy grande.', 'Mon lit est très grand.', { genero: 'f', plural: 'camas' }),
    W('sofa', 'sofá', 'canapé', '🛋️', 'casa', 'El sofá del salón es verde.', 'Le canapé du salon est vert.', { genero: 'm', plural: 'sofás' }),
    W('armario', 'armario', 'armoire, placard', null, 'casa', 'Mi ropa está en el armario.', 'Mes vêtements sont dans l’armoire.', { genero: 'm', plural: 'armarios', ...ilu('Une grande armoire en bois ouverte avec des vêtements pliés') }),
    W('lampara', 'lámpara', 'lampe', '💡', 'casa', 'La lámpara está encendida.', 'La lampe est allumée.', { genero: 'f', plural: 'lámparas' }),
    W('nevera', 'nevera', 'réfrigérateur (au Mexique : « refrigerador »)', null, 'casa', 'La leche está en la nevera.', 'Le lait est dans le réfrigérateur.', { genero: 'f', plural: 'neveras', ...ilu('Un réfrigérateur blanc ouvert, avec du lait et des fruits à l’intérieur'), voz: 'marta', exVoz: 'marta' }),
    W('alfombra', 'alfombra', 'tapis', null, 'casa', 'El gato duerme en la alfombra.', 'Le chat dort sur le tapis.', { genero: 'f', plural: 'alfombras', ...ilu('Un tapis rond coloré posé sur un parquet') }),
    // la ciudad
    W('barrio', 'barrio', 'quartier', '🏘️', 'ciudad', 'Mi barrio es muy tranquilo.', 'Mon quartier est très calme.', { genero: 'm', plural: 'barrios', voz: 'camila', exVoz: 'camila' }),
    W('ciudad', 'ciudad', 'ville', '🏙️', 'ciudad', 'Bogotá es una ciudad muy grande.', 'Bogotá est une très grande ville.', { genero: 'f', plural: 'ciudades' }),
    W('calle', 'calle', 'rue', null, 'ciudad', 'Mi casa está en esta calle.', 'Ma maison est dans cette rue.', { genero: 'f', plural: 'calles', ...ilu('Une rue étroite aux pavés, bordée de maisons colorées') }),
    W('plaza', 'plaza', 'place (d’une ville)', null, 'ciudad', 'La plaza tiene una fuente.', 'La place a une fontaine.', { genero: 'f', plural: 'plazas', ...ilu('Une grande place pavée avec une fontaine et des pigeons') }),
    W('parque', 'parque', 'parc', '🏞️', 'ciudad', 'Hay un parque cerca de mi casa.', 'Il y a un parc près de chez moi.', { genero: 'm', plural: 'parques' }),
    W('iglesia', 'iglesia', 'église', '⛪', 'ciudad', 'La iglesia es muy antigua.', 'L’église est très ancienne.', { genero: 'f', plural: 'iglesias' }),
    W('biblioteca', 'biblioteca', 'bibliothèque', '📚', 'ciudad', 'Leo libros en la biblioteca.', 'Je lis des livres à la bibliothèque.', { genero: 'f', plural: 'bibliotecas' }),
    W('tienda', 'tienda', 'magasin, boutique', '🏪', 'ciudad', 'La tienda abre a las nueve.', 'Le magasin ouvre à neuf heures.', { genero: 'f', plural: 'tiendas' }),
    W('mercado', 'mercado', 'marché', null, 'ciudad', 'En el mercado hay frutas de colores.', 'Au marché, il y a des fruits colorés.', { genero: 'm', plural: 'mercados', ...ilu('Un marché animé avec des étals de fruits et de légumes colorés') }),
    W('farmacia', 'farmacia', 'pharmacie', '💊', 'ciudad', 'La farmacia está en la esquina.', 'La pharmacie est au coin de la rue.', { genero: 'f', plural: 'farmacias' }),
    W('panaderia', 'panadería', 'boulangerie', '🥖', 'ciudad', 'En la panadería hay pan caliente.', 'À la boulangerie, il y a du pain chaud.', { genero: 'f', plural: 'panaderías' }),
    W('cine', 'cine', 'cinéma', '🎬', 'ciudad', 'El cine está al lado del parque.', 'Le cinéma est à côté du parc.', { genero: 'm', plural: 'cines' }),
    W('estacion', 'estación', 'gare, station', '🚉', 'ciudad', 'La estación de autobuses es grande.', 'La gare routière est grande.', { genero: 'f', plural: 'estaciones' }),
    W('edificio', 'edificio', 'immeuble, bâtiment', '🏢', 'ciudad', 'Vivo en un edificio alto.', 'J’habite dans un immeuble élevé.', { genero: 'm', plural: 'edificios' }),
    W('autobus', 'autobús', 'bus, autocar (en Colombie, « bus » ; au Mexique, « camión »)', '🚌', 'ciudad', 'El autobús rojo pasa por mi calle.', 'Le bus rouge passe dans ma rue.', { genero: 'm', plural: 'autobuses' }),
    W('bicicleta', 'bicicleta', 'vélo (familier : « bici »)', '🚲', 'ciudad', 'Los domingos voy en bicicleta.', 'Le dimanche, je vais à vélo.', { genero: 'f', plural: 'bicicletas' }),
    W('teleferico', 'teleférico', 'télécabine, téléphérique', '🚡', 'ciudad', 'El teleférico sube a Monserrate.', 'Le téléphérique monte à Monserrate.', { genero: 'm', plural: 'teleféricos', voz: 'hernan', exVoz: 'hernan' }),
    W('montana', 'montaña', 'montagne', '⛰️', 'ciudad', 'Bogotá está entre montañas.', 'Bogotá est entre des montagnes.', { genero: 'f', plural: 'montañas' }),
    W('esquina', 'esquina', 'coin de rue', null, 'ciudad', 'Hay una tienda en la esquina.', 'Il y a un magasin au coin de la rue.', { genero: 'f', plural: 'esquinas', ...ilu('Le coin d’une rue avec un lampadaire et deux façades de maisons') }),
    // dónde está
    W('hay', 'hay', 'il y a (invariable : hay un parque, hay dos tiendas)', '👆', 'lugar', 'En mi barrio hay un parque.', 'Dans mon quartier, il y a un parc.'),
    W('cerca', 'cerca', 'près (on dit « cerca de »)', null, 'lugar', 'Mi colegio está cerca de mi casa.', 'Mon collège est près de chez moi.', { ...ilu('Deux maisons très proches, un petit repère « près » avec une flèche courte') }),
    W('lejos', 'lejos', 'loin (on dit « lejos de »)', null, 'lugar', 'El museo está lejos del parque.', 'Le musée est loin du parc.', { ...ilu('Deux maisons très éloignées avec une longue flèche entre elles') }),
    W('al_lado', 'al lado de', 'à côté de', null, 'lugar', 'La farmacia está al lado de la panadería.', 'La pharmacie est à côté de la boulangerie.', { ...ilu('Deux maisons côte à côte, un petit repère entre elles') }),
    W('delante', 'delante de', 'devant', null, 'lugar', 'El perro está delante de la casa.', 'Le chien est devant la maison.', { ...ilu('Un chien devant une maison vue de côté') }),
    W('detras', 'detrás de', 'derrière', null, 'lugar', 'El jardín está detrás de la casa.', 'Le jardin est derrière la maison.', { ...ilu('Un chat caché derrière une maison, on voit juste sa queue') }),
    W('encima', 'encima de', 'sur, au-dessus de', null, 'lugar', 'El gato está encima de la cama.', 'Le chat est sur le lit.', { ...ilu('Un chat assis sur une boîte en carton') }),
    W('debajo', 'debajo de', 'sous, en dessous de', null, 'lugar', 'La mochila está debajo de la mesa.', 'Le sac à dos est sous la table.', { ...ilu('Un chat sous une table en bois') }),
    W('entre', 'entre', 'entre', null, 'lugar', 'La panadería está entre la farmacia y la iglesia.', 'La boulangerie est entre la pharmacie et l’église.', { ...ilu('Une maison au milieu de deux autres maisons') }),
    W('enfrente', 'enfrente de', 'en face de', null, 'lugar', 'El parque está enfrente de mi casa.', 'Le parc est en face de chez moi.', { ...ilu('Deux maisons face à face de chaque côté d’une rue') }),
    W('derecha', 'a la derecha de', 'à droite de', null, 'lugar', 'El banco está a la derecha de la iglesia.', 'La banque est à droite de l’église.', { ...ilu('Une flèche rouge qui pointe vers la droite') }),
    W('izquierda', 'a la izquierda de', 'à gauche de', null, 'lugar', 'La tienda está a la izquierda de la iglesia.', 'Le magasin est à gauche de l’église.', { ...ilu('Une flèche bleue qui pointe vers la gauche') }),
    W('subir', 'subir', 'monter', '⬆️', 'verbos', 'Vamos a subir a Monserrate.', 'Nous allons monter à Monserrate.', { voz: 'hernan', exVoz: 'hernan' }),
    // comparar
    W('mas', 'más', 'plus (más… que = plus… que)', '➕', 'comparar', 'Bogotá es más grande que Salamanca.', 'Bogotá est plus grande que Salamanque.'),
    W('menos', 'menos', 'moins (menos… que = moins… que)', '➖', 'comparar', 'Mi calle es menos ruidosa que la plaza.', 'Ma rue est moins bruyante que la place.'),
    W('antiguo', 'antiguo', 'ancien, vieux (bâtiment, quartier)', null, 'comparar', 'La Candelaria es un barrio antiguo.', 'La Candelaria est un quartier ancien.', { adj: true, genero: 'm', femenino: 'antigua', ...ilu('Un vieux bâtiment colonial blanc avec un toit de tuiles') }),
    W('moderno', 'moderno', 'moderne', '🏙️', 'comparar', 'El centro tiene edificios modernos.', 'Le centre a des immeubles modernes.', { adj: true, genero: 'm', femenino: 'moderna' }),
    W('bonito', 'bonito', 'joli', '🌷', 'comparar', 'Esta calle es muy bonita.', 'Cette rue est très jolie.', { adj: true, genero: 'm', femenino: 'bonita' }),
    W('tranquilo', 'tranquilo', 'calme, tranquille', '😌', 'comparar', 'Mi barrio es muy tranquilo.', 'Mon quartier est très calme.', { adj: true, genero: 'm', femenino: 'tranquila' }),
    W('ruidoso', 'ruidoso', 'bruyant', '📢', 'comparar', 'El mercado es muy ruidoso.', 'Le marché est très bruyant.', { adj: true, genero: 'm', femenino: 'ruidosa' }),
    W('caro', 'caro', 'cher', '💸', 'comparar', 'Esta casa es muy cara.', 'Cette maison est très chère.', { adj: true, genero: 'm', femenino: 'cara' }),
    W('barato', 'barato', 'bon marché', '🏷️', 'comparar', 'El mercado es más barato que la tienda.', 'Le marché est moins cher que le magasin.', { adj: true, genero: 'm', femenino: 'barata' }),
    W('mejor', 'mejor', 'meilleur, mieux (pas de « más bueno » ; mejor ne change pas au féminin)', '🏅', 'comparar', 'Este chocolate es mejor que el otro.', 'Ce chocolat est meilleur que l’autre.', { adj: true, genero: 'mf', plural: 'mejores' }),
  ].filter(Boolean);

  // ───────────── Gramática ─────────────
  const gramatica = [
    G('g_estar_lugar', '¿Dónde está?', 'Estar pour dire où se trouve quelque chose', [
      ['La catedral está en la Plaza de Bolívar.', 'La cathédrale est sur la place Bolívar.', 'camila', ['está']],
      ['Las flores están en el balcón.', 'Les fleurs sont sur le balcon.', 'marta', ['están']],
      ['Yo estoy en Bogotá.', 'Moi, je suis à Bogotá.', 'viajero', ['estoy']],
      ['¿Dónde está el museo?', 'Où est le musée ?', 'marina', ['está']],
    ], 'Para decir dónde está una cosa o una persona, usamos «estar»: está (uno), están (varios).',
    'Pour dire où se trouve une chose ou une personne, on utilise « estar » : está (un seul), están (plusieurs).',
    "ESTAR sert à situer (¿Dónde está…? → Está en…). Il s'accorde avec ce qu'on situe : la catedral ESTÁ, las flores ESTÁN, yo ESTOY. Rappel : estoy, estás, está, estamos, estáis, están (accents sur estás, está, estáis, están). Attention : on ne dit pas « es en la plaza » mais « está en la plaza ». On peut aussi dire « ¿Dónde queda…? » en Colombie (queda = se trouve) ; « está » marche partout.",
    { encabezado: ['Pregunta', 'Respuesta'], filas: [['¿Dónde está el parque?', 'Está en la plaza.'], ['¿Dónde están las tiendas?', 'Están en la calle.'], ['¿Dónde estás tú?', 'Estoy en casa.']] }),
    G('g_hay_esta', 'Hay y está', 'Hay ou está : présenter ou situer', [
      ['En mi barrio hay un parque.', 'Dans mon quartier, il y a un parc.', 'camila', ['hay un parque']],
      ['El parque está cerca de mi casa.', 'Le parc est près de chez moi.', 'camila', ['está cerca']],
      ['Hay dos museos en La Candelaria.', 'Il y a deux musées à La Candelaria.', 'hernan', ['Hay dos museos']],
      ['Los museos están en el centro.', 'Les musées sont dans le centre.', 'hernan', ['están en el centro']],
    ], '«Hay» presenta algo nuevo: hay un parque, hay dos museos. «Está» o «están» sitúa algo que ya conocemos: el parque está cerca.',
    '« Hay » présente quelque chose de nouveau : hay un parque, hay dos museos. « Está / están » situe quelque chose qu’on connaît déjà : el parque está cerca.',
    "HAY = il y a. On l'utilise pour dire qu'une chose existe quelque part, avec un, una, dos, muchos, no… mais JAMAIS avec el / la / mi / le nom d'un lieu précis : on dit « hay un parque » (pas « hay el parque »). Hay ne change jamais : hay un parque, hay tres parques. Quand on parle d'une chose précise, déjà connue (el parque, mi casa, La Candelaria), on la situe avec ESTÁ / ESTÁN : « el parque está cerca ». Astuce : « ¿Qué hay en tu barrio? » → hay… ; « ¿Dónde está el parque? » → está…",
    { encabezado: ['', 'hay', 'está / están'], filas: [['article', 'un, una, dos, muchos, no…', 'el, la, los, las, mi, nom propre'], ['exemple', 'Hay una farmacia.', 'La farmacia está aquí.'], ['exemple', 'Hay tres bancos.', 'Los bancos están allí.']] }),
    G('g_preposiciones', 'Cerca, lejos, al lado…', 'Les prépositions de lieu', [
      ['El gato está encima de la cama.', 'Le chat est sur le lit.', 'marta', ['encima de']],
      ['Mi casa está al lado del parque.', 'Ma maison est à côté du parc.', 'camila', ['al lado del']],
      ['La farmacia está enfrente de la iglesia.', 'La pharmacie est en face de l’église.', 'hernan', ['enfrente de']],
      ['El banco está a la derecha de la panadería.', 'La banque est à droite de la boulangerie.', 'camila', ['a la derecha de']],
    ], 'Para situar usamos: cerca de, lejos de, al lado de, delante de, detrás de, encima de, debajo de, entre, enfrente de, a la derecha de, a la izquierda de.',
    'Pour situer, on utilise : cerca de (près de), lejos de (loin de), al lado de (à côté de), delante de (devant), detrás de (derrière), encima de (sur), debajo de (sous), entre (entre), enfrente de (en face de), a la derecha / izquierda de (à droite / gauche de).',
    "Presque toutes ces expressions finissent par DE : cerca DE, lejos DE, al lado DE, delante DE… Sauf « entre » (entre la farmacia y la iglesia). Piège : DE + EL = DEL (al lado del parque, pas « de el parque ») ; mais de la / de los / de las ne changent pas (al lado de la iglesia). Ne confonds pas « encima de » (sur) et « debajo de » (sous). On dit toujours « a la derecha de » / « a la izquierda de » (avec « a la »).",
    { encabezado: ['Contrario', 'Contrario'], filas: [['cerca de', 'lejos de'], ['delante de', 'detrás de'], ['encima de', 'debajo de'], ['a la derecha de', 'a la izquierda de']] }),
    G('g_comparativo', 'Más grande que…', 'Le comparatif simple', [
      ['Bogotá es más grande que Salamanca.', 'Bogotá est plus grande que Salamanque.', 'camila', ['más grande que']],
      ['Mi calle es menos ruidosa que la plaza.', 'Ma rue est moins bruyante que la place.', 'camila', ['menos ruidosa que']],
      ['Este chocolate es mejor que el otro.', 'Ce chocolat est meilleur que l’autre.', 'marta', ['mejor que']],
      ['La casa de Marta es tan bonita como la casa de Camila.', 'La maison de Marta est aussi jolie que la maison de Camila.', 'hernan', ['tan bonita como']],
    ], 'Para comparar: más + adjetivo + que, menos + adjetivo + que. Para decir «igual»: tan + adjetivo + como. «Mejor» es «más bueno».',
    'Pour comparer : más + adjectif + que (plus… que), menos + adjectif + que (moins… que). Pour dire « aussi… que » : tan + adjectif + como. « Mejor » veut dire « meilleur » (on ne dit pas « más bueno »).',
    "Le comparatif de supériorité/infériorité : MÁS / MENOS + adjectif + QUE (pas « de » ni « comme »). L'adjectif s'accorde avec le premier nom : la plaza es más grande que el parque ; las casas son más bonitas que los edificios. Égalité : TAN + adjectif + COMO (tan bonito como). Irréguliers à connaître : bueno → mejor (meilleur), malo → peor (pire) ; mejor et peor ne changent pas au féminin (una casa mejor) mais prennent -es au pluriel (mejores). Attention : « más » porte un accent (sans accent, « mas » signifie « mais » en littérature), et on dit « más que » devant un nom ou un adjectif, mais « más de » devant un nombre (más de cien).",
    { encabezado: ['Se dice', 'Ejemplo'], filas: [['más… que', 'más grande que'], ['menos… que', 'menos ruidoso que'], ['tan… como', 'tan bonito como'], ['mejor que', 'mejor que el otro']] }),
  ];

  // ───────────── Cinemáticas ─────────────
  const intro = cine('u08-intro', 'intro', 'Capítulo 8 · Mi casa y mi barrio · Bogotá', [
    P(3, 'La carte du monde en papel picado : la ligne dorée quitte Buenos Aires, remonte vers le nord au-dessus des Andes et plonge sur la Colombie ; carte-titre « Capítulo 8 · Mi casa y mi barrio · Bogotá ».', [L(N, 'Capítulo ocho: mi casa y mi barrio.', 'Chapitre huit : ma maison et mon quartier.')], { rotulo: 'Capítulo 8 · Mi casa y mi barrio · Bogotá', camara: 'zoom avant progressif' }),
    P(5, 'Bogotá au crépuscule : la colline de Monserrate avec le sanctuaire blanc tout en haut, les toits de tuiles rouges de La Candelaria, les façades colorées avec leurs balcons, un bus rouge qui passe, des nuages bas sur la montagne.', [L(N, 'Bogotá, la capital de Colombia, entre las montañas de los Andes.', 'Bogotá, la capitale de la Colombie, entre les montagnes des Andes.'), L(N, 'Aquí, cada barrio tiene su historia.', 'Ici, chaque quartier a son histoire.')], { camara: 'panoramique lent puis descente vers les toits' }),
  ]);
  const historia = cine('u08-historia', 'historia', 'Las calles sin nombre', [
    P(7, 'Une rue pavée de La Candelaria : maisons blanches, jaunes et bleues, balcons de bois. Le Quetzal sort la tête du sac de Marina et regarde les montagnes. Camila, 12 ans, avec une ruana (poncho de laine) rouge, arrive en courant.', [
      L('quetzal', 'Siete plumas… ¡Ya falta poco!', 'Sept plumes… Il n’en manque plus beaucoup !'),
      L('camila', '¡Hola! Me llamo Camila y soy de Bogotá. ¡Bienvenidos a La Candelaria!', 'Salut ! Je m’appelle Camila et je suis de Bogotá. Bienvenue à La Candelaria ! (« Bienvenidos » : en Colombie comme au Mexique, on s’adresse à plusieurs personnes avec « ustedes ».)'),
    ], { personajes: ['quetzal', 'camila', 'marina', 'viajero'], camara: 'travelling dans la rue puis plan moyen sur Camila' }),
    P(7, 'Camila montre les panneaux de rue : tout blancs, sans une lettre. Sur une grande carte de la ville, il n’y a plus de noms. Des passants tournent en rond, perdus.', [
      L('camila', 'Pero hay un problema: los letreros no tienen letras y los mapas están en blanco.', 'Mais il y a un problème : les panneaux n’ont plus de lettres et les plans sont vierges.'),
      L('marina', '¿Y quién roba las letras?', 'Et qui vole les lettres ?'),
    ], { personajes: ['camila', 'marina'], camara: 'plans de détail sur les panneaux vides' }),
    P(7, 'Sur un toit voisin, la Sombra aspire les lettres d’un panneau comme de l’encre ; une flaque d’ombre glisse le long de la façade.', [
      L('sombra', 'Sin palabras, no hay mapas. Sin mapas, nadie sabe dónde está.', 'Sans mots, pas de plans. Sans plans, personne ne sait où il est.'),
      L('camila', '¡Todos se pierden!', 'Tout le monde se perd !'),
    ], { personajes: ['sombra', 'camila'], musica: 'tension douce, flûte andine et guitare' }),
    P(7, 'Vue vers le haut : la colline de Monserrate dans la brume et, sur le sanctuaire, un point vert qui brille. Le Quetzal le montre du bec.', [
      L('quetzal', 'La pluma… está arriba, en Monserrate.', 'La plume… est là-haut, à Monserrate.'),
      L('camila', 'Para devolver las palabras a las calles, tienen que decir dónde está cada cosa. ¡Vamos!', 'Pour rendre les mots aux rues, il faut dire où se trouve chaque chose. Allons-y !'),
    ], { personajes: ['quetzal', 'camila', 'marina', 'viajero'], musica: 'thème d’aventure, flûte et charango' }),
  ]);
  const capsula = cine('u08-capsula-candelaria', 'capsula', 'La Candelaria y Monserrate', [
    P(4, 'Style explainer, papier découpé : une carte de la Colombie, un point sur Bogotá, l’année « 1538 » s’inscrit en gros chiffres.', [L(N, 'Bogotá nace en 1538, en el barrio de La Candelaria.', 'Bogotá est fondée en 1538, dans le quartier de La Candelaria.')], { camara: 'plan fixe, animations de papier découpé' }),
    P(5, 'Les rues de La Candelaria : pavés, maisons de couleurs, balcons, graffitis ; puis la Plaza de Bolívar avec la cathédrale et les pigeons.', [L(N, 'Es el barrio histórico: tiene calles de piedra, casas de colores y balcones.', 'C’est le quartier historique : il a des rues de pierre, des maisons de couleur et des balcons.')]),
    P(5, 'Vitrine du Museo del Oro : masques, colliers et petits personnages en or ; un compteur monte jusqu’à « +55 000 ».', [L(N, 'En el Museo del Oro hay más de cincuenta mil piezas de los pueblos indígenas.', 'Au Museo del Oro, il y a plus de cinquante mille pièces des peuples indigènes.')]),
    P(5, 'Le téléphérique et le funiculaire montent vers Monserrate, un panneau indique « 3 152 m » ; la ville s’étend en bas.', [L(N, 'Monserrate es una montaña con un santuario en la cima. Está a más de tres mil metros.', 'Monserrate est une montagne avec un sanctuaire au sommet. Elle est à plus de trois mille mètres d’altitude.')]),
    P(5, 'Un dimanche, de grandes avenues fermées aux voitures : des centaines de cyclistes, des familles qui marchent et courent.', [L(N, 'Los domingos, más de cien kilómetros de calles están cerradas a los coches: ¡es la Ciclovía!', 'Le dimanche, plus de cent kilomètres de rues sont fermés aux voitures : c’est la Ciclovía !')]),
  ]);
  const pluma = cine('u08-pluma', 'pluma', 'Octava pluma', [
    P(3, 'Au sommet de Monserrate, dans le jardin du sanctuaire, la plume verte brille. En bas, les panneaux de la ville retrouvent leurs lettres, une à une.', [L('camila', '¡Las calles tienen nombre otra vez! ¡Gracias!', 'Les rues ont de nouveau un nom ! Merci !')], { personajes: ['camila'] }),
    P(3, 'Le Quetzal s’envole au-dessus des nuages, ses plumes éclatent de vert.', [L('quetzal', 'Ocho plumas. ¡Casi vuelo hasta las nubes!', 'Huit plumes. Je vole presque jusqu’aux nuages !')], { personajes: ['quetzal'] }),
    P(2, 'Don Ignacio apparaît en hologramme au-dessus de la carte ; l’empreinte lumineuse traverse l’océan Atlantique vers le Mexique.', [L('ignacio', 'La siguiente pluma está en México, en Yucatán. ¡Volvemos a casa del Quetzal!', 'La prochaine plume est au Mexique, dans le Yucatán. Nous retournons chez le Quetzal !')], { personajes: ['ignacio'] }),
  ]);

  // ───────────── Misiones ─────────────
  const quests = [];

  // 1 — Cinemática
  quests.push(quest('u08', 1, 'cinematica', 'Llegada a Bogotá', '🏔️',
    ['camila', '¡Bienvenidos a Bogotá! Yo soy Camila y esta es mi calle.', 'Bienvenue à Bogotá ! Moi, c’est Camila et voici ma rue. (Les PNJ de cette unité parlent espagnol de Colombie : ils disent « ustedes » pour « vous » au pluriel ; leurs mots qui diffèrent de l’Espagne sont signalés.)'],
    'Arrivée à Bogotá : tu rencontres Camila et tu découvres le problème des rues sans nom. Les PNJ parlent espagnol de Colombie.', ['escuchar', 'cultura', 'hablar'], 10, [
      intro,
      tf('Bogotá es la capital de Colombia.', true, N, { tr: 'Bogotá est la capitale de la Colombie.' }),
      tf('Bogotá está en España.', false, N, { tr: 'Bogotá est en Espagne.' }),
      historia,
      lcT('Vivo en un barrio con casas de colores, cerca de la Plaza de Bolívar.', 'camila', ['Camila vive en un barrio muy bonito.', 'Camila vive lejos de Bogotá.', 'Camila vive en una casa sin colores.'], 0),
      lcT('Los letreros no tienen letras y los mapas están en blanco.', 'camila', ['Nadie sabe dónde está cada calle.', 'Los mapas tienen muchos colores.', 'Hay letreros nuevos en todas las calles.'], 0),
      tf('El Quetzal busca una pluma en Bogotá.', true, N, { tr: 'Le Quetzal cherche une plume à Bogotá.' }),
      dlg('camila', '¡Hola! Yo soy Camila. ¿Y tú, de dónde eres?', 'Salut ! Moi, c’est Camila. Et toi, tu es d’où ?', [
        ['Soy de París, en Francia.', 1, '¡Qué chévere! Vienen de muy lejos.', 'Trop bien ! (« chévere » = super, très courant en Colombie). Vous venez de très loin.', 'Je suis de Paris, en France.'],
        ['Tengo doce años.', 0, 'Muy bien, pero ¿de dónde eres?', 'Très bien, mais tu es d’où ?', 'J’ai douze ans.'],
        ['Soy de Bogotá.', 0, '¿De Bogotá? ¡Pero si yo no te conozco!', 'De Bogotá ? Mais je ne te connais pas !', 'Je suis de Bogotá.'],
      ]),
      reord('Bogotá está en Colombia.', 'camila', { tr: 'Bogotá est en Colombie.' }),
      speak('Hola, me llamo Álex. Vivo en París.', 'viajero', { nombre: 'Álex', tr: 'Salut, je m’appelle Álex. J’habite à Paris. (dis ton prénom)', hechizo: ['Hechizo de la bienvenida', 'Los letreros de la calle se iluminan'] }),
    ]));

  // 2 — La casa
  quests.push(quest('u08', 2, 'vocabulario', 'La casa de Doña Marta', '🏠',
    ['marta', '¡Pasen, pasen! Esta es mi casa. Tiene un salón, una cocina, dos dormitorios y un balcón.', 'Entrez, entrez ! Voici ma maison. Elle a un salon, une cuisine, deux chambres et un balcon.'],
    'Les pièces et les objets de la maison, avec Doña Marta : tu décris ta propre maison à l’oral et à l’écrit.', ['leer', 'escuchar', 'hablar', 'escribir'], 15, [
      flash('apartamento', 'piso', 'ventana', 'puerta', 'balcon', 'escalera', 'pared'),
      lcV('balcon', ['ventana', 'puerta', 'balcon']),
      flash('cama', 'sofa', 'armario', 'lampara', 'nevera', 'alfombra'),
      match(['ventana', 'puerta', 'cama', 'sofa', 'lampara', 'nevera']),
      lcV('nevera', ['sofa', 'nevera', 'cama']),
      tf('Es una cama.', true, N, { img: 'cama', tr: 'C’est un lit.' }),
      tf('Es un sofá.', false, N, { img: 'armario', tr: 'C’est un canapé. (Faux : c’est un armario.)' }),
      fill('En la cocina hay una ___.', 'nevera', 'marta', { opts: ['nevera', 'cama', 'escalera'], tr: 'Dans la cuisine, il y a un réfrigérateur.' }),
      fill('Para subir al segundo piso, uso la ___.', 'escalera', 'marta', { opts: ['escalera', 'ventana', 'alfombra'], tr: 'Pour monter au deuxième étage, j’utilise l’escalier.' }),
      lcT('Mi casa tiene una cocina, un baño y tres dormitorios.', 'marta', ['Marta tiene tres dormitorios.', 'Marta tiene un solo dormitorio.', 'La casa de Marta no tiene baño.'], 0),
      read('Mi casa es pequeña, pero muy bonita. Tiene dos pisos. En el primer piso hay un salón y una cocina. En el segundo piso hay tres dormitorios. Y tiene un balcón con muchas flores.', 'marta',
        'Ma maison est petite, mais très jolie. Elle a deux étages. Au premier étage (« el primer piso » = le rez-de-chaussée en Colombie, comme souvent en Amérique latine ; en Espagne, la planta baja est à part), il y a un salon et une cuisine. Au deuxième étage, il y a trois chambres. Et elle a un balcon avec beaucoup de fleurs.', [
          ['¿Cuántos pisos tiene la casa?', 'Combien d’étages a la maison ?', ['Uno.', 'Dos.', 'Tres.'], 1],
          ['¿Cuántos dormitorios hay?', 'Combien de chambres y a-t-il ?', ['Dos.', 'Tres.', 'Cuatro.'], 1],
          ['¿Qué hay en el balcón?', 'Qu’y a-t-il sur le balcon ?', ['Flores.', 'Una cama.', 'Una nevera.'], 0],
        ]),
      dlg('marta', 'Y tu casa, ¿cómo es? ¿Es grande?', 'Et ta maison, elle est comment ? Elle est grande ?', [
        ['Es pequeña, pero muy bonita.', 1, '¡Qué lindo! Las casas pequeñas son muy cómodas.', 'Que c’est joli ! (« lindo » = joli, très courant en Colombie et en Amérique latine ; en Espagne, plutôt « bonito »). Les petites maisons sont très confortables.', 'Elle est petite, mais très jolie.'],
        ['Soy grande y bonita.', 0, '¿Tú eres una casa? ¡Qué cosa más rara!', 'Toi, tu es une maison ? Quelle drôle de chose !', 'Je suis grande et jolie.'],
        ['Mi casa tiene doce años.', 0, 'Doce años… ¡qué casa tan joven!', 'Douze ans… quelle jeune maison !', 'Ma maison a douze ans.'],
      ]),
      speak('Vivo en un apartamento.', 'viajero', { libre: 'un apartamento', es: 'Escucha y di dónde vives TÚ.', fr: 'Écoute et dis où TU habites (una casa, un piso, un apartamento…).', tr: 'J’habite dans un appartement. (dis où tu habites)', hechizo: ['Hechizo de la casa', 'Las ventanas de la casa se abren solas'] }),
      writeFree('Mi casa es ___. Tiene ___. En mi dormitorio hay ___.', [
        { id: 'tamano', pista: 'Comment est ta maison ? (grande, pequeña, bonita, antigua…)', tipo: 'texto' },
        { id: 'partes', pista: 'Ce qu’elle a (un salón y una cocina, dos dormitorios, un balcón…)', tipo: 'texto' },
        { id: 'objetos', pista: 'Ce qu’il y a dans ta chambre (una cama y una lámpara, un armario…)', tipo: 'texto' },
      ], 'Mi casa es pequeña. Tiene dos dormitorios y un balcón. En mi dormitorio hay una cama y una lámpara.', 'Ma maison est petite. Elle a deux chambres et un balcon. Dans ma chambre, il y a un lit et une lampe.', 'marina', C('Escribe cómo es tu casa.', 'Écris comment est ta maison.')),
      dict('La nevera está en la cocina.', 'marta'),
    ]));

  // 3 — La ciudad
  quests.push(quest('u08', 3, 'escucha', 'La ciudad de Camila', '🏙️',
    ['camila', 'Mi barrio tiene de todo: parques, tiendas, iglesias… ¿Quieren verlo?', 'Mon quartier a de tout : des parcs, des magasins, des églises… Vous voulez le voir ?'],
    'Le vocabulaire de la ville : lieux, magasins et transports. Tu écoutes Camila décrire son quartier, puis tu décris le tien.', ['escuchar', 'leer', 'hablar'], 15, [
      flash('barrio', 'ciudad', 'calle', 'plaza', 'parque', 'iglesia', 'biblioteca'),
      flash('tienda', 'mercado', 'farmacia', 'panaderia', 'cine', 'estacion', 'edificio'),
      flash('autobus', 'bicicleta', 'teleferico', 'montana', 'esquina'),
      match(['parque', 'iglesia', 'farmacia', 'panaderia', 'cine', 'autobus']),
      lcV('farmacia', ['panaderia', 'farmacia', 'cine']),
      lcI('Hay muchos libros en la biblioteca.', 'camila', 'biblioteca', ['biblioteca', 'iglesia', 'tienda']),
      lcT('En mi barrio hay un parque, una biblioteca y un cine.', 'camila', ['En el barrio de Camila hay tres lugares.', 'En el barrio de Camila no hay parque.', 'En el barrio de Camila hay dos iglesias.'], 0),
      tf('Es una farmacia.', true, N, { img: 'farmacia', tr: 'C’est une pharmacie.' }),
      read('Me llamo Camila y vivo en La Candelaria, un barrio de Bogotá. En mi calle hay una panadería, una farmacia y una tienda pequeña. Hay un parque cerca de mi casa. Mi colegio está en la plaza grande.', 'camila',
        'Je m’appelle Camila et j’habite à La Candelaria, un quartier de Bogotá. Dans ma rue, il y a une boulangerie, une pharmacie et un petit magasin. Il y a un parc près de chez moi. Mon collège est sur la grande place.', [
          ['¿Qué hay en la calle de Camila?', 'Qu’y a-t-il dans la rue de Camila ?', ['Una panadería, una farmacia y una tienda.', 'Un cine y un estadio.', 'Una iglesia y un museo.'], 0],
          ['¿Dónde está el colegio de Camila?', 'Où est le collège de Camila ?', ['En la plaza.', 'En el parque.', 'En la estación.'], 0],
          ['¿Dónde vive Camila?', 'Où habite Camila ?', ['En La Candelaria.', 'En Madrid.', 'En México.'], 0],
        ]),
      fill('Los libros están en la ___.', 'biblioteca', 'camila', { opts: ['biblioteca', 'farmacia', 'panadería'], tr: 'Les livres sont à la bibliothèque.' }),
      fill('Bogotá es una ___ muy grande y tiene muchos barrios.', 'ciudad', 'camila', { opts: ['ciudad', 'calle', 'esquina'], tr: 'Bogotá est une très grande ville et elle a beaucoup de quartiers.' }),
      dlg('camila', '¿Qué hay en tu barrio?', 'Qu’y a-t-il dans ton quartier ?', [
        ['En mi barrio hay un parque y una biblioteca.', 1, '¡Qué bien! Un barrio con parque y biblioteca es perfecto.', 'Super ! Un quartier avec un parc et une bibliothèque, c’est parfait.', 'Dans mon quartier, il y a un parc et une bibliothèque.'],
        ['En mi barrio soy un parque.', 0, '¿Tú eres un parque? ¡Qué divertido!', 'Toi, tu es un parc ? Comme c’est drôle !', 'Dans mon quartier, je suis un parc.'],
        ['Mi barrio hay.', 0, 'Mmm… ¿qué hay en tu barrio? Dime una frase completa.', 'Mmm… qu’y a-t-il dans ton quartier ? Dis-moi une phrase complète.', 'Mon quartier il y a.'],
      ]),
      speak('En mi barrio hay un parque.', 'viajero', { libre: 'un parque', es: 'Escucha y di qué hay en TU barrio.', fr: 'Écoute et dis ce qu’il y a dans TON quartier (una panadería, una biblioteca, un cine…).', tr: 'Dans mon quartier, il y a un parc. (dis ce qu’il y a dans le tien)', hechizo: ['Hechizo del barrio', 'Tu barrio aparece dibujado en el aire'] }),
      dict('Hay una panadería en mi calle.', 'camila'),
    ]));

  // 4 — Forja : estar / hay
  quests.push(quest('u08', 4, 'forja', 'La Forja: hay y está', '⚒️',
    ['quetzal', 'Hay. Está. Están. ¡Forja conmigo!', 'Hay. Est. Sont. Forge avec moi !'],
    'Estar pour situer (¿dónde está?) et la différence entre hay (il y a) et está(n) (il est / ils sont).', ['escribir', 'leer'], 15, [
      flash('hay'),
      gram('g_estar_lugar'),
      conj('estar', 'yo', 'est', 'oy', ['oy', 'ás', 'á'], 'viajero', { tr: 'Moi, je suis (à tel endroit)…' }),
      conj('estar', 'ella', 'est', 'á', ['oy', 'ás', 'á'], 'camila', { tr: 'Elle est (à tel endroit)…' }),
      conj('estar', 'ellos', 'est', 'án', ['án', 'amos', 'áis'], 'hernan', { tr: 'Eux, ils sont (à tel endroit)…' }),
      fill('La catedral ___ en la plaza.', 'está', 'camila', { opts: ['está', 'están', 'hay'], tr: 'La cathédrale est sur la place.' }),
      fill('Las tiendas ___ en la calle.', 'están', 'camila', { opts: ['está', 'están', 'hay'], tr: 'Les magasins sont dans la rue.' }),
      gram('g_hay_esta'),
      fill('En mi barrio ___ una biblioteca.', 'hay', 'camila', { opts: ['hay', 'está', 'están'], tr: 'Dans mon quartier, il y a une bibliothèque. (une bibliothèque qu’on présente → hay)' }),
      fill('La biblioteca ___ en la plaza.', 'está', 'camila', { opts: ['hay', 'está', 'están'], tr: 'La bibliothèque est sur la place. (la bibliothèque précise → está)' }),
      fill('En el parque ___ muchos árboles.', 'hay', 'hernan', { opts: ['hay', 'está', 'están'], tr: 'Dans le parc, il y a beaucoup d’arbres.' }),
      reord('En la plaza hay una iglesia.', 'camila', { tr: 'Sur la place, il y a une église.' }),
      reord('La iglesia está en la plaza.', 'camila', { tr: 'L’église est sur la place.' }),
      dlg('hernan', 'Buenos días. ¿Busca algo? ¿Una farmacia, tal vez?', 'Bonjour. Vous cherchez quelque chose ? Une pharmacie, peut-être ? (À Bogotá, on se dit « usted » facilement, même avec des enfants, par politesse.)', [
        ['Sí, ¿dónde está la farmacia?', 1, 'Está en la esquina, a su izquierda.', 'Elle est au coin de la rue, sur votre gauche. (« su » = votre, forme de politesse)', 'Oui, où est la pharmacie ?'],
        ['Sí, ¿dónde hay la farmacia?', 0, 'Se dice «¿dónde está la farmacia?». Con «la» usamos «está».', 'On dit « ¿dónde está la farmacia? ». Avec « la », on utilise « está ».', 'Oui, où il y a la pharmacie ?'],
        ['Sí, la farmacia soy.', 0, '¿Usted es la farmacia? ¡Qué cosa!', 'Vous, vous êtes la pharmacie ? Quelle histoire !', 'Oui, la pharmacie je suis.'],
      ]),
      dict('Hay un parque en la plaza.', 'camila'),
    ]));

  // 5 — Preposiciones
  quests.push(quest('u08', 5, 'lectura', '¿Dónde está todo?', '📍',
    ['hernan', 'Buenos días. Soy Hernán, conductor del teleférico. Les enseño dónde está todo.', 'Bonjour. Je suis Hernán, conducteur du téléphérique. Je vous montre où se trouve chaque chose.'],
    'Les prépositions de lieu (cerca de, detrás de, a la derecha de…) : tu lis et tu écoutes des descriptions d’une place, puis tu situes ta maison.', ['leer', 'escuchar', 'hablar'], 15, [
      flash('cerca', 'lejos', 'al_lado', 'delante', 'detras', 'encima', 'debajo'),
      flash('entre', 'enfrente', 'derecha', 'izquierda'),
      gram('g_preposiciones'),
      match(['encima', 'debajo', 'delante', 'detras', 'al_lado', 'entre']),
      lcV('debajo', ['encima', 'debajo', 'detras']),
      lcT('Mi casa está entre la panadería y la farmacia.', 'hernan', ['Hay dos tiendas cerca de mi casa.', 'Mi casa está lejos de las tiendas.', 'Mi casa está encima de la farmacia.'], 0),
      read('La plaza de mi barrio es muy bonita. En el centro hay un árbol grande. A la derecha del árbol está la iglesia. A la izquierda hay una panadería. Enfrente de la iglesia está la biblioteca. Mi casa está detrás de la panadería, cerca de la plaza.', 'hernan',
        'La place de mon quartier est très jolie. Au centre, il y a un grand arbre. À droite de l’arbre, il y a l’église. À gauche, il y a une boulangerie. En face de l’église, il y a la bibliothèque. Ma maison est derrière la boulangerie, près de la place.', [
          ['¿Dónde está la iglesia?', 'Où est l’église ?', ['A la derecha del árbol.', 'A la izquierda del árbol.', 'Detrás de la panadería.'], 0],
          ['¿Qué hay a la izquierda del árbol?', 'Qu’y a-t-il à gauche de l’arbre ?', ['Una panadería.', 'Una iglesia.', 'Una biblioteca.'], 0],
          ['¿Dónde está la casa del narrador?', 'Où est la maison de celui qui parle ?', ['Detrás de la panadería.', 'Delante de la iglesia.', 'Encima de la biblioteca.'], 0],
        ]),
      tf('El número dos está entre el uno y el tres.', true, N, { tr: 'Le nombre deux est entre le un et le trois.' }),
      tf('En el alfabeto, la «z» está delante de la «a».', false, N, { tr: 'Dans l’alphabet, le « z » est devant le « a ». (Faux : le « z » est à la fin, après le « a ».)' }),
      fill('La biblioteca está ___ de la iglesia.', 'enfrente', 'hernan', { opts: ['enfrente', 'entre', 'encima'], tr: 'La bibliothèque est en face de l’église.' }),
      fill('La farmacia está ___ la panadería y la iglesia.', 'entre', 'hernan', { opts: ['entre', 'detrás', 'lejos'], tr: 'La pharmacie est entre la boulangerie et l’église.' }),
      reord('Mi casa está al lado del parque.', 'camila', { tr: 'Ma maison est à côté du parc.' }),
      dlg('hernan', 'Mi casa está cerca de la estación. ¿Y su casa? ¿Está cerca de su colegio?', 'Ma maison est près de la gare. Et la vôtre ? Est-elle près de votre collège ?', [
        ['Sí, mi casa está cerca de mi colegio.', 1, '¡Qué suerte! Así no llega tarde.', 'Quelle chance ! Comme ça, vous n’arrivez pas en retard.', 'Oui, ma maison est près de mon collège.'],
        ['Mi casa hay cerca.', 0, 'Con «mi casa» usamos «está»: «mi casa está cerca».', 'Avec « mi casa », on utilise « está » : « mi casa está cerca ».', 'Ma maison il y a près.'],
        ['Estoy casa cerca.', 0, 'No entiendo muy bien. ¡Otra vez!', 'Je ne comprends pas très bien. Encore une fois !', 'Je suis maison près.'],
      ]),
      speak('Mi colegio está cerca de mi casa.', 'viajero', { libre: 'cerca', es: 'Escucha y di si tu colegio está cerca o lejos de TU casa.', fr: 'Écoute et dis si ton collège est près ou loin de TA maison (cerca / lejos).', tr: 'Mon collège est près de chez moi. (dis « lejos » si c’est loin)', hechizo: ['Hechizo del lugar', 'Una flecha dorada te indica el camino'] }),
    ]));

  // 6 — Comparativo
  quests.push(quest('u08', 6, 'dialogo', 'Más grande que…', '⚖️',
    ['camila', 'En Bogotá hay barrios antiguos y barrios modernos. ¿Comparamos?', 'À Bogotá, il y a des quartiers anciens et des quartiers modernes. On compare ?'],
    'Le comparatif simple (más… que, menos… que, tan… como, mejor) : tu compares des villes et des quartiers, puis ton propre quartier.', ['hablar', 'leer', 'escribir'], 14, [
      flash('mas', 'menos', 'antiguo', 'moderno', 'bonito', 'tranquilo', 'ruidoso'),
      flash('caro', 'barato', 'mejor'),
      gram('g_comparativo'),
      match(['antiguo', 'moderno', 'tranquilo', 'ruidoso', 'caro', 'barato']),
      fill('Bogotá es ___ grande que Salamanca.', 'más', 'camila', { opts: ['más', 'menos', 'tan'], tr: 'Bogotá est plus grande que Salamanque.' }),
      fill('Salamanca es ___ grande que Bogotá.', 'menos', 'camila', { opts: ['más', 'menos', 'mejor'], tr: 'Salamanque est moins grande que Bogotá.' }),
      fill('Mi calle es más tranquila ___ la plaza.', 'que', 'camila', { opts: ['que', 'como', 'de'], tr: 'Ma rue est plus calme que la place.' }),
      lcT('El mercado es más ruidoso que el parque.', 'camila', ['Para estar tranquilo, es mejor ir al parque.', 'En el parque hay más gente que en el mercado.', 'El mercado es tan tranquilo como el parque.'], 0),
      read('En mi ciudad hay barrios modernos y barrios antiguos. Mi barrio es antiguo: las casas son más bajas que los edificios del centro, pero son más bonitas. Mi calle es menos ruidosa que la plaza y mi casa es más barata que los apartamentos modernos.', 'camila',
        'Dans ma ville, il y a des quartiers modernes et des quartiers anciens. Mon quartier est ancien : les maisons sont plus basses que les immeubles du centre, mais elles sont plus jolies. Ma rue est moins bruyante que la place et ma maison est moins chère que les appartements modernes.', [
          ['¿Cómo es el barrio de Camila?', 'Comment est le quartier de Camila ?', ['Antiguo.', 'Moderno.', 'Muy ruidoso.'], 0],
          ['¿Qué es más bajo?', 'Qu’est-ce qui est plus bas ?', ['Las casas del barrio.', 'Los edificios del centro.', 'El teleférico.'], 0],
          ['¿Cómo es la calle de Camila?', 'Comment est la rue de Camila ?', ['Menos ruidosa que la plaza.', 'Más ruidosa que la plaza.', 'Más grande que la plaza.'], 0],
        ]),
      dlg('camila', 'Salamanca es más grande que Bogotá, ¿verdad?', 'Salamanque est plus grande que Bogotá, n’est-ce pas ?', [
        ['No, Salamanca es más pequeña que Bogotá.', 1, '¡Exacto! Bogotá es una ciudad enorme.', 'Exact ! Bogotá est une ville énorme. (environ huit millions d’habitants, contre environ cent cinquante mille à Salamanque)', 'Non, Salamanque est plus petite que Bogotá.'],
        ['Sí, Salamanca es más grande.', 0, 'Mmm… no. Bogotá tiene muchos más habitantes.', 'Mmm… non. Bogotá a beaucoup plus d’habitants.', 'Oui, Salamanque est plus grande.'],
        ['Salamanca es tan grande como una casa.', 0, '¿Como una casa? ¡Qué ciudad tan pequeña!', 'Comme une maison ? Quelle toute petite ville !', 'Salamanque est aussi grande qu’une maison.'],
      ]),
      tf('Un edificio es más alto que una casa.', true, N, { tr: 'Un immeuble est plus haut qu’une maison.' }),
      speak('Mi calle es más tranquila que la plaza.', 'viajero', { libre: 'tranquila', es: 'Escucha y compara TU calle con la plaza.', fr: 'Écoute et compare TA rue à la place (tranquila / ruidosa, bonita…). Attention à l’accord avec « calle » (féminin).', tr: 'Ma rue est plus calme que la place. (dis ce qui est vrai pour toi)', hechizo: ['Hechizo de la comparación', 'Dos balanzas de luz suben y bajan'] }),
      speak('Mi casa es más pequeña que mi colegio.', 'viajero', { libre: 'pequeña', es: 'Escucha y compara TU casa con tu colegio.', fr: 'Écoute et compare TA maison à ton collège (más grande / más pequeña que mi colegio).', tr: 'Ma maison est plus petite que mon collège. (dis ce qui est vrai pour toi)' }),
      writeFree('Mi barrio es ___. Mi calle es más ___ que la plaza. Mi ciudad es ___.', [
        { id: 'barrio', pista: 'Comment est ton quartier ? (tranquilo, ruidoso, bonito, moderno, antiguo…)', tipo: 'texto' },
        { id: 'calle', pista: 'Ta rue est plus… que la place (tranquila, ruidosa, bonita…, au féminin)', tipo: 'texto' },
        { id: 'ciudad', pista: 'Comment est ta ville ? (grande, pequeña, bonita…)', tipo: 'texto' },
      ], 'Mi barrio es tranquilo. Mi calle es más bonita que la plaza. Mi ciudad es grande.', 'Mon quartier est calme. Ma rue est plus jolie que la place. Ma ville est grande.', 'viajero', C('Escribe cómo es tu barrio.', 'Écris comment est ton quartier.')),
    ]));

  // 7 — Cultura
  quests.push(quest('u08', 7, 'cultura', 'La Candelaria y Monserrate', '⛰️',
    ['camila', 'Esta es La Candelaria, el corazón histórico de Bogotá. Hoy vamos a subir a Monserrate.', 'Voici La Candelaria, le cœur historique de Bogotá. Aujourd’hui, nous allons monter à Monserrate.'],
    'La Candelaria, Monserrate, la Ciclovía ; puis un tour des villes hispaniques (Madrid, Bogotá, Buenos Aires) et ta propre fiche de quartier.', ['cultura', 'leer', 'escribir', 'hablar'], 14, [
      flash('subir'),
      capsula,
      tf('Bogotá nace en 1538 en el barrio de La Candelaria.', true, N, { tr: 'Bogotá est fondée en 1538 dans le quartier de La Candelaria.' }),
      tf('Monserrate es una playa del Caribe.', false, N, { tr: 'Monserrate est une plage des Caraïbes. (Faux : c’est une montagne.)' }),
      tf('Los domingos, en Bogotá, hay una Ciclovía: muchas calles están cerradas a los coches.', true, N, { tr: 'Le dimanche, à Bogotá, il y a une Ciclovía : beaucoup de rues sont fermées aux voitures.' }),
      read('En el mundo hispano hay ciudades muy diferentes. Madrid es la capital de España y está en el centro del país. Bogotá es la capital de Colombia y está entre montañas. Buenos Aires es la capital de Argentina y está cerca de un río muy ancho, el Río de la Plata.', 'camila',
        'Dans le monde hispanique, il y a des villes très différentes. Madrid est la capitale de l’Espagne et se trouve au centre du pays. Bogotá est la capitale de la Colombie et se trouve entre des montagnes. Buenos Aires est la capitale de l’Argentine et se trouve près d’un fleuve très large, le Río de la Plata.', [
          ['¿Qué ciudad está entre montañas?', 'Quelle ville est entre des montagnes ?', ['Bogotá.', 'Madrid.', 'Buenos Aires.'], 0],
          ['¿Dónde está Buenos Aires?', 'Où est Buenos Aires ?', ['Cerca del Río de la Plata.', 'En el centro de España.', 'Entre montañas.'], 0],
          ['¿Cuál es la capital de Argentina?', 'Quelle est la capitale de l’Argentine ?', ['Buenos Aires.', 'Bogotá.', 'Madrid.'], 0],
        ]),
      read('Los domingos, en Bogotá, hay una Ciclovía. Muchas calles están cerradas a los coches. Las familias van en bicicleta, caminan y juegan en la calle. En Colombia, mucha gente toma chocolate caliente con queso: es un plato típico de Bogotá.', 'camila',
        'Le dimanche, à Bogotá, il y a une Ciclovía. Beaucoup de rues sont fermées aux voitures. Les familles vont à vélo, marchent et jouent dans la rue. En Colombie, beaucoup de gens boivent du chocolat chaud avec du fromage : c’est une spécialité typique de Bogotá.', [
          ['¿Quién usa las calles los domingos?', 'Qui utilise les rues le dimanche ?', ['Las bicicletas y las familias.', 'Solo los coches.', 'Solo los autobuses.'], 0],
          ['¿Qué toman con el chocolate en Bogotá?', 'Qu’ajoute-t-on au chocolat à Bogotá ?', ['Queso.', 'Pan con jamón.', 'Un helado.'], 0],
        ]),
      lcT('Para subir a Monserrate hay un teleférico y también un funicular.', 'hernan', ['Se puede subir a la montaña de dos maneras.', 'Solo se sube a pie por la calle.', 'No hay forma de llegar a la cima.'], 0),
      dlg('hernan', 'Para subir a Monserrate hay un teleférico. ¿Subimos juntos?', 'Pour monter à Monserrate, il y a un téléphérique. On monte ensemble ?', [
        ['Sí, vamos a subir en el teleférico.', 1, '¡Perfecto! Suban, que la vista es increíble.', 'Parfait ! Montez, la vue est incroyable.', 'Oui, nous allons monter en téléphérique.'],
        ['Sí, subo la ventana.', 0, '¿La ventana? Mmm… Mejor el teleférico.', 'La fenêtre ? Mmm… Plutôt le téléphérique.', 'Oui, je monte la fenêtre.'],
        ['No, Monserrate está en París.', 0, 'No, no. Monserrate está aquí, en Bogotá.', 'Non, non. Monserrate est ici, à Bogotá.', 'Non, Monserrate est à Paris.'],
      ]),
      fill('Monserrate es una ___ de más de tres mil metros.', 'montaña', 'camila', { opts: ['montaña', 'ciudad', 'iglesia'], tr: 'Monserrate est une montagne de plus de trois mille mètres.' }),
      reord('La Candelaria es un barrio antiguo.', 'camila', { tr: 'La Candelaria est un quartier ancien.' }),
      writeFree('Vivo en ___. En mi barrio hay ___. Mi lugar favorito es ___.', [
        { id: 'ciudad', pista: 'Ta ville (París, Lyon…)', tipo: 'texto' },
        { id: 'hay', pista: 'Ce qu’il y a dans ton quartier (un parque, una biblioteca, un cine…)', tipo: 'texto' },
        { id: 'favorito', pista: 'Ton endroit préféré (el parque, la plaza, mi casa…, avec l’article)', tipo: 'texto' },
      ], 'Vivo en París. En mi barrio hay un parque y una panadería. Mi lugar favorito es el parque.', 'J’habite à Paris. Dans mon quartier, il y a un parc et une boulangerie. Mon endroit préféré est le parc.', 'viajero', C('Escribe la ficha de tu barrio.', 'Écris la fiche de ton quartier.')),
      speak('Mi lugar favorito es el parque.', 'viajero', { libre: 'el parque', es: 'Escucha y di cuál es TU lugar favorito.', fr: 'Écoute et dis quel est TON endroit préféré (la biblioteca, mi casa, la plaza…).', tr: 'Mon endroit préféré est le parc. (dis le tien)', foco: 'Le « v » espagnol (fa-vo-RI-to) se prononce comme un « b » doux, pas comme le « v » français. Et la « ll » de « calle » se dit comme un « y » : CA-ye.', hechizo: ['Hechizo del mapa', 'Tu lugar favorito brilla en el mapa'] }),
    ]));

  // 8 — Desafío
  quests.push(quest('u08', 8, 'desafio', 'El mapa de la Sombra', '🗺️',
    ['sombra', 'Sin mapa, nadie sabe dónde está. Yo borro las calles, los nombres y las palabras.', 'Sans plan, personne ne sait où il est. J’efface les rues, les noms et les mots.'],
    'Boss de Bogotá : révision mixte des unités 1 à 8 (présentation, école, famille, description, ser / estar, maison, lieux, comparatif) pour rendre leurs noms aux rues.', ['escuchar', 'hablar', 'leer', 'escribir'], 15, [
      dlg('sombra', 'Sin nombre no hay calle. ¿Cómo te llamas y de dónde eres?', 'Sans nom, pas de rue. Comment tu t’appelles et d’où viens-tu ?', [
        ['Me llamo Álex y soy de París.', 1, '¡Grr! Ya tengo un nombre menos…', 'Grr ! Voilà un nom de moins…', 'Je m’appelle Álex et je suis de Paris.'],
        ['Tengo doce años y tres amigos.', 0, 'No es lo que pregunto. Responde bien.', 'Ce n’est pas ce que je demande. Réponds correctement.', 'J’ai douze ans et trois amis.'],
        ['Adiós, hasta luego.', 0, 'No te vas sin responder.', 'Tu ne pars pas sans répondre.', 'Au revoir, à tout à l’heure.'],
      ]),
      dlg('sombra', '¿Dónde vives? ¿Cómo es tu casa?', 'Où habites-tu ? Comment est ta maison ?', [
        ['Vivo en un apartamento en París. Tiene un balcón.', 1, '¡Aaah! Una casa más que vuelve…', 'Aaah ! Encore une maison qui revient…', 'J’habite dans un appartement à Paris. Il a un balcon.'],
        ['Vivo es un apartamento.', 0, 'Eso no tiene sentido. ¡Otra vez!', 'Ça n’a aucun sens. Encore une fois !', 'J’habite est un appartement.'],
        ['Mi casa hay una cama.', 0, 'Con «hay» no decimos «mi casa hay». ¡Otra vez!', 'Avec « hay », on ne dit pas « mi casa hay ». Encore une fois !', 'Ma maison il y a un lit.'],
      ]),
      lcV('armario', ['armario', 'nevera', 'lampara']),
      lcT('La panadería está enfrente de la farmacia, al lado del parque.', 'sombra', ['Hay un parque cerca de la panadería.', 'La farmacia está lejos del parque.', 'La panadería está detrás de la iglesia.'], 0),
      match(['ventana', 'cama', 'sofa', 'lampara', 'nevera', 'balcon']),
      fill('Mi hermano ___ doce años.', 'tiene', 'marina', { opts: ['es', 'tiene', 'está'], tr: 'Mon frère a douze ans. (l’âge → tener)' }),
      fill('En mi mochila ___ un cuaderno y dos libros.', 'hay', 'diego', { opts: ['hay', 'está', 'es'], tr: 'Dans mon sac à dos, il y a un cahier et deux livres.' }),
      fill('La Candelaria ___ en Bogotá.', 'está', 'camila', { opts: ['es', 'está', 'hay'], tr: 'La Candelaria est à Bogotá.' }),
      fill('Bogotá es ___ grande que Salamanca.', 'más', 'camila', { opts: ['más', 'menos', 'tan'], tr: 'Bogotá est plus grande que Salamanque.' }),
      conj('vivir', 'tú', 'viv', 'es', ['es', 'as', 'imos'], 'marina', { tr: 'Toi, tu habites…' }),
      reord('La farmacia está detrás de la iglesia.', 'sombra', { tr: 'La pharmacie est derrière l’église.' }),
      lcT('Mi cumpleaños es el trece de marzo.', 'camila', ['13 de marzo', '30 de marzo', '13 de mayo'], 0),
      read('Hola, soy Camila. Tengo doce años y vivo en un apartamento en La Candelaria. Mi madre es médica y mi padre es cocinero. Mi calle es muy bonita y tranquila. Mi colegio está cerca de mi casa, al lado de la iglesia. Hoy estoy un poco cansada, pero estoy contenta.', 'camila',
        'Salut, c’est Camila. J’ai douze ans et j’habite dans un appartement à La Candelaria. Ma mère est médecin et mon père est cuisinier. Ma rue est très jolie et calme. Mon collège est près de chez moi, à côté de l’église. Aujourd’hui, je suis un peu fatiguée, mais je suis contente.', [
          ['¿Dónde vive Camila?', 'Où habite Camila ?', ['En un apartamento.', 'En una casa grande.', 'En un teleférico.'], 0],
          ['¿Dónde está su colegio?', 'Où est son collège ?', ['Al lado de la iglesia.', 'Lejos de su casa.', 'Encima del mercado.'], 0],
          ['¿Cómo está Camila hoy?', 'Comment va Camila aujourd’hui ?', ['Cansada, pero contenta.', 'Triste y enfadada.', 'Muy tímida.'], 0],
        ]),
      speak('Hola, me llamo Álex. Vivo en París y mi barrio es tranquilo.', 'viajero', { nombre: 'Álex', tr: 'Salut, je m’appelle Álex. J’habite à Paris et mon quartier est calme. (dis ton prénom)', hechizo: ['Hechizo final', '¡Las calles recuperan su nombre y sus letras!'] }),
      pluma,
    ], { jefe: { personaje: 'sombra', vidas: 9 } }));

  return {
    id: 'u08', numero: 8, titulo: 'Mi casa y mi barrio', lugar: 'Bogotá', emoji: '🏙️', ejes: [2], periodo: 'fév-mars',
    objetivos: [
      { es: 'Describir mi casa y mi dormitorio.', fr: 'Décrire ma maison et ma chambre.' },
      { es: 'Decir qué hay en mi barrio y en mi ciudad.', fr: 'Dire ce qu’il y a dans mon quartier et dans ma ville.' },
      { es: 'Situar un lugar o un objeto: cerca de, detrás de, a la derecha de…', fr: 'Situer un lieu ou un objet : près de, derrière, à droite de…' },
      { es: 'Usar bien «hay» (hay un parque) y «está» (el parque está cerca).', fr: 'Bien employer « hay » (hay un parque) et « está » (el parque está cerca).' },
      { es: 'Comparar con «más… que», «menos… que» y «tan… como».', fr: 'Comparer avec « más… que », « menos… que » et « tan… como ».' },
      { es: 'Conocer Bogotá (La Candelaria, Monserrate, la Ciclovía) y comparar ciudades hispánicas.', fr: 'Connaître Bogotá (La Candelaria, Monserrate, la Ciclovía) et comparer des villes hispaniques.' },
    ],
    vocab, gramatica, quests,
    pluma: { numero: 8, nombre: 'Pluma del Mapa', descripcion: L('quetzal', 'Ocho plumas. Las calles tienen nombre… ¡y mis alas tienen fuerza!', 'Huit plumes. Les rues ont un nom… et mes ailes ont de la force !') },
  };
}
