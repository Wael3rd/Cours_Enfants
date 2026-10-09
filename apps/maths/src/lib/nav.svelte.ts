/** Navigation entre ecrans (un seul ecran plein a la fois). */
import type { SessionResult } from '../engine/index.ts';

export type ScreenName =
  | 'setup' | 'placement' | 'home' | 'match' | 'sprint' | 'penalties' | 'training'
  | 'album' | 'trophies' | 'avatar' | 'rewards';

export interface RewardsParams {
  result: SessionResult;
  /** Mode d'ou l'on vient (pour rejouer). */
  from: 'match' | 'sprint' | 'penalties' | 'training';
}

class Nav {
  screen = $state<ScreenName>('home');
  rewards = $state<RewardsParams | null>(null);
  /** Zone d'entrainement choisie (ecran training). */
  zone = $state<number | null>(null);
  go(s: ScreenName): void {
    this.screen = s;
  }
  showRewards(p: RewardsParams): void {
    this.rewards = p;
    this.screen = 'rewards';
  }
}
export const nav = new Nav();
