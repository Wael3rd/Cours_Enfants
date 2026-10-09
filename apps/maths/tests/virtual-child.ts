import { mulberry32, type Rng } from '../src/engine/rng.ts';
import { FACT_ZONE } from '../src/engine/zones.ts';
import type { Question } from '../src/engine/builder.ts';

export interface ChildProfile {
  /** Precision de depart (1re rencontre) et plafond. */
  acc0: number;
  accMax: number;
  /** Temps de depart (ms) pour un fait neuf de zone 1, et temps plancher. */
  t0: number;
  tMin: number;
  /** Vitesse d'apprentissage : nombre de pratiques pour combler ~63 % de l'ecart. */
  tau: number;
  /** Faits deja connus (id -> pratiques deja accumulees). */
  priorZone?: number;
}

export class VirtualChild {
  private n = new Map<string, number>();
  private rng: Rng;
  constructor(public cp: ChildProfile, seed = 1) {
    this.rng = mulberry32(seed * 7919 + 13);
    this.priorZone = cp.priorZone ?? 0;
  }
  priorZone: number;

  private key(q: Question) { return q.kind === 'mental' ? `cat:${q.cat}` : q.id; }

  private practice(q: Question): number {
    const z = q.kind === 'fact' ? FACT_ZONE.get(q.id)! : 10;
    let n = (this.n.get(this.key(q)) ?? 0) + (z <= this.priorZone ? 30 : 0);
    if (q.kind === 'fact' && q.op === '-') {
      // transfert de famille : c - a = b profite de a + b et b + a deja travailles
      const a = q.right, b = q.answer;
      n += 0.5 * ((this.n.get(`${a}+${b}`) ?? 0) + (a === b ? 0 : (this.n.get(`${b}+${a}`) ?? 0)));
    }
    return n;
  }

  /** Reponse + temps. */
  answer(q: Question): { value: number; ms: number } {
    const n = this.practice(q);
    const z = q.kind === 'fact' ? FACT_ZONE.get(q.id)! : 10;
    const hardness = 1 + 0.025 * (z - 1); // zones tardives un peu plus dures
    const learn = 1 - Math.exp(-n / this.cp.tau);
    const pOk = Math.min(this.cp.accMax, (this.cp.acc0 + (this.cp.accMax - this.cp.acc0) * learn) / 1);
    const base = (this.cp.t0 * hardness) * (1 - learn) + this.cp.tMin * hardness * learn;
    const noise = Math.exp((this.rng.next() - 0.5) * 0.5);
    const ok = this.rng.next() < pOk;
    const mult = q.kind === 'mental' ? 2 : 1;
    const ms = Math.max(500, base * noise * mult * (ok ? 1 : 1.3));
    this.n.set(this.key(q), (this.n.get(this.key(q)) ?? 0) + (ok ? 1 : 0.6)); // une erreur modelisee apprend un peu
    return { value: ok ? q.answer : q.answer + (this.rng.next() < 0.5 ? 1 : -1) || q.answer + 1, ms };
  }
}

export const AVERAGE_CHILD: ChildProfile = { acc0: 0.75, accMax: 0.97, t0: 5200, tMin: 1700, tau: 4 };
export const SLOW_CHILD: ChildProfile = { acc0: 0.65, accMax: 0.95, t0: 6500, tMin: 2000, tau: 6 };
export const FAST_CHILD: ChildProfile = { acc0: 0.9, accMax: 0.99, t0: 3200, tMin: 1300, tau: 2, priorZone: 9 };
