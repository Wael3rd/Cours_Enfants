/** Modele des faits : 121 additions (a,b in 0..10) + 121 soustractions inverses (c - a = b, c = a + b <= 20). */
export type Op = '+' | '-';

export interface Fact {
  /** "3+5" (a+b) ou "8-3" (c-a). Unique. */
  id: string;
  op: Op;
  /** Operande gauche affiche (a pour +, c pour -). */
  left: number;
  /** Operande droit affiche (b pour +, a pour -). */
  right: number;
  answer: number;
  /** Id du fait commutatif lie (3+5 <-> 5+3 ; 8-3 <-> 8-5), null si symetrique (a=b). */
  partner: string | null;
}

export const MAX_OPERAND = 10;

export const addId = (a: number, b: number) => `${a}+${b}`;
export const subId = (c: number, a: number) => `${c}-${a}`;

function makeAdd(a: number, b: number): Fact {
  return { id: addId(a, b), op: '+', left: a, right: b, answer: a + b, partner: a === b ? null : addId(b, a) };
}
/** Soustraction c - a = b (donc a + b = c). */
function makeSub(a: number, b: number): Fact {
  const c = a + b;
  return { id: subId(c, a), op: '-', left: c, right: a, answer: b, partner: a === b ? null : subId(c, b) };
}

export const ALL_FACTS: readonly Fact[] = (() => {
  const out: Fact[] = [];
  for (let a = 0; a <= MAX_OPERAND; a++) for (let b = 0; b <= MAX_OPERAND; b++) out.push(makeAdd(a, b));
  for (let a = 0; a <= MAX_OPERAND; a++) for (let b = 0; b <= MAX_OPERAND; b++) out.push(makeSub(a, b));
  return out;
})();

export const FACT_BY_ID: ReadonlyMap<string, Fact> = new Map(ALL_FACTS.map((f) => [f.id, f]));

export const getFact = (id: string): Fact => {
  const f = FACT_BY_ID.get(id);
  if (!f) throw new Error(`Fait inconnu : ${id}`);
  return f;
};

/** Operandes (a, b) tels que a + b = somme, quel que soit l'op : pour + (left,right), pour - (right, answer). */
export function operands(f: Fact): { a: number; b: number; sum: number } {
  return f.op === '+'
    ? { a: f.left, b: f.right, sum: f.answer }
    : { a: f.right, b: f.answer, sum: f.left };
}

export const factText = (f: Fact) => `${f.left} ${f.op === '+' ? '+' : '−'} ${f.right}`;
export const factDigits = (f: Fact) => String(f.answer).length;
