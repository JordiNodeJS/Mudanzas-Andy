# Migración Blog: De iframe externo a contenido nativo

## Resumen de cambios realizados

### ✅ Completado - 16 septiembre 2025

#### ACTUALIZACIÓN: Errores de compilación corregidos

- **Issue**: Tailwind CSS 4 no reconocía clases como `border-gray-200`, `text-gray-700`, `bg-green-50`, etc.
- **Solución**: Reemplazadas todas las clases problemáticas con CSS nativo y sistema de colores del proyecto
- **Resultado**: Compilación exitosa - `pnpm build` ahora funciona sin errores

#### 1. Optimización de imagen

- **Origen**: `blog/image.png` (2MB)
- **Destino**: `src/assets/images/blog/blog-hero-optimized.webp` (12KB)
- **Herramienta**: sharp-cli con conversión a WebP y redimensionado a 800px
- **Mejora**: Reducción del 99.4% en tamaño de archivo

#### 2. Migración de contenido

- **Antes**: iframe externo a `https://blog.mudanzasandy.es/`
- **Después**: Contenido nativo HTML integrado en Astro
- **Fuente**: Contenido extraído de `blog/Blog de Andy.html`

#### 3. Estructura implementada

##### Secciones del artículo:

1. **Hero section** - Título y descripción
2. **Imagen optimizada** - Hero image con lazy loading
3. **Introducción** - Párrafo de apertura
4. **Sección 1** - "La Clave del Éxito: Elegir una Empresa de Mudanzas Confiable"
5. **Sección 2** - "Estrategias Inteligentes para Ahorrar en tu Mudanza"
6. **Sección 3** - "¿Te Mudas con Mascotas? Guía Esencial para un Viaje Seguro"
7. **Sección 4** - "Checklist Final para tu Mudanza Profesional" (con checkboxes visuales)
8. **Conclusión** - "Tu Próximo Paso Hacia una Mudanza sin Estrés"
9. **CTA section** - Llamadas a la acción para contacto y blog externo

#### 4. Mejoras implementadas

##### Performance:

- ✅ Eliminación de iframe externo
- ✅ Imagen optimizada (WebP, 800px width)
- ✅ Carga nativa sin dependencias externas
- ✅ Mejores Core Web Vitals esperadas

##### SEO:

- ✅ Contenido HTML nativo indexable
- ✅ Metadata optimizada
- ✅ Enlaces internos y externos bien estructurados
- ✅ Alt text descriptivos en imágenes

##### UX:

- ✅ Diseño responsive con Tailwind CSS
- ✅ Checklist visual con iconos ✅
- ✅ Hover effects en elementos interactivos
- ✅ Colores del sistema centralizado

##### Código:

- ✅ Componente Astro nativo
- ✅ Importación de assets optimizada
- ✅ Uso de `astro:assets` para la imagen
- ✅ CSS modular y mantenible

#### 5. URLs y enlaces

- **Página original**: `/blog-astro/`
- **Link al blog externo**: Mantenido como enlace adicional
- **Canonical URL**: Configurada correctamente

#### 6. Archivos modificados

- ✅ `src/pages/blog-astro.astro` - Reescrito completamente
- ✅ `src/assets/images/blog/blog-hero-optimized.webp` - Nueva imagen optimizada

#### 7. Archivos eliminados

- ✅ `blog/Blog de Andy.html` - Ya no necesario (contenido migrado)
- ✅ `blog/image.png` - Ya no necesario (reemplazado por versión optimizada)

## Beneficios obtenidos

### Performance

- **Eliminación de iframe**: Sin bloqueos por X-Frame-Options
- **Carga directa**: Contenido servido desde el mismo dominio
- **Imagen optimizada**: 99.4% de reducción en peso

### SEO

- **Contenido indexable**: HTML nativo vs iframe inaccesible
- **Meta tags nativos**: Mejor control de metadatos
- **Enlaces internos**: Mejor link building interno

### Mantenimiento

- **Contenido centralizado**: Todo en el mismo repositorio
- **Versionado**: Control de cambios con Git
- **Deployments**: Actualizaciones atómicas con el resto del sitio

## Comandos utilizados

```bash
# Optimización de imagen
pnpm dlx sharp-cli -i "./blog/image.png" -o "./src/assets/images/blog/blog-hero-optimized.webp" --format webp --quality 80 resize 800

# Verificación
pnpm check
pnpm dev
```

## Resultado final

- ✅ Página `/blog-astro/` funciona con contenido nativo
- ✅ Sin dependencias de iframes externos
- ✅ Imagen optimizada y responsiva
- ✅ SEO mejorado significativamente
- ✅ Mejor performance esperada
- ✅ UX mejorada con diseño nativo

---

## ⚠️ Problemas resueltos - Tailwind CSS 4 Compatibility

### Error inicial:

```
Cannot apply unknown utility class `border-gray-200`. Are you using CSS modules or similar and missing @reference?
```

### Solución implementada:

- **Reemplazadas todas las clases problemáticas** con CSS nativo
- **Uso del sistema de colores del proyecto** en lugar de clases genéricas
- **Eliminación de @apply** para clases no disponibles en Tailwind CSS 4

### Clases convertidas:

- `border-gray-200` → `border-bottom: 1px solid rgba(var(--color-neutral), 0.3)`
- `text-gray-700` → `color: #374151`
- `bg-green-50`, `bg-green-100` → CSS nativo con colores apropiados
- `pb-2`, `mb-4`, `mt-8` → CSS padding/margin nativo
- `@apply transform scale-105 shadow-md` → CSS transform y box-shadow nativo

### Resultado:

✅ **`pnpm build` ejecuta exitosamente sin errores**

## 🎨 SEO y Accesibilidad Mejorados - 16 septiembre 2025

### Metadatos SEO optimizados:

- **Title mejorado**: "Blog Mudanzas Barcelona - Consejos Económicos y Baratos | Mudanzas ANDY"
- **Description optimizada**: Incluye keywords estratégicas (mudanzas barcelona, económicas, baratas)
- **Keywords meta**: mudanzas barcelona, mudanzas económicas, mudanzas baratas, etc.
- **Alt text mejorado**: "Mudanzas económicas y baratas en Barcelona"

### Contrastes corregidos:

- **CTA section**: Texto blanco sólido en lugar de `text-neutral`
- **Botones**: Mejor contraste con `bg-white bg-opacity-10` y borders
- **Accessibility**: `aria-label` añadidos para mejor accesibilidad

### Keywords integradas en contenido:

- ✅ "mudanzas económicas Barcelona"
- ✅ "mudanzas baratas"
- ✅ "presupuesto económico"
- ✅ "traslados económicos"
- ✅ "mudanza barata Barcelona"

### Structured Data añadido:

```json
{
  "@type": "BlogPosting",
  "headline": "Consejos para Mudanzas Económicas en Barcelona",
  "keywords": "mudanzas barcelona, mudanzas económicas, mudanzas baratas..."
}
```

---

_Migración completada el 16 de septiembre de 2025_  
_Errores Tailwind CSS 4 corregidos el 16 de septiembre de 2025_  
_SEO y Accesibilidad mejorados el 16 de septiembre de 2025_

## 🛠️ Fix - CTA truncado / texto cortado

- **Síntoma**: En algunos entornos móviles/viewport el párrafo del CTA se mostraba cortado: "Contacta con nuestros expertos para obtener un pres" (texto truncado a mitad de palabra).
- **Causa probable**: Superposición o recorte por capas (overlay/gradients) o comportamiento de overflow en algunos contenedores.
- **Solución aplicada**: Añadida clase `cta-section` al `<section>` y reglas CSS que aseguran `overflow: visible`, `white-space: normal` y `z-index` apropiados en el contenedor y botones para evitar solapamientos.
- **Archivos modificados**: `src/pages/blog-astro.astro` (sección CTA + estilo añadido)
- **Verificación**: Iniciado servidor de desarrollo y comprobada la visualización en local; se recomienda revisar en móvil o usar las DevTools para confirmar en breakpoints pequeños.
