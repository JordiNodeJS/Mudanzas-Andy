Reglas para IA: Inicialización y re-inicialización de lógica JS en proyectos Astro

Propósito

- Proveer un patrón claro, reproducible y seguro para que la IA implemente lógica de cliente en proyectos Astro que usan view transitions.
- Evitar bugs comunes: listeners duplicados, memory leaks, animaciones que no se reinician, código que sólo funciona en carga inicial.

Resumen rápido (patrón):

1. Implementar funciones `initX()` idempotentes que siempre limpian su estado previo.
2. Proveer `cleanupX()` que remueva listeners, timers y referencias.
3. Ejecutar la inicialización en `DOMContentLoaded` y también en `astro:after-swap`.
4. Guardar referencias a handlers para poder removerlos (atributos en elementos o WeakMap).
5. Reiniciar animaciones CSS con remove-class → force reflow → add-class.
6. Documentar test end-to-end (Playwright) que valide re-inicialización tras navegación.

Reglas detalladas

1. Estructura mínima recomendada

- Cada componente JS debe exportar o contener al menos 3 piezas:
  - `init<ComponentName>()` — crea listeners, timers, estado; debe ser idempotente.
  - `cleanup<ComponentName>()` — elimina listeners, clearTimeout/clearInterval, quita data-\* o propiedades temporales.
  - Un punto de entrada global que llama a `init...` en `DOMContentLoaded` y en `astro:after-swap`.

2. Principios de idempotencia

- `initX()` puede llamarse repetidamente sin añadir listeners duplicados. Primera línea típica:
  - llamar a `cleanupX()` o comprobar y quitar handlers previos.
- No relies en variables globales únicas a menos que se limpién explícitamente.

3. Manejo de listeners

- Nunca añadas un `addEventListener` sin una forma de removerlo. Guarda la referencia al handler:
  - Preferencia 1: `element._onClick = handler; element.addEventListener('click', handler)` y en cleanup usar `removeEventListener` y `delete element._onClick`.
  - Preferencia 2: usar un WeakMap para mapear elemento→handler si no quieres mutar el DOM.

4. Timers y recursos

- Guardar IDs de timers y cancelarlos en `cleanup`.
- Si usas fetch/abortable requests, mantener AbortController y abort en cleanup.

5. View Transitions: cuándo usar `astro:after-swap`

- Escuchar `astro:after-swap` y volver a correr `initAll()` (o `initX`) para reactivar comportamiento después de navigaciones cliente-cliente.
- Ejemplo:
  ```js
  document.addEventListener("DOMContentLoaded", initAll);
  document.addEventListener("astro:after-swap", () => {
    cleanupAll();
    initAll();
  });
  window.addEventListener("beforeunload", cleanupAll);
  ```
- Nota: `astro:after-swap` se dispara una vez por swap; no reemplaza a `DOMContentLoaded`.

6. Reinicio de animaciones CSS

- Para reiniciar animaciones que usan clases CSS:
  - `node.classList.remove('anim-class');`
  - `void node.offsetWidth; // fuerza reflow`
  - `node.classList.add('anim-class');`
- Documentar que algunos frameworks de CSS-in-JS requieren variantes específicas.

7. Accesibilidad y UX

- Si añades modales/popup: controlar foco, trap focus opcional, restaurar foco en cleanup.
- No cerrar modales si el usuario está escribiendo (mantén la protección existente), pero documenta la razón.

8. Logging y modo dev

- Añadir un `if (import.meta.env.DEV)` log al init para facilitar debugging: `console.debug('Init X')`.
- Evitar logs en producción salvo errores críticos.

9. Patrones anti-errores

- Evitar definir funciones globales en `window` salvo cuando sea estrictamente necesario.
- Evitar usar `document.getElementById(...)?.addEventListener(...)` sin un cleanup porque no hay referencia al handler.
- Siempre usar referencias para `removeEventListener`.

10. Tests recomendados (Playwright)

- E2E que navegue entre páginas (hacer click en enlaces que usan view transitions) y verifique que:
  - Los listeners siguen funcionando después del swap.
  - Las animaciones se reinician (ver clase CSS o atributo `data-animated`).
  - Popups/modales pueden cerrarse por overlay y por botones después de la navegación.
- Sugerencia: añadir un pequeño helper test que simule `astro:after-swap` comportamiento haciendo una navegación interna y ejecutando comprobaciones.

11. Template de implementación (boilerplate)

```js
// ...existing code...
let timers = [];
const handlerMap = new WeakMap();

function initComponent() {
  cleanupComponent();
  const btn = document.getElementById("my-btn");
  if (!btn) return;

  const onClick = (e) => {
    /* ... */
  };
  btn.addEventListener("click", onClick);
  handlerMap.set(btn, onClick);

  const t = setTimeout(() => {
    /*...*/
  }, 1000);
  timers.push(t);
}

function cleanupComponent() {
  // remove listeners stored in WeakMap
  for (const [el, handler] of handlerMap.entries ? handlerMap.entries() : []) {
    try {
      el.removeEventListener("click", handler);
    } catch (e) {}
  }
  handlerMap = new WeakMap();

  // clear timers
  while (timers.length) clearTimeout(timers.pop());
}

function initAll() {
  initComponent();
  // initOther();
}

document.addEventListener("DOMContentLoaded", initAll);
document.addEventListener("astro:after-swap", () => {
  cleanupAll();
  initAll();
});
window.addEventListener("beforeunload", cleanupAll);
```

12. Checklist corto para la IA antes de proponer cambios

- [ ] ¿Hay un `cleanup` para cada `init`? Si no, añadirlo.
- [ ] ¿Se guardan referencias a handlers y timers? Si no, refactorizar.
- [ ] ¿Se re-inicializa tras `astro:after-swap`? Si no, añadir listener.
- [ ] ¿Se usan logs solo en dev? Si no, reducir.
- [ ] ¿Se restauran foco/estado en modales? Si aplica, implementar.
- [ ] ¿Se añadieron pruebas E2E básicas (Playwright)? Si no, proponer tests.

Cómo usar este archivo

- Cada PR que cambie comportamiento cliente JS debe seguir este patrón y referenciar este documento en la descripción.
- La IA que autorreeplene código o que genere componentes debe aplicar las reglas en cada `init` JS que cree.

Fin del documento.
