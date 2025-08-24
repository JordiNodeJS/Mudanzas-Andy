/**
 * Configuración de Tailwind CSS 4 para Mudanzas ANDY
 *
 * Configuración simplificada para compatibilidad con Tailwind CSS 4.1.12
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  safelist: [
    // Colores de texto
    "text-primary",
    "text-primary-dark",
    "text-secondary",
    "text-secondary-dark",
    "text-accent",
    "text-accent-dark",
    "text-highlight",
    "text-highlight-dark",
    "text-neutral",
    "text-neutral-dark",
    "text-beige",
    "text-beige-dark",
    "text-cream",
    // Colores de fondo
    "bg-primary",
    "bg-primary-dark",
    "bg-secondary",
    "bg-secondary-dark",
    "bg-accent",
    "bg-accent-dark",
    "bg-highlight",
    "bg-highlight-dark",
    "bg-neutral",
    "bg-neutral-dark",
    "bg-beige",
    "bg-beige-dark",
    "bg-cream",
    // Colores de borde
    "border-primary",
    "border-primary-dark",
    "border-secondary",
    "border-secondary-dark",
    "border-accent",
    "border-accent-dark",
    "border-highlight",
    "border-highlight-dark",
    "border-neutral",
    "border-neutral-dark",
    "border-beige",
    "border-beige-dark",
    "border-cream",
  ],
  theme: {
    // Extender la configuración base en lugar de sobrescribir
    extend: {
      /* ===== COLORES ===== */
      colors: {
        /* Colores principales del brand */
        primary: {
          DEFAULT: "#264e70",
          dark: "#1e415c",
        },
        secondary: {
          DEFAULT: "#679186",
          dark: "#5a7a6f",
        },
        accent: {
          DEFAULT: "#f9b4ab",
          dark: "#f7a094",
        },
        highlight: {
          DEFAULT: "#fae360",
          dark: "#f0d44a",
        },
        neutral: {
          DEFAULT: "#bbd4ce",
          dark: "#a7c0ba",
        },

        /* Colores beige para fondos */
        beige: {
          DEFAULT: "#fbf3e8",
          dark: "#f3e8d8",
        },

        /* Color crema para gradientes */
        cream: "#fdebf3",

        /* Colores semánticos */
        success: "#22c55e",
        warning: "#f59e0b",
        error: "#ef4444",
        info: "#3b82f6",

        /* Grises y neutros extendidos */
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
      },

      /* ===== ESPACIADO ===== */
      spacing: {
        // Mantener los valores por defecto de Tailwind y añadir los nuestros
        18: "var(--space-18, 4.5rem)",
        72: "var(--space-72, 18rem)",
        84: "var(--space-84, 21rem)",
        96: "var(--space-96, 24rem)",
        container: "var(--space-container, 1rem)",
      },

      /* ===== TIPOGRAFÍA ===== */
      fontSize: {
        // Extender con nuestra escala tipográfica
        xs: [
          "var(--font-size-xs)",
          { lineHeight: "var(--line-height-normal)" },
        ],
        sm: [
          "var(--font-size-sm)",
          { lineHeight: "var(--line-height-normal)" },
        ],
        base: [
          "var(--font-size-base)",
          { lineHeight: "var(--line-height-normal)" },
        ],
        lg: [
          "var(--font-size-lg)",
          { lineHeight: "var(--line-height-normal)" },
        ],
        xl: ["var(--font-size-xl)", { lineHeight: "var(--line-height-tight)" }],
        "2xl": [
          "var(--font-size-2xl)",
          { lineHeight: "var(--line-height-tight)" },
        ],
        "3xl": [
          "var(--font-size-3xl)",
          { lineHeight: "var(--line-height-tight)" },
        ],
        "4xl": [
          "var(--font-size-4xl)",
          { lineHeight: "var(--line-height-tight)" },
        ],
        "5xl": [
          "var(--font-size-5xl)",
          { lineHeight: "var(--line-height-none)" },
        ],
        "6xl": [
          "var(--font-size-6xl)",
          { lineHeight: "var(--line-height-none)" },
        ],
        "7xl": [
          "var(--font-size-7xl)",
          { lineHeight: "var(--line-height-none)" },
        ],
        "8xl": [
          "var(--font-size-8xl)",
          { lineHeight: "var(--line-height-none)" },
        ],
        "9xl": [
          "var(--font-size-9xl)",
          { lineHeight: "var(--line-height-none)" },
        ],
      },

      fontWeight: {
        thin: "var(--font-weight-thin)",
        light: "var(--font-weight-light)",
        normal: "var(--font-weight-normal)",
        medium: "var(--font-weight-medium)",
        semibold: "var(--font-weight-semibold)",
        bold: "var(--font-weight-bold)",
        black: "var(--font-weight-black)",
      },

      lineHeight: {
        none: "var(--line-height-none)",
        tight: "var(--line-height-tight)",
        snug: "var(--line-height-snug)",
        normal: "var(--line-height-normal)",
        relaxed: "var(--line-height-relaxed)",
        loose: "var(--line-height-loose)",
      },

      /* ===== RADIOS DE BORDE ===== */
      borderRadius: {
        none: "var(--radius-none)",
        sm: "var(--radius-sm)",
        DEFAULT: "var(--radius-base)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        "3xl": "var(--radius-3xl)",
        full: "var(--radius-full)",
      },

      /* ===== SOMBRAS ===== */
      boxShadow: {
        sm: "var(--shadow-sm)",
        DEFAULT: "var(--shadow-base)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        "2xl": "var(--shadow-2xl)",
        inner: "var(--shadow-inner)",
        none: "var(--shadow-none)",
      },

      /* ===== TRANSICIONES ===== */
      transitionDuration: {
        fast: "var(--transition-fast)",
        DEFAULT: "var(--transition-base)",
        slow: "var(--transition-slow)",
        slower: "var(--transition-slower)",
      },

      transitionTimingFunction: {
        linear: "var(--ease-linear)",
        in: "var(--ease-in)",
        out: "var(--ease-out)",
        "in-out": "var(--ease-in-out)",
      },

      /* ===== Z-INDEX ===== */
      zIndex: {
        hide: "var(--z-index-hide)",
        auto: "var(--z-index-auto)",
        base: "var(--z-index-base)",
        docked: "var(--z-index-docked)",
        dropdown: "var(--z-index-dropdown)",
        sticky: "var(--z-index-sticky)",
        banner: "var(--z-index-banner)",
        overlay: "var(--z-index-overlay)",
        modal: "var(--z-index-modal)",
        popover: "var(--z-index-popover)",
        "skip-link": "var(--z-index-skip-link)",
        toast: "var(--z-index-toast)",
        tooltip: "var(--z-index-tooltip)",
      },

      /* ===== DIMENSIONES ===== */
      maxWidth: {
        xs: "var(--width-xs)",
        sm: "var(--width-sm)",
        md: "var(--width-md)",
        lg: "var(--width-lg)",
        xl: "var(--width-xl)",
        "2xl": "var(--width-2xl)",
        "3xl": "var(--width-3xl)",
        "4xl": "var(--width-4xl)",
        "5xl": "var(--width-5xl)",
        "6xl": "var(--width-6xl)",
        "7xl": "var(--width-7xl)",
      },

      height: {
        header: "var(--height-header)",
        hero: "var(--height-hero)",
      },

      /* ===== ANIMACIONES ===== */
      animation: {
        fadeIn: "fadeIn var(--transition-base) var(--ease-out)",
        slideIn: "slideIn var(--transition-base) var(--ease-out)",
        pulse: "pulse 2s var(--ease-in-out) infinite",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(1rem)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-1rem)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },

      /* ===== GRADIENTES ===== */
      backgroundImage: {
        "gradient-primary":
          "linear-gradient(135deg, rgb(var(--color-primary)) 0%, rgb(var(--color-secondary)) 100%)",
        "gradient-accent":
          "linear-gradient(135deg, rgb(var(--color-accent)) 0%, rgb(var(--color-highlight)) 100%)",
        "gradient-hero":
          "linear-gradient(to bottom right, rgba(var(--color-accent), 0.9) 0%, rgba(253, 235, 211, 0.95) 50%, rgba(var(--color-neutral), 0.9) 100%)",
      },
    },

    /* ===== BREAKPOINTS PERSONALIZADOS ===== */
    screens: {
      xs: "475px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      /* Breakpoints específicos para el proyecto */
      tablet: "768px",
      laptop: "1024px",
      desktop: "1280px",
      wide: "1536px",
    },
  },

  /* ===== PLUGINS Y UTILIDADES ADICIONALES ===== */
  corePlugins: {
    // Habilitar todas las utilidades core de Tailwind
    preflight: true,
  },

  /* ===== CONTENIDO A PROCESAR ===== */
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "./public/**/*.html",
  ],

  /* ===== CONFIGURACIÓN DE PURGE/JIT ===== */
  // Tailwind CSS 4 usa JIT por defecto, esta configuración asegura
  // que solo se incluyan las clases que realmente se usan
  safelist: [
    // Clases que deben incluirse siempre (ej: generadas dinámicamente)
    "animate-fadeIn",
    "animate-slideIn",
    "animate-pulse",
    "gradient-primary",
    "gradient-accent",
    "gradient-hero",
  ],

  /* ===== CONFIGURACIÓN PARA DESARROLLO ===== */
  // Configuración específica para el entorno de desarrollo
  ...(process.env.NODE_ENV === "development" &&
    {
      // Configuraciones adicionales para desarrollo si es necesario
    }),
};
