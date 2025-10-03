# 💳 API de WebPay TESTheb

Documentación de integración con WebPay Plus de Transbank para procesar pagos en el sistema TESTheb.

## Configuración

### Ambientes

**Testing (Integration):**
- Usa credenciales de integración de Transbank
- No procesa pagos reales
- Ideal para desarrollo y pruebas

**Producción:**
- Requiere credenciales reales de Transbank
- Procesa pagos reales con tarjetas

### Variables de Entorno

```env
# Ambiente (integration o production)
WEBPAY_ENVIRONMENT=integration

# Credenciales de producción (solo si WEBPAY_ENVIRONMENT=production)
TBK_COMMERCE_CODE=tu_commerce_code
TBK_API_KEY=tu_api_key

# URLs del sistema
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
```

---

## Endpoints Disponibles

### 💳 Crear Transacción
**POST** `/api/webpay/create`

Crea una nueva transacción de pago con WebPay Plus.

**Requiere Autenticación:** ❌ No (público para checkout)

**Request Body:**
```json
{
  "amount": 25990,
  "sessionId": "SESSION_USER_123",
  "returnUrl": "http://localhost:5173/payment-result",
  "orderData": {
    "customerInfo": {
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "phone": "+56912345678",
      "address": "Av. Libertador 1234",
      "city": "Santiago"
    },
    "cartItems": [
      {
        "id": 1,
        "name": "Polera Bordada",
        "quantity": 2,
        "price": 12995
      }
    ]
  }
}
```

**Campos:**
- `amount` (number) - Monto total en CLP (requerido, debe ser > 0)
- `sessionId` (string) - ID de sesión del usuario (requerido)
- `returnUrl` (string) - URL de retorno después del pago (opcional)
- `orderData` (object) - Información adicional del pedido (opcional)
  - `customerInfo` (object) - Datos del cliente
  - `cartItems` (array) - Items del carrito

**Response:**
```json
{
  "success": true,
  "message": "Transacción creada exitosamente",
  "data": {
    "token": "e9d555262db0f989e49d724b4db0b0af367cc415cde41f50a807a16c8bcac54e",
    "url": "https://webpay3gint.transbank.cl/webpayserver/initTransaction",
    "buyOrder": "O-1696168234567",
    "amount": 25990
  }
}
```

**Flujo:**
1. Backend crea transacción con Transbank
2. Transbank devuelve `token` y `url`
3. Frontend redirige al usuario a la URL de WebPay con el token
4. Usuario completa el pago en WebPay
5. WebPay redirige al endpoint `/api/webpay/commit`

**Errores:**
- `400` - El monto debe ser mayor a 0
- `400` - Session ID es requerido
- `500` - Error al crear la transacción de pago

---

### ✅ Confirmar Transacción (Commit)
**POST/GET** `/api/webpay/commit`

Confirma y procesa el resultado de una transacción WebPay. Este endpoint es llamado automáticamente por Transbank.

**Requiere Autenticación:** ❌ No (callback de Transbank)

**Parámetros (GET/POST):**
- `token_ws` (string) - Token de WebPay (si pago exitoso)
- `TBK_TOKEN` (string) - Token de Transbank (si pago cancelado)
- `TBK_ORDEN_COMPRA` (string) - Orden de compra (si pago cancelado)

**Comportamiento:**

**1. Pago Exitoso:**
- Recibe `token_ws`
- Confirma transacción con Transbank
- Actualiza orden en base de datos
- Redirige a frontend con detalles del pago

**2. Pago Cancelado:**
- Recibe `TBK_TOKEN` y `TBK_ORDEN_COMPRA`
- Marca orden como "aborted"
- Redirige a frontend con estado cancelado

**3. Error:**
- Cualquier error en el proceso
- Redirige a frontend con estado de error

**Redirección al Frontend:**

**Pago Autorizado:**
```
http://localhost:5173/payment-result?status=authorized&buyOrder=O-1696168234567&amount=25990&authorizationCode=123456&responseCode=0&paymentTypeCode=VD&installmentsNumber=0&cardNumber=****1234
```

**Pago Cancelado:**
```
http://localhost:5173/payment-result?status=aborted&buyOrder=O-1696168234567
```

**Error:**
```
http://localhost:5173/payment-result?status=error&message=Error+procesando+pago
```

**Estados Posibles:**
- `authorized` - Pago aprobado
- `rejected` - Pago rechazado
- `aborted` - Pago cancelado por usuario
- `error` - Error en el proceso

---

### 🔍 Obtener Estado de Orden
**GET** `/api/webpay/status/:buyOrder`

Obtiene el estado y detalles de una orden de pago.

**Requiere Autenticación:** ❌ No

**Parámetros de URL:**
- `buyOrder` (string) - Número de orden (ej: "O-1696168234567")

**Response:**
```json
{
  "success": true,
  "message": "Estado de orden obtenido",
  "data": {
    "buyOrder": "O-1696168234567",
    "sessionId": "SESSION_USER_123",
    "amount": 25990,
    "total": 25990,
    "status": "authorized",
    "authorizationCode": "123456",
    "responseCode": 0,
    "paymentTypeCode": "VD",
    "cardLast4": "1234",
    "installmentsNumber": 0,
    "customerName": "Juan Pérez",
    "customerEmail": "juan@example.com",
    "items": [
      {
        "id": 1,
        "name": "Polera Bordada",
        "quantity": 2,
        "price": 12995
      }
    ],
    "createdAt": "2025-10-01T10:30:00.000Z",
    "updatedAt": "2025-10-01T10:32:15.000Z",
    "resultData": {
      "vci": "TSY",
      "amount": 25990,
      "status": "AUTHORIZED",
      "buy_order": "O-1696168234567",
      "session_id": "SESSION_USER_123",
      "card_detail": {
        "card_number": "****1234"
      },
      "accounting_date": "1001",
      "transaction_date": "2025-10-01T10:32:10.123Z",
      "authorization_code": "123456",
      "payment_type_code": "VD",
      "response_code": 0,
      "installments_number": 0
    }
  }
}
```

**Errores:**
- `400` - Buy Order es requerido
- `404` - Orden no encontrada

---

## 🔐 Estados de Transacción

| Estado | Descripción | Acción Recomendada |
|--------|-------------|-------------------|
| `created` | Transacción creada, esperando pago | Mostrar estado "Procesando" |
| `authorized` | Pago aprobado por Transbank | Completar pedido, enviar confirmación |
| `rejected` | Pago rechazado | Informar al usuario, permitir reintentar |
| `aborted` | Usuario canceló el pago | Permitir reintentar, mantener carrito |
| `error` | Error en el proceso | Contactar soporte si persiste |

---

## 🧪 Ejemplos de Prueba

### Flujo Completo de Pago

**1. Crear transacción:**
```bash
curl -X POST "http://localhost:3000/api/webpay/create" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 25990,
    "sessionId": "SESSION_123",
    "orderData": {
      "customerInfo": {
        "name": "Juan Pérez",
        "email": "juan@example.com"
      },
      "cartItems": [
        {"id": 1, "name": "Polera", "quantity": 1, "price": 25990}
      ]
    }
  }'
```

**2. Redirigir usuario al formulario de WebPay:**
```javascript
// En el frontend
const response = await fetch('/api/webpay/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ amount: 25990, sessionId: 'SESSION_123' })
})

const { data } = await response.json()

// Crear formulario y redirigir
const form = document.createElement('form')
form.method = 'POST'
form.action = data.url

const input = document.createElement('input')
input.type = 'hidden'
input.name = 'token_ws'
input.value = data.token

form.appendChild(input)
document.body.appendChild(form)
form.submit()
```

**3. Verificar estado de orden:**
```bash
curl "http://localhost:3000/api/webpay/status/O-1696168234567"
```

---

## 🧪 Tarjetas de Prueba (Ambiente Integration)

Para testing en ambiente de integración, usar estas tarjetas:

### Tarjeta VISA (Aprobada)
```
Número: 4051 8856 0044 6623
CVV: 123
Fecha: Cualquier fecha futura
RUT: 11.111.111-1
Clave: 123
```

### Tarjeta Redcompra (Aprobada)
```
Número: Se genera automáticamente en el formulario
RUT: 11.111.111-1
Clave: 123
```

### Tarjeta Rechazada
```
Número: 4051 8842 3993 7763
(Resto igual que tarjeta aprobada)
```

---

## 📊 Códigos de Respuesta

### Response Codes (Transbank)

| Código | Descripción |
|--------|-------------|
| 0 | Transacción aprobada |
| -1 | Rechazo de transacción |
| -2 | Transacción debe reintentarse |
| -3 | Error en transacción |
| -4 | Rechazo de transacción |
| -5 | Rechazo por error de tasa |
| -6 | Excede cupo máximo mensual |
| -7 | Excede límite diario por transacción |
| -8 | Rubro no autorizado |

### Payment Type Codes

| Código | Descripción |
|--------|-------------|
| VD | Venta Débito |
| VN | Venta Normal |
| VC | Venta en cuotas |
| SI | 3 cuotas sin interés |
| S2 | 2 cuotas sin interés |
| NC | N cuotas sin interés |

---

## ❌ Códigos de Error API

| Código | Descripción |
|--------|-------------|
| 400 | Datos de entrada inválidos |
| 404 | Orden no encontrada |
| 500 | Error interno o de Transbank |

---

## 📋 Notas Importantes

1. **Montos:** Siempre en pesos chilenos (CLP), números enteros sin decimales
2. **Session ID:** Debe ser único por sesión de usuario
3. **Buy Order:** Se genera automáticamente con formato `O-{timestamp}`
4. **Timeout:** Las transacciones tienen un timeout de ~10 minutos en WebPay
5. **Testing:** Siempre probar en ambiente de integración antes de producción
6. **URLs:** Verificar que las URLs de retorno sean accesibles públicamente
7. **Logs:** Todos los eventos se registran en el sistema de logging

---

## 🔗 Recursos Adicionales

- [Documentación Oficial Transbank](https://www.transbankdevelopers.cl/producto/webpay)
- [SDK Transbank Node.js](https://github.com/TransbankDevelopers/transbank-sdk-nodejs)
- [Portal de Desarrollo Transbank](https://www.transbankdevelopers.cl/)

---

**Creado por:** Francisco Campos & Sebastian Mella
**Versión:** 1.0.0
**Fecha:** Octubre 2025
