# ⚡ Quick Start - Testing de Pagos

## 🚀 Inicio Rápido en 5 Minutos

### **Paso 1: Iniciar el Backend (30 segundos)**

```bash
cd backend
npm run dev
```

Espera a ver:
```
✅ Server running on port 3000
✅ Database connected
```

---

### **Paso 2: Ejecutar Test Automático (2 minutos)**

En una nueva terminal:

```bash
node backend/scripts/test-complete-purchase-flow.js
```

**Resultado esperado:**
```
🎉 ¡TODOS LOS TESTS PASARON!

📋 INFORMACIÓN DE LA ORDEN CREADA:
   • Buy Order: O-1696524789123
   • Email: test.automated@testheb.cl
```

✅ Si ves esto, el sistema funciona correctamente!

---

### **Paso 3: Ejecutar Tests de Validación (1 minuto)**

```bash
node backend/scripts/test-payment-scenarios.js all
```

**Resultado esperado:**
```
📈 Total: 6 pasaron, 0 fallaron de 6 escenarios
🎉 ¡TODOS LOS ESCENARIOS PASARON!
```

✅ Si ves esto, las validaciones funcionan!

---

### **Paso 4: Prueba Manual (Opcional, 5 minutos)**

Si quieres probar manualmente:

1. **Iniciar frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Abrir navegador:**
   - Ir a `http://localhost:5173`
   - Agregar productos al carrito
   - Ir a checkout
   - Completar formulario

3. **En WebPay (sandbox):**
   - Tarjeta: `4051885600446623`
   - CVV: `123`
   - Fecha: `12/25`

4. **Verificar resultado:**
   - Deberías ver mensaje de éxito ✅
   - Número de orden
   - Código de autorización

---

## 📊 ¿Qué se Probó?

### ✅ Test Automático Completo
- Configuración del sistema
- Creación de transacción
- Guardado en base de datos
- Generación de token WebPay
- Estadísticas del sistema

### ✅ Tests de Validación
- Rechazo de monto negativo
- Rechazo de monto cero
- Rechazo sin session ID
- Orden grande (50 items)
- Caracteres especiales
- Transacciones concurrentes

---

## 🔍 Verificar en Base de Datos

```bash
# Conectar a PostgreSQL
psql -d testheb_db

# Ver últimas órdenes
SELECT buy_order, status, amount, customer_email, created_at
FROM orders
ORDER BY created_at DESC
LIMIT 5;
```

Deberías ver las órdenes de prueba creadas!

---

## ❌ Troubleshooting Rápido

### **Error: "Backend no disponible"**

```bash
# Verificar que el backend esté corriendo
lsof -i :3000

# Si no está corriendo, iniciarlo
cd backend && npm run dev
```

---

### **Error: "Cannot connect to database"**

```bash
# Verificar PostgreSQL
psql -d testheb_db -c "SELECT 1"

# Si falla, iniciar PostgreSQL
# macOS: brew services start postgresql
# Linux: sudo service postgresql start
# Windows: Iniciar servicio desde Services
```

---

### **Tests fallan**

```bash
# Verificar logs del backend
tail -f backend/logs/combined.log

# Verificar variables de entorno
cat backend/.env | grep -E "DB_|WEBPAY_"
```

---

## 📚 Documentación Completa

Para más detalles:

- **Flujo completo:** `backend/PAYMENT_FLOW_DOCUMENTATION.md`
- **Casos de prueba:** `backend/PAYMENT_TEST_CASES.md`
- **Guía de testing:** `backend/TESTING_GUIDE.md`
- **Resumen:** `PAYMENT_DOCUMENTATION_COMPLETE.md`

---

## 🎯 Checklist Rápido

- [ ] Backend corriendo en puerto 3000
- [ ] Test completo ejecutado exitosamente
- [ ] Test de escenarios ejecutado exitosamente
- [ ] (Opcional) Prueba manual completada
- [ ] Órdenes visibles en base de datos

Si todos están ✅, ¡estás listo! 🎉

---

**Tiempo total:** ~5 minutos
**Nivel de dificultad:** Fácil
**Prerequisitos:** Backend instalado, PostgreSQL corriendo

---

## 🚀 Comandos de un Solo Paso

```bash
# Test todo de una vez
cd backend && npm run dev &
sleep 3
node scripts/test-complete-purchase-flow.js
node scripts/test-payment-scenarios.js all
```

---

**¡Listo para probar!** 🎉
