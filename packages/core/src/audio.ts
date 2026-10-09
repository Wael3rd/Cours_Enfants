import { Howl, Howler } from 'howler';

/** Table cle -> fichier (relatif a `base`). Les voix gardent le texte en secours pour speechSynthesis. */
export interface AudioConfig {
  base?: string;
  sfx?: Record<string, string>;
  voices?: Record<string, string>;
  /** Langue de secours pour speechSynthesis (ex. 'fr-FR', 'es-ES'). */
  lang?: string;
}

const cfg: Required<AudioConfig> = { base: '', sfx: {}, voices: {}, lang: 'fr-FR' };
const howls = new Map<string, Howl>();
const broken = new Set<string>();
let unlocked = false;
let current: Howl | null = null;

export function configureAudio(c: AudioConfig): void {
  Object.assign(cfg, c, {
    sfx: { ...cfg.sfx, ...c.sfx },
    voices: { ...cfg.voices, ...c.voices },
  });
}

function howl(file: string): Howl {
  let h = howls.get(file);
  if (!h) {
    h = new Howl({
      src: [cfg.base + file],
      preload: true,
      onloaderror: () => broken.add(file),
      onplayerror: () => broken.add(file),
    });
    howls.set(file, h);
  }
  return h;
}

/** A appeler une fois : deverrouille l'audio au premier toucher/clic (politique autoplay Android). */
export function installAudioUnlock(target: EventTarget = window): void {
  const events = ['pointerdown', 'touchend', 'keydown'];
  const unlock = () => {
    if (unlocked) return;
    unlocked = true;
    void Howler.ctx?.resume?.();
    if ('speechSynthesis' in window) speechSynthesis.getVoices(); // amorce la liste des voix
    for (const ev of events) target.removeEventListener(ev, unlock);
  };
  for (const ev of events) target.addEventListener(ev, unlock, { passive: true });
}

export const isAudioUnlocked = () => unlocked;
export const setMuted = (m: boolean) => Howler.mute(m);

/** Joue un effet sonore par cle. Silencieux si la cle ou le fichier est absent. */
export function playSfx(key: string, volume = 1): void {
  const file = cfg.sfx[key];
  if (!file || broken.has(file)) return;
  const h = howl(file);
  h.volume(volume);
  h.play();
}

export function speakFallback(text: string, lang = cfg.lang): void {
  if (!('speechSynthesis' in window) || !text) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = 0.95;
  speechSynthesis.speak(u);
}

export function stopVoice(): void {
  current?.stop();
  current = null;
  if ('speechSynthesis' in window) speechSynthesis.cancel();
}

/** Joue la voix enregistree `key`; sinon (fichier absent/casse) lit `fallbackText` avec speechSynthesis. */
export function playVoice(key: string, fallbackText?: string, lang?: string): void {
  stopVoice();
  const file = cfg.voices[key];
  if (file && !broken.has(file)) {
    const h = howl(file);
    current = h;
    h.once('end', () => {
      if (current === h) current = null;
    });
    const fallback = () => fallbackText && speakFallback(fallbackText, lang);
    h.once('playerror', fallback);
    h.once('loaderror', fallback);
    h.play();
    return;
  }
  if (fallbackText) speakFallback(fallbackText, lang);
}

export function preloadAudio(keys: { sfx?: string[]; voices?: string[] } = {}): void {
  for (const k of keys.sfx ?? Object.keys(cfg.sfx)) if (cfg.sfx[k]) howl(cfg.sfx[k]);
  for (const k of keys.voices ?? []) if (cfg.voices[k]) howl(cfg.voices[k]);
}
