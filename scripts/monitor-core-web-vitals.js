#!/usr/bin/env node

/**
 * Core Web Vitals Monitoring Script
 * Automated performance auditing with Lighthouse CI
 * Specifically focused on mobile performance improvements
 */

import { exec } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG = {
  // Target URLs for monitoring
  urls: [
    "http://localhost:4321",
    "http://localhost:4321/blog-astro",
    "http://localhost:4321/politica-privacidad",
  ],

  // Core Web Vitals thresholds
  thresholds: {
    lcp: 2500, // Largest Contentful Paint (ms)
    fid: 100, // First Input Delay (ms)
    cls: 0.1, // Cumulative Layout Shift
    fcp: 1800, // First Contentful Paint (ms)
    tti: 3800, // Time to Interactive (ms)
    speedIndex: 3400, // Speed Index (ms)
    performanceScore: 90, // Lighthouse performance score
  },

  // Device configurations
  devices: ["mobile", "desktop"],

  // Output configuration
  outputDir: path.join(__dirname, "../reports/core-web-vitals"),
  reportName: `cwv-report-${new Date().toISOString().split("T")[0]}`,
};

async function ensureReportDir() {
  try {
    await fs.access(CONFIG.outputDir);
  } catch {
    await fs.mkdir(CONFIG.outputDir, { recursive: true });
    console.log(`📁 Created reports directory: ${CONFIG.outputDir}`);
  }
}

function runLighthouse(url, device) {
  return new Promise((resolve, reject) => {
    const outputFile = path.join(
      CONFIG.outputDir,
      `${CONFIG.reportName}-${device}-${url.split("/").pop() || "home"}.json`
    );

    const command =
      `pnpm dlx lighthouse "${url}" ` +
      `--form-factor=${device} ` +
      `--throttling-method=simulate ` +
      `--only-categories=performance ` +
      `--output=json ` +
      `--output-path="${outputFile}" ` +
      `--chrome-flags="--headless --no-sandbox --disable-dev-shm-usage"`;

    console.log(`🔍 Auditing ${url} (${device})...`);

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(
          `❌ Lighthouse error for ${url} (${device}):`,
          error.message
        );
        reject(error);
        return;
      }

      if (stderr) {
        console.warn(`⚠️  Lighthouse warning:`, stderr);
      }

      resolve({ url, device, outputFile });
    });
  });
}

async function parseResults(reportFile) {
  try {
    const data = await fs.readFile(reportFile, "utf8");
    const report = JSON.parse(data);

    const audits = report.lhr?.audits || {};
    const metrics = {
      performanceScore: Math.round(
        (report.lhr?.categories?.performance?.score || 0) * 100
      ),
      lcp: audits["largest-contentful-paint"]?.numericValue || 0,
      fcp: audits["first-contentful-paint"]?.numericValue || 0,
      tti: audits["interactive"]?.numericValue || 0,
      cls: audits["cumulative-layout-shift"]?.numericValue || 0,
      speedIndex: audits["speed-index"]?.numericValue || 0,
      // FID is not directly available in Lighthouse, use TBT as proxy
      tbt: audits["total-blocking-time"]?.numericValue || 0,
    };

    return metrics;
  } catch (error) {
    console.error(`❌ Error parsing report ${reportFile}:`, error.message);
    return null;
  }
}

function analyzeMetrics(metrics, thresholds) {
  const analysis = {
    passed: 0,
    failed: 0,
    issues: [],
  };

  const checks = [
    {
      key: "performanceScore",
      name: "Performance Score",
      value: metrics.performanceScore,
      threshold: thresholds.performanceScore,
      unit: "",
      higher: true,
    },
    {
      key: "lcp",
      name: "Largest Contentful Paint",
      value: metrics.lcp,
      threshold: thresholds.lcp,
      unit: "ms",
      higher: false,
    },
    {
      key: "fcp",
      name: "First Contentful Paint",
      value: metrics.fcp,
      threshold: thresholds.fcp,
      unit: "ms",
      higher: false,
    },
    {
      key: "tti",
      name: "Time to Interactive",
      value: metrics.tti,
      threshold: thresholds.tti,
      unit: "ms",
      higher: false,
    },
    {
      key: "cls",
      name: "Cumulative Layout Shift",
      value: metrics.cls,
      threshold: thresholds.cls,
      unit: "",
      higher: false,
    },
    {
      key: "speedIndex",
      name: "Speed Index",
      value: metrics.speedIndex,
      threshold: thresholds.speedIndex,
      unit: "ms",
      higher: false,
    },
  ];

  checks.forEach((check) => {
    const passed = check.higher
      ? check.value >= check.threshold
      : check.value <= check.threshold;

    if (passed) {
      analysis.passed++;
    } else {
      analysis.failed++;
      analysis.issues.push({
        metric: check.name,
        value: check.value,
        threshold: check.threshold,
        unit: check.unit,
        improvement: check.higher
          ? check.threshold - check.value
          : check.value - check.threshold,
      });
    }
  });

  return analysis;
}

function generateRecommendations(issues) {
  const recommendations = [];

  issues.forEach((issue) => {
    switch (issue.metric) {
      case "Largest Contentful Paint":
        recommendations.push({
          priority: "HIGH",
          action: "Optimize LCP",
          details: [
            '• Preload hero images with fetchpriority="high"',
            "• Use AVIF/WebP formats with proper fallbacks",
            "• Implement critical CSS inline",
            "• Remove render-blocking resources",
          ],
        });
        break;

      case "First Contentful Paint":
        recommendations.push({
          priority: "MEDIUM",
          action: "Improve FCP",
          details: [
            "• Minimize critical resource chain",
            "• Optimize font loading with font-display: swap",
            "• Reduce server response time",
            "• Enable compression and caching",
          ],
        });
        break;

      case "Cumulative Layout Shift":
        recommendations.push({
          priority: "HIGH",
          action: "Fix Layout Shifts",
          details: [
            "• Add explicit dimensions to images and videos",
            "• Reserve space for dynamic content",
            "• Use CSS aspect-ratio property",
            "• Avoid inserting content above existing content",
          ],
        });
        break;

      case "Time to Interactive":
        recommendations.push({
          priority: "MEDIUM",
          action: "Reduce TTI",
          details: [
            "• Code split JavaScript bundles",
            "• Defer non-critical JavaScript",
            "• Remove unused code",
            "• Use service worker for caching",
          ],
        });
        break;

      case "Performance Score":
        recommendations.push({
          priority: "HIGH",
          action: "Improve Overall Performance",
          details: [
            "• Focus on Core Web Vitals improvements",
            "• Optimize resource loading strategy",
            "• Implement performance budget",
            "• Regular performance monitoring",
          ],
        });
        break;
    }
  });

  return recommendations;
}

async function generateReport(results) {
  const timestamp = new Date().toISOString();
  const summary = {
    timestamp,
    totalAudits: results.length,
    passedAudits: results.filter((r) => r.analysis.failed === 0).length,
    failedAudits: results.filter((r) => r.analysis.failed > 0).length,
    results: results.map((result) => ({
      url: result.url,
      device: result.device,
      metrics: result.metrics,
      analysis: result.analysis,
      recommendations: generateRecommendations(result.analysis.issues),
    })),
  };

  // Generate JSON report
  const jsonReport = path.join(
    CONFIG.outputDir,
    `${CONFIG.reportName}-summary.json`
  );
  await fs.writeFile(jsonReport, JSON.stringify(summary, null, 2));

  // Generate human-readable report
  const textReport = path.join(
    CONFIG.outputDir,
    `${CONFIG.reportName}-summary.md`
  );
  let reportContent = `# Core Web Vitals Report\n\n`;
  reportContent += `**Generated:** ${timestamp}\n`;
  reportContent += `**Total Audits:** ${summary.totalAudits}\n`;
  reportContent += `**Passed:** ${summary.passedAudits} | **Failed:** ${summary.failedAudits}\n\n`;

  summary.results.forEach((result) => {
    reportContent += `## ${result.url} (${result.device})\n\n`;
    reportContent += `### 📊 Metrics\n`;
    reportContent += `- **Performance Score:** ${result.metrics.performanceScore}/100\n`;
    reportContent += `- **LCP:** ${Math.round(result.metrics.lcp)}ms\n`;
    reportContent += `- **FCP:** ${Math.round(result.metrics.fcp)}ms\n`;
    reportContent += `- **TTI:** ${Math.round(result.metrics.tti)}ms\n`;
    reportContent += `- **CLS:** ${result.metrics.cls.toFixed(3)}\n`;
    reportContent += `- **Speed Index:** ${Math.round(
      result.metrics.speedIndex
    )}ms\n\n`;

    if (result.analysis.issues.length > 0) {
      reportContent += `### ⚠️ Issues Found\n`;
      result.analysis.issues.forEach((issue) => {
        reportContent += `- **${issue.metric}:** ${issue.value}${issue.unit} (threshold: ${issue.threshold}${issue.unit})\n`;
      });
      reportContent += "\n";

      reportContent += `### 🔧 Recommendations\n`;
      result.recommendations.forEach((rec) => {
        reportContent += `#### ${rec.priority} PRIORITY: ${rec.action}\n`;
        rec.details.forEach((detail) => (reportContent += `${detail}\n`));
        reportContent += "\n";
      });
    } else {
      reportContent += `### ✅ All metrics within thresholds!\n\n`;
    }
  });

  await fs.writeFile(textReport, reportContent);

  console.log(`\n📄 Reports generated:`);
  console.log(`   JSON: ${jsonReport}`);
  console.log(`   Markdown: ${textReport}`);

  return summary;
}

async function main() {
  console.log("🚀 Starting Core Web Vitals monitoring...\n");

  await ensureReportDir();

  const allResults = [];

  // Run audits for each URL and device combination
  for (const url of CONFIG.urls) {
    for (const device of CONFIG.devices) {
      try {
        const result = await runLighthouse(url, device);
        const metrics = await parseResults(result.outputFile);

        if (metrics) {
          const analysis = analyzeMetrics(metrics, CONFIG.thresholds);
          allResults.push({
            url: result.url,
            device: result.device,
            metrics,
            analysis,
          });

          const status = analysis.failed === 0 ? "✅" : "❌";
          console.log(
            `${status} ${url} (${device}): ${
              metrics.performanceScore
            }/100, LCP: ${Math.round(metrics.lcp)}ms`
          );
        }
      } catch (error) {
        console.error(`❌ Failed to audit ${url} (${device}):`, error.message);
      }
    }
  }

  if (allResults.length === 0) {
    console.error("❌ No successful audits completed");
    process.exit(1);
  }

  // Generate comprehensive report
  const summary = await generateReport(allResults);

  // Console summary
  console.log("\n📊 SUMMARY");
  console.log("===========");
  console.log(`Total audits: ${summary.totalAudits}`);
  console.log(`Passed: ${summary.passedAudits}`);
  console.log(`Failed: ${summary.failedAudits}`);

  if (summary.failedAudits > 0) {
    console.log(
      "\n⚠️  Some audits failed. Check the detailed report for recommendations."
    );
    process.exit(1);
  } else {
    console.log(
      "\n🎉 All audits passed! Great job on the performance optimization!"
    );
  }
}

// Execute if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
