import { query } from '../config/database.js'

/**
 * Modelo Quote - Encapsula todas las operaciones de base de datos relacionadas con cotizaciones
 */
export const Quote = {
  ALLOWED_STATUSES: ['pendiente', 'aprobada', 'rechazada', 'en_proceso'],

  /**
   * Valida que un estado sea válido
   * @param {string} status - Estado a validar
   * @returns {boolean} true si es válido
   */
  isValidStatus(status) {
    return this.ALLOWED_STATUSES.includes(status)
  },

  /**
   * Obtiene todas las cotizaciones con filtros y paginación
   * @param {Object} options - Opciones de búsqueda y paginación
   * @returns {Promise<Object>} Cotizaciones y metadata de paginación
   */
  async findAll({ page = 1, limit = 10, status = null, search = null }) {
    const offset = (page - 1) * limit
    let queryText = `
      SELECT
        q.id,
        q.user_id,
        u.name as user_name,
        u.email as user_email,
        q.name,
        q.email,
        q.phone,
        q.message,
        q.image_url,
        q.status,
        q.created_at
      FROM quotes q
      LEFT JOIN users u ON q.user_id = u.id
    `
    let params = []
    let whereConditions = []

    // Filtrar por estado si se proporciona
    if (status) {
      whereConditions.push(`q.status = $${params.length + 1}`)
      params.push(status)
    }

    // Agregar búsqueda si se proporciona
    if (search) {
      whereConditions.push(`(q.message ILIKE $${params.length + 1} OR q.name ILIKE $${params.length + 1} OR q.email ILIKE $${params.length + 1})`)
      params.push(`%${search}%`)
    }

    if (whereConditions.length > 0) {
      queryText += ' WHERE ' + whereConditions.join(' AND ')
    }

    queryText += ` ORDER BY q.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(limit, offset)

    const result = await query(queryText, params)

    // Contar total
    const totalCotizaciones = await this.count(status, search)
    const totalPages = Math.ceil(totalCotizaciones / limit)

    return {
      quotes: result.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCotizaciones,
        limit: parseInt(limit),
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }
  },

  /**
   * Cuenta el total de cotizaciones con filtros opcionales
   * @param {string|null} status - Filtro de estado
   * @param {string|null} search - Término de búsqueda
   * @returns {Promise<number>} Total de cotizaciones
   */
  async count(status = null, search = null) {
    let queryText = 'SELECT COUNT(*) FROM quotes q LEFT JOIN users u ON q.user_id = u.id'
    let params = []
    let whereConditions = []

    if (status) {
      whereConditions.push(`q.status = $${params.length + 1}`)
      params.push(status)
    }

    if (search) {
      whereConditions.push(`(q.message ILIKE $${params.length + 1} OR q.name ILIKE $${params.length + 1} OR q.email ILIKE $${params.length + 1})`)
      params.push(`%${search}%`)
    }

    if (whereConditions.length > 0) {
      queryText += ' WHERE ' + whereConditions.join(' AND ')
    }

    const result = await query(queryText, params)
    return parseInt(result.rows[0].count)
  },

  /**
   * Busca una cotización por ID
   * @param {number} id - ID de la cotización
   * @returns {Promise<Object|null>} Cotización encontrada o null
   */
  async findById(id) {
    const result = await query(`
      SELECT
        q.id,
        q.user_id,
        u.name as user_name,
        u.email as user_email,
        q.name,
        q.email,
        q.phone,
        q.message,
        q.image_url,
        q.status,
        q.created_at
      FROM quotes q
      LEFT JOIN users u ON q.user_id = u.id
      WHERE q.id = $1
    `, [id])

    return result.rows[0] || null
  },

  /**
   * Crea una nueva cotización
   * @param {Object} quoteData - Datos de la cotización
   * @returns {Promise<Object>} Cotización creada
   */
  async create({ user_id, name, email, phone, message, image_url }) {
    const result = await query(`
      INSERT INTO quotes (
        user_id,
        name,
        email,
        phone,
        message,
        image_url,
        status,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
      RETURNING id, user_id, name, email, phone, message, image_url, status, created_at
    `, [user_id || null, name, email, phone || null, message, image_url || null, 'pendiente'])

    return result.rows[0]
  },

  /**
   * Actualiza una cotización existente
   * @param {number} id - ID de la cotización
   * @param {Object} updates - Campos a actualizar
   * @returns {Promise<Object|null>} Cotización actualizada o null
   */
  async update(id, updates) {
    const fields = []
    const values = []
    let paramCount = 1

    // Construir dinámicamente los campos a actualizar
    if (updates.status !== undefined) {
      fields.push(`status = $${paramCount++}`)
      values.push(updates.status)
    }

    if (updates.name !== undefined) {
      fields.push(`name = $${paramCount++}`)
      values.push(updates.name)
    }

    if (updates.email !== undefined) {
      fields.push(`email = $${paramCount++}`)
      values.push(updates.email)
    }

    if (updates.phone !== undefined) {
      fields.push(`phone = $${paramCount++}`)
      values.push(updates.phone)
    }

    if (updates.message !== undefined) {
      fields.push(`message = $${paramCount++}`)
      values.push(updates.message)
    }

    if (fields.length === 0) {
      return null // No hay nada que actualizar
    }

    values.push(id)

    const queryText = `
      UPDATE quotes
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, user_id, name, email, phone, message, status, created_at
    `

    const result = await query(queryText, values)
    return result.rows[0] || null
  },

  /**
   * Elimina una cotización por ID
   * @param {number} id - ID de la cotización
   * @returns {Promise<boolean>} true si se eliminó, false si no existía
   */
  async delete(id) {
    const result = await query('DELETE FROM quotes WHERE id = $1', [id])
    return result.rowCount > 0
  },

  /**
   * Obtiene estadísticas de cotizaciones
   * @returns {Promise<Object>} Estadísticas de cotizaciones
   */
  async getStats() {
    const totalCotizaciones = await query('SELECT COUNT(*) as total FROM quotes')
    const cotizacionesByStatus = await query('SELECT status, COUNT(*) as count FROM quotes GROUP BY status')
    const recentCotizaciones = await query("SELECT COUNT(*) as count FROM quotes WHERE created_at >= CURRENT_TIMESTAMP - INTERVAL '30 days'")

    return {
      totalCotizaciones: parseInt(totalCotizaciones.rows[0].total),
      cotizacionesByStatus: cotizacionesByStatus.rows,
      recentCotizaciones: parseInt(recentCotizaciones.rows[0].count)
    }
  },

  /**
   * Actualiza el estado de múltiples cotizaciones
   * @param {Array<number>} ids - Array de IDs de cotizaciones
   * @param {string} status - Nuevo estado
   * @returns {Promise<Object>} IDs actualizados y conteo
   */
  async updateBulkStatus(ids, status) {
    const placeholders = ids.map((_, index) => `$${index + 2}`).join(', ')

    const result = await query(`
      UPDATE quotes
      SET status = $1
      WHERE id IN (${placeholders})
      RETURNING id
    `, [status, ...ids])

    return {
      updatedCount: result.rowCount,
      updatedIds: result.rows.map(row => row.id)
    }
  },

  /**
   * Verifica si una cotización existe
   * @param {number} id - ID de la cotización
   * @returns {Promise<boolean>} true si existe
   */
  async exists(id) {
    const result = await query('SELECT id FROM quotes WHERE id = $1', [id])
    return result.rows.length > 0
  }
}

export default Quote
