# TASK-GSC-01: Optimización Google Search Console Issues

## Fecha: 10 de septiembre de 2025

## Estado: En Progreso

## 🎯 Objetivo

Resolver los 4 problemas identificados en Google Search Console para mejorar la indexación.

## 🔍 Problemas Identificados

### ✅ RESUELTOS

- **Duplicadas sin canonical**: 0 páginas (YA SOLUCIONADO)
- **Sistema canonical**: Funcionando correctamente

### ⚠️ PENDIENTES

- **3 Páginas con redirección**: Optimizar `_redirects`
- **8 Páginas sin indexar**: Investigar y limpiar

## 📋 Plan de Implementación

### Paso 1: Optimizar Redirecciones ⚡

- [x] Reemplazar `public/_redirects` por versión simplificada
- [x] Eliminar redirecciones innecesarias (`/index-new/`, `/contacto`, `/servicios`)
- [x] Mantener solo redirecciones esenciales (HTTPS, www)
- [x] Probar redirecciones localmente

### Paso 2: Investigar Páginas No Indexadas 🔍

- [ ] Obtener lista específica de URLs desde GSC
- [ ] Verificar si son recursos que no deben indexarse (CSS, JS, imágenes)
- [ ] Actualizar `robots.txt` si es necesario
- [ ] Revisar que páginas importantes estén en sitemap

### Paso 3: Validación y Monitoreo 📊

- [ ] Desplegar cambios en producción
- [ ] Solicitar re-indexación en GSC
- [ ] Monitorear métricas en 7-14 días
- [ ] Documentar resultados

## 🔧 Archivos a Modificar

### 1. `public/_redirects` (OPTIMIZAR)

```
# Versión actual: 9 redirecciones
# Versión optimizada: 3 redirecciones esenciales
```

### 2. `public/robots.txt` (REVISAR)

```
# Verificar que no bloquee páginas importantes
# Asegurar que permite crawling de contenido principal
```

## 📈 Métricas de Éxito

### Objetivo 1 Semana:

- ✅ 3 → 0 páginas con redirección
- ✅ 8 → 4 máximo páginas sin indexar
- ✅ Mantener 0 duplicadas

### Objetivo 2 Semanas:

- ✅ 100% páginas principales indexadas
- ✅ Tiempo de indexación mejorado
- ✅ Sin warnings en GSC

## 🚀 Comandos de Verificación

```bash
# Build y verificar URLs generadas
pnpm build
find dist/ -name "*.html"

# Verificar sitemap
cat dist/sitemap.xml

# Probar redirecciones localmente
pnpm preview
```

## 📝 Notas

- **Canonical está correcto**: Cada página debe tener su propia URL canonical
- **4 páginas reales**: index, blog-astro, politica-privacidad, politica-cookies
- **Sistema robusto**: La configuración SEO actual es sólida

## ⚡ Próximos Pasos

1. Implementar `_redirects` optimizado
2. Desplegar y solicitar re-indexación
3. Monitorear GSC durante 2 semanas
4. Documentar mejoras obtenidas
