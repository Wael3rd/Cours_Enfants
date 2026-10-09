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
});
