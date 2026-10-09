/** Store Svelte 5 (runes) de l'app : etat reactif + persistance IndexedDB via @ce/core. */
import { createStore, downloadText } from '@ce/core';
import {
  APP_NAME, STATE_VERSION, defaultState, migrations, normalizeState, type AppState, type AvatarLook, type Club, type Settings,
} from './model.ts';
import { forceZone } from '../engine/progress.ts';
import { startSession, type Session, type StartOptions } from '../engine/session.ts';
import { startPlacement, type PlacementSession } from '../engine/placement.ts';
import { newProfile, type Mode } from '../engine/profile.ts';

const persist = createStore<AppState>({ name: APP_NAME, version: STATE_VERSION, defaults: defaultState, migrations });

class AppStore {
  state = $state<AppState>(defaultState());
  ready = $state(false);
  private timer: ReturnType<typeof setTimeout> | undefined;

  async load(): Promise<void> {
    this.state = normalizeState(await persist.load());
    this.ready = true;
  }

  /** Sauvegarde differee (regroupe les ecritures rapprochees). */
  save(): void {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => void this.saveNow(), 250);
  }
  async saveNow(): Promise<void> {
    clearTimeout(this.timer);
    await persist.save($state.snapshot(this.state) as AppState);
  }

  setName(name: string): void {
    this.state.childName = name.trim().slice(0, 16) || 'Léo';
    this.save();
  }
  /** Fin de la creation du club et du joueur (premier lancement). */
  completeSetup(name: string, club: Club, look: AvatarLook): void {
    this.state.childName = name.trim().slice(0, 16) || 'Léo';
    this.state.club = { ...club };
    this.state.look = { ...look };
    this.state.profile.rewards.avatar.jersey = 'club';
    this.state.setupDone = true;
    void this.saveNow();
  }
  setLook(look: AvatarLook): void {
    this.state.look = { ...look };
    this.save();
  }
  setClub(club: Club): void {
    this.state.club = { ...club };
    this.save();
  }
  /** La cinematique de strategie de cette zone a ete montree (arrivee sur la zone). */
  markStrategySeen(zone: number): void {
    if (!this.state.strategySeen.includes(zone)) {
      this.state.strategySeen.push(zone);
      this.save();
    }
  }
  markPlacementDone(): void {
    this.state.placementDone = true;
    void this.saveNow();
  }
  /** Maillot ou crampons de l'avatar ('club' = couleurs du club). */
  setKit(slot: 'jersey' | 'boots', id: string): void {
    this.state.profile.rewards.avatar[slot] = id;
    this.save();
  }
  setSettings(patch: Partial<Settings>): void {
    const next = normalizeState({ settings: { ...$state.snapshot(this.state.settings), ...patch } }).settings;
    Object.assign(this.state.settings, next);
    this.save();
  }
  /** Le parent force une zone (debloquee + mise au travail). */
  forceZone(zone: number): void {
    forceZone(this.state.profile.progress, zone);
    this.save();
  }

  /** Demarre une session (sprint / match / tirs / entrainement). Penser a appeler finishSession(). */
  start(mode: Exclude<Mode, 'placement'>, opts?: StartOptions): Session {
    return startSession(this.state.profile, this.state.settings, mode, opts);
  }
  startPlacement(opts?: StartOptions): PlacementSession {
    return startPlacement(this.state.profile, this.state.settings, opts);
  }
  /** Termine proprement une session et persiste. */
  finishSession<S extends Session | PlacementSession>(s: S): ReturnType<S['finish']> {
    const r = s.finish() as ReturnType<S['finish']>;
    void this.saveNow();
    return r;
  }

  /** Efface toute la progression (garde le prenom et les reglages). */
  resetProgress(): void {
    this.state.profile = newProfile();
    this.save();
  }

  async exportText(): Promise<string> {
    await this.saveNow();
    return persist.exportJSON();
  }
  async exportDownload(): Promise<void> {
    const day = new Date().toISOString().slice(0, 10);
    downloadText(`calcul-champion-${this.state.childName.toLowerCase().replace(/\W+/g, '-')}-${day}.json`, await this.exportText());
  }
  async importText(text: string): Promise<void> {
    await persist.importJSON(text);
    await this.load();
  }
}

export const app = new AppStore();
