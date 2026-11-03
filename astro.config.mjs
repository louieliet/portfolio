import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: "https://www.louieliet.dev",
  integrations: [react()],
  publicDir: 'public',
  vite: {
    plugins: [tailwindcss()],
    server: {
      fs: {
        // Allow Vite dev server to serve files from the workspace root and public dir
        allow: ['.'],
      },
    },
  },
});
