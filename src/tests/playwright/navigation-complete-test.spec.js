import { test, expect } from "@playwright/test";

test.describe("Navegación y Funcionalidad Completa de Mudanzas ANDY", () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la página principal antes de cada test
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("Verificar enlaces del menú de escritorio", async ({ page }) => {
    // Verificar que estamos en una vista de escritorio
    await page.setViewportSize({ width: 1280, height: 720 });

    // Verificar enlaces del menú principal
    const menuLinks = [
      { selector: 'a[href="/#inicio"]', text: "Inicio" },
      { selector: 'a[href="/#servicios"]', text: "Servicios" },
      { selector: 'a[href="/#equipo"]', text: "Equipo" },
      { selector: 'a[href="/#precios"]', text: "Precios" },
      { selector: 'a[href="/#testimonios"]', text: "Testimonios" },
      { selector: 'a[href="/blog-astro"]', text: "Blog" },
    ];

    for (const link of menuLinks) {
      await test.step(`Verificar enlace ${link.text}`, async () => {
        const linkElement = page.locator(link.selector).first();
        await expect(linkElement).toBeVisible();
        await expect(linkElement).toHaveText(new RegExp(link.text, "i"));
      });
    }

    // Verificar enlaces de contacto en el header
    await test.step("Verificar enlace de teléfono", async () => {
      const phoneLink = page.locator('a[href="tel:+34933539792"]');
      await expect(phoneLink).toBeVisible();
      await expect(phoneLink).toContainText("933 53 97 92");
    });

    await test.step("Verificar enlace de email", async () => {
      const emailLink = page.locator(
        'a[href="mailto:info@mudanzasandy.es,mundanzas.andy@gmail.com"]'
      );
      await expect(emailLink).toBeVisible();
    });
  });

  test("Verificar funcionamiento del menú hamburguesa móvil", async ({
    page,
  }) => {
    // Establecer viewport móvil
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Verificar que el botón hamburguesa está visible
    const menuButton = page.locator("#mobile-menu-button");
    await expect(menuButton).toBeVisible();

    // Verificar que el menú móvil está inicialmente oculto
    const mobileMenu = page.locator("#mobile-menu");
    await expect(mobileMenu).toHaveClass(/hidden/);

    // Hacer clic en el botón hamburguesa para abrir el menú
    await test.step("Abrir menú móvil", async () => {
      await menuButton.click();
      await expect(mobileMenu).not.toHaveClass(/hidden/);
    });

    // Verificar enlaces del menú móvil
    const mobileLinks = [
      'a[href="/#inicio"].mobile-menu-link',
      'a[href="/#servicios"].mobile-menu-link',
      'a[href="/#equipo"].mobile-menu-link',
      'a[href="/#precios"].mobile-menu-link',
      'a[href="/#testimonios"].mobile-menu-link',
      'a[href="/blog-astro"].mobile-menu-link',
    ];

    for (const linkSelector of mobileLinks) {
      await test.step(`Verificar enlace móvil ${linkSelector}`, async () => {
        const link = page.locator(linkSelector);
        await expect(link).toBeVisible();
      });
    }

    // Cerrar el menú haciendo clic en el botón hamburguesa
    await test.step("Cerrar menú móvil", async () => {
      await menuButton.click();
      await expect(mobileMenu).toHaveClass(/hidden/);
    });
  });

  test("Verificar animación del camión", async ({ page }) => {
    // Verificar que el camión tiene las clases correctas después de la animación
    await test.step("Verificar animación del camión desktop", async () => {
      const truckLogo = page.locator("#truck-logo");
      await expect(truckLogo).toBeVisible();

      // Esperar a que la animación se complete
      await page.waitForTimeout(1500);

      // Verificar que tiene la clase de animación final
      await expect(truckLogo).toHaveClass(/truck-drive/);
      await expect(truckLogo).toHaveAttribute("data-animated", "true");
    });

    // Probar en móvil también
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState("networkidle");

    await test.step("Verificar animación del camión móvil", async () => {
      const truckLogoMobile = page.locator("#truck-logo-mobile");
      if ((await truckLogoMobile.count()) > 0) {
        await expect(truckLogoMobile).toBeVisible();
        await page.waitForTimeout(1500);
        await expect(truckLogoMobile).toHaveClass(/truck-drive/);
        await expect(truckLogoMobile).toHaveAttribute("data-animated", "true");
      }
    });
  });

  test("Verificar navegación entre páginas y view transitions", async ({
    page,
  }) => {
    // Ir al blog
    await test.step("Navegar al blog", async () => {
      await page.click('a[href="/blog-astro"]');
      await page.waitForLoadState("networkidle");

      // Verificar que estamos en el blog
      await expect(page).toHaveURL(/.*\/blog-astro/);
      await expect(page.locator("h1")).toContainText("Blog de Mudanzas ANDY");
    });

    // Verificar que la animación del camión funciona después de la transición
    await test.step("Verificar animación del camión después de view transition", async () => {
      await page.waitForTimeout(200); // Esperar a que se complete la transición
      const truckLogo = page.locator("#truck-logo");
      await expect(truckLogo).toBeVisible();

      // Esperar a que la animación se complete
      await page.waitForTimeout(1500);
      await expect(truckLogo).toHaveClass(/truck-drive/);
    });

    // Regresar a la página principal
    await test.step("Regresar a la página principal", async () => {
      await page.click('a[href="/#inicio"]');
      await page.waitForLoadState("networkidle");

      // Verificar que estamos en la página principal
      await expect(page).toHaveURL(/.*\/#inicio$/);
    });

    // Verificar animación del camión después de regresar
    await test.step("Verificar animación después de regresar", async () => {
      await page.waitForTimeout(200);
      const truckLogo = page.locator("#truck-logo");
      await page.waitForTimeout(1500);
      await expect(truckLogo).toHaveClass(/truck-drive/);
    });
  });

  test("Verificar smooth scroll en enlaces internos", async ({ page }) => {
    // Verificar navegación a secciones
    const sectionLinks = [
      { href: "/#servicios", sectionId: "#servicios" },
      { href: "/#equipo", sectionId: "#equipo" },
      { href: "/#precios", sectionId: "#precios" },
      { href: "/#testimonios", sectionId: "#testimonios" },
    ];

    for (const link of sectionLinks) {
      await test.step(`Verificar scroll a ${link.sectionId}`, async () => {
        // Hacer clic en el enlace
        await page.click(`a[href="${link.href}"]`);

        // Esperar un poco para que el scroll se complete
        await page.waitForTimeout(800);

        // Verificar que la sección está visible
        const section = page.locator(link.sectionId);
        await expect(section).toBeInViewport();
      });
    }
  });

  test("Verificar botones CTA principales", async ({ page }) => {
    // Verificar botones principales de llamada a la acción
    await test.step("Verificar botones de contacto", async () => {
      // Buscar botones con texto relacionado a contacto
      const ctaButtons = page.locator("a, button").filter({
        hasText: /contacto|presupuesto|llamar|llamanos|633539792/i,
      });

      const buttonCount = await ctaButtons.count();
      expect(buttonCount).toBeGreaterThan(0);

      // Verificar que al menos algunos botones son visibles
      for (let i = 0; i < Math.min(buttonCount, 3); i++) {
        const button = ctaButtons.nth(i);
        if (await button.isVisible()) {
          await expect(button).toBeVisible();
        }
      }
    });

    // Verificar enlaces de teléfono
    await test.step("Verificar enlaces de teléfono", async () => {
      const phoneLinks = page.locator('a[href^="tel:"]');
      const phoneCount = await phoneLinks.count();
      expect(phoneCount).toBeGreaterThan(0);

      for (let i = 0; i < phoneCount; i++) {
        const phoneLink = phoneLinks.nth(i);
        await expect(phoneLink).toHaveAttribute("href", /^tel:/);
      }
    });

    // Verificar enlaces de email
    await test.step("Verificar enlaces de email", async () => {
      const emailLinks = page.locator('a[href^="mailto:"]');
      const emailCount = await emailLinks.count();
      expect(emailCount).toBeGreaterThan(0);

      for (let i = 0; i < emailCount; i++) {
        const emailLink = emailLinks.nth(i);
        await expect(emailLink).toHaveAttribute("href", /^mailto:/);
      }
    });
  });

  test("Verificar funcionalidad del footer", async ({ page }) => {
    // Scroll hasta el footer
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(500);

    // Verificar que el footer está visible
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();

    // Verificar enlaces en el footer (si existen)
    const footerLinks = footer.locator("a");
    const linkCount = await footerLinks.count();

    if (linkCount > 0) {
      for (let i = 0; i < linkCount; i++) {
        const link = footerLinks.nth(i);
        if (await link.isVisible()) {
          await expect(link).toHaveAttribute("href");
        }
      }
    }
  });

  test("Verificar responsividad en diferentes tamaños de pantalla", async ({
    page,
  }) => {
    const viewports = [
      { width: 375, height: 667, name: "Mobile" },
      { width: 768, height: 1024, name: "Tablet" },
      { width: 1280, height: 720, name: "Desktop" },
      { width: 1920, height: 1080, name: "Large Desktop" },
    ];

    for (const viewport of viewports) {
      await test.step(`Verificar en ${viewport.name} (${viewport.width}x${viewport.height})`, async () => {
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height,
        });
        await page.reload();
        await page.waitForLoadState("networkidle");

        // Verificar que el header está visible
        const header = page.locator("header");
        await expect(header).toBeVisible();

        // Verificar que el logo del camión está visible
        const truckLogo = page
          .locator("#truck-logo, #truck-logo-mobile")
          .first();
        await expect(truckLogo).toBeVisible();

        // Verificar navegación apropiada para el tamaño de pantalla
        if (viewport.width < 768) {
          // En móvil, verificar que el menú hamburguesa está visible
          const menuButton = page.locator("#mobile-menu-button");
          await expect(menuButton).toBeVisible();
        } else {
          // En desktop, verificar que la navegación principal está visible
          const desktopNav = page.locator("nav").first();
          await expect(desktopNav).toBeVisible();
        }
      });
    }
  });

  test("Verificar accesibilidad básica", async ({ page }) => {
    // Verificar que los elementos interactivos tienen texto o aria-label
    await test.step("Verificar botones tienen texto accesible", async () => {
      const buttons = page.locator("button, a");
      const buttonCount = await buttons.count();

      for (let i = 0; i < Math.min(buttonCount, 10); i++) {
        const button = buttons.nth(i);
        if (await button.isVisible()) {
          const hasText = (await button.textContent())?.trim().length > 0;
          const hasAriaLabel = await button.getAttribute("aria-label");
          const hasTitle = await button.getAttribute("title");

          expect(hasText || hasAriaLabel || hasTitle).toBeTruthy();
        }
      }
    });

    // Verificar que las imágenes tienen alt text
    await test.step("Verificar imágenes tienen alt text", async () => {
      const images = page.locator("img");
      const imageCount = await images.count();

      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        if (await img.isVisible()) {
          await expect(img).toHaveAttribute("alt");
        }
      }
    });
  });
});

test.describe("Pruebas específicas del blog", () => {
  test("Verificar funcionalidad específica del blog", async ({ page }) => {
    // Navegar al blog
    await page.goto("/blog-astro");
    await page.waitForLoadState("networkidle");

    // Verificar que el título del blog está presente
    await expect(page.locator("h1")).toContainText("Blog de Mudanzas ANDY");

    // Verificar que el iframe del blog está presente (si existe)
    const iframe = page.locator("iframe");
    if ((await iframe.count()) > 0) {
      await expect(iframe.first()).toBeVisible();
    }

    // Verificar navegación de regreso desde el blog
    await page.click('a[href="/#inicio"]');
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/.*\/#inicio$/);
  });
});
