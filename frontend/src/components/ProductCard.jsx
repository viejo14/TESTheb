import { Link, useNavigate } from 'react-router-dom'

const ProductCard = ({ product }) => {
  const navigate = useNavigate()
  const {
    id,
    name,
    description,
    price,
    image_url,
    category_name,
    stock = 0
  } = product

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price)
  }

  const isOutOfStock = stock === 0

  const handleViewDetails = () => {
    navigate(`/product/${id}`)
  }

  return (
    <div
      className={`group bg-bg-primary/80 border-2 border-gray-500/30 hover:border-yellow-400 rounded-xl overflow-hidden min-h-[480px] flex flex-col transition-all duration-200 ease-out hover:-translate-y-2 hover:shadow-[0_8px_25px_rgba(251,191,36,0.2)] ${
        isOutOfStock ? 'opacity-60' : ''
      }`}
    >
      <div className="flex flex-col h-full">
        <Link to={`/product/${id}`} className="block text-decoration-none flex-1 flex flex-col">
          <div className="relative aspect-square overflow-hidden bg-gray-900">
            {image_url ? (
              <img
                src={image_url}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-110"
                onError={(e) => {
                  e.target.src = '/placeholder-product.jpg'
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-4xl">
                📷
              </div>
            )}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-red-600 text-white px-3 py-1 rounded-full font-semibold text-sm">
                  Sin Stock
                </span>
              </div>
            )}
          </div>

          <div className="p-4 flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="text-xs text-blue-400 font-medium uppercase tracking-wide transition-colors duration-200 group-hover:text-blue-300">
                {category_name}
              </div>

              <h3 className="text-lg font-bold text-text-primary line-clamp-2 min-h-[3.5rem] transition-colors duration-200 group-hover:text-yellow-400">
                {name}
              </h3>

              {description && (
                <p className="text-text-muted text-sm leading-relaxed line-clamp-4 min-h-[5rem]">
                  {description}
                </p>
              )}

            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-500/20">
              <div className="text-xl font-bold text-yellow-400">
                {formatPrice(price)}
              </div>

              <div className={`text-sm font-medium ${
                stock > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {stock > 0 ? `Stock: ${stock}` : 'Sin stock'}
              </div>
            </div>
          </div>
        </Link>
      </div>

      <div className="px-4 pb-4 mt-auto">
        <button
          className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
            isOutOfStock
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-yellow-500 text-black hover:bg-yellow-400 hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(251,191,36,0.3)] active:scale-98'
          }`}
          disabled={isOutOfStock}
          onClick={!isOutOfStock ? handleViewDetails : undefined}
        >
          {isOutOfStock ? 'Sin Stock' : 'Ver Detalles'}
        </button>
      </div>
    </div>
  )
}

export default ProductCard