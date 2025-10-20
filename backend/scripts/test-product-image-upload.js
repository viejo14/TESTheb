/**
 * Diagnóstico completo para subida de imágenes de productos
 * Uso: node backend/scripts/test-product-image-upload.js
 *
 * Este script verifica la configuración y proporciona guías para depuración manual
 */

import cloudinary from '../src/config/cloudinary.js'
import dotenv from 'dotenv'

dotenv.config()

//console.log('🧪 DIAGNÓSTICO - SUBIDA DE IMÁGENES DE PRODUCTOS\n')
//console.log('='.repeat(70))

// Test 1: Verificar variables de entorno
//console.log('\n1️⃣ Verificando variables de entorno...\n')

const cloudinaryConfig = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
  folder: process.env.CLOUDINARY_FOLDER
}

//console.log('   Cloud Name:', cloudinaryConfig.cloudName || '❌ NO CONFIGURADO')
//console.log('   API Key:', cloudinaryConfig.apiKey ? `✅ ${cloudinaryConfig.apiKey}` : '❌ NO CONFIGURADO')
//console.log('   API Secret:', cloudinaryConfig.apiSecret ? '✅ Configurado (oculto)' : '❌ NO CONFIGURADO')
//console.log('   Folder:', cloudinaryConfig.folder || 'testheb (default)')

if (!cloudinaryConfig.cloudName || !cloudinaryConfig.apiKey || !cloudinaryConfig.apiSecret) {
  //console.log('\n❌ FALTAN CREDENCIALES DE CLOUDINARY')
  //console.log('\n   Agrega estas líneas a backend/.env:')
  //console.log('   CLOUDINARY_CLOUD_NAME=tu-cloud-name')
  //console.log('   CLOUDINARY_API_KEY=tu-api-key')
  //console.log('   CLOUDINARY_API_SECRET=tu-api-secret')
  //console.log('   CLOUDINARY_FOLDER=testheb')
  process.exit(1)
} else {
  //console.log('\n✅ Todas las credenciales configuradas')
}

// Test 2: Probar conectividad con Cloudinary
//console.log('\n2️⃣ Probando conectividad con Cloudinary...\n')

try {
  // Crear imagen de prueba (1x1 pixel PNG)
  const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
  const testImageBuffer = Buffer.from(testImageBase64, 'base64')

  //console.log('   Subiendo imagen de prueba a Cloudinary...')

  const uploadPromise = new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'testheb/products-test',
        resource_type: 'auto',
        public_id: `diagnostic-${Date.now()}`
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    )
    uploadStream.write(testImageBuffer)
    uploadStream.end()
  })

  const result = await uploadPromise

  //console.log('   ✅ Upload exitoso!')
  //console.log(`   URL: ${result.secure_url}`)
  //console.log(`   Public ID: ${result.public_id}`)

  // Limpiar
  //console.log('\n   Eliminando imagen de prueba...')
  await cloudinary.uploader.destroy(result.public_id)
  //console.log('   ✅ Imagen eliminada')

  //console.log('\n✅ Cloudinary funciona correctamente!')

} catch (error) {
  console.error('\n❌ ERROR conectando con Cloudinary:')
  console.error(`   ${error.message}`)
  //console.log('\n   Posibles causas:')
  //console.log('   - Credenciales inválidas')
  //console.log('   - Sin conexión a internet')
  //console.log('   - Cuenta de Cloudinary desactivada')
  process.exit(1)
}

// Test 3: Verificar endpoints registrados
//console.log('\n3️⃣ Endpoints configurados:\n')
//console.log('   POST /api/upload/product-image (Cloudinary)')
//console.log('   POST /api/upload/product-image-local (Local)')
//console.log('   DELETE /api/upload/product-image/:id')
//console.log('   DELETE /api/upload/product-image-local/:filename')

// Test 4: Guía de depuración
//console.log('\n' + '='.repeat(70))
//console.log('📋 GUÍA DE DEPURACIÓN MANUAL\n')

//console.log('🔧 PARA PROBAR DESDE EL NAVEGADOR:\n')
//console.log('   1. Asegúrate de que el backend esté corriendo:')
//console.log('      cd backend && npm run dev\n')
//console.log('   2. Asegúrate de que el frontend esté corriendo:')
//console.log('      cd frontend && npm run dev\n')
//console.log('   3. Abre el navegador en http://localhost:5173\n')
//console.log('   4. Ve al Panel Admin → Productos → Agregar Producto\n')
//console.log('   5. ANTES de intentar subir, abre DevTools (F12):\n')
//console.log('      a) Pestaña Console: Ver errores de JavaScript')
//console.log('      b) Pestaña Network: Ver peticiones HTTP\n')
//console.log('   6. Selecciona tipo de upload (Cloudinary/Local/URL)\n')
//console.log('   7. Intenta subir una imagen\n')
//console.log('   8. Si falla, revisa:\n')

//console.log('📊 QUÉ BUSCAR EN DEVTOOLS:\n')
//console.log('   Network tab:')
//console.log('   - Busca petición "product-image"')
//console.log('   - Status Code → debería ser 200')
//console.log('   - Request Headers → Content-Type: multipart/form-data')
//console.log('   - Response → {success: true, data: {...}}')
//console.log('   - Si aparece CORS error → problema de configuración\n')

//console.log('   Console tab:')
//console.log('   - Errores en rojo → copiar el mensaje completo')
//console.log('   - "Error uploading image" → ver detalles en Network')
//console.log('   - "Failed to fetch" → backend no está corriendo\n')

//console.log('🔍 PROBLEMAS COMUNES Y SOLUCIONES:\n')
//console.log('   ❌ "Failed to fetch" o "Network Error"')
//console.log('      → El backend no está corriendo o usa puerto incorrecto')
//console.log('      → Verifica: backend corriendo en puerto 3000')
//console.log('      → Verifica: vite.config.js proxy apunta a puerto correcto\n')

//console.log('   ❌ "CORS policy" error')
//console.log('      → Verifica server.js: app.use(cors())')
//console.log('      → Verifica que el frontend use el proxy de Vite\n')

//console.log('   ❌ Upload se queda en "Subiendo..."')
//console.log('      → Revisa Network tab para ver qué petición se envía')
//console.log('      → Puede ser timeout o error en el backend')
//console.log('      → Revisa logs del backend en la terminal\n')

//console.log('   ❌ "Error subiendo imagen" (genérico)')
//console.log('      → Abre Network tab → Click en "product-image"')
//console.log('      → Lee el Response para ver el error específico')
//console.log('      → Puede ser: tamaño, tipo de archivo, credenciales\n')

//console.log('📝 CONFIGURACIÓN ACTUAL:\n')
//console.log(`   Backend URL esperada: http://192.168.100.40:3000`)
//console.log(`   Frontend URL: http://localhost:5173`)
//console.log(`   API Base (desde frontend): /api (proxy a backend)`)
//console.log(`   Cloudinary Folder: ${cloudinaryConfig.folder || 'testheb'}`)
//console.log(`   Límite de tamaño: 5MB (definido en uploadRoutes.js)`)

//console.log('\n' + '='.repeat(70))
//console.log('✅ DIAGNÓSTICO COMPLETADO\n')
//console.log('Si Cloudinary funciona aquí pero falla en el navegador,')
//console.log('el problema está en la comunicación frontend → backend.')
//console.log('Usa las guías de depuración arriba para identificar el problema.')
