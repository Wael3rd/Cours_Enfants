/** Constructeur de session : choisit la prochaine question (nouveaux / dus / fluents, reinsertion des erreurs). */
import { ALL_FACTS, factDigits, factText, type Fact } from './facts.ts';
import { FACT_ZONE, MENTAL_ZONE, LAST_FACT_ZONE, zoneFacts } from './zones.ts';
import {
  isFluent, isSeen, isLearning, isZoneUnlocked, isFactAvailable, learningCount, reviewableFacts, MAX_LEARNING, type Progress, type AnswerOutcome,
} from './progress.ts';
import { genMental, pickMentalCat, type MentalQuestion } from './mental.ts';
import { weighted, int, type Rng } from './rng.ts';

export interface FactQuestion {
  kind: 'fact';
  id: string;
  fact: Fact;
  /** Texte du calcul, ex "7 + 8". */
  text: string;
  op: '+' | '-';
  left: number;
  right: number;
  answer: number;
  /** Nombre de chiffres de la reponse (validation automatique du pave). */
  digits: number;
  zone: number;
  /** Premier passage de ce fait (jamais vu avant cette session) : montrer l'indice avant. */
  isNew: boolean;
  /** Fait revenu apres une erreur / repetition incrementale. */
  isRetry: boolean;
}
export type Question = FactQuestion | MentalQuestion;

export function factQuestion(f: Fact, isNew = false, isRetry = false): FactQuestion {
  return {
    kind: 'fact', id: f.id, fact: f, text: factText(f), op: f.op, left: f.left, right: f.right,
    answer: f.answer, digits: factDigits(f), zone: FACT_ZONE.get(f.id)!, isNew, isRetry,
  };
}

/** Proportions cibles d'une session. */
export const MIX = { fresh: 0.15, due: 0.6, fluent: 0.25 } as const;

interface Pending { id: string; at: number; kind: 'error' | 'incremental' }

export interface BuilderOptions {
  /** Restreint aux faits de cette zone (entrainement). 9 = calcul mental uniquement. */
  zone?: number;
  /** Part de questions de calcul mental quand la zone de travail est la 9 (defaut 0.5). */
  mentalShare?: number;
}

export class QuestionBuilder {
  pending: Pending[] = [];
  asked = new Map<string, number>();
  introduced = new Set<string>();
  correctInSession = new Map<string, number>();
  private mentalAsked = new Set<string>();

  constructor(
    private p: Progress,
    private T: number,
    private rng: Rng,
    private opts: BuilderOptions = {},
  ) {}

  /** Erreurs a re-poser avant la fin. */
  get pendingErrors(): number {
    return this.pending.filter((x) => x.kind === 'error').length;
  }

  private mentalMode(): 'all' | 'mix' | 'none' {
    if (this.opts.zone === MENTAL_ZONE) return 'all';
    if (this.opts.zone === undefined && this.p.focusZone === MENTAL_ZONE) return 'mix';
    return 'none';
  }

  /** Prochaine question. `force` : servir une erreur en attente meme si elle n'est pas encore due. */
  pick(idx: number, lastId: string | null, force = false): Question {
    // 1. fait en attente (erreur / repetition incrementale) arrive a echeance
    const due = this.pending
      .filter((x) => (x.at <= idx || (force && x.kind === 'error')) && x.id !== lastId)
      .sort((a, b) => a.at - b.at)[0];
    if (due) {
      this.pending.splice(this.pending.indexOf(due), 1);
      return this.mark(due.id, false, true);
    }
    // 2. calcul mental
    const mm = this.mentalMode();
    if (mm === 'all' || (mm === 'mix' && this.rng.next() < (this.opts.mentalShare ?? 0.5))) {
      return this.mentalQuestion(lastId);
    }
    // 3. un fait
    return this.pickFact(lastId);
  }

  private mark(id: string, isNew: boolean, isRetry: boolean): Question {
    this.asked.set(id, (this.asked.get(id) ?? 0) + 1);
    if (isNew) this.introduced.add(id);
    if (id.startsWith('m:')) return this.mentalById.get(id)!;
    return factQuestion(ALL_FACTS.find((f) => f.id === id)!, isNew, isRetry);
  }
  private mentalById = new Map<string, MentalQuestion>();

  private mentalQuestion(lastId: string | null): MentalQuestion {
    let q: MentalQuestion | null = null;
    for (let i = 0; i < 8; i++) {
      const cand = genMental(this.rng, pickMentalCat(this.rng, this.p.mental));
      if (cand.id !== lastId && !this.mentalAsked.has(cand.id)) { q = cand; break; }
      q = cand;
    }
    this.mentalAsked.add(q!.id);
    this.mentalById.set(q!.id, q!);
    this.asked.set(q!.id, 1);
    return q!;
  }

  private newPool(): Fact[] {
    if (learningCount(this.p, this.T) >= MAX_LEARNING) return [];
    const zones = this.opts.zone !== undefined ? [this.opts.zone] : zonesToIntroduce(this.p);
    for (const z of zones) {
      if (!isZoneUnlocked(this.p, z)) continue;
      const fresh = zoneFacts(z).filter((f) => !isSeen(this.p.facts[f.id]) && !this.introduced.has(f.id) && isFactAvailable(this.p, f, this.T));
      if (fresh.length) return fresh;
    }
    return [];
  }

  private pickFact(lastId: string | null): FactQuestion {
    const { p, T, rng } = this;
    const review = reviewableFacts(p, this.opts.zone).filter((f) => f.id !== lastId);
    const dueOrNon = review.filter((f) => !isFluent(p.facts[f.id], T) || p.facts[f.id].dueAt <= p.sessionCount);
    const fluent = review.filter((f) => !dueOrNon.includes(f));
    const fresh = this.newPool().filter((f) => f.id !== lastId);

    const roll = rng.next();
    const order: ('fresh' | 'due' | 'fluent')[] =
      roll < MIX.fresh ? ['fresh', 'due', 'fluent'] : roll < MIX.fresh + MIX.due ? ['due', 'fresh', 'fluent'] : ['fluent', 'due', 'fresh'];
    for (const cat of order) {
      if (cat === 'fresh' && fresh.length) {
        // premier de la liste ordonnee ; legere variation pour eviter la monotonie
        const f = fresh[Math.min(fresh.length - 1, int(rng, 0, 1))];
        return this.mark(f.id, true, false) as FactQuestion;
      }
      if (cat === 'due' && dueOrNon.length) return this.mark(this.weightedPick(dueOrNon).id, false, false) as FactQuestion;
      if (cat === 'fluent' && fluent.length) return this.mark(this.weightedPick(fluent).id, false, false) as FactQuestion;
    }
    // Repli : n'importe quel fait vu, puis un fait de la zone de travail.
    if (review.length) return this.mark(this.weightedPick(review).id, false, false) as FactQuestion;
    const zoneId = this.opts.zone ?? Math.min(p.focusZone, LAST_FACT_ZONE);
    const pool = zoneFacts(zoneId).filter((f) => f.id !== lastId && isFactAvailable(p, f, T));
    const f = pool[Math.floor(rng.next() * pool.length)] ?? ALL_FACTS[0];
    return this.mark(f.id, !isSeen(p.facts[f.id]), false) as FactQuestion;
  }

  /** Priorite : boite basse, erreurs, retard ; moins si deja pose dans la session. */
  private weightedPick(fs: Fact[]): Fact {
    const w = fs.map((f) => {
      const s = this.p.facts[f.id];
      const err = s && s.attempts ? s.errors / s.attempts : 0;
      const overdue = Math.max(0, this.p.sessionCount - s.dueAt);
      const base = 1 + (5 - s.box) * 0.6 + err * 3 + Math.min(overdue, 6) * 0.3 + (isLearning(s, this.T) ? 1.5 : 0);
      return base / (1 + 1.5 * (this.asked.get(f.id) ?? 0));
    });
    return fs[weighted(this.rng, w)];
  }

  /** A appeler apres chaque reponse : programme les retours (erreur = 2-4 questions plus tard). */
  onAnswer(q: Question, ok: boolean, idx: number): void {
    this.pending = this.pending.filter((x) => x.id !== q.id);
    if (!ok) {
      this.pending.push({ id: q.id, at: idx + int(this.rng, 2, 4), kind: 'error' });
      this.correctInSession.set(q.id, 0);
      return;
    }
    const n = (this.correctInSession.get(q.id) ?? 0) + 1;
    this.correctInSession.set(q.id, n);
    // Repetition incrementale d'un fait introduit dans cette session : +3-4, puis +6-8.
    if (q.kind === 'fact' && this.introduced.has(q.id) && n <= 2) {
      this.pending.push({ id: q.id, at: idx + (n === 1 ? int(this.rng, 3, 4) : int(this.rng, 6, 8)), kind: 'incremental' });
    }
  }
}

/**
 * Ordre d'introduction des nouveaux faits : zones debloquees de la plus basse a la plus haute. Ce qui reste a apprendre
 * en bas (soustractions dont l'addition parente vient de devenir fluente) passe avant les faits de la zone de travail :
 * les familles de nombres se travaillent au fil de l'eau.
 */
function zonesToIntroduce(p: Progress): number[] {
  const out: number[] = [];
  for (let z = 1; z <= LAST_FACT_ZONE; z++) if (isZoneUnlocked(p, z)) out.push(z);
  if (!out.includes(p.focusZone) && p.focusZone <= LAST_FACT_ZONE) out.push(p.focusZone);
  return out;
}

export type { AnswerOutcome };
