/** Store Svelte 5 (runes) : etat + persistance IndexedDB (@ce/core). Le moteur est celui de Calcul Champion, l'etat est separe. */
import { createStore } from '@ce/core';
import { APP_NAME, STATE_VERSION, defaultState, normalizeState, type AppState, type Settings } from './model.ts';
import { startSession, type Session, type StartOptions } from '../../../maths/src/engine/session.ts';
import { newProfile } from '../../../maths/src/engine/profile.ts';

const persist = createStore<AppState>({ name: APP_NAME, version: STATE_VERSION, defaults: defaultState });

class AppStore {
  state = $state<AppState>(defaultState());
  ready = $state(false);
  private timer: ReturnType<typeof setTimeout> | undefined;

  async load(): Promise<void> {
    this.state = normalizeState(await persist.load());
    this.ready = true;
  }
  save(): void {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => void this.saveNow(), 250);
  }
  async saveNow(): Promise<void> {
    clearTimeout(this.timer);
    await persist.save($state.snapshot(this.state) as AppState);
  }

  setName(name: string): void {
    this.state.name = name.trim().slice(0, 16);
    this.save();
  }
  setSettings(patch: Partial<Settings>): void {
    const next = normalizeState({ settings: { ...$state.snapshot(this.state.settings), ...patch } }).settings;
    Object.assign(this.state.settings, next);
    this.save();
  }
  /** Tous les modules sont libres : travailler une zone la debloque pour le moteur (revision, « Tout melanger »). */
  openZone(zone: number): void {
    const p = this.state.profile.progress;
    if (!p.forcedZones.includes(zone)) p.forcedZones.push(zone);
  }
  start(mode: 'training' | 'match' | 'sprint', opts?: StartOptions): Session {
    return startSession(this.state.profile, this.state.settings, mode, opts);
  }
  finishSession(s: Session) {
    const r = s.finish();
    void this.saveNow();
    return r;
  }
  resetProgress(): void {
    this.state.profile = newProfile();
    void this.saveNow();
  }
}

export const app = new AppStore();
