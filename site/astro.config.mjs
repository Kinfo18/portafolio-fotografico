// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://valentinariosfotografia.com',
  compressHTML: true,
  build: {
    assets: '_assets',
  },
});
