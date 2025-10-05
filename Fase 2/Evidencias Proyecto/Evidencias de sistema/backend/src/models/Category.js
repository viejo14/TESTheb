import { query } from '../config/database.js'

/**
 * Modelo Category - Encapsula todas las operaciones de base de datos relacionadas con categorías
 */
export const Category = {
  /**
   * Obtiene todas las categorías
   * @returns {Promise<Array>} Lista de categorías
   */
  async findAll() {
    const result = await query('SELECT * FROM categories ORDER BY id')
    return result.rows
  },

  /**
   * Busca una categoría por ID
   * @param {number} id - ID de la categoría
   * @returns {Promise<Object|null>} Categoría encontrada o null
   */
  async findById(id) {
    const result = await query('SELECT * FROM categories WHERE id = $1', [id])
    return result.rows[0] || null
  },

  /**
   * Crea una nueva categoría
   * @param {Object} categoryData - Datos de la categoría
   * @returns {Promise<Object>} Categoría creada
   */
  async create({ name, image_url = null }) {
    const result = await query(
      'INSERT INTO categories (name, image_url, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING *',
      [name, image_url]
    )
    return result.rows[0]
  },

  /**
   * Actualiza una categoría existente
   * @param {number} id - ID de la categoría
   * @param {Object} updates - Campos a actualizar
   * @returns {Promise<Object|null>} Categoría actualizada o null
   */
  async update(id, { name, image_url }) {
    const result = await query(
      'UPDATE categories SET name = $1, image_url = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      [name, image_url, id]
    )
    return result.rows[0] || null
  },

  /**
   * Elimina una categoría por ID
   * @param {number} id - ID de la categoría
   * @returns {Promise<Object|null>} Categoría eliminada o null
   */
  async delete(id) {
    const result = await query('DELETE FROM categories WHERE id = $1 RETURNING *', [id])
    return result.rows[0] || null
  },

  /**
   * Cuenta cuántos productos tiene una categoría
   * @param {number} id - ID de la categoría
   * @returns {Promise<number>} Número de productos
   */
  async countProducts(id) {
    const result = await query('SELECT COUNT(*) FROM products WHERE category_id = $1', [id])
    return parseInt(result.rows[0].count)
  }
}

export default Category
