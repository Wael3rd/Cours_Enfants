import { mount, unmount } from 'svelte';
import Cinematic, { type CinematicResult } from './Cinematic.svelte';

export interface PlayOptions {
  src: string;
  data?: Record<string, unknown>;
  skippable?: boolean;
  /** Libelle du bouton passer (defaut 'Passer'). */
  skipLabel?: string;
  /** Conteneur (defaut: document.body). */
  target?: HTMLElement;
}

/** Joue une cinematique en overlay plein ecran; la promesse se resout a la fin ('ended' | 'skipped' | 'error'). */
export function playCinematic(opts: PlayOptions): Promise<CinematicResult> {
  return new Promise((resolve) => {
    const target = opts.target ?? document.body;
    const comp = mount(Cinematic, {
      target,
      props: {
        src: opts.src,
        data: opts.data,
        skippable: opts.skippable,
        skipLabel: opts.skipLabel,
        onend: (r: CinematicResult) => {
          void unmount(comp);
          resolve(r);
        },
      },
    });
  });
}
