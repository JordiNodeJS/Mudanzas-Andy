import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

// Leer la lista de imágenes no utilizadas
const unusedImagesFile = path.join(projectRoot, "unused-images.json");
const unusedData = JSON.parse(fs.readFileSync(unusedImagesFile, "utf8"));

console.log(
  `🚚 Moviendo ${unusedData.total} imágenes no utilizadas a img-store...\n`
);

// Crear carpeta img-store si no existe
const imgStoreDir = path.join(projectRoot, "img-store");
if (!fs.existsSync(imgStoreDir)) {
  fs.mkdirSync(imgStoreDir, { recursive: true });
  console.log("📁 Creada carpeta img-store");
}

// Función para crear directorios recursivamente
function ensureDirectoryExists(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Mover cada imagen
let movedCount = 0;
let skippedCount = 0;
const movedImages = [];
const skippedImages = [];

for (const imagePath of unusedData.images) {
  const sourcePath = path.join(projectRoot, "public", imagePath.substring(1)); // Remover el / inicial
  const destinationPath = path.join(imgStoreDir, imagePath.substring(1));

  try {
    if (fs.existsSync(sourcePath)) {
      // Crear directorio de destino si no existe
      ensureDirectoryExists(destinationPath);

      // Mover archivo
      fs.renameSync(sourcePath, destinationPath);
      movedImages.push(imagePath);
      movedCount++;
      console.log(`✅ Movido: ${imagePath}`);
    } else {
      skippedImages.push(imagePath);
      skippedCount++;
      console.log(`⚠️  No encontrado: ${imagePath}`);
    }
  } catch (error) {
    skippedImages.push(imagePath);
    skippedCount++;
    console.error(`❌ Error moviendo ${imagePath}:`, error.message);
  }
}

console.log(`\n📊 RESUMEN:`);
console.log(`✅ Imágenes movidas: ${movedCount}`);
console.log(`⚠️  Imágenes omitidas: ${skippedCount}`);

// Limpiar directorios vacíos en public
function removeEmptyDirectories(dir) {
  if (!fs.existsSync(dir)) return;

  const entries = fs.readdirSync(dir);

  // Remover subdirectorios vacíos primero
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    if (fs.statSync(fullPath).isDirectory()) {
      removeEmptyDirectories(fullPath);
    }
  }

  // Verificar si el directorio está vacío ahora
  const remainingEntries = fs.readdirSync(dir);
  if (
    remainingEntries.length === 0 &&
    dir !== path.join(projectRoot, "public")
  ) {
    fs.rmdirSync(dir);
    console.log(
      `🗑️  Eliminado directorio vacío: ${path.relative(projectRoot, dir)}`
    );
  }
}

console.log(`\n🧹 Limpiando directorios vacíos...`);
removeEmptyDirectories(path.join(projectRoot, "public", "camion"));
removeEmptyDirectories(path.join(projectRoot, "public", "logos"));
removeEmptyDirectories(path.join(projectRoot, "public", "favicons"));

// Guardar reporte de la operación
const moveReport = {
  moved_at: new Date().toISOString(),
  total_analyzed: unusedData.total,
  successfully_moved: movedCount,
  skipped: skippedCount,
  moved_images: movedImages,
  skipped_images: skippedImages,
};

fs.writeFileSync(
  path.join(projectRoot, "img-store", "move-report.json"),
  JSON.stringify(moveReport, null, 2)
);

console.log(`\n📝 Reporte guardado en img-store/move-report.json`);
console.log(
  `\n🎉 ¡Operación completada! Las imágenes no utilizadas han sido movidas a img-store.`
);
