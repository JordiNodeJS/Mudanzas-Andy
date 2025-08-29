# Optimización de Imágenes - Mudanzas ANDY

## 📸 Optimizaciones Implementadas

### 1. **Lazy Loading Avanzado**

- ✅ **Intersection Observer** para carga bajo demanda
- ✅ **Placeholder con blur** durante la carga
- ✅ **Fallback** para navegadores antiguos
- ✅ **Loading states** visuales

### 2. **Imágenes Responsivas**

- ✅ **Múltiples breakpoints** con `srcset`
- ✅ **Sizes attribute** optimizado
- ✅ **Aspect ratios** para prevenir layout shift
- ✅ **Formatos modernos** preparados (WebP, AVIF)

### 3. **Imágenes de Fondo Optimizadas**

- ✅ **Filtros de contraste** para mejorar legibilidad
- ✅ **Overlays graduales** con CSS
- ✅ **Opacidad controlada** para no interferir con el texto
- ✅ **Background attachment** optimizado para móvil

## 🎯 Secciones con Imágenes

### **Hero Section**

- **Imagen de fondo**: `estacionado-lateral.jpg`
- **Filtro**: Gradient overlay con 70-80% de opacidad
- **Contraste**: Drop-shadow en texto para mejor legibilidad

### **Galería del Equipo**

- **Imágenes principales**:
  - `camion-frontal.jpg` - Camión profesional
  - `cargando-flete.jpg` - Proceso de carga
  - `interior-caja.jpg` - Espacio interior
- **Loading**: Lazy loading con placeholders
- **Hover effects**: Transformaciones CSS suaves

### **CTA con Fondo**

- **Imagen de fondo**: `camion-evening.jpg`
- **Filtro**: Overlay oscuro (80% opacidad)
- **Contraste**: Texto blanco sobre fondo oscuro

### **Sección de Precios**

- **Imagen de fondo**: `camion-trasera.jpg`
- **Filtro**: Overlay muy sutil (5% opacidad)
- **Contraste**: Fondo blanco semi-transparente

### **Testimonios**

- **Imagen de fondo**: `promocional-collage-2.jpg`
- **Filtro**: Gradient overlay azul (85-90% opacidad)
- **Contraste**: Texto blanco y tarjetas blancas

## 🔧 Componentes Creados

### **OptimizedImage.astro**

```astro
<OptimizedImage
  src="/camion/imagen.jpg"
  alt="Descripción"
  class="aspect-video"
  loading="lazy"
/>
```

### **LazyImage.astro**

```astro
<LazyImage
  src="/camion/imagen.jpg"
  alt="Descripción"
  class="aspect-video"
  loading="lazy"
/>
```

## 📱 Responsividad

### **Breakpoints Utilizados**

- `320px` - Móvil pequeño
- `640px` - Móvil grande (sm:)
- `768px` - Tablet (md:)
- `1024px` - Tablet landscape (lg:)
- `1280px` - Desktop (xl:)
- `1536px` - Desktop grande (2xl:)

### **Sizes Attribute**

```html
sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
```

## ⚡ Performance

### **Técnicas Implementadas**

1. **Critical CSS** para imágenes above-the-fold
2. **Loading="eager"** solo para hero section
3. **Loading="lazy"** para todas las demás imágenes
4. **Decoding="async"** para no bloquear el hilo principal
5. **Will-change** para animaciones suaves
6. **Container queries** preparado para el futuro

### **Optimizaciones CSS**

```css
/* Prevenir layout shift */
.aspect-video {
  aspect-ratio: 16 / 9;
}

/* Mejorar calidad de renderizado */
img[loading="lazy"] {
  image-rendering: crisp-edges;
  image-rendering: -webkit-optimize-contrast;
}

/* Optimizar attachment en móvil */
@media (max-width: 768px) {
  .bg-image-smooth {
    background-attachment: scroll;
  }
}
```

## 🎨 Filtros y Efectos

### **Overlays Utilizados**

```css
/* Hero Section */
bg-gradient-to-br from-[#f9b4ab]/70 via-[#fdebd3]/80 to-[#bbd4ce]/70

/* CTA Section */
bg-gradient-to-r from-[#679186]/80 to-[#264e70]/80

/* Testimonios */
bg-gradient-to-br from-[#264e70]/90 via-[#679186]/85 to-[#264e70]/90

/* Precios (sutil) */
bg-gradient-to-r from-white/90 via-white/95 to-white/90
```

### **Efectos de Hover**

```css
.group:hover img {
  transform: scale(1.05);
}

picture:hover img {
  transform: scale(1.05);
}
```

## 🚀 Próximas Mejoras

### **En Desarrollo**

- [ ] Generación automática de múltiples tamaños
- [ ] Conversión a WebP/AVIF durante build
- [ ] Service Worker para cacheo inteligente
- [ ] Critical resource hints
- [ ] Image CDN integration

### **Script de Optimización**

Disponible en `scripts/optimize-images.js` para generar automáticamente:

- Múltiples resoluciones (320w, 640w, 768w, 1024w, 1280w, 1536w)
- Múltiples formatos (AVIF, WebP, JPG)
- Elementos `<picture>` optimizados

## 📊 Métricas Esperadas

### **Performance Gains**

- **LCP mejorado** hasta 40% con lazy loading
- **CLS reducido** a 0 con aspect ratios
- **Bandwidth ahorrado** 30-50% con formatos modernos
- **Mobile performance** mejorado significativamente

### **SEO Benefits**

- **Alt texts** descriptivos y optimizados
- **Structured data** preparado para imágenes
- **Page speed** mejorado para ranking
- **User experience** optimizada

## 🛠️ Herramientas Recomendadas

### **Para Desarrollo**

- **Sharp** - Procesamiento de imágenes en Node.js
- **Lighthouse** - Auditoría de performance
- **WebPageTest** - Testing detallado
- **ImageOptim** - Compresión sin pérdida

### **Para Producción**

- **Cloudinary** - CDN de imágenes
- **Netlify Image CDN** - Optimización automática
- **Vercel Image Optimization** - Formatos on-demand
