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
    // Primero crear el producto sin SKU para obtener el ID
    const result = await query(
      `INSERT INTO products (name, description, price, category_id, image_url, size_id, stock, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       RETURNING *`,
      [name, description, price, category_id || null, image_url, size_id || null, stock || 0]
    )

    const product = result.rows[0]

    // Generar SKU automático basado en el ID del producto recién creado
    const sku = await this.generateSKU(product.id, category_id, size_id)

    // Actualizar el producto con el SKU generado
    const updateResult = await query(
      'UPDATE products SET sku = $1 WHERE id = $2 RETURNING *',
      [sku, product.id]
    )

    return updateResult.rows[0]
  },

  /**
   * Actualiza un producto existente
   * @param {number} id - ID del producto
   * @param {Object} updates - Campos a actualizar
   * @returns {Promise<Object|null>} Producto actualizado o null
   */
  async update(id, updates) {
    // Regenerar SKU si cambiaron categoría o talla
    let newSku = null
    if (updates.category_id !== undefined || updates.size_id !== undefined) {
      newSku = await this.generateSKU(id, updates.category_id, updates.size_id)
    }

    // Construir query dinámicamente
    let queryText = `UPDATE products
       SET name = $1, description = $2, price = $3, category_id = $4,
           image_url = $5, size_id = $6, stock = $7`

    const params = [
      updates.name,
      updates.description,
      updates.price,
      updates.category_id,
      updates.image_url,
      updates.size_id,
      updates.stock
    ]

    // Agregar SKU si se regeneró
    if (newSku) {
      queryText += `, sku = $8, updated_at = NOW() WHERE id = $9 RETURNING *`
      params.push(newSku, id)
    } else {
      queryText += `, updated_at = NOW() WHERE id = $8 RETURNING *`
      params.push(id)
    }

    const result = await query(queryText, params)

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
  },

  /**
   * Genera un SKU automático para un producto
   * Formato: [CATEGORIA]-[ID]-[TALLA]
   * Ejemplo: BOR-12-M (Bordados, producto 12, talla M)
   * @param {number} productId - ID del producto
   * @param {number|null} categoryId - ID de la categoría (opcional)
   * @param {number|null} sizeId - ID de la talla (opcional)
   * @returns {Promise<string>} SKU generado
   */
  async generateSKU(productId, categoryId = null, sizeId = null) {
    // Obtener código de categoría (primeras 3 letras en mayúsculas)
    let categoryCode = 'GEN' // Código por defecto

    if (categoryId) {
      const categoryResult = await query(
        'SELECT name FROM categories WHERE id = $1',
        [categoryId]
      )
      if (categoryResult.rows.length > 0) {
        const categoryName = categoryResult.rows[0].name
        categoryCode = categoryName.substring(0, 3).toUpperCase()
      }
    }

    // Obtener código de talla
    let sizeCode = 'U' // Código por defecto (Único)

    if (sizeId) {
      const sizeResult = await query(
        'SELECT name FROM sizes WHERE id = $1',
        [sizeId]
      )
      if (sizeResult.rows.length > 0) {
        sizeCode = sizeResult.rows[0].name
      }
    }

    // Generar SKU: CATEGORIA-ID-TALLA
    return `${categoryCode}-${productId}-${sizeCode}`
  },

  /**
   * Verifica si un SKU ya existe en la base de datos
   * @param {string} sku - SKU a verificar
   * @param {number|null} excludeId - ID de producto a excluir de la búsqueda (para updates)
   * @returns {Promise<boolean>} true si el SKU existe
   */
  async skuExists(sku, excludeId = null) {
    let queryText = 'SELECT id FROM products WHERE sku = $1'
    const params = [sku]

    if (excludeId) {
      queryText += ' AND id != $2'
      params.push(excludeId)
    }

    const result = await query(queryText, params)
    return result.rows.length > 0
  }
}

export default Product
