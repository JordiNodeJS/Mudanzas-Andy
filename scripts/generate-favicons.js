#!/usr/bin/env node

/**
 * Genera variantes de favicon a partir del logo del camión.
 * Requiere `sharp` (npm i sharp).
 */

import fs from "fs";
import path from "path";
import sharp from "sharp";

const input = path.resolve(
  process.cwd(),
  "public/logos/logo-camion-transparent.png"
);
const outDir = path.resolve(process.cwd(), "public/favicons");

const sizes = [16, 32, 48, 64, 180, 192, 256];

async function ensureDir() {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
}

async function generate() {
  await ensureDir();

  if (!fs.existsSync(input)) {
    console.error(`Archivo de entrada no encontrado: ${input}`);
    process.exit(1);
  }

  // Configuración: cuánto ocupará el logo dentro del canvas (0-1)
  const SCALE = 1.5; // 150% del canvas (zoom/crop para que el logo aparezca más grande)

  // Helper: renderiza el logo centrado en un canvas transparente de tamaño `s`
  async function renderCanvas(size, scale = SCALE) {
    const inner = Math.max(1, Math.round(size * scale));

    // Si inner <= size: redimensionamos y centramos en canvas
    if (inner <= size) {
      const resized = await sharp(input)
        .resize(inner, inner, {
          fit: "inside",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer();

      const canvas = await sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
      })
        .composite([{ input: resized, gravity: "center" }])
        .png()
        .toBuffer();

      return canvas;
    }

    // Si inner > size: redimensionamos para cubrir y recortamos el centro (efecto zoom)
    const resizedLarge = await sharp(input)
      .resize(inner, inner, { fit: "cover" })
      .png()
      .toBuffer();

    const offset = Math.floor((inner - size) / 2);
    const cropped = await sharp(resizedLarge)
      .extract({ left: offset, top: offset, width: size, height: size })
      .png()
      .toBuffer();

    return cropped;
  }

  // Generar PNGs con el logo escalado y centrado
  for (const s of sizes) {
    const out = path.join(outDir, `favicon-${s}.png`);
    const buf = await renderCanvas(s);
    fs.writeFileSync(out, buf);
    console.log(`Generado: ${out}`);
  }

  // Generar favicon.ico (varias entradas)
  const icoOut = path.join(outDir, `favicon.ico`);
  const pngBuffers = await Promise.all(
    [16, 32, 48, 64].map((s) => renderCanvas(s))
  );

  // Small helper to write multi-size .ico using png-to-ico dependency would be ideal, but to avoid new deps we'll use `png-to-ico` if available.
  try {
    const pngToIco = await import("png-to-ico");
    const icoBuffer = await pngToIco.default(pngBuffers);
    fs.writeFileSync(icoOut, icoBuffer);
    console.log(`Generado: ${icoOut}`);
  } catch (err) {
    // If png-to-ico not available, fall back to writing only the 32px as favicon.ico
    console.warn(
      "png-to-ico no disponible, generando favicon.ico con un solo tamaño (32x32). Instala 'png-to-ico' para mejor compatibilidad."
    );
    const fallback = path.join(outDir, `favicon-32.png`);
    fs.copyFileSync(fallback, icoOut);
    console.log(`Generado (fallback): ${icoOut}`);
  }

  // Apple touch icon
  const appleOut = path.join(outDir, `apple-touch-icon.png`);
  const appleBuf = await renderCanvas(180);
  fs.writeFileSync(appleOut, appleBuf);
  console.log(`Generado: ${appleOut}`);

  console.log("✅ Favicons generados en public/favicons/");
}

const isCli =
  process.argv[1] &&
  new URL(import.meta.url).pathname.endsWith(
    process.argv[1].replace(/\\/g, "/")
  );

if (isCli) {
  generate().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

export default generate;
