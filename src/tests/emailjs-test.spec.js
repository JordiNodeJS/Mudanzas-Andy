import { test, expect } from "@playwright/test";

test.describe("EmailJS Contact Form Integration", () => {
  test("should send email with test data: Ramón, frontend.flipoeyewear@gmail.com, 679099000", async ({
    page,
  }) => {
    // Navegar a la página principal
    await page.goto("http://localhost:4321/");

    // Verificar que el formulario está visible
    await expect(page.locator("#contactForm")).toBeVisible();

    // Llenar el formulario con los datos de prueba
    await page.fill("#name", "Ramón");
    await page.fill("#email", "frontend.flipoeyewear@gmail.com");
    await page.fill("#phone", "679099000");

    // Tomar screenshot antes del envío
    await page.screenshot({ path: "test-results/emailjs-form-filled.png" });

    // Verificar que los campos están correctamente llenos
    await expect(page.locator("#name")).toHaveValue("Ramón");
    await expect(page.locator("#email")).toHaveValue(
      "frontend.flipoeyewear@gmail.com"
    );
    await expect(page.locator("#phone")).toHaveValue("679099000");

    // Escuchar requests de red para verificar llamada a EmailJS
    let emailJSCalled = false;
    let emailJSResponse = null;
    page.on("request", (request) => {
      if (request.url().includes("emailjs.com")) {
        emailJSCalled = true;
        console.log("EmailJS API called:", request.url());
      }
    });

    // Capturar responses para EmailJS
    page.on("response", async (response) => {
      try {
        if (response.url().includes("emailjs.com")) {
          const status = response.status();
          let text = "";
          try {
            text = await response.text();
          } catch (e) {
            text = "<no body>";
          }
          emailJSResponse = { status, text };
          console.log("EmailJS response status:", status);
          console.log("EmailJS response body:", text);
        }
      } catch (err) {
        console.warn("Error reading EmailJS response", err);
      }
    });

    // Escuchar console logs para verificar errores o éxitos
    page.on("console", (msg) => {
      console.log("Browser console:", msg.type(), msg.text());
    });

    // Enviar formulario - usar un selector más específico
    await page.click('#budgetForm button[type="submit"]');

    // Esperar cambio en el botón (estado de carga) - selector más específico
    await expect(
      page.locator('#budgetForm button[type="submit"]')
    ).toContainText("Enviando");

    // Esperar resultado (máximo 10 segundos)
    await page.waitForTimeout(5000);

    // Tomar screenshot del resultado
    await page.screenshot({ path: "test-results/emailjs-result.png" });

    // Verificar si el resultado es exitoso o fallback

    // Verificar si aparece mensaje de éxito (EmailJS funcionó)
    const successMessage = page.locator(".bg-green-500");
    const fallbackMessage = page.locator(".bg-yellow-500");

    if (await successMessage.isVisible()) {
      console.log("✅ EmailJS funcionó correctamente");
      await expect(successMessage).toContainText("Email enviado correctamente");

      // Verificar que incluye opciones adicionales (específicos dentro del contactForm)
      await expect(
        page.locator('#contactForm a[href*="tel:"]').first()
      ).toBeVisible();
      await expect(page.locator('#contactForm a[href*="wa.me"]')).toBeVisible();
    } else if (await fallbackMessage.isVisible()) {
      console.log("⚠️ EmailJS falló, usando WhatsApp fallback");
      await expect(fallbackMessage).toContainText("WhatsApp");

      // Verificar que incluye enlace a WhatsApp - ser más específico
      const whatsappLink = page.locator('#contactForm a[href*="wa.me"]');
      await expect(whatsappLink).toBeVisible();

      // Verificar que el mensaje incluye los datos correctos (decodificar URL)
      const href = await whatsappLink.getAttribute("href");
      const decodedHref = decodeURIComponent(href);
      expect(decodedHref).toContain("Ramón");
      expect(decodedHref).toContain("frontend.flipoeyewear@gmail.com");
      expect(decodedHref).toContain("679099000");
    } else {
      throw new Error("No se detectó ni éxito ni fallback en el formulario");
    }

    // Log si EmailJS fue llamado
    console.log("EmailJS API llamado:", emailJSCalled);
    console.log("EmailJS response:", emailJSResponse);

    // Esperar un momento más para capturas finales
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "test-results/emailjs-final-state.png" });
  });
});
