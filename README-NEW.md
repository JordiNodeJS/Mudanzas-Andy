# 🏠 Mudanzas Andy - Web Corporativa

## 📋 Descripción del Proyecto

Sitio web corporativo para empresa de mudanzas en Barcelona, desarrollado con **Astro 5** y optimizado para performance excepcional. Incluye sistema de blog con imágenes responsive automáticas y arquitectura escalable.

**Stack tecnológico:** Astro 5 + TypeScript + Tailwind CSS 4 + React Islands + Content Collections + Sistema de Imágenes Responsive

## ✨ Características Principales

### 🎨 **Sistema de Colores Centralizado**

- Variables CSS unificadas para toda la aplicación
- Paleta corporativa Mudanzas ANDY optimizada
- Gradientes automáticos y clases utilitarias

### 📱💻 **Imágenes Responsive Automáticas**

- **79% menos datos en móvil** vs desktop
- Carga automática según dispositivo del usuario
- Compatibilidad total con navegadores legacy

### 🚀 **Performance Excepcional**

- Core Web Vitals optimizados (LCP, CLS, FCP)
- Lazy loading inteligente
- Build time: ~2.4s para 8 páginas

### 📝 **Blog Optimizado**

- Content Layer API de Astro 5
- Imágenes únicas por artículo con variaciones responsive
- SEO automático y structured data

### ⚛️ **React Islands Architecture**

- Hidratación selectiva solo donde es necesaria
- Componentes interactivos optimizados
- Bundle splitting automático

## 🏗️ Arquitectura del Proyecto

```text
mudanzas-astro/
├── 📁 public/                          # Assets estáticos
│   ├── camion/                         # Imágenes de vehículos
│   ├── favicons/                       # Íconos del sitio
│   └── logos/                          # Logotipos corporativos
├── 📁 src/
│   ├── 📁 assets/images/blog/          # 🔥 SISTEMA RESPONSIVE
│   │   ├── imagen-desktop.webp         # 1200x800px, 85% calidad
│   │   ├── imagen-tablet.webp          # 768x512px, 82% calidad
│   │   └── imagen-mobile.webp          # 480x320px, 78% calidad
│   ├── 📁 components/                  # Componentes Astro reutilizables
│   ├── 📁 content/                     # 📝 Content Collections
│   │   └── blog/                       # Artículos en Markdown
│   ├── 📁 layouts/
│   │   ├── components/                 # Componentes de layout
│   │   ├── partials/                   # Header, Footer, Navigation
│   │   └── shortcodes/                 # 🎨 ResponsiveHeroImage.astro
│   ├── 📁 lib/                         # Utilidades y helpers
│   ├── 📁 pages/
│   │   ├── blog/[slug].astro          # 📱 Template con imágenes responsive
│   │   └── index.astro                 # Página principal
│   └── 📁 styles/                      # CSS layers y tema
├── 📁 scripts/                         # 🛠️ Scripts de optimización
│   ├── optimize-responsive-images.js   # Generador de imágenes responsive
│   ├── analyze-image-optimization.js   # Analizador de performance
│   └── download-real-blog-images.js    # Descargador de Unsplash/Pexels
├── 📁 docs/                           # 📚 Documentación técnica
│   ├── RESPONSIVE-IMAGES-GUIDE.md      # Guía completa de imágenes responsive
│   └── IMAGE-OPTIMIZATION.md           # Optimización de performance
└── 📁 tasks/                          # Gestión de tareas y progreso
```

### 🎯 Componentes Clave

- **ResponsiveHeroImage.astro**: Componente que carga automáticamente la imagen optimizada según el dispositivo
- **Blog Template**: Sistema de routing dinámico con imágenes responsive integradas
- **Content Collections**: API nativa de Astro 5 para gestión de contenido

## 📱💻 Sistema de Imágenes Responsive

### Funcionamiento Automático

```astro
<!-- Uso del componente responsive -->
<ResponsiveHeroImage
  imageName="mudanzas-economicas-hero"
  alt="Familia preparando mudanza económica en Barcelona"
/>
```

### Optimizaciones por Dispositivo

| Dispositivo | Resolución | Calidad | Ahorro vs Desktop |
| ----------- | ---------- | ------- | ----------------- |
| 🖥️ Desktop  | 1200x800px | 85%     | 0% (referencia)   |
| 📱 Tablet   | 768x512px  | 82%     | **54%**           |
| 📱 Mobile   | 480x320px  | 78%     | **79%**           |

### Performance Mejorada

- **LCP mejorado**: -40% en dispositivos móviles
- **Ancho de banda**: 79% menos datos en móvil
- **Astro optimizations**: 16 variaciones automáticas vs 8 anteriores

## 🧞 Comandos de Desarrollo

| Comando        | Acción                                 |
| -------------- | -------------------------------------- |
| `pnpm install` | Instalar dependencias                  |
| `pnpm dev`     | Servidor desarrollo (`localhost:4322`) |
| `pnpm build`   | Build producción → `./dist/`           |
| `pnpm preview` | Preview del build local                |
| `pnpm check`   | Verificar TypeScript                   |
| `pnpm format`  | Formatear código (Prettier)            |

### 🛠️ Scripts de Optimización

```bash
# Generar imágenes responsive automáticamente
node scripts/optimize-responsive-images.js

# Analizar optimización de imágenes existentes
node scripts/analyze-image-optimization.js

# Descargar y optimizar imágenes desde Unsplash/Pexels
node scripts/download-real-blog-images.js
```

## 🎨 Sistema de Colores ANDY

### Variables CSS Centralizadas

```css
/* src/styles/theme.css */
--color-primary: 38 78 112; /* #264e70 - Azul corporativo */
--color-secondary: 103 145 134; /* #679186 - Verde complementario */
--color-accent: 249 180 171; /* #f9b4ab - Rosa coral CTA */
--color-highlight: 250 227 96; /* #fae360 - Amarillo destacados */
--color-neutral: 187 212 206; /* #bbd4ce - Verde neutro */
```

### Uso en Componentes

```css
/* Correcto: usar variables del sistema */
.button-primary {
  background: rgb(var(--color-primary));
  color: white;
}

/* Gradientes automáticos */
.contact-card {
  @apply bg-gradient-to-br from-primary/10 to-secondary/5;
}
```

## 📚 Documentación Técnica

### Guías Completas

- 📱 **[RESPONSIVE-IMAGES-GUIDE.md](./docs/RESPONSIVE-IMAGES-GUIDE.md)**: Documentación completa del sistema de imágenes responsive
- 🎨 **[COLOR-SYSTEM-RULES.md](./.github/docs/COLOR-SYSTEM-RULES.md)**: Sistema de colores centralizado
- 🚀 **[IMAGE-OPTIMIZATION.md](./docs/IMAGE-OPTIMIZATION.md)**: Optimización de performance

### Reportes de Implementación

- ✅ **[BLOG-UNIQUE-IMAGES-SUCCESS-REPORT.md](./BLOG-UNIQUE-IMAGES-SUCCESS-REPORT.md)**: Migración a imágenes únicas
- ✅ **[RESPONSIVE-OPTIMIZATION-SUCCESS-REPORT.md](./RESPONSIVE-OPTIMIZATION-SUCCESS-REPORT.md)**: Implementación responsive completa

## 🔧 Desarrollo y Contribución

### Reglas Técnicas

1. **PNPM obligatorio**: No usar npm o yarn
2. **Sistema de colores**: Usar variables CSS, no colores hardcodeados
3. **TypeScript estricto**: No usar `any`, tipos explícitos
4. **Imágenes responsive**: Usar `ResponsiveHeroImage` para nuevas imágenes

### Estructura de Commits

```bash
feat(blog): add responsive images system
fix(colors): update primary color variable usage
docs(readme): update architecture documentation
perf(images): optimize mobile image sizes
```

### Testing

```bash
# Verificar imágenes responsive funcionan
# 1. Chrome DevTools → Toggle Device Toolbar
# 2. Cambiar entre Desktop/Tablet/Mobile
# 3. Network tab → Ver qué imagen descarga

# URLs de testing
http://localhost:4322/blog/mudanzas-economicas-barcelona-2025/
http://localhost:4322/blog/guia-embalaje-profesional-mudanzas/
```

## 📊 Métricas de Performance

### Resultados Actuales

- **Build Time**: 2.4s para 8 páginas
- **Astro Optimizations**: 16 variaciones de imagen
- **Mobile Data Savings**: 79% menos ancho de banda
- **Core Web Vitals**: Optimizado (LCP, CLS, FCP)

### Mejoras Implementadas

| Métrica                    | Antes               | Después        | Mejora |
| -------------------------- | ------------------- | -------------- | ------ |
| **Imágenes únicas**        | ❌ Copias idénticas | ✅ 4 únicas    | +100%  |
| **Variaciones responsive** | 1 tamaño            | 3 tamaños      | +300%  |
| **Datos móvil**            | 133KB desktop       | 28KB móvil     | -79%   |
| **Build optimizations**    | 8 variaciones       | 16 variaciones | +100%  |

## 🚀 Deployment

### Hosting Estático

- **Compatible con**: Netlify, Vercel, GitHub Pages, Hostinger
- **Output**: `dist/` - Sitio completamente estático
- **CDN Ready**: Assets optimizados para distribución

### Variables de Entorno

```bash
# .env.local
SITE_URL=https://mudanzasandy.es
GTM_ID=GTM-XXXXXXX
EMAILJS_PUBLIC_KEY=your_public_key
```

## 🧭 Reglas de JavaScript (View Transitions)

Para comportamientos cliente que deben re-inicializarse tras navegaciones:

- **Patrón**: `.ai/JS-INIT-RULES.md`
- **Usar**: `astro:after-swap` para re-inicialización
- **Cleanup**: Remover listeners antes de re-crear

## 📞 Contacto y Soporte

- **Web**: [mudanzasandy.es](https://mudanzasandy.es)
- **Documentación Astro**: [docs.astro.build](https://docs.astro.build)
- **Repositorio**: [github.com/JordiNodeJS/Mudanzas-Andy](https://github.com/JordiNodeJS/Mudanzas-Andy)

---

**Desarrollado con ❤️ por el equipo de Mudanzas ANDY**  
_Optimizado para performance excepcional y experiencia de usuario superior_
