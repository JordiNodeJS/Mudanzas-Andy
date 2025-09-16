import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Definir la colección del blog usando Content Layer API de Astro 5
const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    // Metadatos básicos del post
    title: z.string(),
    description: z.string(),

    // Fechas
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),

    // SEO y organización
    tags: z.array(z.string()).default([]),
    category: z.string().default("general"),

    // Estado del post
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),

    // Imagen del post
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),

    // SEO específico
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),

    // Autor
    author: z.string().default("Equipo Mudanzas ANDY"),
    authorImage: z.string().optional(),

    // Tiempo de lectura estimado (en minutos)
    readingTime: z.number().optional(),

    // Palabras clave específicas para SEO
    keywords: z.array(z.string()).default([]),

    // URL canonical personalizada si es necesario
    canonical: z.string().optional(),
  }),
});

export const collections = {
  blog,
};
