import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

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
    <motion.div
      className={`group bg-bg-primary/80 border-2 border-gray-500/30 rounded-xl overflow-hidden min-h-[480px] flex flex-col ${
        isOutOfStock ? 'opacity-60' : ''
      }`}
      whileHover={{
        y: -8,
        borderColor: "rgb(251, 191, 36)",
        boxShadow: "0 8px 25px rgba(251,191,36,0.2)"
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex flex-col h-full">
        <Link to={`/product/${id}`} className="block text-decoration-none flex-1 flex flex-col">
          <div className="relative aspect-square overflow-hidden bg-white">
            {image_url ? (
              <motion.img
                src={image_url}
                alt={name}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
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
              <motion.div
                className="absolute inset-0 bg-black/50 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.span
                  className="bg-red-600 text-white px-3 py-1 rounded-full font-semibold text-sm"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  Sin Stock
                </motion.span>
              </motion.div>
            )}
          </div>

          <div className="p-4 flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <motion.div
                className="text-xs text-blue-400 font-medium uppercase tracking-wide"
                whileHover={{ color: "rgb(96, 165, 250)" }}
                transition={{ duration: 0.2 }}
              >
                {category_name}
              </motion.div>

              <motion.h3
                className="text-lg font-bold text-text-primary line-clamp-2 min-h-[3.5rem]"
                whileHover={{ color: "rgb(251, 191, 36)" }}
                transition={{ duration: 0.3 }}
              >
                {name}
              </motion.h3>

              {description && (
                <p className="text-text-muted text-sm leading-relaxed line-clamp-4 min-h-[5rem]">
                  {description}
                </p>
              )}

            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-500/20">
              <motion.div
                className="text-xl font-bold text-yellow-400"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {formatPrice(price)}
              </motion.div>

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
        <motion.button
          className={`w-full py-2 px-4 rounded-lg font-medium ${
            isOutOfStock
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-yellow-500 text-black'
          }`}
          disabled={isOutOfStock}
          onClick={!isOutOfStock ? handleViewDetails : undefined}
          whileHover={!isOutOfStock ? {
            backgroundColor: "rgb(251, 191, 36)",
            y: -2,
            boxShadow: "0 4px 15px rgba(251, 191, 36, 0.3)"
          } : {}}
          whileTap={!isOutOfStock ? { scale: 0.98 } : {}}
          transition={{ duration: 0.2 }}
        >
          {isOutOfStock ? 'Sin Stock' : 'Ver Detalles'}
        </motion.button>
      </div>
    </motion.div>
  )
}

export default ProductCard