import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { Unit } from '../src/content/schema';
import { applyKey, initialState, layout, neededKeys } from '../src/services/accents';
import { listen, speechSupport, type SpeechRecognitionLike } from '../src/services/speech';
import { autoDownloadPlan, downloadUnit, unitAudioUrls, unitOfflineStatus, AUDIO_CACHE } from '../src/services/offline';
import { buildContent, defaultState, completeQuest } from '../src/engine';
import { hardItems, objectiveCoverage, overview, unitRows } from '../src/parent/stats';
import { normalizeState } from '../src/state/normalize';

const dir = join(import.meta.dirname, '../src/content');
const units: Unit[] = readdirSync(join(dir, 'units')).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(readFileSync(join(dir, 'units', f), 'utf8')));
const chars = JSON.parse(readFileSync(join(dir, 'characters.json'), 'utf8'));
const manifest: { key: string }[] = JSON.parse(readFileSync(join(dir, 'audio-manifest.json'), 'utf8'));
const lento = new Set(manifest.map((m) => m.key).filter((k) => k.endsWith('.lento')));
const c = buildContent(units, chars);

describe('clavier d accents', () => {
  it('insere au curseur, majuscule, retour arriere', () => {
    let st = initialState('mañna');
    st = { ...st, start: 3, end: 3 };
    st = applyKey(st, { kind: 'char', ch: 'a' });
    expect(st.value).toBe('mañana');
    st = applyKey(initialState('', true), { kind: 'char', ch: 'ñ' });
    expect(st.value).toBe('Ñ');
    st = applyKey(st, { kind: 'backspace' });
    expect(st.value).toBe('');
    expect(layout(true)[0]).toBe('Á');
    expect(neededKeys('¿Qué tal?')).toEqual(['¿', 'é']);
    expect(applyKey({ value: 'abc', start: 1, end: 3, shift: false }, { kind: 'char', ch: 'á' }).value).toBe('aá');
  });
});

describe('reconnaissance vocale', () => {
  class Fake implements SpeechRecognitionLike {
    lang = '';
    interimResults = false;
    maxAlternatives = 1;
    continuous = false;
    onresult: any = null;
    onerror: any = null;
    onend: any = null;
    start() {
      setTimeout(() => {
        const interim = Object.assign([{ transcript: 'hola', confidence: 0 }], { isFinal: false });
        this.onresult?.({ results: [interim] });
        const fin = Object.assign([{ transcript: 'hola', confidence: 0.4 }, { transcript: 'hola me llamo', confidence: 0.9 }], { isFinal: true });
        this.onresult?.({ results: [fin] });
        this.onend?.();
      }, 5);
    }
    stop() {}
    abort() {}
  }
  it('support', () => {
    expect(speechSupport({ ctor: Fake, online: true })).toBe('ok');
    expect(speechSupport({ ctor: Fake, online: false })).toBe('offline');
    expect(speechSupport({})).toBe('unsupported');
  });
  it('alternatives triees + interim', async () => {
    const interim: string[] = [];
    const r = await listen({ env: { ctor: Fake, online: true }, onInterim: (t) => interim.push(t) }).result;
    expect(r.ok).toBe(true);
    expect(r.alts[0].transcript).toBe('hola me llamo');
    expect(interim.length).toBeGreaterThan(0);
  });
  it('repli auto-evaluation hors-ligne', async () => {
    const r = await listen({ env: { ctor: Fake, online: false } }).result;
    expect(r).toMatchObject({ ok: false, failure: 'offline', fallback: true });
  });
});

describe('audio hors-ligne', () => {
  function fakeCaches() {
    const store = new Map<string, Response>();
    const cache = {
      keys: async () => [...store.keys()].map((u) => ({ url: 'http://x' + u }) as Request),
      put: async (u: string, r: Response) => void store.set(u, r),
      delete: async (u: string) => store.delete(u),
    };
    return { caches: { open: async () => cache } as unknown as CacheStorage, store };
  }
  it('urls = cles + variantes lentes', () => {
    const urls = unitAudioUrls(units[0], lento);
    expect(urls.length).toBeGreaterThan(200);
    expect(urls.every((u) => u.endsWith('.mp3'))).toBe(true);
    expect(urls.some((u) => u.endsWith('.lento.mp3'))).toBe(true);
  });
  it('telechargement avec progression, reprise et statut', async () => {
    const { caches, store } = fakeCaches();
    const small = { ...units[0], vocab: units[0].vocab.slice(0, 3), quests: [], gramatica: [], pluma: undefined as never } as Unit;
    const urls = unitAudioUrls(small, lento);
    const seen: number[] = [];
    const fetchFn = (async (u: string) => (u.includes('.lento') ? new Response('', { status: 404 }) : new Response(new Uint8Array(100), { headers: { 'content-type': 'audio/mpeg' } }))) as unknown as typeof fetch;
    const r = await downloadUnit(small, lento, { env: { caches, fetchFn }, onProgress: (p) => seen.push(p.done) });
    expect(r.downloaded + r.failed.length).toBe(urls.length);
    expect(seen.at(-1)).toBe(urls.length);
    expect(r.failed.every((u) => u.includes('.lento'))).toBe(true);
    expect((await unitOfflineStatus(small, lento, { caches })).status).toBe('partial');
    const ok = (async () => new Response(new Uint8Array(10))) as unknown as typeof fetch;
    const r2 = await downloadUnit(small, lento, { env: { caches, fetchFn: ok } });
    expect(r2.skipped).toBe(r.downloaded);
    expect((await unitOfflineStatus(small, lento, { caches })).status).toBe('ready');
    expect(store.size).toBe(urls.length);
    expect(AUDIO_CACHE).toBe('espagnol-audio-v1');
  });
  it('plan : unite en cours + suivante', () => {
    const s = defaultState();
    expect(autoDownloadPlan(c, s).map((u) => u.id)).toEqual([c.main[0].id, c.main[1].id]);
    for (const q of c.main[0].quests) completeQuest(c, s, q.id, [{ stepId: 'x', tipo: 'true_false', score: 1, hints: 0 }]);
    expect(autoDownloadPlan(c, s).map((u) => u.id)).toEqual([c.main[1].id, c.main[2].id]);
  });
});

describe('espace parent : agregats', () => {
  it('etat vide et etat simule', () => {
    const now = new Date(2026, 9, 9);
    const s = normalizeState(undefined);
    expect(overview(c, s, now).totalMin).toBe(0);
    expect(hardItems(c, s)).toEqual([]);
    expect(objectiveCoverage(c, s).every((o) => o.status === 'pendiente')).toBe(true);
    s.days['2026-10-08'] = { ms: 600000, steps: 12, correct: 9, xp: 50 };
    s.days['2026-10-09'] = { ms: 300000, steps: 5, correct: 5, xp: 20 };
    const vid = units[0].vocab[0].id;
    s.srs[`v:${vid}`] = { ef: 2, reps: 0, interval: 0, due: '2026-10-09', lapses: 1, seen: 4, wrong: 3, last: '2026-10-09' };
    s.discovered[vid] = '2026-10-08';
    const ov = overview(c, s, now);
    expect(ov).toMatchObject({ totalMin: 15, weekMin: 15, streak: 2, steps: 17, wordsSeen: 1 });
    expect(hardItems(c, s)[0]).toMatchObject({ kind: 'mot', wrong: 4 });
    expect(unitRows(c, s, now)[0].quests.length).toBe(units[0].quests.length);
  });
});
