import { useEffect, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiDownload, FiHome, FiShoppingBag } from 'react-icons/fi'

// Mapeo de tipos de pago según documentación Transbank
const PAYMENT_TYPES = {
  'VD': 'Débito',
  'VP': 'Prepago',
  'VN': 'Crédito (sin cuotas)',
  'VC': 'Crédito en cuotas',
  'SI': '3 cuotas sin interés',
  'S2': '2 cuotas sin interés',
  'NC': 'N cuotas sin interés'
}

const PaymentResultPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [paymentData, setPaymentData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Extraer parámetros de la URL
    const params = new URLSearchParams(location.search)

    const data = {
      status: params.get('status'),
      buyOrder: params.get('buyOrder'),
      amount: params.get('amount'),
      authorizationCode: params.get('authorizationCode'),
      responseCode: params.get('responseCode'),
      paymentTypeCode: params.get('paymentTypeCode'),
      installmentsNumber: params.get('installmentsNumber'),
      cardNumber: params.get('cardNumber'),
      message: params.get('message')
    }

    setPaymentData(data)
    setLoading(false)

    // Limpiar carrito si el pago fue exitoso
    if (data.status === 'authorized') {
      // Aquí podrías integrar con tu contexto de carrito
      localStorage.removeItem('cart')

      // Opcional: También limpiar otros datos relacionados con la compra
      localStorage.removeItem('shippingData')
      localStorage.removeItem('checkoutData')
    }
  }, [location])

  const getStatusConfig = () => {
    if (!paymentData) return { icon: FiAlertCircle, color: 'gray', title: 'Cargando...', message: '' }

    switch (paymentData.status) {
      case 'authorized':
        return {
          icon: FiCheckCircle,
          color: 'green',
          title: '¡Pago Autorizado!',
          message: 'Tu pago ha sido procesado exitosamente'
        }
      case 'aborted':
        return {
          icon: FiXCircle,
          color: 'yellow',
          title: 'Pago Cancelado',
          message: 'El pago fue cancelado por el usuario'
        }
      case 'rejected':
        return {
          icon: FiXCircle,
          color: 'red',
          title: 'Pago Rechazado',
          message: 'El pago fue rechazado por el banco'
        }
      case 'error':
        return {
          icon: FiAlertCircle,
          color: 'red',
          title: 'Error en el Pago',
          message: paymentData.message || 'Ocurrió un error procesando el pago'
        }
      default:
        return {
          icon: FiAlertCircle,
          color: 'gray',
          title: 'Estado Desconocido',
          message: 'No se pudo determinar el estado del pago'
        }
    }
  }

  const formatAmount = (amount) => {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDateTime = () => {
    return new Date().toLocaleString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const downloadVoucher = () => {
    if (!paymentData) return

    const voucherContent = `
COMPROBANTE DE PAGO - TESTheb
==============================

Fecha: ${formatDateTime()}
Estado: ${getStatusConfig().title}
Orden de Compra: ${paymentData.buyOrder || 'N/A'}
Monto: ${formatAmount(paymentData.amount)}

${paymentData.status === 'authorized' ? `
DETALLES DE AUTORIZACIÓN:
--------------------------
Código de Autorización: ${paymentData.authorizationCode || 'N/A'}
Código de Respuesta: ${paymentData.responseCode || 'N/A'}
Tipo de Pago: ${PAYMENT_TYPES[paymentData.paymentTypeCode] || paymentData.paymentTypeCode || 'N/A'}
Número de Cuotas: ${paymentData.installmentsNumber || '1'}
Tarjeta: ****${paymentData.cardNumber?.slice(-4) || 'N/A'}
` : ''}

Gracias por tu compra en TESTheb - Bordados de Calidad

Para consultas: contacto@testheb.cl
==============================
    `.trim()

    const blob = new Blob([voucherContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `comprobante-${paymentData.buyOrder || 'pago'}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const statusConfig = getStatusConfig()
  const StatusIcon = statusConfig.icon

  return (
    <div className="min-h-screen bg-gray-900 pt-40 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 rounded-lg shadow-xl p-8"
        >
          {/* Estado del pago */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                statusConfig.color === 'green' ? 'bg-green-100 text-green-600' :
                statusConfig.color === 'red' ? 'bg-red-100 text-red-600' :
                statusConfig.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                'bg-gray-100 text-gray-600'
              }`}
            >
              <StatusIcon size={40} />
            </motion.div>

            <h1 className={`text-3xl font-bold mb-2 ${
              statusConfig.color === 'green' ? 'text-green-400' :
              statusConfig.color === 'red' ? 'text-red-400' :
              statusConfig.color === 'yellow' ? 'text-yellow-400' :
              'text-gray-400'
            }`}>
              {statusConfig.title}
            </h1>

            <p className="text-gray-300 text-lg">
              {statusConfig.message}
            </p>
          </div>

          {/* Detalles del pago */}
          {paymentData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-700 rounded-lg p-6 mb-6"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Detalles de la Transacción</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Orden de Compra:</span>
                  <p className="text-white font-medium">{paymentData.buyOrder || 'N/A'}</p>
                </div>

                <div>
                  <span className="text-gray-400">Monto:</span>
                  <p className="text-white font-medium text-lg">{formatAmount(paymentData.amount)}</p>
                </div>

                <div>
                  <span className="text-gray-400">Fecha y Hora:</span>
                  <p className="text-white font-medium">{formatDateTime()}</p>
                </div>

                <div>
                  <span className="text-gray-400">Estado:</span>
                  <p className={`font-medium ${
                    statusConfig.color === 'green' ? 'text-green-400' :
                    statusConfig.color === 'red' ? 'text-red-400' :
                    statusConfig.color === 'yellow' ? 'text-yellow-400' :
                    'text-gray-400'
                  }`}>
                    {statusConfig.title}
                  </p>
                </div>

                {/* Detalles adicionales solo para pagos autorizados */}
                {paymentData.status === 'authorized' && (
                  <>
                    <div>
                      <span className="text-gray-400">Código de Autorización:</span>
                      <p className="text-white font-medium">{paymentData.authorizationCode || 'N/A'}</p>
                    </div>

                    <div>
                      <span className="text-gray-400">Tipo de Pago:</span>
                      <p className="text-white font-medium">
                        {PAYMENT_TYPES[paymentData.paymentTypeCode] || paymentData.paymentTypeCode || 'N/A'}
                      </p>
                    </div>

                    {paymentData.installmentsNumber && paymentData.installmentsNumber > 1 && (
                      <div>
                        <span className="text-gray-400">Cuotas:</span>
                        <p className="text-white font-medium">{paymentData.installmentsNumber}</p>
                      </div>
                    )}

                    {paymentData.cardNumber && (
                      <div>
                        <span className="text-gray-400">Tarjeta:</span>
                        <p className="text-white font-medium">****{paymentData.cardNumber.slice(-4)}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* Acciones */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            {paymentData?.status === 'authorized' && (
              <button
                onClick={downloadVoucher}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                <FiDownload size={20} />
                Descargar Comprobante
              </button>
            )}

            <Link
              to="/"
              className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <FiHome size={20} />
              Volver al Inicio
            </Link>

            <Link
              to="/catalog"
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <FiShoppingBag size={20} />
              Seguir Comprando
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default PaymentResultPage