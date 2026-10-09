import { playHabla } from '../services/audio';

/** Etat d'interface partage (non persiste, sauf `lento` initialise depuis les reglages). */
export const ui = $state({
  /** mode tortue : toutes les voix jouent en variante lente quand elle existe */
  lento: false,
  /** voix en cours (pour l'animation du bouton) */
  speaking: '' as string,
});

let speakTimer: ReturnType<typeof setTimeout> | undefined;

/** Joue une replique espagnole (cle audio du schema) ; repli speechSynthesis sur `text`. */
export function say(audio: string | undefined, text?: string, o: { lento?: boolean } = {}): void {
  playHabla(audio, { lento: o.lento ?? ui.lento, text });
  ui.speaking = audio ?? text ?? '';
  clearTimeout(speakTimer);
  speakTimer = setTimeout(() => (ui.speaking = ''), 1800);
}
