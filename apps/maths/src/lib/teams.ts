/** Equipes (club du joueur, rivaux) au format des cinematiques : { name, primary, secondary, initials }. */
import type { Club } from '../state/model.ts';

export interface Team { name: string; primary: string; secondary: string; initials: string }

export const teamOf = (c: Club): Team => ({ name: c.name, primary: c.primary, secondary: c.secondary, initials: c.initials });

const RIVALS: Team[] = [
  { name: 'Les Aigles', primary: '#1B6BFF', secondary: '#FFD23F', initials: 'AZ' },
  { name: 'Les Requins', primary: '#0A1030', secondary: '#35D6FF', initials: 'RQ' },
  { name: 'Les Tigres', primary: '#FF8A1F', secondary: '#0A1030', initials: 'TG' },
  { name: 'Les Dragons', primary: '#17B26A', secondary: '#FFFFFF', initials: 'DR' },
  { name: 'Les Comètes', primary: '#8A2BE2', secondary: '#FFD23F', initials: 'CM' },
  { name: 'Les Loups', primary: '#475569', secondary: '#FF4D6D', initials: 'LP' },
];

const dist = (a: string, b: string) => {
  const n = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const A = n(a), B = n(b);
  return Math.hypot(A[0] - B[0], A[1] - B[1], A[2] - B[2]);
};

/** Rival tire au hasard, jamais aux couleurs du club. */
export function pickRival(club: Club, rnd: () => number = Math.random): Team {
  const ok = RIVALS.filter((r) => dist(r.primary, club.primary) > 120 && r.name !== club.name);
  const pool = ok.length ? ok : RIVALS;
  return pool[Math.floor(rnd() * pool.length)];
}

const STOP = new Set(['les', 'fc', 'du', 'de', 'la', 'le', 'des', 'of']);
export function initialsFor(name: string): string {
  const w = name.trim().split(/\s+/).filter((x) => x && !STOP.has(x.toLowerCase()));
  const parts = w.length ? w : name.trim().split(/\s+/);
  const s = parts.length > 1 ? parts[0][0] + parts[1][0] : (parts[0] ?? '?').slice(0, 2);
  return s.toUpperCase();
}

export const CLUB_NAMES = [
  'Les Fusées', 'Les Tigres Rapides', 'FC Tornade', 'Les Requins Verts', 'Les Dragons du Stade', 'Les Super Lions', 'FC Éclair',
  'Les Loups Bleus', 'Les Aigles Dorés', 'FC Bolide', 'Les Panthères', 'Les Étoiles Filantes', 'FC Turbo', 'Les Jaguars', 'Les Comètes Rouges',
];

export const COLOR_CHOICES = ['#E8212F', '#1B6BFF', '#17B26A', '#FFD23F', '#FF8A1F', '#8A2BE2', '#FF4D6D', '#0A1030', '#35D6FF', '#FFFFFF'];
export const POSITIONS: Record<string, string> = { Gardien: 'GAR', Défenseur: 'DEF', Milieu: 'MIL', Attaquant: 'ATT' };
