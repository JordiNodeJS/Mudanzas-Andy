import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

// Función para buscar todas las imágenes en public
function getAllImagesInPublic() {
  const publicDir = path.join(projectRoot, "public");
  const images = [];

  function searchDirectory(dir, relativePath = "") {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativeFilePath = path
        .join(relativePath, entry.name)
        .replace(/\\/g, "/");

      if (entry.isDirectory()) {
        searchDirectory(fullPath, relativeFilePath);
      } else if (
        entry.isFile() &&
        /\.(jpg|jpeg|png|webp|avif|svg)$/i.test(entry.name)
      ) {
        images.push("/" + relativeFilePath);
      }
    }
  }

  searchDirectory(publicDir);
  return images;
}

// Función para buscar referencias de imágenes en el código
function getUsedImages() {
  const srcDir = path.join(projectRoot, "src");
  const usedImages = new Set();

  function searchInFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, "utf8");

      // Buscar patrones de imágenes
      const patterns = [
        /(?:src|href|image)=["']([^"']*\.(?:jpg|jpeg|png|webp|avif|svg))["']/gi,
        /(?:src|href|image):\s*["']([^"']*\.(?:jpg|jpeg|png|webp|avif|svg))["']/gi,
        /(?:image|logo):\s*new\s+URL\(["']([^"']*\.(?:jpg|jpeg|png|webp|avif|svg))["']/gi,
        /\/[a-zA-Z0-9\-_\/]*\.(?:jpg|jpeg|png|webp|avif|svg)/g,
      ];

      patterns.forEach((pattern) => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          const imagePath = match[1] || match[0];
          if (imagePath.startsWith("/")) {
            usedImages.add(imagePath);
          }
        }
      });
    } catch (error) {
      console.warn(`Error reading file ${filePath}:`, error.message);
    }
  }

  function searchDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        searchDirectory(fullPath);
      } else if (
        entry.isFile() &&
        /\.(astro|js|ts|jsx|tsx|md|mdx)$/i.test(entry.name)
      ) {
        searchInFile(fullPath);
      }
    }
  }

  searchDirectory(srcDir);
  return Array.from(usedImages);
}

// Ejecutar análisis
console.log("🔍 Analizando imágenes en public vs uso en código...\n");

const allImages = getAllImagesInPublic();
const usedImages = getUsedImages();

// Normalizar rutas para comparación
const normalizedUsedImages = usedImages.map((img) => img.replace(/\\/g, "/"));

console.log("📊 RESUMEN:");
console.log(`Total de imágenes en public: ${allImages.length}`);
console.log(
  `Total de imágenes referenciadas en código: ${normalizedUsedImages.length}`
);

console.log("\n✅ IMÁGENES UTILIZADAS:");
const usedInPublic = allImages.filter((img) =>
  normalizedUsedImages.some(
    (used) => used === img || used.includes(img.split("/").pop())
  )
);
usedInPublic.sort().forEach((img) => console.log(`  ${img}`));

console.log("\n❌ IMÁGENES NO UTILIZADAS:");
const unusedImages = allImages.filter(
  (img) =>
    !normalizedUsedImages.some(
      (used) => used === img || used.includes(img.split("/").pop())
    )
);

if (unusedImages.length === 0) {
  console.log("  ¡Todas las imágenes están siendo utilizadas!");
} else {
  unusedImages.sort().forEach((img) => console.log(`  ${img}`));

  console.log(`\n📝 Total de imágenes no utilizadas: ${unusedImages.length}`);
  console.log("\n💾 Guardando lista de imágenes no utilizadas...");

  // Guardar la lista en un archivo JSON
  fs.writeFileSync(
    path.join(projectRoot, "unused-images.json"),
    JSON.stringify(
      {
        total: unusedImages.length,
        images: unusedImages,
        analyzed_at: new Date().toISOString(),
      },
      null,
      2
    )
  );

  console.log("✅ Lista guardada en unused-images.json");
}

console.log("\n🔍 REFERENCIAS ENCONTRADAS EN CÓDIGO:");
normalizedUsedImages.sort().forEach((ref) => console.log(`  ${ref}`));
