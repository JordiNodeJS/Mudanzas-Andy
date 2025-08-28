# TASK-022: Configuración .htaccess para permitir iframe del blog

## Descripción

Modificación del archivo `.htaccess` del sitio principal para permitir la carga de iframes, específicamente para resolver el problema del blog embebido.

## Cambio Realizado

### Archivo modificado: `public/.htaccess`

**Antes:**

```apache
Header always set X-Frame-Options DENY
```

**Después:**

```apache
Header always set X-Frame-Options SAMEORIGIN
```

### Justificación del cambio

- **DENY**: Bloqueaba TODOS los iframes, incluso los del propio sitio
- **SAMEORIGIN**: Permite iframes del mismo dominio y subdominios

## Estado Actual

### ✅ Sitio Principal (mudanzasandy.es)

- **Configuración**: `X-Frame-Options SAMEORIGIN`
- **Estado**: ✅ Listo para permitir iframes
- **Build**: ✅ Compilado exitosamente

### ⏳ Blog WordPress (blog.mudanzasandy.es)

- **Configuración**: ❌ Pendiente
- **Estado**: Aún bloquea iframes con X-Frame-Options
- **Acción requerida**: Configurar WordPress para permitir iframe

## Próximos Pasos para WordPress

### Opción A: .htaccess en el blog

```apache
<IfModule mod_headers.c>
    Header always unset X-Frame-Options
    Header always set X-Frame-Options "ALLOW-FROM https://mudanzasandy.es"
    Header always set Content-Security-Policy "frame-ancestors 'self' https://mudanzasandy.es"
</IfModule>
```

### Opción B: functions.php en WordPress

```php
function allow_iframe_from_main_site() {
    $allowed_origins = array('https://mudanzasandy.es');
    $referer = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : '';

    foreach ($allowed_origins as $allowed) {
        if (strpos($referer, $allowed) !== false) {
            header_remove('X-Frame-Options');
            header('X-Frame-Options: ALLOW-FROM ' . $allowed);
            break;
        }
    }
}
add_action('init', 'allow_iframe_from_main_site');
```

## Verificación

### Después de configurar WordPress:

1. **Build y deploy**: Subir archivos del `dist/` al servidor
2. **Test manual**: Verificar que iframe carga en `/blog-astro`
3. **Playwright test**: Confirmar que no hay errores X-Frame-Options

### Estado esperado:

- ✅ **Sitio principal**: Permite iframes (SAMEORIGIN)
- ✅ **Blog WordPress**: Permite iframe desde mudanzasandy.es
- ✅ **Resultado**: iframe del blog funciona sin errores

## Archivos Afectados

- ✅ `public/.htaccess` - Modificado y compilado
- ⏳ Blog WordPress `.htaccess` o `functions.php` - Pendiente configuración

---

**Fecha**: 29 de agosto de 2025  
**Estado**: ✅ Sitio principal listo - ⏳ WordPress pendiente  
**Rama**: feat/08-blog-integration  
**Build**: ✅ Exitoso y listo para deploy
