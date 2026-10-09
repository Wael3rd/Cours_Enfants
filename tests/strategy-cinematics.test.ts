import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { STRATEGY_CINEMATICS } from '../apps/maths/src/audio/voice-lines.ts';
import { ZONES } from '../apps/maths/src/engine/zones.ts';
import { defaultState, normalizeState } from '../apps/maths/src/state/model.ts';

const dir = join(import.meta.dirname, '..', 'apps', 'maths', 'public', 'cinematics');

describe('cinematiques de strategie', () => {
  it('une par zone (1 a 9)', () => {
    expect([...STRATEGY_CINEMATICS].sort()).toEqual(ZONES.map((z) => z.key).sort());
  });
  for (const key of STRATEGY_CINEMATICS) {
    describe(`strategy-${key}`, () => {
      const id = `strategy-${key}`;
      const html = existsSync(join(dir, id, 'index.html')) ? readFileSync(join(dir, id, 'index.html'), 'utf8') : '';
      it('composition presente, 1920x1200', () => {
        expect(html).toContain(`data-composition-id="${id}"`);
        expect(html).toContain('data-width="1920"');
        expect(html).toContain('data-height="1200"');
      });
      it('duree entre 8 et 12 s, calee sur les mp3 (PLAN)', () => {
        const plan = JSON.parse(html.match(/window\.PLAN = (\{.*?\});/)![1]);
        expect(plan.total).toBeGreaterThanOrEqual(8);
        expect(plan.total).toBeLessThanOrEqual(12);
        expect(html).toContain(`data-duration="${plan.total}"`);
        plan.t.forEach((_: number, i: number) => {
          expect(existsSync(join(dir, id, 'assets', `vo-${i}.mp3`))).toBe(true);
          expect(html).toContain(`./assets/vo-${i}.mp3`);
        });
      });
      it('storyboard present', () => expect(existsSync(join(dir, id, 'STORYBOARD.md'))).toBe(true));
    });
  }
  it('strategySeen : defaut vide, valeurs invalides ecartees', () => {
    expect(defaultState().strategySeen).toEqual([]);
    expect(normalizeState({ strategySeen: [1, 3, 3, 12, 'x', 0] }).strategySeen).toEqual([1, 3]);
  });
});
