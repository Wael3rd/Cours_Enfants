/** Lecture des cinematiques HyperFrames depuis l'app (musique baissee, jamais bloquant). */
import { playCinematic, preloadCinematic } from '@ce/core';
import { duckMusic } from './sound.ts';
import { ZONES } from '../engine/zones.ts';
import { STRATEGY_CINEMATICS } from '../audio/voice-lines.ts';

export type CineId = 'intro-club' | 'match-intro' | 'goal' | 'full-time' | 'trophy' | 'card-pack' | 'medal';
const src = (id: string) => `${import.meta.env.BASE_URL}cinematics/${id}/index.html`;

export function preload(...ids: CineId[]): void {
  for (const id of ids) void preloadCinematic(src(id));
}

export async function cine(id: CineId | `strategy-${string}`, data: Record<string, unknown>): Promise<void> {
  duckMusic(true);
  try {
    await playCinematic({ src: src(id), data: { [id]: data } });
  } finally {
    duckMusic(false);
  }
}

/** Cinematique de strategie d'une zone (1..9), si elle existe. Renvoie true si elle a ete jouee. */
export async function playStrategy(zone: number): Promise<boolean> {
  const key = ZONES[zone - 1]?.key;
  if (!key || !STRATEGY_CINEMATICS.includes(key)) return false;
  await cine(`strategy-${key}`, {});
  return true;
}
export const hasStrategy = (zone: number): boolean => STRATEGY_CINEMATICS.includes(ZONES[zone - 1]?.key ?? '');
