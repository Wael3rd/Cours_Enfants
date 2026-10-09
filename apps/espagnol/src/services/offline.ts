import type { Unit } from '../content/schema';
import { collectAudioKeys } from '../engine/content';
import type { Content, GameState, OfflineStatus } from '../engine/types';
import { currentUnit } from '../engine/progress';
import { AUDIO_BASE } from './paths';

/**
 * Audio hors-ligne PAR UNITE.
 * - `audio/**` est exclu du precache Workbox (trop lourd) ; un cache runtime CacheFirst dedie (meme nom que
 *   ci-dessous, voir packages/core/vite.ts -> runtimeCaching) sert les mp3 deja telecharges.
 * - Telecharger une unite = mettre tous ses mp3 (+ variantes lentes) dans ce cache via la Cache API.
 */
export const AUDIO_CACHE = 'espagnol-audio-v1';

/** Poids moyen d'une voix (octets), mesure sur les mp3 generes (edge-tts, 24 kHz mono) : sert aux estimations. */
export const AVG_AUDIO_BYTES = 22_000;

const withBase = (key: string) => `${AUDIO_BASE}${key}.mp3`;

/** URLs d'une unite : chaque cle `audio` + sa variante `.lento` quand elle existe (`lentoSet` = cles du manifeste). */
export function unitAudioUrls(unit: Unit, lentoSet: ReadonlySet<string>): string[] {
  const out: string[] = [];
  for (const k of collectAudioKeys(unit)) {
    out.push(withBase(k));
    if (lentoSet.has(`${k}.lento`)) out.push(withBase(`${k}.lento`));
  }
  return out;
}

export const estimateBytes = (count: number) => count * AVG_AUDIO_BYTES;

export interface DownloadProgress {
  done: number;
  total: number;
  bytes: number;
  failed: number;
}

export interface OfflineEnv {
  caches?: CacheStorage;
  fetchFn?: typeof fetch;
}

export interface UnitOffline {
  status: OfflineStatus;
  cached: number;
  total: number;
}

/** Etat reel du cache pour une unite. */
export async function unitOfflineStatus(unit: Unit, lentoSet: ReadonlySet<string>, env: OfflineEnv = {}): Promise<UnitOffline> {
  const store = env.caches ?? globalThis.caches;
  const urls = unitAudioUrls(unit, lentoSet);
  if (!store) return { status: 'none', cached: 0, total: urls.length };
  const cache = await store.open(AUDIO_CACHE);
  const have = new Set((await cache.keys()).map((r) => new URL(r.url).pathname));
  const cached = urls.filter((u) => have.has(new URL(u, 'http://x').pathname)).length;
  return { status: cached === 0 ? 'none' : cached >= urls.length ? 'ready' : 'partial', cached, total: urls.length };
}

export interface DownloadResult {
  ok: boolean;
  downloaded: number;
  skipped: number;
  /** fichiers absents du serveur (404) ou en erreur */
  failed: string[];
  bytes: number;
  aborted: boolean;
}

/** Telecharge toute l'audio d'une unite dans le cache (reprise possible : les fichiers deja presents sont ignores). */
export async function downloadUnit(
  unit: Unit,
  lentoSet: ReadonlySet<string>,
  o: { onProgress?: (p: DownloadProgress) => void; signal?: AbortSignal; concurrency?: number; env?: OfflineEnv } = {},
): Promise<DownloadResult> {
  const store = o.env?.caches ?? globalThis.caches;
  const doFetch = o.env?.fetchFn ?? globalThis.fetch.bind(globalThis);
  const urls = unitAudioUrls(unit, lentoSet);
  const res: DownloadResult = { ok: false, downloaded: 0, skipped: 0, failed: [], bytes: 0, aborted: false };
  if (!store) {
    res.failed = urls;
    return res;
  }
  const cache = await store.open(AUDIO_CACHE);
  const have = new Set((await cache.keys()).map((r) => new URL(r.url).pathname));
  const todo = urls.filter((u) => !have.has(new URL(u, 'http://x').pathname));
  res.skipped = urls.length - todo.length;
  let done = res.skipped;
  const report = () => o.onProgress?.({ done, total: urls.length, bytes: res.bytes, failed: res.failed.length });
  report();
  let i = 0;
  const worker = async () => {
    while (i < todo.length && !o.signal?.aborted) {
      const url = todo[i++];
      try {
        const r = await doFetch(url, { signal: o.signal });
        if (!r.ok) throw new Error(String(r.status));
        const buf = await r.arrayBuffer();
        await cache.put(url, new Response(buf, { status: 200, headers: { 'content-type': r.headers.get('content-type') ?? 'audio/mpeg' } }));
        res.bytes += buf.byteLength;
        res.downloaded++;
      } catch (e) {
        if (o.signal?.aborted) return;
        res.failed.push(url);
      }
      done++;
      report();
    }
  };
  await Promise.all(Array.from({ length: Math.max(1, o.concurrency ?? 4) }, worker));
  res.aborted = !!o.signal?.aborted;
  res.ok = !res.aborted && res.failed.length === 0;
  return res;
}

/** Supprime l'audio d'une unite du cache. */
export async function removeUnit(unit: Unit, lentoSet: ReadonlySet<string>, env: OfflineEnv = {}): Promise<number> {
  const store = env.caches ?? globalThis.caches;
  if (!store) return 0;
  const cache = await store.open(AUDIO_CACHE);
  let n = 0;
  for (const u of unitAudioUrls(unit, lentoSet)) if (await cache.delete(u)) n++;
  return n;
}

/** Unites a avoir hors-ligne : l'unite en cours + la suivante (ordre des unites ordinaires, plumes non requises pour la suivante). */
export function autoDownloadPlan(c: Content, s: GameState): Unit[] {
  const cur = currentUnit(c, s);
  if (!cur) return [];
  const i = c.main.findIndex((u) => u.id === cur.id);
  return [cur, c.main[i + 1]].filter((u): u is Unit => !!u);
}

/** Connexion adaptee au telechargement automatique (en ligne, pas d'economiseur de donnees). */
export function canAutoDownload(): boolean {
  const nav = globalThis.navigator as (Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }) | undefined;
  if (!nav || nav.onLine === false) return false;
  if (nav.connection?.saveData) return false;
  return true;
}

/** Telecharge (sequentiellement) les unites du plan qui ne sont pas deja pretes. */
export async function runAutoDownload(
  c: Content,
  s: GameState,
  lentoSet: ReadonlySet<string>,
  o: { onUnit?: (unit: Unit, p: DownloadProgress) => void; onDone?: (unit: Unit, r: DownloadResult) => void; env?: OfflineEnv; force?: boolean } = {},
): Promise<void> {
  if (!o.force && (!s.settings.autoDownload || !canAutoDownload())) return;
  for (const u of autoDownloadPlan(c, s)) {
    const st = await unitOfflineStatus(u, lentoSet, o.env);
    if (st.status === 'ready') continue;
    const r = await downloadUnit(u, lentoSet, { onProgress: (p) => o.onUnit?.(u, p), env: o.env });
    o.onDone?.(u, r);
    if (r.aborted) return;
  }
}
