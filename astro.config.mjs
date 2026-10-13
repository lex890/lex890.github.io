// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // Production URL: used for canonical links, Open Graph image URLs, the sitemap and robots.txt.
  site: 'https://lex890.github.io',
  output: 'static',
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    css: {
      preprocessorOptions: {
        scss: {
          // Lets any *.module.scss write `@use 'mixins' as *;` without relative paths
          // (resolved from the project root, where npm scripts run).
          loadPaths: ['src/styles'],
        },
      },
    },
  },
});