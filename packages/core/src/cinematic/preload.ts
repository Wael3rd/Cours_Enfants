const cache = new Map<string, Promise<void>>();

/**
 * Prechauffe une cinematique : telecharge l'index.html puis ses dependances (scripts, polices, images)
 * pour que la lecture soit instantanee. Hors-ligne, le service worker repond depuis le precache.
 * Ne leve jamais d'erreur.
 */
export function preloadCinematic(src: string): Promise<void> {
  const url = new URL(src, location.href);
  let p = cache.get(url.href);
  if (!p) {
    p = (async () => {
      try {
        const html = await (await fetch(url)).text();
        const refs = new Set<string>();
        for (const m of html.matchAll(/(?:src|href)=["']([^"'#]+)["']|url\(["']?([^"')]+)["']?\)/g)) {
          const r = m[1] ?? m[2];
          if (r && !/^(data:|https?:|\/\/)/.test(r)) refs.add(new URL(r, url).href);
        }
        await Promise.all([...refs].map((r) => fetch(r).catch(() => undefined)));
      } catch {
        /* ignore : le lancement reessaiera */
      }
    })();
    cache.set(url.href, p);
  }
  return p;
}
