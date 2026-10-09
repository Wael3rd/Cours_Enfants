import type { Unit } from '../content/schema';
import type { Content, GameState } from '../engine/types';
import { currentUnit, unitStatus } from '../engine/progress';

/** Unite -> region de la carte (la Nochebuena de la u06 se passe a Madrid : meme medaillon). */
const REGIONS: [RegExp, string][] = [
  [/madrid/i, 'madrid'],
  [/salamanca/i, 'salamanca'],
  [/sevilla/i, 'sevilla'],
  [/m[eé]xico|coyoac/i, 'cdmx'],
  [/oaxaca/i, 'oaxaca'],
  [/valencia/i, 'valencia'],
  [/buenos aires/i, 'baires'],
  [/bogot/i, 'bogota'],
  [/yucat/i, 'yucatan'],
  [/cusco|andes/i, 'cusco'],
];

export function regionOf(u: Unit): string | undefined {
  return REGIONS.find(([re]) => re.test(u.lugar))?.[1];
}

export type MapState = 'locked' | 'open' | 'current' | 'done';

/** Etat de chaque medaillon de la carte. Les regions sans unite (contenu a venir) restent sous le brouillard. */
export function mapStates(c: Content, s: GameState, now: Date): Record<string, MapState> {
  const cur = currentUnit(c, s);
  const by: Record<string, { avail: boolean; current: boolean; done: boolean }> = {};
  for (const u of c.units) {
    const r = regionOf(u);
    if (!r) continue;
    const st = unitStatus(c, s, u, now);
    const e = (by[r] ??= { avail: false, current: false, done: false });
    if (st === 'available') e.avail = true;
    if (u.id === cur?.id && st === 'available') e.current = true;
    if (st === 'done') e.done = true;
  }
  const out: Record<string, MapState> = {};
  for (const [r, e] of Object.entries(by)) out[r] = e.current ? 'current' : e.avail ? 'open' : e.done ? 'done' : 'locked';
  return out;
}

/** Unite a ouvrir quand on touche une region (la prochaine a jouer, sinon la premiere). */
export function unitForRegion(c: Content, s: GameState, region: string, now: Date): Unit | undefined {
  const here = c.units.filter((u) => regionOf(u) === region);
  return here.find((u) => unitStatus(c, s, u, now) === 'available') ?? here[0];
}
