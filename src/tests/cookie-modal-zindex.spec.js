// @ts-check
import { test, expect } from "@playwright/test";

test("Cookie modal should appear above footer", async ({ page }) => {
  // Ir a la página de política de cookies
  await page.goto("http://localhost:4322/politica-cookies");

  // Scroll hacia abajo para asegurar que el footer esté visible
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  // Buscar el botón de "Configurar Cookies" en el footer
  const configurarButton = page.locator('footer a[href="#configurar-cookies"]');
  await expect(configurarButton).toBeVisible();

  // Hacer click en "Configurar Cookies"
  await configurarButton.click();

  // Verificar que el modal esté visible
  const modal = page.locator("#cookie-settings-modal");
  await expect(modal).toBeVisible();

  // Verificar que el modal no esté oculto por el footer
  // Comprobamos el z-index del modal vs el footer
  const modalZIndex = await modal.evaluate((el) => {
    return window.getComputedStyle(el).zIndex;
  });

  const footer = page.locator("footer");
  const footerZIndex = await footer.evaluate((el) => {
    return window.getComputedStyle(el).zIndex;
  });

  console.log(`Modal z-index: ${modalZIndex}, Footer z-index: ${footerZIndex}`);

  // El modal debe tener un z-index mayor que el footer
  expect(parseInt(modalZIndex)).toBeGreaterThan(parseInt(footerZIndex));

  // Tomar screenshot para verificación visual
  await page.screenshot({
    path: "test-results/cookie-modal-zindex-fix.png",
    fullPage: true,
  });

  // Verificar que el botón de cerrar esté clickeable (no oculto)
  const closeButton = page.locator("#cookie-modal-close");
  await expect(closeButton).toBeVisible();
  await expect(closeButton).toBeEnabled();

  // Cerrar el modal
  await closeButton.click();
  await expect(modal).toBeHidden();
});
