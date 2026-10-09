import { appConfig } from '../../packages/core/vite.ts';
import { writeIndex } from '../../tools/content/build-units-index.mjs';

const cfg = appConfig({
  dir: import.meta.dirname,
  base: '/espagnol/',
  name: 'La Leyenda del Quetzal',
  shortName: 'Quetzal',
  description: "Espagnol 5e - aventure RPG",
  themeColor: '#14173f',
  backgroundColor: '#14173f',
  foreignScopes: [],
  // Les voix (centaines de mp3) ne sont PAS precachees : telechargees par unite (src/services/offline.ts)
  // dans le cache 'espagnol-audio-v1', servi en CacheFirst par le service worker.
  precacheIgnore: ['audio/**'],
  runtimeCaching: [
    {
      urlPattern: ({ url }: { url: URL }) => url.pathname.startsWith('/espagnol/audio/') && url.pathname.endsWith('.mp3'),
      handler: 'CacheFirst',
      options: {
        cacheName: 'espagnol-audio-v1',
        rangeRequests: true,
        cacheableResponse: { statuses: [200] },
      },
    },
  ],
});

// Regenere src/content/units-index.json (version legere des unites) a chaque build / demarrage du serveur de dev.
(cfg.plugins as unknown[]).push({ name: 'units-index', buildStart() { writeIndex(); } });

export default cfg;
