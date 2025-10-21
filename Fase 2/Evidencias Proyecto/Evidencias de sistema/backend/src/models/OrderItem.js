import { query } from '../config/database.js'
import Product from './Product.js'
import logger from '../config/logger.js'

/**
 * Modelo OrderItem - Encapsula todas las operaciones de base de datos relacionadas con items de órdenes
 */
export const OrderItem = {
  /**
   * Crea un nuevo item de orden
   * @param {Object} itemData - Datos del item
   * @returns {Promise<Object>} Item creado
   */
  async create({ order_id, product_id, quantity, price }) {
    const result = await query(`
      INSERT INTO order_items (order_id, product_id, quantity, price, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *
    `, [order_id, product_id, quantity, parseFloat(price)])

    return result.rows[0]
  },

  /**
   * Crea múltiples items de orden de una vez
   * @param {number} orderId - ID de la orden
   * @param {Array} items - Array de items con {id/product_id, quantity, price}
   * @returns {Promise<Array>} Items creados
   */
  async createBulk(orderId, items) {
    const createdItems = []

    for (const item of items) {
      const productId = item.id || item.product_id
      
      // Insertar el item en order_items
      const result = await query(`
        INSERT INTO order_items (order_id, product_id, quantity, price, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING *
      `, [orderId, productId, item.quantity, parseFloat(item.price)])

      createdItems.push(result.rows[0])

      // Reducir el stock del producto
      try {
        // Obtener el stock actual del producto
        const product = await Product.findById(productId)
        
        if (product) {
          const newStock = Math.max(0, product.stock - item.quantity)
          await Product.updateStock(productId, newStock)
          
          logger.info(`📦 Stock actualizado para producto ${productId}: ${product.stock} -> ${newStock}`)
        }
      } catch (stockError) {
        logger.error(`❌ Error actualizando stock del producto ${productId}:`, stockError)
        // No lanzamos error para no interrumpir la creación de la orden
      }
    }

    return createdItems
  },

  /**
   * Obtiene todos los items de una orden
   * @param {number} orderId - ID de la orden
   * @returns {Promise<Array>} Items de la orden
   */
  async findByOrderId(orderId) {
    const result = await query(
      'SELECT * FROM order_items WHERE order_id = $1',
      [orderId]
    )

    return result.rows
  }
}

export default OrderItem
