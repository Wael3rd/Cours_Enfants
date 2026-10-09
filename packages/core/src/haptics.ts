/** Motifs de vibration nommes (ms). No-op si non supporte. */
export const patterns = {
  tap: 8,
  good: [12, 40, 18],
  bad: [40, 30, 40],
  win: [20, 40, 20, 40, 60],
  press: 12,
} as const;

export type HapticName = keyof typeof patterns;

let enabled = true;
export const setHaptics = (on: boolean) => {
  enabled = on;
};

export function haptic(name: HapticName = 'tap'): void {
  if (!enabled || typeof navigator === 'undefined' || !('vibrate' in navigator)) return;
  try {
    navigator.vibrate(patterns[name] as number | number[]);
  } catch {
    /* ignore */
  }
}
