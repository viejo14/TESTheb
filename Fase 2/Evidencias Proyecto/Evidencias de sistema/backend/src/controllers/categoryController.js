import Category from '../models/Category.js'

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll()
    res.json({
      success: true,
      message: 'Categorías obtenidas exitosamente',
      data: categories,
      total: categories.length
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
    const category = await Category.findById(id)

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      })
    }

    res.json({
      success: true,
      message: 'Categoría obtenida exitosamente',
      data: category
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

    const newCategory = await Category.create({ name, image_url: image_url || null })

    res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      data: newCategory
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

    const updatedCategory = await Category.update(id, { name, image_url: image_url || null })

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      })
    }

    res.json({
      success: true,
      message: 'Categoría actualizada exitosamente',
      data: updatedCategory
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
    const productCount = await Category.countProducts(id)

    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar la categoría porque tiene ${productCount} productos asociados`
      })
    }

    const deletedCategory = await Category.delete(id)

    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      })
    }

    res.json({
      success: true,
      message: 'Categoría eliminada exitosamente',
      data: deletedCategory
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