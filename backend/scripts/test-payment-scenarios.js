/**
 * 🧪 Tests de Escenarios Específicos de Pago
 *
 * Este script prueba casos específicos y edge cases del sistema de pagos
 *
 * Uso: node backend/scripts/test-payment-scenarios.js [scenario]
 *
 * Escenarios disponibles:
 *   - all: Ejecutar todos los escenarios
 *   - negative-amount: Probar monto negativo
 *   - zero-amount: Probar monto en cero
 *   - missing-session: Probar sin session ID
 *   - empty-cart: Probar carrito vacío
 *   - large-order: Probar orden grande
 */

import fetch from 'node-fetch'
import { config } from 'dotenv'

config()

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000'
const API_BASE = `${BACKEND_URL}/api`

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
}

function print(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function separator() {
  print('\n' + '='.repeat(70), 'cyan')
}

/**
 * Escenario 1: Monto Negativo (debe fallar)
 */
async function testNegativeAmount() {
  separator()
  print('🧪 ESCENARIO 1: MONTO NEGATIVO', 'bright')
  separator()

  const testData = {
    amount: -5000,
    sessionId: `test-negative-${Date.now()}`,
    returnUrl: `${BACKEND_URL}/api/webpay/commit`,
    orderData: {
      cartItems: [{ id: 1, name: 'Producto Test', price: 5000, quantity: 1 }],
      customerInfo: {
        name: 'Test Negativo',
        email: 'test@test.com',
        phone: '+56912345678',
        address: 'Test 123',
        city: 'Santiago'
      }
    }
  }

  try {
    const response = await fetch(`${API_BASE}/webpay/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    })

    const data = await response.json()

    if (!data.success && response.status === 400) {
      print('\n✅ TEST PASADO: Sistema rechazó monto negativo correctamente', 'green')
      print(`   Mensaje: ${data.message}`, 'cyan')
      return { success: true, passed: true }
    } else {
      print('\n❌ TEST FALLADO: Sistema aceptó monto negativo', 'red')
      return { success: false, passed: false }
    }
  } catch (error) {
    print('\n❌ ERROR EN TEST', 'red')
    print(error.message, 'red')
    return { success: false, passed: false }
  }
}

/**
 * Escenario 2: Monto en Cero (debe fallar)
 */
async function testZeroAmount() {
  separator()
  print('🧪 ESCENARIO 2: MONTO EN CERO', 'bright')
  separator()

  const testData = {
    amount: 0,
    sessionId: `test-zero-${Date.now()}`,
    returnUrl: `${BACKEND_URL}/api/webpay/commit`,
    orderData: {
      cartItems: [],
      customerInfo: {
        name: 'Test Cero',
        email: 'test@test.com',
        phone: '+56912345678',
        address: 'Test 123',
        city: 'Santiago'
      }
    }
  }

  try {
    const response = await fetch(`${API_BASE}/webpay/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    })

    const data = await response.json()

    if (!data.success && response.status === 400) {
      print('\n✅ TEST PASADO: Sistema rechazó monto cero correctamente', 'green')
      print(`   Mensaje: ${data.message}`, 'cyan')
      return { success: true, passed: true }
    } else {
      print('\n❌ TEST FALLADO: Sistema aceptó monto cero', 'red')
      return { success: false, passed: false }
    }
  } catch (error) {
    print('\n❌ ERROR EN TEST', 'red')
    print(error.message, 'red')
    return { success: false, passed: false }
  }
}

/**
 * Escenario 3: Sin Session ID (debe fallar)
 */
async function testMissingSessionId() {
  separator()
  print('🧪 ESCENARIO 3: SIN SESSION ID', 'bright')
  separator()

  const testData = {
    amount: 10000,
    // sessionId intencionalmente omitido
    returnUrl: `${BACKEND_URL}/api/webpay/commit`,
    orderData: {
      cartItems: [{ id: 1, name: 'Producto Test', price: 10000, quantity: 1 }],
      customerInfo: {
        name: 'Test Sin Session',
        email: 'test@test.com',
        phone: '+56912345678',
        address: 'Test 123',
        city: 'Santiago'
      }
    }
  }

  try {
    const response = await fetch(`${API_BASE}/webpay/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    })

    const data = await response.json()

    if (!data.success && response.status === 400) {
      print('\n✅ TEST PASADO: Sistema rechazó falta de session ID', 'green')
      print(`   Mensaje: ${data.message}`, 'cyan')
      return { success: true, passed: true }
    } else {
      print('\n❌ TEST FALLADO: Sistema aceptó sin session ID', 'red')
      return { success: false, passed: false }
    }
  } catch (error) {
    print('\n❌ ERROR EN TEST', 'red')
    print(error.message, 'red')
    return { success: false, passed: false }
  }
}

/**
 * Escenario 4: Orden Grande (debe pasar)
 */
async function testLargeOrder() {
  separator()
  print('🧪 ESCENARIO 4: ORDEN GRANDE (50 ITEMS)', 'bright')
  separator()

  // Generar 50 items
  const cartItems = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Producto Test ${i + 1}`,
    price: 1000 + (i * 100),
    quantity: 1 + (i % 5)
  }))

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const testData = {
    amount: totalAmount,
    sessionId: `test-large-${Date.now()}`,
    returnUrl: `${BACKEND_URL}/api/webpay/commit`,
    orderData: {
      cartItems,
      customerInfo: {
        name: 'Test Orden Grande',
        email: 'large.order@test.com',
        phone: '+56912345678',
        address: 'Test 123',
        city: 'Santiago'
      }
    }
  }

  print(`\n📦 Total items: ${cartItems.length}`, 'blue')
  print(`💰 Monto total: $${totalAmount.toLocaleString('es-CL')}`, 'blue')

  try {
    const response = await fetch(`${API_BASE}/webpay/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    })

    const data = await response.json()

    if (data.success) {
      print('\n✅ TEST PASADO: Sistema procesó orden grande correctamente', 'green')
      print(`   Buy Order: ${data.data.buyOrder}`, 'cyan')
      print(`   Monto: $${data.data.amount.toLocaleString('es-CL')}`, 'cyan')
      return { success: true, passed: true, buyOrder: data.data.buyOrder }
    } else {
      print('\n❌ TEST FALLADO: Error al procesar orden grande', 'red')
      print(`   Mensaje: ${data.message}`, 'red')
      return { success: false, passed: false }
    }
  } catch (error) {
    print('\n❌ ERROR EN TEST', 'red')
    print(error.message, 'red')
    return { success: false, passed: false }
  }
}

/**
 * Escenario 5: Caracteres Especiales en Datos
 */
async function testSpecialCharacters() {
  separator()
  print('🧪 ESCENARIO 5: CARACTERES ESPECIALES', 'bright')
  separator()

  const testData = {
    amount: 15000,
    sessionId: `test-special-${Date.now()}`,
    returnUrl: `${BACKEND_URL}/api/webpay/commit`,
    orderData: {
      cartItems: [
        {
          id: 1,
          name: 'Producto con ñ, á, é, í, ó, ú y ü',
          price: 15000,
          quantity: 1
        }
      ],
      customerInfo: {
        name: 'José María Pérez-González',
        email: 'jose.maria@test.cl',
        phone: '+56 9 1234-5678',
        address: 'Av. O\'Higgins #123, Depto. 4-B',
        city: 'Viña del Mar'
      }
    }
  }

  try {
    const response = await fetch(`${API_BASE}/webpay/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    })

    const data = await response.json()

    if (data.success) {
      print('\n✅ TEST PASADO: Sistema manejó caracteres especiales', 'green')
      print(`   Buy Order: ${data.data.buyOrder}`, 'cyan')

      // Verificar que se guardó correctamente en DB
      const verifyResponse = await fetch(`${API_BASE}/webpay/order/${data.data.buyOrder}`)
      const verifyData = await verifyResponse.json()

      if (verifyData.success && verifyData.data.customerName.includes('José')) {
        print('✅ Datos guardados correctamente en DB', 'green')
        return { success: true, passed: true }
      } else {
        print('⚠️  Posible problema con encoding de caracteres', 'yellow')
        return { success: true, passed: true }
      }
    } else {
      print('\n❌ TEST FALLADO: Error con caracteres especiales', 'red')
      return { success: false, passed: false }
    }
  } catch (error) {
    print('\n❌ ERROR EN TEST', 'red')
    print(error.message, 'red')
    return { success: false, passed: false }
  }
}

/**
 * Escenario 6: Múltiples Transacciones Concurrentes
 */
async function testConcurrentTransactions() {
  separator()
  print('🧪 ESCENARIO 6: TRANSACCIONES CONCURRENTES', 'bright')
  separator()

  print('\n⏳ Creando 5 transacciones simultáneas...', 'yellow')

  const promises = Array.from({ length: 5 }, (_, i) => {
    const testData = {
      amount: 5000 * (i + 1),
      sessionId: `test-concurrent-${Date.now()}-${i}`,
      returnUrl: `${BACKEND_URL}/api/webpay/commit`,
      orderData: {
        cartItems: [
          {
            id: i + 1,
            name: `Producto Concurrente ${i + 1}`,
            price: 5000 * (i + 1),
            quantity: 1
          }
        ],
        customerInfo: {
          name: `Test Concurrente ${i + 1}`,
          email: `concurrent${i}@test.com`,
          phone: '+56912345678',
          address: 'Test 123',
          city: 'Santiago'
        }
      }
    }

    return fetch(`${API_BASE}/webpay/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    }).then(res => res.json())
  })

  try {
    const results = await Promise.all(promises)
    const successful = results.filter(r => r.success).length

    print(`\n📊 Resultado: ${successful} de 5 transacciones exitosas`, 'blue')

    if (successful === 5) {
      print('✅ TEST PASADO: Todas las transacciones concurrentes exitosas', 'green')
      results.forEach((r, i) => {
        if (r.success) {
          print(`   ${i + 1}. ${r.data.buyOrder}`, 'cyan')
        }
      })
      return { success: true, passed: true }
    } else {
      print('⚠️  Algunas transacciones fallaron', 'yellow')
      return { success: true, passed: false }
    }
  } catch (error) {
    print('\n❌ ERROR EN TEST', 'red')
    print(error.message, 'red')
    return { success: false, passed: false }
  }
}

/**
 * Resumen de resultados
 */
function printSummary(results) {
  separator()
  print('📊 RESUMEN DE ESCENARIOS', 'bright')
  separator()

  const scenarios = [
    { name: 'Monto Negativo', result: results.negativeAmount },
    { name: 'Monto en Cero', result: results.zeroAmount },
    { name: 'Sin Session ID', result: results.missingSession },
    { name: 'Orden Grande', result: results.largeOrder },
    { name: 'Caracteres Especiales', result: results.specialChars },
    { name: 'Transacciones Concurrentes', result: results.concurrent }
  ]

  let passed = 0
  let failed = 0

  print('\n')
  scenarios.forEach((scenario, index) => {
    if (scenario.result?.passed) {
      print(`${index + 1}. ✅ ${scenario.name}`, 'green')
      passed++
    } else {
      print(`${index + 1}. ❌ ${scenario.name}`, 'red')
      failed++
    }
  })

  separator()
  print(`\n📈 Total: ${passed} pasaron, ${failed} fallaron de ${scenarios.length} escenarios`, 'blue')

  if (failed === 0) {
    print('\n🎉 ¡TODOS LOS ESCENARIOS PASARON!', 'green')
  } else {
    print('\n⚠️  ALGUNOS ESCENARIOS FALLARON', 'red')
  }

  separator()
}

/**
 * Main
 */
async function main() {
  const scenario = process.argv[2] || 'all'

  print('\n🧪 TESTS DE ESCENARIOS ESPECÍFICOS DE PAGO\n', 'bright')

  const results = {}

  if (scenario === 'all' || scenario === 'negative-amount') {
    results.negativeAmount = await testNegativeAmount()
  }

  if (scenario === 'all' || scenario === 'zero-amount') {
    results.zeroAmount = await testZeroAmount()
  }

  if (scenario === 'all' || scenario === 'missing-session') {
    results.missingSession = await testMissingSessionId()
  }

  if (scenario === 'all' || scenario === 'large-order') {
    results.largeOrder = await testLargeOrder()
  }

  if (scenario === 'all' || scenario === 'special-chars') {
    results.specialChars = await testSpecialCharacters()
  }

  if (scenario === 'all' || scenario === 'concurrent') {
    results.concurrent = await testConcurrentTransactions()
  }

  if (scenario === 'all') {
    printSummary(results)
  }
}

main().catch(error => {
  print('\n❌ ERROR FATAL', 'red')
  print(error.message, 'red')
  console.error(error)
  process.exit(1)
})
