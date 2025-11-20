import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { query } from '../config/database.js'
import logger from '../config/logger.js'
import { generateToken, generateRefreshToken } from '../middleware/auth.js'
import { sendPasswordResetEmail } from '../services/emailService.js'

// Registrar nuevo usuario
export const register = async (req, res) => {
  try {
    const { name, email, password, role = 'customer' } = req.body

    // Validaciones básicas
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, email y contraseña son requeridos'
      })
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de email inválido'
      })
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      })
    }

    // Verificar si el email ya existe
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    )

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Este email ya está registrado'
      })
    }

    // Hash de la contraseña
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Crear el usuario
    const newUser = await query(
      `INSERT INTO users (name, email, password_hash, role, active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, true, NOW(), NOW())
       RETURNING id, name, email, role, created_at`,
      [name.trim(), email.toLowerCase(), hashedPassword, role]
    )

    const user = newUser.rows[0]

    // Generar tokens
    const token = generateToken(user)
    const refreshToken = generateRefreshToken(user)

    // Log del registro exitoso
    logger.info('Usuario registrado exitosamente', {
      userId: user.id,
      email: user.email,
      role: user.role
    })

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.created_at
        },
        token,
        refreshToken,
        expiresIn: '24h'
      }
    })

  } catch (error) {
    logger.error('Error en registro de usuario:', error)
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    })
  }
}

// Iniciar sesión
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validaciones básicas
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      })
    }

    // Buscar usuario por email
    const userResult = await query(
      'SELECT id, name, email, password_hash, role, active, created_at FROM users WHERE email = $1',
      [email.toLowerCase()]
    )

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      })
    }

    const user = userResult.rows[0]

    // Verificar si el usuario está activo
    if (!user.active) {
      return res.status(401).json({
        success: false,
        message: 'Cuenta desactivada. Contacta al administrador'
      })
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      // Log del intento de login fallido
      logger.warn('Intento de login con contraseña incorrecta', {
        email: email.toLowerCase(),
        ip: req.ip,
        userAgent: req.get('User-Agent')
      })

      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      })
    }

    // Actualizar última conexión
    await query(
      'UPDATE users SET last_login = NOW(), updated_at = NOW() WHERE id = $1',
      [user.id]
    )

    // Generar tokens
    const token = generateToken(user)
    const refreshToken = generateRefreshToken(user)

    // Log del login exitoso
    logger.info('Usuario inició sesión exitosamente', {
      userId: user.id,
      email: user.email,
      role: user.role,
      ip: req.ip
    })

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.created_at
        },
        token,
        refreshToken,
        expiresIn: '24h'
      }
    })

  } catch (error) {
    logger.error('Error en inicio de sesión:', error)
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    })
  }
}

// Obtener perfil del usuario autenticado
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id

    const userResult = await query(
      'SELECT id, name, email, role, active, created_at, last_login FROM users WHERE id = $1',
      [userId]
    )

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      })
    }

    const user = userResult.rows[0]

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          active: user.active,
          createdAt: user.created_at,
          lastLogin: user.last_login
        }
      }
    })

  } catch (error) {
    logger.error('Error obteniendo perfil:', error)
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    })
  }
}

// Actualizar perfil del usuario
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id
    const { name, email } = req.body

    // Validaciones básicas
    if (!name && !email) {
      return res.status(400).json({
        success: false,
        message: 'Al menos un campo (nombre o email) es requerido'
      })
    }

    let updateFields = []
    let values = []
    let paramCount = 1

    if (name) {
      updateFields.push(`name = $${paramCount}`)
      values.push(name.trim())
      paramCount++
    }

    if (email) {
      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Formato de email inválido'
        })
      }

      // Verificar si el email ya existe (excluyendo el usuario actual)
      const existingUser = await query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email.toLowerCase(), userId]
      )

      if (existingUser.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Este email ya está en uso'
        })
      }

      updateFields.push(`email = $${paramCount}`)
      values.push(email.toLowerCase())
      paramCount++
    }

    updateFields.push(`updated_at = NOW()`)
    values.push(userId)

    const updateQuery = `
      UPDATE users
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, name, email, role, created_at, updated_at
    `

    const result = await query(updateQuery, values)

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      })
    }

    const updatedUser = result.rows[0]

    logger.info('Perfil actualizado exitosamente', {
      userId: updatedUser.id,
      changes: { name: !!name, email: !!email }
    })

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: {
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          createdAt: updatedUser.created_at,
          updatedAt: updatedUser.updated_at
        }
      }
    })

  } catch (error) {
    logger.error('Error actualizando perfil:', error)
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    })
  }
}

// Cambiar contraseña
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id
    const { currentPassword, newPassword } = req.body

    // Validaciones básicas
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Contraseña actual y nueva contraseña son requeridas'
      })
    }

    // Validar longitud de nueva contraseña
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La nueva contraseña debe tener al menos 6 caracteres'
      })
    }

    // Obtener contraseña actual del usuario
    const userResult = await query(
      'SELECT password_hash FROM users WHERE id = $1',
      [userId]
    )

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      })
    }

    const user = userResult.rows[0]

    // Verificar contraseña actual
    const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash)

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Contraseña actual incorrecta'
      })
    }

    // Hash de la nueva contraseña
    const saltRounds = 12
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds)

    // Actualizar contraseña
    await query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [hashedNewPassword, userId]
    )

    logger.info('Contraseña cambiada exitosamente', {
      userId: userId
    })

    res.json({
      success: true,
      message: 'Contraseña cambiada exitosamente'
    })

  } catch (error) {
    logger.error('Error cambiando contraseña:', error)
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    })
  }
}

// Cerrar sesión (opcional - para invalidar tokens en el futuro)
export const logout = async (req, res) => {
  try {
    // Por ahora solo confirmamos el logout
    // En el futuro se puede implementar una blacklist de tokens

    logger.info('Usuario cerró sesión', {
      userId: req.user?.id || 'unknown'
    })

    res.json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    })

  } catch (error) {
    logger.error('Error cerrando sesión:', error)
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    })
  }
}

// Solicitar recuperación de contraseña
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    // Validación básica
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email es requerido'
      })
    }

    // Buscar usuario por email
    const userResult = await query(
      'SELECT id, name, email FROM users WHERE email = $1',
      [email.toLowerCase()]
    )

    // Por seguridad, siempre retornamos el mismo mensaje aunque el email no exista
    if (userResult.rows.length === 0) {
      return res.json({
        success: true,
        message: 'Si el email existe, recibirás un enlace para restablecer tu contraseña'
      })
    }

    const user = userResult.rows[0]

    // Generar token aleatorio de 32 bytes
    const resetToken = crypto.randomBytes(32).toString('hex')

    // Hash del token para guardarlo en la base de datos
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    // Expiración del token (1 hora)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

    // Guardar token en la base de datos
    await query(
      'UPDATE users SET password_reset_token = $1, password_reset_expires = $2, updated_at = NOW() WHERE id = $3',
      [hashedToken, expiresAt, user.id]
    )

    // Enviar email con el enlace de recuperación
    const emailResult = await sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      resetToken: resetToken
    })

    if (!emailResult.success) {
      logger.error('Error enviando email de recuperación', {
        userId: user.id,
        email: user.email,
        error: emailResult.error
      })
      // No retornamos error al usuario por seguridad
    }

    logger.info('Token de recuperación generado y email enviado', {
      userId: user.id,
      email: user.email,
      emailSent: emailResult.success
    })

    res.json({
      success: true,
      message: 'Si el email existe, recibirás un enlace para restablecer tu contraseña'
    })

  } catch (error) {
    logger.error('Error en solicitud de recuperación de contraseña:', error)
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    })
  }
}

// Restablecer contraseña con token
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body

    // Validaciones básicas
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token y nueva contraseña son requeridos'
      })
    }

    // Validar longitud de nueva contraseña
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La nueva contraseña debe tener al menos 6 caracteres'
      })
    }

    // Hash del token recibido para comparar con la base de datos
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    // Buscar usuario con el token válido y no expirado
    const userResult = await query(
      'SELECT id, name, email FROM users WHERE password_reset_token = $1 AND password_reset_expires > NOW()',
      [hashedToken]
    )

    if (userResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido o expirado. Solicita un nuevo enlace de recuperación'
      })
    }

    const user = userResult.rows[0]

    // Hash de la nueva contraseña
    const saltRounds = 12
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds)

    // Actualizar contraseña y limpiar tokens de reset
    await query(
      'UPDATE users SET password_hash = $1, password_reset_token = NULL, password_reset_expires = NULL, updated_at = NOW() WHERE id = $2',
      [hashedNewPassword, user.id]
    )

    logger.info('Contraseña restablecida exitosamente', {
      userId: user.id,
      email: user.email
    })

    res.json({
      success: true,
      message: 'Contraseña restablecida exitosamente. Ya puedes iniciar sesión con tu nueva contraseña'
    })

  } catch (error) {
    logger.error('Error restableciendo contraseña:', error)
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    })
  }
}

// Eliminar cuenta del usuario autenticado
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id
    const { password } = req.body

    // Validación de contraseña requerida
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Debes confirmar tu contraseña para eliminar la cuenta'
      })
    }

    // Obtener datos del usuario
    const userResult = await query(
      'SELECT id, name, email, password_hash FROM users WHERE id = $1',
      [userId]
    )

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      })
    }

    const user = userResult.rows[0]

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Contraseña incorrecta'
      })
    }

    // Soft delete: marcar como inactivo en lugar de eliminar
    // Esto preserva la integridad referencial con pedidos, cotizaciones, etc.
    await query(
      `UPDATE users
       SET active = false,
           email = CONCAT('deleted_', id, '_', email),
           updated_at = NOW()
       WHERE id = $1`,
      [userId]
    )

    logger.info('Cuenta eliminada por el usuario', {
      userId: user.id,
      email: user.email
    })

    res.json({
      success: true,
      message: 'Tu cuenta ha sido eliminada exitosamente. Lamentamos verte partir.'
    })

  } catch (error) {
    logger.error('Error eliminando cuenta:', error)
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    })
  }
}