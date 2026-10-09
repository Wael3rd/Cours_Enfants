import { downloadText, setHaptics, setSoftMotion } from '@ce/core';
import { content, loadUnits } from '../engine/data';
import { autoDownloadPlan } from '../services/offline';
import { addTime } from '../engine/progress';
import { defaultState } from '../engine/progress';
import type { GameState } from '../engine/types';
import type { Unit } from '../content/schema';
import { loadLentoSet, setSound } from '../services/audio';
import { downloadUnit, removeUnit, runAutoDownload, unitOfflineStatus, type DownloadProgress } from '../services/offline';
import { normalizeState, persist } from './persist';

const TICK_MS = 5000;
const IDLE_MS = 45_000;

/**
 * Store Svelte 5 (runes) de l'etat de jeu persistant.
 *   game.state            etat reactif (lecture dans les composants)
 *   game.mutate(fn)       applique un reducer de l'engine (fn(state)) puis sauvegarde (debounce)
 *   game.ready            vrai quand l'etat est charge depuis IndexedDB
 */
class Game {
  state = $state<GameState>(defaultState());
  ready = $state(false);
  /** progression des telechargements audio en cours : unitId -> avancement */
  downloads = $state<Record<string, DownloadProgress>>({});
  private timer: ReturnType<typeof setTimeout> | undefined;
  private lastInput = Date.now();
  private tracking = false;

  async init(): Promise<void> {
    this.state = normalizeState(await persist.load());
    this.applySettings();
    this.ready = true;
    this.startTimeTracking();
  }

  /** Applique un reducer (mutation en place) et planifie la sauvegarde. */
  mutate<T>(fn: (s: GameState) => T): T {
    const r = fn(this.state);
    this.save();
    return r;
  }

  save(): void {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => void this.flush(), 400);
  }

  async flush(): Promise<void> {
    clearTimeout(this.timer);
    await persist.save($state.snapshot(this.state) as GameState);
  }

  applySettings(): void {
    setSound(this.state.settings.sound);
    setHaptics(this.state.settings.haptics);
    setSoftMotion(this.state.settings.reducedMotion);
  }

  /** Temps passe : compte uniquement quand l'app est visible et que l'enfant a touche l'ecran il y a < 45 s. */
  private startTimeTracking(): void {
    if (this.tracking || typeof window === 'undefined') return;
    this.tracking = true;
    const touch = () => (this.lastInput = Date.now());
    for (const ev of ['pointerdown', 'keydown', 'touchstart']) window.addEventListener(ev, touch, { passive: true });
    setInterval(() => {
      if (document.visibilityState !== 'visible' || Date.now() - this.lastInput > IDLE_MS) return;
      addTime(this.state, TICK_MS, new Date());
      this.save();
    }, TICK_MS);
    document.addEventListener('visibilitychange', () => document.visibilityState === 'hidden' && void this.flush());
  }

  // ───────── Sauvegarde parent ─────────
  async exportBackup(): Promise<void> {
    await this.flush();
    downloadText(`quetzal-${this.state.profile.name || 'sauvegarde'}-${new Date().toISOString().slice(0, 10)}.json`, await persist.exportJSON());
  }

  async importBackup(text: string): Promise<void> {
    this.state = normalizeState(await persist.importJSON(text));
    this.applySettings();
  }

  async reset(): Promise<void> {
    await persist.reset();
    this.state = defaultState();
    this.applySettings();
  }

  // ───────── Audio hors-ligne ─────────
  async refreshOffline(): Promise<void> {
    const lento = await loadLentoSet();
    for (const u of content.units) {
      if (!u.vocab.length) continue; // unite non chargee : on garde l'etat memorise
      const st = await unitOfflineStatus(u, lento);
      const prev = this.state.offline[u.id];
      this.state.offline[u.id] = { status: st.status, at: prev?.at ?? '', files: st.cached, bytes: prev?.bytes ?? 0 };
    }
    this.save();
  }

  async downloadUnitAudio(unit: Unit): Promise<boolean> {
    const lento = await loadLentoSet();
    const r = await downloadUnit(unit, lento, { onProgress: (p) => (this.downloads[unit.id] = p) });
    delete this.downloads[unit.id];
    const st = await unitOfflineStatus(unit, lento);
    this.state.offline[unit.id] = { status: st.status, at: new Date().toISOString().slice(0, 10), files: st.cached, bytes: (this.state.offline[unit.id]?.bytes ?? 0) + r.bytes };
    this.save();
    return r.ok;
  }

  async removeUnitAudio(unit: Unit): Promise<void> {
    await removeUnit(unit, await loadLentoSet());
    this.state.offline[unit.id] = { status: 'none', at: '', files: 0, bytes: 0 };
    this.save();
  }

  /** Unite en cours + suivante, si l'option est active et la connexion adaptee. */
  async autoDownload(): Promise<void> {
    await loadUnits(autoDownloadPlan(content, this.state).map((u) => u.id));
    const lento = await loadLentoSet();
    await runAutoDownload(content, this.state, lento, {
      onUnit: (u, p) => (this.downloads[u.id] = p),
      onDone: (u) => delete this.downloads[u.id],
    });
    await this.refreshOffline();
  }
}

export const game = new Game();
