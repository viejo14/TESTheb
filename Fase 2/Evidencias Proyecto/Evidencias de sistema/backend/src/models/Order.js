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
  },

  /**
   * Obtiene todas las órdenes con filtros opcionales
   * @param {Object} filters - Filtros para la búsqueda
   * @returns {Promise<Array>} Lista de órdenes
   */
  async findAll(filters = {}) {
    const { status, startDate, endDate, page = 1, limit = 50, search } = filters

    let queryText = `
      SELECT
        o.*,
        COALESCE(SUM(oi.quantity), 0) as items_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE 1=1
    `
    const params = []
    let paramIndex = 1

    // Filtro por estado
    if (status) {
      queryText += ` AND o.status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }

    // Filtro por fecha de inicio
    if (startDate) {
      queryText += ` AND o.created_at >= $${paramIndex}`
      params.push(startDate)
      paramIndex++
    }

    // Filtro por fecha de fin
    if (endDate) {
      queryText += ` AND o.created_at <= $${paramIndex}`
      params.push(endDate)
      paramIndex++
    }

    // Búsqueda por nombre de cliente, email o buy_order
    if (search) {
      queryText += ` AND (
        o.customer_name ILIKE $${paramIndex} OR
        o.customer_email ILIKE $${paramIndex} OR
        o.buy_order ILIKE $${paramIndex}
      )`
      params.push(`%${search}%`)
      paramIndex++
    }

    // Agrupar y ordenar
    queryText += `
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `

    // Paginación
    const offset = (page - 1) * limit
    queryText += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
    params.push(limit, offset)

    const result = await query(queryText, params)
    return result.rows
  },

  /**
   * Actualiza solo el estado de una orden (para panel admin)
   * @param {number} id - ID de la orden
   * @param {string} status - Nuevo estado
   * @param {string} notes - Notas adicionales
   * @returns {Promise<Object|null>} Orden actualizada o null
   */
  async updateOrderStatus(id, status, notes = '') {
    const result = await query(`
      UPDATE orders
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `, [status, id])

    return result.rows[0] || null
  },

  /**
   * Obtiene estadísticas generales de órdenes
   * @returns {Promise<Object>} Estadísticas
   */
  async getStats() {
    // Total de órdenes y ventas
    const totalsResult = await query(`
      SELECT
        COUNT(*) as total_orders,
        COUNT(CASE WHEN status IN ('authorized', 'confirmed', 'completed') THEN 1 END) as successful_orders,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders,
        COALESCE(SUM(CASE WHEN status IN ('authorized', 'confirmed', 'completed') THEN total ELSE 0 END), 0) as total_revenue,
        COALESCE(AVG(CASE WHEN status IN ('authorized', 'confirmed', 'completed') THEN total END), 0) as average_order_value
      FROM orders
    `)

    // Órdenes del mes actual
    const monthResult = await query(`
      SELECT
        COUNT(*) as orders_this_month,
        COALESCE(SUM(total), 0) as revenue_this_month
      FROM orders
      WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)
        AND status IN ('authorized', 'confirmed', 'completed')
    `)

    // Órdenes de hoy
    const todayResult = await query(`
      SELECT
        COUNT(*) as orders_today,
        COALESCE(SUM(total), 0) as revenue_today
      FROM orders
      WHERE DATE(created_at) = CURRENT_DATE
        AND status IN ('authorized', 'confirmed', 'completed')
    `)

    return {
      ...totalsResult.rows[0],
      ...monthResult.rows[0],
      ...todayResult.rows[0]
    }
  }
}

export default Order
