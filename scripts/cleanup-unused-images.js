#!/usr/bin/env node

/**
 * Script para identificar y eliminar imágenes no utilizadas en el proyecto
 * Analiza las referencias en el código fuente y compara con las imágenes en public/
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class UnusedImagesCleaner {
  constructor() {
    this.projectRoot = path.join(__dirname, "..");
    this.publicDir = path.join(this.projectRoot, "public");
    this.srcDir = path.join(this.projectRoot, "src");

    // Patrones de archivos a escanear
    this.codeExtensions = [".astro", ".jsx", ".ts", ".js", ".md", ".css"];
    this.imageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".webp",
      ".avif",
      ".svg",
      ".ico",
    ];

    this.usedImages = new Set();
    this.allImages = new Set();
    this.unusedImages = [];
  }

  /**
   * Escanea recursivamente un directorio buscando archivos
   */
  scanDirectory(dir, extensions = []) {
    const files = [];

    if (!fs.existsSync(dir)) return files;

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Recursivamente escanear subdirectorios
        files.push(...this.scanDirectory(fullPath, extensions));
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (extensions.length === 0 || extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }

    return files;
  }

  /**
   * Encuentra todas las imágenes en public/
   */
  findAllImages() {
    console.log("🔍 Escaneando imágenes en public/...");

    const imageFiles = this.scanDirectory(this.publicDir, this.imageExtensions);

    for (const imagePath of imageFiles) {
      // Convertir a ruta relativa desde public/
      const relativePath = path
        .relative(this.publicDir, imagePath)
        .replace(/\\/g, "/");
      this.allImages.add("/" + relativePath);
    }

    console.log(`📁 Encontradas ${this.allImages.size} imágenes en public/`);
  }

  /**
   * Analiza archivos de código buscando referencias a imágenes
   */
  findUsedImages() {
    console.log("🔍 Escaneando referencias en código fuente...");

    const codeFiles = this.scanDirectory(this.srcDir, this.codeExtensions);

    // Patrones para encontrar rutas de imágenes
    const patterns = [
      // src="/path/to/image.jpg"
      /src\s*=\s*['"](\/[^'"]*\.(?:jpg|jpeg|png|webp|avif|svg|ico))['"]/gi,
      // href="/path/to/image.jpg"
      /href\s*=\s*['"](\/[^'"]*\.(?:jpg|jpeg|png|webp|avif|svg|ico))['"]/gi,
      // srcset="/path/to/image.jpg"
      /srcset\s*=\s*['"](\/[^'"]*\.(?:jpg|jpeg|png|webp|avif|svg|ico))['"]/gi,
      // "image": "/path/to/image.jpg"
      /"image"\s*:\s*['"](\/[^'"]*\.(?:jpg|jpeg|png|webp|avif|svg|ico))['"]/gi,
      // url: "/path/to/image.jpg"
      /url\s*:\s*['"](\/[^'"]*\.(?:jpg|jpeg|png|webp|avif|svg|ico))['"]/gi,
      // baseName: "/gallery/optimized/gallery-02" (sin extensión)
      /baseName\s*:\s*['"](\/[^'"]*\/gallery[^'"]*)['"]/gi,
    ];

    for (const filePath of codeFiles) {
      const content = fs.readFileSync(filePath, "utf-8");

      for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          let imagePath = match[1];

          // Si es un baseName de galería, generar todas las variantes
          if (imagePath.includes("/gallery/") && !path.extname(imagePath)) {
            this.addGalleryVariants(imagePath);
          } else {
            this.usedImages.add(imagePath);
          }
        }
      }
    }

    // Agregar imágenes esenciales que siempre deben mantenerse
    this.addEssentialImages();

    console.log(
      `📋 Encontradas ${this.usedImages.size} referencias de imágenes en código`
    );
  }

  /**
   * Agrega todas las variantes de una imagen de galería
   */
  addGalleryVariants(baseName) {
    const sizes = ["320w", "640w", "768w", "1024w", "1280w"];
    const formats = ["jpg", "webp", "avif"];

    for (const size of sizes) {
      for (const format of formats) {
        this.usedImages.add(`${baseName}-${size}.${format}`);
      }
    }
  }

  /**
   * Agrega imágenes esenciales que deben mantenerse
   */
  addEssentialImages() {
    const essential = [
      "/favicon.svg",
      "/logo-mudanzas-andy.svg",
      "/og-image.jpg",
      "/og-image-home.jpg",
      "/robots.txt", // No es imagen pero es esencial
      "/sitemap.xml", // No es imagen pero es esencial
    ];

    for (const img of essential) {
      this.usedImages.add(img);
    }
  }

  /**
   * Identifica imágenes no utilizadas
   */
  findUnusedImages() {
    console.log("📊 Analizando imágenes no utilizadas...");

    for (const imagePath of this.allImages) {
      if (!this.usedImages.has(imagePath)) {
        this.unusedImages.push(imagePath);
      }
    }

    console.log(
      `❌ Encontradas ${this.unusedImages.length} imágenes no utilizadas`
    );
  }

  /**
   * Muestra el reporte de imágenes
   */
  showReport() {
    console.log("\n📋 REPORTE DE IMÁGENES:");
    console.log(`   📁 Total imágenes: ${this.allImages.size}`);
    console.log(`   ✅ Imágenes utilizadas: ${this.usedImages.size}`);
    console.log(`   ❌ Imágenes no utilizadas: ${this.unusedImages.length}`);

    if (this.unusedImages.length > 0) {
      console.log("\n❌ Imágenes no utilizadas:");
      this.unusedImages.sort().forEach((img, index) => {
        console.log(`   ${index + 1}. ${img}`);
      });

      // Calcular tamaño aproximado
      let totalSize = 0;
      for (const imagePath of this.unusedImages) {
        const fullPath = path.join(this.publicDir, imagePath.substring(1));
        if (fs.existsSync(fullPath)) {
          const stats = fs.statSync(fullPath);
          totalSize += stats.size;
        }
      }

      const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);
      console.log(`\n💾 Tamaño total aproximado: ${sizeMB} MB`);
    }

    console.log("\n✅ Imágenes utilizadas (muestra):");
    const usedArray = Array.from(this.usedImages).sort().slice(0, 10);
    usedArray.forEach((img, index) => {
      console.log(`   ${index + 1}. ${img}`);
    });
    if (this.usedImages.size > 10) {
      console.log(`   ... y ${this.usedImages.size - 10} más`);
    }
  }

  /**
   * Elimina las imágenes no utilizadas (excluyendo backups importantes)
   */
  async cleanupUnusedImages() {
    // Filtrar imágenes que SÍ queremos eliminar (excluyendo backups)
    const imagesToDelete = this.unusedImages.filter((imagePath) => {
      // NO eliminar backups de galería
      if (imagePath.includes("/gallery/backup/")) {
        return false;
      }
      // NO eliminar fallbacks importantes
      if (imagePath.includes("logo-camion-transparent.png")) {
        return false;
      }
      return true;
    });

    if (imagesToDelete.length === 0) {
      console.log(
        "✅ No hay imágenes seguras para eliminar (se mantienen backups y fallbacks)"
      );
      return;
    }

    console.log(
      `\n🗑️  Eliminando ${imagesToDelete.length} imágenes no utilizadas...`
    );
    console.log(
      `💾 Se mantendrán ${
        this.unusedImages.length - imagesToDelete.length
      } archivos (backups/fallbacks)`
    );

    let deleted = 0;
    let errors = 0;

    for (const imagePath of imagesToDelete) {
      const fullPath = path.join(this.publicDir, imagePath.substring(1));

      try {
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
          console.log(`   ✅ Eliminado: ${imagePath}`);
          deleted++;
        } else {
          console.log(`   ⚠️  No encontrado: ${imagePath}`);
        }
      } catch (error) {
        console.error(`   ❌ Error eliminando ${imagePath}:`, error.message);
        errors++;
      }
    }

    console.log(`\n📊 Limpieza completada:`);
    console.log(`   ✅ Archivos eliminados: ${deleted}`);
    console.log(`   ❌ Errores: ${errors}`);
  }

  /**
   * Ejecuta el análisis completo
   */
  async analyze() {
    console.log("🧹 Iniciando análisis de imágenes no utilizadas...\n");

    this.findAllImages();
    this.findUsedImages();
    this.findUnusedImages();
    this.showReport();
  }

  /**
   * Ejecuta la limpieza completa
   */
  async clean() {
    await this.analyze();

    if (this.unusedImages.length > 0) {
      console.log("\n⚠️  Se encontraron imágenes no utilizadas.");
      console.log(
        "💡 Para eliminarlas, ejecuta: node scripts/cleanup-unused-images.js --delete"
      );
    }
  }
}

// Ejecutar el script
async function main() {
  const cleaner = new UnusedImagesCleaner();

  try {
    const shouldDelete = process.argv.includes("--delete");

    if (shouldDelete) {
      await cleaner.analyze();
      await cleaner.cleanupUnusedImages();
    } else {
      await cleaner.clean();
    }

    console.log("\n🎉 Análisis completado!");
  } catch (error) {
    console.error("❌ Error fatal:", error);
    process.exit(1);
  }
}

main();
