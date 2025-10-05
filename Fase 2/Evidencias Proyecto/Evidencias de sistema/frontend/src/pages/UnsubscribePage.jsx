import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiMailOpen } from 'react-icons/hi'

const UnsubscribePage = () => {
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState({ type: '', message: '' })

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  const handleUnsubscribe = async (e) => {
    e.preventDefault()

    if (!email) {
      setResult({ type: 'error', message: 'Por favor ingresa tu email' })
      return
    }

    setLoading(true)
    setResult({ type: '', message: '' })

    try {
      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (data.success) {
        setResult({
          type: 'success',
          message: 'Te has desuscrito exitosamente. Lamentamos verte partir.'
        })
        setEmail('')
      } else {
        setResult({ type: 'error', message: data.message })
      }
    } catch (error) {
      setResult({
        type: 'error',
        message: 'Error al procesar la solicitud. Intenta nuevamente.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-36 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-yellow-400/10 rounded-full">
              <HiMailOpen className="w-12 h-12 text-yellow-400" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Desuscribirse del Newsletter
          </h1>

          <p className="text-text-muted mb-8">
            Lamentamos verte partir. Si deseas dejar de recibir nuestros correos, ingresa tu email a continuación.
          </p>

          {result.type === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-500/10 border border-green-500/20 rounded-lg p-6"
            >
              <p className="text-green-400 mb-6">{result.message}</p>
              <a
                href="/"
                className="inline-block px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-colors"
              >
                Volver al inicio
              </a>
            </motion.div>
          ) : (
            <form onSubmit={handleUnsubscribe} className="space-y-6">
              <div>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-yellow-400 transition-colors disabled:opacity-50"
                  required
                />
              </div>

              {result.type === 'error' && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <p className="text-red-400 text-sm">{result.message}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Procesando...' : 'Desuscribirme'}
              </button>

              <p className="text-text-muted text-sm">
                ¿Cambiaste de opinión?{' '}
                <a href="/" className="text-yellow-400 hover:underline">
                  Volver al inicio
                </a>
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default UnsubscribePage
