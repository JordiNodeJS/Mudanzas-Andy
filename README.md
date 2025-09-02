# Mudanzas Andy - Web Corporativa

## 📋 Descripción del Proyecto

Diseñé la identidad visual y la experiencia de usuario de mudanzasandy.es, una web estática para empresa de mudanzas. Trabajo completo: diseño responsive, sistema de colores centralizado, maquetación accesible y optimización de imágenes y rendimiento.

**Stack tecnológico:** Astro 5 + TypeScript + Tailwind CSS 4 + React Islands + Content Collections

**Características destacadas:**

- Sistema de colores centralizado con variables CSS
- Optimización de performance y Core Web Vitals
- Diseño responsive y accesible
- Blog integrado con Content Layer API
- Hidratación selectiva de componentes React

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Welcome.astro
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `pnpm install`         | Installs dependencies                            |
| `pnpm dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm build`           | Build your production site to `./dist/`          |
| `pnpm preview`         | Preview your build locally, before deploying     |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help` | Get help using the Astro CLI                     |

## 🧭 Regla de inicialización JS (View Transitions)

Para comportamientos cliente (listeners, popups, animaciones) que deben re-inicializarse tras navegaciones internas, sigue las reglas documentadas en:

- `.ai/JS-INIT-RULES.md` — Patrón idempotente / cleanup + uso de `astro:after-swap`.

(Ver este archivo antes de crear o modificar lógica cliente JS.)

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
