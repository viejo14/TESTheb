import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const DashboardStats = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/stats/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStats(response.data.data)
    } catch (err) {
      setError('Error cargando estadísticas')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">{error || 'No se pudieron cargar las estadísticas'}</p>
        <button
          onClick={fetchStats}
          className="mt-4 px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500"
        >
          Reintentar
        </button>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Órdenes',
      value: stats.salesStats?.total_ordenes || 0,
      icon: '📦',
      color: 'bg-blue-500/20 border-blue-400'
    },
    {
      title: 'Ingresos Totales',
      value: `$${parseFloat(stats.salesStats?.ingresos_totales || 0).toLocaleString()}`,
      icon: '💰',
      color: 'bg-green-500/20 border-green-400'
    },
    {
      title: 'Ticket Promedio',
      value: `$${Math.round(parseFloat(stats.salesStats?.ticket_promedio || 0)).toLocaleString()}`,
      icon: '🎫',
      color: 'bg-purple-500/20 border-purple-400'
    },
    {
      title: 'Cotizaciones (30d)',
      value: stats.recentQuotes?.total_cotizaciones || 0,
      subtitle: `${stats.recentQuotes?.pendientes || 0} pendientes`,
      icon: '📝',
      color: 'bg-yellow-500/20 border-yellow-400'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            className={`p-6 bg-bg-primary/80 border-2 rounded-xl backdrop-blur-sm transition-all duration-200 ease-out hover:scale-105 hover:shadow-lg ${stat.color}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                {stat.subtitle && (
                  <p className="text-white/60 text-xs mt-1">{stat.subtitle}</p>
                )}
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Top 10 Productos Más Vendidos */}
      <motion.div
        className="bg-bg-primary/80 border-2 border-gray-500/30 rounded-xl p-6 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">🏆 Top 10 Productos Más Vendidos</h3>
          <button
            onClick={fetchStats}
            className="px-3 py-1 text-sm bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors"
          >
            🔄 Actualizar
          </button>
        </div>

        <div className="space-y-3">
          {stats.topProducts && stats.topProducts.length > 0 ? (
            stats.topProducts.map((product, index) => (
              <motion.div
                key={product.id}
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-all duration-150 ease-out"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
              >
                <div className="flex items-center gap-4 flex-1">
                  {/* Posición */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0 ? 'bg-yellow-400 text-gray-900' :
                    index === 1 ? 'bg-gray-300 text-gray-900' :
                    index === 2 ? 'bg-orange-400 text-gray-900' :
                    'bg-gray-600 text-white'
                  }`}>
                    {index + 1}
                  </div>

                  {/* Imagen */}
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400">📦</span>
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1">
                    <p className="text-white font-medium">{product.name}</p>
                    <p className="text-white/60 text-sm">{product.category_name || 'Sin categoría'}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="text-right">
                  <p className="text-yellow-400 font-bold text-lg">
                    {product.total_vendido} vendidos
                  </p>
                  <p className="text-green-400 text-sm">
                    ${parseFloat(product.ingresos_totales).toLocaleString()}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 text-white/60">
              <p className="text-lg mb-2">📭 No hay ventas registradas aún</p>
              <p className="text-sm">Los productos más vendidos aparecerán aquí</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Ventas por Categoría */}
      <motion.div
        className="bg-bg-primary/80 border-2 border-gray-500/30 rounded-xl p-6 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h3 className="text-xl font-bold text-white mb-6">📊 Ventas por Categoría</h3>
        <div className="space-y-4">
          {stats.salesByCategory && stats.salesByCategory.length > 0 ? (
            stats.salesByCategory.map((category, index) => {
              const maxProductosVendidos = Math.max(...stats.salesByCategory.map(c => parseInt(c.productos_vendidos)))
              const percentage = maxProductosVendidos > 0 ? (parseInt(category.productos_vendidos) / maxProductosVendidos) * 100 : 0

              return (
                <motion.div
                  key={category.categoria}
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-white font-medium min-w-[120px]">{category.categoria}</span>
                    <div className="flex-1 h-3 bg-gray-600 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.6, delay: index * 0.05 }}
                      />
                    </div>
                  </div>
                  <div className="text-right ml-4 min-w-[140px]">
                    <span className="text-white font-bold">{category.productos_vendidos} vendidos</span>
                    <p className="text-green-400 text-sm">${parseFloat(category.ingresos).toLocaleString()}</p>
                  </div>
                </motion.div>
              )
            })
          ) : (
            <div className="text-center py-8 text-white/60">
              No hay ventas por categoría registradas
            </div>
          )}
        </div>
      </motion.div>

      {/* Ventas Recientes (Últimos 7 días) */}
      <motion.div
        className="bg-bg-primary/80 border-2 border-gray-500/30 rounded-xl p-6 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <h3 className="text-xl font-bold text-white mb-6">📅 Ventas de los Últimos 7 Días</h3>
        <div className="space-y-3">
          {stats.recentOrders && stats.recentOrders.length > 0 ? (
            stats.recentOrders.map((order, index) => (
              <motion.div
                key={order.fecha}
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-all duration-150"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
              >
                <div>
                  <p className="text-white font-medium">
                    {new Date(order.fecha).toLocaleDateString('es-CL', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-white/60 text-sm">{order.ordenes} {order.ordenes === 1 ? 'orden' : 'órdenes'}</p>
                </div>
                <span className="text-green-400 font-bold text-lg">
                  ${parseFloat(order.ingresos).toLocaleString()}
                </span>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8 text-white/60">
              No hay ventas en los últimos 7 días
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default DashboardStats
