/** Modele de l'etat persistant de Calcul Champion (pur, versionne, testable sans UI). */
import { newProfile, defaultEngineSettings, type EngineSettings, type Profile } from '../engine/profile.ts';
import { newProgress, THRESHOLD_CHOICES_MS } from '../engine/progress.ts';
import { newRewards } from '../engine/rewards.ts';
import { newMental } from '../engine/mental.ts';

/**
 * v1 = fondations ({ childName }). v2 = moteur d'apprentissage complet (10 zones, soustractions = zone 9).
 * v3 = familles de nombres : soustractions repartees dans les zones 1-8, Ligue des Champions = zone 9.
 */
export const STATE_VERSION = 3;
export const APP_NAME = 'maths';

export interface Settings extends EngineSettings {
  sound: boolean;
  voice: boolean;
  /** Musique de stade douce (coupable depuis l'accueil). */
  music: boolean;
}

export type CrestPattern = 'auto' | 'stripes' | 'band' | 'chevron' | 'split' | 'plain';
export interface Club {
  name: string;
  primary: string;
  secondary: string;
  pattern: CrestPattern;
  initials: string;
}
export type HairStyle = 'court' | 'boucles' | 'pique' | 'long';
export interface AvatarLook {
  /** Indices dans SKINS / HAIRS du kit (0-5 / 0-6). */
  skin: number;
  hair: HairStyle;
  hairColor: number;
  number: number;
}

export interface AppState {
  /** Premier lancement : prenom, club et joueur crees (sinon l'ecran de creation s'ouvre). */
  setupDone: boolean;
  /** Match de detection joue (ou passe). */
  placementDone: boolean;
  club: Club;
  look: AvatarLook;
  childName: string;
  settings: Settings;
  profile: Profile;
  createdAt: number;
  /** Zones (1..9) dont la cinematique de strategie a deja ete montree a l'arrivee (une seule fois par zone). */
  strategySeen: number[];
}

export const SESSION_MINUTES_CHOICES = [2, 3, 5] as const;

export const defaultSettings = (): Settings => ({ ...defaultEngineSettings(), sound: true, voice: true, music: true });

export const defaultClub = (): Club => ({ name: 'Les Lions', primary: '#E8212F', secondary: '#FFFFFF', pattern: 'auto', initials: 'LL' });
export const defaultLook = (): AvatarLook => ({ skin: 1, hair: 'court', hairColor: 0, number: 10 });

export const defaultState = (): AppState => ({
  setupDone: false,
  placementDone: false,
  club: defaultClub(),
  look: defaultLook(),
  childName: 'Léo',
  settings: defaultSettings(),
  profile: newProfile(),
  createdAt: Date.now(),
  strategySeen: [],
});

/** Ancienne numerotation (v2) -> nouvelle : 9 (soustractions) disparait -> 8 ; 10 (Ligue) -> 9. */
const zoneV2toV3 = (z: number) => (z >= 10 ? 9 : z === 9 ? 8 : z);

/** migrations[n] : version n -> n+1. */
export const migrations: Record<number, (old: any) => any> = {
  1: (old) => ({ ...defaultState(), childName: typeof old?.childName === 'string' && old.childName.trim() ? old.childName : 'Léo' }),
  // v2 -> v3 : renumerotation des zones, aucune donnee de fait / historique / recompense n'est touchee.
  2: (old) => {
    const pr = old?.profile?.progress;
    if (!pr || typeof pr !== 'object') return old;
    const wonOld: { zone: number; at: number }[] = Array.isArray(pr.zonesWon) ? pr.zonesWon : [];
    const zonesWon: { zone: number; at: number }[] = [];
    for (const w of wonOld) {
      if (!w || typeof w.zone !== 'number') continue;
      const nz = w.zone === 9 ? 8 : zoneV2toV3(w.zone); // l'ancienne zone 9 gagnee implique que tout etait fluent
      if (!zonesWon.some((x) => x.zone === nz)) zonesWon.push({ zone: nz, at: w.at });
    }
    const forced: number[] = Array.isArray(pr.forcedZones) ? [...new Set<number>(pr.forcedZones.map(zoneV2toV3))] : [];
    const focus = zoneV2toV3(typeof pr.focusZone === 'number' ? pr.focusZone : 1);
    const maxUnlocked = Math.max(zoneV2toV3(typeof pr.maxUnlocked === 'number' ? pr.maxUnlocked : 1), focus);
    const history = Array.isArray(old.profile.history)
      ? old.profile.history.map((h: any) => (h && typeof h.zone === 'number' ? { ...h, zone: zoneV2toV3(h.zone) } : h))
      : old.profile.history;
    return { ...old, profile: { ...old.profile, history, progress: { ...pr, zonesWon, forcedZones: forced, focusZone: focus, maxUnlocked } } };
  },
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
  settings.music = settings.music !== false;

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

  const club: Club = { ...d.club, ...(r.club ?? {}) };
  club.name = String(club.name || d.club.name).slice(0, 24);
  club.initials = String(club.initials || d.club.initials).slice(0, 3).toUpperCase();
  const look: AvatarLook = { ...d.look, ...(r.look ?? {}) };
  look.skin = Math.min(5, Math.max(0, Math.round(num(look.skin, 1))));
  look.hairColor = Math.min(6, Math.max(0, Math.round(num(look.hairColor, 0))));
  look.number = Math.min(99, Math.max(1, Math.round(num(look.number, 10))));
  if (!['court', 'boucles', 'pique', 'long'].includes(look.hair)) look.hair = 'court';

  const name = typeof r.childName === 'string' ? r.childName.trim().slice(0, 16) : '';
  // Une sauvegarde d'avant l'ecran de creation (profil deja entame) ne doit pas rejouer le premier lancement.
  const played = profile.history.length > 0 || Object.keys(progress.facts).length > 0;
  return {
    setupDone: r.setupDone === true || played, placementDone: r.placementDone === true || played,
    club, look, childName: name || d.childName, settings, profile, createdAt: num(r.createdAt, d.createdAt),
    strategySeen: Array.isArray(r.strategySeen) ? [...new Set((r.strategySeen as unknown[]).filter((z): z is number => Number.isInteger(z) && (z as number) >= 1 && (z as number) <= 9))] : [],
  };
}
