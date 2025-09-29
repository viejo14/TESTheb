import { webpayPlus } from '../config/transbank.js'
import crypto from 'crypto'

// Crear transacción de pago
export const createTransaction = async (req, res) => {
  try {
    const { amount, sessionId, buyOrder, returnUrl } = req.body

    // Validar datos requeridos
    if (!amount || !sessionId || !buyOrder || !returnUrl) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos requeridos: amount, sessionId, buyOrder, returnUrl'
      })
    }

    // Crear transacción en Transbank
    const response = await webpayPlus.create(buyOrder, sessionId, amount, returnUrl)

    res.json({
      success: true,
      message: 'Transacción creada exitosamente',
      data: {
        token: response.token,
        url: response.url
      }
    })

  } catch (error) {
    console.error('❌ Error creando transacción:', error)
    res.status(500).json({
      success: false,
      message: 'Error creando transacción',
      error: error.message
    })
  }
}

// Confirmar transacción después del pago
export const confirmTransaction = async (req, res) => {
  try {
    const { token_ws } = req.body || req.query

    if (!token_ws) {
      return res.status(400).json({
        success: false,
        message: 'Token de transacción requerido'
      })
    }

    // Confirmar transacción en Transbank
    const response = await webpayPlus.commit(token_ws)

    // Verificar el estado de la transacción
    if (response.status === 'AUTHORIZED') {
      res.json({
        success: true,
        message: 'Pago autorizado exitosamente',
        data: {
          authorizationCode: response.authorization_code,
          amount: response.amount,
          buyOrder: response.buy_order,
          cardDetail: response.card_detail,
          transactionDate: response.transaction_date,
          status: response.status
        }
      })
    } else {
      res.status(400).json({
        success: false,
        message: 'Transacción no autorizada',
        data: response
      })
    }

  } catch (error) {
    console.error('❌ Error confirmando transacción:', error)
    res.status(500).json({
      success: false,
      message: 'Error confirmando transacción',
      error: error.message
    })
  }
}

// Obtener estado de transacción
export const getTransactionStatus = async (req, res) => {
  try {
    const { token } = req.params

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token de transacción requerido'
      })
    }

    const response = await webpayPlus.status(token)

    res.json({
      success: true,
      message: 'Estado de transacción obtenido',
      data: response
    })

  } catch (error) {
    console.error('❌ Error obteniendo estado:', error)
    res.status(500).json({
      success: false,
      message: 'Error obteniendo estado de transacción',
      error: error.message
    })
  }
}

// Crear checkout para carrito
export const createCheckout = async (req, res) => {
  try {
    const { cartItems, customerInfo } = req.body

    // Validar datos requeridos
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El carrito no puede estar vacío'
      })
    }

    if (!customerInfo || !customerInfo.email || !customerInfo.name) {
      return res.status(400).json({
        success: false,
        message: 'Información del cliente requerida (nombre y email)'
      })
    }

    // Calcular total del carrito
    const totalAmount = cartItems.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0
      const quantity = parseInt(item.quantity) || 0
      return sum + (price * quantity)
    }, 0)

    if (totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El monto total debe ser mayor a 0'
      })
    }

    // Generar ID único para la orden (máximo 26 caracteres para Transbank)
    const timestamp = Date.now().toString().slice(-8) // Últimos 8 dígitos del timestamp
    const randomId = crypto.randomBytes(3).toString('hex').toUpperCase() // 6 caracteres hex
    const buyOrder = `ORD${timestamp}${randomId}` // ORD + 8 + 6 = 17 caracteres
    const sessionId = `SES_${customerInfo.email.split('@')[0]}_${timestamp}`

    // URLs de retorno (ajustar según tu dominio)
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5175'
    const returnUrl = `${baseUrl}/payment/return`

    // Crear transacción en Transbank
    const response = await webpayPlus.create(
      buyOrder,
      sessionId,
      Math.round(totalAmount), // Transbank requiere enteros
      returnUrl
    )

    // Guardar información de la orden (opcional - podrías guardarlo en BD)
    console.log('💳 Checkout creado:', {
      buyOrder,
      sessionId,
      amount: totalAmount,
      customerInfo,
      cartItems: cartItems.length
    })

    res.json({
      success: true,
      message: 'Checkout creado exitosamente',
      data: {
        token: response.token,
        url: response.url,
        buyOrder,
        amount: totalAmount,
        cartSummary: {
          totalItems: cartItems.length,
          totalProducts: cartItems.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0)
        }
      }
    })

  } catch (error) {
    console.error('❌ Error creando checkout:', error)
    res.status(500).json({
      success: false,
      message: 'Error creando checkout',
      error: error.message
    })
  }
}