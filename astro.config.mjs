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
      filter: (page) => !page.includes("/admin") && !page.includes("/test"),
      customPages: [
        "https://mudanzasandy.es/servicios/mudanzas-particulares",
        "https://mudanzasandy.es/servicios/mudanzas-oficinas",
        "https://mudanzasandy.es/servicios/embalaje-profesional",
        "https://mudanzasandy.es/servicios/guardamuebles",
        "https://mudanzasandy.es/servicios/mudanzas-express",
        "https://mudanzasandy.es/servicios/mudanzas-nacionales",
        "https://mudanzasandy.es/presupuesto",
        "https://mudanzasandy.es/contacto",
        "https://mudanzasandy.es/sobre-nosotros",
      ],
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
