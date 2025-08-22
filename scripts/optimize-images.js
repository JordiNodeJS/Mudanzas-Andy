#!/usr/bin/env node

/**
 * Script para generar imágenes optimizadas en múltiples resoluciones
 * Este script sería útil para un flujo de trabajo real con herramientas como Sharp
 */

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// Configuración de tamaños responsivos
const SIZES = [
  { width: 320, suffix: "-320w" },
  { width: 640, suffix: "-640w" },
  { width: 768, suffix: "-768w" },
  { width: 1024, suffix: "-1024w" },
  { width: 1280, suffix: "-1280w" },
  { width: 1536, suffix: "-1536w" },
];

// Formatos de salida
const FORMATS = ["webp", "avif", "jpg"];

class ImageOptimizer {
  constructor(inputDir = "public/camion", outputDir = "public/optimized") {
    this.inputDir = inputDir;
    this.outputDir = outputDir;
  }

  async ensureOutputDir() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async processImage(inputPath) {
    const filename = path.basename(inputPath, path.extname(inputPath));
    const extension = path.extname(inputPath);

    console.log(`Procesando: ${filename}${extension}`);

    for (const format of FORMATS) {
      for (const size of SIZES) {
        const outputPath = path.join(
          this.outputDir,
          `${filename}${size.suffix}.${format}`
        );

        try {
          await sharp(inputPath)
            .resize(size.width, null, {
              withoutEnlargement: true,
              fastShrinkOnLoad: false,
            })
            .toFormat(format, {
              quality: format === "jpg" ? 85 : 80,
              progressive: true,
              mozjpeg: format === "jpg",
            })
            .toFile(outputPath);

          console.log(`✓ Generado: ${outputPath}`);
        } catch (error) {
          console.error(`✗ Error procesando ${outputPath}:`, error.message);
        }
      }
    }
  }

  async processAllImages() {
    await this.ensureOutputDir();

    const files = fs.readdirSync(this.inputDir);
    const imageFiles = files.filter((file) =>
      /\.(jpg|jpeg|png|webp)$/i.test(file)
    );

    console.log(`Encontradas ${imageFiles.length} imágenes para procesar`);

    for (const file of imageFiles) {
      const inputPath = path.join(this.inputDir, file);
      await this.processImage(inputPath);
    }

    console.log("✅ Procesamiento completado");
  }

  generateSrcSet(baseName, format = "webp") {
    return SIZES.map(
      (size) => `${baseName}${size.suffix}.${format} ${size.width}w`
    ).join(", ");
  }

  generatePictureElement(baseName, alt, className = "") {
    return `
<picture class="${className}">
  <source 
    srcset="${this.generateSrcSet(baseName, "avif")}"
    type="image/avif"
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  />
  <source 
    srcset="${this.generateSrcSet(baseName, "webp")}"
    type="image/webp"
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  />
  <img
    src="${baseName}-640w.jpg"
    srcset="${this.generateSrcSet(baseName, "jpg")}"
    alt="${alt}"
    loading="lazy"
    decoding="async"
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    class="w-full h-full object-cover"
  />
</picture>`.trim();
  }
}

// Uso del script
if (require.main === module) {
  const optimizer = new ImageOptimizer();

  // Procesar todas las imágenes
  // optimizer.processAllImages();

  // Ejemplo de uso para generar HTML
  console.log("Ejemplo de elemento picture generado:");
  console.log(
    optimizer.generatePictureElement(
      "/optimized/camion-frontal",
      "Camión de mudanzas frontal"
    )
  );
}

module.exports = ImageOptimizer;
