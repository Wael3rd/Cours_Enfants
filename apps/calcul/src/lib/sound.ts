/** Son de l'app : quelques SFX discrets et les voix de strategie reutilisees de Calcul Champion (copiees dans public/audio). */
import { configureAudio, playSfx, playVoice, stopVoice, setMuted, haptic, preloadAudio } from '@ce/core';
import { app } from '../state/store.svelte.ts';
import { MODULES } from './modules.ts';

let configured = false;
export function setupAudio(): void {
  if (configured) return;
  configured = true;
  const sfx: Record<string, string> = {};
  for (const k of ['tap', 'correct-pip', 'wrong-soft']) sfx[k] = `sfx/${k}.mp3`;
  const voices: Record<string, string> = {};
  for (const m of MODULES) if (m.voice) voices[`strategy_${m.zone}`] = `fr/strategy_${m.zone}.mp3`;
  configureAudio({ base: import.meta.env.BASE_URL + 'audio/', sfx, voices, lang: 'fr-FR' });
  preloadAudio({ sfx: ['tap', 'correct-pip', 'wrong-soft'] });
}
export function applyAudioSettings(): void {
  setMuted(!app.state.settings.sound);
}
export const sfx = (key: string, volume = 1) => {
  if (app.state.settings.sound) playSfx(key, volume);
};
/** Lit l'explication d'un module si la voix existe (sinon silence). */
export function sayStrategy(zone: number): void {
  if (!app.state.settings.sound) return;
  const m = MODULES[zone - 1];
  if (m?.voice) playVoice(`strategy_${zone}`);
}
export { haptic, stopVoice };
