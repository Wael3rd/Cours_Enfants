import { configureAudio, playVoice, preloadAudio, setMuted, speakFallback, stopVoice } from '@ce/core';
import { audioUrl, lentoKey } from './paths';
import { registerSfx } from './sfx';
export { AUDIO_BASE, audioUrl, lentoKey } from './paths';


let lento: Set<string> | null = null;
let lentoLoading: Promise<Set<string>> | null = null;

/** Cles pour lesquelles une variante lente existe (lu depuis le manifeste audio, charge a la demande). */
export function loadLentoSet(): Promise<Set<string>> {
  lentoLoading ??= import('../content/audio-manifest.json').then((m) => {
    const list = (m.default as { key: string }[]).map((e) => e.key);
    lento = new Set(list.filter((k) => k.endsWith('.lento')));
    return lento;
  });
  return lentoLoading;
}

export const hasLento = (key: string) => lento?.has(lentoKey(key)) ?? false;

/** A appeler au demarrage : configure le chemin des voix et charge la liste des variantes lentes. */
export async function initAudio(): Promise<void> {
  configureAudio({ base: '', lang: 'es-ES' });
  registerSfx();
  await loadLentoSet();
}

function register(key: string): string {
  configureAudio({ voices: { [key]: audioUrl(key) } });
  return key;
}

export interface PlayOptions {
  /** variante lente (tortue) si elle existe, sinon la normale */
  lento?: boolean;
  /** texte espagnol lu par speechSynthesis si le fichier est absent */
  text?: string;
}

/** Joue une voix par cle audio du schema (`Habla.audio`). Sans cle : speechSynthesis sur `text`. */
export function playHabla(key: string | undefined, o: PlayOptions = {}): void {
  if (!key) {
    if (o.text) speakFallback(o.text, 'es-ES');
    return;
  }
  const k = o.lento && hasLento(key) ? lentoKey(key) : key;
  playVoice(register(k), o.text, 'es-ES');
}

/** Prechauffe (decodage Howler) les voix qui vont servir : etape suivante, mots de l'exercice... */
export function preloadHablas(keys: (string | undefined)[], withLento = false): void {
  const list = keys.filter((k): k is string => !!k);
  const all = withLento ? list.flatMap((k) => (hasLento(k) ? [k, lentoKey(k)] : [k])) : list;
  all.forEach(register);
  preloadAudio({ voices: all });
}

export const stopHabla = stopVoice;
export const setSound = (on: boolean) => setMuted(!on);
