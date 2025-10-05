# 🧪 Guía de Testing - Sistema de Pagos TESTheb

## 📋 Índice

1. [Introducción](#introducción)
2. [Requisitos Previos](#requisitos-previos)
3. [Scripts de Testing](#scripts-de-testing)
4. [Ejecución Rápida](#ejecución-rápida)
5. [Testing Manual](#testing-manual)
6. [Troubleshooting](#troubleshooting)

---

## 📌 Introducción

Esta guía proporciona instrucciones para ejecutar todos los tests del sistema de pagos de TESTheb, incluyendo tests automatizados y manuales.

**Documentación relacionada:**
- 📖 [PAYMENT_FLOW_DOCUMENTATION.md](PAYMENT_FLOW_DOCUMENTATION.md) - Documentación completa del flujo
- 📋 [PAYMENT_TEST_CASES.md](PAYMENT_TEST_CASES.md) - Casos de prueba detallados

---

## ✅ Requisitos Previos

### **1. Servidor Backend Ejecutándose**

```bash
cd backend
npm run dev
```

El servidor debe estar corriendo en `http://localhost:3000`

### **2. Base de Datos PostgreSQL**

```bash
# Verificar que PostgreSQL esté corriendo
psql -d testheb_db -c "SELECT 1"

# Verificar tabla orders
psql -d testheb_db -c "SELECT COUNT(*) FROM orders"
```

### **3. Variables de Entorno Configuradas**

```bash
# Verificar archivo .env
cat backend/.env

# Variables requeridas:
# - WEBPAY_ENVIRONMENT=integration
# - DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
# - BACKEND_URL, FRONTEND_URL
```

### **4. Dependencias Instaladas**

```bash
cd backend
npm install
```

---

## 🚀 Scripts de Testing

### **Script 1: Test Completo del Flujo de Compra**

**Archivo:** `backend/scripts/test-complete-purchase-flow.js`

**Descripción:** Ejecuta el flujo completo de compra desde la creación de la transacción hasta la verificación en base de datos.

**Uso:**
```bash
node backend/scripts/test-complete-purchase-flow.js
```

**Lo que hace:**
1. ✅ Verifica configuración del sistema
2. ✅ Crea transacción en Transbank
3. ✅ Guarda orden en base de datos
4. ✅ Verifica persistencia de datos
5. ✅ Proporciona URL para completar pago manual
6. ✅ Obtiene estadísticas del sistema

**Salida esperada:**
```
🚀 INICIANDO TESTS DEL FLUJO DE COMPRA COMPLETO

======================================================================
📝 TEST 0: VERIFICAR CONFIGURACIÓN
======================================================================
✅ Backend disponible

======================================================================
📝 TEST 1: CREAR TRANSACCIÓN DE PAGO
======================================================================
✅ TRANSACCIÓN CREADA EXITOSAMENTE
   • Buy Order: O-1696524789123
   • Token: e9d555262db0f989e49d724b4db0b0af367cc415...
   • URL: https://webpay3gint.transbank.cl/webpayserver/initTransaction
   • Monto: $25,000

... [más output]

📊 RESUMEN DE RESULTADOS
1. ✅ Configuración del Sistema
2. ✅ Crear Transacción
3. ✅ Verificar Orden en DB
4. ✅ Información Portal WebPay
5. ✅ Estadísticas del Sistema

📈 Total: 5 pasaron, 0 fallaron de 5 tests

🎉 ¡TODOS LOS TESTS PASARON!
```

---

### **Script 2: Test de Escenarios Específicos**

**Archivo:** `backend/scripts/test-payment-scenarios.js`

**Descripción:** Prueba casos especiales y edge cases del sistema.

**Uso:**
```bash
# Ejecutar todos los escenarios
node backend/scripts/test-payment-scenarios.js all

# Ejecutar escenario específico
node backend/scripts/test-payment-scenarios.js negative-amount
node backend/scripts/test-payment-scenarios.js zero-amount
node backend/scripts/test-payment-scenarios.js missing-session
node backend/scripts/test-payment-scenarios.js large-order
node backend/scripts/test-payment-scenarios.js special-chars
node backend/scripts/test-payment-scenarios.js concurrent
```

**Escenarios probados:**
- ✅ Monto negativo (debe rechazar)
- ✅ Monto en cero (debe rechazar)
- ✅ Sin session ID (debe rechazar)
- ✅ Orden grande (50 items)
- ✅ Caracteres especiales (ñ, á, é, etc.)
- ✅ Transacciones concurrentes (5 simultáneas)

**Salida esperada:**
```
🧪 TESTS DE ESCENARIOS ESPECÍFICOS DE PAGO

======================================================================
🧪 ESCENARIO 1: MONTO NEGATIVO
======================================================================
✅ TEST PASADO: Sistema rechazó monto negativo correctamente
   Mensaje: El monto debe ser mayor a 0

... [más escenarios]

📊 RESUMEN DE ESCENARIOS
1. ✅ Monto Negativo
2. ✅ Monto en Cero
3. ✅ Sin Session ID
4. ✅ Orden Grande
5. ✅ Caracteres Especiales
6. ✅ Transacciones Concurrentes

📈 Total: 6 pasaron, 0 fallaron de 6 escenarios

🎉 ¡TODOS LOS ESCENARIOS PASARON!
```

---

### **Script 3: Verificar Orden Específica**

**Archivo:** `backend/scripts/verify-order.js`

**Descripción:** Verifica el estado y detalles de una orden específica.

**Uso:**
```bash
node backend/scripts/verify-order.js O-1696524789123
```

**Salida esperada:**
```
🔍 Verificando orden: O-1696524789123

✅ Orden encontrada
📋 Detalles:
   • ID: 42
   • Estado: authorized
   • Monto: $25,000
   • Cliente: Usuario Test
   • Email: test@testheb.cl
   • Código autorización: 1213
   • Tarjeta: **** 6623
   • Creada: 2023-10-22 15:43:00

📦 Items (2):
   1. Polera Bordada Test
      Precio: $15,000 × 1 = $15,000
   2. Gorro Personalizado Test
      Precio: $10,000 × 1 = $10,000
```

---

### **Script 4: Verificar Usuario**

**Archivo:** `backend/scripts/verify-user.js`

**Descripción:** Verifica órdenes de un usuario específico por email.

**Uso:**
```bash
node backend/scripts/verify-user.js test@testheb.cl
```

---

### **Script 5: Verificar Cotización**

**Archivo:** `backend/scripts/verify-quote.js`

**Descripción:** Verifica detalles de una cotización específica.

**Uso:**
```bash
node backend/scripts/verify-quote.js 1
```

---

## ⚡ Ejecución Rápida

### **Test Completo del Sistema (Recomendado)**

```bash
# 1. Iniciar backend
cd backend
npm run dev &

# 2. Esperar que inicie (2-3 segundos)
sleep 3

# 3. Ejecutar test completo
node scripts/test-complete-purchase-flow.js

# 4. Ejecutar escenarios específicos
node scripts/test-payment-scenarios.js all
```

### **Test Rápido de Funcionalidad Básica**

```bash
# Solo crear una transacción y verificarla
node scripts/test-complete-purchase-flow.js
```

### **Test de Validaciones de Seguridad**

```bash
# Probar validaciones
node scripts/test-payment-scenarios.js negative-amount
node scripts/test-payment-scenarios.js zero-amount
node scripts/test-payment-scenarios.js missing-session
```

---

## 🖱️ Testing Manual

### **Flujo Completo E2E (End-to-End)**

#### **Paso 1: Preparar el ambiente**

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

#### **Paso 2: Navegar en el navegador**

1. Abrir `http://localhost:5173`
2. Ir a `/catalog`
3. Agregar 2-3 productos al carrito
4. Click en ícono del carrito
5. Verificar productos y total
6. Click en "Proceder al Checkout"

#### **Paso 3: Completar checkout**

1. Llenar formulario:
   - **Nombre:** Juan Pérez Test
   - **Email:** juan.test@example.com
   - **Teléfono:** +56912345678
   - **Dirección:** Av. Principal 123
   - **Ciudad:** Santiago

2. Click en "Pagar con Transbank"

#### **Paso 4: Portal WebPay (Sandbox)**

**Para pago APROBADO:**
```
Número de tarjeta: 4051885600446623
CVV: 123
Fecha de expiración: Cualquier fecha futura (ej: 12/25)
RUT (si pide): 11.111.111-1
Clave: 123
```

**Para pago RECHAZADO:**
```
Número de tarjeta: 5186059559590569
CVV: 123
Fecha: 12/25
```

#### **Paso 5: Verificar resultado**

**Si pago aprobado:**
- ✅ Redirección a `/payment-result?status=authorized`
- ✅ Mensaje de éxito verde
- ✅ Número de orden visible
- ✅ Código de autorización
- ✅ Últimos 4 dígitos de tarjeta
- ✅ Información de envío
- ✅ Carrito limpio (verificar en `/cart`)

**Si pago rechazado:**
- ❌ Redirección a `/payment-result?status=rejected`
- ❌ Mensaje de error rojo
- ❌ Carrito NO se limpia
- ❌ Opción de volver al carrito

**Si usuario cancela:**
- ⚠️ Redirección a `/payment-result?status=aborted`
- ⚠️ Mensaje de cancelación
- ⚠️ Carrito NO se limpia

#### **Paso 6: Verificar en base de datos**

```sql
-- Ver última orden
SELECT
  buy_order,
  status,
  amount,
  authorization_code,
  customer_name,
  customer_email,
  created_at
FROM orders
ORDER BY created_at DESC
LIMIT 1;

-- Ver items de la orden
SELECT
  oi.product_name,
  oi.quantity,
  oi.price,
  oi.subtotal
FROM order_items oi
JOIN orders o ON oi.order_id = o.id
WHERE o.buy_order = 'O-XXXXX';
```

---

## 🧪 Checklist de Testing Completo

### **Testing Funcional**
- [ ] Crear transacción exitosa
- [ ] Pago aprobado con tarjeta de prueba
- [ ] Pago rechazado con tarjeta de prueba
- [ ] Usuario cancela en WebPay
- [ ] Orden con 1 producto
- [ ] Orden con múltiples productos
- [ ] Orden con diferentes cantidades
- [ ] Cálculo correcto de totales
- [ ] Persistencia en base de datos
- [ ] Creación de order_items

### **Testing de Validaciones**
- [ ] Monto negativo rechazado
- [ ] Monto cero rechazado
- [ ] Sin session ID rechazado
- [ ] Campos requeridos validados
- [ ] Email con formato válido
- [ ] Teléfono con formato válido

### **Testing de Integración**
- [ ] Frontend → Backend comunicación
- [ ] Backend → Transbank comunicación
- [ ] Transbank → Backend callback
- [ ] Backend → Frontend redirección
- [ ] Guardado en PostgreSQL
- [ ] Logs generados correctamente

### **Testing de UI/UX**
- [ ] Formulario responsive
- [ ] Loading states visibles
- [ ] Mensajes de error claros
- [ ] Redirecciones suaves
- [ ] Página de resultado informativa
- [ ] Carrito se limpia solo si pago exitoso

### **Testing de Seguridad**
- [ ] Validación de monto server-side
- [ ] No se pueden manipular precios
- [ ] Token único por transacción
- [ ] Session ID único
- [ ] Buy Order único
- [ ] Datos sensibles no expuestos

---

## 🔧 Troubleshooting

### **Error: "Backend no disponible"**

**Síntoma:**
```
❌ Backend no disponible
```

**Solución:**
```bash
# 1. Verificar que el backend esté corriendo
ps aux | grep node

# 2. Iniciar el backend
cd backend
npm run dev

# 3. Verificar puerto
lsof -i :3000
```

---

### **Error: "Transacción no creada"**

**Síntoma:**
```
❌ Error al crear la transacción de pago
```

**Solución:**
```bash
# 1. Verificar logs del backend
tail -f backend/logs/combined.log

# 2. Verificar variables de entorno
cat backend/.env | grep WEBPAY

# 3. Verificar conexión a Transbank
curl https://webpay3gint.transbank.cl
```

---

### **Error: "Orden no encontrada"**

**Síntoma:**
```
❌ Orden no encontrada en base de datos
```

**Solución:**
```sql
-- 1. Verificar que la tabla existe
\dt orders

-- 2. Verificar últimas órdenes
SELECT * FROM orders ORDER BY created_at DESC LIMIT 5;

-- 3. Verificar logs de inserción
grep "Orden guardada" backend/logs/combined.log
```

---

### **Error: "Callback no recibido"**

**Síntoma:**
El pago se completa en WebPay pero no se actualiza en la aplicación

**Solución:**
```bash
# 1. Verificar URL de callback en .env
echo $BACKEND_URL/api/webpay/commit

# 2. Verificar que el endpoint esté accesible
curl -X POST http://localhost:3000/api/webpay/commit

# 3. Revisar logs de callback
grep "Callback WebPay" backend/logs/combined.log
```

---

### **Tests fallan con error de conexión**

**Solución:**
```bash
# 1. Verificar todas las conexiones
npm run test:connections

# 2. Verificar PostgreSQL
psql -d testheb_db -c "SELECT 1"

# 3. Verificar backend
curl http://localhost:3000/api/health
```

---

## 📞 Soporte

**Documentación:**
- [PAYMENT_FLOW_DOCUMENTATION.md](PAYMENT_FLOW_DOCUMENTATION.md)
- [PAYMENT_TEST_CASES.md](PAYMENT_TEST_CASES.md)
- [README.md](../README.md)

**Equipo:**
- Francisco Campos
- Sebastian Mella

**Proyecto:** TESTheb E-commerce
**Fecha:** Octubre 2025

---

## 📝 Notas Adicionales

### **Ambiente de Testing vs Producción**

**Integración (Testing):**
```env
WEBPAY_ENVIRONMENT=integration
# Usa credenciales de sandbox
# No requiere certificación
# Tarjetas de prueba funcionan
```

**Producción:**
```env
WEBPAY_ENVIRONMENT=production
TBK_COMMERCE_CODE=tu_codigo_real
TBK_API_KEY=tu_api_key_real
# Requiere certificación con Transbank
# Solo tarjetas reales
```

### **Limpieza de Datos de Prueba**

```sql
-- Eliminar órdenes de testing
DELETE FROM orders
WHERE customer_email LIKE '%test%'
   OR customer_email LIKE '%automated%';

-- Verificar
SELECT COUNT(*) FROM orders;
```

### **Automatización de Tests**

Para CI/CD, agregar en `package.json`:

```json
{
  "scripts": {
    "test:payment": "node scripts/test-complete-purchase-flow.js",
    "test:scenarios": "node scripts/test-payment-scenarios.js all",
    "test:all": "npm run test:payment && npm run test:scenarios"
  }
}
```

Ejecutar:
```bash
npm run test:all
```

---

**¡Happy Testing! 🎉**
