import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// Garde-fou : chaque composition HyperFrames doit rester autonome et hors-ligne.
const root = join(import.meta.dirname, '..', 'apps');
const comps: { app: string; id: string; html: string }[] = [];
for (const app of readdirSync(root)) {
  const dir = join(root, app, 'public', 'cinematics');
  if (!existsSync(dir)) continue;
  for (const id of readdirSync(dir)) {
    const f = join(dir, id, 'index.html');
    if (id !== '_shared' && existsSync(f)) comps.push({ app, id, html: readFileSync(f, 'utf8') });
  }
}

describe('compositions HyperFrames', () => {
  it('en trouve au moins une', () => expect(comps.length).toBeGreaterThan(0));
  for (const { app, id, html } of comps) {
    describe(`${app}/${id}`, () => {
      it('aucune ressource reseau', () => {
        expect(html).not.toMatch(/(?:src|href)=["']https?:/i);
        expect(html).not.toMatch(/url\(["']?https?:/i);
        expect(html).not.toMatch(/@import/);
      });
      it('racine + timeline enregistree sous le meme id', () => {
        expect(html).toContain(`data-composition-id="${id}"`);
        expect(html).toContain(`window.__timelines["${id}"]`);
        expect(html).toMatch(/data-duration="\d/);
      });
      it('runtime et gsap locaux (./_shared/)', () => {
        expect(html).toContain('./_shared/hyperframe.runtime.iife.js');
        expect(html).toContain('./_shared/gsap.min.js');
      });
    });
  }
});
