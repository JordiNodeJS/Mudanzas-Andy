/**
 * Configuración de tema actualizada - Mudanzas ANDY
 *
 * NOTA: Este archivo ha sido reemplazado por el nuevo sistema de theming.
 *
 * Nuevos archivos del sistema:
 * - src/styles/theme.css      (Design tokens centralizados)
 * - src/styles/components.css (Componentes reutilizables)
 * - tailwind.config.js       (Integración con Tailwind)
 * - docs/THEMING.md          (Documentación completa)
 *
 * Migración completada:
 * ✅ Colores convertidos a formato RGB para opacidades
 * ✅ Variables CSS como fuente de verdad
 * ✅ Integración con Tailwind mediante withOpacity helper
 * ✅ Componentes CSS con @apply para reutilización
 * ✅ Breakpoints responsive integrados
 * ✅ Accesibilidad y preferencias de usuario
 *
 * Para usar el nuevo sistema:
 * - En CSS: rgba(var(--color-primary), 0.8)
 * - En HTML: class="bg-primary/80 text-secondary"
 * - Componentes: class="btn btn-primary"
 *
 * Consulta docs/THEMING.md para la guía completa.
 */

// @theme {
//   /* ===== SISTEMA DE THEMING ACTUALIZADO ===== */
//   /* Colores principales del brand Mudanzas ANDY */
//   /* Ahora definidos en src/styles/theme.css en formato RGB */
//
//   /* Antes (comentado - ya no se usa): */
//   /* --color-primary: #264e70; */
//   /* --color-secondary: #679186; */
//   /* --color-accent: #f9b4ab; */
//   /* --color-highlight: #FAE360; */
//   /* --color-neutral: #bbd4ce; */
//
//   /* Ahora en theme.css (formato RGB para opacidades): */
//   /* --color-primary: 38 78 112;    /* #264e70 - Azul corporativo */
//   /* --color-secondary: 103 145 134; /* #679186 - Verde complementario */
//   /* --color-accent: 249 180 171;   /* #f9b4ab - Rosa coral para CTA */
//   /* --color-highlight: 250 227 96; /* #FAE360 - Amarillo para destacados */
//   /* --color-neutral: 187 212 206;  /* #bbd4ce - Verde neutro suave */
//
//   /* Breakpoints responsive (ahora en tailwind.config.js) */
//   /* --breakpoint-sm: 576px; → sm: '640px' */
//   /* --breakpoint-md: 768px; → md: '768px' */
//   /* --breakpoint-lg: 992px; → lg: '1024px' */
//   /* --breakpoint-xl: 1200px; → xl: '1280px' */
//   /* --breakpoint-xxl: 1400px; → 2xl: '1536px' */
// }

export default {
  // Este archivo es mantenido por compatibilidad
  // El sistema real está en src/styles/theme.css y tailwind.config.js
  deprecated: true,
  newSystem: {
    theme: "src/styles/theme.css",
    components: "src/styles/components.css",
    config: "tailwind.config.js",
    documentation: "docs/THEMING.md",
  },
};
