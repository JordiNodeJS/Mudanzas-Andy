# TASK-012: Arreglo del Routing del Blog en Producción

## Estado: ✅ COMPLETADO

## Problema Identificado

**Síntoma**: Las entradas del blog funcionan en desarrollo pero fallan en producción (sitio desplegado).
- En desarrollo: Enlaces como `/blog/mudanza-con-ninos-guia-familias` funcionan correctamente
- En producción: Los mismos enlaces redirigen incorrectamente a `/blog-astro/`

## Análisis Exhaustivo Realizado

### 1. ✅ Estructura de Routing Analizada
- Página dinámica: `src/pages/blog/[slug].astro` ✓
- Función `getStaticPaths()` correcta ✓
- Content Collections configuradas correctamente ✓

### 2. ✅ Build y Generación de Rutas
- Build genera correctamente los archivos HTML:
  - `/blog/mudanzas-internacionales-barcelona-guia-completa.html`
  - `/blog/mudanzas-economicas-barcelona-2025.html`
  - `/blog/guia-embalaje-profesional-mudanzas.html`  
  - `/blog/mudanza-con-ninos-guia-familias.html`

### 3. ✅ Enlaces en Componentes
- `BlogPostCard.astro` genera URLs correctas: `const postUrl = \`/blog/\${post.id}\``
- Enlaces en componentes funcionan apropiadamente

### 4. 🔍 **CAUSA RAÍZ ENCONTRADA**: Redirect Comodín en `_redirects`

**Problema en `public/_redirects`:**
```bash
# ❌ INCORRECTO - Intercepta TODAS las rutas del blog
/blog/* /blog-astro/ 301
```

**Flujo del Error:**
1. Usuario hace clic en `/blog/mudanza-con-ninos-guia-familias`
2. En desarrollo: Astro maneja dinámicamente ✅
3. En producción: El servidor aplica el redirect ANTES de que Astro procese ❌
4. Resultado: `/blog/mudanza-con-ninos-guia-familias` → `/blog-astro/`

## Solución Implementada

### Cambio en `public/_redirects`:
```bash
# ✅ CORRECTO - Solo redirige la ruta raíz del blog
/blog /blog-astro/ 301
```

**Diferencia crítica:**
- `❌ /blog/*` = Intercepta TODO bajo /blog/ (incluyendo entradas)  
- `✅ /blog` = Solo intercepta la ruta exacta /blog

## Verificación

### Build Test:
```bash
$ pnpm build --force
✓ Completed - 8 page(s) built in 3.18s
```

### Rutas Generadas Correctamente:
- ✅ `/blog/mudanzas-internacionales-barcelona-guia-completa.html`
- ✅ `/blog/mudanzas-economicas-barcelona-2025.html`
- ✅ `/blog/guia-embalaje-profesional-mudanzas.html`
- ✅ `/blog/mudanza-con-ninos-guia-familias.html`

## Resultado Esperado en Producción

**Ahora debería funcionar:**
1. `/blog` → Redirige a `/blog-astro/` (comportamiento deseado)
2. `/blog/entrada-especifica` → Sirve la entrada del blog (arreglado)
3. Todos los enlaces del blog desde `blog-astro.astro` ahora funcionarán en producción

## Archivos Modificados

- ✅ `public/_redirects` - Cambio de comodín por redirect específico

## Testing Recomendado Post-Deploy

1. Verificar que `/blog` redirige a `/blog-astro/`
2. Confirmar que `/blog/mudanza-con-ninos-guia-familias` carga correctamente
3. Probar todos los enlaces del blog desde la página índice
4. Verificar que los redirects HTTPS y www siguen funcionando

## Lecciones Aprendidas

- Los redirects comodín (`/*`) en hosting estático se aplican ANTES del procesamiento de Astro
- En sitios SSG, los redirects del servidor tienen precedencia sobre las rutas dinámicas
- Siempre usar redirects específicos en lugar de comodines cuando sea posible
- El comportamiento dev vs producción puede diferir significativamente con redirects de servidor

---
**Fecha**: 11 de octubre de 2025  
**Tiempo invertido**: ~45 minutos  
**Complejidad**: Media (problema específico de deployment SSG)