const fs = require("fs");
const path = require("path");
const distPath = path.resolve(__dirname, "../dist/index.html");
if (!fs.existsSync(distPath)) {
  console.error(
    "dist/index.html not found. Run `pnpm build` or `pnpm preview` first."
  );
  process.exit(2);
}
const html = fs.readFileSync(distPath, "utf8");
const regex =
  /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
let m;
const reports = [];
let idx = 0;
while ((m = regex.exec(html)) !== null) {
  const raw = m[1].trim();
  const report = {
    index: idx++,
    rawSample: raw.slice(0, 200) + (raw.length > 200 ? "..." : ""),
    ok: true,
    issues: [],
  };
  try {
    const json = JSON.parse(raw);
    report.jsonType = Array.isArray(json) ? "Array" : typeof json;
    report.json = json;
    // Basic checks
    const checkObj = (obj) => {
      if (!obj || typeof obj !== "object") return;
      if (obj["@context"] && obj["@context"] !== "https://schema.org") {
        report.issues.push(
          `@context is ${obj["@context"]} (expected https://schema.org)`
        );
      }
      const t = obj["@type"];
      if (!t) report.issues.push("@type missing");
      // Specific checks for MovingCompany
      if (t === "MovingCompany") {
        ["name", "url", "telephone", "address"].forEach((k) => {
          if (!obj[k])
            report.issues.push(`Missing field ${k} for MovingCompany`);
        });
        if (obj.address) {
          [
            "streetAddress",
            "addressLocality",
            "addressRegion",
            "postalCode",
            "addressCountry",
          ].forEach((k) => {
            if (!obj.address[k])
              report.issues.push(`PostalAddress missing ${k}`);
          });
        }
        if (obj.aggregateRating) {
          const ar = obj.aggregateRating;
          if (typeof ar.ratingValue === "string")
            report.issues.push(
              "aggregateRating.ratingValue is a string — prefer number"
            );
          if (typeof ar.reviewCount === "string")
            report.issues.push(
              "aggregateRating.reviewCount is a string — prefer number"
            );
        }
        if (Array.isArray(obj.review)) {
          obj.review.forEach((r, i) => {
            const rv = r?.reviewRating?.ratingValue;
            if (typeof rv === "string")
              report.issues.push(
                `review[${i}].reviewRating.ratingValue is a string — prefer number`
              );
          });
        }
      }
      if (t === "WebSite") {
        if (!obj.name) report.issues.push("WebSite.name missing");
        if (!obj.url) report.issues.push("WebSite.url missing");
      }
      if (t === "BreadcrumbList") {
        if (
          !Array.isArray(obj.itemListElement) ||
          obj.itemListElement.length === 0
        )
          report.issues.push("BreadcrumbList.itemListElement missing or empty");
      }
    };
    if (Array.isArray(json)) json.forEach(checkObj);
    else checkObj(json);
  } catch (err) {
    report.ok = false;
    report.issues.push("JSON parse error: " + err.message);
  }
  reports.push(report);
}
if (reports.length === 0) {
  console.error("No application/ld+json scripts found in dist/index.html");
  process.exit(1);
}
console.log(JSON.stringify(reports, null, 2));
// Human readable summary
console.log("\nSummary:");
reports.forEach((r) => {
  console.log(`\n-- Script #${r.index} --`);
  console.log("Sample:", r.rawSample.replace(/\s+/g, " ").slice(0, 200));
  if (r.issues.length === 0) console.log("OK: no issues found.");
  else {
    console.log("Issues:");
    r.issues.forEach((i) => console.log(" -", i));
  }
});
process.exit(0);
