# Guía de Implementación del Sistema de Blog - Mudanzas ANDY

## Resumen Ejecutivo

Esta guía documenta la implementación completa del sistema de blog nativo desarrollado para **Mudanzas ANDY** usando Astro 5 con Content Layer API. El sistema reemplaza completamente el iframe externo anterior y proporciona un blog completamente integrado, optimizado para SEO y performance.

## Índice

1. [Arquitectura del Sistema](#arquitectura-del-sistema)
2. [Estructura de Archivos](#estructura-de-archivos)
3. [Configuración de Content Collections](#configuración-de-content-collections)
4. [Componentes del Blog](#componentes-del-blog)
5. [Páginas y Rutas](#páginas-y-rutas)
6. [Contenido y Posts](#contenido-y-posts)
7. [Optimización de Imágenes](#optimización-de-imágenes)
8. [SEO y Metadatos](#seo-y-metadatos)
9. [Renderizado de Markdown](#renderizado-de-markdown)
10. [Comandos y Scripts](#comandos-y-scripts)
11. [Troubleshooting](#troubleshooting)

---

## Arquitectura del Sistema

### Stack Tecnológico

- **Framework**: Astro 5.13.3 con Content Layer API
- **Renderizado**: Generación Estática (SSG) - 100% estático
- **Markdown**: Librería `marked` para renderizado HTML
- **Estilos**: Tailwind CSS 4 + Sistema de colores centralizado
- **Imágenes**: Astro Assets + URLs externas optimizadas
- **TypeScript**: Tipado estricto con interfaces

### Principios de Diseño

1. **Content-First**: El contenido es la prioridad, estructura simple y accesible
2. **Performance**: Generación estática, imágenes optimizadas, carga rápida
3. **SEO-Optimized**: Metadatos completos, structured data, sitemap automático
4. **Mobile-First**: Diseño responsive desde el primer momento
5. **Maintainability**: Código modular, componentes reutilizables, tipado estricto

---

## Estructura de Archivos

```
src/
├── content/
│   ├── config.ts                    # Configuración Content Collections
│   └── blog/                        # Posts del blog
│       ├── mudanzas-economicas-barcelona-2025.md
│       ├── guia-embalaje-profesional-mudanzas.md
│       ├── mudanza-con-ninos-guia-familias.md
│       └── mudanzas-internacionales-barcelona-guia-completa.md
│
├── layouts/
│   └── components/
│       └── blog/                    # Componentes específicos del blog
│           ├── BlogPostCard.astro   # Tarjeta individual de post
│           ├── BlogPostList.astro   # Lista/grid de posts
│           └── LatestPost.astro     # Hero del último post
│
├── pages/
│   ├── blog-astro.astro            # Página principal del blog
│   └── blog/
│       └── [slug].astro            # Páginas dinámicas individuales
│
└── assets/
    └── images/
        └── blog/
            └── blog-hero-optimized.webp  # Imagen hero local optimizada
```

---

## Configuración de Content Collections

### Archivo: `src/content/config.ts`

```typescript
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Esquema del blog con validación completa
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    // Metadatos básicos
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),

    // Taxonomía y organización
    tags: z.array(z.string()),
    category: z.string(),

    // Estados y características
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),

    // Información del autor
    author: z.string(),
    readingTime: z.number().optional(),

    // SEO y metadatos avanzados
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.array(z.string()).optional(),

    // Imágenes
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),

    // URLs y referencias
    canonical: z.string().optional(),
  }),
});

export const collections = { blog };
```

### Características del Schema

- **Validación Zod**: Garantiza consistencia de datos
- **Coerción de fechas**: `z.coerce.date()` para flexibilidad de formato
- **Campos opcionales**: Balance entre requisitos y flexibilidad
- **SEO completo**: Metadatos específicos para optimización
- **Tipado automático**: TypeScript genera tipos desde el schema

---

## Componentes del Blog

### 1. LatestPost.astro - Hero del Último Post

**Ubicación**: `src/layouts/components/blog/LatestPost.astro`

**Propósito**: Mostrar el último post publicado como hero section

**Características**:

- Imagen hero grande y prominente
- Título destacado con jerarquía visual
- Meta información (autor, fecha, tiempo de lectura)
- CTA call-to-action para leer más
- Diseño responsive optimizado

**Props**:

```typescript
interface Props {
  post: CollectionEntry<"blog">;
}
```

### 2. BlogPostList.astro - Grid de Posts

**Ubicación**: `src/layouts/components/blog/BlogPostList.astro`

**Propósito**: Listar múltiples posts en formato grid

**Características**:

- Grid responsive (1-3 columnas según viewport)
- Paginación opcional (configurable)
- Título personalizable de la sección
- Integra BlogPostCard para cada item

**Props**:

```typescript
interface Props {
  posts: CollectionEntry<"blog">[];
  title?: string;
  showMore?: boolean;
}
```

### 3. BlogPostCard.astro - Tarjeta Individual

**Ubicación**: `src/layouts/components/blog/BlogPostCard.astro`

**Propósito**: Representar un post individual en listas

**Características**:

- Imagen thumbnail con lazy loading
- Título, descripción y metadata
- Tags visuales con colores temáticos
- Hover effects y transiciones
- Enlaces internos optimizados

**Props**:

```typescript
interface Props {
  post: CollectionEntry<"blog">;
  featured?: boolean;
}
```

---

## Páginas y Rutas

### 1. Página Principal del Blog

**Archivo**: `src/pages/blog-astro.astro`
**URL**: `https://mudanzasandy.es/blog-astro/`

**Estructura**:

```astro
---
// 1. Obtener todos los posts
const allPosts = await getCollection("blog");

// 2. Filtrar y ordenar
const publishedPosts = allPosts
  .filter(post => !post.data.draft)
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

// 3. Separar último post del resto
const latestPost = publishedPosts[0];
const remainingPosts = publishedPosts.slice(1);
---

<!-- 4. Renderizar componentes -->
<LatestPost post={latestPost} />
<BlogPostList posts={remainingPosts} />
```

### 2. Páginas Individuales de Posts

**Archivo**: `src/pages/blog/[slug].astro`
**URL Pattern**: `https://mudanzasandy.es/blog/{slug}/`

**getStaticPaths**:

```typescript
export async function getStaticPaths() {
  const blogPosts = await getCollection("blog");

  return blogPosts.map((post) => ({
    params: { slug: post.id }, // Usa post.id como slug
    props: { post },
  }));
}
```

**Renderizado de Contenido**:

```typescript
// Renderizado con fallback robusto
let renderedContent = "";
if (post.rendered?.html) {
  renderedContent = post.rendered.html;
} else {
  // Fallback usando marked
  renderedContent = await marked(post.body || "");
}
```

---

## Contenido y Posts

### Estructura de Frontmatter

Cada post debe incluir este frontmatter mínimo:

```yaml
---
title: "Título del Post"
description: "Descripción para SEO y cards"
pubDate: 2025-09-16
tags: ["tag1", "tag2", "tag3"]
category: "categoria"
featured: false
author: "Nombre del Autor - Especialidad"
readingTime: 8
heroImage: "URL_o_ruta_local"
heroImageAlt: "Descripción de la imagen"
metaTitle: "Título SEO específico (opcional)"
metaDescription: "Meta descripción específica (opcional)"
keywords: ["palabra1", "palabra2"]
---
```

### Posts Actuales

1. **mudanzas-economicas-barcelona-2025.md**

   - **Tema**: Consejos para mudanzas baratas
   - **Featured**: true (se muestra como hero)
   - **Imagen**: Local optimizada (`blog-hero-optimized.webp`) - Recuperada del blog anterior
   - **Tiempo lectura**: 8 minutos

2. **guia-embalaje-profesional-mudanzas.md**

   - **Tema**: Técnicas de embalaje profesional
   - **Imagen**: Unsplash - cajas y embalaje
   - **Tiempo lectura**: 6 minutos

3. **mudanza-con-ninos-guia-familias.md**

   - **Tema**: Mudanzas familiares con niños
   - **Imagen**: Unsplash - familia preparando mudanza
   - **Tiempo lectura**: 7 minutos

4. **mudanzas-internacionales-barcelona-guia-completa.md**
   - **Tema**: Mudanzas internacionales
   - **Imagen**: Unsplash - mudanza internacional
   - **Tiempo lectura**: 12 minutos

---

## Optimización de Imágenes

### Estrategias Implementadas

1. **Imagen Local Optimizada** (Recuperada del blog anterior):

   ```
   public/assets/images/blog/blog-hero-optimized.webp
   - Formato: WebP para máxima compresión
   - Tamaño: 800px width (responsive)
   - Peso: ~12KB (optimizado desde 2MB original)
   - Origen: Migrada desde implementación anterior del blog
   - Uso: Blog "Mudanzas Económicas Barcelona 2025"
   ```

2. **URLs de Unsplash Optimizadas**:

   ```
   https://images.unsplash.com/photo-ID?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80
   - Calidad: 80 (balance calidad/peso)
   - Ancho: 2070px (retina-ready)
   - Formato automático: WebP cuando compatible
   ```

3. **Lazy Loading**:
   - Implementado en todos los componentes
   - `loading="lazy"` por defecto
   - `loading="eager"` solo para hero images

### Comando de Optimización

```bash
# Para nuevas imágenes locales
pnpm dlx sharp-cli -i "./input.png" -o "./src/assets/images/blog/output.webp" --format webp --quality 80 --resize 800
```

---

## SEO y Metadatos

### Sitemap Automático

```javascript
// astro.config.mjs
sitemap({
  serialize: (item) => {
    // Página principal del blog
    if (item.url.includes("/blog-astro")) {
      item.priority = 0.8;
    }
    // Posts individuales
    if (item.url.includes("/blog/")) {
      item.priority = 0.7;
    }
    return item;
  },
});
```

### Structured Data

Cada página incluye JSON-LD para:

- `Blog` schema para la página principal
- `BlogPosting` schema para posts individuales
- `Organization` data para la empresa
- `BreadcrumbList` para navegación

### Keywords Específicas

Añadidas a `src/config/seo-keywords.json`:

```json
{
  "informational": [
    "blog mudanzas barcelona",
    "guia embalaje profesional",
    "mudanzas con niños consejos",
    "mudanzas internacionales guia"
  ]
}
```

---

## Renderizado de Markdown

### Problema Identificado

El Content Layer API de Astro 5 no pre-renderiza automáticamente el HTML, por lo que `post.body` contiene markdown crudo.

### Solución Implementada

```typescript
import { marked } from "marked";

// Renderizado con fallback robusto
let renderedContent = "";
if (post.rendered?.html) {
  // Usar HTML pre-renderizado si está disponible
  renderedContent = post.rendered.html;
} else {
  // Fallback: renderizar con marked
  renderedContent = await marked(post.body || "");
}
```

### Dependencia Añadida

```json
{
  "dependencies": {
    "marked": "16.3.0"
  }
}
```

---

## Comandos y Scripts

### Desarrollo

```bash
# Servidor de desarrollo
pnpm dev

# Build de producción
pnpm build

# Verificación TypeScript
pnpm check

# Preview del build
pnpm preview
```

### Gestión de Contenido

```bash
# Crear nuevo post
touch src/content/blog/nuevo-post.md

# Sincronizar content collections
# (automático en dev/build)

# Generar sitemap
# (automático en build)
```

### Optimización de Imágenes

```bash
# Optimizar imagen para blog
pnpm dlx sharp-cli -i "./input.jpg" -o "./src/assets/images/blog/optimized.webp" --format webp --quality 80 --resize 800

# Batch optimization
pnpm dlx sharp-cli -i "./blog-images/*.{jpg,png}" -o "./src/assets/images/blog/" --format webp --quality 80 --resize 800
```

---

## Troubleshooting

### Problemas Comunes y Soluciones

#### 1. Markdown no se renderiza

**Síntoma**: El contenido aparece como texto plano con sintaxis markdown visible

**Causa**: Content Layer API no pre-renderiza el HTML automáticamente

**Solución**:

```typescript
import { marked } from "marked";
const renderedContent = await marked(post.body || "");
```

#### 2. Imágenes rotas

**Síntoma**: Imágenes no cargan o muestran placeholder roto

**Solución**:

- Verificar que las URLs de Unsplash sean correctas
- Para imágenes locales, usar rutas relativas: `~/assets/images/blog/file.webp`
- Verificar que los archivos existan en la carpeta correcta

#### 3. Errores de TypeScript en props

**Síntoma**: `Property 'render' does not exist on type`

**Solución**:

- Verificar que se esté usando `CollectionEntry<"blog">` como tipo
- Usar optional chaining: `post.rendered?.html`

#### 4. Build falla por Content Collections

**Síntoma**: Error durante `pnpm build` relacionado con collections

**Solución**:

```bash
# Limpiar cache y regenerar
rm -rf .astro
pnpm build
```

#### 5. Sitemap no incluye posts individuales

**Síntoma**: Solo aparece la página principal en sitemap

**Solución**:

- Verificar que el sitemap esté habilitado en `astro.config.mjs`
- Verificar que `getStaticPaths()` esté configurado correctamente

---

## Migración del Blog Anterior

### Imagen Hero Recuperada

Durante la implementación, se identificó y recuperó una imagen optimizada del blog anterior:

**Archivo**: `blog-hero-optimized.webp`

- **Origen**: Sistema de blog anterior (iframe externo)
- **Proceso de migración**:
  1. Identificada en `src/assets/images/blog/blog-hero-optimized.webp`
  2. Documentada en `src/tasks/TASK-012-blog-migration.md`
  3. Copiada a `public/assets/images/blog/` para acceso directo
  4. Asignada al post principal: `mudanzas-economicas-barcelona-2025.md`

**Características técnicas**:

- Formato: WebP optimizado
- Dimensiones: 800px width (responsive)
- Peso: ~12KB (reducción del 99.4% desde original 2MB)
- Optimización: sharp-cli con calidad 80

**Comando de optimización original**:

```bash
pnpm dlx sharp-cli -i "./blog/image.png" -o "./src/assets/images/blog/blog-hero-optimized.webp" --format webp --quality 80 resize 800
```

### Correspondencia Temática

La imagen recuperada corresponde perfectamente al contenido del post "Mudanzas Económicas Barcelona 2025":

- Muestra un trabajador cargando cajas junto a un camión de mudanzas
- Estilo ilustrativo moderno y profesional
- Colores que combinan con la identidad visual de la marca
- Representa fielmente los servicios de mudanza económica

### Beneficios de la Recuperación

1. **Consistencia Visual**: Mantiene elementos del blog anterior
2. **Optimización Previa**: Ya estaba optimizada para web
3. **Relevancia Temática**: Perfecta para el post de mudanzas económicas
4. **Performance**: Imagen local reduce dependencias externas

---

## Integración con IA

### Para Consultas de IA

Cuando una IA necesite entender o modificar el sistema de blog:

1. **Estructura**: Referirse a la sección "Estructura de Archivos"
2. **Crear nuevo post**: Seguir el template de frontmatter en "Contenido y Posts"
3. **Modificar componentes**: Ver las Props interfaces en "Componentes del Blog"
4. **Problemas**: Consultar "Troubleshooting" primero
5. **Imágenes**: Usar estrategias de "Optimización de Imágenes"

### Comandos de Referencia Rápida

```bash
# Verificar estado del sistema
pnpm check && pnpm build

# Añadir nuevo post (template mínimo requerido)
# Consultar frontmatter en sección "Contenido y Posts"

# Optimizar imagen nueva
pnpm dlx sharp-cli -i "./input" -o "./src/assets/images/blog/output.webp" --format webp --quality 80 --resize 800
```

---

## Métricas y KPIs

### Performance Esperada

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3s

### SEO Metrics

- **Core Web Vitals**: PASSED
- **Crawlability**: 100% (contenido nativo vs iframe)
- **Mobile Friendly**: YES
- **Structured Data**: Valid JSON-LD

### Analytics a Monitorear

- Tiempo en página de posts individuales
- Bounce rate en `/blog-astro/`
- CTR desde posts hacia páginas de contacto
- Conversiones desde blog a formularios

---

## Próximas Mejoras Sugeridas

1. **Search Functionality**: Implementar búsqueda interna de posts
2. **Related Posts**: Mostrar posts relacionados por tags/categoría
3. **Reading Progress**: Barra de progreso de lectura
4. **Social Sharing**: Botones para compartir en redes sociales
5. **Comments System**: Sistema de comentarios (opcional)
6. **RSS Feed**: Feed XML para subscriptores
7. **Newsletter Integration**: Captura de emails para newsletter

---

**Última actualización**: 16 de septiembre de 2025
**Versión**: 1.0
**Mantenedor**: Equipo de desarrollo Mudanzas ANDY
