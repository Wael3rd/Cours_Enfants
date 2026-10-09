// Genere apps/espagnol/src/content/units-index.json : version LEGERE de chaque unite (sans vocab, grammaire ni etapes).
// Le jeu l'embarque dans le JS initial (cartes, progression, statuts) ; le contenu complet d'une unite est charge
// a la demande (import dynamique). Appele par le plugin Vite de apps/espagnol (buildStart) et en CLI.
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..', '..');
export const unitsDir = join(root, 'apps/espagnol/src/content/units');
export const indexPath = join(root, 'apps/espagnol/src/content/units-index.json');

export function buildIndex() {
  const files = readdirSync(unitsDir).filter((f) => f.endsWith('.json')).sort();
  const out = [];
  for (const f of files) {
    const u = JSON.parse(readFileSync(join(unitsDir, f), 'utf8'));
    out.push({
      id: u.id, numero: u.numero, titulo: u.titulo, lugar: u.lugar, emoji: u.emoji, ejes: u.ejes, periodo: u.periodo,
      ...(u.evento ? { evento: u.evento } : {}),
      pluma: u.pluma,
      nVocab: u.vocab.length,
      quests: u.quests.map((q) => ({
        id: q.id, tipo: q.tipo, titulo: q.titulo, emoji: q.emoji, intro: q.intro, pista: q.pista, stats: q.stats, minutos: q.minutos,
        ...(q.jefe ? { jefe: q.jefe } : {}), nSteps: q.steps.length,
      })),
    });
  }
  return JSON.stringify(out, null, 1) + '\n';
}

export function writeIndex() {
  const next = buildIndex();
  const prev = existsSync(indexPath) ? readFileSync(indexPath, 'utf8') : '';
  if (next !== prev) writeFileSync(indexPath, next);
  return next !== prev;
}

if (process.argv[1]?.endsWith('build-units-index.mjs')) {
  console.log(writeIndex() ? 'units-index.json mis a jour' : 'units-index.json a jour');
}
