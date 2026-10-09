import { defaultState, defaultSettings } from '../engine/progress';
import type { GameState } from '../engine/types';

/** Fusion profonde avec les valeurs par defaut (tolere les champs ajoutes et les sauvegardes partielles). */
export function normalizeState(raw: Partial<GameState> | undefined): GameState {
  const d = defaultState();
  const r = (raw ?? {}) as Partial<GameState>;
  return {
    ...d,
    ...r,
    profile: { ...d.profile, ...r.profile, avatar: { ...d.profile.avatar, ...r.profile?.avatar }, ficha: { ...r.profile?.ficha } },
    settings: { ...defaultSettings(), ...r.settings },
    xp: { ...d.xp, ...r.xp },
    hints: { ...d.hints, ...r.hints },
    quests: { ...r.quests },
    plumas: { ...r.plumas },
    srs: { ...r.srs },
    discovered: { ...r.discovered },
    days: { ...r.days },
    offline: { ...r.offline },
    unlocked: [...(r.unlocked ?? [])],
  };
}
