import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { createCategory, updateCategory } from '../../services/api'
import { CATEGORY_IMAGE_OPTIONS, getCategoryImage } from '../../data/categoryImages'
import { uploadCategoryImage, uploadCategoryImageLocal } from '../../services/uploadService'

const CategoryForm = ({ category, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    image_url: '',
    selectedImageType: 'predefined' // 'predefined', 'cloudinary', 'local', or 'custom'
  })
  const [selectedPredefinedImage, setSelectedPredefinedImage] = useState('default')
  const [uploadedImage, setUploadedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const isEditing = Boolean(category)

  useEffect(() => {
    if (category) {
      const isCloudinaryUrl = category.image_url && category.image_url.includes('cloudinary.com')
      const isLocalImage = category.image_url && category.image_url.startsWith('/images/categories/')
      const isCustomUrl = category.image_url && category.image_url.startsWith('http') && !isCloudinaryUrl

      let imageType = 'predefined'
      if (isLocalImage) {
        imageType = 'local'
      } else if (isCloudinaryUrl) {
        imageType = 'cloudinary'
      } else if (isCustomUrl) {
        imageType = 'custom'
      }

      setFormData({
        name: category.name || '',
        image_url: category.image_url || '',
        selectedImageType: imageType
      })

      if (isLocalImage || isCloudinaryUrl) {
        setUploadedImage({ imageUrl: category.image_url })
      } else if (!isCustomUrl) {
        // Determinar qué imagen predefinida corresponde
        const matchingOption = CATEGORY_IMAGE_OPTIONS.find(opt =>
          category.name.toLowerCase().includes(opt.label.toLowerCase().split('/')[0])
        )
        setSelectedPredefinedImage(matchingOption?.key || 'default')
      }
    }
  }, [category])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }

    if (formData.image_url && !isValidUrl(formData.image_url)) {
      newErrors.image_url = 'URL de imagen inválida'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const handleFileUpload = async (file) => {
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setErrors({ image: 'Solo se permiten archivos de imagen' })
      return
    }

    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ image: 'La imagen no puede ser mayor a 5MB' })
      return
    }

    setUploadProgress(true)
    setErrors({ image: '' })

    try {
      // Usar la función correcta según el tipo seleccionado
      const response = formData.selectedImageType === 'cloudinary'
        ? await uploadCategoryImage(file)
        : await uploadCategoryImageLocal(file)

      setUploadedImage(response.data)
      setImagePreview(URL.createObjectURL(file))
    } catch (error) {
      console.error('Error uploading image:', error)
      setErrors({ image: 'Error subiendo la imagen. Intenta nuevamente.' })
    } finally {
      setUploadProgress(false)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const removeUploadedImage = () => {
    setUploadedImage(null)
    setImagePreview(null)
    if (formData.selectedImageType === 'cloudinary' || formData.selectedImageType === 'local') {
      setFormData(prev => ({ ...prev, selectedImageType: 'predefined' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      // Prepare data for submission
      let finalImageUrl = null

      if (formData.selectedImageType === 'predefined') {
        // Usar imagen predefinida
        const selectedOption = CATEGORY_IMAGE_OPTIONS.find(opt => opt.key === selectedPredefinedImage)
        finalImageUrl = selectedOption?.preview || null
      } else if (formData.selectedImageType === 'cloudinary' || formData.selectedImageType === 'local') {
        // Usar imagen subida (Cloudinary o Local)
        finalImageUrl = uploadedImage?.imageUrl || null
      } else {
        // Usar URL personalizada
        finalImageUrl = formData.image_url || null
      }

      const submitData = {
        name: formData.name,
        image_url: finalImageUrl
      }

      const token = localStorage.getItem('token')
      let response
      if (isEditing) {
        response = await updateCategory(category.id, submitData, token)
      } else {
        response = await createCategory(submitData, token)
      }

      if (response.success) {
        onSuccess()
      } else {
        setErrors({ submit: response.message || 'Error al guardar la categoría' })
      }
    } catch (error) {
      console.error('Error submitting category:', error)
      setErrors({ submit: 'Error de conexión. Intenta nuevamente.' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-zinc-900 border-2 border-gray-500 rounded-xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
            {isEditing ? 'Editar Categoría' : 'Agregar Categoría'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-300"
          >
            <span className="text-2xl">✕</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Category Name */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Nombre de la Categoría *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Colegios, Empresas, etc."
              className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors duration-300 ${
                errors.name ? 'border-red-500 focus:border-red-400' : 'border-gray-600 focus:border-yellow-400'
              }`}
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Image Selection Type */}
          <div>
            <label className="block text-white text-sm font-medium mb-3">
              Tipo de Imagen
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <label className="flex items-center p-3 border border-gray-600 rounded-lg cursor-pointer hover:border-yellow-400 transition-colors">
                <input
                  type="radio"
                  name="selectedImageType"
                  value="predefined"
                  checked={formData.selectedImageType === 'predefined'}
                  onChange={handleChange}
                  className="mr-3"
                />
                <div>
                  <span className="text-white text-sm font-medium block">📁 Predefinidas</span>
                  <span className="text-gray-400 text-xs">Recomendado</span>
                </div>
              </label>
              <label className="flex items-center p-3 border border-gray-600 rounded-lg cursor-pointer hover:border-yellow-400 transition-colors">
                <input
                  type="radio"
                  name="selectedImageType"
                  value="cloudinary"
                  checked={formData.selectedImageType === 'cloudinary'}
                  onChange={handleChange}
                  className="mr-3"
                />
                <div>
                  <span className="text-white text-sm font-medium block">☁️ Cloudinary</span>
                  <span className="text-gray-400 text-xs">Subir a nube</span>
                </div>
              </label>
              <label className="flex items-center p-3 border border-gray-600 rounded-lg cursor-pointer hover:border-yellow-400 transition-colors">
                <input
                  type="radio"
                  name="selectedImageType"
                  value="local"
                  checked={formData.selectedImageType === 'local'}
                  onChange={handleChange}
                  className="mr-3"
                />
                <div>
                  <span className="text-white text-sm font-medium block">📤 Agregar localmente</span>
                  <span className="text-gray-400 text-xs">Desde PC</span>
                </div>
              </label>
              <label className="flex items-center p-3 border border-gray-600 rounded-lg cursor-pointer hover:border-yellow-400 transition-colors">
                <input
                  type="radio"
                  name="selectedImageType"
                  value="custom"
                  checked={formData.selectedImageType === 'custom'}
                  onChange={handleChange}
                  className="mr-3"
                />
                <div>
                  <span className="text-white text-sm font-medium block">🔗 URL externa</span>
                  <span className="text-gray-400 text-xs">Desde internet</span>
                </div>
              </label>
            </div>

            {/* Predefined Images Selector */}
            {formData.selectedImageType === 'predefined' && (
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Seleccionar imagen predefinida
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                  {CATEGORY_IMAGE_OPTIONS.map((option) => (
                    <motion.div
                      key={option.key}
                      className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        selectedPredefinedImage === option.key
                          ? 'border-yellow-400 shadow-lg shadow-yellow-400/30'
                          : 'border-gray-600 hover:border-gray-400'
                      }`}
                      onClick={() => setSelectedPredefinedImage(option.key)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="aspect-video bg-gray-700 flex items-center justify-center">
                        <span className="text-4xl">📷</span>
                      </div>
                      <div className="p-2 bg-gray-800">
                        <p className="text-white text-xs text-center">{option.label}</p>
                      </div>
                      {selectedPredefinedImage === option.key && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                          <span className="text-black text-xs">✓</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* File Upload Section */}
            {(formData.selectedImageType === 'cloudinary' || formData.selectedImageType === 'local') && (
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  {formData.selectedImageType === 'cloudinary' ? 'Subir imagen a Cloudinary' : 'Subir imagen local'}
                </label>

                {/* Upload Area */}
                {!uploadedImage && (
                  <div
                    className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-yellow-400 transition-colors cursor-pointer"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => document.getElementById('fileInput').click()}
                  >
                    {uploadProgress ? (
                      <div className="space-y-3">
                        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-yellow-400">Subiendo imagen...</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="text-4xl text-gray-400">📁</div>
                        <div>
                          <p className="text-white mb-1">Arrastra una imagen aquí o haz clic para seleccionar</p>
                          <p className="text-gray-400 text-sm">JPG, PNG, GIF hasta 5MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Hidden File Input */}
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* Uploaded Image Preview */}
                {uploadedImage && (
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-white text-sm font-medium">Imagen subida exitosamente</p>
                      <button
                        type="button"
                        onClick={removeUploadedImage}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        ✕ Eliminar
                      </button>
                    </div>
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-700">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Vista previa"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <span className="text-2xl">🖼️</span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-400 text-xs mt-2">
                      Archivo: {uploadedImage.filename}
                    </p>
                  </div>
                )}

                {/* Upload Error */}
                {errors.image && (
                  <p className="text-red-400 text-sm mt-2">{errors.image}</p>
                )}
              </div>
            )}

            {/* Custom URL Input */}
            {formData.selectedImageType === 'custom' && (
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  URL de Imagen Personalizada
                </label>
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors duration-300 ${
                    errors.image_url ? 'border-red-500 focus:border-red-400' : 'border-gray-600 focus:border-yellow-400'
                  }`}
                />
                {errors.image_url && (
                  <p className="text-red-400 text-sm mt-1">{errors.image_url}</p>
                )}
              </div>
            )}

            {/* Image Preview */}
            {((formData.selectedImageType === 'predefined' && selectedPredefinedImage) ||
              (formData.selectedImageType === 'custom' && formData.image_url && !errors.image_url) ||
              ((formData.selectedImageType === 'cloudinary' || formData.selectedImageType === 'local') && uploadedImage)) && (
              <div className="mt-4">
                <p className="text-sm text-gray-400 mb-2">Vista previa final:</p>
                <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-700">
                  {(formData.selectedImageType === 'cloudinary' || formData.selectedImageType === 'local') && imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Vista previa"
                      className="w-full h-full object-cover"
                    />
                  ) : formData.selectedImageType === 'custom' && formData.image_url ? (
                    <img
                      src={formData.image_url}
                      alt="Vista previa URL"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                  ) : formData.selectedImageType === 'predefined' ? (
                    <img
                      src={CATEGORY_IMAGE_OPTIONS.find(opt => opt.key === selectedPredefinedImage)?.preview}
                      alt="Vista previa predefinida"
                      className="w-full h-full object-cover"
                    />
                  ) : null}

                  {/* Fallback para URL inválida */}
                  <div className="w-full h-full bg-gray-600 flex items-center justify-center" style={{ display: 'none' }}>
                    <span className="text-gray-400 text-sm">URL de imagen inválida</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg">
              <p className="text-red-400 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300 font-medium"
              disabled={loading}
            >
              Cancelar
            </button>
            <motion.button
              type="submit"
              className="flex-1 px-6 py-3 bg-yellow-400 text-bg-primary rounded-lg hover:bg-yellow-300 transition-colors duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-bg-primary border-t-transparent rounded-full animate-spin"></div>
                  {isEditing ? 'Actualizando...' : 'Creando...'}
                </div>
              ) : (
                isEditing ? '💾 Actualizar Categoría' : '➕ Crear Categoría'
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default CategoryForm