import { Cloudinary } from '@cloudinary/url-gen'

// Configuración de Cloudinary
const cloudinary = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  }
})

// Función para subir imagen de producto a Cloudinary
export const uploadProductImage = async (file) => {
  try {
    const formData = new FormData()

    // Configuración del upload
    formData.append('file', file)
    formData.append('upload_preset', 'testheb-products')
    formData.append('folder', 'testheb/products')

    // Tags para organización
    formData.append('tags', 'testheb,product,ecommerce')

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Upload failed: ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()

    return {
      success: true,
      data: {
        imageUrl: data.secure_url,
        publicId: data.public_id,
        filename: data.original_filename,
        size: data.bytes,
        width: data.width,
        height: data.height,
        format: data.format,
        // URLs optimizadas
        thumbnailUrl: data.secure_url.replace('/upload/', '/upload/w_300,h_200,c_thumb,g_center/'),
        mediumUrl: data.secure_url.replace('/upload/', '/upload/w_600,h_400,c_limit,q_auto,f_auto/'),
        largeUrl: data.secure_url.replace('/upload/', '/upload/w_1200,h_800,c_limit,q_auto,f_auto/')
      }
    }
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    return {
      success: false,
      error: error.message || 'Error uploading image'
    }
  }
}

// Función para eliminar imagen de Cloudinary
export const deleteProductImage = async (publicId) => {
  try {
    // Esta función requiere hacer el delete desde el backend por seguridad
    // Por ahora solo retornamos success
    //console.log('Image deletion requested for:', publicId)
    return {
      success: true,
      message: 'Image deletion requested'
    }
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error)
    return {
      success: false,
      error: error.message || 'Error deleting image'
    }
  }
}

// Función helper para generar URLs optimizadas
export const getOptimizedImageUrl = (originalUrl, options = {}) => {
  if (!originalUrl || !originalUrl.includes('cloudinary.com')) {
    return originalUrl
  }

  const {
    width = 400,
    height = 300,
    crop = 'limit',
    quality = 'auto',
    format = 'auto'
  } = options

  const transformation = `w_${width},h_${height},c_${crop},q_${quality},f_${format}`

  return originalUrl.replace('/upload/', `/upload/${transformation}/`)
}

// Función para validar archivo antes de upload
export const validateImageFile = (file) => {
  const errors = []

  // Verificar que sea un archivo
  if (!file) {
    errors.push('No se ha seleccionado ningún archivo')
    return { isValid: false, errors }
  }

  // Verificar tipo de archivo
  if (!file.type.startsWith('image/')) {
    errors.push('El archivo debe ser una imagen')
  }

  // Verificar tamaño (10MB máximo)
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    errors.push('La imagen no puede ser mayor a 10MB')
  }

  // Verificar formatos soportados
  const supportedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!supportedFormats.includes(file.type)) {
    errors.push('Formato no soportado. Use JPG, PNG, WebP o GIF')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export default cloudinary