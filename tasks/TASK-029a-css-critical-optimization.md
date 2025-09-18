# TASK-029a: Optimización Urgente CSS Crítico

## 🚨 Problema Identificado

El `index.html` tiene **109KB** debido al CSS crítico inlineado, causando:

- FCP: 5.3s (objetivo: ≤1.8s)
- LCP: 5.3s (objetivo: ≤2.5s)
- Performance Score: 67% (objetivo: ≥90%)

## 🎯 Solución Inmediata

### 1. Reducir CSS Crítico Inlineado

- Extraer solo utilidades esenciales above-the-fold
- Mover componentes específicos a archivos externos
- Implementar loading="async" para CSS no crítico

### 2. Optimizar Estrategia de Carga

- Preload solo recursos críticos
- Lazy load componentes below-the-fold
- Implementar resource hints específicos

### 3. JavaScript Bundle Splitting

- Separar componentes React por prioridad
- Implementar dynamic imports
- Reducir ClientRouter de 14KB

## 🔄 Plan de Acción Inmediato

1. **Refactor CSS crítico** (30 min)

   - Mantener solo grid, typography, colors esenciales
   - Extraer componentes específicos a external CSS

2. **Optimizar resource loading** (20 min)

   - Implementar preload selectivo
   - Configurar font-display swap

3. **Test y validación** (10 min)
   - Ejecutar Lighthouse post-cambios
   - Validar métricas mejoradas

**Objetivo:** Reducir index.html de 109KB a <50KB
**Timeline:** 1 hora
**Impacto esperado:** FCP/LCP <3s, Performance >80%
