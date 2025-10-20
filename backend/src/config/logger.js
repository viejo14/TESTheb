import winston from 'winston'
import path from 'path'

// Definir colores personalizados
const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'cyan',
  verbose: 'gray',
  debug: 'magenta',
  silly: 'gray'
}

winston.addColors(logColors)

// Formato personalizado para logs
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack, service, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]`

    if (service) {
      log += ` [${service}]`
    }

    log += `: ${message}`

    // Agregar metadata si existe
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta, null, 2)}`
    }

    // Agregar stack trace para errores
    if (stack) {
      log += `\n${stack}`
    }

    return log
  })
)

// Formato para consola con colores
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  logFormat
)

// Crear el logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'error',
  format: logFormat,
  defaultMeta: { service: 'testheb-api' },
  transports: [
    // Archivo para errores
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    }),

    // Archivo para todos los logs
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    }),

    // Consola para desarrollo
    new winston.transports.Console({
      format: consoleFormat,
      level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug'
    })
  ],

  // Manejo de excepciones no capturadas
  exceptionHandlers: [
    new winston.transports.File({ filename: path.join('logs', 'exceptions.log') }),
    new winston.transports.Console({ format: consoleFormat })
  ],

  // Manejo de promesas rechazadas
  rejectionHandlers: [
    new winston.transports.File({ filename: path.join('logs', 'rejections.log') }),
    new winston.transports.Console({ format: consoleFormat })
  ]
})

// Crear directorio de logs si no existe
import fs from 'fs'
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs')
}

// Función helper para logging de base de datos
export const logQuery = (query, params, duration, rowCount) => {
  // logger.debug('Database Query', {
  //   query: query.substring(0, 100) + (query.length > 100 ? '...' : ''),
  //   params: params ? params.length : 0,
  //   duration: `${duration}ms`,
  //   rowCount
  // })
}

// Función helper para logging de errores HTTP
export const logError = (error, req = null) => {
  const logData = {
    error: error.message,
    stack: error.stack
  }

  if (req) {
    logData.request = {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    }
  }

  logger.error('HTTP Error', logData)
}

// Función helper para logging de requests exitosos
export const logRequest = (req, res, duration) => {
  logger.info('HTTP Request', {
    method: req.method,
    url: req.url,
    status: res.statusCode,
    duration: `${duration}ms`,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  })
}

export default logger