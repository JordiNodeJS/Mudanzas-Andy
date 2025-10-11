/**
 * Utilidades para interactuar con WordPress REST API
 * Maneja el fetch de posts y su transformación al formato unificado
 */

import type {
  WordPressPost,
  WordPressAPIResponse,
  UnifiedBlogPost,
  WordPressPostsOptions,
} from "@/lib/types/wordpress.js";

// URL de la API de WordPress desde variable de entorno
const WORDPRESS_API_URL =
  import.meta.env.PUBLIC_WORDPRESS_API_URL ||
  "https://barcelona.mudanzasandy.es/wp-json/wp/v2";

const DEFAULT_PER_PAGE = 20;

// Cache simple en memoria para desarrollo (en producción usar Redis o similar)
const cache = new Map<
  string,
  { data: WordPressAPIResponse; timestamp: number }
>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

/**
 * Obtiene posts de WordPress desde la API REST
 * @param options - Opciones de consulta (paginación, filtros, etc.)
 * @returns Promise con posts y metadatos de paginación
 */
export async function getWordPressPosts(
  options: WordPressPostsOptions = {}
): Promise<WordPressAPIResponse> {
  const {
    page = 1,
    perPage = DEFAULT_PER_PAGE,
    categories = [],
    tags = [],
    search = "",
    orderBy = "date",
    order = "desc",
  } = options;

  // Construir URL con parámetros
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
    orderby: orderBy,
    order: order,
    _embed: "true", // Incluir datos embebidos (autor, imagen destacada, etc.)
  });

  if (categories.length > 0) {
    params.append("categories", categories.join(","));
  }

  if (tags.length > 0) {
    params.append("tags", tags.join(","));
  }

  if (search) {
    params.append("search", search);
  }

  const url = `${WORDPRESS_API_URL}/posts?${params.toString()}`;
  const cacheKey = url;

  // Verificar cache
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log("[WordPress] Cache hit:", cacheKey);
    return cached.data;
  }

  try {
    console.log("[WordPress] Fetching posts from:", url);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `WordPress API error: ${response.status} ${response.statusText}`
      );
    }

    const posts: WordPressPost[] = await response.json();

    // Obtener metadatos de paginación de los headers
    const totalPages = parseInt(response.headers.get("X-WP-TotalPages") || "1");
    const totalPosts = parseInt(response.headers.get("X-WP-Total") || "0");

    const result: WordPressAPIResponse = {
      posts,
      totalPages,
      totalPosts,
    };

    // Guardar en cache
    cache.set(cacheKey, { data: result, timestamp: Date.now() });

    return result;
  } catch (error) {
    console.error("[WordPress] Error fetching posts:", error);
    // En caso de error, retornar respuesta vacía
    return {
      posts: [],
      totalPages: 0,
      totalPosts: 0,
    };
  }
}

/**
 * Transforma un post de WordPress al formato unificado
 * @param wpPost - Post de WordPress desde la API
 * @returns Post en formato unificado
 */
export function transformWordPressPost(wpPost: WordPressPost): UnifiedBlogPost {
  // Extraer datos embebidos
  const author = wpPost._embedded?.author?.[0]?.name || "Mudanzas ANDY";
  const featuredMedia = wpPost._embedded?.["wp:featuredmedia"]?.[0];
  const categories = wpPost._embedded?.["wp:term"]?.[0] || [];
  const tags = wpPost._embedded?.["wp:term"]?.[1] || [];

  // Limpiar excerpt HTML
  const cleanExcerpt = wpPost.excerpt.rendered
    .replace(/<[^>]+>/g, "")
    .replace(/&[^;]+;/g, " ")
    .trim();

  return {
    id: `wp-${wpPost.id}`,
    slug: wpPost.slug,
    source: "wordpress",
    title: wpPost.title.rendered
      .replace(/&#8217;/g, "'")
      .replace(/&[^;]+;/g, " "),
    description: cleanExcerpt || wpPost.title.rendered,
    excerpt: cleanExcerpt,
    pubDate: new Date(wpPost.date),
    updatedDate: new Date(wpPost.modified),
    heroImage:
      featuredMedia?.source_url ||
      featuredMedia?.media_details?.sizes?.medium_large?.source_url,
    heroImageAlt: featuredMedia?.alt_text || wpPost.title.rendered,
    author,
    category: categories[0]?.name || "General",
    tags: tags.map((tag) => tag.name),
    draft: wpPost.status !== "publish",
    featured: wpPost.sticky,
    postUrl: `/blog/wp/${wpPost.slug}`, // URL local de Astro
    externalLink: wpPost.link, // URL original de WordPress
    wordpressId: wpPost.id,
  };
}

/**
 * Obtiene posts de WordPress y los transforma al formato unificado
 * @param options - Opciones de consulta
 * @returns Promise con posts transformados y metadatos
 */
export async function getUnifiedWordPressPosts(
  options: WordPressPostsOptions = {}
): Promise<{
  posts: UnifiedBlogPost[];
  totalPages: number;
  totalPosts: number;
}> {
  const response = await getWordPressPosts(options);

  const unifiedPosts = response.posts.map(transformWordPressPost);

  return {
    posts: unifiedPosts,
    totalPages: response.totalPages,
    totalPosts: response.totalPosts,
  };
}

/**
 * Limpia el cache de posts de WordPress
 */
export function clearWordPressCache(): void {
  cache.clear();
  console.log("[WordPress] Cache cleared");
}

/**
 * Obtiene posts de WordPress desde el cliente (navegador)
 * Esta función NO usa el cache del servidor y está diseñada para
 * ser llamada desde componentes React o JavaScript del navegador.
 *
 * @param options - Opciones de consulta
 * @returns Promise con posts transformados y metadatos
 */
export async function getWordPressPostsClient(
  options: WordPressPostsOptions = {}
): Promise<{
  posts: UnifiedBlogPost[];
  totalPages: number;
  totalPosts: number;
}> {
  const {
    page = 1,
    perPage = DEFAULT_PER_PAGE,
    categories = [],
    tags = [],
    search = "",
    orderBy = "date",
    order = "desc",
  } = options;

  // Construir URL con parámetros
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
    orderby: orderBy,
    order: order,
    _embed: "true",
  });

  if (categories.length > 0) {
    params.append("categories", categories.join(","));
  }

  if (tags.length > 0) {
    params.append("tags", tags.join(","));
  }

  if (search) {
    params.append("search", search);
  }

  const url = `${WORDPRESS_API_URL}/posts?${params.toString()}`;

  try {
    console.log("[WordPress Client] Fetching posts from:", url);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      // No usar cache del navegador para obtener datos frescos
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `WordPress API error: ${response.status} ${response.statusText}`
      );
    }

    const posts: WordPressPost[] = await response.json();

    // Obtener metadatos de paginación
    const totalPages = parseInt(response.headers.get("X-WP-TotalPages") || "1");
    const totalPosts = parseInt(response.headers.get("X-WP-Total") || "0");

    // Transformar posts al formato unificado
    const unifiedPosts = posts.map(transformWordPressPost);

    console.log(
      `[WordPress Client] Successfully loaded ${unifiedPosts.length} posts`
    );

    return {
      posts: unifiedPosts,
      totalPages,
      totalPosts,
    };
  } catch (error) {
    console.error("[WordPress Client] Error fetching posts:", error);
    return {
      posts: [],
      totalPages: 0,
      totalPosts: 0,
    };
  }
}
