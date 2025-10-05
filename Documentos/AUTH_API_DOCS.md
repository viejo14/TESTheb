# 🔐 API de Autenticación TESTheb

Documentación de endpoints de autenticación JWT para el sistema TESTheb.

## Endpoints Disponibles

### 🔑 Registro de Usuario
**POST** `/api/auth/register`

Registra un nuevo usuario en el sistema.

**Request Body:**
```json
{
  "name": "Francisco Campos",
  "email": "francisco@testheb.cl",
  "password": "francisco123",
  "role": "customer" // opcional, default: "customer"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": 6,
      "name": "Francisco Campos",
      "email": "francisco@testheb.cl",
      "role": "customer",
      "createdAt": "2025-09-28T15:18:39.851Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  }
}
```

---

### 🚪 Inicio de Sesión
**POST** `/api/auth/login`

Autentica un usuario existente.

**Request Body:**
```json
{
  "email": "francisco@testheb.cl",
  "password": "francisco123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "user": {
      "id": 6,
      "name": "Francisco Campos",
      "email": "francisco@testheb.cl",
      "role": "customer",
      "createdAt": "2025-09-28T15:18:39.851Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  }
}
```

---

### 👤 Obtener Perfil
**GET** `/api/auth/profile`

Obtiene la información del usuario autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 6,
      "name": "Francisco Campos",
      "email": "francisco@testheb.cl",
      "role": "customer",
      "active": true,
      "createdAt": "2025-09-28T15:18:39.851Z",
      "lastLogin": "2025-09-28T15:19:22.774Z"
    }
  }
}
```

---

### ✏️ Actualizar Perfil
**PUT** `/api/auth/profile`

Actualiza la información del usuario autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Francisco Campos Nuevo",
  "email": "nuevo@testheb.cl"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Perfil actualizado exitosamente",
  "data": {
    "user": {
      "id": 6,
      "name": "Francisco Campos Nuevo",
      "email": "nuevo@testheb.cl",
      "role": "customer",
      "createdAt": "2025-09-28T15:18:39.851Z",
      "updatedAt": "2025-09-28T15:25:00.000Z"
    }
  }
}
```

---

### 🔒 Cambiar Contraseña
**POST** `/api/auth/change-password`

Cambia la contraseña del usuario autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "francisco123",
  "newPassword": "nueva_password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Contraseña cambiada exitosamente"
}
```

---

### 🚪 Cerrar Sesión
**POST** `/api/auth/logout`

Cierra la sesión del usuario (opcional).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Sesión cerrada exitosamente"
}
```

---

## 🛡️ Seguridad

### JWT Tokens
- **Algoritmo**: HS256
- **Duración**: 24 horas
- **Refresh Token**: 7 días
- **Issuer**: testheb-api
- **Audience**: testheb-users

### Validaciones
- **Email**: Formato válido requerido
- **Contraseña**: Mínimo 6 caracteres
- **Hash**: bcrypt con 12 salt rounds

### Roles Disponibles
- `customer` - Cliente (default)
- `admin` - Administrador
- `employee` - Empleado

---

## 🧪 Ejemplos de Prueba

### cURL Examples

**Registro:**
```bash
curl -X POST "http://localhost:3000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@testheb.cl", "password": "test123"}'
```

**Login:**
```bash
curl -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@testheb.cl", "password": "test123"}'
```

**Perfil:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/auth/profile"
```

---

## ❌ Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400 | Datos de entrada inválidos |
| 401 | No autenticado / Token inválido |
| 403 | Sin permisos |
| 409 | Email ya registrado |
| 500 | Error interno del servidor |

---

## 🔧 Variables de Entorno

```env
JWT_SECRET=testheb-secret-key-2025
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=testheb-refresh-secret-2025
JWT_REFRESH_EXPIRES_IN=7d
```

---

**Creado por:** Francisco Campos & Sebastian Mella
**Versión:** 1.0.0
**Fecha:** Septiembre 2025