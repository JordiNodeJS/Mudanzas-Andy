#!/usr/bin/env node

/**
 * Script de verificación del sistema de theming
 *
 * Verifica que:
 * 1. Los archivos de theming existan
 * 2. Las variables CSS estén definidas correctamente
 * 3. Los componentes usen el sistema de tokens
 * 4. No haya colores hardcodeados restantes
 */

import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

// Colores a verificar y sus reemplazos
const colorMappings = {
  "#264e70": "var(--color-primary) or primary class",
  "#679186": "var(--color-secondary) or secondary class",
  "#f9b4ab": "var(--color-accent) or accent class",
  "#FAE360": "var(--color-highlight) or highlight class",
  "#bbd4ce": "var(--color-neutral) or neutral class",
  "#ffffff": "var(--color-white) or white class",
};

// Archivos requeridos del sistema de theming
const requiredFiles = [
  "src/styles/theme.css",
  "src/styles/components.css",
  "src/styles/global.css",
  "tailwind.config.js",
  "docs/THEMING.md",
];

// Variables CSS requeridas
const requiredVariables = [
  "--color-primary",
  "--color-secondary",
  "--color-accent",
  "--color-highlight",
  "--color-neutral",
  "--space-4",
  "--font-size-base",
  "--radius-base",
];

async function checkFileExists(filePath) {
  try {
    await fs.access(path.join(projectRoot, filePath));
    return true;
  } catch {
    return false;
  }
}

async function readFile(filePath) {
  try {
    return await fs.readFile(path.join(projectRoot, filePath), "utf-8");
  } catch {
    return null;
  }
}

async function findHardcodedColors(directory) {
  const hardcodedColors = [];

  async function scanDirectory(dir) {
    try {
      const entries = await fs.readdir(path.join(projectRoot, dir), {
        withFileTypes: true,
      });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (
          entry.isDirectory() &&
          !entry.name.startsWith(".") &&
          entry.name !== "node_modules"
        ) {
          await scanDirectory(fullPath);
        } else if (
          entry.isFile() &&
          (entry.name.endsWith(".astro") || entry.name.endsWith(".css"))
        ) {
          const content = await readFile(fullPath);
          if (content) {
            // Buscar colores hex
            const hexMatches = content.match(/#[0-9a-fA-F]{6}/g);
            if (hexMatches) {
              hexMatches.forEach((color) => {
                const lowerColor = color.toLowerCase();
                if (
                  Object.keys(colorMappings).some(
                    (key) => key.toLowerCase() === lowerColor
                  )
                ) {
                  hardcodedColors.push({
                    file: fullPath,
                    color: color,
                    replacement:
                      colorMappings[
                        Object.keys(colorMappings).find(
                          (key) => key.toLowerCase() === lowerColor
                        )
                      ],
                  });
                }
              });
            }

            // Buscar colores rgb/rgba
            const rgbMatches = content.match(
              /rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+)?\s*\)/g
            );
            if (rgbMatches) {
              rgbMatches.forEach((color) => {
                hardcodedColors.push({
                  file: fullPath,
                  color: color,
                  replacement: "Use variables CSS or utility classes",
                });
              });
            }
          }
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not scan directory ${dir}:`, error.message);
    }
  }

  await scanDirectory(directory);
  return hardcodedColors;
}

async function verifyThemeCSS() {
  const themeContent = await readFile("src/styles/theme.css");
  if (!themeContent) {
    return { valid: false, errors: ["theme.css not found"] };
  }

  const errors = [];
  const missingVariables = requiredVariables.filter(
    (variable) => !themeContent.includes(variable)
  );

  if (missingVariables.length > 0) {
    errors.push(`Missing CSS variables: ${missingVariables.join(", ")}`);
  }

  // Verificar formato RGB
  const rgbFormatCheck = themeContent.includes("--color-primary: 38 78 112");
  if (!rgbFormatCheck) {
    errors.push(
      "Primary color not in RGB format (should be: --color-primary: 38 78 112)"
    );
  }

  return { valid: errors.length === 0, errors };
}

async function verifyTailwindConfig() {
  const configContent = await readFile("tailwind.config.js");
  if (!configContent) {
    return { valid: false, errors: ["tailwind.config.js not found"] };
  }

  const errors = [];

  if (!configContent.includes("withOpacity")) {
    errors.push("withOpacity helper function not found");
  }

  if (!configContent.includes("--color-primary")) {
    errors.push("CSS variables not mapped in colors configuration");
  }

  return { valid: errors.length === 0, errors };
}

async function verifyComponents() {
  const componentsContent = await readFile("src/styles/components.css");
  if (!componentsContent) {
    return { valid: false, errors: ["components.css not found"] };
  }

  const errors = [];

  // Verificar que existan clases de botón
  const buttonClasses = [".btn", ".btn-primary", ".btn-secondary"];
  const missingButtonClasses = buttonClasses.filter(
    (className) => !componentsContent.includes(className)
  );

  if (missingButtonClasses.length > 0) {
    errors.push(`Missing button classes: ${missingButtonClasses.join(", ")}`);
  }

  // Verificar uso de @apply
  if (!componentsContent.includes("@apply")) {
    errors.push(
      "No @apply directives found - components should use Tailwind utilities"
    );
  }

  return { valid: errors.length === 0, errors };
}

async function main() {
  console.log("🎨 Verificación del Sistema de Theming - Mudanzas ANDY\n");

  let totalErrors = 0;

  // 1. Verificar archivos requeridos
  console.log("📁 Verificando archivos requeridos...");
  for (const file of requiredFiles) {
    const exists = await checkFileExists(file);
    if (exists) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file} - NOT FOUND`);
      totalErrors++;
    }
  }

  // 2. Verificar theme.css
  console.log("\n🎨 Verificando theme.css...");
  const themeVerification = await verifyThemeCSS();
  if (themeVerification.valid) {
    console.log("✅ theme.css is valid");
  } else {
    console.log("❌ theme.css has errors:");
    themeVerification.errors.forEach((error) => console.log(`   - ${error}`));
    totalErrors += themeVerification.errors.length;
  }

  // 3. Verificar tailwind.config.js
  console.log("\n⚙️ Verificando tailwind.config.js...");
  const tailwindVerification = await verifyTailwindConfig();
  if (tailwindVerification.valid) {
    console.log("✅ tailwind.config.js is valid");
  } else {
    console.log("❌ tailwind.config.js has errors:");
    tailwindVerification.errors.forEach((error) =>
      console.log(`   - ${error}`)
    );
    totalErrors += tailwindVerification.errors.length;
  }

  // 4. Verificar components.css
  console.log("\n🧩 Verificando components.css...");
  const componentsVerification = await verifyComponents();
  if (componentsVerification.valid) {
    console.log("✅ components.css is valid");
  } else {
    console.log("❌ components.css has errors:");
    componentsVerification.errors.forEach((error) =>
      console.log(`   - ${error}`)
    );
    totalErrors += componentsVerification.errors.length;
  }

  // 5. Buscar colores hardcodeados
  console.log("\n🔍 Buscando colores hardcodeados...");
  const hardcodedColors = await findHardcodedColors("src");

  if (hardcodedColors.length === 0) {
    console.log("✅ No hardcoded colors found");
  } else {
    console.log(`❌ Found ${hardcodedColors.length} hardcoded colors:`);
    const groupedByFile = hardcodedColors.reduce((acc, item) => {
      if (!acc[item.file]) acc[item.file] = [];
      acc[item.file].push(item);
      return acc;
    }, {});

    Object.entries(groupedByFile).forEach(([file, colors]) => {
      console.log(`\n   📄 ${file}:`);
      colors.forEach(({ color, replacement }) => {
        console.log(`      ${color} → ${replacement}`);
      });
    });
    totalErrors += hardcodedColors.length;
  }

  // Resumen
  console.log("\n" + "=".repeat(60));
  if (totalErrors === 0) {
    console.log("🎉 ¡Sistema de theming verificado correctamente!");
    console.log("✅ Todos los archivos están en su lugar");
    console.log("✅ Las variables CSS están bien definidas");
    console.log("✅ Los componentes usan el sistema de tokens");
    console.log("✅ No hay colores hardcodeados");
  } else {
    console.log(
      `❌ Se encontraron ${totalErrors} errores en el sistema de theming`
    );
    console.log("\n📚 Consulta docs/THEMING.md para guías de migración");
    process.exit(1);
  }
}

main().catch(console.error);
