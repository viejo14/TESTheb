/**
 * Script para probar la subida de imágenes
 * Uso: node backend/scripts/test-image-upload.js
 */

import cloudinary from '../src/config/cloudinary.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

//console.log('🧪 Iniciando test de subida de imágenes...\n')

// Test 1: Verificar configuración de Cloudinary
//console.log('1️⃣ Verificando configuración de Cloudinary...')
//console.log(`   Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`)
//console.log(`   API Key: ${process.env.CLOUDINARY_API_KEY ? '✅ Configurado' : '❌ Faltante'}`)
//console.log(`   API Secret: ${process.env.CLOUDINARY_API_SECRET ? '✅ Configurado' : '❌ Faltante'}`)

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('\n❌ Faltan credenciales de Cloudinary en .env')
  process.exit(1)
}

//console.log('\n✅ Configuración válida\n')

// Test 2: Probar subida a Cloudinary con una imagen de prueba
//console.log('2️⃣ Probando subida a Cloudinary...')
//console.log('   Creando imagen de prueba...')

// Crear una imagen de prueba simple (1x1 pixel PNG)
const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
const testImageBuffer = Buffer.from(testImageBase64, 'base64')

//console.log('   Subiendo a Cloudinary...')

try {
  // Subir usando upload_stream
  const uploadPromise = new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'testheb/test',
        resource_type: 'auto',
        public_id: `test-${Date.now()}`
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      }
    )

    uploadStream.write(testImageBuffer)
    uploadStream.end()
  })

  const result = await uploadPromise

  //console.log('\n✅ Imagen subida exitosamente!')
  //console.log(`   URL: ${result.secure_url}`)
  //console.log(`   Public ID: ${result.public_id}`)
  //console.log(`   Tamaño: ${result.bytes} bytes`)

  // Limpiar (eliminar la imagen de prueba)
  //console.log('\n3️⃣ Limpiando imagen de prueba...')
  await cloudinary.uploader.destroy(result.public_id)
  //console.log('✅ Imagen eliminada')

  //console.log('\n🎉 ¡Todos los tests pasaron! Cloudinary está funcionando correctamente.')

} catch (error) {
  console.error('\n❌ Error en el test:')
  console.error(error)
  //console.log('\n💡 Posibles soluciones:')
  //console.log('   1. Verificar que las credenciales en .env sean correctas')
  //console.log('   2. Verificar conectividad a internet')
  //console.log('   3. Verificar que la cuenta de Cloudinary esté activa')
  process.exit(1)
}
