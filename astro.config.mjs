// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  output: 'static',
  integrations: [react()],
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
