import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import {
  ACCENT_WARNING,
  activeEvents,
  addDays,
  applyStepResult,
  buildContent,
  buildMission,
  completeQuest,
  currentUnit,
  defaultState,
  eventWindow,
  gradeStep,
  inWindow,
  introduce,
  levelInfo,
  mastery,
  matchText,
  normalize,
  numberToWords,
  quality,
  questStatus,
  rarityOf,
  review,
  runEntry,
  scoreSpeech,
  starsFor,
  unitStatus,
  withItems,
  wordsToNumber,
  collectAudioKeys,
  type Content,
  type Step,
  type Unit,
} from '../src/engine';

const dir = join(import.meta.dirname, '../src/content');
const units: Unit[] = readdirSync(join(dir, 'units'))
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(join(dir, 'units', f), 'utf8')));
const chars = JSON.parse(readFileSync(join(dir, 'characters.json'), 'utf8'));
const c: Content = buildContent(units, chars);
const L = (es: string) => ({ es, fr: '', voz: 'narrador', audio: 'x' });
const NOW = new Date(2026, 9, 9, 12);

describe('texte', () => {
  it('normalise casse, ponctuation, espaces', () => {
    expect(normalize('  ¿Cómo  te LLAMAS?! ')).toBe('cómo te llamas');
  });
  it('nombres', () => {
    expect(numberToWords(34)).toBe('treinta y cuatro');
    expect(wordsToNumber('Doce')).toBe(12);
    expect(wordsToNumber('veintidos')).toBe(22);
  });
  it('accents / typo', () => {
    expect(matchText('Adios', ['adiós']).kind).toBe('accent');
    expect(matchText('adiós!', ['adiós']).kind).toBe('exact');
    expect(matchText('cuadreno', ['cuaderno'], { typo: true }).kind).toBe('typo');
    expect(matchText('cuadreno', ['cuaderno']).kind).toBe('wrong');
    expect(matchText('ano', ['año']).kind).toBe('wrong'); expect(matchText('manana', ['mañana']).kind).toBe('wrong'); // ñ != n : pas un simple accent
    expect(matchText('el', ['al'], { typo: true }).kind).toBe('wrong'); // mots courts : pas de tolerance
  });
});

describe('correction de chaque type', () => {
  const consigna = L('c');
  it('dictado', () => {
    const s: Step = { id: 'd', tipo: 'dictado', consigna, habla: L('x'), respuesta: 'Cómo estás', aceptadas: ['qué tal'] };
    expect(gradeStep(s, { tipo: 'dictado', text: 'como estas' })).toMatchObject({ outcome: 'partial', score: 0.75, warnings: [ACCENT_WARNING] });
    expect(gradeStep(s, { tipo: 'dictado', text: 'Qué tal.' }).outcome).toBe('correct');
    expect(gradeStep(s, { tipo: 'dictado', text: 'hola' }).outcome).toBe('wrong');
  });
  it('fill_blank : pas de tolerance de frappe', () => {
    const s: Step = { id: 'f', tipo: 'fill_blank', consigna, frase: 'Yo ___ Álex', respuesta: 'soy', habla: L('x') };
    expect(gradeStep(s, { tipo: 'fill_blank', text: 'soy' }).outcome).toBe('correct');
    expect(gradeStep(s, { tipo: 'fill_blank', text: 'son' }).outcome).toBe('wrong');
  });
  it('reorder / conjugar / listen / dialogue / true_false / read / flashcard / match', () => {
    const ro: Step = { id: 'r', tipo: 'reorder_words', consigna, palabras: ['Me', 'llamo', 'Álex'], habla: L('Me llamo Álex') };
    expect(gradeStep(ro, { tipo: 'reorder_words', words: ['me', 'llamo', 'álex'] }).outcome).toBe('correct');
    expect(gradeStep(ro, { tipo: 'reorder_words', words: ['llamo', 'me', 'álex'] }).expected).toBe('Me llamo Álex');
    const cj: Step = { id: 'cj', tipo: 'conjugar', consigna, verbo: 'hablar', sujeto: 'yo', radical: 'habl', terminacion: 'o', terminaciones: ['o', 'as'], forma: 'hablo', habla: L('yo hablo') };
    expect(gradeStep(cj, { tipo: 'conjugar', terminacion: 'o' }).outcome).toBe('correct');
    expect(gradeStep(cj, { tipo: 'conjugar', terminacion: 'as' }).outcome).toBe('wrong');
    expect(gradeStep(cj, { tipo: 'conjugar', text: 'hablo' }).items?.[0].key).toBe('g:cj');
    const lc: Step = { id: 'l', tipo: 'listen_choose', consigna, habla: L('x'), modo: 'imagen', opciones: [{ vocab: 'a', correcta: false }, { vocab: 'b', correcta: true }] };
    expect(gradeStep(lc, { tipo: 'listen_choose', choice: 1 }).items).toEqual([{ key: 'v:b', ok: true }]);
    const tf: Step = { id: 't', tipo: 'true_false', consigna, afirmacion: L('x'), correcta: false };
    expect(gradeStep(tf, { tipo: 'true_false', value: false }).outcome).toBe('correct');
    const ra: Step = {
      id: 'ra', tipo: 'read_answer', consigna, texto: L('t'),
      preguntas: [{ pregunta: L('q1'), opciones: [{ texto: 'a', correcta: true }, { texto: 'b', correcta: false }] }, { pregunta: L('q2'), opciones: [{ texto: 'a', correcta: false }, { texto: 'b', correcta: true }] }],
    };
    expect(gradeStep(ra, { tipo: 'read_answer', choices: [0, 0] })).toMatchObject({ outcome: 'partial', score: 0.5 });
    const mi: Step = { id: 'm', tipo: 'match_image', consigna, pares: [{ vocab: 'a' }, { vocab: 'b' }] };
    expect(gradeStep(mi, { tipo: 'match_image', errors: { a: 1 } }).score).toBe(0.75);
    expect(gradeStep({ id: 'fl', tipo: 'flashcard', vocab: ['a'] }, { tipo: 'flashcard' }).items?.length).toBe(1);
    expect(() => gradeStep(tf, { tipo: 'flashcard' })).toThrow();
  });
  it('write_free', () => {
    const w: Step = { id: 'w', tipo: 'write_free', consigna, plantilla: 'Me llamo ___. Tengo ___ años.', campos: [{ id: 'n', pista: '', tipo: 'texto' }, { id: 'e', pista: '', tipo: 'numero' }], modelo: L('m'), guardarEn: 'perfil' };
    const r = gradeStep(w, { tipo: 'write_free', fields: { n: 'Inès', e: 'doce' } });
    expect(r).toMatchObject({ outcome: 'correct', filled: 'Me llamo Inès. Tengo doce años.' });
    expect(gradeStep(w, { tipo: 'write_free', fields: { n: 'Inès', e: 'abc' } }).outcome).toBe('partial');
  });
});

describe('speak', () => {
  const sp: Step = { id: 's', tipo: 'speak', consigna: L('c'), objetivo: L('Hola, me llamo Álex.'), aceptadas: ['hola me llamo álex'] };
  const s = sp as Extract<Step, { tipo: 'speak' }>;
  it('seuils', () => {
    expect(scoreSpeech(s, ['hola me llamo alex']).level).toBe('logrado');
    expect(scoreSpeech(s, ['hola me llamo']).level).toBe('casi'); // 3/4 mots
    expect(scoreSpeech(s, ['buenos dias']).level).toBe('repetir');
    expect(scoreSpeech(s, ['xx', { transcript: 'Hola, me llamo Alex', confidence: 0.9 }]).level).toBe('logrado'); // meilleure alternative
  });
  it('chiffres de la reconnaissance', () => {
    const t: Step = { id: 't', tipo: 'speak', consigna: L('c'), objetivo: L('Tengo doce años.'), aceptadas: ['tengo doce años'] };
    expect(scoreSpeech(t as Extract<Step, { tipo: 'speak' }>, ['tengo 12 años']).level).toBe('logrado');
  });
  it('prenom libre (champ du schema)', () => {
    const f = { ...sp, nombreLibre: true } as unknown as Extract<Step, { tipo: 'speak' }>;
    expect(scoreSpeech(f, ['hola me llamo guillermo']).level).toBe('logrado');
    expect(scoreSpeech(s, ['hola me llamo guillermo']).level).toBe('casi');
  });
  it('prenom libre via patrones ({nombre})', () => {
    const f = { ...s, patrones: ['hola me llamo {nombre}'] } as Extract<Step, { tipo: 'speak' }>;
    expect(scoreSpeech(f, ['hola me llamo ines']).level).toBe('logrado');
    expect(scoreSpeech(f, ['hola me llamo maria del carmen']).level).toBe('logrado');
    expect(scoreSpeech(f, ['adios']).level).toBe('repetir');
  });
  it('auto-evaluation = credit plafonne', () => {
    expect(gradeStep(sp, { tipo: 'speak', self: 'bien' })).toMatchObject({ score: 0.6, speech: 'autoevaluacion' });
  });
});

describe('SRS', () => {
  it('intervalles 1 -> 3 -> x EF, echec = retour a 0', () => {
    let card = introduce('2026-10-09');
    expect(card.due).toBe('2026-10-10');
    card = review(card, 4, '2026-10-10');
    expect(card.interval).toBe(3);
    card = review(card, 4, '2026-10-13');
    expect(card.interval).toBeGreaterThanOrEqual(7);
    const lapsed = review(card, 1, card.due);
    expect(lapsed).toMatchObject({ reps: 0, due: card.due, lapses: 1 });
    expect(quality(1, 0, 3)).toBe(5);
    expect(quality(1, 1, 3)).toBe(3);
    expect(mastery(card)).toBeGreaterThanOrEqual(3);
  });
  it('pratique hors echeance sans gain', () => {
    const card = introduce('2026-10-09');
    expect(review(card, 5, '2026-10-09').interval).toBe(1);
  });
});

describe('RPG / progression', () => {
  it('niveaux', () => {
    expect(levelInfo(0, 60).level).toBe(1);
    expect(levelInfo(60, 60).level).toBe(2);
    expect(levelInfo(180, 60).level).toBe(3);
  });
  it('etoiles', () => {
    expect(starsFor(0.4, 0, 10)).toBe(0);
    expect(starsFor(0.95, 0, 10)).toBe(3);
    expect(starsFor(0.95, 9, 10)).toBe(2);
  });
  it('raretes deterministes', () => {
    expect(rarityOf({ es: 'sol' } as never)).toBe('comun');
  });
  it('quetes sequentielles, unites dans l\'ordre, plume + avatar', () => {
    const s = defaultState(NOW);
    const u1 = c.main[0];
    const u2 = c.main[1];
    expect(questStatus(c, s, u1.quests[0].id, NOW)).toBe('available');
    expect(questStatus(c, s, u1.quests[1].id, NOW)).toBe('locked');
    expect(unitStatus(c, s, u2, NOW)).toBe('locked');
    let last;
    for (const q of u1.quests) last = completeQuest(c, s, q.id, q.steps.map((st) => ({ stepId: st.id, tipo: st.tipo, score: 1, hints: 0 })), NOW);
    expect(last!.unitCompleted).toBe(true);
    expect(s.plumas[u1.id]).toBeTruthy();
    expect(s.unlocked).toContain(`av-${u1.id}`);
    expect(unitStatus(c, s, u2, NOW)).toBe('available');
    expect(currentUnit(c, s)?.id).toBe(u2.id);
  });
  it('XP, pistes et SRS via applyStepResult', () => {
    const s = defaultState(NOW);
    const step = c.steps.values().next().value!.step;
    const lc = [...c.steps.values()].find((e) => e.step.tipo === 'listen_choose' && e.step.opciones.some((o) => o.vocab))!.step as Extract<Step, { tipo: 'listen_choose' }>;
    const good = lc.opciones.findIndex((o) => o.correcta);
    const r = gradeStep(lc, { tipo: 'listen_choose', choice: good });
    const out = applyStepResult(c, s, lc, r, { now: NOW });
    expect(out.gain.xp).toBe(6); // 5 + 25 % sans piste
    expect(s.xp.escuchar).toBe(6);
    const out2 = applyStepResult(c, s, lc, r, { now: NOW, hints: 1 });
    expect(out2.gain.xp).toBe(5);
    expect(Object.keys(s.srs).length).toBeGreaterThan(0);
    expect(step).toBeTruthy();
  });
});

describe('evenements', () => {
  const ev = { ...units[0], id: 'e01', numero: 90, titulo: 'Día de Muertos', lugar: 'Oaxaca', evento: { desde: '10-25', hasta: '11-02' } } as Unit;
  it('fenetres', () => {
    expect(inWindow({ from: '10-25', to: '11-02' }, new Date(2026, 9, 31))).toBe(true);
    expect(inWindow({ from: '10-25', to: '11-02' }, new Date(2026, 10, 3))).toBe(false);
    expect(inWindow({ from: '12-01', to: '01-06' }, new Date(2027, 0, 5))).toBe(true);
    expect(inWindow({ from: '12-01', to: '01-06' }, new Date(2026, 5, 5))).toBe(false);
  });
  it('unite evenement ouverte seulement dans la fenetre', () => {
    const cc = buildContent([...units, ev], chars);
    expect(cc.events.map((u) => u.id)).toContain('e01');
    expect(cc.main.map((u) => u.id)).not.toContain('e01');
    const s = defaultState(NOW);
    expect(unitStatus(cc, s, ev, NOW)).toBe('closed');
    expect(unitStatus(cc, s, ev, new Date(2026, 9, 28))).toBe('available');
    expect(activeEvents(cc, s, new Date(2026, 9, 28)).length).toBe(1);
    // plus aucune heuristique par mots-cles : sans `evento`, "Navidad" / "Muertos" = unite ordinaire
    expect(eventWindow({ ...ev, evento: undefined, titulo: '¡Feliz Navidad!', lugar: 'Madrid' } as Unit)).toBeNull();
    expect(eventWindow({ ...ev, evento: { desde: '03-01', hasta: '03-10' } } as unknown as Unit)).toEqual({ from: '03-01', to: '03-10' });
  });
});

describe('Mision del dia', () => {
  it('nouveaux mots puis dus, deterministe, jouable', () => {
    const s = defaultState(NOW);
    const m1 = buildMission(c, s, { now: NOW });
    expect(m1.newCount).toBeGreaterThan(0);
    expect(m1.exercises[0].step.tipo).toBe('flashcard');
    expect(JSON.stringify(buildMission(c, s, { now: NOW }))).toBe(JSON.stringify(m1));
    // simule la mission jouee : tout correct
    for (const ex of m1.exercises) {
      const st = ex.step;
      const ans =
        st.tipo === 'flashcard' ? { tipo: 'flashcard' as const }
        : st.tipo === 'listen_choose' ? { tipo: 'listen_choose' as const, choice: st.opciones.findIndex((o) => o.correcta) }
        : st.tipo === 'dictado' ? { tipo: 'dictado' as const, text: st.respuesta }
        : { tipo: 'match_image' as const };
      applyStepResult(c, s, st, withItems(gradeStep(st, ans), ex), { now: NOW });
    }
    expect(Object.keys(s.srs).length).toBe(m1.newCount);
    // demain : les mots introduits sont dus et passent AVANT les nouveaux
    const tomorrow = new Date(2026, 9, 10, 12);
    const m2 = buildMission(c, s, { now: tomorrow });
    expect(m2.dueCount).toBe(m1.newCount);
    expect(m2.exercises[0].kind).toBe('review');
    expect(m2.exercises.some((e) => e.kind === 'new')).toBe(true);
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01');
  });
});

describe('contenu reel', () => {
  it('indexe et collecte l\'audio', () => {
    expect(c.main.length).toBe(units.length);
    expect(c.vocab.size).toBeGreaterThan(100);
    expect(collectAudioKeys(units[0]).length).toBeGreaterThan(100);
  });
  it('toute etape du contenu est corrigeable', () => {
    for (const { step } of c.steps.values()) {
      const a = sampleCorrect(step);
      const r = gradeStep(step, a);
      expect(r.score, step.id).toBeGreaterThan(0.5);
    }
  });
});

function sampleCorrect(st: Step) {
  switch (st.tipo) {
    case 'flashcard': case 'grammar_card': case 'cinematic_ref': return { tipo: st.tipo } as never;
    case 'match_image': return { tipo: st.tipo };
    case 'listen_choose': case 'dialogue_choice': return { tipo: st.tipo, choice: st.opciones.findIndex((o) => o.correcta) };
    case 'dictado': case 'fill_blank': return { tipo: st.tipo, text: st.respuesta };
    case 'reorder_words': return { tipo: st.tipo, words: st.palabras };
    case 'conjugar': return { tipo: st.tipo, text: st.forma };
    case 'read_answer': return { tipo: st.tipo, choices: st.preguntas.map((q) => q.opciones.findIndex((o) => o.correcta)) };
    case 'speak': return { tipo: st.tipo, alts: [st.objetivo.es] };
    case 'true_false': return { tipo: st.tipo, value: st.correcta };
    case 'write_free': return { tipo: st.tipo, fields: Object.fromEntries(st.campos.map((f) => [f.id, f.tipo === 'numero' ? '12' : 'Álex'])) };
  }
}
void runEntry;
