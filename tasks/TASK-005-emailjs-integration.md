# TASK-005: Integración de EmailJS en Formularios

## 📋 Descripción

Implementar EmailJS SDK en los formularios existentes (`ContactForm.astro` y `SmartPopup.astro`) para permitir el envío de emails automáticos sin backend, manteniendo la funcionalidad actual de WhatsApp como backup.

## 🎯 Objetivos

- Integrar EmailJS SDK en el proyecto Astro
- Configurar envío de emails desde ContactForm (formulario sticky footer)
- Configurar envío de emails desde SmartPopup (popup de urgencia)
- Mantener funcionalidad de WhatsApp existente como respaldo
- Implementar validación y feedback de usuario mejorado
- Seguir las reglas del proyecto para componentes React/Astro

## 📚 Información Técnica

### Credenciales EmailJS

- **PUBLIC_KEY**: `4KyOE-93jACxKcJPf`
- **Documentación**: https://www.emailjs.com/docs/sdk/installation/
- **SDK Package**: `@emailjs/browser`

### Métodos EmailJS Disponibles

- `emailjs.init()`: Inicialización global con public key
- `emailjs.send()`: Envío con parámetros personalizados
- `emailjs.sendForm()`: Envío directo desde formulario HTML

## 🛠️ Plan de Implementación

### Fase 1: Instalación y Configuración Base

```bash
# Instalación via pnpm (requerido en el proyecto)
pnpm add @emailjs/browser
```

### Fase 2: Configuración Global

Crear archivo de configuración centralizada siguiendo las reglas del proyecto:

**Archivo**: `src/config/emailjs.json`

```json
{
  "publicKey": "4KyOE-93jACxKcJPf",
  "serviceId": "TU_SERVICE_ID",
  "templates": {
    "contactForm": "TU_TEMPLATE_CONTACT_ID",
    "smartPopup": "TU_TEMPLATE_POPUP_ID"
  },
  "options": {
    "blockHeadless": true,
    "limitRate": {
      "throttle": 10000
    }
  }
}
```

### Fase 3: Utilidad EmailJS Helper

Crear helper siguiendo convenciones del proyecto:

**Archivo**: `src/lib/utils/emailService.ts`

```typescript
import emailjs from "@emailjs/browser";
import type { EmailJSResponseStatus } from "@emailjs/browser";
import emailConfig from "@/config/emailjs.json";

export interface EmailData {
  from_name: string;
  from_email?: string;
  from_phone?: string;
  message: string;
  reply_to?: string;
}

export interface EmailResponse {
  success: boolean;
  message: string;
  error?: string;
}

export class EmailService {
  private static initialized = false;

  static init(): void {
    if (!this.initialized) {
      emailjs.init({
        publicKey: emailConfig.publicKey,
        ...emailConfig.options,
      });
      this.initialized = true;
    }
  }

  static async sendContactEmail(data: EmailData): Promise<EmailResponse> {
    this.init();

    try {
      const response = await emailjs.send(
        emailConfig.serviceId,
        emailConfig.templates.contactForm,
        {
          from_name: data.from_name,
          from_email: data.from_email,
          from_phone: data.from_phone,
          message: data.message,
          reply_to: data.from_email || data.from_phone,
          to_name: "Mudanzas ANDY",
        }
      );

      return {
        success: true,
        message: "¡Email enviado correctamente! Te contactaremos pronto.",
      };
    } catch (error) {
      console.error("EmailJS Error:", error);
      return {
        success: false,
        message: "Error al enviar email. Intentando WhatsApp...",
        error:
          error instanceof EmailJSResponseStatus ? error.text : "Unknown error",
      };
    }
  }

  static async sendPopupEmail(data: EmailData): Promise<EmailResponse> {
    this.init();

    try {
      const response = await emailjs.send(
        emailConfig.serviceId,
        emailConfig.templates.smartPopup,
        {
          from_name: data.from_name,
          from_phone: data.from_phone,
          message: data.message,
          reply_to: data.from_phone,
          to_name: "Mudanzas ANDY",
          urgent: true,
        }
      );

      return {
        success: true,
        message: "¡Solicitud urgente enviada! Te llamaremos en 2 minutos.",
      };
    } catch (error) {
      console.error("EmailJS Error:", error);
      return {
        success: false,
        message: "Error al enviar email. Abriendo WhatsApp...",
        error:
          error instanceof EmailJSResponseStatus ? error.text : "Unknown error",
      };
    }
  }
}
```

### Fase 4: Actualización ContactForm.astro

**Modificaciones necesarias:**

1. Importar EmailService
2. Añadir campo nombre al formulario
3. Integrar envío EmailJS antes de WhatsApp
4. Mejorar feedback visual

**Cambios en el script:**

```typescript
import { EmailService } from "@/lib/utils/emailService.js";

// En el evento submit del formulario
const emailResult = await EmailService.sendContactEmail({
  from_name: name || "Cliente Anónimo",
  from_email: email,
  from_phone: phone,
  message: `Solicitud de presupuesto de mudanza desde web. Email: ${email}${
    phone ? ` | Teléfono: ${phone}` : ""
  }`,
});

if (emailResult.success) {
  // Mostrar mensaje de éxito EmailJS
} else {
  // Fallback a WhatsApp
}
```

### Fase 5: Actualización SmartPopup.astro

**Modificaciones necesarias:**

1. Integrar EmailService
2. Envío EmailJS como canal principal
3. WhatsApp como backup
4. Mantener UI actual

**Script actualizado:**

```typescript
import { EmailService } from "@/lib/utils/emailService.js";

// En el evento submit del popup
const emailResult = await EmailService.sendPopupEmail({
  from_name: name,
  from_phone: phone,
  message: `¡SOLICITUD URGENTE! Soy ${name}. Por favor llámenme URGENTE al ${phone} para presupuesto de mudanza.`,
});
```

### Fase 6: Configuración EmailJS Dashboard

**Templates requeridos:**

1. **Template ContactForm**: Para formulario sticky
2. **Template SmartPopup**: Para popup urgente

**Variables de template:**

- `{{from_name}}`: Nombre del cliente
- `{{from_email}}`: Email del cliente
- `{{from_phone}}`: Teléfono del cliente
- `{{message}}`: Mensaje personalizado
- `{{reply_to}}`: Campo para respuesta
- `{{to_name}}`: "Mudanzas ANDY"
- `{{urgent}}`: Flag para solicitudes urgentes

## 🧪 Plan de Testing con Playwright

### Test 1: Verificación ContactForm

```javascript
// Verificar formulario sticky footer
await page.fill("#email", "test@example.com");
await page.fill("#phone", "640 50 60 84");
await page.click('button[type="submit"]');

// Verificar feedback
await expect(page.locator(".success-message")).toBeVisible();
```

### Test 2: Verificación SmartPopup

```javascript
// Esperar popup (45 segundos)
await page.waitForTimeout(45000);
await expect(page.locator("#smartPopup")).toBeVisible();

// Llenar formulario popup
await page.fill("#popupName", "Juan Test");
await page.fill("#popupPhone", "600 12 34 56");
await page.click('button[type="submit"]');

// Verificar envío exitoso
await expect(page.locator(".success-message")).toBeVisible();
```

### Test 3: Verificación Fallback WhatsApp

```javascript
// Simular error EmailJS
await page.evaluate(() => {
  window.emailjs = undefined;
});

// Intentar envío
await page.fill("#email", "test@example.com");
await page.click('button[type="submit"]');

// Verificar que se abre WhatsApp
await expect(page).toHaveURL(/wa\.me/);
```

## 📝 Pasos de Verificación

### 1. Configuración EmailJS Dashboard

- [ ] Crear cuenta/servicio EmailJS
- [ ] Configurar service_id
- [ ] Crear templates para ambos formularios
- [ ] Verificar public key activo

### 2. Implementación Código

- [ ] Instalar `@emailjs/browser` con pnpm
- [ ] Crear `src/config/emailjs.json`
- [ ] Implementar `src/lib/utils/emailService.ts`
- [ ] Actualizar `ContactForm.astro`
- [ ] Actualizar `SmartPopup.astro`

### 3. Testing Funcional

- [ ] Test envío ContactForm → Email recibido
- [ ] Test envío SmartPopup → Email recibido
- [ ] Test fallback WhatsApp funcional
- [ ] Test validación campos requeridos
- [ ] Test feedback visual correcto

### 4. Testing Playwright

- [ ] Ejecutar tests automatizados
- [ ] Screenshots de confirmación
- [ ] Verificar console errors
- [ ] Test responsive (mobile/desktop)

## 🚨 Consideraciones Importantes

### Seguridad

- Public key es seguro exponer (confirmado por EmailJS docs)
- Rate limiting configurado (10 segundos entre envíos)
- Block headless browsers activado

### UX/UI

- Mantener diseño actual exacto
- Feedback claro sobre estado del envío
- WhatsApp como backup siempre disponible
- Tiempos de espera razonables

### Performance

- EmailJS se carga async para no bloquear UI
- Fallback inmediato si error
- No impacto en renderizado Astro SSG

### Compatibilidad

- Compatible con sistema de colores del proyecto
- Sigue convenciones TypeScript estricto
- Respeta aliases de importación `@/*`
- No rompe funcionalidad existente

## 📊 Métricas de Éxito

- [ ] Emails enviados correctamente desde ambos formularios
- [ ] Tiempo respuesta < 3 segundos por envío
- [ ] Fallback WhatsApp funcional al 100%
- [ ] Zero errores JavaScript en consola
- [ ] Diseño visual idéntico al actual
- [ ] Tests Playwright pasando al 100%

---

**Creado**: 26 de agosto, 2025  
**Estado**: 🔄 Pendiente  
**Prioridad**: Alta  
**Estimación**: 3-4 horas  
**Dependencies**: Configuración EmailJS Dashboard
