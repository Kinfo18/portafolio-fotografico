// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://valentinariosfotografia.com',
  compressHTML: true,

  build: {
    assets: '_assets',
  },

  integrations: [preact()],
  adapter: cloudflare(),
});