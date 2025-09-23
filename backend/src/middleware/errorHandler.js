import logger, { logError } from '../config/logger.js'

// Clase personalizada para errores de la aplicación
export class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'

    Error.captureStackTrace(this, this.constructor)
  }
}

// Middleware para manejar errores de Mongoose/Sequelize
const handleCastErrorDB = (err) => {
  const message = `Recurso inválido: ${err.path}: ${err.value}`
  return new AppError(message, 400)
}

// Middleware para manejar errores de duplicación
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg?.match(/(["'])(\\?.)*?\1/)?.[0]
  const message = `Campo duplicado: ${value}. Por favor usa otro valor`
  return new AppError(message, 400)
}

// Middleware para manejar errores de validación
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message)
  const message = `Datos inválidos: ${errors.join('. ')}`
  return new AppError(message, 400)
}

// Middleware para manejar JWT errors
const handleJWTError = () =>
  new AppError('Token inválido. Por favor inicia sesión nuevamente', 401)

const handleJWTExpiredError = () =>
  new AppError('Tu token ha expirado. Por favor inicia sesión nuevamente', 401)

// Enviar error en desarrollo
const sendErrorDev = (err, req, res) => {
  logger.error('Error en desarrollo:', {
    error: err,
    request: {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body
    },
    stack: err.stack
  })

  res.status(err.statusCode).json({
    success: false,
    error: err,
    message: err.message,
    stack: err.stack,
    request: {
      method: req.method,
      url: req.url
    }
  })
}

// Enviar error en producción
const sendErrorProd = (err, req, res) => {
  // Errores operacionales: enviar mensaje al cliente
  if (err.isOperational) {
    logger.warn('Error operacional:', {
      message: err.message,
      statusCode: err.statusCode,
      request: {
        method: req.method,
        url: req.url,
        ip: req.ip
      }
    })

    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message
    })

  // Errores de programación: no filtrar detalles al cliente
  } else {
    logger.error('Error de programación:', {
      error: err,
      request: {
        method: req.method,
        url: req.url,
        ip: req.ip
      },
      stack: err.stack
    })

    res.status(500).json({
      success: false,
      status: 'error',
      message: 'Algo salió mal en el servidor'
    })
  }
}

// Middleware principal de manejo de errores
export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  // Log del error
  logError(err, req)

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res)
  } else {
    let error = { ...err }
    error.message = err.message

    // Manejar tipos específicos de errores
    if (error.name === 'CastError') error = handleCastErrorDB(error)
    if (error.code === 11000) error = handleDuplicateFieldsDB(error)
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error)
    if (error.name === 'JsonWebTokenError') error = handleJWTError()
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError()

    sendErrorProd(error, req, res)
  }
}

// Middleware para capturar rutas no encontradas
export const notFoundHandler = (req, res, next) => {
  const error = new AppError(`No se puede encontrar ${req.originalUrl} en este servidor`, 404)
  next(error)
}

// Wrapper para funciones async (catchAsync)
export const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

// Middleware para validar entrada de datos
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body)
    if (error) {
      const message = error.details.map(detail => detail.message).join(', ')
      return next(new AppError(message, 400))
    }
    next()
  }
}

export default globalErrorHandler