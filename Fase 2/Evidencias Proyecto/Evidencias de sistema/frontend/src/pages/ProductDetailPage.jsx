import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { fetchProductById, fetchProductsByCategory } from '../services/api'
import ProductCard from '../components/ProductCard'

const ProductDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  
  // Estados para el carrusel de imágenes
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [productImages, setProductImages] = useState([])
  const [loadingImages, setLoadingImages] = useState(false)
  
  // Estados para zoom con lupa
  const [showZoom, setShowZoom] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 })
  const [lupaScale, setLupaScale] = useState(1)

  useEffect(() => {
    const loadProductData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Load product details
        const productResponse = await fetchProductById(id)

        if (productResponse.success) {
          setProduct(productResponse.data)

          // Load product images
          await loadProductImages(id)

          // Load related products from same category
          if (productResponse.data.category_id) {
            try {
              const relatedResponse = await fetchProductsByCategory(productResponse.data.category_id)
              if (relatedResponse.success) {
                // Filter out current product and limit to 4 related products
                const filtered = relatedResponse.data
                  .filter(p => p.id !== parseInt(id))
                  .slice(0, 4)
                setRelatedProducts(filtered)
              }
            } catch (err) {
              console.error('Error loading related products:', err)
            }
          }
        } else {
          setError('Producto no encontrado')
        }
      } catch (err) {
        setError('Error cargando el producto')
        console.error('Error loading product:', err)
      } finally {
        setLoading(false)
      }
    }

    loadProductData()
  }, [id])

  // Cargar imágenes del producto
  const loadProductImages = async (productId) => {
    try {
      setLoadingImages(true)
      const response = await fetch(`/api/products/${productId}/images`)
      const data = await response.json()

      if (data.success && data.data && data.data.length > 0) {
        // Ordenar por display_order y marcar la principal
        const sortedImages = data.data.sort((a, b) => a.display_order - b.display_order)
        setProductImages(sortedImages)
        
        // Establecer el índice de la imagen principal
        const primaryIndex = sortedImages.findIndex(img => img.is_primary)
        if (primaryIndex >= 0) {
          setCurrentImageIndex(primaryIndex)
        }
      } else {
        // Si no hay imágenes en la tabla, usar la imagen_url del producto
        setProductImages([])
      }
    } catch (error) {
      console.error('Error cargando imágenes del producto:', error)
      setProductImages([])
    } finally {
      setLoadingImages(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price)
  }

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = async () => {
    if (!product || addingToCart) return

    setAddingToCart(true)

    try {
      const result = addToCart(product, quantity)

      if (result.success) {
        // Producto agregado exitosamente - sin mensaje
      } else {
        alert('Error al agregar producto al carrito')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Error al agregar producto al carrito')
    } finally {
      setAddingToCart(false)
    }
  }

  const handleContactSeller = () => {
    // TODO: Implement contact functionality
    const message = `Hola, estoy interesado en el producto: ${product.name}`
    const whatsappUrl = `https://wa.me/56912345678?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  // Funciones del carrusel de imágenes
  const goToNextImage = () => {
    const images = getDisplayImages()
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
    setShowZoom(false) // Ocultar lupa al cambiar imagen
  }

  const goToPreviousImage = () => {
    const images = getDisplayImages()
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    setShowZoom(false) // Ocultar lupa al cambiar imagen
  }

  const goToImage = (index) => {
    setCurrentImageIndex(index)
    setShowZoom(false) // Ocultar lupa al cambiar imagen
  }

  // Obtener imágenes para mostrar (de la galería o la imagen del producto)
  const getDisplayImages = () => {
    if (productImages.length > 0) {
      return productImages
    } else if (product?.image_url) {
      return [{ image_url: product.image_url, is_primary: true }]
    }
    return []
  }

  const displayImages = getDisplayImages()
  const currentImage = displayImages[currentImageIndex]

  // Funciones del zoom con lupa
  const handleMouseEnter = () => {
    setShowZoom(true)
  }

  const handleMouseLeave = () => {
    setShowZoom(false)
  }

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    // Posición del cursor en el contenedor
    setZoomPosition({ x, y })
    
    // Posición de la imagen ampliada (invertida para efecto de lupa)
    const percentX = (x / rect.width) * 100
    const percentY = (y / rect.height) * 100
    setImagePosition({ x: percentX, y: percentY })
    
    // Calcular distancia a los botones (izquierdo y derecho)
    const leftButtonX = 16 + 24 // left-4 (16px) + mitad del botón (24px aprox)
    const rightButtonX = rect.width - 16 - 24
    const buttonY = rect.height / 2 // Centrado verticalmente
    
    // Distancia al botón izquierdo
    const distLeft = Math.sqrt(Math.pow(x - leftButtonX, 2) + Math.pow(y - buttonY, 2))
    // Distancia al botón derecho
    const distRight = Math.sqrt(Math.pow(x - rightButtonX, 2) + Math.pow(y - buttonY, 2))
    
    // Usar la distancia más cercana
    const minDist = Math.min(distLeft, distRight)
    
    // Ajustar escala: si está cerca (menos de 150px), reducir escala
    const threshold = 150 // distancia en píxeles
    let scale = 1
    if (minDist < threshold) {
      // Escala va de 0 (muy cerca) a 1 (lejos)
      scale = (minDist / threshold)
    }
    setLupaScale(scale)
  }

  if (loading) {
    return (
      <div className="min-h-screen py-8 bg-gradient-to-br from-bg-primary to-bg-secondary">
        <div className="flex flex-col items-center justify-center min-h-96">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-text-primary text-lg">Cargando producto...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen py-8 bg-gradient-to-br from-bg-primary to-bg-secondary">
        <div className="flex flex-col items-center justify-center min-h-96 px-4">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Producto no encontrado</h2>
          <p className="text-text-secondary text-lg mb-8">{error || 'El producto que buscas no existe'}</p>
          <button
            onClick={() => navigate('/catalog')}
            className="px-8 py-4 bg-bg-accent/80 text-text-primary rounded-full border-2 border-gray-500/30 font-medium transition-all duration-300 hover:border-yellow-400 hover:bg-bg-accent/90 hover:-translate-y-1"
          >
            Volver al catálogo
          </button>
        </div>
      </div>
    )
  }

  const isOutOfStock = product.stock === 0

  return (
    <div className="min-h-screen pt-40 pb-8 bg-gradient-to-br from-bg-primary to-bg-secondary">
      <div className="max-w-8xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 text-sm text-gray-400">
          <Link to="/" className="text-yellow-400 hover:text-yellow-300 hover:underline transition-colors">
            Inicio
          </Link>
          <span>/</span>
          <Link to="/catalog" className="text-yellow-400 hover:text-yellow-300 hover:underline transition-colors">
            Catálogo
          </Link>
          <span>/</span>
          {product.category_name && (
            <>
              <Link
                to={`/catalog?category=${product.category_id}`}
                className="text-yellow-400 hover:text-yellow-300 hover:underline transition-colors"
              >
                {product.category_name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-text-primary font-medium">{product.name}</span>
        </nav>

        {/* Product Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          {/* Product Images - Carrusel */}
          <div className="lg:sticky lg:top-24 h-fit space-y-4">
            {/* Imagen Principal con Zoom */}
            <div 
              className="relative w-full h-[600px] rounded-xl overflow-hidden bg-transparent shadow-2xl group cursor-crosshair"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
            >
              <AnimatePresence mode="wait">
                {currentImage ? (
                  <>
                    {/* Imagen principal */}
                    <motion.img
                      key={currentImageIndex}
                      src={currentImage.image_url}
                      alt={`${product.name} - Imagen ${currentImageIndex + 1}`}
                      className="w-full h-full object-contain"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      onError={(e) => {
                        e.target.src = '/placeholder-product.jpg'
                      }}
                    />
                    
                    {/* Lupa (solo desktop) */}
                    {showZoom && (
                      <motion.div
                        className="hidden lg:block absolute w-56 h-56 border-4 border-yellow-400 rounded-full pointer-events-none shadow-2xl overflow-hidden"
                        style={{
                          left: zoomPosition.x - 112,
                          top: zoomPosition.y - 112,
                          backgroundImage: `url(${currentImage.image_url})`,
                          backgroundSize: '700%',
                          backgroundPosition: `${imagePosition.x}% ${imagePosition.y}%`,
                          backgroundRepeat: 'no-repeat',
                          transform: `scale(${lupaScale})`
                        }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: lupaScale }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ duration: 0.1 }}
                      />
                    )}

                    {/* Indicador de zoom */}
                    {!showZoom && (
                      <div className="hidden lg:flex absolute bottom-4 left-4 bg-black/60 text-white px-3 py-2 rounded-lg items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                        </svg>
                        <span className="text-sm font-medium">Pasa el mouse para hacer zoom</span>
                      </div>
                    )}
                  </>
                ) : (
                  <motion.div
                    className="w-full h-full flex flex-col items-center justify-center bg-gray-800"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <span className="text-6xl mb-4">📷</span>
                    <p className="text-gray-400">Sin imagen</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Flechas de navegación */}
              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={goToPreviousImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                    aria-label="Imagen anterior"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={goToNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                    aria-label="Siguiente imagen"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Contador de imágenes */}
              {displayImages.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {currentImageIndex + 1} / {displayImages.length}
                </div>
              )}

              {/* Badge de imagen principal */}
              {currentImage?.is_primary && displayImages.length > 1 && (
                <div className="absolute top-4 left-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  ⭐ Principal
                </div>
              )}
            </div>

            {/* Miniaturas */}
            {displayImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {displayImages.map((img, index) => (
                  <motion.button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-3 transition-all duration-300 ${
                      index === currentImageIndex
                        ? 'border-yellow-400 ring-2 ring-yellow-400 ring-offset-2 ring-offset-gray-900'
                        : 'border-gray-600 hover:border-gray-400 opacity-70 hover:opacity-100'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={img.image_url}
                      alt={`Miniatura ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder-product.jpg'
                      }}
                    />
                    {img.is_primary && (
                      <div className="absolute top-1 right-1 bg-yellow-400 text-gray-900 rounded-full p-1">
                        <span className="text-xs">⭐</span>
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Indicadores de puntos (alternativo) */}
            {displayImages.length > 1 && displayImages.length <= 6 && (
              <div className="flex justify-center gap-2">
                {displayImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? 'w-8 bg-yellow-400'
                        : 'w-2 bg-gray-600 hover:bg-gray-400'
                    }`}
                    aria-label={`Ir a imagen ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {product.category_name && (
              <span className="inline-block px-3 py-1 bg-yellow-500 text-gray-800 text-sm font-medium rounded-full">
                {product.category_name}
              </span>
            )}

            <h1 className="text-3xl md:text-4xl font-bold text-text-primary leading-tight">{product.name}</h1>

            <div className="text-3xl font-bold text-yellow-400">
              {formatPrice(product.price)}
            </div>

            {/* SKU */}
            {product.sku && (
              <div className="flex items-center gap-3 text-base">
                <span className="text-gray-400 font-medium">SKU:</span>
                <span className="text-text-primary font-mono bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-600">
                  {product.sku}
                </span>
              </div>
            )}

            <div className="text-lg">
              {isOutOfStock ? (
                <span className="text-red-400 font-medium">Sin stock</span>
              ) : (
                <span className="text-green-400 font-medium">
                  En stock ({product.stock} disponible{product.stock !== 1 ? 's' : ''})
                </span>
              )}
            </div>

            {product.description && (
              <div className="bg-bg-primary/50 p-6 rounded-xl border border-gray-500/30">
                <h3 className="text-lg font-semibold text-text-primary mb-3">Descripción</h3>
                <p className="text-text-secondary leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Purchase Options */}
            <div className="space-y-6">
              {!isOutOfStock && (
                <div className="flex items-center gap-4">
                  <label htmlFor="quantity" className="text-text-primary font-medium">Cantidad:</label>
                  <div className="flex items-center border border-gray-500/30 rounded-lg bg-bg-primary/50">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="px-4 py-2 text-text-primary hover:bg-bg-accent/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      -
                    </button>
                    <input
                      id="quantity"
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      className="w-16 py-2 text-center bg-transparent text-text-primary border-none outline-none"
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.stock}
                      className="px-4 py-2 text-text-primary hover:bg-bg-accent/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                {!isOutOfStock && (
                  <button
                    className={`px-8 py-4 font-semibold rounded-lg transition-all duration-300 shadow-lg ${
                      addingToCart
                        ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                        : 'bg-yellow-500 hover:bg-yellow-400 text-black hover:-translate-y-1'
                    }`}
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                  >
                    {addingToCart ? 'Agregando...' : 'Agregar al Carrito'}
                  </button>
                )}

                <button
                  className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-all duration-300 hover:-translate-y-1 shadow-lg"
                  onClick={handleContactSeller}
                >
                  Contactar por WhatsApp
                </button>
              </div>
            </div>

            {/* Product Features */}
            <div className="bg-bg-primary/50 p-6 rounded-xl border border-gray-500/30">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Características</h3>
              <ul className="space-y-2">
                <li className="text-text-secondary">✅ Bordado de alta calidad</li>
                <li className="text-text-secondary">✅ Materiales resistentes</li>
                <li className="text-text-secondary">✅ Diseño personalizable</li>
                <li className="text-text-secondary">✅ Envío a todo Chile</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-8 text-center">Productos Relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default ProductDetailPage