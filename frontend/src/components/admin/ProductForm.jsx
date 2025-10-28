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
  
  // Estados para galería de imágenes múltiples
  const [productImages, setProductImages] = useState([]) // Array de imágenes del producto
  const [uploadingImages, setUploadingImages] = useState(false)
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0)
  const [urlInput, setUrlInput] = useState('') // URL temporal para agregar imágenes

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
      
      // Cargar imágenes existentes si estamos editando
      loadProductImages()
    }
  }, [product])

  // Cargar imágenes del producto si estamos editando
  const loadProductImages = async () => {
    if (!product?.id) return
    
    try {
      const response = await fetch(`/api/products/${product.id}/images`)
      const data = await response.json()
      
      if (data.success && data.data) {
        setProductImages(data.data)
        // Encontrar el índice de la imagen principal
        const primaryIdx = data.data.findIndex(img => img.is_primary)
        if (primaryIdx >= 0) {
          setPrimaryImageIndex(primaryIdx)
        }
      }
    } catch (error) {
      console.error('Error cargando imágenes del producto:', error)
    }
  }

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

    //console.log('🚀 DEBUG: Iniciando envío del formulario...')
    //console.log('📋 DEBUG: Datos del formulario:', formData)

    if (!validateForm()) {
      //console.log('❌ DEBUG: Validación del formulario falló')
      return
    }

    //console.log('✅ DEBUG: Validación del formulario exitosa')
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

      //console.log('📤 DEBUG: Datos a enviar:', submitData)

      let response
      let optimisticData

      if (isEditing) {
        // Optimistic update for edit
        const categoryName = categories.find(c => c.id === submitData.category_id)?.name || null
        optimisticData = { ...product, ...submitData, category_name: categoryName }
        adminData?.updateProductOptimistic(product.id, optimisticData)

        const token = localStorage.getItem('token')
        response = await updateProduct(product.id, submitData, token)
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

        const token = localStorage.getItem('token')
        response = await createProduct(submitData, token)
      }

      if (response.success) {
        // Guardar imágenes si es un producto nuevo
        if (!isEditing && response.data?.id && productImages.length > 0) {
          await saveProductImages(response.data.id)
        }
        
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
      if (isEditing && product) {
        adminData?.updateProductOptimistic(product.id, product) // Revert to original
      } else if (optimisticData?.id) {
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

    //console.log('🧪 DEBUG: Archivo seleccionado:', {
    //  name: file.name,
    //  type: file.type,
    //  size: file.size,
    //  lastModified: file.lastModified
    //})

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

    //console.log('✅ DEBUG: Archivo válido, iniciando subida...')
    //console.log('📋 DEBUG: Tipo de subida seleccionado:', imageUploadType)

    setUploadProgress(true)
    setErrors({ image: '' })

    try {
      //console.log('🔄 DEBUG: Iniciando proceso de subida...')
      
      // Usar la función correcta según el tipo seleccionado
      const response = imageUploadType === 'cloudinary'
        ? await uploadProductImage(file)
        : await uploadProductImageLocal(file)

      //console.log('📡 DEBUG: Respuesta del servidor:', response)

      if (response.success) {
        //console.log('✅ DEBUG: Subida exitosa!')
        setUploadedImage(response.data)
        setImagePreview(URL.createObjectURL(file))
        setFormData(prev => ({ ...prev, image_url: response.data.imageUrl }))
      } else {
        console.error('Error en respuesta del servidor:', response.message || response.error || 'Error desconocido')
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

  // ============ FUNCIONES PARA GALERÍA DE IMÁGENES ============

  /**
   * Maneja la subida de múltiples archivos de imagen
   */
  const handleMultipleFilesUpload = async (files) => {
    const fileArray = Array.from(files)
    
    // Validar que no exceda el límite de 4 imágenes
    if (productImages.length + fileArray.length > 4) {
      setErrors({ images: 'Máximo 4 imágenes por producto' })
      return
    }

    setUploadingImages(true)
    setErrors({ images: '' })

    try {
      const uploadPromises = fileArray.map(async (file) => {
        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} no es una imagen válida`)
        }

        // Validar tamaño (10MB máximo)
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`${file.name} excede el tamaño máximo de 10MB`)
        }

        // Subir imagen
        const response = imageUploadType === 'cloudinary'
          ? await uploadProductImage(file)
          : await uploadProductImageLocal(file)

        if (!response.success) {
          throw new Error(response.message || 'Error subiendo imagen')
        }

        return {
          image_url: response.data.imageUrl,
          preview: URL.createObjectURL(file),
          is_primary: productImages.length === 0 && fileArray.indexOf(file) === 0,
          display_order: productImages.length + fileArray.indexOf(file)
        }
      })

      const uploadedImgs = await Promise.all(uploadPromises)
      setProductImages(prev => [...prev, ...uploadedImgs])

      // Si es la primera imagen y estamos creando producto, actualizar image_url principal
      if (productImages.length === 0 && uploadedImgs.length > 0) {
        setFormData(prev => ({ ...prev, image_url: uploadedImgs[0].image_url }))
      }

    } catch (error) {
      console.error('Error subiendo imágenes:', error)
      setErrors({ images: error.message || 'Error subiendo imágenes' })
    } finally {
      setUploadingImages(false)
    }
  }

  /**
   * Maneja la selección de múltiples archivos
   */
  const handleMultipleFilesSelect = (e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleMultipleFilesUpload(files)
    }
  }

  /**
   * Maneja el drop de múltiples archivos
   */
  const handleMultipleFilesDrop = (e) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleMultipleFilesUpload(files)
    }
  }

  /**
   * Elimina una imagen de la galería
   */
  const removeImageFromGallery = async (index) => {
    const imageToRemove = productImages[index]
    
    // Si estamos editando y la imagen ya existe en BD, eliminarla del servidor
    if (isEditing && imageToRemove.id) {
      try {
        const response = await fetch(`/api/products/images/${imageToRemove.id}`, {
          method: 'DELETE'
        })
        const data = await response.json()
        
        if (!data.success) {
          console.error('Error eliminando imagen del servidor')
        }
      } catch (error) {
        console.error('Error eliminando imagen:', error)
      }
    }

    // Eliminar de la galería local
    const newImages = productImages.filter((_, i) => i !== index)
    setProductImages(newImages)

    // Si era la imagen principal, marcar la primera como principal
    if (index === primaryImageIndex && newImages.length > 0) {
      setPrimaryImageIndex(0)
      setFormData(prev => ({ ...prev, image_url: newImages[0].image_url }))
    } else if (newImages.length === 0) {
      setFormData(prev => ({ ...prev, image_url: '' }))
    }
  }

  /**
   * Marca una imagen como principal
   */
  const setImageAsPrimary = async (index) => {
    setPrimaryImageIndex(index)
    setFormData(prev => ({ ...prev, image_url: productImages[index].image_url }))

    // Si estamos editando y la imagen ya existe en BD, actualizarla en el servidor
    if (isEditing && productImages[index].id) {
      try {
        await fetch(`/api/products/images/${productImages[index].id}/primary`, {
          method: 'PUT'
        })
      } catch (error) {
        console.error('Error actualizando imagen principal:', error)
      }
    }
  }

  /**
   * Guarda las imágenes en el servidor después de crear/actualizar el producto
   */
  const saveProductImages = async (productId) => {
    if (productImages.length === 0) return

    try {
      // Preparar URLs de imágenes
      const imageUrls = productImages.map(img => img.image_url)

      const response = await fetch(`/api/products/${productId}/images/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image_urls: imageUrls })
      })

      const data = await response.json()
      
      if (data.success) {
        //console.log('✅ Imágenes guardadas exitosamente')
      }
    } catch (error) {
      console.error('Error guardando imágenes:', error)
    }
  }

  /**
   * Agrega una imagen desde URL
   */
  const handleAddImageFromUrl = () => {
    // Validar que no exceda el límite
    if (productImages.length >= 4) {
      setErrors({ images: 'Máximo 4 imágenes por producto' })
      return
    }

    // Validar que la URL no esté vacía
    if (!urlInput.trim()) {
      setErrors({ images: 'Por favor ingresa una URL' })
      return
    }

    // Validar que sea una URL válida
    if (!isValidUrl(urlInput)) {
      setErrors({ images: 'URL inválida. Debe ser una URL completa (http:// o https://)' })
      return
    }

    // Agregar imagen a la galería
    const newImage = {
      image_url: urlInput.trim(),
      preview: urlInput.trim(),
      is_primary: productImages.length === 0,
      display_order: productImages.length
    }

    setProductImages(prev => [...prev, newImage])

    // Si es la primera imagen, actualizar image_url principal
    if (productImages.length === 0) {
      setFormData(prev => ({ ...prev, image_url: urlInput.trim() }))
    }

    // Limpiar input
    setUrlInput('')
    setErrors({ images: '' })
  }

  /**
   * Maneja el Enter en el input de URL
   */
  const handleUrlKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddImageFromUrl()
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

          {/* Galería de Imágenes (Múltiples) */}
          <div className="border-2 border-yellow-400/30 rounded-xl p-5 bg-gray-800/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <label className="block text-white text-lg font-bold mb-1">
                  📸 Galería de Imágenes
                </label>
                <p className="text-gray-400 text-sm">
                  Puedes agregar hasta 4 imágenes. La primera será la imagen principal.
                </p>
              </div>
              <span className="text-yellow-400 font-bold text-sm">
                {productImages.length}/4
              </span>
            </div>

            {/* Selector de tipo de subida */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <label className={`flex items-center p-2 border rounded-lg cursor-pointer transition-all ${
                imageUploadType === 'local' 
                  ? 'border-yellow-400 bg-yellow-400/10' 
                  : 'border-gray-600 hover:border-yellow-400/50'
              }`}>
                <input
                  type="radio"
                  name="imageUploadType"
                  value="local"
                  checked={imageUploadType === 'local'}
                  onChange={(e) => setImageUploadType(e.target.value)}
                  className="mr-2"
                />
                <div className="flex-1">
                  <span className="text-white text-sm font-medium block">📤 Local</span>
                  <span className="text-gray-400 text-xs">Desde tu PC</span>
                </div>
              </label>
              <label className={`flex items-center p-2 border rounded-lg cursor-pointer transition-all ${
                imageUploadType === 'cloudinary' 
                  ? 'border-yellow-400 bg-yellow-400/10' 
                  : 'border-gray-600 hover:border-yellow-400/50'
              }`}>
                <input
                  type="radio"
                  name="imageUploadType"
                  value="cloudinary"
                  checked={imageUploadType === 'cloudinary'}
                  onChange={(e) => setImageUploadType(e.target.value)}
                  className="mr-2"
                />
                <div className="flex-1">
                  <span className="text-white text-sm font-medium block">☁️ Cloudinary</span>
                  <span className="text-gray-400 text-xs">En la nube</span>
                </div>
              </label>
              <label className={`flex items-center p-2 border rounded-lg cursor-pointer transition-all ${
                imageUploadType === 'url' 
                  ? 'border-yellow-400 bg-yellow-400/10' 
                  : 'border-gray-600 hover:border-yellow-400/50'
              }`}>
                <input
                  type="radio"
                  name="imageUploadType"
                  value="url"
                  checked={imageUploadType === 'url'}
                  onChange={(e) => setImageUploadType(e.target.value)}
                  className="mr-2"
                />
                <div className="flex-1">
                  <span className="text-white text-sm font-medium block">🔗 URL</span>
                  <span className="text-gray-400 text-xs">Link directo</span>
                </div>
              </label>
            </div>

            {/* Grid de imágenes */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {productImages.map((img, index) => (
                <motion.div
                  key={index}
                  className="relative group"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-700 border-2 border-gray-600 group-hover:border-yellow-400 transition-all">
                    <img
                      src={img.preview || img.image_url}
                      alt={`Imagen ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Badge de imagen principal */}
                  {index === primaryImageIndex && (
                    <div className="absolute top-2 left-2 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      ⭐ Principal
                    </div>
                  )}

                  {/* Controles */}
                  <div className="absolute bottom-2 left-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {index !== primaryImageIndex && (
                      <button
                        type="button"
                        onClick={() => setImageAsPrimary(index)}
                        className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-gray-900 text-xs font-bold py-1 rounded transition-colors"
                        title="Marcar como principal"
                      >
                        ⭐
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImageFromGallery(index)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-1 rounded transition-colors"
                      title="Eliminar imagen"
                    >
                      🗑️
                    </button>
                  </div>
                </motion.div>
              ))}

              {/* Botón para agregar más imágenes (solo para Local y Cloudinary) */}
              {productImages.length < 4 && imageUploadType !== 'url' && (
                <div
                  className="aspect-square border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-yellow-400 hover:bg-gray-700/50 transition-all"
                  onDrop={handleMultipleFilesDrop}
                  onDragOver={handleDragOver}
                  onClick={() => document.getElementById('multipleImagesInput').click()}
                >
                  {uploadingImages ? (
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-yellow-400 text-xs">Subiendo...</p>
                    </div>
                  ) : (
                    <div className="text-center p-2">
                      <div className="text-3xl text-gray-400 mb-1">➕</div>
                      <p className="text-white text-xs font-medium">Agregar</p>
                      <p className="text-gray-400 text-xs">imagen</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Placeholder cuando está en modo URL */}
              {productImages.length < 4 && imageUploadType === 'url' && (
                <div className="aspect-square border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center bg-gray-800/30">
                  <div className="text-center p-2">
                    <div className="text-3xl text-gray-500 mb-1">🔗</div>
                    <p className="text-gray-500 text-xs">Usa el campo</p>
                    <p className="text-gray-500 text-xs">de URL abajo</p>
                  </div>
                </div>
              )}
            </div>

            {/* Input oculto para múltiples archivos */}
            <input
              id="multipleImagesInput"
              type="file"
              accept="image/*"
              multiple
              onChange={handleMultipleFilesSelect}
              className="hidden"
            />

            {/* Agregar imagen por URL */}
            {imageUploadType === 'url' && productImages.length < 4 && (
              <div className="mb-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                <label className="block text-white text-sm font-medium mb-2">
                  🔗 Agregar imagen desde URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyPress={handleUrlKeyPress}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageFromUrl}
                    disabled={!urlInput.trim() || productImages.length >= 4}
                    className="px-6 py-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    ➕ Agregar
                  </button>
                </div>
                <p className="text-gray-400 text-xs mt-2">
                  💡 Pega la URL completa de la imagen y presiona Enter o clic en Agregar
                </p>
              </div>
            )}

            {/* Mensaje de ayuda */}
            <div className="bg-gray-700/50 rounded-lg p-3 text-sm">
              <p className="text-gray-300 mb-1">💡 <strong>Consejos:</strong></p>
              <ul className="text-gray-400 text-xs space-y-1 ml-4">
                {imageUploadType === 'url' ? (
                  <>
                    <li>• Pega URLs de imágenes externas (deben comenzar con http:// o https://)</li>
                    <li>• Presiona Enter o clic en "Agregar" para añadir la imagen</li>
                    <li>• La imagen con ⭐ será la principal del catálogo</li>
                    <li>• Puedes cambiar entre métodos de subida en cualquier momento</li>
                  </>
                ) : (
                  <>
                    <li>• Arrastra imágenes o haz clic en ➕ para seleccionar</li>
                    <li>• La imagen con ⭐ será la principal del catálogo</li>
                    <li>• Formato: JPG, PNG, WebP, GIF (máx. 10MB c/u)</li>
                    <li>• Puedes subir varias imágenes a la vez</li>
                  </>
                )}
              </ul>
            </div>

            {/* Errores */}
            {errors.images && (
              <p className="text-red-400 text-sm mt-2">❌ {errors.images}</p>
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