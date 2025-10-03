# 📦 API de Productos TESTheb

Documentación de endpoints de gestión de productos para el sistema TESTheb.

## Endpoints Disponibles

### 📋 Listar Todos los Productos
**GET** `/api/products`

Obtiene todos los productos disponibles con información de categoría y tallas.

**Requiere Autenticación:** ❌ No

**Response:**
```json
{
  "success": true,
  "message": "Productos obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "name": "Polera Bordada Premium",
      "description": "Polera de alta calidad con bordado personalizado",
      "price": 15990,
      "category_id": 1,
      "category_name": "Poleras",
      "image_url": "https://res.cloudinary.com/.../polera.jpg",
      "size_id": 3,
      "size_name": "M",
      "size_display_name": "Medium",
      "stock": 50,
      "total_stock": 50,
      "has_stock": true,
      "created_at": "2025-09-28T10:00:00.000Z",
      "updated_at": "2025-09-28T10:00:00.000Z"
    }
  ],
  "total": 15
}
```

---

### 🔍 Obtener Producto por ID
**GET** `/api/products/:id`

Obtiene los detalles de un producto específico.

**Requiere Autenticación:** ❌ No

**Parámetros de URL:**
- `id` (number) - ID del producto

**Response:**
```json
{
  "success": true,
  "message": "Producto obtenido exitosamente",
  "data": {
    "id": 1,
    "name": "Polera Bordada Premium",
    "description": "Polera de alta calidad con bordado personalizado",
    "price": 15990,
    "category_id": 1,
    "category_name": "Poleras",
    "image_url": "https://res.cloudinary.com/.../polera.jpg",
    "size_id": 3,
    "size_name": "M",
    "size_display_name": "Medium",
    "stock": 50,
    "total_stock": 50,
    "has_stock": true,
    "size_info": {
      "id": 3,
      "name": "M",
      "display_name": "Medium"
    },
    "created_at": "2025-09-28T10:00:00.000Z",
    "updated_at": "2025-09-28T10:00:00.000Z"
  }
}
```

**Errores:**
- `404` - Producto no encontrado

---

### 🏷️ Obtener Productos por Categoría
**GET** `/api/products/category/:categoryId`

Obtiene todos los productos de una categoría específica.

**Requiere Autenticación:** ❌ No

**Parámetros de URL:**
- `categoryId` (number) - ID de la categoría

**Response:**
```json
{
  "success": true,
  "message": "Productos obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "name": "Polera Bordada Premium",
      "description": "Polera de alta calidad",
      "price": 15990,
      "category_id": 1,
      "category_name": "Poleras",
      "stock": 50,
      "total_stock": 50,
      "has_stock": true
    }
  ],
  "total": 5
}
```

---

### 🔎 Buscar Productos
**GET** `/api/products/search?q=texto`

Busca productos por nombre o descripción.

**Requiere Autenticación:** ❌ No

**Query Parameters:**
- `q` (string) - Término de búsqueda (requerido)

**Response:**
```json
{
  "success": true,
  "message": "Búsqueda completada exitosamente",
  "data": [
    {
      "id": 1,
      "name": "Polera Bordada",
      "description": "Polera con bordado",
      "price": 15990,
      "category_name": "Poleras",
      "stock": 50,
      "total_stock": 50,
      "has_stock": true
    }
  ],
  "total": 3,
  "query": "polera"
}
```

**Errores:**
- `400` - Término de búsqueda requerido

---

### ➕ Crear Producto
**POST** `/api/products`

Crea un nuevo producto en el sistema.

**Requiere Autenticación:** ✅ Sí (Admin)

**Request Body:**
```json
{
  "name": "Polera Bordada Premium",
  "description": "Polera de alta calidad con bordado personalizado",
  "price": 15990,
  "category_id": 1,
  "image_url": "https://res.cloudinary.com/.../polera.jpg",
  "size_id": 3,
  "stock": 50
}
```

**Campos:**
- `name` (string) - Nombre del producto (requerido)
- `description` (string) - Descripción del producto
- `price` (number) - Precio en CLP (requerido)
- `category_id` (number) - ID de la categoría
- `image_url` (string) - URL de la imagen
- `size_id` (number) - ID de la talla
- `stock` (number) - Cantidad en stock (default: 0)

**Response:**
```json
{
  "success": true,
  "message": "Producto creado exitosamente",
  "data": {
    "id": 16,
    "name": "Polera Bordada Premium",
    "description": "Polera de alta calidad",
    "price": 15990,
    "category_id": 1,
    "image_url": "https://res.cloudinary.com/.../polera.jpg",
    "size_id": 3,
    "stock": 50,
    "created_at": "2025-10-01T12:00:00.000Z"
  }
}
```

**Errores:**
- `400` - Nombre y precio son requeridos
- `400` - La categoría especificada no existe
- `400` - La talla especificada no existe
- `401` - No autenticado
- `403` - Requiere rol de admin

---

### ✏️ Actualizar Producto
**PUT** `/api/products/:id`

Actualiza un producto existente.

**Requiere Autenticación:** ✅ Sí (Admin)

**Parámetros de URL:**
- `id` (number) - ID del producto

**Request Body:**
```json
{
  "name": "Polera Bordada Premium Actualizada",
  "description": "Nueva descripción",
  "price": 17990,
  "category_id": 1,
  "image_url": "https://res.cloudinary.com/.../nueva.jpg",
  "size_id": 4,
  "stock": 100
}
```

**Nota:** Todos los campos son opcionales. Se mantienen los valores actuales si no se proporcionan.

**Response:**
```json
{
  "success": true,
  "message": "Producto actualizado exitosamente",
  "data": {
    "id": 1,
    "name": "Polera Bordada Premium Actualizada",
    "description": "Nueva descripción",
    "price": 17990,
    "category_id": 1,
    "image_url": "https://res.cloudinary.com/.../nueva.jpg",
    "size_id": 4,
    "stock": 100,
    "updated_at": "2025-10-01T12:30:00.000Z"
  }
}
```

**Errores:**
- `400` - La categoría especificada no existe
- `400` - La talla especificada no existe
- `404` - Producto no encontrado
- `401` - No autenticado
- `403` - Requiere rol de admin

---

### 🗑️ Eliminar Producto
**DELETE** `/api/products/:id`

Elimina un producto del sistema.

**Requiere Autenticación:** ✅ Sí (Admin)

**Parámetros de URL:**
- `id` (number) - ID del producto

**Response:**
```json
{
  "success": true,
  "message": "Producto eliminado exitosamente",
  "data": {
    "id": 1,
    "name": "Polera Bordada Premium"
  }
}
```

**Errores:**
- `404` - Producto no encontrado
- `401` - No autenticado
- `403` - Requiere rol de admin

---

## 📏 Endpoints de Tallas

### 📋 Obtener Todas las Tallas
**GET** `/api/sizes`

Obtiene todas las tallas disponibles en el sistema.

**Requiere Autenticación:** ❌ No

**Response:**
```json
{
  "success": true,
  "message": "Tallas obtenidas exitosamente",
  "data": [
    { "id": 1, "name": "XS", "display_name": "Extra Small", "sort_order": 1 },
    { "id": 2, "name": "S", "display_name": "Small", "sort_order": 2 },
    { "id": 3, "name": "M", "display_name": "Medium", "sort_order": 3 },
    { "id": 4, "name": "L", "display_name": "Large", "sort_order": 4 },
    { "id": 5, "name": "XL", "display_name": "Extra Large", "sort_order": 5 },
    { "id": 6, "name": "XXL", "display_name": "XX Large", "sort_order": 6 }
  ],
  "total": 6
}
```

---

## 🧪 Ejemplos de Prueba

### cURL Examples

**Listar productos:**
```bash
curl "http://localhost:3000/api/products"
```

**Buscar productos:**
```bash
curl "http://localhost:3000/api/products/search?q=polera"
```

**Crear producto (requiere token admin):**
```bash
curl -X POST "http://localhost:3000/api/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Polera Nueva",
    "description": "Descripción",
    "price": 12990,
    "category_id": 1,
    "stock": 30
  }'
```

**Actualizar producto:**
```bash
curl -X PUT "http://localhost:3000/api/products/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{"price": 14990, "stock": 40}'
```

**Eliminar producto:**
```bash
curl -X DELETE "http://localhost:3000/api/products/1" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## ❌ Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400 | Datos de entrada inválidos |
| 401 | No autenticado / Token inválido |
| 403 | Sin permisos (requiere admin) |
| 404 | Producto no encontrado |
| 500 | Error interno del servidor |

---

## 📋 Notas Importantes

1. **Precios:** Los precios se manejan en pesos chilenos (CLP) como números enteros
2. **Stock:** El stock debe ser un número entero positivo o 0
3. **Imágenes:** Se recomienda usar Cloudinary para las URLs de imágenes
4. **Tallas:** El sistema soporta tallas únicas por producto (sistema simple)
5. **Admin:** Los endpoints de creación, actualización y eliminación requieren rol de administrador

---

**Creado por:** Francisco Campos & Sebastian Mella
**Versión:** 1.0.0
**Fecha:** Octubre 2025
