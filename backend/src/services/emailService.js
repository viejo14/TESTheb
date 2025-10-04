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

/**
 * Enviar notificación de nueva cotización al admin
 */
export const sendQuoteNotificationEmail = async ({ quoteName, quoteEmail, quotePhone, quoteMessage, quoteId }) => {
  try {
    if (!transporter) {
      logger.error('Transportador de email no disponible')
      return {
        success: false,
        error: 'Servicio de email no configurado'
      }
    }

    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'

    const mailOptions = {
      from: {
        name: process.env.EMAIL_FROM_NAME || 'TESTheb',
        address: process.env.EMAIL_USER
      },
      to: adminEmail,
      subject: `🔔 Nueva Cotización #${quoteId} - TESTheb`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Nueva Cotización</title>
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
                        🔔 Nueva Cotización
                      </h1>
                      <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px;">
                        TESTheb - Panel de Administración
                      </p>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 24px;">
                        Solicitud de Cotización #${quoteId}
                      </h2>

                      <p style="margin: 0 0 30px 0; color: #4b5563; font-size: 16px; line-height: 1.5;">
                        Has recibido una nueva solicitud de cotización en el sistema TESTheb.
                      </p>

                      <!-- Quote Details Box -->
                      <div style="margin: 20px 0; padding: 20px; background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
                        <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">
                          📋 Detalles del Cliente
                        </h3>

                        <table style="width: 100%; border-collapse: collapse;">
                          <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 30%;">
                              <strong>Nombre:</strong>
                            </td>
                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">
                              ${quoteName}
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">
                              <strong>Email:</strong>
                            </td>
                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">
                              <a href="mailto:${quoteEmail}" style="color: #3b82f6; text-decoration: none;">
                                ${quoteEmail}
                              </a>
                            </td>
                          </tr>
                          ${quotePhone ? `
                          <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">
                              <strong>Teléfono:</strong>
                            </td>
                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">
                              <a href="tel:${quotePhone}" style="color: #3b82f6; text-decoration: none;">
                                ${quotePhone}
                              </a>
                            </td>
                          </tr>
                          ` : ''}
                        </table>

                        <h3 style="margin: 20px 0 10px 0; color: #1f2937; font-size: 18px;">
                          💬 Mensaje
                        </h3>
                        <p style="margin: 0; padding: 15px; background-color: #ffffff; border-radius: 6px; color: #1f2937; font-size: 15px; line-height: 1.6; border-left: 4px solid #fbbf24;">
                          ${quoteMessage}
                        </p>
                      </div>

                      <!-- Action Buttons -->
                      <table role="presentation" style="margin: 30px 0;">
                        <tr>
                          <td style="padding-right: 10px;">
                            <table role="presentation">
                              <tr>
                                <td style="border-radius: 6px; background-color: #fbbf24;">
                                  <a href="${frontendUrl}/admin?tab=cotizaciones" target="_blank" style="display: inline-block; padding: 14px 28px; color: #1a1a1a; text-decoration: none; font-weight: bold; font-size: 15px;">
                                    📊 Ver en Panel Admin
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                          <td>
                            <table role="presentation">
                              <tr>
                                <td style="border-radius: 6px; background-color: #10b981;">
                                  <a href="mailto:${quoteEmail}" target="_blank" style="display: inline-block; padding: 14px 28px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 15px;">
                                    ✉️ Responder al Cliente
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>

                      <!-- Info Box -->
                      <div style="margin: 30px 0 0 0; padding: 16px; background-color: #dbeafe; border-left: 4px solid #3b82f6; border-radius: 4px;">
                        <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.5;">
                          💡 <strong>Tip:</strong> Responde a las cotizaciones en menos de 24 horas para mejorar la tasa de conversión.
                        </p>
                      </div>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px;">
                      <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 12px; text-align: center;">
                        Este es un correo automático del sistema TESTheb.
                      </p>
                      <p style="margin: 0; color: #6b7280; font-size: 12px; text-align: center;">
                        © ${new Date().getFullYear()} TESTheb - Bordados Personalizados
                      </p>
                      <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 11px; text-align: center;">
                        Cotización ID: #${quoteId} | Capstone Project APT122
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
        NUEVA COTIZACIÓN #${quoteId} - TESTheb

        Has recibido una nueva solicitud de cotización.

        DETALLES DEL CLIENTE:
        Nombre: ${quoteName}
        Email: ${quoteEmail}
        ${quotePhone ? `Teléfono: ${quotePhone}` : ''}

        MENSAJE:
        ${quoteMessage}

        ACCIONES:
        - Ver en panel admin: ${frontendUrl}/admin?tab=cotizaciones
        - Responder al cliente: ${quoteEmail}

        Saludos,
        Sistema TESTheb
      `
    }

    const info = await transporter.sendMail(mailOptions)

    logger.info('Notificación de cotización enviada al admin', {
      quoteId,
      adminEmail,
      messageId: info.messageId
    })

    return {
      success: true,
      messageId: info.messageId
    }

  } catch (error) {
    logger.error('Error enviando notificación de cotización:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Enviar confirmación de cotización al cliente
 */
export const sendQuoteConfirmationEmail = async ({ to, name, quoteId }) => {
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
      subject: `✅ Cotización Recibida #${quoteId} - TESTheb`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Cotización Recibida</title>
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
                        ✅ Cotización Recibida
                      </h1>
                      <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px;">
                        TESTheb - Bordados Personalizados
                      </p>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 24px;">
                        ¡Gracias por tu solicitud!
                      </h2>

                      <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.5;">
                        Hola <strong>${name}</strong>,
                      </p>

                      <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.5;">
                        Hemos recibido tu solicitud de cotización exitosamente. Nuestro equipo la revisará pronto.
                      </p>

                      <!-- Quote ID Box -->
                      <div style="margin: 30px 0; padding: 20px; background-color: #f0fdf4; border-radius: 8px; text-align: center;">
                        <p style="margin: 0 0 10px 0; color: #15803d; font-size: 14px;">
                          Número de Cotización
                        </p>
                        <p style="margin: 0; color: #15803d; font-size: 32px; font-weight: bold;">
                          #${quoteId}
                        </p>
                      </div>

                      <h3 style="margin: 30px 0 15px 0; color: #1f2937; font-size: 18px;">
                        📅 ¿Qué sigue?
                      </h3>

                      <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 15px; line-height: 1.8;">
                        <li>Nuestro equipo revisará tu solicitud</li>
                        <li>Te contactaremos en menos de 24 horas hábiles</li>
                        <li>Recibirás una cotización detallada por email o teléfono</li>
                        <li>Podrás hacer ajustes según tus necesidades</li>
                      </ul>

                      <!-- Info Box -->
                      <div style="margin: 30px 0 0 0; padding: 16px; background-color: #dbeafe; border-left: 4px solid #3b82f6; border-radius: 4px;">
                        <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.5;">
                          💡 <strong>Consejo:</strong> Mientras esperas, puedes explorar nuestro catálogo de productos en <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="color: #1e40af; font-weight: bold;">TESTheb.cl</a>
                        </p>
                      </div>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px;">
                      <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 12px; text-align: center;">
                        Si tienes alguna pregunta, no dudes en contactarnos.
                      </p>
                      <p style="margin: 0; color: #6b7280; font-size: 12px; text-align: center;">
                        © ${new Date().getFullYear()} TESTheb - Bordados Personalizados
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
        ¡Gracias por tu solicitud!

        Hola ${name},

        Hemos recibido tu solicitud de cotización #${quoteId} exitosamente.

        ¿QUÉ SIGUE?
        - Nuestro equipo revisará tu solicitud
        - Te contactaremos en menos de 24 horas hábiles
        - Recibirás una cotización detallada por email o teléfono

        Gracias por confiar en TESTheb.

        Saludos,
        El equipo de TESTheb
      `
    }

    const info = await transporter.sendMail(mailOptions)
    logger.info('Confirmación de cotización enviada al cliente', { to, quoteId, messageId: info.messageId })

    return { success: true, messageId: info.messageId }
  } catch (error) {
    logger.error('Error enviando confirmación de cotización:', error)
    return { success: false, error: error.message }
  }
}

export default {
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendQuoteNotificationEmail,
  sendQuoteConfirmationEmail
}
