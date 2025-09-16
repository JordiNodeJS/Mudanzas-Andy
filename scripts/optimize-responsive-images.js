#!/usr/bin/env node

/**
 * Optimizador Responsive de Imágenes para Blog
 * Genera versiones optimizadas para desktop y móvil con carga automática según dispositivo
 */

import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSETS_DIR = path.join(
  __dirname,
  "..",
  "src",
  "assets",
  "images",
  "blog"
);

// Configuraciones de optimización responsive
const RESPONSIVE_CONFIGS = {
  desktop: {
    suffix: "-desktop",
    width: 1200,
    height: 800,
    quality: 85,
    description: "Alta resolución para desktop",
  },
  tablet: {
    suffix: "-tablet",
    width: 768,
    height: 512,
    quality: 82,
    description: "Resolución media para tablet",
  },
  mobile: {
    suffix: "-mobile",
    width: 480,
    height: 320,
    quality: 78,
    description: "Optimizada para móvil",
  },
};

// URLs de origen con alta resolución para generar variaciones
const BLOG_IMAGES_SOURCES = {
  "mudanzas-economicas-hero": {
    baseUrl:
      "https://images.pexels.com/photos/4569340/pexels-photo-4569340.jpeg",
    alt: "Familia preparando mudanza económica en Barcelona con cajas organizadas y planificación profesional",
    description: "Familia con cajas de mudanza organizadas",
  },
  "embalaje-profesional-hero": {
    baseUrl:
      "https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg",
    alt: "Mesa con materiales de embalaje profesional: cajas de cartón, papel burbuja, cinta adhesiva, etiquetas y herramientas organizadas para una mudanza eficiente",
    description: "Mesa con materiales de embalaje profesional organizados",
  },
  "mudanza-ninos-hero": {
    baseUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
    alt: "Madre e hija sonrientes etiquetando cajas de mudanza juntas en una habitación luminosa, mostrando la importancia de involucrar a los niños en el proceso de traslado familiar",
    description: "Madre e hija etiquetando cajas de mudanza",
  },
  "mudanzas-internacionales-hero": {
    baseUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05",
    alt: "Persona organizando documentos de mudanza internacional con pasaporte, formularios de aduanas y mapamundi en el fondo, simbolizando la planificación necesaria para traslados al extranjero",
    description: "Documentos de mudanza internacional organizados",
  },
};

/**
 * Genera URL optimizada para cada configuración de dispositivo
 */
function generateOptimizedUrl(baseUrl, config) {
  const { width, height, quality } = config;

  if (baseUrl.includes("pexels.com")) {
    return `${baseUrl}?auto=compress&cs=tinysrgb&w=${width}&h=${height}&fit=crop&fm=webp&q=${quality}`;
  } else if (baseUrl.includes("unsplash.com")) {
    return `${baseUrl}?ixlib=rb-4.0.3&auto=format&fit=crop&w=${width}&h=${height}&q=${quality}&fm=webp`;
  }

  return baseUrl;
}

/**
 * Descarga una imagen optimizada para un dispositivo específico
 */
async function downloadResponsiveImage(imageName, deviceConfig, imageInfo) {
  const { suffix, description } = deviceConfig;
  const filename = `${imageName}${suffix}.webp`;
  const url = generateOptimizedUrl(imageInfo.baseUrl, deviceConfig);

  try {
    console.log(`📱 Descargando ${description}: ${filename}`);
    console.log(
      `   📏 ${deviceConfig.width}x${deviceConfig.height} @ ${deviceConfig.quality}% calidad`
    );
    console.log(`   🔗 ${url}`);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length < 3000) {
      throw new Error(`Imagen demasiado pequeña: ${buffer.length} bytes`);
    }

    const imagePath = path.join(ASSETS_DIR, filename);
    await fs.writeFile(imagePath, buffer);

    console.log(`   ✅ Descargada: ${(buffer.length / 1024).toFixed(1)} KB`);
    return { success: true, size: buffer.length, filename };
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return { success: false, error: error.message, filename };
  }
}

/**
 * Genera todas las variaciones responsive para una imagen
 */
async function generateResponsiveVariations(imageName, imageInfo) {
  console.log(`\n🎨 Procesando: ${imageName}`);
  console.log(`   📝 ${imageInfo.description}\n`);

  const results = {};

  for (const [deviceType, config] of Object.entries(RESPONSIVE_CONFIGS)) {
    const result = await downloadResponsiveImage(imageName, config, imageInfo);
    results[deviceType] = result;

    // Pausa entre descargas
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  return results;
}

/**
 * Crea backup de imágenes existentes
 */
async function createBackup() {
  console.log("💾 Creando backup de imágenes existentes...\n");

  const backupDir = path.join(ASSETS_DIR, `backup-responsive-${Date.now()}`);
  await fs.mkdir(backupDir, { recursive: true });

  try {
    const files = await fs.readdir(ASSETS_DIR);
    const webpFiles = files.filter((f) => f.endsWith(".webp"));

    for (const file of webpFiles) {
      const sourcePath = path.join(ASSETS_DIR, file);
      const backupPath = path.join(backupDir, file);

      try {
        await fs.copyFile(sourcePath, backupPath);
        console.log(`📋 Backup: ${file}`);
      } catch (error) {
        console.log(`⚠️  No se pudo hacer backup de ${file}: ${error.message}`);
      }
    }

    console.log(`✅ Backup completado en: ${backupDir}\n`);
    return backupDir;
  } catch (error) {
    console.error("Error creando backup:", error.message);
    return null;
  }
}

/**
 * Genera el componente Astro responsive para las imágenes
 */
async function generateResponsiveImageComponent() {
  const componentContent = `---
// ResponsiveHeroImage.astro - Componente responsive para imágenes de blog
import { Image } from 'astro:assets';

interface Props {
  imageName: string;
  alt: string;
  loading?: 'lazy' | 'eager';
  class?: string;
}

const { imageName, alt, loading = 'lazy', class: className = '' } = Astro.props;

// Importar todas las variaciones responsive
const desktopImage = await import(\`../../assets/images/blog/\${imageName}-desktop.webp\`);
const tabletImage = await import(\`../../assets/images/blog/\${imageName}-tablet.webp\`);
const mobileImage = await import(\`../../assets/images/blog/\${imageName}-mobile.webp\`);
---

<picture class={\`responsive-hero-image \${className}\`}>
  <!-- Desktop: 1200px+ -->
  <source
    media="(min-width: 1200px)"
    srcset={desktopImage.default.src}
    width={desktopImage.default.width}
    height={desktopImage.default.height}
  />
  
  <!-- Tablet: 768px - 1199px -->
  <source
    media="(min-width: 768px) and (max-width: 1199px)"
    srcset={tabletImage.default.src}
    width={tabletImage.default.width}
    height={tabletImage.default.height}
  />
  
  <!-- Mobile: hasta 767px -->
  <source
    media="(max-width: 767px)"
    srcset={mobileImage.default.src}
    width={mobileImage.default.width}
    height={mobileImage.default.height}
  />
  
  <!-- Fallback para navegadores que no soportan <picture> -->
  <Image
    src={desktopImage.default}
    alt={alt}
    loading={loading}
    class="hero-image-fallback"
    widths={[480, 768, 1200]}
    sizes="(max-width: 767px) 480px, (max-width: 1199px) 768px, 1200px"
  />
</picture>

<style>
  .responsive-hero-image {
    display: block;
    width: 100%;
    height: auto;
  }

  .hero-image-fallback,
  .responsive-hero-image img {
    width: 100%;
    height: auto;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .responsive-hero-image:hover img {
    transform: scale(1.02);
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  }

  /* Optimizaciones específicas por dispositivo */
  @media (max-width: 767px) {
    .responsive-hero-image {
      margin: 0 -1rem; /* Sangrado completo en móvil */
      border-radius: 0;
    }
    
    .hero-image-fallback,
    .responsive-hero-image img {
      border-radius: 0;
    }
  }

  @media (min-width: 768px) and (max-width: 1199px) {
    .responsive-hero-image {
      margin: 0 -0.5rem;
    }
  }
</style>`;

  const componentPath = path.join(
    __dirname,
    "..",
    "src",
    "layouts",
    "shortcodes",
    "ResponsiveHeroImage.astro"
  );
  await fs.writeFile(componentPath, componentContent);

  console.log(
    "📦 Componente responsive generado: src/layouts/shortcodes/ResponsiveHeroImage.astro"
  );
  return componentPath;
}

/**
 * Actualiza las páginas de blog para usar el componente responsive
 */
async function updateBlogPages() {
  console.log(
    "\n🔄 Actualizando páginas de blog para usar imágenes responsive..."
  );

  const blogMapping = {
    "mudanzas-economicas-barcelona-2025.mdx": "mudanzas-economicas-hero",
    "guia-embalaje-profesional-mudanzas.mdx": "embalaje-profesional-hero",
    "mudanza-con-ninos-guia-familias.mdx": "mudanza-ninos-hero",
    "mudanzas-internacionales-barcelona-guia-completa.mdx":
      "mudanzas-internacionales-hero",
  };

  const contentDir = path.join(__dirname, "..", "src", "content", "blog");

  for (const [filename, imageName] of Object.entries(blogMapping)) {
    const filePath = path.join(contentDir, filename);

    try {
      const content = await fs.readFile(filePath, "utf8");

      // Reemplazar la importación de Image por ResponsiveHeroImage
      let updatedContent = content;

      // Buscar y reemplazar el heroImage en frontmatter
      const frontmatterRegex = /heroImage:\s*["']([^"']+)["']/;
      if (frontmatterRegex.test(updatedContent)) {
        updatedContent = updatedContent.replace(
          frontmatterRegex,
          `responsiveHero: "${imageName}"`
        );
      }

      // Agregar import del componente si no existe
      if (!updatedContent.includes("ResponsiveHeroImage")) {
        const importSection =
          'import ResponsiveHeroImage from "@/shortcodes/ResponsiveHeroImage.astro";';

        if (updatedContent.includes("import ")) {
          // Agregar después de otros imports
          updatedContent = updatedContent.replace(
            /(import[^;]+;)/,
            `$1\n${importSection}`
          );
        } else {
          // Agregar al inicio después del frontmatter
          updatedContent = updatedContent.replace(
            /---\n([\s\S]*?)\n---/,
            `---\n$1\n---\n\n${importSection}`
          );
        }
      }

      await fs.writeFile(filePath, updatedContent);
      console.log(`✅ Actualizado: ${filename} → ${imageName}`);
    } catch (error) {
      console.error(`❌ Error actualizando ${filename}:`, error.message);
    }
  }
}

/**
 * Genera reporte final de optimización responsive
 */
async function generateFinalReport(allResults, backupDir) {
  const report = {
    timestamp: new Date().toISOString(),
    backupLocation: backupDir,
    responsiveOptimization: true,
    deviceConfigurations: RESPONSIVE_CONFIGS,
    results: allResults,
    totalVariations:
      Object.keys(allResults).length * Object.keys(RESPONSIVE_CONFIGS).length,
    summary: {
      imagesProcessed: Object.keys(allResults).length,
      successfulVariations: 0,
      failedVariations: 0,
      totalSizeReduction: 0,
    },
  };

  // Calcular estadísticas
  Object.values(allResults).forEach((imageResults) => {
    Object.values(imageResults).forEach((result) => {
      if (result.success) {
        report.summary.successfulVariations++;
      } else {
        report.summary.failedVariations++;
      }
    });
  });

  const reportPath = path.join(
    ASSETS_DIR,
    "responsive-optimization-report.json"
  );
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

  console.log("\n📊 REPORTE FINAL DE OPTIMIZACIÓN RESPONSIVE:");
  console.log(`✅ Imágenes procesadas: ${report.summary.imagesProcessed}`);
  console.log(
    `📱 Variaciones generadas: ${report.summary.successfulVariations}/${report.totalVariations}`
  );
  console.log(`❌ Variaciones fallidas: ${report.summary.failedVariations}`);
  console.log(`💾 Backup en: ${backupDir}`);
  console.log(`📋 Reporte detallado: responsive-optimization-report.json`);

  return report;
}

/**
 * Función principal
 */
async function optimizeResponsiveImages() {
  console.log("📱💻 OPTIMIZADOR RESPONSIVE DE IMÁGENES DE BLOG\n");
  console.log(
    "🎯 Generando versiones optimizadas para desktop, tablet y móvil\n"
  );

  try {
    // Crear backup
    const backupDir = await createBackup();

    // Generar todas las variaciones responsive
    const allResults = {};

    for (const [imageName, imageInfo] of Object.entries(BLOG_IMAGES_SOURCES)) {
      const results = await generateResponsiveVariations(imageName, imageInfo);
      allResults[imageName] = results;
    }

    // Generar componente responsive
    await generateResponsiveImageComponent();

    // Actualizar páginas de blog
    await updateBlogPages();

    // Generar reporte final
    const report = await generateFinalReport(allResults, backupDir);

    console.log("\n🎉 ¡OPTIMIZACIÓN RESPONSIVE COMPLETADA!");
    console.log("\n💡 Próximos pasos:");
    console.log("   1. Ejecutar: pnpm build");
    console.log("   2. Verificar: pnpm dev");
    console.log("   3. Probar en diferentes dispositivos");
    console.log("   4. Verificar carga automática según tamaño de pantalla");
  } catch (error) {
    console.error("\n❌ Error en la optimización responsive:", error.message);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (process.argv[1] === __filename) {
  optimizeResponsiveImages();
}

export {
  optimizeResponsiveImages,
  generateResponsiveVariations,
  RESPONSIVE_CONFIGS,
};
