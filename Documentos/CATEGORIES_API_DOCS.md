# 🏷️ API de Categorías TESTheb

Documentación de endpoints de gestión de categorías para el sistema TESTheb.

## Endpoints Disponibles

### 📋 Listar Todas las Categorías
**GET** `/api/categories`

Obtiene todas las categorías disponibles en el sistema.

**Requiere Autenticación:** ❌ No

**Response:**
```json
{
  "success": true,
  "message": "Categorías obtenidas exitosamente",
  "data": [
    {
      "id": 1,
      "name": "Poleras",
      "image_url": "https://res.cloudinary.com/.../poleras.jpg",
      "created_at": "2025-09-28T10:00:00.000Z",
      "updated_at": "2025-09-28T10:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Gorros",
      "image_url": "https://res.cloudinary.com/.../gorros.jpg",
      "created_at": "2025-09-28T10:00:00.000Z",
      "updated_at": "2025-09-28T10:00:00.000Z"
    },
    {
      "id": 3,
      "name": "Bolsos",
      "image_url": "https://res.cloudinary.com/.../bolsos.jpg",
      "created_at": "2025-09-28T10:00:00.000Z",
      "updated_at": "2025-09-28T10:00:00.000Z"
    }
  ],
  "total": 3
}
```

---

### 🔍 Obtener Categoría por ID
**GET** `/api/categories/:id`

Obtiene los detalles de una categoría específica.

**Requiere Autenticación:** ❌ No

**Parámetros de URL:**
- `id` (number) - ID de la categoría

**Response:**
```json
{
  "success": true,
  "message": "Categoría obtenida exitosamente",
  "data": {
    "id": 1,
    "name": "Poleras",
    "image_url": "https://res.cloudinary.com/.../poleras.jpg",
    "created_at": "2025-09-28T10:00:00.000Z",
    "updated_at": "2025-09-28T10:00:00.000Z"
  }
}
```

**Errores:**
- `404` - Categoría no encontrada

---

### ➕ Crear Categoría
**POST** `/api/categories`

Crea una nueva categoría en el sistema.

**Requiere Autenticación:** ✅ Sí (Admin)

**Request Body:**
```json
{
  "name": "Chaquetas",
  "image_url": "https://res.cloudinary.com/.../chaquetas.jpg"
}
```

**Campos:**
- `name` (string) - Nombre de la categoría (requerido)
- `image_url` (string) - URL de la imagen de la categoría (opcional)

**Response:**
```json
{
  "success": true,
  "message": "Categoría creada exitosamente",
  "data": {
    "id": 4,
    "name": "Chaquetas",
    "image_url": "https://res.cloudinary.com/.../chaquetas.jpg",
    "created_at": "2025-10-01T12:00:00.000Z",
    "updated_at": "2025-10-01T12:00:00.000Z"
  }
}
```

**Errores:**
- `400` - El nombre de la categoría es requerido
- `401` - No autenticado
- `403` - Requiere rol de admin

---

### ✏️ Actualizar Categoría
**PUT** `/api/categories/:id`

Actualiza una categoría existente.

**Requiere Autenticación:** ✅ Sí (Admin)

**Parámetros de URL:**
- `id` (number) - ID de la categoría

**Request Body:**
```json
{
  "name": "Poleras Premium",
  "image_url": "https://res.cloudinary.com/.../poleras-nueva.jpg"
}
```

**Campos:**
- `name` (string) - Nuevo nombre de la categoría (requerido)
- `image_url` (string) - Nueva URL de imagen (opcional)

**Response:**
```json
{
  "success": true,
  "message": "Categoría actualizada exitosamente",
  "data": {
    "id": 1,
    "name": "Poleras Premium",
    "image_url": "https://res.cloudinary.com/.../poleras-nueva.jpg",
    "created_at": "2025-09-28T10:00:00.000Z",
    "updated_at": "2025-10-01T12:30:00.000Z"
  }
}
```

**Errores:**
- `400` - El nombre de la categoría es requerido
- `404` - Categoría no encontrada
- `401` - No autenticado
- `403` - Requiere rol de admin

---

### 🗑️ Eliminar Categoría
**DELETE** `/api/categories/:id`

Elimina una categoría del sistema.

**Requiere Autenticación:** ✅ Sí (Admin)

**Parámetros de URL:**
- `id` (number) - ID de la categoría

**Response:**
```json
{
  "success": true,
  "message": "Categoría eliminada exitosamente",
  "data": {
    "id": 4,
    "name": "Chaquetas",
    "image_url": "https://res.cloudinary.com/.../chaquetas.jpg"
  }
}
```

**Errores:**
- `400` - No se puede eliminar la categoría porque tiene productos asociados
- `404` - Categoría no encontrada
- `401` - No autenticado
- `403` - Requiere rol de admin

**Nota Importante:** Una categoría solo puede ser eliminada si NO tiene productos asociados. Si hay productos en esa categoría, primero deben ser reasignados o eliminados.

---

## 🧪 Ejemplos de Prueba

### cURL Examples

**Listar categorías:**
```bash
curl "http://localhost:3000/api/categories"
```

**Obtener categoría por ID:**
```bash
curl "http://localhost:3000/api/categories/1"
```

**Crear categoría (requiere token admin):**
```bash
curl -X POST "http://localhost:3000/api/categories" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Chaquetas",
    "image_url": "https://res.cloudinary.com/.../chaquetas.jpg"
  }'
```

**Actualizar categoría:**
```bash
curl -X PUT "http://localhost:3000/api/categories/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Poleras Premium",
    "image_url": "https://res.cloudinary.com/.../nueva.jpg"
  }'
```

**Eliminar categoría:**
```bash
curl -X DELETE "http://localhost:3000/api/categories/4" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## ❌ Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400 | Datos de entrada inválidos o categoría tiene productos |
| 401 | No autenticado / Token inválido |
| 403 | Sin permisos (requiere admin) |
| 404 | Categoría no encontrada |
| 500 | Error interno del servidor |

---

## 📋 Notas Importantes

1. **Nombres Únicos:** Aunque no hay validación de unicidad en DB, se recomienda usar nombres únicos para las categorías
2. **Eliminación:** Solo se pueden eliminar categorías sin productos asociados
3. **Imágenes:** Se recomienda usar Cloudinary para las URLs de imágenes
4. **Admin:** Los endpoints de creación, actualización y eliminación requieren rol de administrador
5. **Ordenamiento:** Las categorías se ordenan por ID de forma ascendente

---

## 🔗 Relaciones

Las categorías se relacionan con:
- **Productos:** Un producto pertenece a una categoría (`products.category_id`)

Para obtener productos de una categoría específica, usar:
```
GET /api/products/category/:categoryId
```

---

**Creado por:** Francisco Campos & Sebastian Mella
**Versión:** 1.0.0
**Fecha:** Octubre 2025
