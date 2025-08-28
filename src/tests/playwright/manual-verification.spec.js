import { test, expect } from "@playwright/test";

// Configuración específica para estas pruebas
const BASE_URL = "http://localhost:4322";

test.describe("Comprobación Manual - Navegación y Funcionalidad", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");
  });

  test("🔍 Verificar enlaces del menú de escritorio", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });

    console.log("✅ Verificando enlaces del menú principal...");

    const menuLinks = [
      { selector: 'a[href="/#inicio"]', text: "Inicio" },
      { selector: 'a[href="/#servicios"]', text: "Servicios" },
      { selector: 'a[href="/#equipo"]', text: "Equipo" },
      { selector: 'a[href="/#precios"]', text: "Precios" },
      { selector: 'a[href="/#testimonios"]', text: "Testimonios" },
      { selector: 'a[href="/blog-astro"]', text: "Blog" },
    ];

    for (const link of menuLinks) {
      const linkElement = page.locator(link.selector).first();
      await expect(linkElement).toBeVisible();
      console.log(`✅ Enlace ${link.text} - VISIBLE`);
    }

    // Verificar enlaces de contacto
    const phoneLink = page.locator('a[href="tel:+34933539792"]');
    await expect(phoneLink).toBeVisible();
    console.log("✅ Enlace de teléfono - VISIBLE");

    const emailLink = page.locator('a[href*="mailto:"]');
    await expect(emailLink).toBeVisible();
    console.log("✅ Enlace de email - VISIBLE");
  });

  test("📱 Verificar menú hamburguesa móvil", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState("networkidle");

    console.log("📱 Probando menú hamburguesa en móvil...");

    const menuButton = page.locator("#mobile-menu-button");
    await expect(menuButton).toBeVisible();
    console.log("✅ Botón hamburguesa - VISIBLE");

    const mobileMenu = page.locator("#mobile-menu");
    await expect(mobileMenu).toHaveClass(/hidden/);
    console.log("✅ Menú móvil inicialmente oculto - OK");

    // Abrir menú
    await menuButton.click();
    await expect(mobileMenu).not.toHaveClass(/hidden/);
    console.log("✅ Menú móvil se abre al hacer clic - OK");

    // Verificar enlaces móviles
    const mobileLinks = [
      'a[href="/#inicio"].mobile-menu-link',
      'a[href="/#servicios"].mobile-menu-link',
      'a[href="/#equipo"].mobile-menu-link',
      'a[href="/#precios"].mobile-menu-link',
      'a[href="/#testimonios"].mobile-menu-link',
      'a[href="/blog-astro"].mobile-menu-link',
    ];

    for (const linkSelector of mobileLinks) {
      const link = page.locator(linkSelector);
      await expect(link).toBeVisible();
    }
    console.log("✅ Todos los enlaces móviles - VISIBLES");

    // Cerrar menú
    await menuButton.click();
    await expect(mobileMenu).toHaveClass(/hidden/);
    console.log("✅ Menú móvil se cierra correctamente - OK");
  });

  test("🚛 Verificar animación del camión", async ({ page }) => {
    console.log("🚛 Verificando animación del camión...");

    const truckLogo = page.locator("#truck-logo");
    await expect(truckLogo).toBeVisible();
    console.log("✅ Logo del camión - VISIBLE");

    // Esperar animación
    await page.waitForTimeout(1500);

    const hasAnimationClass = await truckLogo.evaluate((el) =>
      el.classList.contains("truck-drive")
    );
    expect(hasAnimationClass).toBeTruthy();
    console.log("✅ Clase de animación truck-drive - APLICADA");

    const isAnimated = await truckLogo.getAttribute("data-animated");
    expect(isAnimated).toBe("true");
    console.log("✅ Atributo data-animated - TRUE");
  });

  test("🔄 Verificar navegación y view transitions", async ({ page }) => {
    console.log("🔄 Probando navegación entre páginas...");

    // Ir al blog
    await page.click('a[href="/blog-astro"]');
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/.*\/blog-astro/);
    console.log("✅ Navegación al blog - OK");

    await expect(page.locator("h1")).toContainText("Blog de Mudanzas ANDY");
    console.log("✅ Contenido del blog cargado - OK");

    // Verificar animación del camión después de transición
    await page.waitForTimeout(200);
    const truckLogo = page.locator("#truck-logo");
    await page.waitForTimeout(1500);

    const hasAnimationAfterTransition = await truckLogo.evaluate((el) =>
      el.classList.contains("truck-drive")
    );
    expect(hasAnimationAfterTransition).toBeTruthy();
    console.log(
      "✅ Animación del camión funciona después de view transition - OK"
    );

    // Regresar a inicio
    await page.click('a[href="/#inicio"]');
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/.*\/#inicio$/);
    console.log("✅ Regreso a página principal - OK");
  });

  test("📜 Verificar smooth scroll", async ({ page }) => {
    console.log("📜 Verificando smooth scroll...");

    const sections = [
      { href: "/#servicios", id: "#servicios" },
      { href: "/#equipo", id: "#equipo" },
      { href: "/#precios", id: "#precios" },
    ];

    for (const section of sections) {
      await page.click(`a[href="${section.href}"]`);
      await page.waitForTimeout(1000);

      const sectionElement = page.locator(section.id);
      await expect(sectionElement).toBeInViewport();
      console.log(`✅ Scroll a ${section.id} - OK`);
    }
  });

  test("📞 Verificar botones CTA y enlaces de contacto", async ({ page }) => {
    console.log("📞 Verificando botones de contacto...");

    // Verificar enlaces de teléfono
    const phoneLinks = page.locator('a[href^="tel:"]');
    const phoneCount = await phoneLinks.count();
    expect(phoneCount).toBeGreaterThan(0);
    console.log(`✅ ${phoneCount} enlaces de teléfono encontrados`);

    // Verificar enlaces de email
    const emailLinks = page.locator('a[href^="mailto:"]');
    const emailCount = await emailLinks.count();
    expect(emailCount).toBeGreaterThan(0);
    console.log(`✅ ${emailCount} enlaces de email encontrados`);

    // Verificar botones con texto de contacto
    const ctaButtons = page.locator("a, button").filter({
      hasText: /contacto|presupuesto|llamar|633539792/i,
    });
    const buttonCount = await ctaButtons.count();
    console.log(`📋 ${buttonCount} botones CTA encontrados`);
  });

  test("📐 Verificar responsividad", async ({ page }) => {
    console.log("📐 Verificando responsividad...");

    const viewports = [
      { width: 375, height: 667, name: "Mobile" },
      { width: 768, height: 1024, name: "Tablet" },
      { width: 1280, height: 720, name: "Desktop" },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await page.reload();
      await page.waitForLoadState("networkidle");

      const header = page.locator("header");
      await expect(header).toBeVisible();

      const truckLogo = page.locator("#truck-logo, #truck-logo-mobile").first();
      await expect(truckLogo).toBeVisible();

      console.log(
        `✅ ${viewport.name} (${viewport.width}x${viewport.height}) - OK`
      );
    }
  });

  test("♿ Verificar accesibilidad básica", async ({ page }) => {
    console.log("♿ Verificando accesibilidad básica...");

    // Verificar que las imágenes tienen alt text
    const images = page.locator("img");
    const imageCount = await images.count();
    let imagesWithAlt = 0;

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      if (await img.isVisible()) {
        const altText = await img.getAttribute("alt");
        if (altText) {
          imagesWithAlt++;
        }
      }
    }

    console.log(
      `✅ ${imagesWithAlt}/${imageCount} imágenes visibles tienen alt text`
    );

    // Verificar botones tienen texto accesible
    const buttons = page.locator("button, a");
    const buttonCount = await buttons.count();
    let accessibleButtons = 0;

    for (let i = 0; i < Math.min(buttonCount, 20); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        const hasText = (await button.textContent())?.trim().length > 0;
        const hasAriaLabel = await button.getAttribute("aria-label");
        const hasTitle = await button.getAttribute("title");

        if (hasText || hasAriaLabel || hasTitle) {
          accessibleButtons++;
        }
      }
    }

    console.log(
      `✅ ${accessibleButtons} botones/enlaces tienen texto accesible`
    );
  });
});

test.describe("🎯 Pruebas específicas del Blog", () => {
  test("Verificar funcionalidad del blog", async ({ page }) => {
    console.log("🎯 Verificando página del blog...");

    await page.goto(`${BASE_URL}/blog-astro`);
    await page.waitForLoadState("networkidle");

    await expect(page.locator("h1")).toContainText("Blog de Mudanzas ANDY");
    console.log("✅ Título del blog - OK");

    // Verificar iframe si existe
    const iframe = page.locator("iframe");
    const iframeCount = await iframe.count();
    if (iframeCount > 0) {
      await expect(iframe.first()).toBeVisible();
      console.log("✅ Iframe del blog - VISIBLE");
    } else {
      console.log("ℹ️ No se encontró iframe en el blog");
    }

    // Verificar navegación de regreso
    await page.click('a[href="/#inicio"]');
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/.*\/#inicio$/);
    console.log("✅ Navegación de regreso desde blog - OK");
  });
});
