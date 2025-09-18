import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://mudanzasandy.com",

  // Optimizaciones de build
  build: {
    format: "file", // URLs limpias sin .html
    inlineStylesheets: "auto",
    assetsPrefix: "/",
  },

  // Optimizaciones de output
  output: "static",
  adapter: undefined,

  // Compresión y minificación avanzada
  vite: {
    build: {
      minify: "esbuild",
      target: "es2020",
      cssMinify: "esbuild",
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["astro"],
            utils: ["./src/lib/utils/emailService.js"],
          },
        },
      },
    },
    optimizeDeps: {
      include: ["astro/client"],
    },
    ssr: {
      noExternal: [],
    },
  },

  // Integraciones optimizadas para Tailwind 4
  integrations: [
    sitemap({
      changefreq: "weekly",
      priority: 0.8,
      lastmod: new Date(),
    }),
    mdx(),
  ],

  // Configuraciones experimentales removidas para Astro 5
  // experimental: {
  //   optimizeHoistedScript: true,
  //   contentCollectionCache: true
  // },

  // Configuración de servidor para desarrollo
  server: {
    port: 4321,
    host: true,
  },
});
