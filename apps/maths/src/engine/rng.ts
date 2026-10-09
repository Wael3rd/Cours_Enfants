/** RNG injectable : tout le moteur est deterministe si on fournit un seed. */
export interface Rng {
  /** [0, 1) */
  next(): number;
}

export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return {
    next() {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    },
  };
}

export const randomRng: Rng = { next: () => Math.random() };

export const int = (r: Rng, min: number, max: number): number => min + Math.floor(r.next() * (max - min + 1));
export const pick = <T>(r: Rng, arr: readonly T[]): T => arr[Math.floor(r.next() * arr.length)];
export function shuffle<T>(r: Rng, arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r.next() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
/** Tirage pondere ; renvoie l'index. */
export function weighted(r: Rng, weights: readonly number[]): number {
  const total = weights.reduce((s, w) => s + w, 0);
  if (total <= 0) return Math.floor(r.next() * weights.length);
  let x = r.next() * total;
  for (let i = 0; i < weights.length; i++) {
    x -= weights[i];
    if (x < 0) return i;
  }
  return weights.length - 1;
}
