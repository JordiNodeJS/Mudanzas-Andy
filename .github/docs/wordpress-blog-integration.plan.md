# Plan: Integración de Posts de WordPress en Blog Astro

## Objetivo

Integrar posts del blog de WordPress (https://barcelona.mudanzasandy.es/wp-json/wp/v2/posts) en la página `blog-astro.astro`, combinándolos con los posts locales de Astro markdown, mostrando primero los de WordPress, luego los de Astro, con paginación y selección del post más reciente como hero.

## Estructura de Implementación

### 1. Crear utilidad para fetch de posts de WordPress

**Archivo:** `src/lib/utils/wordpress.ts`

Crear función que:

- Haga fetch a la API REST de WordPress
- Transforme la respuesta al formato compatible con nuestro blog
- Maneje errores y cache básico
- Mapee campos: `title.rendered`, `excerpt.rendered`, `date`, `link`, `featured_media`, `categories`, `tags`

### 2. Crear tipos TypeScript para posts de WordPress

**Archivo:** `src/lib/types/wordpress.ts`

Definir interfaces para:

- `WordPressPost` (respuesta de la API)
- `UnifiedBlogPost` (formato común entre Astro y WP)
- Tipos para autor, categorías, tags

### 3. Crear componente para tarjetas de posts de WordPress

**Archivo:** `src/layouts/components/blog/WordPressBlogCard.astro`

Componente similar a `BlogPostCard.astro` pero adaptado para:

- Props de tipo `UnifiedBlogPost`
- Links externos a WordPress
- Indicador visual de origen (badge "WordPress")
- Manejo de imágenes externas (featured_media)
- Fecha en formato ISO de WordPress

### 4. Adaptar componente LatestPost para posts unificados

**Archivo:** `src/layouts/components/blog/LatestPost.astro`

Modificar para:

- Aceptar tanto `CollectionEntry<"blog">` como `UnifiedBlogPost`
- Detectar tipo de post y renderizar apropiadamente
- Link externo para posts de WordPress

### 5. Actualizar página blog-astro.astro

**Archivo:** `src/pages/blog-astro.astro`

Implementar:

- Fetch de posts de WordPress con paginación (parámetro `?page=` en query string)
- Combinar posts de WordPress + Astro
- Ordenar por fecha (más recientes primero)
- Seleccionar el post más reciente como hero (de cualquier fuente)
- Mostrar primero posts de WordPress, luego Astro (respetando fechas)
- Implementar paginación con controles de navegación
- Posts por página: 9 (ajustable)

### 6. Crear componente de Paginación

**Archivo:** `src/layouts/components/blog/Pagination.astro`

Componente que:

- Reciba `currentPage`, `totalPages`, `baseUrl`
- Muestre botones Anterior/Siguiente
- Muestre números de página (con ellipsis si hay muchas)
- Estilos consistentes con el diseño actual

### 7. Actualizar JSON-LD y metadatos SEO

**Archivo:** `src/pages/blog-astro.astro`

Actualizar schema.org para:

- Incluir posts de WordPress en `blogPost` array
- Mantener límite de 5 posts para structured data
- Actualizar contador de posts total

## Detalles Técnicos

### API WordPress

```
Endpoint: https://barcelona.mudanzasandy.es/wp-json/wp/v2/posts
Query params: 
  - per_page=20 (posts por request)
  - page=1 (página actual)
  - _embed (para incluir featured_media y autor)
```

### Mapeo de Campos

```
WordPress → Astro
- title.rendered → title
- excerpt.rendered → description
- date → pubDate
- modified → updatedDate
- link → postUrl
- _embedded['wp:featuredmedia'][0].source_url → heroImage
- _embedded.author[0].name → author
- categories → category (primer elemento)
- tags → tags
```

### Paginación

- URL pattern: `/blog-astro?page=1`, `/blog-astro?page=2`
- Detectar `Astro.url.searchParams.get('page')`
- Calcular offset y límites
- Generar links canónicos apropiados

## Archivos a Crear

1. `src/lib/utils/wordpress.ts` - Utilidades de fetch
2. `src/lib/types/wordpress.ts` - Tipos TypeScript
3. `src/layouts/components/blog/WordPressBlogCard.astro` - Tarjeta de post WP
4. `src/layouts/components/blog/Pagination.astro` - Componente de paginación

## Archivos a Modificar

1. `src/pages/blog-astro.astro` - Lógica principal de integración
2. `src/layouts/components/blog/LatestPost.astro` - Soporte para posts unificados
3. `src/layouts/components/blog/BlogPostList.astro` - Soporte para mezclar ambos tipos

## Consideraciones

- Caché: Implementar estrategia básica de caché para evitar múltiples fetches
- Error handling: Manejar fallos de API gracefully (mostrar solo posts de Astro)
- Performance: Limitar número de posts por página (9-12)
- SEO: Mantener URLs canónicas y metadatos apropiados
- Responsive: Asegurar que paginación funcione bien en móvil