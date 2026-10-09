/** Indices visuels : quel manipulable montrer pour chaque fait (modelisation apres erreur + entrainement). */
import { operands, type Fact } from './facts.ts';
import { FACT_ZONE } from './zones.ts';
import type { MentalQuestion } from './mental.ts';

export type HintKind =
  | 'plus-zero' // +0 : rien ne change
  | 'number-line' // ligne numerique (le terrain) : sauts
  | 'doubles' // deux equipes en miroir
  | 'ten-frame' // cadre a 10 (formation de joueurs)
  | 'make-ten' // complement a 10
  | 'near-double' // 6+7 = 6+6+1
  | 'plus-ten' // +10 : un saut de dizaine
  | 'plus-nine' // +9 = +10 puis -1
  | 'bridge-ten' // 8+5 = 8+2+3
  | 'fact-family'; // 3 + 5 = 8 donc 8 - 5 = 3

export interface HintStep {
  /** Texte court de l'etape, ex "8 + 2 = 10". */
  label: string;
  /** Valeur atteinte sur la ligne / dans le cadre apres l'etape. */
  value: number;
}

export interface VisualHint {
  kind: HintKind;
  /** Zone du fait (ou 10 pour le calcul mental). */
  zone: number;
  /** Operandes pour dessiner : premier groupe, second groupe (additions) ; famille: [a, b, c]. */
  a: number;
  b: number;
  result: number;
  steps: HintStep[];
  /** Phrase FR de consigne / explication (affichee et dite). */
  caption: string;
  /** Duree conseillee d'affichage apres une erreur (ms). */
  showMs: number;
}

export const MODEL_MS = 1500;

export function hintFor(item: Fact | MentalQuestion): VisualHint {
  if ('kind' in item) return mentalHint(item);
  const f = item;
  const zone = FACT_ZONE.get(f.id)!;
  const { a, b, sum } = operands(f);
  const H = (kind: HintKind, steps: HintStep[], caption: string, ha = a, hb = b): VisualHint => ({
    kind, zone, a: ha, b: hb, result: f.answer, steps, caption, showMs: MODEL_MS,
  });

  if (f.op === '-') {
    return H('fact-family', [
      { label: `${a} + ${b} = ${sum}`, value: sum },
      { label: `${sum} − ${a} = ${b}`, value: b },
    ], `${a} + ${b} = ${sum}, donc ${sum} − ${a} = ${b} et ${sum} − ${b} = ${a}.`, a, b);
  }
  const big = Math.max(a, b), small = Math.min(a, b);
  switch (zone) {
    case 1:
      if (small === 0) return H('plus-zero', [{ label: `${big} + 0 = ${big}`, value: big }], `Ajouter 0, rien ne change : ${big}.`);
      return H('number-line', [{ label: `${big} → ${big + 1}`, value: big + 1 }], `+1 : c'est le nombre d'après ${big}, ${big + 1}.`);
    case 2:
      return H('number-line', [
        { label: `${big} + 1 = ${big + 1}`, value: big + 1 },
        { label: `${big + 1} + 1 = ${big + 2}`, value: big + 2 },
      ], `+2 : deux petits pas sur le terrain, ${big + 1} puis ${big + 2}.`);
    case 3:
      return H('doubles', [{ label: `${a} + ${a} = ${2 * a}`, value: 2 * a }], `Les jumeaux : ${a} et ${a} en miroir, ça fait ${2 * a}.`);
    case 4:
      return H('make-ten', [{ label: `${a} + ${b} = 10`, value: 10 }], `${a} et ${b} sont des amoureux de 10 : ensemble, ils font 10.`);
    case 5:
      return H('near-double', [
        { label: `${small} + ${small} = ${2 * small}`, value: 2 * small },
        { label: `${2 * small} + 1 = ${2 * small + 1}`, value: 2 * small + 1 },
      ], `${a} + ${b} : le double de ${small} (${2 * small}), plus 1 = ${f.answer}.`);
    case 6:
      return H('plus-ten', [{ label: `${small} + 10 = ${small + 10}`, value: small + 10 }], `+10 : on saute une dizaine, ${small} devient ${small + 10}.`, small, 10);
    case 7:
      return H('plus-nine', [
        { label: `${small} + 10 = ${small + 10}`, value: small + 10 },
        { label: `${small + 10} − 1 = ${small + 9}`, value: small + 9 },
      ], `+9 : d'abord +10 (${small + 10}), puis −1 = ${small + 9}.`, small, 9);
    default: {
      if (sum <= 10) {
        return H('ten-frame', [{ label: `${a} + ${b} = ${sum}`, value: sum }], `Dans le cadre à 10 : ${a} joueurs plus ${b} joueurs = ${sum}.`);
      }
      const toTen = 10 - big;
      const rest = small - toTen;
      return H('bridge-ten', [
        { label: `${big} + ${toTen} = 10`, value: 10 },
        { label: `10 + ${rest} = ${sum}`, value: sum },
      ], `${big} + ${small} : je complète ${big} jusqu'à 10 avec ${toTen}, il reste ${rest}, ça fait ${sum}.`, big, small);
    }
  }
}

function mentalHint(q: MentalQuestion): VisualHint {
  const base = { zone: 10, result: q.answer, showMs: MODEL_MS };
  switch (q.cat) {
    case 'tens': {
      const l = q.left / 10, r = (q.right ?? 0) / 10;
      return { ...base, kind: 'number-line', a: q.left, b: q.right ?? 0, steps: [{ label: `${l} ${q.op === '+' ? '+' : '−'} ${r} = ${q.answer / 10}`, value: q.answer }],
        caption: `Compte en dizaines : ${l} ${q.op === '+' ? '+' : '−'} ${r} = ${q.answer / 10} dizaines, donc ${q.answer}.` };
    }
    case 'to-ten':
      return { ...base, kind: 'make-ten', a: q.left, b: q.answer, steps: [{ label: `${q.left} + ${q.answer} = ${q.left + q.answer}`, value: q.left + q.answer }],
        caption: `De ${q.left} jusqu'à la dizaine suivante, il manque ${q.answer}.` };
    case 'two-one-carry': {
      const d = q.right ?? 0;
      if (q.op === '+') {
        const toTen = 10 - (q.left % 10);
        return { ...base, kind: 'bridge-ten', a: q.left, b: d, steps: [
          { label: `${q.left} + ${toTen} = ${q.left + toTen}`, value: q.left + toTen },
          { label: `${q.left + toTen} + ${d - toTen} = ${q.answer}`, value: q.answer }],
          caption: `${q.left} + ${d} : j'arrive à ${q.left + toTen}, puis j'ajoute ${d - toTen}.` };
      }
      const u = q.left % 10;
      return { ...base, kind: 'bridge-ten', a: q.left, b: d, steps: [
        { label: `${q.left} − ${u} = ${q.left - u}`, value: q.left - u },
        { label: `${q.left - u} − ${d - u} = ${q.answer}`, value: q.answer }],
        caption: `${q.left} − ${d} : je descends à ${q.left - u}, puis j'enlève encore ${d - u}.` };
    }
    default:
      return { ...base, kind: 'number-line', a: q.left, b: q.right ?? 0, steps: [{ label: `${q.text.split('=')[0].trim()} = ${q.answer}`, value: q.answer }],
        caption: `Les dizaines ne bougent pas : on ne calcule que les unités.` };
  }
}
