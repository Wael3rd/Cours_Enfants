import { Howl } from 'howler';
import { isAudioUnlocked } from '@ce/core';

/** Musique d'ambiance (aventure-douce.mp3, boucle). Niveaux : 'menu' (carte, ecrans calmes) | 'quest' (en sourdine) | 'off'. */
const URL_ = `${import.meta.env?.BASE_URL ?? '/espagnol/'}music/aventure-douce.mp3`;
const LEVELS = { menu: 0.3, quest: 0.1, off: 0 } as const;
export type MusicMode = keyof typeof LEVELS;

let howl: Howl | null = null;
let mode: MusicMode = 'menu';
let enabled = true;
let pendingStart = false;

function ensure(): Howl {
  howl ??= new Howl({ src: [URL_], loop: true, volume: 0, html5: false, preload: true });
  return howl;
}

function apply(): void {
  const target = enabled ? LEVELS[mode] : 0;
  if (target === 0) {
    if (howl?.playing()) {
      howl.fade(howl.volume(), 0, 600);
      setTimeout(() => !enabled || mode === 'off' ? howl?.pause() : undefined, 650);
    }
    return;
  }
  if (!isAudioUnlocked()) {
    // autoplay bloque : on attend le premier toucher
    if (!pendingStart) {
      pendingStart = true;
      const go = () => {
        pendingStart = false;
        window.removeEventListener('pointerdown', go);
        apply();
      };
      window.addEventListener('pointerdown', go, { once: true });
    }
    return;
  }
  const h = ensure();
  if (!h.playing()) h.play();
  h.fade(h.volume(), target, 900);
}

export const music = {
  setEnabled(on: boolean): void {
    enabled = on;
    apply();
  },
  setMode(m: MusicMode): void {
    mode = m;
    apply();
  },
  get enabled() {
    return enabled;
  },
};
