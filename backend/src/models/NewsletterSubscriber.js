import { query } from '../config/database.js'

/**
 * Modelo NewsletterSubscriber - Encapsula todas las operaciones de base de datos relacionadas con suscriptores del newsletter
 */
export const NewsletterSubscriber = {
  /**
   * Busca un suscriptor por email
   * @param {string} email - Email del suscriptor
   * @returns {Promise<Object|null>} Suscriptor encontrado o null
   */
  async findByEmail(email) {
    const result = await query(
      'SELECT id, status FROM newsletter_subscribers WHERE email = $1',
      [email.toLowerCase()]
    )
    return result.rows[0] || null
  },

  /**
   * Crea un nuevo suscriptor
   * @param {string} email - Email del suscriptor
   * @returns {Promise<Object>} Suscriptor creado
   */
  async create(email) {
    const result = await query(
      `INSERT INTO newsletter_subscribers (email, status, subscribed_at, created_at, updated_at)
       VALUES ($1, 'active', NOW(), NOW(), NOW())
       RETURNING id, email, subscribed_at`,
      [email.toLowerCase()]
    )
    return result.rows[0]
  },

  /**
   * Reactiva un suscriptor que se había desuscrito
   * @param {number} id - ID del suscriptor
   * @returns {Promise<Object>} Suscriptor reactivado
   */
  async reactivate(id) {
    const result = await query(
      `UPDATE newsletter_subscribers
       SET status = 'active', subscribed_at = NOW(), unsubscribed_at = NULL, updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id]
    )
    return result.rows[0]
  },

  /**
   * Desuscribe a un suscriptor
   * @param {number} id - ID del suscriptor
   * @returns {Promise<Object>} Suscriptor desuscrito
   */
  async unsubscribe(id) {
    const result = await query(
      `UPDATE newsletter_subscribers
       SET status = 'unsubscribed', unsubscribed_at = NOW(), updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id]
    )
    return result.rows[0]
  },

  /**
   * Obtiene todos los suscriptores con filtros y paginación
   * @param {Object} options - Opciones de filtro
   * @returns {Promise<Object>} Suscriptores y total
   */
  async findAll({ status = null, limit = 100, offset = 0 }) {
    let queryText = 'SELECT id, email, status, subscribed_at, unsubscribed_at, created_at FROM newsletter_subscribers'
    const params = []

    // Filtrar por estado si se proporciona
    if (status && ['active', 'unsubscribed'].includes(status)) {
      queryText += ' WHERE status = $1'
      params.push(status)
    }

    queryText += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(parseInt(limit), parseInt(offset))

    const subscribers = await query(queryText, params)

    // Contar total
    const total = await this.count(status)

    return {
      subscribers: subscribers.rows,
      total
    }
  },

  /**
   * Cuenta el total de suscriptores
   * @param {string|null} status - Filtro de estado opcional
   * @returns {Promise<number>} Total de suscriptores
   */
  async count(status = null) {
    let queryText = 'SELECT COUNT(*) FROM newsletter_subscribers'
    const params = []

    if (status && ['active', 'unsubscribed'].includes(status)) {
      queryText += ' WHERE status = $1'
      params.push(status)
    }

    const result = await query(queryText, params)
    return parseInt(result.rows[0].count)
  },

  /**
   * Obtiene estadísticas de suscriptores
   * @returns {Promise<Object>} Estadísticas
   */
  async getStats() {
    const result = await query(`
      SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active,
        COUNT(CASE WHEN status = 'unsubscribed' THEN 1 END) as unsubscribed,
        COUNT(CASE WHEN subscribed_at >= NOW() - INTERVAL '7 days' THEN 1 END) as last_7_days,
        COUNT(CASE WHEN subscribed_at >= NOW() - INTERVAL '30 days' THEN 1 END) as last_30_days
      FROM newsletter_subscribers
    `)

    return {
      total: parseInt(result.rows[0].total),
      active: parseInt(result.rows[0].active),
      unsubscribed: parseInt(result.rows[0].unsubscribed),
      last7Days: parseInt(result.rows[0].last_7_days),
      last30Days: parseInt(result.rows[0].last_30_days)
    }
  }
}

export default NewsletterSubscriber
