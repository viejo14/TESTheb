import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { fetchProductById, fetchProductsByCategory } from '../services/api'
import ProductCard from '../components/ProductCard'
import './ProductDetailPage.css'

const ProductDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

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

  const handleAddToCart = () => {
    // TODO: Implement cart functionality
    console.log(`Adding ${quantity} of product ${product.id} to cart`)
    alert(`¡${product.name} agregado al carrito! (Cantidad: ${quantity})`)
  }

  const handleContactSeller = () => {
    // TODO: Implement contact functionality
    const message = `Hola, estoy interesado en el producto: ${product.name}`
    const whatsappUrl = `https://wa.me/56912345678?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="product-detail">
        <div className="loading">
          <div className="loading__spinner"></div>
          <p>Cargando producto...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="product-detail">
        <div className="error">
          <h2>Producto no encontrado</h2>
          <p>{error || 'El producto que buscas no existe'}</p>
          <button onClick={() => navigate('/catalog')}>
            Volver al catálogo
          </button>
        </div>
      </div>
    )
  }

  const isOutOfStock = product.stock === 0

  return (
    <div className="product-detail">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Inicio</Link>
          <span>/</span>
          <Link to="/catalog">Catálogo</Link>
          <span>/</span>
          {product.category_name && (
            <>
              <Link to={`/catalog?category=${product.category_id}`}>
                {product.category_name}
              </Link>
              <span>/</span>
            </>
          )}
          <span>{product.name}</span>
        </nav>

        {/* Product Info */}
        <div className="product-info">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = '/placeholder-product.jpg'
                  }}
                />
              ) : (
                <div className="image-placeholder">
                  <span>📷</span>
                  <p>Sin imagen</p>
                </div>
              )}
            </div>

            {/* TODO: Add image gallery for multiple images */}
            {/* <div className="image-thumbnails">
              <button className="thumbnail active">
                <img src={product.image_url} alt="Vista 1" />
              </button>
            </div> */}
          </div>

          {/* Product Details */}
          <div className="product-details">
            {product.category_name && (
              <span className="product-category">
                {product.category_name}
              </span>
            )}

            <h1 className="product-title">{product.name}</h1>

            <div className="product-price">
              <span className="current-price">
                {formatPrice(product.price)}
              </span>
            </div>

            <div className="product-stock">
              {isOutOfStock ? (
                <span className="out-of-stock">Sin stock</span>
              ) : (
                <span className="in-stock">
                  En stock ({product.stock} disponible{product.stock !== 1 ? 's' : ''})
                </span>
              )}
            </div>

            {product.description && (
              <div className="product-description">
                <h3>Descripción</h3>
                <p>{product.description}</p>
              </div>
            )}

            {/* Purchase Options */}
            <div className="purchase-options">
              {!isOutOfStock && (
                <div className="quantity-selector">
                  <label htmlFor="quantity">Cantidad:</label>
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
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
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <div className="action-buttons">
                {!isOutOfStock && (
                  <button
                    className="add-to-cart-button"
                    onClick={handleAddToCart}
                  >
                    Agregar al Carrito
                  </button>
                )}

                <button
                  className="contact-button"
                  onClick={handleContactSeller}
                >
                  Contactar por WhatsApp
                </button>
              </div>
            </div>

            {/* Product Features */}
            <div className="product-features">
              <h3>Características</h3>
              <ul>
                <li>✅ Bordado de alta calidad</li>
                <li>✅ Materiales resistentes</li>
                <li>✅ Diseño personalizable</li>
                <li>✅ Envío a todo Chile</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="related-products">
            <h2>Productos Relacionados</h2>
            <div className="products-grid">
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