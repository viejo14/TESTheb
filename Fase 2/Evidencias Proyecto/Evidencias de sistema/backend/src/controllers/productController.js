import Product from '../models/Product.js'
import ProductImage from '../models/ProductImage.js'

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll()

    // Agregar imágenes a cada producto
    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        const images = await ProductImage.findByProductId(product.id)
        return {
          ...product,
          images: images || [],
          primary_image: images.find(img => img.is_primary)?.image_url || product.image_url || images[0]?.image_url
        }
      })
    )

    res.json({
      success: true,
      message: 'Productos obtenidos exitosamente',
      data: productsWithImages,
      total: productsWithImages.length
    })
  } catch (error) {
    console.error('❌ Error obteniendo productos:', error)
    res.status(500).json({
      success: false,
      message: 'Error obteniendo productos',
      error: error.message
    })
  }
}

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params
    const product = await Product.findById(id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      })
    }

    // Agregar imágenes al producto
    const images = await ProductImage.findByProductId(id)
    const productWithImages = {
      ...product,
      images: images || [],
      primary_image: images.find(img => img.is_primary)?.image_url || product.image_url || images[0]?.image_url
    }

    res.json({
      success: true,
      message: 'Producto obtenido exitosamente',
      data: productWithImages
    })
  } catch (error) {
    console.error('❌ Error obteniendo producto:', error)
    res.status(500).json({
      success: false,
      message: 'Error obteniendo producto',
      error: error.message
    })
  }
}

export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params
    const products = await Product.findByCategory(categoryId)

    res.json({
      success: true,
      message: 'Productos obtenidos exitosamente',
      data: products,
      total: products.length
    })
  } catch (error) {
    console.error('❌ Error obteniendo productos por categoría:', error)
    res.status(500).json({
      success: false,
      message: 'Error obteniendo productos por categoría',
      error: error.message
    })
  }
}

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category_id, image_url, size_id, stock } = req.body

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y precio son requeridos'
      })
    }

    // Verificar que la categoría existe si se proporciona
    if (category_id && !(await Product.categoryExists(category_id))) {
      return res.status(400).json({
        success: false,
        message: 'La categoría especificada no existe'
      })
    }

    // Verificar que la talla existe si se proporciona
    if (size_id && !(await Product.sizeExists(size_id))) {
      return res.status(400).json({
        success: false,
        message: 'La talla especificada no existe'
      })
    }

    const newProduct = await Product.create({ name, description, price, category_id, image_url, size_id, stock })

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: newProduct
    })
  } catch (error) {
    console.error('❌ Error creando producto:', error)
    res.status(500).json({
      success: false,
      message: 'Error creando producto',
      error: error.message
    })
  }
}

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, price, category_id, image_url, size_id, stock } = req.body

    // Obtener datos actuales del producto
    const currentProduct = await Product.findById(id)
    if (!currentProduct) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      })
    }

    // Usar valores actuales si no se proporcionan nuevos
    const updateData = {
      name: name || currentProduct.name,
      description: description || currentProduct.description,
      price: price || currentProduct.price,
      category_id: category_id !== undefined ? category_id : currentProduct.category_id,
      image_url: image_url !== undefined ? image_url : currentProduct.image_url,
      size_id: size_id !== undefined ? size_id : currentProduct.size_id,
      stock: stock !== undefined ? parseInt(stock) : (currentProduct.stock || 0)
    }

    // Verificar que la categoría existe si se está actualizando
    if (updateData.category_id !== null && !(await Product.categoryExists(updateData.category_id))) {
      return res.status(400).json({
        success: false,
        message: 'La categoría especificada no existe'
      })
    }

    // Verificar que la talla existe si se está actualizando
    if (updateData.size_id !== null && !(await Product.sizeExists(updateData.size_id))) {
      return res.status(400).json({
        success: false,
        message: 'La talla especificada no existe'
      })
    }

    const updatedProduct = await Product.update(id, updateData)

    res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: updatedProduct
    })
  } catch (error) {
    console.error('❌ Error actualizando producto:', error)
    res.status(500).json({
      success: false,
      message: 'Error actualizando producto',
      error: error.message
    })
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params

    const deletedProduct = await Product.delete(id)

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      })
    }

    res.json({
      success: true,
      message: 'Producto eliminado exitosamente',
      data: deletedProduct
    })
  } catch (error) {
    console.error('❌ Error eliminando producto:', error)
    res.status(500).json({
      success: false,
      message: 'Error eliminando producto',
      error: error.message
    })
  }
}

export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Término de búsqueda requerido'
      })
    }

    const products = await Product.search(q)

    res.json({
      success: true,
      message: 'Búsqueda completada exitosamente',
      data: products,
      total: products.length,
      query: q
    })
  } catch (error) {
    console.error('❌ Error buscando productos:', error)
    res.status(500).json({
      success: false,
      message: 'Error buscando productos',
      error: error.message
    })
  }
}

// Obtener todas las tallas disponibles - TEMPORAL: retornar lista vacía
export const getAllSizes = async (req, res) => {
  try {
    // Por ahora retornamos tallas hardcodeadas hasta que se ejecute la migración
    const mockSizes = [
      { id: 1, name: 'XS', display_name: 'Extra Small', sort_order: 1 },
      { id: 2, name: 'S', display_name: 'Small', sort_order: 2 },
      { id: 3, name: 'M', display_name: 'Medium', sort_order: 3 },
      { id: 4, name: 'L', display_name: 'Large', sort_order: 4 },
      { id: 5, name: 'XL', display_name: 'Extra Large', sort_order: 5 },
      { id: 6, name: 'XXL', display_name: 'XX Large', sort_order: 6 }
    ]

    res.json({
      success: true,
      message: 'Tallas obtenidas exitosamente',
      data: mockSizes,
      total: mockSizes.length
    })
  } catch (error) {
    console.error('❌ Error obteniendo tallas:', error)
    res.status(500).json({
      success: false,
      message: 'Error obteniendo tallas',
      error: error.message
    })
  }
}

// Actualizar stock de una talla específica - TEMPORAL: función placeholder
export const updateProductSizeStock = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Función no disponible hasta que se ejecute la migración de base de datos'
    })
  } catch (error) {
    console.error('❌ Error actualizando stock:', error)
    res.status(500).json({
      success: false,
      message: 'Error actualizando stock',
      error: error.message
    })
  }
}

// ============ CONTROLADORES DE IMÁGENES ============

/**
 * Obtener todas las imágenes de un producto
 */
export const getProductImages = async (req, res) => {
  try {
    const { productId } = req.params
    const images = await ProductImage.findByProductId(productId)

    res.json({
      success: true,
      message: 'Imágenes obtenidas exitosamente',
      data: images
    })
  } catch (error) {
    console.error('❌ Error obteniendo imágenes:', error)
    res.status(500).json({
      success: false,
      message: 'Error obteniendo imágenes del producto',
      error: error.message
    })
  }
}

/**
 * Agregar una imagen a un producto
 */
export const addProductImage = async (req, res) => {
  try {
    const { productId } = req.params
    const { image_url, display_order, is_primary } = req.body

    // Verificar que el producto existe
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      })
    }

    // Verificar límite de imágenes (máximo 4)
    const count = await ProductImage.countByProductId(productId)
    if (count >= 4) {
      return res.status(400).json({
        success: false,
        message: 'El producto ya tiene el máximo de 4 imágenes'
      })
    }

    const image = await ProductImage.create({
      product_id: productId,
      image_url,
      display_order: display_order ?? count,
      is_primary: is_primary ?? (count === 0)
    })

    res.status(201).json({
      success: true,
      message: 'Imagen agregada exitosamente',
      data: image
    })
  } catch (error) {
    console.error('❌ Error agregando imagen:', error)
    res.status(500).json({
      success: false,
      message: 'Error agregando imagen al producto',
      error: error.message
    })
  }
}

/**
 * Agregar múltiples imágenes a un producto
 */
export const addProductImages = async (req, res) => {
  try {
    const { productId } = req.params
    const { image_urls } = req.body

    if (!Array.isArray(image_urls) || image_urls.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere un array de URLs de imágenes'
      })
    }

    // Verificar que el producto existe
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      })
    }

    // Verificar límite de imágenes
    const currentCount = await ProductImage.countByProductId(productId)
    const availableSlots = 4 - currentCount

    if (availableSlots <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El producto ya tiene el máximo de 4 imágenes'
      })
    }

    const urlsToAdd = image_urls.slice(0, availableSlots)
    const images = await ProductImage.createBulk(productId, urlsToAdd)

    res.status(201).json({
      success: true,
      message: `${images.length} imágenes agregadas exitosamente`,
      data: images
    })
  } catch (error) {
    console.error('❌ Error agregando imágenes:', error)
    res.status(500).json({
      success: false,
      message: 'Error agregando imágenes al producto',
      error: error.message
    })
  }
}

/**
 * Actualizar una imagen
 */
export const updateProductImage = async (req, res) => {
  try {
    const { imageId } = req.params
    const updates = req.body

    const image = await ProductImage.update(imageId, updates)

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Imagen no encontrada'
      })
    }

    res.json({
      success: true,
      message: 'Imagen actualizada exitosamente',
      data: image
    })
  } catch (error) {
    console.error('❌ Error actualizando imagen:', error)
    res.status(500).json({
      success: false,
      message: 'Error actualizando imagen',
      error: error.message
    })
  }
}

/**
 * Marcar imagen como principal
 */
export const setProductImagePrimary = async (req, res) => {
  try {
    const { imageId } = req.params

    const image = await ProductImage.setPrimary(imageId)

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Imagen no encontrada'
      })
    }

    res.json({
      success: true,
      message: 'Imagen marcada como principal',
      data: image
    })
  } catch (error) {
    console.error('❌ Error actualizando imagen principal:', error)
    res.status(500).json({
      success: false,
      message: 'Error actualizando imagen principal',
      error: error.message
    })
  }
}

/**
 * Eliminar una imagen
 */
export const deleteProductImage = async (req, res) => {
  try {
    const { imageId } = req.params

    const deleted = await ProductImage.delete(imageId)

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Imagen no encontrada'
      })
    }

    res.json({
      success: true,
      message: 'Imagen eliminada exitosamente'
    })
  } catch (error) {
    console.error('❌ Error eliminando imagen:', error)
    res.status(500).json({
      success: false,
      message: 'Error eliminando imagen',
      error: error.message
    })
  }
}

/**
 * Reordenar imágenes de un producto
 */
export const reorderProductImages = async (req, res) => {
  try {
    const { productId } = req.params
    const { image_ids } = req.body

    if (!Array.isArray(image_ids)) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere un array de IDs de imágenes'
      })
    }

    await ProductImage.reorder(productId, image_ids)

    res.json({
      success: true,
      message: 'Imágenes reordenadas exitosamente'
    })
  } catch (error) {
    console.error('❌ Error reordenando imágenes:', error)
    res.status(500).json({
      success: false,
      message: 'Error reordenando imágenes',
      error: error.message
    })
  }
}