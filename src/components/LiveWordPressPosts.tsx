/**
 * LiveWordPressPosts - Componente React para obtener posts de WordPress en tiempo real
 *
 * Este componente hace fetch de posts desde WordPress directamente desde el navegador,
 * permitiendo que los cambios en WordPress se reflejen inmediatamente sin rebuild.
 *
 * Características:
 * - Fetch en tiempo real desde el navegador
 * - Actualización automática periódica (opcional)
 * - Fallback a contenido estático si WordPress no está disponible
 * - Loading states y manejo de errores
 * - Compatible con hosting estático (Hostinger)
 */

import React, { useState, useEffect } from "react";
import wordpressConfig from "@/config/wordpress.json";

interface WordPressPost {
  id: number;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  date: string;
  modified: string;
  slug: string;
  link: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      alt_text: string;
    }>;
    author?: Array<{
      name: string;
    }>;
    "wp:term"?: Array<
      Array<{
        name: string;
        slug: string;
      }>
    >;
  };
}

interface LiveWordPressPostsProps {
  /** Número de posts a mostrar */
  postsPerPage?: number;
  /** Habilitar actualización automática */
  autoRefresh?: boolean;
  /** Intervalo de actualización en milisegundos */
  refreshInterval?: number;
  /** Contenido estático de fallback (HTML string o component) */
  fallbackContent?: React.ReactNode;
  /** Categorías a filtrar (IDs de WordPress) */
  categories?: number[];
  /** Mostrar loading spinner */
  showLoading?: boolean;
  /** Clase CSS personalizada para el contenedor */
  className?: string;
}

export default function LiveWordPressPosts({
  postsPerPage = 10,
  autoRefresh = false,
  refreshInterval = wordpressConfig.clientSide.refreshInterval,
  fallbackContent = null,
  categories = [],
  showLoading = true,
  className = "",
}: LiveWordPressPostsProps) {
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  /**
   * Obtiene posts desde WordPress REST API
   */
  const fetchPosts = async () => {
    try {
      setError(null);

      // Construir URL con parámetros
      const params = new URLSearchParams({
        per_page: postsPerPage.toString(),
        _embed: "true",
        orderby: "date",
        order: "desc",
      });

      if (categories.length > 0) {
        params.append("categories", categories.join(","));
      }

      const url = `${wordpressConfig.apiUrl}/posts?${params.toString()}`;

      console.log("[LiveWordPress] Fetching posts from:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPosts(data);
      setLastUpdate(new Date());
      setLoading(false);

      console.log(`[LiveWordPress] Successfully loaded ${data.length} posts`);
    } catch (err) {
      console.error("[LiveWordPress] Error fetching posts:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
      setLoading(false);

      // Si hay fallback y es la primera carga, mantener el loading en false
      // para que se muestre el contenido estático
    }
  };

  // Fetch inicial
  useEffect(() => {
    fetchPosts();
  }, [postsPerPage, categories]);

  // Auto-refresh opcional
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      console.log("[LiveWordPress] Auto-refreshing posts...");
      fetchPosts();
    }, refreshInterval) as unknown as number;

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, postsPerPage, categories]);

  /**
   * Extrae la imagen destacada del post
   */
  const getFeaturedImage = (post: WordPressPost): string | null => {
    return post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;
  };

  /**
   * Extrae el alt text de la imagen
   */
  const getImageAlt = (post: WordPressPost): string => {
    return (
      post._embedded?.["wp:featuredmedia"]?.[0]?.alt_text || post.title.rendered
    );
  };

  /**
   * Extrae el nombre del autor
   */
  const getAuthor = (post: WordPressPost): string => {
    return post._embedded?.["author"]?.[0]?.name || "Equipo Mudanzas ANDY";
  };

  /**
   * Extrae las categorías del post
   */
  const getCategories = (post: WordPressPost): string[] => {
    const terms = post._embedded?.["wp:term"];
    if (!terms || terms.length === 0) return [];

    // Las categorías están en el primer array de términos
    return terms[0]?.map((term) => term.name) || [];
  };

  /**
   * Limpia el HTML del excerpt
   */
  const cleanExcerpt = (excerpt: string): string => {
    return excerpt
      .replace(/<[^>]*>/g, "") // Eliminar tags HTML
      .replace(/&[^;]+;/g, "") // Eliminar entities HTML
      .trim();
  };

  /**
   * Formatea la fecha al español
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Mostrar loading state
  if (loading && showLoading) {
    return (
      <div className={`live-wordpress-posts loading ${className}`}>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[rgb(var(--color-primary))]"></div>
          <span className="ml-4 text-lg text-gray-600">
            Cargando posts de WordPress...
          </span>
        </div>
      </div>
    );
  }

  // Mostrar error + fallback si está disponible
  if (error) {
    if (fallbackContent) {
      return (
        <div
          className={`live-wordpress-posts error-with-fallback ${className}`}
        >
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
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
                  No se pudieron cargar los posts más recientes de WordPress.
                  Mostrando contenido en caché.
                </p>
              </div>
            </div>
          </div>
          {fallbackContent}
        </div>
      );
    }

    return (
      <div className={`live-wordpress-posts error ${className}`}>
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error al cargar posts
              </h3>
              <p className="mt-2 text-sm text-red-700">{error}</p>
              <button
                onClick={fetchPosts}
                className="mt-3 text-sm font-medium text-red-800 hover:text-red-600"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar posts
  if (posts.length === 0) {
    return (
      <div className={`live-wordpress-posts empty ${className}`}>
        <p className="text-center text-gray-500 py-8">
          No hay posts disponibles en este momento.
        </p>
      </div>
    );
  }

  return (
    <div className={`live-wordpress-posts ${className}`}>
      {/* Indicador de última actualización */}
      {lastUpdate && autoRefresh && (
        <div className="text-xs text-gray-500 mb-4 text-right">
          Última actualización: {lastUpdate.toLocaleTimeString("es-ES")}
        </div>
      )}

      {/* Grid de posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => {
          const featuredImage = getFeaturedImage(post);
          const categories = getCategories(post);

          return (
            <article
              key={post.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Imagen destacada */}
              {featuredImage && (
                <a href={`/blog/wp/${post.slug}`} className="block">
                  <img
                    src={featuredImage}
                    alt={getImageAlt(post)}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                </a>
              )}

              <div className="p-6">
                {/* Categorías */}
                {categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {categories.map((category, idx) => (
                      <span
                        key={idx}
                        className="inline-block bg-[rgb(var(--color-primary))] text-white text-xs px-3 py-1 rounded-full"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                )}

                {/* Título */}
                <h3 className="text-xl font-bold mb-3">
                  <a
                    href={`/blog/wp/${post.slug}`}
                    className="text-gray-900 hover:text-[rgb(var(--color-primary))] transition-colors"
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                  />
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {cleanExcerpt(post.excerpt.rendered)}
                </p>

                {/* Meta información */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{formatDate(post.date)}</span>
                  <span>{getAuthor(post)}</span>
                </div>

                {/* Badge de WordPress */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <span className="inline-flex items-center text-xs text-gray-500">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm1-13h-2v6h2V5zm0 8h-2v2h2v-2z" />
                    </svg>
                    Desde WordPress
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
