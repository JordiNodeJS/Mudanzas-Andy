#!/usr/bin/env node

/**
 * Generate missing AVIF images for hero section - Critical for LCP optimization
 */

import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";

async function generateHeroAVIF() {
  const inputDir = "./public/camion/optimized";

  const images = [
    {
      input: "hero-fondo.jpg",
      output: "hero-fondo.avif",
      width: 1920,
      quality: 75,
    },
    {
      input: "hero-fondo-mobile.jpg",
      output: "hero-fondo-mobile.avif",
      width: 768,
      quality: 80,
    },
  ];

  console.log("🖼️  Generando imágenes AVIF críticas para LCP...\n");

  for (const img of images) {
    const inputPath = path.join(inputDir, img.input);
    const outputPath = path.join(inputDir, img.output);

    try {
      // Check if input exists
      await fs.access(inputPath);

      // Generate AVIF
      await sharp(inputPath)
        .resize(img.width, null, {
          fit: "cover",
          withoutEnlargement: true,
        })
        .avif({
          quality: img.quality,
          effort: 6, // Max compression effort
          chromaSubsampling: "4:4:4", // Better quality for gradients
        })
        .toFile(outputPath);

      console.log(`✅ ${img.output} generado correctamente`);

      // Show file sizes
      const stats = await fs.stat(outputPath);
      const sizeKB = Math.round(stats.size / 1024);
      console.log(`   Tamaño: ${sizeKB}KB\n`);
    } catch (error) {
      console.error(`❌ Error procesando ${img.input}:`, error.message);
    }
  }

  console.log(
    "🎯 Imágenes AVIF generadas. Esto debería mejorar significativamente el LCP."
  );
  console.log("📋 Próximos pasos:");
  console.log("   1. pnpm build");
  console.log("   2. Test Lighthouse");
  console.log("   3. Verificar mejora en LCP < 2.5s");
}

generateHeroAVIF();
