import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
// import tailwind from '@astrojs/tailwind'; // COMMENTE CETTE LIGNE

export default defineConfig({
  integrations: [sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },
});