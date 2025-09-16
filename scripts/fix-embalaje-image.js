#!/usr/bin/env node

/**
 * Script para descargar solo la imagen de embalaje que falló
 */

import { downloadImage, BLOG_IMAGES } from "./download-real-blog-images.js";

async function downloadEmbalaje() {
  console.log("🎯 Descargando imagen de embalaje con URL corregida...\n");

  const result = await downloadImage(
    BLOG_IMAGES["embalaje-profesional-hero.webp"].url,
    "embalaje-profesional-hero.webp"
  );

  if (result.success) {
    console.log("\n🎉 ¡Imagen de embalaje descargada exitosamente!");
    console.log("   Ahora todos los artículos tendrán imágenes únicas");
  } else {
    console.error("\n❌ Error descargando imagen de embalaje:", result.error);
  }

  return result;
}

downloadEmbalaje();
