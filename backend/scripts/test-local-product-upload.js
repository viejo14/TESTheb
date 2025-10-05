/**
 * Test de subida local de imágenes de productos
 * Uso: node backend/scripts/test-local-product-upload.js
 */

import fetch from 'node-fetch'
import FormData from 'form-data'
import fs from 'fs'
import path from 'path'

const API_BASE_URL = 'http://localhost:3000/api'

async function testLocalProductImageUpload() {
  try {
    console.log('🧪 Test de subida LOCAL de imagen de producto...\n')
    
    // Crear una imagen de prueba simple
    const testImagePath = path.join(process.cwd(), 'test-product-image.jpg')
    
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
    console.log('✅ Imagen de prueba creada:', testImagePath)
    
    // Test: Subida local con el nombre del archivo que mencionaste
    console.log('\n📤 Subiendo imagen: logo1_1759703164522.jpg...')
    
    const formData = new FormData()
    formData.append('image', fs.createReadStream(testImagePath), {
      filename: 'logo1_1759703164522.jpg',
      contentType: 'image/jpeg'
    })
    
    const response = await fetch(`${API_BASE_URL}/upload/product-image-local`, {
      method: 'POST',
      body: formData
    })
    
    console.log('📊 Status HTTP:', response.status)
    console.log('📊 Status Text:', response.statusText)
    
    const result = await response.json()
    
    if (response.ok) {
      console.log('✅ SUBIDA EXITOSA!')
      console.log('📄 Respuesta completa:')
      console.log(JSON.stringify(result, null, 2))
      
      // Verificar que el archivo se guardó en la ubicación correcta
      const expectedPath = path.join(process.cwd(), 'frontend', 'public', 'images', 'products', result.data.filename)
      console.log('🔍 Verificando archivo en:', expectedPath)
      
      if (fs.existsSync(expectedPath)) {
        console.log('✅ ¡Archivo guardado correctamente!')
        console.log('📂 URL de imagen:', result.data.imageUrl)
        
        // Leer información del archivo guardado
        const stats = fs.statSync(expectedPath)
        console.log('📊 Tamaño del archivo:', stats.size, 'bytes')
        console.log('📅 Fecha de creación:', stats.birthtime)
        
      } else {
        console.log('❌ Archivo NO encontrado en la ubicación esperada')
        
        // Verificar otras ubicaciones posibles
        const possiblePaths = [
          path.join(process.cwd(), 'frontend', 'public', 'images', 'categories', result.data.filename),
          path.join(process.cwd(), 'backend', 'uploads', result.data.filename),
          path.join(process.cwd(), 'uploads', result.data.filename)
        ]
        
        console.log('\n🔍 Buscando en otras ubicaciones...')
        for (const possiblePath of possiblePaths) {
          if (fs.existsSync(possiblePath)) {
            console.log('📁 Encontrado en:', possiblePath)
          }
        }
      }
      
    } else {
      console.log('❌ ERROR EN SUBIDA:')
      console.log('📄 Respuesta de error:')
      console.log(JSON.stringify(result, null, 2))
    }
    
    // Limpiar archivo de prueba
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath)
      console.log('\n🧹 Archivo de prueba eliminado')
    }
    
  } catch (error) {
    console.error('❌ Error durante el test:', error.message)
    console.error('🔍 Detalles:', error)
  }
}

// Ejecutar test
console.log('🚀 Iniciando test de subida local de productos...\n')
testLocalProductImageUpload()