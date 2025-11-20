# 📁 Carpeta Scripts - TESTheb Backend

Esta carpeta contiene **utilidades de desarrollo** para testing y debugging del backend.

⚠️ **IMPORTANTE:** Estos scripts **NO son parte del flujo normal** de la aplicación. Son herramientas manuales para desarrolladores.

---

## 🔍 **Utilidades de Debugging**

Scripts para inspeccionar y verificar el estado de la base de datos:

### **Listar estructura:**
- **`listTables.js`** - Lista todas las tablas de la BD con su cantidad de columnas
  ```bash
  node scripts/listTables.js
  ```

### **Describir tablas:**
- **`describeQuotesTable.js`** - Muestra estructura completa de la tabla `quotes`
- **`describeOrderItemsTable.js`** - Muestra estructura completa de la tabla `order_items`

### **Verificar datos:**
- **`checkOrders.js`** - Verifica el estado de las órdenes
- **`verify-quote.js`** - Verifica una cotización específica
- **`verify-user.js`** - Verifica un usuario específico
- **`verify-order.js`** - Verifica una orden específica

**Uso:**
```bash
node scripts/verify-user.js <email>
node scripts/verify-order.js <order_id>
node scripts/verify-quote.js <quote_id>
```

---

## 🧪 **Scripts de Testing Manual**

Scripts para probar funcionalidades del backend sin usar el frontend:

### **Autenticación:**
- **`test-auth-flow.js`** - Prueba el flujo completo de login/registro
  ```bash
  node scripts/test-auth-flow.js <email> <password>
  ```

### **Cloudinary (Imágenes):**
- **`test-cloudinary-specific.js`** - Test específico de Cloudinary
- **`test-image-upload.js`** - Test de carga de imágenes genérico
- **`test-product-image-upload.js`** - Test de carga de imágenes de productos
- **`test-complete-image-upload.js`** - Test completo de flujo de imágenes
- **`test-local-product-upload.js`** - Test de productos con imágenes locales

### **Flujos de negocio:**
- **`test-complete-purchase-flow.js`** - Prueba flujo completo de compra
- **`test-payment-scenarios.js`** - Prueba diferentes escenarios de pago
- **`test-quotes-flow.js`** - Prueba flujo de cotizaciones
- **`diagnostico-transbank.js`** - Diagnóstico de integración con Transbank

**Uso:**
```bash
node scripts/test-complete-purchase-flow.js
node scripts/test-payment-scenarios.js
node scripts/diagnostico-transbank.js
```

---

## 📋 **Estructura de archivos:**

```
backend/scripts/
│
├── 🔍 DEBUGGING (7 archivos)
│   ├── listTables.js
│   ├── describeQuotesTable.js
│   ├── describeOrderItemsTable.js
│   ├── checkOrders.js
│   ├── verify-quote.js
│   ├── verify-user.js
│   └── verify-order.js
│
└── 🧪 TESTING (10 archivos)
    ├── test-auth-flow.js
    ├── test-cloudinary-specific.js
    ├── test-image-upload.js
    ├── test-product-image-upload.js
    ├── test-complete-image-upload.js
    ├── test-local-product-upload.js
    ├── test-complete-purchase-flow.js
    ├── test-payment-scenarios.js
    ├── test-quotes-flow.js
    └── diagnostico-transbank.js
```

---

## ⚙️ **Requisitos:**

Todos los scripts requieren que:
1. ✅ El backend esté configurado (`.env` correcto)
2. ✅ PostgreSQL esté corriendo
3. ✅ Las dependencias estén instaladas (`npm install`)

Algunos scripts de testing también requieren:
4. ✅ El servidor backend esté corriendo (`npm run dev`)
5. ✅ Cloudinary/Transbank estén configurados (según el test)

---

## 🚨 **NO ejecutar en producción:**

Estos scripts son **SOLO para desarrollo/testing**. Algunos pueden modificar datos en la base de datos.

---

## 📝 **Notas:**

- Los scripts usan **ES Modules** (`import/export`)
- Requieren **Node.js 18+**
- Algunos scripts aceptan argumentos de línea de comandos
- Los mensajes de log están comentados en algunos scripts (descomentar si necesitas más info)

---

**Última actualización:** 2025-01-27
