# Sistema de Blog en Tiempo Real - WordPress + Astro

## 📋 Resumen

Este sistema implementa una solución híbrida que permite mostrar posts de WordPress actualizados en tiempo real en un sitio Astro completamente estático desplegado en Hostinger.

## 🎯 Características

✅ **Actualización en tiempo real**: Los cambios en WordPress se reflejan inmediatamente
✅ **Compatible con hosting estático**: No requiere servidor dinámico ni SSR
✅ **SEO optimizado**: Contenido estático generado en build time
✅ **Fallback inteligente**: Muestra contenido en caché si WordPress no está disponible
✅ **Performance**: Carga inicial rápida con actualización progresiva

## 🏗️ Arquitectura

### Build Time (Generación Estática)
1. Astro obtiene posts de WordPress durante el build
2. Genera HTML estático con contenido inicial (SEO)
3. Deploy en Hostinger como archivos estáticos

### Runtime (Navegador)
1. Componente React se hidrata con `client:load`
2. Hace fetch directo a WordPress REST API
3. Actualiza el contenido dinámicamente
4. Si falla, muestra el contenido estático generado en build

## 📁 Archivos Implementados

### 1. Configuración
**`src/config/wordpress.json`**
```json
{
  "apiUrl": "https://barcelona.mudanzasandy.es/wp-json/wp/v2",
  "siteUrl": "https://barcelona.mudanzasandy.es",
  "cache": {
    "enabled": true,
    "ttl": 300000
  },
  "clientSide": {
    "enabled": true,
    "refreshInterval": 60000
  }
}
```

### 2. Componente React
**`src/components/LiveWordPressPosts.tsx`**
- Componente React que hace fetch client-side
- Estados: loading, error, success
- Actualización automática opcional
- Fallback a contenido estático
- Manejo de errores robusto

### 3. Utilidades
**`src/lib/utils/wordpress.ts`**
- `getWordPressPostsClient()`: Función para fetch desde el navegador
- Sin cache de servidor (datos siempre frescos)
- Transformación de posts al formato unificado

### 4. Página de Ejemplo
**`src/pages/blog-live.astro`**
- Implementación completa del sistema híbrido
- Contenido estático para SEO
- Componente React para actualización dinámica
- UI informativa y profesional

### 5. Configuración de Astro
**`astro.config.mjs`**
- Integración de React añadida
- Configuración para hidratación de componentes

## 🚀 Uso

### Opción 1: Página Dedicada (Recomendada)
Visita `/blog-live` para ver el sistema en acción con posts actualizados en tiempo real.

### Opción 2: Integrar en Página Existente

```astro
---
import LiveWordPressPosts from '@/components/LiveWordPressPosts';
import { getUnifiedWordPressPosts } from '@/lib/utils/wordpress.js';

// Obtener posts estáticos para fallback
const staticPosts = await getUnifiedWordPressPosts({ perPage: 10 });
---

<div>
  <!-- Posts en vivo desde WordPress -->
  <LiveWordPressPosts 
    client:load
    postsPerPage={10}
    autoRefresh={false}
    showLoading={true}
  />
</div>
```

### Opción 3: Auto-refresh Activado

```astro
<LiveWordPressPosts 
  client:load
  postsPerPage={10}
  autoRefresh={true}
  refreshInterval={60000}
/>
```

## 🔧 Configuración de WordPress

### PASO CRÍTICO: Habilitar CORS

WordPress debe permitir peticiones desde tu dominio. Añade esto a `functions.php` de tu tema:

```php
<?php
/**
 * Habilitar CORS para API REST de WordPress
 */
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        $origin = get_http_origin();
        $allowed_origins = [
            'https://mudanzasandy.es',
            'http://localhost:4321', // Para desarrollo
        ];
        
        if (in_array($origin, $allowed_origins)) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Allow-Headers: Authorization, Content-Type');
        }
        
        return $value;
    });
}, 15);
```

### Verificar CORS

Ejecuta este comando para verificar que CORS está habilitado:

```bash
curl -I https://barcelona.mudanzasandy.es/wp-json/wp/v2/posts
```

Deberías ver headers como:
```
Access-Control-Allow-Origin: https://mudanzasandy.es
```

### Alternativa: Plugin de CORS

Si no puedes modificar `functions.php`, instala el plugin:
- **"REST API – Enable CORS"** o
- **"WP CORS"**

## 🎨 Personalización

### Props del Componente

```typescript
interface LiveWordPressPostsProps {
  postsPerPage?: number;        // Default: 10
  autoRefresh?: boolean;         // Default: false
  refreshInterval?: number;      // Default: 60000 (1 min)
  fallbackContent?: ReactNode;   // Contenido de fallback personalizado
  categories?: number[];         // Filtrar por categorías de WP
  showLoading?: boolean;         // Default: true
  className?: string;            // Clases CSS personalizadas
}
```

### Ejemplo: Filtrar por Categoría

```astro
<LiveWordPressPosts 
  client:load
  categories={[5, 7]}
  postsPerPage={6}
/>
```

### Ejemplo: Fallback Personalizado

```astro
<LiveWordPressPosts 
  client:load
  fallbackContent={
    <div>
      <h3>Contenido no disponible temporalmente</h3>
      <p>Por favor, intenta más tarde.</p>
    </div>
  }
/>
```

## 🔍 Directivas de Hidratación

### `client:load` (Recomendado)
Hidrata inmediatamente. Úsalo cuando el contenido sea visible "above the fold".

```astro
<LiveWordPressPosts client:load />
```

### `client:idle`
Hidrata cuando el navegador esté inactivo. Mejor para secciones secundarias.

```astro
<LiveWordPressPosts client:idle />
```

### `client:visible`
Hidrata cuando el componente entra en viewport. Ideal para contenido "below the fold".

```astro
<LiveWordPressPosts client:visible />
```

## 📊 Ventajas vs Desventajas

### ✅ Ventajas

1. **Tiempo real**: Cambios visibles inmediatamente sin rebuild
2. **Hosting simple**: Compatible con cualquier hosting estático
3. **SEO**: Contenido estático indexable por buscadores
4. **Performance**: Primera carga rápida, actualización progresiva
5. **Resiliente**: Fallback automático si WordPress falla

### ⚠️ Consideraciones

1. **CORS requerido**: WordPress debe habilitar CORS
2. **JavaScript obligatorio**: Requiere JS habilitado en el navegador
3. **Dependencia externa**: Si WordPress cae, se muestra contenido en caché
4. **SEO limitado para nuevos posts**: Posts nuevos no están en HTML inicial

## 🔄 Flujo de Datos

```
┌─────────────────────────────────────────────────────┐
│                  BUILD TIME                         │
├─────────────────────────────────────────────────────┤
│  1. Astro obtiene posts de WordPress               │
│  2. Genera HTML estático con contenido inicial     │
│  3. Deploy en Hostinger                            │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│              USUARIO VISITA LA PÁGINA               │
├─────────────────────────────────────────────────────┤
│  1. Navegador carga HTML estático (rápido)         │
│  2. Componente React se hidrata                    │
│  3. Hace fetch a WordPress REST API                │
│  4. Actualiza UI con datos frescos                 │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│               SI WORDPRESS FALLA                    │
├─────────────────────────────────────────────────────┤
│  → Muestra contenido estático (generado en build)  │
│  → Mensaje de advertencia opcional                 │
│  → Botón "Reintentar" disponible                   │
└─────────────────────────────────────────────────────┘
```

## 🧪 Testing

### 1. Desarrollo Local

```bash
pnpm dev
```

Visita: `http://localhost:4321/blog-live`

### 2. Build y Preview

```bash
pnpm build
pnpm preview
```

### 3. Verificar CORS

Abre DevTools > Console y busca:
- ✅ `[LiveWordPress] Successfully loaded X posts`
- ❌ `CORS error` → Configurar CORS en WordPress

### 4. Simular Fallo de WordPress

En `src/config/wordpress.json` cambia la URL a una inválida:
```json
{
  "apiUrl": "https://invalid-url.com/wp-json/wp/v2"
}
```

Deberías ver el fallback funcionando.

## 🚨 Troubleshooting

### Error: "CORS policy"
**Causa**: WordPress no permite peticiones desde tu dominio
**Solución**: Configurar CORS en WordPress (ver sección de configuración)

### Error: "Failed to fetch"
**Causa**: WordPress no está accesible o URL incorrecta
**Solución**: Verificar URL en `src/config/wordpress.json`

### Posts no se actualizan
**Causa**: Cache del navegador o autoRefresh desactivado
**Solución**: 
- Hard refresh (Ctrl+Shift+R)
- Activar `autoRefresh={true}`

### Build falla
**Causa**: Error al obtener posts de WordPress en build time
**Solución**: 
- Verificar que WordPress esté accesible durante el build
- Reducir `perPage` en la página

## 📝 Próximos Pasos (Mejoras Futuras)

- [ ] **Service Worker**: Cache inteligente para mejor offline experience
- [ ] **Webhook**: Trigger rebuild automático cuando se publica en WordPress
- [ ] **Optimistic UI**: Mostrar contenido inmediatamente mientras carga
- [ ] **Infinite Scroll**: Cargar más posts al hacer scroll
- [ ] **Filtros**: Búsqueda y filtrado por categorías en tiempo real
- [ ] **Analytics**: Trackear cuándo se usan datos frescos vs cache

## 📚 Referencias

- [Astro React Integration](https://docs.astro.build/en/guides/integrations-guide/react/)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)
- [Client Directives in Astro](https://docs.astro.build/en/reference/directives-reference/#client-directives)
- [CORS Configuration](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

## 🤝 Soporte

Para preguntas o problemas:
1. Revisa esta documentación
2. Verifica la configuración de CORS
3. Revisa la consola del navegador para errores
4. Contacta al equipo de desarrollo

---

**Última actualización**: Octubre 2025
**Versión**: 1.0.0
**Autor**: Equipo Mudanzas ANDY
