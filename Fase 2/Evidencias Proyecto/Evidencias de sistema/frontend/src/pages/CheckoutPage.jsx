import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { HiCreditCard, HiUser, HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi'
import { postRedirect } from '../utils/postRedirect'

const CheckoutPage = () => {
  const navigate = useNavigate()
  const { cartItems, getCartTotals, clearCart } = useCart()
  const { totalItems, totalPrice } = getCartTotals()

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price)
  }

  const validateForm = () => {
    const newErrors = {}

    if (!customerInfo.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }

    if (!customerInfo.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido'
    }

    if (!customerInfo.address.trim()) {
      newErrors.address = 'La dirección es requerida'
    }

    if (!customerInfo.city.trim()) {
      newErrors.city = 'La ciudad es requerida'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }))

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleCheckout = async () => {
    if (!validateForm()) return

    if (cartItems.length === 0) {
      alert('Tu carrito está vacío')
      return
    }

    setIsLoading(true)

    try {
      // Calcular el monto total en formato entero (sin decimales para CLP)
      const sanitizedAmount = Math.round(totalPrice)

      // Generar sessionId único
      const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      // Datos de la orden para guardar con la transacción
      const orderData = {
        cartItems,
        customerInfo,
        totalItems,
        originalAmount: totalPrice
      }

      const response = await fetch('/api/webpay/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: sanitizedAmount,
          sessionId,
          returnUrl: window.location.origin + '/payment-result',
          orderData
        })
      })

      const data = await response.json()

      if (data.success) {
        //console.log('🎯 Transacción WebPay creada exitosamente:', data)

        // Guardar información de la orden en localStorage para referencia
        localStorage.setItem('testheb_current_order', JSON.stringify({
          token: data.data.token,
          buyOrder: data.data.buyOrder,
          amount: data.data.amount,
          sessionId,
          customerInfo,
          cartItems,
          createdAt: new Date().toISOString()
        }))

        // Usar postRedirect para evitar pantalla en blanco
        postRedirect(data.data.url, {
          token_ws: data.data.token
        })
      } else {
        console.error('Error creando transacción WebPay:', data.message || 'Error desconocido')
        alert(data.message || 'Error al procesar el checkout')
      }
    } catch (error) {
      console.error('❌ Error de conexión:', error)
      alert('Error de conexión. Por favor intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  if (cartItems.length === 0) {
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
              className="text-6xl mb-6 text-yellow-400"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              🛒
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Tu carrito está vacío
            </h1>
            <p className="text-text-secondary text-lg mb-8 max-w-md mx-auto">
              Agrega productos a tu carrito antes de proceder al checkout
            </p>
            <button
              onClick={() => navigate('/catalog')}
              className="inline-block px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg transition-all duration-300 hover:-translate-y-1 shadow-lg"
            >
              Explorar Productos
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-40 pb-8 bg-gradient-to-br from-bg-primary to-bg-secondary">
      <div className="max-w-6xl mx-auto px-4">
        {/* Page Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Finalizar Compra
          </h1>
          <p className="text-text-secondary text-lg">
            Completa tu información para proceder al pago
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer Information Form */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-bg-primary/80 border-2 border-gray-500/30 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <HiUser className="w-6 h-6 text-yellow-400" />
                Información Personal
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-text-secondary text-sm font-medium mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-3 bg-bg-secondary/60 border rounded-lg text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 ${errors.name ? 'border-red-500' : 'border-gray-500/30'}`}
                    placeholder="Tu nombre completo"
                  />
                  {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-text-secondary text-sm font-medium mb-2">
                    <HiMail className="inline w-4 h-4 mr-1" />
                    Email *
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 bg-bg-secondary/60 border rounded-lg text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 ${errors.email ? 'border-red-500' : 'border-gray-500/30'}`}
                    placeholder="tu@email.com"
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-text-secondary text-sm font-medium mb-2">
                    <HiPhone className="inline w-4 h-4 mr-1" />
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-4 py-3 bg-bg-secondary/60 border rounded-lg text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 ${errors.phone ? 'border-red-500' : 'border-gray-500/30'}`}
                    placeholder="+56 9 1234 5678"
                  />
                  {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-text-secondary text-sm font-medium mb-2">
                    <HiLocationMarker className="inline w-4 h-4 mr-1" />
                    Dirección *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`w-full px-4 py-3 bg-bg-secondary/60 border rounded-lg text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 ${errors.address ? 'border-red-500' : 'border-gray-500/30'}`}
                    placeholder="Tu dirección completa"
                  />
                  {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-text-secondary text-sm font-medium mb-2">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className={`w-full px-4 py-3 bg-bg-secondary/60 border rounded-lg text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 ${errors.city ? 'border-red-500' : 'border-gray-500/30'}`}
                    placeholder="Tu ciudad"
                  />
                  {errors.city && <p className="text-red-400 text-sm mt-1">{errors.city}</p>}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-bg-primary/80 border-2 border-gray-500/30 rounded-xl p-6 backdrop-blur-sm sticky top-40">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <HiCreditCard className="w-6 h-6 text-yellow-400" />
                Resumen del Pedido
              </h2>

              {/* Cart Items Summary */}
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-bg-secondary/40 rounded-lg">
                    <div className="w-12 h-12 bg-white rounded-lg overflow-hidden flex-shrink-0">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          📷
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white text-sm font-medium line-clamp-1">
                        {item.name}
                      </h4>
                      {item.sku && (
                        <p className="text-gray-400 text-xs font-mono">
                          SKU: {item.sku}
                        </p>
                      )}
                      <p className="text-text-muted text-xs">
                        {item.quantity} x {formatPrice(item.price)}
                      </p>
                    </div>
                    <span className="text-yellow-400 font-semibold text-sm">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Productos ({totalItems})</span>
                  <span className="text-white font-semibold">{formatPrice(totalPrice)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Envío</span>
                  <span className="text-green-400 font-semibold">Gratis</span>
                </div>

                <div className="border-t border-gray-500/30 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold text-lg">Total</span>
                    <span className="text-yellow-400 font-bold text-xl">{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-all duration-300 hover:-translate-y-1 shadow-lg flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <HiCreditCard className="w-5 h-5" />
                      Pagar con Transbank
                    </>
                  )}
                </button>

                <button
                  onClick={() => navigate('/cart')}
                  className="w-full py-3 bg-transparent border-2 border-gray-500/30 hover:border-yellow-400 text-white font-semibold rounded-lg transition-all duration-300 hover:-translate-y-1"
                >
                  Volver al Carrito
                </button>
              </div>

              <div className="mt-4 text-center">
                <p className="text-text-muted text-xs">
                  Pago seguro con Transbank WebPay Plus
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage