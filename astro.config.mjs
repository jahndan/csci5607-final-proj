// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

import remarkMath from 'remark-math';
import rehypeMath from '@daiji256/rehype-mathml';

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare(),

  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeMath],
    shikiConfig: {
      themes: {
        light: 'vitesse-light',
        dark: 'vitesse-dark',
      },
    }
  },
});
