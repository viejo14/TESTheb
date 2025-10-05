// 🔍 Script de Diagnóstico Rápido - Transbank
// Ejecutar: node backend/scripts/diagnostico-transbank.js

import dotenv from 'dotenv'
dotenv.config()

console.log('🔍 DIAGNÓSTICO DE CONFIGURACIÓN TRANSBANK')
console.log('==========================================\n')

// 1. Verificar variables de entorno
console.log('📋 1. VARIABLES DE ENTORNO:')
console.log('   NODE_ENV:', process.env.NODE_ENV || 'no configurado')
console.log('   PORT:', process.env.PORT || 'no configurado')
console.log('   FRONTEND_URL:', process.env.FRONTEND_URL || 'no configurado')
console.log('   TRANSBANK_INTEGRATION_TYPE:', process.env.TRANSBANK_INTEGRATION_TYPE || 'no configurado')
console.log('   TRANSBANK_COMMERCE_CODE:', process.env.TRANSBANK_COMMERCE_CODE || 'no configurado')

// IMPORTANTE: Verificar que NO haya API keys en modo TEST
const hasApiKeyId = !!process.env.TRANSBANK_API_KEY_ID
const hasApiKeySecret = !!process.env.TRANSBANK_API_KEY_SECRET

if (hasApiKeyId || hasApiKeySecret) {
  console.log('\n   ⚠️  ADVERTENCIA: Detectadas API keys en .env')
  console.log('   Para modo TEST, NO debes tener estas variables:')
  if (hasApiKeyId) console.log('   ❌ TRANSBANK_API_KEY_ID=' + process.env.TRANSBANK_API_KEY_ID)
  if (hasApiKeySecret) console.log('   ❌ TRANSBANK_API_KEY_SECRET=' + process.env.TRANSBANK_API_KEY_SECRET)
  console.log('\n   💡 SOLUCIÓN: Elimina o comenta esas líneas del .env')
}

console.log('\n')

// 2. Verificar configuración del SDK
console.log('📦 2. CONFIGURACIÓN DEL SDK:')
try {
  const pkg = await import('transbank-sdk')
  const { WebpayPlus, IntegrationApiKeys, IntegrationCommerceCodes, Environment } = pkg.default

  console.log('   ✅ transbank-sdk instalado correctamente')
  console.log('   Commerce Code (TEST):', IntegrationCommerceCodes.WEBPAY_PLUS)
  console.log('   Environment:', process.env.NODE_ENV === 'production' ? 'Production' : 'Integration (TEST)')
  
} catch (error) {
  console.log('   ❌ Error importando transbank-sdk:', error.message)
  console.log('   💡 Ejecuta: npm install transbank-sdk')
}

console.log('\n')

// 3. Verificar archivo de configuración
console.log('📄 3. ARCHIVO DE CONFIGURACIÓN:')
try {
  const config = await import('../src/config/transbank.js')
  console.log('   ✅ Archivo transbank.js cargado')
  console.log('   Config actual:', JSON.stringify(config.currentConfig, null, 2))
} catch (error) {
  console.log('   ❌ Error cargando configuración:', error.message)
}

console.log('\n')

// 4. Simular creación de transacción
console.log('🧪 4. PRUEBA DE CREACIÓN DE TRANSACCIÓN:')
try {
  const { webpayPlus } = await import('../src/config/transbank.js')
  
  const testData = {
    buyOrder: `test-${Date.now()}`,
    sessionId: `session-${Date.now()}`,
    amount: 1000,
    returnUrl: 'http://localhost:5173/payment-result'
  }

  console.log('   Datos de prueba:', testData)
  console.log('   Creando transacción...')

  const response = await webpayPlus.create(
    testData.buyOrder,
    testData.sessionId,
    testData.amount,
    testData.returnUrl
  )

  console.log('   ✅ TRANSACCIÓN CREADA EXITOSAMENTE')
  console.log('   Token:', response.token)
  console.log('   URL:', response.url)
  console.log('\n   🎉 La integración está funcionando correctamente!')
  console.log('   🔗 Prueba manual: ' + response.url + '?token_ws=' + response.token)
  
} catch (error) {
  console.log('   ❌ ERROR AL CREAR TRANSACCIÓN')
  console.log('   Mensaje:', error.message)
  console.log('   Stack:', error.stack)
  
  console.log('\n   🔧 POSIBLES SOLUCIONES:')
  if (error.message.includes('api_key') || error.message.includes('commerce')) {
    console.log('   1. Verifica que NO tengas TRANSBANK_API_KEY_ID ni TRANSBANK_API_KEY_SECRET en .env')
    console.log('   2. Asegúrate que TRANSBANK_INTEGRATION_TYPE=TEST')
    console.log('   3. Reinicia el servidor después de modificar .env')
  }
  if (error.message.includes('network') || error.message.includes('ECONNREFUSED')) {
    console.log('   1. Verifica tu conexión a internet')
    console.log('   2. Transbank requiere acceso a internet para funcionar')
  }
}

console.log('\n')
console.log('==========================================')
console.log('✅ Diagnóstico completado')
console.log('\nSi ves errores arriba, comparte este reporte completo.')
