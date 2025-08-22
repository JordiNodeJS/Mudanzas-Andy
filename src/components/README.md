# 🧩 **Componentes de Mudanzas Andy**

Esta carpeta contiene los componentes reutilizables del proyecto. Todos los componentes están diseñados para ser funcionales, accesibles y fáciles de usar.

---

## 📋 **Componentes disponibles**

### 🎯 **Button.astro**
Componente de botón reutilizable con múltiples variantes y tamaños.

#### **Props:**
- `href` (string): Enlace para botones tipo enlace
- `variant` ("primary" | "secondary" | "outline"): Estilo del botón
- `size` ("sm" | "md" | "lg"): Tamaño del botón
- `fullWidth` (boolean): Si el botón debe ocupar todo el ancho
- `disabled` (boolean): Si el botón está deshabilitado
- `type` ("button" | "submit" | "reset"): Tipo de botón
- `className` (string): Clases CSS adicionales

#### **Uso:**
```astro
---
import Button from '../components/Button.astro';
---

<!-- Botón primario -->
<Button variant="primary" size="lg">
  Solicitar Presupuesto
</Button>

<!-- Botón de enlace -->
<Button href="/contacto" variant="outline">
  Contactar
</Button>

<!-- Botón deshabilitado -->
<Button disabled variant="secondary">
  No disponible
</Button>
```

---

### 🃏 **Card.astro**
Componente de tarjeta para mostrar información de servicios o productos.

#### **Props:**
- `title` (string): Título de la tarjeta
- `description` (string): Descripción del contenido
- `imageSrc` (string): URL de la imagen (opcional)
- `imageAlt` (string): Texto alternativo de la imagen
- `href` (string): Enlace de la tarjeta
- `buttonText` (string): Texto del botón
- `variant` ("default" | "elevated" | "bordered"): Estilo de la tarjeta

#### **Uso:**
```astro
---
import Card from '../components/Card.astro';
---

<Card
  title="Mudanzas Residenciales"
  description="Servicio completo de mudanza para hogares"
  imageSrc="/images/residencial.jpg"
  imageAlt="Mudanza residencial"
  href="/servicios/residenciales"
  buttonText="Más información"
  variant="elevated"
/>
```

---

## 🎨 **Sistema de diseño**

### **Colores:**
- **Primary:** `#4f6bff` (Azul principal)
- **Secondary:** `#6b7280` (Gris secundario)
- **Text:** `#1f2937` (Texto principal)
- **Muted:** `#6b7280` (Texto secundario)

### **Espaciado:**
- **XS:** `8px`
- **SM:** `12px`
- **MD:** `16px`
- **LG:** `20px`
- **XL:** `24px`

### **Sombras:**
- **Default:** `0 2px 8px rgba(0, 0, 0, 0.1)`
- **Elevated:** `0 8px 25px rgba(0, 0, 0, 0.15)`
- **Hover:** `0 12px 40px rgba(0, 0, 0, 0.2)`

---

## 🚀 **Mejores prácticas**

### **1. Accesibilidad:**
- Siempre incluir `alt` en imágenes
- Usar `aria-` attributes cuando sea necesario
- Mantener contraste de colores adecuado

### **2. Rendimiento:**
- Usar `loading="lazy"` en imágenes
- Minimizar el uso de JavaScript innecesario
- Optimizar CSS con transiciones eficientes

### **3. Responsividad:**
- Todos los componentes son mobile-first
- Usar unidades relativas cuando sea posible
- Probar en diferentes tamaños de pantalla

---

## 🔧 **Desarrollo**

### **Crear un nuevo componente:**
1. Crear archivo `.astro` en esta carpeta
2. Definir props con TypeScript
3. Implementar estilos CSS
4. Documentar en este README
5. Probar con diferentes props

### **Estructura recomendada:**
```astro
---
// Props del componente
export let prop1: string = "";
export let prop2: number = 0;
---

<!-- HTML del componente -->
<div class="component">
  <!-- Contenido -->
</div>

<style>
  /* Estilos del componente */
  .component {
    /* Estilos base */
  }
</style>
```

---

## 📱 **Compatibilidad**

- ✅ **Astro 5.x**
- ✅ **Navegadores modernos**
- ✅ **Dispositivos móviles**
- ✅ **Accesibilidad WCAG 2.1**

---

**Última actualización:** 22 de agosto de 2025  
**Versión:** 1.0.0
