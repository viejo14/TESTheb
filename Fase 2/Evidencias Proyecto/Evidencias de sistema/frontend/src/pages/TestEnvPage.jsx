import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const TestEnvPage = () => {
  const [envStatus, setEnvStatus] = useState({
    cloudinary: {},
    api: {},
    backend: {}
  })
  const [testingCloudinary, setTestingCloudinary] = useState(false)
  const [testingApi, setTestingApi] = useState(false)

  useEffect(() => {
    // Verificar variables de entorno al cargar
    const cloudinaryEnv = {
      cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
      apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
      uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
      folder: import.meta.env.VITE_CLOUDINARY_FOLDER
    }

    const apiEnv = {
      apiUrl: import.meta.env.VITE_API_URL,
      backendUrl: import.meta.env.VITE_BACKEND_URL
    }

    setEnvStatus(prev => ({
      ...prev,
      cloudinary: cloudinaryEnv,
      api: apiEnv
    }))
  }, [])

  const testCloudinaryConnection = async () => {
    setTestingCloudinary(true)
    try {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME

      // Test con un fetch a Cloudinary
      const response = await fetch(`https://res.cloudinary.com/${cloudName}/image/upload/sample.jpg`)

      if (response.ok) {
        setEnvStatus(prev => ({
          ...prev,
          cloudinary: {
            ...prev.cloudinary,
            status: '✅ Conexión exitosa',
            working: true
          }
        }))
      } else {
        setEnvStatus(prev => ({
          ...prev,
          cloudinary: {
            ...prev.cloudinary,
            status: '❌ Error de conexión',
            working: false
          }
        }))
      }
    } catch (error) {
      setEnvStatus(prev => ({
        ...prev,
        cloudinary: {
          ...prev.cloudinary,
          status: `❌ Error: ${error.message}`,
          working: false
        }
      }))
    } finally {
      setTestingCloudinary(false)
    }
  }

  const testApiConnection = async () => {
    setTestingApi(true)
    try {
      // Test al endpoint de health check
      const response = await fetch('/api/health')
      const data = await response.json()

      if (response.ok) {
        setEnvStatus(prev => ({
          ...prev,
          backend: {
            status: '✅ Proxy funcionando',
            message: data.message,
            timestamp: data.timestamp,
            working: true
          }
        }))
      } else {
        setEnvStatus(prev => ({
          ...prev,
          backend: {
            status: '❌ Error de conexión',
            working: false
          }
        }))
      }
    } catch (error) {
      setEnvStatus(prev => ({
        ...prev,
        backend: {
          status: `❌ Error: ${error.message}`,
          error: 'Verifica que el backend esté corriendo en el puerto 3000',
          working: false
        }
      }))
    } finally {
      setTestingApi(false)
    }
  }

  const renderValue = (value) => {
    if (!value || value === 'undefined') {
      return <span className="text-red-400">❌ No definido</span>
    }
    // Ocultar parcialmente las credenciales
    if (typeof value === 'string' && value.length > 10) {
      return <span className="text-green-400">✅ {value.substring(0, 6)}...{value.substring(value.length - 4)}</span>
    }
    return <span className="text-green-400">✅ {value}</span>
  }

  return (
    <div className="min-h-screen pt-40 pb-8 bg-gradient-to-br from-bg-primary to-bg-secondary">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            🔍 Verificación de Variables de Entorno
          </h1>

          {/* Cloudinary Section */}
          <div className="bg-bg-primary/80 border-2 border-gray-500/30 rounded-xl p-6 backdrop-blur-sm mb-6">
            <h2 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
              ☁️ Cloudinary Configuration
            </h2>

            <div className="space-y-3 mb-4">
              <div>
                <span className="text-text-secondary">Cloud Name: </span>
                {renderValue(envStatus.cloudinary.cloudName)}
              </div>
              <div>
                <span className="text-text-secondary">API Key: </span>
                {renderValue(envStatus.cloudinary.apiKey)}
              </div>
              <div>
                <span className="text-text-secondary">Upload Preset: </span>
                {renderValue(envStatus.cloudinary.uploadPreset)}
              </div>
              <div>
                <span className="text-text-secondary">Folder: </span>
                {renderValue(envStatus.cloudinary.folder)}
              </div>
              {envStatus.cloudinary.status && (
                <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                  <span className="text-white font-semibold">{envStatus.cloudinary.status}</span>
                </div>
              )}
            </div>

            <button
              onClick={testCloudinaryConnection}
              disabled={testingCloudinary}
              className="w-full px-6 py-3 bg-yellow-400 text-bg-primary rounded-lg hover:bg-yellow-300 transition-colors duration-300 font-bold disabled:opacity-50"
            >
              {testingCloudinary ? 'Probando conexión...' : '🧪 Probar Conexión a Cloudinary'}
            </button>
          </div>

          {/* API/Proxy Section */}
          <div className="bg-bg-primary/80 border-2 border-gray-500/30 rounded-xl p-6 backdrop-blur-sm mb-6">
            <h2 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
              🔌 API & Proxy Configuration
            </h2>

            <div className="space-y-3 mb-4">
              <div>
                <span className="text-text-secondary">API URL: </span>
                {renderValue(envStatus.api.apiUrl)}
              </div>
              <div>
                <span className="text-text-secondary">Backend URL (Proxy): </span>
                {renderValue(envStatus.api.backendUrl)}
              </div>
              {envStatus.backend.status && (
                <div className="mt-4 p-3 bg-gray-800 rounded-lg space-y-2">
                  <div className="text-white font-semibold">{envStatus.backend.status}</div>
                  {envStatus.backend.message && (
                    <div className="text-green-400 text-sm">{envStatus.backend.message}</div>
                  )}
                  {envStatus.backend.timestamp && (
                    <div className="text-text-secondary text-xs">
                      Timestamp: {new Date(envStatus.backend.timestamp).toLocaleString()}
                    </div>
                  )}
                  {envStatus.backend.error && (
                    <div className="text-red-400 text-sm">{envStatus.backend.error}</div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={testApiConnection}
              disabled={testingApi}
              className="w-full px-6 py-3 bg-yellow-400 text-bg-primary rounded-lg hover:bg-yellow-300 transition-colors duration-300 font-bold disabled:opacity-50"
            >
              {testingApi ? 'Probando conexión...' : '🧪 Probar Conexión al Backend'}
            </button>
          </div>

          {/* Instructions */}
          <div className="bg-blue-500/20 border-2 border-blue-500/50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-blue-400 mb-3">📝 Instrucciones:</h3>
            <ul className="text-text-secondary space-y-2 text-sm">
              <li>✅ Todas las variables deben mostrar valores (no "❌ No definido")</li>
              <li>🧪 Haz clic en los botones para probar las conexiones</li>
              <li>🔧 Si algo falla, verifica tu archivo <code className="text-yellow-400">.env.local</code></li>
              <li>🔄 Reinicia el servidor de desarrollo después de cambiar .env</li>
            </ul>
          </div>

          {/* Back Button */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="inline-block px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              ← Volver al Inicio
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default TestEnvPage
