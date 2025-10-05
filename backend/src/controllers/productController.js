import Product from '../models/Product.js'

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll()

    res.json({
      success: true,
      message: 'Productos obtenidos exitosamente',
      data: products,
      total: products.length
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

    res.json({
      success: true,
      message: 'Producto obtenido exitosamente',
      data: product
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