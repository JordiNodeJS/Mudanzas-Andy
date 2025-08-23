# TASK-002: Implementar View Transitions para Comportamiento SPA

## 🎯 **Objetivo**

Convertir las secciones actuales en páginas separadas manteniendo la experiencia de Single Page Application mediante View Transitions de Astro 5 y CSS.

## 🚀 **Contexto Técnico**

### **Astro 5 View Transitions**

Astro 5 incluye soporte nativo para View Transitions API que permite:

- Transiciones suaves entre páginas
- Comportamiento SPA sin JavaScript adicional
- SEO-friendly con URLs individuales
- Progressive enhancement automático

### **Beneficios de la Implementación**

- ✅ **SEO**: Cada sección tendrá su propia URL
- ✅ **Performance**: Code splitting automático
- ✅ **UX**: Transiciones fluidas sin recarga
- ✅ **Navegación**: Back/forward buttons funcionan
- ✅ **Sharing**: URLs específicas para cada sección

## 📁 **Estructura de Páginas Propuesta**

```
src/pages/
├── index.astro          # Landing/Hero
├── servicios.astro      # Página de servicios
├── equipo.astro         # Página del equipo
├── precios.astro        # Página de precios
├── testimonios.astro    # Página de testimonios
└── contacto.astro       # Página de contacto (nueva)
```

## 🔧 **Implementación Técnica**

### **1. Configuración de View Transitions**

```astro
<!-- src/layouts/Layout.astro -->
---
import { ViewTransitions } from 'astro:transitions';
---
<html>
  <head>
    <ViewTransitions />
    <!-- otros meta tags -->
  </head>
  <body>
    <slot />
  </body>
</html>
```

### **2. Configuración de Transiciones CSS**

```css
/* src/styles/transitions.css */
@view-transition {
  navigation: auto;
}

/* Transición principal */
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.5s;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Transición específica para secciones */
.section-transition {
  view-transition-name: section-content;
}

::view-transition-old(section-content),
::view-transition-new(section-content) {
  animation-duration: 0.4s;
}
```

### **3. Estructura de Página Tipo**

```astro
<!-- src/pages/servicios.astro -->
---
import Layout from '../layouts/Layout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import ServicesSection from '../components/sections/ServicesSection.astro';
import ContactForm from '../components/ContactForm.astro';
---

<Layout title="Servicios de Mudanza - Mudanzas Andy">
  <Header />

  <main class="pt-20">
    <div class="section-transition">
      <ServicesSection />
    </div>
  </main>

  <Footer />
  <ContactForm />
</Layout>
```

### **4. Navegación Actualizada**

```astro
<!-- src/components/Header.astro - Fragmento de navegación -->
<nav class="space-x-6">
  <a href="/" class="nav-link">Inicio</a>
  <a href="/servicios" class="nav-link">Servicios</a>
  <a href="/equipo" class="nav-link">Equipo</a>
  <a href="/precios" class="nav-link">Precios</a>
  <a href="/testimonios" class="nav-link">Testimonios</a>
  <a href="/contacto" class="nav-link">Contacto</a>
</nav>
```

## 📋 **Plan de Implementación**

### **Fase 1: Configuración Base** (2-3 horas)

- [ ] Configurar ViewTransitions en Layout.astro
- [ ] Crear archivo de estilos de transiciones
- [ ] Testear configuración básica

### **Fase 2: Creación de Páginas** (3-4 horas)

- [ ] Crear `servicios.astro`
- [ ] Crear `equipo.astro`
- [ ] Crear `precios.astro`
- [ ] Crear `testimonios.astro`
- [ ] Crear `contacto.astro`

### **Fase 3: Navegación** (1-2 horas)

- [ ] Actualizar Header.astro con enlaces
- [ ] Implementar navegación activa
- [ ] Añadir breadcrumbs si es necesario

### **Fase 4: Optimizaciones** (2-3 horas)

- [ ] Configurar transiciones específicas
- [ ] Optimizar performance
- [ ] Añadir fallbacks para navegadores antiguos
- [ ] Testing cross-browser

### **Fase 5: SEO y Meta Tags** (1-2 horas)

- [ ] Meta tags específicos por página
- [ ] Schema.org markup
- [ ] Sitemap actualizado
- [ ] Open Graph tags

## 🛠️ **Configuración Avanzada**

### **Transiciones Personalizadas por Sección**

```astro
<!-- Transición fade para servicios -->
<div transition:name="services" transition:animate="fade">
  <ServicesSection />
</div>

<!-- Transición slide para equipo -->
<div transition:name="team" transition:animate="slide">
  <TeamSection />
</div>
```

### **Fallback para Navegadores Sin Soporte**

```javascript
// src/scripts/fallback.js
if (!("startViewTransition" in document)) {
  // Fallback para navegadores sin soporte
  document.documentElement.classList.add("no-view-transitions");
}
```

## 🔍 **Consideraciones Técnicas**

### **Pros**

- ✅ URLs SEO-friendly individuales
- ✅ Mejor performance (code splitting)
- ✅ Experiencia de usuario mejorada
- ✅ Progressive enhancement
- ✅ Soporte nativo de Astro 5

### **Contras**

- ⚠️ Complejidad adicional en navegación
- ⚠️ Requiere testing extensivo
- ⚠️ Fallbacks para navegadores antiguos
- ⚠️ Posible duplicación de componentes compartidos

### **Navegadores Compatibles**

- Chrome 111+
- Edge 111+
- Firefox (experimental)
- Safari (en desarrollo)

## 📊 **Métricas de Éxito**

- **Performance**: Core Web Vitals mejorados
- **SEO**: Indexación individual de páginas
- **UX**: Transiciones fluidas < 500ms
- **Accessibility**: Navegación accesible
- **Cross-browser**: Funciona en 95%+ navegadores

## ⏱️ **Estimación Total**

**Tiempo estimado**: 8-12 horas
**Complejidad**: Media-Alta
**Riesgo**: Medio (requiere testing extensivo)

---

**Estado**: 🟡 PLANIFICADO
**Prioridad**: ALTA
**Dependencias**: TASK-001 completada
