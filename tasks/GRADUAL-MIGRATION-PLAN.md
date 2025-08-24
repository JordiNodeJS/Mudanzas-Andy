# Plan de Migración Gradual a shadcn/ui

## Estado Actual

- ✅ **Completado**: Button, Card, ServiceCard, TestimonialCard, configuración base shadcn/ui
- 🔄 **Pendiente**: 6 componentes principales + 2 utilidades

## Prioridades de Migración

### FASE 1: Componentes UI Fundamentales (Prioridad ALTA)

- ✅ **TASK-004**: ServiceCard → shadcn/ui Card con variantes personalizadas
- ✅ **TASK-005**: TestimonialCard → shadcn/ui Card + Badge para ratings

### FASE 2: Componentes Interactivos (Prioridad MEDIA)

- 🔄 **TASK-006**: ContactForm → shadcn/ui Form + Input + Textarea
- **TASK-007**: SmartPopup → shadcn/ui Dialog + Alert

### FASE 3: Componentes de Layout (Prioridad BAJA)

- **TASK-008**: Header → shadcn/ui Navigation + Sheet (mobile)
- **TASK-009**: Footer → shadcn/ui estrutura modular

### FASE 4: Utilidades y Secciones (Prioridad BAJA)

- **TASK-010**: PhoneButton/WhatsAppButton → shadcn/ui Button variants
- **TASK-011**: Secciones → utilizar componentes migrados

## Estimación Total: 8 tareas, ~4-6 horas de desarrollo

## Progreso Actual

- ✅ TASK-003: shadcn/ui setup completado
- ✅ TASK-004: ServiceCard migrado (45 min)
- ✅ TASK-005: TestimonialCard migrado (30 min)
- 🔄 TASK-006: ContactForm (EN PROGRESO)

**Tiempo Total**: 1h 15min / ~6h estimadas (20% completado)

## Criterios de Éxito por Tarea

1. ✅ Componente shadcn/ui funcional
2. ✅ Props interface compatible con Astro
3. ✅ Estilos coherentes con diseño actual
4. ✅ Tests de Playwright pasando
5. ✅ Documentación actualizada
6. ✅ Sin breaking changes en páginas existentes

---

## Inicio de Implementación

**Comenzando con TASK-004: ServiceCard Migration**
Fecha: $(Get-Date -Format "yyyy-MM-dd HH:mm")
Estado: 🔄 EN PROGRESO
