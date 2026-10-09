#!/usr/bin/env node
// Valide la coherence des contenus : characters.json + units/uNN.json (Node pur, sans dependance).
// Usage : node tools/content/validate.mjs     (code de sortie 1 s'il y a des erreurs)
import { audioKey, loadCharacters, loadUnits, normSpeech, collectSpoken, NOMBRE_LIBRE, patronRegex } from './lib.mjs';

const errors = [];
const warns = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warns.push(`${where}: ${msg}`);

const STATS = ['escuchar', 'hablar', 'leer', 'escribir', 'cultura'];
const QUEST_TIPOS = ['cinematica', 'vocabulario', 'escucha', 'dialogo', 'forja', 'lectura', 'escritura', 'hechizo', 'cultura', 'desafio'];
const STEP_TIPOS = ['flashcard', 'match_image', 'listen_choose', 'dictado', 'fill_blank', 'reorder_words', 'conjugar', 'dialogue_choice', 'read_answer', 'speak', 'true_false', 'grammar_card', 'write_free', 'cinematic_ref'];
const ESCENA_TIPOS = ['intro', 'historia', 'capsula', 'pluma'];
const SLUG = /^[a-z0-9_]+$/;
const nonEmpty = (s) => typeof s === 'string' && s.trim().length > 0;

// ── personnages ──
const chars = loadCharacters();
const charIds = new Set();
if (!Array.isArray(chars)) err('characters.json', 'doit etre un tableau');
for (const [i, c] of (Array.isArray(chars) ? chars : []).entries()) {
  const w = `characters[${i}:${c?.id}]`;
  for (const f of ['id', 'nombre', 'rol', 'region', 'voz', 'emoji', 'descripcion']) if (!nonEmpty(c[f])) err(w, `champ requis manquant : ${f}`);
  if (!SLUG.test(c.id ?? '')) err(w, 'id doit etre un slug [a-z0-9_]');
  if (charIds.has(c.id)) err(w, 'id duplique');
  charIds.add(c.id);
  if (!/^[a-z]{2}-[A-Z]{2}-[A-Za-z]+Neural$/.test(c.voz ?? '')) err(w, `voix edge-tts invalide : ${c.voz}`);
  if (c.tono) {
    if (c.tono.rate && !/^[+-]\d+%$/.test(c.tono.rate)) err(w, 'tono.rate attendu "+8%"');
    if (c.tono.pitch && !/^[+-]\d+Hz$/.test(c.tono.pitch)) err(w, 'tono.pitch attendu "+25Hz"');
  }
}
for (const need of ['narrador', 'viajero', 'quetzal', 'ignacio', 'marina', 'sombra']) if (!charIds.has(need)) err('characters.json', `personnage requis absent : ${need}`);
// prenom de l'avatar : un `speak` qui le fait dire doit offrir des `patrones` (l'eleve dit SON prenom)
const nombreViajero = normSpeech((Array.isArray(chars) ? chars : []).find((c) => c.id === 'viajero')?.nombre ?? '');

// ── texte espagnol : ponctuation ──
const PIEGES = [[/\bmas\b/i, 'más ?'], [/\bademas\b/i, 'además'], [/\bdespues\b/i, 'después'], [/\bestan\b/i, 'están ?'], [/\bpagina\b/i, 'página'], [/\bingles\b/i, 'inglés'], [/\bfrances\b/i, 'francés'], [/\bespanol\b/i, 'español'], [/\bsenor\b/i, 'señor'], [/\bmañana\b.*\bmañana\b/i, null]];
function checkEs(where, es) {
  if (es !== es.trim()) err(where, `espaces en bord : "${es}"`);
  if (/\s{2,}/.test(es)) err(where, `double espace : "${es}"`);
  const q1 = (es.match(/¿/g) || []).length, q2 = (es.match(/\?/g) || []).length;
  const e1 = (es.match(/¡/g) || []).length, e2 = (es.match(/!/g) || []).length;
  if (q1 !== q2) err(where, `¿ ? desequilibres : "${es}"`);
  if (e1 !== e2) err(where, `¡ ! desequilibres : "${es}"`);
  for (const [re, msg] of PIEGES) if (msg && re.test(es)) err(where, `accent/orthographe suspecte (${msg}) : "${es}"`);
}

const allVocab = new Map(); // id -> { v, unitIdx }
const allQuestIds = new Set();
const allStepIds = new Set();
const allCine = new Set();
const allEs = new Map();
const stats = [];

const units = loadUnits();
const hasImage = (v) => v && (nonEmpty(v.emoji) || nonEmpty(v.ilustracion));

function checkHabla(h, where, { needFr = false, defaultVoz = null } = {}) {
  if (!h || typeof h !== 'object') return err(where, 'texte parle manquant');
  if (!nonEmpty(h.es)) return err(where, 'es vide');
  checkEs(where, h.es);
  const voz = h.voz ?? defaultVoz;
  if (!voz) return err(where, 'voz manquante');
  if (!charIds.has(voz)) err(where, `voz inconnue : ${voz}`);
  if (h.audio !== audioKey(voz, h.es)) err(where, `cle audio incorrecte (attendue ${audioKey(voz, h.es)}, trouvee ${h.audio}) pour "${h.es}"`);
  if (needFr && !nonEmpty(h.fr)) err(where, `traduction/pista fr manquante pour "${h.es}"`);
}

units.forEach(({ file, data: u }, ui) => {
  const W = u.id ?? file;
  if (file !== `${u.id}.json`) err(W, `nom de fichier ${file} != id ${u.id}`);
  // Unite EVENEMENT (champ explicite `evento`) : fichier eNN.json, numero 0 (hors sequence), format allege.
  const EV = !!u.evento;
  if (!(EV ? /^e\d\d$/ : /^u\d\d$/).test(u.id ?? '')) err(W, EV ? 'unite evenement : id attendu eNN' : 'id attendu uNN');
  if (EV) {
    if (u.numero !== 0) err(W, 'unite evenement : numero 0 attendu (hors sequence)');
    if (!/^\d\d-\d\d$/.test(u.evento.desde ?? '') || !/^\d\d-\d\d$/.test(u.evento.hasta ?? '')) err(W, 'evento: {desde, hasta} au format "MM-DD"');
  } else if (u.numero !== Number((u.id ?? '').slice(1))) err(W, `numero ${u.numero} != id ${u.id}`);
  for (const f of ['titulo', 'lugar', 'emoji', 'periodo']) if (!nonEmpty(u[f])) err(W, `champ requis : ${f}`);
  if (!Array.isArray(u.ejes) || !u.ejes.length || u.ejes.some((e) => !(e >= 1 && e <= 6))) err(W, 'ejes: nombres 1-6');
  if (!Array.isArray(u.objetivos) || u.objetivos.length < 4) err(W, 'objetivos: au moins 4');
  (u.objetivos ?? []).forEach((o, i) => { if (!nonEmpty(o.es) || !nonEmpty(o.fr)) err(`${W}.objetivos[${i}]`, 'es + fr requis'); else checkEs(`${W}.objetivos[${i}]`, o.es); });
  checkHabla(u.pluma?.descripcion, `${W}.pluma.descripcion`, { needFr: true });
  if (!nonEmpty(u.pluma?.nombre)) err(W, 'pluma.nombre requis');

  // vocab
  const vocab = u.vocab ?? [];
  const [vMin, vMax] = EV ? [12, 30] : [40, 60];
  if (vocab.length < vMin || vocab.length > vMax) err(W, `vocabulaire : ${vocab.length} mots (attendu ${vMin}-${vMax})`);
  vocab.forEach((v, i) => {
    const w = `${W}.vocab[${i}:${v.id}]`;
    if (!SLUG.test(v.id ?? '')) err(w, 'id doit etre un slug');
    if (allVocab.has(v.id)) err(w, 'id de vocab duplique dans le jeu');
    allVocab.set(v.id, { v, ui });
    for (const f of ['es', 'fr']) if (!nonEmpty(v[f])) err(w, `champ requis : ${f}`);
    if (!hasImage(v)) err(w, 'emoji ou ilustracion requis');
    if (!Array.isArray(v.tags) || !v.tags.length) err(w, 'tags requis');
    if (v.genero && !['m', 'f', 'mf'].includes(v.genero)) err(w, 'genero invalide');
    checkHabla({ es: v.es, voz: v.voz, audio: v.audio }, w, { defaultVoz: 'narrador' });
    checkHabla(v.ejemplo, `${w}.ejemplo`, { needFr: true, defaultVoz: v.voz ?? 'narrador' });
    const k = v.es.toLowerCase();
    if (allEs.has(k)) warn(w, `mot deja present (${allEs.get(k)})`);
    allEs.set(k, v.id);
  });

  // grammaire
  const gramIds = new Set();
  (u.gramatica ?? []).forEach((g, i) => {
    const w = `${W}.gramatica[${i}:${g.id}]`;
    if (!SLUG.test(g.id ?? '')) err(w, 'id slug requis');
    if (gramIds.has(g.id)) err(w, 'id duplique');
    gramIds.add(g.id);
    if (!nonEmpty(g.titulo?.es) || !nonEmpty(g.titulo?.fr)) err(w, 'titulo es+fr requis');
    if (!Array.isArray(g.ejemplos) || g.ejemplos.length < 2) err(w, 'au moins 2 exemples');
    (g.ejemplos ?? []).forEach((e, j) => checkHabla(e, `${w}.ejemplos[${j}]`, { needFr: true }));
    checkHabla(g.regla, `${w}.regla`, { needFr: true });
    if (!nonEmpty(g.pista)) err(w, 'pista fr requise');
    if (g.tabla) {
      const n = g.tabla.encabezado?.length;
      if (!n || !g.tabla.filas?.length || g.tabla.filas.some((r) => r.length !== n)) err(w, 'tabla: filas de meme largeur que encabezado');
    }
  });

  // quetes
  const quests = u.quests ?? [];
  const [qMin, qMax] = EV ? [3, 4] : [7, 8];
  if (quests.length < qMin || quests.length > qMax) err(W, `${quests.length} quetes (attendu ${qMin}-${qMax})`);
  if (quests[0]?.tipo !== 'cinematica') err(W, 'la 1re quete doit etre de type cinematica');
  if (!quests.some((q) => q.tipo === 'cultura')) err(W, 'une quete cultura est requise');
  if (quests.at(-1)?.tipo !== 'desafio') err(W, 'la derniere quete doit etre un desafio');
  const shown = new Set();
  const usedGram = new Set();
  const seenQuestIds = new Set();
  let nSteps = 0;

  const vref = (id, w) => {
    const e = allVocab.get(id);
    if (!e) return err(w, `vocab inconnu : ${id}`), null;
    if (e.ui > ui) err(w, `vocab ${id} appartient a une unite posterieure`);
    return e.v;
  };

  quests.forEach((q, qi) => {
    const qw = `${W}.quests[${q.id}]`;
    if (!new RegExp(`^${u.id}-q\\d\\d$`).test(q.id ?? '')) err(qw, `id attendu ${u.id}-qNN`);
    if (allQuestIds.has(q.id)) err(qw, 'id de quete duplique');
    allQuestIds.add(q.id); seenQuestIds.add(q.id);
    if (!QUEST_TIPOS.includes(q.tipo)) err(qw, `tipo invalide : ${q.tipo}`);
    if (!nonEmpty(q.titulo)) err(qw, 'titulo requis');
    if (!nonEmpty(q.emoji)) err(qw, 'emoji requis');
    if (!nonEmpty(q.pista)) err(qw, 'pista fr requise');
    if (!(q.minutos > 0)) err(qw, 'minutos requis');
    checkEs(`${qw}.titulo`, q.titulo ?? '');
    checkHabla(q.intro, `${qw}.intro`, { needFr: true });
    if (!Array.isArray(q.stats) || !q.stats.length || q.stats.some((s) => !STATS.includes(s))) err(qw, 'stats invalides');
    if (q.tipo === 'desafio') { if (!q.jefe || !charIds.has(q.jefe.personaje) || !(q.jefe.vidas > 0)) err(qw, 'desafio: jefe {personaje, vidas} requis'); }
    const steps = q.steps ?? [];
    if (steps.length < 8 || steps.length > 15) err(qw, `${steps.length} etapes (attendu 8-15)`);
    nSteps += steps.length;

    steps.forEach((s, si) => {
      const sw = `${qw}.steps[${si}:${s.tipo}]`;
      if (s.id !== `${q.id}-s${String(si + 1).padStart(2, '0')}`) err(sw, `id attendu ${q.id}-sNN (${s.id})`);
      if (allStepIds.has(s.id)) err(sw, 'id de step duplique');
      allStepIds.add(s.id);
      if (!STEP_TIPOS.includes(s.tipo)) return err(sw, `tipo invalide : ${s.tipo}`);
      if (s.stat && !STATS.includes(s.stat)) err(sw, 'stat invalide');
      if (s.consigna !== undefined || !['flashcard', 'grammar_card', 'cinematic_ref'].includes(s.tipo)) checkHabla(s.consigna, `${sw}.consigna`, { needFr: true });
      if (s.consigna && s.consigna.voz !== 'narrador') warn(sw, 'consigna: voix narrador attendue');

      switch (s.tipo) {
        case 'flashcard':
          if (!s.vocab?.length || s.vocab.length > 7) err(sw, 'flashcard: 1 a 7 mots');
          (s.vocab ?? []).forEach((id) => { vref(id, sw); shown.add(id); });
          break;
        case 'match_image': {
          if ((s.pares?.length ?? 0) < 3) err(sw, 'match_image: au moins 3 paires');
          const ids = (s.pares ?? []).map((p) => p.vocab);
          if (new Set(ids).size !== ids.length) err(sw, 'paires dupliquees');
          ids.forEach((id) => { const v = vref(id, sw); if (v && !hasImage(v)) err(sw, `${id} sans image`); });
          break;
        }
        case 'listen_choose': {
          checkHabla(s.habla, `${sw}.habla`);
          if (!['imagen', 'texto'].includes(s.modo)) err(sw, 'modo invalide');
          const ops = s.opciones ?? [];
          if (ops.length < 2) err(sw, 'au moins 2 options');
          if (ops.filter((o) => o.correcta).length !== 1) err(sw, 'exactement une option correcte requise');
          const keys = ops.map((o) => (s.modo === 'imagen' ? o.vocab : o.texto));
          if (keys.some((k) => !nonEmpty(k))) err(sw, `options ${s.modo} incompletes`);
          if (new Set(keys).size !== keys.length) err(sw, 'options dupliquees');
          if (s.modo === 'texto') {
            // ecoute = comprehension : l'option juste ne doit pas recopier l'audio mot pour mot (reformuler)
            const A = normSpeech(s.habla?.es ?? '').split(' ');
            const ok = ops.find((o) => o.correcta);
            const O = normSpeech(ok?.texto ?? '').split(' ');
            const inA = O.filter((w) => A.includes(w)).length;
            const verbatim = O.length >= 2 && (inA === O.length || A.every((w) => O.includes(w)) || (O.length >= 4 && inA / O.length >= 0.8));
            if (ok && verbatim) err(sw, `ecoute : l'option juste "${ok.texto}" reprend l'audio "${s.habla.es}" (reformuler pour tester la comprehension)`);
          }
          if (s.modo === 'imagen') ops.forEach((o) => { const v = vref(o.vocab, sw); if (v && !hasImage(v)) err(sw, `${o.vocab} sans image`); });
          break;
        }
        case 'dictado':
          checkHabla(s.habla, `${sw}.habla`);
          if (!nonEmpty(s.respuesta)) err(sw, 'respuesta requise');
          else if (normSpeech(s.respuesta) !== normSpeech(s.habla?.es ?? '') && !(s.aceptadas?.length)) err(sw, 'respuesta != texte audio et pas d’aceptadas');
          break;
        case 'fill_blank': {
          checkHabla(s.habla, `${sw}.habla`);
          if ((s.frase?.match(/___/g) || []).length !== 1) err(sw, 'frase doit contenir un seul ___');
          if (!nonEmpty(s.respuesta)) err(sw, 'respuesta requise');
          if (s.habla?.es !== s.frase?.replace('___', s.respuesta)) err(sw, `habla (${s.habla?.es}) != frase completee`);
          if (s.opciones) {
            if (!s.opciones.includes(s.respuesta)) err(sw, 'la reponse correcte doit etre dans opciones');
            if (new Set(s.opciones).size !== s.opciones.length || s.opciones.length < 2) err(sw, 'opciones: >=2 et uniques');
          }
          if (s.frase) checkEs(`${sw}.frase`, s.frase);
          break;
        }
        case 'reorder_words':
          checkHabla(s.habla, `${sw}.habla`);
          if ((s.palabras?.length ?? 0) < 2) err(sw, 'au moins 2 mots');
          if (s.palabras?.join(' ') !== s.habla?.es) err(sw, 'palabras.join(" ") != habla.es');
          (s.senuelos ?? []).forEach((x) => { if (s.palabras.includes(x)) err(sw, `senuelo ${x} deja dans palabras`); });
          break;
        case 'conjugar':
          checkHabla(s.habla, `${sw}.habla`);
          if (s.forma !== s.radical + s.terminacion) err(sw, `forma ${s.forma} != radical+terminacion`);
          if (!s.terminaciones?.includes(s.terminacion)) err(sw, 'terminaciones doit contenir terminacion');
          if (new Set(s.terminaciones).size !== s.terminaciones?.length) err(sw, 'terminaciones dupliquees');
          if (s.habla?.es !== `${s.sujeto} ${s.forma}`) err(sw, `habla (${s.habla?.es}) != "sujeto forma"`);
          if (!nonEmpty(s.verbo)) err(sw, 'verbo requis');
          break;
        case 'dialogue_choice': {
          if (!charIds.has(s.pnj)) err(sw, `pnj inconnu : ${s.pnj}`);
          checkHabla(s.replica, `${sw}.replica`, { needFr: true });
          if (s.replica?.voz !== s.pnj) err(sw, 'replica.voz doit etre le pnj');
          const ops = s.opciones ?? [];
          if (ops.length < 2) err(sw, 'au moins 2 options');
          if (!ops.some((o) => o.correcta)) err(sw, 'au moins une option correcte');
          ops.forEach((o, j) => {
            checkHabla(o.habla, `${sw}.opciones[${j}].habla`);
            if (o.habla?.voz !== 'viajero') err(sw, `opciones[${j}]: voix viajero attendue`);
            checkHabla(o.reaccion, `${sw}.opciones[${j}].reaccion`, { needFr: true });
            if (!nonEmpty(o.reaccion?.emoji)) err(sw, `opciones[${j}]: reaccion.emoji requis`);
          });
          if (new Set(ops.map((o) => o.habla?.es)).size !== ops.length) err(sw, 'options dupliquees');
          break;
        }
        case 'read_answer':
          checkHabla(s.texto, `${sw}.texto`, { needFr: true });
          if (!s.preguntas?.length) err(sw, 'au moins une question');
          (s.preguntas ?? []).forEach((p, j) => {
            checkHabla(p.pregunta, `${sw}.preguntas[${j}]`, { needFr: true });
            if ((p.opciones?.length ?? 0) < 2 || p.opciones.filter((o) => o.correcta).length !== 1) err(sw, `preguntas[${j}]: >=2 options dont 1 correcte`);
          });
          break;
        case 'speak':
          checkHabla(s.objetivo, `${sw}.objetivo`, { needFr: true });
          if (!s.aceptadas?.length || s.aceptadas[0] !== normSpeech(s.objetivo?.es ?? '')) err(sw, 'aceptadas[0] doit valoir normSpeech(objetivo.es)');
          (s.aceptadas ?? []).forEach((a) => { if (a !== normSpeech(a)) err(sw, `aceptada non normalisee : "${a}"`); });
          if (new Set(s.aceptadas ?? []).size !== (s.aceptadas?.length ?? 0)) err(sw, 'aceptadas dupliquees');
          if (s.patrones !== undefined) {
            if (!Array.isArray(s.patrones) || !s.patrones.length) err(sw, 'patrones: tableau non vide attendu');
            (s.patrones ?? []).forEach((p) => {
              if (typeof p !== 'string' || p.split(NOMBRE_LIBRE).length !== 2) return err(sw, `patron "${p}" : exactement un ${NOMBRE_LIBRE} attendu`);
              const probe = p.replace(NOMBRE_LIBRE, 'x');
              if (probe !== normSpeech(probe) || !new RegExp(`(^| )${NOMBRE_LIBRE.replace(/[{}]/g, '\\$&')}( |$)`).test(p)) err(sw, `patron non normalise : "${p}"`);
            });
            if (s.aceptadas?.length && !(s.patrones ?? []).some((p) => typeof p === 'string' && patronRegex(p).test(s.aceptadas[0]))) err(sw, 'aucun patron ne reconnait aceptadas[0] (objetivo)');
          } else if (nombreViajero && normSpeech(s.objetivo?.es ?? '').split(' ').includes(nombreViajero)) {
            err(sw, `speak fait dire "${nombreViajero}" sans patrones : l'eleve doit pouvoir dire son prenom`);
          }
          break;
        case 'true_false':
          checkHabla(s.afirmacion, `${sw}.afirmacion`, { needFr: true });
          if (typeof s.correcta !== 'boolean') err(sw, 'correcta booleen requis');
          if (s.imagen) { const v = vref(s.imagen, sw); if (v && !hasImage(v)) err(sw, 'imagen sans image'); }
          if (s.explicacion) checkHabla(s.explicacion, `${sw}.explicacion`, { needFr: true });
          break;
        case 'grammar_card':
          if (!gramIds.has(s.ref)) err(sw, `carte de grammaire inconnue : ${s.ref}`);
          usedGram.add(s.ref);
          break;
        case 'write_free':
          if ((s.plantilla?.match(/___/g) || []).length !== s.campos?.length) err(sw, 'nombre de ___ != campos');
          (s.campos ?? []).forEach((c) => { if (!c.id || !nonEmpty(c.pista) || !['texto', 'numero'].includes(c.tipo)) err(sw, 'campo invalide'); });
          checkHabla(s.modelo, `${sw}.modelo`, { needFr: true });
          if (s.guardarEn !== 'perfil') err(sw, 'guardarEn: "perfil"');
          break;
        case 'cinematic_ref': {
          const e = s.escena;
          if (!e || e.id !== s.cinematica) err(sw, 'escena.id != cinematica');
          if (allCine.has(s.cinematica)) err(sw, `cinematique dupliquee : ${s.cinematica}`);
          allCine.add(s.cinematica);
          if (!ESCENA_TIPOS.includes(e?.tipo)) err(sw, 'escena.tipo invalide');
          const sum = (e?.planos ?? []).reduce((a, p) => a + p.duracion, 0);
          if (sum !== e?.duracion) err(sw, `duracion ${e?.duracion} != somme des plans ${sum}`);
          const [lo, hi] = { intro: [6, 12], historia: [15, 45], capsula: [12, 40], pluma: [2, 8] }[e?.tipo] ?? [0, 999];
          if (e && (e.duracion < lo || e.duracion > hi)) warn(sw, `duree ${e.duracion}s hors plage ${lo}-${hi}s pour ${e.tipo}`);
          (e?.planos ?? []).forEach((p, j) => {
            if (p.n !== j + 1) err(sw, `plan ${j}: n attendu ${j + 1}`);
            if (!(p.duracion > 0) || !nonEmpty(p.vista)) err(sw, `plan ${p.n}: duracion et vista requis`);
            if (!p.lineas?.length) err(sw, `plan ${p.n}: au moins une ligne`);
            (p.personajes ?? []).forEach((c) => { if (!charIds.has(c)) err(sw, `plan ${p.n}: personnage inconnu ${c}`); });
            (p.lineas ?? []).forEach((l, k) => checkHabla(l, `${sw}.planos[${j}].lineas[${k}]`, { needFr: true }));
          });
          break;
        }
      }
    });

    if (qi === 0 && q.tipo === 'cinematica') {
      const types = steps.filter((s) => s.tipo === 'cinematic_ref').map((s) => s.escena?.tipo);
      if (EV) { if (!types.includes('intro')) err(qw, 'evenement : la quete cinematica doit contenir une scene intro'); }
      else if (!types.includes('intro') || !types.includes('historia')) err(qw, 'la quete cinematica doit contenir une scene intro et une scene historia');
    }
    // evenement : 1-2 cinematiques au total, pas de scene pluma obligatoire (la recompense est l'element d'avatar)
    if (!EV && q.tipo === 'desafio' && !steps.some((s) => s.tipo === 'cinematic_ref' && s.escena?.tipo === 'pluma')) err(qw, 'le desafio doit finir sur une cinematique pluma');
    if (q.tipo === 'cultura' && !q.stats.includes('cultura')) err(qw, 'quete cultura: stat cultura requise');
  });

  for (const v of vocab) if (!shown.has(v.id)) err(`${W}.vocab[${v.id}]`, 'mot jamais presente dans une flashcard');
  for (const g of gramIds) if (!usedGram.has(g)) err(W, `carte de grammaire non utilisee : ${g}`);
  if (!EV && gramIds.size < 3) err(W, 'au moins 3 cartes de grammaire');

  const spoken = collectSpoken(u);
  const keys = new Map();
  for (const sp of spoken) {
    const prev = keys.get(sp.key);
    if (prev && prev !== sp.text) err(W, `collision de cle audio ${sp.key}: "${prev}" vs "${sp.text}"`);
    keys.set(sp.key, sp.text);
  }
  const cines = quests.flatMap((q) => q.steps.filter((s) => s.tipo === 'cinematic_ref'));
  if (EV && (cines.length < 1 || cines.length > 2)) err(W, `evenement : 1 a 2 cinematiques attendues (${cines.length})`);
  if (!EV && cines.length !== 4) warn(W, `${cines.length} cinematiques (4 attendues : intro, historia, capsula, pluma)`);
  stats.push({ unit: u.id, mots: vocab.length, gramatica: gramIds.size, quetes: quests.length, etapes: nSteps, cines: cines.length, audios: keys.size });
});

console.log('Unités :', units.length, '| personnages :', charIds.size);
console.table(stats);
if (warns.length) console.log(`\n${warns.length} avertissement(s) :\n` + warns.map((w) => ' ~ ' + w).join('\n'));
if (errors.length) {
  console.error(`\n${errors.length} ERREUR(S) :\n` + errors.map((e) => ' x ' + e).join('\n'));
  process.exit(1);
}
console.log('\nOK : 0 erreur.');
