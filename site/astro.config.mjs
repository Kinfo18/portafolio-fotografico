// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

export default defineConfig({
  site: 'https://valentinariosfotografia.com',
  compressHTML: true,
  build: {
    assets: '_assets',
  },
  integrations: [preact()],
});
