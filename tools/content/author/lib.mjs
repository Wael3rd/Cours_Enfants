// Aides d'ecriture des unites (generent le JSON de reference des contenus).
// Usage : node tools/content/author/build.mjs   (ecrit apps/espagnol/src/content/units/uNN.json)
import { audioKey, normSpeech, NOMBRE_LIBRE } from '../lib.mjs';

export const NARR = 'narrador';
export const reg = new Map(); // registre global du vocabulaire (ordre de construction = ordre des unites)

// ── textes parles ──
export const H = (voz, es) => ({ es, voz, audio: audioKey(voz, es) });
export const L = (voz, es, fr) => ({ es, fr, voz, audio: audioKey(voz, es) });
export const C = (es, fr) => L(NARR, es, fr);

// ── vocabulaire ──
// W(id, es, fr, emoji, tag, exEs, exFr, opts?)  opts: genero, plural, femenino, ilustracion, voz, exVoz
export function W(id, es, fr, emoji, tag, exEs, exFr, o = {}) {
  if (reg.has(id)) throw new Error(`vocab duplique : ${id}`);
  const voz = o.voz ?? NARR;
  const v = { id, es, fr };
  if (o.genero) v.genero = o.genero;
  if (o.plural) v.plural = o.plural;
  if (o.femenino) v.femenino = o.femenino;
  if (emoji) v.emoji = emoji;
  if (o.ilustracion) v.ilustracion = o.ilustracion;
  v.tags = Array.isArray(tag) ? tag : [tag];
  v.ejemplo = L(o.exVoz ?? voz, exEs, exFr);
  v.audio = audioKey(voz, es);
  if (o.voz) v.voz = o.voz;
  reg.set(id, v);
  return v;
}
const vv = (id) => {
  const v = reg.get(id);
  if (!v) throw new Error(`vocab inconnu : ${id}`);
  return v;
};

// ── consignes usuelles ──
export const K = {
  elige: C('Escucha y elige la imagen.', "Écoute et choisis l'image."),
  eligeTexto: C('Escucha y elige.', 'Écoute et choisis.'),
  eligeRespuesta: C('Escucha y elige la respuesta.', 'Écoute et choisis la réponse.'),
  une: C('Une cada palabra con su imagen.', 'Relie chaque mot à son image.'),
  escribe: C('Escucha y escribe.', 'Écoute et écris.'),
  completa: C('Completa la frase.', 'Complète la phrase.'),
  ordena: C('Ordena las palabras.', 'Remets les mots dans l’ordre.'),
  forja: C('Forja la palabra correcta.', 'Forge le bon mot.'),
  responde: C('Responde.', 'Réponds.'),
  lee: C('Lee y contesta.', 'Lis et réponds.'),
  di: C('Escucha y repite el hechizo.', 'Écoute et répète le sort.'),
  diNombre: C('Escucha y repite el hechizo con tu nombre.', 'Écoute et répète le sort en disant TON prénom.'),
  diMio: C('Escucha y repite. Cambia la palabra por la tuya.', 'Écoute et répète. Remplace le mot par le tien (ta vraie réponse).'),
  vf: C('¿Verdadero o falso?', 'Vrai ou faux ?'),
  ficha: C('Escribe tu ficha de viajero.', 'Écris ta fiche de voyageur.'),
};
const cons = (c, es, fr) => (es ? C(es, fr) : c);

// ── etapes (les ids sont attribues par quest()) ──
export const flash = (...ids) => {
  ids.forEach(vv);
  return { tipo: 'flashcard', vocab: ids };
};
export const match = (ids, es, fr) => {
  ids.forEach((i) => { const v = vv(i); if (!v.emoji && !v.ilustracion) throw new Error('sin imagen ' + i); });
  return { tipo: 'match_image', consigna: cons(K.une, es, fr), pares: ids.map((vocab) => ({ vocab })) };
};
/** Ecoute le mot du vocab `ok` et choisit l'image parmi `ids` */
export const lcV = (ok, ids, o = {}) => {
  const v = vv(ok);
  return {
    tipo: 'listen_choose', consigna: cons(K.elige, o.es, o.fr), habla: H(v.voz ?? NARR, v.es), modo: 'imagen',
    opciones: ids.map((vocab) => ({ vocab, correcta: vocab === ok })),
  };
};
/** Ecoute `say` (voz) et choisit l'image `ok` parmi `ids` */
export const lcI = (say, voz, ok, ids, o = {}) => ({
  tipo: 'listen_choose', consigna: cons(K.elige, o.es, o.fr), habla: H(voz, say), modo: 'imagen',
  opciones: ids.map((vocab) => ({ vocab, correcta: vocab === ok })),
});
/** Ecoute `say` et choisit le texte `opts[ok]` */
export const lcT = (say, voz, opts, ok, o = {}) => ({
  tipo: 'listen_choose', consigna: cons(K.eligeTexto, o.es, o.fr), habla: H(voz, say), modo: 'texto',
  opciones: opts.map((texto, i) => ({ texto, correcta: i === ok })),
});
export const dict = (es, voz, o = {}) => ({
  tipo: 'dictado', consigna: cons(K.escribe, o.es, o.fr), habla: H(voz, es),
  respuesta: o.resp ?? es, ...(o.acept ? { aceptadas: o.acept } : {}),
});
export const fill = (frase, resp, voz, o = {}) => {
  if (!frase.includes('___')) throw new Error('fill sin ___ : ' + frase);
  return {
    tipo: 'fill_blank', consigna: cons(K.completa, o.es, o.fr), frase, respuesta: resp,
    ...(o.acept ? { aceptadas: o.acept } : {}), ...(o.opts ? { opciones: o.opts } : {}),
    habla: H(voz, frase.replace('___', resp)), ...(o.tr ? { fr: o.tr } : {}),
  };
};
export const reord = (es, voz, o = {}) => ({
  tipo: 'reorder_words', consigna: cons(K.ordena, o.es, o.fr), palabras: es.split(' '),
  ...(o.extra ? { senuelos: o.extra } : {}), habla: H(voz, es), ...(o.tr ? { fr: o.tr } : {}),
});
export const conj = (verbo, sujeto, radical, term, terms, voz = NARR, o = {}) => ({
  tipo: 'conjugar', consigna: cons(K.forja, o.es, o.fr), verbo, sujeto, radical, terminacion: term,
  terminaciones: terms, forma: radical + term, habla: H(voz, `${sujeto} ${radical}${term}`), ...(o.tr ? { fr: o.tr } : {}),
});
/** opts: [es, ok, reaccionEs, reaccionFr, fr?] */
export const dlg = (pnj, rEs, rFr, opts, o = {}) => ({
  tipo: 'dialogue_choice', consigna: cons(K.responde, o.es, o.fr), pnj, replica: L(pnj, rEs, rFr),
  opciones: opts.map(([es, ok, reEs, reFr, fr]) => ({
    habla: H('viajero', es), ...(fr ? { fr } : {}), correcta: !!ok,
    reaccion: { ...L(pnj, reEs, reFr), emoji: ok ? '😄' : '🤨' },
  })),
});
/** qs: [preguntaEs, preguntaFr, [opts], okIdx] */
export const read = (texto, voz, tFr, qs, o = {}) => ({
  tipo: 'read_answer', consigna: cons(K.lee, o.es, o.fr), texto: L(voz, texto, tFr),
  preguntas: qs.map(([q, qfr, opts, ok]) => ({
    pregunta: L(NARR, q, qfr), opciones: opts.map((texto, i) => ({ texto, correcta: i === ok })),
  })),
});
/**
 * o.nombre : prenom du modele ("Álex") que l'eleve peut remplacer par le sien -> patrones + consigne adaptee.
 * o.libre  : MOT du modele (ex. "castaño", "cuatro", "azul") que l'eleve remplace par sa propre reponse (1 a 3 mots) :
 *            il parle de LUI (description, vetements, famille). Meme mecanisme (patrones) ; consigne K.diMio.
 */
export const speak = (es, voz, o = {}) => {
  const aceptadas = [normSpeech(es), ...(o.acept ?? [])];
  let patrones;
  const libre = o.nombre ?? o.libre;
  if (libre) {
    const n = normSpeech(libre), n2 = n.normalize('NFD').replace(/\p{M}/gu, '').normalize('NFC');
    const esc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(^| )(?:${esc(n)}|${esc(n2)})(?= |$)`, 'g'); // mot ou groupe de mots remplace par le jeton
    patrones = [...new Set(aceptadas.map((a) => a.replace(re, `$1${NOMBRE_LIBRE}`)))]
      .filter((p) => p.includes(NOMBRE_LIBRE));
    if (!patrones.length) throw new Error(`speak: mot libre ${libre} absent de "${es}"`);
  }
  return {
    tipo: 'speak', consigna: o.nombre && !o.es ? K.diNombre : o.libre && !o.es ? K.diMio : cons(K.di, o.es, o.fr), objetivo: L(voz, es, o.tr ?? ''),
    aceptadas, ...(patrones ? { patrones } : {}),
    ...(o.foco ? { foco: o.foco } : {}), ...(o.hechizo ? { hechizo: { nombre: o.hechizo[0], efecto: o.hechizo[1] } } : {}),
  };
};
export const tf = (es, ok, voz, o = {}) => ({
  tipo: 'true_false', consigna: cons(K.vf, o.es, o.fr), afirmacion: L(voz, es, o.tr ?? ''), correcta: ok,
  ...(o.img ? { imagen: o.img } : {}), ...(o.expl ? { explicacion: L(NARR, o.expl[0], o.expl[1]) } : {}),
});
export const gram = (ref) => ({ tipo: 'grammar_card', ref });
export const writeFree = (plantilla, campos, mEs, mFr, voz = 'marina', consigna = K.ficha) => ({
  tipo: 'write_free', consigna, plantilla, campos, modelo: L(voz, mEs, mFr), guardarEn: 'perfil',
});

// ── cinematiques ──
export const P = (duracion, vista, lineas = [], o = {}) => ({ duracion, vista, ...o, lineas });
export function cine(id, tipo, titulo, planos) {
  return {
    tipo: 'cinematic_ref', cinematica: id,
    escena: {
      id, tipo, titulo, duracion: planos.reduce((s, p) => s + p.duracion, 0),
      planos: planos.map((p, i) => ({ n: i + 1, duracion: p.duracion, vista: p.vista, ...(p.camara ? { camara: p.camara } : {}),
        ...(p.personajes ? { personajes: p.personajes } : {}), ...(p.rotulo ? { rotulo: p.rotulo } : {}),
        lineas: p.lineas, ...(p.musica ? { musica: p.musica } : {}) })),
    },
  };
}

// ── gramatica ──
// G(id, tituloEs, tituloFr, [[es, fr, voz, resaltar?]], reglaEs, reglaFr, pista, tabla?)
export const G = (id, tEs, tFr, ejemplos, rEs, rFr, pista, tabla, reglaVoz = NARR) => ({
  id, titulo: { es: tEs, fr: tFr },
  ejemplos: ejemplos.map(([es, fr, voz, res]) => ({ ...L(voz ?? NARR, es, fr), ...(res ? { resaltar: res } : {}) })),
  regla: L(reglaVoz, rEs, rFr), pista, ...(tabla ? { tabla } : {}),
});

// ── quetes ──
export function quest(unitId, n, tipo, titulo, emoji, intro, pista, stats, minutos, steps, o = {}) {
  const id = `${unitId}-q${String(n).padStart(2, '0')}`;
  return {
    id, tipo, titulo, emoji, intro: L(intro[0], intro[1], intro[2]), pista, stats, minutos,
    ...(o.jefe ? { jefe: o.jefe } : {}),
    steps: steps.map((s, i) => ({ id: `${id}-s${String(i + 1).padStart(2, '0')}`, ...s })),
  };
}
