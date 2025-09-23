import { query } from '../config/database.js'
import { catchAsync } from '../middleware/errorHandler.js'
import { AppError } from '../middleware/errorHandler.js'
import logger from '../config/logger.js'

// Obtener todas las cotizaciones (quotes)
export const getAllCotizaciones = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, status, search } = req.query
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

  // Contar total para paginación
  let countQuery = 'SELECT COUNT(*) FROM quotes q LEFT JOIN users u ON q.user_id = u.id'
  let countParams = []

  if (whereConditions.length > 0) {
    countQuery += ' WHERE ' + whereConditions.join(' AND ')
    countParams = params.slice(0, -2) // Todos los parámetros excepto limit y offset
  }

  const countResult = await query(countQuery, countParams)
  const totalCotizaciones = parseInt(countResult.rows[0].count)
  const totalPages = Math.ceil(totalCotizaciones / limit)

  res.json({
    success: true,
    message: 'Cotizaciones obtenidas exitosamente',
    data: result.rows,
    pagination: {
      currentPage: parseInt(page),
      totalPages,
      totalCotizaciones,
      limit: parseInt(limit),
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  })
})

// Obtener cotización por ID
export const getCotizacionById = catchAsync(async (req, res) => {
  const { id } = req.params

  if (!id || isNaN(id)) {
    throw new AppError('ID de cotización inválido', 400)
  }

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
      q.status,
      q.created_at
    FROM quotes q
    LEFT JOIN users u ON q.user_id = u.id
    WHERE q.id = $1
  `, [id])

  if (result.rows.length === 0) {
    throw new AppError('Cotización no encontrada', 404)
  }

  res.json({
    success: true,
    message: 'Cotización obtenida exitosamente',
    data: result.rows[0]
  })
})

// Crear nueva cotización
export const createCotizacion = catchAsync(async (req, res) => {
  const { user_id, name, email, phone, message } = req.body

  // Validaciones básicas
  if (!name || !email || !message) {
    throw new AppError('name, email y message son requeridos', 400)
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new AppError('Formato de email inválido', 400)
  }

  // Si se proporciona user_id, verificar que el usuario existe
  if (user_id) {
    const userExists = await query('SELECT id FROM users WHERE id = $1', [user_id])
    if (userExists.rows.length === 0) {
      throw new AppError('Usuario no encontrado', 404)
    }
  }

  // Crear cotización
  const result = await query(`
    INSERT INTO quotes (
      user_id,
      name,
      email,
      phone,
      message,
      status,
      created_at
    ) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
    RETURNING id, user_id, name, email, phone, message, status, created_at
  `, [user_id || null, name, email, phone || null, message, 'pendiente'])

  logger.info('Cotización creada exitosamente', {
    cotizacionId: result.rows[0].id,
    name: result.rows[0].name,
    email: result.rows[0].email
  })

  res.status(201).json({
    success: true,
    message: 'Cotización creada exitosamente',
    data: result.rows[0]
  })
})

// Actualizar cotización
export const updateCotizacion = catchAsync(async (req, res) => {
  const { id } = req.params
  const { status, name, email, phone, message } = req.body

  if (!id || isNaN(id)) {
    throw new AppError('ID de cotización inválido', 400)
  }

  // Verificar que la cotización existe
  const existingCotizacion = await query('SELECT id, status FROM quotes WHERE id = $1', [id])
  if (existingCotizacion.rows.length === 0) {
    throw new AppError('Cotización no encontrada', 404)
  }

  // Construir query dinámicamente
  const updates = []
  const values = []
  let paramCount = 1

  if (status) {
    // Validar estados permitidos
    const allowedStatuses = ['pendiente', 'aprobada', 'rechazada', 'en_proceso']
    if (!allowedStatuses.includes(status)) {
      throw new AppError('Estado inválido. Estados permitidos: ' + allowedStatuses.join(', '), 400)
    }

    updates.push(`status = $${paramCount++}`)
    values.push(status)
  }

  if (name) {
    updates.push(`name = $${paramCount++}`)
    values.push(name)
  }

  if (email) {
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new AppError('Formato de email inválido', 400)
    }

    updates.push(`email = $${paramCount++}`)
    values.push(email)
  }

  if (phone !== undefined) {
    updates.push(`phone = $${paramCount++}`)
    values.push(phone)
  }

  if (message) {
    updates.push(`message = $${paramCount++}`)
    values.push(message)
  }

  if (updates.length === 0) {
    throw new AppError('No se proporcionaron campos para actualizar', 400)
  }

  values.push(id)

  const queryText = `
    UPDATE quotes
    SET ${updates.join(', ')}
    WHERE id = $${paramCount}
    RETURNING id, user_id, name, email, phone, message, status, created_at
  `

  const result = await query(queryText, values)

  logger.info('Cotización actualizada exitosamente', {
    cotizacionId: result.rows[0].id,
    updatedFields: Object.keys(req.body)
  })

  res.json({
    success: true,
    message: 'Cotización actualizada exitosamente',
    data: result.rows[0]
  })
})

// Eliminar cotización
export const deleteCotizacion = catchAsync(async (req, res) => {
  const { id } = req.params

  if (!id || isNaN(id)) {
    throw new AppError('ID de cotización inválido', 400)
  }

  // Verificar que la cotización existe
  const existingCotizacion = await query('SELECT id, name, email FROM quotes WHERE id = $1', [id])
  if (existingCotizacion.rows.length === 0) {
    throw new AppError('Cotización no encontrada', 404)
  }

  // Eliminar cotización
  await query('DELETE FROM quotes WHERE id = $1', [id])

  logger.info('Cotización eliminada exitosamente', {
    cotizacionId: id,
    name: existingCotizacion.rows[0].name,
    email: existingCotizacion.rows[0].email
  })

  res.json({
    success: true,
    message: 'Cotización eliminada exitosamente'
  })
})

// Obtener estadísticas de cotizaciones
export const getCotizacionStats = catchAsync(async (req, res) => {
  const totalCotizaciones = await query('SELECT COUNT(*) as total FROM quotes')
  const cotizacionesByStatus = await query('SELECT status, COUNT(*) as count FROM quotes GROUP BY status')
  const recentCotizaciones = await query('SELECT COUNT(*) as count FROM quotes WHERE created_at >= CURRENT_TIMESTAMP - INTERVAL \'30 days\'')

  res.json({
    success: true,
    message: 'Estadísticas de cotizaciones obtenidas',
    data: {
      totalCotizaciones: parseInt(totalCotizaciones.rows[0].total),
      cotizacionesByStatus: cotizacionesByStatus.rows,
      recentCotizaciones: parseInt(recentCotizaciones.rows[0].count)
    }
  })
})

// Cambiar estado masivo de cotizaciones (ej: marcar como procesadas)
export const updateBulkStatus = catchAsync(async (req, res) => {
  const { ids, status } = req.body

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    throw new AppError('Se requiere un array de IDs', 400)
  }

  if (!status) {
    throw new AppError('Estado requerido', 400)
  }

  // Validar estados permitidos
  const allowedStatuses = ['pendiente', 'aprobada', 'rechazada', 'en_proceso']
  if (!allowedStatuses.includes(status)) {
    throw new AppError('Estado inválido. Estados permitidos: ' + allowedStatuses.join(', '), 400)
  }

  // Construir placeholders para los IDs
  const placeholders = ids.map((_, index) => `$${index + 2}`).join(', ')

  const result = await query(`
    UPDATE quotes
    SET status = $1
    WHERE id IN (${placeholders})
    RETURNING id
  `, [status, ...ids])

  logger.info('Estado actualizado masivamente', {
    status,
    updatedIds: result.rows.map(row => row.id),
    count: result.rowCount
  })

  res.json({
    success: true,
    message: `${result.rowCount} cotizaciones actualizadas exitosamente`,
    data: {
      updatedCount: result.rowCount,
      updatedIds: result.rows.map(row => row.id)
    }
  })
})