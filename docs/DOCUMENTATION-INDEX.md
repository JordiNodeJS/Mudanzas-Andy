# 📚 Índice de Documentación - Mudanzas ANDY

## 🎯 Documentación Principal

### 📖 **[README.md](../README.md)**

Documentación principal del proyecto con arquitectura, comandos y guías de desarrollo.

---

## 🔧 Guías Técnicas Detalladas

### 📱💻 **[RESPONSIVE-IMAGES-GUIDE.md](./RESPONSIVE-IMAGES-GUIDE.md)**

**Descripción**: Guía completa del sistema de imágenes responsive implementado en Astro 5  
**Contenido**:

- Arquitectura del sistema responsive
- Componente `ResponsiveHeroImage.astro`
- Configuraciones por dispositivo (desktop/tablet/mobile)
- Scripts de optimización automática
- Performance y métricas de mejora
- Troubleshooting y debugging

### 🎨 **[COLOR-SYSTEM-RULES.md](../.github/docs/COLOR-SYSTEM-RULES.md)**

**Descripción**: Sistema de colores centralizado y reglas de uso  
**Contenido**:

- Variables CSS como fuente de verdad
- Paleta corporativa Mudanzas ANDY
- Implementación en componentes y Tailwind
- Gradientes automáticos y utilidades

### 🚀 **[IMAGE-OPTIMIZATION.md](./IMAGE-OPTIMIZATION.md)**

**Descripción**: Optimización general de imágenes y performance  
**Contenido**:

- Estrategias de optimización WebP
- Lazy loading y Core Web Vitals
- Herramientas y scripts de análisis

### 🛠️ **[DEVELOPMENT-GUIDE.md](./DEVELOPMENT-GUIDE.md)**

**Descripción**: Guía completa de desarrollo y mejores prácticas  
**Contenido**:

- Principios de desarrollo (Performance First, Mobile First)
- Flujos de trabajo para imágenes responsive
- React Islands architecture y cuándo usar cada tecnología
- Content Collections y estructura de blog posts
- Testing, debugging y checklist de pre-deploy

---

## 📊 Reportes de Implementación

### ✅ **[BLOG-UNIQUE-IMAGES-SUCCESS-REPORT.md](../BLOG-UNIQUE-IMAGES-SUCCESS-REPORT.md)**

**Estado**: Completado ✅  
**Descripción**: Migración exitosa de imágenes duplicadas a imágenes únicas por artículo  
**Logros**:

- 4 imágenes únicas descargadas desde Unsplash/Pexels
- Sistema de validación MD5 implementado
- Build exitoso con assets locales

### ✅ **[RESPONSIVE-OPTIMIZATION-SUCCESS-REPORT.md](../RESPONSIVE-OPTIMIZATION-SUCCESS-REPORT.md)**

**Estado**: Completado ✅  
**Descripción**: Implementación completa del sistema de imágenes responsive  
**Logros**:

- 79% reducción de datos en móvil
- Carga automática por dispositivo
- 16 variaciones de Astro generadas automáticamente

### ✅ **[PERFORMANCE-OPTIMIZATION-SUCCESS-REPORT.md](../PERFORMANCE-OPTIMIZATION-SUCCESS-REPORT.md)**

**Estado**: Completado ✅  
**Descripción**: Optimización general de performance y Core Web Vitals  
**Logros**:

- Build time optimizado: 2.4s para 8 páginas
- Lazy loading inteligente implementado
- SEO y structured data mejorados

---

## 🛠️ Scripts y Herramientas

### 📥 **[optimize-responsive-images.js](../scripts/optimize-responsive-images.js)**

**Función**: Generador automático de variaciones responsive  
**Uso**: `node scripts/optimize-responsive-images.js`  
**Salida**: Genera desktop/tablet/mobile para cada imagen

### 🔍 **[analyze-image-optimization.js](../scripts/analyze-image-optimization.js)**

**Función**: Analizador de optimización de imágenes existentes  
**Uso**: `node scripts/analyze-image-optimization.js`  
**Salida**: Reporte detallado de tamaños y recomendaciones

### 📷 **[download-real-blog-images.js](../scripts/download-real-blog-images.js)**

**Función**: Descargador de imágenes desde Unsplash/Pexels  
**Uso**: `node scripts/download-real-blog-images.js`  
**Salida**: Imágenes optimizadas y únicas por artículo

---

## 🗂️ Gestión de Tareas

### 📋 **[tasks/README.md](../tasks/README.md)**

Sistema de gestión de tareas y progreso del proyecto.

### 📈 **[tasks/progress.md](../tasks/progress.md)**

Seguimiento de progreso de todas las tareas implementadas.

### 📝 Tareas Específicas

- `TASK-001-testimonials-fix.md` - Corrección de testimonios
- `TASK-002-view-transitions.md` - Implementación de View Transitions
- `TASK-005-emailjs-integration.md` - Integración EmailJS
- `TASK-007-seo-optimization.md` - Optimización SEO
- `TASK-008-performance-optimization.md` - Optimización de performance
- `TASK-010-performance-recovery-success.md` - Recuperación de performance

---

## ⚙️ Configuración y Setup

### 🔧 **[astro.config.mjs](../astro.config.mjs)**

Configuración principal de Astro con integraciones y optimizaciones.

### 📦 **[package.json](../package.json)**

Dependencias y scripts del proyecto.

### 🎨 **[src/styles/theme.css](../src/styles/theme.css)**

Variables CSS del sistema de colores centralizado.

### 📝 **[src/content.config.ts](../src/content.config.ts)**

Configuración de Content Collections con schemas de validación.

---

## 🚀 Deployment y Production

### 📊 **Métricas de Performance**

- **Build Time**: 2.4s para 8 páginas
- **Astro Optimizations**: 16 variaciones de imagen
- **Mobile Savings**: 79% menos ancho de banda
- **Core Web Vitals**: LCP, CLS, FCP optimizados

### 🌐 **Hosting Compatible**

- Netlify ✅
- Vercel ✅
- GitHub Pages ✅
- Hostinger ✅ (hosting estático básico)

---

## 🆘 Troubleshooting

### Problemas Comunes

1. **Error de importación de ResponsiveHeroImage**

   - **Solución**: Verificar ruta `../../layouts/shortcodes/ResponsiveHeroImage.astro`

2. **Imágenes responsive no cargan**

   - **Verificar**: Existencia de las 3 variaciones (desktop/tablet/mobile)
   - **Comando**: `ls src/assets/images/blog/*-{desktop,tablet,mobile}.webp`

3. **Build falla con error TypeScript**
   - **Solución**: Verificar tipado de props en componentes
   - **Comando**: `pnpm check`

### Comandos de Debug

```bash
# Verificar imágenes responsive
node scripts/analyze-image-optimization.js

# Verificar TypeScript
pnpm check

# Build con información detallada
pnpm build --verbose

# Verificar imágenes generadas por Astro
ls -la dist/_astro/*.webp
```

---

## 📞 Contacto y Soporte

- **Proyecto**: [mudanzasandy.es](https://mudanzasandy.es)
- **Documentación Astro**: [docs.astro.build](https://docs.astro.build)
- **Repositorio**: [github.com/JordiNodeJS/Mudanzas-Andy](https://github.com/JordiNodeJS/Mudanzas-Andy)

---

**Última actualización**: Septiembre 2025  
**Mantenido por**: Equipo de Desarrollo Mudanzas ANDY
