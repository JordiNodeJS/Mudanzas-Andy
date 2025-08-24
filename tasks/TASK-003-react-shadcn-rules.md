# TAREA 003: Reglas React/shadcn/ui para Copilot

## Estado: ✅ COMPLETADA

## Objetivo

Crear reglas comprehensivas para el uso correcto de componentes React y shadcn/ui en el contexto de Astro, siguiendo las instrucciones de `mcp-tools.prompt.md`.

## Problema Resuelto

- **Error TypeScript**: `Property 'client' does not exist on type 'IntrinsicAttributes & Props'`
- **Sintaxis incorrecta**: Uso de `client="load"` en lugar de `client:load`
- **Falta de documentación**: Sin guías claras para hidratación de componentes React

## Implementación

### 1. Consulta de Documentación Oficial

- ✅ Consultado: Documentación oficial de Astro sobre client directives
- ✅ Consultado: Documentación de shadcn/ui para patrones React
- ✅ Consultado: Mejores prácticas de hidratación en Astro

### 2. Reglas Implementadas

#### Directivas de Hidratación:

- `client:load` - Hidratación inmediata (formularios críticos)
- `client:idle` - Hidratación diferida (UI de baja prioridad)
- `client:visible` - Hidratación en viewport (carruseles, contenido "below fold")
- `client:media` - Hidratación condicional (componentes responsivos)
- `client:only` - Solo cliente (APIs del navegador)

#### Patrones shadcn/ui:

- Interfaces TypeScript obligatorias
- Props con valores por defecto
- Integración con sistema de colores centralizado
- Uso de `cn()` utility para clases

#### Optimización de Performance:

- Estrategias de hidratación por prioridad
- Bundle splitting para componentes pesados
- Evitar hidratación innecesaria

### 3. Antipatrones Documentados

- ❌ Sintaxis incorrecta: `client="load"`
- ❌ Hidratación de contenido estático
- ❌ Múltiples `client:load` en una página
- ❌ Colores hardcodeados en componentes

## Archivos Modificados

- `.github/copilot-instructions.md` - Agregada sección completa de reglas React/shadcn/ui

## Verificación

- ✅ TypeScript compila sin errores (`pnpm exec tsc --noEmit`)
- ✅ Sintaxis de directivas corregida en archivos existentes
- ✅ Documentación integrada en sistema de reglas del proyecto

## Impacto

- **Desarrollo**: Mejores guías para componentes interactivos
- **Performance**: Estrategias optimizadas de hidratación
- **Mantenimiento**: Patrones consistentes para React/shadcn/ui
- **DX**: Prevención de errores comunes de sintaxis

## Comandos de Verificación

```bash
# Verificar TypeScript
pnpm exec tsc --noEmit

# Build del proyecto
pnpm build

# Desarrollo
pnpm dev
```

## Referencias

- [Astro Client Directives](https://docs.astro.build/en/reference/directives-reference/#client-directives)
- [Astro Framework Components](https://docs.astro.build/en/guides/framework-components/)
- [shadcn/ui Components](https://ui.shadcn.com/docs/components)

---

**Completado**: 2024-12-31 23:59
**Duración**: ~30 minutos
**Tipo**: Documentación + Fix de error
