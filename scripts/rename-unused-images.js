#!/usr/bin/env node

import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync, renameSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

// Lista de imágenes no utilizadas identificadas en el análisis
const unusedImages = [
  // Imágenes en /public/camion/
  "public/camion/1756127633.png",
  "public/camion/camion-nocturno.jpg",
  "public/camion/camion-trasera.jpg",
  "public/camion/cargando-flete.jpg",
  "public/camion/estacionado-lateral.jpg",
  "public/camion/interior-caja.jpg",
  "public/camion/promocional-collage-2.jpg",

  // Imágenes en /public/camion/ai/
  "public/camion/ai/1756126750.png",
  "public/camion/ai/1756126979.png",
  "public/camion/ai/camion-01.png",
  "public/camion/ai/camion-frontal.png",
  "public/camion/ai/camion-interior.png",

  // Imágenes en /public/camion/resized/ (incluyendo las que tienen espacios en el nombre)
  "public/camion/resized/moving- truck-02.jpg",
  "public/camion/resized/moving- truck-03.jpg",
  "public/camion/resized/moving- truck-04.jpg",
  "public/camion/resized/moving-truck-05.jpg",

  // Imágenes en /public/logos/
  "public/logos/1015831095_hostinger_ai_84e8905d.png",
  "public/logos/1015831095_hostinger_ai_d40664b6.png",
  "public/logos/logo-camion-mudanzas.png",

  // Imágenes en /src/assets/
  "src/assets/astro.svg",
  "src/assets/background.svg",
];

function renameUnusedImages() {
  console.log("🔍 Iniciando renombrado de imágenes no utilizadas...\n");

  let renamedCount = 0;
  let notFoundCount = 0;

  unusedImages.forEach((imagePath) => {
    const fullPath = join(projectRoot, imagePath);

    if (existsSync(fullPath)) {
      // Extraer la extensión y el nombre del archivo
      const pathParts = imagePath.split("/");
      const fileName = pathParts.pop();
      const directory = pathParts.join("/");

      // Crear el nuevo nombre con prefijo "no-"
      const newFileName = `no-${fileName}`;
      const newPath = join(projectRoot, directory, newFileName);

      try {
        renameSync(fullPath, newPath);
        console.log(
          `✅ Renombrado: ${imagePath} → ${directory}/${newFileName}`
        );
        renamedCount++;
      } catch (error) {
        console.error(`❌ Error renombrando ${imagePath}: ${error.message}`);
      }
    } else {
      console.log(`⚠️  No encontrado: ${imagePath}`);
      notFoundCount++;
    }
  });

  console.log(`\n📊 Resumen:`);
  console.log(`   ✅ Imágenes renombradas: ${renamedCount}`);
  console.log(`   ⚠️  Imágenes no encontradas: ${notFoundCount}`);
  console.log(`   📁 Total procesadas: ${unusedImages.length}`);

  if (renamedCount > 0) {
    console.log(
      `\n🎉 ¡Renombrado completado! Todas las imágenes no utilizadas ahora tienen el prefijo "no-"`
    );
  }
}

// Ejecutar el script
renameUnusedImages();
