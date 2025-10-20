/**
 * 🧪 Test Completo del Flujo de Compra
 *
 * Este script prueba el flujo completo de compra desde la creación
 * de la transacción hasta la confirmación del pago.
 *
 * Uso: node backend/scripts/test-complete-purchase-flow.js
 */

import fetch from 'node-fetch'
import { config } from 'dotenv'

// Cargar variables de entorno
config()

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000'
const API_BASE = `${BACKEND_URL}/api`

// Colores para output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
}

/**
 * Imprime mensaje con color
 */
function print(message, color = 'reset') {
  //console.log(`${colors[color]}${message}${colors.reset}`)
}

/**
 * Imprime separador
 */
function separator() {
  print('\n' + '='.repeat(70), 'cyan')
}

/**
 * Test: Paso 1 - Crear transacción de pago
 */
async function testCreateTransaction() {
  separator()
  print('📝 TEST 1: CREAR TRANSACCIÓN DE PAGO', 'bright')
  separator()

  const testData = {
    amount: 25000,
    sessionId: `test-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    returnUrl: `${BACKEND_URL}/api/webpay/commit`,
    orderData: {
      cartItems: [
        {
          id: 1,
          name: 'Polera Bordada Test',
          price: 15000,
          quantity: 1
        },
        {
          id: 2,
          name: 'Gorro Personalizado Test',
          price: 10000,
          quantity: 1
        }
      ],
      customerInfo: {
        name: 'Usuario Test Automatizado',
        email: 'test.automated@testheb.cl',
        phone: '+56912345678',
        address: 'Av. Test 123, Depto 456',
        city: 'Santiago Testing'
      }
    }
  }

  print('\n📤 Datos de la transacción:', 'blue')
  print(JSON.stringify(testData, null, 2))

  try {
    print('\n⏳ Creando transacción en Transbank...', 'yellow')

    const response = await fetch(`${API_BASE}/webpay/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    })

    const data = await response.json()

    if (data.success) {
      print('\n✅ TRANSACCIÓN CREADA EXITOSAMENTE', 'green')
      print('\n📋 Detalles de la transacción:', 'blue')
      print(`   • Buy Order: ${data.data.buyOrder}`, 'cyan')
      print(`   • Token: ${data.data.token.substring(0, 40)}...`, 'cyan')
      print(`   • URL: ${data.data.url}`, 'cyan')
      print(`   • Monto: $${data.data.amount.toLocaleString('es-CL')}`, 'cyan')

      return {
        success: true,
        buyOrder: data.data.buyOrder,
        token: data.data.token,
        url: data.data.url,
        amount: data.data.amount,
        sessionId: testData.sessionId,
        customerEmail: testData.orderData.customerInfo.email
      }
    } else {
      print('\n❌ ERROR AL CREAR TRANSACCIÓN', 'red')
      print(JSON.stringify(data, null, 2), 'red')
      return { success: false }
    }
  } catch (error) {
    print('\n❌ ERROR DE CONEXIÓN', 'red')
    print(error.message, 'red')
    return { success: false }
  }
}

/**
 * Test: Paso 2 - Verificar orden en base de datos
 */
async function testVerifyOrderInDB(buyOrder) {
  separator()
  print('📝 TEST 2: VERIFICAR ORDEN EN BASE DE DATOS', 'bright')
  separator()

  try {
    print('\n⏳ Consultando estado de la orden...', 'yellow')

    const response = await fetch(`${API_BASE}/webpay/order/${buyOrder}`)
    const data = await response.json()

    if (data.success) {
      print('\n✅ ORDEN ENCONTRADA EN BASE DE DATOS', 'green')
      print('\n📋 Información de la orden:', 'blue')
      print(`   • Buy Order: ${data.data.buyOrder}`, 'cyan')
      print(`   • Session ID: ${data.data.sessionId}`, 'cyan')
      print(`   • Estado: ${data.data.status}`, 'cyan')
      print(`   • Monto: $${data.data.amount.toLocaleString('es-CL')}`, 'cyan')
      print(`   • Cliente: ${data.data.customerName}`, 'cyan')
      print(`   • Email: ${data.data.customerEmail}`, 'cyan')
      print(`   • Teléfono: ${data.data.customerPhone}`, 'cyan')
      print(`   • Dirección: ${data.data.shippingAddress}`, 'cyan')
      print(`   • Ciudad: ${data.data.shippingCity}`, 'cyan')

      // Verificar items
      if (data.data.items && data.data.items.length > 0) {
        print('\n📦 Items de la orden:', 'blue')
        data.data.items.forEach((item, index) => {
          print(`   ${index + 1}. ${item.name}`, 'cyan')
          print(`      • Precio: $${item.price.toLocaleString('es-CL')}`, 'cyan')
          print(`      • Cantidad: ${item.quantity}`, 'cyan')
        })
      }

      return { success: true, orderData: data.data }
    } else {
      print('\n❌ ORDEN NO ENCONTRADA', 'red')
      return { success: false }
    }
  } catch (error) {
    print('\n❌ ERROR AL VERIFICAR ORDEN', 'red')
    print(error.message, 'red')
    return { success: false }
  }
}

/**
 * Test: Paso 3 - Simular información del portal WebPay
 */
async function testWebPayPortalInfo(token, url) {
  separator()
  print('📝 TEST 3: INFORMACIÓN DEL PORTAL WEBPAY', 'bright')
  separator()

  print('\n📌 INSTRUCCIONES PARA PRUEBA MANUAL:', 'yellow')
  print('\n1️⃣  Abrir el siguiente URL en tu navegador:', 'blue')
  print(`   ${url}`, 'cyan')

  print('\n2️⃣  Usar el siguiente token:', 'blue')
  print(`   ${token}`, 'cyan')

  print('\n3️⃣  En el portal de WebPay, usar tarjeta de prueba:', 'blue')
  print('   📋 TARJETA APROBADA:', 'green')
  print('      • Número: 4051885600446623', 'cyan')
  print('      • CVV: 123', 'cyan')
  print('      • Fecha: Cualquier fecha futura', 'cyan')

  print('\n   📋 TARJETA RECHAZADA (para probar rechazo):', 'red')
  print('      • Número: 5186059559590569', 'cyan')
  print('      • CVV: 123', 'cyan')

  print('\n4️⃣  Después de completar el pago:', 'blue')
  print('   • Transbank enviará callback automáticamente a:', 'cyan')
  print(`     ${BACKEND_URL}/api/webpay/commit`, 'cyan')
  print('   • El sistema actualizará la orden en DB', 'cyan')
  print('   • Serás redirigido a la página de resultado', 'cyan')

  return { success: true }
}

/**
 * Test: Paso 4 - Estadísticas del sistema
 */
async function testSystemStats() {
  separator()
  print('📝 TEST 4: ESTADÍSTICAS DEL SISTEMA', 'bright')
  separator()

  try {
    print('\n⏳ Obteniendo estadísticas...', 'yellow')

    const response = await fetch(`${API_BASE}/stats/sales`)
    const data = await response.json()

    if (data.success) {
      print('\n✅ ESTADÍSTICAS OBTENIDAS', 'green')
      print('\n📊 Resumen de ventas:', 'blue')
      print(`   • Total órdenes: ${data.data.totalOrders}`, 'cyan')
      print(`   • Ingresos totales: $${parseFloat(data.data.totalRevenue).toLocaleString('es-CL')}`, 'cyan')
      print(`   • Ticket promedio: $${parseFloat(data.data.averageTicket).toLocaleString('es-CL')}`, 'cyan')

      return { success: true }
    } else {
      print('\n⚠️  Endpoint de estadísticas no disponible', 'yellow')
      return { success: true }
    }
  } catch (error) {
    print('\n⚠️  Error al obtener estadísticas (opcional)', 'yellow')
    return { success: true }
  }
}

/**
 * Test: Verificar configuración del sistema
 */
async function testSystemConfiguration() {
  separator()
  print('📝 TEST 0: VERIFICAR CONFIGURACIÓN', 'bright')
  separator()

  print('\n🔍 Configuración del sistema:', 'blue')
  print(`   • Backend URL: ${BACKEND_URL}`, 'cyan')
  print(`   • Ambiente: ${process.env.WEBPAY_ENVIRONMENT || 'integration'}`, 'cyan')

  // Verificar que el backend esté disponible
  try {
    print('\n⏳ Verificando conexión al backend...', 'yellow')
    const response = await fetch(`${BACKEND_URL}/api/health`, {
      timeout: 5000
    }).catch(() => ({ ok: false }))

    if (response.ok) {
      print('✅ Backend disponible', 'green')
      return { success: true }
    } else {
      print('❌ Backend no disponible', 'red')
      print('\n💡 Solución:', 'yellow')
      print('   1. Iniciar el servidor backend:', 'cyan')
      print('      cd backend && npm run dev', 'cyan')
      print('   2. Verificar que el puerto 3000 esté disponible', 'cyan')
      print('   3. Ejecutar este script nuevamente', 'cyan')
      return { success: false }
    }
  } catch (error) {
    print('❌ Error de conexión al backend', 'red')
    print(error.message, 'red')
    return { success: false }
  }
}

/**
 * Resumen de resultados
 */
function printSummary(results) {
  separator()
  print('📊 RESUMEN DE RESULTADOS', 'bright')
  separator()

  const tests = [
    { name: 'Configuración del Sistema', result: results.config },
    { name: 'Crear Transacción', result: results.createTransaction },
    { name: 'Verificar Orden en DB', result: results.verifyOrder },
    { name: 'Información Portal WebPay', result: results.webPayInfo },
    { name: 'Estadísticas del Sistema', result: results.systemStats }
  ]

  let passed = 0
  let failed = 0

  print('\n')
  tests.forEach((test, index) => {
    if (test.result?.success) {
      print(`${index + 1}. ✅ ${test.name}`, 'green')
      passed++
    } else {
      print(`${index + 1}. ❌ ${test.name}`, 'red')
      failed++
    }
  })

  separator()
  print(`\n📈 Total: ${passed} pasaron, ${failed} fallaron de ${tests.length} tests`, 'blue')

  if (failed === 0) {
    print('\n🎉 ¡TODOS LOS TESTS PASARON!', 'green')
    print('\n🔥 Próximos pasos:', 'yellow')
    print('   1. Completar el pago manualmente en el portal WebPay', 'cyan')
    print('   2. Verificar que el callback se ejecute correctamente', 'cyan')
    print('   3. Revisar la página de resultado del pago', 'cyan')
    print('   4. Verificar que el carrito se limpie', 'cyan')
    print('   5. Revisar los logs del backend', 'cyan')
  } else {
    print('\n⚠️  ALGUNOS TESTS FALLARON', 'red')
    print('   Revisa los errores arriba para más detalles', 'yellow')
  }

  // Información adicional si se creó una orden
  if (results.createTransaction?.buyOrder) {
    separator()
    print('\n📋 INFORMACIÓN DE LA ORDEN CREADA:', 'bright')
    print(`   • Buy Order: ${results.createTransaction.buyOrder}`, 'cyan')
    print(`   • Email: ${results.createTransaction.customerEmail}`, 'cyan')
    print('\n🔍 Verificar orden en base de datos:', 'yellow')
    print(`   node backend/scripts/verify-order.js ${results.createTransaction.buyOrder}`, 'cyan')
  }

  separator()
}

/**
 * Main - Ejecutar todos los tests
 */
async function main() {
  print('\n🚀 INICIANDO TESTS DEL FLUJO DE COMPRA COMPLETO\n', 'bright')

  const results = {}

  // Test 0: Configuración
  results.config = await testSystemConfiguration()
  if (!results.config.success) {
    print('\n❌ Tests detenidos: Backend no disponible', 'red')
    return
  }

  // Test 1: Crear transacción
  results.createTransaction = await testCreateTransaction()
  if (!results.createTransaction.success) {
    print('\n❌ Tests detenidos: No se pudo crear la transacción', 'red')
    printSummary(results)
    return
  }

  // Esperar un momento para que se guarde en DB
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Test 2: Verificar orden en DB
  results.verifyOrder = await testVerifyOrderInDB(results.createTransaction.buyOrder)

  // Test 3: Información del portal
  results.webPayInfo = await testWebPayPortalInfo(
    results.createTransaction.token,
    results.createTransaction.url
  )

  // Test 4: Estadísticas
  results.systemStats = await testSystemStats()

  // Mostrar resumen
  printSummary(results)
}

// Ejecutar tests
main().catch(error => {
  print('\n❌ ERROR FATAL', 'red')
  print(error.message, 'red')
  console.error(error)
  process.exit(1)
})
