import { query } from '../config/database.js'
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
    const existingSubscriber = await query(
      'SELECT id, status FROM newsletter_subscribers WHERE email = $1',
      [email.toLowerCase()]
    )

    if (existingSubscriber.rows.length > 0) {
      const subscriber = existingSubscriber.rows[0]

      // Si estaba desuscrito, reactivar
      if (subscriber.status === 'unsubscribed') {
        await query(
          `UPDATE newsletter_subscribers
           SET status = 'active', subscribed_at = NOW(), unsubscribed_at = NULL, updated_at = NOW()
           WHERE id = $1`,
          [subscriber.id]
        )

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
    const newSubscriber = await query(
      `INSERT INTO newsletter_subscribers (email, status, subscribed_at, created_at, updated_at)
       VALUES ($1, 'active', NOW(), NOW(), NOW())
       RETURNING id, email, subscribed_at`,
      [email.toLowerCase()]
    )

    logger.info('Nuevo suscriptor al newsletter', {
      subscriberId: newSubscriber.rows[0].id,
      email: email.toLowerCase()
    })

    // Enviar email de bienvenida
    const emailResult = await sendNewsletterWelcomeEmail({
      to: newSubscriber.rows[0].email
    })

    if (!emailResult.success) {
      logger.warn('No se pudo enviar email de bienvenida', {
        email: newSubscriber.rows[0].email,
        error: emailResult.error
      })
      // No fallar la suscripción si el email falla
    }

    res.status(201).json({
      success: true,
      message: '¡Gracias por suscribirte! Revisa tu correo para más información.',
      data: {
        email: newSubscriber.rows[0].email,
        subscribedAt: newSubscriber.rows[0].subscribed_at
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
    const subscriber = await query(
      'SELECT id, status FROM newsletter_subscribers WHERE email = $1',
      [email.toLowerCase()]
    )

    if (subscriber.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Este email no está suscrito'
      })
    }

    if (subscriber.rows[0].status === 'unsubscribed') {
      return res.status(400).json({
        success: false,
        message: 'Este email ya está desuscrito'
      })
    }

    // Desuscribir
    await query(
      `UPDATE newsletter_subscribers
       SET status = 'unsubscribed', unsubscribed_at = NOW(), updated_at = NOW()
       WHERE id = $1`,
      [subscriber.rows[0].id]
    )

    logger.info('Suscriptor desuscrito del newsletter', {
      subscriberId: subscriber.rows[0].id,
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

    let queryText = 'SELECT id, email, status, subscribed_at, unsubscribed_at, created_at FROM newsletter_subscribers'
    const params = []

    // Filtrar por estado si se proporciona
    if (status && ['active', 'unsubscribed'].includes(status)) {
      queryText += ' WHERE status = $1'
      params.push(status)
    }

    queryText += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2)
    params.push(parseInt(limit), parseInt(offset))

    const subscribers = await query(queryText, params)

    // Contar total
    const countQuery = status && ['active', 'unsubscribed'].includes(status)
      ? 'SELECT COUNT(*) FROM newsletter_subscribers WHERE status = $1'
      : 'SELECT COUNT(*) FROM newsletter_subscribers'

    const countParams = status && ['active', 'unsubscribed'].includes(status) ? [status] : []
    const countResult = await query(countQuery, countParams)

    res.json({
      success: true,
      data: {
        subscribers: subscribers.rows,
        total: parseInt(countResult.rows[0].count),
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
    const stats = await query(`
      SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active,
        COUNT(CASE WHEN status = 'unsubscribed' THEN 1 END) as unsubscribed,
        COUNT(CASE WHEN subscribed_at >= NOW() - INTERVAL '7 days' THEN 1 END) as last_7_days,
        COUNT(CASE WHEN subscribed_at >= NOW() - INTERVAL '30 days' THEN 1 END) as last_30_days
      FROM newsletter_subscribers
    `)

    res.json({
      success: true,
      data: {
        total: parseInt(stats.rows[0].total),
        active: parseInt(stats.rows[0].active),
        unsubscribed: parseInt(stats.rows[0].unsubscribed),
        last7Days: parseInt(stats.rows[0].last_7_days),
        last30Days: parseInt(stats.rows[0].last_30_days)
      }
    })

  } catch (error) {
    logger.error('Error obteniendo estadísticas de newsletter:', error)
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    })
  }
}
