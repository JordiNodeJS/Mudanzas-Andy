import { test, expect } from "@playwright/test";

test.describe("TASK-005: TestimonialCard Migration", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:4321/test-testimonialcard");
  });

  test("should render all TestimonialCard variants correctly", async ({
    page,
  }) => {
    // Verificar que la página se carga
    await expect(page).toHaveTitle(/Mudanzas profesionales/);

    // Verificar el título principal
    await expect(page.locator("h1")).toContainText(
      "Test TestimonialCard Migration"
    );

    // Verificar que hay al menos 3 secciones principales de componentes
    const h2Count = await page.locator("h2").count();
    expect(h2Count).toBeGreaterThanOrEqual(3);

    await expect(page.locator("h2").first()).toContainText(
      "Original TestimonialCard (Legacy)"
    );
    await expect(
      page.locator('h2:has-text("TestimonialCard React")')
    ).toBeVisible();
    await expect(
      page.locator('h2:has-text("TestimonialCard Hybrid")')
    ).toBeVisible();
  });

  test("should display star ratings correctly", async ({ page }) => {
    // Verificar que hay elementos con estrellas (puede variar por contenido extra)
    const starElements = page.locator('div:has-text("⭐")');
    const starCount = await starElements.count();
    expect(starCount).toBeGreaterThanOrEqual(9); // Al menos 9 elementos con estrellas

    // Verificar rating específico de 5 estrellas
    const fiveStars = page.locator("text=⭐⭐⭐⭐⭐");
    const fiveStarCount = await fiveStars.count();
    expect(fiveStarCount).toBeGreaterThanOrEqual(6); // Al menos 6 elementos de 5 estrellas

    // Verificar rating de 4 estrellas
    const fourStars = page.locator("text=⭐⭐⭐⭐☆");
    await expect(fourStars).toHaveCount(2); // Exactamente 2 elementos de 4 estrellas

    // Verificar rating de 3 estrellas
    const threeStars = page.locator("text=⭐⭐⭐☆☆");
    await expect(threeStars).toHaveCount(2); // Exactamente 2 elementos de 3 estrellas
  });

  test("should have consistent testimonial content", async ({ page }) => {
    // Verificar nombres de clientes en múltiples ubicaciones
    const names = [
      "María González",
      "Carlos Martín",
      "Ana Rodríguez",
      "David López",
    ];

    for (const name of names) {
      const nameElements = page.locator(`text=${name}`);
      const count = await nameElements.count();
      expect(count).toBeGreaterThanOrEqual(2); // Al menos en React + Hybrid
    }

    // Verificar locations
    const locations = [
      "Barcelona, Eixample",
      "Madrid, Chamberí",
      "Valencia, Ciutat Vella",
      "Sevilla, Triana",
    ];

    for (const location of locations) {
      const locationElements = page.locator(`text=${location}`);
      const count = await locationElements.count();
      expect(count).toBeGreaterThanOrEqual(2);
    }
  });

  test("should have proper quote formatting", async ({ page }) => {
    // Verificar que las citas están en blockquote en las versiones shadcn/ui
    const blockquotes = page.locator("blockquote");
    await expect(blockquotes).toHaveCount(8); // 4 React + 4 Hybrid

    // Verificar que todas las blockquotes contienen comillas
    for (let i = 0; i < 8; i++) {
      const quote = blockquotes.nth(i);
      await expect(quote).toContainText('"');
    }
  });

  test("should display cards in proper grid layouts", async ({ page }) => {
    // Verificar grid de React components (2 columnas en md+)
    const reactGrid = page
      .locator("div")
      .filter({ hasText: "TestimonialCard React" })
      .locator(".grid")
      .first();
    await expect(reactGrid).toHaveClass(/grid-cols-1/);
    await expect(reactGrid).toHaveClass(/md:grid-cols-2/);

    // Verificar grid de Hybrid components (3 columnas en lg+)
    const hybridGrid = page
      .locator("div")
      .filter({ hasText: "TestimonialCard Hybrid - Grid" })
      .locator(".grid")
      .first();
    await expect(hybridGrid).toHaveClass(/grid-cols-1/);
    await expect(hybridGrid).toHaveClass(/md:grid-cols-2/);
    await expect(hybridGrid).toHaveClass(/lg:grid-cols-3/);
  });

  test("should have proper semantic structure", async ({ page }) => {
    // Verificar estructura de headings
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h2")).toHaveCount(3);

    // Verificar que las citas están marcadas correctamente
    const italicQuotes = page.locator("p.italic, blockquote");
    await expect(italicQuotes.first()).toBeVisible();
  });

  test("should maintain visual consistency between variants", async ({
    page,
  }) => {
    // Comparar el primer card original vs híbrido
    const originalCard = page
      .locator("div")
      .filter({ hasText: "Original TestimonialCard" })
      .locator("div")
      .nth(1);
    const hybridCard = page
      .locator("div")
      .filter({ hasText: "TestimonialCard Hybrid" })
      .locator("div")
      .nth(1);

    // Ambos deben tener estilos similares
    await expect(originalCard).toHaveClass(/bg-white\/98/);
    await expect(hybridCard).toHaveClass(/bg-white\/98/);

    await expect(originalCard).toHaveClass(/backdrop-blur-sm/);
    await expect(hybridCard).toHaveClass(/backdrop-blur-sm/);
  });

  test("should have working navigation link", async ({ page }) => {
    const backLink = page.locator("text=← Volver a la página principal");
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute("href", "/");
  });

  test("should display customer information correctly", async ({ page }) => {
    // Verificar que los nombres están en negrita
    const customerNames = page.locator("p.font-semibold");
    await expect(customerNames.first()).toContainText("María González");

    // Verificar que las ubicaciones tienen opacidad reducida
    const locations = page.locator("p.opacity-90");
    await expect(locations.first()).toContainText("Barcelona, Eixample");
  });
});
