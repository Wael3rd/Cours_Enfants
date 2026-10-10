/** Etat persistant de « Calcul — Entrainement » (cle de stockage propre : `ce:calcul`, separee de Calcul Champion). */
import { newProfile, defaultEngineSettings, type EngineSettings, type Profile } from '../../../maths/src/engine/profile.ts';
import { THRESHOLD_CHOICES_MS } from '../../../maths/src/engine/progress.ts';

export const STATE_VERSION = 1;
export const APP_NAME = 'calcul';

export interface Settings extends EngineSettings {
  sound: boolean;
}

export interface AppState {
  /** Prenom facultatif ('' = pas de prenom). */
  name: string;
  settings: Settings;
  profile: Profile;
}

export const defaultState = (): AppState => ({
  name: '',
  settings: { ...defaultEngineSettings(), sound: true },
  profile: newProfile(),
});

const num = (v: unknown, d: number) => (typeof v === 'number' && Number.isFinite(v) ? v : d);

/** Complete et assainit un etat charge sans perdre de donnees. */
export function normalizeState(raw: unknown): AppState {
  const d = defaultState();
  const r = (raw ?? {}) as Partial<AppState>;
  const settings: Settings = { ...d.settings, ...(r.settings ?? {}) };
  if (!(THRESHOLD_CHOICES_MS as readonly number[]).includes(settings.thresholdMs)) settings.thresholdMs = d.settings.thresholdMs;
  settings.sessionMinutes = Math.min(5, Math.max(2, num(settings.sessionMinutes, 3)));
  settings.sound = settings.sound !== false;

  const pr = (r.profile ?? {}) as Partial<Profile>;
  const base = newProfile();
  const progress = { ...base.progress, ...(pr.progress ?? {}) };
  progress.mental = { ...base.progress.mental, ...(pr.progress?.mental ?? {}) };
  progress.facts = { ...(pr.progress?.facts ?? {}) };
  progress.forcedZones = Array.isArray(progress.forcedZones) ? progress.forcedZones : [];
  progress.zonesWon = Array.isArray(progress.zonesWon) ? progress.zonesWon : [];
  const profile: Profile = {
    progress,
    rewards: { ...base.rewards, ...(pr.rewards ?? {}) },
    history: Array.isArray(pr.history) ? pr.history : [],
    sprint: { ...base.sprint, ...(pr.sprint ?? {}) },
    matchRates: Array.isArray(pr.matchRates) ? pr.matchRates : [],
  };
  profile.rewards.avatar = { ...base.rewards.avatar, ...(pr.rewards?.avatar ?? {}) };
  profile.rewards.medals = { ...base.rewards.medals, ...(pr.rewards?.medals ?? {}) };
  profile.rewards.streak = { ...base.rewards.streak, ...(pr.rewards?.streak ?? {}) };

  return { name: typeof r.name === 'string' ? r.name.trim().slice(0, 16) : '', settings, profile };
}
