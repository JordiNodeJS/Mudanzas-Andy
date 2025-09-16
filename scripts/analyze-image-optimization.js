#!/usr/bin/env node

/**
 * Script para analizar y optimizar imágenes WebP del blog
 * Verifica calidad, compresión y proporciona recomendaciones de optimización
 */

import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSETS_DIR = path.join(
  __dirname,
  "..",
  "src",
  "assets",
  "images",
  "blog"
);

/**
 * Analiza las propiedades de una imagen WebP
 */
async function analyzeWebPImage(filename) {
  const filepath = path.join(ASSETS_DIR, filename);

  try {
    const stats = await fs.stat(filepath);
    const buffer = await fs.readFile(filepath);

    // Verificar que es un WebP válido
    const isValidWebP =
      buffer.slice(0, 4).toString() === "RIFF" &&
      buffer.slice(8, 12).toString() === "WEBP";

    // Calcular ratio de compresión aproximado
    const estimatedUncompressedSize = 1200 * 800 * 3; // RGB 24-bit aproximado
    const compressionRatio = (
      ((estimatedUncompressedSize - stats.size) / estimatedUncompressedSize) *
      100
    ).toFixed(1);

    // Determinar nivel de optimización basado en tamaño
    let optimizationLevel;
    if (stats.size < 30000) optimizationLevel = "Excelente";
    else if (stats.size < 50000) optimizationLevel = "Muy buena";
    else if (stats.size < 80000) optimizationLevel = "Buena";
    else if (stats.size < 120000) optimizationLevel = "Regular";
    else optimizationLevel = "Necesita optimización";

    return {
      filename,
      size: stats.size,
      sizeHuman: (stats.size / 1024).toFixed(1) + " KB",
      isValid: isValidWebP,
      compressionRatio: compressionRatio + "%",
      optimizationLevel,
      lastModified: stats.mtime.toISOString().split("T")[0],
      recommendations: generateRecommendations(stats.size, filename),
    };
  } catch (error) {
    return {
      filename,
      error: error.message,
      isValid: false,
    };
  }
}

/**
 * Genera recomendaciones de optimización
 */
function generateRecommendations(size, filename) {
  const recommendations = [];

  if (size > 100000) {
    recommendations.push("🔴 Reducir calidad WebP a 75-80%");
    recommendations.push("🔴 Considerar redimensionar a 1000x667px");
  } else if (size > 70000) {
    recommendations.push("🟡 Podría optimizarse más (calidad 80-85%)");
  } else if (size > 50000) {
    recommendations.push("🟡 Optimización aceptable (calidad 85%)");
  } else {
    recommendations.push("🟢 Bien optimizada");
  }

  // Recomendaciones específicas por tipo de imagen
  if (filename.includes("economicas")) {
    recommendations.push(
      "💡 Imagen de familia: enfocar rostros, reducir fondo"
    );
  } else if (filename.includes("embalaje")) {
    recommendations.push("💡 Imagen de objetos: alta compresión aceptable");
  } else if (filename.includes("ninos")) {
    recommendations.push("💡 Imagen con personas: mantener calidad en rostros");
  } else if (filename.includes("internacionales")) {
    recommendations.push("💡 Imagen de documentos: texto debe ser legible");
  }

  return recommendations;
}

/**
 * Verifica si Astro está optimizando las imágenes
 */
async function checkAstroOptimization() {
  const distDir = path.join(__dirname, "..", "dist");

  try {
    // Verificar si existe directorio dist con imágenes optimizadas
    const astroImagesDir = path.join(distDir, "_astro");
    const astroImages = await fs.readdir(astroImagesDir).catch(() => []);
    const webpImages = astroImages.filter((f) => f.endsWith(".webp"));

    return {
      hasDistFolder: true,
      optimizedImages: webpImages.length,
      astroIsOptimizing: webpImages.length > 0,
      astroImagesFound: webpImages.slice(0, 5), // Mostrar solo primeras 5
    };
  } catch {
    return {
      hasDistFolder: false,
      astroIsOptimizing: false,
      note: 'Ejecutar "pnpm build" para generar optimizaciones de Astro',
    };
  }
}

/**
 * Función principal de análisis
 */
async function analyzeAllImages() {
  console.log("🔍 ANALIZADOR DE OPTIMIZACIÓN DE IMÁGENES WEBP\n");

  try {
    // Obtener lista de imágenes WebP
    const files = await fs.readdir(ASSETS_DIR);
    const webpFiles = files.filter(
      (f) => f.endsWith(".webp") && f !== "blog-hero-optimized.webp"
    );

    if (webpFiles.length === 0) {
      console.log("❌ No se encontraron imágenes WebP para analizar");
      return;
    }

    console.log(`📊 Analizando ${webpFiles.length} imágenes WebP...\n`);

    // Analizar cada imagen
    const analyses = [];
    for (const file of webpFiles) {
      const analysis = await analyzeWebPImage(file);
      analyses.push(analysis);
    }

    // Verificar optimización de Astro
    const astroOptimization = await checkAstroOptimization();

    // Mostrar resultados
    console.log("📈 RESULTADOS DEL ANÁLISIS:\n");

    analyses.forEach((analysis, index) => {
      console.log(`${index + 1}. ${analysis.filename}`);
      console.log(
        `   📏 Tamaño: ${analysis.sizeHuman} (${analysis.size} bytes)`
      );
      console.log(`   🎯 Compresión: ${analysis.compressionRatio}`);
      console.log(`   ⭐ Nivel: ${analysis.optimizationLevel}`);
      console.log(`   📅 Modificado: ${analysis.lastModified}`);
      console.log(`   💡 Recomendaciones:`);
      analysis.recommendations.forEach((rec) => console.log(`      ${rec}`));
      console.log("");
    });

    // Resumen de optimización de Astro
    console.log("🚀 OPTIMIZACIÓN AUTOMÁTICA DE ASTRO:\n");
    if (astroOptimization.astroIsOptimizing) {
      console.log(
        `✅ Astro está generando ${astroOptimization.optimizedImages} variaciones optimizadas`
      );
      console.log("✅ Las imágenes se optimizan automáticamente en el build");
      console.log("✅ Se generan múltiples tamaños para diferentes viewports");
      if (astroOptimization.astroImagesFound.length > 0) {
        console.log("📁 Ejemplos generados:");
        astroOptimization.astroImagesFound.forEach((img) =>
          console.log(`   - ${img}`)
        );
      }
    } else {
      console.log("⚠️  Astro aún no ha generado optimizaciones");
      console.log('💡 Ejecuta "pnpm build" para generar versiones optimizadas');
    }

    // Resumen general
    const totalSize = analyses.reduce((sum, a) => sum + a.size, 0);
    const avgSize = totalSize / analyses.length;
    const wellOptimized = analyses.filter((a) => a.size < 70000).length;

    console.log("\n📊 RESUMEN GENERAL:");
    console.log(`📁 Total de imágenes: ${analyses.length}`);
    console.log(`📏 Tamaño promedio: ${(avgSize / 1024).toFixed(1)} KB`);
    console.log(`✅ Bien optimizadas: ${wellOptimized}/${analyses.length}`);
    console.log(`📦 Tamaño total: ${(totalSize / 1024).toFixed(1)} KB`);

    if (wellOptimized === analyses.length) {
      console.log("\n🎉 ¡TODAS LAS IMÁGENES ESTÁN BIEN OPTIMIZADAS!");
    } else {
      console.log("\n⚠️  Algunas imágenes podrían optimizarse más");
    }
  } catch (error) {
    console.error("❌ Error analizando imágenes:", error.message);
  }
}

// Ejecutar si es llamado directamente
if (process.argv[1] === __filename) {
  analyzeAllImages();
}

export { analyzeWebPImage, analyzeAllImages };
