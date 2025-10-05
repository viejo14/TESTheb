# 📚 Documentación de APIs - TESTheb Backend

Índice completo de la documentación de APIs del sistema TESTheb.

---

## 📖 Documentación Disponible

### 🔐 Autenticación
**[AUTH_API_DOCS.md](./AUTH_API_DOCS.md)**

Sistema completo de autenticación JWT con gestión de usuarios.

**Endpoints:**
- ✅ Registro de usuarios
- ✅ Inicio de sesión
- ✅ Gestión de perfil
- ✅ Cambio de contraseña
- ✅ Recuperación de contraseña
- ✅ Cierre de sesión

**Características:**
- Tokens JWT con refresh tokens
- Encriptación bcrypt
- Validaciones de seguridad
- Roles de usuario (customer, admin, employee)

---

### 📦 Productos
**[PRODUCTS_API_DOCS.md](./PRODUCTS_API_DOCS.md)**

CRUD completo de productos del catálogo con gestión de inventario.

**Endpoints:**
- ✅ Listar productos
- ✅ Obtener producto por ID
- ✅ Productos por categoría
- ✅ Búsqueda de productos
- ✅ Crear producto (admin)
- ✅ Actualizar producto (admin)
- ✅ Eliminar producto (admin)
- ✅ Gestión de tallas

**Características:**
- Sistema de stock por talla
- Relación con categorías
- Imágenes con Cloudinary
- Filtros y búsqueda
- Paginación

---

### 🏷️ Categorías
**[CATEGORIES_API_DOCS.md](./CATEGORIES_API_DOCS.md)**

Gestión de categorías para organizar productos.

**Endpoints:**
- ✅ Listar categorías
- ✅ Obtener categoría por ID
- ✅ Crear categoría (admin)
- ✅ Actualizar categoría (admin)
- ✅ Eliminar categoría (admin)

**Características:**
- Validación de productos asociados
- Imágenes de categoría
- Protección contra eliminación con productos

---

### 💳 WebPay (Pagos)
**[WEBPAY_API_DOCS.md](./WEBPAY_API_DOCS.md)**

Integración completa con Transbank WebPay Plus para procesar pagos.

**Endpoints:**
- ✅ Crear transacción
- ✅ Confirmar transacción (callback)
- ✅ Obtener estado de orden

**Características:**
- Ambiente de testing y producción
- Tarjetas de prueba
- Manejo de estados (autorizado, rechazado, cancelado)
- Logging completo de transacciones
- Redirección automática al frontend

---

### 👥 Administración de Usuarios
**[USERS_API_DOCS.md](./USERS_API_DOCS.md)**

Gestión administrativa de usuarios del sistema (requiere rol admin).

**Endpoints:**
- ✅ Listar usuarios (con paginación)
- ✅ Obtener usuario por ID
- ✅ Crear usuario
- ✅ Actualizar usuario
- ✅ Eliminar usuario
- ✅ Estadísticas de usuarios

**Características:**
- Paginación y búsqueda
- Gestión de roles
- Validación de emails únicos
- Estadísticas por rol
- Logging de acciones administrativas

---

### 📋 Cotizaciones
**[COTIZACIONES_API_DOCS.md](./COTIZACIONES_API_DOCS.md)**

Sistema de solicitud y gestión de cotizaciones para bordados personalizados.

**Endpoints:**
- ✅ Listar cotizaciones (admin)
- ✅ Obtener cotización por ID (admin)
- ✅ Crear cotización (público)
- ✅ Actualizar cotización (admin)
- ✅ Eliminar cotización (admin)
- ✅ Estadísticas de cotizaciones (admin)
- ✅ Actualización masiva de estado (admin)

**Características:**
- Estados de flujo de trabajo
- Filtrado por estado
- Búsqueda por contenido
- Vinculación opcional con usuarios
- Gestión masiva de estados

---

## 🚀 Inicio Rápido

### Configuración del Backend

1. **Instalar dependencias:**
   ```bash
   cd backend
   npm install
   ```

2. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   # Editar .env con tus credenciales
   ```

3. **Configurar base de datos:**
   ```bash
   # Crear base de datos PostgreSQL
   createdb testheb_db

   # Ejecutar migraciones
   psql -d testheb_db -f sql/create_users_table.sql
   psql -d testheb_db -f sql/implement_simple_system.sql
   psql -d testheb_db -f sql/create_orders_table.sql
   ```

4. **Iniciar servidor:**
   ```bash
   npm run dev     # Desarrollo con nodemon
   npm start       # Producción
   ```

El servidor estará disponible en: `http://localhost:3000`

---

## 🔑 Autenticación

La mayoría de endpoints administrativos requieren un token JWT válido.

### Obtener Token

```bash
# 1. Login
curl -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@testheb.cl",
    "password": "admin123"
  }'

# Respuesta:
# {
#   "data": {
#     "token": "eyJhbGciOiJIUzI1NiIs..."
#   }
# }
```

### Usar Token

```bash
# Incluir en header Authorization
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  "http://localhost:3000/api/products"
```

---

## 📊 Estructura de Respuestas

Todas las APIs siguen un formato de respuesta consistente:

### Respuesta Exitosa
```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": { /* ... */ }
}
```

### Respuesta con Paginación
```json
{
  "success": true,
  "message": "Datos obtenidos",
  "data": [ /* ... */ ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "total": 47,
    "limit": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Respuesta de Error
```json
{
  "success": false,
  "message": "Descripción del error",
  "error": "Detalles técnicos (opcional)"
}
```

---

## 🔐 Roles y Permisos

| Rol | Descripción | Acceso |
|-----|-------------|--------|
| **customer** | Cliente regular | Perfil, carrito, compras, cotizaciones |
| **admin** | Administrador | Acceso total a todos los endpoints |
| **employee** | Empleado | Acceso limitado a funciones administrativas |

### Endpoints Públicos (sin autenticación)
- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/categories`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/cotizaciones`
- `POST /api/webpay/*`

### Endpoints Protegidos (requieren auth)
- `GET /api/auth/profile`
- `PUT /api/auth/profile`
- `POST /api/auth/change-password`

### Endpoints Admin (requieren rol admin)
- `POST/PUT/DELETE /api/products`
- `POST/PUT/DELETE /api/categories`
- `GET/POST/PUT/DELETE /api/users`
- `GET/PUT/DELETE /api/cotizaciones` (excepto POST)

---

## 🧪 Testing con Postman

Importa la colección completa de Postman:

**Archivo:** `TESTheb_API.postman_collection.json`

**Guía:** [POSTMAN_GUIDE.md](../POSTMAN_GUIDE.md)

La colección incluye:
- ✅ 32 endpoints pre-configurados
- ✅ Auto-guardado de tokens JWT
- ✅ Variables de entorno
- ✅ Ejemplos de requests
- ✅ Tests automatizados

---

## 📝 Convenciones

### Nomenclatura de Endpoints
```
GET    /api/resource         # Listar todos
GET    /api/resource/:id     # Obtener por ID
POST   /api/resource         # Crear
PUT    /api/resource/:id     # Actualizar
DELETE /api/resource/:id     # Eliminar
```

### Códigos de Estado HTTP
- `200` - OK (éxito en GET, PUT, DELETE)
- `201` - Created (éxito en POST)
- `400` - Bad Request (datos inválidos)
- `401` - Unauthorized (no autenticado)
- `403` - Forbidden (sin permisos)
- `404` - Not Found (recurso no encontrado)
- `409` - Conflict (conflicto, ej: email duplicado)
- `500` - Internal Server Error (error del servidor)

### Formato de Fechas
Todas las fechas usan formato ISO 8601:
```
"2025-10-01T15:30:00.000Z"
```

---

## 🔧 Variables de Entorno

Ver archivo `.env.example` para la lista completa.

**Principales:**
```env
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=testheb_db
DB_USER=tu_usuario
DB_PASSWORD=tu_password

# JWT
JWT_SECRET=tu_jwt_secret
JWT_EXPIRES_IN=24h

# Cloudinary (imágenes)
CLOUDINARY_CLOUD_NAME=tu_cloud
CLOUDINARY_API_KEY=tu_key
CLOUDINARY_API_SECRET=tu_secret

# Transbank (pagos)
WEBPAY_ENVIRONMENT=integration
TBK_COMMERCE_CODE=tu_codigo
TBK_API_KEY=tu_key

# Email (recuperación de contraseña)
EMAIL_SERVICE=gmail
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_app_password
```

---

## 📞 Soporte

Para consultas sobre la API:

- 📧 Email: contacto@testheb.cl
- 📚 Documentación: Ver archivos individuales en `/backend`
- 🐛 Issues: [GitHub Issues](https://github.com/sebamellaisla-sketch/2025_MA_CAPSTONE_705D_GRUPO_7/issues)

---

## 🔄 Versiones

**Versión Actual:** 1.0.0
**Fecha:** Octubre 2025

### Changelog
- ✅ v1.0.0 - Sistema completo de e-commerce con autenticación, productos, pagos y cotizaciones

---

## 📚 Recursos Adicionales

- [Estado del Sistema](../ESTADO_ACTUAL_SISTEMA.md)
- [Guía de Contribución](../CONTRIBUTING.md)
- [Estrategia de Branches](../BRANCHING_STRATEGY.md)
- [Convenciones de Commits](../COMMIT_CONVENTIONS.md)

---

**Desarrollado por:** Francisco Campos & Sebastian Mella
**Proyecto:** APT122 - Capstone Project 2025
**Institución:** DUOC UC
