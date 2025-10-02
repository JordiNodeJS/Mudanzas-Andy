import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

test("check broken images on site root", async ({ page }) => {
  const url = process.env.PREVIEW_URL || "http://localhost:4321/";
  await page.goto(url, { waitUntil: "networkidle" });

  // Recolectar todas las imágenes en la página (variable renombrada a _images
  // para indicar que no se usa directamente en este test)
  const _images = await page.$$eval("img", (imgs) =>
    imgs.map((img) => ({
      src: img.getAttribute("src") || img.src,
      alt: img.getAttribute("alt"),
    }))
  );

  // reference _images to acknowledge intentional non-direct usage and avoid ts6133
  void _images;

  // Evaluar estado de carga de cada imagen en el cliente
  const checks = await page.evaluate(() => {
    return Array.from(document.images).map((img) => ({
      src: img.currentSrc || img.src,
      naturalWidth: img.naturalWidth,
      complete: img.complete,
    }));
  });

  const broken = checks.filter((c) => !c.complete || c.naturalWidth === 0);

  const report = {
    url,
    date: new Date().toISOString(),
    totalImages: checks.length,
    brokenCount: broken.length,
    broken,
  };

  const reportPath = path.join(
    process.cwd(),
    "src",
    "tests",
    "playwright",
    "broken-images-report.json"
  );
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log("Broken images report saved to", reportPath);

  // Expect no broken images
  expect(broken.length, `Found ${broken.length} broken images`).toBe(0);
});
