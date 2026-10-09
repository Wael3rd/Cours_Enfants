/** Tenue du joueur : maillot du club par defaut, ou un maillot / des crampons debloques (rewards.avatar). */
import { AVATAR_ITEMS } from '../engine/index.ts';
import { app } from '../state/store.svelte.ts';

export interface KitColors { primary: string; secondary: string; shoe: string; jerseyId: string; bootsId: string }

export function kitColors(): KitColors {
  const av = app.state.profile.rewards.avatar;
  const club = app.state.club;
  const jersey = AVATAR_ITEMS.find((i) => i.slot === 'jersey' && i.id === av.jersey);
  const boots = AVATAR_ITEMS.find((i) => i.slot === 'boots' && i.id === av.boots);
  return {
    primary: jersey ? jersey.colors[0] : club.primary,
    secondary: jersey ? jersey.colors[1] : club.secondary,
    shoe: boots ? boots.colors[0] : '#121528',
    jerseyId: jersey ? jersey.id : 'club',
    bootsId: boots ? boots.id : 'noirs',
  };
}
