/** Son de l'app : table des SFX / voix (@ce/core/audio), musique, voix par cle ou variante. Respecte les reglages son/voix/musique. */
import {
  configureAudio, playSfx, playVoice, speakFallback, stopVoice, setMuted, playMusic, stopMusic, duckMusic, haptic, preloadAudio,
} from '@ce/core';
import { VOICE, variants, hintKey } from '../audio/voice-lines.ts';
import { ALL_FACTS } from '../engine/facts.ts';
import { app } from '../state/store.svelte.ts';

const SFX_FILES = [
  'tap', 'pop', 'correct', 'correct-pip', 'wrong-soft', 'star', 'swoosh-in', 'swoosh-out', 'select', 'open', 'tick', 'streak-1', 'streak-2',
  'streak-3', 'combo', 'back', 'close', 'toggle', 'ball-hit', 'ball-net', 'kick', 'kick-quick', 'whistle-short', 'whistle-long',
  'whistle-triple', 'crowd-cheer-short', 'crowd-goal', 'crowd-murmur', 'crowd-ohhh', 'crowd-victory', 'crowd-chant', 'jingle-win',
  'jingle-sax', 'level-up', 'item-get',
];
const MUSIC = 'music/stade-energique.mp3';

let configured = false;
export function setupAudio(): void {
  if (configured) return;
  configured = true;
  const sfx: Record<string, string> = {};
  for (const k of SFX_FILES) sfx[k] = `sfx/${k}.mp3`;
  const voices: Record<string, string> = {};
  for (const k of Object.keys(VOICE)) voices[k] = `fr/${k}.mp3`;
  for (const f of ALL_FACTS) voices[hintKey(f.id)] = `fr/${hintKey(f.id)}.mp3`;
  configureAudio({ base: import.meta.env.BASE_URL + 'audio/', sfx, voices, lang: 'fr-FR' });
  // Les SFX du jeu sont petits : prechargement des plus utilises pour une reponse < 50 ms.
  preloadAudio({ sfx: ['tap', 'correct-pip', 'wrong-soft', 'kick-quick', 'ball-net', 'crowd-goal', 'pop', 'star'] });
}

export function applyAudioSettings(): void {
  const s = app.state.settings;
  setMuted(!s.sound);
  if (s.sound && s.music) playMusic(MUSIC, 0.2);
  else stopMusic();
}
export const startMusic = () => applyAudioSettings();

export const sfx = (key: string, volume = 1) => {
  if (app.state.settings.sound) playSfx(key, volume);
};
export { haptic, duckMusic };

const last: Record<string, string> = {};
/** Tire une variante d'un groupe sans repeter la precedente. */
export function pickVariant(group: string): string {
  const v = variants(group);
  if (!v.length) return group;
  let k = v[Math.floor(Math.random() * v.length)];
  if (v.length > 1 && k === last[group]) k = v[(v.indexOf(k) + 1) % v.length];
  last[group] = k;
  return k;
}

/** Dit une replique (voix pre-generee ; secours = synthese du navigateur). */
export function say(key: string): void {
  if (!app.state.settings.voice || !app.state.settings.sound) return;
  const line = VOICE[key];
  playVoice(key, line?.text);
}
export const sayVariant = (group: string) => say(pickVariant(group));
/** Texte libre (prenom, legende d'indice) : voix du navigateur. */
export function sayText(text: string): void {
  if (!app.state.settings.voice || !app.state.settings.sound) return;
  speakFallback(text);
}
/** Legende d'un indice : mp3 pre-genere du fait, sinon synthese du navigateur (calcul mental). */
export function sayHint(factId: string | null, caption: string): void {
  if (!app.state.settings.voice || !app.state.settings.sound) return;
  if (factId) playVoice(hintKey(factId), caption.replace(/−/g, ' moins '));
  else speakFallback(caption.replace(/−/g, ' moins '));
}
export { stopVoice };

/** Duree approximative d'une replique (ms) pour enchainer sans chevauchement. */
export const lineMs = (key: string) => Math.max(900, (VOICE[key]?.text.length ?? 20) * 62);
