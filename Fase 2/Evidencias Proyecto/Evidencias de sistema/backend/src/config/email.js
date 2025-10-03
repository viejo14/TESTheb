import dotenv from 'dotenv'

dotenv.config()

/**
 * Configuración del servicio de email (Nodemailer)
 */
export const emailConfig = {
  // Servicio de email (gmail, outlook, etc.)
  service: process.env.EMAIL_SERVICE || 'gmail',

  // Host y puerto (si no usas un servicio predefinido)
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 587,
  secure: process.env.EMAIL_SECURE === 'true', // true para 465, false para otros puertos

  // Autenticación
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },

  // Opciones adicionales
  tls: {
    rejectUnauthorized: false // Solo para desarrollo
  }
}

/**
 * Validar configuración de email
 */
export const validateEmailConfig = () => {
  const required = ['EMAIL_USER', 'EMAIL_PASSWORD']
  const missing = required.filter(key => !process.env[key])

  if (missing.length > 0) {
    console.warn(`⚠️  Configuración de email incompleta. Faltan: ${missing.join(', ')}`)
    console.warn('⚠️  El servicio de recuperación de contraseña no funcionará correctamente.')
    return false
  }

  return true
}

export default emailConfig
