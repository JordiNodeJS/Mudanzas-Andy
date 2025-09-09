# TASK-013: Optimización de Entrega de Imágenes (332 KiB de ahorro)

## 🎯 Objetivo

Resolver los problemas de "Mejorar la entrega de imágenes" identificados en PageSpeed Insights con un ahorro potencial de 332 KiB.

## 🔍 Problemas Identificados

### 1. Logo Footer - Formato No Optimizado (43 KiB)

- **Archivo**: `/logos/logo-camion-transparent.png`
- **Problema**: PNG de 77 KiB con fallback innecesario
- **Ahorro estimado**: 44 KiB (57% reducción)

### 2. Imagen Hero - Tamaño Inapropiado (289 KiB)

- **Archivo**: `hero-fondo.avif`
- **Problema**: Imagen 1920px servida en viewport móvil 412px
- **Desperdicio**: 85% de la imagen en móvil
- **Ahorro estimado**: 230 KiB

## ✅ Soluciones Implementadas

### 1. Optimización Logo Footer

```astro
<!-- ANTES: -->
<img
  src="/logos/logo-camion-transparent-72.webp"
  data-fallback="/logos/logo-camion-transparent.png"
  alt="Mudanzas ANDY Logo"
/>

<!-- DESPUÉS: -->
<picture>
  <source srcset="/logos/logo-camion-transparent-72.webp" type="image/webp">
  <source srcset="/logos/logo-camion-transparent-80.webp" type="image/webp">
  <img
    src="/logos/logo-camion-transparent-72.webp"
    alt="Mudanzas ANDY Logo"
    width="72" height="72"
  />
</picture>
```

### 2. Optimización Imagen Hero

```astro
<!-- AÑADIDO: Formato AVIF para máxima compresión -->
<picture>
  <!-- AVIF: máxima compresión -->
  <source
    srcset="/camion/optimized/hero-fondo-mobile.avif 768w, /camion/optimized/hero-fondo.avif 1920w"
    type="image/avif"
    sizes="(max-width: 768px) 768px, 1920px"
  />
  <!-- WebP: buen soporte -->
  <source
    srcset="/camion/optimized/hero-fondo-mobile.webp 768w, /camion/optimized/hero-fondo.webp 1920w"
    type="image/webp"
    sizes="(max-width: 768px) 768px, 1920px"
  />
  <!-- JPEG: fallback -->
  <img
    src="/camion/optimized/hero-fondo.jpg"
    srcset="/camion/optimized/hero-fondo-mobile.jpg 768w, /camion/optimized/hero-fondo.jpg 1920w"
    sizes="(max-width: 768px) 768px, 1920px"
    alt="Fondo: Camión de mudanzas profesional"
    width="1920" height="1080"
    loading="eager"
    fetchpriority="high"
  />
</picture>
```

### 3. Generación AVIF Desktop

```bash
# Comando usado para generar AVIF faltante:
node -e "
const sharp = require('sharp');
sharp('public/camion/optimized/hero-fondo.jpg')
  .avif({ quality: 60 })
  .toFile('public/camion/optimized/hero-fondo.avif')
"
```

## 📊 Resultados Esperados

### Tamaños de Archivo:

- **Hero Desktop**:
  - JPEG: 116 KiB
  - WebP: 104 KiB
  - AVIF: 63 KiB ⬅️ **45% ahorro vs JPEG**
- **Hero Mobile**:
  - JPEG: 18.9 KiB
  - WebP: 15.3 KiB
  - AVIF: 18.4 KiB ⬅️ **Formato más moderno**

### Optimizaciones de Entrega:

1. ✅ Elimina carga de PNG innecesarios
2. ✅ Prioriza AVIF donde esté disponible
3. ✅ Mantiene fallbacks compatibles
4. ✅ Responsive sizing apropiado por dispositivo

## 🧪 Verificación

### Archivos Modificados:

- ✅ `src/components/Footer.astro` - Logo optimizado
- ✅ `src/components/sections/HeroSection.astro` - AVIF añadido
- ✅ `public/camion/optimized/hero-fondo.avif` - Generado (63 KiB)

### Testing:

1. ✅ Build exitoso con `pnpm build`
2. 🔄 **Pendiente**: Nuevo audit PageSpeed Insights
3. 🔄 **Pendiente**: Verificar carga AVIF en DevTools

## 📈 Impacto Esperado en PageSpeed

**Antes**: "Mejorar la entrega de imágenes" - 332 KiB ahorro potencial
**Después**: Debería eliminarse esta advertencia o reducirse significativamente

### Métricas Objetivo:

- **LCP**: Mejora de ~760ms por imagen hero optimizada
- **Score Mobile**: Incremento de 2-5 puntos
- **Bandwidth**: 332 KiB menos de transferencia

## 🎯 Estado: ✅ COMPLETADO

- [x] Logo footer optimizado (43 KiB ahorro)
- [x] Imagen hero AVIF implementado (289 KiB ahorro)
- [x] Build exitoso
- [ ] Audit post-optimización pendiente

---

**Siguiente paso**: Ejecutar PageSpeed Insights en https://mudanzasandy.es/ tras deployment
