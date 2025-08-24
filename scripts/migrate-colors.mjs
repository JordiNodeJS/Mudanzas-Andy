#!/usr/bin/env node

/**
 * Script de migración automática de colores hardcodeados a variables CSS
 * Transforma: #264e70 → primary, #679186 → secondary, etc.
 */

import fs from "fs";
import path from "path";

// Mapeo de colores hardcodeados a clases de Tailwind
const colorMappings = {
  "#264e70": "primary",
  "#679186": "secondary",
  "#f9b4ab": "accent",
  "#FAE360": "highlight",
  "#fae360": "highlight", // lowercase variant
  "#bbd4ce": "neutral",
};

// Patrones de clases que necesitan ser transformadas
const classPatterns = [
  // Backgrounds
  {
    from: /bg-\[#([0-9a-fA-F]{6})\]/g,
    to: (match, hex) =>
      colorMappings[`#${hex.toLowerCase()}`]
        ? `bg-${colorMappings[`#${hex.toLowerCase()}`]}`
        : match,
  },

  // Text colors
  {
    from: /text-\[#([0-9a-fA-F]{6})\]/g,
    to: (match, hex) =>
      colorMappings[`#${hex.toLowerCase()}`]
        ? `text-${colorMappings[`#${hex.toLowerCase()}`]}`
        : match,
  },

  // Hover text colors
  {
    from: /hover:text-\[#([0-9a-fA-F]{6})\]/g,
    to: (match, hex) =>
      colorMappings[`#${hex.toLowerCase()}`]
        ? `hover:text-${colorMappings[`#${hex.toLowerCase()}`]}`
        : match,
  },

  // Border colors
  {
    from: /border-\[#([0-9a-fA-F]{6})\]/g,
    to: (match, hex) =>
      colorMappings[`#${hex.toLowerCase()}`]
        ? `border-${colorMappings[`#${hex.toLowerCase()}`]}`
        : match,
  },

  // Focus ring colors
  {
    from: /focus:ring-\[#([0-9a-fA-F]{6})\]/g,
    to: (match, hex) =>
      colorMappings[`#${hex.toLowerCase()}`]
        ? `focus:ring-${colorMappings[`#${hex.toLowerCase()}`]}`
        : match,
  },
];

function migrateFile(filePath) {
  console.log(`🔄 Migrando: ${filePath}`);

  let content = fs.readFileSync(filePath, "utf8");
  let changesMade = 0;

  // Aplicar todas las transformaciones
  classPatterns.forEach((pattern) => {
    const originalContent = content;
    content = content.replace(pattern.from, (...args) => {
      const result = pattern.to(...args);
      if (result !== args[0]) {
        changesMade++;
        console.log(`  ✅ ${args[0]} → ${result}`);
      }
      return result;
    });
  });

  if (changesMade > 0) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ ${changesMade} cambios aplicados en ${filePath}\n`);
  } else {
    console.log(`ℹ️ No se encontraron cambios en ${filePath}\n`);
  }

  return changesMade;
}

// Archivos a migrar en esta fase
const filesToMigrate = [
  "src/components/ContactFormInline.astro",
  "src/components/ContactFormSticky.astro",
  "src/components/SmartPopup.astro",
  "src/components/ui/PhoneButton.astro",
];

console.log("🚀 Iniciando migración de colores hardcodeados a variables CSS\n");

let totalChanges = 0;
filesToMigrate.forEach((file) => {
  if (fs.existsSync(file)) {
    totalChanges += migrateFile(file);
  } else {
    console.log(`⚠️ Archivo no encontrado: ${file}`);
  }
});

console.log(`🎉 Migración completada. Total de cambios: ${totalChanges}`);
