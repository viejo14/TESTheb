import { query } from '../config/database.js'

/**
 * Modelo User - Encapsula todas las operaciones de base de datos relacionadas con usuarios
 */
export const User = {
  /**
   * Busca un usuario por email
   * @param {string} email - Email del usuario
   * @returns {Promise<Object|null>} Usuario encontrado o null
   */
  async findByEmail(email) {
    const result = await query('SELECT * FROM users WHERE email = $1', [email])
    return result.rows[0] || null
  },

  /**
   * Busca un usuario por ID
   * @param {number} id - ID del usuario
   * @returns {Promise<Object|null>} Usuario encontrado o null
   */
  async findById(id) {
    const result = await query(
      'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = $1',
      [id]
    )
    return result.rows[0] || null
  },

  /**
   * Obtiene todos los usuarios con paginación y búsqueda opcional
   * @param {Object} options - Opciones de búsqueda y paginación
   * @returns {Promise<Object>} Usuarios y metadata de paginación
   */
  async findAll({ page = 1, limit = 10, search = null }) {
    const offset = (page - 1) * limit
    let queryText = 'SELECT id, name, email, role, created_at, updated_at FROM users'
    let params = []

    // Agregar búsqueda si se proporciona
    if (search) {
      queryText += ' WHERE name ILIKE $1 OR email ILIKE $1'
      params.push(`%${search}%`)
    }

    queryText += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(limit, offset)

    const result = await query(queryText, params)

    // Contar total
    const totalUsers = await this.count(search)
    const totalPages = Math.ceil(totalUsers / limit)

    return {
      users: result.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalUsers,
        limit: parseInt(limit),
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }
  },

  /**
   * Cuenta el total de usuarios (con búsqueda opcional)
   * @param {string|null} search - Término de búsqueda opcional
   * @returns {Promise<number>} Total de usuarios
   */
  async count(search = null) {
    let queryText = 'SELECT COUNT(*) FROM users'
    let params = []

    if (search) {
      queryText += ' WHERE name ILIKE $1 OR email ILIKE $1'
      params.push(`%${search}%`)
    }

    const result = await query(queryText, params)
    return parseInt(result.rows[0].count)
  },

  /**
   * Crea un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<Object>} Usuario creado
   */
  async create({ name, email, password, role = 'user' }) {
    const result = await query(
      `INSERT INTO users (name, email, password, role, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING id, name, email, role, created_at, updated_at`,
      [name, email, password, role]
    )
    return result.rows[0]
  },

  /**
   * Actualiza un usuario existente
   * @param {number} id - ID del usuario
   * @param {Object} updates - Campos a actualizar
   * @returns {Promise<Object>} Usuario actualizado
   */
  async update(id, updates) {
    const fields = []
    const values = []
    let paramCount = 1

    // Construir dinámicamente los campos a actualizar
    if (updates.name !== undefined) {
      fields.push(`name = $${paramCount++}`)
      values.push(updates.name)
    }

    if (updates.email !== undefined) {
      fields.push(`email = $${paramCount++}`)
      values.push(updates.email)
    }

    if (updates.password !== undefined) {
      fields.push(`password = $${paramCount++}`)
      values.push(updates.password)
    }

    if (updates.role !== undefined) {
      fields.push(`role = $${paramCount++}`)
      values.push(updates.role)
    }

    if (fields.length === 0) {
      return null // No hay nada que actualizar
    }

    fields.push('updated_at = NOW()')
    values.push(id)

    const queryText = `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, name, email, role, created_at, updated_at
    `

    const result = await query(queryText, values)
    return result.rows[0] || null
  },

  /**
   * Elimina un usuario por ID
   * @param {number} id - ID del usuario
   * @returns {Promise<boolean>} true si se eliminó, false si no existía
   */
  async delete(id) {
    const result = await query('DELETE FROM users WHERE id = $1', [id])
    return result.rowCount > 0
  },

  /**
   * Verifica si un email ya está en uso
   * @param {string} email - Email a verificar
   * @param {number|null} excludeId - ID de usuario a excluir de la verificación
   * @returns {Promise<boolean>} true si el email existe
   */
  async emailExists(email, excludeId = null) {
    let queryText = 'SELECT id FROM users WHERE email = $1'
    const params = [email]

    if (excludeId) {
      queryText += ' AND id != $2'
      params.push(excludeId)
    }

    const result = await query(queryText, params)
    return result.rows.length > 0
  },

  /**
   * Obtiene estadísticas de usuarios
   * @returns {Promise<Object>} Estadísticas de usuarios
   */
  async getStats() {
    const totalUsers = await query('SELECT COUNT(*) as total FROM users')
    const usersByRole = await query('SELECT role, COUNT(*) as count FROM users GROUP BY role')
    const recentUsers = await query(
      "SELECT COUNT(*) as count FROM users WHERE created_at >= NOW() - INTERVAL '30 days'"
    )

    return {
      totalUsers: parseInt(totalUsers.rows[0].total),
      usersByRole: usersByRole.rows,
      recentUsers: parseInt(recentUsers.rows[0].count)
    }
  }
}

export default User
