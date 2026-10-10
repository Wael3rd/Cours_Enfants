/** Ce qu'on lance depuis l'accueil. */
export type RunConfig =
  | { kind: 'zone'; zone: number }
  | { kind: 'mix' }
  | { kind: 'sprint' };

export const RUN_LENGTH = 15;

export const fmtSec = (ms: number | null): string => (ms === null ? '—' : (ms / 1000).toFixed(1).replace('.', ',') + ' s');
