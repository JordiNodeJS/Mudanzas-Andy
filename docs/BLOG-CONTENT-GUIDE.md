# 📝 Guía para Añadir Contenido al Blog - Mudanzas ANDY

## 🎯 Propósito de esta Documentación

Esta guía está diseñada para:
- **Humanos**: Editores de contenido y desarrolladores que necesitan añadir artículos al blog
- **AI Assistants**: Como referencia para automatizar la creación de contenido siguiendo los estándares del proyecto

## 📚 Índice

1. [Requisitos Previos](#requisitos-previos)
2. [Estructura de un Post de Blog](#estructura-de-un-post-de-blog)
3. [Schema y Validación](#schema-y-validación)
4. [Paso a Paso: Crear un Nuevo Post](#paso-a-paso-crear-un-nuevo-post)
5. [Sistema de Imágenes Responsive](#sistema-de-imágenes-responsive)
6. [SEO y Metadatos](#seo-y-metadatos)
7. [Categorías y Tags](#categorías-y-tags)
8. [Verificación y Testing](#verificación-y-testing)
9. [Checklist Final](#checklist-final)
10. [Troubleshooting](#troubleshooting)

---

## 🔧 Requisitos Previos

### Conocimientos Necesarios
- Markdown básico (títulos, listas, enlaces, imágenes)
- Frontmatter YAML para metadatos
- Conceptos básicos de SEO

### Herramientas Requeridas
- Editor de texto (VS Code recomendado)
- Conocimientos de gestión de archivos
- Acceso al repositorio del proyecto
- PNPM instalado (gestor de paquetes)

### Ubicación de Archivos
```
src/
├── content/
│   └── blog/                           # 📁 Todos los posts van aquí
│       ├── post-ejemplo.md             # ✅ Archivo de post
│       └── otro-post.mdx               # ✅ Con componentes React
├── assets/images/blog/                 # 📁 Imágenes de blog
│   ├── hero-post-desktop.webp          # 1200x800px
│   ├── hero-post-tablet.webp           # 768x512px
│   └── hero-post-mobile.webp           # 480x320px
└── content.config.ts                   # ⚙️ Schema de validación
```

---

## 📋 Estructura de un Post de Blog

### Anatomía Completa de un Post

Un post de blog consta de **dos partes principales**:

#### 1. **Frontmatter** (Metadatos YAML)
Bloque delimitado por `---` al inicio del archivo con todos los metadatos.

#### 2. **Contenido Markdown/MDX**
El cuerpo del artículo usando sintaxis Markdown estándar.

### Ejemplo Completo

```markdown
---
title: "Título Completo del Artículo Aquí"
description: "Resumen breve y atractivo del contenido que captura la esencia del artículo en 150-160 caracteres."
pubDate: 2025-10-11
updatedDate: 2025-10-15
tags: ["mudanzas", "barcelona", "consejos"]
category: "consejos"
draft: false
featured: true
heroImage: "../../assets/images/blog/hero-imagen-desktop.webp"
heroImageAlt: "Descripción detallada de la imagen para accesibilidad y SEO, explicando qué se ve y su contexto"
metaTitle: "Título SEO Optimizado - Mudanzas ANDY"
metaDescription: "🚚 Meta descripción optimizada con emojis y keywords relevantes para aparecer en resultados de búsqueda."
author: "Juan Pérez - Especialista en Mudanzas"
readingTime: 8
keywords:
  [
    "mudanza barcelona",
    "consejos mudanza",
    "empresa mudanzas",
  ]
canonical: "https://mudanzasandy.es/blog/titulo-del-post"
---

# Título Principal del Artículo

Primer párrafo introductorio que engancha al lector y presenta el tema...

## Sección Principal 1

Contenido de la sección con información valiosa...

### Subsección 1.1

Detalles específicos...

## Sección Principal 2

![Descripción de la imagen](https://ejemplo.com/imagen.jpg "Título opcional de la imagen")

Más contenido con listas:

- Punto importante 1
- Punto importante 2
- Punto importante 3

### Tabla de Ejemplo

| Servicio | Precio | Tiempo |
|----------|--------|--------|
| Mudanza local | 300€ | 4h |
| Mudanza nacional | 800€ | 8h |

## Conclusión

Resumen final y call-to-action...
```

---

## 🔍 Schema y Validación

### Schema Definido en `content.config.ts`

El proyecto usa **Content Layer API de Astro 5** con validación Zod. Todos los posts deben cumplir este schema:

```typescript
const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      // ✅ CAMPOS OBLIGATORIOS
      title: z.string(),                    // Título del post
      description: z.string(),              // Descripción corta
      pubDate: z.coerce.date(),            // Fecha de publicación
      
      // 📅 CAMPOS OPCIONALES - Fechas
      updatedDate: z.coerce.date().optional(),
      
      // 🏷️ CAMPOS CON VALORES POR DEFECTO
      tags: z.array(z.string()).default([]),
      category: z.string().default("general"),
      draft: z.boolean().default(false),
      featured: z.boolean().default(false),
      
      // 🖼️ CAMPOS OPCIONALES - Imágenes
      heroImage: image().optional(),         // Imagen principal
      heroImageAlt: z.string().optional(),   // Alt text
      
      // 🎯 SEO OPCIONAL
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      keywords: z.array(z.string()).default([]),
      canonical: z.string().optional(),
      
      // 👤 AUTOR
      author: z.string().default("Equipo Mudanzas ANDY"),
      authorImage: z.string().optional(),
      
      // ⏱️ LECTURA
      readingTime: z.number().optional(),   // En minutos
    }),
});
```

### Campos Obligatorios vs Opcionales

#### ✅ **Campos OBLIGATORIOS** (Sin estos, el build fallará)
- `title`: Título del artículo
- `description`: Resumen del contenido
- `pubDate`: Fecha de publicación (formato: YYYY-MM-DD)

#### 🔹 **Campos RECOMENDADOS** (No obligatorios pero importantes para SEO/UX)
- `tags`: Array de etiquetas para clasificación
- `category`: Categoría del post
- `heroImage`: Imagen principal del artículo
- `heroImageAlt`: Descripción de la imagen
- `metaTitle`: Título optimizado para SEO
- `metaDescription`: Descripción meta para motores de búsqueda
- `author`: Nombre del autor
- `readingTime`: Tiempo estimado de lectura

#### ⚙️ **Campos CON VALOR POR DEFECTO** (Si no se especifican)
- `draft`: `false` (post publicado)
- `featured`: `false` (no destacado)
- `tags`: `[]` (array vacío)
- `category`: `"general"`
- `author`: `"Equipo Mudanzas ANDY"`
- `keywords`: `[]`

---

## 🚀 Paso a Paso: Crear un Nuevo Post

### Paso 1: Crear el Archivo Markdown

**Ubicación**: `src/content/blog/`

**Convención de nombres**:
- ✅ Usar kebab-case: `mi-nuevo-post.md`
- ✅ Nombres descriptivos y SEO-friendly
- ✅ Sin espacios, acentos ni caracteres especiales
- ❌ Evitar: `Post 1.md`, `artículo_nuevo.md`

**Comando para crear archivo**:
```bash
# Desde la raíz del proyecto
touch src/content/blog/mi-nuevo-post.md

# O en Windows PowerShell
New-Item -Path "src/content/blog/mi-nuevo-post.md" -ItemType File
```

### Paso 2: Añadir el Frontmatter Básico

Copia esta plantilla y completa los campos:

```yaml
---
title: "Tu Título Aquí - Claro y Descriptivo"
description: "Resumen de 150-160 caracteres que describe el contenido del artículo y atrae clics en resultados de búsqueda."
pubDate: 2025-10-11
tags: ["mudanzas", "barcelona", "keyword-relevante"]
category: "consejos"
draft: false
featured: false
heroImage: "../../assets/images/blog/hero-nombre-post-desktop.webp"
heroImageAlt: "Descripción detallada de lo que muestra la imagen para usuarios con lectores de pantalla"
metaTitle: "Título SEO - Mudanzas ANDY Barcelona"
metaDescription: "🚚 Descripción optimizada para Google con emojis y keywords principales del artículo."
author: "Nombre Apellido - Rol/Especialidad"
readingTime: 7
keywords:
  [
    "keyword principal",
    "keyword secundaria",
    "frase long-tail",
  ]
---
```

### Paso 3: Escribir el Contenido

#### Estructura Recomendada

```markdown
# Título Principal (H1) - Coincide con el frontmatter title

Párrafo introductorio de 2-3 líneas que engancha al lector...

## ¿Por Qué Este Tema es Importante? (H2)

Contexto y justificación del artículo...

### Beneficios Principales (H3)

- Beneficio 1
- Beneficio 2
- Beneficio 3

## Sección de Contenido Principal (H2)

Desarrollo del tema con ejemplos prácticos...

### Subsección con Detalles (H3)

Información específica y detallada...

## Tips y Consejos Prácticos (H2)

**💡 Consejo 1**: Descripción del consejo

**💡 Consejo 2**: Otra recomendación útil

## Casos de Uso o Ejemplos Reales (H2)

Historias o ejemplos que refuerzan el contenido...

## Conclusión y Call-to-Action (H2)

Resumen de puntos clave y invitación a la acción:

> ¿Necesitas ayuda con tu mudanza? [Contacta con nosotros](/contacto) para un presupuesto gratuito.
```

#### Mejores Prácticas de Redacción

**✅ SÍ hacer**:
- Usar títulos descriptivos (H2, H3) con keywords naturales
- Incluir listas para mejorar escaneabilidad
- Añadir ejemplos prácticos y casos reales
- Usar negritas para resaltar conceptos clave
- Incluir enlaces internos a otras páginas del sitio
- Añadir call-to-actions claros

**❌ NO hacer**:
- Usar más de un H1 por página
- Bloques de texto largos sin formato
- Keyword stuffing (repetir keywords innecesariamente)
- Enlaces rotos o placeholder
- Imágenes sin alt text

### Paso 4: Añadir Imágenes (Opcional pero Recomendado)

#### Imagen Hero (Principal)

La imagen hero se define en el frontmatter:

```yaml
heroImage: "../../assets/images/blog/nombre-post-desktop.webp"
heroImageAlt: "Descripción detallada de la imagen"
```

#### Imágenes en el Contenido

Usar sintaxis Markdown estándar:

```markdown
![Alt text descriptivo](https://ejemplo.com/imagen.jpg "Título opcional")

<!-- O con imágenes locales -->
![Diagrama de proceso](../../assets/images/blog/diagrama-ejemplo.webp "Proceso de mudanza paso a paso")
```

**Requisitos de imágenes**:
- Formato: WebP preferido (mejor compresión)
- Dimensiones recomendadas hero:
  - Desktop: 1200x800px
  - Tablet: 768x512px
  - Mobile: 480x320px
- Alt text SIEMPRE obligatorio para SEO y accesibilidad

### Paso 5: Verificar el Post Localmente

```bash
# Ejecutar servidor de desarrollo
pnpm dev

# Navegar a:
# http://localhost:4321/blog/nombre-de-tu-post
```

**Checklist de verificación visual**:
- [ ] El título se muestra correctamente
- [ ] La imagen hero carga sin errores
- [ ] El contenido es legible y bien formateado
- [ ] Los enlaces funcionan correctamente
- [ ] Las imágenes tienen alt text visible al pasar el cursor
- [ ] La página es responsive (probar en diferentes tamaños)

### Paso 6: Verificar TypeScript y Build

```bash
# Verificar errores de TypeScript
pnpm check

# Hacer build de producción
pnpm build
```

**Errores comunes**:
- ❌ `Missing required field: title` → Falta el campo obligatorio `title`
- ❌ `Invalid date format` → Usar formato YYYY-MM-DD en `pubDate`
- ❌ `Image not found` → Verificar ruta de `heroImage`
- ❌ `Invalid tag type` → `tags` debe ser array: `["tag1", "tag2"]`

---

## 🖼️ Sistema de Imágenes Responsive

### Arquitectura de Imágenes

El proyecto utiliza un **sistema de imágenes responsive automático** optimizado para Core Web Vitals.

#### Estructura de Carpetas

```
src/assets/images/blog/
├── nombre-post-desktop.webp      # 1200x800px, 85% calidad
├── nombre-post-tablet.webp       # 768x512px, 82% calidad
└── nombre-post-mobile.webp       # 480x320px, 78% calidad
```

### Naming Convention para Imágenes

**Patrón obligatorio**: `{nombre-post}-{dispositivo}.webp`

**Ejemplos**:
```
mudanzas-internacionales-desktop.webp
mudanzas-internacionales-tablet.webp
mudanzas-internacionales-mobile.webp

guia-embalaje-desktop.webp
guia-embalaje-tablet.webp
guia-embalaje-mobile.webp
```

### Optimización Automática

El sistema de build de Astro:
- ✅ Genera variaciones responsive automáticamente durante el build
- ✅ Optimiza tamaño y calidad por dispositivo
- ✅ Ahorra **79% de datos en móvil** vs desktop
- ✅ Lazy loading inteligente incluido

### Crear Variaciones Manualmente

**Opción 1: Herramientas Online (Más Rápido)**

```bash
# Usa CloudConvert o similar: https://cloudconvert.com/webp-converter

# Crea 3 versiones de tu imagen:
# 1. Desktop: 1200x800px, calidad 85%, formato WebP
#    → nombre-post-desktop.webp
# 2. Tablet: 768x512px, calidad 82%, formato WebP
#    → nombre-post-tablet.webp  
# 3. Mobile: 480x320px, calidad 78%, formato WebP
#    → nombre-post-mobile.webp

# Guarda las 3 imágenes en: src/assets/images/blog/
```

**Opción 2: Script Automatizado con Sharp**

⚠️ **Nota**: El script `optimize-responsive-images.js` está preconfigurado para imágenes específicas hardcodeadas. Para usarlo con una nueva imagen:

```javascript
// 1. Editar scripts/optimize-responsive-images.js
// 2. Añadir tu imagen al objeto BLOG_IMAGES_SOURCES:

const BLOG_IMAGES_SOURCES = {
  // ... imágenes existentes ...
  "tu-nuevo-post": {
    baseUrl: "https://images.pexels.com/photos/ID/imagen.jpeg",
    alt: "Descripción completa de la imagen",
    description: "Descripción corta",
  },
};

// 3. Ejecutar: node scripts/optimize-responsive-images.js
// Esto generará TODAS las imágenes definidas en el objeto
```

**Opción 3: Sharp CLI Manual**

```bash
# Instalar sharp-cli si no lo tienes
pnpm add -D sharp-cli

# Generar cada variación manualmente
pnpm sharp -i imagen-original.jpg -o nombre-post-desktop.webp resize 1200 800 -q 85
pnpm sharp -i imagen-original.jpg -o nombre-post-tablet.webp resize 768 512 -q 82
pnpm sharp -i imagen-original.jpg -o nombre-post-mobile.webp resize 480 320 -q 78

# Mover las imágenes a: src/assets/images/blog/
```

### Usar Imagen Hero en el Post

```yaml
---
heroImage: "../../assets/images/blog/nombre-post-desktop.webp"
heroImageAlt: "Descripción detallada para accesibilidad"
---
```

**Nota**: Solo especificas la versión `-desktop`, Astro se encarga del resto.

---

## 🎯 SEO y Metadatos

### Campos SEO Esenciales

#### 1. **Title y Meta Title**

```yaml
title: "Mudanzas Internacionales Barcelona 2025"
metaTitle: "Mudanzas Internacionales Barcelona - Guía Completa | ANDY"
```

**Diferencias**:
- `title`: Aparece como H1 en la página
- `metaTitle`: Aparece en pestañas del navegador y resultados de búsqueda

**Mejores prácticas**:
- ✅ 50-60 caracteres máximo
- ✅ Incluir keyword principal
- ✅ Añadir marca al final: "| Mudanzas ANDY"
- ❌ Evitar keyword stuffing

#### 2. **Description y Meta Description**

```yaml
description: "Descripción para mostrar en la página"
metaDescription: "🚚 Descripción optimizada con emoji para destacar en Google. Incluye keywords y CTA."
```

**Mejores prácticas**:
- ✅ 150-160 caracteres
- ✅ Incluir emoji relevante (aumenta CTR)
- ✅ Call-to-action claro
- ✅ Responder "qué encontrará el usuario"

#### 3. **Keywords**

```yaml
keywords:
  [
    "mudanza internacional barcelona",
    "mudarse al extranjero",
    "empresa mudanzas europa",
  ]
```

**Estrategia**:
- 3-5 keywords principales
- Mezcla de short-tail y long-tail
- Investigación previa con herramientas SEO

#### 4. **Canonical URL**

```yaml
canonical: "https://mudanzasandy.es/blog/mudanzas-internacionales-barcelona"
```

**Usar cuando**:
- Contenido sindicated
- Evitar contenido duplicado
- Consolidar señales de ranking

### Structured Data (JSON-LD)

El proyecto genera automáticamente structured data para:
- BlogPosting schema
- Article schema
- Breadcrumbs
- Organization info

**No requiere acción manual** - Se genera del frontmatter.

### Validación SEO

```bash
# Validar structured data
node scripts/validate-blog-jsonld.cjs

# Verificar Open Graph tags (requiere build)
pnpm build
node scripts/check-og-image.js
```

---

## 🏷️ Categorías y Tags

### Sistema de Categorías

#### Categorías Predefinidas

| Categoría | Uso | Ejemplo |
|-----------|-----|---------|
| `general` | Posts sin categoría específica | Noticias de la empresa |
| `consejos` | Tips y guías prácticas | "10 consejos para embalar" |
| `internacional` | Mudanzas al extranjero | "Mudarse a Alemania desde Barcelona" |
| `local` | Mudanzas en Barcelona | "Mejores barrios de Barcelona" |
| `empresas` | Traslados corporativos | "Mudanza de oficina sin interrupciones" |
| `storage` | Almacenamiento y guardamuebles | "Cuándo usar guardamuebles" |

#### Añadir Nueva Categoría

Si necesitas una categoría nueva:

1. Añadir al frontmatter:
```yaml
category: "nueva-categoria"
```

2. Documentar en esta guía
3. Crear página de índice si es necesario: `src/pages/blog/categories/nueva-categoria.astro`

### Sistema de Tags

#### Tags Recomendados

**Ubicación geográfica**:
- `barcelona`, `madrid`, `valencia`, `cataluña`, `españa`, `europa`

**Tipo de mudanza**:
- `mudanza local`, `mudanza nacional`, `mudanza internacional`, `mudanza empresas`

**Temática**:
- `embalaje`, `documentación`, `presupuesto`, `ahorro`, `planificación`, `calendario`

**Palabras clave SEO**:
- `consejos`, `guía`, `tutorial`, `2025`, `profesional`

#### Mejores Prácticas de Tags

```yaml
# ✅ CORRECTO
tags: ["mudanzas", "barcelona", "internacional", "documentación"]

# ❌ INCORRECTO - demasiados tags
tags: ["mudanzas", "barcelona", "internacional", "documentación", "europa", "alemania", "francia", "reino unido", "consejos", "tips", "guía", "tutorial"]

# ❌ INCORRECTO - tags no relevantes
tags: ["general", "post", "blog", "articulo"]
```

**Reglas**:
- ✅ 3-6 tags por post
- ✅ Tags específicos y relevantes
- ✅ Consistencia (siempre `barcelona`, no `Barcelona` o `BCN`)
- ❌ No usar tags genéricos (`blog`, `post`, `articulo`)

---

## ✅ Verificación y Testing

### Checklist Pre-Build

Antes de hacer build, verificar:

```bash
# 1. TypeScript check
pnpm check
# ✅ Debe pasar sin errores

# 2. Build local
pnpm build
# ✅ Debe completar exitosamente

# 3. Preview del build
pnpm preview
# ✅ Probar el post en http://localhost:4321/blog/tu-post
```

### Verificaciones Manuales

#### 📱 Responsive Design
- [ ] Desktop (1920px)
- [ ] Laptop (1366px)
- [ ] Tablet (768px)
- [ ] Mobile (375px)

#### 🔍 SEO
- [ ] Meta title visible en pestaña del navegador
- [ ] Meta description en resultados de búsqueda simulados
- [ ] Open Graph image preview con herramientas online
- [ ] Canonical URL correcto

#### ♿ Accesibilidad
- [ ] Todas las imágenes tienen alt text
- [ ] Contraste de colores adecuado
- [ ] Navegable con teclado (Tab)
- [ ] Lectores de pantalla compatible

#### ⚡ Performance
- [ ] Imágenes optimizadas y lazy loading
- [ ] Sin JavaScript innecesario
- [ ] Lighthouse score > 90

### Herramientas de Validación

```bash
# Validar JSON-LD structured data
node scripts/validate-blog-jsonld.cjs

# Verificar imágenes responsive
pnpm build && node scripts/check-og-image.js

# Lighthouse CI (requiere configuración)
pnpm dlx lighthouse http://localhost:4321/blog/tu-post --view
```

### Testing en Producción

Una vez desplegado:

1. **Google Search Console**
   - Solicitar indexación
   - Verificar Mobile Usability
   - Revisar Core Web Vitals

2. **Rich Results Test**
   - Validar structured data: https://search.google.com/test/rich-results
   - Verificar BlogPosting schema

3. **Open Graph Preview**
   - Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
   - Twitter Card Validator: https://cards-dev.twitter.com/validator

---

## 📋 Checklist Final

### Antes de Publicar (draft: false)

#### Contenido
- [ ] Título descriptivo y atractivo (50-60 caracteres)
- [ ] Descripción completa (150-160 caracteres)
- [ ] Fecha de publicación correcta (pubDate)
- [ ] Categoría asignada apropiadamente
- [ ] 3-6 tags relevantes
- [ ] Autor especificado
- [ ] Tiempo de lectura calculado (readingTime)

#### SEO
- [ ] metaTitle optimizado con keyword principal
- [ ] metaDescription con emoji y CTA
- [ ] keywords array con 3-5 términos
- [ ] canonical URL definido si es necesario
- [ ] Alt text en todas las imágenes
- [ ] Enlaces internos incluidos (mínimo 2-3)

#### Imágenes
- [ ] heroImage especificado
- [ ] heroImageAlt descriptivo y detallado
- [ ] Imagen existe en `/src/assets/images/blog/`
- [ ] Variaciones responsive disponibles (-desktop, -tablet, -mobile)
- [ ] Formato WebP para mejor compresión
- [ ] Dimensiones correctas (1200x800px desktop)

#### Calidad
- [ ] Sin errores ortográficos
- [ ] Sintaxis Markdown correcta
- [ ] Estructura de headings lógica (H2 → H3)
- [ ] Call-to-action incluido
- [ ] Contenido aporta valor real al usuario

#### Técnico
- [ ] `pnpm check` pasa sin errores
- [ ] `pnpm build` completa exitosamente
- [ ] Post visible en `/blog` y `/blog/slug-del-post`
- [ ] Responsive en todos los dispositivos
- [ ] Lighthouse score > 90

---

## 🔧 Troubleshooting

### Errores Comunes y Soluciones

#### Error: "Missing required field: title"

**Causa**: Campo obligatorio `title` no definido en frontmatter

**Solución**:
```yaml
---
title: "Mi Título Aquí"  # ✅ Añadir este campo
description: "..."
pubDate: 2025-10-11
---
```

#### Error: "Invalid date format in pubDate"

**Causa**: Formato de fecha incorrecto

**Solución**:
```yaml
# ❌ INCORRECTO
pubDate: "11/10/2025"
pubDate: "11 Oct 2025"

# ✅ CORRECTO
pubDate: 2025-10-11
pubDate: 2025-10-11T10:30:00Z
```

#### Error: "Image not found: ../../assets/..."

**Causa**: Ruta de imagen incorrecta o archivo no existe

**Solución**:
1. Verificar que la imagen existe: `src/assets/images/blog/nombre-imagen.webp`
2. Verificar ruta relativa: `../../assets/images/blog/nombre-imagen.webp`
3. Verificar extensión correcta (`.webp`, no `.jpg`)

```yaml
# ✅ CORRECTO desde src/content/blog/post.md
heroImage: "../../assets/images/blog/hero-desktop.webp"

# ❌ INCORRECTO
heroImage: "/assets/images/blog/hero-desktop.webp"  # Ruta absoluta
heroImage: "hero-desktop.webp"  # Falta path completo
```

#### Error: "Expected array, received string" (tags)

**Causa**: Tags no es un array

**Solución**:
```yaml
# ❌ INCORRECTO
tags: "mudanzas, barcelona"

# ✅ CORRECTO
tags: ["mudanzas", "barcelona"]
```

#### Error: "Post no aparece en /blog"

**Posibles causas y soluciones**:

1. **Post en draft**:
```yaml
draft: true  # ❌ No se mostrará
draft: false # ✅ Se mostrará
```

2. **Fecha futura**:
```yaml
pubDate: 2026-01-01  # ❌ No se mostrará hasta esa fecha
```

3. **Build antiguo**:
```bash
# Limpiar y rebuild
rm -rf dist/
pnpm build
```

#### Warning: "Missing alt text in image"

**Causa**: Imagen sin atributo alt

**Solución**:
```markdown
# ❌ INCORRECTO
![](imagen.jpg)

# ✅ CORRECTO
![Descripción detallada de la imagen](imagen.jpg)
```

#### Error de Build: "Out of memory"

**Causa**: Demasiadas imágenes grandes o múltiples builds consecutivos

**Solución**:
```bash
# Limpiar cache de Astro
rm -rf .astro/
rm -rf dist/
rm -rf node_modules/.astro/

# Rebuild
pnpm install
pnpm build
```

---

## 🤖 Instrucciones Específicas para AI

### Cuando se te pida crear un nuevo post de blog:

1. **Recopilar información del usuario**:
   - Tema del post
   - Keywords objetivo
   - Categoría apropiada
   - Longitud aproximada deseada

2. **Crear archivo siguiendo naming convention**:
   ```bash
   # Usar kebab-case
   src/content/blog/tema-del-post-descriptivo.md
   ```

3. **Generar frontmatter completo**:
   - Todos los campos obligatorios (`title`, `description`, `pubDate`)
   - Campos recomendados SEO (`metaTitle`, `metaDescription`, `keywords`)
   - Valores por defecto apropiados (`draft: false`, `featured: false`)
   - Author y readingTime calculados

4. **Estructura del contenido**:
   - H1 coincide con `title`
   - Mínimo 3 secciones H2
   - Subsecciones H3 donde sea apropiado
   - Listas y negritas para escaneabilidad
   - Call-to-action al final

5. **Optimización SEO**:
   - Keywords naturalmente integradas
   - Enlaces internos a páginas del sitio
   - Alt text descriptivo en todas las imágenes
   - Meta description con emoji y CTA

6. **Verificación post-creación**:
   ```bash
   pnpm check  # TypeScript validation
   pnpm build  # Build verification
   ```

7. **Informar al usuario**:
   - Ubicación del archivo creado
   - URL donde estará disponible
   - Campos que pueden personalizar
   - Próximos pasos (añadir imágenes, revisar contenido)

### Plantilla de Respuesta AI

Cuando crees un post, responde con:

```
✅ Post de blog creado exitosamente

📄 **Archivo**: `src/content/blog/nombre-del-post.md`
🔗 **URL**: http://localhost:4321/blog/nombre-del-post
📁 **Categoría**: [categoria]
🏷️ **Tags**: [tag1, tag2, tag3]

**Próximos pasos**:
1. Revisar y editar el contenido generado
2. Añadir imagen hero en `src/assets/images/blog/nombre-del-post-desktop.webp`
3. Ejecutar `pnpm dev` para preview
4. Verificar con `pnpm check && pnpm build`

**Personalización recomendada**:
- [ ] Ajustar tono y estilo al público objetivo
- [ ] Añadir ejemplos específicos de Mudanzas ANDY
- [ ] Incluir datos o estadísticas relevantes
- [ ] Optimizar call-to-action final
```

---

## 📚 Referencias Adicionales

### Documentación del Proyecto
- [README Principal](../README.md)
- [Guía de Desarrollo](./DEVELOPMENT-GUIDE.md)
- [Guía SEO](./SEO-IMPLEMENTATION-GUIDE.md)
- [Sistema de Imágenes Responsive](./RESPONSIVE-IMAGES-GUIDE.md)

### Documentación Externa
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Markdown Guide](https://www.markdownguide.org/)
- [Frontmatter Specs](https://jekyllrb.com/docs/front-matter/)
- [Schema.org BlogPosting](https://schema.org/BlogPosting)

### Herramientas Útiles
- [Markdown Live Preview](https://markdownlivepreview.com/)
- [Frontmatter Validator](https://frontmatter.codes/validate)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [WebP Converter](https://cloudconvert.com/webp-converter)

---

## 📞 Soporte

¿Problemas o preguntas sobre esta guía?

- **Issues**: [GitHub Issues](https://github.com/JordiNodeJS/Mudanzas-Andy/issues)
- **Email**: soporte@mudanzasandy.es
- **Documentación**: [docs/](../docs/)

---

**Última actualización**: 2025-10-11  
**Versión**: 1.0.0  
**Mantenido por**: Equipo de Desarrollo Mudanzas ANDY
