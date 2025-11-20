import NewsletterSubscriber from '../models/NewsletterSubscriber.js'
import logger from '../config/logger.js'
import { sendNewsletterWelcomeEmail } from '../services/emailService.js'

// Suscribirse al newsletter
export const subscribe = async (req, res) => {
  try {
    const { email } = req.body

    // Validación básica
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email es requerido'
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

    // Verificar si ya está suscrito
    const existingSubscriber = await NewsletterSubscriber.findByEmail(email)

    if (existingSubscriber) {
      // Si estaba desuscrito, reactivar
      if (existingSubscriber.status === 'unsubscribed') {
        await NewsletterSubscriber.reactivate(existingSubscriber.id)

        logger.info('Suscriptor reactivado', { email: email.toLowerCase() })

        // Enviar email de bienvenida
        const emailResult = await sendNewsletterWelcomeEmail({
          to: email.toLowerCase()
        })

        if (!emailResult.success) {
          logger.warn('No se pudo enviar email de reactivación', {
            email: email.toLowerCase(),
            error: emailResult.error
          })
        }

        return res.json({
          success: true,
          message: '¡Bienvenido de nuevo! Revisa tu correo para más información.'
        })
      }

      // Ya está activo
      return res.status(409).json({
        success: false,
        message: 'Este email ya está suscrito a nuestro newsletter'
      })
    }

    // Crear nueva suscripción
    const newSubscriber = await NewsletterSubscriber.create(email)

    logger.info('Nuevo suscriptor al newsletter', {
      subscriberId: newSubscriber.id,
      email: email.toLowerCase()
    })

    // Enviar email de bienvenida
    const emailResult = await sendNewsletterWelcomeEmail({
      to: newSubscriber.email
    })

    if (!emailResult.success) {
      logger.warn('No se pudo enviar email de bienvenida', {
        email: newSubscriber.email,
        error: emailResult.error
      })
      // No fallar la suscripción si el email falla
    }

    res.status(201).json({
      success: true,
      message: '¡Gracias por suscribirte! Revisa tu correo para más información.',
      data: {
        email: newSubscriber.email,
        subscribedAt: newSubscriber.subscribed_at
      }
    })

  } catch (error) {
    logger.error('Error en suscripción al newsletter:', error)
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    })
  }
}

// Desuscribirse del newsletter
export const unsubscribe = async (req, res) => {
  try {
    const { email } = req.body

    // Validación básica
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email es requerido'
      })
    }

    // Buscar suscriptor
    const subscriber = await NewsletterSubscriber.findByEmail(email)

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Este email no está suscrito'
      })
    }

    if (subscriber.status === 'unsubscribed') {
      return res.status(400).json({
        success: false,
        message: 'Este email ya está desuscrito'
      })
    }

    // Desuscribir
    await NewsletterSubscriber.unsubscribe(subscriber.id)

    logger.info('Suscriptor desuscrito del newsletter', {
      subscriberId: subscriber.id,
      email: email.toLowerCase()
    })

    res.json({
      success: true,
      message: 'Te has desuscrito exitosamente del newsletter'
    })

  } catch (error) {
    logger.error('Error en desuscripción del newsletter:', error)
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    })
  }
}

// Obtener todos los suscriptores (solo admin)
export const getAllSubscribers = async (req, res) => {
  try {
    const { status, limit = 100, offset = 0 } = req.query

    const { subscribers, total } = await NewsletterSubscriber.findAll({
      status,
      limit,
      offset
    })

    res.json({
      success: true,
      data: {
        subscribers,
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    })

  } catch (error) {
    logger.error('Error obteniendo suscriptores:', error)
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    })
  }
}

// Obtener estadísticas de suscriptores (solo admin)
export const getSubscriberStats = async (req, res) => {
  try {
    const stats = await NewsletterSubscriber.getStats()

    res.json({
      success: true,
      data: stats
    })

  } catch (error) {
    logger.error('Error obteniendo estadísticas de newsletter:', error)
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    })
  }
}
