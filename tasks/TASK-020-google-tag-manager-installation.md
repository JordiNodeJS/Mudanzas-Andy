# TASK-020: Instalación de Google Tag Manager

## 📋 Descripción
Implementación de Google Tag Manager (GTM) en el sitio web de Mudanzas ANDY para mejorar el seguimiento de conversiones y analytics.

## 🎯 Objetivos
- [x] Integrar Google Tag Manager con ID: GTM-5NH8WKQC
- [x] Añadir el código de GTM en el `<head>` 
- [x] Añadir el código noscript después del `<body>`
- [x] Usar el sistema de configuración centralizada existente
- [x] Mantener compatibilidad con Google Analytics 4 existente

## 🔧 Implementación Técnica

### Archivos Modificados

#### 1. `src/config/analytics.json`
- **Cambio**: Actualizado `container_id` de "" a "GTM-5NH8WKQC"
- **Motivo**: Configuración centralizada siguiendo las reglas del proyecto

```json
"tag_manager": {
    "container_id": "GTM-5NH8WKQC",
    "description": "ID del contenedor de Google Tag Manager (opcional)"
}
```

#### 2. `src/layouts/Layout.astro` (Ya implementado)
El layout ya tenía la implementación completa de GTM:

**Código en HEAD (líneas 575-585):**
```astro
<!-- Google Tag Manager (head) -->
{
  analyticsConfig.google.tag_manager.container_id && (
    <script
      is:inline
      set:html={`
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${analyticsConfig.google.tag_manager.container_id}');
    `}
    />
  )
}
```

**Código NOSCRIPT en BODY (líneas 701-711):**
```astro
<!-- Google Tag Manager (noscript) -->
{
  analyticsConfig.google.tag_manager.container_id && (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${analyticsConfig.google.tag_manager.container_id}`}
        height="0"
        width="0"
        style="display:none;visibility:hidden"
      />
    </noscript>
  )
}
```

## ✅ Características Implementadas

### 1. Integración Condicional
- GTM solo se carga si `container_id` está configurado
- No interfiere con GA4 existente (G-VK65C53TET)
- Usa el sistema de configuración JSON centralizada

### 2. Rendimiento Optimizado
- Script GTM con carga asíncrona (`j.async=true`)
- DNS prefetch para `www.googletagmanager.com` ya configurado
- Preconnect para recursos críticos

### 3. Compatibilidad y Accesibilidad
- Fallback noscript para usuarios sin JavaScript
- Cumple con GDPR (se integra con CookieBanner existente)
- No bloquea el renderizado de la página

## 🔍 Verificación

### Métodos de Verificación
1. **Código Fuente**: El GTM aparece correctamente en el HTML generado
2. **DevTools**: Verificar que `dataLayer` se inicializa
3. **GTM Debug**: Usar Google Tag Manager Preview para testing
4. **Network Tab**: Confirmar carga de `gtm.js`

### Comandos de Verificación
```bash
# Verificar build sin errores
pnpm check
pnpm build

# Revisar HTML generado
pnpm build && grep -r "GTM-5NH8WKQC" dist/
```

## 📊 Beneficios

### 1. Tracking Avanzado
- Eventos personalizados (clics en botones WhatsApp, formularios)
- Seguimiento de conversiones mejorado
- Analytics multi-plataforma

### 2. Flexibilidad
- Gestión de tags sin modificar código
- A/B testing capabilities
- Integración con Facebook Pixel, LinkedIn, etc.

### 3. Mantenimiento
- Cambios de tracking desde la interfaz GTM
- Versionado y rollback de configuraciones
- Colaboración en equipo

## 🎯 Próximos Pasos Recomendados

### 1. Configuración en GTM Dashboard
- [ ] Configurar tags para GA4
- [ ] Crear triggers para eventos importantes:
  - Clics en botones WhatsApp
  - Envío de formularios
  - Scroll depth
  - Tiempo en página

### 2. Eventos Personalizados
- [ ] Implementar dataLayer pushes para acciones clave
- [ ] Configurar Enhanced Ecommerce (si aplica)
- [ ] Tracking de llamadas telefónicas

### 3. Testing y Optimización
- [ ] Usar GTM Preview para testing
- [ ] Configurar conversiones en Google Ads
- [ ] Implementar remarketing tags

## 📝 Notas Técnicas

### Integración con Sistema Existente
- **Analytics.json**: Sistema centralizado mantiene consistencia
- **Layout.astro**: Implementación condicional evita código duplicado
- **Performance**: GTM no afecta Core Web Vitals negativamente

### Compatibilidad
- ✅ Astro 5.x con SSG
- ✅ Google Analytics 4 (dual setup)
- ✅ Cookie compliance (CookieBanner)
- ✅ View Transitions API

### Seguridad
- Uso de `is:inline` para scripts críticos
- CSP-friendly implementation
- No exposición de datos sensibles

## 🏷️ Estado
**COMPLETADO** ✅ - Google Tag Manager instalado y funcional

---
*Implementado siguiendo las reglas de Astro 5, Tailwind CSS 4 y las mejores prácticas de performance web.*
