# 👥 API de Administración de Usuarios TESTheb

Documentación de endpoints de gestión de usuarios para administradores del sistema TESTheb.

**⚠️ IMPORTANTE:** Todos los endpoints de esta API requieren autenticación con rol de **Administrador**.

---

## Endpoints Disponibles

### 📋 Listar Todos los Usuarios
**GET** `/api/users`

Obtiene una lista paginada de usuarios del sistema con opción de búsqueda.

**Requiere Autenticación:** ✅ Sí (Admin)

**Query Parameters:**
- `page` (number) - Página actual (default: 1)
- `limit` (number) - Resultados por página (default: 10)
- `search` (string) - Búsqueda por nombre o email (opcional)

**Ejemplos:**
```
GET /api/users
GET /api/users?page=2&limit=20
GET /api/users?search=juan
```

**Response:**
```json
{
  "success": true,
  "message": "Usuarios obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "role": "customer",
      "created_at": "2025-09-28T10:00:00.000Z",
      "updated_at": "2025-09-28T10:00:00.000Z"
    },
    {
      "id": 2,
      "name": "María González",
      "email": "maria@example.com",
      "role": "admin",
      "created_at": "2025-09-28T11:00:00.000Z",
      "updated_at": "2025-09-28T11:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalUsers": 47,
    "limit": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

**Nota:** Las contraseñas nunca se devuelven en las respuestas.

---

### 🔍 Obtener Usuario por ID
**GET** `/api/users/:id`

Obtiene los detalles de un usuario específico.

**Requiere Autenticación:** ✅ Sí (Admin)

**Parámetros de URL:**
- `id` (number) - ID del usuario

**Response:**
```json
{
  "success": true,
  "message": "Usuario obtenido exitosamente",
  "data": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "role": "customer",
    "created_at": "2025-09-28T10:00:00.000Z",
    "updated_at": "2025-10-01T14:30:00.000Z"
  }
}
```

**Errores:**
- `400` - ID de usuario inválido
- `404` - Usuario no encontrado
- `401` - No autenticado
- `403` - Requiere rol de admin

---

### ➕ Crear Usuario
**POST** `/api/users`

Crea un nuevo usuario en el sistema.

**Requiere Autenticación:** ✅ Sí (Admin)

**Request Body:**
```json
{
  "name": "Carlos Rodríguez",
  "email": "carlos@example.com",
  "role": "customer"
}
```

**Campos:**
- `name` (string) - Nombre completo del usuario (requerido)
- `email` (string) - Email del usuario (requerido, debe ser válido)
- `role` (string) - Rol del usuario (opcional, default: "user")
  - Valores: `customer`, `admin`, `employee`

**Response:**
```json
{
  "success": true,
  "message": "Usuario creado exitosamente",
  "data": {
    "id": 48,
    "name": "Carlos Rodríguez",
    "email": "carlos@example.com",
    "role": "customer",
    "created_at": "2025-10-01T15:00:00.000Z"
  }
}
```

**Errores:**
- `400` - Nombre y email son requeridos
- `400` - Formato de email inválido
- `409` - El email ya está registrado
- `401` - No autenticado
- `403` - Requiere rol de admin

**Nota:** Este endpoint crea usuarios sin contraseña. Para crear usuarios con credenciales completas, usar `/api/auth/register`.

---

### ✏️ Actualizar Usuario
**PUT** `/api/users/:id`

Actualiza la información de un usuario existente.

**Requiere Autenticación:** ✅ Sí (Admin)

**Parámetros de URL:**
- `id` (number) - ID del usuario

**Request Body:**
```json
{
  "name": "Juan Pérez Actualizado",
  "email": "juan.nuevo@example.com",
  "role": "admin"
}
```

**Campos (todos opcionales):**
- `name` (string) - Nuevo nombre del usuario
- `email` (string) - Nuevo email (debe ser válido y no estar en uso)
- `role` (string) - Nuevo rol (`customer`, `admin`, `employee`)

**Response:**
```json
{
  "success": true,
  "message": "Usuario actualizado exitosamente",
  "data": {
    "id": 1,
    "name": "Juan Pérez Actualizado",
    "email": "juan.nuevo@example.com",
    "role": "admin",
    "created_at": "2025-09-28T10:00:00.000Z",
    "updated_at": "2025-10-01T15:30:00.000Z"
  }
}
```

**Errores:**
- `400` - ID de usuario inválido
- `400` - Formato de email inválido
- `400` - No se proporcionaron campos para actualizar
- `404` - Usuario no encontrado
- `409` - El email ya está en uso por otro usuario
- `401` - No autenticado
- `403` - Requiere rol de admin

---

### 🗑️ Eliminar Usuario
**DELETE** `/api/users/:id`

Elimina un usuario del sistema.

**Requiere Autenticación:** ✅ Sí (Admin)

**Parámetros de URL:**
- `id` (number) - ID del usuario

**Response:**
```json
{
  "success": true,
  "message": "Usuario eliminado exitosamente"
}
```

**Errores:**
- `400` - ID de usuario inválido
- `404` - Usuario no encontrado
- `401` - No autenticado
- `403` - Requiere rol de admin

**⚠️ Advertencia:** Esta acción es irreversible y eliminará permanentemente al usuario del sistema.

---

### 📊 Obtener Estadísticas de Usuarios
**GET** `/api/users/stats`

Obtiene estadísticas generales de usuarios del sistema.

**Requiere Autenticación:** ✅ Sí (Admin)

**Response:**
```json
{
  "success": true,
  "message": "Estadísticas de usuarios obtenidas",
  "data": {
    "totalUsers": 47,
    "usersByRole": [
      { "role": "customer", "count": "40" },
      { "role": "admin", "count": "5" },
      { "role": "employee", "count": "2" }
    ],
    "recentUsers": 12
  }
}
```

**Campos:**
- `totalUsers` (number) - Total de usuarios en el sistema
- `usersByRole` (array) - Conteo de usuarios por rol
- `recentUsers` (number) - Usuarios registrados en los últimos 30 días

---

## 👤 Roles de Usuario

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| `customer` | Cliente regular | Acceso a tienda, perfil, compras |
| `admin` | Administrador | Acceso total al sistema |
| `employee` | Empleado | Acceso a funciones administrativas limitadas |

---

## 🧪 Ejemplos de Prueba

### cURL Examples

**Listar usuarios (primera página):**
```bash
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  "http://localhost:3000/api/users"
```

**Buscar usuarios:**
```bash
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  "http://localhost:3000/api/users?search=juan&page=1&limit=10"
```

**Obtener usuario por ID:**
```bash
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  "http://localhost:3000/api/users/1"
```

**Crear usuario:**
```bash
curl -X POST "http://localhost:3000/api/users" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Carlos Rodríguez",
    "email": "carlos@example.com",
    "role": "customer"
  }'
```

**Actualizar usuario:**
```bash
curl -X PUT "http://localhost:3000/api/users/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Juan Pérez Actualizado",
    "role": "admin"
  }'
```

**Eliminar usuario:**
```bash
curl -X DELETE "http://localhost:3000/api/users/48" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Obtener estadísticas:**
```bash
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  "http://localhost:3000/api/users/stats"
```

---

## ❌ Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400 | Datos de entrada inválidos |
| 401 | No autenticado / Token inválido |
| 403 | Sin permisos (requiere admin) |
| 404 | Usuario no encontrado |
| 409 | Email ya registrado / en uso |
| 500 | Error interno del servidor |

---

## 📋 Notas Importantes

1. **Seguridad:** Todos los endpoints requieren token JWT válido con rol `admin`
2. **Contraseñas:** Este módulo NO maneja contraseñas. Para eso usar `/api/auth/*`
3. **Paginación:** Por defecto se muestran 10 usuarios por página
4. **Búsqueda:** Case-insensitive, busca en nombre y email
5. **Emails Únicos:** El email debe ser único en el sistema
6. **Logs:** Todas las acciones administrativas se registran en los logs del sistema
7. **Validación de Email:** Se valida formato básico de email (regex)

---

## 🔗 Endpoints Relacionados

Para gestión de autenticación y perfil de usuarios:
- **Registro:** `POST /api/auth/register`
- **Perfil propio:** `GET /api/auth/profile`
- **Cambiar contraseña:** `POST /api/auth/change-password`

Ver documentación: [AUTH_API_DOCS.md](./AUTH_API_DOCS.md)

---

## 🔒 Diferencias con API de Auth

| Característica | `/api/users` (Admin) | `/api/auth` (Público/Usuario) |
|----------------|---------------------|-------------------------------|
| Requiere Admin | ✅ Sí | ❌ No |
| Ver todos los usuarios | ✅ Sí | ❌ No |
| Editar cualquier usuario | ✅ Sí | Solo perfil propio |
| Cambiar rol | ✅ Sí | ❌ No |
| Eliminar usuarios | ✅ Sí | ❌ No |
| Estadísticas | ✅ Sí | ❌ No |

---

**Creado por:** Francisco Campos & Sebastian Mella
**Versión:** 1.0.0
**Fecha:** Octubre 2025
