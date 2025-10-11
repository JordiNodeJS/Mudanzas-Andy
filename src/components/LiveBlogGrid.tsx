/**
 * LiveBlogGrid - Componente híbrido para blog-astro
 *
 * Combina posts de WordPress en tiempo real con posts de Astro estáticos
 * Mantiene la paginación y el layout existente
 *
 * IMPORTANTE: Siempre inicia con loading para evitar mostrar datos obsoletos
 * (por ejemplo, posts que ahora están en borrador en WordPress)
 */

import React, { useState, useEffect } from "react";
import wordpressConfig from "@/config/wordpress.json";
import type { UnifiedBlogPost, WordPressPost } from "@/lib/types/wordpress.js";

interface LiveBlogGridProps {
  /** Posts de Astro estáticos */
  astroPosts: any[];
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
  currentPage = 1,
  postsPerPage = 9,
  showHero = true,
  className = "",
}: LiveBlogGridProps) {
  // Iniciar sin datos para evitar mostrar posts obsoletos (ej: borradores)
  // El fetch inicial traerá los datos frescos desde WordPress
  const [wpPosts, setWpPosts] = useState<UnifiedBlogPost[]>([]);
  const [loading, setLoading] = useState(true); // Iniciar en loading para evitar parpadeo
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

      // Obtener URL desde variable de entorno o usar fallback del config
      const apiUrl =
        import.meta.env.PUBLIC_WORDPRESS_API_URL || wordpressConfig.apiUrl;
      const url = `${apiUrl}/posts?${params.toString()}`;

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
      {/* Loading inicial - Evita mostrar contenido obsoleto */}
      {loading && wpPosts.length === 0 && (
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-[rgb(var(--color-primary))] border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-[rgb(var(--color-accent))] rounded-full animate-pulse"></div>
              </div>
            </div>
            <p className="mt-6 text-lg font-semibold text-gray-700">
              Cargando artículos más recientes...
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Obteniendo contenido actualizado desde WordPress
            </p>
          </div>
        </div>
      )}

      {/* Contenido - Solo se muestra después del primer fetch */}
      {!loading || wpPosts.length > 0 ? (
        <>
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

          {/* Hero Post (solo página 1) - Diseño Original */}
          {heroPost && (
            <section className="py-12 lg:py-16 bg-gradient-to-br from-[rgb(var(--color-primary))] via-[rgb(var(--color-secondary))] to-[rgb(var(--color-neutral))]">
              <div className="container mx-auto px-4">
                {/* Etiqueta de "Último artículo" */}
                <div className="text-center mb-8">
                  <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
                    ✨ Último Artículo Publicado
                  </span>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                  {/* Contenido del post */}
                  <div className="text-white space-y-6 order-2 lg:order-1">
                    {/* Meta información */}
                    <div className="flex items-center gap-6 text-sm text-white/80">
                      <time className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                        </svg>
                        {formatDate(getPostDate(heroPost))}
                      </time>
                    </div>

                    {/* Título del post */}
                    <h1 className="text-3xl lg:text-5xl font-bold leading-tight">
                      {getPostTitle(heroPost)}
                    </h1>

                    {/* Descripción */}
                    <p className="text-lg lg:text-xl text-white/90 leading-relaxed">
                      {getPostDescription(heroPost)}
                    </p>

                    {/* Autor */}
                    <div className="flex items-center gap-3 text-white/80">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                        </svg>
                      </div>
                      <span className="font-medium">
                        {getPostAuthor(heroPost)}
                      </span>
                    </div>

                    {/* Call to action */}
                    <div className="pt-4">
                      <a
                        href={getPostUrl(heroPost)}
                        className="inline-flex items-center gap-3 bg-white text-[rgb(var(--color-primary))] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 hover:scale-105 hover:shadow-xl group"
                      >
                        Leer artículo completo
                        <svg
                          className="w-6 h-6 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          ></path>
                        </svg>
                      </a>
                    </div>
                  </div>

                  {/* Imagen del post */}
                  <div className="order-1 lg:order-2">
                    {getPostImage(heroPost) ? (
                      <div className="relative">
                        <img
                          src={getPostImage(heroPost)!}
                          alt={getPostTitle(heroPost)}
                          className="w-full h-auto rounded-2xl shadow-2xl object-cover"
                          loading="eager"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-96 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <div className="text-center text-white/60">
                          <svg
                            className="w-24 h-24 mx-auto mb-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19M19,19H5V5H19M13.96,12.29L11.21,15.83L9.25,13.47L6.5,17H17.5L13.96,12.29Z" />
                          </svg>
                          <p className="text-lg font-medium">
                            Artículo sin imagen
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Indicador de scroll hacia abajo */}
                <div className="text-center mt-16">
                  <div className="inline-flex flex-col items-center text-white/60">
                    <span className="text-sm mb-2">Continúa leyendo</span>
                    <svg
                      className="w-6 h-6 animate-bounce"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Grid de Posts - Diseño Original */}
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              {/* Título de la sección */}
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  {currentPage === 1
                    ? "Más Artículos del Blog"
                    : `Artículos del Blog - Página ${currentPage}`}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-secondary))] mx-auto rounded-full"></div>
              </div>

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
                        Mostrando posts en caché. No se pudieron obtener las
                        últimas actualizaciones de WordPress.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
