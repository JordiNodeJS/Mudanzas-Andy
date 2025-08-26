import sharp from "sharp";
import fs from "fs";
import path from "path";

const inputDir = "./public/camion";
const outputDir = "./public/camion/optimized";

// Asegurar que existe el directorio de salida
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function optimizeImages() {
  try {
    // Optimizar hero-fondo.jpg específicamente (el mayor problema)
    console.log("Optimizando hero-fondo.jpg...");
    await sharp(path.join(inputDir, "hero-fondo.jpg"))
      .resize(1920, 1080, {
        fit: "cover",
        position: "center",
      })
      .jpeg({
        quality: 75,
        progressive: true,
        mozjpeg: true,
      })
      .toFile(path.join(outputDir, "hero-fondo.jpg"));

    // Generar versión WebP
    await sharp(path.join(inputDir, "hero-fondo.jpg"))
      .resize(1920, 1080, {
        fit: "cover",
        position: "center",
      })
      .webp({
        quality: 80,
        effort: 6,
      })
      .toFile(path.join(outputDir, "hero-fondo.webp"));

    // Generar versión AVIF (más moderna)
    await sharp(path.join(inputDir, "hero-fondo.jpg"))
      .resize(1920, 1080, {
        fit: "cover",
        position: "center",
      })
      .avif({
        quality: 75,
        effort: 9,
      })
      .toFile(path.join(outputDir, "hero-fondo.avif"));

    // Optimizar otras imágenes
    const files = fs
      .readdirSync(inputDir)
      .filter((file) => file.endsWith(".jpg") && file !== "hero-fondo.jpg");

    for (const file of files) {
      console.log(`Optimizando ${file}...`);

      // Versión JPEG optimizada
      await sharp(path.join(inputDir, file))
        .jpeg({
          quality: 80,
          progressive: true,
        })
        .toFile(path.join(outputDir, file));

      // Versión WebP
      const webpName = file.replace(".jpg", ".webp");
      await sharp(path.join(inputDir, file))
        .webp({
          quality: 85,
          effort: 6,
        })
        .toFile(path.join(outputDir, webpName));
    }

    console.log("✅ Optimización de imágenes completada");

    // Mostrar estadísticas de tamaño
    const originalSize = fs.statSync(
      path.join(inputDir, "hero-fondo.jpg")
    ).size;
    const optimizedSize = fs.statSync(
      path.join(outputDir, "hero-fondo.jpg")
    ).size;
    const webpSize = fs.statSync(path.join(outputDir, "hero-fondo.webp")).size;
    const avifSize = fs.statSync(path.join(outputDir, "hero-fondo.avif")).size;

    console.log("\n📊 Resultados de optimización:");
    console.log(`Original: ${Math.round(originalSize / 1024)}KB`);
    console.log(
      `JPEG optimizado: ${Math.round(optimizedSize / 1024)}KB (${Math.round(
        ((originalSize - optimizedSize) / originalSize) * 100
      )}% reducción)`
    );
    console.log(
      `WebP: ${Math.round(webpSize / 1024)}KB (${Math.round(
        ((originalSize - webpSize) / originalSize) * 100
      )}% reducción)`
    );
    console.log(
      `AVIF: ${Math.round(avifSize / 1024)}KB (${Math.round(
        ((originalSize - avifSize) / originalSize) * 100
      )}% reducción)`
    );
  } catch (error) {
    console.error("Error optimizando imágenes:", error);
  }
}

optimizeImages();
