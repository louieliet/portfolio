import { defineConfig } from 'astro/config';

// Vanilla Astro: no React, no Tailwind. Styles live in src/styles/global.css and scoped <style> blocks.
export default defineConfig({
  site: "https://www.louieliet.dev",
  publicDir: 'public',
  vite: {
    server: {
      fs: {
        // Allow Vite dev server to serve files from the workspace root and public dir
        allow: ['.'],
      },
    },
  },
});
