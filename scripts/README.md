# scripts/

Resumen y reglas para ejecutar los scripts del repositorio

Propósito

- Esta carpeta contiene utilidades para optimización de imágenes, generación de assets PWA y análisis de rendimiento (Lighthouse).

Reglas importantes

- Por defecto `tsconfig.json` excluye `scripts/` del chequeo TypeScript y del `astro check` para evitar "hints" provenientes de los scripts que no usan módulos ES/TypeScript.
- Hay dos tipos de scripts:
  - NO mutadores (seguros): generan archivos en `public/` o `reports/`. Ej: `optimize-core-web-vitals-images.js`, `optimize-images.js`, `optimize-gallery-images.js`, `optimize-team-images.js`, `optimize-carousel-images.js`.
  - MUTADORES (peligrosos): modifican `src/` o `content/` y requieren revisión manual o el flag `--apply`. Ej: `optimize-responsive-images.js` (actualiza frontmatter y genera componentes).

Buenas prácticas

- Ejecutar primero en modo "dry-run" si existe; si no existe, clonar la rama y probar en una rama temporal.
- No ejecutar los scripts mutadores como parte de CI automático. Hacer PR y revisar cambios antes de mergear.
- Aprobar build scripts nativos en CI si se usan `sharp` u otras dependencias nativas (`pnpm approve-builds` o configurar runner con libvips).

Comandos útiles

- Comprobar project: `pnpm check`
- Ejecutar optimización (no destructiva): `pnpm perf:optimize-images`
- Ejecutar monitor CWV (local server required): `pnpm perf:monitor`

Si necesitas, puedo:

- Añadir `--dry-run` a los scripts que mutan `src/` y/o convertirlos para que pidan confirmación interactiva.
- Crear un job de GitHub Actions que ejecute `pnpm check && pnpm build && pnpm perf:lighthouse-mobile` y archive `reports/`.

Documentado automáticamente por la AI del repo.
