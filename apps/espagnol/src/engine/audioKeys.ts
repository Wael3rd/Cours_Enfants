/** Toutes les cles audio (champs `audio`) referencees par un objet de contenu (etape, replique...). */
export function collectAudioKeysOf(x: unknown, out: Set<string> = new Set()): string[] {
  const walk = (v: unknown) => {
    if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') {
      for (const [k, val] of Object.entries(v)) {
        if (k === 'audio' && typeof val === 'string' && val) out.add(val);
        else walk(val);
      }
    }
  };
  walk(x);
  return [...out];
}
