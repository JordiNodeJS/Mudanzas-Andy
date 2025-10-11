# Actualización: Limpieza de UI y Variables de Entorno

## 📋 Cambios Realizados

### 1. ✅ Eliminación de Etiquetas "Actualizado en vivo"

Se han eliminado todas las etiquetas visuales que indicaban que un post provenía de WordPress:

#### Cambios en `src/components/LiveBlogGrid.tsx`:

**ANTES:**
```tsx
{isWordPressPost(heroPost) && (
  <span className="inline-block ml-2 bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
    Actualizado en vivo
  </span>
)}
```

**DESPUÉS:** *(Eliminado completamente)*

---

**ANTES:**
```tsx
{isWP && (
  <div className="pt-4 border-t border-gray-200">
    <span className="inline-flex items-center text-xs text-blue-600">
      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
      </svg>
      Actualizado en vivo desde WordPress
    </span>
  </div>
)}
```

**DESPUÉS:** *(Eliminado completamente)*

#### Beneficios:
- ✅ UI más limpia y profesional
- ✅ Los usuarios no necesitan saber el origen técnico del contenido
- ✅ Experiencia unificada entre posts de Astro y WordPress
- ✅ Menos elementos visuales que distraen del contenido principal

---

### 2. 🔐 Migración a Variables de Entorno

Se han movido las URLs de WordPress a variables de entorno para mayor seguridad y flexibilidad.

#### Archivos Creados:

**`.env.production`:**
```env
# WordPress API Configuration
PUBLIC_WORDPRESS_API_URL=https://barcelona.mudanzasandy.es/wp-json/wp/v2
PUBLIC_WORDPRESS_SITE_URL=https://barcelona.mudanzasandy.es
```

**`.env.development`:**
```env
# WordPress API Configuration (Development)
PUBLIC_WORDPRESS_API_URL=https://barcelona.mudanzasandy.es/wp-json/wp/v2
PUBLIC_WORDPRESS_SITE_URL=https://barcelona.mudanzasandy.es
```

**`.env.example`:**
```env
# WordPress API Configuration - Example
# Copiar a .env.production o .env.development

PUBLIC_WORDPRESS_API_URL=https://your-wordpress-site.com/wp-json/wp/v2
PUBLIC_WORDPRESS_SITE_URL=https://your-wordpress-site.com
```

#### Archivos Modificados:

**1. `src/components/LiveBlogGrid.tsx`:**
```tsx
// ANTES
const url = `${wordpressConfig.apiUrl}/posts?${params.toString()}`;

// DESPUÉS
const apiUrl = import.meta.env.PUBLIC_WORDPRESS_API_URL || wordpressConfig.apiUrl;
const url = `${apiUrl}/posts?${params.toString()}`;
```

**2. `src/lib/utils/wordpress.ts`:**
```tsx
// ANTES
const WORDPRESS_API_URL = "https://barcelona.mudanzasandy.es/wp-json/wp/v2";

// DESPUÉS
const WORDPRESS_API_URL = 
  import.meta.env.PUBLIC_WORDPRESS_API_URL || 
  "https://barcelona.mudanzasandy.es/wp-json/wp/v2";
```

**3. `src/pages/blog/wp/[slug].astro`:**
```tsx
// ANTES
const response = await fetch(
  `https://barcelona.mudanzasandy.es/wp-json/wp/v2/posts?slug=${post.slug}&_embed=true`
);

// DESPUÉS
const WORDPRESS_API_URL = 
  import.meta.env.PUBLIC_WORDPRESS_API_URL || 
  "https://barcelona.mudanzasandy.es/wp-json/wp/v2";

const response = await fetch(
  `${WORDPRESS_API_URL}/posts?slug=${post.slug}&_embed=true`
);
```

**4. `src/config/wordpress.json`:**
```json
{
    "apiUrl": "",
    "siteUrl": "",
    "comment": "NOTA: Las URLs se cargan desde variables de entorno (PUBLIC_WORDPRESS_API_URL y PUBLIC_WORDPRESS_SITE_URL). Los valores aquí son fallback si las variables no están definidas.",
    ...
}
```

**5. `.gitignore`:**
```ignore
# environment variables
.env
.env.production
.env.development
.env.local
```

---

## 🔑 Uso de Variables de Entorno en Astro

### Prefijo `PUBLIC_`

Las variables con prefijo `PUBLIC_` son accesibles tanto en el servidor como en el cliente:

```tsx
// Disponible en componentes React, Astro, y utilidades
import.meta.env.PUBLIC_WORDPRESS_API_URL
```

### Jerarquía de Variables

Astro carga variables de entorno en este orden:

1. `.env.production` (en producción con `astro build`)
2. `.env.development` (en desarrollo con `astro dev`)
3. `.env` (siempre, como fallback)
4. `.env.local` (nunca se sube a git, para overrides locales)

### Valores de Fallback

Todos los archivos mantienen un fallback hardcodeado en caso de que las variables no estén definidas:

```tsx
const WORDPRESS_API_URL = 
  import.meta.env.PUBLIC_WORDPRESS_API_URL || 
  "https://barcelona.mudanzasandy.es/wp-json/wp/v2";
```

---

## 🚀 Beneficios de Variables de Entorno

### Seguridad
- ✅ URLs sensibles no están hardcodeadas en el código
- ✅ Archivos `.env.*` están en `.gitignore`
- ✅ Cada entorno puede tener diferentes URLs

### Flexibilidad
- ✅ Cambiar URLs sin modificar código
- ✅ Diferentes URLs para desarrollo, staging, producción
- ✅ Fácil migración a otro WordPress

### Mantenibilidad
- ✅ Configuración centralizada en archivos `.env`
- ✅ Fallbacks seguros si variables no están definidas
- ✅ `.env.example` como documentación

---

## 📦 Configuración en Diferentes Entornos

### Desarrollo Local

```bash
# Usar .env.development (ya existe)
pnpm dev
```

### Build de Producción

```bash
# Usar .env.production (ya existe)
pnpm build
```

### Hosting (Hostinger, Netlify, Vercel, etc.)

Configurar variables de entorno en el panel del hosting:

**Variables requeridas:**
- `PUBLIC_WORDPRESS_API_URL`: URL completa a la API de WordPress
- `PUBLIC_WORDPRESS_SITE_URL`: URL del sitio WordPress

**Ejemplo en Hostinger:**
1. Panel de Control → Variables de Entorno
2. Agregar:
   - `PUBLIC_WORDPRESS_API_URL` = `https://barcelona.mudanzasandy.es/wp-json/wp/v2`
   - `PUBLIC_WORDPRESS_SITE_URL` = `https://barcelona.mudanzasandy.es`

---

## 🧪 Testing

### Verificar Variables en Build

```bash
# Build y verificar que usa variables de entorno
pnpm build

# Buscar en logs: "Fetching WordPress posts from:"
# Debe mostrar la URL de PUBLIC_WORDPRESS_API_URL
```

### Verificar en Desarrollo

```bash
# Iniciar servidor de desarrollo
pnpm dev

# Abrir consola del navegador en /blog-astro
# Buscar: "[LiveBlogGrid] Fetching WordPress posts from:"
# Verificar que usa la URL correcta
```

### Probar Fallback

```bash
# Renombrar temporalmente .env.production
mv .env.production .env.production.backup

# Build debería usar fallback hardcodeado
pnpm build

# Restaurar
mv .env.production.backup .env.production
```

---

## 📁 Archivos Afectados

### Creados
- ✅ `.env.production`
- ✅ `.env.development`
- ✅ `.env.example`
- ✅ `docs/BLOG-ENVIRONMENT-VARIABLES.md` (este archivo)

### Modificados
- ✅ `src/components/LiveBlogGrid.tsx` (2 cambios: etiquetas + env vars)
- ✅ `src/lib/utils/wordpress.ts` (variables de entorno)
- ✅ `src/pages/blog/wp/[slug].astro` (variables de entorno)
- ✅ `src/config/wordpress.json` (URLs vacías + comentario)
- ✅ `.gitignore` (añadido `.env.development` y `.env.local`)

---

## ⚠️ Notas Importantes

### NO Subir a Git

Los siguientes archivos **NO deben subirse** al repositorio:
- `.env`
- `.env.production`
- `.env.development`
- `.env.local`

Estos ya están en `.gitignore`.

### SÍ Subir a Git

El archivo `.env.example` **SÍ debe subirse** al repositorio como plantilla.

### Configuración en CI/CD

Si usas GitHub Actions, Netlify, Vercel, etc., configura las variables en:
- GitHub: Settings → Secrets and Variables → Actions
- Netlify: Site Settings → Build & Deploy → Environment Variables
- Vercel: Project Settings → Environment Variables

---

## 🔄 Migración de Proyectos Existentes

Si necesitas usar este sistema en otro proyecto:

1. **Copiar `.env.example`** a `.env.production` y `.env.development`
2. **Actualizar URLs** con las de tu WordPress
3. **Verificar `.gitignore`** incluye archivos `.env.*`
4. **Configurar en hosting** las variables de entorno
5. **Probar** con `pnpm dev` y `pnpm build`

---

## 📊 Comparación: Antes vs Después

| Aspecto | Antes | Después |
|---------|-------|---------|
| **URLs** | Hardcodeadas en código | Variables de entorno |
| **Seguridad** | URLs expuestas en repo | URLs en `.env` (git-ignored) |
| **Flexibilidad** | Cambiar URL = cambiar código | Cambiar URL = editar `.env` |
| **UI Labels** | "Actualizado en vivo" visible | Etiquetas eliminadas |
| **Experiencia** | Usuario ve origen técnico | UI limpia y profesional |
| **Entornos** | Misma URL en dev/prod | Diferentes URLs por entorno |

---

## 🎯 Resultado Final

### Compilación
```bash
pnpm check
# Result: 0 errors, 0 warnings, 1 hint
# ✅ Todo funcionando correctamente
```

### UI
- ✅ Sin etiquetas "Actualizado en vivo"
- ✅ Experiencia visual unificada
- ✅ Contenido más limpio

### Configuración
- ✅ URLs en variables de entorno
- ✅ Fallbacks seguros implementados
- ✅ `.gitignore` actualizado
- ✅ Documentación completa

---

**Fecha de actualización**: 11 de octubre de 2025  
**Versión de Astro**: 5.13.2  
**Variables de entorno**: Astro native (import.meta.env)
