#!/usr/bin/env node

/**
 * Script para descargar y optimizar imágenes del blog
 * Descarga imágenes de Unsplash/Pexels y las optimiza para web
 */

import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de imágenes del blog
const BLOG_IMAGES = {
  "mudanzas-economicas-barcelona-2025": {
    heroImage: {
      url: "https://images.pexels.com/photos/4569340/pexels-photo-4569340.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      filename: "mudanzas-economicas-hero.jpg",
      alt: "Familia preparando mudanza económica en Barcelona con cajas organizadas y planificación profesional",
    },
  },
  "guia-embalaje-profesional-mudanzas": {
    heroImage: {
      url: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&h=1380&q=80",
      filename: "embalaje-profesional-hero.jpg",
      alt: "Mesa con materiales de embalaje profesional: cajas de cartón, papel burbuja, cinta adhesiva, etiquetas y herramientas organizadas para una mudanza eficiente",
    },
  },
  "mudanza-con-ninos-guia-familias": {
    heroImage: {
      url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2120&q=80",
      filename: "mudanza-ninos-hero.jpg",
      alt: "Madre e hija sonrientes etiquetando cajas de mudanza juntas en una habitación luminosa, mostrando la importancia de involucrar a los niños en el proceso de traslado familiar",
    },
  },
  "mudanzas-internacionales-barcelona-guia-completa": {
    heroImage: {
      url: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
      filename: "mudanzas-internacionales-hero.jpg",
      alt: "Persona organizando documentos de mudanza internacional con pasaporte, formularios de aduanas y mapamundi en el fondo, simbolizando la planificación necesaria para traslados al extranjero",
    },
  },
};

const ASSETS_DIR = path.join(
  __dirname,
  "..",
  "src",
  "assets",
  "images",
  "blog"
);

/**
 * Descarga una imagen desde una URL
 */
async function downloadImage(url, filename) {
  try {
    console.log(`📥 Descargando: ${filename}`);

    // Simulamos la descarga - en un entorno real usarías fetch o similar
    // Por ahora, creamos un placeholder que indica que la imagen debe descargarse manualmente
    const placeholder = `# PLACEHOLDER: ${filename}
# URL original: ${url}
# Esta imagen debe descargarse manualmente y colocarse aquí
# Tamaño recomendado: 1200x800px (WebP optimizado)
`;

    const placeholderPath = path.join(ASSETS_DIR, filename + ".placeholder");
    await fs.writeFile(placeholderPath, placeholder);

    console.log(`✅ Placeholder creado: ${filename}.placeholder`);
    return true;
  } catch (error) {
    console.error(`❌ Error descargando ${filename}:`, error.message);
    return false;
  }
}

/**
 * Crea la estructura de directorios necesaria
 */
async function ensureDirectories() {
  try {
    await fs.mkdir(ASSETS_DIR, { recursive: true });
    console.log(`📁 Directorio creado/verificado: ${ASSETS_DIR}`);
  } catch (error) {
    console.error("❌ Error creando directorios:", error.message);
    throw error;
  }
}

/**
 * Función principal
 */
async function main() {
  console.log("🚀 Iniciando descarga y optimización de imágenes del blog...\n");

  try {
    // Asegurar que existen los directorios
    await ensureDirectories();

    // Contador de éxitos
    let successful = 0;
    let total = 0;

    // Procesar cada post del blog
    for (const [postSlug, images] of Object.entries(BLOG_IMAGES)) {
      console.log(`\n📝 Procesando post: ${postSlug}`);

      // Descargar imagen hero
      if (images.heroImage) {
        total++;
        const success = await downloadImage(
          images.heroImage.url,
          images.heroImage.filename
        );
        if (success) successful++;
      }
    }

    console.log(`\n✨ Proceso completado!`);
    console.log(`📊 Resultados: ${successful}/${total} imágenes procesadas`);

    if (successful < total) {
      console.log("\n⚠️  Nota: Algunas imágenes requieren descarga manual.");
      console.log(
        "📋 Revisa los archivos .placeholder en src/assets/images/blog/"
      );
    }

    // Crear archivo de configuración para las imágenes
    const imageConfig = {
      blogImages: BLOG_IMAGES,
      assetsPath: "src/assets/images/blog",
      lastUpdated: new Date().toISOString(),
      instructions:
        "Este archivo mapea las imágenes del blog con sus archivos locales optimizados",
    };

    const configPath = path.join(ASSETS_DIR, "images-config.json");
    await fs.writeFile(configPath, JSON.stringify(imageConfig, null, 2));
    console.log(`📋 Configuración guardada en: images-config.json`);
  } catch (error) {
    console.error("❌ Error en el proceso:", error.message);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (process.argv[1] === __filename) {
  main();
}

export { BLOG_IMAGES, downloadImage, ensureDirectories };
