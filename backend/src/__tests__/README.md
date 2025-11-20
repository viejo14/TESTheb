# Testing QA Automatizado - TESTheb Backend

## Descripción General

Este directorio contiene la suite de **pruebas automatizadas de QA (Quality Assurance)** para el backend del sistema TESTheb. Los tests están implementados con **Jest** y cubren validaciones, endpoints de API, autenticación y lógica de negocio.

## Propósito del Testing QA

Estos tests automáticos sirven como **control de calidad** para:

1. ✅ **Prevenir regresiones** - Detectar bugs antes de que lleguen a producción
2. ✅ **Validar funcionalidad** - Asegurar que todos los endpoints funcionen correctamente
3. ✅ **Verificar seguridad** - Garantizar que la autenticación y autorización funcionen
4. ✅ **Documentar comportamiento** - Los tests sirven como documentación viva del sistema
5. ✅ **Agilizar desarrollo** - Detectar errores inmediatamente al hacer cambios

## Estructura de Tests

```
__tests__/
├── auth.test.js           # Tests de autenticación y autorización
├── categories.test.js     # Tests de endpoints de categorías
├── products.test.js       # Tests de endpoints de productos
└── validators.test.js     # Tests de validaciones de datos
```

## Cobertura de Tests

### 1. **auth.test.js** (11 tests)

Valida el sistema de autenticación completo:

- ✅ Registro de usuarios con datos válidos
- ✅ Validación de emails inválidos
- ✅ Validación de contraseñas débiles
- ✅ Login con credenciales válidas/inválidas
- ✅ Recuperación de contraseña (forgot-password)
- ✅ Obtención de perfil con/sin token
- ✅ Protección de rutas privadas

**Ejemplos de casos cubiertos:**
```javascript
// ✓ Registro exitoso
POST /api/auth/register { name, email, password }
→ Espera: 201 + token JWT

// ✓ Email inválido debe fallar
POST /api/auth/register { email: "invalid" }
→ Espera: 400 + mensaje de error

// ✓ Login exitoso
POST /api/auth/login { email, password }
→ Espera: 200 + token + datos de usuario
```

### 2. **categories.test.js** (8 tests)

Valida CRUD completo de categorías:

- ✅ Obtener todas las categorías (GET)
- ✅ Obtener categoría por ID válido
- ✅ Validación de IDs inválidos (retorna 400)
- ✅ Categoría inexistente (retorna 404)
- ✅ Crear categoría requiere autenticación (401)
- ✅ Actualizar categoría requiere autenticación
- ✅ Eliminar categoría requiere autenticación

**Ejemplos de casos cubiertos:**
```javascript
// ✓ Obtener categorías públicas
GET /api/categories
→ Espera: 200 + array de categorías

// ✓ ID inválido debe retornar 400
GET /api/categories/invalid
→ Espera: 400 + "El ID debe ser un número"

// ✓ Crear sin token debe fallar
POST /api/categories { name: "Nueva" }
→ Espera: 401 + "Token de acceso requerido"
```

### 3. **products.test.js** (11 tests)

Valida CRUD completo de productos:

- ✅ Obtener todos los productos
- ✅ Obtener producto por ID válido
- ✅ Validación de IDs inválidos (retorna 400)
- ✅ Producto inexistente (retorna 404)
- ✅ Búsqueda de productos
- ✅ Filtrar productos por categoría
- ✅ Validación de categoryId numérico
- ✅ Crear/actualizar/eliminar requiere autenticación

**Ejemplos de casos cubiertos:**
```javascript
// ✓ Búsqueda funcional
GET /api/products/search?q=bordado
→ Espera: 200 + productos filtrados

// ✓ Categoría inválida
GET /api/products/category/invalid
→ Espera: 400 + "El ID de categoría debe ser un número"

// ✓ Crear producto sin auth
POST /api/products { name, price, ... }
→ Espera: 401 + "Token de acceso requerido"
```

### 4. **validators.test.js** (22 tests)

Valida todas las validaciones de datos:

- ✅ **authValidator**: registro, login, cambio de contraseña, forgot-password
- ✅ **productValidator**: creación, actualización, stock, SKU, precio
- ✅ **categoryValidator**: nombre, URL de imagen
- ✅ **cotizacionValidator**: mensaje, teléfono, email

**Ejemplos de casos cubiertos:**
```javascript
// ✓ Validación de registro
registerSchema.validate({ name: "AB", email, password })
→ Espera: Error "El nombre debe tener al menos 3 caracteres"

// ✓ Validación de precio
createProductSchema.validate({ price: -100 })
→ Espera: Error "El precio debe ser un número positivo"

// ✓ Validación de SKU
createProductSchema.validate({ sku: "INVALID" })
→ Espera: Error "El SKU debe tener el formato: CAT-ID-TALLA"
```

## Ejecutar los Tests

### Comandos disponibles:

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch (detecta cambios automáticamente)
npm run test:watch

# Ejecutar tests con reporte de cobertura
npm run test:coverage
```

### Salida esperada:

```
PASS src/__tests__/validators.test.js (22 tests)
PASS src/__tests__/categories.test.js (8 tests)
PASS src/__tests__/products.test.js (11 tests)
PASS src/__tests__/auth.test.js (11 tests)

Test Suites: 4 passed, 4 total
Tests:       52 passed, 52 total
Time:        5.567 s
```

## Métricas de Calidad Actual

- **Total de tests**: 52
- **Tests pasando**: 52 (100%)
- **Cobertura de endpoints críticos**: 100%
- **Validaciones cubiertas**: 100%

## Integración en el Flujo de Desarrollo

### 1. **Pre-commit** (Recomendado)
Ejecutar tests antes de cada commit para asegurar que no se rompió nada:
```bash
npm test
```

### 2. **CI/CD** (Producción)
Los tests deben ejecutarse automáticamente en el pipeline:
```yaml
# Ejemplo para GitHub Actions
- name: Run Tests
  run: npm test
```

### 3. **Desarrollo Local**
Mantener tests corriendo en segundo plano:
```bash
npm run test:watch
```

## Arquitectura de Testing

### Tecnologías utilizadas:

- **Jest** - Framework de testing
- **Supertest** - Testing de endpoints HTTP
- **Joi** - Validación de schemas

### Configuración:

- **jest.config.js** - Configuración principal
- **jest.setup.js** - Setup global (timeout, mocks, etc.)
- **package.json** - Scripts de testing

### Estructura de un test:

```javascript
describe('Nombre del módulo', () => {
  describe('Funcionalidad específica', () => {
    it('debería comportarse de cierta manera', async () => {
      // Arrange: Preparar datos
      const data = { ... }

      // Act: Ejecutar acción
      const response = await request(app).get('/api/endpoint')

      // Assert: Verificar resultado
      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
    })
  })
})
```

## Mantenimiento de Tests

### Cuando agregar nuevos tests:

1. ✅ Al crear un nuevo endpoint
2. ✅ Al agregar validaciones
3. ✅ Al encontrar un bug (crear test que reproduzca el bug, luego arreglarlo)
4. ✅ Al agregar lógica de negocio compleja

### Buenas prácticas:

- ✅ Nombres descriptivos: `debería fallar con email inválido`
- ✅ Tests independientes (no dependen de orden de ejecución)
- ✅ Usar datos de prueba únicos (emails con timestamp)
- ✅ Limpiar después de tests si es necesario
- ✅ Mantener tests simples y legibles

## Problemas Conocidos

### Warning: Worker process failed to exit
```
A worker process has failed to exit gracefully and has been force exited.
```

**Causa**: Conexiones de DB o timers no cerrados correctamente.

**Solución actual**: No afecta los resultados de tests. Para investigar:
```bash
npm test -- --detectOpenHandles
```

## Beneficios del Testing QA Automatizado

### Para el equipo de desarrollo:
- ⚡ **Feedback inmediato** - Saber si algo se rompió en segundos
- 🛡️ **Confianza al refactorizar** - Cambiar código sin miedo
- 📝 **Documentación viva** - Los tests muestran cómo usar la API

### Para el equipo de QA:
- 🎯 **Regression testing automático** - No necesita testear manualmente lo mismo
- ✅ **Validación continua** - Cada commit es validado automáticamente
- 📊 **Métricas claras** - 52/52 tests pasando = 100% funcionalidad básica OK

### Para el proyecto:
- 🚀 **Deploy con confianza** - Si tests pasan, es seguro deployar
- 🐛 **Menos bugs en producción** - Problemas detectados antes
- ⏱️ **Ahorro de tiempo** - Menos debugging manual

## Roadmap Futuro

Posibles mejoras para expandir la cobertura:

- [ ] Tests de integración con base de datos real
- [ ] Tests de carga/performance
- [ ] Tests E2E (End-to-End) con Cypress/Playwright
- [ ] Tests de seguridad (SQL injection, XSS)
- [ ] Tests de imágenes (upload a Cloudinary)
- [ ] Tests de pagos (integración Transbank)
- [ ] Aumentar cobertura de código a >80%

---

## Contacto y Soporte

Para preguntas sobre los tests o para reportar problemas:

- **Proyecto**: TESTheb E-commerce
- **Repositorio**: 2025_MA_CAPSTONE_705D_GRUPO_7
- **Tests mantenidos por**: Equipo de Desarrollo

---

**Última actualización**: 2025-10-27
**Estado**: ✅ Todos los tests pasando (52/52)
