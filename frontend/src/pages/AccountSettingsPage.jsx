import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { HiTrash, HiExclamation, HiShieldExclamation } from 'react-icons/hi'

const AccountSettingsPage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDeleteAccount = async (e) => {
    e.preventDefault()

    if (!password) {
      setError('Debes ingresar tu contraseña')
      return
    }

    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/auth/account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password })
      })

      const data = await response.json()

      if (data.success) {
        // Cerrar sesión y redirigir
        logout()
        navigate('/', { replace: true })
        alert('Tu cuenta ha sido eliminada exitosamente')
      } else {
        setError(data.message)
      }
    } catch (error) {
      setError('Error al eliminar la cuenta. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-36 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-8">
            Configuración de Cuenta
          </h1>

          {/* Account Info */}
          <div className="bg-bg-primary/50 border border-gray-500/20 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">
              Información de la Cuenta
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-text-muted text-sm">Nombre</p>
                <p className="text-text-primary font-medium">{user?.name}</p>
              </div>
              <div>
                <p className="text-text-muted text-sm">Email</p>
                <p className="text-text-primary font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-text-muted text-sm">Rol</p>
                <p className="text-text-primary font-medium capitalize">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-500/10 border-2 border-red-500/30 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <HiShieldExclamation className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-red-400 mb-2">
                  Zona de Peligro
                </h2>
                <p className="text-text-muted text-sm mb-4">
                  Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, estate seguro.
                </p>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                >
                  <HiTrash className="w-5 h-5" />
                  Eliminar mi cuenta
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowDeleteModal(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              />

              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div className="bg-bg-primary border-2 border-red-500/30 rounded-xl max-w-md w-full p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-red-500/20 rounded-full">
                      <HiExclamation className="w-6 h-6 text-red-400" />
                    </div>
                    <h3 className="text-xl font-bold text-text-primary">
                      ¿Eliminar cuenta?
                    </h3>
                  </div>

                  <div className="mb-6 space-y-3">
                    <p className="text-text-muted">
                      Esta acción <strong className="text-red-400">NO se puede deshacer</strong>.
                    </p>
                    <p className="text-text-muted">
                      Se eliminará permanentemente:
                    </p>
                    <ul className="list-disc list-inside text-text-muted text-sm space-y-1 ml-2">
                      <li>Tu información personal</li>
                      <li>Tu historial de pedidos</li>
                      <li>Tus cotizaciones guardadas</li>
                      <li>Acceso a tu cuenta</li>
                    </ul>
                  </div>

                  <form onSubmit={handleDeleteAccount} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Confirma tu contraseña para continuar
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Tu contraseña"
                        disabled={loading}
                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-red-400 transition-colors disabled:opacity-50"
                        autoFocus
                      />
                    </div>

                    {error && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                        <p className="text-red-400 text-sm">{error}</p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowDeleteModal(false)
                          setPassword('')
                          setError('')
                        }}
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={loading || !password}
                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Eliminando...' : 'Eliminar Cuenta'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default AccountSettingsPage
