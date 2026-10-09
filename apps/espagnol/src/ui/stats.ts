import type { StatId } from '../content/schema';

/** Les 5 stats RPG (activites langagieres) : libelle espagnol, couleur, icone (trace 48x48). */
export const STAT_INFO: Record<StatId, { label: string; color: string; icon: string }> = {
  escuchar: { label: 'Escuchar', color: '#19b7aa', icon: 'M10 20h7l9-8v24l-9-8h-7Zm17-3q6 7 0 14' },
  hablar: { label: 'Hablar', color: '#ff9f1c', icon: 'M8 10h28a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H22l-9 8v-8H8a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4Z' },
  leer: { label: 'Leer', color: '#3a8dff', icon: 'M6 10q10-3 18 3 8-6 18-3v26q-10-3-18 3-8-6-18-3Zm18 3v26' },
  escribir: { label: 'Escribir', color: '#d93472', icon: 'M8 40l4-12 22-22 8 8-22 22Zm20-30l8 8' },
  cultura: { label: 'Cultura', color: '#0e9f6e', icon: 'M24 6a18 18 0 1 0 0 36 18 18 0 0 0 0-36Zm-18 18h36M24 6q-10 18 0 36M24 6q10 18 0 36' },
};
export const STAT_ORDER: StatId[] = ['escuchar', 'hablar', 'leer', 'escribir', 'cultura'];
