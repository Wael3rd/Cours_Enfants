import type { Consigna, Personaje, Step, StepTipo, Unit, Vocab } from '../content/schema';
import type { Content } from './types';
import { eventWindow } from './calendar';

/** Indexe les contenus bruts (units + characters). Pur. */
export function buildContent(units: Unit[], characters: Personaje[]): Content {
  const sorted = [...units].sort((a, b) => a.numero - b.numero || a.id.localeCompare(b.id));
  const events = sorted.filter((u) => eventWindow(u));
  const main = sorted.filter((u) => !eventWindow(u));
  const c: Content = {
    units: sorted,
    main,
    events,
    vocab: new Map(),
    characters,
    steps: new Map(),
    grammar: new Map(),
    unitById: new Map(),
    questUnit: new Map(),
  };
  for (const u of sorted) {
    c.unitById.set(u.id, u);
    for (const v of u.vocab) if (!c.vocab.has(v.id)) c.vocab.set(v.id, { ...v, unitId: u.id });
    for (const g of u.gramatica) c.grammar.set(g.id, g);
    for (const q of u.quests) {
      c.questUnit.set(q.id, u.id);
      for (const s of q.steps) c.steps.set(s.id, { step: s, unitId: u.id, questId: q.id });
    }
  }
  return c;
}

/** Voix d'un mot de vocabulaire. */
export const vocabVoice = (v: Vocab) => v.voz ?? 'narrador';

/** Premiere consigne (voix narrador) trouvee pour un type d'etape : sert aux exercices generes. */
export function consignaFor(c: Content, tipo: StepTipo): Consigna {
  for (const { step } of c.steps.values()) {
    if (step.tipo === tipo && 'consigna' in step) return (step as Step & { consigna: Consigna }).consigna;
  }
  const FALLBACK: Partial<Record<StepTipo, string>> = {
    listen_choose: 'Escucha y elige.',
    dictado: 'Escucha y escribe.',
    match_image: 'Une cada palabra con su imagen.',
  };
  return { es: FALLBACK[tipo] ?? '¡Vamos!', fr: '', voz: 'narrador', audio: '' };
}

/** Index "audio de phrase" -> etape (reorder_words prioritaire, puis speak) pour la repetition espacee. */
export function phraseSteps(c: Content): Map<string, { reorder?: Step; speak?: Step }> {
  const m = new Map<string, { reorder?: Step; speak?: Step }>();
  for (const { step } of c.steps.values()) {
    if (step.tipo === 'reorder_words') m.set(step.habla.audio, { ...m.get(step.habla.audio), reorder: step });
    if (step.tipo === 'speak') m.set(step.objetivo.audio, { ...m.get(step.objetivo.audio), speak: step });
  }
  return m;
}

/** Toutes les cles audio referencees par une unite (champs `audio` de tout le JSON). */
export function collectAudioKeys(unit: Unit): string[] {
  const out = new Set<string>();
  const walk = (x: unknown) => {
    if (Array.isArray(x)) x.forEach(walk);
    else if (x && typeof x === 'object') {
      for (const [k, v] of Object.entries(x)) {
        if (k === 'audio' && typeof v === 'string' && v) out.add(v);
        else walk(v);
      }
    }
  };
  walk(unit);
  return [...out];
}
