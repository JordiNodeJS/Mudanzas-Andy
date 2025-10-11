# Comportamiento de Actualización - Blog WordPress en Tiempo Real

## 📋 Resumen

El sistema de blog **NO tiene actualización automática periódica**. Los posts de WordPress se actualizan **solo cuando el usuario entra o recarga la página**.

## ✅ Comportamiento Actual

### Cuándo se Actualizan los Posts de WordPress

1. **Al entrar a la página** (`/blog-astro`)
   - El componente `LiveBlogGrid` hace un fetch a WordPress
   - Se ejecuta automáticamente cuando se monta el componente
   - Ocurre UNA sola vez por visita

2. **Al recargar la página** (F5 o Ctrl+R)
   - El componente se desmonta y vuelve a montar
   - Se ejecuta un nuevo fetch a WordPress
   - Los datos se actualizan

3. **Al hacer clic en "Actualizar"** (manual)
   - El usuario puede hacer clic en el botón "↻ Actualizar"
   - Se ejecuta un fetch manual a WordPress
   - Útil si el usuario quiere ver posts recién publicados sin recargar

### Cuándo NO se Actualizan

- ❌ **NO hay auto-refresh** cada X segundos/minutos
- ❌ **NO hay polling** en segundo plano
- ❌ **NO hay timers** ejecutándose automáticamente
- ❌ **NO hay websockets** o conexiones persistentes

## 🔧 Configuración

### Archivo: `src/config/wordpress.json`

```json
{
  "clientSide": {
    "enabled": true,
    "autoRefresh": false,  // ← IMPORTANTE: false = Sin auto-refresh
    "refreshInterval": 60000,
    "comment": "autoRefresh: false = Solo actualiza cuando el usuario entra/recarga"
  }
}
```

**Nota**: El campo `refreshInterval` existe para referencia futura, pero **NO se usa** mientras `autoRefresh` esté en `false`.

## 📊 Flujo de Actualización

```
Usuario entra a /blog-astro
    ↓
Componente LiveBlogGrid se monta
    ↓
useEffect() se ejecuta UNA vez
    ↓
fetchWordPressPosts() obtiene datos de WordPress
    ↓
UI se actualiza con posts frescos
    ↓
... [usuario navega en la página] ...
    ↓
NO hay más peticiones automáticas
    ↓
[Opcional] Usuario hace clic en "Actualizar"
    ↓
fetchWordPressPosts() se ejecuta manualmente
    ↓
UI se actualiza
```

## 💡 Ventajas de Este Enfoque

### Eficiencia
- ✅ **Reduce peticiones**: Solo fetch cuando es necesario
- ✅ **Ahorra recursos**: No hay polling constante
- ✅ **Mejor para WordPress**: Menos carga en el servidor

### Performance
- ✅ **Carga inicial rápida**: HTML estático + fetch único
- ✅ **Sin consumo de fondo**: No hay timers ejecutándose
- ✅ **Menor uso de batería**: Importante en móviles

### UX
- ✅ **Control del usuario**: Puede actualizar cuando quiera
- ✅ **Predecible**: Solo actualiza en acciones claras
- ✅ **Transparente**: Indica última actualización

## 🔄 Comparación con Auto-Refresh

| Aspecto | Sin Auto-Refresh (Actual) | Con Auto-Refresh |
|---------|---------------------------|------------------|
| **Peticiones** | 1 por visita | 1 cada X minutos |
| **Carga servidor** | Mínima | Alta |
| **Batería móvil** | Sin impacto | Consume batería |
| **Control usuario** | Total | Automático |
| **Datos frescos** | Al entrar/recargar | Cada X minutos |

## 🎯 Casos de Uso Cubiertos

### ✅ Blog con Publicaciones Ocasionales
Perfecto para blogs que publican posts ocasionalmente (diario, semanal). Los usuarios ven contenido fresco cuando entran.

### ✅ Sitio Corporativo
Ideal para sitios como Mudanzas ANDY donde el blog es informativo y no requiere actualizaciones en tiempo real constantes.

### ✅ Hosting Estático
Compatible con Hostinger y cualquier hosting básico sin backend.

## ⚙️ Implementación Técnica

### Componente: `LiveBlogGrid.tsx`

```typescript
// Fetch solo al montar el componente
useEffect(() => {
  fetchWordPressPosts();
}, []); // ← Array vacío = solo ejecuta al montar

// NO hay setInterval ni auto-refresh
```

### Botón Manual de Actualización

```tsx
<button
  onClick={fetchWordPressPosts}
  disabled={loading}
>
  {loading ? 'Actualizando...' : '↻ Actualizar'}
</button>
```

## 📝 Notas Técnicas

### Cache del Navegador
- El fetch usa `cache: 'no-store'`
- Garantiza datos frescos en cada petición
- No usa cache HTTP del navegador

### Estados del Componente
```typescript
const [loading, setLoading] = useState(false);     // Estado de carga
const [error, setError] = useState<string | null>(null); // Errores
const [lastUpdate, setLastUpdate] = useState<Date | null>(null); // Timestamp
```

### Indicador Visual
- Muestra timestamp de última actualización
- Botón "Actualizar" habilitado/deshabilitado según loading
- Mensaje de error si WordPress no responde

## 🔮 Si en el Futuro se Requiere Auto-Refresh

Si en algún momento se necesita auto-refresh (no recomendado), se puede activar así:

### Opción 1: Modificar Configuración
```json
{
  "clientSide": {
    "autoRefresh": true,
    "refreshInterval": 300000  // 5 minutos
  }
}
```

### Opción 2: Añadir useEffect con setInterval
```typescript
useEffect(() => {
  if (!autoRefresh) return;

  const interval = setInterval(() => {
    fetchWordPressPosts();
  }, refreshInterval);

  return () => clearInterval(interval);
}, [autoRefresh, refreshInterval]);
```

**Nota**: No recomendado para sitios con hosting estático y WordPress externo.

## 🎓 Mejores Prácticas

### ✅ Recomendado
- Fetch al entrar a la página (actual)
- Botón manual de actualización
- Indicador de última actualización
- Fallback a contenido estático

### ⚠️ No Recomendado
- Auto-refresh cada pocos segundos
- Polling constante
- Conexiones persistentes en hosting estático

## 📚 Referencias

- **Componente**: `src/components/LiveBlogGrid.tsx`
- **Configuración**: `src/config/wordpress.json`
- **Página**: `src/pages/blog-astro.astro`
- **Documentación**: `docs/WORDPRESS-LIVE-BLOG-SYSTEM.md`

---

**Última actualización**: 11 de Octubre, 2025  
**Estado**: ✅ Sistema configurado sin auto-refresh  
**Comportamiento**: Actualización solo al entrar/recargar página + botón manual
