# REGLA DE COLORES - Sistema de Theming Centralizado

## 📋 **REGLA PRINCIPAL: Variables CSS como Fuente de Verdad**

### 🎯 **Principio Central**

**NUNCA usar colores hardcodeados**. Todos los colores deben referirse al sistema centralizado en `src/styles/theme.css`.

## 🔧 **Implementación de Colores**

### **1. Definición de Variables (src/styles/theme.css)**

```css
:root {
  /* [FORMATO RGB] Para compatibilidad con opacidades */
  --color-primary: 38 78 112; /* #264e70 - Azul corporativo */
  --color-secondary: 103 145 134; /* #679186 - Verde complementario */
  --color-accent: 249 180 171; /* #f9b4ab - Rosa coral CTA */
  --color-highlight: 250 227 96; /* #fae360 - Amarillo destacados */
  --color-neutral: 187 212 206; /* #bbd4ce - Verde neutro */

  /* [FALLBACK HEX] Para compatibilidad navegadores antiguos */
  --color-primary-hex: #264e70;
  --color-secondary-hex: #679186;
  --color-accent-hex: #f9b4ab;
  --color-highlight-hex: #fae360;
  --color-neutral-hex: #bbd4ce;
}
```

### **2. Uso en CSS (src/styles/components.css)**

```css
/* [CORRECTO] Color sólido con variable CSS */
background: rgb(var(--color-primary));
color: rgb(var(--color-secondary));

/* [CORRECTO] Color con opacidad */
background: rgba(var(--color-primary), 0.2);
border: 1px solid rgba(var(--color-accent), 0.5);

/* [CORRECTO] Gradientes con variables */
background: linear-gradient(
  to right,
  rgba(var(--color-secondary), 1),
  rgba(var(--color-accent), 0.8)
);

/* ❌ INCORRECTO - Color hardcodeado */
background: #264e70;
color: rgba(38, 78, 112, 0.5);
```

### **3. Uso en Tailwind (Temporal en src/styles/global.css)**

```css
/* [TEMPORAL] Utilidades directas hasta migración completa */
.text-primary {
  color: #264e70 !important;
}
.bg-secondary {
  background-color: #679186 !important;
}
.border-accent {
  border-color: #f9b4ab !important;
}
```

### **4. Uso en Componentes Astro**

```astro
---
// [CORRECTO] Mapeo automático con sistema de theming
const gradientClassMap: Record<string, string> = {
  "phone": "contact-card-gradient-phone",
  "whatsapp": "contact-card-gradient-whatsapp",
  "archive": "contact-card-gradient-email",
  "globe": "contact-card-gradient-coverage"
};
---

<!-- [CORRECTO] Usando clases del sistema -->
<div class={gradientClassMap[iconName]}>
  <span class="text-primary">Texto</span>
</div>

<!-- ❌ INCORRECTO - Style inline -->
<div style="background: #264e70;">
  <span style="color: #679186;">Texto</span>
</div>
```

## 🚨 **Reglas Estrictas**

### **❌ PROHIBIDO**

- Colores hardcodeados en cualquier formato (`#264e70`, `rgb(38, 78, 112)`)
- Estilos inline con colores
- Valores de color en props de componentes sin mapear al sistema
- Crear nuevas variables sin seguir convención RGB

### **✅ OBLIGATORIO**

- Usar variables CSS de `theme.css` como única fuente
- Formato RGB para variables principales: `--color-name: R G B`
- Fallback HEX para compatibilidad: `--color-name-hex: #RRGGBB`
- Documentar nuevos colores con comentarios descriptivos
- Gradientes definidos en `components.css` usando variables

## 📂 **Arquitectura de Archivos**

```
src/styles/
├── theme.css           # ✅ ÚNICA fuente de variables de color
├── components.css      # ✅ Gradientes y componentes con variables
└── global.css         # ⚠️ TEMPORAL: Utilidades directas Tailwind
```

## 🔄 **Flujo de Implementación**

### **Para añadir nuevo color:**

1. **Definir en theme.css**:

```css
--color-nuevo: 255 128 0; /* RGB format */
--color-nuevo-hex: #ff8000; /* Fallback */
```

2. **Crear utilidad temporal en global.css**:

```css
.text-nuevo {
  color: #ff8000 !important;
}
.bg-nuevo {
  background-color: #ff8000 !important;
}
```

3. **Usar en componentes**:

```css
/* En components.css */
.mi-componente {
  background: rgba(var(--color-nuevo), 0.3);
}
```

### **Para gradientes:**

1. **Definir en components.css**:

```css
.mi-gradiente {
  background: linear-gradient(
    to bottom right,
    rgba(var(--color-nuevo), 0.3),
    rgba(var(--color-primary), 0.1),
    rgba(255, 255, 255, 1)
  );
}
```

2. **Usar en Astro**:

```astro
<div class="mi-gradiente">Contenido</div>
```

## 🧪 **Testing y Verificación**

### **Checklist pre-commit:**

- [ ] No hay colores hardcodeados en el código
- [ ] Todas las variables están en `theme.css`
- [ ] Gradientes usan variables CSS
- [ ] Componentes mapean correctamente al sistema
- [ ] Fallbacks HEX disponibles

### **Herramientas de verificación:**

```bash
# Buscar colores hardcodeados
grep -r "#[0-9a-fA-F]\{6\}" src/ --exclude-dir=styles
grep -r "rgb(" src/ --exclude-dir=styles
grep -r "rgba(" src/ --exclude-dir=styles
```

## 📖 **Paleta de Colores Oficiales**

| Variable            | RGB           | HEX       | Descripción          | Uso                      |
| ------------------- | ------------- | --------- | -------------------- | ------------------------ |
| `--color-primary`   | `38 78 112`   | `#264e70` | Azul corporativo     | Headers, CTA principales |
| `--color-secondary` | `103 145 134` | `#679186` | Verde complementario | Badges, iconos           |
| `--color-accent`    | `249 180 171` | `#f9b4ab` | Rosa coral           | Elementos destacados     |
| `--color-highlight` | `250 227 96`  | `#fae360` | Amarillo             | Alertas, notificaciones  |
| `--color-neutral`   | `187 212 206` | `#bbd4ce` | Verde neutro         | Fondos suaves            |

---

**Actualizado**: Agosto 2025  
**Versión**: 1.0.0  
**Responsable**: Sistema de Theming Centralizado
