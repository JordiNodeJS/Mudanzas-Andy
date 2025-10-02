#!/usr/bin/env node
import fs from "fs";
import path from "path";

// Read the Layout.astro to find the default image path
const layoutPath = path.resolve("src/layouts/Layout.astro");
const content = fs.readFileSync(layoutPath, "utf8");

// Try to match the image default assignment: image = "/camion/optimized/hero-fondo.webp",
const m = content.match(/image\s*=\s*"([^"]+)"/);
if (!m) {
  console.error("Could not find image default in Layout.astro");
  process.exit(2);
}

const imagePath = m[1];
const publicPath = path.resolve("public", imagePath.replace(/^\//, ""));

if (fs.existsSync(publicPath)) {
  console.log(`OG image exists: ${publicPath}`);
  process.exit(0);
} else {
  console.error(`OG image missing: ${publicPath}`);
  process.exit(1);
}
