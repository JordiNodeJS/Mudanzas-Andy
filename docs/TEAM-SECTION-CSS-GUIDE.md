# 📘 Guía de Uso - Team Section CSS Refactorizado

## 🎯 Estructura Básica

### HTML/Astro Component Básico

```astro
---
// TeamCard.astro
interface Props {
  name: string;
  role: string;
  image: string;
  variant?: 'primary' | 'secondary' | 'accent';
}

const { name, role, image, variant = 'primary' } = Astro.props;
---

<div class={`team-card ${variant ? `team-card--${variant}` : ''}`}>
  <div class="team-card__media">
    <img
      src={image}
      alt={`Foto de ${name}`}
      class="team-image-filter"
    />
  </div>
  <div class="team-card__body">
    <h3>{name}</h3>
    <p class="team-card__desc">{role}</p>
  </div>
</div>
```

## 🎨 Variantes Disponibles

### 1. Variante Primary (Accent + Highlight)

```html
<div class="team-card team-card--primary">
  <!-- Overlay con colores accent y highlight -->
</div>
```

### 2. Variante Secondary (Secondary + Neutral)

```html
<div class="team-card team-card--secondary">
  <!-- Overlay con colores secondary y neutral -->
</div>
```

### 3. Variante Accent (Primary + Secondary)

```html
<div class="team-card team-card--accent">
  <!-- Overlay con colores primary y secondary -->
</div>
```

## ⚙️ Variables CSS Personalizables

### En el archivo de tema o componente específico:

```css
.custom-team-section {
  /* Personalizar duraciones */
  --team-transition-fast: 200ms;
  --team-transition-normal: 350ms;

  /* Personalizar alturas */
  --team-card-height-mobile: 10rem;
  --team-card-height-desktop: 12rem;
  --team-card-height-hover: 14rem;

  /* Personalizar overlay */
  --team-overlay-opacity: 0.2;
  --team-overlay-opacity-hover: 0.08;
}
```

## 🔧 Personalización Avanzada

### Crear Nueva Variante

```css
.team-card--custom .team-card__media::after {
  background: linear-gradient(
    135deg,
    rgba(var(--color-highlight), var(--team-overlay-opacity)),
    rgba(var(--color-accent), calc(var(--team-overlay-opacity) * 0.4))
  );
}
```

### Override Hover Effects

```css
.team-card--minimal:hover {
  transform: none; /* Sin movimiento */
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1); /* Sombra más sutil */
}

.team-card--minimal:hover .team-card__media {
  height: var(--team-card-height-desktop); /* Sin expansión */
}
```

## 🧪 Testing y Debugging

### Clase Helper para Testing

```javascript
// Simular hover en tests
document.querySelector(".team-card").classList.add("is-hover");

// Remover hover
document.querySelector(".team-card").classList.remove("is-hover");
```

### CSS para Debugging

```css
/* Modo debug - mostrar bordes */
.debug .team-card {
  outline: 2px solid red;
}

.debug .team-card__media {
  outline: 2px solid blue;
}

.debug .team-card__body {
  outline: 2px solid green;
}
```

## 📱 Comportamiento Responsivo

### Mobile (< 768px)

- Altura base: `12rem` (192px)
- Padding: `1rem`
- Hover suave sin expansión excesiva

### Desktop (≥ 768px)

- Altura base: `14rem` (224px)
- Hover expansion: `15rem` (240px)
- Efectos más pronunciados

## ♿ Accesibilidad

### Focus States

- Outline visible en navegación por teclado
- Estados hover replicados en `:focus-within`
- Transiciones respetan `prefers-reduced-motion`

### ARIA Labels Recomendados

```html
<div class="team-card" role="article" aria-labelledby="team-member-1">
  <div class="team-card__media">
    <img src="..." alt="Retrato profesional de Juan Pérez" />
  </div>
  <div class="team-card__body">
    <h3 id="team-member-1">Juan Pérez</h3>
    <p class="team-card__desc">Director de Operaciones</p>
  </div>
</div>
```

## 🚀 Performance Tips

### 1. Lazy Loading Imágenes

```html
<img
  src="{image}"
  alt="{`Foto"
  de
  ${name}`}
  class="team-image-filter"
  loading="lazy"
  decoding="async"
/>
```

### 2. CSS Containment

```css
.team-card {
  contain: layout style paint;
}
```

### 3. Will-Change Responsable

```css
.team-card:hover {
  will-change: transform, box-shadow;
}

.team-card:not(:hover) {
  will-change: auto;
}
```

## 📊 Browser Support

- **Modern browsers**: Full support
- **IE 11**: Partial support (sin CSS variables)
- **Safari < 14**: Usar autoprefixer para transforms

### Fallbacks

```css
/* Fallback para navegadores sin CSS variables */
.team-card__media {
  height: 12rem; /* Fallback fijo */
  height: var(--team-card-height-mobile, 12rem);
}
```
