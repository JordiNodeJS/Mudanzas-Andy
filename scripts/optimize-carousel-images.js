#!/usr/bin/env node

/**
 * Script para optimizar las imágenes del carrusel desde "Galería de Proyectos"
 * Genera versiones responsive para móvil, tablet y desktop con sufijo "carrusel"
 */

import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de tamaños para el carrusel
const CAROUSEL_SIZES = [
  { width: 320, suffix: "-320w", description: "Mobile small" },
  { width: 640, suffix: "-640w", description: "Mobile large" },
  { width: 768, suffix: "-768w", description: "Tablet" },
  { width: 1024, suffix: "-1024w", description: "Desktop" },
  { width: 1280, suffix: "-1280w", description: "Desktop large" },
  { width: 1920, suffix: "-1920w", description: "Desktop XL" },
];

// Formatos de salida
const FORMATS = ["webp", "avif", "jpg"];

class CarouselImageOptimizer {
  constructor() {
    this.inputDir = path.join(__dirname, "..", "public", "Galería de Proyectos");
    this.outputDir = path.join(
      __dirname,
      "..",
      "public",
      "gallery",
      "optimized"
    );
  }

  async ensureOutputDir() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
      console.log(`✓ Creada carpeta de salida: ${this.outputDir}`);
    }
  }

  async processImage(inputPath, index) {
    const originalName = path.basename(inputPath, path.extname(inputPath));
    // Extraer el número del nombre original (ej: "01-gallery.jpg" -> "01")
    const match = originalName.match(/^(\d+)-gallery/);
    const imageNumber = match ? match[1] : String(index + 1).padStart(2, "0");
    
    const cleanFilename = `carrusel-${imageNumber}`;

    console.log(`Procesando: ${originalName} -> ${cleanFilename}`);

    for (const format of FORMATS) {
      for (const size of CAROUSEL_SIZES) {
        const outputPath = path.join(
          this.outputDir,
          `${cleanFilename}${size.suffix}.${format}`
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

          console.log(
            `  ✓ ${size.description} (${size.width}w): ${path.basename(
              outputPath
            )}`
          );
        } catch (error) {
          console.error(`  ✗ Error procesando ${outputPath}:`, error.message);
        }
      }
    }
  }

  async processAllImages() {
    await this.ensureOutputDir();

    if (!fs.existsSync(this.inputDir)) {
      console.error(`❌ No se encontró el directorio: ${this.inputDir}`);
      process.exit(1);
    }

    const files = fs.readdirSync(this.inputDir);
    const imageFiles = files
      .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .sort(); // Ordenar para consistencia

    console.log(
      `Encontradas ${imageFiles.length} imágenes para procesar en el carrusel`
    );
    console.log("Archivos:", imageFiles);

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const inputPath = path.join(this.inputDir, file);
      await this.processImage(inputPath, i);
      console.log(""); // Línea en blanco para claridad
    }

    console.log("✅ Procesamiento del carrusel completado");
    console.log(`📁 Archivos generados en: ${this.outputDir}`);

    // Generar lista de imágenes para el componente
    this.generateImageList(imageFiles);
  }

  generateImageList(imageFiles) {
    const imageList = [];

    imageFiles.forEach((file, index) => {
      const originalName = path.basename(file, path.extname(file));
      const match = originalName.match(/^(\d+)-gallery/);
      const imageNumber = match ? match[1] : String(index + 1).padStart(2, "0");
      
      const baseName = `carrusel-${imageNumber}`;
      imageList.push({
        baseName: `/gallery/optimized/${baseName}`,
        alt: `Proyecto de mudanza ${imageNumber} - Mudanzas ANDY Barcelona`,
        caption: `Proyecto ${imageNumber}`,
      });
    });

    // Guardar la lista como JSON para referencia
    const listPath = path.join(this.outputDir, "carousel-images.json");
    fs.writeFileSync(listPath, JSON.stringify(imageList, null, 2));
    console.log(`📝 Lista de imágenes del carrusel guardada en: ${listPath}`);

    return imageList;
  }
}

// Ejecutar el script
console.log("🚀 Iniciando optimización de imágenes del carrusel...");

const optimizer = new CarouselImageOptimizer();

optimizer.processAllImages().catch((error) => {
  console.error("❌ Error procesando imágenes:", error);
  process.exit(1);
});

export default CarouselImageOptimizer;

