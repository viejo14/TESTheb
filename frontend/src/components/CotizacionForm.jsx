import { useState } from 'react'
import { motion } from 'framer-motion'
import { createCotizacion } from '../services/cotizacionService'
import { uploadProductImage } from '../services/uploadService'
import { HiX, HiUpload, HiTrash } from 'react-icons/hi'

const CotizacionForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    image_url: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'El mensaje es requerido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleImageSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: 'Solo se permiten archivos de imagen' }))
      return
    }

    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'La imagen no debe superar los 5MB' }))
      return
    }

    setImageFile(file)

    // Crear preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)

    // Subir imagen a Cloudinary
    setUploadingImage(true)
    try {
      const result = await uploadProductImage(file)
      if (result.success) {
        setFormData(prev => ({
          ...prev,
          image_url: result.data.imageUrl
        }))
      } else {
        setErrors(prev => ({ ...prev, image: 'Error al subir la imagen' }))
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, image: 'Error al subir la imagen' }))
    } finally {
      setUploadingImage(false)
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setFormData(prev => ({ ...prev, image_url: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setSuccessMessage('')

    try {
      const response = await createCotizacion(formData)
      setSuccessMessage(response.message || 'Cotización enviada exitosamente. Recibirás una confirmación por email.')

      // Limpiar formulario
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        image_url: ''
      })
      setImageFile(null)
      setImagePreview(null)

      // Cerrar después de 2 segundos si hay callback
      if (onSuccess) {
        setTimeout(() => {
          onSuccess(response.data)
        }, 2000)
      }
    } catch (error) {
      setErrors({ submit: error.message || 'Error al enviar cotización' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-yellow-400/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 py-4 flex justify-between items-center border-b-2 border-yellow-500/50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">📝 Solicitar Cotización</h2>
            <p className="text-sm text-gray-800">Cuéntanos sobre tu proyecto</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-900 hover:text-gray-700 transition-colors"
            >
              <HiX className="text-3xl" />
            </button>
          )}
        </div>

        <div className="p-6">
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-500/20 border-2 border-green-500/50 text-green-400 rounded-lg flex items-start gap-3"
            >
              <span className="text-2xl">✓</span>
              <div>
                <p className="font-semibold">¡Cotización enviada!</p>
                <p className="text-sm text-green-300">{successMessage}</p>
              </div>
            </motion.div>
          )}

          {errors.submit && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/20 border-2 border-red-500/50 text-red-400 rounded-lg flex items-start gap-3"
            >
              <span className="text-2xl">✕</span>
              <p>{errors.submit}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nombre */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-yellow-400 mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-zinc-800 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-500 transition-all ${
                  errors.name ? 'border-red-500' : 'border-gray-700 hover:border-yellow-400/50'
                }`}
                placeholder="Ej: Juan Pérez"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                  <span>⚠</span> {errors.name}
                </p>
              )}
            </div>

            {/* Email y Teléfono en grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-yellow-400 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-zinc-800 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-500 transition-all ${
                    errors.email ? 'border-red-500' : 'border-gray-700 hover:border-yellow-400/50'
                  }`}
                  placeholder="tu@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <span>⚠</span> {errors.email}
                  </p>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-yellow-400 mb-2">
                  Teléfono (opcional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-zinc-800 border-2 border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-500 hover:border-yellow-400/50 transition-all"
                  placeholder="+56 9 1234 5678"
                />
              </div>
            </div>

            {/* Mensaje */}
            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-yellow-400 mb-2">
                Mensaje / Descripción del Proyecto *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                className={`w-full px-4 py-3 bg-zinc-800 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-500 resize-none transition-all ${
                  errors.message ? 'border-red-500' : 'border-gray-700 hover:border-yellow-400/50'
                }`}
                placeholder="Describe qué producto o servicio necesitas, cantidad aproximada, fecha de entrega deseada, etc."
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                  <span>⚠</span> {errors.message}
                </p>
              )}
            </div>

            {/* Subir Imagen */}
            <div>
              <label className="block text-sm font-semibold text-yellow-400 mb-2">
                Imagen de Referencia (opcional)
              </label>

              {!imagePreview ? (
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="w-full px-4 py-8 bg-zinc-800 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-yellow-400/50 transition-all flex flex-col items-center gap-3 group"
                  >
                    <HiUpload className="text-4xl text-gray-500 group-hover:text-yellow-400 transition-colors" />
                    <div className="text-center">
                      <p className="text-white font-medium">Haz clic para subir una imagen</p>
                      <p className="text-sm text-gray-500">PNG, JPG o JPEG (máx. 5MB)</p>
                    </div>
                    {uploadingImage && (
                      <div className="absolute inset-0 bg-zinc-900/80 flex items-center justify-center rounded-lg">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-yellow-400 text-sm">Subiendo imagen...</p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border-2 border-yellow-400/30"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    <HiTrash className="text-xl" />
                  </button>
                </div>
              )}

              {errors.image && (
                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                  <span>⚠</span> {errors.image}
                </p>
              )}
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border-2 border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 hover:border-gray-600 transition-all font-semibold"
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                disabled={loading || uploadingImage}
                className={`flex-1 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-lg font-bold transition-all ${
                  loading || uploadingImage
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:from-yellow-500 hover:to-yellow-600 hover:shadow-lg hover:shadow-yellow-400/50'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                    Enviando...
                  </span>
                ) : (
                  'Enviar Cotización'
                )}
              </button>
            </div>
          </form>

          <p className="mt-6 text-xs text-gray-500 text-center">
            * Campos requeridos • Recibirás una confirmación por email
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default CotizacionForm
