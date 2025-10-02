import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { Navigate, useLocation } from 'react-router-dom'

const LoginPage = () => {
  const { login, isAuthenticated, user, loading: authLoading } = useAuth()
  const location = useLocation()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Redirect if already authenticated
  if (isAuthenticated && user) {
    const from = location.state?.from?.pathname || '/'
    return <Navigate to={from} replace />
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error when user starts typing
    if (error) {
      setError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      setError('Por favor, completa todos los campos')
      return
    }

    setLoading(true)
    try {
      const result = await login(formData)

      if (result.success) {
        // Guardar flag para mostrar mensaje de bienvenida en HomePage
        sessionStorage.setItem('justLoggedIn', 'true')
        sessionStorage.setItem('userName', result.user?.name || 'Usuario')
        sessionStorage.setItem('isNewUser', 'false')
        // La redirección se manejará automáticamente por el isAuthenticated
      } else {
        setError(result.error || 'Error de inicio de sesión')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Error de conexión. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen pt-40 pb-8 bg-gradient-to-br from-bg-primary to-bg-secondary">
        <div className="flex flex-col items-center justify-center min-h-96">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-text-primary text-lg">Verificando sesión...</p>
        </div>
      </div>
    )
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
              Iniciar Sesión
            </h1>
            <p className="text-gray-400">
              Accede a tu cuenta de TESTheb
            </p>
          </motion.div>

          {/* Admin Test Credentials */}
          <motion.div
            className="bg-yellow-400/20 border border-yellow-400 rounded-lg p-4 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-yellow-400 font-medium text-sm mb-2">Credenciales de prueba:</h3>
            <div className="text-white text-sm space-y-1">
              <p><strong>Admin:</strong> admin@testheb.cl</p>
              <p><strong>Contraseña:</strong> admin123</p>
              <p><strong>Cliente:</strong> cliente@testheb.cl</p>
              <p><strong>Contraseña:</strong> password</p>
            </div>
          </motion.div>

          {/* Login Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {/* Email */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@testheb.cl"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition-colors duration-300"
                required
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition-colors duration-300"
                required
                disabled={loading}
              />
              <div className="text-right">
                <a
                  href="/forgot-password"
                  className="text-yellow-400 hover:text-yellow-300 transition-colors text-sm"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
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
                  Iniciando sesión...
                </div>
              ) : (
                '🔐 Iniciar Sesión'
              )}
            </motion.button>
          </motion.form>

          {/* Footer */}
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <p className="text-gray-400 text-sm">
              ¿No tienes cuenta?{' '}
              <a href="/register" className="text-yellow-400 hover:text-yellow-300 transition-colors">
                Regístrate aquí
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default LoginPage