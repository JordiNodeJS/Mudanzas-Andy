#!/usr/bin/env node

/**
 * Extract Core Web Vitals metrics from Lighthouse HTML report
 */

import { promises as fs } from "fs";
import { JSDOM } from "jsdom";

async function extractMetricsFromHTML() {
  try {
    console.log("🔍 Analizando reporte de Lighthouse...");

    // Read the HTML report
    const htmlContent = await fs.readFile(
      "./reports/lighthouse-mobile-optimized.html",
      "utf-8"
    );

    // Parse HTML with JSDOM
    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;

    // Extract performance score
    const performanceScoreElement = document.querySelector(
      ".lh-gauge__percentage"
    );
    const performanceScore = performanceScoreElement
      ? parseInt(performanceScoreElement.textContent)
      : null;

    // Core Web Vitals metrics
    const metrics = {};

    // Find all metric elements
    const metricElements = document.querySelectorAll(".lh-metric");

    metricElements.forEach((element) => {
      const titleElement = element.querySelector(".lh-metric__title");
      const valueElement = element.querySelector(".lh-metric__value");

      if (titleElement && valueElement) {
        const title = titleElement.textContent.trim();
        const value = valueElement.textContent.trim();

        switch (title) {
          case "First Contentful Paint":
            metrics.fcp = value;
            break;
          case "Largest Contentful Paint":
            metrics.lcp = value;
            break;
          case "Total Blocking Time":
            metrics.tbt = value;
            break;
          case "Cumulative Layout Shift":
            metrics.cls = value;
            break;
          case "Speed Index":
            metrics.speedIndex = value;
            break;
          case "Time to Interactive":
            metrics.tti = value;
            break;
        }
      }
    });

    // Display results
    console.log("\n🎯 CORE WEB VITALS - MÓVIL OPTIMIZADO");
    console.log("=====================================");
    console.log(`📊 Performance Score: ${performanceScore}%`);
    console.log(`⚡ First Contentful Paint: ${metrics.fcp || "N/A"}`);
    console.log(`🎨 Largest Contentful Paint: ${metrics.lcp || "N/A"}`);
    console.log(`⏱️  Total Blocking Time: ${metrics.tbt || "N/A"}`);
    console.log(`📐 Cumulative Layout Shift: ${metrics.cls || "N/A"}`);
    console.log(`🚀 Speed Index: ${metrics.speedIndex || "N/A"}`);
    console.log(`⚡ Time to Interactive: ${metrics.tti || "N/A"}`);

    // Evaluate against thresholds
    console.log("\n🎯 EVALUACIÓN CONTRA OBJETIVOS:");
    console.log("==============================");

    const evaluateMetric = (name, value, threshold, unit = "ms") => {
      if (!value || value === "N/A") {
        console.log(`❓ ${name}: No disponible`);
        return;
      }

      const numValue = parseFloat(value.replace(/[^\d.]/g, ""));
      const passed = numValue <= threshold;
      const icon = passed ? "✅" : "❌";
      console.log(`${icon} ${name}: ${value} (objetivo: <${threshold}${unit})`);
      return passed;
    };

    // Performance Score
    const scoreIcon =
      performanceScore >= 90 ? "✅" : performanceScore >= 70 ? "⚠️" : "❌";
    console.log(
      `${scoreIcon} Performance Score: ${performanceScore}% (objetivo: ≥90%)`
    );

    // Core Web Vitals
    if (metrics.lcp) evaluateMetric("LCP", metrics.lcp, 2.5, "s");
    if (metrics.cls) evaluateMetric("CLS", metrics.cls, 0.1, "");
    if (metrics.fcp) evaluateMetric("FCP", metrics.fcp, 1.8, "s");
    if (metrics.tbt) evaluateMetric("TBT", metrics.tbt, 200, "ms");

    console.log(
      `\n📁 Reporte completo disponible en: ./reports/lighthouse-mobile-optimized.html`
    );
  } catch (error) {
    console.error("❌ Error al analizar el reporte:", error.message);

    // Fallback: try to extract from console output
    console.log("\n🔄 Intentando método alternativo...");

    // Try to read the raw HTML and extract basic info
    try {
      const htmlContent = await fs.readFile(
        "./reports/lighthouse-mobile-optimized.html",
        "utf-8"
      );

      // Simple regex extraction for performance score
      const scoreMatch = htmlContent.match(
        /class="lh-gauge__percentage[^>]*>(\d+)</
      );
      if (scoreMatch) {
        console.log(`📊 Performance Score encontrado: ${scoreMatch[1]}%`);
      }

      // Extract metric values with regex
      const lcpMatch = htmlContent.match(
        /Largest Contentful Paint.*?class="lh-metric__value[^>]*>([^<]+)</s
      );
      const fcpMatch = htmlContent.match(
        /First Contentful Paint.*?class="lh-metric__value[^>]*>([^<]+)</s
      );
      const clsMatch = htmlContent.match(
        /Cumulative Layout Shift.*?class="lh-metric__value[^>]*>([^<]+)</s
      );

      if (lcpMatch) console.log(`🎨 LCP: ${lcpMatch[1]}`);
      if (fcpMatch) console.log(`⚡ FCP: ${fcpMatch[1]}`);
      if (clsMatch) console.log(`📐 CLS: ${clsMatch[1]}`);
    } catch (fallbackError) {
      console.error("❌ Error en método alternativo:", fallbackError.message);
    }
  }
}

extractMetricsFromHTML();
