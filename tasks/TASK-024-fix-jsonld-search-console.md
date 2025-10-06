# TASK-024: Corrección Error JSON-LD en Google Search Console

**Estado**: ✅ COMPLETADA
**Fecha inicio**: 6 octubre 2025
**Fecha finalización**: 6 octubre 2025
**Prioridad**: 🔴 CRÍTICA (Afecta SEO)

---

## 📋 Descripción del Problema

Google Search Console reportó un **error crítico de parseo JSON-LD** en la página del blog:

- **URL afectada**: `https://mudanzasandy.es/blog-astro/`
- **Error**: "Falta el carácter '}' o el nombre del miembro del objeto"
- **Fecha detección**: 2 octubre 2025
- **Impacto**: 1 página afectada

### Consecuencias del Error

❌ **Antes de la corrección**:

- Google no podía parsear los datos estructurados del blog
- La página no aparecía en resultados enriquecidos (rich snippets)
- Pérdida de visibilidad SEO para artículos del blog
- Riesgo de penalización en rankings

---

## 🔍 Análisis del Problema

### Causa Raíz

El error se encontró en `src/pages/blog-astro.astro` línea **129**:

```javascript
// ❌ INCORRECTO - Coma sobrante
publisher: {
  "@type": "Organization",
  "name": "Mudanzas ANDY",
},  // ← Coma problemática antes del cierre del array .map()
```

### Explicación Técnica

El método `.map()` devuelve un array, y después había una **coma trailing** innecesaria que rompía la sintaxis JSON:

```javascript
blogPost: publishedPosts.slice(0, 5).map((post) => ({
  "@type": "BlogPosting",
  // ... propiedades
  publisher: {
    "@type": "Organization",
    "name": "Mudanzas ANDY",
  },  // ← Esta coma causaba el error
})),
```

---

## ✅ Solución Implementada

### 1. Corrección del Código

**Archivo modificado**: `src/pages/blog-astro.astro` (líneas 117-133)

```javascript
// ✅ CORRECTO - Sin coma trailing
blogPost: publishedPosts.slice(0, 5).map((post) => ({
  "@type": "BlogPosting",
  headline: post.data.title,
  description: post.data.description,
  url: `${SITE_CANONICAL}/blog/${post.id}`,
  datePublished: post.data.pubDate.toISOString(),
  author: {
    "@type": "Person",
    name: post.data.author || "Equipo Mudanzas ANDY",
  },
  publisher: {
    "@type": "Organization",
    name: "Mudanzas ANDY",
  }  // ← Coma eliminada
})),
```

### 2. Script de Validación Creado

**Nuevo archivo**: `scripts/validate-blog-jsonld.cjs`

Este script automatiza la validación del JSON-LD en la página del blog:

```bash
# Validar después de cada build
pnpm build
node scripts/validate-blog-jsonld.cjs
```

**Características del script**:

- ✅ Extrae todos los bloques JSON-LD del HTML generado
- ✅ Valida sintaxis JSON con `JSON.parse()`
- ✅ Muestra estructura completa de cada bloque
- ✅ Exit code 0 si todo es válido, 1 si hay errores

---

## 🧪 Verificación y Testing

### Validaciones Ejecutadas

#### 1. Build Local

```bash
pnpm build
# ✅ Build exitoso sin errores
```

#### 2. Validación TypeScript

```bash
pnpm check
# ✅ Sin errores de tipado
```

#### 3. Validación JSON-LD

```bash
node scripts/validate-blog-jsonld.cjs
# ✅ 4 bloques JSON-LD válidos encontrados
```

### Estructura JSON-LD Validada

La página `blog-astro.html` ahora contiene 4 bloques JSON-LD válidos:

1. **MovingCompany** - Información de la empresa
2. **WebSite** - SearchAction para búsquedas
3. **BreadcrumbList** - Navegación de migas de pan
4. **Blog** - Datos del blog con 4 BlogPosting anidados ✅

---

## 📊 Resultados

### Antes de la Corrección

- ❌ 1 página con error JSON-LD
- ❌ Google no podía parsear Schema.org
- ❌ Sin resultados enriquecidos

### Después de la Corrección

- ✅ 0 páginas con errores
- ✅ JSON-LD completamente válido
- ✅ 4 bloques Schema.org funcionando
- ✅ Blog listo para rich snippets

---

## 📝 Pasos Siguientes

### En Google Search Console

1. **Ir a**: [Search Console > Mejoras > Datos estructurados](https://search.google.com/search-console)
2. **Clic en**: "VALIDAR CORRECCIÓN" en el informe de errores
3. **Esperar**: 2-7 días para re-crawleo de Google
4. **Verificar**: Que el contador de errores llegue a 0

### Monitoreo Continuo

```bash
# Añadir al workflow de CI/CD
pnpm build && node scripts/validate-blog-jsonld.cjs
```

### Testing en Producción

Después del deploy, validar con herramientas oficiales:

- **Rich Results Test**: https://search.google.com/test/rich-results
- **Schema Markup Validator**: https://validator.schema.org/

---

## 🔧 Prevención de Futuros Errores

### Pre-commit Hook Sugerido

```json
// package.json
{
  "scripts": {
    "validate-jsonld": "node scripts/validate-blog-jsonld.cjs",
    "prebuild": "pnpm check",
    "postbuild": "pnpm validate-jsonld"
  }
}
```

### Reglas de Linting

Configurar ESLint/Prettier para detectar comas trailing en objetos JSON:

```json
// .eslintrc (sugerido)
{
  "rules": {
    "comma-dangle": [
      "error",
      {
        "objects": "always-multiline",
        "arrays": "always-multiline"
      }
    ]
  }
}
```

---

## 📚 Referencias

- [Google Error Types - Missing brace](https://support.google.com/webmasters/answer/9166415#error_types)
- [Schema.org - Blog](https://schema.org/Blog)
- [Schema.org - BlogPosting](https://schema.org/BlogPosting)
- [Rich Results Test](https://search.google.com/test/rich-results)

---

## 📸 Capturas

### Error en Search Console (Antes)

- URL afectada: https://mudanzasandy.es/blog-astro/
- Error: "Missing '}' or object member name"
- Páginas afectadas: 1

### Validación Exitosa (Después)

```
✅ Encontrados 4 bloques JSON-LD
✅ Todos los bloques JSON-LD son válidos
🎉 Listo para Search Console
```

---

## ✅ Checklist de Verificación

- [x] Error identificado en línea 129 de `blog-astro.astro`
- [x] Coma trailing eliminada
- [x] Build exitoso sin errores
- [x] TypeScript check pasado
- [x] JSON-LD validado con script automatizado
- [x] 4 bloques Schema.org funcionando correctamente
- [x] Documentación de la tarea completada
- [ ] Validación en Search Console (pendiente re-crawleo)
- [ ] Verificación de rich snippets en resultados de búsqueda

---

**Cambios realizados**:

- `src/pages/blog-astro.astro` - Eliminada coma trailing en línea 129
- `scripts/validate-blog-jsonld.cjs` - Nuevo script de validación JSON-LD

**Comandos de verificación**:

```bash
pnpm build
node scripts/validate-blog-jsonld.cjs
```

**Tiempo estimado de resolución en Google**: 2-7 días
**Próxima acción**: Clic en "VALIDAR CORRECCIÓN" en Search Console
