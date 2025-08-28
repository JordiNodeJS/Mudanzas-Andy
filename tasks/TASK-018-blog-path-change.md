# TASK-018-blog-path-change.md

## Descripción

Cambiar la ruta de compilación de la página del blog de `/blog` a `/blog-astro` por temas de compatibilidad.

## Problema

La página del blog necesita compilarse en una carpeta diferente a `blog` para evitar conflictos de compatibilidad.

## Solución Implementada

### 1. Cambio de archivo

- **Archivo origen**: `src/pages/blog.astro`
- **Archivo destino**: `src/pages/blog-astro.astro`

### 2. Actualización de enlaces en Header

- **Navegación desktop**: `href="/blog"` → `href="/blog-astro"`
- **Navegación móvil**: `href="/blog"` → `href="/blog-astro"`

### 3. Verificación de compilación

La compilación ahora genera:

```
▶ src/pages/blog-astro.astro
  └─ /blog-astro/index.html
```

## Archivos Modificados

- `src/pages/blog.astro` → `src/pages/blog-astro.astro` (renombrado)
- `src/components/Header.astro` (actualizados enlaces)

## Testing

- ✅ Compilación exitosa con `pnpm build`
- ✅ Verificado que se genera carpeta `/blog-astro` en dist
- ✅ Verificado que NO se genera carpeta `/blog` en dist
- ✅ Enlaces del header actualizados correctamente

## Resultado

La página del blog ahora se compila en `/blog-astro/` en lugar de `/blog/`, resolviendo los temas de compatibilidad mencionados.

---

**Fecha**: 28 de agosto de 2025  
**Estado**: ✅ Completada  
**Rama**: feat/08-blog-integration
