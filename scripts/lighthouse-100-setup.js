#!/usr/bin/env node

/**
 * Script de configuración automática para Lighthouse 100%
 * Aplica todas las optimizaciones de performance, accesibilidad, SEO y mejores prácticas
 */

import { promises as fs } from "fs";
import { join } from "path";
import { execSync } from "child_process";

class LighthouseOptimizer {
  constructor() {
    this.rootDir = process.cwd();
    this.optimizations = [];
  }

  log(message, type = "info") {
    const icons = {
      info: "🔄",
      success: "✅",
      warning: "⚠️",
      error: "❌",
    };
    console.log(`${icons[type]} ${message}`);
  }

  async optimizeAstroConfig() {
    this.log("Optimizando astro.config.mjs para máximo rendimiento...");

    const optimizedConfig = `
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://mudanzasandy.com',
  
  // Optimizaciones de build
  build: {
    format: 'file', // URLs limpias sin .html
    inlineStylesheets: 'auto',
    assetsPrefix: '/',
  },
  
  // Optimizaciones de output
  output: 'static',
  adapter: undefined,
  
  // Compresión y minificación avanzada
  vite: {
    build: {
      minify: 'esbuild',
      target: 'es2020',
      cssMinify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['astro'],
            'utils': ['./src/lib/utils/emailService.js']
          }
        }
      }
    },
    optimizeDeps: {
      include: ['astro/client']
    },
    ssr: {
      noExternal: []
    }
  },
  
  // Integraciones optimizadas
  integrations: [
    tailwind({
      applyBaseStyles: false, // CSS crítico manual
      configFile: './tailwind.config.mjs'
    }),
    sitemap({
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: new Date()
    }),
    mdx()
  ],
  
  // Configuraciones experimentales para performance
  experimental: {
    optimizeHoistedScript: true,
    contentCollectionCache: true
  },
  
  // Configuración de servidor para desarrollo
  server: {
    port: 4321,
    host: true
  }
});
`;

    await fs.writeFile(
      join(this.rootDir, "astro.config.mjs"),
      optimizedConfig.trim()
    );
    this.optimizations.push("Astro config optimizado");
    this.log("Astro config optimizado para máximo rendimiento", "success");
  }

  async optimizeTailwindConfig() {
    this.log("Configurando Tailwind CSS para Core Web Vitals...");

    const tailwindConfig = `
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  
  // Optimizaciones de CSS
  corePlugins: {
    preflight: false, // CSS reset manual más eficiente
  },
  
  // Tema optimizado con variables CSS
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)', 
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        highlight: 'rgb(var(--color-highlight) / <alpha-value>)',
        neutral: 'rgb(var(--color-neutral) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  
  // Optimizaciones de purge
  safelist: [
    'bg-primary', 'bg-secondary', 'bg-accent', 
    'text-primary', 'text-secondary', 'text-highlight',
    'translate-y-full', '-translate-y-full'
  ],
  
  plugins: [],
}
`;

    await fs.writeFile(
      join(this.rootDir, "tailwind.config.mjs"),
      tailwindConfig.trim()
    );
    this.optimizations.push("Tailwind CSS optimizado");
    this.log("Tailwind CSS configurado para máximo rendimiento", "success");
  }

  async createRobotsTxt() {
    this.log("Generando robots.txt optimizado...");

    const robotsContent = `User-agent: *
Allow: /

# Optimizaciones SEO
Sitemap: https://mudanzasandy.com/sitemap.xml

# Evitar crawling innecesario
Disallow: /api/
Disallow: /_astro/
Disallow: /admin/
Disallow: *.json$
Disallow: *.xml$

# Permitir recursos importantes
Allow: /js/
Allow: /css/
Allow: /camion/optimized/

# Crawl-delay para evitar sobrecarga
Crawl-delay: 1
`;

    await fs.writeFile(
      join(this.rootDir, "public", "robots.txt"),
      robotsContent.trim()
    );
    this.optimizations.push("robots.txt optimizado");
    this.log("robots.txt optimizado para SEO", "success");
  }

  async createSecurityHeaders() {
    this.log("Configurando headers de seguridad...");

    const headersContent = `/*
  # Security headers para mejores prácticas
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
  
  # Performance headers
  Cache-Control: public, max-age=31536000, immutable
  
/_astro/*
  Cache-Control: public, max-age=31536000, immutable

/camion/optimized/*
  Cache-Control: public, max-age=31536000, immutable
  
/js/*
  Cache-Control: public, max-age=86400

/favicon.svg
  Cache-Control: public, max-age=31536000, immutable

/manifest.json
  Cache-Control: public, max-age=86400
`;

    await fs.writeFile(
      join(this.rootDir, "public", "_headers"),
      headersContent.trim()
    );
    this.optimizations.push("Security headers configurados");
    this.log("Headers de seguridad y performance configurados", "success");
  }

  async optimizePackageJson() {
    this.log("Optimizando package.json...");

    const packagePath = join(this.rootDir, "package.json");
    const packageJson = JSON.parse(await fs.readFile(packagePath, "utf8"));

    // Añadir scripts de optimización
    packageJson.scripts = {
      ...packageJson.scripts,
      "lighthouse:test":
        "pnpm dlx lighthouse http://localhost:4321 --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=./reports/lighthouse-latest.json",
      "lighthouse:mobile":
        "pnpm dlx lighthouse http://localhost:4321 --preset=mobile --only-categories=performance,accessibility,best-practices,seo --output=html --output-path=./reports/lighthouse-mobile.html",
      "optimize:images": "node ./scripts/ultra-optimize-images.js",
      "optimize:all": "pnpm optimize:images && pnpm build",
      "perf:audit": "pnpm build && pnpm lighthouse:mobile",
      "perf:dev": "pnpm dev & sleep 5 && pnpm lighthouse:test",
    };

    // Optimización de dependencias
    if (!packageJson.devDependencies.sharp) {
      packageJson.devDependencies.sharp = "^0.33.0";
    }

    await fs.writeFile(packagePath, JSON.stringify(packageJson, null, 2));
    this.optimizations.push(
      "package.json optimizado con scripts de performance"
    );
    this.log("Scripts de optimización añadidos a package.json", "success");
  }

  async createLighthouseConfig() {
    this.log("Generando configuración de Lighthouse...");

    const lighthouseConfig = {
      extends: "lighthouse:default",
      settings: {
        onlyCategories: [
          "performance",
          "accessibility",
          "best-practices",
          "seo",
        ],
        formFactor: "mobile",
        throttling: {
          rttMs: 150,
          throughputKbps: 1.6 * 1024,
          cpuSlowdownMultiplier: 4,
          requestLatencyMs: 150,
          downloadThroughputKbps: 1.6 * 1024,
          uploadThroughputKbps: 750,
        },
        screenEmulation: {
          mobile: true,
          width: 412,
          height: 823,
          deviceScaleFactor: 2.625,
          disabled: false,
        },
        emulatedUserAgent:
          "Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36",
      },
      audits: [
        "first-contentful-paint",
        "largest-contentful-paint",
        "cumulative-layout-shift",
        "total-blocking-time",
        "server-response-time",
        "interactive",
        "speed-index",
        "accessibility",
        "seo",
        "best-practices",
      ],
    };

    await fs.writeFile(
      join(this.rootDir, "lighthouse.config.json"),
      JSON.stringify(lighthouseConfig, null, 2)
    );
    this.optimizations.push("Configuración de Lighthouse creada");
    this.log("Configuración de Lighthouse optimizada", "success");
  }

  async generateOptimizationChecklist() {
    this.log("Generando checklist de optimización...");

    const checklist = `# 🎯 Checklist de Optimización para Lighthouse 100%

## ✅ Completado Automáticamente

${this.optimizations.map((opt) => `- [x] ${opt}`).join("\n")}

## 🔄 Pasos Manuales Restantes

### Performance (Objetivo: 100)
- [ ] Verificar que todas las imágenes hero usan formatos AVIF/WebP
- [ ] Confirmar que LCP < 2.5s en dispositivos móviles
- [ ] Validar que no hay layout shifts (CLS = 0)
- [ ] Revisar que JavaScript crítico esté minificado

### Accessibility (Objetivo: 100)
- [ ] Verificar alt text en todas las imágenes
- [ ] Confirmar contraste de color adecuado (mínimo AA)
- [ ] Validar navegación por teclado
- [ ] Revisar etiquetas ARIA donde sea necesario

### Best Practices (Objetivo: 100)
- [ ] Confirmar headers de seguridad activos
- [ ] Verificar que no hay errores de consola
- [ ] Validar certificado HTTPS en producción
- [ ] Revisar permisos y políticas de cookies

### SEO (Objetivo: 100)
- [ ] Confirmar meta descriptions en todas las páginas
- [ ] Validar sitemap.xml actualizado
- [ ] Revisar structured data (JSON-LD)
- [ ] Verificar canonical URLs correctas

## 🚀 Comandos de Verificación

\`\`\`bash
# Optimizar imágenes
pnpm optimize:images

# Build optimizado
pnpm build

# Test completo de Lighthouse
pnpm perf:audit

# Servidor de desarrollo para testing
pnpm dev
\`\`\`

## 📊 Métricas Objetivo

- **Performance Score**: 100/100
- **LCP**: < 2.5s
- **FID**: < 100ms  
- **CLS**: < 0.1
- **Accessibility**: 100/100
- **Best Practices**: 100/100
- **SEO**: 100/100

## 🔍 Herramientas de Validación

1. **Lighthouse CI**: Tests automatizados
2. **PageSpeed Insights**: Datos reales de usuarios
3. **WebPageTest**: Análisis detallado de waterfall
4. **GTmetrix**: Monitoreo continuo de performance

¡Todas las optimizaciones base están aplicadas! 🎉
`;

    await fs.writeFile(
      join(this.rootDir, "LIGHTHOUSE-OPTIMIZATION-CHECKLIST.md"),
      checklist.trim()
    );
    this.log("Checklist de optimización generado", "success");
  }

  async runImageOptimization() {
    this.log("Ejecutando optimización de imágenes...");

    try {
      // Verificar si Sharp está instalado
      try {
        execSync("pnpm list sharp", { stdio: "pipe" });
      } catch {
        this.log("Instalando Sharp para optimización de imágenes...");
        execSync("pnpm add -D sharp", { stdio: "inherit" });
      }

      // Ejecutar script de optimización
      execSync("node ./scripts/ultra-optimize-images.js", {
        stdio: "inherit",
        cwd: this.rootDir,
      });

      this.optimizations.push("Imágenes optimizadas con Sharp");
      this.log("Optimización de imágenes completada", "success");
    } catch (error) {
      this.log("Error en optimización de imágenes (continuando...)", "warning");
    }
  }

  async run() {
    console.log("🚀 INICIANDO OPTIMIZACIÓN COMPLETA PARA LIGHTHOUSE 100%\n");

    try {
      // Configuraciones base
      await this.optimizeAstroConfig();
      await this.optimizeTailwindConfig();
      await this.optimizePackageJson();

      // Assets y configuraciones de producción
      await this.createRobotsTxt();
      await this.createSecurityHeaders();
      await this.createLighthouseConfig();

      // Optimización de imágenes
      await this.runImageOptimization();

      // Documentación y checklist
      await this.generateOptimizationChecklist();

      console.log("\n🎉 ¡OPTIMIZACIÓN COMPLETA FINALIZADA!\n");
      console.log(
        "📋 Revisa LIGHTHOUSE-OPTIMIZATION-CHECKLIST.md para los siguientes pasos"
      );
      console.log("🔄 Ejecuta `pnpm perf:audit` para validar las mejoras");
      console.log(
        "🚀 ¡Listo para alcanzar Lighthouse 100% en todas las categorías!"
      );
    } catch (error) {
      this.log(`Error durante la optimización: ${error.message}`, "error");
      process.exit(1);
    }
  }
}

// Ejecutar optimización completa
const optimizer = new LighthouseOptimizer();
optimizer.run();
