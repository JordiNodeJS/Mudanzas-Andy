import emailjs from "@emailjs/browser";
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
      await emailjs.send(
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
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  static async sendPopupEmail(data: EmailData): Promise<EmailResponse> {
    this.init();

    try {
      await emailjs.send(
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
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
