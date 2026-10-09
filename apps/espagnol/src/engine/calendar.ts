import type { Unit } from '../content/schema';

/** Fenetre annuelle "MM-DD" -> "MM-DD" (peut enjamber le 31/12). */
export interface EventWindow {
  from: string;
  to: string;
}

export const pad = (n: number) => String(n).padStart(2, '0');
/** YYYY-MM-DD en heure locale. */
export const ymd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const parseYmd = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};
export function addDays(date: string, n: number): string {
  const d = parseYmd(date);
  d.setDate(d.getDate() + n);
  return ymd(d);
}
export const daysBetween = (a: string, b: string) => Math.round((parseYmd(b).getTime() - parseYmd(a).getTime()) / 86400000);

const mmdd = (d: Date) => `${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function inWindow(w: EventWindow, now: Date): boolean {
  const k = mmdd(now);
  return w.from <= w.to ? k >= w.from && k <= w.to : k >= w.from || k <= w.to;
}

/**
 * Fenetre d'un evenement : UNIQUEMENT le champ explicite `evento: { desde, hasta }` ("MM-DD" ou "YYYY-MM-DD").
 * Aucune deduction par mots-cles : une unite sans `evento` est une unite ordinaire.
 */
export function eventWindow(unit: Unit): EventWindow | null {
  const e = unit.evento;
  if (e && e.desde && e.hasta) return { from: e.desde.slice(-5), to: e.hasta.slice(-5) };
  return null;
}
