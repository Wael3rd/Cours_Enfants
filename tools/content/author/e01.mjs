// Evento — Día de Muertos (Oaxaca) · ouvert du 25 octobre au 2 novembre · axes 4 + 6
// Unité courte (4 quêtes) : ofrenda, calavera, cempasúchil, pan de muerto, papel picado, alebrije. Fête du souvenir, joyeuse (pas Halloween).
// Révise le vocabulaire des unités 1 à 4. Récompense : élément d'avatar « Máscara de calavera » (région Oaxaca, voir engine/rpg.ts).
import { W, quest, flash, match, lcV, lcT, dict, fill, reord, conj, dlg, read, speak, tf, writeFree, cine, P, L, C, NARR } from './lib.mjs';

export default function build() {
  const N = NARR;
  const ilu = (s) => ({ ilustracion: s });

  // ───────────── Vocabulario (19) ─────────────
  const vocab = [
    W('fiesta', 'fiesta', 'fête', '🎊', 'fiesta', 'El Día de Muertos es una fiesta alegre.', 'Le Jour des Morts est une fête joyeuse.', { genero: 'f', plural: 'fiestas' }),
    W('celebrar', 'celebrar', 'célébrer, fêter', '🎉', 'verbos', 'Celebramos el Día de Muertos en familia.', 'Nous fêtons le Jour des Morts en famille.', { exVoz: 'xochitl' }),
    W('muerto', 'muerto', 'mort (Día de Muertos = Jour des Morts)', '🕊️', 'fiesta', 'Recordamos a los muertos con cariño.', 'Nous nous souvenons des morts avec tendresse.', { genero: 'm', femenino: 'muerta', exVoz: 'remedios' }),
    W('recordar', 'recordar', 'se souvenir de (quelqu’un, quelque chose)', '💭', 'verbos', 'En la fiesta recordamos a los abuelos.', 'Pendant la fête, nous nous souvenons de nos grands-parents disparus.', { exVoz: 'remedios' }),
    W('recuerdo', 'recuerdo', 'souvenir', '🎞️', 'fiesta', 'Cada foto es un recuerdo.', 'Chaque photo est un souvenir.', { genero: 'm', plural: 'recuerdos', exVoz: 'remedios' }),
    W('ofrenda', 'ofrenda', 'offrande : l’autel de la fête, avec photos, bougies, fleurs et nourriture', null, 'ofrenda', 'En la ofrenda hay flores, velas y fotos.', 'Sur l’autel, il y a des fleurs, des bougies et des photos.', { genero: 'f', plural: 'ofrendas', voz: 'remedios', ...ilu('Un autel mexicain à étages avec des photos, des bougies, des fleurs orange et du pain') }),
    W('vela', 'vela', 'bougie', '🕯️', 'ofrenda', 'Una vela da luz.', 'Une bougie donne de la lumière.', { genero: 'f', plural: 'velas', exVoz: 'remedios' }),
    W('luz', 'luz', 'lumière', '💡', 'ofrenda', 'Las velas dan mucha luz.', 'Les bougies donnent beaucoup de lumière.', { genero: 'f', plural: 'luces' }),
    W('agua', 'agua', 'eau', '💧', 'ofrenda', 'En la ofrenda hay un vaso de agua.', 'Sur l’autel, il y a un verre d’eau.', { genero: 'f', exVoz: 'remedios' }),
    W('comida', 'comida', 'nourriture, repas', '🍲', 'ofrenda', 'Ponemos la comida favorita de nuestros muertos.', 'Nous mettons le plat préféré de nos défunts.', { genero: 'f', exVoz: 'remedios' }),
    W('cempasuchil', 'cempasúchil', 'cempasúchil : grande fleur orange (une rose d’Inde, cousine de l’œillet d’Inde), la fleur du Día de Muertos ; son nom vient du nahuatl', null, 'ofrenda', 'El cempasúchil es la flor del Día de Muertos.', 'Le cempasúchil est la fleur du Jour des Morts.', { genero: 'm', voz: 'xochitl', ...ilu('Des fleurs de cempasúchil orange vif en grosses boules') }),
    W('petalo', 'pétalo', 'pétale', '🌼', 'ofrenda', 'Un camino de pétalos naranjas.', 'Un chemin de pétales orange.', { genero: 'm', plural: 'pétalos', exVoz: 'xochitl' }),
    W('pan_de_muerto', 'pan de muerto', 'pain des morts : brioche ronde et sucrée, souvent décorée de petits os en pâte (à Oaxaca, plutôt d’un petit visage en pâte)', '🍞', 'ofrenda', 'El pan de muerto es dulce y redondo.', 'Le pain des morts est sucré et rond.', { genero: 'm', voz: 'remedios' }),
    W('papel_picado', 'papel picado', 'papel picado : papier de soie découpé en motifs (fleurs, calaveras…) et suspendu en guirlandes', null, 'ofrenda', 'El papel picado tiene muchos colores.', 'Le papel picado a beaucoup de couleurs.', { genero: 'm', voz: 'xochitl', ...ilu('Une guirlande de papel picado : papier de soie coloré découpé en motifs') }),
    W('calavera', 'calavera', 'crâne, tête de mort (au Día de Muertos, les calaveras sont colorées et souriantes)', '💀', 'cultura', 'La calavera de azúcar tiene un nombre.', 'Le crâne en sucre porte un prénom.', { genero: 'f', plural: 'calaveras', exVoz: 'xochitl' }),
    W('azucar', 'azúcar', 'sucre', '🍬', 'cultura', 'La calavera es de azúcar.', 'Le crâne est en sucre.', { genero: 'm', exVoz: 'xochitl' }),
    W('catrina', 'Catrina', 'la Catrina : élégante dame squelette au grand chapeau, imaginée par le graveur José Guadalupe Posada au début du XXe siècle et baptisée « Catrina » par Diego Rivera, le mari de Frida Kahlo', null, 'cultura', 'La Catrina lleva un sombrero grande.', 'La Catrina porte un grand chapeau.', { genero: 'f', voz: 'xochitl', ...ilu('La Catrina : un squelette élégant en robe longue avec un grand chapeau à plumes et à fleurs') }),
    W('cementerio', 'cementerio', 'cimetière (au Mexique, on dit souvent « panteón »)', '🪦', 'cultura', 'Muchas familias van al cementerio.', 'Beaucoup de familles vont au cimetière.', { genero: 'm', exVoz: 'xochitl' }),
    W('alebrije', 'alebrije', 'alebrije : animal fantastique aux mille couleurs. À Oaxaca, il est sculpté dans le bois ; les premiers, inventés à Mexico par Pedro Linares dans les années 1930, étaient en papier mâché', null, 'cultura', 'Mis alebrijes son de madera.', 'Mes alebrijes sont en bois.', { genero: 'm', plural: 'alebrijes', voz: 'beto', ...ilu('Un alebrije : animal fantastique en bois peint, mélange de jaguar et de poisson, couvert de motifs colorés') }),
  ];

  // ───────────── Cinemáticas ─────────────
  const intro = cine('e01-intro', 'intro', 'Evento · Día de Muertos · Oaxaca', [
    P(3, "La carte du Mexique : un point orange pulse sur Oaxaca ; carte-titre « Evento · Día de Muertos · Oaxaca » sur un fond de papel picado magenta et turquoise.", [L(N, 'Evento especial: Día de Muertos.', 'Événement spécial : le Jour des Morts.')], { rotulo: 'Evento · Día de Muertos · Oaxaca', camara: 'zoom avant progressif' }),
    P(5, "Rues d’Oaxaca au crépuscule : guirlandes de papel picado, pétales de cempasúchil sur les pavés, vitrines pleines de pan de muerto, calaveras de sucre ; des enfants rient.", [L(N, 'Oaxaca, México. Una fiesta para recordar con alegría.', 'Oaxaca, Mexique. Une fête pour se souvenir dans la joie.')], { camara: 'travelling latéral lent, lumière chaude' }),
    P(3, "Une bougie s’éteint ; l’ombre de la Sombra glisse sur un mur. Xóchitl serre une photo contre elle.", [L('sombra', 'Sin recuerdos, no hay fiesta… Apago las velas.', 'Sans souvenirs, pas de fête… J’éteins les bougies.')], { personajes: ['sombra', 'xochitl'], musica: 'tension douce, marimba' }),
  ]);
  const capsula = cine('e01-capsula-muertos', 'capsula', 'Día de Muertos: una fiesta, no Halloween', [
    P(5, "Style explainer, papier découpé : un calendrier s’ouvre sur le « 1 » et le « 2 » de noviembre ; des icônes d’enfants puis d’adultes apparaissent.", [L(N, 'En México, el uno de noviembre las familias recuerdan a los niños que ya no están, y el dos, a los adultos.', 'Au Mexique, le 1er novembre, les familles se souviennent des enfants disparus, et le 2, des adultes.')], { camara: 'plan fixe, animations de papier découpé' }),
    P(5, "Un autel à étages se construit élément par élément : photos, bougies, fleurs de cempasúchil, pain de muerto, verre d’eau, plat favori, papel picado qui flotte en haut.", [L(N, 'En la ofrenda hay fotos, velas, flores, pan de muerto y la comida favorita de los muertos.', 'Sur l’autel, il y a des photos, des bougies, des fleurs, du pain des morts et le plat préféré des défunts.')]),
    P(5, "Un chemin de pétales orange part de la rue et mène jusqu’à la porte d’une maison, éclairé par des bougies.", [L(N, 'Los pétalos de cempasúchil hacen un camino de color naranja. Según la tradición, este camino guía a los muertos hasta su casa.', 'Les pétales de cempasúchil font un chemin orange. Selon la tradition, ce chemin guide les défunts jusqu’à leur maison.')]),
    P(4, "Montage joyeux : calaveras de sucre colorées, la Catrina, papel picado, musiciens et familles ; un signe « ≠ » entre « Halloween » et « Día de Muertos », sans moquerie.", [L(N, 'No es Halloween: es una fiesta alegre, con música, colores y comida.', 'Ce n’est pas Halloween : c’est une fête joyeuse, avec de la musique, des couleurs et de la nourriture.')]),
    P(4, "Logo de la UNESCO et carte du Mexique qui s’illumine ; texte « Patrimonio Cultural Inmaterial de la Humanidad · 2008 ».", [L(N, 'Desde 2008, esta tradición es Patrimonio Cultural Inmaterial de la Humanidad.', 'Depuis 2008, cette tradition est inscrite au patrimoine culturel immatériel de l’humanité (UNESCO).')]),
  ]);

  // ───────────── Misiones ─────────────
  const quests = [];

  // 1 — Cinemática
  quests.push(quest('e01', 1, 'cinematica', 'Llegada a Oaxaca', '🕯️',
    ['xochitl', '¡Hola, viajeros! Hoy empieza la fiesta más bonita del año.', 'Salut, voyageurs ! Aujourd’hui commence la plus belle fête de l’année.'],
    'Arrivée à Oaxaca pour le Día de Muertos : tu rencontres Xóchitl et tu découvres que cette fête est joyeuse, pas triste ni effrayante.', ['escuchar', 'cultura', 'hablar'], 10, [
      intro,
      tf('Oaxaca está en México.', true, N, { tr: 'Oaxaca est au Mexique.' }),
      flash('fiesta', 'celebrar', 'muerto', 'recordar', 'recuerdo', 'ofrenda'),
      lcV('ofrenda', ['cuadro', 'flor', 'ofrenda']),
      lcT('Hoy empieza la fiesta. ¡Celebramos a nuestros muertos con alegría!', 'xochitl', ['Es una fiesta triste, sin música.', 'Es una fiesta que da miedo.', 'Es una fiesta alegre para recordar a la familia.'], 2),
      dlg('xochitl', '¡Hola! Me llamo Xóchitl y tengo once años. ¿Y tú, cómo te llamas?', 'Salut ! Je m’appelle Xóchitl et j’ai onze ans. Et toi, comment tu t’appelles ?', [
        ['Me llamo Álex. Tengo doce años.', 1, '¡Mucho gusto, Álex! Mi nombre significa «flor» en náhuatl.', 'Enchantée, Álex ! Mon prénom veut dire « fleur » en náhuatl (la langue des Aztèques).', 'Je m’appelle Álex. J’ai douze ans.'],
        ['Soy Xóchitl.', 0, '¡Pero Xóchitl soy yo! ¿Hay dos Xóchitl?', 'Mais Xóchitl, c’est moi ! Il y a deux Xóchitl ?', 'Je suis Xóchitl.'],
        ['Adiós, buenas noches.', 0, '¿Adiós? ¡Pero si la fiesta empieza ahora!', 'Au revoir ? Mais la fête commence maintenant !', 'Au revoir, bonne nuit.'],
      ]),
      dlg('xochitl', '¿Cuándo es el Día de Muertos?', 'Quand est le Jour des Morts ?', [
        ['El uno y el dos de noviembre.', 1, '¡Exacto! Y la fiesta empieza antes, en octubre.', 'Exact ! Et la fête commence avant, en octobre.', 'Le 1er et le 2 novembre.'],
        ['El veinticinco de diciembre.', 0, 'Ese día es Navidad. ¡Esta fiesta es antes!', 'Ce jour-là, c’est Noël. Cette fête est avant !', 'Le 25 décembre.'],
        ['El domingo.', 0, 'El domingo… ¿pero de qué mes?', 'Le dimanche… mais de quel mois ?', 'Le dimanche.'],
      ]),
      reord('Hoy celebramos el Día de Muertos.', 'xochitl', { tr: 'Aujourd’hui, nous fêtons le Jour des Morts.' }),
      speak('Hoy celebramos el Día de Muertos.', 'xochitl', { tr: 'Aujourd’hui, nous fêtons le Jour des Morts.', foco: 'Le c devant e ou i : au Mexique, comme un « s » (se-le-BRA-mos) ; en Espagne, comme le « th » anglais (the-le-BRA-mos). Les deux sont corrects. Dans « Día », on appuie sur le í : DÍ-a.', hechizo: ['Hechizo de la fiesta', 'Pétalos naranjas caen sobre la calle'] }),
    ]));

  // 2 — La ofrenda
  quests.push(quest('e01', 2, 'vocabulario', 'La ofrenda', '🌼',
    ['remedios', 'Bienvenidos a mi casa. Hoy preparamos la ofrenda para recordar a los que ya no están.', 'Bienvenue chez moi. Aujourd’hui, nous préparons l’ofrenda pour nous souvenir de ceux qui ne sont plus là.'],
    'L’ofrenda et ses éléments (bougies, cempasúchil, pain de muerto, papel picado) ; tu révises « hay », les couleurs et les nombres, et tu composes TON ofrenda.', ['leer', 'escuchar', 'escribir', 'hablar'], 14, [
      flash('vela', 'luz', 'foto', 'agua', 'comida', 'cempasuchil', 'petalo'),
      flash('pan_de_muerto', 'papel_picado'),
      match(['vela', 'cempasuchil', 'pan_de_muerto', 'papel_picado', 'foto', 'agua']),
      lcV('vela', ['luz', 'agua', 'vela']),
      fill('En la ofrenda hay flores, velas y ___.', 'fotos', 'remedios', { opts: ['fotos', 'fotas', 'fotoes'], tr: 'Sur l’autel, il y a des fleurs, des bougies et des photos. (« foto » est féminin malgré son -o, car c’est le début de « la fotografía » : la foto → las fotos)' }),
      lcT('En la ofrenda hay cuatro velas, una foto de mi abuelo y pan de muerto.', 'remedios', ['Hay dos velas, un retrato de su abuela y pan.', 'Hay cuatro velas, un retrato de su abuelo y pan.', 'Hay cuatro flores, un retrato de su abuelo y agua.'], 1),
      lcT('Las flores de cempasúchil son naranjas. Sus pétalos hacen un camino hasta la ofrenda.', 'xochitl', ['Los pétalos azules forman una casa.', 'Los pétalos naranjas forman un camino.', 'Los pétalos naranjas forman un cuadro.'], 1),
      read('Mi ofrenda tiene dos niveles. Arriba hay una foto de mi abuela, cuatro velas y flores de cempasúchil. Abajo hay agua, pan de muerto y su comida favorita: el mole. Todo está lleno de color.', 'remedios',
        'Mon ofrenda a deux niveaux. En haut, il y a une photo de ma grand-mère, quatre bougies et des fleurs de cempasúchil. En bas, il y a de l’eau, du pain des morts et son plat préféré : le mole (une sauce épaisse aux piments et aux épices, souvent avec du chocolat ; Oaxaca est célèbre pour ses moles). Tout est plein de couleur.', [
          ['¿De quién es la foto?', 'De qui est la photo ?', ['De su abuela.', 'De su madre.', 'De su hermana.'], 0],
          ['¿Cuántas velas hay?', 'Combien y a-t-il de bougies ?', ['Dos.', 'Cuatro.', 'Seis.'], 1],
          ['¿Qué hay abajo?', 'Qu’y a-t-il en bas ?', ['Fotos y velas.', 'Agua, pan de muerto y comida.', 'Solo flores.'], 1],
        ]),
      fill('El cempasúchil es una flor ___ y amarilla.', 'naranja', 'xochitl', { opts: ['naranja', 'naranjo', 'naranjas'], tr: 'Le cempasúchil est une fleur orange et jaune.' }),
      fill('Una vela da ___.', 'luz', 'remedios', { opts: ['luz', 'agua', 'pan'], tr: 'Une bougie donne de la lumière.' }),
      reord('El papel picado tiene muchos colores.', 'xochitl', { tr: 'Le papel picado a beaucoup de couleurs.' }),
      dlg('remedios', '¿Quién está en tu ofrenda? Puede ser alguien de tu familia o una persona famosa.', 'Qui est sur ton ofrenda ? Ça peut être quelqu’un de ta famille ou une personne célèbre. (Sur une ofrenda, on ne met que des personnes décédées.)', [
        ['En mi ofrenda está Frida Kahlo.', 1, '¡Qué buena idea! Frida es una artista muy querida en México.', 'Quelle bonne idée ! Frida est une artiste très aimée au Mexique.', 'Sur mon ofrenda, il y a Frida Kahlo.'],
        ['En mi ofrenda hay una foto de mi bisabuela.', 1, 'Qué bonito. Así la recuerdas con cariño.', 'Que c’est beau. Comme ça, tu te souviens d’elle avec tendresse.', 'Sur mon ofrenda, il y a une photo de mon arrière-grand-mère.'],
        ['Mi ofrenda se llama doce años.', 0, 'Jaja, ¿una ofrenda de doce años? No entiendo.', 'Haha, une ofrenda de douze ans ? Je ne comprends pas.', 'Mon ofrenda s’appelle douze ans.'],
      ]),
      writeFree('En mi ofrenda hay una foto de ___. También hay ___.', [
        { id: 'persona', pista: 'Une personne disparue que tu admires ou de ta famille (Frida Kahlo, un artista, mi bisabuelo…). Sur une ofrenda, on ne met que des personnes décédées.', tipo: 'texto' },
        { id: 'cosa', pista: 'Ce que tu ajoutes : des fleurs, des bougies, pan de muerto, sa comida favorita… (ex. flores naranjas y cuatro velas)', tipo: 'texto' },
      ], 'En mi ofrenda hay una foto de Frida Kahlo. También hay flores naranjas y cuatro velas.', 'Sur mon ofrenda, il y a une photo de Frida Kahlo. Il y a aussi des fleurs orange et quatre bougies.', 'xochitl',
      C('Escribe tu ofrenda.', 'Écris ton ofrenda.')),
      speak('En mi ofrenda hay una foto de Frida Kahlo.', 'viajero', { libre: 'Frida Kahlo', es: 'Escucha y di de quién es la foto en TU ofrenda.', fr: 'Écoute et dis de qui est la photo sur TON ofrenda : une personne disparue que tu admires ou quelqu’un de ta famille qui n’est plus là (de Frida Kahlo, de mi bisabuelo…).', tr: 'Sur mon ofrenda, il y a une photo de Frida Kahlo. (dis la tienne)', hechizo: ['Hechizo del recuerdo', 'Una vela se enciende en tu ofrenda'] }),
    ]));

  // 3 — Cultura
  quests.push(quest('e01', 3, 'cultura', 'Una fiesta, no Halloween', '💀',
    ['xochitl', 'El Día de Muertos no es Halloween. Es una fiesta para recordar con cariño a la familia.', 'Le Jour des Morts, ce n’est pas Halloween. C’est une fête pour se souvenir de la famille avec tendresse.'],
    'Une fête du souvenir, joyeuse et familiale : calaveras de sucre, Catrina, veillée au cimetière ; et l’artisanat d’Oaxaca, les alebrijes. Une tradition inscrite au patrimoine culturel immatériel de l’UNESCO (2008).', ['cultura', 'leer', 'escuchar', 'hablar'], 14, [
      flash('calavera', 'azucar', 'catrina', 'cementerio', 'alebrije'),
      capsula,
      tf('El Día de Muertos es una fiesta alegre.', true, N, { tr: 'Le Jour des Morts est une fête joyeuse.' }),
      tf('El Día de Muertos es una fiesta que da miedo, como Halloween.', false, N, { tr: 'Le Jour des Morts est une fête qui fait peur, comme Halloween.' }),
      tf('En una ofrenda hay fotos, velas y flores.', true, N, { tr: 'Sur une ofrenda, il y a des photos, des bougies et des fleurs.' }),
      tf('Los alebrijes son animales fantásticos de muchos colores.', true, N, { img: 'alebrije', tr: 'Les alebrijes sont des animaux fantastiques de toutes les couleurs.' }),
      read('Soy Beto y hago alebrijes en Oaxaca. Mis alebrijes son animales fantásticos de madera. Los pinto con muchos colores: rojo, azul, verde, amarillo y morado. ¡No hay dos alebrijes iguales!', 'beto',
        'Je suis Beto et je fabrique des alebrijes à Oaxaca. Mes alebrijes sont des animaux fantastiques en bois. Je les peins avec beaucoup de couleurs : rouge, bleu, vert, jaune et violet. Il n’y a pas deux alebrijes identiques ! (Les alebrijes ne sont pas une tradition du Día de Muertos : c’est un artisanat d’Oaxaca et de Mexico, très présent dans les fêtes.)', [
          ['¿Qué hace Beto?', 'Que fait Beto ?', ['Alebrijes.', 'Pan de muerto.', 'Cuadros.'], 0],
          ['¿De qué son los alebrijes de Beto?', 'En quoi sont les alebrijes de Beto ?', ['De azúcar.', 'De madera.', 'De pan.'], 1],
          ['¿Hay dos alebrijes iguales?', 'Y a-t-il deux alebrijes identiques ?', ['Sí.', 'No.'], 1],
        ]),
      read('La calavera de azúcar tiene un nombre escrito y es para una persona de la familia. No da miedo: es dulce y de colores. La Catrina es una calavera elegante con un sombrero grande.', 'xochitl',
        'Le crâne en sucre a un prénom écrit dessus et il est pour une personne de la famille. Il ne fait pas peur : il est sucré et coloré. La Catrina est un squelette élégant avec un grand chapeau.', [
          ['¿De qué es la calavera?', 'En quoi est le crâne ?', ['De azúcar.', 'De madera.', 'De agua.'], 0],
          ['¿Da miedo la calavera?', 'Le crâne fait-il peur ?', ['Sí, mucho.', 'No, es dulce y de colores.'], 1],
          ['¿Qué lleva la Catrina?', 'Que porte la Catrina ?', ['Una gorra.', 'Un sombrero grande.', 'Gafas.'], 1],
        ]),
      lcT('En Oaxaca, muchas familias van al cementerio con flores y velas, y pasan la noche juntas.', 'xochitl', ['Las familias tienen miedo del cementerio.', 'Las familias visitan a sus muertos con flores y velas.', 'Las familias viven en el cementerio.'], 1),
      dlg('beto', 'Mi alebrije es un jaguar azul y amarillo. ¿Cómo es tu animal fantástico?', 'Mon alebrije est un jaguar bleu et jaune. Comment est ton animal fantastique ?', [
        ['Mi animal es grande y azul.', 1, '¡Qué padre! Un animal grande y azul, como el mar.', 'Trop bien ! (« padre » = génial, familier mexicain). Un grand animal bleu, comme la mer.', 'Mon animal est grand et bleu.'],
        ['Mi animal lleva gafas y un sombrero.', 1, 'Jaja, ¡un animal elegante! Me gusta.', 'Haha, un animal élégant ! Il me plaît.', 'Mon animal porte des lunettes et un chapeau.'],
        ['Mi animal se llama doce años.', 0, 'Jaja… eso no es un nombre.', 'Haha… ce n’est pas un prénom.', 'Mon animal s’appelle douze ans.'],
      ]),
      fill('El Día de Muertos es una ___ alegre.', 'fiesta', 'xochitl', { opts: ['vela', 'fiesta', 'ofrenda'], tr: 'Le Jour des Morts est une fête joyeuse.' }),
      fill('La calavera es de ___.', 'azúcar', 'xochitl', { opts: ['agua', 'luz', 'azúcar'], tr: 'Le crâne est en sucre.' }),
      reord('La Catrina lleva un sombrero grande.', 'xochitl', { tr: 'La Catrina porte un grand chapeau.' }),
      speak('En mi familia celebramos la Navidad.', 'viajero', { libre: 'la Navidad', es: 'Escucha y di qué fiesta celebras TÚ con tu familia.', fr: 'Écoute et dis quelle fête TU fêtes avec ta famille (el cumpleaños, el Año Nuevo, la Navidad…).', tr: 'Dans ma famille, nous fêtons Noël. (dis ta fête)', hechizo: ['Hechizo de la fiesta', 'Luces de colores rodean tu mesa'] }),
    ]));

  // 4 — Desafío
  quests.push(quest('e01', 4, 'desafio', 'La Sombra y el olvido', '👤',
    ['sombra', 'Sin recuerdos, no hay fiesta. Voy a apagar todas las velas de Oaxaca.', 'Sans souvenirs, pas de fête. Je vais éteindre toutes les bougies d’Oaxaca.'],
    'Boss de l’événement : révision du Día de Muertos et des unités 1 à 4. Chaque bonne réponse rallume une bougie.', ['escuchar', 'hablar', 'leer', 'escribir'], 15, [
      dlg('sombra', '¿Qué es una ofrenda?', 'Qu’est-ce qu’une ofrenda ?', [
        ['Es un altar con fotos, velas y flores para recordar a la familia.', 1, '¡Grr! Una vela más se enciende…', 'Grr ! Une bougie de plus s’allume…', 'C’est un autel avec des photos, des bougies et des fleurs pour se souvenir de la famille.'],
        ['Es un animal fantástico de colores.', 0, 'Eso es un alebrije, no una ofrenda.', 'Ça, c’est un alebrije, pas une ofrenda.', 'C’est un animal fantastique en bois.'],
        ['Es una calavera de azúcar.', 0, 'La calavera está en la ofrenda, pero no es la ofrenda.', 'Le crâne est sur l’ofrenda, mais ce n’est pas l’ofrenda.', 'C’est un crâne en sucre.'],
      ]),
      dlg('sombra', '¿Cómo es la flor de la ofrenda?', 'Comment est la fleur de l’ofrenda ?', [
        ['Es una flor naranja y amarilla: el cempasúchil.', 1, '¡Aaah! Otra vela encendida…', 'Aaah ! Une autre bougie allumée…', 'C’est une fleur orange et jaune : le cempasúchil.'],
        ['Es una flor azul y gris.', 0, 'No. Es naranja y amarilla, como el sol.', 'Non. Elle est orange et jaune, comme le soleil.', 'C’est une fleur bleue et grise.'],
        ['Es una vela negra.', 0, 'Una vela no es una flor.', 'Une bougie n’est pas une fleur.', 'C’est une bougie noire.'],
      ]),
      lcV('calavera', ['vela', 'calavera', 'cuadro']),
      match(['vela', 'pan_de_muerto', 'calavera', 'papel_picado', 'alebrije', 'cempasuchil']),
      lcT('En mi casa hay una ofrenda con diez velas y flores naranjas.', 'xochitl', ['La ofrenda de Xóchitl tiene diez velas y flores de color naranja.', 'La ofrenda de Xóchitl tiene seis velas y flores azules.', 'La casa de Xóchitl no tiene ofrenda.'], 0),
      fill('Las velas de mi ofrenda son ___.', 'blancas', 'remedios', { opts: ['blancos', 'blancas', 'blanca'], tr: 'Les bougies de mon ofrenda sont blanches.' }),
      fill('Los alebrijes son de muchos ___.', 'colores', 'beto', { opts: ['color', 'colores', 'colora'], tr: 'Les alebrijes sont de beaucoup de couleurs.' }),
      fill('Nosotros ___ el Día de Muertos en familia.', 'celebramos', 'xochitl', { opts: ['celebro', 'celebramos', 'celebran'], tr: 'Nous fêtons le Jour des Morts en famille.' }),
      conj('comer', 'nosotros', 'com', 'emos', ['emos', 'imos', 'en'], 'beto', { tr: 'Nous, nous mangeons…' }),
      reord('Mi familia come pan de muerto en noviembre.', 'xochitl', { tr: 'Ma famille mange du pain des morts en novembre.' }),
      dict('La ofrenda tiene velas y flores.', 'remedios', { acept: ['la ofrenda tiene velas y flores'] }),
      read('Hola, soy Xóchitl. Tengo once años y vivo en Oaxaca. Soy baja y delgada, y tengo el pelo largo y negro. Hoy llevo un vestido blanco con flores. Estoy muy contenta: ¡hoy es la fiesta!', 'xochitl',
        'Salut, c’est Xóchitl. J’ai onze ans et j’habite à Oaxaca. Je suis petite et mince, et j’ai les cheveux longs et noirs. Aujourd’hui, je porte une robe blanche avec des fleurs. Je suis très contente : aujourd’hui, c’est la fête !', [
          ['¿Cuántos años tiene Xóchitl?', 'Quel âge a Xóchitl ?', ['Diez.', 'Once.', 'Doce.'], 1],
          ['¿Cómo tiene el pelo?', 'Comment a-t-elle les cheveux ?', ['Largo y negro.', 'Corto y rubio.', 'Rizado y castaño.'], 0],
          ['¿Cómo está hoy?', 'Comment va-t-elle aujourd’hui ?', ['Cansada.', 'Triste.', 'Contenta.'], 2],
        ]),
      lcT('El dos de noviembre.', 'sombra', ['12 de noviembre', '2 de octubre', '2 de noviembre'], 2),
      tf('Halloween y el Día de Muertos son la misma fiesta.', false, N, { tr: 'Halloween et le Jour des Morts sont la même fête.' }),
      speak('Hola, me llamo Álex. Hoy celebro el Día de Muertos.', 'viajero', { tr: 'Salut, je m’appelle Álex. Aujourd’hui, je fête le Jour des Morts. (dis ton prénom)', nombre: 'Álex', hechizo: ['Hechizo del recuerdo', '¡Todas las velas de Oaxaca se encienden y la Sombra se aleja!'] }),
    ], { jefe: { personaje: 'sombra', vidas: 8 } }));

  return {
    id: 'e01', numero: 0, titulo: 'Día de Muertos', lugar: 'Oaxaca', emoji: '💀', ejes: [4, 6], periodo: 'oct-nov',
    evento: { desde: '10-25', hasta: '11-02' },
    objetivos: [
      { es: 'Entender qué es el Día de Muertos: una fiesta alegre para recordar a la familia.', fr: 'Comprendre ce qu’est le Jour des Morts : une fête joyeuse pour se souvenir de la famille.' },
      { es: 'Nombrar los elementos de la ofrenda: velas, cempasúchil, pan de muerto, papel picado.', fr: 'Nommer les éléments de l’ofrenda : bougies, cempasúchil, pain des morts, papel picado.' },
      { es: 'Descubrir las calaveras, la Catrina y los alebrijes de Oaxaca.', fr: 'Découvrir les calaveras, la Catrina et les alebrijes d’Oaxaca.' },
      { es: 'Repasar lo aprendido: presentarme, describir, hay, colores y fechas.', fr: 'Réviser ce qui a été appris : me présenter, décrire, hay, couleurs et dates.' },
      { es: 'Decir quién está en mi ofrenda y qué fiesta celebro con mi familia.', fr: 'Dire qui est sur mon ofrenda et quelle fête je célèbre en famille.' },
    ],
    vocab, gramatica: [], quests,
    pluma: { numero: 0, nombre: 'Pluma de Cempasúchil', descripcion: L('quetzal', 'Esta pluma es naranja como el cempasúchil. Es un regalo de la fiesta.', 'Cette plume est orange comme le cempasúchil. C’est un cadeau de la fête.') },
  };
}
