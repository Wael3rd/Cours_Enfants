import { appConfig } from '../../packages/core/vite.ts';

export default appConfig({
  dir: import.meta.dirname,
  base: '/espagnol/',
  name: 'La Leyenda del Quetzal',
  shortName: 'Quetzal',
  description: "Espagnol 5e - aventure RPG",
  themeColor: '#7a1f2b',
  backgroundColor: '#2a0b10',
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
