import type { Mode } from '../engine/profile.ts';

/** 2150 -> "2,2 s" */
export const fmtSec = (ms: number): string => `${(ms / 1000).toFixed(1).replace('.', ',')} s`;

export const MODE_LABEL: Record<Mode, string> = {
  match: 'Match',
  sprint: 'Sprint 100 m',
  penalties: 'Tirs au but',
  training: 'Entraînement',
  placement: 'Match de détection',
};

export const fmtDate = (t: number): string =>
  new Date(t).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
export const fmtDateTime = (t: number): string =>
  new Date(t).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
export const pct = (x: number): string => `${Math.round(x * 100)} %`;
