#!/usr/bin/env node

/**
 * Simple Core Web Vitals extractor from Lighthouse HTML
 */

import { promises as fs } from "fs";

async function extractMetrics() {
  try {
    console.log("🔍 Extrayendo métricas de Core Web Vitals...\n");

    const reportPath =
      process.argv[2] || "./reports/lighthouse-mobile-optimized.html";
    const htmlContent = await fs.readFile(reportPath, "utf-8");

    // Extract performance score
    const performanceMatch = htmlContent.match(
      /"performance".*?"score":([\d\.]+)/
    );
    const performanceScore = performanceMatch
      ? Math.round(parseFloat(performanceMatch[1]) * 100)
      : null;

    // Extract FCP
    const fcpMatch = htmlContent.match(
      /"first-contentful-paint"[^}]*"displayValue":"([^"]+)"/
    );
    const fcp = fcpMatch ? fcpMatch[1] : "N/A";

    // Extract LCP
    const lcpMatch = htmlContent.match(
      /"largest-contentful-paint"[^}]*"displayValue":"([^"]+)"/
    );
    const lcp = lcpMatch ? lcpMatch[1] : "N/A";

    // Extract TBT
    const tbtMatch = htmlContent.match(
      /"total-blocking-time"[^}]*"displayValue":"([^"]+)"/
    );
    const tbt = tbtMatch ? tbtMatch[1] : "N/A";

    // Extract CLS
    const clsMatch = htmlContent.match(
      /"cumulative-layout-shift"[^}]*"displayValue":"([^"]+)"/
    );
    const cls = clsMatch ? clsMatch[1] : "N/A";

    // Extract Speed Index
    const siMatch = htmlContent.match(
      /"speed-index"[^}]*"displayValue":"([^"]+)"/
    );
    const speedIndex = siMatch ? siMatch[1] : "N/A";

    // Extract TTI
    const ttiMatch = htmlContent.match(
      /"interactive"[^}]*"displayValue":"([^"]+)"/
    );
    const tti = ttiMatch ? ttiMatch[1] : "N/A";

    // Display results
    console.log("🎯 LIGHTHOUSE - RESULTADOS CORE WEB VITALS MÓVIL");
    console.log("===============================================");
    console.log(`📊 Performance Score: ${performanceScore}%`);
    console.log(`⚡ First Contentful Paint (FCP): ${fcp}`);
    console.log(`🎨 Largest Contentful Paint (LCP): ${lcp}`);
    console.log(`⏱️  Total Blocking Time (TBT): ${tbt}`);
    console.log(`📐 Cumulative Layout Shift (CLS): ${cls}`);
    console.log(`🚀 Speed Index: ${speedIndex}`);
    console.log(`⚡ Time to Interactive (TTI): ${tti}\n`);

    // Evaluation
    console.log("🎯 EVALUACIÓN VS OBJETIVOS TASK-029:");
    console.log("====================================");

    // Performance Score
    if (performanceScore !== null) {
      const scoreIcon =
        performanceScore >= 90 ? "✅" : performanceScore >= 70 ? "⚠️" : "❌";
      const scoreStatus =
        performanceScore >= 90
          ? "EXCELENTE"
          : performanceScore >= 70
          ? "BUENO"
          : "NECESITA MEJORA";
      console.log(
        `${scoreIcon} Performance Score: ${performanceScore}% (objetivo: ≥90%) - ${scoreStatus}`
      );
    }

    // LCP evaluation
    if (lcp !== "N/A") {
      const lcpValue = parseFloat(lcp.replace(/[^\d.]/g, ""));
      const lcpIcon = lcpValue <= 2.5 ? "✅" : lcpValue <= 4.0 ? "⚠️" : "❌";
      const lcpStatus =
        lcpValue <= 2.5
          ? "EXCELENTE"
          : lcpValue <= 4.0
          ? "NECESITA MEJORA"
          : "MALO";
      console.log(`${lcpIcon} LCP: ${lcp} (objetivo: ≤2.5s) - ${lcpStatus}`);
    }

    // CLS evaluation
    if (cls !== "N/A") {
      const clsValue = parseFloat(cls);
      const clsIcon = clsValue <= 0.1 ? "✅" : clsValue <= 0.25 ? "⚠️" : "❌";
      const clsStatus =
        clsValue <= 0.1
          ? "EXCELENTE"
          : clsValue <= 0.25
          ? "NECESITA MEJORA"
          : "MALO";
      console.log(`${clsIcon} CLS: ${cls} (objetivo: ≤0.1) - ${clsStatus}`);
    }

    // FCP evaluation
    if (fcp !== "N/A") {
      const fcpValue = parseFloat(fcp.replace(/[^\d.]/g, ""));
      const fcpIcon = fcpValue <= 1.8 ? "✅" : fcpValue <= 3.0 ? "⚠️" : "❌";
      const fcpStatus =
        fcpValue <= 1.8
          ? "EXCELENTE"
          : fcpValue <= 3.0
          ? "NECESITA MEJORA"
          : "MALO";
      console.log(`${fcpIcon} FCP: ${fcp} (objetivo: ≤1.8s) - ${fcpStatus}`);
    }

    console.log("\n🚀 RESUMEN PARA PRODUCCIÓN:");
    console.log("===========================");

    const readyForProduction =
      performanceScore >= 70 &&
      (lcp === "N/A" || parseFloat(lcp.replace(/[^\d.]/g, "")) <= 4.0) &&
      (cls === "N/A" || parseFloat(cls) <= 0.25);

    if (readyForProduction) {
      console.log("✅ El sitio está listo para subir a producción");
      console.log("📈 Las optimizaciones han sido efectivas");
      console.log(
        "🎯 Puedes proceder con el deploy y testear con PageSpeed Insights"
      );
    } else {
      console.log("⚠️  Se necesitan más optimizaciones antes de producción");
      console.log("📊 Considera implementar las recomendaciones adicionales");
    }

    console.log(
      `\n📁 Reporte completo: ./reports/lighthouse-mobile-optimized.html`
    );
    console.log(
      "🌐 Próximo paso: Deploy y test con https://pagespeed.web.dev/\n"
    );
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

extractMetrics();
