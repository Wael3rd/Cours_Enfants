/** Signature de `registerSW` de `virtual:pwa-register` (injectee par l'app : core reste independant du plugin). */
export type RegisterSW = (opts: {
  immediate?: boolean;
  onNeedRefresh?: () => void;
  onOfflineReady?: () => void;
}) => (reload?: boolean) => Promise<void>;

export interface Updater {
  /** Notifie quand une nouvelle version est prete / quand le hors-ligne est pret. */
  subscribe(cb: (needRefresh: boolean, offlineReady: boolean) => void): () => void;
  /** Applique la mise a jour (recharge la page). */
  apply(): Promise<void>;
}

export function setupUpdater(registerSW: RegisterSW): Updater {
  let needRefresh = false;
  let offlineReady = false;
  const subs = new Set<(n: boolean, o: boolean) => void>();
  const emit = () => subs.forEach((cb) => cb(needRefresh, offlineReady));
  const update = registerSW({
    immediate: true,
    onNeedRefresh() {
      needRefresh = true;
      emit();
    },
    onOfflineReady() {
      offlineReady = true;
      emit();
    },
  });
  return {
    subscribe(cb) {
      subs.add(cb);
      cb(needRefresh, offlineReady);
      return () => subs.delete(cb);
    },
    apply: () => update(true),
  };
}

let lock: WakeLockSentinel | null = null;
let wanted = false;

async function acquire() {
  if (!wanted || !('wakeLock' in navigator) || document.visibilityState !== 'visible') return;
  try {
    lock = await navigator.wakeLock.request('screen');
    lock.addEventListener('release', () => {
      lock = null;
    });
  } catch {
    /* refuse (economie d'energie) */
  }
}
if (typeof document !== 'undefined') document.addEventListener('visibilitychange', () => void acquire());

/** Garde l'ecran allume pendant une session d'exercice. */
export function keepAwake(on: boolean): void {
  wanted = on;
  if (on) void acquire();
  else void lock?.release().catch(() => {});
}

export async function enterFullscreen(): Promise<void> {
  const el = document.documentElement;
  if (document.fullscreenElement || !el.requestFullscreen) return;
  try {
    await el.requestFullscreen({ navigationUI: 'hide' });
  } catch {
    /* geste utilisateur requis */
  }
}

export async function exitFullscreen(): Promise<void> {
  if (document.fullscreenElement) await document.exitFullscreen();
}
