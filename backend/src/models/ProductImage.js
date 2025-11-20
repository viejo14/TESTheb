import { query } from '../config/database.js'
import logger from '../config/logger.js'

/**
 * Modelo ProductImage - Maneja múltiples imágenes por producto
 */
const ProductImage = {
  /**
   * Obtiene todas las imágenes de un producto
   * @param {number} productId - ID del producto
   * @returns {Promise<Array>} Array de imágenes ordenadas
   */
  async findByProductId(productId) {
    const result = await query(
      `SELECT * FROM product_images 
       WHERE product_id = $1 
       ORDER BY display_order ASC, created_at ASC`,
      [productId]
    )
    return result.rows
  },

  /**
   * Obtiene la imagen principal de un producto
   * @param {number} productId - ID del producto
   * @returns {Promise<Object|null>} Imagen principal o null
   */
  async getPrimaryImage(productId) {
    const result = await query(
      `SELECT * FROM product_images 
       WHERE product_id = $1 AND is_primary = true 
       LIMIT 1`,
      [productId]
    )
    return result.rows[0] || null
  },

  /**
   * Crea una nueva imagen para un producto
   * @param {Object} imageData - Datos de la imagen
   * @returns {Promise<Object>} Imagen creada
   */
  async create({ product_id, image_url, display_order = 0, is_primary = false }) {
    // Si es imagen principal, quitar el flag de las demás
    if (is_primary) {
      await query(
        'UPDATE product_images SET is_primary = false WHERE product_id = $1',
        [product_id]
      )
    }

    const result = await query(
      `INSERT INTO product_images (product_id, image_url, display_order, is_primary, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING *`,
      [product_id, image_url, display_order, is_primary]
    )

    logger.info(`📸 Imagen creada para producto ${product_id}`)
    return result.rows[0]
  },

  /**
   * Crea múltiples imágenes de una vez
   * @param {number} productId - ID del producto
   * @param {Array<string>} imageUrls - Array de URLs de imágenes
   * @returns {Promise<Array>} Imágenes creadas
   */
  async createBulk(productId, imageUrls) {
    const images = []
    
    for (let i = 0; i < imageUrls.length && i < 4; i++) {
      const image = await this.create({
        product_id: productId,
        image_url: imageUrls[i],
        display_order: i,
        is_primary: i === 0 // La primera imagen es la principal
      })
      images.push(image)
    }

    logger.info(`📸 ${images.length} imágenes creadas para producto ${productId}`)
    return images
  },

  /**
   * Actualiza una imagen
   * @param {number} id - ID de la imagen
   * @param {Object} updates - Datos a actualizar
   * @returns {Promise<Object|null>} Imagen actualizada
   */
  async update(id, updates) {
    const { image_url, display_order, is_primary } = updates

    // Si se marca como principal, quitar el flag de las demás
    if (is_primary) {
      const image = await query('SELECT product_id FROM product_images WHERE id = $1', [id])
      if (image.rows[0]) {
        await query(
          'UPDATE product_images SET is_primary = false WHERE product_id = $1',
          [image.rows[0].product_id]
        )
      }
    }

    const result = await query(
      `UPDATE product_images 
       SET image_url = COALESCE($1, image_url),
           display_order = COALESCE($2, display_order),
           is_primary = COALESCE($3, is_primary),
           updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [image_url, display_order, is_primary, id]
    )

    return result.rows[0] || null
  },

  /**
   * Marca una imagen como principal
   * @param {number} imageId - ID de la imagen
   * @returns {Promise<Object|null>} Imagen actualizada
   */
  async setPrimary(imageId) {
    const image = await query('SELECT product_id FROM product_images WHERE id = $1', [imageId])
    
    if (image.rows[0]) {
      // Quitar flag de todas las imágenes del producto
      await query(
        'UPDATE product_images SET is_primary = false WHERE product_id = $1',
        [image.rows[0].product_id]
      )
      
      // Marcar la seleccionada como principal
      const result = await query(
        'UPDATE product_images SET is_primary = true, updated_at = NOW() WHERE id = $1 RETURNING *',
        [imageId]
      )
      
      return result.rows[0]
    }
    
    return null
  },

  /**
   * Elimina una imagen
   * @param {number} id - ID de la imagen
   * @returns {Promise<boolean>} true si se eliminó
   */
  async delete(id) {
    const result = await query(
      'DELETE FROM product_images WHERE id = $1 RETURNING *',
      [id]
    )

    if (result.rows[0]) {
      logger.info(`🗑️ Imagen ${id} eliminada`)
      
      // Si era la principal, marcar la primera restante como principal
      const productId = result.rows[0].product_id
      const remaining = await this.findByProductId(productId)
      
      if (remaining.length > 0 && !remaining.some(img => img.is_primary)) {
        await this.setPrimary(remaining[0].id)
      }
      
      return true
    }
    
    return false
  },

  /**
   * Elimina todas las imágenes de un producto
   * @param {number} productId - ID del producto
   * @returns {Promise<number>} Número de imágenes eliminadas
   */
  async deleteByProductId(productId) {
    const result = await query(
      'DELETE FROM product_images WHERE product_id = $1 RETURNING *',
      [productId]
    )

    logger.info(`🗑️ ${result.rows.length} imágenes eliminadas del producto ${productId}`)
    return result.rows.length
  },

  /**
   * Cuenta las imágenes de un producto
   * @param {number} productId - ID del producto
   * @returns {Promise<number>} Número de imágenes
   */
  async countByProductId(productId) {
    const result = await query(
      'SELECT COUNT(*) as count FROM product_images WHERE product_id = $1',
      [productId]
    )
    return parseInt(result.rows[0].count)
  },

  /**
   * Reordena las imágenes de un producto
   * @param {number} productId - ID del producto
   * @param {Array<number>} imageIds - Array de IDs en el orden deseado
   * @returns {Promise<boolean>} true si se reordenó
   */
  async reorder(productId, imageIds) {
    for (let i = 0; i < imageIds.length; i++) {
      await query(
        'UPDATE product_images SET display_order = $1, updated_at = NOW() WHERE id = $2 AND product_id = $3',
        [i, imageIds[i], productId]
      )
    }
    
    logger.info(`🔄 Imágenes del producto ${productId} reordenadas`)
    return true
  }
}

export default ProductImage
