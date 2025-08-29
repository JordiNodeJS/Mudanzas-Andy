# Migración: integrar shadcn/ui con Astro v5 (React + Tailwind)

Guía concisa en español para integrar la última versión estable de shadcn/ui con Astro v5.13.2 usando React y TailwindCSS. Se asume pnpm como gestor (requerido en este repo). Incluye ejemplo de Button con hidratación parcial.

---

## 1) Requisitos previos

- Node >= v24.6.0
- pnpm instalado (requerido)
- Astro v5.13.2 (o compatible)
- Familiaridad mínima con React y Tailwind

---

## 2) Crear proyecto Astro con React y Tailwind (pasos)

1. Crear proyecto con pnpm:

```bash
pnpm create astro@latest my-app
cd my-app
```

2. Añadir React y la integración de Astro para React:

```bash
pnpm add react react-dom
pnpm add -D @astrojs/react
```

Añade la integración en `astro.config.mjs` (si el _scaffolder_ no lo hizo):

```js
// ...existing code...
import react from "@astrojs/react";

export default {
  // ...existing config...
  integrations: [
    // ...other integrations...
    react(),
  ],
};
```

3. Instalar Tailwind (usando pnpm):

```bash
pnpm add -D tailwindcss postcss autoprefixer
pnpm dlx tailwindcss init -p
```

4. Añade el CSS base (ej. `src/styles/global.css`) y registra en tu layout/entry:

```css
@import "tailwindcss/preflight";
@tailwind utilities;

/* Importante: no hardcodear colores, use variables del sistema de colores del repo */
```

---

## 3) tsconfig.json (aliases)

Ejemplo mínimo para que los imports usen `@/components` y `@/lib` (respeta convención del repo):

```json
{
  "compilerOptions": {
    // ...existing options...
    "baseUrl": ".",
    "paths": {
      "@/components/*": ["src/layouts/components/*"],
      "@/lib/*": ["src/lib/*"]
    }
  }
}
```

---

## 4) Instalar e inicializar shadcn/ui (CLI)

Recomendación del repo: usar pnpm dlx. Si insistes en npx, lo dejo como alternativa.

- Con pnpm (recomendado):

```bash
pnpm dlx shadcn init
pnpm dlx shadcn add button
```

- Alternativa (npx):

```bash
npx shadcn init
npx shadcn add button
```

El comando `init` creará la estructura `src/components/ui` y modificará (según opción) tu `tailwind.config`/archivos. `add` añade el componente solicitado.

---

## 5) Ajustes en tailwind.config.ts

Asegúrate de incluir las rutas donde shadcn coloca componentes para que Tailwind purgue/compile las clases:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx}",
    "./src/components/**/*.{ts,tsx,js,jsx,astro}", // shadcn components
    // Opcional si usas paquetes externos
    // './node_modules/@some-package/**/*.{js,ts,tsx,jsx}'
  ],
  theme: {
    extend: {
      // ...existing theme...
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    // require('tailwindcss-animate'), // opcional si lo usas
  ],
};

export default config;
```

Notas:

- No hardcodees colores; usa el sistema de variables definido en el repo (`src/styles/theme.css`).
- Si `shadcn init` propone cambios, revisa y adapta al layout de tu repo.

---

## 6) Ejemplo: usar Button (React) en una página .astro

1. Estructura típica del componente generado por shadcn:

- `src/components/ui/button.tsx` (o .jsx/.tsx según tu setup)

2. Importarlo y usarlo en `src/pages/index.astro` con hidratación parcial:

```astro
---
// src/pages/index.astro
import Button from '@/components/ui/button'; // alias según tsconfig
---
<html lang="es">
  <head>...</head>
  <body>
    <main class="container">
      <!-- Hidratación parcial: client:load (cargar en cliente al inicio) -->
      <Button client:load>Haz clic</Button>
    </main>
  </body>
</html>
```

Consejo: usa `client:idle` o `client:visible` cuando la interacción no sea inmediata para mejorar el rendimiento.

---

## 7) Optimizar la carga parcial de React en Astro

- Hidratación mínima: solo hidrata los componentes interactivos.
  - `client:load` — hidrata lo antes posible.
  - `client:idle` — hidrata cuando el navegador está inactivo.
  - `client:visible` — hidrata cuando el componente entra en viewport.
- Evita hidratar layouts completos; envolver solo el componente que necesita JS.
- Lazy-load para componentes pesados (dynamic import en React si hace falta).
- Usa `pnpm build` y `pnpm preview` para verificar el tamaño del bundle y la experiencia SSG.

---

## 8) Comandos finales (desarrollo y test)

```bash
pnpm install --frozen-lockfile
pnpm dev       # desarrollo (puerto por defecto del proyecto)
pnpm build     # generar sitio estático
pnpm preview   # probar build localmente
pnpm check     # chequear TypeScript (según scripts del repo)
```

---

## 9) Referencias rápidas y notas finales

- Preferir `pnpm dlx shadcn ...` en este repo.
- Revisa `src/styles/theme.css` para usar las variables RGB del sistema de colores (no hardcodear).
- Añade rutas de `src/components` a `tailwind.config.ts` para que las utilidades de shadcn se compilen.
- Mantén `tsconfig` y aliases coherentes con la convención del repo.

## 9.1) Adaptar el prompt cuando ya existen componentes Astro y estilos

Resumen corto:

- Antes de ejecutar cualquier generador, realiza una auditoría de los componentes actuales y el sistema de estilos.
- El prompt usado por herramientas/AI debe instruir claramente que NO sobrescriba componentes existentes; en su lugar debe proponer extensiones o variantes y mapear las clases al sistema de colores centralizado.

Checklist previo a generar:

1. Lista de componentes existentes (ruta + propósito).
2. Revisión de `src/styles/theme.css` para usar variables RGB (no colores hardcodeados).
3. Asegurar que `tailwind.config.ts` incluya `src/components` para purge.
4. Crear rama/backup antes de ejecutar `pnpm dlx shadcn ...`.

Ejemplo de fragmento para incluir en `mcp-tools.prompt` (uso por la AI / generadores):

- Objetivo: "Cuando generes o modifiques componentes shadcn, verifica la existencia de componentes similares en `src/layouts/components` o `src/components/ui`. No sobrescribas. Propón una variante con sufijo `-shadcn` o un wrapper que reutilce los estilos existentes."
- Reglas obligatorias:
  - Usa aliases (`@/...`) para imports.
  - No introducir colores hardcodeados; usa las variables de `src/styles/theme.css` (ej.: `rgba(var(--color-primary), 0.8)`).
  - Si el componente necesita gradientes, usa `gradientClassMap` y clases del sistema (`contact-card-gradient-*`, `badge-gradient-primary`, etc.).
  - Para componentes React que requieran interactividad, añadir la directiva de Astro adecuada (`client:load`, `client:idle`, `client:visible`), prefiriendo la mínima necesaria.
  - Añadir rutas nuevas a `tailwind.config.ts` si se crean archivos en ubicaciones no contempladas.
- Propuesta de mensaje de respuesta por la AI cuando detecte conflicto:
  - "He detectado un componente existente en {ruta}. No lo sobrescribiré. Propongo crear {ruta-nueva} que extienda {ruta} y mapear clases: {mapa}. ¿Procedo?"

Ejemplo práctico (snippet que la AI debe insertar al migrar un Button):

- Verificar `src/layouts/components/Button.astro`:
  - Si existe: crear `src/components/ui/Button-shadcn.tsx` que envuelva el Button Astro o reutilice sus utilidades tailwind.
  - Actualizar `src/pages/index.astro` reemplazando import directo por:
    - Si se usa el nuevo componente React: <ButtonShadcn client:idle />
    - Mantener los atributos accesibles y documentar el cambio en `src/tasks/progress.md`.

Notas finales:

- Ejecuta los generadores con `pnpm dlx` en una rama y revisa los cambios antes de merge.
- Actualiza `src/tasks/progress.md` con la lista de componentes migrados y decisiones tomadas.

---

## 10) Referencia: mcp-tools.prompt

- El prompt `mcp-tools.prompt` contiene convenciones, plantillas y pautas de generación que deben seguirse al crear o modificar componentes y tareas.
- Ubicación recomendada: `.github/prompts/mcp-tools.prompt` — consúltalo antes de ejecutar generadores o aceptar cambios automatizados.
- Uso recomendado:
  - Leer el prompt antes de ejecutar herramientas de scaffolding (por ejemplo, `pnpm dlx shadcn ...`) para garantizar consistencia con las reglas del repo.
  - Referenciarlo en PRs, descripciones de tareas y workflows de CI como fuente de verdad para estilos, convenciones y comandos.
- Ejemplo de nota para workflows/scripts:
  - "Antes de ejecutar el generador, consulte `.github/prompts/mcp-tools.prompt` y use `pnpm dlx` para ejecuciones puntuales."
- Mantén el prompt sincronizado con la documentación en `src/tasks/progress.md` y cualquier plantilla usada por los desarrolladores.
