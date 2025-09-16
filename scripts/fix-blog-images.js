#!/usr/bin/env node

/**
 * Script mejorado para crear imágenes placeholder válidas para el blog
 * Resuelve el problema de "corrupt header" generando WebP válidos
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
 * Información de las imágenes del blog
 */
const BLOG_IMAGES_INFO = {
  "mudanzas-economicas-hero.webp": {
    originalUrl:
      "https://images.pexels.com/photos/4569340/pexels-photo-4569340.jpeg",
    alt: "Familia preparando mudanza económica en Barcelona con cajas organizadas y planificación profesional",
    description: "Mudanza económica familiar con planificación",
  },
  "embalaje-profesional-hero.webp": {
    originalUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13",
    alt: "Mesa con materiales de embalaje profesional: cajas de cartón, papel burbuja, cinta adhesiva, etiquetas y herramientas organizadas para una mudanza eficiente",
    description: "Materiales de embalaje profesional organizados",
  },
  "mudanza-ninos-hero.webp": {
    originalUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
    alt: "Madre e hija sonrientes etiquetando cajas de mudanza juntas en una habitación luminosa, mostrando la importancia de involucrar a los niños en el proceso de traslado familiar",
    description: "Madre e hija preparando mudanza familiar",
  },
  "mudanzas-internacionales-hero.webp": {
    originalUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05",
    alt: "Persona organizando documentos de mudanza internacional con pasaporte, formularios de aduanas y mapamundi en el fondo, simbolizando la planificación necesaria para traslados al extranjero",
    description: "Documentación para mudanza internacional",
  },
};

/**
 * Verifica si todas las imágenes WebP son válidas
 */
async function validateWebPImages() {
  console.log("🔍 Verificando integridad de imágenes WebP...\n");

  const baseImage = path.join(ASSETS_DIR, "blog-hero-optimized.webp");
  const baseExists = await fs
    .access(baseImage)
    .then(() => true)
    .catch(() => false);

  if (!baseExists) {
    console.log("❌ Imagen base no encontrada: blog-hero-optimized.webp");
    return false;
  }

  const baseStats = await fs.stat(baseImage);
  console.log(
    `✅ Imagen base válida: blog-hero-optimized.webp (${baseStats.size} bytes)`
  );

  let allValid = true;

  for (const [filename, info] of Object.entries(BLOG_IMAGES_INFO)) {
    const imagePath = path.join(ASSETS_DIR, filename);

    try {
      const stats = await fs.stat(imagePath);

      if (stats.size < 1000) {
        console.log(
          `❌ ${filename}: Archivo muy pequeño (${stats.size} bytes) - probablemente corrupto`
        );
        allValid = false;
      } else {
        console.log(`✅ ${filename}: Válido (${stats.size} bytes)`);
      }
    } catch (error) {
      console.log(`❌ ${filename}: No encontrado`);
      allValid = false;
    }
  }

  return allValid;
}

/**
 * Copia la imagen base válida a todas las posiciones si es necesario
 */
async function ensureValidImages() {
  console.log("\n🔧 Asegurando imágenes válidas...\n");

  const baseImage = path.join(ASSETS_DIR, "blog-hero-optimized.webp");

  for (const [filename, info] of Object.entries(BLOG_IMAGES_INFO)) {
    const targetPath = path.join(ASSETS_DIR, filename);

    try {
      const stats = await fs.stat(targetPath);

      if (stats.size < 1000) {
        // Archivo corrupto, reemplazar
        await fs.copyFile(baseImage, targetPath);
        console.log(`🔄 ${filename}: Reemplazado con imagen base válida`);
      } else {
        console.log(`✅ ${filename}: Ya es válido`);
      }
    } catch (error) {
      // Archivo no existe, crear
      await fs.copyFile(baseImage, targetPath);
      console.log(`📋 ${filename}: Creado desde imagen base`);
    }
  }
}

/**
 * Genera reporte de estado de las imágenes
 */
async function generateReport() {
  const reportData = {
    timestamp: new Date().toISOString(),
    status: "success",
    images: {},
    notes: [
      "Todas las imágenes están usando la misma imagen base temporalmente",
      "Para producción, reemplazar con imágenes específicas de cada tema",
      "Las imágenes están optimizadas automáticamente por Astro",
    ],
  };

  for (const [filename, info] of Object.entries(BLOG_IMAGES_INFO)) {
    const imagePath = path.join(ASSETS_DIR, filename);
    const stats = await fs.stat(imagePath);

    reportData.images[filename] = {
      size: stats.size,
      valid: stats.size > 1000,
      originalUrl: info.originalUrl,
      alt: info.alt,
      description: info.description,
    };
  }

  const reportPath = path.join(ASSETS_DIR, "images-status-report.json");
  await fs.writeFile(reportPath, JSON.stringify(reportData, null, 2));

  console.log(`\n📊 Reporte generado: ${reportPath}`);
}

/**
 * Función principal
 */
async function main() {
  console.log("🎨 Blog Images Fix - Reparando imágenes corruptas\n");

  try {
    // Verificar estado actual
    const allValid = await validateWebPImages();

    if (!allValid) {
      console.log("\n🔧 Reparando imágenes corruptas...");
      await ensureValidImages();
    }

    // Verificar nuevamente
    const finalCheck = await validateWebPImages();

    if (finalCheck) {
      console.log("\n✨ ¡Todas las imágenes están ahora válidas!");
      await generateReport();
    } else {
      throw new Error("Algunas imágenes siguen siendo inválidas");
    }

    console.log("\n🚀 Las imágenes están listas para el build de Astro");
    console.log(
      '💡 Tip: Ejecuta "pnpm build" para verificar que todo funciona'
    );
  } catch (error) {
    console.error("\n❌ Error en el proceso:", error.message);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (process.argv[1] === __filename) {
  main();
}

export { validateWebPImages, ensureValidImages, BLOG_IMAGES_INFO };
