/** Statistiques pour le tableau de bord parent (donnees pures, sans rendu). */
import { ALL_FACTS, addId, subId, getFact, factText, type Op } from './facts.ts';
import { avgMs, isFluent, isSeen, zoneRatio, isZoneWon, type Progress } from './progress.ts';
import { ZONES, zoneFacts } from './zones.ts';
import { MENTAL_CATS, MENTAL_LABELS, mentalRate, isMentalFluent, type MentalCat } from './mental.ts';
import type { Profile, SessionRecord } from './profile.ts';

export type CellStatus = 'unseen' | 'error' | 'slow' | 'fluent';

export interface HeatCell {
  id: string;
  /** Ligne / colonne 0..10. + : ligne = 1er terme, colonne = 2e terme. - : ligne = nombre retire, colonne = resultat. */
  row: number;
  col: number;
  text: string;
  status: CellStatus;
  attempts: number;
  errors: number;
  avgMs: number | null;
  box: number;
}

/** Carte de chaleur 11x11 (gris jamais vu / rouge erreurs / orange lent / vert fluent). */
export function heatmap(p: Progress, op: Op, T: number): HeatCell[] {
  const cells: HeatCell[] = [];
  for (let row = 0; row <= 10; row++) {
    for (let col = 0; col <= 10; col++) {
      const id = op === '+' ? addId(row, col) : subId(row + col, row);
      const f = getFact(id);
      const s = p.facts[id];
      let status: CellStatus = 'unseen';
      if (isSeen(s)) status = isFluent(s, T) ? 'fluent' : s.attempts > 0 && !s.lastOk ? 'error' : 'slow';
      cells.push({
        id, row, col, text: `${factText(f)} = ${f.answer}`, status,
        attempts: s?.attempts ?? 0, errors: s?.errors ?? 0, avgMs: avgMs(s), box: s?.box ?? 0,
      });
    }
  }
  return cells;
}

export interface PointSeries {
  /** Index de la session (1..n) parmi les sessions retenues. */
  n: number;
  at: number;
  avgMs: number;
  mode: SessionRecord['mode'];
}

/** Temps moyen de reponse (juste) par session, du plus ancien au plus recent. */
export function avgTimeSeries(history: readonly SessionRecord[]): PointSeries[] {
  return history
    .filter((h) => h.avgMs !== null && h.mode !== 'placement')
    .map((h, i) => ({ n: i + 1, at: h.at, avgMs: h.avgMs as number, mode: h.mode }));
}

export interface Summary {
  fluentAdd: number;
  fluentSub: number;
  seen: number;
  totalFacts: number;
  sessions: number;
  zones: { id: number; name: string; ratio: number; won: boolean; unlocked: boolean; focus: boolean; fluent: number; total: number }[];
  mental: { cat: MentalCat; label: string; rate: number; fluent: boolean; attempts: number }[];
}

export function summary(profile: Profile, T: number): Summary {
  const p = profile.progress;
  const fl = (op: Op) => ALL_FACTS.filter((f) => f.op === op && isFluent(p.facts[f.id], T)).length;
  return {
    fluentAdd: fl('+'),
    fluentSub: fl('-'),
    seen: ALL_FACTS.filter((f) => isSeen(p.facts[f.id])).length,
    totalFacts: ALL_FACTS.length,
    sessions: profile.history.length,
    zones: ZONES.map((z) => ({
      id: z.id, name: z.name, ratio: zoneRatio(p, z.id, T), won: isZoneWon(p, z.id),
      unlocked: z.id <= p.maxUnlocked, focus: z.id === p.focusZone,
      fluent: z.id === 10 ? MENTAL_CATS.filter((c) => isMentalFluent(p.mental[c])).length : zoneFacts(z.id).filter((f) => isFluent(p.facts[f.id], T)).length,
      total: z.id === 10 ? MENTAL_CATS.length : zoneFacts(z.id).length,
    })),
    mental: MENTAL_CATS.map((c) => ({ cat: c, label: MENTAL_LABELS[c], rate: mentalRate(p.mental[c]), fluent: isMentalFluent(p.mental[c]), attempts: p.mental[c].attempts })),
  };
}
