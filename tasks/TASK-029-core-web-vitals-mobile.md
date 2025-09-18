# TASK-029: Optimización Avanzada Core Web Vitals Móvil 🚀📱

## 📋 Descripción

Optimización específica para dispositivos móviles basada en análisis PageSpeed Insights actualizado. Enfoque en Core Web Vitals críticos: LCP, FID, CLS para mejorar la experiencia móvil.

## 🎯 Objetivos Específicos

- [ ] **LCP < 2.5s**: Optimizar Largest Contentful Paint
- [ ] **FID < 100ms**: Reducir First Input Delay
- [ ] **CLS < 0.1**: Minimizar Cumulative Layout Shift
- [ ] **Score móvil > 90**: Objetivo PageSpeed Insights
- [ ] **TTI < 3.8s**: Time to Interactive mejorado

## 🔍 Problemas Identificados (PageSpeed Insights)

### 1. JavaScript No Utilizado ⚡

- **Impacto**: Alto - Bloquea renderizado crítico
- **Archivos**: Components React innecesarios, librerías no usadas
- **Solución**: Code splitting, lazy loading, tree shaking

### 2. Resource Hints Faltantes 🔗

- **Impacto**: Medio - Conectividad sub-óptima
- **Problema**: Sin preload/prefetch para recursos críticos
- **Solución**: Implementar strategy loading inteligente

### 3. LCP Elevado 🖼️

- **Impacto**: Crítico - Usuario percibe lentitud
- **Causa**: Imagen hero, fuentes, CSS crítico
- **Objetivo**: < 2.5s (actualmente > 4s estimado)

### 4. Layout Shifts 📐

- **Impacto**: Medio - Experiencia usuario
- **Causa**: Imágenes sin dimensiones, fuentes
- **Solución**: Aspect ratios, font-display

## 📋 Plan de Implementación

### Fase 1: Análisis y Medición 📊 ✅ COMPLETADO

- [x] Audit actual con Lighthouse CI
- [x] Identificar recursos críticos above-the-fold
- [x] Mapear JavaScript usado vs no usado
- [x] Documentar métricas baseline

**🎯 RESULTADOS LIGHTHOUSE MÓVIL (Septiembre 18, 2025):**

```
📊 Performance Score: 67% (objetivo: ≥90%) - NECESITA MEJORA
⚡ First Contentful Paint: 5.3s (objetivo: ≤1.8s) - MALO
🎨 Largest Contentful Paint: 5.3s (objetivo: ≤2.5s) - MALO
⏱️  Total Blocking Time: 70ms (objetivo: ≤200ms) - BUENO
📐 Cumulative Layout Shift: 0 (objetivo: ≤0.1) - EXCELENTE
🚀 Speed Index: 5.3s
⚡ Time to Interactive: 14.5s (objetivo: ≤3.8s) - MALO
```

**📈 PROGRESO IDENTIFICADO:**

- ✅ CLS optimizado a 0 (perfecto)
- ✅ TBT bajo control (70ms)
- ❌ LCP y FCP necesitan trabajo adicional
- ❌ TTI requiere optimización JavaScript

**📊 RESUMEN DESPUÉS DE OPTIMIZACIONES (Septiembre 18, 2025):**

**🎯 RESULTADOS FINALES LIGHTHOUSE MÓVIL:**

```
📊 Performance Score: 57% (objetivo: ≥90%) - CRÍTICO
⚡ First Contentful Paint: 6.9s (objetivo: ≤1.8s) - CRÍTICO
🎨 Largest Contentful Paint: 9.8s (objetivo: ≤2.5s) - CRÍTICO
⏱️  Total Blocking Time: 120ms (objetivo: ≤200ms) - BUENO
📐 Cumulative Layout Shift: 0 (objetivo: ≤0.1) - EXCELENTE
⚡ Time to Interactive: 14.7s - CRÍTICO
```

**🔍 ANÁLISIS DE PROBLEMA RAÍZ:**

- ✅ CLS optimizado a 0 (perfecto)
- ✅ TBT bajo control
- ✅ Imágenes AVIF generadas correctamente
- ❌ LCP/FCP críticos - Problema no resuelto con optimizaciones CSS
- ❌ El problema NO está en el CSS crítico (empeoró al optimizarlo)
- ❌ Posible problema: JavaScript blocking, server response, o resource loading strategy

**📋 PRÓXIMOS PASOS CRÍTICOS:**

1. **Analizar Network tab en DevTools** - Identificar bottlenecks reales
2. **Revisar JavaScript bundle splitting** - ClientRouter 14KB puede estar bloqueando
3. **Implementar Service Worker caching** - Para recursos repetidos
4. **Considerar preloading strategy más agresivo** - Critical resources first
5. **Evaluar server response times** - Localhost vs production differences

**⚠️ EVALUACIÓN:** Performance crítica - NO listo para producción. Se requiere debugging profundo del render path.

### Fase 2: Optimización Crítica ⚡

- [ ] **Critical CSS inline**: Solo above-the-fold
- [ ] **Resource hints**: preload, prefetch, preconnect
- [ ] **JavaScript splitting**: Separar código crítico vs diferido
- [ ] **Font optimization**: font-display swap, preload

### Fase 3: Optimización Avanzada 🚀

- [ ] **Service Worker**: Caché inteligente
- [ ] **WebP/AVIF**: Formatos next-gen adicionales
- [ ] **Lazy hydration**: React components bajo demanda
- [ ] **Bundle analysis**: Remover dependencias innecesarias

### Fase 4: Monitoreo Continuo 📈

- [ ] **CI/CD integration**: Lighthouse en pipeline
- [ ] **Real User Monitoring**: Métricas reales
- [ ] **Performance budgets**: Límites automáticos
- [ ] **Alertas**: Regresiones de performance

## 🛠️ Implementación Técnica

### 1. Critical Resource Optimization

```astro
---
// src/layouts/Base.astro - Critical path optimization
---
<head>
  <!-- Critical CSS inline -->
  <style>{criticalCSS}</style>

  <!-- Resource hints estratégicos -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="dns-prefetch" href="https://www.googletagmanager.com">

  <!-- Preload crítico -->
  <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/images/hero-mobile.avif" as="image" media="(max-width: 768px)">
</head>
```

### 2. JavaScript Code Splitting

```javascript
// src/components/LazyComponents.js
// Dynamic imports para componentes pesados
const HeavyComponent = lazy(() => import("./HeavyComponent"));
const GalleryModal = lazy(() => import("./GalleryModal"));

// Intersection Observer para carga bajo demanda
const lazyLoadComponent = (component, rootMargin = "50px") => {
  return <LazyLoad rootMargin={rootMargin}>{component}</LazyLoad>;
};
```

### 3. Service Worker Cache Strategy

```javascript
// public/sw.js
// Cache strategy para assets críticos
const CACHE_NAME = "mudanzas-v2";
const CRITICAL_ASSETS = [
  "/",
  "/manifest.json",
  "/images/logo-mudanzas-andy.svg",
];

// Stale-while-revalidate para páginas
// Cache-first para assets estáticos
```

## 📊 Métricas y KPIs

### Objetivos Numéricos

- **LCP**: < 2.5s (mobile)
- **FID**: < 100ms
- **CLS**: < 0.1
- **TTI**: < 3.8s
- **Speed Index**: < 3.4s
- **PageSpeed Score**: > 90

### Monitoreo Continuo

- Lighthouse CI en cada deploy
- Web Vitals tracking con GA4
- Performance budgets en bundler
- Alertas automáticas en Slack/email

## 🔧 Herramientas de Desarrollo

### Scripts de Automatización

```bash
# Performance audit
pnpm run perf:audit

# Bundle analysis
pnpm run analyze:bundle

# Core Web Vitals monitoring
pnpm run monitor:vitals

# Critical CSS generation
pnpm run generate:critical-css
```

### Configuración CI/CD

```yaml
# .github/workflows/performance.yml
- name: Lighthouse CI
  uses: treosh/lighthouse-ci-action@v10
  with:
    uploadDir: "./dist"
    configPath: "./lighthouse.config.js"
```

## 📝 Checklist de Validación

### Pre-deploy

- [ ] Lighthouse audit score > 90
- [ ] Bundle size analysis OK
- [ ] Critical CSS < 14KB
- [ ] No console errors
- [ ] All images optimized

### Post-deploy

- [ ] Real User Metrics tracking
- [ ] PageSpeed Insights verification
- [ ] Cross-device testing
- [ ] Performance regression check

## 🚀 Roadmap de Implementación

### Sprint 1 (Días 1-3): Setup y Análisis

- Configurar herramientas de medición
- Análisis baseline completo
- Identificar quick wins

### Sprint 2 (Días 4-7): Optimización Crítica

- Critical CSS implementation
- Resource hints strategy
- JavaScript code splitting

### Sprint 3 (Días 8-10): Optimización Avanzada

- Service Worker implementation
- Advanced image optimization
- Performance monitoring setup

### Sprint 4 (Días 11-12): Testing y Deploy

- Comprehensive testing
- Performance validation
- Documentation update

## 📚 Referencias Técnicas

- [Web Vitals Guide](https://web.dev/vitals/)
- [Astro Performance](https://docs.astro.build/en/guides/performance/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Critical Resource Hints](https://web.dev/preload-critical-assets/)

---

**Prioridad**: 🔥 CRÍTICA  
**Estimación**: 12-15 horas  
**Dependencias**: Ninguna  
**Asignado**: Desarrollo Core  
**Fecha inicio**: 18 Sept 2025  
**Fecha objetivo**: 30 Sept 2025
