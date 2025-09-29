import { query } from '../config/database.js'

export const getAllProducts = async (req, res) => {
  try {
    // Consulta para sistema simple: producto con una talla y stock
    const result = await query(`
      SELECT
        p.*,
        c.name as category_name,
        s.name as size_name,
        s.display_name as size_display_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN sizes s ON p.size_id = s.id
      ORDER BY p.id
    `)

    // Formatear productos para el frontend
    const productsWithStandardFields = result.rows.map(product => ({
      ...product,
      stock: product.stock || 0,
      total_stock: product.stock || 0,
      has_stock: (product.stock || 0) > 0,
      size_info: product.size_name ? {
        id: product.size_id,
        name: product.size_name,
        display_name: product.size_display_name
      } : null
    }))

    res.json({
      success: true,
      message: 'Productos obtenidos exitosamente',
      data: productsWithStandardFields,
      total: result.rowCount
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
    const result = await query(`
      SELECT
        p.*,
        c.name as category_name,
        s.name as size_name,
        s.display_name as size_display_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN sizes s ON p.size_id = s.id
      WHERE p.id = $1
    `, [id])

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      })
    }

    // Formatear producto para el frontend
    const product = {
      ...result.rows[0],
      stock: result.rows[0].stock || 0,
      total_stock: result.rows[0].stock || 0,
      has_stock: (result.rows[0].stock || 0) > 0,
      size_info: result.rows[0].size_name ? {
        id: result.rows[0].size_id,
        name: result.rows[0].size_name,
        display_name: result.rows[0].size_display_name
      } : null
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
    const result = await query(`
      SELECT
        p.*,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.category_id = $1
      ORDER BY p.id
    `, [categoryId])

    // Agregar campos faltantes
    const productsWithStandardFields = result.rows.map(product => ({
      ...product,
      stock: product.stock || 0,
      total_stock: product.stock || 0,
      has_stock: (product.stock || 0) > 0,
      sizes: [],
      uses_sizes: true
    }))

    res.json({
      success: true,
      message: 'Productos obtenidos exitosamente',
      data: productsWithStandardFields,
      total: result.rowCount
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
    if (category_id) {
      const categoryResult = await query('SELECT id FROM categories WHERE id = $1', [category_id])
      if (categoryResult.rowCount === 0) {
        return res.status(400).json({
          success: false,
          message: 'La categoría especificada no existe'
        })
      }
    }

    // Verificar que la talla existe si se proporciona
    if (size_id) {
      const sizeResult = await query('SELECT id FROM sizes WHERE id = $1', [size_id])
      if (sizeResult.rowCount === 0) {
        return res.status(400).json({
          success: false,
          message: 'La talla especificada no existe'
        })
      }
    }

    const result = await query(
      'INSERT INTO products (name, description, price, category_id, image_url, size_id, stock) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, description, price, category_id || null, image_url, size_id || null, stock || 0]
    )

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: result.rows[0]
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
    const currentProduct = await query('SELECT * FROM products WHERE id = $1', [id])
    if (currentProduct.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      })
    }

    const current = currentProduct.rows[0]

    // Usar valores actuales si no se proporcionan nuevos
    const updateName = name || current.name
    const updateDescription = description || current.description
    const updatePrice = price || current.price
    const updateCategoryId = category_id !== undefined ? category_id : current.category_id
    const updateImageUrl = image_url !== undefined ? image_url : current.image_url
    const updateSizeId = size_id !== undefined ? size_id : current.size_id
    const updateStock = stock !== undefined ? parseInt(stock) : (current.stock || 0)

    // Verificar que la categoría existe si se está actualizando
    if (updateCategoryId !== null) {
      const categoryResult = await query('SELECT id FROM categories WHERE id = $1', [updateCategoryId])
      if (categoryResult.rowCount === 0) {
        return res.status(400).json({
          success: false,
          message: 'La categoría especificada no existe'
        })
      }
    }

    // Verificar que la talla existe si se está actualizando
    if (updateSizeId !== null) {
      const sizeResult = await query('SELECT id FROM sizes WHERE id = $1', [updateSizeId])
      if (sizeResult.rowCount === 0) {
        return res.status(400).json({
          success: false,
          message: 'La talla especificada no existe'
        })
      }
    }

    const result = await query(
      'UPDATE products SET name = $1, description = $2, price = $3, category_id = $4, image_url = $5, size_id = $6, stock = $7, updated_at = NOW() WHERE id = $8 RETURNING *',
      [updateName, updateDescription, updatePrice, updateCategoryId, updateImageUrl, updateSizeId, updateStock, id]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      })
    }

    res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: result.rows[0]
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

    const result = await query('DELETE FROM products WHERE id = $1 RETURNING *', [id])

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      })
    }

    res.json({
      success: true,
      message: 'Producto eliminado exitosamente',
      data: result.rows[0]
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

    const result = await query(`
      SELECT
        p.*,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.name ILIKE $1 OR p.description ILIKE $1
      ORDER BY p.name
    `, [`%${q}%`])

    // Agregar campos faltantes
    const productsWithStandardFields = result.rows.map(product => ({
      ...product,
      stock: product.stock || 0,
      total_stock: product.stock || 0,
      has_stock: (product.stock || 0) > 0,
      sizes: [],
      uses_sizes: true
    }))

    res.json({
      success: true,
      message: 'Búsqueda completada exitosamente',
      data: productsWithStandardFields,
      total: result.rowCount,
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