# 🔄 Sistema de Blog en Tiempo Real - WordPress + Astro

## ✨ ¿Qué es esto?

Un sistema que permite mostrar posts de WordPress **actualizados en tiempo real** en tu sitio Astro estático desplegado en Hostinger, **sin necesidad de hacer rebuild**.

## 🎯 Problema Resuelto

**Antes**: 
- Cambios en WordPress → Esperar rebuild → Esperar deploy → Ver cambios ❌
- Tiempo de espera: 5-15 minutos

**Ahora**:
- Cambios en WordPress → **Visibles inmediatamente** ✅
- Tiempo de espera: 0 segundos

## 🚀 Cómo Funciona

```
┌──────────────┐      ┌─────────────┐      ┌──────────────┐
│  WordPress   │ ───> │  Navegador  │ ───> │  Usuario ve  │
│  (Publicas)  │      │ (Fetch API) │      │  contenido   │
│              │      │             │      │  actualizado │
└──────────────┘      └─────────────┘      └──────────────┘
     Tiempo real          Sin rebuild           Inmediato
```

## 📦 Archivos Creados

### 1. **Configuración**
- `src/config/wordpress.json` - URL y opciones de cache

### 2. **Componente React**
- `src/components/LiveWordPressPosts.tsx` - Componente que obtiene posts en vivo

### 3. **Página de Ejemplo**
- `src/pages/blog-live.astro` - Página funcionando con el sistema

### 4. **Documentación**
- `docs/WORDPRESS-LIVE-BLOG-SYSTEM.md` - Guía completa
- `wordpress-cors-config.php` - Código para WordPress

### 5. **Configuración de Astro**
- `astro.config.mjs` - React integrado

## ⚡ Uso Rápido

### Ver el Sistema en Acción

```bash
pnpm dev
```

Visita: `http://localhost:4321/blog-live`

### Integrar en tu Página

```astro
---
import LiveWordPressPosts from '@/components/LiveWordPressPosts';
---

<LiveWordPressPosts client:load postsPerPage={10} />
```

## 🔧 Configuración Requerida en WordPress

**⚠️ PASO CRÍTICO**: Debes habilitar CORS en WordPress

1. Abre `functions.php` de tu tema WordPress
2. Copia y pega el contenido de `wordpress-cors-config.php`
3. Guarda y verifica que funcione

**Verificar CORS**:
```bash
curl -I https://barcelona.mudanzasandy.es/wp-json/wp/v2/posts
```

Deberías ver: `Access-Control-Allow-Origin: https://mudanzasandy.es`

## ✅ Ventajas

- ✅ **Actualización inmediata** - Sin esperas ni rebuilds
- ✅ **Compatible con Hostinger** - Solo HTML, CSS, JS estático
- ✅ **SEO optimizado** - Contenido estático para buscadores
- ✅ **Fallback inteligente** - Si WordPress falla, muestra caché
- ✅ **Fácil de usar** - Un solo componente

## 📊 Comparación

| Característica | Sistema Actual | Sistema Nuevo |
|---------------|---------------|---------------|
| Actualización | Manual (rebuild) | Automática (tiempo real) |
| Tiempo de espera | 5-15 minutos | 0 segundos |
| Requiere build | ✅ Sí | ❌ No |
| SEO | ✅ Excelente | ✅ Excelente |
| Hosting | Estático | Estático |
| Complejidad | Baja | Media |

## 🎓 Conceptos Clave

### 1. **Híbrido**
Combina lo mejor de ambos mundos:
- HTML estático (SEO)
- Fetch dinámico (datos frescos)

### 2. **Client-Side**
El navegador obtiene los datos directamente, no el servidor.

### 3. **Hidratación**
React "activa" el componente en el navegador con `client:load`.

### 4. **CORS**
WordPress debe permitir peticiones desde tu dominio.

## 🚨 Troubleshooting Rápido

### No se ven los posts
1. ✅ Verifica CORS en WordPress
2. ✅ Abre DevTools > Console y busca errores
3. ✅ Verifica URL en `src/config/wordpress.json`

### Error de CORS
- Configura CORS en WordPress (ver `wordpress-cors-config.php`)

### Posts no se actualizan
- Hard refresh: Ctrl + Shift + R

## 📚 Documentación Completa

Lee `docs/WORDPRESS-LIVE-BLOG-SYSTEM.md` para:
- Arquitectura detallada
- Opciones avanzadas
- Personalización
- Mejores prácticas

## 🔮 Próximos Pasos

1. ✅ **Habilitar CORS en WordPress** (critical)
2. ✅ **Probar en desarrollo** (`pnpm dev`)
3. ✅ **Integrar en tu página de blog**
4. ✅ **Deploy y verificar en producción**

## 💡 Casos de Uso

### Blog con Actualizaciones Frecuentes
```astro
<LiveWordPressPosts 
  client:load 
  autoRefresh={true}
  refreshInterval={60000}
/>
```

### Página de Noticias
```astro
<LiveWordPressPosts 
  client:load 
  postsPerPage={5}
  categories={[3, 7]}
/>
```

### Sección de Blog (Below the Fold)
```astro
<LiveWordPressPosts 
  client:visible 
  postsPerPage={6}
/>
```

## 🎉 Resultado Final

**Tu sitio ahora puede mostrar contenido de WordPress actualizado en tiempo real, sin necesidad de hacer rebuild, manteniendo la velocidad y simplicidad de un sitio estático.**

---

**¿Preguntas?** Lee la documentación completa en `docs/WORDPRESS-LIVE-BLOG-SYSTEM.md`

**¿Problemas?** Revisa el Troubleshooting en la documentación

**¿Mejoras?** Las próximas mejoras incluyen: webhooks, service workers, y más.
