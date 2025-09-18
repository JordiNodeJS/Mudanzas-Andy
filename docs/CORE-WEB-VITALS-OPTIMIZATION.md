# 🚀 Core Web Vitals Optimization Guide

Este documento explica las optimizaciones implementadas en TASK-029 para mejorar significativamente el rendimiento móvil del sitio web de Mudanzas ANDY.

## 📊 Análisis Inicial

Basándose en la auditoría de PageSpeed Insights, se identificaron las siguientes oportunidades críticas:

### Problemas Detectados

- **LCP elevado**: Imagen hero sin optimización para móvil
- **JavaScript no utilizado**: Scripts que bloquean el renderizado
- **Resource hints faltantes**: Conexiones lentas a recursos externos
- **CSS no crítico**: Estilos que retrasan el above-the-fold
- **Formatos de imagen subóptimos**: Falta de AVIF/WebP

### Objetivos de Rendimiento

- 🎯 **LCP < 2.5s** en móvil
- 🎯 **FID < 100ms**
- 🎯 **CLS < 0.1**
- 🎯 **Score PageSpeed > 90**

## 🛠️ Optimizaciones Implementadas

### 1. Critical Resource Hints

**Archivo**: `src/layouts/Layout.astro`

```html
<!-- DNS prefetch para recursos externos -->
<link rel="dns-prefetch" href="//fonts.googleapis.com" />
<link rel="dns-prefetch" href="//fonts.gstatic.com" />
<link rel="dns-prefetch" href="//www.googletagmanager.com" />

<!-- Preconnect para recursos críticos -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<!-- Preload hero images con fetchpriority="high" -->
<link
  rel="preload"
  as="image"
  href="/camion/optimized/hero-fondo-mobile.avif"
  type="image/avif"
  media="(max-width: 768px)"
  fetchpriority="high"
/>
```

### 2. Critical CSS

**Archivo**: `public/styles/critical.css`

- CSS crítico inline para above-the-fold
- Utilidades esenciales de Tailwind
- Variables del sistema de colores
- Responsive breakpoints móvil-first
- Prevención de layout shifts

### 3. Componente OptimizedHeroImage

**Archivo**: `src/components/OptimizedHeroImage.astro`

```astro
<OptimizedHeroImage
  src="hero-fondo"
  alt="Camión de mudanzas profesional"
  priority={true}
  sizes="(max-width: 768px) 100vw, 80vw"
/>
```

**Características:**

- Formatos AVIF, WebP y JPEG optimizados
- Responsive con media queries
- Aspect-ratio para prevenir CLS
- fetchpriority="high" para LCP
- Intersection Observer para lazy loading

### 4. JavaScript Optimizado

**Archivo**: `public/js/move-reserva.js`

- Carga diferida con `defer`
- Verificación de DOM ready
- Event listeners con `passive: true`
- Intersection Observer en lugar de scroll events

## 📈 Scripts de Monitoreo

### Comandos Disponibles

```bash
# Optimizar imágenes para Core Web Vitals
pnpm run perf:optimize-images

# Monitorear rendimiento actual
pnpm run perf:monitor

# Audit completo (build + preview + test)
pnpm run perf:audit

# Lighthouse específico para móvil
pnpm run perf:lighthouse-mobile

# Lighthouse específico para desktop
pnpm run perf:lighthouse-desktop
```

### Script de Optimización de Imágenes

**Archivo**: `scripts/optimize-core-web-vitals-images.js`

Genera automáticamente:

- **AVIF**: Máxima compresión (50-60% quality)
- **WebP**: Buena compresión (75-80% quality)
- **JPEG**: Fallback optimizado (85-90% quality)
- **Responsive**: Versiones móvil (768px) y desktop (1920px)

### Script de Monitoreo

**Archivo**: `scripts/monitor-core-web-vitals.js`

Audita múltiples URLs con:

- Lighthouse CI automatizado
- Análisis de Core Web Vitals
- Recomendaciones específicas
- Reportes JSON y Markdown
- Thresholds configurables

## 🏗️ Configuración CI/CD

### Lighthouse Config

**Archivo**: `lighthouse.config.json`

```json
{
  "assert": {
    "assertions": {
      "categories:performance": ["warn", { "minScore": 0.85 }],
      "audits:largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
      "audits:cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }]
    }
  }
}
```

### GitHub Actions (Recomendado)

```yaml
name: Performance Audit
on: [push, pull_request]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "18"
      - name: Install dependencies
        run: pnpm install
      - name: Build site
        run: pnpm build
      - name: Run Lighthouse CI
        run: pnpm dlx @lhci/cli@latest autorun
```

## 📱 Optimizaciones Específicas Móvil

### 1. Image Loading Strategy

```html
<!-- Mobile-first approach -->
<source
  media="(max-width: 768px)"
  srcset="image-mobile.avif"
  type="image/avif"
/>
<source
  media="(max-width: 768px)"
  srcset="image-mobile.webp"
  type="image/webp"
/>
<source
  media="(min-width: 769px)"
  srcset="image-desktop.avif"
  type="image/avif"
/>
```

### 2. Critical CSS Móvil

- Utilidades above-the-fold únicamente
- Breakpoints mobile-first
- Font-display: swap para fuentes
- Aspect-ratio para prevenir CLS

### 3. JavaScript Diferido

```html
<!-- Non-critical JS -->
<script src="/js/features.js" defer></script>

<!-- Critical JS inline -->
<script>
  // Critical initialization code only
</script>
```

## 🔍 Validación y Testing

### Checklist Pre-Deploy

- [ ] `pnpm run check` - Sin errores TypeScript
- [ ] `pnpm run build` - Build exitoso
- [ ] `pnpm run perf:audit` - Score >85
- [ ] Validar métricas Core Web Vitals
- [ ] Test cross-device en Chrome DevTools

### Métricas Target

- **LCP**: < 2.5s (móvil), < 2.0s (desktop)
- **FID**: < 100ms
- **CLS**: < 0.1
- **Performance Score**: > 90 (móvil), > 95 (desktop)
- **TTI**: < 3.8s
- **Speed Index**: < 3.4s

## 📚 Referencias y Recursos

### Documentación Oficial

- [Web Vitals](https://web.dev/vitals/) - Google Web Vitals Guide
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Auditing Tool
- [Astro Performance](https://docs.astro.build/en/guides/performance/) - Framework Optimizations

### Herramientas de Testing

- [PageSpeed Insights](https://pagespeed.web.dev/) - Real-world metrics
- [WebPageTest](https://webpagetest.org/) - Advanced testing
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/) - Local development

### Monitoring Continuo

- [Google Analytics 4](https://developers.google.com/analytics/devguides/collection/ga4) - Web Vitals tracking
- [Search Console](https://search.google.com/search-console) - Core Web Vitals report
- [Real User Monitoring](https://web.dev/user-centric-performance-metrics/) - Production metrics

## 🚨 Troubleshooting

### Problemas Comunes

#### LCP Alto

```bash
# Verificar preload de imágenes
curl -I https://tu-sitio.com/imagen-hero.avif

# Generar imágenes optimizadas
pnpm run perf:optimize-images
```

#### CLS Elevado

- Verificar dimensions en todas las imágenes
- Añadir aspect-ratio CSS
- Reservar espacio para contenido dinámico

#### JavaScript Bloqueante

```javascript
// ❌ Bloquea renderizado
<script src="heavy-library.js"></script>

// ✅ Carga diferida
<script src="heavy-library.js" defer></script>
```

### Performance Budget

```json
{
  "budget": {
    "resourceCounts": [{ "resourceType": "image", "budget": 10 }],
    "resourceSizes": [{ "resourceType": "total", "budget": 500 }]
  }
}
```

---

**Contacto**: Jorge Orcajo - jordi.nodejs@gmail.com  
**Última actualización**: 18 Sept 2025  
**Versión**: 1.0.0
