import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { createProduct, updateProduct } from '../../services/api'
import { uploadProductImage, uploadProductImageLocal } from '../../services/uploadService'

const ProductForm = ({ product, categories, onClose, onSuccess, adminData }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    size_id: '',
    stock: 0
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [imageUploadType, setImageUploadType] = useState('local') // 'cloudinary', 'local', or 'url'
  const [uploadProgress, setUploadProgress] = useState(false)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [availableSizes, setAvailableSizes] = useState([])

  const isEditing = Boolean(product)

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category_id: product.category_id || '',
        image_url: product.image_url || '',
        size_id: product.size_id || '',
        stock: product.stock || 0
      })
    }
  }, [product])

  // Cargar tallas disponibles desde la base de datos
  useEffect(() => {
    const loadAvailableSizes = async () => {
      try {
        const response = await fetch('/api/products/sizes/all')
        if (response.ok) {
          const data = await response.json()
          setAvailableSizes(data.data || [])
        } else {
          console.error('Error loading sizes from API')
          setAvailableSizes([])
        }
      } catch (error) {
        console.error('Error loading sizes:', error)
        setAvailableSizes([])
      }
    }
    loadAvailableSizes()
  }, [])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0'
    }

    if (formData.image_url && !isValidUrl(formData.image_url)) {
      newErrors.image_url = 'URL de imagen inválida'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (string) => {
    
    if (!string) {
      return false
    }

    if (string.startsWith('/')) {
      return true
    }

    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    console.log('🚀 DEBUG: Iniciando envío del formulario...')
    console.log('📋 DEBUG: Datos del formulario:', formData)

    if (!validateForm()) {
      console.log('❌ DEBUG: Validación del formulario falló')
      return
    }

    console.log('✅ DEBUG: Validación del formulario exitosa')
    setLoading(true)
    try {
      // Prepare data for submission
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        image_url: formData.image_url || null,
        size_id: formData.size_id ? parseInt(formData.size_id) : null,
        stock: parseInt(formData.stock) || 0
      }

      console.log('📤 DEBUG: Datos a enviar:', submitData)

      let response
      let optimisticData

      if (isEditing) {
        // Optimistic update for edit
        const categoryName = categories.find(c => c.id === submitData.category_id)?.name || null
        optimisticData = { ...product, ...submitData, category_name: categoryName }
        adminData?.updateProductOptimistic(product.id, optimisticData)

        response = await updateProduct(product.id, submitData)
      } else {
        // Optimistic update for create
        const tempId = Date.now() // Temporary ID
        const categoryName = categories.find(c => c.id === submitData.category_id)?.name || null
        optimisticData = {
          id: tempId,
          ...submitData,
          category_name: categoryName,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        adminData?.addProductOptimistic(optimisticData)

        response = await createProduct(submitData)
      }

      if (response.success) {
        onSuccess()
      } else {
        // Revert optimistic update on error
        if (isEditing) {
          adminData?.updateProductOptimistic(product.id, product) // Revert to original
        } else {
          adminData?.removeProductOptimistic(optimisticData.id) // Remove temp product
        }
        setErrors({ submit: response.message || 'Error al guardar el producto' })
      }
    } catch (error) {
      console.error('Error submitting product:', error)
      // Revert optimistic update on error
      if (isEditing) {
        adminData?.updateProductOptimistic(product.id, product) // Revert to original
      } else if (optimisticData) {
        adminData?.removeProductOptimistic(optimisticData.id) // Remove temp product
      }
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

  const formatPrice = (value) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, '')
    return numericValue
  }

  const handlePriceChange = (e) => {
    const formattedValue = formatPrice(e.target.value)
    setFormData(prev => ({
      ...prev,
      price: formattedValue
    }))

    if (errors.price) {
      setErrors(prev => ({
        ...prev,
        price: ''
      }))
    }
  }

  // Image upload functions
  const handleFileUpload = async (file) => {
    if (!file) return

    console.log('🧪 DEBUG: Archivo seleccionado:', {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified
    })

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      console.error('❌ DEBUG: Tipo de archivo inválido:', file.type)
      setErrors({ image: 'Solo se permiten archivos de imagen' })
      return
    }

    // Validar tamaño (10MB máximo para productos)
    if (file.size > 10 * 1024 * 1024) {
      console.error('❌ DEBUG: Archivo muy grande:', file.size)
      setErrors({ image: 'La imagen no puede ser mayor a 10MB' })
      return
    }

    console.log('✅ DEBUG: Archivo válido, iniciando subida...')
    console.log('📋 DEBUG: Tipo de subida seleccionado:', imageUploadType)

    setUploadProgress(true)
    setErrors({ image: '' })

    try {
      console.log('🔄 DEBUG: Iniciando proceso de subida...')
      
      // Usar la función correcta según el tipo seleccionado
      const response = imageUploadType === 'cloudinary'
        ? await uploadProductImage(file)
        : await uploadProductImageLocal(file)

      console.log('📡 DEBUG: Respuesta del servidor:', response)

      if (response.success) {
        console.log('✅ DEBUG: Subida exitosa!')
        setUploadedImage(response.data)
        setImagePreview(URL.createObjectURL(file))
        setFormData(prev => ({ ...prev, image_url: response.data.imageUrl }))
      } else {
        console.error('❌ DEBUG: Error en respuesta del servidor:', response)
        setErrors({ image: response.message || 'Error subiendo la imagen' })
      }
    } catch (error) {
      console.error('❌ DEBUG: Error durante la subida:', error)
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
    setFormData(prev => ({ ...prev, image_url: '' }))
    if (imageUploadType === 'cloudinary' || imageUploadType === 'local') {
      setImageUploadType('url')
    }
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-zinc-900 border-2 border-gray-500 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {isEditing ? 'Editar Producto' : 'Agregar Producto'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-300"
          >
            <span className="text-2xl">✕</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Nombre del Producto *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Polera de algodón premium"
              className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors duration-300 ${
                errors.name ? 'border-red-500 focus:border-red-400' : 'border-gray-600 focus:border-yellow-400'
              }`}
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe las características del producto..."
              rows={4}
              className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors duration-300 resize-none ${
                errors.description ? 'border-red-500 focus:border-red-400' : 'border-gray-600 focus:border-yellow-400'
              }`}
            />
            {errors.description && (
              <p className="text-red-400 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Price and Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Precio (CLP) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handlePriceChange}
                  placeholder="15990"
                  className={`w-full pl-8 pr-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors duration-300 ${
                    errors.price ? 'border-red-500 focus:border-red-400' : 'border-gray-600 focus:border-yellow-400'
                  }`}
                />
              </div>
              {errors.price && (
                <p className="text-red-400 text-sm mt-1">{errors.price}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Categoría
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white focus:outline-none transition-colors duration-300 ${
                  errors.category_id ? 'border-red-500 focus:border-red-400' : 'border-gray-600 focus:border-yellow-400'
                }`}
              >
                <option value="">Seleccionar categoría</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="text-red-400 text-sm mt-1">{errors.category_id}</p>
              )}
            </div>
          </div>

          {/* Size and Stock Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Talla */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Talla
              </label>
              <select
                name="size_id"
                value={formData.size_id}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white focus:outline-none transition-colors duration-300 ${
                  errors.size_id ? 'border-red-500 focus:border-red-400' : 'border-gray-600 focus:border-yellow-400'
                }`}
              >
                <option value="">Seleccionar talla</option>
                {availableSizes.map(size => (
                  <option key={size.id} value={size.id}>
                    {size.name} - {size.display_name}
                  </option>
                ))}
              </select>
              {errors.size_id && (
                <p className="text-red-400 text-sm mt-1">{errors.size_id}</p>
              )}
            </div>

            {/* Stock */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Stock Disponible
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                placeholder="0"
                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors duration-300 ${
                  errors.stock ? 'border-red-500 focus:border-red-400' : 'border-gray-600 focus:border-yellow-400'
                }`}
              />
              {errors.stock && (
                <p className="text-red-400 text-sm mt-1">{errors.stock}</p>
              )}
            </div>
          </div>

          {/* Image Section */}
          <div>
            <label className="block text-white text-sm font-medium mb-3">
              Imagen del Producto
            </label>

            {/* Image Type Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <label className="flex items-center p-3 border border-gray-600 rounded-lg cursor-pointer hover:border-yellow-400 transition-colors">
                <input
                  type="radio"
                  name="imageUploadType"
                  value="cloudinary"
                  checked={imageUploadType === 'cloudinary'}
                  onChange={(e) => setImageUploadType(e.target.value)}
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
                  name="imageUploadType"
                  value="local"
                  checked={imageUploadType === 'local'}
                  onChange={(e) => setImageUploadType(e.target.value)}
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
                  name="imageUploadType"
                  value="url"
                  checked={imageUploadType === 'url'}
                  onChange={(e) => setImageUploadType(e.target.value)}
                  className="mr-3"
                />
                <div>
                  <span className="text-white text-sm font-medium block">🔗 URL externa</span>
                  <span className="text-gray-400 text-xs">Desde internet</span>
                </div>
              </label>
            </div>

            {/* File Upload Section */}
            {(imageUploadType === 'cloudinary' || imageUploadType === 'local') && (
              <div>
                {/* Upload Area */}
                {!uploadedImage && (
                  <div
                    className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-yellow-400 transition-colors cursor-pointer"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => document.getElementById('productFileInput').click()}
                  >
                    {uploadProgress ? (
                      <div className="space-y-3">
                        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-yellow-400">
                          {imageUploadType === 'cloudinary' ? 'Subiendo imagen a Cloudinary...' : 'Subiendo imagen local...'}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="text-4xl text-gray-400">📁</div>
                        <div>
                          <p className="text-white mb-1">Arrastra una imagen aquí o haz clic para seleccionar</p>
                          <p className="text-gray-400 text-sm">JPG, PNG, WebP, GIF hasta 10MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Hidden File Input */}
                <input
                  id="productFileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* Uploaded Image Preview */}
                {uploadedImage && (
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-white text-sm font-medium">✅ Imagen subida exitosamente</p>
                      <button
                        type="button"
                        onClick={removeUploadedImage}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        ✕ Eliminar
                      </button>
                    </div>
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-700 max-w-xs">
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
                    <div className="mt-2 text-xs text-gray-400">
                      <p>📁 {uploadedImage.filename}</p>
                      <p>
                        {imageUploadType === 'cloudinary' ? '☁️ Alojado en Cloudinary' : '💾 Guardado localmente'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* URL Input Section */}
            {imageUploadType === 'url' && (
              <div>
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

                {/* URL Image Preview */}
                {formData.image_url && !errors.image_url && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-400 mb-2">Vista previa:</p>
                    <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-700">
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={() => setErrors(prev => ({ ...prev, image_url: 'No se pudo cargar la imagen' }))}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Upload Error */}
            {errors.image && (
              <p className="text-red-400 text-sm mt-2">{errors.image}</p>
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
                isEditing ? '💾 Actualizar Producto' : '➕ Crear Producto'
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default ProductForm