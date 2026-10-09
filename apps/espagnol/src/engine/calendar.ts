import type { Unit } from '../content/schema';

/** Fenetre annuelle "MM-DD" -> "MM-DD" (peut enjamber le 31/12). */
export interface EventWindow {
  from: string;
  to: string;
}

/** Evenements connus (utilises si l'unite n'a pas de champ de fenetre explicite). */
export const KNOWN_EVENTS: { match: RegExp; window: EventWindow }[] = [
  { match: /muertos|oaxaca/i, window: { from: '10-25', to: '11-02' } },
  { match: /navidad|reyes|nochevieja/i, window: { from: '12-01', to: '01-06' } },
];

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
 * Fenetre d'un evenement. Champs lus sur l'unite (le schema peut les porter) :
 *  - `evento: { desde, hasta }` | `{ from, to }` | `"muertos" | "navidad"`  (chaine = evenement connu)
 *  - `ventana` / `fechas` : memes formes
 * Sinon deduction par id / titre / lieu ("Muertos", "Navidad"...).
 */
export function eventWindow(unit: Unit): EventWindow | null {
  const u = unit as unknown as Record<string, unknown>;
  for (const k of ['evento', 'ventana', 'fechas']) {
    const v = u[k] as unknown;
    if (v && typeof v === 'object') {
      const o = v as Record<string, string>;
      const from = o.desde ?? o.from ?? o.inicio;
      const to = o.hasta ?? o.to ?? o.fin;
      if (from && to) return { from: from.slice(-5), to: to.slice(-5) };
    }
    if (typeof v === 'string') {
      const hit = KNOWN_EVENTS.find((e) => e.match.test(v));
      if (hit) return hit.window;
    }
  }
  if (/^u\d+$/i.test(unit.id) && !/muertos|navidad/i.test(unit.titulo)) {
    return null; // unite ordinaire (u06 "Feliz Navidad" reste dans la progression sauf si marquee evenement)
  }
  const hay = `${unit.id} ${unit.titulo} ${unit.lugar}`;
  return KNOWN_EVENTS.find((e) => e.match.test(hay))?.window ?? null;
}
