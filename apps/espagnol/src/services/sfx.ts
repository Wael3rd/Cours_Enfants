import { configureAudio, playSfx } from '@ce/core';

const BASE = `${import.meta.env?.BASE_URL ?? '/espagnol/'}sfx/`;

/** Nom court -> fichier (public/sfx). Sources : assets/sfx (Kenney CC0, Mixkit) - voir assets/LICENSES.md. */
export const SFX_FILES = {
  tap: 'ui/tap.mp3',
  select: 'ui/select.mp3',
  ok: 'ui/correct.mp3',
  pip: 'ui/correct-pip.mp3',
  wrong: 'ui/back.mp3',
  back: 'ui/back.mp3',
  open: 'ui/open.mp3',
  close: 'ui/close.mp3',
  pop: 'ui/pop.mp3',
  star: 'ui/star.mp3',
  combo: 'ui/combo.mp3',
  in: 'ui/swoosh-in.mp3',
  out: 'ui/swoosh-out.mp3',
  tick: 'ui/tick.mp3',
  streak1: 'ui/streak-1.mp3',
  streak3: 'ui/streak-3.mp3',
  streak5: 'ui/streak-5.mp3',
  spell: 'rpg/spell-cast.mp3',
  hit: 'rpg/spell-hit.mp3',
  magic: 'rpg/spell-magic.mp3',
  slash: 'rpg/slash.mp3',
  item: 'rpg/item-get.mp3',
  level: 'rpg/level-up.mp3',
  'level-up': 'rpg/level-up.mp3',
  levelbig: 'rpg/level-up-big.mp3',
  chest: 'rpg/chest-open.mp3',
  page: 'rpg/page-1.mp3',
  page2: 'rpg/page-2.mp3',
  book: 'rpg/book-open.mp3',
  bookclose: 'rpg/book-close.mp3',
  equip: 'rpg/equip.mp3',
  coins: 'rpg/coins.mp3',
  bell: 'rpg/bell.mp3',
  step: 'rpg/step-00.mp3',
  step2: 'rpg/step-01.mp3',
  door: 'rpg/door-open.mp3',
  sword: 'rpg/sword-draw.mp3',
  win: 'jingles/hit05.mp3',
  jingle: 'jingles/hit02.mp3',
  pluck: 'jingles/pizzi00.mp3',
  fanfare: 'jingles/steel03.mp3',
} as const;

export type SfxName = keyof typeof SFX_FILES;

let registered = false;
export function registerSfx(): void {
  if (registered) return;
  registered = true;
  const sfx: Record<string, string> = {};
  for (const [k, f] of Object.entries(SFX_FILES)) sfx[k] = BASE + f;
  configureAudio({ sfx });
}

/** Joue un effet (silencieux si le son est coupe / fichier absent). */
export function sfx(name: SfxName, volume = 0.9): void {
  try {
    registerSfx();
    playSfx(name, volume);
  } catch {
    /* audio non pret */
  }
}
