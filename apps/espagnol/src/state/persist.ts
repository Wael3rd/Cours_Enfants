import { createStore } from '@ce/core';
import { STATE_VERSION, defaultState } from '../engine/progress';
import type { GameState } from '../engine/types';

/**
 * Etat persistant (IndexedDB via @ce/core, cle `ce:espagnol`), versionne.
 * Ajouter un champ = incrementer STATE_VERSION (engine/progress.ts) + migrations[ancienne version].
 */
export const migrations: Record<number, (old: any) => any> = {
  // 1: (old) => ({ ...old, nouveauChamp: ... }),   // v1 -> v2
};

export const persist = createStore<GameState>({
  name: 'espagnol',
  version: STATE_VERSION,
  defaults: () => defaultState(),
  migrations,
});

export { normalizeState } from './normalize';
