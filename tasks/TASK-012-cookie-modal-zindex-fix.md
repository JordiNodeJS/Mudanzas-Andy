# TASK-012: Corrección de z-index del modal de cookies

## Descripción

Se ha corregido el problema donde el footer se superponía al modal de configuración de cookies en la página `/politica-cookies`.

## Problema Identificado

- El footer tenía un `z-index: 20001` muy alto que hacía que se superpusiera al modal de cookies
- El modal de cookies tenía un `z-index: 10000` insuficiente
- Esto impedía la interacción correcta con el modal

## Solución Implementada

### Cambios en Footer.astro

```diff
- style="position: relative; z-index: 20001;"
+ style="position: relative; z-index: 1;"
```

### Cambios en CookieBanner.astro

```diff
- class="fixed inset-0 bg-black bg-opacity-50 z-[10000] hidden"
+ class="fixed inset-0 bg-black bg-opacity-50 z-[50000] hidden"
```

## Verificación con Playwright

- ✅ Modal se abre correctamente desde el botón "Configurar Cookies" del footer
- ✅ Modal está por encima del footer (no hay superposición)
- ✅ Todos los botones del modal son accesibles
- ✅ Modal se cierra correctamente con el botón X
- ✅ Screenshot tomado para verificación visual

## Archivos Modificados

- `src/components/Footer.astro` - Reducción de z-index del footer
- `src/components/CookieBanner.astro` - Aumento de z-index del modal
- `src/tests/cookie-modal-zindex.spec.js` - Test de verificación (creado)

## Testing

- URL probada: `http://localhost:4322/politica-cookies`
- Screenshot: `cookie-modal-fix.png`
- Test automatizado: `src/tests/cookie-modal-zindex.spec.js`

## Estado: ✅ COMPLETADO

**Fecha:** 27 de agosto de 2025  
**Branch:** feat/06-cookies  
**Verificado:** Con Playwright y captura de pantalla
