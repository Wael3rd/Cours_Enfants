import { STATS, type StatId, type Unit } from '../content/schema';
import { addDays, ymd } from '../engine/calendar';
import { phraseSteps } from '../engine/content';
import { activeEvents, streak, unitProgress, unitStatus } from '../engine/progress';
import { inventory, levelInfo, playerLevel, statLevel, totalXp, STAT_K } from '../engine/rpg';
import { difficulty, mastery } from '../engine/srs';
import type { Content, GameState } from '../engine/types';

export const STAT_LABEL: Record<StatId, string> = {
  escuchar: 'Écouter',
  hablar: 'Parler',
  leer: 'Lire',
  escribir: 'Écrire',
  cultura: 'Culture',
};

/** Activité langagière du programme (A1+) travaillée par chaque statistique du jeu. */
export const STAT_ACTIVITE: Record<StatId, string> = {
  escuchar: 'Compréhension de l’oral',
  hablar: 'Expression et interaction orales',
  leer: 'Compréhension de l’écrit',
  escribir: 'Expression et interaction écrites',
  cultura: 'Culture et médiation',
};

export interface DayPoint {
  date: string;
  minutes: number;
  steps: number;
  label: string;
}

const JOURS = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];

/** Temps par jour sur les `n` derniers jours (le plus ancien en premier). */
export function lastDays(s: GameState, now: Date, n = 14): DayPoint[] {
  const today = ymd(now);
  const out: DayPoint[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const date = addDays(today, -i);
    const d = s.days[date];
    const [y, m, dd] = date.split('-').map(Number);
    out.push({ date, minutes: Math.round(((d?.ms ?? 0) / 60000) * 10) / 10, steps: d?.steps ?? 0, label: `${JOURS[new Date(y, m - 1, dd).getDay()]} ${dd}` });
  }
  return out;
}

export interface Overview {
  totalMin: number;
  weekMin: number;
  activeDays: number;
  streak: number;
  steps: number;
  accuracy: number;
  level: number;
  xp: number;
  wordsSeen: number;
  wordsSolid: number;
  hintRate: number;
  missionsDone: number;
  lastSeen: string;
}

export function overview(c: Content, s: GameState, now: Date): Overview {
  const days = Object.entries(s.days);
  const ms = days.reduce((a, [, d]) => a + d.ms, 0);
  const today = ymd(now);
  const weekStart = addDays(today, -6);
  const week = days.filter(([k]) => k >= weekStart && k <= today).reduce((a, [, d]) => a + d.ms, 0);
  const steps = days.reduce((a, [, d]) => a + d.steps, 0);
  const correct = days.reduce((a, [, d]) => a + d.correct, 0);
  const inv = inventory(c, s);
  const active = days.filter(([, d]) => d.steps > 0 || d.ms > 0).map(([k]) => k).sort();
  return {
    totalMin: Math.round(ms / 60000),
    weekMin: Math.round(week / 60000),
    activeDays: active.length,
    streak: streak(s, now),
    steps,
    accuracy: steps ? correct / steps : 0,
    level: playerLevel(s).level,
    xp: totalXp(s.xp),
    wordsSeen: inv.length,
    wordsSolid: inv.filter((i) => i.mastery >= 4).length,
    hintRate: s.hints.steps ? s.hints.used / s.hints.steps : 0,
    missionsDone: days.filter(([, d]) => d.mission).length,
    lastSeen: active.length ? active[active.length - 1] : '',
  };
}

export interface QuestRow {
  id: string;
  titulo: string;
  tipo: string;
  emoji: string;
  state: 'hecha' | 'en curso' | 'pendiente';
  stars: number;
  accuracy: number;
  attempts: number;
}
export interface UnitRow {
  unit: Unit;
  status: 'locked' | 'available' | 'done' | 'closed';
  questsDone: number;
  questsTotal: number;
  stars: number;
  starsMax: number;
  accuracy: number;
  plume: boolean;
  quests: QuestRow[];
}

export function unitRows(c: Content, s: GameState, now: Date): UnitRow[] {
  return [...c.main, ...c.events].map((unit) => {
    const p = unitProgress(s, unit);
    const firstTodo = unit.quests.findIndex((q) => !s.quests[q.id]?.done);
    return {
      unit,
      status: unitStatus(c, s, unit, now),
      ...p,
      quests: unit.quests.map((q, i) => {
        const qp = s.quests[q.id];
        return {
          id: q.id,
          titulo: q.titulo,
          tipo: q.tipo,
          emoji: q.emoji,
          state: qp?.done ? 'hecha' : i === firstTodo && (qp?.attempts ?? 0) > 0 ? 'en curso' : 'pendiente',
          stars: qp?.stars ?? 0,
          accuracy: qp?.bestAccuracy ?? 0,
          attempts: qp?.attempts ?? 0,
        };
      }),
    };
  });
}

export interface HardItem {
  key: string;
  es: string;
  fr: string;
  kind: 'mot' | 'phrase' | 'forme';
  unit: string;
  seen: number;
  wrong: number;
  rate: number;
  mastery: number;
}

/** Éléments les plus ratés (au moins 2 essais et au moins 1 échec), triés par taux d’échec puis par volume. */
export function hardItems(c: Content, s: GameState, limit = 15): HardItem[] {
  const ph = phraseSteps(c);
  const phraseText = new Map<string, { es: string; fr: string; unit: string }>();
  for (const [audio, p] of ph) {
    const st = p.speak ?? p.reorder;
    if (!st) continue;
    const e = c.steps.get(st.id);
    if (st.tipo === 'speak') phraseText.set(audio, { es: st.objetivo.es, fr: st.objetivo.fr, unit: e?.unitId ?? '' });
    else if (st.tipo === 'reorder_words') phraseText.set(audio, { es: st.habla.es, fr: st.fr ?? '', unit: e?.unitId ?? '' });
  }
  const out: HardItem[] = [];
  for (const [key, card] of Object.entries(s.srs)) {
    if (card.seen < 2 || card.wrong + card.lapses < 1) continue;
    let es = '';
    let fr = '';
    let unit = '';
    let kind: HardItem['kind'] = 'mot';
    if (key.startsWith('v:')) {
      const v = c.vocab.get(key.slice(2));
      if (!v) continue;
      ({ es, fr } = v);
      unit = v.unitId;
    } else if (key.startsWith('p:')) {
      const t = phraseText.get(key.slice(2));
      if (!t) continue;
      ({ es, fr, unit } = t);
      kind = 'phrase';
    } else {
      const e = c.steps.get(key.slice(2));
      if (!e || e.step.tipo !== 'conjugar') continue;
      es = `${e.step.sujeto} ${e.step.forma}`;
      fr = e.step.fr ?? e.step.verbo;
      unit = e.unitId;
      kind = 'forme';
    }
    out.push({ key, es, fr, kind, unit, seen: card.seen, wrong: card.wrong + card.lapses, rate: difficulty(card), mastery: mastery(card) });
  }
  return out.sort((a, b) => b.rate - a.rate || b.wrong - a.wrong).slice(0, limit);
}

export type ObjectiveStatus = 'adquirido' | 'en curso' | 'pendiente';
export interface ObjectiveRow {
  unit: string;
  titulo: string;
  es: string;
  fr: string;
  status: ObjectiveStatus;
  progress: number;
}

/**
 * Couverture des attendus A1+ : les objectifs d’une unité (`objetivos`) sont rattachés à l’unité entière
 * (le contenu ne relie pas un objectif à une quête précise). acquis = plume obtenue avec une précision >= 70 %,
 * en cours = au moins une quête réussie, à venir = rien encore.
 */
export function objectiveCoverage(c: Content, s: GameState): ObjectiveRow[] {
  const rows: ObjectiveRow[] = [];
  for (const unit of [...c.main, ...c.events]) {
    const p = unitProgress(s, unit);
    const progress = p.questsTotal ? p.questsDone / p.questsTotal : 0;
    const status: ObjectiveStatus = p.plume && p.accuracy >= 0.7 ? 'adquirido' : p.questsDone > 0 ? 'en curso' : 'pendiente';
    for (const o of unit.objetivos) rows.push({ unit: unit.id, titulo: unit.titulo, es: o.es, fr: o.fr, status, progress });
  }
  return rows;
}

export interface StatRow {
  stat: StatId;
  label: string;
  activite: string;
  xp: number;
  level: number;
  progress: number;
}
export function statRows(s: GameState): StatRow[] {
  return STATS.map((stat) => {
    const li = statLevel(s, stat);
    return { stat, label: STAT_LABEL[stat], activite: STAT_ACTIVITE[stat], xp: s.xp[stat] ?? 0, level: li.level, progress: li.progress };
  });
}

export const fmtMin = (m: number) => (m >= 60 ? `${Math.floor(m / 60)} h ${String(Math.round(m % 60)).padStart(2, '0')}` : `${Math.round(m)} min`);
export const pct = (x: number) => `${Math.round(x * 100)} %`;
export const fmtBytes = (b: number) => (b >= 1e6 ? `${(b / 1e6).toFixed(1)} Mo` : `${Math.max(1, Math.round(b / 1e3))} Ko`);
export function fmtDate(d: string): string {
  if (!d) return '—';
  const [y, m, dd] = d.split('-');
  return `${dd}/${m}/${y}`;
}

export { activeEvents, levelInfo, STAT_K };
