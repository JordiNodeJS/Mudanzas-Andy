import { test, expect } from "@playwright/test";

test.describe("View Transitions - Simple & Smooth Navigation", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage before each test
    await page.goto("http://localhost:4321/");
    await page.waitForLoadState("networkidle");
  });

  test("should have View Transitions enabled", async ({ page }) => {
    // Check if the ClientRouter is loaded
    const clientRouterScript = page.locator('script[src*="ClientRouter"]');
    await expect(clientRouterScript).toBeAttached();
  });

  test("should navigate to blog smoothly without flickering", async ({
    page,
  }) => {
    // Navigate to blog
    const blogLink = page.locator('nav a[href="/blog-astro"]').first();
    await expect(blogLink).toBeVisible();

    // Record time for navigation
    const startTime = Date.now();
    await blogLink.click();
    await page.waitForURL("**/blog-astro");
    const endTime = Date.now();

    // Navigation should be fast (View Transitions working)
    const navigationTime = endTime - startTime;
    expect(navigationTime).toBeLessThan(1000); // Should be very fast

    // Verify we're on the blog page
    await expect(page.locator("h1")).toContainText("Blog de Mudanzas ANDY");
  });

  test("should navigate back to homepage smoothly", async ({ page }) => {
    // Go to blog first
    await page.goto("http://localhost:4321/blog-astro");
    await page.waitForLoadState("networkidle");

    // Navigate back via logo
    const logoLink = page.locator('a[href="/#inicio"]').first();
    const startTime = Date.now();
    await logoLink.click();
    await page.waitForURL("**/");
    const endTime = Date.now();

    // Navigation should be fast
    const navigationTime = endTime - startTime;
    expect(navigationTime).toBeLessThan(1000);

    // Should be back on homepage
    await expect(page.locator("main")).toBeAttached();
  });

  test("should work on mobile without issues", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Open mobile menu
    const mobileMenuButton = page.locator("#mobile-menu-button");
    await mobileMenuButton.click();

    // Click blog link
    const mobileBlogLink = page.locator('#mobile-menu a[href="/blog-astro"]');
    await mobileBlogLink.click();
    await page.waitForURL("**/blog-astro");

    // Verify successful navigation
    await expect(page.locator("h1")).toContainText("Blog de Mudanzas ANDY");
  });

  test("should use simple CSS transitions only", async ({ page }) => {
    // Check that only simple view transition CSS is present
    const hasComplexAnimations = await page.evaluate(() => {
      const styleSheets = Array.from(document.styleSheets);
      let foundComplexKeyframes = false;

      styleSheets.forEach((sheet) => {
        try {
          const rules = Array.from(sheet.cssRules);
          rules.forEach((rule) => {
            // Look for complex keyframes that we removed
            if (
              rule.cssText.includes("slide-out-left") ||
              rule.cssText.includes("slide-in-right") ||
              rule.cssText.includes("transform: translateX")
            ) {
              foundComplexKeyframes = true;
            }
          });
        } catch (e) {
          // Some stylesheets might not be accessible
        }
      });

      return foundComplexKeyframes;
    });

    // Should NOT have complex animations
    expect(hasComplexAnimations).toBe(false);
  });
});
