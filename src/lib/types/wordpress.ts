/**
 * Tipos TypeScript para integración con WordPress REST API
 * Mapea la respuesta de WordPress a un formato unificado con posts de Astro
 */

/**
 * Estructura de un post de WordPress desde la API REST
 */
export interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: unknown[];
  categories: number[];
  tags: number[];
  _embedded?: {
    author?: Array<{
      id: number;
      name: string;
      url: string;
      description: string;
      link: string;
      slug: string;
      avatar_urls: Record<string, string>;
    }>;
    "wp:featuredmedia"?: Array<{
      id: number;
      date: string;
      slug: string;
      type: string;
      link: string;
      title: {
        rendered: string;
      };
      caption: {
        rendered: string;
      };
      alt_text: string;
      media_type: string;
      mime_type: string;
      media_details: {
        width: number;
        height: number;
        file: string;
        sizes: Record<
          string,
          {
            file: string;
            width: number;
            height: number;
            mime_type: string;
            source_url: string;
          }
        >;
      };
      source_url: string;
    }>;
    "wp:term"?: Array<
      Array<{
        id: number;
        link: string;
        name: string;
        slug: string;
        taxonomy: string;
      }>
    >;
  };
}

/**
 * Respuesta de la API de WordPress con headers de paginación
 */
export interface WordPressAPIResponse {
  posts: WordPressPost[];
  totalPages: number;
  totalPosts: number;
}

/**
 * Formato unificado para posts (WordPress + Astro)
 * Compatible con CollectionEntry<"blog"> de Astro
 */
export interface UnifiedBlogPost {
  id: string;
  slug: string;
  source: "wordpress" | "astro";
  title: string;
  description: string;
  pubDate: Date;
  updatedDate?: Date;
  heroImage?: string;
  heroImageAlt?: string;
  author?: string;
  category?: string;
  tags?: string[];
  draft?: boolean;
  featured?: boolean;
  postUrl: string;
  excerpt?: string;
  // Para posts de WordPress
  wordpressId?: number;
  externalLink?: string;
}

/**
 * Opciones para obtener posts de WordPress
 */
export interface WordPressPostsOptions {
  page?: number;
  perPage?: number;
  categories?: number[];
  tags?: number[];
  search?: string;
  orderBy?: "date" | "modified" | "title" | "relevance";
  order?: "asc" | "desc";
}
