import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
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

  useEffect(() => {
    const loadProductData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Load product details
        const productResponse = await fetchProductById(id)

        if (productResponse.success) {
          setProduct(productResponse.data)

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
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 text-sm text-gray-400">
          <Link to="/" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
            Inicio
          </Link>
          <span>/</span>
          <Link to="/catalog" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
            Catálogo
          </Link>
          <span>/</span>
          {product.category_name && (
            <>
              <Link
                to={`/catalog?category=${product.category_id}`}
                className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
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
          {/* Product Images */}
          <div className="sticky top-24 h-fit">
            <div className="w-full h-[500px] rounded-xl overflow-hidden bg-white shadow-lg">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/placeholder-product.jpg'
                  }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
                  <span className="text-6xl mb-4">📷</span>
                  <p className="text-gray-500">Sin imagen</p>
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {product.category_name && (
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {product.category_name}
              </span>
            )}

            <h1 className="text-3xl md:text-4xl font-bold text-text-primary leading-tight">{product.name}</h1>

            <div className="text-3xl font-bold text-yellow-400">
              {formatPrice(product.price)}
            </div>

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