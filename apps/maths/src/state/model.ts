/** Modele de l'etat persistant de Calcul Champion (pur, versionne, testable sans UI). */
import { newProfile, defaultEngineSettings, type EngineSettings, type Profile } from '../engine/profile.ts';
import { newProgress, THRESHOLD_CHOICES_MS } from '../engine/progress.ts';
import { newRewards } from '../engine/rewards.ts';
import { newMental } from '../engine/mental.ts';

/** v1 = fondations ({ childName }). v2 = moteur d'apprentissage complet. */
export const STATE_VERSION = 2;
export const APP_NAME = 'maths';

export interface Settings extends EngineSettings {
  sound: boolean;
  voice: boolean;
}

export interface AppState {
  childName: string;
  settings: Settings;
  profile: Profile;
  createdAt: number;
}

export const SESSION_MINUTES_CHOICES = [2, 3, 5] as const;

export const defaultSettings = (): Settings => ({ ...defaultEngineSettings(), sound: true, voice: true });

export const defaultState = (): AppState => ({
  childName: 'Léo',
  settings: defaultSettings(),
  profile: newProfile(),
  createdAt: Date.now(),
});

/** migrations[n] : version n -> n+1. */
export const migrations: Record<number, (old: any) => any> = {
  1: (old) => ({ ...defaultState(), childName: typeof old?.childName === 'string' && old.childName.trim() ? old.childName : 'Léo' }),
};

const num = (v: unknown, d: number) => (typeof v === 'number' && Number.isFinite(v) ? v : d);

/** Complete et assainit un etat charge (champs ajoutes, valeurs hors bornes) sans jamais perdre de donnees. */
export function normalizeState(raw: unknown): AppState {
  const d = defaultState();
  const r = (raw ?? {}) as Partial<AppState>;
  const settings: Settings = { ...d.settings, ...(r.settings ?? {}) };
  if (!(THRESHOLD_CHOICES_MS as readonly number[]).includes(settings.thresholdMs)) settings.thresholdMs = d.settings.thresholdMs;
  settings.sessionMinutes = Math.min(5, Math.max(2, num(settings.sessionMinutes, 3)));
  settings.sound = settings.sound !== false;
  settings.voice = settings.voice !== false;

  const pr = (r.profile ?? {}) as Partial<Profile>;
  const base = newProfile();
  const progress = { ...newProgress(), ...(pr.progress ?? {}) };
  progress.mental = { ...newMental(), ...(pr.progress?.mental ?? {}) };
  progress.facts = { ...(pr.progress?.facts ?? {}) };
  const profile: Profile = {
    progress,
    rewards: { ...newRewards(), ...(pr.rewards ?? {}) },
    history: Array.isArray(pr.history) ? pr.history : [],
    sprint: { ...base.sprint, ...(pr.sprint ?? {}) },
    matchRates: Array.isArray(pr.matchRates) ? pr.matchRates : [],
  };
  profile.rewards.avatar = { ...newRewards().avatar, ...(pr.rewards?.avatar ?? {}) };
  profile.rewards.medals = { ...newRewards().medals, ...(pr.rewards?.medals ?? {}) };
  profile.rewards.streak = { ...newRewards().streak, ...(pr.rewards?.streak ?? {}) };

  const name = typeof r.childName === 'string' ? r.childName.trim().slice(0, 16) : '';
  return { childName: name || d.childName, settings, profile, createdAt: num(r.createdAt, d.createdAt) };
}
