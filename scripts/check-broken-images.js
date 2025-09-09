import { chromium } from "playwright";
import fs from "fs";
import path from "path";

(async () => {
  const url = process.env.PREVIEW_URL || "http://localhost:4321/";
  const browser = await chromium.launch();
  const page = await browser.newPage();
  console.log("Navigating to", url);
  await page.goto(url, { waitUntil: "networkidle" });

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
  console.log("Report saved to", reportPath);

  if (broken.length > 0) {
    console.log("Broken images found:", broken.length);
    broken.forEach((b) => console.log(" -", b.src));
    process.exit(2);
  } else {
    console.log("No broken images found.");
    await browser.close();
    process.exit(0);
  }
})();
