import { ALL_FACTS, operands, type Fact } from './facts.ts';

export interface Zone {
  id: number; // 1..10
  key: string;
  name: string;
  /** Nom de la competition (trophee). */
  cup: string;
  strategy: string;
  covers: (f: Fact) => boolean;
}

const add = (f: Fact) => f.op === '+';
const ab = (f: Fact) => operands(f);

/** Ordre = ordre d'apprentissage. Un fait appartient a la PREMIERE zone qui le couvre. */
export const ZONES: readonly Zone[] = [
  { id: 1, key: 'echauffement', name: 'Échauffement', cup: "Coupe de l'Échauffement", strategy: '+0 et +1',
    covers: (f) => add(f) && (f.left <= 1 || f.right <= 1) },
  { id: 2, key: 'plus2', name: 'Les +2', cup: 'Coupe des Deux', strategy: '+2',
    covers: (f) => add(f) && (f.left === 2 || f.right === 2) },
  { id: 3, key: 'doubles', name: 'Les doubles', cup: 'Coupe des Jumeaux', strategy: 'Doubles',
    covers: (f) => add(f) && f.left === f.right },
  { id: 4, key: 'amoureux10', name: 'Les amoureux de 10', cup: 'Coupe du Dix', strategy: 'Compléments à 10',
    covers: (f) => add(f) && f.answer === 10 },
  { id: 5, key: 'presquedoubles', name: 'Presque-doubles', cup: 'Coupe des Voisins', strategy: 'Presque-doubles (6+7 = 6+6+1)',
    covers: (f) => add(f) && Math.abs(f.left - f.right) === 1 },
  { id: 6, key: 'plus10', name: 'Les +10', cup: 'Coupe Dix-Plus', strategy: '+10',
    covers: (f) => add(f) && (f.left === 10 || f.right === 10) },
  { id: 7, key: 'plus9', name: 'Les +9', cup: 'Coupe Neuf', strategy: '+9 (= +10 puis −1)',
    covers: (f) => add(f) && (f.left === 9 || f.right === 9) },
  { id: 8, key: 'passer-dizaine', name: 'Passer la dizaine', cup: 'Coupe du Grand Saut', strategy: 'Passer la dizaine (8+5 = 8+2+3), et le reste des additions',
    covers: (f) => add(f) },
  { id: 9, key: 'soustractions', name: 'Les soustractions', cup: 'Coupe des Familles', strategy: 'Familles de nombres (3+5=8 donc 8−5, 8−3)',
    covers: (f) => !add(f) },
  { id: 10, key: 'ligue', name: 'Ligue des Champions', cup: 'Ligue des Champions', strategy: 'Calcul mental à 2 chiffres',
    covers: () => false },
];
export const LAST_ZONE = ZONES.length;
export const MENTAL_ZONE = 10;

export const zoneOf = (id: number): Zone => ZONES[id - 1];

/** Ordre d'introduction dans une zone : petites sommes d'abord. */
const order = (a: Fact, b: Fact) => {
  const sa = operands(a).sum, sb = operands(b).sum;
  return sa - sb || operands(a).a - operands(b).a;
};

export const FACT_ZONE: ReadonlyMap<string, number> = (() => {
  const m = new Map<string, number>();
  for (const f of ALL_FACTS) {
    const z = ZONES.find((z) => z.covers(f));
    if (!z) throw new Error(`Fait sans zone ${f.id}`);
    m.set(f.id, z.id);
  }
  return m;
})();

/** Faits de chaque zone (ordre d'introduction). Zone 10 : vide (calcul mental, voir mental.ts). */
export const ZONE_FACTS: readonly (readonly Fact[])[] = ZONES.map((z) =>
  ALL_FACTS.filter((f) => FACT_ZONE.get(f.id) === z.id).sort(order),
);

export const zoneFacts = (zoneId: number): readonly Fact[] => ZONE_FACTS[zoneId - 1] ?? [];
