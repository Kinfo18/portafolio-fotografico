// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://valentinariosfotografia.com',
  compressHTML: true,

  build: {
    assets: '_assets',
  },

  integrations: [preact()],
  adapter: vercel(),
});