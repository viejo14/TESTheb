/**
 * Test completo de subida de imágenes - Local y Cloudinary
 * Uso: node backend/scripts/test-complete-image-upload.js
 */

import fetch from 'node-fetch'
import FormData from 'form-data'
import fs from 'fs'
import path from 'path'

const API_BASE_URL = 'http://localhost:3000/api'

async function createTestImage() {
  const testImagePath = path.join(process.cwd(), 'test-complete-image.jpg')
  
  // Crear un archivo de imagen básico (1x1 pixel JPG)
  const jpegHeader = Buffer.from([
    0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
    0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
    0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
    0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
    0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
    0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29,
    0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32,
    0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x11, 0x08, 0x00, 0x01,
    0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01,
    0xFF, 0xC4, 0x00, 0x14, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0xFF, 0xC4,
    0x00, 0x14, 0x10, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xDA, 0x00, 0x0C,
    0x03, 0x01, 0x00, 0x02, 0x11, 0x03, 0x11, 0x00, 0x3F, 0x00, 0xAA, 0xFF, 0xD9
  ])
  
  fs.writeFileSync(testImagePath, jpegHeader)
  return testImagePath
}

async function testLocalUpload() {
  console.log('\n🏠 TEST 1: SUBIDA LOCAL')
  console.log('=' .repeat(50))
  
  try {
    const testImagePath = await createTestImage()
    
    const formData = new FormData()
    formData.append('image', fs.createReadStream(testImagePath), {
      filename: 'producto-local-test.jpg',
      contentType: 'image/jpeg'
    })
    
    const response = await fetch(`${API_BASE_URL}/upload/product-image-local`, {
      method: 'POST',
      body: formData
    })
    
    const result = await response.json()
    
    if (response.ok && result.success) {
      console.log('✅ SUBIDA LOCAL EXITOSA!')
      console.log('📂 Archivo:', result.data.filename)
      console.log('🔗 URL:', result.data.imageUrl)
      console.log('📊 Tamaño:', result.data.size, 'bytes')
      
      // Verificar que el archivo existe
      const expectedPath = path.join(process.cwd(), 'frontend', 'public', 'images', 'products', result.data.filename)
      if (fs.existsSync(expectedPath)) {
        console.log('✅ Archivo guardado correctamente en el servidor')
      } else {
        console.log('❌ Archivo NO encontrado en el servidor')
      }
      
      return result.data
    } else {
      console.log('❌ ERROR EN SUBIDA LOCAL:', result)
      return null
    }
    
  } catch (error) {
    console.log('❌ ERROR EN TEST LOCAL:', error.message)
    return null
  }
}

async function testCloudinaryUpload() {
  console.log('\n☁️ TEST 2: SUBIDA CLOUDINARY')
  console.log('=' .repeat(50))
  
  try {
    const testImagePath = await createTestImage()
    
    const formData = new FormData()
    formData.append('image', fs.createReadStream(testImagePath), {
      filename: 'producto-cloudinary-test.jpg',
      contentType: 'image/jpeg'
    })
    
    const response = await fetch(`${API_BASE_URL}/upload/product-image`, {
      method: 'POST',
      body: formData
    })
    
    const result = await response.json()
    
    if (response.ok && result.success) {
      console.log('✅ SUBIDA CLOUDINARY EXITOSA!')
      console.log('🆔 Cloudinary ID:', result.data.cloudinaryId)
      console.log('🔗 URL Optimizada:', result.data.optimizedUrl)
      console.log('🔗 URL Original:', result.data.originalUrl)
      console.log('📊 Tamaño:', result.data.size, 'bytes')
      console.log('📁 Carpeta:', result.data.folder)
      
      return result.data
    } else {
      console.log('❌ ERROR EN SUBIDA CLOUDINARY:', result)
      return null
    }
    
  } catch (error) {
    console.log('❌ ERROR EN TEST CLOUDINARY:', error.message)
    return null
  }
}

async function testProductCreation(localImageData, cloudinaryImageData) {
  console.log('\n🛍️ TEST 3: CREACIÓN DE PRODUCTOS')
  console.log('=' .repeat(50))
  
  try {
    // Test producto con imagen local
    if (localImageData) {
      console.log('\n📤 Creando producto con imagen local...')
      
      const localProductData = {
        name: 'Producto Test Local',
        description: 'Producto de prueba con imagen local',
        price: 15000,
        category_id: 1, // Asume que existe categoría con ID 1
        image_url: localImageData.imageUrl,
        stock: 10
      }
      
      const localResponse = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(localProductData)
      })
      
      const localResult = await localResponse.json()
      
      if (localResponse.ok && localResult.success) {
        console.log('✅ Producto con imagen local creado exitosamente!')
        console.log('🆔 ID del producto:', localResult.data.id)
      } else {
        console.log('❌ Error creando producto local:', localResult)
      }
    }
    
    // Test producto con imagen Cloudinary
    if (cloudinaryImageData) {
      console.log('\n☁️ Creando producto con imagen Cloudinary...')
      
      const cloudinaryProductData = {
        name: 'Producto Test Cloudinary',
        description: 'Producto de prueba con imagen en Cloudinary',
        price: 25000,
        category_id: 1, // Asume que existe categoría con ID 1
        image_url: cloudinaryImageData.optimizedUrl,
        stock: 5
      }
      
      const cloudinaryResponse = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cloudinaryProductData)
      })
      
      const cloudinaryResult = await cloudinaryResponse.json()
      
      if (cloudinaryResponse.ok && cloudinaryResult.success) {
        console.log('✅ Producto con imagen Cloudinary creado exitosamente!')
        console.log('🆔 ID del producto:', cloudinaryResult.data.id)
      } else {
        console.log('❌ Error creando producto Cloudinary:', cloudinaryResult)
      }
    }
    
  } catch (error) {
    console.log('❌ ERROR EN CREACIÓN DE PRODUCTOS:', error.message)
  }
}

async function runCompleteTest() {
  console.log('🚀 INICIANDO TEST COMPLETO DE SUBIDA DE IMÁGENES')
  console.log('=' .repeat(70))
  console.log('Este test verificará:')
  console.log('1. ✅ Subida local de imágenes')
  console.log('2. ✅ Subida a Cloudinary')
  console.log('3. ✅ Creación de productos con ambos tipos de imagen')
  console.log('=' .repeat(70))
  
  const localImageData = await testLocalUpload()
  const cloudinaryImageData = await testCloudinaryUpload()
  
  await testProductCreation(localImageData, cloudinaryImageData)
  
  console.log('\n🎉 TEST COMPLETO FINALIZADO')
  console.log('=' .repeat(50))
  
  // Resumen
  if (localImageData && cloudinaryImageData) {
    console.log('✅ AMBOS MÉTODOS DE SUBIDA FUNCIONAN CORRECTAMENTE!')
    console.log('✅ Puedes usar tanto subida local como Cloudinary')
  } else if (localImageData) {
    console.log('✅ Subida local funciona')
    console.log('⚠️  Cloudinary tiene problemas - revisa configuración')
  } else if (cloudinaryImageData) {
    console.log('✅ Cloudinary funciona')
    console.log('⚠️  Subida local tiene problemas')
  } else {
    console.log('❌ Ambos métodos tienen problemas')
  }
  
  // Limpiar archivos de prueba
  try {
    const testFiles = ['test-complete-image.jpg']
    testFiles.forEach(file => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file)
      }
    })
    console.log('🧹 Archivos de prueba eliminados')
  } catch (error) {
    console.log('⚠️  Error limpiando archivos de prueba:', error.message)
  }
}

// Ejecutar test completo
runCompleteTest()