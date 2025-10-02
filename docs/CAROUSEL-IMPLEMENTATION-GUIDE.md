# Guía de Implementación del Carrusel de Galería

## 📋 Resumen de Implementación

Se ha implementado exitosamente un carrusel de imágenes para mostrar las nuevas imágenes de proyectos de mudanzas, manteniendo la galería existente intacta.

## 🎯 Objetivos Completados

- ✅ Optimización de 16 imágenes nuevas con sufijo "carrusel"
- ✅ Generación de versiones responsive (mobile, tablet, desktop)
- ✅ Creación de componente `ImageCarousel.astro`
- ✅ Integración del carrusel en la página principal
- ✅ Lazy loading implementado en ambas galerías
- ✅ Imágenes optimizadas agregadas al repositorio

## 📁 Archivos Creados/Modificados

### Nuevos Archivos

1. **`scripts/optimize-carousel-images.js`**
   - Script de optimización para las imágenes del carrusel
   - Genera 6 tamaños: 320w, 640w, 768w, 1024w, 1280w, 1920w
   - Genera 3 formatos: WebP, AVIF, JPG
   - Total: 288 archivos optimizados (16 × 6 × 3)

2. **`src/components/sections/ImageCarousel.astro`**
   - Componente de carrusel responsivo
   - Autoplay configurable (5 segundos por defecto)
   - Navegación por flechas y puntos indicadores
   - Soporte para teclado (←/→)
   - Soporte para gestos táctiles (swipe)
   - Lazy loading: primera imagen eager, resto lazy

3. **`public/gallery/optimized/carrusel-*.{webp,avif,jpg}`**
   - 288 imágenes optimizadas en múltiples formatos y tamaños

4. **`public/gallery/optimized/carousel-images.json`**
   - Metadata de las imágenes del carrusel

### Archivos Modificados

1. **`src/pages/index.astro`**
   - Importado `ImageCarousel` component
   - Carrusel añadido arriba de la galería existente
   - Orden: TeamSection → ImageCarousel → ImageGallery → PricingSection

## 🎨 Características del Carrusel

### Funcionalidades

- **Autoplay**: Transición automática cada 5 segundos
- **Navegación**: Botones anterior/siguiente
- **Indicadores**: Puntos clicables para navegación directa
- **Contador**: Muestra "X de Y" imágenes
- **Responsive**: Adaptado para mobile, tablet y desktop
- **Accesibilidad**: Navegación por teclado, labels ARIA
- **Touch**: Soporte para gestos de swipe en móviles

### Optimización de Imágenes

#### Tamaños Generados

| Tamaño | Uso |
|--------|-----|
| 320w   | Mobile small |
| 640w   | Mobile large |
| 768w   | Tablet |
| 1024w  | Desktop |
| 1280w  | Desktop large |
| 1920w  | Desktop XL |

#### Formatos

1. **AVIF**: Formato moderno con mejor compresión
2. **WebP**: Amplio soporte y buena compresión
3. **JPG**: Fallback para navegadores antiguos

### Lazy Loading

#### ImageCarousel
```astro
loading={index === 0 ? "eager" : "lazy"}
```
- Primera imagen: carga inmediata (`eager`)
- Resto de imágenes: lazy loading para mejor rendimiento

#### ImageGallery
```astro
loading="lazy"
```
- Todas las imágenes con lazy loading

## 🚀 Cómo Usar

### Ejecutar Script de Optimización

```bash
node scripts/optimize-carousel-images.js
```

### Usar el Componente

```astro
<ImageCarousel
  title="Nuestros Proyectos Destacados"
  description="Explora nuestros trabajos más recientes"
  autoplay={true}
  autoplayInterval={5000}
/>
```

### Props Disponibles

```typescript
interface Props {
  title?: string;              // Título del carrusel
  description?: string;         // Descripción
  images?: Array<{             // Array de imágenes personalizado
    baseName: string;
    alt: string;
    caption?: string;
  }>;
  autoplay?: boolean;          // Activar autoplay (default: true)
  autoplayInterval?: number;   // Intervalo en ms (default: 5000)
}
```

## 📊 Estructura de la Página

```
index.astro
├── Header
├── Main
│   ├── HeroSection
│   ├── ServicesSection
│   ├── TeamSection
│   ├── ImageCarousel        ← NUEVO (imágenes carrusel)
│   ├── ImageGallery         ← EXISTENTE (imágenes antiguas)
│   ├── PricingSection
│   └── TestimonialsSection
├── Footer
├── ContactForm
└── SmartPopup
```

## 🔧 Personalización

### Cambiar Intervalo de Autoplay

```astro
<ImageCarousel autoplayInterval={3000} /> <!-- 3 segundos -->
```

### Desactivar Autoplay

```astro
<ImageCarousel autoplay={false} />
```

### Imágenes Personalizadas

```astro
<ImageCarousel
  images={[
    { 
      baseName: "/gallery/optimized/custom-01", 
      alt: "Imagen personalizada", 
      caption: "Mi proyecto especial" 
    }
  ]}
/>
```

## 🎯 Mejores Prácticas

1. **Imágenes de origen**: Colocar en `public/Galería de Proyectos/`
2. **Nomenclatura**: Usar formato `XX-gallery.jpg` (ej: `01-gallery.jpg`)
3. **Optimización**: Ejecutar script antes del build
4. **Alt text**: Incluir descripciones significativas
5. **Captions**: Añadir leyendas descriptivas cuando sea relevante

## 📝 Notas Técnicas

### Aspect Ratio
- Desktop: 3:2
- Mobile: 4:3

### Transiciones
- Duración: 0.6s
- Easing: ease-in-out
- Caption delay: 0.3s

### Navegación por Teclado
- `←` : Imagen anterior
- `→` : Siguiente imagen
- `Esc` : (Reservado para futuro lightbox)

### Compatibilidad
- Chrome/Edge: AVIF + WebP
- Firefox: AVIF + WebP
- Safari: WebP
- Navegadores antiguos: JPG fallback

## 🐛 Solución de Problemas

### Las imágenes no se muestran
1. Verificar que los archivos existen en `public/gallery/optimized/`
2. Revisar nombres de archivo (deben seguir patrón `carrusel-XX-YYYw.format`)
3. Ejecutar `pnpm build` para regenerar

### Autoplay no funciona
1. Verificar prop `autoplay={true}`
2. Comprobar que hay más de 1 imagen
3. Revisar consola del navegador para errores JS

### Problemas de rendimiento
1. Verificar lazy loading está activo
2. Reducir `autoplayInterval` si es necesario
3. Considerar reducir número de imágenes

## 🔄 Mantenimiento

### Añadir Nuevas Imágenes

1. Añadir imagen a `public/Galería de Proyectos/`
2. Ejecutar `node scripts/optimize-carousel-images.js`
3. Build del proyecto: `pnpm build`
4. Commit de las nuevas imágenes optimizadas

### Actualizar Imágenes Existentes

1. Reemplazar archivo en `public/Galería de Proyectos/`
2. Re-ejecutar script de optimización
3. Rebuild del proyecto

## 📊 Métricas

- **Imágenes procesadas**: 16
- **Archivos generados**: 288
- **Formatos**: 3 (AVIF, WebP, JPG)
- **Tamaños**: 6 (320w, 640w, 768w, 1024w, 1280w, 1920w)
- **Lazy loading**: ✅ Implementado
- **Responsive**: ✅ Mobile, Tablet, Desktop
- **Accesibilidad**: ✅ ARIA labels, navegación por teclado

## ✅ Checklist de Implementación

- [x] Script de optimización creado
- [x] Imágenes optimizadas generadas
- [x] Componente ImageCarousel creado
- [x] Integración en página principal
- [x] Lazy loading verificado
- [x] Build exitoso sin errores
- [x] Imágenes agregadas al repositorio
- [x] Documentación completa

---

**Fecha de implementación**: 2 de octubre de 2025  
**Versión de Astro**: 5.13.2  
**Estado**: ✅ Completado

