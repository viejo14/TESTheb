# 📬 Guía de Uso - Colección Postman TESTheb

Esta guía te ayudará a probar todos los endpoints de la API de TESTheb usando Postman.

## 📋 Tabla de Contenidos
- [Instalación de Postman](#instalación-de-postman)
- [Importar Colección](#importar-colección)
- [Configurar Variables](#configurar-variables)
- [Flujo de Pruebas](#flujo-de-pruebas)
- [Endpoints Disponibles](#endpoints-disponibles)

---

## 🔧 Instalación de Postman

### Opción 1: Aplicación de Escritorio (Recomendado)
1. Descargar desde: https://www.postman.com/downloads/
2. Instalar en Windows/Mac/Linux
3. Crear cuenta gratuita (opcional pero recomendado)

### Opción 2: Versión Web
1. Ve a: https://web.postman.co/
2. Crea una cuenta o inicia sesión

---

## 📥 Importar Colección

### Paso 1: Abrir Postman

### Paso 2: Importar el archivo JSON

**Método 1 - Drag & Drop:**
1. Abre Postman
2. Arrastra el archivo `TESTheb_API.postman_collection.json` a la ventana de Postman

**Método 2 - Botón Import:**
1. Click en **"Import"** (esquina superior izquierda)
2. Click en **"Upload Files"**
3. Selecciona `TESTheb_API.postman_collection.json`
4. Click en **"Import"**

### Paso 3: Verificar Importación

En el panel izquierdo deberías ver:
```
📁 TESTheb API
  ├── 🔐 Autenticación
  ├── 📦 Productos
  ├── 🏷️ Categorías
  ├── 💳 WebPay
  ├── 👥 Usuarios (Admin)
  ├── 📋 Cotizaciones
  └── 🔧 Sistema
```

---

## ⚙️ Configurar Variables

### Variables de la Colección

La colección usa estas variables que ya están configuradas:

| Variable | Valor por Defecto | Descripción |
|----------|-------------------|-------------|
| `base_url` | `http://localhost:3000` | URL del backend |
| `auth_token` | (vacío) | Token JWT (se guarda automáticamente) |
| `refresh_token` | (vacío) | Refresh token (se guarda automáticamente) |

### Cambiar la URL del Backend (Si es necesario)

1. Click en la colección **"TESTheb API"**
2. Ve a la pestaña **"Variables"**
3. Cambia `base_url` si tu servidor está en otro puerto o dominio

**Ejemplos:**
- Desarrollo local: `http://localhost:3000`
- Con ngrok: `https://tu-subdominio.ngrok-free.dev`
- Producción: `https://api.testheb.com`

---

## 🚀 Flujo de Pruebas

### 1️⃣ Verificar que el Servidor Funciona

**Endpoint:** `🔧 Sistema > Health Check`

1. Click en "Health Check"
2. Click en **"Send"**
3. Deberías ver:
   ```json
   {
     "message": "TESTheb API funcionando correctamente ✅",
     "timestamp": "2025-10-01T...",
     "version": "1.0.0"
   }
   ```

### 2️⃣ Iniciar Sesión (Obtener Token)

**Endpoint:** `🔐 Autenticación > Login`

1. Click en "Login"
2. En el **Body** verás:
   ```json
   {
     "email": "admin@testheb.cl",
     "password": "admin123"
   }
   ```
3. Click en **"Send"**
4. Deberías recibir:
   ```json
   {
     "success": true,
     "data": {
       "user": {...},
       "token": "eyJhbGciOiJIUzI1NiIs...",
       "refreshToken": "..."
     }
   }
   ```

**✨ IMPORTANTE:** El token se guarda **automáticamente** en la variable `auth_token` gracias a un script que incluye el request. ¡No necesitas copiarlo manualmente!

### 3️⃣ Probar Endpoints Protegidos

Ahora que tienes el token guardado, puedes probar endpoints que requieren autenticación.

**Ejemplo:** `🔐 Autenticación > Obtener Perfil`

1. Click en "Obtener Perfil"
2. Click en **"Send"**
3. Deberías ver tu perfil de usuario

**Nota:** El token se envía automáticamente en el header `Authorization: Bearer {{auth_token}}`

### 4️⃣ Probar CRUD de Productos

**a) Listar Productos:**
- `📦 Productos > Listar Todos los Productos`

**b) Crear Producto (requiere admin):**
- `📦 Productos > Crear Producto (Admin)`
- Modifica el body según necesites
- Click "Send"

**c) Actualizar Producto:**
- `📦 Productos > Actualizar Producto (Admin)`
- Cambia el ID en la URL si es necesario

**d) Eliminar Producto:**
- `📦 Productos > Eliminar Producto (Admin)`

---

## 📚 Endpoints Disponibles

### 🔐 Autenticación (8 endpoints)

| Endpoint | Método | Requiere Auth | Descripción |
|----------|--------|---------------|-------------|
| `/api/auth/register` | POST | ❌ | Registrar usuario |
| `/api/auth/login` | POST | ❌ | Iniciar sesión |
| `/api/auth/profile` | GET | ✅ | Obtener perfil |
| `/api/auth/profile` | PUT | ✅ | Actualizar perfil |
| `/api/auth/change-password` | POST | ✅ | Cambiar contraseña |
| `/api/auth/forgot-password` | POST | ❌ | Recuperar contraseña |
| `/api/auth/reset-password` | POST | ❌ | Restablecer contraseña |
| `/api/auth/logout` | POST | ✅ | Cerrar sesión |

### 📦 Productos (7 endpoints)

| Endpoint | Método | Requiere Auth | Descripción |
|----------|--------|---------------|-------------|
| `/api/products` | GET | ❌ | Listar productos |
| `/api/products/:id` | GET | ❌ | Producto por ID |
| `/api/products/category/:id` | GET | ❌ | Productos por categoría |
| `/api/products/search?q=` | GET | ❌ | Buscar productos |
| `/api/products` | POST | ✅ Admin | Crear producto |
| `/api/products/:id` | PUT | ✅ Admin | Actualizar producto |
| `/api/products/:id` | DELETE | ✅ Admin | Eliminar producto |

### 🏷️ Categorías (5 endpoints)

| Endpoint | Método | Requiere Auth | Descripción |
|----------|--------|---------------|-------------|
| `/api/categories` | GET | ❌ | Listar categorías |
| `/api/categories/:id` | GET | ❌ | Categoría por ID |
| `/api/categories` | POST | ✅ Admin | Crear categoría |
| `/api/categories/:id` | PUT | ✅ Admin | Actualizar categoría |
| `/api/categories/:id` | DELETE | ✅ Admin | Eliminar categoría |

### 💳 WebPay (3 endpoints)

| Endpoint | Método | Requiere Auth | Descripción |
|----------|--------|---------------|-------------|
| `/api/webpay/create` | POST | ❌ | Crear transacción |
| `/api/webpay/commit` | POST | ❌ | Confirmar transacción |
| `/api/webpay/status/:order` | GET | ❌ | Estado de transacción |

### 👥 Usuarios - Admin (4 endpoints)

| Endpoint | Método | Requiere Auth | Descripción |
|----------|--------|---------------|-------------|
| `/api/users` | GET | ✅ Admin | Listar usuarios |
| `/api/users/:id` | GET | ✅ Admin | Usuario por ID |
| `/api/users/:id` | PUT | ✅ Admin | Actualizar usuario |
| `/api/users/:id` | DELETE | ✅ Admin | Eliminar usuario |

### 📋 Cotizaciones (3 endpoints)

| Endpoint | Método | Requiere Auth | Descripción |
|----------|--------|---------------|-------------|
| `/api/cotizaciones` | POST | ❌ | Crear cotización |
| `/api/cotizaciones` | GET | ✅ Admin | Listar cotizaciones |
| `/api/cotizaciones/:id` | GET | ✅ Admin | Cotización por ID |

### 🔧 Sistema (2 endpoints)

| Endpoint | Método | Requiere Auth | Descripción |
|----------|--------|---------------|-------------|
| `/api/health` | GET | ❌ | Health check |
| `/api/test-db` | GET | ❌ | Test de BD |

---

## 🎯 Casos de Uso Comunes

### Caso 1: Registrar y Autenticar Usuario

1. **Registrar**: `POST /api/auth/register`
   ```json
   {
     "name": "Juan Pérez",
     "email": "juan@example.com",
     "password": "password123"
   }
   ```

2. **Login**: `POST /api/auth/login`
   ```json
   {
     "email": "juan@example.com",
     "password": "password123"
   }
   ```
   ✅ Token guardado automáticamente

3. **Ver Perfil**: `GET /api/auth/profile`
   ✅ Usa el token automáticamente

### Caso 2: Gestionar Productos (Admin)

1. **Login como Admin**: `POST /api/auth/login`
   ```json
   {
     "email": "admin@testheb.cl",
     "password": "admin123"
   }
   ```

2. **Crear Producto**: `POST /api/products`
   ```json
   {
     "name": "Polera Bordada",
     "description": "Polera premium",
     "price": 15990,
     "stock": 50,
     "category_id": 1
   }
   ```

3. **Listar Productos**: `GET /api/products`

### Caso 3: Proceso de Compra con WebPay

1. **Crear Transacción**: `POST /api/webpay/create`
   ```json
   {
     "amount": 25000,
     "buyOrder": "ORDER123",
     "sessionId": "SESSION123",
     "returnUrl": "http://localhost:5173/payment/return"
   }
   ```

2. **Confirmar Transacción**: `POST /api/webpay/commit`
   ```json
   {
     "token_ws": "TOKEN_OBTENIDO_DEL_PASO_1"
   }
   ```

3. **Verificar Estado**: `GET /api/webpay/status/ORDER123`

---

## 🔑 Credenciales de Prueba

### Usuario Administrador
```
Email: admin@testheb.cl
Password: admin123
```

### Usuario Cliente (si lo creaste)
```
Email: cliente@testheb.cl
Password: password
```

---

## 💡 Tips y Trucos

### 1. Guardar Respuestas como Ejemplos

Después de hacer un request exitoso:
1. Click en **"Save Response"**
2. Click en **"Save as Example"**
3. Ahora tendrás ejemplos de respuestas exitosas

### 2. Usar Variables en el Body

Puedes usar variables de Postman en el body:
```json
{
  "email": "{{user_email}}",
  "password": "{{user_password}}"
}
```

### 3. Ejecutar Toda la Colección

1. Click derecho en la colección "TESTheb API"
2. Click en **"Run collection"**
3. Selecciona los requests que quieres ejecutar
4. Click en **"Run TESTheb API"**

### 4. Ver Requests en Consola

- Click en **"Console"** (abajo a la izquierda)
- Verás todos los requests, responses, headers, etc.

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to localhost:3000"

**Solución:**
- Verifica que el backend esté corriendo: `npm run dev` en `/backend`
- Verifica la URL en las variables de la colección

### Error: "Unauthorized" o "Token inválido"

**Solución:**
1. Hacer login de nuevo: `POST /api/auth/login`
2. El token se guardará automáticamente
3. Reintentar el request

### El token no se guarda automáticamente

**Solución:**
1. Ve al request "Login"
2. Click en la pestaña **"Tests"**
3. Verifica que esté este código:
   ```javascript
   if (pm.response.code === 200) {
       const response = pm.response.json();
       if (response.data && response.data.token) {
           pm.environment.set('auth_token', response.data.token);
       }
   }
   ```

### Error 500 en el servidor

**Solución:**
- Revisa los logs del backend en la terminal
- Verifica que la base de datos esté corriendo
- Verifica las variables de entorno en `.env`

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs del backend
2. Verifica que todos los servicios estén corriendo
3. Consulta la documentación del proyecto

---

**¡Listo para probar!** 🚀

Empieza con el Health Check y luego el Login. El resto fluirá naturalmente.
