import type { Personaje, Unit } from '../content/schema';
import { buildContent } from './content';
import characters from '../content/characters.json';

const mods = import.meta.glob('../content/units/*.json', { eager: true, import: 'default' }) as Record<string, Unit>;

/** Contenus du jeu (charges a la compilation). */
export const content = buildContent(Object.values(mods), characters as unknown as Personaje[]);
