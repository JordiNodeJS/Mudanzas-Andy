/**
 * LiveBlogGrid - Componente híbrido para blog-astro
 *
 * Combina posts de WordPress en tiempo real con posts de Astro estáticos
 * Mantiene la paginación y el layout existente
 */

import React, { useState, useEffect } from "react";
import wordpressConfig from "@/config/wordpress.json";
import type { UnifiedBlogPost, WordPressPost } from "@/lib/types/wordpress.js";

interface LiveBlogGridProps {
  /** Posts de Astro estáticos (fallback) */
  astroPosts: any[];
  /** Posts de WordPress estáticos iniciales (fallback) */
  initialWordPressPosts: UnifiedBlogPost[];
  /** Página actual */
  currentPage?: number;
  /** Posts por página */
  postsPerPage?: number;
  /** Mostrar como hero el primero */
  showHero?: boolean;
  /** Clase CSS personalizada */
  className?: string;
}

export default function LiveBlogGrid({
  astroPosts,
  initialWordPressPosts,
  currentPage = 1,
  postsPerPage = 9,
  showHero = true,
  className = "",
}: LiveBlogGridProps) {
  const [wpPosts, setWpPosts] = useState<UnifiedBlogPost[]>(
    initialWordPressPosts
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  /**
   * Transforma post de WordPress al formato unificado
   */
  const transformWordPressPost = (wpPost: WordPressPost): UnifiedBlogPost => {
    const author = wpPost._embedded?.author?.[0]?.name || "Mudanzas ANDY";
    const featuredMedia = wpPost._embedded?.["wp:featuredmedia"]?.[0];
    const categories = wpPost._embedded?.["wp:term"]?.[0] || [];
    const tags = wpPost._embedded?.["wp:term"]?.[1] || [];

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
      heroImage: featuredMedia?.source_url,
      heroImageAlt: featuredMedia?.alt_text || wpPost.title.rendered,
      author,
      category: categories[0]?.name || "General",
      tags: tags.map((tag) => tag.name),
      draft: false,
      featured: false,
      postUrl: `/blog/wp/${wpPost.slug}`,
      externalLink: wpPost.link,
      wordpressId: wpPost.id,
    };
  };

  /**
   * Obtiene posts frescos de WordPress
   *
   * IMPORTANTE: Este fetch solo se ejecuta cuando:
   * 1. El usuario entra/recarga la página (useEffect inicial)
   * 2. El usuario hace clic en el botón "Actualizar" (manual)
   *
   * NO hay auto-refresh automático cada X tiempo.
   */
  const fetchWordPressPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        per_page: "100",
        orderby: "date",
        order: "desc",
        _embed: "true",
      });

      const url = `${wordpressConfig.apiUrl}/posts?${params.toString()}`;

      console.log("[LiveBlogGrid] Fetching WordPress posts from:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: WordPressPost[] = await response.json();
      const transformedPosts = data.map(transformWordPressPost);

      setWpPosts(transformedPosts);
      setLastUpdate(new Date());
      setLoading(false);

      console.log(
        `[LiveBlogGrid] Successfully loaded ${transformedPosts.length} WordPress posts`
      );
    } catch (err) {
      console.error("[LiveBlogGrid] Error fetching WordPress posts:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
      setLoading(false);
      // Mantener los posts iniciales en caso de error
    }
  };

  // Fetch inicial al montar el componente
  // Solo se ejecuta UNA VEZ cuando el usuario entra a la página
  // NO hay auto-refresh automático
  useEffect(() => {
    fetchWordPressPosts();
  }, []);

  // Combinar posts de WordPress (actualizados o iniciales) con posts de Astro
  const allPosts = [...wpPosts, ...astroPosts].sort((a, b) => {
    const dateA = "data" in a ? a.data.pubDate : a.pubDate;
    const dateB = "data" in b ? b.data.pubDate : b.pubDate;
    return dateB.valueOf() - dateA.valueOf();
  });

  // Extraer el hero post (primero) si estamos en página 1
  const heroPost = showHero && currentPage === 1 ? allPosts[0] : null;
  const remainingPosts = heroPost ? allPosts.slice(1) : allPosts;

  // Calcular paginación
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const paginatedPosts = remainingPosts.slice(startIndex, endIndex);

  /**
   * Formatea fecha
   */
  const formatDate = (dateString: string | Date): string => {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  /**
   * Obtiene la URL del post
   */
  const getPostUrl = (post: any): string => {
    if ("source" in post && post.source === "wordpress") {
      return post.postUrl;
    }
    return `/blog/${post.slug || post.id}`;
  };

  /**
   * Obtiene la imagen del post
   */
  const getPostImage = (post: any): string | null => {
    if ("data" in post) {
      return post.data.heroImage?.src || null;
    }
    return post.heroImage || null;
  };

  /**
   * Obtiene el título del post
   */
  const getPostTitle = (post: any): string => {
    if ("data" in post) {
      return post.data.title;
    }
    return post.title;
  };

  /**
   * Obtiene la descripción del post
   */
  const getPostDescription = (post: any): string => {
    if ("data" in post) {
      return post.data.description;
    }
    return post.description || post.excerpt;
  };

  /**
   * Obtiene la fecha de publicación
   */
  const getPostDate = (post: any): Date => {
    if ("data" in post) {
      return post.data.pubDate;
    }
    return post.pubDate;
  };

  /**
   * Obtiene el autor
   */
  const getPostAuthor = (post: any): string => {
    if ("data" in post) {
      return post.data.author || "Equipo Mudanzas ANDY";
    }
    return post.author || "Equipo Mudanzas ANDY";
  };

  /**
   * Verifica si es post de WordPress
   */
  const isWordPressPost = (post: any): boolean => {
    return "source" in post && post.source === "wordpress";
  };

  return (
    <div className={`live-blog-grid ${className}`}>
      {/* Indicador de actualización */}
      {lastUpdate && (
        <div className="container mx-auto px-4 mb-4">
          <div className="flex items-center justify-end gap-2 text-sm text-gray-500">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span>
              Última actualización: {lastUpdate.toLocaleTimeString("es-ES")}
            </span>
            <button
              onClick={fetchWordPressPosts}
              disabled={loading}
              className="ml-2 text-[rgb(var(--color-primary))] hover:underline disabled:opacity-50"
            >
              {loading ? "Actualizando..." : "↻ Actualizar"}
            </button>
          </div>
        </div>
      )}

      {/* Hero Post (solo página 1) */}
      {heroPost && (
        <section className="container mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Imagen del hero */}
              {getPostImage(heroPost) && (
                <a
                  href={getPostUrl(heroPost)}
                  className="block h-full min-h-[300px] lg:min-h-[400px]"
                >
                  <img
                    src={getPostImage(heroPost)!}
                    alt={getPostTitle(heroPost)}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </a>
              )}

              {/* Contenido del hero */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="mb-4">
                  <span className="inline-block bg-[rgb(var(--color-accent))] text-gray-900 text-sm font-semibold px-4 py-2 rounded-full">
                    ⭐ Artículo Destacado
                  </span>
                  {isWordPressPost(heroPost) && (
                    <span className="inline-block ml-2 bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                      Actualizado en vivo
                    </span>
                  )}
                </div>

                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  <a
                    href={getPostUrl(heroPost)}
                    className="hover:text-[rgb(var(--color-primary))] transition-colors"
                  >
                    {getPostTitle(heroPost)}
                  </a>
                </h2>

                <p className="text-lg text-gray-600 mb-6">
                  {getPostDescription(heroPost)}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  <span>{formatDate(getPostDate(heroPost))}</span>
                  <span>•</span>
                  <span>{getPostAuthor(heroPost)}</span>
                </div>

                <a
                  href={getPostUrl(heroPost)}
                  className="inline-flex items-center gap-2 text-[rgb(var(--color-primary))] font-semibold hover:gap-3 transition-all"
                >
                  Leer artículo completo
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Grid de Posts */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
          {currentPage === 1
            ? "Más Artículos del Blog"
            : `Artículos del Blog - Página ${currentPage}`}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedPosts.map((post) => {
            const postUrl = getPostUrl(post);
            const postImage = getPostImage(post);
            const isWP = isWordPressPost(post);
            const postKey = isWP ? `wp-${post.slug}` : `astro-${post.id}`;

            return (
              <article
                key={postKey}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {postImage && (
                  <a href={postUrl} className="block">
                    <img
                      src={postImage}
                      alt={getPostTitle(post)}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                    />
                  </a>
                )}

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3">
                    <a
                      href={postUrl}
                      className="text-gray-900 hover:text-[rgb(var(--color-primary))] transition-colors"
                    >
                      {getPostTitle(post)}
                    </a>
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {getPostDescription(post)}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{formatDate(getPostDate(post))}</span>
                    <span>{getPostAuthor(post)}</span>
                  </div>

                  {isWP && (
                    <div className="pt-4 border-t border-gray-200">
                      <span className="inline-flex items-center text-xs text-blue-600">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
                        </svg>
                        Actualizado en vivo desde WordPress
                      </span>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* Mensaje de error si hay problemas con WordPress */}
        {error && (
          <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Mostrando posts en caché. No se pudieron obtener las últimas
                  actualizaciones de WordPress.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
