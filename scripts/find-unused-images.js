#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Lista de todas las imágenes en public
const images = [
  './camion/hero-fondo.jpg',
  './camion/optimized/camion-evening.webp',
  './camion/optimized/camion-frontal.webp',
  './camion/optimized/hero-fondo.avif',
  './camion/optimized/hero-fondo.jpg',
  './camion/optimized/hero-fondo.webp',
  './camion/optimized/hero-fondo-mobile.avif',
  './camion/optimized/hero-fondo-mobile.jpg',
  './camion/optimized/hero-fondo-mobile.webp',
  './camion/optimized/hero-fondo-mobile-resized.jpg',
  './camion/optimized/moving-truck-01.avif',
  './camion/optimized/moving-truck-01.jpg',
  './camion/optimized/moving-truck-01.webp',
  './camion/optimized/moving-truck-cutout-01.avif',
  './camion/optimized/moving-truck-cutout-01.jpg',
  './camion/optimized/moving-truck-cutout-01.webp',
  './camion/optimized/moving-truck-cutout-02.avif',
  './camion/optimized/moving-truck-cutout-02.jpg',
  './camion/optimized/moving-truck-cutout-02.webp',
  './camion/resized/moving-truck-01.jpg',
  './camion/resized/moving-truck-cutout-01.jpg',
  './camion/resized/moving-truck-cutout-02.jpg',
  './favicon.svg',
  './favicons/apple-touch-icon.png',
  './favicons/favicon-16.png',
  './favicons/favicon-32.png',
  './logo-mudanzas-andy.svg',
  './logos/logo-camion-transparent.png',
  './logos/logo-camion-transparent-72.webp',
  './logos/logo-camion-transparent-80.webp'
];

console.log('🔍 Analizando uso de imágenes en el proyecto...\n');

const unusedImages = [];
const usedImages = [];

for (const image of images) {
  // Normalizar el path para la búsqueda (sin ./ al inicio)
  const searchPath = image.replace('./', '/');
  const fileName = path.basename(image);
  
  try {
    // Buscar referencias en archivos .astro, .ts, .js, .md, .json
    const searchCommand = `grep -r "${searchPath}" src/ || grep -r "${fileName}" src/ || echo "NOT_FOUND"`;
    const result = execSync(searchCommand, { encoding: 'utf8', cwd: process.cwd() });
    
    if (result.trim() === 'NOT_FOUND' || result.trim() === '') {
      // También buscar sin extensión para verificar
      const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
      const searchCommand2 = `grep -r "${nameWithoutExt}" src/ || echo "NOT_FOUND"`;
      const result2 = execSync(searchCommand2, { encoding: 'utf8', cwd: process.cwd() });
      
      if (result2.trim() === 'NOT_FOUND' || result2.trim() === '') {
        unusedImages.push(image);
        console.log(`❌ NO USADA: ${image}`);
      } else {
        usedImages.push(image);
        console.log(`✅ USADA: ${image}`);
      }
    } else {
      usedImages.push(image);
      console.log(`✅ USADA: ${image}`);
    }
  } catch (error) {
    unusedImages.push(image);
    console.log(`❌ NO USADA: ${image}`);
  }
}

console.log('\n📊 RESUMEN:');
console.log(`✅ Imágenes usadas: ${usedImages.length}`);
console.log(`❌ Imágenes NO usadas: ${unusedImages.length}`);

if (unusedImages.length > 0) {
  console.log('\n🗑️  IMÁGENES PARA ELIMINAR:');
  unusedImages.forEach(img => console.log(`  - ${img}`));
  
  // Calcular tamaño de las imágenes no usadas
  let totalSize = 0;
  unusedImages.forEach(img => {
    try {
      const fullPath = path.join('public', img.replace('./', ''));
      const stats = fs.statSync(fullPath);
      totalSize += stats.size;
    } catch (err) {
      // Archivo no existe
    }
  });
  
  console.log(`\n💾 Espacio a liberar: ${(totalSize / 1024).toFixed(1)} KB`);
} else {
  console.log('\n✅ ¡Todas las imágenes están siendo utilizadas!');
}
