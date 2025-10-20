import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import OrderDetailModal from './OrderDetailModal'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const OrdersManager = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data.success) {
        setOrders(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      alert('Error al cargar las órdenes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // Filtrar órdenes
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buy_order?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = !filterStatus || order.status === filterStatus

    return matchesSearch && matchesStatus
  })

  // Ver detalle de orden
  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setShowDetailModal(true)
  }

  // Cerrar modal
  const closeDetailModal = () => {
    setShowDetailModal(false)
    setSelectedOrder(null)
  }

  // Actualizar estado después de cambios
  const handleOrderUpdated = () => {
    fetchOrders()
    closeDetailModal()
  }

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price)
  }

  // Badge de estado
  const getStatusBadge = (status) => {
    const statusConfig = {
      created: { bg: 'bg-gray-500', text: 'Creada' },
      pending: { bg: 'bg-yellow-500', text: 'Pendiente' },
      authorized: { bg: 'bg-green-500', text: 'Autorizada' },
      confirmed: { bg: 'bg-blue-500', text: 'Confirmada' },
      processing: { bg: 'bg-purple-500', text: 'Procesando' },
      shipped: { bg: 'bg-indigo-500', text: 'Enviada' },
      delivered: { bg: 'bg-teal-500', text: 'Entregada' },
      cancelled: { bg: 'bg-red-500', text: 'Cancelada' },
      failed: { bg: 'bg-red-700', text: 'Fallida' }
    }

    const config = statusConfig[status] || { bg: 'bg-gray-500', text: status }

    return (
      <span className={`${config.bg} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
        {config.text}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96">
        <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-text-primary text-lg">Cargando órdenes...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <motion.div
        className="bg-bg-primary/80 border-2 border-gray-500/30 rounded-xl p-6 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Gestión de Órdenes</h2>
            <p className="text-gray-400 mt-1">
              Total: {filteredOrders.length} {filteredOrders.length === 1 ? 'orden' : 'órdenes'}
            </p>
          </div>
          <button
            onClick={fetchOrders}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95"
          >
            🔄 Actualizar
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Buscar órdenes
            </label>
            <input
              type="text"
              placeholder="Buscar por cliente, email o N° de orden..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Filtrar por estado
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
            >
              <option value="">Todos los estados</option>
              <option value="created">Creada</option>
              <option value="pending">Pendiente</option>
              <option value="authorized">Autorizada</option>
              <option value="confirmed">Confirmada</option>
              <option value="processing">Procesando</option>
              <option value="shipped">Enviada</option>
              <option value="delivered">Entregada</option>
              <option value="cancelled">Cancelada</option>
              <option value="failed">Fallida</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Orders Table */}
      <motion.div
        className="bg-zinc border-2 border-gray-500/30 rounded-xl overflow-hidden backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400 text-lg">
              {searchTerm || filterStatus ? 'No se encontraron órdenes con los filtros aplicados' : 'No hay órdenes registradas'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    N° Orden
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Unidades
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                <AnimatePresence>
                  {filteredOrders.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      className="hover:bg-gray-800/30 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-yellow-400">
                          {order.buy_order}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-300">
                          {formatDate(order.created_at)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-white">
                            {order.customer_name || 'N/A'}
                          </div>
                          {order.customer_email ? (
                            <a
                              href={`mailto:${order.customer_email}?subject=Consulta sobre orden ${order.buy_order}`}
                              className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1 hover:underline transition-colors"
                              title="Enviar email al cliente"
                            >
                              📧 {order.customer_email}
                            </a>
                          ) : (
                            <div className="text-gray-400 text-xs">Sin email</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-300">
                          {order.items_count || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-green-400">
                          {formatPrice(order.total || order.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                        >
                          Ver Detalle
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={closeDetailModal}
            onOrderUpdated={handleOrderUpdated}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default OrdersManager
