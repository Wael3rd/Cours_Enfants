import { ALL_FACTS, addId, operands, type Fact } from './facts.ts';

export interface Zone {
  id: number; // 1..9
  key: string;
  name: string;
  /** Nom de la competition (trophee). */
  cup: string;
  strategy: string;
  /** Additions couvertes (les soustractions inverses suivent leur addition parente, voir FACT_ZONE). */
  covers: (f: Fact) => boolean;
}

const add = (f: Fact) => f.op === '+';

/**
 * Ordre = ordre d'apprentissage. Une addition appartient a la PREMIERE zone qui la couvre ; sa famille de nombres
 * (les soustractions inverses c - a = b) la suit dans la meme zone. Zone 9 = calcul mental (aucun fait).
 */
export const ZONES: readonly Zone[] = [
  { id: 1, key: 'echauffement', name: 'Échauffement', cup: "Coupe de l'Échauffement", strategy: '+0 et +1, et leurs soustractions',
    covers: (f) => add(f) && (f.left <= 1 || f.right <= 1) },
  { id: 2, key: 'plus2', name: 'Les +2', cup: 'Coupe des Deux', strategy: '+2, et ses soustractions',
    covers: (f) => add(f) && (f.left === 2 || f.right === 2) },
  { id: 3, key: 'doubles', name: 'Les doubles', cup: 'Coupe des Jumeaux', strategy: 'Doubles, et leurs moitiés',
    covers: (f) => add(f) && f.left === f.right },
  { id: 4, key: 'amoureux10', name: 'Les amoureux de 10', cup: 'Coupe du Dix', strategy: 'Compléments à 10, et 10 − …',
    covers: (f) => add(f) && f.answer === 10 },
  { id: 5, key: 'presquedoubles', name: 'Presque-doubles', cup: 'Coupe des Voisins', strategy: 'Presque-doubles (6+7 = 6+6+1), et leurs soustractions',
    covers: (f) => add(f) && Math.abs(f.left - f.right) === 1 },
  { id: 6, key: 'plus10', name: 'Les +10', cup: 'Coupe Dix-Plus', strategy: '+10, et ses soustractions',
    covers: (f) => add(f) && (f.left === 10 || f.right === 10) },
  { id: 7, key: 'plus9', name: 'Les +9', cup: 'Coupe Neuf', strategy: '+9 (= +10 puis −1), et ses soustractions',
    covers: (f) => add(f) && (f.left === 9 || f.right === 9) },
  { id: 8, key: 'passer-dizaine', name: 'Passer la dizaine', cup: 'Coupe du Grand Saut', strategy: 'Passer la dizaine (8+5 = 8+2+3), le reste des additions et leurs soustractions',
    covers: (f) => add(f) },
  { id: 9, key: 'ligue', name: 'Ligue des Champions', cup: 'Ligue des Champions', strategy: 'Calcul mental à 2 chiffres',
    covers: () => false },
];
export const LAST_ZONE = ZONES.length;
export const MENTAL_ZONE = 9;
/** Derniere zone de faits (la 9 = calcul mental). */
export const LAST_FACT_ZONE = MENTAL_ZONE - 1;

export const zoneOf = (id: number): Zone => ZONES[id - 1];

/** Additions parentes d'une soustraction c - a = b : a + b et b + a (vide pour une addition). */
export const parentIds = (f: Fact): string[] => {
  if (f.op === '+') return [];
  const a = f.right, b = f.answer;
  return a === b ? [addId(a, b)] : [addId(a, b), addId(b, a)];
};

/** Ordre d'introduction dans une zone : petites sommes d'abord, l'addition avant ses soustractions. */
const order = (a: Fact, b: Fact) => {
  const sa = operands(a).sum, sb = operands(b).sum;
  return sa - sb || (a.op === b.op ? operands(a).a - operands(b).a : a.op === '+' ? -1 : 1);
};

export const FACT_ZONE: ReadonlyMap<string, number> = (() => {
  const m = new Map<string, number>();
  for (const f of ALL_FACTS) {
    if (f.op !== '+') continue;
    const z = ZONES.find((z) => z.covers(f));
    if (!z) throw new Error(`Fait sans zone ${f.id}`);
    m.set(f.id, z.id);
  }
  // soustraction = zone de son addition parente la plus precoce
  for (const f of ALL_FACTS) if (f.op === '-') m.set(f.id, Math.min(...parentIds(f).map((id) => m.get(id)!)));
  return m;
})();

/** Faits de chaque zone (ordre d'introduction). Zone 9 : vide (calcul mental, voir mental.ts). */
export const ZONE_FACTS: readonly (readonly Fact[])[] = ZONES.map((z) =>
  ALL_FACTS.filter((f) => FACT_ZONE.get(f.id) === z.id).sort(order),
);

export const zoneFacts = (zoneId: number): readonly Fact[] => ZONE_FACTS[zoneId - 1] ?? [];
