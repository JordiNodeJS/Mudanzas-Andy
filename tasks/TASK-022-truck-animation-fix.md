# TASK-022: Reparación de la Animación del Icono del Camión y Menú Móvil

## Descripción del Problema

1. **Animación del camión**: Se quedaba atascada al principio cuando el usuario navegaba desde la página principal al blog
2. **Menú hamburguesa**: Dejó de funcionar después de las modificaciones del script, especialmente en navegaciones con view transitions

## Causa Identificada

1. **Clases CSS faltantes**: Las clases `truck-enter` y `truck-drive` no estaban definidas en CSS
2. **Script sin reset**: La animación no se reseteaba correctamente en navegaciones con view transitions
3. **Falta de listener para view transitions**: No se re-ejecutaba la animación después de las transiciones de Astro
4. **Menú móvil no reinicializado**: La funcionalidad del menú hamburguesa solo se inicializaba en `DOMContentLoaded`, no en view transitions

## Solución Implementada

### 1. Clases CSS de Animación (components.css)

Añadidas las clases faltantes:

```css
.truck-enter {
  transform: translateX(-100%);
  opacity: 0;
  transition: transform 1.2s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.8s
      ease-out;
}

.truck-drive {
  transform: translateX(0);
  opacity: 1;
}
```

### 2. Script Completamente Refactorizado (Header.astro)

**Funciones modulares separadas:**

- `initTruckAnimation()`: Maneja la animación del camión con reset completo
- `initMobileMenu()`: Inicializa el menú hamburguesa, evitando event listeners duplicados
- `initSmoothScroll()`: Maneja la navegación suave entre secciones
- `initScrollHighlighting()`: Destaca la sección activa en el scroll
- `initAllHeaderFunctionality()`: Función principal que ejecuta todas las inicializaciones

**Mejoras clave:**

- **Reset completo**: Elimina clases anteriores antes de aplicar nuevas
- **Reflow forzado**: Asegura que el reset se aplique antes de la animación
- **Event listeners sin duplicados**: Usa `replaceWith()` y `removeEventListener()` para evitar acumulación
- **Compatibilidad con view transitions**: Se ejecuta tanto en `DOMContentLoaded` como en `astro:page-load`
- **Fallback robusto**: Manejo de errores mejorado para todas las funcionalidades

## Archivos Modificados

- `src/styles/components.css`: Añadidas clases de animación del camión
- `src/components/Header.astro`: Script completamente refactorizado con funciones modulares

## Verificación

- [x] Clases CSS definidas correctamente
- [x] Script refactorizado con funciones modulares
- [x] Listener para view transitions añadido
- [x] Menú hamburguesa funcional en view transitions
- [x] Prevención de event listeners duplicados
- [ ] Prueba de navegación principal → blog
- [ ] Prueba de navegación blog → principal
- [ ] Verificación en móvil y desktop

## Comprobaciones Playwright

### DOM Assertions

```javascript
// Verificar que las clases se aplican correctamente
await expect(page.locator("#truck-logo")).toHaveClass(/truck-drive/);
await expect(page.locator("#truck-logo")).not.toHaveClass(/truck-enter/);

// Verificar que el atributo data-animated se establece
await expect(page.locator("#truck-logo")).toHaveAttribute(
  "data-animated",
  "true"
);
```

### Navegación y Animación

```javascript
// Navegar de inicio a blog y verificar reset de animación
await page.goto("/");
await page.waitForLoadState("networkidle");
await page.click('a[href="/blog-astro"]');
await page.waitForTimeout(200); // Esperar a que se complete la animación
await expect(page.locator("#truck-logo")).toHaveClass(/truck-drive/);
```

## Estado

- **Estado**: ✅ Implementado
- **Fecha**: 2025-01-29
- **Siguiente**: Pruebas visuales y verificación en diferentes navegadores

## Comandos de Prueba

```bash
# Ejecutar pruebas Playwright específicas para animaciones
pnpm exec playwright test --grep "truck animation"

# Desarrollo con recarga automática
pnpm dev
```
