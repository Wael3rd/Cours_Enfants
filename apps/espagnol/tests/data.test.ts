import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
// @ts-expect-error module .mjs sans types
import { buildIndex, indexPath } from '../../../tools/content/build-units-index.mjs';
import { content, isLoaded, loadUnit, stepCount, vocabCount } from '../src/engine/data';
import { eventWindow } from '../src/engine/calendar';
import type { Unit } from '../src/content/schema';

describe('contenu a la demande', () => {
  it('units-index.json est a jour (relancer node tools/content/build-units-index.mjs sinon)', () => {
    expect(readFileSync(indexPath, 'utf8')).toBe(buildIndex());
  });

  it('au depart : squelettes sans vocabulaire ; loadUnit charge le contenu complet en place', async () => {
    const stub = content.unitById.get('u01')!;
    expect(stub.quests.length).toBeGreaterThan(0);
    expect(isLoaded('u01')).toBe(false);
    expect(content.vocab.size).toBe(0);
    const u = await loadUnit('u01');
    expect(isLoaded('u01')).toBe(true);
    expect(u.vocab.length).toBe(vocabCount('u01'));
    expect(content.vocab.size).toBeGreaterThan(0);
    expect(content.unitById.get('u01')!.quests[0].steps.length).toBe(stepCount('u01-q01'));
    // les autres unites restent des squelettes
    expect(isLoaded('u02')).toBe(false);
  });

  it('aucune unite n est evenement sans champ explicite (u06 Navidad = unite normale)', () => {
    expect(content.events.length).toBe(0);
    const navidad = { id: 'u06', numero: 6, titulo: '¡Feliz Navidad!', lugar: 'Madrid de noche' } as Unit;
    expect(eventWindow(navidad)).toBeNull();
    expect(eventWindow({ ...navidad, evento: { desde: '12-01', hasta: '01-06' } })).toEqual({ from: '12-01', to: '01-06' });
  });
});
