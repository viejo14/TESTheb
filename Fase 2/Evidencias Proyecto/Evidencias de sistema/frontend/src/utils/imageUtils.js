// Utilidades para manejo de imágenes en producción vs desarrollo

const IS_PRODUCTION = import.meta.env.PROD

// Configuración de imágenes para producción
export const IMAGE_CONFIG = {
  // En producción, usar imágenes locales
  // En desarrollo, usar Unsplash temporalmente
  useLocalImages: IS_PRODUCTION,

  // CDN o ruta base para imágenes locales
  localImageBasePath: '/images/categories/',

  // Configuración de fallback
  enableFallback: true,
  fallbackImage: '/images/categories/default.jpg'
}

// Función helper para obtener la ruta correcta de imagen
export const getImagePath = (imageName) => {
  if (IMAGE_CONFIG.useLocalImages) {
    return `${IMAGE_CONFIG.localImageBasePath}${imageName}.jpg`
  }

  // Usar URLs de Unsplash en desarrollo
  const unsplashImages = {
    colegios: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=300&fit=crop&crop=center',
    empresas: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=center',
    mascotas: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&crop=center',
    personalizado: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center',
    deportes: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center',
    eventos: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop&crop=center',
    hogar: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center',
    regalos: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=300&fit=crop&crop=center',
    uniformes: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=400&h=300&fit=crop&crop=center',
    accesorios: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=400&h=300&fit=crop&crop=center',
    default: 'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=400&h=300&fit=crop&crop=center'
  }

  return unsplashImages[imageName] || unsplashImages.default
}

// Función para descargar imágenes de Unsplash para uso local
export const downloadCategoryImages = async () => {
  console.log('🖼️ Instrucciones para preparar imágenes locales:')
  console.log('1. Crear carpeta: public/images/categories/')
  console.log('2. Descargar estas imágenes optimizadas:')

  const imagesToDownload = [
    { name: 'colegios', url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=600&fit=crop&crop=center&q=80' },
    { name: 'empresas', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=center&q=80' },
    { name: 'mascotas', url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=600&fit=crop&crop=center&q=80' },
    { name: 'personalizado', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&crop=center&q=80' },
    { name: 'deportes', url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center&q=80' },
    { name: 'eventos', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop&crop=center&q=80' },
    { name: 'hogar', url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&crop=center&q=80' },
    { name: 'regalos', url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&h=600&fit=crop&crop=center&q=80' },
    { name: 'uniformes', url: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=800&h=600&fit=crop&crop=center&q=80' },
    { name: 'accesorios', url: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&h=600&fit=crop&crop=center&q=80' },
    { name: 'default', url: 'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=800&h=600&fit=crop&crop=center&q=80' }
  ]

  imagesToDownload.forEach(img => {
    console.log(`   - ${img.name}.jpg: ${img.url}`)
  })

  console.log('3. Cambiar IMAGE_CONFIG.useLocalImages = true en imageUtils.js')
  console.log('✅ Listo para producción!')
}

// Log para desarrollo
if (!IS_PRODUCTION) {
  console.log('🔧 Modo desarrollo: usando imágenes de Unsplash')
  console.log('📦 Para producción, ejecuta: downloadCategoryImages()')
}