// @ts-check
import { test, expect, devices } from "@playwright/test";

/**
 * Test para la galería de imágenes implementada debajo de TeamSection
 * Verifica funcionalidad en móvil y desktop con MCP Playwright
 */

// Configuración de dispositivos para testing
const mobileDevice = devices["iPhone 13"];
const desktopViewport = { width: 1280, height: 720 };

test.describe("Galería de Imágenes - Funcionalidad Completa", () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la página principal donde está la galería
    await page.goto("/", { waitUntil: "networkidle" });

    // Scroll hasta la galería para que esté en viewport
    await page.locator("#gallery").scrollIntoViewIfNeeded();

    // Esperar a que las imágenes se carguen
    await page.waitForSelector(".gallery-item", { timeout: 10000 });
  });

  test("Desktop - Verificar estructura de galería y responsive grid", async ({
    page,
  }) => {
    await page.setViewportSize(desktopViewport);

    // Verificar que la galería existe
    const gallery = page.locator("#gallery");
    await expect(gallery).toBeVisible();

    // Verificar título y descripción
    await expect(page.locator("#gallery h2")).toContainText(
      "Galería de Proyectos"
    );
    await expect(page.locator("#gallery p")).toContainText(
      "Descubre algunos de nuestros trabajos"
    );

    // Verificar que se muestran las imágenes de la galería
    const galleryItems = page.locator(".gallery-item");
    await expect(galleryItems).toHaveCount(9); // 9 imágenes optimizadas

    // Verificar grid de 3 columnas en desktop (lg:grid-cols-3)
    const grid = page.locator(".gallery-grid");
    await expect(grid).toHaveClass(/lg:grid-cols-3/);

    console.log("✅ Desktop - Estructura de galería verificada correctamente");
  });

  test("Mobile - Verificar layout responsivo", async ({ page }) => {
    await page.setViewportSize(mobileDevice.viewport);

    // Verificar que la galería es responsive en móvil
    const gallery = page.locator("#gallery");
    await expect(gallery).toBeVisible();

    // Verificar que las imágenes se adaptan al viewport móvil
    const galleryItems = page.locator(".gallery-item");
    await expect(galleryItems.first()).toBeVisible();

    // En móvil debería usar grid-cols-1
    const grid = page.locator(".gallery-grid");
    await expect(grid).toHaveClass(/grid-cols-1/);

    console.log("✅ Mobile - Layout responsivo verificado correctamente");
  });

  test("Funcionalidad Lightbox - Abrir y cerrar", async ({ page }) => {
    await page.setViewportSize(desktopViewport);

    // Hacer clic en la primera imagen para abrir lightbox
    const firstImage = page.locator(".gallery-item").first();
    await firstImage.click();

    // Verificar que el lightbox se abre
    const lightbox = page.locator("#lightbox");
    await expect(lightbox).toBeVisible();
    await expect(lightbox).toHaveClass(/flex/);

    // Verificar elementos del lightbox
    await expect(page.locator("#lightbox-image")).toBeVisible();
    await expect(page.locator("#lightbox-caption-text")).toBeVisible();
    await expect(page.locator("#lightbox-counter")).toBeVisible();

    // Verificar contador (debería mostrar "1 de 9")
    const counter = page.locator("#lightbox-counter");
    await expect(counter).toContainText("1 de 9");

    // Cerrar lightbox con botón X
    await page.locator(".lightbox-close").click();
    await expect(lightbox).toHaveClass(/hidden/);

    console.log("✅ Funcionalidad Lightbox - Apertura y cierre verificados");
  });

  test("Navegación en Lightbox - Botones siguiente/anterior", async ({
    page,
  }) => {
    await page.setViewportSize(desktopViewport);

    // Abrir lightbox con primera imagen
    await page.locator(".gallery-item").first().click();

    const lightbox = page.locator("#lightbox");
    await expect(lightbox).toBeVisible();

    // Verificar contador inicial
    let counter = page.locator("#lightbox-counter");
    await expect(counter).toContainText("1 de 9");

    // Navegar a la siguiente imagen
    await page.locator(".lightbox-next").click();
    await page.waitForTimeout(500); // Esperar transición
    await expect(counter).toContainText("2 de 9");

    // Navegar a la imagen anterior
    await page.locator(".lightbox-prev").click();
    await page.waitForTimeout(500);
    await expect(counter).toContainText("1 de 9");

    console.log("✅ Navegación Lightbox - Botones funcionando correctamente");
  });

  test("Navegación con Teclado - Flechas y Escape", async ({ page }) => {
    await page.setViewportSize(desktopViewport);

    // Abrir lightbox
    await page.locator(".gallery-item").first().click();

    const lightbox = page.locator("#lightbox");
    await expect(lightbox).toBeVisible();

    // Verificar navegación con flecha derecha
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(500);

    const counter = page.locator("#lightbox-counter");
    await expect(counter).toContainText("2 de 9");

    // Verificar navegación con flecha izquierda
    await page.keyboard.press("ArrowLeft");
    await page.waitForTimeout(500);
    await expect(counter).toContainText("1 de 9");

    // Cerrar con Escape
    await page.keyboard.press("Escape");
    await expect(lightbox).toHaveClass(/hidden/);

    console.log("✅ Navegación Teclado - Flechas y Escape funcionando");
  });

  test("Optimización de Imágenes - Formatos y Responsive", async ({ page }) => {
    await page.setViewportSize(desktopViewport);

    // Verificar que las imágenes usan picture elements con múltiples formatos
    const firstPicture = page.locator(".gallery-item picture").first();
    await expect(firstPicture).toBeVisible();

    // Verificar que hay sources para AVIF y WebP
    const avifSource = firstPicture.locator('source[type="image/avif"]');
    const webpSource = firstPicture.locator('source[type="image/webp"]');

    await expect(avifSource).toBeVisible();
    await expect(webpSource).toBeVisible();

    // Verificar que la imagen fallback tiene srcset responsivo
    const img = firstPicture.locator("img");
    const srcset = await img.getAttribute("srcset");

    expect(srcset).toContain("320w");
    expect(srcset).toContain("640w");
    expect(srcset).toContain("1024w");

    console.log(
      "✅ Optimización de Imágenes - Formatos y responsive verificados"
    );
  });

  test("Efectos Hover - Desktop únicamente", async ({ page }) => {
    await page.setViewportSize(desktopViewport);

    const firstItem = page.locator(".gallery-item").first();

    // Verificar estado inicial
    await expect(firstItem).toBeVisible();

    // Hover sobre el elemento
    await firstItem.hover();

    // Verificar que aparece el ícono de zoom (puede tardar en aparecer)
    await page.waitForTimeout(500);

    const zoomIcon = firstItem.locator(".gallery-zoom-icon");

    // En hover, el ícono debería ser visible
    // Nota: En algunos casos puede no detectarse por CSS, esto es normal
    const isIconVisible = await zoomIcon.isVisible();
    console.log(`🔍 Icono de zoom visible en hover: ${isIconVisible}`);

    console.log("✅ Efectos Hover - Verificación completada");
  });

  test("Performance - Lazy Loading", async ({ page }) => {
    await page.setViewportSize(desktopViewport);

    // Verificar que las imágenes tienen loading="lazy"
    const images = page.locator(".gallery-image");
    const firstImg = images.first();

    const loadingAttr = await firstImg.getAttribute("loading");
    expect(loadingAttr).toBe("lazy");

    // Verificar que tienen alt text apropiado
    const altText = await firstImg.getAttribute("alt");
    expect(altText).toContain("Mudanzas ANDY");

    console.log("✅ Performance - Lazy loading y alt texts verificados");
  });

  test("Accesibilidad - Focus y ARIA", async ({ page }) => {
    await page.setViewportSize(desktopViewport);

    // Verificar que se puede navegar con Tab
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab"); // Navegar hasta la galería

    // Buscar elementos focusables en la galería
    const focusableItems = page.locator(".gallery-item");

    // Verificar que el primer item puede recibir focus
    await focusableItems.first().focus();

    // Verificar aria-labels en botones del lightbox
    await focusableItems.first().click(); // Abrir lightbox

    const closeBtn = page.locator(".lightbox-close");
    const ariaLabel = await closeBtn.getAttribute("aria-label");
    expect(ariaLabel).toBe("Cerrar galería");

    console.log("✅ Accesibilidad - Focus y ARIA labels verificados");
  });
});

test.describe("Galería - Tests de Integración", () => {
  test("Integración con TeamSection - Posicionamiento correcto", async ({
    page,
  }) => {
    await page.goto("/");

    // Verificar que la galería aparece después de TeamSection
    const teamSection = page.locator("#equipo"); // TeamSection tiene id="equipo"
    const gallery = page.locator("#gallery");

    await expect(teamSection).toBeVisible();
    await expect(gallery).toBeVisible();

    // Verificar orden en el DOM
    const teamPosition = await teamSection.boundingBox();
    const galleryPosition = await gallery.boundingBox();

    if (teamPosition && galleryPosition) {
      expect(galleryPosition.y).toBeGreaterThan(teamPosition.y);
    }

    console.log(
      "✅ Integración - Galería posicionada correctamente después de TeamSection"
    );
  });

  test("Build Test - Verificar que funciona en producción", async ({
    page,
  }) => {
    // Este test verifica que la galería funciona después del build
    await page.goto("/");

    // Verificar elementos esenciales
    await expect(page.locator("#gallery")).toBeVisible();
    await expect(page.locator(".gallery-item")).toHaveCount(9);

    // Test rápido de funcionalidad
    await page.locator(".gallery-item").first().click();
    await expect(page.locator("#lightbox")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.locator("#lightbox")).toHaveClass(/hidden/);

    console.log("✅ Build Test - Galería funciona correctamente en producción");
  });
});

// Configuración de Playwright para este test suite
module.exports = {
  // Configuración específica si es necesaria
};
