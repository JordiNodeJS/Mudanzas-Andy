#!/usr/bin/env node

/**
 * Script de migración avanzada de colores hardcodeados
 * Maneja estilos inline, CSS directo y patrones más complejos
 */

import fs from "fs";
import path from "path";

// Mapeo de colores hardcodeados a variables CSS
const colorMappings = {
  "#264e70": "rgb(var(--color-primary))",
  "#679186": "rgb(var(--color-secondary))",
  "#f9b4ab": "rgb(var(--color-accent))",
  "#FAE360": "rgb(var(--color-highlight))",
  "#fae360": "rgb(var(--color-highlight))",
  "#bbd4ce": "rgb(var(--color-neutral))",
  "#ffffff": "rgb(var(--color-white))",
};

// Mapeo para clases de Tailwind
const tailwindMappings = {
  "#264e70": "primary",
  "#679186": "secondary",
  "#f9b4ab": "accent",
  "#FAE360": "highlight",
  "#fae360": "highlight",
  "#bbd4ce": "neutral",
};

function migrateInlineStyles(content) {
  let changesMade = 0;

  // Migrar estilos inline - background-color
  content = content.replace(
    /style="([^"]*?)background-color:\s*#([0-9a-fA-F]{6})\s*;?([^"]*?)"/gi,
    (match, before, hex, after) => {
      const fullHex = `#${hex.toLowerCase()}`;
      if (colorMappings[fullHex]) {
        changesMade++;
        console.log(
          `  ✅ style="...background-color: ${fullHex}..." → style="...background-color: ${colorMappings[fullHex]}..."`
        );
        return `style="${before}background-color: ${colorMappings[fullHex]};${after}"`;
      }
      return match;
    }
  );

  // Migrar estilos inline - color
  content = content.replace(
    /style="([^"]*?)color:\s*#([0-9a-fA-F]{6})\s*;?([^"]*?)"/gi,
    (match, before, hex, after) => {
      const fullHex = `#${hex.toLowerCase()}`;
      if (colorMappings[fullHex]) {
        changesMade++;
        console.log(
          `  ✅ style="...color: ${fullHex}..." → style="...color: ${colorMappings[fullHex]}..."`
        );
        return `style="${before}color: ${colorMappings[fullHex]};${after}"`;
      }
      return match;
    }
  );

  // Migrar estilos inline - border-color
  content = content.replace(
    /style="([^"]*?)border-color:\s*#([0-9a-fA-F]{6})\s*;?([^"]*?)"/gi,
    (match, before, hex, after) => {
      const fullHex = `#${hex.toLowerCase()}`;
      if (colorMappings[fullHex]) {
        changesMade++;
        console.log(
          `  ✅ style="...border-color: ${fullHex}..." → style="...border-color: ${colorMappings[fullHex]}..."`
        );
        return `style="${before}border-color: ${colorMappings[fullHex]};${after}"`;
      }
      return match;
    }
  );

  return { content, changesMade };
}

function migrateTailwindClasses(content) {
  let changesMade = 0;

  // Patrones de clases que necesitan ser transformadas
  const classPatterns = [
    // Backgrounds
    { from: /bg-\[#([0-9a-fA-F]{6})\]/gi, type: "bg" },
    // Text colors
    { from: /text-\[#([0-9a-fA-F]{6})\]/gi, type: "text" },
    // Hover text colors
    { from: /hover:text-\[#([0-9a-fA-F]{6})\]/gi, type: "hover:text" },
    // Border colors
    { from: /border-\[#([0-9a-fA-F]{6})\]/gi, type: "border" },
    // Focus ring colors
    { from: /focus:ring-\[#([0-9a-fA-F]{6})\]/gi, type: "focus:ring" },
  ];

  classPatterns.forEach((pattern) => {
    content = content.replace(pattern.from, (match, hex) => {
      const fullHex = `#${hex.toLowerCase()}`;
      if (tailwindMappings[fullHex]) {
        changesMade++;
        const newClass = `${pattern.type}-${tailwindMappings[fullHex]}`;
        console.log(`  ✅ ${match} → ${newClass}`);
        return newClass;
      }
      return match;
    });
  });

  return { content, changesMade };
}

function migrateFile(filePath) {
  console.log(`🔄 Migrando: ${filePath}`);

  let content = fs.readFileSync(filePath, "utf8");
  let totalChanges = 0;

  // Migrar estilos inline
  const inlineResult = migrateInlineStyles(content);
  content = inlineResult.content;
  totalChanges += inlineResult.changesMade;

  // Migrar clases de Tailwind
  const tailwindResult = migrateTailwindClasses(content);
  content = tailwindResult.content;
  totalChanges += tailwindResult.changesMade;

  if (totalChanges > 0) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ ${totalChanges} cambios aplicados en ${filePath}\n`);
  } else {
    console.log(`ℹ️ No se encontraron cambios en ${filePath}\n`);
  }

  return totalChanges;
}

// Buscar automáticamente archivos que necesitan migración
function findFilesToMigrate() {
  const extensions = [".astro", ".tsx", ".jsx", ".vue", ".svelte"];
  const dirs = ["src/components", "src/pages", "src/layouts"];
  const files = [];

  function scanDir(dir) {
    if (!fs.existsSync(dir)) return;

    const items = fs.readdirSync(dir);
    items.forEach((item) => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scanDir(fullPath);
      } else if (extensions.some((ext) => item.endsWith(ext))) {
        // Verificar si el archivo tiene colores hardcodeados
        const content = fs.readFileSync(fullPath, "utf8");
        if (/#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}/.test(content)) {
          files.push(fullPath);
        }
      }
    });
  }

  dirs.forEach(scanDir);
  return files;
}

console.log("🚀 Iniciando migración avanzada de colores hardcodeados\n");

const filesToMigrate = findFilesToMigrate();
console.log(
  `📁 Encontrados ${filesToMigrate.length} archivos con colores hardcodeados\n`
);

let totalChanges = 0;
filesToMigrate.forEach((file) => {
  totalChanges += migrateFile(file);
});

console.log(`🎉 Migración completada. Total de cambios: ${totalChanges}`);
