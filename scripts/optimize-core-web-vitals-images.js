#!/usr/bin/env node

/**
 * CRITICAL: Image Optimization Script for Core Web Vitals
 * Generates AVIF, WebP and optimized JPEG for mobile and desktop
 * Specifically designed to improve LCP (Largest Contentful Paint)
 */

import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration for different breakpoints and formats
const OPTIMIZATION_CONFIG = {
  // Mobile optimization (critical for mobile Core Web Vitals)
  mobile: {
    width: 768,
    height: 432,
    suffix: "-mobile",
    quality: {
      avif: 50,
      webp: 75,
      jpeg: 85,
    },
  },
  // Desktop optimization
  desktop: {
    width: 1920,
    height: 1080,
    suffix: "",
    quality: {
      avif: 60,
      webp: 80,
      jpeg: 90,
    },
  },
};

const OUTPUT_FORMATS = ["avif", "webp", "jpeg"];
const INPUT_DIR = path.join(__dirname, "../public/camion");
const OUTPUT_DIR = path.join(__dirname, "../public/camion/optimized");

async function ensureDir(dir) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
}

async function optimizeImage(inputPath, outputDir, config, breakpoint) {
  const inputName = path.basename(inputPath, path.extname(inputPath));
  const stats = { original: 0, optimized: {} };

  try {
    // Get original file size
    const originalStats = await fs.stat(inputPath);
    stats.original = Math.round(originalStats.size / 1024);

    console.log(`🖼️  Processing ${inputName} (${breakpoint})`);

    for (const format of OUTPUT_FORMATS) {
      const outputName = `${inputName}${config.suffix}.${format}`;
      const outputPath = path.join(outputDir, outputName);

      let pipeline = sharp(inputPath).resize(config.width, config.height, {
        fit: "cover",
        position: "center",
      });

      // Apply format-specific optimizations
      switch (format) {
        case "avif":
          pipeline = pipeline.avif({
            quality: config.quality.avif,
            effort: 6, // Maximum compression effort
            chromaSubsampling: "4:2:0",
          });
          break;

        case "webp":
          pipeline = pipeline.webp({
            quality: config.quality.webp,
            effort: 6,
            smartSubsample: true,
            nearLossless: false,
          });
          break;

        case "jpeg":
          pipeline = pipeline.jpeg({
            quality: config.quality.jpeg,
            progressive: true,
            mozjpeg: true,
            optimizeScans: true,
          });
          break;
      }

      await pipeline.toFile(outputPath);

      // Calculate compression stats
      const optimizedStats = await fs.stat(outputPath);
      const optimizedSize = Math.round(optimizedStats.size / 1024);
      const compression = Math.round(
        ((stats.original - optimizedSize) / stats.original) * 100
      );

      stats.optimized[format] = { size: optimizedSize, compression };

      console.log(
        `   📦 ${format.toUpperCase()}: ${optimizedSize}KB (${compression}% smaller)`
      );
    }
  } catch (error) {
    console.error(`❌ Error processing ${inputName}:`, error.message);
  }

  return stats;
}

async function generateCriticalCSS(stats) {
  const cssContent = `/* AUTO-GENERATED CRITICAL IMAGE STYLES FOR CORE WEB VITALS */
/* Generated on ${new Date().toISOString()} */

/* Image optimization stats:
${Object.entries(stats)
  .map(
    ([img, data]) =>
      `   ${img}: ${data.original}KB → AVIF: ${data.optimized?.avif?.size}KB WebP: ${data.optimized?.webp?.size}KB`
  )
  .join("\n")}
*/

.hero-image-container {
  /* Prevent layout shift with aspect ratio */
  aspect-ratio: 16/9;
  position: relative;
  overflow: hidden;
}

.hero-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* Critical: prevent layout shift */
  aspect-ratio: inherit;
}

/* Mobile-first responsive images */
@media (max-width: 768px) {
  .hero-image-container {
    /* Mobile aspect ratio optimization */
    aspect-ratio: 16/9;
    min-height: 200px;
  }
}

@media (min-width: 769px) {
  .hero-image-container {
    /* Desktop aspect ratio */
    aspect-ratio: 16/9;
    min-height: 400px;
  }
}`;

  await fs.writeFile(
    path.join(__dirname, "../public/styles/critical-images.css"),
    cssContent
  );
  console.log("📄 Generated critical CSS for images");
}

async function main() {
  console.log("🚀 Starting Core Web Vitals Image Optimization...\n");

  await ensureDir(OUTPUT_DIR);

  try {
    const files = await fs.readdir(INPUT_DIR);
    const imageFiles = files.filter((file) =>
      /\.(jpg|jpeg|png|webp)$/i.test(file)
    );

    if (imageFiles.length === 0) {
      console.log("❌ No image files found in input directory");
      return;
    }

    console.log(`Found ${imageFiles.length} images to optimize\n`);

    const allStats = {};

    for (const file of imageFiles) {
      const inputPath = path.join(INPUT_DIR, file);
      const baseName = path.basename(file, path.extname(file));

      // Process for mobile
      const mobileStats = await optimizeImage(
        inputPath,
        OUTPUT_DIR,
        OPTIMIZATION_CONFIG.mobile,
        "mobile"
      );

      // Process for desktop
      const desktopStats = await optimizeImage(
        inputPath,
        OUTPUT_DIR,
        OPTIMIZATION_CONFIG.desktop,
        "desktop"
      );

      allStats[baseName] = {
        original: mobileStats.original,
        optimized: {
          ...mobileStats.optimized,
          ...desktopStats.optimized,
        },
      };

      console.log(""); // Empty line for readability
    }

    // Generate critical CSS
    await generateCriticalCSS(allStats);

    // Summary
    console.log("\n📊 OPTIMIZATION SUMMARY");
    console.log("========================");

    let totalOriginal = 0;
    let totalOptimized = 0;

    Object.entries(allStats).forEach(([name, stats]) => {
      totalOriginal += stats.original;
      const avgOptimized =
        Object.values(stats.optimized).reduce(
          (sum, format) => sum + format.size,
          0
        ) / Object.keys(stats.optimized).length;
      totalOptimized += avgOptimized;
      console.log(
        `📸 ${name}: ${stats.original}KB → ~${Math.round(
          avgOptimized
        )}KB average`
      );
    });

    const totalCompression = Math.round(
      ((totalOriginal - totalOptimized) / totalOriginal) * 100
    );
    console.log(
      `\n🎯 TOTAL SAVINGS: ${Math.round(totalOriginal)}KB → ${Math.round(
        totalOptimized
      )}KB (${totalCompression}% reduction)`
    );
    console.log(
      "✅ Optimization complete! Your LCP should improve significantly."
    );
  } catch (error) {
    console.error("❌ Optimization failed:", error.message);
    process.exit(1);
  }
}

// Execute if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
