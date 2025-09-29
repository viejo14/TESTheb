import { query } from '../config/database.js'

export const getAllCategories = async (req, res) => {
  try {
    const result = await query('SELECT * FROM categories ORDER BY id')
    res.json({
      success: true,
      message: 'Categorías obtenidas exitosamente',
      data: result.rows,
      total: result.rowCount
    })
  } catch (error) {
    console.error('❌ Error obteniendo categorías:', error)
    res.status(500).json({
      success: false,
      message: 'Error obteniendo categorías',
      error: error.message
    })
  }
}

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params
    const result = await query('SELECT * FROM categories WHERE id = $1', [id])

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      })
    }

    res.json({
      success: true,
      message: 'Categoría obtenida exitosamente',
      data: result.rows[0]
    })
  } catch (error) {
    console.error('❌ Error obteniendo categoría:', error)
    res.status(500).json({
      success: false,
      message: 'Error obteniendo categoría',
      error: error.message
    })
  }
}

export const createCategory = async (req, res) => {
  try {
    const { name, image_url } = req.body

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'El nombre de la categoría es requerido'
      })
    }

    const result = await query(
      'INSERT INTO categories (name, image_url) VALUES ($1, $2) RETURNING *',
      [name, image_url || null]
    )

    res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      data: result.rows[0]
    })
  } catch (error) {
    console.error('❌ Error creando categoría:', error)
    res.status(500).json({
      success: false,
      message: 'Error creando categoría',
      error: error.message
    })
  }
}

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params
    const { name, image_url } = req.body

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'El nombre de la categoría es requerido'
      })
    }

    const result = await query(
      'UPDATE categories SET name = $1, image_url = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      [name, image_url || null, id]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      })
    }

    res.json({
      success: true,
      message: 'Categoría actualizada exitosamente',
      data: result.rows[0]
    })
  } catch (error) {
    console.error('❌ Error actualizando categoría:', error)
    res.status(500).json({
      success: false,
      message: 'Error actualizando categoría',
      error: error.message
    })
  }
}

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params

    // Verificar si la categoría tiene productos asociados
    const productsResult = await query('SELECT COUNT(*) FROM products WHERE category_id = $1', [id])
    const productCount = parseInt(productsResult.rows[0].count)

    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar la categoría porque tiene ${productCount} productos asociados`
      })
    }

    const result = await query('DELETE FROM categories WHERE id = $1 RETURNING *', [id])

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      })
    }

    res.json({
      success: true,
      message: 'Categoría eliminada exitosamente',
      data: result.rows[0]
    })
  } catch (error) {
    console.error('❌ Error eliminando categoría:', error)
    res.status(500).json({
      success: false,
      message: 'Error eliminando categoría',
      error: error.message
    })
  }
}