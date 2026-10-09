import type { Step, SpeakStep, WriteFreeStep } from '../content/schema';
import { ACCENT_WARNING, type Answer, type StepResult } from './types';
import { editDistance, foldAccents, normalize, typoBudget, wordsToNumber } from './text';
import { scoreSpeech } from './speech';

export type TextMatch = 'exact' | 'accent' | 'typo' | 'wrong';

export const SCORE = { exact: 1, accent: 0.75, typo: 0.6, wrong: 0 } as const;

/**
 * Compare une saisie a une ou plusieurs reponses attendues.
 *  exact  : meme texte (casse, ponctuation, espaces ignores)
 *  accent : meme texte aux accents pres (a/á, u/ü... ; le n/ñ reste une vraie difference)
 *  typo   : faute de frappe legere (Damerau-Levenshtein <= typoBudget), seulement si `typo` est active
 */
export function matchText(input: string, expected: string[], opts: { typo?: boolean } = {}): { kind: TextMatch; target: string } {
  const n = normalize(input);
  const targets = expected.map((e) => ({ e, ne: normalize(e) }));
  if (!n) return { kind: 'wrong', target: expected[0] };
  for (const t of targets) if (n === t.ne) return { kind: 'exact', target: t.e };
  const fn = foldAccents(n);
  for (const t of targets) if (fn === foldAccents(t.ne)) return { kind: 'accent', target: t.e };
  if (opts.typo) {
    let bestD = Infinity;
    let bestT = targets[0];
    for (const t of targets) {
      const fe = foldAccents(t.ne);
      const d = editDistance(fn, fe);
      if (d < bestD && d <= typoBudget(fe.length)) {
        bestD = d;
        bestT = t;
      }
    }
    if (bestD !== Infinity) return { kind: 'typo', target: bestT.e };
  }
  return { kind: 'wrong', target: expected[0] };
}

function fromMatch(m: { kind: TextMatch; target: string }, expected: string): StepResult {
  const warnings: string[] = [];
  if (m.kind === 'accent') warnings.push(ACCENT_WARNING);
  if (m.kind === 'typo') warnings.push('¡Casi! Revisa la ortografía.');
  return {
    outcome: m.kind === 'exact' ? 'correct' : m.kind === 'wrong' ? 'wrong' : 'partial',
    score: SCORE[m.kind],
    warnings,
    expected: m.kind === 'exact' ? undefined : expected,
  };
}

const bin = (ok: boolean, extra: Partial<StepResult> = {}): StepResult => ({ outcome: ok ? 'correct' : 'wrong', score: ok ? 1 : 0, warnings: [], ...extra });

const frac = (f: number): StepResult['outcome'] => (f >= 1 ? 'correct' : f > 0 ? 'partial' : 'wrong');

/** Corrige une reponse pour N'IMPORTE QUEL type d'etape. Pur et deterministe. */
export function gradeStep(step: Step, a: Answer): StepResult {
  if (a.tipo !== step.tipo) throw new Error(`Reponse ${a.tipo} pour une etape ${step.tipo}`);
  switch (step.tipo) {
    case 'flashcard':
      return { outcome: 'correct', score: 1, warnings: [], items: step.vocab.map((v) => ({ key: `v:${v}`, ok: true })) };
    case 'grammar_card':
    case 'cinematic_ref':
      return bin(true);
    case 'match_image': {
      const errors = (a as Extract<Answer, { tipo: 'match_image' }>).errors ?? {};
      const items = step.pares.map((p) => ({ key: `v:${p.vocab}`, ok: !(errors[p.vocab] > 0), credit: errors[p.vocab] ? (errors[p.vocab] === 1 ? 0.5 : 0) : 1 }));
      const score = items.reduce((s, i) => s + i.credit, 0) / Math.max(1, items.length);
      return { outcome: frac(score), score, warnings: [], items: items.map(({ key, ok }) => ({ key, ok })) };
    }
    case 'listen_choose': {
      const op = step.opciones[(a as { choice: number }).choice];
      const ok = !!op?.correcta;
      const right = step.opciones.find((o) => o.correcta);
      const items = right?.vocab ? [{ key: `v:${right.vocab}`, ok }] : undefined;
      return bin(ok, { items, expected: ok ? undefined : (right?.texto ?? right?.vocab) });
    }
    case 'dialogue_choice': {
      const op = step.opciones[(a as { choice: number }).choice];
      return bin(!!op?.correcta);
    }
    case 'true_false':
      return bin((a as { value: boolean }).value === step.correcta);
    case 'dictado': {
      const text = (a as { text: string }).text;
      return fromMatch(matchText(text, [step.respuesta, ...(step.aceptadas ?? [])], { typo: true }), step.respuesta);
    }
    case 'fill_blank': {
      const text = (a as { text: string }).text;
      return fromMatch(matchText(text, [step.respuesta, ...(step.aceptadas ?? [])]), step.respuesta);
    }
    case 'reorder_words': {
      const words = (a as { words: string[] }).words;
      const got = normalize(words.join(' '));
      const ok = got === normalize(step.palabras.join(' ')) || got === normalize(step.habla.es);
      return bin(ok, { expected: ok ? undefined : step.palabras.join(' '), items: [{ key: `p:${step.habla.audio}`, ok }] });
    }
    case 'conjugar': {
      const ans = a as { terminacion?: string; text?: string };
      let r: StepResult;
      if (ans.text != null) r = fromMatch(matchText(ans.text, [step.forma]), step.forma);
      else r = fromMatch(matchText(ans.terminacion ?? '', [step.terminacion]), step.terminacion);
      if (r.outcome === 'wrong') r.expected = ans.text != null ? step.forma : step.terminacion;
      r.items = [{ key: `g:${step.id}`, ok: r.outcome === 'correct' }];
      return r;
    }
    case 'read_answer': {
      const choices = (a as { choices: number[] }).choices;
      const detail: Record<string, boolean> = {};
      step.preguntas.forEach((q, i) => (detail[String(i)] = !!q.opciones[choices[i]]?.correcta));
      const ok = Object.values(detail).filter(Boolean).length;
      const score = ok / Math.max(1, step.preguntas.length);
      return { outcome: frac(score), score, warnings: [], detail };
    }
    case 'speak':
      return gradeSpeak(step, a as Extract<Answer, { tipo: 'speak' }>);
    case 'write_free':
      return gradeWriteFree(step, (a as { fields: Record<string, string> }).fields);
  }
}

function gradeSpeak(step: SpeakStep, a: Extract<Answer, { tipo: 'speak' }>): StepResult {
  const key = `p:${step.objetivo.audio}`;
  if (a.alts) {
    const s = scoreSpeech(step, a.alts);
    const score = s.level === 'logrado' ? 1 : s.level === 'casi' ? 0.5 : 0;
    return {
      outcome: s.level === 'logrado' ? 'correct' : s.level === 'casi' ? 'partial' : 'wrong',
      score,
      warnings: s.level === 'casi' ? ['¡Casi! Escucha otra vez y repite.'] : [],
      expected: s.level === 'logrado' ? undefined : step.objetivo.es,
      speech: s.level,
      items: [{ key, ok: s.level === 'logrado' }],
    };
  }
  // repli : auto-evaluation, credit plafonne (on ne sait pas ce qui a ete dit)
  const self = a.self ?? 'no';
  const score = self === 'bien' ? 0.6 : self === 'casi' ? 0.35 : 0;
  return { outcome: self === 'bien' ? 'correct' : self === 'casi' ? 'partial' : 'wrong', score, warnings: [], speech: 'autoevaluacion', items: [{ key, ok: self === 'bien' }] };
}

function gradeWriteFree(step: WriteFreeStep, fields: Record<string, string>): StepResult {
  const detail: Record<string, boolean> = {};
  const vals: string[] = [];
  for (const c of step.campos) {
    const v = (fields[c.id] ?? '').trim();
    vals.push(v);
    detail[c.id] = c.tipo === 'numero' ? wordsToNumber(v) !== null || /^\d+$/.test(v) : v.length > 0;
  }
  const ok = Object.values(detail).filter(Boolean).length;
  const score = ok / Math.max(1, step.campos.length);
  let i = 0;
  const filled = step.plantilla.replace(/___/g, () => vals[i++] || '___');
  return { outcome: frac(score), score, warnings: [], detail, filled };
}
