#!/usr/bin/env node

/**
 * Script para optimizar las imágenes faltantes del TeamSection
 * Copia las imágenes de /resized/ a /optimized/ con compresión WebP
 */

import fs from "fs";
import path from "path";
import sharp from "sharp";

const sourceDir = "./public/camion/resized";
const targetDir = "./public/camion/optimized";

// Imágenes específicas que necesita TeamSection
const imagesToOptimize = [
  "moving-truck-cutout-01.jpg",
  "moving-truck-cutout-02.jpg",
  "moving-truck-01.jpg",
];

async function optimizeTeamImages() {
  console.log("🔧 Optimizando imágenes del TeamSection...\n");

  // Verificar que existe el directorio destino
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  for (const imageName of imagesToOptimize) {
    const sourcePath = path.join(sourceDir, imageName);
    const targetBaseName = imageName.replace(/\.(jpg|jpeg|png)$/i, "");

    console.log(`🔍 Buscando: ${sourcePath}`);

    if (!fs.existsSync(sourcePath)) {
      console.log(`⚠️  Imagen no encontrada: ${sourcePath}`);
      continue;
    }

    console.log(`📸 Procesando: ${imageName}`);

    try {
      // Obtener información de la imagen original
      const originalStats = fs.statSync(sourcePath);
      const originalSize = originalStats.size;

      // Generar versión AVIF (más eficiente)
      const avifPath = path.join(targetDir, `${targetBaseName}.avif`);
      await sharp(sourcePath)
        .avif({
          quality: 80,
          effort: 6,
        })
        .toFile(avifPath);

      // Generar versión WebP
      const webpPath = path.join(targetDir, `${targetBaseName}.webp`);
      await sharp(sourcePath)
        .webp({
          quality: 85,
          effort: 6,
        })
        .toFile(webpPath);

      // Generar versión JPEG optimizada
      const jpegPath = path.join(targetDir, imageName);
      await sharp(sourcePath)
        .jpeg({
          quality: 85,
          progressive: true,
          mozjpeg: true,
        })
        .toFile(jpegPath);

      // Mostrar estadísticas
      const avifStats = fs.statSync(avifPath);
      const webpStats = fs.statSync(webpPath);
      const jpegStats = fs.statSync(jpegPath);

      const avifSavings = (
        ((originalSize - avifStats.size) / originalSize) *
        100
      ).toFixed(1);
      const webpSavings = (
        ((originalSize - webpStats.size) / originalSize) *
        100
      ).toFixed(1);
      const jpegSavings = (
        ((originalSize - jpegStats.size) / originalSize) *
        100
      ).toFixed(1);

      console.log(`   Original: ${(originalSize / 1024).toFixed(1)} KB`);
      console.log(
        `   AVIF:     ${(avifStats.size / 1024).toFixed(
          1
        )} KB (${avifSavings}% reducción)`
      );
      console.log(
        `   WebP:     ${(webpStats.size / 1024).toFixed(
          1
        )} KB (${webpSavings}% reducción)`
      );
      console.log(
        `   JPEG:     ${(jpegStats.size / 1024).toFixed(
          1
        )} KB (${jpegSavings}% reducción)`
      );
      console.log("   ✅ Completado\n");
    } catch (error) {
      console.error(`   ❌ Error procesando ${imageName}:`, error.message);
    }
  }

  console.log("🎉 Optimización de imágenes del TeamSection completada!");
  console.log("\n📋 PRÓXIMO PASO:");
  console.log("Las imágenes ya funcionan con LazyImage, pero ahora puedes");
  console.log("cambiar de vuelta a OptimizedPicture para mayor rendimiento.\n");
}

// Ejecutar directamente
optimizeTeamImages().catch(console.error);
