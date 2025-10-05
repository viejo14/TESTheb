# 🧪 Casos de Prueba - Sistema de Pagos WebPay Plus

## 📋 Índice

1. [Casos de Prueba Funcionales](#casos-de-prueba-funcionales)
2. [Casos de Prueba de Integración](#casos-de-prueba-de-integración)
3. [Casos de Prueba de Seguridad](#casos-de-prueba-de-seguridad)
4. [Casos de Prueba de Error](#casos-de-prueba-de-error)
5. [Checklist de Testing Pre-Producción](#checklist-de-testing-pre-producción)

---

## ✅ Casos de Prueba Funcionales

### **TC-001: Flujo de Compra Completo Exitoso**

**Objetivo:** Verificar que un usuario puede completar una compra exitosamente

**Precondiciones:**
- Sistema en modo integración (sandbox)
- Productos en catálogo
- Base de datos limpia

**Pasos:**
1. Navegar a `/catalog`
2. Agregar 3 productos al carrito
3. Ir a `/cart` y verificar productos
4. Click en "Proceder al Checkout"
5. Completar formulario de checkout:
   - Nombre: "Juan Pérez Test"
   - Email: "juan.test@example.com"
   - Teléfono: "+56912345678"
   - Dirección: "Av. Principal 123"
   - Ciudad: "Santiago"
6. Click en "Pagar con Transbank"
7. En WebPay, usar tarjeta de prueba aprobada:
   - Número: `4051885600446623`
   - CVV: `123`
   - Fecha: Cualquier fecha futura
8. Confirmar pago en WebPay
9. Verificar redirección a `/payment-result`
10. Verificar mensaje de éxito

**Resultado Esperado:**
- ✅ Transacción creada con status `created`
- ✅ Redirección exitosa a WebPay
- ✅ Pago procesado con status `AUTHORIZED`
- ✅ Orden actualizada en DB con status `authorized`
- ✅ Order_items creados en DB
- ✅ Carrito limpiado en frontend
- ✅ Email de confirmación enviado (si está configurado)
- ✅ Página de resultado muestra:
  - Número de orden
  - Monto pagado
  - Código de autorización
  - Últimos 4 dígitos de tarjeta
  - Información de envío

**Consulta SQL de Verificación:**
```sql
SELECT
  buy_order,
  status,
  amount,
  authorization_code,
  customer_email,
  created_at
FROM orders
WHERE customer_email = 'juan.test@example.com'
ORDER BY created_at DESC
LIMIT 1;

SELECT * FROM order_items
WHERE order_id = (
  SELECT id FROM orders
  WHERE customer_email = 'juan.test@example.com'
  ORDER BY created_at DESC LIMIT 1
);
```

---

### **TC-002: Pago Rechazado por Banco**

**Objetivo:** Verificar manejo correcto de pagos rechazados

**Precondiciones:**
- Sistema en modo integración
- Carrito con productos

**Pasos:**
1. Seguir pasos 1-6 de TC-001
2. En WebPay, usar tarjeta de prueba rechazada:
   - Número: `5186059559590569`
   - CVV: `123`
3. Intentar confirmar pago

**Resultado Esperado:**
- ✅ Orden creada con status `rejected`
- ✅ Página de resultado muestra error de pago
- ✅ Mensaje: "Pago Rechazado"
- ✅ Carrito NO se limpia
- ✅ Usuario puede volver al carrito
- ✅ Log registra rechazo con response_code != 0

**Consulta SQL de Verificación:**
```sql
SELECT
  buy_order,
  status,
  response_code,
  result_json
FROM orders
WHERE status = 'rejected'
ORDER BY created_at DESC
LIMIT 1;
```

---

### **TC-003: Usuario Cancela en WebPay**

**Objetivo:** Verificar manejo de cancelación por usuario

**Precondiciones:**
- Sistema en modo integración
- Carrito con productos

**Pasos:**
1. Seguir pasos 1-6 de TC-001
2. En portal de WebPay, click en "Cancelar" o "Volver"
3. Verificar redirección

**Resultado Esperado:**
- ✅ Orden guardada con status `aborted`
- ✅ Redirección a frontend con `status=aborted`
- ✅ Página muestra mensaje de cancelación
- ✅ Carrito NO se limpia
- ✅ Usuario puede reintentar compra
- ✅ TBK_TOKEN y TBK_ORDEN_COMPRA guardados

**Consulta SQL de Verificación:**
```sql
SELECT
  buy_order,
  status,
  result_json
FROM orders
WHERE status = 'aborted'
ORDER BY created_at DESC
LIMIT 1;
```

---

### **TC-004: Múltiples Productos en Carrito**

**Objetivo:** Verificar cálculo correcto de totales

**Pasos:**
1. Agregar producto A (cantidad: 2, precio: $5,000)
2. Agregar producto B (cantidad: 1, precio: $10,000)
3. Agregar producto C (cantidad: 3, precio: $3,000)
4. Verificar total en carrito
5. Proceder a checkout
6. Completar pago exitoso

**Resultado Esperado:**
- ✅ Total calculado: $29,000 (2×5000 + 1×10000 + 3×3000)
- ✅ Monto enviado a Transbank: 29000
- ✅ 3 registros en order_items
- ✅ Cantidades correctas en cada item

**Consulta SQL de Verificación:**
```sql
SELECT
  oi.product_name,
  oi.quantity,
  oi.price,
  oi.subtotal
FROM order_items oi
JOIN orders o ON oi.order_id = o.id
WHERE o.buy_order = 'O-XXXXX'
ORDER BY oi.id;

-- Verificar total
SELECT
  o.amount,
  SUM(oi.subtotal) as items_total
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
WHERE o.buy_order = 'O-XXXXX'
GROUP BY o.amount;
```

---

### **TC-005: Persistencia de Datos en Cada Paso**

**Objetivo:** Verificar que los datos se guardan correctamente en cada etapa

**Pasos:**
1. Crear transacción
2. Verificar orden en DB con status `created`
3. Completar pago
4. Verificar orden actualizada con status `authorized`
5. Verificar items creados

**Resultado Esperado:**
- ✅ **Después de crear transacción:**
  - Registro en `orders` con status `created`
  - Campos: buy_order, session_id, amount, token_ws
  - items (JSONB) con datos del carrito
  - Información del cliente completa

- ✅ **Después de callback:**
  - Orden actualizada con status `authorized`
  - authorization_code presente
  - response_code = 0
  - result_json con respuesta completa
  - card_last4 con últimos dígitos

- ✅ **Después de confirmación:**
  - Registros en `order_items` creados
  - Cantidades y precios correctos

---

## 🔗 Casos de Prueba de Integración

### **TC-INT-001: Integración Frontend → Backend → Transbank**

**Objetivo:** Verificar comunicación completa entre componentes

**Pasos:**
1. **Frontend:** Crear orden desde CheckoutPage
2. **Backend:** POST /api/webpay/create
3. **Transbank:** Crear transacción
4. **Frontend:** Redirección a WebPay
5. **Transbank:** Procesar pago
6. **Backend:** Callback POST /api/webpay/commit
7. **Frontend:** Mostrar resultado

**Puntos de Verificación:**
- ✅ Request llega a backend con datos correctos
- ✅ Backend valida y sanitiza datos
- ✅ Transbank responde con token y URL
- ✅ Redirección funciona correctamente
- ✅ Callback llega al endpoint correcto
- ✅ Frontend recibe parámetros correctos

**Logs a Verificar:**
```bash
grep "Transacción WebPay creada" backend/logs/combined.log
grep "Callback WebPay recibido" backend/logs/combined.log
grep "Respuesta de confirmación WebPay" backend/logs/combined.log
grep "Orden actualizada en DB" backend/logs/combined.log
```

---

### **TC-INT-002: Timeout de Transacción**

**Objetivo:** Verificar manejo de timeout en WebPay

**Pasos:**
1. Crear transacción
2. Abrir WebPay pero NO completar pago
3. Esperar 10+ minutos (timeout de Transbank)
4. Intentar procesar

**Resultado Esperado:**
- ✅ Transbank muestra mensaje de timeout
- ✅ Orden permanece en status `created`
- ✅ Usuario puede crear nueva transacción

---

### **TC-INT-003: Doble Click en Botón de Pago**

**Objetivo:** Verificar que no se crean transacciones duplicadas

**Pasos:**
1. En checkout, hacer doble click rápido en "Pagar"
2. Verificar requests al backend

**Resultado Esperado:**
- ✅ Botón se deshabilita después del primer click
- ✅ Solo 1 request llega al backend
- ✅ Solo 1 orden creada en DB
- ✅ Loading state se muestra

---

## 🔒 Casos de Prueba de Seguridad

### **TC-SEC-001: Validación de Monto Negativo**

**Pasos:**
1. Intentar crear transacción con amount = -1000

**Resultado Esperado:**
- ✅ Backend rechaza con error 400
- ✅ Mensaje: "El monto debe ser mayor a 0"
- ✅ No se crea orden en DB

---

### **TC-SEC-002: Validación de Session ID Vacío**

**Pasos:**
1. Intentar crear transacción sin sessionId

**Resultado Esperado:**
- ✅ Backend rechaza con error 400
- ✅ Mensaje: "Session ID es requerido"

---

### **TC-SEC-003: Manipulación de Monto en Frontend**

**Pasos:**
1. Agregar producto de $10,000 al carrito
2. Abrir DevTools y modificar monto a $1,000 antes de enviar
3. Intentar procesar pago

**Resultado Esperado:**
- ✅ Backend valida monto contra items
- ✅ Transacción se crea con monto correcto
- ✅ No se permite manipulación

---

### **TC-SEC-004: Token Inválido en Callback**

**Pasos:**
1. Intentar llamar `/api/webpay/commit` con token_ws inválido

**Resultado Esperado:**
- ✅ Transbank responde con error
- ✅ Backend maneja error gracefully
- ✅ Redirección a frontend con status=error

---

### **TC-SEC-005: Replay Attack**

**Pasos:**
1. Completar pago exitoso
2. Capturar request del callback
3. Reenviar mismo request

**Resultado Esperado:**
- ✅ Transbank rechaza token ya usado
- ✅ Backend no actualiza orden dos veces
- ✅ Log registra intento

---

## ❌ Casos de Prueba de Error

### **TC-ERR-001: Base de Datos Desconectada**

**Pasos:**
1. Detener PostgreSQL
2. Intentar crear transacción

**Resultado Esperado:**
- ✅ Error de conexión capturado
- ✅ Mensaje de error al usuario
- ✅ No se pierde información (transacción en Transbank)
- ✅ Log registra error

---

### **TC-ERR-002: Transbank No Disponible**

**Pasos:**
1. Configurar URL de Transbank inválida
2. Intentar crear transacción

**Resultado Esperado:**
- ✅ Timeout o error de conexión
- ✅ Mensaje: "Error al crear la transacción de pago"
- ✅ Status 500
- ✅ No se crea orden en DB

---

### **TC-ERR-003: Carrito Vacío en Checkout**

**Pasos:**
1. Navegar directamente a `/checkout` sin productos

**Resultado Esperado:**
- ✅ Mensaje: "Tu carrito está vacío"
- ✅ Botón: "Explorar Productos"
- ✅ No se permite checkout

---

### **TC-ERR-004: Email de Confirmación Falla**

**Pasos:**
1. Configurar credenciales de email incorrectas
2. Completar pago exitoso

**Resultado Esperado:**
- ✅ Pago se procesa correctamente
- ✅ Log registra error de email
- ✅ Usuario ve confirmación en pantalla
- ✅ Sistema NO falla por error de email

---

### **TC-ERR-005: Callback Duplicado**

**Pasos:**
1. Simular que Transbank envía callback 2 veces

**Resultado Esperado:**
- ✅ Primera llamada actualiza orden
- ✅ Segunda llamada no causa error
- ✅ Orden no se duplica
- ✅ Order_items no se duplican

---

## ✅ Checklist de Testing Pre-Producción

### **Configuración**

- [ ] Variables de entorno de producción configuradas
- [ ] Credenciales de Transbank PRODUCCIÓN validadas
- [ ] URLs de frontend/backend en producción correctas
- [ ] SSL/HTTPS habilitado en ambos
- [ ] CORS configurado correctamente
- [ ] Base de datos de producción lista

### **Funcionalidad**

- [ ] TC-001: Flujo completo exitoso ✅
- [ ] TC-002: Pago rechazado ✅
- [ ] TC-003: Cancelación de usuario ✅
- [ ] TC-004: Múltiples productos ✅
- [ ] TC-005: Persistencia de datos ✅

### **Integración**

- [ ] TC-INT-001: Comunicación completa ✅
- [ ] TC-INT-002: Timeout ✅
- [ ] TC-INT-003: Doble click ✅

### **Seguridad**

- [ ] TC-SEC-001: Monto negativo ✅
- [ ] TC-SEC-002: Session ID vacío ✅
- [ ] TC-SEC-003: Manipulación monto ✅
- [ ] TC-SEC-004: Token inválido ✅
- [ ] TC-SEC-005: Replay attack ✅

### **Manejo de Errores**

- [ ] TC-ERR-001: DB desconectada ✅
- [ ] TC-ERR-002: Transbank no disponible ✅
- [ ] TC-ERR-003: Carrito vacío ✅
- [ ] TC-ERR-004: Email falla ✅
- [ ] TC-ERR-005: Callback duplicado ✅

### **Performance**

- [ ] Tiempo de respuesta < 3 segundos
- [ ] Redirección a WebPay < 2 segundos
- [ ] Callback procesado < 2 segundos
- [ ] Página de resultado carga < 1 segundo

### **Logs y Monitoreo**

- [ ] Todas las transacciones se registran
- [ ] Errores se capturan en logs
- [ ] Logs incluyen timestamps
- [ ] Logs incluyen buy_order en cada entrada
- [ ] Sistema de alertas configurado

### **UX/UI**

- [ ] Loading states funcionan correctamente
- [ ] Mensajes de error son claros
- [ ] Redirecciones son suaves (sin pantalla blanca)
- [ ] Página de resultado es informativa
- [ ] Responsive en móvil/tablet/desktop

### **Datos de Prueba**

- [ ] Limpiar órdenes de testing
- [ ] Verificar no hay tarjetas de prueba en producción
- [ ] Validar emails de clientes reales
- [ ] Verificar productos tienen precios correctos

---

## 📊 Matriz de Cobertura

| Categoría | Casos | Pasados | Fallados | Cobertura |
|-----------|-------|---------|----------|-----------|
| Funcionales | 5 | - | - | 0% |
| Integración | 3 | - | - | 0% |
| Seguridad | 5 | - | - | 0% |
| Errores | 5 | - | - | 0% |
| **TOTAL** | **18** | **0** | **0** | **0%** |

---

## 🔧 Scripts de Testing

### **Ejecutar Todos los Tests**

```bash
# Tests unitarios
npm test

# Tests de integración
node backend/scripts/test-complete-purchase-flow.js

# Tests de verificación de orden
node backend/scripts/verify-order.js O-1234567890
```

### **Verificar Configuración**

```bash
# Backend
node backend/scripts/test-env-config.js

# Frontend
cd frontend && npm run dev
```

---

## 📝 Reporte de Bugs

**Template:**

```markdown
## Bug ID: BUG-XXX

**Título:** [Descripción breve]

**Severidad:** Critical / High / Medium / Low

**Caso de Prueba:** TC-XXX

**Pasos para Reproducir:**
1.
2.
3.

**Resultado Esperado:**


**Resultado Actual:**


**Logs/Screenshots:**


**Fecha:** YYYY-MM-DD
**Reporter:** [Nombre]
```

---

## 📞 Contacto

**Equipo de Desarrollo:**
- Francisco Campos
- Sebastian Mella

**Proyecto:** TESTheb E-commerce
**Fecha:** Octubre 2025
