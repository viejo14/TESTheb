import { query } from '../config/database.js'

export const getAllProducts = async (req, res) => {
  try {
    const result = await query(`
      SELECT
        p.*,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.id
    `)
    res.json({
      success: true,
      message: 'Productos obtenidos exitosamente',
      data: result.rows,
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
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `, [id])

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      })
    }

    res.json({
      success: true,
      message: 'Producto obtenido exitosamente',
      data: result.rows[0]
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

    res.json({
      success: true,
      message: 'Productos obtenidos exitosamente',
      data: result.rows,
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
    const { name, description, price, category_id, stock, image_url } = req.body

    if (!name || !price || !category_id) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, precio y categoría son requeridos'
      })
    }

    // Verificar que la categoría existe
    const categoryResult = await query('SELECT id FROM categories WHERE id = $1', [category_id])
    if (categoryResult.rowCount === 0) {
      return res.status(400).json({
        success: false,
        message: 'La categoría especificada no existe'
      })
    }

    const result = await query(
      'INSERT INTO products (name, description, price, category_id, stock, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, description, price, category_id, stock || 0, image_url]
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
    const { name, description, price, category_id, stock, image_url } = req.body

    if (!name || !price || !category_id) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, precio y categoría son requeridos'
      })
    }

    // Verificar que la categoría existe
    const categoryResult = await query('SELECT id FROM categories WHERE id = $1', [category_id])
    if (categoryResult.rowCount === 0) {
      return res.status(400).json({
        success: false,
        message: 'La categoría especificada no existe'
      })
    }

    const result = await query(
      'UPDATE products SET name = $1, description = $2, price = $3, category_id = $4, stock = $5, image_url = $6, updated_at = NOW() WHERE id = $7 RETURNING *',
      [name, description, price, category_id, stock || 0, image_url, id]
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

    res.json({
      success: true,
      message: 'Búsqueda completada exitosamente',
      data: result.rows,
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