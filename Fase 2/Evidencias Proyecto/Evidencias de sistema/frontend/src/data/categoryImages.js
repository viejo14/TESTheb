// Catálogo de imágenes predefinidas para categorías
// Estas son imágenes locales optimizadas para producción

export const CATEGORY_IMAGES = {
  // Imágenes temporales de alta calidad (Unsplash) - Reemplazar con imágenes locales en producción
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

  // Imagen por defecto
  default: 'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=400&h=300&fit=crop&crop=center'
}

// Mapeo de nombres de categoría a claves de imagen
export const getCategoryImageKey = (categoryName) => {
  const name = categoryName.toLowerCase()

  if (name.includes('colegio')) return 'colegios'
  if (name.includes('empresa') || name.includes('pyme')) return 'empresas'
  if (name.includes('mascota')) return 'mascotas'
  if (name.includes('personalizado') || name.includes('diseño')) return 'personalizado'
  if (name.includes('deporte')) return 'deportes'
  if (name.includes('evento')) return 'eventos'
  if (name.includes('hogar') || name.includes('casa')) return 'hogar'
  if (name.includes('regalo')) return 'regalos'
  if (name.includes('uniforme')) return 'uniformes'
  if (name.includes('accesorio')) return 'accesorios'

  return 'default'
}

// Función helper para obtener la imagen de una categoría
export const getCategoryImage = (category) => {
  // Si tiene imagen_url personalizada (URL externa), usarla
  if (category.image_url && category.image_url.startsWith('http')) {
    return category.image_url
  }

  // Si tiene imagen local subida, usarla
  if (category.image_url && category.image_url.startsWith('/images/categories/')) {
    return category.image_url
  }

  // Si no, usar imagen predefinida basada en el nombre
  const imageKey = getCategoryImageKey(category.name)
  return CATEGORY_IMAGES[imageKey]
}

// Lista de opciones para el selector en el admin
export const CATEGORY_IMAGE_OPTIONS = [
  { key: 'colegios', label: 'Colegios', preview: CATEGORY_IMAGES.colegios },
  { key: 'empresas', label: 'Empresas/Pymes', preview: CATEGORY_IMAGES.empresas },
  { key: 'mascotas', label: 'Mascotas', preview: CATEGORY_IMAGES.mascotas },
  { key: 'personalizado', label: 'Diseño Personalizado', preview: CATEGORY_IMAGES.personalizado },
  { key: 'deportes', label: 'Deportes', preview: CATEGORY_IMAGES.deportes },
  { key: 'eventos', label: 'Eventos', preview: CATEGORY_IMAGES.eventos },
  { key: 'hogar', label: 'Hogar', preview: CATEGORY_IMAGES.hogar },
  { key: 'regalos', label: 'Regalos', preview: CATEGORY_IMAGES.regalos },
  { key: 'uniformes', label: 'Uniformes', preview: CATEGORY_IMAGES.uniformes },
  { key: 'accesorios', label: 'Accesorios', preview: CATEGORY_IMAGES.accesorios },
  { key: 'default', label: 'Imagen por defecto', preview: CATEGORY_IMAGES.default }
]