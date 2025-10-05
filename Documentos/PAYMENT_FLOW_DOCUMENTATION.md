# 💳 Documentación del Flujo de Pago - Transbank WebPay Plus

## 📋 Tabla de Contenidos

1. [Resumen General](#resumen-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Flujo Completo Paso a Paso](#flujo-completo-paso-a-paso)
4. [Estados de la Transacción](#estados-de-la-transacción)
5. [Endpoints de la API](#endpoints-de-la-api)
6. [Modelos de Datos](#modelos-de-datos)
7. [Configuración de Transbank](#configuración-de-transbank)
8. [Manejo de Errores](#manejo-de-errores)
9. [Seguridad](#seguridad)
10. [Testing](#testing)
11. [Troubleshooting](#troubleshooting)

---

## 📌 Resumen General

El sistema de pagos de TESTheb utiliza **Transbank WebPay Plus** para procesar transacciones de manera segura. El flujo implementa:

- ✅ Integración completa con Transbank SDK v6.1.0
- ✅ Persistencia de órdenes en PostgreSQL
- ✅ Manejo de estados (created, authorized, rejected, aborted)
- ✅ Redirección segura al portal de pagos
- ✅ Callback automático para confirmación
- ✅ Registro detallado de transacciones
- ✅ Soporte para entornos de integración y producción

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUJO DE PAGO COMPLETO                        │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Frontend   │         │   Backend    │         │  Transbank   │
│   (React)    │         │  (Node.js)   │         │   WebPay     │
└──────┬───────┘         └──────┬───────┘         └──────┬───────┘
       │                        │                        │
       │ 1. POST /api/webpay/   │                        │
       │    create              │                        │
       ├────────────────────────>                        │
       │                        │                        │
       │                        │ 2. transaction.create()│
       │                        ├───────────────────────>│
       │                        │                        │
       │                        │ 3. {token, url}        │
       │                        <────────────────────────┤
       │                        │                        │
       │                        │ 4. Save order in DB    │
       │                        │    (status: created)   │
       │                        │                        │
       │ 5. {token, url}        │                        │
       <────────────────────────┤                        │
       │                        │                        │
       │ 6. Redirect to WebPay  │                        │
       ├────────────────────────┼───────────────────────>│
       │                        │                        │
       │                        │   7. User pays         │
       │                        │                        │
       │                        │ 8. POST /api/webpay/   │
       │                        │    commit (callback)   │
       │                        <────────────────────────┤
       │                        │                        │
       │                        │ 9. transaction.commit()│
       │                        ├───────────────────────>│
       │                        │                        │
       │                        │ 10. Payment result     │
       │                        <────────────────────────┤
       │                        │                        │
       │                        │ 11. Update order in DB │
       │                        │     (status: authorized│
       │                        │      /rejected/aborted)│
       │                        │                        │
       │ 12. Redirect to result │                        │
       │     page with params   │                        │
       <────────────────────────┤                        │
       │                        │                        │
```

---

## 🔄 Flujo Completo Paso a Paso

### **Paso 1: Usuario en el Checkout**

**Ubicación:** `frontend/src/pages/CheckoutPage.jsx`

El usuario completa el formulario de checkout con:
- Nombre completo
- Email
- Teléfono
- Dirección de envío
- Ciudad

**Validaciones Frontend:**
```javascript
- Email válido (formato)
- Campos requeridos no vacíos
- Carrito no vacío
- Monto total > 0
```

---

### **Paso 2: Creación de Transacción en Backend**

**Endpoint:** `POST /api/webpay/create`

**Request Body:**
```json
{
  "amount": 15000,
  "sessionId": "session-1234567890-abc123",
  "returnUrl": "http://localhost:5173/payment-result",
  "orderData": {
    "cartItems": [...],
    "customerInfo": {
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "phone": "+56912345678",
      "address": "Av. Principal 123",
      "city": "Santiago"
    }
  }
}
```

**Proceso Backend:**

1. **Validación de datos:**
   ```javascript
   - amount > 0
   - sessionId no vacío
   - Sanitización de monto (entero para CLP)
   ```

2. **Generación de buyOrder único:**
   ```javascript
   const buyOrder = `O-${Date.now()}`
   // Ejemplo: O-1696524789123
   ```

3. **Configuración de Transbank:**
   ```javascript
   // Modo integración (testing)
   const transaction = new WebpayPlus.Transaction(
     new Options(
       IntegrationCommerceCodes.WEBPAY_PLUS,
       IntegrationApiKeys.WEBPAY,
       Environment.Integration
     )
   )

   // Modo producción
   const transaction = new WebpayPlus.Transaction(
     new Options(
       process.env.TBK_COMMERCE_CODE,
       process.env.TBK_API_KEY,
       Environment.Production
     )
   )
   ```

4. **Llamada a Transbank:**
   ```javascript
   const response = await transaction.create(
     buyOrder,           // Orden única
     sessionId,          // Sesión del usuario
     sanitizedAmount,    // Monto entero
     webpayReturnUrl     // URL de callback
   )
   ```

5. **Guardado en base de datos:**
   ```javascript
   await Order.create({
     buy_order: buyOrder,
     session_id: sessionId,
     amount: sanitizedAmount,
     total: sanitizedAmount,
     status: 'created',
     token_ws: response.token,
     items: cartItems,
     customer_name: customerInfo.name,
     customer_email: customerInfo.email,
     customer_phone: customerInfo.phone,
     shipping_address: customerInfo.address,
     shipping_city: customerInfo.city
   })
   ```

**Response:**
```json
{
  "success": true,
  "message": "Transacción creada exitosamente",
  "data": {
    "token": "e9d555262db0f989e49d724b4db0b0af367cc415cde41f5",
    "url": "https://webpay3gint.transbank.cl/webpayserver/initTransaction",
    "buyOrder": "O-1696524789123",
    "amount": 15000
  }
}
```

---

### **Paso 3: Redirección a WebPay**

**Ubicación:** `frontend/src/pages/CheckoutPage.jsx`

```javascript
// Guardar información en localStorage para referencia
localStorage.setItem('testheb_current_order', JSON.stringify({
  token: data.data.token,
  buyOrder: data.data.buyOrder,
  amount: data.data.amount,
  sessionId,
  customerInfo,
  cartItems,
  createdAt: new Date().toISOString()
}))

// Redirección con POST (evita pantalla en blanco)
postRedirect(data.data.url, {
  token_ws: data.data.token
})
```

**Función postRedirect:**
```javascript
export function postRedirect(url, params) {
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = url

  Object.entries(params).forEach(([key, value]) => {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = key
    input.value = value
    form.appendChild(input)
  })

  document.body.appendChild(form)
  form.submit()
}
```

---

### **Paso 4: Usuario Paga en WebPay**

El usuario es redirigido al portal de Transbank donde:

1. Selecciona su banco o método de pago
2. Ingresa credenciales bancarias
3. Confirma el pago
4. Transbank procesa la transacción

**Tarjetas de Prueba (Modo Integración):**

| Tipo | Número | CVV | Resultado |
|------|--------|-----|-----------|
| Redcompra | 4051885600446623 | 123 | Aprobada |
| Visa | 4051885600446623 | 123 | Aprobada |
| Mastercard | 5186059559590568 | 123 | Aprobada |
| Rechazada | 5186059559590569 | 123 | Rechazada |

---

### **Paso 5: Callback de Transbank**

**Endpoint:** `POST /api/webpay/commit` (también acepta GET)

**Ubicación:** `backend/src/controllers/webpayController.js:119`

Transbank envía el resultado del pago mediante callback a:
```
http://localhost:3000/api/webpay/commit
```

**Parámetros recibidos:**

**Caso 1: Pago exitoso o rechazado**
```javascript
{
  token_ws: "e9d555262db0f989e49d724b4db0b0af367cc415cde41f5"
}
```

**Caso 2: Usuario canceló el pago**
```javascript
{
  TBK_TOKEN: "e9d555262db0f989e49d724b4db0b0af367cc415cde41f5",
  TBK_ORDEN_COMPRA: "O-1696524789123"
}
```

---

### **Paso 6: Confirmación con Transbank**

```javascript
if (token_ws) {
  // Confirmar transacción
  const transaction = getWebpayConfig()
  const response = await transaction.commit(token_ws)

  // Ejemplo de respuesta exitosa
  {
    "vci": "TSY",
    "amount": 15000,
    "status": "AUTHORIZED",
    "buy_order": "O-1696524789123",
    "session_id": "session-1234567890-abc123",
    "card_detail": {
      "card_number": "6623"
    },
    "accounting_date": "1022",
    "transaction_date": "2023-10-22T15:43:48.123Z",
    "authorization_code": "1213",
    "payment_type_code": "VN",
    "response_code": 0,
    "installments_number": 0
  }
}
```

**Determinación del estado:**
```javascript
if (response.status === 'AUTHORIZED' || response.response_code === 0) {
  status = 'authorized'  // Pago exitoso
} else {
  status = 'rejected'    // Pago rechazado
}
```

---

### **Paso 7: Actualización en Base de Datos**

```javascript
// Actualizar orden con resultado completo
await Order.updateWithPaymentResult(response.buy_order, {
  status,
  result_json: response,
  authorization_code: response.authorization_code,
  response_code: response.response_code,
  payment_type_code: response.payment_type_code,
  card_last4: response.card_detail?.card_number || null,
  installments_number: response.installments_number || 0
})

// Si pago autorizado, crear items de la orden
if (status === 'authorized') {
  const order = await Order.getWithItems(response.buy_order)
  const items = order.items || []
  await OrderItem.createBulk(order.id, items)
}
```

---

### **Paso 8: Redirección al Frontend**

```javascript
// Construir URL con parámetros del resultado
const params = new URLSearchParams({
  status: 'authorized',
  buyOrder: 'O-1696524789123',
  amount: '15000',
  authorizationCode: '1213',
  responseCode: '0',
  paymentTypeCode: 'VN',
  installmentsNumber: '0',
  cardNumber: '6623'
})

const redirectUrl = `${FRONTEND_URL}/payment-result?${params.toString()}`
res.redirect(redirectUrl)
```

---

### **Paso 9: Página de Resultado**

**Ubicación:** `frontend/src/pages/PaymentResultPage.jsx`

**Pago Exitoso:**
```javascript
// Limpiar carrito
clearCart()

// Limpiar orden temporal
localStorage.removeItem('testheb_current_order')

// Mostrar detalles:
- Número de orden
- Monto pagado
- Código de autorización
- Tarjeta utilizada (últimos 4 dígitos)
- Fecha de transacción
- Información de envío
```

**Pago Rechazado:**
```javascript
// Mantener carrito
// Mostrar mensaje de error
// Opciones: Volver al carrito o inicio
```

---

## 📊 Estados de la Transacción

| Estado | Descripción | Origen |
|--------|-------------|--------|
| `created` | Orden creada, esperando pago | Backend al crear transacción |
| `authorized` | Pago autorizado exitosamente | Transbank (response_code: 0) |
| `rejected` | Pago rechazado por banco | Transbank (response_code: -1, etc.) |
| `aborted` | Usuario canceló en WebPay | Transbank (TBK_TOKEN presente) |
| `error` | Error técnico en el proceso | Backend (excepciones) |

---

## 🔌 Endpoints de la API

### **1. Crear Transacción**

```http
POST /api/webpay/create
Content-Type: application/json
```

**Request:**
```json
{
  "amount": 15000,
  "sessionId": "session-unique-id",
  "returnUrl": "http://localhost:5173/payment-result",
  "orderData": {
    "cartItems": [...],
    "customerInfo": {...}
  }
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Transacción creada exitosamente",
  "data": {
    "token": "e9d555262db0f989e49d724b4db0b0af367cc415cde41f5",
    "url": "https://webpay3gint.transbank.cl/webpayserver/initTransaction",
    "buyOrder": "O-1696524789123",
    "amount": 15000
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "El monto debe ser mayor a 0",
  "error": "Validation Error"
}
```

---

### **2. Confirmar Transacción (Callback)**

```http
POST /api/webpay/commit
GET /api/webpay/commit
```

**Parámetros:**
- `token_ws`: Token de la transacción
- `TBK_TOKEN`: Token si usuario canceló
- `TBK_ORDEN_COMPRA`: Orden si usuario canceló

**Comportamiento:**
- Confirma con Transbank
- Actualiza orden en DB
- Crea order_items si autorizado
- Redirige al frontend con resultado

---

### **3. Obtener Estado de Orden**

```http
GET /api/webpay/order/:buyOrder
```

**Response:**
```json
{
  "success": true,
  "message": "Estado de orden obtenido",
  "data": {
    "buyOrder": "O-1696524789123",
    "sessionId": "session-unique-id",
    "amount": 15000,
    "total": 15000,
    "status": "authorized",
    "authorizationCode": "1213",
    "responseCode": 0,
    "paymentTypeCode": "VN",
    "cardLast4": "6623",
    "installmentsNumber": 0,
    "customerName": "Juan Pérez",
    "customerEmail": "juan@example.com",
    "items": [...],
    "createdAt": "2023-10-22T15:43:00.000Z",
    "updatedAt": "2023-10-22T15:43:50.000Z",
    "resultData": {...}
  }
}
```

---

## 💾 Modelos de Datos

### **Tabla: orders**

```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  buy_order VARCHAR(50) UNIQUE NOT NULL,
  session_id VARCHAR(100) NOT NULL,
  amount INTEGER NOT NULL,
  total INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'created',
  token_ws TEXT,

  -- Información del resultado de pago
  authorization_code VARCHAR(10),
  response_code INTEGER,
  payment_type_code VARCHAR(2),
  card_last4 VARCHAR(4),
  installments_number INTEGER DEFAULT 0,
  result_json JSONB,

  -- Información del cliente
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(20),
  shipping_address TEXT,
  shipping_city VARCHAR(100),

  -- Items del carrito (JSONB)
  items JSONB,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_buy_order ON orders(buy_order);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
```

### **Tabla: order_items**

```sql
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
```

---

## ⚙️ Configuración de Transbank

### **Variables de Entorno**

```env
# Ambiente (integration o production)
WEBPAY_ENVIRONMENT=integration

# Producción (solo usar cuando esté certificado)
TBK_COMMERCE_CODE=tu_codigo_comercio_real
TBK_API_KEY=tu_api_key_real

# URLs
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
```

### **Configuración Dinámica**

```javascript
const getWebpayConfig = () => {
  const environment = process.env.WEBPAY_ENVIRONMENT || 'integration'

  if (environment === 'production') {
    return new WebpayPlus.Transaction(
      new Options(
        process.env.TBK_COMMERCE_CODE,
        process.env.TBK_API_KEY,
        Environment.Production
      )
    )
  } else {
    return new WebpayPlus.Transaction(
      new Options(
        IntegrationCommerceCodes.WEBPAY_PLUS,
        IntegrationApiKeys.WEBPAY,
        Environment.Integration
      )
    )
  }
}
```

---

## 🛡️ Seguridad

### **Validaciones Implementadas**

✅ **Backend:**
- Validación de monto > 0
- Sanitización de datos de entrada
- Verificación de sessionId único
- Validación de token_ws en callback
- Logging de todas las transacciones

✅ **Frontend:**
- Validación de formulario completo
- Verificación de carrito no vacío
- Sanitización de inputs
- Uso de HTTPS (producción)

### **Protección contra Ataques**

```javascript
// 1. Validación de monto
const sanitizedAmount = Math.round(Number(amount))
if (sanitizedAmount <= 0) throw new AppError('Monto inválido', 400)

// 2. Orden única por timestamp
const buyOrder = `O-${Date.now()}`

// 3. Session ID con datos aleatorios
const sessionId = `session-${Date.now()}-${Math.random().toString(36)}`

// 4. Verificación de estado en callback
if (response.status !== 'AUTHORIZED' && response.response_code !== 0) {
  status = 'rejected'
}
```

---

## 🧪 Testing

Ver archivo: `PAYMENT_TEST_CASES.md` para casos de prueba detallados.

**Script de testing completo:**
```bash
node backend/scripts/test-complete-purchase-flow.js
```

---

## 🔧 Troubleshooting

### **Error: "Transacción no creada"**

**Causa:** Credenciales de Transbank incorrectas

**Solución:**
```bash
# Verificar variables de entorno
echo $WEBPAY_ENVIRONMENT
echo $TBK_COMMERCE_CODE (solo producción)
```

---

### **Error: "Orden no encontrada"**

**Causa:** Fallo en guardado de base de datos

**Solución:**
```sql
-- Verificar tabla orders
SELECT * FROM orders ORDER BY created_at DESC LIMIT 5;

-- Verificar logs
tail -f backend/logs/combined.log
```

---

### **Error: "Payment result page shows error"**

**Causa:** Callback no recibido o falló

**Solución:**
```bash
# Verificar logs del servidor
grep "Callback WebPay" backend/logs/combined.log

# Verificar URL de callback
echo $BACKEND_URL/api/webpay/commit
```

---

### **Usuario canceló en WebPay**

**Comportamiento esperado:**
- Status: `aborted`
- Orden guardada con TBK_TOKEN
- Redirección a frontend con status=aborted
- Carrito NO se limpia

---

### **Pago rechazado por banco**

**Comportamiento esperado:**
- Status: `rejected`
- Orden guardada con response_code != 0
- Redirección a frontend con status=rejected
- Carrito NO se limpia

---

## 📞 Soporte Transbank

**Documentación oficial:**
- https://www.transbankdevelopers.cl/documentacion/webpay-plus

**Ambiente de integración:**
- Portal: https://webpay3gint.transbank.cl
- Código de comercio: 597055555532
- API Key: (generada en portal de desarrollo)

**Soporte técnico:**
- Email: soporte@transbank.cl
- Teléfono: +56 2 2661 8000

---

## 📝 Changelog

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0.0 | 2025-10-05 | Documentación inicial completa |

---

**Desarrollado por:** Francisco Campos & Sebastian Mella
**Proyecto:** TESTheb E-commerce
**Fecha:** Octubre 2025
