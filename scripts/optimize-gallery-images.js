#!/usr/bin/env node

/**
 * Script para optimizar las imágenes de la galería desde imgs-google
 * Genera versiones responsive para móvil y desktop
 */

import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de tamaños para la galería
const GALLERY_SIZES = [
  { width: 320, suffix: "-320w", description: "Mobile small" },
  { width: 640, suffix: "-640w", description: "Mobile large" },
  { width: 768, suffix: "-768w", description: "Tablet" },
  { width: 1024, suffix: "-1024w", description: "Desktop" },
  { width: 1280, suffix: "-1280w", description: "Desktop large" },
];

// Formatos de salida
const FORMATS = ["webp", "avif", "jpg"];

class GalleryImageOptimizer {
  constructor() {
    this.inputDir = path.join(__dirname, "..", "imgs-google");
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

  generateCleanFilename(originalName) {
    // Convertir nombres como "Generated Image September 16, 2025 - 11_06PM.png"
    // a nombres limpiños como "gallery-01"
    const match = originalName.match(/(\d{2}_\d{2}PM|(\d{10}))/);
    if (match) {
      if (match[2]) {
        // Para archivos como "1758057512.png"
        return `gallery-${match[2].slice(-2)}`;
      } else {
        // Para archivos como "Generated Image September 16, 2025 - 11_06PM.png"
        const time = match[1].replace(/_/, "").replace("PM", "");
        return `gallery-${time}`;
      }
    }

    // Fallback: usar índice
    return `gallery-${Date.now().toString().slice(-3)}`;
  }

  async processImage(inputPath, index) {
    const originalName = path.basename(inputPath, path.extname(inputPath));
    const cleanFilename = `gallery-${String(index + 1).padStart(2, "0")}`;

    console.log(`Procesando: ${originalName} -> ${cleanFilename}`);

    for (const format of FORMATS) {
      for (const size of GALLERY_SIZES) {
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

    const files = fs.readdirSync(this.inputDir);
    const imageFiles = files
      .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .sort(); // Ordenar para consistencia

    console.log(
      `Encontradas ${imageFiles.length} imágenes para procesar en la galería`
    );
    console.log("Archivos:", imageFiles);

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const inputPath = path.join(this.inputDir, file);
      await this.processImage(inputPath, i);
      console.log(""); // Línea en blanco para claridad
    }

    console.log("✅ Procesamiento de galería completado");
    console.log(`📁 Archivos generados en: ${this.outputDir}`);

    // Generar lista de imágenes para el componente
    this.generateImageList(imageFiles.length);
  }

  generateImageList(count) {
    const imageList = [];

    for (let i = 1; i <= count; i++) {
      const baseName = `gallery-${String(i).padStart(2, "0")}`;
      imageList.push({
        baseName: `/gallery/optimized/${baseName}`,
        alt: `Imagen de galería ${i} - Mudanzas ANDY`,
        caption: `Imagen ${i}`, // Puedes personalizar esto después
      });
    }

    // Guardar la lista como JSON para referencia
    const listPath = path.join(this.outputDir, "gallery-images.json");
    fs.writeFileSync(listPath, JSON.stringify(imageList, null, 2));
    console.log(`📝 Lista de imágenes guardada en: ${listPath}`);

    return imageList;
  }

  generateSrcSet(baseName, format = "webp") {
    return GALLERY_SIZES.map(
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

// Ejecutar el script
console.log("🚀 Iniciando optimización de imágenes de galería...");

const optimizer = new GalleryImageOptimizer();

optimizer.processAllImages().catch((error) => {
  console.error("❌ Error procesando imágenes:", error);
  process.exit(1);
});

export default GalleryImageOptimizer;
