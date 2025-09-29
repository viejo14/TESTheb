import pkg from 'transbank-sdk'
const { WebpayPlus, Options, IntegrationCommerceCodes, IntegrationApiKeys, Environment } = pkg
import { query } from '../config/database.js'
import { catchAsync } from '../middleware/errorHandler.js'
import { AppError } from '../middleware/errorHandler.js'
import logger from '../config/logger.js'

// Configuración de Transbank según el ambiente
const getWebpayConfig = () => {
  const environment = process.env.WEBPAY_ENVIRONMENT || 'integration'

  if (environment === 'production') {
    // Configuración para producción
    const commerceCode = process.env.TBK_COMMERCE_CODE
    const apiKey = process.env.TBK_API_KEY

    if (!commerceCode || !apiKey) {
      throw new Error('TBK_COMMERCE_CODE y TBK_API_KEY son requeridos para producción')
    }

    logger.info('🏪 WebPay configurado para PRODUCCIÓN')
    return new WebpayPlus.Transaction(new Options(commerceCode, apiKey, Environment.Production))
  } else {
    // Configuración para integración (testing)
    logger.info('🧪 WebPay configurado para INTEGRACIÓN (testing)')
    return new WebpayPlus.Transaction(new Options(
      IntegrationCommerceCodes.WEBPAY_PLUS,
      IntegrationApiKeys.WEBPAY,
      Environment.Integration
    ))
  }
}

// URLs base para redirecciones
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000'
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

// Crear nueva transacción WebPay
export const createTransaction = catchAsync(async (req, res) => {
  const { amount, sessionId, returnUrl, orderData = {} } = req.body

  // Validaciones básicas
  if (!amount || amount <= 0) {
    throw new AppError('El monto debe ser mayor a 0', 400)
  }

  if (!sessionId) {
    throw new AppError('Session ID es requerido', 400)
  }

  // Sanitizar monto (debe ser entero para CLP)
  const sanitizedAmount = Math.round(Number(amount))

  // Generar orden única
  const buyOrder = `O-${Date.now()}`

  // URL de retorno al backend
  const webpayReturnUrl = `${BACKEND_URL}/api/webpay/commit`

  try {
    // Configurar WebPay
    const transaction = getWebpayConfig()

    // Crear transacción en Transbank
    const response = await transaction.create(buyOrder, sessionId, sanitizedAmount, webpayReturnUrl)

    logger.info('💳 Transacción WebPay creada', {
      buyOrder,
      amount: sanitizedAmount,
      token: response.token,
      url: response.url
    })

    // Guardar orden en base de datos usando tabla existente
    try {
      const customerInfo = orderData.customerInfo || {}
      const cartItems = orderData.cartItems || []

      await query(`
        INSERT INTO orders (
          buy_order,
          session_id,
          amount,
          total,
          status,
          token_ws,
          items,
          customer_name,
          customer_email,
          customer_phone,
          shipping_address,
          shipping_city,
          created_at,
          updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
      `, [
        buyOrder,
        sessionId,
        sanitizedAmount,
        sanitizedAmount, // total = amount for WebPay
        'created',
        response.token,
        JSON.stringify(cartItems),
        customerInfo.name || '',
        customerInfo.email || '',
        customerInfo.phone || '',
        customerInfo.address || '',
        customerInfo.city || ''
      ])

      logger.info('💾 Orden guardada en base de datos', { buyOrder })
    } catch (dbError) {
      logger.error('❌ Error guardando orden en DB (continuando):', dbError)
      // Continuamos aunque falle la DB - la transacción ya está creada en Transbank
    }

    res.json({
      success: true,
      message: 'Transacción creada exitosamente',
      data: {
        token: response.token,
        url: response.url,
        buyOrder,
        amount: sanitizedAmount
      }
    })

  } catch (error) {
    logger.error('❌ Error creando transacción WebPay:', error)
    throw new AppError('Error al crear la transacción de pago', 500)
  }
})

// Confirmar transacción WebPay (callback de Transbank)
export const commitTransaction = catchAsync(async (req, res) => {
  // Transbank puede enviar datos via POST o GET
  const { token_ws, TBK_TOKEN, TBK_ORDEN_COMPRA } = { ...req.body, ...req.query }

  logger.info('🔄 Callback WebPay recibido', {
    method: req.method,
    token_ws,
    TBK_TOKEN,
    TBK_ORDEN_COMPRA,
    body: req.body,
    query: req.query
  })

  try {
    let redirectUrl = `${FRONTEND_URL}/payment-result`
    let status = 'unknown'
    let transactionData = {}

    if (TBK_TOKEN && TBK_ORDEN_COMPRA) {
      // Pago cancelado por el usuario
      status = 'aborted'
      logger.info('❌ Pago cancelado por usuario', { TBK_TOKEN, TBK_ORDEN_COMPRA })

      redirectUrl += `?status=aborted&buyOrder=${TBK_ORDEN_COMPRA}`

      // Actualizar orden en DB
      try {
        await query(`
          UPDATE orders
          SET status = $1, updated_at = NOW(), result_json = $2
          WHERE buy_order = $3
        `, ['aborted', JSON.stringify({ TBK_TOKEN, TBK_ORDEN_COMPRA }), TBK_ORDEN_COMPRA])
      } catch (dbError) {
        logger.error('❌ Error actualizando orden cancelada en DB:', dbError)
      }

    } else if (token_ws) {
      // Confirmar transacción con Transbank
      const transaction = getWebpayConfig()

      try {
        const response = await transaction.commit(token_ws)

        logger.info('✅ Respuesta de confirmación WebPay', {
          status: response.status,
          buyOrder: response.buy_order,
          amount: response.amount,
          authorizationCode: response.authorization_code,
          responseCode: response.response_code
        })

        transactionData = response

        // Determinar estado según respuesta
        if (response.status === 'AUTHORIZED' || response.response_code === 0) {
          status = 'authorized'
        } else {
          status = 'rejected'
        }

        // Construir URL de redirección con parámetros
        const params = new URLSearchParams({
          status,
          buyOrder: response.buy_order,
          amount: response.amount.toString(),
          authorizationCode: response.authorization_code || '',
          responseCode: response.response_code?.toString() || '',
          paymentTypeCode: response.payment_type_code || '',
          installmentsNumber: response.installments_number?.toString() || '0',
          cardNumber: response.card_detail?.card_number || ''
        })

        redirectUrl += `?${params.toString()}`

        // Actualizar orden en DB con datos completos de WebPay
        try {
          await query(`
            UPDATE orders
            SET status = $1, updated_at = NOW(), result_json = $2,
                authorization_code = $3, response_code = $4,
                payment_type_code = $5, card_last4 = $6, installments_number = $7
            WHERE buy_order = $8
          `, [
            status,
            JSON.stringify(response),
            response.authorization_code,
            response.response_code,
            response.payment_type_code,
            response.card_detail?.card_number || null,
            response.installments_number || 0,
            response.buy_order
          ])

          logger.info('💾 Orden actualizada en DB', { buyOrder: response.buy_order, status })
        } catch (dbError) {
          logger.error('❌ Error actualizando orden en DB:', dbError)
        }

      } catch (commitError) {
        logger.error('❌ Error confirmando transacción:', commitError)
        status = 'error'
        redirectUrl += '?status=error&message=Error confirmando pago'
      }

    } else {
      // Sin parámetros válidos
      logger.error('❌ Callback sin parámetros válidos')
      status = 'error'
      redirectUrl += '?status=error&message=Parámetros inválidos'
    }

    logger.info('🔄 Redirigiendo a frontend', { redirectUrl, status })

    // Redireccionar al frontend con los resultados
    res.redirect(redirectUrl)

  } catch (error) {
    logger.error('❌ Error en callback WebPay:', error)
    res.redirect(`${FRONTEND_URL}/payment-result?status=error&message=Error procesando pago`)
  }
})

// Obtener estado de una orden
export const getOrderStatus = catchAsync(async (req, res) => {
  const { buyOrder } = req.params

  if (!buyOrder) {
    throw new AppError('Buy Order es requerido', 400)
  }

  const result = await query(
    'SELECT * FROM orders WHERE buy_order = $1',
    [buyOrder]
  )

  if (result.rows.length === 0) {
    throw new AppError('Orden no encontrada', 404)
  }

  const order = result.rows[0]

  res.json({
    success: true,
    message: 'Estado de orden obtenido',
    data: {
      buyOrder: order.buy_order,
      sessionId: order.session_id,
      amount: order.amount,
      total: order.total,
      status: order.status,
      authorizationCode: order.authorization_code,
      responseCode: order.response_code,
      paymentTypeCode: order.payment_type_code,
      cardLast4: order.card_last4,
      installmentsNumber: order.installments_number,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      items: order.items,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      resultData: order.result_json
    }
  })
})