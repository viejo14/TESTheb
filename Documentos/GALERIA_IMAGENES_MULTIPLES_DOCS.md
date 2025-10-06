# 📸 Sistema de Galería de Imágenes Múltiples - TESTheb

## ✨ Características Implementadas

El sistema ahora permite agregar hasta **4 imágenes por producto**, mejorando significativamente la presentación visual del catálogo.

### 🎯 Funcionalidades

#### Para Administradores:
1. **Galería Visual** 📸
   - Vista previa en grid de todas las imágenes
   - Drag & drop para subir múltiples imágenes
   - Contador visual (X/4 imágenes)

2. **Gestión de Imágenes** 🎨
   - ⭐ **Marcar imagen principal** - La que se muestra en el catálogo
   - 🗑️ **Eliminar imágenes** - Individualmente con un clic
   - 📤 **Subir múltiples** - Selecciona varias imágenes a la vez
   - 🔄 **Dos métodos de subida**:
     - 📤 Local (servidor propio)
     - ☁️ Cloudinary (nube)

3. **Validaciones** ✅
   - Máximo 4 imágenes por producto
   - Formatos: JPG, PNG, WebP, GIF
   - Tamaño máximo: 10MB por imagen
   - Tipo de archivo validado

#### Para Clientes:
- La imagen marcada como "principal" (⭐) se muestra en:
  - Listado de productos
  - Tarjetas de productos
  - Vista de detalle (como imagen destacada)

---

## 🚀 Cómo Usar (Admin)

### Crear Nuevo Producto con Imágenes

1. **Accede al panel de administración** → Productos → Agregar Producto

2. **Completa los datos del producto** (nombre, precio, categoría, etc.)

3. **Agrega imágenes**:
   ```
   ┌─────────────────────────────────┐
   │  📸 Galería de Imágenes  0/4    │
   ├─────────────────────────────────┤
   │  [📤 Local] [☁️ Cloudinary]     │
   │                                 │
   │  [Img 1] [Img 2] [➕ Agregar]   │
   │                                 │
   └─────────────────────────────────┘
   ```

4. **Selecciona el método de subida**:
   - 📤 **Local**: Para usar el servidor propio
   - ☁️ **Cloudinary**: Para alojar en la nube

5. **Agrega imágenes**:
   - Haz clic en ➕ y selecciona archivos
   - O arrastra imágenes directamente al área
   - Puedes seleccionar múltiples archivos a la vez

6. **Gestiona las imágenes**:
   - **Marcar como principal**: Clic en ⭐ (solo productos existentes)
   - **Eliminar**: Clic en 🗑️

7. **Guarda el producto** - Las imágenes se guardarán automáticamente

### Editar Producto Existente

1. **Abre el producto para editar**

2. **Verás las imágenes actuales** cargadas automáticamente

3. **Puedes**:
   - Agregar más imágenes (hasta completar 4)
   - Eliminar imágenes existentes
   - Cambiar cuál es la imagen principal (⭐)

4. **Guarda los cambios**

---

## 🗄️ Base de Datos

### Tabla `product_images`

```sql
CREATE TABLE product_images (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Relación con Productos

- Un producto puede tener **0 a 4 imágenes**
- Una imagen pertenece a **un solo producto**
- Solo **una imagen** puede ser principal por producto
- Las imágenes se ordenan por `display_order`

---

## 🔌 API Endpoints

### Ver imágenes de un producto
```http
GET /api/products/:productId/images
```

### Agregar una imagen
```http
POST /api/products/:productId/images
Content-Type: application/json

{
  "image_url": "https://...",
  "is_primary": true
}
```

### Agregar múltiples imágenes
```http
POST /api/products/:productId/images/bulk
Content-Type: application/json

{
  "image_urls": [
    "https://imagen1.jpg",
    "https://imagen2.jpg",
    "https://imagen3.jpg"
  ]
}
```

### Marcar imagen como principal
```http
PUT /api/products/images/:imageId/primary
```

### Eliminar imagen
```http
DELETE /api/products/images/:imageId
```

### Reordenar imágenes
```http
PUT /api/products/:productId/images/reorder
Content-Type: application/json

{
  "image_ids": [3, 1, 4, 2]
}
```

---

## 📊 Flujo de Datos

### Al Crear Producto:

1. Usuario completa formulario
2. Usuario sube imágenes (local o Cloudinary)
3. Imágenes se almacenan temporalmente en el frontend
4. Al hacer submit:
   - Se crea el producto en BD
   - Se obtiene el ID del producto
   - Se guardan las imágenes asociadas al producto
5. Éxito ✅

### Al Editar Producto:

1. Se cargan imágenes existentes desde API
2. Usuario puede:
   - Agregar nuevas imágenes (POST bulk)
   - Eliminar imágenes (DELETE)
   - Cambiar principal (PUT primary)
3. Cambios se aplican inmediatamente en BD

---

## 🎨 Frontend - Componentes

### `ProductForm.jsx`
**Ubicación**: `frontend/src/components/admin/ProductForm.jsx`

**Estados principales**:
```javascript
const [productImages, setProductImages] = useState([])
const [uploadingImages, setUploadingImages] = useState(false)
const [primaryImageIndex, setPrimaryImageIndex] = useState(0)
```

**Funciones clave**:
- `handleMultipleFilesUpload()` - Sube varias imágenes
- `removeImageFromGallery()` - Elimina una imagen
- `setImageAsPrimary()` - Marca como principal
- `saveProductImages()` - Guarda en BD después de crear producto

---

## 💡 Mejores Prácticas

### Para Administradores:

1. **Calidad de Imágenes**:
   - Usa imágenes de alta resolución (min. 800x800px)
   - Mantén un estilo consistente (fondo, iluminación)
   - Optimiza el tamaño antes de subir

2. **Orden de Imágenes**:
   - Primera imagen: Vista principal del producto
   - Segunda: Detalle del bordado
   - Tercera: Producto en uso
   - Cuarta: Variaciones o extras

3. **Imagen Principal**:
   - Debe ser la más representativa
   - Clara y bien iluminada
   - Muestra el producto completo

### Para Desarrolladores:

1. **Límites**:
   - Máximo 4 imágenes (modificable en el backend)
   - 10MB por imagen (ajustable en validaciones)

2. **Optimización**:
   - Las imágenes se cargan lazy
   - Se generan miniaturas automáticamente
   - Cloudinary optimiza automáticamente

3. **Migraciones**:
   - Script `createProductImagesTable.js` ya ejecutado
   - Imágenes antiguas migradas automáticamente
   - Compatible con productos existentes

---

## 🐛 Troubleshooting

### Las imágenes no se guardan
- ✅ Verifica que el script de migración se ejecutó
- ✅ Revisa los logs del backend
- ✅ Comprueba permisos de carpeta `/uploads`

### No puedo subir imágenes
- ✅ Verifica formato de archivo (JPG, PNG, WebP, GIF)
- ✅ Comprueba el tamaño (< 10MB)
- ✅ Revisa configuración de Cloudinary (si aplica)

### La imagen principal no cambia
- ✅ Asegúrate de estar editando (no creando)
- ✅ Verifica que el producto tenga ID
- ✅ Revisa la consola del navegador

---

## 📝 Checklist de Implementación

- [x] Tabla `product_images` creada
- [x] Modelo `ProductImage` implementado
- [x] Controladores de imágenes agregados
- [x] Rutas API configuradas
- [x] Formulario de admin actualizado
- [x] Galería visual funcional
- [x] Subida múltiple implementada
- [x] Validaciones frontend/backend
- [x] Migración de datos existentes
- [ ] Carrusel en vista de producto (cliente) *
- [ ] Optimización de imágenes automática *
- [ ] Drag & drop para reordenar *

\* = Funcionalidad futura/opcional

---

## 🔮 Mejoras Futuras

1. **Carrusel en Vista de Producto**
   - Mostrar todas las imágenes al cliente
   - Navegación con flechas
   - Thumbnails clickeables

2. **Editor de Imágenes**
   - Recortar imágenes antes de subir
   - Ajustar brillo/contraste
   - Agregar marca de agua

3. **Reordenamiento Drag & Drop**
   - Arrastrar imágenes para reorganizar
   - Visual feedback en tiempo real

4. **Optimización Automática**
   - Redimensionar imágenes grandes
   - Comprimir automáticamente
   - Generar múltiples tamaños

5. **Vista 360°**
   - Rotación interactiva del producto
   - Zoom en áreas específicas

---

## 📚 Recursos

- [Framer Motion](https://www.framer.com/motion/) - Animaciones
- [Cloudinary Docs](https://cloudinary.com/documentation) - Subida de imágenes
- [PostgreSQL JSON](https://www.postgresql.org/docs/current/datatype-json.html) - Manejo de datos

---

**Desarrollado para TESTheb** 🧵  
*Sistema de Gestión de Bordados Personalizados*
