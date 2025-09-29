import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { HiTrash, HiPlus, HiMinus } from 'react-icons/hi'

const CartPage = () => {
  const navigate = useNavigate()
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotals } = useCart()
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const { totalItems, totalPrice } = getCartTotals()

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price)
  }

  const handleQuantityChange = (productId, newQuantity) => {
    const quantity = parseInt(newQuantity) || 1
    if (quantity >= 1) {
      updateQuantity(productId, quantity)
    }
  }

  const handleClearCart = () => {
    clearCart()
    setShowClearConfirm(false)
  }

  const handleCheckout = () => {
    navigate('/checkout')
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
              Agrega productos a tu carrito para continuar con tu compra
            </p>
            <Link
              to="/catalog"
              className="inline-block px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg transition-all duration-300 hover:-translate-y-1 shadow-lg"
            >
              Explorar Productos
            </Link>
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
            Carrito de Compras
          </h1>
          <p className="text-text-secondary text-lg">
            {totalItems} {totalItems === 1 ? 'producto' : 'productos'} en tu carrito
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-bg-primary/80 border-2 border-gray-500/30 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Productos</h2>
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors duration-300"
                >
                  Vaciar carrito
                </button>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      className="flex items-center gap-4 p-4 bg-bg-secondary/60 rounded-lg border border-gray-500/20"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      layout
                    >
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl">
                            📷
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold line-clamp-2">
                          {item.name}
                        </h3>
                        <p className="text-text-muted text-sm">
                          {item.category_name}
                        </p>
                        <p className="text-yellow-400 font-bold">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleQuantityChange(item.id, (parseInt(item.quantity) || 1) - 1)}
                          className="w-8 h-8 bg-gray-600 hover:bg-gray-500 text-white rounded-full flex items-center justify-center transition-colors duration-300"
                          disabled={(parseInt(item.quantity) || 1) <= 1}
                        >
                          <HiMinus className="w-4 h-4" />
                        </button>

                        <span className="text-white font-semibold w-8 text-center">
                          {parseInt(item.quantity) || 1}
                        </span>

                        <button
                          onClick={() => handleQuantityChange(item.id, (parseInt(item.quantity) || 1) + 1)}
                          className="w-8 h-8 bg-yellow-500 hover:bg-yellow-400 text-black rounded-full flex items-center justify-center transition-colors duration-300"
                          disabled={(parseInt(item.quantity) || 1) >= (parseInt(item.stock) || 999)}
                        >
                          <HiPlus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-8 h-8 bg-red-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-colors duration-300"
                      >
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
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
              <h2 className="text-xl font-bold text-white mb-6">Resumen del Pedido</h2>

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

              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg transition-all duration-300 hover:-translate-y-1 shadow-lg"
                >
                  Proceder al Checkout
                </button>

                <Link
                  to="/catalog"
                  className="block w-full py-3 bg-transparent border-2 border-gray-500/30 hover:border-yellow-400 text-white text-center font-semibold rounded-lg transition-all duration-300 hover:-translate-y-1"
                >
                  Seguir Comprando
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Clear Cart Confirmation Modal */}
        <AnimatePresence>
          {showClearConfirm && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-bg-primary border-2 border-gray-500/30 rounded-xl p-6 max-w-md w-full"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <h3 className="text-xl font-bold text-white mb-4">¿Vaciar carrito?</h3>
                <p className="text-text-secondary mb-6">
                  Esta acción eliminará todos los productos de tu carrito. ¿Estás seguro?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 py-2 px-4 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors duration-300"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleClearCart}
                    className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors duration-300"
                  >
                    Vaciar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default CartPage