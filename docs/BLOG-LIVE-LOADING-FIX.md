# Fix: Eliminación del Efecto de "Parpadeo" en Blog Live

## 🐛 Problema Original

Cuando se guardaba un artículo de WordPress como borrador y se visitaba `/blog-astro`, ocurría lo siguiente:

1. **Renderizado inicial**: Se mostraban todos los posts (incluidos los que ahora están en borrador) porque usaban datos estáticos generados en build time
2. **Actualización inmediata**: El fetch en cliente obtenía datos frescos de WordPress (sin los borradores)
3. **Resultado**: Cambio brusco en la UI ("parpadeo") que mostraba primero contenido obsoleto y luego el real

### Flujo Problemático Anterior

```
Usuario entra a /blog-astro
↓
[Renderizado inmediato con initialWordPressPosts]
Muestra: Post A, Post B, Post C (Post C ahora es borrador)
↓
[useEffect ejecuta fetch de WordPress]
↓
[Actualización del estado con datos frescos]
Muestra: Post A, Post B (Post C eliminado)
↓
⚠️ EFECTO DE PARPADEO VISIBLE
```

## ✅ Solución Implementada

### Cambios Principales

1. **Inicialización sin datos obsoletos**
   ```tsx
   // ANTES
   const [wpPosts, setWpPosts] = useState<UnifiedBlogPost[]>(initialWordPressPosts);
   const [loading, setLoading] = useState(false);
   
   // DESPUÉS
   const [wpPosts, setWpPosts] = useState<UnifiedBlogPost[]>([]);
   const [loading, setLoading] = useState(true); // Inicia en loading
   ```

2. **Loading inicial visible**
   ```tsx
   {loading && wpPosts.length === 0 && (
     <div className="loading-spinner">
       Cargando artículos más recientes...
     </div>
   )}
   ```

3. **Contenido solo después del fetch**
   ```tsx
   {!loading || wpPosts.length > 0 ? (
     <>
       {/* Hero Post */}
       {/* Grid de Posts */}
     </>
   ) : null}
   ```

4. **Eliminación de prop innecesaria**
   - Removida `initialWordPressPosts` de `LiveBlogGridProps`
   - Actualizado `blog-astro.astro` para no pasar esta prop

### Flujo Corregido

```
Usuario entra a /blog-astro
↓
[Estado inicial: loading=true, wpPosts=[]]
Muestra: Spinner de carga elegante
↓
[useEffect ejecuta fetch de WordPress]
↓
[Datos frescos obtenidos]
↓
[Estado actualizado: loading=false, wpPosts=[datos frescos]]
Muestra: Post A, Post B (datos correctos desde el inicio)
↓
✅ SIN PARPADEO - Transición suave de loading a contenido
```

## 📁 Archivos Modificados

### 1. `src/components/LiveBlogGrid.tsx`

**Cambios:**
- Estado `loading` inicializado en `true` (línea ~37)
- Estado `wpPosts` inicializado como array vacío (línea ~36)
- Agregada sección de loading inicial (líneas ~239-259)
- Contenido envuelto en condicional para mostrar solo después del fetch
- Removida prop `initialWordPressPosts` de la interfaz
- Agregados comentarios explicativos sobre el comportamiento

**Beneficios:**
- Elimina el efecto de "parpadeo"
- Mejora la experiencia de usuario con loading visual
- Evita mostrar contenido obsoleto o incorrecto

### 2. `src/pages/blog-astro.astro`

**Cambios:**
- Removida prop `initialWordPressPosts={wpResponse.posts}` (línea ~85)
- Agregado comentario explicativo sobre por qué no se pasa la prop

**Beneficios:**
- Simplifica el código
- Previene confusión sobre el origen de los datos
- Mantiene coherencia con el nuevo comportamiento

## 🎨 UI de Loading

El spinner implementado tiene:
- **Animación doble**: Anillo giratorio + círculo pulsante central
- **Colores del tema**: Usa variables CSS `--color-primary` y `--color-accent`
- **Mensajes informativos**:
  - Principal: "Cargando artículos más recientes..."
  - Secundario: "Obteniendo contenido actualizado desde WordPress"
- **Diseño centrado**: Min-height de 400px para evitar saltos de layout

```tsx
<div className="flex flex-col items-center justify-center min-h-[400px]">
  <div className="relative">
    {/* Anillo giratorio */}
    <div className="w-16 h-16 border-4 border-[rgb(var(--color-primary))] 
                    border-t-transparent rounded-full animate-spin"></div>
    {/* Círculo central pulsante */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-8 h-8 bg-[rgb(var(--color-accent))] 
                      rounded-full animate-pulse"></div>
    </div>
  </div>
  <p className="mt-6 text-lg font-semibold text-gray-700">
    Cargando artículos más recientes...
  </p>
</div>
```

## 🧪 Testing

### Escenarios a Probar

1. **Post guardado como borrador**
   - Acción: Cambiar un post publicado a borrador en WordPress
   - Resultado esperado: Al recargar `/blog-astro`, el post NO aparece (ni antes ni después)

2. **Nuevo post publicado**
   - Acción: Publicar un nuevo post en WordPress
   - Resultado esperado: Al recargar `/blog-astro`, el post aparece inmediatamente

3. **Primera carga de página**
   - Acción: Visitar `/blog-astro` por primera vez
   - Resultado esperado: Se muestra spinner ~1-2s, luego contenido sin parpadeo

4. **Botón de actualización manual**
   - Acción: Hacer clic en "↻ Actualizar"
   - Resultado esperado: Loading en botón, contenido se actualiza sin parpadeo

### Comandos de Verificación

```bash
# Verificar compilación TypeScript
pnpm check

# Construir y probar en local
pnpm build
pnpm preview

# Verificar en navegador
# http://localhost:4321/blog-astro
```

## 📊 Ventajas del Enfoque Actual

| Aspecto | Antes | Después |
|---------|-------|---------|
| **Datos iniciales** | Obsoletos del build | Frescos de WordPress |
| **Experiencia visual** | Parpadeo/cambio brusco | Transición suave |
| **Consistencia** | Contenido puede ser incorrecto temporalmente | Contenido siempre correcto |
| **Performance** | Renderizado doble innecesario | Un solo renderizado con datos correctos |
| **Complejidad** | Prop extra para pasar datos | Menos props, más simple |

## 🔄 Comportamiento de Actualización

El fetch de WordPress **SOLO** se ejecuta en:

1. **Entrada a la página**: `useEffect(() => fetchWordPressPosts(), [])`
2. **Click en "Actualizar"**: Botón manual del usuario

**NO hay** auto-refresh automático cada X tiempo.

## 📝 Notas Importantes

- El componente `LiveBlogGrid` ahora es completamente autónomo en cuanto a datos de WordPress
- Los `astroPosts` siguen siendo estáticos (no requieren fetch en cliente)
- La prop `initialWordPressPosts` fue removida completamente
- El tiempo de loading depende de la latencia de la API de WordPress
- En caso de error en el fetch, se muestra mensaje de error claro

## 🚀 Próximos Pasos

- [ ] Implementar cache en cliente para reducir fetches repetidos (opcional)
- [ ] Agregar animación de skeleton para el grid de posts (mejora progresiva)
- [ ] Considerar pre-fetch de posts al hacer hover en links de navegación
- [ ] Monitorear performance del fetch en producción con Analytics

## 📚 Documentación Relacionada

- [BLOG-REFRESH-BEHAVIOR.md](./BLOG-REFRESH-BEHAVIOR.md) - Comportamiento de actualización
- [BLOG-SYSTEM-IMPLEMENTATION-GUIDE.md](./BLOG-SYSTEM-IMPLEMENTATION-GUIDE.md) - Guía de implementación completa

---

**Fecha de implementación**: 11 de octubre de 2025  
**Versión de Astro**: 5.13.2  
**Versión de React**: 19.2.0
