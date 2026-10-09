import 'fake-indexeddb/auto';
import { describe, expect, it } from 'vitest';
import { createStore, migrate } from '../src/storage';

describe('migrate', () => {
  it('applique les migrations dans l ordre', () => {
    const out = migrate({ a: 1 }, 1, 3, { 1: (d) => ({ ...d, b: 2 }), 2: (d) => ({ ...d, c: d.a + d.b }) });
    expect(out).toEqual({ a: 1, b: 2, c: 3 });
  });
  it('echoue si une migration manque', () => {
    expect(() => migrate({}, 1, 2, {})).toThrow(/Migration manquante/);
  });
});

describe('createStore', () => {
  const mk = (version: number, migrations = {}) =>
    createStore({ name: 't', version, defaults: () => ({ n: 0, tag: 'x' }), migrations });

  it('renvoie les valeurs par defaut puis persiste', async () => {
    const s = mk(1);
    await s.reset();
    expect(await s.load()).toEqual({ n: 0, tag: 'x' });
    await s.update((d) => {
      d.n = 5;
    });
    expect((await s.load()).n).toBe(5);
  });

  it('migre une ancienne sauvegarde', async () => {
    await mk(1).save({ n: 7, tag: 'x' });
    const s2 = mk(2, { 1: (d: any) => ({ ...d, n: d.n * 10 }) });
    expect((await s2.load()).n).toBe(70);
  });

  it('export / import JSON', async () => {
    const s = mk(1);
    await s.save({ n: 9, tag: 'y' });
    const json = await s.exportJSON();
    await s.reset();
    await s.importJSON(json);
    expect(await s.load()).toEqual({ n: 9, tag: 'y' });
  });

  it('refuse une sauvegarde d une autre app ou trop recente', async () => {
    const s = mk(1);
    await expect(s.importJSON(JSON.stringify({ app: 'autre', version: 1, data: {} }))).rejects.toThrow(/autre app/);
    await expect(s.importJSON(JSON.stringify({ app: 't', version: 9, data: {} }))).rejects.toThrow(/plus recente/);
  });
});
