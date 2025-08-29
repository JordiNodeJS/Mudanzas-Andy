// @ts-check
import { test, expect } from "@playwright/test";

test.describe("Tailwind CSS v4 Migration Verification", () => {
  test("Team section styles are loaded correctly after migration", async ({
    page,
  }) => {
    // Navegar a la página principal
    await page.goto("http://localhost:4322/");

    // Esperar a que la página cargue completamente
    await page.waitForLoadState("networkidle");

    // Buscar la sección del equipo
    const teamSection = page
      .locator("section")
      .filter({ hasText: /equipo|team/i })
      .first();

    if ((await teamSection.count()) > 0) {
      // Verificar que las variables CSS del team están definidas
      const teamVariables = await page.evaluate(() => {
        const style = getComputedStyle(document.documentElement);
        return {
          transitionFast: style.getPropertyValue("--team-transition-fast"),
          transitionNormal: style.getPropertyValue("--team-transition-normal"),
          cardHeightMobile: style.getPropertyValue("--team-card-height-mobile"),
          overlayOpacity: style.getPropertyValue("--team-overlay-opacity"),
        };
      });

      console.log("Team CSS Variables:", teamVariables);

      // Verificar que al menos algunas variables están definidas
      expect(
        teamVariables.transitionFast || teamVariables.transitionNormal
      ).toBeTruthy();

      // Buscar tarjetas del equipo
      const teamCards = page.locator(".team-card");
      if ((await teamCards.count()) > 0) {
        const firstCard = teamCards.first();

        // Verificar que la tarjeta tiene los estilos base
        const cardStyles = await firstCard.evaluate((el) => {
          const styles = getComputedStyle(el);
          return {
            display: styles.display,
            borderRadius: styles.borderRadius,
            boxShadow: styles.boxShadow,
            transition: styles.transition,
          };
        });

        console.log("Team Card Styles:", cardStyles);

        // Verificar que los estilos están aplicados
        expect(cardStyles.display).not.toBe("");
        expect(cardStyles.borderRadius).not.toBe("0px");
      }
    }

    // Verificar que las variables de color del tema están cargadas
    const colorVariables = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      return {
        primary: style.getPropertyValue("--color-primary"),
        secondary: style.getPropertyValue("--color-secondary"),
        accent: style.getPropertyValue("--color-accent"),
        highlight: style.getPropertyValue("--color-highlight"),
        neutral: style.getPropertyValue("--color-neutral"),
      };
    });

    console.log("Color Variables:", colorVariables);

    // Verificar que las variables de color están definidas
    Object.values(colorVariables).forEach((value) => {
      expect(value.trim()).not.toBe("");
    });

    // Verificar que los botones primarios tienen los estilos correctos
    const primaryButtons = page.locator(".btn-primary");
    if ((await primaryButtons.count()) > 0) {
      const buttonStyles = await primaryButtons.first().evaluate((el) => {
        const styles = getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          borderRadius: styles.borderRadius,
          fontWeight: styles.fontWeight,
          padding: styles.padding,
        };
      });

      console.log("Primary Button Styles:", buttonStyles);

      // Verificar que los estilos del botón están aplicados
      expect(buttonStyles.backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
      expect(buttonStyles.borderRadius).not.toBe("0px");
    }
  });

  test("Card styles are working properly", async ({ page }) => {
    await page.goto("http://localhost:4322/");
    await page.waitForLoadState("networkidle");

    // Buscar elementos con clase .card
    const cards = page.locator(".card");

    if ((await cards.count()) > 0) {
      const firstCard = cards.first();

      // Verificar estilos base de las tarjetas
      const cardStyles = await firstCard.evaluate((el) => {
        const styles = getComputedStyle(el);
        return {
          borderRadius: styles.borderRadius,
          boxShadow: styles.boxShadow,
          padding: styles.padding,
          transition: styles.transition,
        };
      });

      console.log("Card Base Styles:", cardStyles);

      // Verificar que los estilos están aplicados
      expect(cardStyles.borderRadius).not.toBe("0px");
      expect(cardStyles.padding).not.toBe("0px");
      expect(cardStyles.boxShadow).not.toBe("none");
    }
  });

  test("Mobile truck position styles are applied", async ({ page }) => {
    // Configurar viewport móvil
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("http://localhost:4322/");
    await page.waitForLoadState("networkidle");

    // Buscar elementos con la clase mobile-truck-position
    const truckElements = page.locator(".mobile-truck-position");

    if ((await truckElements.count()) > 0) {
      const truckStyles = await truckElements.first().evaluate((el) => {
        const styles = getComputedStyle(el);
        return {
          objectPosition: styles.objectPosition,
          clipPath: styles.clipPath,
        };
      });

      console.log("Mobile Truck Styles:", truckStyles);

      // Verificar que los estilos de posicionamiento están aplicados
      expect(truckStyles.objectPosition).not.toBe("50% 50%"); // Valor por defecto
    }
  });

  test("CSS layers are processed correctly", async ({ page }) => {
    await page.goto("http://localhost:4322/");
    await page.waitForLoadState("networkidle");

    // Verificar que los estilos CSS están cargados verificando elementos conocidos
    const bodyStyles = await page.evaluate(() => {
      const styles = getComputedStyle(document.body);
      return {
        margin: styles.margin,
        fontFamily: styles.fontFamily,
      };
    });

    console.log("Body Styles:", bodyStyles);

    // Verificar que Tailwind está procesando correctamente
    const tailwindClasses = await page.evaluate(() => {
      // Crear un elemento temporal con clases de Tailwind para verificar
      const testDiv = document.createElement("div");
      testDiv.className = "flex items-center justify-center p-4 rounded-lg";
      document.body.appendChild(testDiv);

      const styles = getComputedStyle(testDiv);
      const result = {
        display: styles.display,
        alignItems: styles.alignItems,
        justifyContent: styles.justifyContent,
        padding: styles.padding,
        borderRadius: styles.borderRadius,
      };

      document.body.removeChild(testDiv);
      return result;
    });

    console.log("Tailwind Classes Test:", tailwindClasses);

    // Verificar que las clases de Tailwind funcionan
    expect(tailwindClasses.display).toBe("flex");
    expect(tailwindClasses.alignItems).toBe("center");
    expect(tailwindClasses.justifyContent).toBe("center");
    expect(tailwindClasses.padding).not.toBe("0px");
  });
});
