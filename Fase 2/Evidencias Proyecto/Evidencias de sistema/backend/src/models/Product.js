import { query } from '../config/database.js'

/**
 * Modelo Product - Encapsula todas las operaciones de base de datos relacionadas con productos
 */
export const Product = {
  /**
   * Formatea un producto con campos estándar para el frontend
   * @param {Object} product - Producto de base de datos
   * @returns {Object} Producto formateado
   */
  formatProduct(product) {
    return {
      ...product,
      stock: product.stock || 0,
      total_stock: product.stock || 0,
      has_stock: (product.stock || 0) > 0,
      size_info: product.size_name ? {
        id: product.size_id,
        name: product.size_name,
        display_name: product.size_display_name
      } : null
    }
  },

  /**
   * Formatea un producto con campos básicos (sin size_info completo)
   * @param {Object} product - Producto de base de datos
   * @returns {Object} Producto formateado
   */
  formatProductBasic(product) {
    return {
      ...product,
      stock: product.stock || 0,
      total_stock: product.stock || 0,
      has_stock: (product.stock || 0) > 0,
      sizes: [],
      uses_sizes: true
    }
  },

  /**
   * Obtiene todos los productos con información de categoría y talla
   * @returns {Promise<Array>} Lista de productos
   */
  async findAll() {
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

    return result.rows.map(this.formatProduct)
  },

  /**
   * Busca un producto por ID con información de categoría y talla
   * @param {number} id - ID del producto
   * @returns {Promise<Object|null>} Producto encontrado o null
   */
  async findById(id) {
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

    if (result.rows.length === 0) {
      return null
    }

    return this.formatProduct(result.rows[0])
  },

  /**
   * Obtiene productos por categoría
   * @param {number} categoryId - ID de la categoría
   * @returns {Promise<Array>} Lista de productos
   */
  async findByCategory(categoryId) {
    const result = await query(`
      SELECT
        p.*,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.category_id = $1
      ORDER BY p.id
    `, [categoryId])

    return result.rows.map(this.formatProductBasic)
  },

  /**
   * Busca productos por nombre o descripción
   * @param {string} searchTerm - Término de búsqueda
   * @returns {Promise<Array>} Lista de productos encontrados
   */
  async search(searchTerm) {
    const result = await query(`
      SELECT
        p.*,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.name ILIKE $1 OR p.description ILIKE $1
      ORDER BY p.name
    `, [`%${searchTerm}%`])

    return result.rows.map(this.formatProductBasic)
  },

  /**
   * Crea un nuevo producto
   * @param {Object} productData - Datos del producto
   * @returns {Promise<Object>} Producto creado
   */
  async create({ name, description, price, category_id, image_url, size_id, stock }) {
    const result = await query(
      `INSERT INTO products (name, description, price, category_id, image_url, size_id, stock, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       RETURNING *`,
      [name, description, price, category_id || null, image_url, size_id || null, stock || 0]
    )

    return result.rows[0]
  },

  /**
   * Actualiza un producto existente
   * @param {number} id - ID del producto
   * @param {Object} updates - Campos a actualizar
   * @returns {Promise<Object|null>} Producto actualizado o null
   */
  async update(id, updates) {
    const result = await query(
      `UPDATE products
       SET name = $1, description = $2, price = $3, category_id = $4,
           image_url = $5, size_id = $6, stock = $7, updated_at = NOW()
       WHERE id = $8
       RETURNING *`,
      [
        updates.name,
        updates.description,
        updates.price,
        updates.category_id,
        updates.image_url,
        updates.size_id,
        updates.stock,
        id
      ]
    )

    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0]
  },

  /**
   * Elimina un producto por ID
   * @param {number} id - ID del producto
   * @returns {Promise<Object|null>} Producto eliminado o null
   */
  async delete(id) {
    const result = await query('DELETE FROM products WHERE id = $1 RETURNING *', [id])

    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0]
  },

  /**
   * Verifica si una categoría existe
   * @param {number} categoryId - ID de la categoría
   * @returns {Promise<boolean>} true si existe
   */
  async categoryExists(categoryId) {
    const result = await query('SELECT id FROM categories WHERE id = $1', [categoryId])
    return result.rows.length > 0
  },

  /**
   * Verifica si una talla existe
   * @param {number} sizeId - ID de la talla
   * @returns {Promise<boolean>} true si existe
   */
  async sizeExists(sizeId) {
    const result = await query('SELECT id FROM sizes WHERE id = $1', [sizeId])
    return result.rows.length > 0
  },

  /**
   * Actualiza el stock de un producto
   * @param {number} id - ID del producto
   * @param {number} stock - Nuevo stock
   * @returns {Promise<Object|null>} Producto actualizado o null
   */
  async updateStock(id, stock) {
    const result = await query(
      'UPDATE products SET stock = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [stock, id]
    )

    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0]
  }
}

export default Product
