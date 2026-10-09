/**
 * Reconnaissance vocale (Web Speech API, Chrome Android : webkitSpeechRecognition, es-ES).
 * ATTENTION : sur Chrome la reconnaissance passe par les serveurs Google => PAS de reconnaissance hors-ligne.
 * Dans ce cas (ou micro refuse / navigateur non compatible) l'ecran bascule en AUTO-EVALUATION.
 */

export type SpeechSupport = 'ok' | 'offline' | 'unsupported' | 'insecure';

export interface RecognitionEnv {
  ctor?: new () => SpeechRecognitionLike;
  online?: boolean;
  secure?: boolean;
}

/** Sous-ensemble de l'API utilise (permet de simuler en test). */
export interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onresult: ((e: any) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  onspeechend?: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

function defaultEnv(): RecognitionEnv {
  const w = globalThis as any;
  return { ctor: w.SpeechRecognition ?? w.webkitSpeechRecognition, online: w.navigator?.onLine ?? true, secure: w.isSecureContext ?? true };
}

/** Disponibilite : 'ok' | 'offline' (reseau requis) | 'unsupported' | 'insecure' (HTTPS requis). */
export function speechSupport(env: RecognitionEnv = defaultEnv()): SpeechSupport {
  if (!env.ctor) return 'unsupported';
  if (env.secure === false) return 'insecure';
  if (env.online === false) return 'offline';
  return 'ok';
}

export type RecognitionFailure = 'unsupported' | 'offline' | 'insecure' | 'denied' | 'no-speech' | 'network' | 'no-mic' | 'timeout' | 'aborted' | 'error';

export interface RecognitionResult {
  ok: boolean;
  /** alternatives triees par confiance (la 1re = meilleure) */
  alts: { transcript: string; confidence: number }[];
  /** cause de l'echec si !ok : l'ecran propose alors l'auto-evaluation (fallback = true) */
  failure?: RecognitionFailure;
  /** true => proposer l'auto-evaluation plutot que "reessaie" */
  fallback: boolean;
  durationMs: number;
}

export interface ListenOptions {
  lang?: string;
  maxAlternatives?: number;
  /** delai maximum total (ms) */
  timeoutMs?: number;
  /** delai sans aucune parole detectee (ms) */
  noSpeechMs?: number;
  /** resultats intermediaires (affichage en direct) */
  onInterim?: (text: string) => void;
  env?: RecognitionEnv;
}

const HARD_FAILURES: RecognitionFailure[] = ['unsupported', 'offline', 'insecure', 'denied', 'network', 'no-mic'];

export interface Listening {
  /** Resout toujours (jamais d'exception) avec le resultat ou la cause d'echec. */
  result: Promise<RecognitionResult>;
  /** Arrete l'ecoute et utilise ce qui a ete entendu. */
  stop(): void;
  /** Annule sans resultat. */
  abort(): void;
}

/** Ecoute une phrase. Utiliser `.result` ; `stop()` pour couper (bouton). */
export function listen(o: ListenOptions = {}): Listening {
  const env = o.env ?? defaultEnv();
  const t0 = Date.now();
  const support = speechSupport(env);
  const fail = (failure: RecognitionFailure): RecognitionResult => ({ ok: false, alts: [], failure, fallback: HARD_FAILURES.includes(failure), durationMs: Date.now() - t0 });
  if (support !== 'ok' || !env.ctor) {
    const f = fail(support === 'ok' ? 'unsupported' : support);
    return { result: Promise.resolve(f), stop() {}, abort() {} };
  }
  const rec = new env.ctor();
  rec.lang = o.lang ?? 'es-ES';
  rec.interimResults = true;
  rec.continuous = false;
  rec.maxAlternatives = o.maxAlternatives ?? 5;

  let alts: { transcript: string; confidence: number }[] = [];
  let failure: RecognitionFailure | undefined;
  let heard = false;
  let finished = false;
  let resolveFn!: (r: RecognitionResult) => void;
  const result = new Promise<RecognitionResult>((r) => (resolveFn = r));
  const timers: ReturnType<typeof setTimeout>[] = [];

  const done = () => {
    if (finished) return;
    finished = true;
    timers.forEach(clearTimeout);
    alts.sort((a, b) => b.confidence - a.confidence);
    if (alts.length) return resolveFn({ ok: true, alts, fallback: false, durationMs: Date.now() - t0 });
    const f = failure ?? 'no-speech';
    resolveFn(fail(f));
  };

  rec.onresult = (e) => {
    heard = true;
    const last = e.results[e.results.length - 1];
    const text = last?.[0]?.transcript ?? '';
    if (!last?.isFinal) return void o.onInterim?.(text);
    alts = [];
    for (let i = 0; i < last.length; i++) alts.push({ transcript: String(last[i].transcript), confidence: Number(last[i].confidence) || 0 });
    o.onInterim?.(text);
  };
  rec.onerror = (e) => {
    const map: Record<string, RecognitionFailure> = {
      'not-allowed': 'denied',
      'service-not-allowed': 'denied',
      'no-speech': 'no-speech',
      network: 'network',
      'audio-capture': 'no-mic',
      aborted: 'aborted',
    };
    failure = map[e.error] ?? 'error';
  };
  rec.onend = done;
  timers.push(
    setTimeout(() => {
      if (!heard) failure = failure ?? 'timeout';
      try {
        rec.stop();
      } catch {
        /* deja arrete */
      }
      setTimeout(done, 400); // securite si onend ne vient pas
    }, o.timeoutMs ?? 8000),
    setTimeout(() => {
      if (!heard) {
        failure = failure ?? 'no-speech';
        try {
          rec.abort();
        } catch {
          /* ignore */
        }
        setTimeout(done, 400);
      }
    }, o.noSpeechMs ?? 5000),
  );
  try {
    rec.start();
  } catch {
    finished = false;
    failure = 'error';
    done();
  }
  return {
    result,
    stop() {
      try {
        rec.stop();
      } catch {
        /* ignore */
      }
    },
    abort() {
      failure = 'aborted';
      try {
        rec.abort();
      } catch {
        /* ignore */
      }
    },
  };
}
