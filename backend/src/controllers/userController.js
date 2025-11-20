import User from '../models/User.js'
import { catchAsync } from '../middleware/errorHandler.js'
import { AppError } from '../middleware/errorHandler.js'
import logger from '../config/logger.js'

// Obtener todos los usuarios
export const getAllUsers = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, search } = req.query

  const { users, pagination } = await User.findAll({ page, limit, search })

  res.json({
    success: true,
    message: 'Usuarios obtenidos exitosamente',
    data: users,
    pagination
  })
})

// Obtener usuario por ID
export const getUserById = catchAsync(async (req, res) => {
  const { id } = req.params

  if (!id || isNaN(id)) {
    throw new AppError('ID de usuario inválido', 400)
  }

  const user = await User.findById(id)

  if (!user) {
    throw new AppError('Usuario no encontrado', 404)
  }

  res.json({
    success: true,
    message: 'Usuario obtenido exitosamente',
    data: user
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
  if (await User.emailExists(email)) {
    throw new AppError('El email ya está registrado', 409)
  }

  // Crear usuario
  const newUser = await User.create({ name, email, role })

  logger.info('Usuario creado exitosamente', {
    userId: newUser.id,
    email: newUser.email,
    role: newUser.role
  })

  res.status(201).json({
    success: true,
    message: 'Usuario creado exitosamente',
    data: newUser
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
  const existingUser = await User.findById(id)
  if (!existingUser) {
    throw new AppError('Usuario no encontrado', 404)
  }

  // Validar email si se proporciona
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new AppError('Formato de email inválido', 400)
    }

    // Verificar que el email no esté en uso por otro usuario
    if (await User.emailExists(email, id)) {
      throw new AppError('El email ya está en uso por otro usuario', 409)
    }
  }

  // Verificar que hay algo para actualizar
  if (!name && !email && !role) {
    throw new AppError('No se proporcionaron campos para actualizar', 400)
  }

  // Actualizar usuario
  const updatedUser = await User.update(id, { name, email, role })

  logger.info('Usuario actualizado exitosamente', {
    userId: updatedUser.id,
    updatedFields: Object.keys(req.body)
  })

  res.json({
    success: true,
    message: 'Usuario actualizado exitosamente',
    data: updatedUser
  })
})

// Eliminar usuario
export const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params

  if (!id || isNaN(id)) {
    throw new AppError('ID de usuario inválido', 400)
  }

  // Verificar que el usuario existe
  const existingUser = await User.findById(id)
  if (!existingUser) {
    throw new AppError('Usuario no encontrado', 404)
  }

  // Eliminar usuario
  await User.delete(id)

  logger.info('Usuario eliminado exitosamente', {
    userId: id,
    email: existingUser.email
  })

  res.json({
    success: true,
    message: 'Usuario eliminado exitosamente'
  })
})

// Obtener estadísticas de usuarios
export const getUserStats = catchAsync(async (req, res) => {
  const stats = await User.getStats()

  res.json({
    success: true,
    message: 'Estadísticas de usuarios obtenidas',
    data: stats
  })
})