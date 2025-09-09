import fs from "fs";
import path from "path";

const projectRoot = process.cwd();
const imgStoreDir = path.join(projectRoot, "img-store");
const publicDir = path.join(projectRoot, "public");

// Lista de archivos AVIF que realmente se necesitan (usados por OptimizedPicture)
const neededAvifFiles = [
  "camion/optimized/hero-fondo.avif",
  "camion/optimized/moving-truck-01.avif",
  "camion/optimized/moving-truck-cutout-01.avif",
  "camion/optimized/moving-truck-cutout-02.avif",
];

console.log("🔄 Restaurando archivos AVIF necesarios...\n");

let restoredCount = 0;

for (const relativePath of neededAvifFiles) {
  const sourcePath = path.join(imgStoreDir, relativePath);
  const destinationPath = path.join(publicDir, relativePath);

  try {
    if (fs.existsSync(sourcePath)) {
      // Crear directorio si no existe
      const destDir = path.dirname(destinationPath);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      // Copiar archivo
      fs.copyFileSync(sourcePath, destinationPath);
      console.log(`✅ Restaurado: ${relativePath}`);
      restoredCount++;
    } else {
      console.log(`⚠️  No encontrado: ${relativePath}`);
    }
  } catch (error) {
    console.error(`❌ Error restaurando ${relativePath}:`, error.message);
  }
}

console.log(`\n📊 Resumen: ${restoredCount} archivos AVIF restaurados`);
console.log(
  "\n🎯 Solo se restauraron los archivos AVIF realmente necesarios para el funcionamiento."
);
