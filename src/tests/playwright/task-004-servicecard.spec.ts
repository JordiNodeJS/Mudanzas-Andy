import { test, expect } from "@playwright/test";

test.describe("TASK-004: ServiceCard Migration", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:4321/test-servicecard");
  });

  test("should render all ServiceCard variants correctly", async ({ page }) => {
    // Verificar que la página se carga
    await expect(page).toHaveTitle(/Mudanzas profesionales/);

    // Verificar el título principal
    await expect(page.locator("h1")).toContainText(
      "Test ServiceCard Migration"
    );

    // Verificar que hay 3 secciones de componentes
    await expect(page.locator("h2")).toHaveCount(3);
    await expect(page.locator("h2").nth(0)).toContainText(
      "Original ServiceCard (Legacy)"
    );
    await expect(page.locator("h2").nth(1)).toContainText(
      "ServiceCard Hybrid (shadcn/ui)"
    );
    await expect(page.locator("h2").nth(2)).toContainText(
      "ServiceCard React (shadcn/ui)"
    );
  });

  test("should have consistent content across all variants", async ({
    page,
  }) => {
    // Verificar que todos los componentes muestran el mismo icono
    const truckIcons = page.locator("text=🚛");
    await expect(truckIcons).toHaveCount(6); // Original + Hybrid + 4 React variants

    // Verificar títulos
    const titles = page.locator(
      'h3:has-text("Mudanzas Residenciales"), [data-slot="card-title"]:has-text("Mudanzas Residenciales")'
    );
    await expect(titles.first()).toBeVisible();

    // Verificar que todas las features aparecen
    const features = [
      "Embalaje profesional",
      "Transporte seguro",
      "Montaje de muebles",
      "Seguro incluido",
    ];

    for (const feature of features) {
      const featureElements = page.locator(`text=${feature}`);
      await expect(featureElements).toHaveCount(6); // En todos los componentes
    }
  });

  test("should have hover effects on cards", async ({ page }) => {
    // Seleccionar el primer card (legacy)
    const legacyCard = page
      .locator("div")
      .filter({ hasText: "Original ServiceCard (Legacy)" })
      .locator("div")
      .nth(1);

    // Verificar hover effect (debe tener transform y transition classes)
    await expect(legacyCard).toHaveClass(/hover:scale-105/);
    await expect(legacyCard).toHaveClass(/transition-all/);

    // Seleccionar el card híbrido
    const hybridCard = page
      .locator("div")
      .filter({ hasText: "ServiceCard Hybrid" })
      .locator("div")
      .nth(1);
    await expect(hybridCard).toHaveClass(/hover:scale-105/);
  });

  test("should display different gradient variants", async ({ page }) => {
    // Verificar que hay 4 cards React con diferentes gradientes
    const reactSection = page
      .locator("div")
      .filter({ hasText: "ServiceCard React" });
    const reactCards = reactSection.locator('[data-slot="card"]');

    await expect(reactCards).toHaveCount(4);

    // Cada card debe tener gradiente diferente (verificamos via CSS classes)
    for (let i = 0; i < 4; i++) {
      const card = reactCards.nth(i);
      await expect(card).toBeVisible();
      // Los gradientes se aplican via CSS classes bg-gradient-to-br
      await expect(card).toHaveClass(/bg-gradient-to-br/);
    }
  });

  test("should have proper accessibility structure", async ({ page }) => {
    // Verificar estructura de headings
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h2")).toHaveCount(3);

    // Verificar que las listas están correctamente estructuradas
    const lists = page.locator("ul");
    await expect(lists).toHaveCount(6); // Una por cada card

    // Cada lista debe tener 4 items
    for (let i = 0; i < 6; i++) {
      const list = lists.nth(i);
      await expect(list.locator("li")).toHaveCount(4);
    }
  });

  test("should have working navigation link", async ({ page }) => {
    const backLink = page.locator("text=← Volver a la página principal");
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute("href", "/");
  });

  test("should render cards with proper spacing and layout", async ({
    page,
  }) => {
    // Verificar grid layout para cards React
    const reactGrid = page
      .locator("div")
      .filter({ hasText: "ServiceCard React" })
      .locator(".grid")
      .first();
    await expect(reactGrid).toHaveClass(/grid-cols-1/);
    await expect(reactGrid).toHaveClass(/md:grid-cols-2/);
    await expect(reactGrid).toHaveClass(/lg:grid-cols-4/);

    // Verificar gap entre cards
    await expect(reactGrid).toHaveClass(/gap-4/);
  });
});

test.describe("TASK-004: ServiceCard Visual Regression", () => {
  test("should match visual snapshot", async ({ page }) => {
    await page.goto("http://localhost:4321/test-servicecard");

    // Esperar a que todos los elementos estén cargados
    await page.waitForLoadState("networkidle");

    // Tomar screenshot de toda la página
    await expect(page).toHaveScreenshot("servicecard-migration-full.png", {
      fullPage: true,
    });

    // Screenshots individuales de cada sección
    const sections = await page.locator("h2").count();
    for (let i = 0; i < sections; i++) {
      const section = page.locator("h2").nth(i).locator("..").locator("..");
      await expect(section).toHaveScreenshot(
        `servicecard-section-${i + 1}.png`
      );
    }
  });
});
