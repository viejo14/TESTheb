import { motion } from 'framer-motion'

const DashboardStats = ({ products, categories, lastRefresh }) => {
  const stats = [
    {
      title: 'Total Productos',
      value: products.length,
      icon: '🛍️',
      color: 'bg-blue-500/20 border-blue-400'
    },
    {
      title: 'Total Categorías',
      value: categories.length,
      icon: '📂',
      color: 'bg-green-500/20 border-green-400'
    },
    {
      title: 'Productos con Imagen',
      value: products.filter(p => p.image_url).length,
      icon: '🖼️',
      color: 'bg-purple-500/20 border-purple-400'
    },
    {
      title: 'Precio Promedio',
      value: products.length > 0
        ? `$${Math.round(products.reduce((sum, p) => sum + parseFloat(p.price), 0) / products.length).toLocaleString()}`
        : '$0',
      icon: '💰',
      color: 'bg-yellow-500/20 border-yellow-400'
    }
  ]

  const categoryStats = categories.map(category => {
    const categoryProducts = products.filter(p => p.category_id === category.id)
    return {
      name: category.name,
      count: categoryProducts.length,
      percentage: products.length > 0 ? Math.round((categoryProducts.length / products.length) * 100) : 0
    }
  })

  const formatLastRefresh = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    return date.toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <div className="space-y-8">
      {/* Real-time Status Indicator */}
      <motion.div
        className="bg-green-500/20 border border-green-400 rounded-lg p-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-medium">
              Datos actualizados en tiempo real
            </span>
          </div>
          <span className="text-green-300 text-sm">
            Última actualización: {formatLastRefresh(lastRefresh)}
          </span>
        </div>
      </motion.div>
      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            className={`p-6 bg-bg-primary/80 border-2 rounded-xl backdrop-blur-sm ${stat.color}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Categories Breakdown */}
      <motion.div
        className="bg-bg-primary/80 border-2 border-gray-500/30 rounded-xl p-6 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h3 className="text-xl font-bold text-white mb-6">Productos por Categoría</h3>
        <div className="space-y-4">
          {categoryStats.map((category, index) => (
            <motion.div
              key={category.name}
              className="flex items-center justify-between"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="text-white font-medium">{category.name}</span>
                <div className="flex-1 h-2 bg-gray-600 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-yellow-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${category.percentage}%` }}
                    transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                  />
                </div>
              </div>
              <div className="text-right ml-4">
                <span className="text-white font-bold">{category.count}</span>
                <span className="text-white/70 text-sm ml-2">({category.percentage}%)</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Products */}
      <motion.div
        className="bg-bg-primary/80 border-2 border-gray-500/30 rounded-xl p-6 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h3 className="text-xl font-bold text-white mb-6">Productos Recientes</h3>
        <div className="space-y-3">
          {products
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5)
            .map((product, index) => (
              <motion.div
                key={product.id}
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
              >
                <div className="flex items-center gap-3">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-xs">📦</span>
                    </div>
                  )}
                  <div>
                    <p className="text-white font-medium">{product.name}</p>
                    <p className="text-white/70 text-sm">{product.category_name || 'Sin categoría'}</p>
                  </div>
                </div>
                <span className="text-yellow-400 font-bold">
                  ${parseFloat(product.price).toLocaleString()}
                </span>
              </motion.div>
            ))}
        </div>
      </motion.div>
    </div>
  )
}

export default DashboardStats