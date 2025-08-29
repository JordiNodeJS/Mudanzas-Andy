# TASK-022-unused-images-cleanup.md

## Descripción

Identificación y renombrado de imágenes no utilizadas en el proyecto con el prefijo "no-" para facilitar su posterior eliminación o reactivación.

## Objetivo

- Identificar todas las imágenes que no se utilizan en el código del proyecto
- Renombrar estas imágenes con el prefijo "no-" para mantenerlas pero indicar que no están en uso
- Crear un sistema para gestionar imágenes no utilizadas sin eliminarlas permanentemente

## Metodología de Análisis

### 1. Búsqueda Exhaustiva de Referencias

Se realizó una búsqueda completa en el proyecto para identificar referencias a imágenes:

```bash
# Búsqueda en archivos de código
grep -r "camion\|logo\|favicon\|\.jpg\|\.png\|\.svg\|\.webp\|\.gif\|\.avif" src/

# Búsqueda específica de rutas de imágenes
grep -r 'src=["'\''][^"'\'']*\.(jpg|jpeg|png|gif|svg|webp|avif)["'\'']' src/
```

### 2. Inventario de Imágenes

Se catalogaron todas las imágenes existentes en:

- `public/camion/`
- `public/camion/ai/`
- `public/camion/optimized/`
- `public/camion/resized/`
- `public/logos/`
- `public/favicons/`
- `src/assets/`

### 3. Análisis de Uso

Se verificó el uso real de cada imagen comparando:

- Referencias en componentes Astro (`.astro`)
- Referencias en TypeScript/JavaScript (`.ts`, `.js`, `.tsx`, `.jsx`)
- Referencias en archivos MDX (`.mdx`)
- Referencias en archivos de configuración (`.json`)
- Referencias en CSS/SCSS

## Imágenes Renombradas

### Total: 21 imágenes renombradas

#### Directorio: `public/camion/` (7 imágenes)

- `1756127633.png` → `no-1756127633.png`
- `camion-nocturno.jpg` → `no-camion-nocturno.jpg`
- `camion-trasera.jpg` → `no-camion-trasera.jpg`
- `cargando-flete.jpg` → `no-cargando-flete.jpg`
- `estacionado-lateral.jpg` → `no-estacionado-lateral.jpg`
- `interior-caja.jpg` → `no-interior-caja.jpg`
- `promocional-collage-2.jpg` → `no-promocional-collage-2.jpg`

#### Directorio: `public/camion/ai/` (5 imágenes)

- `1756126750.png` → `no-1756126750.png`
- `1756126979.png` → `no-1756126979.png`
- `camion-01.png` → `no-camion-01.png`
- `camion-frontal.png` → `no-camion-frontal.png`
- `camion-interior.png` → `no-camion-interior.png`

#### Directorio: `public/camion/resized/` (4 imágenes)

- `moving- truck-02.jpg` → `no-moving- truck-02.jpg` (nota: tenía espacio en el nombre)
- `moving- truck-03.jpg` → `no-moving- truck-03.jpg` (nota: tenía espacio en el nombre)
- `moving- truck-04.jpg` → `no-moving- truck-04.jpg` (nota: tenía espacio en el nombre)
- `moving-truck-05.jpg` → `no-moving-truck-05.jpg`

#### Directorio: `public/logos/` (3 imágenes)

- `1015831095_hostinger_ai_84e8905d.png` → `no-1015831095_hostinger_ai_84e8905d.png`
- `1015831095_hostinger_ai_d40664b6.png` → `no-1015831095_hostinger_ai_d40664b6.png`
- `logo-camion-mudanzas.png` → `no-logo-camion-mudanzas.png`

#### Directorio: `src/assets/` (2 imágenes)

- `astro.svg` → `no-astro.svg`
- `background.svg` → `no-background.svg`

## Imágenes Que SÍ Se Utilizan (Mantenidas)

### Imágenes Activas en el Proyecto:

#### Logos y Favicons:

- `public/favicon.svg` ✅ (referenciado en Layout.astro)
- `public/logo-mudanzas-andy.svg` ✅ (referenciado en blog-astro.astro)
- `public/logos/logo-camion-transparent.png` ✅ (usado como fallback)
- `public/logos/logo-camion-transparent-72.webp` ✅ (Footer.astro)
- `public/logos/logo-camion-transparent-80.webp` ✅ (Header.astro)
- Todos los archivos en `public/favicons/` ✅ (referenciados en Layout.astro)

#### Imágenes de Camión:

- `public/camion/hero-fondo.jpg` ✅ (HeroSection.astro, PricingSection.astro, TeamSection.astro)
- `public/camion/camion-evening.jpg` ✅ (prefetch en Layout.astro)
- `public/camion/camion-frontal.jpg` ✅ (prefetch en Layout.astro)
- `public/camion/promocional-collage.jpg` ✅ (TeamSection.astro)

#### Imágenes Optimizadas (directorio optimized/):

- Múltiples versiones .webp y .avif de las imágenes activas ✅
- Hero-fondo en diferentes formatos y tamaños ✅
- Moving-truck-01, moving-truck-cutout-01, moving-truck-cutout-02 ✅

#### Imágenes Redimensionadas (directorio resized/):

- `moving-truck-01.jpg` ✅ (TeamSection.astro)
- `moving-truck-cutout-01.jpg` ✅ (TeamSection.astro)
- `moving-truck-cutout-02.jpg` ✅ (TeamSection.astro)

## Script de Automatización

Se creó el script `scripts/rename-unused-images.js` que:

- Identifica automáticamente las imágenes no utilizadas
- Las renombra con el prefijo "no-"
- Proporciona un reporte detallado de la operación
- Mantiene la estructura de directorios intacta

### Ejecución:

```bash
node scripts/rename-unused-images.js
```

## Beneficios del Renombrado

### 1. **Gestión de Assets**

- ✅ Identificación clara de imágenes no utilizadas
- ✅ Posibilidad de reactivar imágenes fácilmente (quitar prefijo "no-")
- ✅ Mantenimiento del histórico de assets

### 2. **Limpieza del Proyecto**

- ✅ Organización visual de archivos utilizados vs no utilizados
- ✅ Facilita futuras decisiones de eliminación
- ✅ Reduce confusión al desarrollar

### 3. **Optimización de Build**

- ✅ Las imágenes con prefijo "no-" pueden ser excluidas de builds de producción
- ✅ Reducción del tamaño del proyecto en producción
- ✅ Mejora en tiempos de deploy

## Pasos Siguientes Recomendados

### 1. **Configuración de Build**

Considerar excluir archivos con prefijo "no-" del build de producción:

```javascript
// astro.config.mjs
export default defineConfig({
  vite: {
    assetsInclude: ["**/*", "!**/no-*"],
  },
});
```

### 2. **Script de Limpieza**

Crear un script adicional para eliminar permanentemente las imágenes con prefijo "no-":

```bash
# Comando futuro para eliminar definitivamente
find . -name "no-*" -type f -delete
```

### 3. **Documentación**

Mantener este reporte actualizado cuando se añadan nuevas imágenes al proyecto.

## Verificación Post-Renombrado

### ✅ Estado del Proyecto:

- Todas las páginas cargan correctamente
- No hay enlaces rotos a imágenes
- El sitio funciona completamente
- Las imágenes activas mantienen su funcionalidad

### ✅ Estructura Mantenida:

```
public/
├── camion/
│   ├── ai/          # 5 imágenes con prefijo "no-"
│   ├── optimized/   # Imágenes activas mantenidas
│   ├── resized/     # 4 imágenes con prefijo "no-", 3 activas mantenidas
│   └── *.jpg        # 7 imágenes con prefijo "no-", 3 activas mantenidas
├── logos/           # 3 imágenes con prefijo "no-", 3 activas mantenidas
└── favicons/        # Todas mantenidas (activas)

src/
└── assets/          # 2 imágenes con prefijo "no-"
```

## Conclusión

✅ **Tarea completada exitosamente**

- **21 imágenes** identificadas como no utilizadas y renombradas
- **0 imágenes activas** afectadas
- **100% de funcionalidad** del sitio mantenida
- **Sistema de gestión** de assets implementado

El proyecto ahora tiene una gestión clara de imágenes utilizadas vs no utilizadas, facilitando el mantenimiento futuro y la optimización del rendimiento.

---

**Fecha de creación**: 29 de agosto de 2025  
**Estado**: ✅ Completada  
**Impacto**: Mejora en organización de assets y preparación para optimización de build
