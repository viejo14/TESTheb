import Quote from '../models/Quote.js'
import User from '../models/User.js'
import { catchAsync } from '../middleware/errorHandler.js'
import { AppError } from '../middleware/errorHandler.js'
import logger from '../config/logger.js'
import { sendQuoteNotificationEmail, sendQuoteConfirmationEmail } from '../services/emailService.js'

// Obtener todas las cotizaciones (quotes)
export const getAllCotizaciones = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, status, search } = req.query

  const { quotes, pagination } = await Quote.findAll({ page, limit, status, search })

  res.json({
    success: true,
    message: 'Cotizaciones obtenidas exitosamente',
    data: quotes,
    pagination
  })
})

// Obtener cotización por ID
export const getCotizacionById = catchAsync(async (req, res) => {
  const { id } = req.params

  if (!id || isNaN(id)) {
    throw new AppError('ID de cotización inválido', 400)
  }

  const cotizacion = await Quote.findById(id)

  if (!cotizacion) {
    throw new AppError('Cotización no encontrada', 404)
  }

  res.json({
    success: true,
    message: 'Cotización obtenida exitosamente',
    data: cotizacion
  })
})

// Crear nueva cotización
export const createCotizacion = catchAsync(async (req, res) => {
  const { user_id, name, email, phone, message, image_url } = req.body

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
  if (user_id && !(await User.findById(user_id))) {
    throw new AppError('Usuario no encontrado', 404)
  }

  // Crear cotización
  const cotizacion = await Quote.create({ user_id, name, email, phone, message, image_url })

  logger.info('Cotización creada exitosamente', {
    cotizacionId: cotizacion.id,
    name: cotizacion.name,
    email: cotizacion.email
  })

  // Enviar emails automáticos (sin bloquear la respuesta)
  Promise.all([
    // Email de confirmación al cliente
    sendQuoteConfirmationEmail({
      to: cotizacion.email,
      name: cotizacion.name,
      quoteId: cotizacion.id
    }),
    // Email de notificación al admin
    sendQuoteNotificationEmail({
      quoteName: cotizacion.name,
      quoteEmail: cotizacion.email,
      quotePhone: cotizacion.phone,
      quoteMessage: cotizacion.message,
      quoteId: cotizacion.id
    })
  ]).then(([clientEmail, adminEmail]) => {
    if (clientEmail.success) {
      logger.info('Email de confirmación enviado al cliente', { email: cotizacion.email })
    } else {
      logger.error('Error enviando email al cliente:', clientEmail.error)
    }

    if (adminEmail.success) {
      logger.info('Email de notificación enviado al admin')
    } else {
      logger.error('Error enviando email al admin:', adminEmail.error)
    }
  }).catch(error => {
    logger.error('Error enviando emails de cotización:', error)
  })

  res.status(201).json({
    success: true,
    message: 'Cotización creada exitosamente. Recibirás una confirmación por email.',
    data: cotizacion
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
  if (!(await Quote.exists(id))) {
    throw new AppError('Cotización no encontrada', 404)
  }

  // Validar estado si se proporciona
  if (status && !Quote.isValidStatus(status)) {
    throw new AppError('Estado inválido. Estados permitidos: ' + Quote.ALLOWED_STATUSES.join(', '), 400)
  }

  // Validar email si se proporciona
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new AppError('Formato de email inválido', 400)
    }
  }

  // Verificar que hay algo para actualizar
  if (!status && !name && !email && phone === undefined && !message) {
    throw new AppError('No se proporcionaron campos para actualizar', 400)
  }

  // Actualizar cotización
  const updatedCotizacion = await Quote.update(id, { status, name, email, phone, message })

  logger.info('Cotización actualizada exitosamente', {
    cotizacionId: updatedCotizacion.id,
    updatedFields: Object.keys(req.body)
  })

  res.json({
    success: true,
    message: 'Cotización actualizada exitosamente',
    data: updatedCotizacion
  })
})

// Eliminar cotización
export const deleteCotizacion = catchAsync(async (req, res) => {
  const { id } = req.params

  if (!id || isNaN(id)) {
    throw new AppError('ID de cotización inválido', 400)
  }

  // Verificar que la cotización existe
  const existingCotizacion = await Quote.findById(id)
  if (!existingCotizacion) {
    throw new AppError('Cotización no encontrada', 404)
  }

  // Eliminar cotización
  await Quote.delete(id)

  logger.info('Cotización eliminada exitosamente', {
    cotizacionId: id,
    name: existingCotizacion.name,
    email: existingCotizacion.email
  })

  res.json({
    success: true,
    message: 'Cotización eliminada exitosamente'
  })
})

// Obtener estadísticas de cotizaciones
export const getCotizacionStats = catchAsync(async (req, res) => {
  const stats = await Quote.getStats()

  res.json({
    success: true,
    message: 'Estadísticas de cotizaciones obtenidas',
    data: stats
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

  // Validar estado
  if (!Quote.isValidStatus(status)) {
    throw new AppError('Estado inválido. Estados permitidos: ' + Quote.ALLOWED_STATUSES.join(', '), 400)
  }

  // Actualizar en lote
  const { updatedCount, updatedIds } = await Quote.updateBulkStatus(ids, status)

  logger.info('Estado actualizado masivamente', {
    status,
    updatedIds,
    count: updatedCount
  })

  res.json({
    success: true,
    message: `${updatedCount} cotizaciones actualizadas exitosamente`,
    data: {
      updatedCount,
      updatedIds
    }
  })
})