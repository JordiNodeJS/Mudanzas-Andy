# 🛠️ Guía de Desarrollo y Mejores Prácticas - Mudanzas ANDY

## 🎯 Principios de Desarrollo

### 1. **Performance First**

- Optimizar para Core Web Vitals desde el primer momento
- Priorizar SSG sobre SSR cuando sea posible
- Usar lazy loading para todo contenido no crítico

### 2. **Mobile First Design**

- Diseñar primero para móvil, luego escalar a desktop
- Imágenes responsive obligatorias para todo contenido visual
- Testing en dispositivos reales

### 3. **Accesibilidad Nativa**

- Alt text descriptivo en todas las imágenes
- Estructura semántica HTML5
- Contraste mínimo AA en todos los elementos

---

## 📱💻 Sistema de Imágenes Responsive

### Flujo de Trabajo Recomendado

1. **Agregar Nueva Imagen al Blog**:

```bash
# 1. Agregar imagen a BLOG_IMAGES_SOURCES en optimize-responsive-images.js
# 2. Ejecutar script de optimización
node scripts/optimize-responsive-images.js

# 3. Verificar generación de variaciones
ls src/assets/images/blog/*-{desktop,tablet,mobile}.webp

# 4. Actualizar mapeo en template
# Editar getResponsiveImageName() en src/pages/blog/[slug].astro
```

2. **Usar Componente Responsive**:

```astro
---
import ResponsiveHeroImage from "../../layouts/shortcodes/ResponsiveHeroImage.astro";
---

<ResponsiveHeroImage
  imageName="nueva-imagen-hero"
  alt="Descripción accesible detallada"
  loading="lazy"
  class="rounded-lg shadow-xl"
/>
```

### Reglas de Naming

```text
# Estructura obligatoria para imágenes responsive
nombre-base-hero.webp          ❌ NO usar directamente
nombre-base-hero-desktop.webp  ✅ 1200x800px, 85% calidad
nombre-base-hero-tablet.webp   ✅ 768x512px, 82% calidad
nombre-base-hero-mobile.webp   ✅ 480x320px, 78% calidad
```

---

## 🎨 Sistema de Colores

### Reglas Obligatorias

❌ **NUNCA hacer**:

```css
/* Colores hardcodeados */
.button { background: #264e70; }
.card { background: blue; }

/* Props de color en componentes */
<Button color="primary" />
```

✅ **SIEMPRE hacer**:

```css
/* Variables CSS del sistema */
.button {
  background: rgb(var(--color-primary));
}
.card {
  background: rgba(var(--color-secondary), 0.1);
}

/* Clases del sistema */
.contact-card {
  @apply bg-gradient-to-br from-primary/10 to-secondary/5;
}
```

### Paleta Corporativa

```css
/* src/styles/theme.css - FUENTE DE VERDAD */
:root {
  --color-primary: 38 78 112; /* #264e70 - Azul corporativo */
  --color-secondary: 103 145 134; /* #679186 - Verde complementario */
  --color-accent: 249 180 171; /* #f9b4ab - Rosa coral CTA */
  --color-highlight: 250 227 96; /* #fae360 - Amarillo destacados */
  --color-neutral: 187 212 206; /* #bbd4ce - Verde neutro */
}
```

### Implementación en Componentes

```astro
---
// Mapeo automático de gradientes
const gradientClassMap = {
  primary: 'bg-gradient-to-br from-primary/20 to-primary/5',
  secondary: 'bg-gradient-to-br from-secondary/20 to-secondary/5',
  accent: 'bg-gradient-to-br from-accent/20 to-accent/5'
};
---

<div class={gradientClassMap.primary}>
  <!-- Contenido con gradiente automático -->
</div>
```

---

## ⚛️ React Islands Architecture

### Cuándo Usar React vs Astro

**✅ Usar React para**:

- Formularios interactivos (ContactForm)
- Componentes con estado (toggles, contadores)
- Interacciones complejas (drag & drop, modales)

**✅ Usar Astro para**:

- Contenido estático (headers, footers)
- Layouts y estructuras
- Listados y grids sin interacción

### Directivas de Hidratación

```astro
<!-- Crítico: hidratar inmediatamente -->
<ContactForm client:load />

<!-- Diferido: hidratar cuando esté disponible -->
<ToggleButton client:idle />

<!-- Condicional: hidratar cuando sea visible -->
<ImageCarousel client:visible />

<!-- Responsivo: hidratar según media query -->
<MobileMenu client:media="(max-width: 768px)" />
```

### Performance de React Islands

```astro
---
// ❌ MAL: componente pesado con client:load
import HeavyChartComponent from './HeavyChart.jsx';
---
<HeavyChartComponent client:load /> <!-- Bloquea carga inicial -->

// ✅ BIEN: componente ligero con hidratación diferida
import SimpleChart from './SimpleChart.jsx';
---
<SimpleChart client:visible /> <!-- Carga cuando sea necesario -->
```

---

## 📝 Content Collections

### Estructura de Blog Posts

```markdown
---
title: "Título SEO Optimizado"
description: "Meta descripción atractiva de 150-160 caracteres"
pubDate: 2025-09-16
tags: ["mudanzas barcelona", "consejos", "ahorro"]
category: "consejos"
featured: true
heroImage: "../../assets/images/blog/imagen-hero.webp" # Solo fallback
heroImageAlt: "Descripción accesible detallada de la imagen"
metaTitle: "Título específico para SEO (60 caracteres max)"
metaDescription: "Meta descripción específica para motores de búsqueda"
author: "Nombre Completo - Especialización"
readingTime: 8
keywords: ["palabra clave 1", "palabra clave 2", "palabra clave 3"]
---

# Título del Artículo

Contenido en Markdown optimizado para SEO...
```

### Schema de Validación

```typescript
// src/content.config.ts
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).optional(),
    featured: z.boolean().default(false),
    heroImage: z.string().optional(), // Solo fallback
    heroImageAlt: z.string().optional(),
    // ... más campos
  }),
});
```

---

## 🚀 Performance y Build

### Optimización de Build

```bash
# Verificar performance de build
time pnpm build

# Analizar bundle size
pnpm build --verbose

# Verificar imágenes optimizadas
ls -la dist/_astro/*.webp | wc -l  # Debe ser > 16
```

### Métricas Objetivo

| Métrica        | Target | Actual        |
| -------------- | ------ | ------------- |
| **Build Time** | < 3s   | 2.4s ✅       |
| **LCP**        | < 2.5s | Optimizado ✅ |
| **CLS**        | < 0.1  | Estable ✅    |
| **FCP**        | < 1.8s | Optimizado ✅ |

### Optimizaciones Automáticas

```javascript
// astro.config.mjs - Configuración de performance
export default defineConfig({
  image: {
    // Formatos automáticos
    formats: ["webp", "avif"],
  },
  vite: {
    build: {
      // Code splitting automático
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom"],
          },
        },
      },
    },
  },
});
```

---

## 🧪 Testing y QA

### Testing Manual Obligatorio

1. **Responsive Testing**:

```bash
# Chrome DevTools
F12 → Toggle Device Toolbar → Test breakpoints:
- Mobile: 375px, 414px
- Tablet: 768px, 1024px
- Desktop: 1200px, 1920px
```

2. **Performance Testing**:

```bash
# PageSpeed Insights
https://pagespeed.web.dev/

# Lighthouse local
pnpm build && pnpm preview
# Luego Lighthouse en DevTools
```

3. **Accessibility Testing**:

```bash
# axe-core browser extension
# Verificar contraste, alt text, estructura HTML
```

### Testing de Imágenes Responsive

```javascript
// Script de verificación automática
async function testResponsiveImages() {
  const breakpoints = [
    { width: 375, expected: "mobile" },
    { width: 768, expected: "tablet" },
    { width: 1200, expected: "desktop" },
  ];

  for (const bp of breakpoints) {
    // Simular viewport
    // Verificar qué imagen se carga
    console.log(`${bp.width}px → ${bp.expected} image loaded`);
  }
}
```

---

## 🔧 Debugging y Troubleshooting

### Problemas Comunes

#### 1. **Build Falla con Error de Imagen**

```bash
# Error típico
Could not load image: imagen-desktop.webp

# Solución
ls src/assets/images/blog/imagen-{desktop,tablet,mobile}.webp
# Verificar que existen las 3 variaciones
```

#### 2. **Componente React No Se Hidrata**

```astro
<!-- ❌ Problema: sin directiva client -->
<InteractiveButton />

<!-- ✅ Solución: agregar directiva -->
<InteractiveButton client:load />
```

#### 3. **Colores No Aparecen**

```css
/* ❌ Problema: color hardcodeado no definido */
.button {
  background: #invalidcolor;
}

/* ✅ Solución: usar variable del sistema */
.button {
  background: rgb(var(--color-primary));
}
```

### Debug Commands

```bash
# Verificar TypeScript
pnpm check

# Verificar formato de código
pnpm format

# Limpiar cache y rebuild
rm -rf node_modules/.vite && pnpm build

# Verificar imágenes generadas
find dist/_astro -name "*.webp" | wc -l
```

---

## 📋 Checklist de Pre-Deploy

### ✅ Verificaciones Obligatorias

- [ ] **Build exitoso**: `pnpm build` sin errores
- [ ] **TypeScript**: `pnpm check` sin errores
- [ ] **Formato**: `pnpm format` ejecutado
- [ ] **Imágenes responsive**: Todas las variaciones generadas
- [ ] **Performance**: LCP < 2.5s, CLS < 0.1
- [ ] **Accesibilidad**: Alt text y contraste verificados
- [ ] **Mobile testing**: Verificado en DevTools y dispositivo real

### 📊 Métricas Finales

```bash
# Build stats
pnpm build
# ✅ 8 page(s) built in <3s
# ✅ generating optimized images: 16+ variations

# Performance verification
pnpm preview
# ✅ Test en PageSpeed Insights
# ✅ Lighthouse score >90
```

---

## 🚀 Deployment

### Hosting Recomendado

1. **Netlify** (Recomendado):

```toml
# netlify.toml
[build]
  command = "pnpm build"
  publish = "dist"

[[headers]]
  for = "*.webp"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

2. **Vercel**:

```json
// vercel.json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist"
}
```

### Post-Deployment

```bash
# Verificar imágenes responsive funcionan en producción
curl -I https://mudanzasandy.es/_astro/imagen-mobile.webp
# ✅ Status: 200 OK

# Verificar performance en producción
# PageSpeed Insights con URL de producción
```

---

## 📚 Recursos y Referencias

### Documentación Oficial

- [Astro 5 Docs](https://docs.astro.build)
- [Tailwind CSS 4](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://typescriptlang.org/docs)

### Performance

- [Core Web Vitals](https://web.dev/vitals/)
- [Image Optimization](https://web.dev/fast/#optimize-your-images)
- [Responsive Images](https://developer.mozilla.org/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)

### Tools

- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [axe Accessibility](https://www.axe-core.org/)

---

**Mantenido por**: Equipo de Desarrollo Mudanzas ANDY  
**Última actualización**: Septiembre 2025  
**Versión**: 1.0.0
