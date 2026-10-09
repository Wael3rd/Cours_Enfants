import { quetzal, sombra } from '../art/core/qart.js';

/** Portraits SVG (buste) pour DialogBox : le Quetzal et la Sombra n'ont pas d'emoji Fluent adequat. */
export const quetzalBust: string = quetzal({ width: 190, height: 190, view: '210 50 220 220' });
export const sombraBust: string = sombra({ width: 190, height: 228, view: '120 60 260 300' });

export const bustOf = (id: string): string | undefined => (id === 'quetzal' ? quetzalBust : id === 'sombra' ? sombraBust : undefined);
