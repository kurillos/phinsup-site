import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // AJOUTE CETTE LIGNE JUSTE ICI :
  site: 'https://thefrenchfins.netlify.app',
  
  integrations: [sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },
});
