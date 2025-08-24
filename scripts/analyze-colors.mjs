#!/usr/bin/env node

/**
 * Script de análisis detallado de colores hardcodeados restantes
 * Identifica patrones específicos que necesitan atención manual
 */

import fs from "fs";
import path from "path";

// Función para escanear directorios recursivamente
function scanDirectory(
  dir,
  extensions = [".astro", ".tsx", ".jsx", ".css", ".js", ".mjs", ".ts"]
) {
  const files = [];

  function scan(currentDir) {
    if (!fs.existsSync(currentDir)) return;

    const items = fs.readdirSync(currentDir);
    items.forEach((item) => {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (
        stat.isDirectory() &&
        !item.startsWith(".") &&
        !item.includes("node_modules")
      ) {
        scan(fullPath);
      } else if (extensions.some((ext) => item.endsWith(ext))) {
        files.push(fullPath);
      }
    });
  }

  scan(dir);
  return files;
}

// Patrones de colores a buscar
const colorPatterns = [
  // Hex colors (3 y 6 caracteres)
  { name: "Colores Hex estándar", pattern: /#[0-9a-fA-F]{6}\b/g },
  { name: "Colores Hex cortos", pattern: /#[0-9a-fA-F]{3}\b/g },
  // RGB/RGBA
  {
    name: "RGB/RGBA",
    pattern: /rgba?\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*[\d.]+)?\s*\)/g,
  },
  // HSL/HSLA
  {
    name: "HSL/HSLA",
    pattern: /hsla?\s*\(\s*\d+\s*,\s*\d+%?\s*,\s*\d+%?(?:\s*,\s*[\d.]+)?\s*\)/g,
  },
  // CSS color keywords específicos (excluimos básicos como 'white', 'black')
  {
    name: "Palabras clave de color",
    pattern:
      /\b(navy|teal|olive|maroon|purple|fuchsia|lime|aqua|silver|gray|orange|yellow|green|blue|red|pink|brown|cyan|magenta)\b/gi,
  },
];

// Categorías de archivos para análisis específico
const fileCategories = {
  CSS: [".css"],
  JavaScript: [".js", ".mjs", ".ts"],
  Componentes: [".astro", ".tsx", ".jsx"],
  SVG: [".svg"],
  Configuración: [".json", ".config.js", ".config.mjs"],
};

function analyzeFile(filePath, content) {
  const results = [];

  colorPatterns.forEach(({ name, pattern }) => {
    const matches = [...content.matchAll(pattern)];
    matches.forEach((match) => {
      const lineNumber = content.substring(0, match.index).split("\n").length;
      const line = content.split("\n")[lineNumber - 1].trim();

      results.push({
        type: name,
        color: match[0],
        line: lineNumber,
        context: line,
        filePath: filePath,
      });
    });
  });

  return results;
}

console.log("🔍 Análisis detallado de colores hardcodeados restantes\n");

const rootDir = process.cwd();
const allFiles = scanDirectory(rootDir);

let totalColorInstances = 0;
const colorsByType = {};
const colorsByFile = {};
const problematicColors = [];

allFiles.forEach((filePath) => {
  if (filePath.includes("node_modules") || filePath.includes(".git")) return;

  try {
    const content = fs.readFileSync(filePath, "utf8");
    const colors = analyzeFile(filePath, content);

    if (colors.length > 0) {
      totalColorInstances += colors.length;
      colorsByFile[filePath] = colors;

      colors.forEach((color) => {
        if (!colorsByType[color.type]) {
          colorsByType[color.type] = [];
        }
        colorsByType[color.type].push(color);

        // Identificar colores problemáticos (no básicos)
        if (
          ![
            "#ffffff",
            "#000000",
            "#fff",
            "#000",
            "white",
            "black",
            "transparent",
          ].includes(color.color.toLowerCase())
        ) {
          problematicColors.push(color);
        }
      });
    }
  } catch (error) {
    // Ignorar archivos que no se pueden leer (binarios, etc.)
  }
});

console.log(`📊 RESUMEN DEL ANÁLISIS`);
console.log(
  `Total de instancias de color encontradas: ${totalColorInstances}\n`
);

console.log("📋 POR TIPO DE COLOR:");
Object.entries(colorsByType).forEach(([type, colors]) => {
  console.log(`  ${type}: ${colors.length} instancias`);
});
console.log("");

console.log("📂 ARCHIVOS CON MÁS COLORES:");
const sortedFiles = Object.entries(colorsByFile)
  .sort(([, a], [, b]) => b.length - a.length)
  .slice(0, 10);

sortedFiles.forEach(([file, colors]) => {
  const relativePath = path.relative(rootDir, file);
  console.log(`  ${relativePath}: ${colors.length} colores`);
});
console.log("");

console.log("🚨 COLORES PROBLEMÁTICOS (necesitan migración):");
const uniqueProblematicColors = [
  ...new Set(problematicColors.map((c) => c.color)),
];
console.log(
  `  Colores únicos problemáticos: ${uniqueProblematicColors.length}`
);
uniqueProblematicColors.slice(0, 20).forEach((color) => {
  const instances = problematicColors.filter((c) => c.color === color).length;
  console.log(`    ${color} (${instances} usos)`);
});

if (uniqueProblematicColors.length > 20) {
  console.log(`    ... y ${uniqueProblematicColors.length - 20} más`);
}
console.log("");

console.log("🔧 ARCHIVOS QUE NECESITAN ATENCIÓN:");
const filesNeedingAttention = Object.entries(colorsByFile)
  .filter(([file, colors]) =>
    colors.some(
      (c) =>
        ![
          "#ffffff",
          "#000000",
          "#fff",
          "#000",
          "white",
          "black",
          "transparent",
        ].includes(c.color.toLowerCase())
    )
  )
  .slice(0, 15);

filesNeedingAttention.forEach(([file, colors]) => {
  const relativePath = path.relative(rootDir, file);
  const problematicCount = colors.filter(
    (c) =>
      ![
        "#ffffff",
        "#000000",
        "#fff",
        "#000",
        "white",
        "black",
        "transparent",
      ].includes(c.color.toLowerCase())
  ).length;

  console.log(
    `\n📄 ${relativePath} (${problematicCount} colores problemáticos):`
  );

  colors
    .filter(
      (c) =>
        ![
          "#ffffff",
          "#000000",
          "#fff",
          "#000",
          "white",
          "black",
          "transparent",
        ].includes(c.color.toLowerCase())
    )
    .slice(0, 5)
    .forEach((color) => {
      console.log(
        `    Línea ${color.line}: ${color.color} - ${color.context.substring(
          0,
          80
        )}${color.context.length > 80 ? "..." : ""}`
      );
    });
});

console.log(
  `\n✅ Análisis completado. Colores problemáticos encontrados: ${problematicColors.length}`
);
