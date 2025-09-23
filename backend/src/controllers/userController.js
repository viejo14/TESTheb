import { query } from '../config/database.js'
import { catchAsync } from '../middleware/errorHandler.js'
import { AppError } from '../middleware/errorHandler.js'
import logger from '../config/logger.js'

// Obtener todos los usuarios
export const getAllUsers = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, search } = req.query
  const offset = (page - 1) * limit

  let queryText = 'SELECT id, name, email, role, created_at, updated_at FROM users'
  let params = []

  // Agregar búsqueda si se proporciona
  if (search) {
    queryText += ' WHERE name ILIKE $1 OR email ILIKE $1'
    params.push(`%${search}%`)
  }

  queryText += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2)
  params.push(limit, offset)

  const result = await query(queryText, params)

  // Contar total de usuarios para paginación
  const countQuery = search
    ? 'SELECT COUNT(*) FROM users WHERE name ILIKE $1 OR email ILIKE $1'
    : 'SELECT COUNT(*) FROM users'
  const countParams = search ? [`%${search}%`] : []
  const countResult = await query(countQuery, countParams)

  const totalUsers = parseInt(countResult.rows[0].count)
  const totalPages = Math.ceil(totalUsers / limit)

  res.json({
    success: true,
    message: 'Usuarios obtenidos exitosamente',
    data: result.rows,
    pagination: {
      currentPage: parseInt(page),
      totalPages,
      totalUsers,
      limit: parseInt(limit),
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  })
})

// Obtener usuario por ID
export const getUserById = catchAsync(async (req, res) => {
  const { id } = req.params

  if (!id || isNaN(id)) {
    throw new AppError('ID de usuario inválido', 400)
  }

  const result = await query(
    'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = $1',
    [id]
  )

  if (result.rows.length === 0) {
    throw new AppError('Usuario no encontrado', 404)
  }

  res.json({
    success: true,
    message: 'Usuario obtenido exitosamente',
    data: result.rows[0]
  })
})

// Crear nuevo usuario
export const createUser = catchAsync(async (req, res) => {
  const { name, email, role = 'user' } = req.body

  // Validaciones básicas
  if (!name || !email) {
    throw new AppError('Nombre y email son requeridos', 400)
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new AppError('Formato de email inválido', 400)
  }

  // Verificar si el email ya existe
  const existingUser = await query('SELECT id FROM users WHERE email = $1', [email])
  if (existingUser.rows.length > 0) {
    throw new AppError('El email ya está registrado', 409)
  }

  // Crear usuario
  const result = await query(
    'INSERT INTO users (name, email, role, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id, name, email, role, created_at',
    [name, email, role]
  )

  logger.info('Usuario creado exitosamente', {
    userId: result.rows[0].id,
    email: result.rows[0].email,
    role: result.rows[0].role
  })

  res.status(201).json({
    success: true,
    message: 'Usuario creado exitosamente',
    data: result.rows[0]
  })
})

// Actualizar usuario
export const updateUser = catchAsync(async (req, res) => {
  const { id } = req.params
  const { name, email, role } = req.body

  if (!id || isNaN(id)) {
    throw new AppError('ID de usuario inválido', 400)
  }

  // Verificar que el usuario existe
  const existingUser = await query('SELECT id FROM users WHERE id = $1', [id])
  if (existingUser.rows.length === 0) {
    throw new AppError('Usuario no encontrado', 404)
  }

  // Construir query dinámicamente según campos proporcionados
  const updates = []
  const values = []
  let paramCount = 1

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

    // Verificar que el email no esté en uso por otro usuario
    const emailCheck = await query('SELECT id FROM users WHERE email = $1 AND id != $2', [email, id])
    if (emailCheck.rows.length > 0) {
      throw new AppError('El email ya está en uso por otro usuario', 409)
    }

    updates.push(`email = $${paramCount++}`)
    values.push(email)
  }

  if (role) {
    updates.push(`role = $${paramCount++}`)
    values.push(role)
  }

  if (updates.length === 0) {
    throw new AppError('No se proporcionaron campos para actualizar', 400)
  }

  updates.push(`updated_at = NOW()`)
  values.push(id)

  const queryText = `
    UPDATE users
    SET ${updates.join(', ')}
    WHERE id = $${paramCount}
    RETURNING id, name, email, role, created_at, updated_at
  `

  const result = await query(queryText, values)

  logger.info('Usuario actualizado exitosamente', {
    userId: result.rows[0].id,
    updatedFields: Object.keys(req.body)
  })

  res.json({
    success: true,
    message: 'Usuario actualizado exitosamente',
    data: result.rows[0]
  })
})

// Eliminar usuario
export const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params

  if (!id || isNaN(id)) {
    throw new AppError('ID de usuario inválido', 400)
  }

  // Verificar que el usuario existe
  const existingUser = await query('SELECT id, email FROM users WHERE id = $1', [id])
  if (existingUser.rows.length === 0) {
    throw new AppError('Usuario no encontrado', 404)
  }

  // Eliminar usuario
  await query('DELETE FROM users WHERE id = $1', [id])

  logger.info('Usuario eliminado exitosamente', {
    userId: id,
    email: existingUser.rows[0].email
  })

  res.json({
    success: true,
    message: 'Usuario eliminado exitosamente'
  })
})

// Obtener estadísticas de usuarios
export const getUserStats = catchAsync(async (req, res) => {
  const totalUsers = await query('SELECT COUNT(*) as total FROM users')
  const usersByRole = await query('SELECT role, COUNT(*) as count FROM users GROUP BY role')
  const recentUsers = await query('SELECT COUNT(*) as count FROM users WHERE created_at >= NOW() - INTERVAL \'30 days\'')

  res.json({
    success: true,
    message: 'Estadísticas de usuarios obtenidas',
    data: {
      totalUsers: parseInt(totalUsers.rows[0].total),
      usersByRole: usersByRole.rows,
      recentUsers: parseInt(recentUsers.rows[0].count)
    }
  })
})