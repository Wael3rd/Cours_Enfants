// Unidad 7 — Me gusta… (Buenos Aires · La Boca · San Telmo)
// Axe 3 (école et loisirs). PNJ argentins (voix es-AR) : Facu, Sol, Don Aníbal. Le voseo (vos jugás, che…) est SIGNALÉ en pistes, jamais enseigné activement :
// les répliques de l'élève (viajero) restent en « tú ».
// Grammaire : gustar / encantar (sing. / pl.), a mí / a ti / a Facu le…, preferir, ¿por qué? / porque, jugar a / tocar.
import { W, G, quest, flash, match, lcV, lcI, lcT as lcT0, dict, fill, reord, conj, dlg, read as read0, speak, tf, gram, writeFree, cine, P, L, C, NARR } from './lib.mjs';

// Varie la position de la bonne réponse (0, 1, 2…) des écoutes et des lectures pour qu'elle ne soit pas devinable.
let rot = 0;
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

  // ───────────── Vocabulario (50) ─────────────
  const vocab = [
    // deportes
    W('deporte', 'deporte', 'sport', '🏅', 'deportes', 'Mi deporte favorito es el baloncesto.', 'Mon sport préféré est le basket.', { genero: 'm', plural: 'deportes' }),
    W('futbol', 'fútbol', 'football (en Argentine et en Espagne, le sport roi)', '⚽', 'deportes', 'Me gusta el fútbol.', 'J’aime le foot.', { genero: 'm' }),
    W('baloncesto', 'baloncesto', 'basket-ball (en Argentine : « básquet » ; au Mexique : « basquetbol »)', '🏀', 'deportes', 'Mi hermano juega al baloncesto.', 'Mon frère joue au basket.', { genero: 'm' }),
    W('tenis', 'tenis', 'tennis', '🎾', 'deportes', 'Prefiero el tenis.', 'Je préfère le tennis.', { genero: 'm' }),
    W('natacion', 'natación', 'natation', '🏊', 'deportes', 'La natación es un deporte de agua.', 'La natation est un sport d’eau.', { genero: 'f' }),
    W('rugby', 'rugby', 'rugby (très populaire en Argentine : l’équipe nationale s’appelle « Los Pumas »)', '🏉', 'deportes', 'En Argentina también hay rugby.', 'En Argentine aussi, il y a du rugby.', { genero: 'm' }),
    W('bici', 'bici', 'vélo (abréviation de « bicicleta »)', '🚲', 'deportes', 'Voy al cole en bici.', 'Je vais à l’école à vélo.', { genero: 'f', plural: 'bicis' }),
    W('equipo', 'equipo', 'équipe', '👥', 'deportes', 'Boca es un equipo de fútbol.', 'Boca est une équipe de foot.', { genero: 'm', plural: 'equipos', exVoz: 'facu' }),
    W('partido', 'partido', 'match', '🆚', 'deportes', 'Hoy hay un partido de fútbol.', 'Aujourd’hui, il y a un match de foot.', { genero: 'm', plural: 'partidos' }),
    W('gol', 'gol', 'but (au foot)', '🥅', 'deportes', '¡Gol de Argentina!', 'But pour l’Argentine !', { genero: 'm', plural: 'goles', exVoz: 'facu' }),
    W('jugador', 'jugador', 'joueur', '🏃', 'deportes', 'Messi es un gran jugador.', 'Messi est un grand joueur.', { genero: 'm', femenino: 'jugadora', plural: 'jugadores' }),
    W('estadio', 'estadio', 'stade', '🏟️', 'deportes', 'El estadio de Boca es muy famoso.', 'Le stade de Boca est très célèbre.', { genero: 'm', plural: 'estadios' }),
    W('cancha', 'cancha', 'terrain de sport (en Argentine et en Amérique latine ; en Espagne : « campo » ou « pista »)', null, 'deportes', 'Jugamos en la cancha del barrio.', 'Nous jouons sur le terrain du quartier.', { genero: 'f', plural: 'canchas', ilustracion: 'Un terrain de foot de quartier avec deux buts, de l’herbe usée et des enfants qui jouent', voz: 'facu', exVoz: 'facu' }),
    W('hincha', 'hincha', 'supporter, fan d’une équipe', '📣', 'deportes', 'Soy hincha de Boca.', 'Je suis supporter de Boca.', { genero: 'mf', plural: 'hinchas', exVoz: 'facu' }),
    // ocio
    W('bailar', 'bailar', 'danser', '💃', 'ocio', 'A Sol le encanta bailar.', 'Sol adore danser.', { exVoz: 'sol' }),
    W('dibujar', 'dibujar', 'dessiner', '✏️', 'ocio', 'Me gusta dibujar animales.', 'J’aime dessiner des animaux.'),
    W('nadar_dep', 'nadar', 'nager', '🏊‍♂️', 'ocio', 'Me gusta nadar en verano.', 'J’aime nager en été.'),
    W('correr', 'correr', 'courir', '🏃‍♀️', 'ocio', 'Corro por el parque los domingos.', 'Je cours dans le parc le dimanche.'),
    W('jugar', 'jugar', 'jouer (à un jeu ou un sport : jugar al fútbol) ; juego = je joue', '🎲', 'ocio', 'Jugamos al fútbol en la cancha.', 'Nous jouons au foot sur le terrain.', { exVoz: 'facu' }),
    W('tocar', 'tocar', 'jouer d’un instrument (toco la guitarra) ; aussi : toucher', '🎶', 'ocio', 'Sol toca la guitarra.', 'Sol joue de la guitare.', { exVoz: 'sol' }),
    W('videojuegos', 'videojuegos', 'jeux vidéo', '🎮', 'ocio', 'Me gustan los videojuegos.', 'J’aime les jeux vidéo.', { genero: 'm', soloPlural: true }),
    W('pelicula', 'película', 'film', '🎬', 'ocio', 'Me encantan las películas de animales.', 'J’adore les films d’animaux.', { genero: 'f', plural: 'películas' }),
    W('pasear', 'pasear', 'se promener', '🚶‍♀️', 'ocio', 'Me gusta pasear por la ciudad.', 'J’aime me promener dans la ville.'),
    W('tiempo_libre', 'tiempo libre', 'temps libre, loisirs', '🕹️', 'ocio', 'En mi tiempo libre toco la guitarra.', 'Pendant mon temps libre, je joue de la guitare.', { genero: 'm' }),
    W('ver_tv', 'ver', 'voir, regarder (ver la tele, ver una película)', '📺', 'ocio', 'Me gusta ver películas con mi familia.', 'J’aime regarder des films avec ma famille.'),
    // instrumentos
    W('guitarra', 'guitarra', 'guitare', '🎸', 'instrumentos', 'Sol toca la guitarra muy bien.', 'Sol joue très bien de la guitare.', { genero: 'f', plural: 'guitarras', exVoz: 'sol' }),
    W('piano', 'piano', 'piano', '🎹', 'instrumentos', 'Mi abuela toca el piano.', 'Ma grand-mère joue du piano.', { genero: 'm', plural: 'pianos' }),
    W('violin', 'violín', 'violon', '🎻', 'instrumentos', 'El violín suena muy bonito.', 'Le violon sonne très bien.', { genero: 'm', plural: 'violines' }),
    W('bateria', 'batería', 'batterie (instrument)', '🥁', 'instrumentos', 'Mi primo toca la batería.', 'Mon cousin joue de la batterie.', { genero: 'f' }),
    W('trompeta', 'trompeta', 'trompette', '🎺', 'instrumentos', 'La trompeta suena muy fuerte.', 'La trompette sonne très fort.', { genero: 'f', plural: 'trompetas' }),
    W('bandoneon', 'bandoneón', 'bandonéon : instrument à soufflet, proche de l’accordéon, instrument typique du tango', null, 'instrumentos', 'Don Aníbal toca el bandoneón.', 'Don Aníbal joue du bandonéon.', { genero: 'm', plural: 'bandoneones', ilustracion: 'Un bandonéon : petit instrument à soufflet noir et carré, avec des boutons sur les deux côtés', voz: 'anibal', exVoz: 'anibal' }),
    W('flauta', 'flauta', 'flûte', null, 'instrumentos', 'Mi hermana toca la flauta.', 'Ma sœur joue de la flûte.', { genero: 'f', plural: 'flautas', ilustracion: 'Une flûte traversière argentée avec ses clés' }),
    // gustos
    W('gustar', 'gustar', 'plaire (me gusta = ça me plaît = j’aime)', '👍', 'gustos', 'Me gusta el tango.', 'J’aime le tango.'),
    W('encantar', 'encantar', 'adorer, enchanter (me encanta = j’adore)', '😍', 'gustos', 'Me encanta bailar.', 'J’adore danser.'),
    W('preferir', 'preferir', 'préférer (prefiero = je préfère)', '🥇', 'gustos', 'Prefiero el tenis al fútbol.', 'Je préfère le tennis au foot.'),
    W('porque', 'porque', 'parce que (en un seul mot, sans accent)', '💬', 'gustos', 'Me gusta porque es divertido.', 'J’aime ça parce que c’est amusant.'),
    W('por_que', '¿por qué?', 'pourquoi ? (en deux mots, avec accent)', '❓', 'gustos', '¿Por qué te gusta el tango?', 'Pourquoi aimes-tu le tango ?'),
    W('mucho', 'mucho', 'beaucoup', '➕', 'gustos', 'Me gusta mucho el mate.', 'J’aime beaucoup le maté.'),
    W('nada', 'nada', 'rien ; pas du tout (no me gusta nada = je n’aime pas du tout)', '🚫', 'gustos', 'No me gusta nada el rugby.', 'Je n’aime pas du tout le rugby.'),
    W('tampoco', 'tampoco', 'non plus (a mí tampoco = moi non plus)', '🙅', 'gustos', '—No me gusta el tenis. —A mí tampoco.', '— Je n’aime pas le tennis. — Moi non plus.'),
    W('favorito', 'favorito', 'préféré (favorito, favorita)', '⭐', 'gustos', 'Mi deporte favorito es el fútbol.', 'Mon sport préféré est le foot.', { adj: true, genero: 'm', femenino: 'favorita' }),
    W('aburrido', 'aburrido', 'ennuyeux (ser aburrido) ; aussi : ennuyé (estar aburrido)', '🥱', 'gustos', 'Para mí, los videojuegos son aburridos.', 'Pour moi, les jeux vidéo sont ennuyeux.', { adj: true, genero: 'm', femenino: 'aburrida' }),
    W('genial', 'genial', 'génial', '🤩', 'gustos', 'El tango es genial.', 'Le tango est génial.', { adj: true, genero: 'mf', plural: 'geniales' }),
    // cultura argentina
    W('tango', 'tango', 'tango : musique et danse en couple née à Buenos Aires et à Montevideo', '🕺', 'cultura', 'El tango se baila en pareja.', 'Le tango se danse à deux.', { genero: 'm', plural: 'tangos', exVoz: 'sol' }),
    W('mate', 'mate', 'maté : infusion chaude de yerba mate, qu’on partage avec une paille en métal (la bombilla)', '🧉', 'cultura', 'Los amigos comparten el mate.', 'Les amis partagent le maté.', { genero: 'm', plural: 'mates', exVoz: 'facu' }),
    W('asado', 'asado', 'asado : barbecue argentin (viande grillée), un repas en famille ou entre amis', '🥩', 'cultura', 'El domingo comemos asado en familia.', 'Le dimanche, nous mangeons un asado en famille.', { genero: 'm', plural: 'asados', exVoz: 'facu' }),
    W('dulce_de_leche', 'dulce de leche', 'confiture de lait (très aimée en Argentine)', '🍯', 'cultura', 'Me encanta el dulce de leche.', 'J’adore la confiture de lait.', { genero: 'm', exVoz: 'sol' }),
    W('che', 'che', 'che : interjection argentine pour appeler quelqu’un (« hé ! », « dis donc »)', '🇦🇷', 'cultura', '¡Che, vamos a jugar al fútbol!', 'Hé, allons jouer au foot !', { exVoz: 'facu', voz: 'facu' }),
    W('hace_calor', 'hace calor', 'il fait chaud (météo) ; pour une personne : tengo calor = j’ai chaud', '🥵', 'tiempo', 'En enero hace calor en Buenos Aires.', 'En janvier, il fait chaud à Buenos Aires.'),
    W('verano', 'verano', 'été (en Argentine, l’été va de décembre à mars : hémisphère sud)', '🌞', 'tiempo', 'En Argentina, enero es verano.', 'En Argentine, janvier est l’été.', { genero: 'm', plural: 'veranos' }),
  ];

  // ───────────── Gramática ─────────────
  const gramatica = [
    G('g_gustar', 'Me gusta el fútbol, me gustan los videojuegos', 'Aimer : gustar au singulier et au pluriel', [
      ['Me gusta el fútbol.', 'J’aime le foot (le foot me plaît).', 'facu', ['Me gusta']],
      ['Me gustan los videojuegos.', 'J’aime les jeux vidéo (les jeux vidéo me plaisent).', 'sol', ['Me gustan']],
      ['Me gusta bailar.', 'J’aime danser.', 'sol', ['Me gusta bailar']],
      ['No me gusta la natación.', 'Je n’aime pas la natation.', 'viajero', ['No me gusta']],
      ['¿Te gustan las películas?', 'Tu aimes les films ?', 'marina', ['¿Te gustan']],
    ], 'Con «gustar», lo que me gusta es el sujeto: si es una cosa (el fútbol) o un verbo (bailar), decimos «gusta»; si son varias cosas (los videojuegos), decimos «gustan». Delante va me, te, le…',
    'Avec « gustar », ce qui me plaît est le sujet : si c’est une seule chose (el fútbol) ou un verbe (bailar), on dit « gusta » ; si ce sont plusieurs choses (los videojuegos), on dit « gustan ». Devant, on met me, te, le…',
    "Gustar ne veut pas exactement dire « aimer » mais « plaire » : « me gusta el fútbol » = le foot me plaît. Comme en français, la chose qui plaît est le sujet du verbe, donc c'est elle qui décide de la terminaison : une chose singulière (me gusta el tango) ou un verbe à l'infinitif (me gusta bailar, toujours « gusta ») → « gusta » ; plusieurs choses (me gustan los videojuegos, me gustan el fútbol y el tenis) → « gustan ». Le petit mot avant le verbe indique à qui ça plaît : me (à moi), te (à toi), le (à lui, à elle), nos (à nous), os (à vous, en Espagne), les (à eux). Ces mots se mettent AVANT le verbe, et « no » se met avant eux : « no me gusta ». Dans une réponse courte, on ne répète pas le mot « yo » : « —¿Te gusta el tango? —Sí, me gusta. » Piège classique : ne pas dire « yo gusto el fútbol ». Pas de « de » devant le nom : me gusta el fútbol (pas « me gusta de fútbol »). Les articles el / la / los / las sont obligatoires devant le nom.",
    { encabezado: ['A quién', '+ singular / infinitivo', '+ plural'], filas: [['(a mí)', 'me gusta el tango', 'me gustan los videojuegos'], ['(a ti)', 'te gusta el tango', 'te gustan los videojuegos'], ['(a él / ella)', 'le gusta el tango', 'le gustan los videojuegos'], ['(a nosotros)', 'nos gusta el tango', 'nos gustan los videojuegos'], ['(a vosotros)', 'os gusta el tango', 'os gustan los videojuegos'], ['(a ellos / ellas)', 'les gusta el tango', 'les gustan los videojuegos']] }),
    G('g_escala', 'Me encanta, me gusta mucho, no me gusta nada', 'Dire à quel point on aime ; « moi aussi » et « moi non plus »', [
      ['Me encanta el tango.', 'J’adore le tango.', 'sol', ['Me encanta']],
      ['Me gusta mucho el mate.', 'J’aime beaucoup le maté.', 'facu', ['mucho']],
      ['No me gusta nada el rugby.', 'Je n’aime pas du tout le rugby.', 'facu', ['nada']],
      ['—Me gusta bailar. —A mí también.', '— J’aime danser. — Moi aussi.', 'sol', ['A mí también']],
      ['—No me gusta el tenis. —A mí tampoco.', '— Je n’aime pas le tennis. — Moi non plus.', 'marina', ['A mí tampoco']],
    ], 'Hay una escala: me encanta (¡me gusta muchísimo!) > me gusta mucho > me gusta > no me gusta mucho > no me gusta nada. Para estar de acuerdo: «a mí también» (si es sí) y «a mí tampoco» (si es no).',
    'Il y a une échelle : me encanta (j’adore !) > me gusta mucho > me gusta > no me gusta mucho > no me gusta nada. Pour être d’accord : « a mí también » (si c’est oui) et « a mí tampoco » (si c’est non).',
    "« Encantar » se construit exactement comme « gustar » : me encanta el tango (singulier), me encantan las películas (pluriel), me encanta bailar (infinitif). Pour nuancer, on ajoute « mucho » après le verbe (me gusta mucho) ou « nada » (no me gusta nada). Pour répondre « moi aussi » à une phrase positive, on dit « a mí también » ; pour répondre « moi non plus » à une phrase négative, on dit « a mí tampoco ». Si on n'est PAS d'accord, on dit « a mí sí » (moi si) après un « no me gusta », et « a mí no » (moi non) après un « me gusta ». Attention : après « tampoco », on ne remet pas de « no » : « a mí tampoco » (pas « a mí no tampoco »). Ne pas confondre « también » (aussi, affirmatif) et « tampoco » (non plus, négatif).",
    { encabezado: ['Nivel', 'Se dice'], filas: [['😍', 'me encanta(n)'], ['🙂', 'me gusta(n) mucho'], ['😐', 'me gusta(n)'], ['🙁', 'no me gusta(n) mucho'], ['😖', 'no me gusta(n) nada']] }),
    G('g_a_mi', 'A Sol le gusta el tango', 'Parler des autres : a mí, a ti, a Facu le…', [
      ['A mí me gusta el fútbol.', 'Moi, j’aime le foot.', 'facu', ['A mí me']],
      ['A ti te gustan los videojuegos, ¿verdad?', 'Toi, tu aimes les jeux vidéo, n’est-ce pas ?', 'marina', ['A ti te']],
      ['A Facu le gusta el fútbol.', 'Facu aime le foot.', 'sol', ['A Facu le']],
      ['A mis amigos les gusta el tango.', 'Mes amis aiment le tango.', 'sol', ['A mis amigos les']],
      ['A nosotros nos encanta el mate.', 'Nous, nous adorons le maté.', 'facu', ['A nosotros nos']],
    ], 'Para hablar de otra persona, ponemos «a + nombre» y «le» o «les» delante del verbo: A Facu le gusta el fútbol. A mis amigos les gusta el tango. «A mí» y «a ti» sirven para insistir.',
    'Pour parler d’une autre personne, on met « a + nom » et « le » ou « les » devant le verbe : A Facu le gusta el fútbol. A mis amigos les gusta el tango. « A mí » et « a ti » servent à insister.',
    "Pour dire ce qui plaît à QUELQU'UN D'AUTRE, quand on nomme la personne, on met « a + la personne » (souvent en début de phrase) ET le petit mot (le / les) devant le verbe : « A Sol le gusta el tango » (jamais « A Sol gusta… » ni « Sol le gusta… »). Le = une seule personne (él, ella, usted, Sol, mi hermano), les = plusieurs personnes (mis amigos, ellos, Facu y Sol). « Le » ne change pas pour un garçon ou une fille. « A mí me », « a ti te », « a nosotros nos » servent à insister ou à comparer (« A mí me gusta el fútbol, pero a ti te gusta el tenis »), et sont facultatifs (« me gusta el fútbol » suffit). Le verbe s'accorde toujours avec ce qui plaît : « A Sol le gustan las guitarras ». Piège : on ne répète pas : pas de « a Facu le gusta él » ni de « a mí me gusto ».",
    { encabezado: ['Persona', 'Se dice'], filas: [['a mí', 'me gusta'], ['a ti', 'te gusta'], ['a él / ella / Facu', 'le gusta'], ['a nosotros', 'nos gusta'], ['a vosotros', 'os gusta'], ['a ellos / mis amigos', 'les gusta']] }),
    G('g_preferir', 'Prefiero el tenis al fútbol', 'Préférer : preferir', [
      ['Prefiero el tenis al fútbol.', 'Je préfère le tennis au foot.', 'viajero', ['Prefiero', 'al']],
      ['¿Qué prefieres, bailar o cantar?', 'Que préfères-tu, danser ou chanter ?', 'sol', ['prefieres']],
      ['Sol prefiere la guitarra.', 'Sol préfère la guitare.', 'facu', ['prefiere']],
      ['Preferimos jugar en la cancha.', 'Nous préférons jouer sur le terrain.', 'facu', ['Preferimos']],
      ['Mis padres prefieren el tango.', 'Mes parents préfèrent le tango.', 'sol', ['prefieren']],
    ], 'Preferir es como querer: la e cambia a ie (prefiero, prefieres, prefiere), pero no con nosotros y vosotros (preferimos, preferís). Decimos «prefiero X a Y» (con «a» + «el» = «al»).',
    'Preferir fonctionne comme querer : le e devient ie (prefiero, prefieres, prefiere), mais pas avec nosotros et vosotros (preferimos, preferís). On dit « prefiero X a Y » (avec « a » + « el » = « al »).',
    "« Preferir » est un verbe à diphtongue (e → ie) comme « querer » : prefiero, prefieres, prefiere, preferimos, preferís, prefieren (nosotros et vosotros ne diphtonguent pas). Il se construit avec un nom ou un infinitif : « prefiero el tenis », « prefiero bailar ». Pour comparer, on met « a » devant la chose moins aimée : « prefiero el tenis AL fútbol » (a + el = al), « prefiero bailar A cantar » (à l'oral on entend aussi « que », mais apprends la forme avec « a »). Ce n'est PAS comme « gustar » : ici le verbe s'accorde avec la personne qui préfère (yo prefiero, tú prefieres), pas avec la chose. Pour demander : « ¿Qué prefieres, X o Y? ». En Argentine, on entendra « ¿qué preferís? » (voseo : « vos preferís ») – pour toi, « ¿qué prefieres? » est toujours correct.",
    { encabezado: ['Pronombre', 'preferir'], filas: [['yo', 'prefiero'], ['tú', 'prefieres'], ['él / ella', 'prefiere'], ['nosotros', 'preferimos'], ['vosotros', 'preferís'], ['ellos / ellas', 'prefieren']] }),
    G('g_porque', '¿Por qué…? Porque…', 'Pourquoi et parce que', [
      ['—¿Por qué te gusta el tango? —Porque es muy bonito.', '— Pourquoi aimes-tu le tango ? — Parce qu’il est très beau.', 'sol', ['¿Por qué', 'Porque']],
      ['Me gusta el fútbol porque es divertido.', 'J’aime le foot parce que c’est amusant.', 'facu', ['porque']],
      ['No me gustan los videojuegos porque son aburridos.', 'Je n’aime pas les jeux vidéo parce qu’ils sont ennuyeux.', 'marina', ['porque']],
      ['¿Por qué prefieres la guitarra?', 'Pourquoi préfères-tu la guitare ?', 'sol', ['¿Por qué']],
    ], 'Para preguntar, escribimos «¿por qué?» en dos palabras y con acento. Para responder, escribimos «porque» en una sola palabra y sin acento.',
    'Pour poser la question, on écrit « ¿por qué ? » en deux mots et avec accent. Pour répondre, on écrit « porque » en un seul mot et sans accent.',
    "¿Por qué? (deux mots, accent sur le é, avec ¿ ?) = pourquoi ? ; porque (un mot, sans accent) = parce que. C'est un piège d'orthographe, comme « pourquoi / parce que » en français. La réponse commence souvent par « porque » : —¿Por qué te gusta el fútbol? —Porque es divertido. On peut aussi mettre « porque » au milieu d'une phrase : me gusta el tango porque es bonito. Après « porque » on conjugue un verbe : porque es genial, porque son aburridos. Les adjectifs utiles pour justifier : divertido, aburrido, genial, bonito, difícil, fácil. À l'oral, l'intonation de « ¿por qué? » monte à la fin. Attention : le « qué » de ¿por qué? garde l'accent comme tous les mots interrogatifs (qué, cómo, dónde, cuándo).",
    { encabezado: ['Forma', 'Significado'], filas: [['¿por qué?', 'pourquoi ? (question)'], ['porque', 'parce que (réponse)']] }),
    G('g_jugar_tocar', 'Juego al fútbol, toco la guitarra', 'Jouer à un sport, jouer d’un instrument', [
      ['Juego al fútbol con mis amigos.', 'Je joue au foot avec mes amis.', 'facu', ['Juego al']],
      ['Facu juega al baloncesto los sábados.', 'Facu joue au basket le samedi.', 'sol', ['juega al']],
      ['Sol toca la guitarra.', 'Sol joue de la guitare.', 'facu', ['toca la']],
      ['¿Tocas el piano?', 'Tu joues du piano ?', 'anibal', ['Tocas el']],
      ['Jugamos al tenis en el parque.', 'Nous jouons au tennis au parc.', 'marina', ['Jugamos al']],
    ], 'Para un deporte decimos jugar a + el deporte: juego al fútbol («a» + «el» = «al»). Para un instrumento decimos tocar + el instrumento: toco la guitarra. Jugar cambia la u en ue: juego, juegas, juega, juegan.',
    'Pour un sport, on dit jugar a + le sport : juego al fútbol (« a » + « el » = « al »). Pour un instrument, on dit tocar + l’instrument : toco la guitarra. Jugar change le u en ue : juego, juegas, juega, juegan.',
    "En français on dit « jouer AU foot » et « jouer DU piano », et en espagnol aussi, mais avec d'autres mots : « jugar A + sport » (juego al fútbol, juego al tenis ; a + el = al) et « tocar + instrument » (toco el piano, toco la guitarra) – sans préposition. Ne dis jamais « juego la guitarra » ni « toco al fútbol ». Jugar est un verbe à diphtongue unique (u → ue, comme poder pour o → ue) : juego, juegas, juega, jugamos, jugáis, juegan (nosotros et vosotros ne diphtonguent pas). « Tocar » est régulier : toco, tocas, toca, tocamos, tocáis, tocan. Tocar veut aussi dire « toucher » dans d'autres contextes. En Argentine, le sport se dit pareil ; on y ajoute parfois « vos jugás » (voseo) à la place de « tú juegas ».",
    { encabezado: ['Pronombre', 'jugar (u→ue)', 'tocar'], filas: [['yo', 'juego', 'toco'], ['tú', 'juegas', 'tocas'], ['él / ella', 'juega', 'toca'], ['nosotros', 'jugamos', 'tocamos'], ['vosotros', 'jugáis', 'tocáis'], ['ellos / ellas', 'juegan', 'tocan']] }),
  ];

  // ───────────── Cinemáticas ─────────────
  const intro = cine('u07-intro', 'intro', 'Capítulo 7 · Me gusta… · Buenos Aires', [
    P(3, "La carte du monde en papel picado : la ligne dorée quitte Madrid, traverse l’Atlantique vers l’Amérique du Sud et descend jusqu’à l’estuaire du Río de la Plata ; carte-titre « Capítulo 7 · Me gusta… · Buenos Aires ».", [L(N, 'Capítulo siete: me gusta…', 'Chapitre sept : j’aime…')], { rotulo: 'Capítulo 7 · Me gusta… · Buenos Aires', camara: 'zoom avant progressif' }),
    P(5, "Buenos Aires en plein été : l’Obélisque au bout de l’avenue 9 de Julio, la Casa Rosada, les maisons peintes de Caminito à La Boca, des ballons de foot, des couples qui dansent, le Río de la Plata couleur café au lait.", [L(N, 'Buenos Aires. Fútbol, tango y mate.', 'Buenos Aires. Foot, tango et maté.'), L(N, 'Aquí, en enero, ¡es verano!', 'Ici, en janvier, c’est l’été !')], { camara: 'travelling aérien puis rue de Caminito' }),
  ]);
  const historia = cine('u07-historia', 'historia', 'El silencio de Buenos Aires', [
    P(7, "Caminito, à La Boca : maisons rouges, bleues, jaunes, vertes, sous un soleil d’été. Facu, 13 ans, maillot bleu et jaune, ballon sous le bras, court vers Álex, Marina et le Quetzal.", [
      L('facu', '¡Che, viajeros! Soy Facu, de La Boca. ¿Vos jugás al fútbol?', 'Hé, voyageurs ! Moi, c’est Facu, de La Boca. Tu joues au foot ? (« che » = hé ! ; en Argentine on dit « vos jugás » à la place de « tú juegas » : c’est le « voseo » ; tu n’as pas besoin de le dire, seulement de le comprendre)'),
      L('marina', 'Un poco. Pero hoy hace mucho calor.', 'Un peu. Mais aujourd’hui, il fait très chaud.'),
    ], { personajes: ['facu', 'marina', 'quetzal', 'viajero'], camara: 'plan large puis champ / contre-champ' }),
    P(7, "La feria de San Telmo : des couples dansent le tango dans un silence étrange ; Sol, 12 ans, serre sa guitare sans qu’aucune note ne sorte.", [
      L('sol', 'Hola, soy Sol. Me encanta la música, pero hoy no suena nada. ¡Todo está en silencio!', 'Salut, c’est Sol. J’adore la musique, mais aujourd’hui rien ne sonne. Tout est silencieux !'),
      L('marina', '¿Silencio? ¡Pero si la música es lo mejor de Buenos Aires!', 'Du silence ? Mais la musique, c’est ce qu’il y a de mieux à Buenos Aires !'),
    ], { personajes: ['sol', 'marina'], camara: 'plan moyen sur les danseurs, son coupé' }),
    P(7, "Don Aníbal, sombrero, tient son bandonéon sur les genoux et l’ouvre : aucun son. Une ombre noire glisse sur les instruments ; la foule hausse les épaules.", [
      L('anibal', 'Mi bandoneón ya no suena. Y la gente dice: «me da igual».', 'Mon bandonéon ne sonne plus. Et les gens disent : « ça m’est égal ».'),
      L('sombra', 'Sin gustos, no hay personas. Todo da igual… Silencio.', 'Sans goûts, pas de personnes. Tout est égal… Silence.'),
    ], { personajes: ['anibal', 'sombra'], musica: 'tension douce, accord de bandonéon étouffé' }),
    P(7, "Gros plan sur le soufflet du bandonéon : un reflet vert brille entre les plis. Le Quetzal s’approche, Sol serre sa guitare.", [
      L('quetzal', 'La pluma está dentro del bandoneón.', 'La plume est dans le bandonéon.'),
      L('sol', 'Para devolver la música, tienen que decir lo que les gusta. ¡Vamos!', 'Pour rendre la musique, vous devez dire ce que vous aimez. Allons-y ! (en Argentine, on dit « ustedes » : « tienen », « les » ; en Espagne on dirait « tenéis », « os »)'),
    ], { personajes: ['quetzal', 'sol'], musica: 'thème d’aventure, guitare et bandonéon' }),
  ]);
  const capsula = cine('u07-capsula-buenosaires', 'capsula', 'Fútbol, tango, mate… y vos', [
    P(4, "Style explainer, papier découpé : une carte de l’Argentine, Buenos Aires s’allume au bord de l’estuaire du Río de la Plata.", [L(N, 'Buenos Aires es la capital de Argentina. Está en la orilla del Río de la Plata.', 'Buenos Aires est la capitale de l’Argentine. Elle est au bord du Río de la Plata.')], { camara: 'plan fixe, animations de papier découpé' }),
    P(5, "Deux maillots, bleu et jaune contre rouge et blanc, se font face ; le stade de la Bombonera ; une coupe dorée avec trois dates qui s’allument : 1978, 1986, 2022.", [L(N, 'Boca y River son los dos grandes equipos. Su partido se llama el Superclásico. Argentina ganó el Mundial en 1978, 1986 y 2022.', 'Boca et River sont les deux grandes équipes. Leur match s’appelle le Superclásico. L’Argentine a gagné la Coupe du monde en 1978, 1986 et 2022.')]),
    P(6, "Un couple danse, un bandonéon joue ; un petit sceau « UNESCO 2009 » apparaît à côté d’une carte du Río de la Plata (Buenos Aires et Montevideo).", [L(N, 'El tango nace en Buenos Aires y Montevideo a finales del siglo diecinueve. Se baila en pareja. En 2009, la UNESCO lo declara Patrimonio Cultural Inmaterial de la Humanidad.', 'Le tango naît à Buenos Aires et à Montevideo à la fin du XIXe siècle. Il se danse à deux. En 2009, l’UNESCO le déclare Patrimoine culturel immatériel de l’humanité.')]),
    P(5, "Un maté en calebasse passe de main en main entre des amis assis sur un banc ; une bombilla en métal et un thermos d’eau chaude.", [L(N, 'El mate es una bebida caliente. Se toma con una bombilla y se comparte con los amigos: pasa de mano en mano.', 'Le maté est une boisson chaude. On le boit avec une paille en métal (bombilla) et on le partage avec les amis : il passe de main en main.')]),
    P(6, "Des bulles de dialogue : « vos sos », « vos querés », « che ». Un mot « me llamo » dont le « ll » se transforme en « sh ».", [L(N, 'En Argentina no dicen «tú», dicen «vos»: «vos sos», «vos querés». Para llamar a un amigo dicen «che». Y la «ll» suena casi «sh»: «me llamo» suena «me shamo».', 'En Argentine, on ne dit pas « tú », on dit « vos » : « vos sos », « vos querés ». Pour appeler un ami, on dit « che ». Et le « ll » sonne presque « ch » : « me llamo » sonne « me chamo ». (Tu n’as pas besoin de parler comme ça : tu dois seulement le comprendre.)')]),
  ]);
  const pluma = cine('u07-pluma', 'pluma', 'Séptima pluma', [
    P(3, "Le bandonéon se remplit d’air et chante ; la musique remplit la rue, les passants dansent ; une plume verte glisse du soufflet dans la main d’Álex.", [L('sol', '¡Suena! ¡La música vuelve! ¡Gracias, viajeros!', 'Ça sonne ! La musique revient ! Merci, voyageurs !')], { personajes: ['sol', 'anibal', 'facu'] }),
    P(3, "Le Quetzal fait une pirouette au-dessus de la place, ses plumes vibrent comme des cordes de guitare.", [L('quetzal', 'Siete plumas. ¡Ahora vuelo y canto!', 'Sept plumes. Maintenant je vole et je chante !')], { personajes: ['quetzal'] }),
    P(2, "Don Ignacio en hologramme ; sur la carte, une lumière monte vers les Andes colombiennes.", [L('ignacio', 'La siguiente pluma está en Bogotá, en Colombia. ¡Está muy alto, en las montañas!', 'La prochaine plume est à Bogotá, en Colombie. Elle est très haut, dans les montagnes !')], { personajes: ['ignacio'] }),
  ]);

  // ───────────── Misiones ─────────────
  const quests = [];

  // 1 — Cinemática
  quests.push(quest('u07', 1, 'cinematica', 'Llegada a Buenos Aires', '⚽',
    ['facu', '¡Che, bienvenidos a Buenos Aires! Acá todo es fútbol, tango y mate.', 'Hé, bienvenue à Buenos Aires ! Ici, tout est foot, tango et maté. (« acá » = ici, en Amérique latine ; en Espagne : « aquí »)'],
    'Arrivée à Buenos Aires, en été : tu rencontres Facu, Sol et Don Aníbal, et tu découvres le problème de la ville silencieuse. Les PNJ parlent espagnol d’Argentine : leurs mots qui diffèrent sont signalés en français.', ['escuchar', 'cultura', 'hablar'], 10, [
      intro,
      tf('Buenos Aires está en Argentina.', true, N, { tr: 'Buenos Aires est en Argentine.' }),
      tf('Buenos Aires está en Europa.', false, N, { tr: 'Buenos Aires est en Europe.' }),
      historia,
      flash('verano', 'hace_calor', 'che'),
      tf('En enero, en Buenos Aires, hace calor.', true, N, { img: 'hace_calor', tr: 'En janvier, à Buenos Aires, il fait chaud.', expl: ['En el hemisferio sur, enero es verano.', 'Dans l’hémisphère sud, janvier est l’été.'] }),
      lcT('Yo soy de La Boca y soy hincha de Boca. ¡Me encanta el fútbol!', 'facu', ['A Facu le gusta mucho un deporte.', 'Facu es de México y no juega al fútbol.', 'Facu odia los equipos de su barrio.'], 0),
      lcT('Hoy no puedo tocar la guitarra. ¡No hay sonido en la feria!', 'sol', ['Sol tiene un problema con la música.', 'Sol no sabe dónde está su guitarra.', 'Hoy hay un concierto muy grande.'], 0),
      dlg('facu', '¡Che, viajeros! Soy Facu. ¿Vos jugás al fútbol?', 'Hé, voyageurs ! Moi, c’est Facu. Tu joues au foot ? (« vos jugás » = « tú juegas » : voseo argentin)', [
        ['Sí, juego al fútbol con mis amigos.', 1, '¡Bárbaro! Entonces somos del mismo equipo.', 'Génial ! (« bárbaro » = super, en Argentine). Alors on est dans la même équipe.', 'Oui, je joue au foot avec mes amis.'],
        ['Sí, soy un balón.', 0, 'Ja, ja. ¡Entonces yo te pateo!', 'Ha, ha. Alors je te tape dedans ! (« patear » = taper dans un ballon)', 'Oui, je suis un ballon.'],
        ['Juego la guitarra.', 0, 'La guitarra no se juega, se toca. Pero me gusta tu idea.', 'La guitare, on n’en « joue » pas avec « jugar » : on dit « tocar ». Mais j’aime ton idée.', 'Je joue la guitare.'],
      ]),
      dlg('sol', '¡Hola! Soy Sol. ¿Cómo te llamás?', 'Salut ! Je suis Sol. Comment tu t’appelles ? (« te llamás » = « te llamas » en voseo)', [
        ['Me llamo Álex. Mucho gusto.', 1, '¡Mucho gusto, Álex! Bienvenido a Buenos Aires.', 'Enchantée, Álex ! Bienvenue à Buenos Aires.', 'Je m’appelle Álex. Enchanté.'],
        ['Soy Sol también.', 0, '¿Vos también sos Sol? ¡Qué lío!', 'Toi aussi, tu es Sol ? Quel bazar ! (« vos sos » = tú eres)', 'Moi aussi, je suis Sol.'],
        ['Son las doce en punto.', 0, 'Yo te pregunto cómo te llamás.', 'Moi, je te demande comment tu t’appelles.', 'Il est douze heures pile.'],
      ]),
      reord('Hola, Sol. Me llamo Álex y estoy en Buenos Aires.', 'viajero', { tr: 'Salut, Sol. Je m’appelle Álex et je suis à Buenos Aires.' }),
      speak('Hola, me llamo Álex y me gusta Buenos Aires.', 'viajero', { tr: 'Salut, je m’appelle Álex et j’aime Buenos Aires. (dis ton prénom)', nombre: 'Álex', hechizo: ['Hechizo de la bienvenida', 'Un balón de colores gira sobre la plaza'] }),
    ]));

  // 2 — Deportes
  quests.push(quest('u07', 2, 'vocabulario', 'Deportes en La Boca', '🏟️',
    ['facu', 'Mirá, esta es mi cancha. ¿Qué deportes te gustan?', 'Regarde, voilà mon terrain. Quels sports aimes-tu ? (« mirá » = « mira » en voseo)'],
    'Les sports et le foot (equipo, partido, gol, hincha) ; découverte de gustar : me gusta + singulier ou infinitif, me gustan + pluriel.', ['leer', 'escuchar', 'hablar', 'escribir'], 15, [
      flash('deporte', 'futbol', 'baloncesto', 'tenis', 'natacion', 'rugby', 'bici'),
      flash('equipo', 'partido', 'gol', 'jugador', 'estadio', 'cancha', 'hincha'),
      match(['futbol', 'baloncesto', 'tenis', 'natacion', 'rugby', 'bici']),
      lcV('tenis', ['baloncesto', 'tenis', 'rugby']),
      gram('g_gustar'),
      lcI('Mi deporte favorito es el baloncesto.', 'facu', 'baloncesto', ['futbol', 'baloncesto', 'tenis']),
      lcT('Me gustan el fútbol y el tenis, pero no me gusta nada la natación.', 'facu', ['Dos deportes le gustan y uno no.', 'Los tres deportes le gustan mucho.', 'Ningún deporte le gusta.'], 0),
      fill('Me ___ el fútbol.', 'gusta', 'facu', { opts: ['gusta', 'gustan', 'gusto'], tr: 'J’aime le foot. (une seule chose → gusta)' }),
      fill('Me ___ los deportes de equipo.', 'gustan', 'sol', { opts: ['gusta', 'gustan', 'gusto'], tr: 'J’aime les sports d’équipe. (plusieurs choses → gustan)' }),
      fill('¿Te ___ el tenis?', 'gusta', 'marina', { opts: ['gusta', 'gustan', 'gustas'], tr: 'Tu aimes le tennis ?' }),
      fill('No me gusta ___ la natación.', 'nada', 'facu', { opts: ['nada', 'nadie', 'siempre'], tr: 'Je n’aime pas du tout la natation.' }),
      reord('Me gustan los partidos de fútbol.', 'facu', { tr: 'J’aime les matchs de foot.' }),
      dlg('facu', '¿Qué deporte te gusta a vos?', 'Quel sport aimes-tu, toi ? (« a vos » = « a ti » en voseo)', [
        ['Me gusta el baloncesto.', 1, '¡Qué bueno! Un día jugamos un partido.', 'Super ! Un jour on jouera un match. (« ¡qué bueno! » : très courant en Argentine)', 'J’aime le basket.'],
        ['Me gustan baloncesto.', 0, 'Con «baloncesto» decimos «me gusta», en singular.', 'Avec « baloncesto », on dit « me gusta », au singulier.', 'J’aime basket.'],
        ['Gusto el baloncesto.', 0, 'No decimos «gusto». Decimos «me gusta».', 'On ne dit pas « gusto ». On dit « me gusta ».', 'Je plais le basket.'],
      ]),
      speak('Me gusta el fútbol.', 'viajero', { libre: 'fútbol', es: 'Escucha y di qué deporte te gusta a ti.', fr: 'Écoute et dis quel sport TU aimes (el baloncesto, el tenis, la natación…). Change « fútbol » (avec son article si tu changes pour un féminin : « la natación »).', tr: 'J’aime le foot. (dis ton sport)', hechizo: ['Hechizo del deporte', 'Un balón dorado sale disparado hacia el cielo'] }),
      dict('Me gustan los partidos de fútbol.', 'facu', { acept: ['me gustan los partidos de fútbol'] }),
    ]));

  // 3 — Tiempo libre
  quests.push(quest('u07', 3, 'vocabulario', 'Mi tiempo libre', '🎮',
    ['sol', 'Che, ¿qué hacés en tu tiempo libre? A mí me encanta bailar.', 'Dis donc, que fais-tu pendant ton temps libre ? Moi, j’adore danser. (« hacés » = « haces » en voseo)'],
    'Les loisirs (bailar, dibujar, jugar, ver películas…) ; me encanta, me gusta mucho, no me gusta nada ; « a mí también / a mí tampoco ». Tu écris TES goûts.', ['leer', 'escuchar', 'hablar', 'escribir'], 15, [
      flash('bailar', 'dibujar', 'nadar_dep', 'correr', 'jugar', 'tocar', 'videojuegos'),
      flash('pelicula', 'pasear', 'tiempo_libre', 'ver_tv', 'gustar', 'encantar', 'mucho'),
      match(['bailar', 'dibujar', 'nadar_dep', 'correr', 'tocar', 'pelicula']),
      gram('g_escala'),
      lcV('bailar', ['correr', 'bailar', 'dibujar']),
      lcT('Los sábados toco la guitarra y bailo tango con mis amigos.', 'sol', ['El sábado Sol se divierte con música y baile.', 'El sábado Sol no sale de casa.', 'Sol prefiere jugar al fútbol los sábados.'], 0),
      lcT('Después del colegio, juego al fútbol con mis amigos en la cancha.', 'facu', ['Facu hace deporte por la tarde con sus amigos.', 'Facu estudia solo en su casa.', 'Facu nada en la piscina cada día.'], 0),
      fill('Me ___ el tango: ¡es genial!', 'encanta', 'sol', { opts: ['encanta', 'encantan', 'encanto'], tr: 'J’adore le tango : c’est génial !' }),
      fill('Me gusta ___ el mate.', 'mucho', 'facu', { opts: ['mucho', 'muchos', 'muchas'], tr: 'J’aime beaucoup le maté.' }),
      fill('—Me gusta bailar. —A mí ___.', 'también', 'sol', { opts: ['también', 'tampoco', 'nada'], tr: '— J’aime danser. — Moi aussi.' }),
      tf('«Me encanta el tango» es lo mismo que «me gusta muchísimo el tango».', true, N, { tr: '« Me encanta el tango » veut dire la même chose que « j’aime énormément le tango ».' }),
      dlg('sol', '¿Qué te gusta en tu tiempo libre?', 'Qu’aimes-tu pendant ton temps libre ?', [
        ['Me gusta bailar y dibujar.', 1, '¡Qué lindo! A mí también me gusta dibujar.', 'Que c’est chouette ! (« lindo » = joli, en Argentine ; en Espagne : « bonito »). Moi aussi j’aime dessiner.', 'J’aime danser et dessiner.'],
        ['Me gustan bailar y dibujar.', 0, 'Con verbos, siempre «gusta»: «me gusta bailar y dibujar».', 'Avec des verbes, toujours « gusta » : « me gusta bailar y dibujar ».', 'J’aime (pluriel) danser et dessiner.'],
        ['Soy bailar.', 0, 'Mmm… no. Mejor: «me gusta bailar».', 'Mmm… non. Mieux : « me gusta bailar ».', 'Je suis danser.'],
      ]),
      speak('Me gusta bailar.', 'viajero', { libre: 'bailar', es: 'Escucha y di qué te gusta hacer a ti.', fr: 'Écoute et dis ce que TU aimes faire (dibujar, correr, ver películas, tocar el piano…). Change seulement « bailar ».', tr: 'J’aime danser. (dis ce que tu aimes faire)', hechizo: ['Hechizo del baile', 'Tus pies empiezan a bailar solos'] }),
      writeFree('Me gusta ___. Me encanta ___. No me gusta nada ___.', [
        { id: 'gusta', pista: 'Une chose que tu aimes (un verbe : leer, correr… ou un nom avec son article : la música…)', tipo: 'texto' },
        { id: 'encanta', pista: 'Une chose que tu adores (jugar al fútbol, el cine, el chocolate…)', tipo: 'texto' },
        { id: 'nada', pista: 'Une chose que tu n’aimes pas du tout (la natación, el rugby, madrugar = se lever très tôt…)', tipo: 'texto' },
      ], 'Me gusta leer. Me encanta el fútbol. No me gusta nada la natación.', 'J’aime lire. J’adore le foot. Je n’aime pas du tout la natation.', 'viajero', C('Escribe lo que te gusta y lo que no te gusta.', 'Écris ce que tu aimes et ce que tu n’aimes pas.')),
      dict('Me encanta el tango.', 'sol', { acept: ['me encanta el tango'] }),
    ]));

  // 4 — Música
  quests.push(quest('u07', 4, 'lectura', 'Música en San Telmo', '🎸',
    ['anibal', 'Buenas, muchachos. Yo toco el bandoneón desde los diez años. ¿Y ustedes, qué instrumento tocan?', 'Salut, les jeunes. Je joue du bandonéon depuis mes dix ans. Et vous, de quel instrument jouez-vous ? (« ustedes » : en Argentine, comme au Mexique, on dit « ustedes » à la place de « vosotros »)'],
    'Les instruments de musique, le bandonéon et le tango ; jugar a + sport et tocar + instrument ; compréhension d’un petit texte sur Don Aníbal.', ['leer', 'escuchar', 'hablar', 'cultura'], 15, [
      flash('guitarra', 'piano', 'violin', 'bateria', 'trompeta', 'bandoneon', 'flauta'),
      match(['guitarra', 'piano', 'violin', 'bateria', 'trompeta', 'musica']),
      lcI('Toco el piano todos los días.', 'anibal', 'piano', ['violin', 'piano', 'flauta']),
      gram('g_jugar_tocar'),
      fill('Facu ___ al fútbol los sábados.', 'juega', 'sol', { opts: ['juega', 'toca', 'juego'], tr: 'Facu joue au foot le samedi.' }),
      fill('Sol ___ la guitarra muy bien.', 'toca', 'facu', { opts: ['toca', 'juega', 'tocas'], tr: 'Sol joue très bien de la guitare.' }),
      fill('Juego ___ baloncesto con mis amigos.', 'al', 'facu', { opts: ['al', 'el', 'la'], tr: 'Je joue au basket avec mes amis. (jugar a + el = al)' }),
      fill('Toco ___ piano en la escuela.', 'el', 'anibal', { opts: ['al', 'el', 'de'], tr: 'Je joue du piano à l’école. (tocar + l’instrument, sans préposition)' }),
      read('Don Aníbal es músico. Toca el bandoneón en San Telmo desde los diez años. El bandoneón es un instrumento parecido a un acordeón y es el instrumento típico del tango. Sol toca la guitarra con él en la feria. A Sol le encanta la música, y a Don Aníbal también.', 'anibal',
        'Don Aníbal est musicien. Il joue du bandonéon à San Telmo depuis ses dix ans. Le bandonéon est un instrument semblable à un accordéon, et c’est l’instrument typique du tango. Sol joue de la guitare avec lui à la feria. Sol adore la musique, et Don Aníbal aussi.', [
          ['¿Dónde toca Don Aníbal?', 'Où joue Don Aníbal ?', ['En San Telmo.', 'En el colegio.', 'En un estadio.'], 0],
          ['¿Qué instrumento toca?', 'De quel instrument joue-t-il ?', ['La flauta.', 'El bandoneón.', 'La batería.'], 1],
          ['¿Qué le encanta a Sol?', 'Qu’est-ce que Sol adore ?', ['La música.', 'El rugby.', 'El asado.'], 0],
        ]),
      lcT('Toco el bandoneón desde los diez años. Hoy tengo setenta.', 'anibal', ['Don Aníbal es un músico con mucha experiencia.', 'Don Aníbal es un niño de diez años.', 'Don Aníbal empieza hoy a tocar.'], 0),
      dlg('sol', '¿Tocás algún instrumento?', 'Tu joues d’un instrument ? (« tocás » = « tocas » en voseo)', [
        ['Sí, toco el piano.', 1, '¡Qué lindo! Un día tocamos juntos.', 'Que c’est chouette ! Un jour, on jouera ensemble.', 'Oui, je joue du piano.'],
        ['Sí, juego el piano.', 0, 'Con los instrumentos decimos «tocar», no «jugar».', 'Avec les instruments, on dit « tocar », pas « jugar ».', 'Oui, je joue (au sens de « jugar ») le piano.'],
        ['Sí, soy piano.', 0, '¿Vos sos un piano? ¡Qué grande!', 'Toi, tu es un piano ? Quelle taille !', 'Oui, je suis piano.'],
      ]),
      dlg('anibal', '¿Querés escuchar el bandoneón, muchacho?', 'Tu veux écouter le bandonéon, mon garçon ? (« querés » = « quieres » en voseo)', [
        ['Sí, toca algo, por favor.', 1, 'Claro que sí. Escuchá bien.', 'Bien sûr. Écoute bien. (« escuchá » = « escucha » en voseo)', 'Oui, joue quelque chose, s’il te plaît.'],
        ['Sí, soy un bandoneón.', 0, '¿Un bandoneón? ¡Entonces tocá vos!', 'Un bandonéon ? Alors joue, toi ! (« tocá vos » = « toca tú » en voseo)', 'Oui, je suis un bandonéon.'],
        ['No, gracias. Prefiero el silencio.', 0, '¿El silencio? ¡Eso es lo que quiere la Sombra!', 'Le silence ? C’est justement ce que veut la Sombra !', 'Non, merci. Je préfère le silence.'],
      ]),
      speak('Toco la guitarra.', 'viajero', { libre: 'la guitarra', es: 'Escucha y di qué instrumento tocas tú.', fr: 'Écoute et dis de quel instrument TU joues (el piano, el violín, la flauta…). Si tu n’en joues pas, choisis-en un quand même. Change « la guitarra » (avec son article).', tr: 'Je joue de la guitare. (dis ton instrument)', hechizo: ['Hechizo de la música', 'Las cuerdas de tu guitarra brillan'] }),
      speak('Juego al tenis.', 'viajero', { libre: 'tenis', es: 'Escucha y di a qué deporte juegas tú.', fr: 'Écoute et dis à quel sport TU joues. Change « tenis » (fútbol, baloncesto, rugby… ; « al » devant un nom masculin).', tr: 'Je joue au tennis. (dis ton sport)', hechizo: ['Hechizo del juego', 'Una pelota de colores rebota por toda la feria'] }),
      dict('Don Aníbal toca el bandoneón.', 'anibal', { acept: ['don aníbal toca el bandoneón'] }),
    ]));

  // 5 — Forja : preferir y jugar
  quests.push(quest('u07', 5, 'forja', 'La Forja: preferir y jugar', '⚒️',
    ['quetzal', 'Prefiero. Juego. Dos verbos con cambio. ¡Forja!', 'Je préfère. Je joue. Deux verbes qui changent de voyelle. Forge !'],
    'Deux verbes à diphtongue : preferir (e→ie : prefiero) et jugar (u→ue : juego). Rappel : nosotros et vosotros ne diphtonguent pas.', ['escribir', 'leer', 'hablar'], 15, [
      flash('preferir'),
      gram('g_preferir'),
      conj('preferir', 'yo', 'prefier', 'o', ['o', 'es', 'e'], 'viajero', { tr: 'Moi, je préfère…' }),
      conj('preferir', 'tú', 'prefier', 'es', ['o', 'es', 'e'], 'sol', { tr: 'Toi, tu préfères…' }),
      conj('preferir', 'nosotros', 'prefer', 'imos', ['imos', 'ís', 'en'], 'facu', { tr: 'Nous, nous préférons… (pas de diphtongue !)' }),
      conj('preferir', 'ellos', 'prefier', 'en', ['imos', 'ís', 'en'], 'marina', { tr: 'Eux, ils préfèrent…' }),
      conj('jugar', 'yo', 'jueg', 'o', ['o', 'a', 'amos'], 'viajero', { tr: 'Moi, je joue…' }),
      conj('jugar', 'nosotros', 'jug', 'amos', ['o', 'a', 'amos'], 'facu', { tr: 'Nous, nous jouons… (pas de diphtongue !)' }),
      fill('Prefiero el tenis ___ fútbol.', 'al', 'viajero', { opts: ['al', 'que', 'de'], tr: 'Je préfère le tennis au foot. (a + el = al)' }),
      fill('¿Qué ___, bailar o cantar?', 'prefieres', 'sol', { opts: ['prefieres', 'prefieren', 'preferimos'], tr: 'Que préfères-tu, danser ou chanter ?' }),
      fill('Mis padres ___ el tango.', 'prefieren', 'sol', { opts: ['prefiere', 'prefieren', 'preferimos'], tr: 'Mes parents préfèrent le tango.' }),
      lcT('Prefiero el fútbol, pero mi hermano prefiere el rugby.', 'facu', ['Los dos hermanos tienen gustos diferentes.', 'Los dos hermanos aman el rugby.', 'El hermano no hace deporte.'], 0),
      dlg('facu', 'Yo prefiero el fútbol al baloncesto. ¿Y vos?', 'Moi, je préfère le foot au basket. Et toi ? (« ¿y vos? » = « ¿y tú? »)', [
        ['Yo prefiero el tenis al fútbol.', 1, '¡Bien! Cada uno con su deporte.', 'Bien ! Chacun son sport.', 'Moi, je préfère le tennis au foot.'],
        ['Yo prefiero tenis fútbol.', 0, 'Falta algo: «prefiero el tenis AL fútbol».', 'Il manque quelque chose : « prefiero el tenis AL fútbol ».', 'Moi, je préfère tennis foot.'],
        ['Yo prefiero soy el tenis.', 0, 'Dos verbos juntos no funcionan. «Prefiero el tenis».', 'Deux verbes à la suite ne marchent pas. « Prefiero el tenis ».', 'Moi, je préfère je suis le tennis.'],
      ]),
      speak('Prefiero bailar.', 'viajero', { libre: 'bailar', es: 'Escucha y di qué prefieres tú.', fr: 'Écoute et dis ce que TU préfères (cantar, dibujar, el fútbol, jugar con amigos…). Change seulement « bailar ».', tr: 'Je préfère danser. (dis ta préférence)', hechizo: ['Hechizo de la preferencia', 'Tu opción favorita brilla con una luz dorada'] }),
      writeFree('Prefiero ___ a ___.', [
        { id: 'prefiero', pista: 'Ce que tu préfères, à l’infinitif (bailar, leer, jugar al fútbol…)', tipo: 'texto' },
        { id: 'antes', pista: 'Ce que tu aimes moins, à l’infinitif (cantar, dibujar, nadar…)', tipo: 'texto' },
      ], 'Prefiero bailar a cantar.', 'Je préfère danser plutôt que chanter.', 'viajero', C('Escribe lo que prefieres.', 'Écris ce que tu préfères.')),
    ]));

  // 6 — Diálogo : ¿por qué?
  quests.push(quest('u07', 6, 'dialogo', '¿Por qué te gusta?', '💬',
    ['sol', 'Decime una cosa que te gusta… ¡y explicame por qué!', 'Dis-moi une chose que tu aimes… et explique-moi pourquoi ! (« decime », « explicame » = « dime », « explícame » en voseo)'],
    'Donner son avis et le justifier : ¿por qué ? / porque ; parler des goûts des autres (a Facu le gusta…) ; tu écris et tu dis TES goûts avec une raison.', ['hablar', 'escribir', 'escuchar', 'leer'], 15, [
      flash('favorito', 'aburrido', 'genial', 'nada', 'tampoco', 'porque', 'por_que'),
      gram('g_porque'),
      gram('g_a_mi'),
      lcT('Me gusta el fútbol porque es divertido y puedo jugar con mis amigos.', 'facu', ['Facu explica por qué le gusta un deporte.', 'Facu no quiere jugar con sus amigos.', 'Facu pregunta a sus amigos qué día juegan.'], 0),
      lcT('No me gustan los videojuegos porque son aburridos.', 'sol', ['Para Sol, los videojuegos no son divertidos.', 'A Sol le encantan los videojuegos.', 'Sol juega a los videojuegos todos los días.'], 0),
      fill('¿___ te gusta el tango? Porque es bonito.', 'Por qué', 'sol', { opts: ['Por qué', 'Porque', 'Porqué'], tr: 'Pourquoi aimes-tu le tango ? Parce que c’est joli.' }),
      fill('Me gusta la música ___ es muy bonita.', 'porque', 'sol', { opts: ['porque', 'por qué', 'porqué'], tr: 'J’aime la musique parce qu’elle est très belle.' }),
      fill('A Facu ___ gusta el fútbol.', 'le', 'sol', { opts: ['le', 'les', 'me'], tr: 'Facu aime le foot. (une seule personne → le)' }),
      fill('A mis amigos ___ encanta el mate.', 'les', 'facu', { opts: ['le', 'les', 'nos'], tr: 'Mes amis adorent le maté. (plusieurs personnes → les)' }),
      tf('Se dice: «A mis amigos le gusta el mate».', false, N, { tr: 'On dit : « A mis amigos le gusta el mate ».', expl: ['Con «mis amigos» (varias personas) decimos «les».', 'Avec « mis amigos » (plusieurs personnes), on dit « les ».'] }),
      dlg('facu', '¿Por qué te gusta el fútbol?', 'Pourquoi aimes-tu le foot ?', [
        ['Porque es divertido.', 1, '¡Bárbaro! Yo pienso lo mismo.', 'Génial ! Moi, je pense pareil.', 'Parce que c’est amusant.'],
        ['Por qué es divertido.', 0, 'Para responder usamos «porque», todo junto y sin acento.', 'Pour répondre, on utilise « porque », en un seul mot et sans accent.', 'Pourquoi c’est amusant. (question)'],
        ['Porque me llamo Álex.', 0, 'Eso no explica nada. ¿Por qué te gusta?', 'Ça n’explique rien. Pourquoi tu aimes ça ?', 'Parce que je m’appelle Álex.'],
      ]),
      dlg('sol', 'Che, ¿te gusta el tango?', 'Dis donc, tu aimes le tango ?', [
        ['Sí, me gusta mucho. ¡Es genial!', 1, '¡Qué bueno! Entonces te voy a enseñar un paso.', 'Super ! Alors je vais t’apprendre un pas. (« voy a enseñar » : futur proche, vu à Valence)', 'Oui, j’aime beaucoup. C’est génial !'],
        ['Sí, me gustan tango.', 0, 'Con «tango» decimos «me gusta»: es singular.', 'Avec « tango », on dit « me gusta » : c’est singulier.', 'Oui, j’aime (pluriel) tango.'],
        ['No, mi tango es azul.', 0, '¿Tu tango es azul? ¡Qué raro!', 'Ton tango est bleu ? Comme c’est bizarre !', 'Non, mon tango est bleu.'],
      ]),
      speak('Me gusta el tenis porque es divertido.', 'viajero', { libre: 'divertido', es: 'Escucha y di por qué te gusta algo a ti.', fr: 'Écoute et donne TA raison (genial, difícil, rápido, bonito…). Change seulement « divertido ».', tr: 'J’aime le tennis parce que c’est amusant. (change la raison)', hechizo: ['Hechizo de la razón', 'Una chispa verde confirma tu respuesta'] }),
      writeFree('Me gusta ___ porque ___. No me gusta ___ porque ___.', [
        { id: 'gusta', pista: 'Une chose que tu aimes (el fútbol, bailar, la música…)', tipo: 'texto' },
        { id: 'razon1', pista: 'Pourquoi ? (es divertido, es genial, es rápido…)', tipo: 'texto' },
        { id: 'nogusta', pista: 'Une chose que tu n’aimes pas (el rugby, madrugar = se lever très tôt, la natación…)', tipo: 'texto' },
        { id: 'razon2', pista: 'Pourquoi ? (es aburrido, es difícil, es muy largo…)', tipo: 'texto' },
      ], 'Me gusta el fútbol porque es divertido. No me gusta el rugby porque es difícil.', 'J’aime le foot parce que c’est amusant. Je n’aime pas le rugby parce que c’est difficile.', 'viajero', C('Escribe lo que te gusta y por qué.', 'Écris ce que tu aimes et pourquoi.')),
    ]));

  // 7 — Cultura
  quests.push(quest('u07', 7, 'cultura', 'Fútbol, tango y mate', '🧉',
    ['sol', 'Buenos Aires tiene mucha cultura: fútbol, tango, asado, mate… ¡y una manera de hablar muy suya!', 'Buenos Aires a beaucoup de culture : foot, tango, asado, maté… et une façon de parler bien à elle !'],
    'Le foot (Boca, River, la Bombonera, les Coupes du monde 1978, 1986, 2022), le tango (UNESCO 2009), le maté et le voseo (vos, che) ; puis tu dis ce que TOI tu aimes (sport, musique, plat).', ['cultura', 'leer', 'escribir', 'hablar'], 15, [
      flash('tango', 'mate', 'asado', 'dulce_de_leche'),
      capsula,
      tf('Argentina ganó el Mundial de fútbol en 2022.', true, N, { tr: 'L’Argentine a gagné la Coupe du monde de football en 2022.' }),
      tf('El mate es una bebida fría que se bebe sola.', false, N, { tr: 'Le maté est une boisson froide qu’on boit seul.', expl: ['El mate es caliente y se comparte con amigos.', 'Le maté est chaud et se partage entre amis.'] }),
      tf('En Argentina muchas personas dicen «vos» en vez de «tú».', true, N, { tr: 'En Argentine, beaucoup de gens disent « vos » à la place de « tú ».' }),
      read('Boca Juniors y River Plate son los dos equipos más famosos de Buenos Aires. Cuando juegan juntos, el partido se llama el Superclásico. El estadio de Boca se llama la Bombonera, en el barrio de La Boca. Los colores de Boca son el azul y el amarillo. Argentina ganó la Copa del Mundo en 1978, en 1986 y en 2022.', 'facu',
        'Boca Juniors et River Plate sont les deux équipes les plus célèbres de Buenos Aires. Quand elles jouent l’une contre l’autre, le match s’appelle le Superclásico. Le stade de Boca s’appelle la Bombonera, dans le quartier de La Boca. Les couleurs de Boca sont le bleu et le jaune. L’Argentine a gagné la Coupe du monde en 1978, en 1986 et en 2022.', [
          ['¿Cómo se llama el partido entre Boca y River?', 'Comment s’appelle le match entre Boca et River ?', ['El Superclásico.', 'El Gordo.', 'La Bombonera.'], 0],
          ['¿Qué colores tiene Boca?', 'Quelles couleurs a Boca ?', ['Azul y amarillo.', 'Rojo y blanco.', 'Verde y negro.'], 0],
          ['¿Cuántas veces ganó Argentina la Copa del Mundo, según el texto?', 'Combien de fois l’Argentine a-t-elle gagné la Coupe du monde, d’après le texte ?', ['Tres veces.', 'Una vez.', 'Diez veces.'], 0],
        ]),
      read('El tango es la música y el baile del Río de la Plata. Nace en Buenos Aires y Montevideo y se baila en pareja. El instrumento típico es el bandoneón. La UNESCO declaró el tango Patrimonio Cultural Inmaterial de la Humanidad en 2009. El mate es una bebida caliente. Se prepara con yerba mate y agua caliente. Los amigos comparten el mate: pasa de mano en mano.', 'sol',
        'Le tango est la musique et la danse du Río de la Plata. Il naît à Buenos Aires et à Montevideo et se danse à deux. L’instrument typique est le bandonéon. L’UNESCO a déclaré le tango Patrimoine culturel immatériel de l’humanité en 2009. Le maté est une boisson chaude. On le prépare avec de la yerba mate et de l’eau chaude. Les amis partagent le maté : il passe de main en main.', [
          ['¿Cómo se baila el tango?', 'Comment se danse le tango ?', ['En pareja.', 'Solo.', 'En un círculo de cien personas.'], 0],
          ['¿Cuándo declaró la UNESCO el tango patrimonio?', 'Quand l’UNESCO a-t-elle déclaré le tango patrimoine ?', ['En 2009.', 'En 1978.', 'En 2022.'], 0],
          ['¿Qué es el mate?', 'Qu’est-ce que le maté ?', ['Una bebida caliente.', 'Un deporte.', 'Un instrumento.'], 0],
        ]),
      lcT('Mi abuelo toma mate todas las tardes y mira el fútbol.', 'facu', ['Por las tardes, el abuelo de Facu bebe algo caliente.', 'El abuelo de Facu juega al fútbol cada mañana.', 'El abuelo de Facu no bebe nunca nada.'], 0),
      dlg('sol', '¿Querés un mate? Es una tradición compartirlo.', 'Tu veux un maté ? C’est une tradition de le partager. (« querés » = « quieres » en voseo)', [
        ['Sí, gracias. Voy a probarlo.', 1, '¡Cuidado, que está caliente! Se toma despacito.', 'Attention, il est chaud ! Ça se boit doucement. (« despacito » = tout doucement)', 'Oui, merci. Je vais le goûter.'],
        ['Sí, lo bebo con tenedor.', 0, '¿Con tenedor? ¡Qué cosa más rara!', 'Avec une fourchette ? Quelle drôle de chose !', 'Oui, je le bois avec une fourchette.'],
        ['Soy un mate caliente.', 0, 'Ja, ja. ¡Y yo soy una bombilla!', 'Ha, ha. Et moi, je suis une bombilla (la paille du maté) !', 'Je suis un maté chaud.'],
      ]),
      dlg('anibal', '¿Te gusta el tango, muchacho?', 'Tu aimes le tango, mon garçon ?', [
        ['Sí, me encanta el tango.', 1, 'Entonces tenés buen oído.', 'Alors tu as bonne oreille. (« tenés » = « tienes » en voseo)', 'Oui, j’adore le tango.'],
        ['Sí, me encantan tango.', 0, 'Con «tango» decimos «me encanta», singular.', 'Avec « tango », on dit « me encanta », au singulier.', 'Oui, j’adore (pluriel) tango.'],
        ['No, mi tango es un sombrero.', 0, '¡Mi sombrero no baila!', 'Mon chapeau ne danse pas !', 'Non, mon tango est un chapeau.'],
      ]),
      fill('El estadio de Boca se llama la ___.', 'Bombonera', 'facu', { opts: ['Bombonera', 'Casa Rosada', 'Obelisco'], tr: 'Le stade de Boca s’appelle la Bombonera.' }),
      writeFree('Mi deporte favorito es ___. Mi música favorita es ___. Mi comida favorita es ___.', [
        { id: 'deporte', pista: 'Ton sport préféré avec son article (el fútbol, el tenis, la natación…)', tipo: 'texto' },
        { id: 'musica', pista: 'Ta musique préférée (el rock, el pop, el rap, la música clásica…)', tipo: 'texto' },
        { id: 'comida', pista: 'Ton plat préféré (la pizza, la pasta, el asado, el chocolate…)', tipo: 'texto' },
      ], 'Mi deporte favorito es el fútbol. Mi música favorita es el rock. Mi comida favorita es la pizza.', 'Mon sport préféré est le foot. Ma musique préférée est le rock. Mon plat préféré est la pizza.', 'viajero', C('Escribe tus cosas favoritas.', 'Écris tes choses préférées.')),
      speak('Me encanta el tango.', 'viajero', { libre: 'el tango', es: 'Escucha y di qué te encanta a ti.', fr: 'Écoute et dis ce que TU adores (el dulce de leche, la música, jugar al fútbol…). Change « el tango » (avec son article ; s’il est pluriel, dis « me encantan »).', tr: 'J’adore le tango. (dis ce que tu adores)', hechizo: ['Hechizo de la pasión', 'Un corazón verde late en el aire'] }),
      dict('Me gusta el mate caliente.', 'sol', { acept: ['me gusta el mate caliente'] }),
    ]));

  // 8 — Desafío
  quests.push(quest('u07', 8, 'desafio', 'El silencio de la Sombra', '🎵',
    ['sombra', 'Todo da igual. Sin gustos no hay personas. Yo apago la música.', 'Tout est égal. Sans goûts, pas de personnes. Moi, j’éteins la musique.'],
    'Boss de Buenos Aires : révision mixte des unités 1 à 7 (présentation, description, heure, fêtes, ir a, gustar, preferir, porque) pour rendre sa voix à la musique.', ['escuchar', 'hablar', 'leer', 'escribir'], 15, [
      dlg('sombra', 'Todo me da igual. ¿Qué te gusta a ti?', 'Tout m’est égal. Qu’est-ce qui te plaît, à toi ?', [
        ['Me gusta el fútbol y me encanta la música.', 1, '¡Grr! Dos gustos que vuelven…', 'Grr ! Deux goûts qui reviennent…', 'J’aime le foot et j’adore la musique.'],
        ['Me gustan fútbol y música.', 0, 'Faltan los artículos: «el fútbol», «la música». ¡Otra vez!', 'Il manque les articles : « el fútbol », « la música ». Encore une fois !', 'J’aime foot et musique.'],
        ['Me gusta soy Álex.', 0, 'Eso no tiene sentido.', 'Ça n’a aucun sens.', 'J’aime je suis Álex.'],
      ]),
      dlg('sombra', '¿Por qué te gusta?', 'Pourquoi tu aimes ça ?', [
        ['Porque es divertido y genial.', 1, '¡Aaah! Otra razón que vuelve…', 'Aaah ! Une autre raison qui revient…', 'Parce que c’est amusant et génial.'],
        ['Por qué es divertido.', 0, 'Mal escrito: para responder, «porque».', 'Mal écrit : pour répondre, « porque ».', 'Pourquoi c’est amusant.'],
        ['Porque yo tengo doce años de azul.', 0, 'Eso no explica nada.', 'Ça n’explique rien.', 'Parce que j’ai douze ans de bleu.'],
      ]),
      lcT('A mi hermano le encantan los deportes, pero a mí me gusta más la música.', 'sol', ['Los dos hermanos tienen gustos distintos.', 'Los dos hermanos aman el mismo deporte.', 'A nadie le gusta la música.'], 0),
      lcT('Son las cinco y veinticinco de la tarde.', 'sombra', ['5:25 de la tarde', '4:35 de la tarde', '5:25 de la mañana'], 0),
      lcT('Hay que encender las luces del árbol de Navidad.', 'paloma', ['Es necesario dar luz a un árbol de fiesta.', 'Hay que apagar todas las luces.', 'Los regalos están en el árbol.'], 0),
      lcT('Mañana voy a ver un partido en la Bombonera con mi padre.', 'facu', ['Facu y su padre van a un estadio de fútbol.', 'Facu juega mañana al tenis con su madre.', 'Ayer fue un partido muy largo.'], 0),
      match(['futbol', 'guitarra', 'mate', 'tenis', 'piano', 'bici']),
      fill('Me ___ los videojuegos.', 'gustan', 'viajero', { opts: ['gusta', 'gustan', 'gusto'], tr: 'J’aime les jeux vidéo.' }),
      fill('A mi madre le ___ la música.', 'encanta', 'marina', { opts: ['encanta', 'encantan', 'encanto'], tr: 'Ma mère adore la musique.' }),
      fill('Sol ___ la guitarra.', 'toca', 'facu', { opts: ['toca', 'juega', 'tocan'], tr: 'Sol joue de la guitare.' }),
      fill('¿Por ___ te gusta el tango?', 'qué', 'sol', { opts: ['qué', 'que', 'porque'], tr: 'Pourquoi aimes-tu le tango ?' }),
      read('Hola, soy Facu. Tengo trece años y vivo en La Boca. Me encanta el fútbol y soy hincha de Boca. Mi hermana prefiere la música: toca la guitarra. Los sábados juego al fútbol con mis amigos y después tomamos mate. Mañana voy a ir a la Bombonera.', 'facu',
        'Salut, c’est Facu. J’ai treize ans et j’habite à La Boca. J’adore le foot et je suis supporter de Boca. Ma sœur préfère la musique : elle joue de la guitare. Le samedi, je joue au foot avec mes amis et après nous buvons du maté. Demain, je vais aller à la Bombonera.', [
          ['¿De qué equipo es hincha Facu?', 'De quelle équipe Facu est-il supporter ?', ['De Boca.', 'De River.', 'De Sevilla.'], 0],
          ['¿Qué prefiere su hermana?', 'Que préfère sa sœur ?', ['La música.', 'El rugby.', 'El tenis.'], 0],
          ['¿Qué hacen después del fútbol?', 'Que font-ils après le foot ?', ['Toman mate.', 'Duermen la siesta.', 'Van al colegio.'], 0],
        ]),
      reord('A Sol le gusta bailar tango con sus amigos.', 'sol', { tr: 'Sol aime danser le tango avec ses amis.' }),
      speak('Hola, me llamo Álex y me gusta la música.', 'viajero', { tr: 'Salut, je m’appelle Álex et j’aime la musique. (dis ton prénom)', nombre: 'Álex', hechizo: ['Hechizo final', '¡Buenos Aires recupera toda su música!'] }),
      pluma,
    ], { jefe: { personaje: 'sombra', vidas: 10 } }));

  return {
    id: 'u07', numero: 7, titulo: 'Me gusta…', lugar: 'Buenos Aires', emoji: '⚽', ejes: [3], periodo: 'ene-feb',
    objetivos: [
      { es: 'Decir qué deportes, actividades e instrumentos me gustan: me gusta, me gustan, me encanta.', fr: 'Dire quels sports, activités et instruments j’aime : me gusta, me gustan, me encanta.' },
      { es: 'Hablar de los gustos de otras personas: a Facu le gusta, a mis amigos les gusta.', fr: 'Parler des goûts des autres : a Facu le gusta, a mis amigos les gusta.' },
      { es: 'Decir lo que prefiero y explicarlo con porque.', fr: 'Dire ce que je préfère et l’expliquer avec porque.' },
      { es: 'Usar jugar a + deporte y tocar + instrumento.', fr: 'Utiliser jugar a + sport et tocar + instrument.' },
      { es: 'Escribir y decir mis gustos, mis cosas favoritas y mi tiempo libre.', fr: 'Écrire et dire mes goûts, mes choses préférées et mon temps libre.' },
      { es: 'Conocer Buenos Aires: el fútbol, el tango, el mate, y reconocer «vos» y «che».', fr: 'Connaître Buenos Aires : le foot, le tango, le maté, et reconnaître « vos » et « che ».' },
    ],
    vocab, gramatica, quests,
    pluma: { numero: 7, nombre: 'Pluma de la Música', descripcion: L('quetzal', 'Siete plumas. La música vuelve… ¡y yo canto!', 'Sept plumes. La musique revient… et moi je chante !') },
  };
}
