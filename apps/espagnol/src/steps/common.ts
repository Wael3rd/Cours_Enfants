import type { Answer, StepResult, Vocab } from '../engine/types';
import type { Step } from '../content/schema';
import { content } from '../engine/data';
import { rng, shuffle } from '../engine/mission';

/** Contrat commun des composants d'etape. */
export interface StepProps<S extends Step = Step> {
  step: S;
  /** resultat une fois l'etape corrigee par la coque (null avant) */
  result: StepResult | null;
  /** envoie la reponse a corriger */
  onanswer: (a: Answer) => void;
  /** ouvre / ferme la Pista de l'etape (comptabilisee par la coque) */
  onhint?: () => void;
}

/** Mot de vocabulaire (charge) ou undefined. */
export const vocabById = (id: string | undefined): (Vocab & { unitId: string }) | undefined => (id ? content.vocab.get(id) : undefined);

/** Melange stable par etape (meme ordre a chaque rendu). */
export function stableShuffle<T>(arr: T[], seed: string): T[] {
  return shuffle(arr, rng(seed));
}

/** Article de genre d'une carte-objet. */
export function articleOf(v: Vocab): 'el' | 'la' | '' {
  return v.genero === 'm' ? 'el' : v.genero === 'f' ? 'la' : '';
}

export const RARITY_UI = { comun: 'comun', poco_comun: 'comun', raro: 'raro', epico: 'epico', legendario: 'legendario' } as const;

/** Texte de la Pista (francais) d'une etape. */
export function hintText(step: Step): string {
  const parts: string[] = [];
  const consigna = 'consigna' in step ? step.consigna.fr : '';
  if (consigna) parts.push(consigna);
  switch (step.tipo) {
    case 'flashcard':
      for (const id of step.vocab) {
        const v = vocabById(id);
        if (v) parts.push(`${v.es} = ${v.fr}`);
      }
      break;
    case 'match_image':
      for (const p of step.pares) {
        const v = vocabById(p.vocab);
        if (v) parts.push(`${v.es} = ${v.fr}`);
      }
      break;
    case 'listen_choose':
      for (const o of step.opciones) {
        const v = vocabById(o.vocab);
        if (v) parts.push(`${v.es} = ${v.fr}`);
      }
      break;
    case 'fill_blank':
      if (step.fr) parts.push(step.fr);
      break;
    case 'reorder_words':
      if (step.fr) parts.push(step.fr);
      break;
    case 'conjugar':
      if (step.fr) parts.push(step.fr);
      break;
    case 'dialogue_choice':
      parts.push(step.replica.fr);
      for (const o of step.opciones) if (o.fr) parts.push(`« ${o.habla.es} » = ${o.fr}`);
      break;
    case 'read_answer':
      parts.push(step.texto.fr);
      break;
    case 'speak':
      parts.push(step.objetivo.fr);
      if (step.foco) parts.push(step.foco);
      break;
    case 'true_false':
      parts.push(step.afirmacion.fr);
      break;
    case 'grammar_card': {
      const g = content.grammar.get(step.ref);
      if (g) parts.push(g.titulo.fr, g.pista);
      break;
    }
    case 'write_free':
      for (const c of step.campos) parts.push(`• ${c.pista}`);
      parts.push(step.modelo.fr);
      break;
    case 'dictado':
      break;
    case 'cinematic_ref':
      parts.push(step.escena.titulo);
      break;
  }
  return parts.filter(Boolean).join('\n');
}
