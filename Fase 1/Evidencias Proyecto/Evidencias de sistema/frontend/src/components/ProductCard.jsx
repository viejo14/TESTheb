import { Link } from 'react-router-dom'
import './ProductCard.css'

const ProductCard = ({ product }) => {
  const {
    id,
    name,
    description,
    price,
    image_url,
    category_name,
    stock
  } = product

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price)
  }

  const isOutOfStock = stock === 0

  return (
    <div className={`product-card ${isOutOfStock ? 'product-card--out-of-stock' : ''}`}>
      <Link to={`/product/${id}`} className="product-card__link">
        <div className="product-card__image">
          {image_url ? (
            <img
              src={image_url}
              alt={name}
              onError={(e) => {
                e.target.src = '/placeholder-product.jpg'
              }}
            />
          ) : (
            <div className="product-card__placeholder">
              📷
            </div>
          )}
          {isOutOfStock && (
            <div className="product-card__stock-overlay">
              Sin Stock
            </div>
          )}
        </div>

        <div className="product-card__content">
          <div className="product-card__category">
            {category_name}
          </div>

          <h3 className="product-card__title">{name}</h3>

          {description && (
            <p className="product-card__description">
              {description.length > 100
                ? `${description.substring(0, 100)}...`
                : description
              }
            </p>
          )}

          <div className="product-card__footer">
            <div className="product-card__price">
              {formatPrice(price)}
            </div>

            <div className="product-card__stock">
              {stock > 0 ? `Stock: ${stock}` : 'Sin stock'}
            </div>
          </div>
        </div>
      </Link>

      <div className="product-card__actions">
        <button
          className={`product-card__button ${isOutOfStock ? 'product-card__button--disabled' : ''}`}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? 'Sin Stock' : 'Ver Detalles'}
        </button>
      </div>
    </div>
  )
}

export default ProductCard