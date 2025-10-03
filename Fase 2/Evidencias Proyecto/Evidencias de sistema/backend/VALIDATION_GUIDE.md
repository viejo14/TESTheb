# 🛡️ Guía de Validaciones con Joi - TESTheb Backend

Sistema de validación de datos usando la biblioteca Joi para garantizar la integridad de los datos en el backend.

---

## 📋 Tabla de Contenidos

- [Instalación](#instalación)
- [Estructura](#estructura)
- [Uso Básico](#uso-básico)
- [Validadores Disponibles](#validadores-disponibles)
- [Aplicar en Rutas](#aplicar-en-rutas)
- [Ejemplos](#ejemplos)

---

## 📦 Instalación

```bash
cd backend
npm install joi
```

**Estado:** ✅ Ya instalado

---

## 📁 Estructura

```
backend/src/
├── validators/
│   ├── authValidator.js          # Validaciones de autenticación
│   ├── productValidator.js       # Validaciones de productos
│   ├── categoryValidator.js      # Validaciones de categorías
│   ├── cotizacionValidator.js    # Validaciones de cotizaciones
│   ├── userValidator.js          # Validaciones de usuarios
│   └── webpayValidator.js        # Validaciones de WebPay
│
└── middleware/
    └── validate.js               # Middleware de validación
```

---

## 🚀 Uso Básico

### 1. Importar Validador y Middleware

```javascript
import { validateBody, validateQuery, validateParams } from '../middleware/validate.js'
import { createProductSchema, updateProductSchema } from '../validators/productValidator.js'
```

### 2. Aplicar en Rutas

```javascript
// Validar body en POST
router.post('/products',
  authenticateToken,
  requireAdmin,
  validateBody(createProductSchema),
  createProduct
)

// Validar params en GET
router.get('/products/:id',
  validateParams(idParamSchema),
  getProductById
)

// Validar query en búsqueda
router.get('/products/search',
  validateQuery(searchProductsSchema),
  searchProducts
)
```

### 3. Validar Múltiples Fuentes

```javascript
import { validate } from '../middleware/validate.js'

router.put('/products/:id',
  authenticateToken,
  requireAdmin,
  validate({
    params: idParamSchema,
    body: updateProductSchema
  }),
  updateProduct
)
```

---

## 📚 Validadores Disponibles

### 🔐 authValidator.js

| Schema | Descripción | Campos Requeridos |
|--------|-------------|-------------------|
| `registerSchema` | Registro de usuario | name, email, password |
| `loginSchema` | Inicio de sesión | email, password |
| `updateProfileSchema` | Actualización de perfil | Al menos uno |
| `changePasswordSchema` | Cambio de contraseña | currentPassword, newPassword |
| `forgotPasswordSchema` | Recuperar contraseña | email |
| `resetPasswordSchema` | Restablecer contraseña | token, newPassword |

**Validaciones:**
- Email: Formato válido
- Password: Mínimo 6 caracteres, máximo 100
- Name: Mínimo 3 caracteres, máximo 100
- Role: Solo `customer`, `admin`, `employee`

---

### 📦 productValidator.js

| Schema | Descripción | Campos Requeridos |
|--------|-------------|-------------------|
| `createProductSchema` | Crear producto | name, price |
| `updateProductSchema` | Actualizar producto | Al menos uno |
| `searchProductsSchema` | Búsqueda de productos | q (query) |
| `idParamSchema` | Validar ID en params | id |

**Validaciones:**
- Name: 3-200 caracteres
- Price: Entero positivo (CLP)
- Stock: Entero ≥ 0
- Category ID: Entero positivo o null
- Image URL: URI válida o null

---

### 🏷️ categoryValidator.js

| Schema | Descripción | Campos Requeridos |
|--------|-------------|-------------------|
| `createCategorySchema` | Crear categoría | name |
| `updateCategorySchema` | Actualizar categoría | name |

**Validaciones:**
- Name: 3-100 caracteres
- Image URL: URI válida o null

---

### 📋 cotizacionValidator.js

| Schema | Descripción | Campos Requeridos |
|--------|-------------|-------------------|
| `createCotizacionSchema` | Crear cotización | name, email, message |
| `updateCotizacionSchema` | Actualizar cotización | Al menos uno |
| `bulkStatusSchema` | Actualización masiva | ids, status |

**Validaciones:**
- Name: 3-100 caracteres
- Email: Formato válido
- Phone: 8-15 dígitos (opcional)
- Message: 10-2000 caracteres
- Status: `pendiente`, `aprobada`, `rechazada`, `en_proceso`

---

### 👥 userValidator.js

| Schema | Descripción | Campos Requeridos |
|--------|-------------|-------------------|
| `createUserSchema` | Crear usuario (admin) | name, email |
| `updateUserSchema` | Actualizar usuario | Al menos uno |
| `paginationSchema` | Parámetros de paginación | Ninguno (defaults) |

**Validaciones:**
- Name: 3-100 caracteres
- Email: Formato válido
- Role: `customer`, `admin`, `employee`
- Page: Entero positivo (default: 1)
- Limit: 1-100 (default: 10)

---

### 💳 webpayValidator.js

| Schema | Descripción | Campos Requeridos |
|--------|-------------|-------------------|
| `createTransactionSchema` | Crear transacción | amount, sessionId |
| `commitTransactionSchema` | Confirmar transacción | token_ws o TBK_TOKEN |

**Validaciones:**
- Amount: Entero positivo
- Session ID: String requerido
- Return URL: URI válida (opcional)
- Order Data: Objeto con estructura validada

---

## 🔧 Middleware de Validación

El archivo `middleware/validate.js` proporciona tres middlewares:

### `validateBody(schema)`

Valida el cuerpo de la request (req.body)

```javascript
router.post('/products',
  validateBody(createProductSchema),
  createProduct
)
```

### `validateQuery(schema)`

Valida los query parameters (req.query)

```javascript
router.get('/products/search',
  validateQuery(searchProductsSchema),
  searchProducts
)
```

### `validateParams(schema)`

Valida los route parameters (req.params)

```javascript
router.get('/products/:id',
  validateParams(idParamSchema),
  getProductById
)
```

### `validate(schemas)`

Validación combinada para body, query y params

```javascript
router.get('/users',
  validate({
    query: paginationSchema
  }),
  getAllUsers
)

router.put('/products/:id',
  validate({
    params: idParamSchema,
    body: updateProductSchema
  }),
  updateProduct
)
```

---

## 📝 Ejemplos Completos

### Ejemplo 1: Rutas de Autenticación

```javascript
// backend/src/routes/authRoutes.js
import express from 'express'
import { validateBody } from '../middleware/validate.js'
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from '../validators/authValidator.js'
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  logout
} from '../controllers/authController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Rutas públicas
router.post('/register', validateBody(registerSchema), register)
router.post('/login', validateBody(loginSchema), login)
router.post('/forgot-password', validateBody(forgotPasswordSchema), forgotPassword)
router.post('/reset-password', validateBody(resetPasswordSchema), resetPassword)

// Rutas protegidas
router.get('/profile', authenticateToken, getProfile)
router.put('/profile', authenticateToken, validateBody(updateProfileSchema), updateProfile)
router.post('/change-password', authenticateToken, validateBody(changePasswordSchema), changePassword)
router.post('/logout', authenticateToken, logout)

export default router
```

### Ejemplo 2: Rutas de Productos

```javascript
// backend/src/routes/productRoutes.js
import express from 'express'
import { validateBody, validateQuery, validateParams, validate } from '../middleware/validate.js'
import {
  createProductSchema,
  updateProductSchema,
  searchProductsSchema,
  idParamSchema
} from '../validators/productValidator.js'
import {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js'
import { authenticateToken, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// Rutas públicas
router.get('/', getAllProducts)
router.get('/search', validateQuery(searchProductsSchema), searchProducts)
router.get('/category/:categoryId', validateParams(idParamSchema), getProductsByCategory)
router.get('/:id', validateParams(idParamSchema), getProductById)

// Rutas admin
router.post('/',
  authenticateToken,
  requireAdmin,
  validateBody(createProductSchema),
  createProduct
)

router.put('/:id',
  authenticateToken,
  requireAdmin,
  validate({
    params: idParamSchema,
    body: updateProductSchema
  }),
  updateProduct
)

router.delete('/:id',
  authenticateToken,
  requireAdmin,
  validateParams(idParamSchema),
  deleteProduct
)

export default router
```

### Ejemplo 3: Rutas de Cotizaciones

```javascript
// backend/src/routes/cotizacionRoutes.js
import express from 'express'
import { validateBody, validateParams, validate } from '../middleware/validate.js'
import {
  createCotizacionSchema,
  updateCotizacionSchema,
  bulkStatusSchema
} from '../validators/cotizacionValidator.js'
import { idParamSchema } from '../validators/productValidator.js'
import { paginationSchema } from '../validators/userValidator.js'
import {
  getAllCotizaciones,
  getCotizacionById,
  createCotizacion,
  updateCotizacion,
  deleteCotizacion,
  getCotizacionStats,
  updateBulkStatus
} from '../controllers/cotizacionController.js'
import { authenticateToken, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// Ruta pública para crear cotización
router.post('/', validateBody(createCotizacionSchema), createCotizacion)

// Rutas admin
router.get('/',
  authenticateToken,
  requireAdmin,
  validate({ query: paginationSchema }),
  getAllCotizaciones
)

router.get('/stats', authenticateToken, requireAdmin, getCotizacionStats)

router.get('/:id',
  authenticateToken,
  requireAdmin,
  validateParams(idParamSchema),
  getCotizacionById
)

router.put('/:id',
  authenticateToken,
  requireAdmin,
  validate({
    params: idParamSchema,
    body: updateCotizacionSchema
  }),
  updateCotizacion
)

router.put('/bulk-status',
  authenticateToken,
  requireAdmin,
  validateBody(bulkStatusSchema),
  updateBulkStatus
)

router.delete('/:id',
  authenticateToken,
  requireAdmin,
  validateParams(idParamSchema),
  deleteCotizacion
)

export default router
```

---

## ✅ Respuestas de Error

Cuando la validación falla, el middleware retorna:

```json
{
  "success": false,
  "message": "Error de validación",
  "errors": [
    {
      "field": "email",
      "message": "El email debe ser válido"
    },
    {
      "field": "password",
      "message": "La contraseña debe tener al menos 6 caracteres"
    }
  ]
}
```

**Código HTTP:** `400 Bad Request`

---

## 🎯 Beneficios

1. **Validación Centralizada:** Schemas reutilizables
2. **Mensajes Personalizados:** Errores en español, claros
3. **Type Coercion:** Conversión automática de tipos
4. **Defaults:** Valores por defecto aplicados automáticamente
5. **Strip Unknown:** Campos no permitidos son eliminados
6. **Seguridad:** Previene inyección de datos maliciosos
7. **Documentación:** Schemas sirven como documentación

---

## 📋 Checklist de Implementación

- [x] Instalar Joi
- [x] Crear validadores para todos los módulos
- [x] Crear middleware de validación
- [ ] Aplicar validadores en todas las rutas
- [ ] Probar endpoints con datos inválidos
- [ ] Documentar en API docs

---

## 🔗 Referencias

- [Joi Documentation](https://joi.dev/api/)
- [Joi Validation Guide](https://joi.dev/api/?v=17.10.0)
- [Express Middleware](https://expressjs.com/en/guide/using-middleware.html)

---

**Creado por:** Francisco Campos & Sebastian Mella
**Versión:** 1.0.0
**Fecha:** Octubre 2025
