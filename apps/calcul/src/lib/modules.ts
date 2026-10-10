/** Les modules d'entrainement = les 9 zones du moteur, avec un nom clair, un exemple et une explication tres courte. */
import { mulberry32 } from '../../../maths/src/engine/rng.ts';
import { genMental, getFact, hintFor, type VisualHint } from '../../../maths/src/engine/index.ts';

export interface ModuleDef {
  zone: number;
  name: string;
  example: string;
  /** Strategie en une phrase. */
  tip: string;
  /** Detail court (2e ligne de la carte d'explication). */
  more: string;
  /** Fait servant d'exemple visuel (id du moteur) ; la zone 9 utilise un calcul mental. */
  demo: string;
  /** Voix pre-generee `fr/strategy_<n>.mp3` (absente pour 3 et 9 : leur texte parle d'equipes / de ligue). */
  voice: boolean;
}

export const MODULES: readonly ModuleDef[] = [
  { zone: 1, name: 'Ajouter 0 ou 1', example: '6 + 1', demo: '6+1', voice: true,
    tip: '+ 0 : on ne change rien. + 1 : on dit le nombre d’après.', more: '6 + 1 = 7, parce que 7 vient juste après 6.' },
  { zone: 2, name: 'Ajouter 2', example: '6 + 2', demo: '6+2', voice: true,
    tip: '+ 2 : deux petits pas sur la ligne des nombres.', more: '6 + 2 : on va à 7, puis à 8.' },
  { zone: 3, name: 'Les doubles', example: '6 + 6', demo: '6+6', voice: false,
    tip: 'Un double : deux fois le même nombre.', more: '7 + 7 = 14. On apprend les doubles par cœur !' },
  { zone: 4, name: 'Les amoureux de 10', example: '3 + 7', demo: '3+7', voice: true,
    tip: 'Deux nombres qui font 10 ensemble.', more: '3 + 7, 4 + 6, 5 + 5… Cherche ce qui manque pour faire 10.' },
  { zone: 5, name: 'Les presque-doubles', example: '6 + 7', demo: '6+7', voice: true,
    tip: 'On prend le double, puis on ajoute 1.', more: '6 + 7 : le double de 6 est 12, plus 1 fait 13.' },
  { zone: 6, name: 'Ajouter 10', example: '7 + 10', demo: '7+10', voice: true,
    tip: '+ 10 : on saute une dizaine.', more: '7 + 10 = 17. Le chiffre des unités ne change pas.' },
  { zone: 7, name: 'Ajouter 9', example: '7 + 9', demo: '7+9', voice: true,
    tip: '+ 9 : on ajoute 10, puis on enlève 1.', more: '7 + 9 : 7 + 10 = 17, puis 17 − 1 = 16.' },
  { zone: 8, name: 'Passer la dizaine', example: '8 + 5', demo: '8+5', voice: true,
    tip: 'On complète jusqu’à 10, puis on ajoute le reste.', more: '8 + 5 : 8 + 2 = 10, puis 10 + 3 = 13.' },
  { zone: 9, name: 'Calcul mental', example: '38 + 7', demo: '', voice: false,
    tip: 'On calcule d’abord avec les dizaines, puis avec les unités.', more: '38 + 7 : 38 + 2 = 40, puis 40 + 5 = 45.' },
];

export const SUB_TIP = 'Les soustractions : on pense à l’addition. 8 − 5 ? Je sais que 5 + 3 = 8.';

/** Indice visuel de l'exemple d'un module. */
export function demoHint(m: ModuleDef): VisualHint {
  if (m.zone === 9) return hintFor(genMental(mulberry32(3), 'two-one-carry'));
  return hintFor(getFact(m.demo));
}

/** Vocabulaire du moteur sans univers : « joueurs » -> « ronds », « sur le terrain » supprime. */
export function plain(text: string): string {
  return text
    .replace(/ sur le terrain/g, '')
    .replace(/joueurs/g, 'ronds')
    .replace(/Les jumeaux : /g, 'Double : ')
    .replace(/ sont des amoureux de 10 : ensemble, ils font 10\./g, ' : ensemble, ça fait 10.');
}

/** Etoiles 0-3 depuis la part de faits maitrises. */
export const starsOf = (ratio: number): number => (ratio >= 0.8 ? 3 : ratio >= 0.5 ? 2 : ratio >= 0.2 ? 1 : 0);
