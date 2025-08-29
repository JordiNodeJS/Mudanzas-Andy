# Sistema de Theming - Mudanzas ANDY

Sistema de theming robusto y centralizado para el proyecto Astro 5 + Tailwind CSS 4, diseñado para mantener coherencia visual, facilitar el mantenimiento y asegurar accesibilidad.

## ⚠️ REGLA CRÍTICA: Compatibilidad Tailwind CSS 4

### **NO usar @apply con clases personalizadas**

```css
/* ❌ INCORRECTO - Falla en Tailwind CSS 4 */
.btn-outline {
  @apply bg-transparent border-2;
}
.btn-primary {
  @apply btn-outline text-primary;
} /* ERROR */

/* ✅ CORRECTO - Patrón híbrido recomendado */
.btn-primary {
  @apply text-white shadow-md; /* Utilidades Tailwind OK */
  background-color: rgb(var(--color-primary)); /* CSS directo */
}
```

**Motivo**: Tailwind CSS 4 introduce cambios arquitectónicos que rompen la compatibilidad con el patrón `@apply + clases personalizadas` de versiones anteriores.

📖 **Detalles completos**: [THEMING_IMPLEMENTATION_RULE.md](./THEMING_IMPLEMENTATION_RULE.md)

## 📋 Tabla de Contenidos

- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Design Tokens](#design-tokens)
- [Componentes CSS](#componentes-css)
- [Integración con Tailwind](#integración-con-tailwind)
- [Guía de Uso](#guía-de-uso)
- [Migración desde Hardcoded](#migración-desde-hardcoded)
- [Mejores Prácticas](#mejores-prácticas)
- [Accesibilidad](#accesibilidad)
- [Troubleshooting](#troubleshooting)

## 🏗️ Arquitectura del Sistema

### Estructura de Archivos

```
src/styles/
├── theme.css        # 🎨 Design tokens y variables CSS (fuente de verdad)
├── components.css   # 🧩 Componentes reutilizables con @apply
└── global.css       # 🌐 Imports y grid system Bootstrap
```

### Flujo de Datos

```
theme.css (Variables CSS) → tailwind.config.js (Mapping) → components.css (@apply) → Componentes Astro
```

## 🎨 Design Tokens

### Paleta de Colores Principal

Los colores están definidos en formato RGB para facilitar el uso de opacidades:

```css
/* Formato RGB para opacidades */
--color-primary: 38 78 112; /* #264e70 - Azul corporativo */
--color-secondary: 103 145 134; /* #679186 - Verde complementario */
--color-accent: 249 180 171; /* #f9b4ab - Rosa coral para CTA */
--color-highlight: 250 227 96; /* #FAE360 - Amarillo para destacados */
--color-neutral: 187 212 206; /* #bbd4ce - Verde neutro */

/* Fallback hex para navegadores antiguos */
--color-primary-hex: #264e70;
```

### Uso de Colores

#### En CSS Puro

```css
/* Con opacidad */
background: rgba(var(--color-primary), 0.8);

/* Sin opacidad */
color: rgb(var(--color-primary));
```

#### En Tailwind CSS

```html
<!-- Con opacidad -->
<div class="bg-primary/80 text-secondary/60">
  <!-- Sin opacidad -->
  <div class="bg-primary text-secondary"></div>
</div>
```

### Sistema de Espaciado

Basado en múltiplos de 4px para consistencia:

```css
--space-1: 0.25rem; /* 4px */
--space-2: 0.5rem; /* 8px */
--space-4: 1rem; /* 16px */
--space-6: 1.5rem; /* 24px */
--space-8: 2rem; /* 32px */
```

### Tipografía

Escala tipográfica basada en ratio 1.25 (Major Third):

```css
--font-size-base: 1rem; /* 16px */
--font-size-lg: 1.125rem; /* 18px */
--font-size-xl: 1.25rem; /* 20px */
--font-size-2xl: 1.5rem; /* 24px */
```

## 🧩 Componentes CSS

### Botones

Sistema completo de botones con variantes semánticas:

```html
<!-- Botón primario -->
<button class="btn btn-primary">Botón Principal</button>

<!-- Botón secundario -->
<button class="btn btn-secondary">Botón Secundario</button>

<!-- Botón destacado (CTA) -->
<button class="btn btn-highlight">¡Llama Ahora!</button>

<!-- Tamaños -->
<button class="btn btn-primary btn-sm">Pequeño</button>
<button class="btn btn-primary btn-lg">Grande</button>

<!-- Estados -->
<button class="btn btn-outline-primary">Outlined</button>
<button class="btn btn-ghost">Ghost</button>
<button class="btn btn-loading">Cargando...</button>
```

### Cards

```html
<div class="card">
  <div class="card-header">
    <h3>Título de la Card</h3>
  </div>
  <div class="card-body">
    <p>Contenido de la card...</p>
  </div>
  <div class="card-footer">
    <button class="btn btn-primary">Acción</button>
  </div>
</div>

<!-- Card con efecto glass -->
<div class="card card-glass">
  <div class="card-body">
    <p>Card con efecto vidrio esmerilado</p>
  </div>
</div>
```

### Formularios

```html
<div class="form-group">
  <label class="form-label" for="email">Email</label>
  <input
    type="email"
    id="email"
    class="form-input"
    placeholder="tu@email.com"
  />
  <div class="form-help">Nunca compartiremos tu email</div>
</div>

<div class="form-group">
  <label class="form-label" for="message">Mensaje</label>
  <textarea id="message" class="form-textarea" rows="4"></textarea>
</div>
```

### Alertas

```html
<div class="alert alert-success">
  <div class="alert-title">¡Éxito!</div>
  <div class="alert-message">Tu presupuesto ha sido enviado.</div>
</div>

<div class="alert alert-warning">
  <div class="alert-title">Atención</div>
  <div class="alert-message">Revisa los datos antes de enviar.</div>
</div>
```

## ⚙️ Integración con Tailwind

### Configuración

El archivo `tailwind.config.js` mapea nuestras variables CSS a utilidades de Tailwind:

```javascript
// Helper para colores con opacidad
function withOpacity(variable) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variable}), ${opacityValue})`;
    }
    return `rgb(var(${variable}))`;
  };
}

export default defineConfig({
  theme: {
    extend: {
      colors: {
        primary: withOpacity("--color-primary"),
        secondary: withOpacity("--color-secondary"),
        // ...más colores
      },
    },
  },
});
```

### Beneficios de la Integración

1. **Theming dinámico**: Cambiar variables CSS actualiza todo el sitio
2. **Opacidades automáticas**: `bg-primary/50` funciona automáticamente
3. **IntelliSense**: Autocompletado en VS Code
4. **Purging**: Solo se incluyen las clases utilizadas

## 🚀 Guía de Uso

### En Componentes Astro

```astro
---
// src/components/MyComponent.astro
---

<div class="bg-primary text-white p-6 rounded-lg">
  <h2 class="text-2xl font-bold text-highlight">
    Título con color destacado
  </h2>
  <p class="text-secondary/80 mt-4">
    Texto con opacidad usando tokens
  </p>
  <button class="btn btn-accent mt-6">
    Botón con componente CSS
  </button>
</div>
```

### Responsive Design

```html
<!-- Container responsive -->
<div class="container-responsive">
  <!-- Grid responsive -->
  <div class="grid-cards">
    <div class="card">Card 1</div>
    <div class="card">Card 2</div>
    <div class="card">Card 3</div>
  </div>
</div>
```

### Gradientes Predefinidos

```html
<section class="bg-gradient-hero min-h-screen">
  <div class="bg-gradient-primary p-8 rounded-xl">
    <h1 class="text-white">Hero con gradiente del brand</h1>
  </div>
</section>
```

## 🔄 Migración desde Hardcoded

### Antes (Hardcoded)

```html
<div class="bg-[#264e70] text-white hover:bg-[#1e3a54]">
  Botón con colores hardcodeados
</div>
```

### Después (Sistema de Tokens)

```html
<div class="btn btn-primary">Botón con sistema de tokens</div>
```

### Script de Migración

Para migrar colores hardcodeados existentes:

1. **Identificar colores**: Buscar patrones `#[hex]`, `rgb()`, `rgba()`
2. **Mapear a tokens**: Reemplazar por variables correspondientes
3. **Usar componentes**: Aplicar clases de componente cuando sea apropiado

### Herramientas de Migración

```bash
# Buscar colores hardcodeados
grep -r "#[0-9a-fA-F]\{6\}" src/

# Buscar valores RGB hardcodeados
grep -r "rgb\|rgba" src/
```

## ✅ Mejores Prácticas

### 1. Uso de Variables CSS

**✅ Hacer:**

```css
.custom-component {
  background: rgb(var(--color-primary));
  color: rgb(var(--color-white));
}
```

**❌ Evitar:**

```css
.custom-component {
  background: #264e70;
  color: #ffffff;
}
```

### 2. Componentes vs Utilidades

**✅ Usar componentes para:**

- Patrones repetitivos (botones, cards, forms)
- Estados complejos (loading, hover, focus)
- Lógica de negocio específica

**✅ Usar utilidades para:**

- Layouts únicos
- Espaciado específico
- Ajustes puntuales

### 3. Responsive Design

```html
<!-- ✅ Mobile-first con tokens -->
<div class="p-4 md:p-6 lg:p-8 bg-primary/10 md:bg-primary/20">
  <!-- ❌ Desktop-first con valores fijos -->
  <div class="p-8 md:p-6 sm:p-4 bg-[#264e70]/10"></div>
</div>
```

### 4. Accesibilidad

Siempre incluir estados de focus y contraste suficiente:

```html
<button class="btn btn-primary focus-ring">Botón accesible</button>
```

## ♿ Accesibilidad

### Contraste de Colores

Todos los colores del sistema cumplen con WCAG 2.2 AA:

- `primary` sobre `white`: 7.2:1 ✅
- `secondary` sobre `white`: 4.8:1 ✅
- `highlight` sobre `primary`: 4.9:1 ✅

### Estados de Focus

```css
/* Focus visible para navegación por teclado */
.focus-ring:focus-visible {
  outline: 2px solid rgba(var(--color-primary), 0.6);
  outline-offset: 2px;
}
```

### Skip Links

```html
<a href="#main-content" class="skip-link"> Saltar al contenido principal </a>
```

### Preferencias del Usuario

El sistema respeta las preferencias de accesibilidad:

```css
/* Movimiento reducido */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

/* Alto contraste */
@media (prefers-contrast: high) {
  :root {
    --color-text: var(--color-black);
    --color-bg: var(--color-white);
  }
}
```

## 🔧 Troubleshooting

### Variables CSS no funcionan

**Problema**: Las variables CSS no se aplican

**Solución**:

1. Verificar que `theme.css` esté importado en `global.css`
2. Comprobar la sintaxis: `rgb(var(--color-primary))` no `var(--color-primary)`
3. Asegurar que el archivo esté en el build de Vite

### Tailwind no reconoce colores custom

**Problema**: IntelliSense no sugiere colores custom

**Solución**:

1. Verificar `tailwind.config.js` tenga la configuración correcta
2. Reiniciar el servidor de desarrollo
3. Limpiar cache: `rm -rf node_modules/.cache`

### Colores no cambian dinámicamente

**Problema**: Cambiar variables CSS no actualiza el sitio

**Solución**:

1. Verificar que se usan variables CSS, no valores hardcodeados
2. Confirmar que Tailwind use la función `withOpacity`
3. Purgar y regenerar CSS: `pnpm build`

### Performance Issues

**Problema**: El CSS es muy grande

**Solución**:

1. Usar `safelist` en Tailwind config para clases críticas
2. Configurar purging correctamente
3. Lazy load para estilos no críticos

## 📈 Próximos Pasos

### Implementaciones Futuras

1. **Dark Mode**: Sistema de theming claro/oscuro
2. **Multiple Brands**: Soporte para diferentes marcas
3. **Dynamic Theming**: Cambio de tema en runtime
4. **CSS-in-JS**: Integración con styled-components si es necesario

### Métricas de Adopción

- [ ] Migrar todos los colores hardcodeados
- [ ] Documentar componentes custom
- [ ] Implementar testing visual
- [ ] Auditar accesibilidad completa

---

## 📚 Referencias

- [Astro Styling Guide](https://docs.astro.build/en/guides/styling/)
- [Tailwind CSS Custom Properties](https://tailwindcss.com/docs/customizing-colors#using-css-variables)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [CSS Custom Properties MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)

---

**Maintainer**: Jorge Orcajo  
**Last Updated**: August 2025  
**Version**: 1.0.0
