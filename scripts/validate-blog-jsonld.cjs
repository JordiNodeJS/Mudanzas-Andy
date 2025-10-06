/**
 * Valida el JSON-LD de la página del blog
 * Este script se ejecuta después del build para verificar la sintaxis correcta
 */

const fs = require("fs");
const path = require("path");

// Función para validar JSON-LD
function validateJSONLD(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    console.log("✅ JSON válido");
    console.log("Estructura:", JSON.stringify(parsed, null, 2));
    return { valid: true, data: parsed };
  } catch (error) {
    console.error("❌ Error de parseo JSON:");
    console.error(error.message);
    return { valid: false, error: error.message };
  }
}

// Función para extraer JSON-LD de HTML
function extractJSONLD(html) {
  const regex =
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const matches = [];
  let match;

  while ((match = regex.exec(html)) !== null) {
    matches.push(match[1].trim());
  }

  return matches;
}

// Validar archivo específico del blog
const blogPath = path.resolve(__dirname, "../dist/blog-astro.html");

if (!fs.existsSync(blogPath)) {
  console.error("❌ Archivo no encontrado:", blogPath);
  console.log("💡 Ejecuta 'pnpm build' primero");
  process.exit(1);
}

console.log("📄 Validando:", blogPath);
console.log("");

const html = fs.readFileSync(blogPath, "utf8");
const jsonLDBlocks = extractJSONLD(html);

if (jsonLDBlocks.length === 0) {
  console.error("❌ No se encontraron bloques JSON-LD en el HTML");
  process.exit(1);
}

console.log(`✅ Encontrados ${jsonLDBlocks.length} bloques JSON-LD\n`);

let allValid = true;
jsonLDBlocks.forEach((block, index) => {
  console.log(`\n=== Bloque ${index + 1} ===`);
  console.log("Preview:", block.substring(0, 100) + "...\n");

  const result = validateJSONLD(block);
  if (!result.valid) {
    allValid = false;
  }

  console.log("─".repeat(60));
});

if (allValid) {
  console.log("\n✅ Todos los bloques JSON-LD son válidos");
  console.log("🎉 Listo para Search Console");
  process.exit(0);
} else {
  console.log("\n❌ Se encontraron errores en JSON-LD");
  console.log("🔧 Revisa los bloques marcados arriba");
  process.exit(1);
}
