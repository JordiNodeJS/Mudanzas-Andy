import { chromium } from "playwright";
import fs from "fs";

(async () => {
  // Launch headed so you can see the MCP / browser during the check
  const browser = await chromium.launch({ headless: false, slowMo: 50 });
  const page = await browser.newPage();
  const url = "http://localhost:4321/contacto";
  console.log("Opening", url);
  const resp = await page.goto(url, { waitUntil: "networkidle" });
  console.log("Status", resp && resp.status());
  await page.waitForTimeout(500); // allow minor animations
  const outDir = "tmp";
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  const outPath = `${outDir}/contacto-screenshot.png`;
  await page.screenshot({ path: outPath, fullPage: true });
  console.log("Saved screenshot to", outPath);
  await browser.close();
})();
