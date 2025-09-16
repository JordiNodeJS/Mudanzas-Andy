// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://mudanzasandy.es",
  integrations: [
    sitemap({
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date(),
      filter: (page) => {
        // Excluir páginas de políticas del sitemap para evitar contenido duplicado en Google
        return (
          !page.includes("/politica-privacidad") &&
          !page.includes("/politica-cookies")
        );
      },
      serialize: (item) => {
        // Configurar prioridades específicas por página
        if (item.url === "https://mudanzasandy.es/") {
          item.priority = 1.0;
        }
        if (item.url.includes("/blog-astro")) {
          item.priority = 0.8;
        }
        if (item.url.includes("/blog/")) {
          item.priority = 0.7;
        }
        return item;
      },
    }),
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
