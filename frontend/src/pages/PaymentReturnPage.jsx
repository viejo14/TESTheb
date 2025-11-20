import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { HiCheckCircle, HiXCircle, HiRefresh, HiHome, HiShoppingBag } from 'react-icons/hi'

const PaymentReturnPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { clearCart } = useCart()

  const [paymentStatus, setPaymentStatus] = useState('loading')
  const [paymentData, setPaymentData] = useState(null)
  const [orderInfo, setOrderInfo] = useState(null)

  const token = searchParams.get('token_ws')

  useEffect(() => {
    const handlePaymentReturn = async () => {
      if (!token) {
        setPaymentStatus('error')
        return
      }

      try {
        // Cargar información de la orden desde localStorage
        const savedOrder = localStorage.getItem('testheb_current_order')
        if (savedOrder) {
          setOrderInfo(JSON.parse(savedOrder))
        }

        // Confirmar la transacción con el backend
        const response = await fetch('/api/payments/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            token_ws: token
          })
        })

        const data = await response.json()

        if (data.success && data.data.status === 'AUTHORIZED') {
          setPaymentStatus('success')
          setPaymentData(data.data)

          // Limpiar el carrito solo si el pago fue exitoso
          clearCart()

          // Limpiar información temporal
          localStorage.removeItem('testheb_current_order')
        } else {
          setPaymentStatus('failed')
          setPaymentData(data.data || {})
        }
      } catch (error) {
        console.error('❌ Error confirmando pago:', error)
        setPaymentStatus('error')
      }
    }

    handlePaymentReturn()
  }, [token, clearCart])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCardNumber = (cardDetail) => {
    if (!cardDetail || !cardDetail.card_number) return 'N/A'
    return `**** **** **** ${cardDetail.card_number}`
  }

  if (paymentStatus === 'loading') {
    return (
      <div className="min-h-screen pt-40 pb-8 bg-gradient-to-br from-bg-primary to-bg-secondary">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-block"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <HiRefresh className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Procesando tu pago...
            </h1>
            <p className="text-text-secondary text-lg max-w-md mx-auto">
              Por favor espera mientras confirmamos tu transacción con Transbank
            </p>
          </motion.div>
        </div>
      </div>
    )
  }

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen pt-40 pb-8 bg-gradient-to-br from-bg-primary to-bg-secondary">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            className="text-center py-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="text-6xl mb-6 text-green-400"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <HiCheckCircle className="w-20 h-20 mx-auto" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ¡Pago Exitoso!
            </h1>
            <p className="text-text-secondary text-lg mb-8 max-w-md mx-auto">
              Tu compra ha sido procesada correctamente. Recibirás un email de confirmación pronto.
            </p>
          </motion.div>

          {/* Payment Details */}
          <motion.div
            className="bg-bg-primary/80 border-2 border-green-500/30 rounded-xl p-6 backdrop-blur-sm mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <HiCheckCircle className="w-6 h-6 text-green-400" />
              Detalles de la Transacción
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <span className="text-text-secondary text-sm">Número de Orden</span>
                  <p className="text-white font-semibold">{paymentData?.buyOrder || orderInfo?.buyOrder || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-text-secondary text-sm">Monto Pagado</span>
                  <p className="text-green-400 font-bold text-xl">
                    {formatPrice(paymentData?.amount || orderInfo?.amount || 0)}
                  </p>
                </div>
                <div>
                  <span className="text-text-secondary text-sm">Código de Autorización</span>
                  <p className="text-white font-semibold">{paymentData?.authorizationCode || 'N/A'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-text-secondary text-sm">Fecha de Transacción</span>
                  <p className="text-white font-semibold">{formatDate(paymentData?.transactionDate)}</p>
                </div>
                <div>
                  <span className="text-text-secondary text-sm">Tarjeta Utilizada</span>
                  <p className="text-white font-semibold">{formatCardNumber(paymentData?.cardDetail)}</p>
                </div>
                <div>
                  <span className="text-text-secondary text-sm">Estado</span>
                  <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
                    Autorizada
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Customer Information */}
          {orderInfo?.customerInfo && (
            <motion.div
              className="bg-bg-primary/80 border-2 border-gray-500/30 rounded-xl p-6 backdrop-blur-sm mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h3 className="text-lg font-bold text-white mb-4">Información de Envío</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-text-secondary">Nombre:</span>
                  <span className="text-white ml-2">{orderInfo.customerInfo.name}</span>
                </div>
                <div>
                  <span className="text-text-secondary">Email:</span>
                  <span className="text-white ml-2">{orderInfo.customerInfo.email}</span>
                </div>
                <div>
                  <span className="text-text-secondary">Teléfono:</span>
                  <span className="text-white ml-2">{orderInfo.customerInfo.phone}</span>
                </div>
                <div>
                  <span className="text-text-secondary">Ciudad:</span>
                  <span className="text-white ml-2">{orderInfo.customerInfo.city}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-text-secondary">Dirección:</span>
                  <span className="text-white ml-2">{orderInfo.customerInfo.address}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg transition-all duration-300 hover:-translate-y-1 shadow-lg flex items-center justify-center gap-2"
            >
              <HiHome className="w-5 h-5" />
              Volver al Inicio
            </button>
            <button
              onClick={() => navigate('/catalog')}
              className="px-8 py-3 bg-transparent border-2 border-gray-500/30 hover:border-yellow-400 text-white font-semibold rounded-lg transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <HiShoppingBag className="w-5 h-5" />
              Seguir Comprando
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  // Error or Failed Payment
  return (
    <div className="min-h-screen pt-40 pb-8 bg-gradient-to-br from-bg-primary to-bg-secondary">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="text-6xl mb-6 text-red-400"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <HiXCircle className="w-20 h-20 mx-auto" />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {paymentStatus === 'failed' ? 'Pago Rechazado' : 'Error en el Pago'}
          </h1>
          <p className="text-text-secondary text-lg mb-8 max-w-md mx-auto">
            {paymentStatus === 'failed'
              ? 'Tu transacción no pudo ser procesada. Por favor intenta nuevamente.'
              : 'Ocurrió un error al procesar tu pago. Por favor intenta nuevamente.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/cart')}
              className="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg transition-all duration-300 hover:-translate-y-1 shadow-lg"
            >
              Volver al Carrito
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-transparent border-2 border-gray-500/30 hover:border-yellow-400 text-white font-semibold rounded-lg transition-all duration-300 hover:-translate-y-1"
            >
              Volver al Inicio
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default PaymentReturnPage