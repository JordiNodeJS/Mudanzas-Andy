# TASK-020: Solución Problemas de Indexación Google Search Console

## Fecha: 3 de septiembre de 2025

## Problemas Identificados

### 1. Duplicada: el usuario no ha indicado ninguna versión canónica

- **Causa**: Existen dos archivos de página principal:
  - `src/pages/index.astro` (con SEO optimizado)
  - `src/pages/index-new.astro` (sin SEO específico)
- **Impacto**: Google no sabe cuál es la versión oficial
- **URLs afectadas**:
  - `https://mudanzasandy.es/`
  - `https://mudanzasandy.es/index-new/`

### 2. Página con redirección

- **Causa**: Posible redirección HTTP no identificada
- **Investigar**: Configuración de servidor, \_headers, \_redirects

## Soluciones a Implementar

### Paso 1: Eliminar Contenido Duplicado

- [x] Eliminar `src/pages/index-new.astro` (archivo duplicado)
- [x] Mantener solo `src/pages/index.astro` (versión con SEO)
- [x] Verificar que no haya referencias al archivo eliminado

### Paso 2: Configurar Sitemap Automático

- [x] Añadir integración `@astrojs/sitemap` a astro.config.mjs
- [x] Configurar generación automática de sitemap
- [x] Actualizar sitemap.xml con todas las páginas válidas

### Paso 3: Verificar URLs Canónicas

- [x] Revisar que todas las páginas tienen canonical correcto
- [x] Asegurar que no hay conflictos de URLs
- [x] Validar estructura de URLs consistente

### Paso 4: Configurar Redirects (si necesario)

- [x] Crear archivo `public/_redirects` para Netlify/Hostinger
- [x] Añadir redirects para URLs obsoletas si las hay
- [x] Configurar redirects HTTP → HTTPS

### Paso 5: Validación y Testing

- [x] Probar build local
- [x] Verificar sitemap generado
- [x] Comprobar URLs canónicas
- [ ] Enviar sitemap actualizado a Google Search Console

## Archivos Modificados

1. ✅ `astro.config.mjs` - Añadida sitemap integration
2. ✅ `src/pages/index-new.astro` - ELIMINADO
3. ✅ `public/sitemap.xml` - Actualizado automáticamente
4. ✅ `public/_redirects` - Creado con redirects SEO
5. ✅ `src/pages/politica-privacidad.astro` - Canonical corregido
6. ✅ `src/pages/politica-cookies.astro` - Canonical corregido
7. ✅ `src/pages/blog-astro.astro` - Canonical añadido

## Resultado Conseguido

- ✅ **ELIMINADO** problema de contenido duplicado
- ✅ **URLs canónicas** claras para Google en todas las páginas
- ✅ **Sitemap automático** generado con 4 páginas válidas:
  - `https://mudanzasandy.es/`
  - `https://mudanzasandy.es/blog-astro/`
  - `https://mudanzasandy.es/politica-cookies/`
  - `https://mudanzasandy.es/politica-privacidad/`
- ✅ **Redirects configurados** para prevenir futuros problemas
- ✅ **Build exitoso** sin errores

## Resultado Esperado

- ✅ Eliminar problemas de contenido duplicado
- ✅ URLs canónicas claras para Google
- ✅ Sitemap automático y actualizado
- ✅ Mejora en indexación de Google Search Console

## Prioridad: ALTA ✅ COMPLETADA

**Impacto SEO crítico** - Problemas de indexación resueltos

## Pasos Siguientes para el Usuario

1. **Subir cambios al servidor de producción**
2. **Ir a Google Search Console**
3. **Enviar nuevo sitemap**: `https://mudanzasandy.es/sitemap-index.xml`
4. **Solicitar indexación** de la página principal
5. **Monitorear** durante 48-72 horas los cambios en Search Console

## Notas Técnicas

- El sitemap se regenera automáticamente en cada build
- Los redirects evitarán problemas futuros de URLs duplicadas
- Todas las páginas tienen canonical URLs apropiadas
- La estructura SEO está optimizada para indexación
