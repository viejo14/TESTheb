# 📋 API de Cotizaciones TESTheb

Documentación de endpoints de gestión de cotizaciones (quotes) para el sistema TESTheb.

Las cotizaciones permiten a los clientes solicitar presupuestos para bordados personalizados antes de realizar una compra.

---

## Endpoints Disponibles

### 📋 Listar Todas las Cotizaciones
**GET** `/api/cotizaciones`

Obtiene una lista paginada de cotizaciones con filtros de búsqueda y estado.

**Requiere Autenticación:** ✅ Sí (Admin)

**Query Parameters:**
- `page` (number) - Página actual (default: 1)
- `limit` (number) - Resultados por página (default: 10)
- `status` (string) - Filtrar por estado (opcional)
  - Valores: `pendiente`, `aprobada`, `rechazada`, `en_proceso`
- `search` (string) - Búsqueda por mensaje, nombre o email (opcional)

**Ejemplos:**
```
GET /api/cotizaciones
GET /api/cotizaciones?page=2&limit=20
GET /api/cotizaciones?status=pendiente
GET /api/cotizaciones?search=polera&status=pendiente
```

**Response:**
```json
{
  "success": true,
  "message": "Cotizaciones obtenidas exitosamente",
  "data": [
    {
      "id": 1,
      "user_id": 5,
      "user_name": "Juan Pérez",
      "user_email": "juan@example.com",
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "phone": "+56912345678",
      "message": "Necesito cotizar 50 poleras con logo de empresa",
      "status": "pendiente",
      "created_at": "2025-10-01T10:00:00.000Z"
    },
    {
      "id": 2,
      "user_id": null,
      "user_name": null,
      "user_email": null,
      "name": "María González",
      "email": "maria@example.com",
      "phone": "+56987654321",
      "message": "Quiero bordar 20 gorros personalizados",
      "status": "aprobada",
      "created_at": "2025-10-01T09:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalCotizaciones": 25,
    "limit": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### 🔍 Obtener Cotización por ID
**GET** `/api/cotizaciones/:id`

Obtiene los detalles de una cotización específica.

**Requiere Autenticación:** ✅ Sí (Admin)

**Parámetros de URL:**
- `id` (number) - ID de la cotización

**Response:**
```json
{
  "success": true,
  "message": "Cotización obtenida exitosamente",
  "data": {
    "id": 1,
    "user_id": 5,
    "user_name": "Juan Pérez",
    "user_email": "juan@example.com",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "phone": "+56912345678",
    "message": "Necesito cotizar 50 poleras con logo de empresa. El logo es de 10x10cm y necesito entrega en 2 semanas.",
    "status": "pendiente",
    "created_at": "2025-10-01T10:00:00.000Z"
  }
}
```

**Errores:**
- `400` - ID de cotización inválido
- `404` - Cotización no encontrada
- `401` - No autenticado
- `403` - Requiere rol de admin

---

### ➕ Crear Cotización
**POST** `/api/cotizaciones`

Crea una nueva solicitud de cotización. Este endpoint es público para permitir que cualquier visitante solicite una cotización.

**Requiere Autenticación:** ❌ No (público)

**Request Body:**
```json
{
  "user_id": 5,
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "phone": "+56912345678",
  "message": "Necesito cotizar 50 poleras con logo de empresa"
}
```

**Campos:**
- `name` (string) - Nombre del solicitante (requerido)
- `email` (string) - Email del solicitante (requerido, debe ser válido)
- `message` (string) - Descripción de la cotización solicitada (requerido)
- `phone` (string) - Teléfono de contacto (opcional)
- `user_id` (number) - ID del usuario registrado (opcional, si está autenticado)

**Response:**
```json
{
  "success": true,
  "message": "Cotización creada exitosamente",
  "data": {
    "id": 26,
    "user_id": 5,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "phone": "+56912345678",
    "message": "Necesito cotizar 50 poleras con logo de empresa",
    "status": "pendiente",
    "created_at": "2025-10-01T15:00:00.000Z"
  }
}
```

**Errores:**
- `400` - name, email y message son requeridos
- `400` - Formato de email inválido
- `404` - Usuario no encontrado (si se proporciona user_id inválido)

**Nota:** Las cotizaciones se crean automáticamente con estado `pendiente`.

---

### ✏️ Actualizar Cotización
**PUT** `/api/cotizaciones/:id`

Actualiza una cotización existente. Generalmente usado por admins para cambiar el estado.

**Requiere Autenticación:** ✅ Sí (Admin)

**Parámetros de URL:**
- `id` (number) - ID de la cotización

**Request Body:**
```json
{
  "status": "aprobada",
  "name": "Juan Pérez Actualizado",
  "email": "juan.nuevo@example.com",
  "phone": "+56911111111",
  "message": "Mensaje actualizado"
}
```

**Campos (todos opcionales):**
- `status` (string) - Nuevo estado
  - Valores permitidos: `pendiente`, `aprobada`, `rechazada`, `en_proceso`
- `name` (string) - Nuevo nombre
- `email` (string) - Nuevo email (debe ser válido)
- `phone` (string) - Nuevo teléfono
- `message` (string) - Nuevo mensaje

**Response:**
```json
{
  "success": true,
  "message": "Cotización actualizada exitosamente",
  "data": {
    "id": 1,
    "user_id": 5,
    "name": "Juan Pérez Actualizado",
    "email": "juan.nuevo@example.com",
    "phone": "+56911111111",
    "message": "Mensaje actualizado",
    "status": "aprobada",
    "created_at": "2025-10-01T10:00:00.000Z"
  }
}
```

**Errores:**
- `400` - ID de cotización inválido
- `400` - Estado inválido
- `400` - Formato de email inválido
- `400` - No se proporcionaron campos para actualizar
- `404` - Cotización no encontrada
- `401` - No autenticado
- `403` - Requiere rol de admin

---

### 🗑️ Eliminar Cotización
**DELETE** `/api/cotizaciones/:id`

Elimina una cotización del sistema.

**Requiere Autenticación:** ✅ Sí (Admin)

**Parámetros de URL:**
- `id` (number) - ID de la cotización

**Response:**
```json
{
  "success": true,
  "message": "Cotización eliminada exitosamente"
}
```

**Errores:**
- `400` - ID de cotización inválido
- `404` - Cotización no encontrada
- `401` - No autenticado
- `403` - Requiere rol de admin

---

### 📊 Obtener Estadísticas de Cotizaciones
**GET** `/api/cotizaciones/stats`

Obtiene estadísticas generales de cotizaciones del sistema.

**Requiere Autenticación:** ✅ Sí (Admin)

**Response:**
```json
{
  "success": true,
  "message": "Estadísticas de cotizaciones obtenidas",
  "data": {
    "totalCotizaciones": 150,
    "cotizacionesByStatus": [
      { "status": "pendiente", "count": "45" },
      { "status": "aprobada", "count": "60" },
      { "status": "rechazada", "count": "30" },
      { "status": "en_proceso", "count": "15" }
    ],
    "recentCotizaciones": 23
  }
}
```

**Campos:**
- `totalCotizaciones` (number) - Total de cotizaciones en el sistema
- `cotizacionesByStatus` (array) - Conteo de cotizaciones por estado
- `recentCotizaciones` (number) - Cotizaciones recibidas en los últimos 30 días

---

### 🔄 Actualizar Estado Masivo
**PUT** `/api/cotizaciones/bulk-status`

Actualiza el estado de múltiples cotizaciones a la vez.

**Requiere Autenticación:** ✅ Sí (Admin)

**Request Body:**
```json
{
  "ids": [1, 2, 5, 8, 12],
  "status": "en_proceso"
}
```

**Campos:**
- `ids` (array) - Array de IDs de cotizaciones (requerido)
- `status` (string) - Nuevo estado para todas (requerido)
  - Valores: `pendiente`, `aprobada`, `rechazada`, `en_proceso`

**Response:**
```json
{
  "success": true,
  "message": "5 cotizaciones actualizadas exitosamente",
  "data": {
    "updatedCount": 5,
    "updatedIds": [1, 2, 5, 8, 12]
  }
}
```

**Errores:**
- `400` - Se requiere un array de IDs
- `400` - Estado requerido
- `400` - Estado inválido
- `401` - No autenticado
- `403` - Requiere rol de admin

---

## 📊 Estados de Cotización

| Estado | Descripción | Uso Recomendado |
|--------|-------------|----------------|
| `pendiente` | Recién creada, sin revisar | Estado inicial automático |
| `en_proceso` | Siendo revisada por el equipo | Cuando se está preparando respuesta |
| `aprobada` | Cotización aprobada y enviada | Cliente aceptó, listo para producción |
| `rechazada` | Cotización rechazada o cancelada | Cliente rechazó o no viable |

---

## 🧪 Ejemplos de Prueba

### cURL Examples

**Listar cotizaciones:**
```bash
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  "http://localhost:3000/api/cotizaciones"
```

**Filtrar por estado:**
```bash
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  "http://localhost:3000/api/cotizaciones?status=pendiente&page=1&limit=20"
```

**Crear cotización (público):**
```bash
curl -X POST "http://localhost:3000/api/cotizaciones" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "phone": "+56912345678",
    "message": "Necesito cotizar 50 poleras con logo de empresa"
  }'
```

**Actualizar estado:**
```bash
curl -X PUT "http://localhost:3000/api/cotizaciones/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{"status": "aprobada"}'
```

**Actualización masiva:**
```bash
curl -X PUT "http://localhost:3000/api/cotizaciones/bulk-status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "ids": [1, 2, 3],
    "status": "en_proceso"
  }'
```

**Obtener estadísticas:**
```bash
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  "http://localhost:3000/api/cotizaciones/stats"
```

**Eliminar cotización:**
```bash
curl -X DELETE "http://localhost:3000/api/cotizaciones/26" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## ❌ Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400 | Datos de entrada inválidos |
| 401 | No autenticado / Token inválido |
| 403 | Sin permisos (requiere admin) |
| 404 | Cotización o usuario no encontrado |
| 500 | Error interno del servidor |

---

## 📋 Notas Importantes

1. **Creación Pública:** El endpoint de creación es público para facilitar solicitudes
2. **User ID Opcional:** Si el cliente está autenticado, se puede vincular la cotización
3. **Email Único:** No se valida unicidad de emails en cotizaciones (un cliente puede hacer múltiples solicitudes)
4. **Validación de Email:** Se valida formato básico de email
5. **Búsqueda:** Case-insensitive, busca en mensaje, nombre y email
6. **Paginación:** Default 10 resultados por página
7. **Logs:** Todas las acciones se registran en el sistema de logging
8. **Estados:** Solo los 4 estados definidos son válidos

---

## 🔗 Casos de Uso

### Flujo Típico de Cotización

1. **Cliente solicita cotización:**
   ```
   POST /api/cotizaciones
   Estado inicial: "pendiente"
   ```

2. **Admin revisa y marca en proceso:**
   ```
   PUT /api/cotizaciones/1
   Nuevo estado: "en_proceso"
   ```

3. **Admin responde al cliente (fuera del sistema):**
   - Email o llamada telefónica
   - Cliente decide si acepta o rechaza

4. **Admin actualiza estado final:**
   ```
   PUT /api/cotizaciones/1
   Nuevo estado: "aprobada" o "rechazada"
   ```

5. **Si aprobada, crear pedido en el sistema:**
   - Crear productos según cotización
   - Procesar pago con WebPay
   - Iniciar producción

---

## 🔐 Permisos

| Endpoint | Cliente | Admin |
|----------|---------|-------|
| Crear cotización | ✅ | ✅ |
| Listar cotizaciones | ❌ | ✅ |
| Ver cotización | ❌ | ✅ |
| Actualizar cotización | ❌ | ✅ |
| Eliminar cotización | ❌ | ✅ |
| Estadísticas | ❌ | ✅ |
| Actualización masiva | ❌ | ✅ |

---

**Creado por:** Francisco Campos & Sebastian Mella
**Versión:** 1.0.0
**Fecha:** Octubre 2025
