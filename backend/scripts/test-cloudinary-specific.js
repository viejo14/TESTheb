/**
 * Test específico para Cloudinary con imagen más real
 */

import fetch from 'node-fetch'
import FormData from 'form-data'
import fs from 'fs'
import path from 'path'

const API_BASE_URL = 'http://localhost:3000/api'

async function createRealTestImage() {
  const testImagePath = path.join(process.cwd(), 'real-test-image.png')
  
  // Crear un PNG válido más completo (rojo sólido 10x10)
  const pngData = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
    0x00, 0x00, 0x00, 0x0A, 0x00, 0x00, 0x00, 0x0A, // 10x10 pixels
    0x08, 0x02, 0x00, 0x00, 0x00, 0x02, 0x50, 0x58, // RGB, no alpha
    0xEA, 0x00, 0x00, 0x00, 0x17, 0x49, 0x44, 0x41, // IDAT chunk
    0x54, 0x78, 0x9C, 0x62, 0xF8, 0x0F, 0x00, 0x01,
    0x01, 0x01, 0x00, 0x18, 0xDD, 0x8D, 0xB4, 0x00,
    0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,
    0x42, 0x60, 0x82 // IEND chunk
  ])
  
  fs.writeFileSync(testImagePath, pngData)
  return testImagePath
}

async function testCloudinaryEndpoint() {
  //console.log('🧪 Test específico de Cloudinary...\n')
  
  try {
    const testImagePath = await createRealTestImage()
    //console.log('✅ Imagen de prueba creada:', testImagePath)
    
    const formData = new FormData()
    formData.append('image', fs.createReadStream(testImagePath), {
      filename: 'cloudinary-test.png',
      contentType: 'image/png'
    })
    
    //console.log('📤 Enviando a:', `${API_BASE_URL}/upload/product-image`)
    
    const response = await fetch(`${API_BASE_URL}/upload/product-image`, {
      method: 'POST',
      body: formData
    })
    
    //console.log('📊 Status HTTP:', response.status)
    //console.log('📊 Headers:', Object.fromEntries(response.headers.entries()))
    
    const responseText = await response.text()
    //console.log('📄 Raw Response:', responseText)
    
    try {
      const result = JSON.parse(responseText)
      //console.log('📋 Parsed Response:', result)
      
      if (response.ok && result.success) {
        //console.log('✅ CLOUDINARY FUNCIONA!')
      } else {
        //console.log('❌ Error en Cloudinary:', result)
      }
    } catch (parseError) {
      //console.log('❌ Error parseando respuesta JSON:', parseError.message)
    }
    
    // Limpiar
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath)
      //console.log('🧹 Archivo de prueba eliminado')
    }
    
  } catch (error) {
    console.error('❌ Error en test:', error)
  }
}

testCloudinaryEndpoint()