# Reglas Generales

### Uso obligatorio de pnpm y pnpm dlx

- pnpm es el gestor de paquetes requerido: no usar npm ni yarn en este repo.
- En CI y scripts de build usar:
  - `pnpm install --frozen-lockfile` (evita cambios no intencionados en el lockfile)
  - `pnpm build`, `pnpm test`, `pnpm check`, etc. (usar scripts definidos en package.json)
- Uso recomendado de pnpm dlx:
  - Emplear `pnpm dlx <tool>` solo para ejecuciones puntuales en desarrollo (p. ej. generadores, scaffolding).
  - Evitar `pnpm dlx` dentro de scripts repetidos o CI porque instala paquetes temporalmente cada vez; en su lugar, añadir la herramienta a devDependencies y ejecutar con `pnpm exec <tool>` o con un script de package.json para trazabilidad y velocidad.
- Recomendaciones de seguridad y rendimiento:
  - Definir la versión mínima de pnpm en package.json (campo `engines`) o en .npmrc para uniformidad entre desarrolladores y CI.
  - Aprovechar la cache/almacén de pnpm en CI para acelerar builds.
  - No instalar paquetes globalmente; preferir dependencias del proyecto para evitar diferencias entre entornos.

### Sistema de Colores Centralizado - REGLA CRÍTICA

⚠️ **NUNCA usar colores hardcodeados** - Seguir estrictamente el sistema centralizado definido en `.github/docs/COLOR-SYSTEM-RULES.md`

#### Variables CSS como Fuente de Verdad:

- **Definición**: Todas las variables en `src/styles/theme.css` formato RGB: `--color-primary: 38 78 112`
- **Uso en CSS**: `rgba(var(--color-primary), 0.8)` para opacidades, `rgb(var(--color-primary))` para sólidos
- **Gradientes**: Definir en `src/styles/components.css` usando variables CSS únicamente
- **Tailwind temporal**: Utilidades directas en `src/styles/global.css` hasta migración completa

#### Paleta Oficial Mudanzas ANDY:

```css
--color-primary: 38 78 112; /* #264e70 - Azul corporativo */
--color-secondary: 103 145 134; /* #679186 - Verde complementario */
--color-accent: 249 180 171; /* #f9b4ab - Rosa coral CTA */
--color-highlight: 250 227 96; /* #fae360 - Amarillo destacados */
--color-neutral: 187 212 206; /* #bbd4ce - Verde neutro */
```

#### Implementación en Componentes:

- **Mapeo automático**: Usar `gradientClassMap` en lugar de props de color
- **Clases del sistema**: `.contact-card-gradient-*`, `.badge-gradient-primary`, `.icon-bg-theme`
- **Prohibido**: Estilos inline, colores en props, valores hardcodeados

### Tareas

- Haz un seguimiento de las tareas en la carpeta `src/tasks` de este repositorio.
- Crea nuevas tareas según sea necesario.
- Marca las tareas como completadas cuando termines.
- Mantén la documentación actualizada.
- Revisa y actualiza las dependencias regularmente.
- Sincroniza el progreso en el archivo `src/tasks/progress.md`.

# Reglas de Cursor para Astro

Estas reglas guían a la AI de Cursor en este repositorio `pinwheel-astro` para producir código consistente, seguro y alineado con las mejores prácticas de Astro 5, Tailwind CSS 4 y el stack moderno de desarrollo web. Mantén estas prácticas en cada cambio.

## Stack Tecnológico y Versiones

### Framework Principal

- **Astro**: 5.x (Vite 7) con integraciones `@astrojs/react`, `@astrojs/mdx`, `@astrojs/sitemap` y `astro-auto-import`
- **UI**: Tailwind CSS 4 con plugin `@tailwindcss/vite` y Bootstrap Grid System personalizado
- **Tipado**: TypeScript estricto (`extends: "astro/tsconfigs/strict"`)
- **Contenido**: `astro:content` v5 (Content Layer API) con colecciones en `src/content` y esquemas en `src/content.config.ts`
- **Gestión de paquetes**: PNPM (requerido) - NO uses npm o yarn
- **Fuentes**: `astro-font` para optimización automática de fuentes
- **Analytics**: `@digi4care/astro-google-tagmanager` controlado por `src/config/config.json`

### Arquitectura de Renderizado

- **Hosting**: Sitio completamente estático (SSG) - puede subirse a hosting básico como Hostinger
- **Componentes React**: Se hidratan en cliente con directivas apropiadas (`client:*`)
- **Sin SSR**: No usa `output: 'server'` ni adaptadores de servidor

## Estructura y Convenciones de Archivos

### Organización de Directorios

```
src/
├── pages/           # Rutas de Astro (file-based routing)
├── layouts/         # Layouts base y componentes de layout
│   ├── components/  # Componentes Astro reutilizables
│   ├── partials/    # Header, Footer, CTA
│   └── shortcodes/  # Componentes MDX auto-importados
├── content/         # Colecciones de contenido (blog, careers, etc.)
├── lib/             # Utilidades y helpers
├── styles/          # CSS layers y utilidades personalizadas
└── config/          # Archivos de configuración JSON
```

### Alias de Importación (tsconfig.json)

SIEMPRE usa estos alias en lugar de rutas relativas:

- `@/components/*` → `src/layouts/components/*`
- `@/shortcodes/*` → `src/layouts/shortcodes/*`
- `@/partials/*` → `src/layouts/partials/*`
- `@/*` → `src/*`

### Convención de Nomenclatura

- **Archivos**: PascalCase para componentes (`Banner.astro`), kebab-case para utilidades (`text-converter.ts`)
- **Componentes**: Nombres descriptivos y específicos (`BlogPostCard`, `ServiceFeatures`)
- **Variables/funciones**: camelCase con nombres explícitos, evita abreviaturas
- **Constantes**: UPPER_SNAKE_CASE
- **Contenido**: `-index.md(x)` para páginas índice de colección

## Reglas de Codificación TypeScript

### Tipado Estricto

- **NO uses `any`** - usa tipos específicos o `unknown` si es necesario
- **Props en .astro**: Define `interface Props` y desestructura con valores por defecto
- **Content Collections**: Usa `CollectionEntry<"collection">` para props de entrada
- **Funciones exportadas**: Siempre con tipos de retorno explícitos

```astro
---
interface Props {
  title: string;
  description?: string;
  featured?: boolean;
}

// Recommended: use `satisfies Props` so the compiler checks for missing/extra props
const { title, description = "Default description", featured = false } = Astro.props satisfies Props;
---
```

Example - Before / After

Before:

```
---
interface Props {
  title: string
  count?: number
}

const { title, count = 0 } = Astro.props as Props
---
```

After:

```
---
interface Props {
  title: string
  count?: number
}

const { title, count = 0 } = Astro.props satisfies Props
---
```

Note: `satisfies` preserves autocompletion for optional props and lets TypeScript warn when props are missing or extra.

### Importaciones y Módulos

- **Extensiones de archivo**: Incluye `.js` para archivos TypeScript importados
- **Importaciones**: Agrupa por tipo (tipos, utilidades, componentes)
- **Re-exportaciones**: Evita exportaciones masivas (`export *`)

```ts
// Correcto
import { markdownify, plainify } from "@/lib/utils/textConverter.js";
import type { CollectionEntry } from "astro:content";
```

## Astro 5 - Mejores Prácticas

### Content Collections (Content Layer API)

- **Ubicación**: Define colecciones en `src/content.config.ts`
- **Loaders**: Usa `glob()` y `file()` loaders nativos
- **Schemas**: Siempre define schemas con Zod para validación
- **Consultas**: Usa `getCollection()` y `getEntry()` con tipos apropiados

```ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    featured: z.boolean().default(false),
  }),
});
```

### Componentes y Layouts

- **Props tipadas**: Siempre usa interfaces TypeScript para props
- **Layout base**: Usa `src/layouts/Base.astro` como wrapper principal
- **Metadatos**: Pasa `title`, `meta_title`, `description`, `image` cuando sea necesario
- **Slots**: Usa slots nombrados para contenido estructurado

### Islas de React

- **Principio**: Astro renderiza HTML por defecto, usa React SOLO para interactividad
- **Directivas de hidratación**:
  - `client:load` - Para interacción inmediata (formularios críticos)
  - `client:idle` - Para componentes diferibles (widgets)
  - `client:visible` - Para contenido que entra en viewport (carruseles)
- **Importaciones**: Asegúrate que componentes React estén en `layouts/function-components/`

```astro
---
import InteractiveForm from "@/function-components/InteractiveForm.jsx";
---

<InteractiveForm client:load />
```

## Tailwind CSS 4 - Estándares

### Metodología CSS

- **Layers**: Respeta la estructura de `main.css` (@layer base, @layer components)
- **Utilidades**: Prioriza clases utilitarias sobre CSS personalizado
- **Componentes**: Usa `@apply` SOLO en `src/styles/components.css`
- **Variables**: Usa CSS custom properties definidas en `tw-theme.js`
- **Grid**: Sistema híbrido Bootstrap Grid + Tailwind Flex

### Patrones de Clases

```astro
<!-- Contenedor estándar -->
<div class="container">
  <div class="row items-center">
    <div class="lg:col-6">
      <!-- Contenido -->
    </div>
  </div>
</div>

<!-- Botones usando clases componente -->
<a class="btn btn-primary" href="/contact">Contact Us</a>
<a class="btn btn-white btn-sm" href="/learn-more">Learn More</a>
```

### Responsividad y Accesibilidad

- **Mobile-first**: Usa breakpoints progresivos (`sm:`, `md:`, `lg:`, `xl:`)
- **Estados focus**: Siempre incluye estados focus visibles
- **Contraste**: Asegura contraste suficiente (AA mínimo)
- **Semántica**: Usa elementos HTML semánticos apropiados

## Gestión de Contenido y Assets

### Assets e Imágenes

- **Astro Assets**: Usa `astro:assets` (`<Image />`) para imágenes procesables
- **Public assets**: Enlaces absolutos desde `/` para archivos en `public/`
- **Optimización**: Siempre define `width`, `height` y `alt` descriptivo
- **Fuentes**: NO añadas manualmente `<link>` a Google Fonts - usa `AstroFont`

```astro
---
import { Image } from "astro:assets";
---

<Image
  src="/images/hero-banner.png"
  alt="Descripción significativa de la imagen"
  width={800}
  height={400}
  loading="lazy"
/>
```

### Content Collections - Patrones

- **Frontmatter**: Mantén coherencia con el schema definido
- **Referencias**: Usa `reference()` para vincular entre colecciones
- **Filtrado**: Ordena manualmente las colecciones (`getCollection` no garantiza orden)

```astro
---
import { getCollection } from 'astro:content';

const posts = (await getCollection('blog'))
  .filter(post => !post.data.draft)
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
---
```

## Configuración y Personalización

### Archivos de Configuración

- **Centralizada**: Toda la configuración en `src/config/*.json`
- **Tipado**: Define interfaces TypeScript para objetos de configuración
- **Ambiente**: Usa variables de entorno para datos sensibles
- **Cache**: Reutiliza configuraciones, evita lecturas múltiples

### Utilidades y Helpers

- **Reutilización**: Usa utilidades existentes antes de crear nuevas:
  - `markdownify()` - Convierte markdown a HTML inline
  - `plainify()` - Elimina HTML y entities
  - `humanize()` - Formatea strings para mostrar
  - `slugify()` - Genera slugs URL-safe
- **Ubicación**: Nuevas utilidades en `src/lib/utils/`

## Rendimiento y Optimización

### Estrategias de Carga

- **JavaScript mínimo**: Evita hidratar componentes innecesariamente
- **Lazy loading**: Usa `loading="lazy"` en imágenes
- **Critical CSS**: Mantén CSS crítico inline cuando sea necesario
- **Bundle splitting**: Separa dependencias pesadas del cliente

### SEO y Meta Tags

- **Layout Base**: Usa `Base.astro` para metadatos consistentes
- **Open Graph**: Completa metadatos OG/Twitter vía props del layout
- **Canonical URLs**: Define URLs canónicas para evitar contenido duplicado
- **Structured Data**: Añade JSON-LD cuando sea apropiado

## Workflow y Comandos de Desarrollo

### Scripts Disponibles

- **Desarrollo**: `pnpm dev` (puerto 4321)
- **Build**: `pnpm build` (genera carpeta `dist/` estática)
- **Type-check**: `pnpm check` (verifica errores TypeScript)
- **Formato**: `pnpm format` (Prettier con plugins de Astro y Tailwind)
- **Preview**: `pnpm preview` (servidor para probar build)

### Pre-commit Checklist

1. ✅ Ejecuta `pnpm check` - Sin errores TypeScript
2. ✅ Ejecuta `pnpm build` - Build exitoso
3. ✅ Ejecuta `pnpm format` - Código formateado
4. ✅ Verifica alias de importación válidos
5. ✅ Confirma ausencia de `any` no justificado

## Instrucciones Específicas para Cursor AI

### Comunicación

- **Idioma**: Responde SIEMPRE en español en comentarios y descripciones
- **Commits**: Mensajes de commit en inglés usando Conventional Commits
- **Documentación**: Comenta código complejo en español

### Metodología de Edición

- **Conservación**: NO reformatees código existente más allá del cambio necesario
- **Imports**: Usa alias `@/...` en lugar de rutas relativas
- **Reutilización**: Prefiere editar/extender componentes existentes antes que crear nuevos
- **Consistencia**: Mantén el estilo y convenciones del código circundante

### Patrones de Desarrollo

- **Componentes nuevos**: Sigue estructura existente en `layouts/components/`
- **Estilos**: Añade clases a `src/styles/components.css` si es necesario
- **Utilidades**: Extiende utilidades existentes antes de crear nuevas
- **Testing**: Prueba cambios en diferentes breakpoints y navegadores

## Reglas para React/shadcn/ui en Astro - CRÍTICO

### Hidratación de Componentes React - OBLIGATORIO

⚠️ **SINTAXIS CORRECTA**: Usar siempre `client:` (con dos puntos) para directivas de hidratación

#### Directivas de Hidratación Disponibles:

- **`client:load`**: Hidrata inmediatamente al cargar la página

  - Usar para: Formularios críticos, botones de acción principal
  - Ejemplo: `<ContactForm client:load />`

- **`client:idle`**: Hidrata cuando el navegador está inactivo

  - Usar para: Elementos de UI de menor prioridad
  - Ejemplo: `<ToggleButton client:idle />`
  - Con timeout: `<ShowHideButton client:idle={{timeout: 500}} />`

- **`client:visible`**: Hidrata cuando entra en el viewport

  - Usar para: Carruseles, elementos "below the fold"
  - Ejemplo: `<ImageCarousel client:visible />`
  - Con margen: `<HeavyComponent client:visible={{rootMargin: "200px"}} />`

- **`client:media`**: Hidrata según media query

  - Usar para: Componentes responsivos específicos
  - Ejemplo: `<MobileMenu client:media="(max-width: 768px)" />`

- **`client:only`**: Solo renderiza en cliente (requiere framework)
  - Usar para: Componentes que requieren APIs del navegador
  - Ejemplo: `<BrowserOnlyComponent client:only="react" />`

#### Errores Comunes a EVITAR:

- ❌ `client="load"` (incorrecto - usa comillas)
- ❌ `client="idle"` (incorrecto - usa comillas)
- ✅ `client:load` (correcto - usa dos puntos)
- ✅ `client:idle` (correcto - usa dos puntos)

### shadcn/ui Componentes - Patrones Obligatorios

#### Estructura de Componentes React:

```tsx
// src/components/ui/Button.tsx
import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children: React.ReactNode;
}

export function Button({
  variant = "default",
  size = "default",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "btn-base-styles",
        variant === "destructive" && "btn-destructive",
        variant === "outline" && "btn-outline",
        size === "sm" && "btn-sm",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

#### Uso en Componentes Astro:

```astro
---
// src/pages/ejemplo.astro
import { Button } from '@/components/ui/Button';
---

<!-- Para componentes interactivos -->
<Button variant="destructive" client:load>
  Enviar Formulario
</Button>

<!-- Para componentes estáticos (mejor rendimiento) -->
<Button variant="outline">
  Link Estático
</Button>
```

#### Props y Variantes:

- **SIEMPRE** define interfaces TypeScript para props
- **SIEMPRE** usa valores por defecto para props opcionales
- **SIEMPRE** incluye `className` prop para personalización
- **SIEMPRE** usa `cn()` utility para combinar clases

#### Estados y Interactividad:

```tsx
// Componente con estado (requiere hidratación)
export function InteractiveButton() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>Clicks: {count}</button>;
}
```

```astro
<!-- DEBE usar client: directive para componentes con estado -->
<InteractiveButton client:idle />
```

### Integración con Sistema de Colores

#### Componentes shadcn/ui con Variables CSS:

```tsx
// Usar variables CSS del tema en componentes
const buttonVariants = {
  primary: "bg-[rgb(var(--color-primary))] text-white",
  secondary: "bg-[rgb(var(--color-secondary))] text-white",
  accent: "bg-[rgb(var(--color-accent))] text-gray-900",
};
```

#### NO usar colores hardcodeados en shadcn/ui:

```tsx
// ❌ INCORRECTO
<Button className="bg-blue-500">Botón</Button>

// ✅ CORRECTO
<Button className="bg-[rgb(var(--color-primary))]">Botón</Button>
```

### Performance y Optimización

#### Estrategias de Hidratación:

1. **Contenido estático**: NO usar directivas client
2. **Interacción inmediata**: `client:load`
3. **Interacción diferida**: `client:idle`
4. **Elementos off-screen**: `client:visible`
5. **Componentes condicionales**: `client:media`

#### Bundle Splitting:

- Separar componentes pesados en archivos individuales
- Usar dynamic imports para componentes opcionales
- Evitar importaciones masivas de librerías

### Patrones de Implementación

#### Formularios Interactivos:

```astro
---
import { ContactForm } from '@/components/forms/ContactForm';
---

<!-- Formulario crítico - hidratar inmediatamente -->
<ContactForm client:load />
```

#### Componentes de UI Complejos:

```astro
---
import { DataTable } from '@/components/ui/DataTable';
import { FilterPanel } from '@/components/ui/FilterPanel';
---

<!-- Panel visible inmediatamente pero no crítico -->
<FilterPanel client:idle />

<!-- Tabla que puede estar off-screen -->
<DataTable client:visible />
```

#### Componentes Condicionales:

```astro
---
import { MobileNav } from '@/components/navigation/MobileNav';
import { DesktopNav } from '@/components/navigation/DesktopNav';
---

<MobileNav client:media="(max-width: 768px)" />
<DesktopNav client:media="(min-width: 769px)" />
```

## Antipatrones (EVITAR)

### Astro/React

- ❌ Hidratar componentes sin interactividad real
- ❌ Usar React para contenido estático
- ❌ Múltiples `client:load` en la misma página
- ❌ Importar librerías pesadas en el cliente
- ❌ Sintaxis incorrecta: `client="load"` (usar `client:load`)
- ❌ Componentes shadcn/ui sin interfaces TypeScript
- ❌ Props sin valores por defecto en componentes React

### TypeScript

- ❌ Usar `any` sin justificación documenta
- ❌ Suprimir errores TypeScript con `@ts-ignore`
- ❌ Props sin tipar en componentes
- ❌ Mutaciones directas de props de solo lectura

### CSS/Tailwind

- ❌ CSS inline para estilos complejos
- ❌ Duplicar utilidades existentes
- ❌ Clases !important innecesarias
- ❌ Estilos que rompen responsive design

### Arquitectura

- ❌ Lógica de negocio en componentes de presentación
- ❌ Rutas relativas largas en lugar de alias
- ❌ Configuración dispersa (usar `config/*.json`)
- ❌ Scripts de terceros fuera del control de configuración

## Referencias y Recursos

### Documentación Oficial

- [Astro 5 Docs](https://docs.astro.build) - Documentación oficial actualizada
- [Tailwind CSS 4](https://tailwindcss.com/docs) - Guía de utilidades y componentes
- [TypeScript Handbook](https://typescriptlang.org/docs) - Referencia completa TS

### Configuraciones del Proyecto

- `src/config/config.json` - Configuración general del sitio
- `src/config/theme.json` - Variables de tema y fuentes
- `src/config/menu.json` - Estructura de navegación
- `src/content.config.ts` - Schemas de Content Collections
- `astro.config.mjs` - Configuración de Astro e integraciones

### Comandos de Referencia Rápida

```bash
# Desarrollo
pnpm dev

# Verificaciones pre-commit
pnpm check && pnpm build && pnpm format

# Migración desde npm/yarn
./migrate-to-pnpm.sh  # Linux/Mac
./migrate-to-pnpm.ps1 # Windows
```

---

**Nota**: Mantén estas reglas como fuente de verdad para todas las contribuciones y automatizaciones de la AI. Actualiza este archivo cuando el stack tecnológico o las convenciones del proyecto cambien significativamente.

## Uso obligatorio de `playwright.prompt` para seguimiento y verificación

Añadir la siguiente regla: todas las tareas implementadas paso a paso deben usar el prompt `playwright.prompt` para guiar la ejecución y la verificación visual/funcional. Reglas mínimas:

- Emplear `playwright.prompt` para descomponer la tarea en pasos claros (setup, acciones, comprobaciones).
- En cada paso incluir:
  - Comprobaciones DOM/JS (asserts) que validen el cambio en código.
  - Capturas de pantalla o video (cuando aplique) para verificación visual.
  - Registro breve del resultado en `src/tasks/{task-name}.md` y actualización de `src/tasks/progress.md`.
- Cuando sea necesario, incluir comandos reproducibles (pnpm dlx / pnpm exec) para ejecutar tests visuales o E2E.
- Mantener las comprobaciones automatizadas en la repo (tests Playwright en `src/tests/playwright/`) y documentar en la tarea cómo ejecutarlas.
- Mensajes de comprobación y artefactos (screenshots, vídeos, logs) se deben enlazar desde la ficha de la tarea.
