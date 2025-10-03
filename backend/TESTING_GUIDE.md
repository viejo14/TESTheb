# 🧪 Guía de Testing - TESTheb Backend

Sistema de tests automatizados usando Jest y Supertest para garantizar la calidad del código.

---

## 📋 Tabla de Contenidos

- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecutar Tests](#ejecutar-tests)
- [Estructura de Tests](#estructura-de-tests)
- [Tests Disponibles](#tests-disponibles)
- [Escribir Nuevos Tests](#escribir-nuevos-tests)
- [Coverage](#coverage)

---

## 📦 Instalación

```bash
cd backend
npm install --save-dev jest supertest @babel/preset-env
```

**Estado:** ✅ Ya instalado

---

## ⚙️ Configuración

### Archivos de Configuración

**jest.config.js** - Configuración principal de Jest
```javascript
export default {
  testEnvironment: 'node',
  transform: { '^.+\\.js$': 'babel-jest' },
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: ['src/**/*.js'],
  testTimeout: 10000
}
```

**babel.config.js** - Configuración de Babel para ES modules
```javascript
export default {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }]]
}
```

**jest.setup.js** - Setup global para tests
```javascript
jest.setTimeout(10000)
```

---

## 🚀 Ejecutar Tests

### Todos los Tests

```bash
npm test
```

### Tests en Modo Watch (desarrollo)

```bash
npm test -- --watch
```

### Tests con Coverage

```bash
npm test -- --coverage
```

### Ejecutar Test Específico

```bash
npm test -- auth.test.js
```

### Ejecutar con Verbose Output

```bash
npm test -- --verbose
```

---

## 📁 Estructura de Tests

```
backend/
├── src/
│   ├── __tests__/              # Tests principales
│   │   ├── auth.test.js        # Tests de autenticación
│   │   ├── products.test.js    # Tests de productos
│   │   ├── categories.test.js  # Tests de categorías
│   │   └── validators.test.js  # Tests de validadores
│   │
│   ├── controllers/
│   ├── routes/
│   ├── validators/
│   └── middleware/
│
├── jest.config.js              # Configuración Jest
├── babel.config.js             # Configuración Babel
└── jest.setup.js               # Setup global
```

---

## 📚 Tests Disponibles

### 1️⃣ Auth Tests (auth.test.js)

**Endpoints testeados:**
- ✅ `POST /api/auth/register` - Registro de usuario
- ✅ `POST /api/auth/login` - Inicio de sesión
- ✅ `POST /api/auth/forgot-password` - Recuperar contraseña
- ✅ `GET /api/auth/profile` - Obtener perfil

**Casos de prueba:**
- Registro con datos válidos
- Registro con email inválido
- Registro con contraseña corta
- Login con credenciales válidas
- Login con credenciales incorrectas
- Obtener perfil sin autenticación (401)
- Obtener perfil con token válido

**Ejecutar:**
```bash
npm test -- auth.test.js
```

---

### 2️⃣ Product Tests (products.test.js)

**Endpoints testeados:**
- ✅ `GET /api/products` - Listar productos
- ✅ `GET /api/products/:id` - Obtener producto por ID
- ✅ `GET /api/products/search` - Buscar productos
- ✅ `GET /api/products/category/:categoryId` - Productos por categoría
- ✅ `POST /api/products` - Crear producto (requiere auth)
- ✅ `PUT /api/products/:id` - Actualizar producto (requiere auth)
- ✅ `DELETE /api/products/:id` - Eliminar producto (requiere auth)

**Casos de prueba:**
- Listar todos los productos
- Obtener producto existente
- Obtener producto inexistente (404)
- Buscar productos con query válido
- Buscar sin query (400)
- Crear producto sin autenticación (401)
- Actualizar producto sin autenticación (401)

**Ejecutar:**
```bash
npm test -- products.test.js
```

---

### 3️⃣ Category Tests (categories.test.js)

**Endpoints testeados:**
- ✅ `GET /api/categories` - Listar categorías
- ✅ `GET /api/categories/:id` - Obtener categoría por ID
- ✅ `POST /api/categories` - Crear categoría (requiere auth)
- ✅ `PUT /api/categories/:id` - Actualizar categoría (requiere auth)
- ✅ `DELETE /api/categories/:id` - Eliminar categoría (requiere auth)

**Casos de prueba:**
- Listar todas las categorías
- Obtener categoría existente
- Obtener categoría inexistente (404)
- Operaciones CRUD sin autenticación (401)

**Ejecutar:**
```bash
npm test -- categories.test.js
```

---

### 4️⃣ Validator Tests (validators.test.js)

**Validadores testeados:**
- ✅ registerSchema
- ✅ loginSchema
- ✅ changePasswordSchema
- ✅ forgotPasswordSchema
- ✅ createProductSchema
- ✅ updateProductSchema
- ✅ createCategorySchema
- ✅ createCotizacionSchema

**Casos de prueba:**
- Validación de datos correctos
- Validación de emails inválidos
- Validación de contraseñas cortas
- Validación de campos requeridos
- Validación de precios negativos
- Validación de URLs inválidas
- Aplicación de valores por defecto

**Ejecutar:**
```bash
npm test -- validators.test.js
```

---

## ✍️ Escribir Nuevos Tests

### Ejemplo: Test de Endpoint

```javascript
import request from 'supertest'
import express from 'express'
import myRoutes from '../routes/myRoutes.js'

const app = express()
app.use(express.json())
app.use('/api/my-endpoint', myRoutes)

describe('Mi Endpoint', () => {

  it('debería hacer algo específico', async () => {
    const response = await request(app)
      .get('/api/my-endpoint')

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('success', true)
  })

  it('debería fallar con datos inválidos', async () => {
    const response = await request(app)
      .post('/api/my-endpoint')
      .send({ invalid: 'data' })

    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
  })
})
```

### Ejemplo: Test de Validador

```javascript
import { mySchema } from '../validators/myValidator.js'

describe('myValidator', () => {

  it('debería validar datos correctos', () => {
    const validData = { field: 'value' }
    const { error } = mySchema.validate(validData)

    expect(error).toBeUndefined()
  })

  it('debería fallar con datos incorrectos', () => {
    const invalidData = { field: '' }
    const { error } = mySchema.validate(invalidData)

    expect(error).toBeDefined()
    expect(error.details[0].path).toContain('field')
  })
})
```

---

## 📊 Coverage

### Generar Reporte de Coverage

```bash
npm test -- --coverage
```

### Output del Coverage

```
----------------------|---------|----------|---------|---------|-------------------
File                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------------------|---------|----------|---------|---------|-------------------
All files             |   85.23 |    78.45 |   90.12 |   85.23 |
 controllers          |   88.76 |    82.34 |   92.50 |   88.76 |
  authController.js   |   90.45 |    85.67 |   95.00 |   90.45 | 45-48,67
  productController.js|   87.12 |    79.23 |   90.00 |   87.12 | 123-125
 validators           |   95.34 |    88.90 |   98.00 |   95.34 |
  authValidator.js    |   98.00 |    92.00 |  100.00 |   98.00 |
----------------------|---------|----------|---------|---------|-------------------
```

### Ver Coverage en HTML

Después de ejecutar con `--coverage`, abre:
```
backend/coverage/lcov-report/index.html
```

---

## 🎯 Matchers de Jest

### Comparaciones Básicas

```javascript
expect(value).toBe(expected)              // ===
expect(value).toEqual(expected)           // Deep equality
expect(value).not.toBe(expected)          // !==
expect(value).toBeNull()                  // === null
expect(value).toBeUndefined()             // === undefined
expect(value).toBeDefined()               // !== undefined
expect(value).toBeTruthy()                // !!value === true
expect(value).toBeFalsy()                 // !!value === false
```

### Números

```javascript
expect(value).toBeGreaterThan(3)
expect(value).toBeGreaterThanOrEqual(3)
expect(value).toBeLessThan(5)
expect(value).toBeLessThanOrEqual(4.5)
expect(value).toBeCloseTo(0.3)            // Decimales
```

### Strings

```javascript
expect(string).toMatch(/pattern/)
expect(string).toContain('substring')
```

### Arrays

```javascript
expect(array).toContain(item)
expect(array).toHaveLength(3)
expect(array).toEqual(expect.arrayContaining([1, 2]))
```

### Objetos

```javascript
expect(obj).toHaveProperty('key')
expect(obj).toHaveProperty('key', value)
expect(obj).toMatchObject({ key: value })
```

### Async

```javascript
await expect(promise).resolves.toBe(value)
await expect(promise).rejects.toThrow()
```

---

## 🔧 Configurar Tests en CI/CD

### GitHub Actions

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install dependencies
        run: cd backend && npm install

      - name: Run tests
        run: cd backend && npm test

      - name: Generate coverage
        run: cd backend && npm test -- --coverage
```

---

## 📝 Buenas Prácticas

1. **Nombres Descriptivos:** Usa `it('debería...')` o `it('should...')`
2. **Un Test = Un Concepto:** Cada test debe validar una sola cosa
3. **Arrange-Act-Assert:** Organiza tests en 3 secciones
   ```javascript
   it('debería crear producto', async () => {
     // Arrange - Preparar datos
     const productData = { name: 'Test', price: 100 }

     // Act - Ejecutar acción
     const response = await request(app).post('/products').send(productData)

     // Assert - Verificar resultado
     expect(response.status).toBe(201)
   })
   ```
4. **Cleanup:** Limpia datos de test después de cada prueba
5. **Mock Externo:** Mockea llamadas a servicios externos (DB, APIs)
6. **Independencia:** Tests no deben depender de otros tests

---

## 🐛 Debugging Tests

### Ejecutar un Solo Test

```bash
npm test -- -t "nombre del test"
```

### Modo Debug

```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Console.log en Tests

```javascript
it('debería hacer algo', () => {
  console.log('Debug:', variable)
  expect(variable).toBe(expected)
})
```

---

## 📋 Checklist de Testing

- [x] Instalar Jest y Supertest
- [x] Configurar Jest para ES modules
- [x] Crear tests de autenticación
- [x] Crear tests de productos
- [x] Crear tests de categorías
- [x] Crear tests de validadores
- [ ] Crear tests de usuarios (admin)
- [ ] Crear tests de cotizaciones
- [ ] Crear tests de WebPay
- [ ] Configurar CI/CD
- [ ] Alcanzar 80% de coverage

---

## 🔗 Referencias

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

---

**Creado por:** Francisco Campos & Sebastian Mella
**Versión:** 1.0.0
**Fecha:** Octubre 2025
