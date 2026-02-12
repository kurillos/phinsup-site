import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
// import tailwind from '@astrojs/tailwind'; // COMMENTE CETTE LIGNE

export default defineConfig({
  integrations: [
    // tailwind(), // COMMENTE CETTE LIGNE AUSSI
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});