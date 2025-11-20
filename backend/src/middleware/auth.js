import jwt from 'jsonwebtoken'
import { query } from '../config/database.js'
import logger from '../config/logger.js'

// ✅ SEGURIDAD: Validar que las variables de entorno críticas existan
const JWT_SECRET = process.env.JWT_SECRET
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET

if (!JWT_SECRET) {
  logger.error('❌ CRITICAL: JWT_SECRET is not defined in environment variables')
  throw new Error('JWT_SECRET must be defined in environment variables')
}

if (!JWT_REFRESH_SECRET) {
  logger.error('❌ CRITICAL: JWT_REFRESH_SECRET is not defined in environment variables')
  throw new Error('JWT_REFRESH_SECRET must be defined in environment variables')
}

// Middleware para verificar JWT token
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acceso requerido'
      })
    }

    // Verificar el token
    const decoded = jwt.verify(token, JWT_SECRET)

    // Verificar que el usuario aún existe en la base de datos
    const userResult = await query(
      'SELECT id, email, name, role, created_at FROM users WHERE id = $1 AND active = true',
      [decoded.userId]
    )

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no válido o inactivo'
      })
    }

    // Agregar información del usuario al request
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      ...userResult.rows[0]
    }

    next()
  } catch (error) {
    logger.error('Error en autenticación:', error)

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      })
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      })
    }

    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    })
  }
}

// Middleware para verificar roles específicos
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para acceder a este recurso'
      })
    }

    next()
  }
}

// Middleware opcional de autenticación (no falla si no hay token)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      req.user = null
      return next()
    }

    const decoded = jwt.verify(token, JWT_SECRET)

    const userResult = await query(
      'SELECT id, email, name, role, created_at FROM users WHERE id = $1 AND active = true',
      [decoded.userId]
    )

    if (userResult.rows.length > 0) {
      req.user = {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        ...userResult.rows[0]
      }
    } else {
      req.user = null
    }

    next()
  } catch (error) {
    req.user = null
    next()
  }
}

// Función helper para generar JWT
export const generateToken = (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role
  }

  return jwt.sign(
    payload,
    JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
      issuer: 'testheb-api',
      audience: 'testheb-users'
    }
  )
}

// Función helper para generar refresh token
export const generateRefreshToken = (user) => {
  const payload = {
    userId: user.id,
    type: 'refresh'
  }

  return jwt.sign(
    payload,
    JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
      issuer: 'testheb-api',
      audience: 'testheb-users'
    }
  )
}