// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://mudanzasandy.es",
  integrations: [
    // Sitemap manual en public/sitemap.xml para mejor compatibilidad con Google
    // sitemap({
    //   changefreq: "weekly",
    //   priority: 0.7,
    //   lastmod: new Date(),
    //   serialize: (item) => {
    //     // Configurar prioridades específicas por página
    //     if (item.url === "https://mudanzasandy.es/") {
    //       item.priority = 1.0;
    //     }
    //     if (item.url.includes("/politica")) {
    //       item.priority = 0.3;
    //     }
    //     return item;
    //   },
    // }),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": new URL("./src", import.meta.url).pathname,
      },
    },
  },
});
