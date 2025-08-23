// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  // Recomendación: Astro 5.13.3+ con View Transitions estables
  // ViewTransitions ya no necesita flag experimental en 5.13.3+
  prefetch: {
    // Compatibilidad: Astro 5.13.3+
    // Implementación: Prefetch automático con View Transitions
    // Fuente: https://docs.astro.build/en/guides/view-transitions/ | Recuperado: 2025-08-23
    // Prioridad: Recomendado
    prefetchAll: true,
    defaultStrategy: "hover",
  },
  vite: {
    plugins: [tailwindcss()],
    css: {
      // Implementación: Optimización CSS para View Transitions
      // Fuente: https://docs.astro.build/en/guides/view-transitions/ | Recuperado: 2025-08-23
      // Prioridad: Recomendado
      devSourcemap: true,
    },
  },
  build: {
    // Compatibilidad: Astro 5.13.3+
    // Implementación: Inline small stylesheets para mejor performance
    // Fuente: https://docs.astro.build/en/reference/configuration-reference/#buildinlinestylesheets | Recuperado: 2025-08-23
    // Prioridad: Recomendado
    inlineStylesheets: "auto",
  },
  // Implementación: Compresión HTML habilitada por defecto en 5.13.3+
  // Fuente: Astro 5.x Changelog | Recuperado: 2025-08-23
  // Prioridad: Crítico para performance
  compressHTML: true,
});
