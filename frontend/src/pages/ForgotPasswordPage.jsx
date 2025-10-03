import { useState } from 'react'
import { motion } from 'framer-motion'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email) {
      setError('Por favor, ingresa tu correo electrónico')
      return
    }

    setLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.success) {
        setMessage(data.message)
        setSubmitted(true)
      } else {
        setError(data.message || 'Error al procesar la solicitud')
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      setError('Error de conexión. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-40 pb-8 bg-gradient-to-br from-bg-primary to-bg-secondary">
      <div className="max-w-md mx-auto px-4">
        <motion.div
          className="bg-bg-primary/80 border-2 border-gray-500/30 rounded-xl p-8 backdrop-blur-sm"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-2xl font-bold text-white mb-2">
              Recuperar Contraseña
            </h1>
            <p className="text-gray-400">
              Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña
            </p>
          </motion.div>

          {!submitted ? (
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Email */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError('')
                  }}
                  placeholder="tu@email.com"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition-colors duration-300"
                  required
                  disabled={loading}
                />
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  className="p-4 bg-red-500/20 border border-red-500 rounded-lg"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-red-400 text-sm">{error}</p>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                className="w-full px-6 py-3 bg-yellow-400 text-bg-primary rounded-lg hover:bg-yellow-300 transition-colors duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-bg-primary border-t-transparent rounded-full animate-spin"></div>
                    Enviando...
                  </div>
                ) : (
                  '📧 Enviar Enlace de Recuperación'
                )}
              </motion.button>
            </motion.form>
          ) : (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Success Message */}
              <div className="p-4 bg-green-500/20 border border-green-500 rounded-lg">
                <p className="text-green-400 text-sm">{message}</p>
              </div>

              <div className="text-center text-gray-400 text-sm">
                <p className="mb-4">
                  Si el correo existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña.
                </p>
                <p className="mb-4">
                  Revisa tu bandeja de entrada y también la carpeta de spam.
                </p>
              </div>

              <motion.button
                onClick={() => {
                  setSubmitted(false)
                  setEmail('')
                  setMessage('')
                }}
                className="w-full px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300 font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Enviar otro enlace
              </motion.button>
            </motion.div>
          )}

          {/* Footer */}
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p className="text-gray-400 text-sm">
              <a href="/login" className="text-yellow-400 hover:text-yellow-300 transition-colors">
                ← Volver al inicio de sesión
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
