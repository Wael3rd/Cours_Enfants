import type { Personaje, Quest, Unit } from '../content/schema';
import { buildContent } from './content';
import type { Content } from './types';
import characters from '../content/characters.json';
import unitsIndex from '../content/units-index.json';

/**
 * Contenus du jeu, charges A LA DEMANDE.
 * - `content` est un singleton MUTABLE : au depart il contient des unites "squelettes" (units-index.json, genere par
 *   tools/content/build-units-index.mjs : titres, quetes, plume, evenement - sans vocabulaire ni etapes), ce qui suffit pour
 *   la carte, les statuts et la progression.
 * - Le contenu complet d'une unite (vocab, grammaire, etapes) vient d'un import dynamique (un chunk JS par unite) :
 *   `await loadUnit('u01')` avant de jouer / d'afficher ses cartes. `content` est alors reconstruit en place.
 */
const lazy = import.meta.glob('../content/units/*.json', { import: 'default' }) as Record<string, () => Promise<Unit>>;
const loaders = new Map<string, () => Promise<Unit>>();
for (const [path, fn] of Object.entries(lazy)) loaders.set(path.split('/').pop()!.replace('.json', ''), fn);

type IndexQuest = Omit<Quest, 'steps'> & { nSteps: number };
type IndexUnit = Omit<Unit, 'vocab' | 'gramatica' | 'quests' | 'objetivos'> & { quests: IndexQuest[]; nVocab: number };

const stubs: Unit[] = (unitsIndex as unknown as IndexUnit[]).map((u) => ({
  ...u,
  objetivos: [],
  vocab: [],
  gramatica: [],
  quests: u.quests.map(({ nSteps: _n, ...q }) => ({ ...q, steps: [] })),
}));

const loaded = new Map<string, Unit>();
const pending = new Map<string, Promise<Unit>>();

function rebuild(): void {
  const units = stubs.map((s) => loaded.get(s.id) ?? s);
  Object.assign(content, buildContent(units, characters as unknown as Personaje[]));
}

/** Contenus du jeu (squelettes + unites deja chargees). */
export const content: Content = buildContent(stubs, characters as unknown as Personaje[]);

/** Nombre de mots d'une unite (connu meme si elle n'est pas chargee). */
export const vocabCount = (unitId: string) => (unitsIndex as unknown as IndexUnit[]).find((u) => u.id === unitId)?.nVocab ?? 0;
/** Nombre d'etapes d'une quete (connu meme si l'unite n'est pas chargee). */
export const stepCount = (questId: string) => {
  for (const u of unitsIndex as unknown as IndexUnit[]) for (const q of u.quests) if (q.id === questId) return q.nSteps;
  return 0;
};

export const isLoaded = (unitId: string) => loaded.has(unitId);

export function loadUnit(unitId: string): Promise<Unit> {
  const have = loaded.get(unitId);
  if (have) return Promise.resolve(have);
  let p = pending.get(unitId);
  if (!p) {
    const fn = loaders.get(unitId);
    if (!fn) return Promise.reject(new Error(`unite inconnue : ${unitId}`));
    p = fn().then((u) => {
      loaded.set(unitId, u);
      pending.delete(unitId);
      rebuild();
      return u;
    });
    pending.set(unitId, p);
  }
  return p;
}

export async function loadUnits(ids: string[]): Promise<void> {
  await Promise.all(ids.map(loadUnit));
}

export const loadAllUnits = () => loadUnits(stubs.map((u) => u.id));
