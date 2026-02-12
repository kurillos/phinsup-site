import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: false,
      // On injecte le plugin Typography ici
      configFile: './tailwind.config.mjs', 
    }),
  ],
});