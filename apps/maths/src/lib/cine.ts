/** Lecture des cinematiques HyperFrames depuis l'app (musique baissee, jamais bloquant). */
import { playCinematic, preloadCinematic } from '@ce/core';
import { duckMusic } from './sound.ts';

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
