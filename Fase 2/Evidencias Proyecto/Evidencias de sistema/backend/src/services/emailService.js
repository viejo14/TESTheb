import nodemailer from 'nodemailer'
import logger from '../config/logger.js'
import { emailConfig } from '../config/email.js'

// Crear transportador de email
const createTransporter = () => {
  try {
    const transporter = nodemailer.createTransport(emailConfig)

    // Verificar configuración
    transporter.verify((error, success) => {
      if (error) {
        logger.error('Error en configuración de email:', error)
      } else {
        logger.info('✓ Servidor de email configurado correctamente')
      }
    })

    return transporter
  } catch (error) {
    logger.error('Error creando transportador de email:', error)
    return null
  }
}

const transporter = createTransporter()

/**
 * Enviar email de recuperación de contraseña
 */
export const sendPasswordResetEmail = async ({ to, name, resetToken }) => {
  try {
    if (!transporter) {
      logger.error('Transportador de email no disponible')
      return {
        success: false,
        error: 'Servicio de email no configurado'
      }
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`

    const mailOptions = {
      from: {
        name: process.env.EMAIL_FROM_NAME || 'TESTheb',
        address: process.env.EMAIL_USER
      },
      to: to,
      subject: 'Recuperación de Contraseña - TESTheb',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Recuperación de Contraseña</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 20px 40px; text-align: center; background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); border-radius: 8px 8px 0 0;">
                      <h1 style="margin: 0; color: #fbbf24; font-size: 28px; font-weight: bold;">
                        🧵 TESTheb
                      </h1>
                      <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px;">
                        Bordados Personalizados
                      </p>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 24px;">
                        Recuperación de Contraseña
                      </h2>

                      <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.5;">
                        Hola <strong>${name}</strong>,
                      </p>

                      <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.5;">
                        Recibimos una solicitud para restablecer la contraseña de tu cuenta en TESTheb.
                      </p>

                      <p style="margin: 0 0 30px 0; color: #4b5563; font-size: 16px; line-height: 1.5;">
                        Haz clic en el siguiente botón para crear una nueva contraseña:
                      </p>

                      <!-- Button -->
                      <table role="presentation" style="margin: 0 auto;">
                        <tr>
                          <td style="border-radius: 6px; background-color: #fbbf24;">
                            <a href="${resetUrl}" target="_blank" style="display: inline-block; padding: 16px 40px; color: #1a1a1a; text-decoration: none; font-weight: bold; font-size: 16px;">
                              Restablecer Contraseña
                            </a>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 30px 0 20px 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                        O copia y pega este enlace en tu navegador:
                      </p>

                      <p style="margin: 0 0 30px 0; padding: 12px; background-color: #f3f4f6; border-radius: 4px; word-break: break-all;">
                        <a href="${resetUrl}" style="color: #3b82f6; text-decoration: none; font-size: 14px;">
                          ${resetUrl}
                        </a>
                      </p>

                      <!-- Warning Box -->
                      <div style="margin: 30px 0; padding: 16px; background-color: #fef3c7; border-left: 4px solid #fbbf24; border-radius: 4px;">
                        <p style="margin: 0; color: #78350f; font-size: 14px; line-height: 1.5;">
                          ⚠️ <strong>Importante:</strong> Este enlace expirará en <strong>1 hora</strong> por razones de seguridad.
                        </p>
                      </div>

                      <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                        Si no solicitaste restablecer tu contraseña, puedes ignorar este correo de forma segura.
                      </p>

                      <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                        Tu contraseña actual permanecerá sin cambios hasta que crees una nueva.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px;">
                      <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 12px; text-align: center;">
                        Este es un correo automático, por favor no respondas a este mensaje.
                      </p>
                      <p style="margin: 0; color: #6b7280; font-size: 12px; text-align: center;">
                        © ${new Date().getFullYear()} TESTheb - Bordados Personalizados
                      </p>
                      <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 11px; text-align: center;">
                        Capstone Project APT122
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      text: `
        Hola ${name},

        Recibimos una solicitud para restablecer la contraseña de tu cuenta en TESTheb.

        Para crear una nueva contraseña, visita el siguiente enlace:
        ${resetUrl}

        Este enlace expirará en 1 hora por razones de seguridad.

        Si no solicitaste restablecer tu contraseña, puedes ignorar este correo de forma segura.

        Saludos,
        El equipo de TESTheb
      `
    }

    const info = await transporter.sendMail(mailOptions)

    logger.info('Email de recuperación enviado exitosamente', {
      to: to,
      messageId: info.messageId
    })

    return {
      success: true,
      messageId: info.messageId
    }

  } catch (error) {
    logger.error('Error enviando email de recuperación:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Enviar email de bienvenida (opcional)
 */
export const sendWelcomeEmail = async ({ to, name }) => {
  try {
    if (!transporter) {
      return { success: false, error: 'Servicio de email no configurado' }
    }

    const mailOptions = {
      from: {
        name: process.env.EMAIL_FROM_NAME || 'TESTheb',
        address: process.env.EMAIL_USER
      },
      to: to,
      subject: '¡Bienvenido a TESTheb! 🧵',
      html: `
        <h2>¡Bienvenido ${name}!</h2>
        <p>Gracias por registrarte en TESTheb.</p>
        <p>Estamos emocionados de tenerte con nosotros.</p>
        <p>Explora nuestro catálogo y crea bordados únicos y personalizados.</p>
        <p>Saludos,<br>El equipo de TESTheb</p>
      `,
      text: `
        ¡Bienvenido ${name}!

        Gracias por registrarte en TESTheb.
        Estamos emocionados de tenerte con nosotros.

        Saludos,
        El equipo de TESTheb
      `
    }

    const info = await transporter.sendMail(mailOptions)
    logger.info('Email de bienvenida enviado', { to, messageId: info.messageId })

    return { success: true, messageId: info.messageId }
  } catch (error) {
    logger.error('Error enviando email de bienvenida:', error)
    return { success: false, error: error.message }
  }
}

export default {
  sendPasswordResetEmail,
  sendWelcomeEmail
}
