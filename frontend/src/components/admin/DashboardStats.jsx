import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Componente DonutChart para ventas por categoría
const DonutChart = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  // Calcular totales
  const totalIngresos = data.reduce((sum, cat) => sum + parseFloat(cat.ingresos), 0)
  const totalProductos = data.reduce((sum, cat) => sum + parseInt(cat.productos_vendidos), 0)

  // Colores vibrantes para el gráfico
  const colors = [
    '#facc15', // yellow-400
    '#f59e0b', // amber-500
    '#ef4444', // red-500
    '#ec4899', // pink-500
    '#8b5cf6', // violet-500
    '#3b82f6', // blue-500
    '#06b6d4', // cyan-500
    '#10b981', // emerald-500
    '#84cc16', // lime-500
    '#f97316', // orange-500
  ]

  // Filtrar categorías con ventas y calcular ángulos para cada segmento
  const filteredData = data.filter(cat => parseInt(cat.productos_vendidos) > 0)

  let currentAngle = -90 // Empezar desde arriba
  const segments = filteredData.map((category, index) => {
    // Calcular porcentaje basado en CANTIDAD vendida, no en dinero
    const percentage = (parseInt(category.productos_vendidos) / totalProductos) * 100
    const angle = (percentage / 100) * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    currentAngle = endAngle

    return {
      ...category,
      percentage,
      startAngle,
      endAngle,
      color: colors[index % colors.length]
    }
  })

  // Función para crear el path del arco
  const createArc = (startAngle, endAngle, innerRadius, outerRadius) => {
    const start = polarToCartesian(50, 50, outerRadius, endAngle)
    const end = polarToCartesian(50, 50, outerRadius, startAngle)
    const innerStart = polarToCartesian(50, 50, innerRadius, endAngle)
    const innerEnd = polarToCartesian(50, 50, innerRadius, startAngle)

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'

    return [
      `M ${start.x} ${start.y}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
      `L ${innerEnd.x} ${innerEnd.y}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${innerStart.x} ${innerStart.y}`,
      'Z'
    ].join(' ')
  }

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees * Math.PI) / 180
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
      {/* Donut Chart SVG */}
      <div className="relative w-full max-w-[280px] md:max-w-[320px] lg:max-w-[360px] aspect-square">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {segments.map((segment, index) => (
            <motion.path
              key={segment.categoria}
              d={createArc(segment.startAngle, segment.endAngle, 25, 45)}
              fill={segment.color}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.05, ease: 'easeOut' }}
              className="cursor-pointer transition-all duration-200"
              style={{
                filter: hoveredIndex === index ? 'brightness(1.2) drop-shadow(0 0 8px rgba(250, 204, 21, 0.6))' : 'none',
                transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
                transformOrigin: '50% 50%'
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          ))}
        </svg>

        {/* Centro del donut con total */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-white/60 text-xs md:text-sm font-medium">Total Vendido</p>
          <p className="text-white font-bold text-xl md:text-2xl lg:text-3xl">{totalProductos}</p>
          <p className="text-green-400 text-xs md:text-sm font-semibold mt-1">
            ${totalIngresos.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Leyenda */}
      <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 md:gap-3 max-h-[400px] overflow-y-auto">
        {segments.map((segment, index) => (
          <motion.div
            key={segment.categoria}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`relative flex items-center gap-3 p-2 md:p-3 rounded-lg transition-all duration-300 cursor-pointer overflow-hidden ${
              hoveredIndex === index ? 'bg-gray-700/70 scale-[1.02] shadow-lg' : 'bg-gray-800/30'
            }`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Color indicator */}
            <div
              className="w-4 h-4 md:w-5 md:h-5 rounded-full flex-shrink-0 ring-2 ring-gray-700 transition-all duration-300"
              style={{
                backgroundColor: segment.color,
                boxShadow: hoveredIndex === index ? `0 0 12px ${segment.color}` : 'none'
              }}
            />

            {/* Info - Vista por defecto (solo nombre) */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-xs md:text-sm truncate transition-all duration-300"
                 title={segment.categoria}
                 style={{
                   transform: hoveredIndex === index ? 'translateY(-4px)' : 'translateY(0)'
                 }}>
                {segment.categoria}
              </p>

              {/* Detalles - Solo visible en hover */}
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{
                  opacity: hoveredIndex === index ? 1 : 0,
                  height: hoveredIndex === index ? 'auto' : 0
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-white/80 text-[10px] md:text-xs font-medium">
                    {parseInt(segment.productos_vendidos)} vendidos
                  </p>
                  <span className="text-white/30">•</span>
                  <p className="text-green-400 text-[10px] md:text-xs font-semibold">
                    ${parseFloat(segment.ingresos).toLocaleString()}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Porcentaje - Más visible en hover */}
            <div className="text-right flex-shrink-0">
              <motion.p
                className="text-yellow-400 font-bold transition-all duration-300"
                style={{
                  fontSize: hoveredIndex === index ? '1.125rem' : '0.875rem', // text-lg : text-sm
                  opacity: hoveredIndex === index ? 1 : 0.7
                }}
              >
                {segment.percentage.toFixed(1)}%
              </motion.p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

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

      // Obtener estadísticas del dashboard y de órdenes en paralelo
      const [dashboardResponse, ordersResponse] = await Promise.all([
        axios.get(`${API_URL}/stats/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/orders/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => ({ data: { data: null } })) // Si falla, retornar null
      ])

      setStats({
        ...dashboardResponse.data.data,
        ordersStats: ordersResponse.data.data
      })
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
      title: 'Órdenes del Mes',
      value: stats.ordersStats?.orders_this_month || stats.salesStats?.total_ordenes || 0,
      subtitle: stats.ordersStats?.pending_orders ? `${stats.ordersStats.pending_orders} pendientes` : null,
      icon: '📦',
      color: 'bg-blue-500/20 border-blue-400'
    },
    {
      title: 'Ingresos del Mes',
      value: `$${parseFloat(stats.ordersStats?.revenue_this_month || stats.salesStats?.ingresos_totales || 0).toLocaleString()}`,
      icon: '💰',
      color: 'bg-green-500/20 border-green-400'
    },
    {
      title: 'Ticket Promedio',
      value: `$${Math.round(parseFloat(stats.ordersStats?.average_order_value || stats.salesStats?.ticket_promedio || 0)).toLocaleString()}`,
      icon: '🎫',
      color: 'bg-purple-500/20 border-purple-400'
    },
    {
      title: 'Ventas Hoy',
      value: stats.ordersStats?.orders_today || 0,
      subtitle: stats.ordersStats?.revenue_today ? `$${parseFloat(stats.ordersStats.revenue_today).toLocaleString()}` : null,
      icon: '📊',
      color: 'bg-orange-500/20 border-orange-400'
    },
    {
      title: 'Productos en Stock',
      value: stats.inventoryStats?.total_stock || 0,
      subtitle: stats.inventoryStats?.productos_sin_stock ? `${stats.inventoryStats.productos_sin_stock} sin stock` : null,
      icon: '🏪',
      color: 'bg-cyan-500/20 border-cyan-400'
    }
  ]

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            className={`p-4 md:p-6 bg-bg-primary/80 border-2 rounded-xl backdrop-blur-sm transition-all duration-200 ease-out hover:scale-105 hover:shadow-lg ${stat.color}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-white/70 text-xs md:text-sm font-medium truncate">{stat.title}</p>
                <p className="text-xl md:text-2xl font-bold text-white mt-1 break-words">{stat.value}</p>
                {stat.subtitle && (
                  <p className="text-white/60 text-xs mt-1 truncate">{stat.subtitle}</p>
                )}
              </div>
              <div className="text-2xl md:text-3xl flex-shrink-0">{stat.icon}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Top 10 Productos Más Vendidos */}
      <motion.div
        className="bg-primary/80 border-2 border-gray-500/30 rounded-xl p-4 md:p-6 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 md:mb-6">
          <h3 className="text-lg md:text-xl font-bold text-white">🏆 Top 10 Productos Más Vendidos</h3>
          <button
            onClick={fetchStats}
            className="px-3 py-1.5 text-xs md:text-sm bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors self-start sm:self-auto"
          >
            🔄 Actualizar
          </button>
        </div>

        <div className="space-y-2 md:space-y-3">
          {stats.topProducts && stats.topProducts.length > 0 ? (
            stats.topProducts.map((product, index) => (
              <motion.div
                key={product.id}
                className="flex items-center gap-2 md:gap-4 p-3 md:p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-all duration-150 ease-out"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
              >
                {/* Posición */}
                <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold text-xs md:text-sm flex-shrink-0 ${
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
                    className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-lg flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-400 text-sm md:text-base">📦</span>
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm md:text-base truncate">{product.name}</p>
                  <p className="text-white/60 text-xs md:text-sm truncate">{product.category_name || 'Sin categoría'}</p>
                </div>

                {/* Stats */}
                <div className="text-right flex-shrink-0">
                  <p className="text-yellow-400 font-bold text-sm md:text-lg whitespace-nowrap">
                    {product.total_vendido} <span className="hidden sm:inline">vendidos</span>
                  </p>
                  <p className="text-green-400 text-xs md:text-sm whitespace-nowrap">
                    ${parseFloat(product.ingresos_totales).toLocaleString()}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8 md:py-12 text-white/60">
              <p className="text-base md:text-lg mb-2">📭 No hay ventas registradas aún</p>
              <p className="text-xs md:text-sm">Los productos más vendidos aparecerán aquí</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Ventas por Categoría - Gráfico Donut Moderno */}
      <motion.div
        className="bg-primary/80 border-2 border-gray-500/30 rounded-xl p-4 md:p-6 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h3 className="text-lg md:text-xl font-bold text-white mb-6 md:mb-8">🍩 Ventas por Categoría</h3>

        {stats.salesByCategory && stats.salesByCategory.length > 0 ? (
          <DonutChart data={stats.salesByCategory} />
        ) : (
          <div className="text-center py-8 md:py-12 text-white/60">
            <p className="text-sm md:text-base">No hay ventas por categoría registradas</p>
          </div>
        )}
      </motion.div>

      {/* Ventas Recientes (Últimos 7 días) */}
      <motion.div
        className="bg-bg-primary/80 border-2 border-gray-500/30 rounded-xl p-4 md:p-6 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <h3 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6">📅 Ventas de los Últimos 7 Días</h3>
        <div className="space-y-2 md:space-y-3">
          {stats.recentOrders && stats.recentOrders.length > 0 ? (
            stats.recentOrders.map((order, index) => (
              <motion.div
                key={order.fecha}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 md:p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-all duration-150"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm md:text-base truncate sm:whitespace-normal">
                    {new Date(order.fecha).toLocaleDateString('es-CL', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-white/60 text-xs md:text-sm">{order.ordenes} {order.ordenes === 1 ? 'orden' : 'órdenes'}</p>
                </div>
                <span className="text-green-400 font-bold text-base md:text-lg self-start sm:self-auto whitespace-nowrap">
                  ${parseFloat(order.ingresos).toLocaleString()}
                </span>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8 md:py-12 text-white/60">
              <p className="text-sm md:text-base">No hay ventas en los últimos 7 días</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default DashboardStats
