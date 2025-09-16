#!/usr/bin/env node

/**
 * Script para recortar las imágenes de la galería y remover la marca de agua
 * en forma de estrella de la esquina inferior izquierda
 */

import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class WatermarkRemover {
  constructor() {
    this.inputDir = path.join(
      __dirname,
      "..",
      "public",
      "gallery",
      "optimized"
    );
    this.backupDir = path.join(__dirname, "..", "public", "gallery", "backup");

    // Configuración del recorte
    // La marca de agua típicamente está en la esquina inferior izquierda
    // Vamos a recortar aproximadamente 80px desde abajo y 80px desde la izquierda
    this.cropConfig = {
      left: 0,
      top: 0,
      width: null, // Se calculará dinámicamente (ancho - 80)
      height: null, // Se calculará dinámicamente (alto - 80)
    };

    this.watermarkArea = {
      bottom: 80, // Píxeles desde abajo
      left: 80, // Píxeles desde la izquierda
    };
  }

  async init() {
    // Crear directorio de backup si no existe
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
      console.log(`✓ Creado directorio de backup: ${this.backupDir}`);
    }

    console.log("🎯 Iniciando proceso de eliminación de marca de agua...");
    console.log(`📁 Directorio de entrada: ${this.inputDir}`);
    console.log(`💾 Directorio de backup: ${this.backupDir}`);
    console.log(
      `✂️  Área a recortar: ${this.watermarkArea.left}px izquierda, ${this.watermarkArea.bottom}px inferior`
    );
  }

  async getImageFiles() {
    const files = fs.readdirSync(this.inputDir);

    // Filtrar solo las imágenes de mayor resolución (1280w) en formato JPG
    // para procesar las originales de mejor calidad
    const galleryImages = files.filter(
      (file) => file.includes("-1280w.jpg") && file.startsWith("gallery-")
    );

    console.log(
      `🔍 Encontradas ${galleryImages.length} imágenes de alta resolución para procesar:`
    );
    galleryImages.forEach((img) => console.log(`   - ${img}`));

    return galleryImages;
  }

  async backupImage(filename) {
    const sourcePath = path.join(this.inputDir, filename);
    const backupPath = path.join(this.backupDir, filename);

    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(sourcePath, backupPath);
      console.log(`💾 Backup creado: ${filename}`);
    } else {
      console.log(`⏭️  Backup ya existe: ${filename}`);
    }
  }

  async processImage(filename) {
    const inputPath = path.join(this.inputDir, filename);
    const outputPath = inputPath; // Sobrescribir la imagen original

    try {
      // Obtener metadata de la imagen
      const image = sharp(inputPath);
      const metadata = await image.metadata();

      console.log(
        `📏 Procesando ${filename}: ${metadata.width}x${metadata.height}`
      );

      // Calcular dimensiones del recorte
      const cropWidth = metadata.width - this.watermarkArea.left;
      const cropHeight = metadata.height - this.watermarkArea.bottom;

      // Verificar que las dimensiones sean válidas
      if (cropWidth <= 0 || cropHeight <= 0) {
        console.log(
          `❌ Error: Dimensiones de recorte inválidas para ${filename}`
        );
        return false;
      }

      console.log(
        `✂️  Recortando a ${cropWidth}x${cropHeight} (removiendo ${this.watermarkArea.left}px izq, ${this.watermarkArea.bottom}px inf)`
      );

      // Realizar el recorte
      await image
        .extract({
          left: 0,
          top: 0,
          width: cropWidth,
          height: cropHeight,
        })
        .jpeg({
          quality: 95,
          progressive: true,
          mozjpeg: true,
        })
        .toFile(outputPath + ".temp");

      // Reemplazar la imagen original
      fs.renameSync(outputPath + ".temp", outputPath);

      console.log(`✅ Imagen procesada exitosamente: ${filename}`);
      return true;
    } catch (error) {
      console.error(`❌ Error procesando ${filename}:`, error.message);
      return false;
    }
  }

  async regenerateResponsiveVersions(baseFilename) {
    console.log(`🔄 Regenerando versiones responsivas para ${baseFilename}...`);

    // Obtener el nombre base sin el sufijo -1280w.jpg
    const baseName = baseFilename.replace("-1280w.jpg", "");
    const sourcePath = path.join(this.inputDir, baseFilename);

    const sizes = [
      { width: 320, suffix: "-320w" },
      { width: 640, suffix: "-640w" },
      { width: 768, suffix: "-768w" },
      { width: 1024, suffix: "-1024w" },
    ];

    const formats = ["jpg", "webp", "avif"];

    for (const size of sizes) {
      for (const format of formats) {
        const outputFilename = `${baseName}${size.suffix}.${format}`;
        const outputPath = path.join(this.inputDir, outputFilename);

        try {
          const processor = sharp(sourcePath).resize(size.width, null, {
            withoutEnlargement: true,
            fit: "inside",
          });

          if (format === "webp") {
            await processor.webp({ quality: 85 }).toFile(outputPath);
          } else if (format === "avif") {
            await processor.avif({ quality: 80 }).toFile(outputPath);
          } else if (format === "jpg") {
            await processor
              .jpeg({ quality: 90, progressive: true })
              .toFile(outputPath);
          }

          console.log(`   ✓ Generado: ${outputFilename}`);
        } catch (error) {
          console.error(
            `   ❌ Error generando ${outputFilename}:`,
            error.message
          );
        }
      }
    }
  }

  async processAllImages() {
    const images = await this.getImageFiles();

    if (images.length === 0) {
      console.log("❌ No se encontraron imágenes para procesar");
      return;
    }

    let processed = 0;
    let errors = 0;

    for (const filename of images) {
      console.log(
        `\n🎯 Procesando ${processed + 1}/${images.length}: ${filename}`
      );

      // Crear backup antes de procesar
      await this.backupImage(filename);

      // Procesar la imagen principal
      const success = await this.processImage(filename);

      if (success) {
        // Regenerar todas las versiones responsivas y formatos
        await this.regenerateResponsiveVersions(filename);
        processed++;
      } else {
        errors++;
      }
    }

    console.log(`\n📊 Proceso completado:`);
    console.log(`   ✅ Imágenes procesadas: ${processed}`);
    console.log(`   ❌ Errores: ${errors}`);
    console.log(`   💾 Backups guardados en: ${this.backupDir}`);
  }
}

// Ejecutar el script
async function main() {
  const remover = new WatermarkRemover();

  try {
    await remover.init();
    await remover.processAllImages();

    console.log("\n🎉 Proceso de eliminación de marca de agua completado!");
    console.log(
      "📝 Recuerda probar las imágenes en el sitio web para verificar el resultado."
    );
  } catch (error) {
    console.error("❌ Error fatal:", error);
    process.exit(1);
  }
}

main();
