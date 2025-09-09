import { test, expect } from '@playwright/test';

test.describe('Footer Button Icon Responsive Behavior', () => {
  test('should hide icon at 768px breakpoint', async ({ page }) => {
    // Navegar a la página
    await page.goto('/');
    
    // Configurar viewport a 768px (breakpoint md)
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Esperar a que la página cargue completamente
    await page.waitForLoadState('networkidle');
    
    // Hacer scroll hacia abajo para activar el botón del footer
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    
    // Esperar un momento para que se ejecute el JavaScript
    await page.waitForTimeout(1000);
    
    // Verificar que el botón está visible
    const footerButton = page.locator('#reserva-ya-footer-btn');
    await expect(footerButton).toBeVisible();
    
    // Verificar que el icono está oculto en 768px
    const iconSpan = footerButton.locator('span').first();
    await expect(iconSpan).toHaveClass(/md:hidden/);
    
    // Verificar que el icono no es visible debido a la clase md:hidden
    const iconStyles = await iconSpan.evaluate(el => getComputedStyle(el));
    expect(iconStyles.display).toBe('none');
    
    // Verificar que el texto del botón sigue siendo visible
    const textSpan = footerButton.locator('span:has-text("¡Reserva YA!")');
    await expect(textSpan).toBeVisible();
    
    // Verificar que el número de teléfono sigue siendo visible
    const phoneSpan = footerButton.locator('span:has-text("640 50 60 84")');
    await expect(phoneSpan).toBeVisible();
  });
  
  test('should show icon at smaller breakpoints', async ({ page }) => {
    // Navegar a la página
    await page.goto('/');
    
    // Configurar viewport a tamaño móvil (menor a 768px)
    await page.setViewportSize({ width: 480, height: 800 });
    
    // Esperar a que la página cargue completamente
    await page.waitForLoadState('networkidle');
    
    // Hacer scroll hacia abajo para activar el botón del footer
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    
    // Esperar un momento para que se ejecute el JavaScript
    await page.waitForTimeout(1000);
    
    // Verificar que el botón está visible
    const footerButton = page.locator('#reserva-ya-footer-btn');
    await expect(footerButton).toBeVisible();
    
    // Verificar que el icono es visible en pantallas pequeñas
    const iconSpan = footerButton.locator('span').first();
    await expect(iconSpan).toBeVisible();
    
    // Verificar que contiene el emoji del icono
    await expect(iconSpan).toContainText('💬');
  });
  
  test('should show icon at larger breakpoints', async ({ page }) => {
    // Navegar a la página
    await page.goto('/');
    
    // Configurar viewport a tamaño desktop (mayor a 768px)
    await page.setViewportSize({ width: 1024, height: 768 });
    
    // Esperar a que la página cargue completamente
    await page.waitForLoadState('networkidle');
    
    // Hacer scroll hacia abajo para activar el botón del footer
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    
    // Esperar un momento para que se ejecute el JavaScript
    await page.waitForTimeout(1000);
    
    // Verificar que el botón está visible
    const footerButton = page.locator('#reserva-ya-footer-btn');
    await expect(footerButton).toBeVisible();
    
    // Verificar que el icono es visible en pantallas grandes
    const iconSpan = footerButton.locator('span').first();
    await expect(iconSpan).toBeVisible();
    
    // Verificar que contiene el emoji del icono
    await expect(iconSpan).toContainText('💬');
  });
});
