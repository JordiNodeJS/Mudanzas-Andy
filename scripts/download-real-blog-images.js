#!/usr/bin/env node

/**
 * Script para descargar realmente las imágenes de Unsplash/Pexels
 * y procesarlas correctamente para el blog
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

// URLs reales con parámetros optimizados para WebP y tamaño específico
const BLOG_IMAGES = {
  "mudanzas-economicas-hero.webp": {
    url: "https://images.pexels.com/photos/4569340/pexels-photo-4569340.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop&fm=webp&q=85",
    alt: "Familia preparando mudanza económica en Barcelona con cajas organizadas y planificación profesional",
    description: "Familia con cajas de mudanza organizadas",
  },
  "embalaje-profesional-hero.webp": {
    url: "https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop&fm=webp&q=85",
    alt: "Mesa con materiales de embalaje profesional: cajas de cartón, papel burbuja, cinta adhesiva, etiquetas y herramientas organizadas para una mudanza eficiente",
    description: "Mesa con materiales de embalaje profesional organizados",
  },
  "mudanza-ninos-hero.webp": {
    url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=85&fm=webp",
    alt: "Madre e hija sonrientes etiquetando cajas de mudanza juntas en una habitación luminosa, mostrando la importancia de involucrar a los niños en el proceso de traslado familiar",
    description: "Madre e hija etiquetando cajas de mudanza",
  },
  "mudanzas-internacionales-hero.webp": {
    url: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=85&fm=webp",
    alt: "Persona organizando documentos de mudanza internacional con pasaporte, formularios de aduanas y mapamundi en el fondo, simbolizando la planificación necesaria para traslados al extranjero",
    description: "Documentos de mudanza internacional organizados",
  },
};

/**
 * Descarga una imagen usando fetch nativo de Node.js
 */
async function downloadImage(url, filename) {
  try {
    console.log(`📥 Descargando: ${filename}`);
    console.log(`   URL: ${url}`);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validar que es una imagen (debe tener un tamaño mínimo razonable)
    if (buffer.length < 5000) {
      throw new Error(`Imagen demasiado pequeña: ${buffer.length} bytes`);
    }

    const imagePath = path.join(ASSETS_DIR, filename);
    await fs.writeFile(imagePath, buffer);

    console.log(
      `✅ ${filename}: Descargada exitosamente (${buffer.length} bytes)`
    );
    return { success: true, size: buffer.length };
  } catch (error) {
    console.error(`❌ Error descargando ${filename}:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Verifica si las imágenes actuales son todas iguales (copias)
 */
async function checkForDuplicates() {
  console.log("🔍 Verificando si todas las imágenes son iguales...\n");

  const files = Object.keys(BLOG_IMAGES);
  const hashes = new Map();

  for (const filename of files) {
    const filepath = path.join(ASSETS_DIR, filename);
    try {
      const buffer = await fs.readFile(filepath);
      const hash = require("crypto")
        .createHash("md5")
        .update(buffer)
        .digest("hex");
      hashes.set(filename, hash);
    } catch (error) {
      hashes.set(filename, "NO_EXISTE");
    }
  }

  const uniqueHashes = new Set(hashes.values());
  const areAllSame = uniqueHashes.size === 1 && !uniqueHashes.has("NO_EXISTE");

  if (areAllSame) {
    console.log("⚠️  PROBLEMA DETECTADO: Todas las imágenes son idénticas");
    console.log(
      "   Esto explica por qué todos los artículos muestran la misma imagen\n"
    );
    return true;
  } else {
    console.log("✅ Las imágenes son diferentes entre sí\n");
    return false;
  }
}

/**
 * Crea backup de las imágenes existentes
 */
async function backupExistingImages() {
  console.log("💾 Creando backup de imágenes existentes...\n");

  const backupDir = path.join(ASSETS_DIR, "backup-" + Date.now());
  await fs.mkdir(backupDir, { recursive: true });

  for (const filename of Object.keys(BLOG_IMAGES)) {
    const sourcePath = path.join(ASSETS_DIR, filename);
    const backupPath = path.join(backupDir, filename);

    try {
      await fs.copyFile(sourcePath, backupPath);
      console.log(`📋 Backup creado: ${filename}`);
    } catch (error) {
      console.log(
        `⚠️  No se pudo hacer backup de ${filename}: ${error.message}`
      );
    }
  }

  console.log(`✅ Backup completado en: ${backupDir}\n`);
  return backupDir;
}

/**
 * Descarga todas las imágenes del blog
 */
async function downloadAllImages() {
  console.log(
    "🚀 Iniciando descarga de imágenes reales de Unsplash/Pexels...\n"
  );

  const results = [];

  for (const [filename, imageInfo] of Object.entries(BLOG_IMAGES)) {
    const result = await downloadImage(imageInfo.url, filename);
    results.push({ filename, ...result, ...imageInfo });

    // Pausa breve entre descargas para ser respetuosos con los servidores
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return results;
}

/**
 * Genera reporte final
 */
async function generateFinalReport(results, backupDir) {
  const report = {
    timestamp: new Date().toISOString(),
    backupLocation: backupDir,
    downloadResults: results,
    summary: {
      total: results.length,
      successful: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
    },
  };

  const reportPath = path.join(ASSETS_DIR, "download-report.json");
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

  console.log("\n📊 REPORTE FINAL:");
  console.log(
    `✅ Éxitosas: ${report.summary.successful}/${report.summary.total}`
  );
  console.log(`❌ Fallidas: ${report.summary.failed}/${report.summary.total}`);
  console.log(`📁 Backup en: ${backupDir}`);
  console.log(`📋 Reporte detallado: download-report.json\n`);

  return report;
}

/**
 * Función principal
 */
async function main() {
  console.log("🎨 Blog Images Downloader - Descargando imágenes reales\n");

  try {
    // Verificar si hay problema de duplicados
    const hasDuplicates = await checkForDuplicates();

    if (!hasDuplicates) {
      console.log(
        "ℹ️  Las imágenes ya parecen ser diferentes. ¿Continuar de todos modos? (Ctrl+C para cancelar)"
      );
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    // Crear backup
    const backupDir = await backupExistingImages();

    // Descargar imágenes reales
    const results = await downloadAllImages();

    // Generar reporte
    const report = await generateFinalReport(results, backupDir);

    // Verificar éxito
    if (report.summary.successful === report.summary.total) {
      console.log("🎉 ¡DESCARGA COMPLETADA EXITOSAMENTE!");
      console.log(
        "   Todas las imágenes ahora son únicas y específicas para cada artículo"
      );
      console.log("\n💡 Próximos pasos:");
      console.log("   1. Ejecutar: pnpm build");
      console.log("   2. Verificar: pnpm dev");
      console.log("   3. Navegar a: http://localhost:4322/blog-astro/");
    } else {
      console.log("⚠️  DESCARGA PARCIALMENTE EXITOSA");
      console.log("   Algunas imágenes no se pudieron descargar");
      console.log("   Revisa el reporte detallado para más información");
    }
  } catch (error) {
    console.error("\n❌ Error en el proceso:", error.message);
    console.error("   Revisa tu conexión a internet e intenta nuevamente");
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (process.argv[1] === __filename) {
  main();
}

export { downloadImage, downloadAllImages, BLOG_IMAGES };
