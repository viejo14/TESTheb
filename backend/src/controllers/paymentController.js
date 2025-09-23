import { webpayPlus } from '../config/transbank.js'

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