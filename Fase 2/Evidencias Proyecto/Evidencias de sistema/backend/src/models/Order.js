import { query } from '../config/database.js'

/**
 * Modelo Order - Encapsula todas las operaciones de base de datos relacionadas con órdenes
 */
export const Order = {
  /**
   * Crea una nueva orden
   * @param {Object} orderData - Datos de la orden
   * @returns {Promise<Object>} Orden creada
   */
  async create({
    buy_order,
    session_id,
    amount,
    total,
    status = 'created',
    token_ws,
    items = [],
    customer_name = '',
    customer_email = '',
    customer_phone = '',
    shipping_address = '',
    shipping_city = ''
  }) {
    const result = await query(`
      INSERT INTO orders (
        buy_order,
        session_id,
        amount,
        total,
        status,
        token_ws,
        items,
        customer_name,
        customer_email,
        customer_phone,
        shipping_address,
        shipping_city,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
      RETURNING *
    `, [
      buy_order,
      session_id,
      amount,
      total,
      status,
      token_ws,
      JSON.stringify(items),
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      shipping_city
    ])

    return result.rows[0]
  },

  /**
   * Busca una orden por buy_order
   * @param {string} buyOrder - Número de orden
   * @returns {Promise<Object|null>} Orden encontrada o null
   */
  async findByBuyOrder(buyOrder) {
    const result = await query(
      'SELECT * FROM orders WHERE buy_order = $1',
      [buyOrder]
    )

    return result.rows[0] || null
  },

  /**
   * Busca una orden por ID
   * @param {number} id - ID de la orden
   * @returns {Promise<Object|null>} Orden encontrada o null
   */
  async findById(id) {
    const result = await query(
      'SELECT * FROM orders WHERE id = $1',
      [id]
    )

    return result.rows[0] || null
  },

  /**
   * Actualiza solo el estado de una orden
   * @param {string} buyOrder - Número de orden
   * @param {string} status - Nuevo estado
   * @param {Object} additionalData - Datos adicionales opcionales
   * @returns {Promise<Object|null>} Orden actualizada o null
   */
  async updateStatus(buyOrder, status, additionalData = {}) {
    const result = await query(`
      UPDATE orders
      SET status = $1, updated_at = NOW(), result_json = $2
      WHERE buy_order = $3
      RETURNING *
    `, [status, JSON.stringify(additionalData), buyOrder])

    return result.rows[0] || null
  },

  /**
   * Actualiza una orden con datos completos del resultado del pago
   * @param {string} buyOrder - Número de orden
   * @param {Object} paymentData - Datos del pago
   * @returns {Promise<Object|null>} Orden actualizada o null
   */
  async updateWithPaymentResult(buyOrder, {
    status,
    result_json,
    authorization_code,
    response_code,
    payment_type_code,
    card_last4 = null,
    installments_number = 0
  }) {
    const result = await query(`
      UPDATE orders
      SET status = $1, updated_at = NOW(), result_json = $2,
          authorization_code = $3, response_code = $4,
          payment_type_code = $5, card_last4 = $6, installments_number = $7
      WHERE buy_order = $8
      RETURNING *
    `, [
      status,
      JSON.stringify(result_json),
      authorization_code,
      response_code,
      payment_type_code,
      card_last4,
      installments_number,
      buyOrder
    ])

    return result.rows[0] || null
  },

  /**
   * Obtiene una orden con sus items (del campo JSONB)
   * @param {string} buyOrder - Número de orden
   * @returns {Promise<Object|null>} Orden con items o null
   */
  async getWithItems(buyOrder) {
    const result = await query(
      'SELECT id, items FROM orders WHERE buy_order = $1',
      [buyOrder]
    )

    return result.rows[0] || null
  },

  /**
   * Obtiene estadísticas de órdenes recientes
   * @param {number} days - Número de días hacia atrás
   * @returns {Promise<Array>} Estadísticas por día
   */
  async getRecentStats(days = 7) {
    const result = await query(`
      SELECT
        DATE(created_at) as fecha,
        COUNT(*) as ordenes,
        COALESCE(SUM(total), 0) as ingresos
      FROM orders
      WHERE created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY DATE(created_at)
      ORDER BY fecha DESC
    `)

    return result.rows
  },

  /**
   * Obtiene el total de ventas e ingresos
   * @returns {Promise<Object>} Estadísticas de ventas
   */
  async getSalesStats() {
    const result = await query(`
      SELECT
        COUNT(DISTINCT o.id) as total_ordenes,
        COALESCE(SUM(o.total), 0) as ingresos_totales,
        COALESCE(AVG(o.total), 0) as ticket_promedio
      FROM orders o
      WHERE o.status IN ('authorized', 'completed', 'confirmed')
    `)

    return result.rows[0] || {
      total_ordenes: 0,
      ingresos_totales: 0,
      ticket_promedio: 0
    }
  }
}

export default Order
