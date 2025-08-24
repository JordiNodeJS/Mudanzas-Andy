#!/usr/bin/env node

/**
 * Script especializado para migrar gradientes complejos
 * Se enfoca en patrones de colores repetidos en múltiples archivos
 */

import fs from "fs";
import path from "path";

// Mapeo de gradientes complejos más comunes
const gradientMappings = [
  // Gradientes duales
  {
    from: /from-\[#f9b4ab\]\s+to-\[#679186\]/g,
    to: "from-accent to-secondary",
    desc: "Gradiente accent → secondary",
  },
  {
    from: /from-\[#679186\]\s+to-\[#f9b4ab\]/g,
    to: "from-secondary to-accent",
    desc: "Gradiente secondary → accent",
  },
  {
    from: /from-\[#679186\]\s+to-\[#264e70\]/g,
    to: "from-secondary to-primary",
    desc: "Gradiente secondary → primary",
  },
  {
    from: /from-\[#264e70\]\s+to-\[#679186\]/g,
    to: "from-primary to-secondary",
    desc: "Gradiente primary → secondary",
  },
  {
    from: /from-\[#f9b4ab\]\s+to-\[#bbd4ce\]/g,
    to: "from-accent to-neutral",
    desc: "Gradiente accent → neutral",
  },
  {
    from: /from-\[#bbd4ce\]\s+to-\[#f9b4ab\]/g,
    to: "from-neutral to-accent",
    desc: "Gradiente neutral → accent",
  },

  // Colores individuales en clases
  {
    from: /\[#f9b4ab\]/g,
    to: "accent",
    desc: "Color accent individual",
  },
  {
    from: /\[#679186\]/g,
    to: "secondary",
    desc: "Color secondary individual",
  },
  {
    from: /\[#264e70\]/g,
    to: "primary",
    desc: "Color primary individual",
  },
  {
    from: /\[#bbd4ce\]/g,
    to: "neutral",
    desc: "Color neutral individual",
  },
  {
    from: /\[#FAE360\]/g,
    to: "highlight",
    desc: "Color highlight individual",
  },
  {
    from: /\[#fae360\]/g,
    to: "highlight",
    desc: "Color highlight individual (lowercase)",
  },
];

function migrateGradients(content) {
  let changesMade = 0;

  gradientMappings.forEach(({ from, to, desc }) => {
    const matches = content.match(from);
    if (matches) {
      content = content.replace(from, () => {
        changesMade++;
        console.log(`  ✅ ${desc}: ${matches[0]} → ${to}`);
        return to;
      });
    }
  });

  return { content, changesMade };
}

function migrateFile(filePath) {
  console.log(
    `🔄 Migrando gradientes: ${path.relative(process.cwd(), filePath)}`
  );

  let content = fs.readFileSync(filePath, "utf8");
  const result = migrateGradients(content);

  if (result.changesMade > 0) {
    fs.writeFileSync(filePath, result.content);
    console.log(`✅ ${result.changesMade} gradientes migrados\n`);
  } else {
    console.log(`ℹ️ No se encontraron gradientes para migrar\n`);
  }

  return result.changesMade;
}

// Archivos específicos que contienen muchos gradientes
const filesToMigrate = [
  "src/components/ui/ServiceCard.astro",
  "src/components/ui/ValueCard.astro",
  "src/components/ui/ContactCard.astro",
  "src/components/ui/NavigationCard.astro",
  "src/components/ui/Breadcrumb.astro",
  "src/components/sections/ServicesSection.astro",
  "src/pages/contacto.astro",
  "src/pages/equipo.astro",
  "src/pages/index.astro",
  "src/pages/precios.astro",
  "src/pages/servicios.astro",
  "src/pages/testimonios.astro",
];

console.log("🎨 Iniciando migración especializada de gradientes\n");

let totalChanges = 0;
const existingFiles = filesToMigrate.filter((file) => fs.existsSync(file));
console.log(
  `📁 Archivos a procesar: ${existingFiles.length}/${filesToMigrate.length}\n`
);

existingFiles.forEach((file) => {
  totalChanges += migrateFile(file);
});

console.log(
  `🎉 Migración de gradientes completada. Total de cambios: ${totalChanges}`
);
