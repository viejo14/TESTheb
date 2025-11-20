import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const OrderDetailModal = ({ order, onClose, onOrderUpdated }) => {
  const [orderDetail, setOrderDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [newStatus, setNewStatus] = useState(order.status)
  const [showCodeReference, setShowCodeReference] = useState(false)

  // Cargar detalle completo de la orden
  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        const response = await axios.get(`${API_URL}/orders/${order.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (response.data.success) {
          setOrderDetail(response.data.data)
        }
      } catch (error) {
        console.error('Error fetching order detail:', error)
        alert('Error al cargar el detalle de la orden')
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetail()
  }, [order.id])

  // Actualizar estado de la orden
  const handleUpdateStatus = async () => {
    if (newStatus === order.status) {
      alert('Selecciona un estado diferente')
      return
    }

    const confirmed = window.confirm(
      `¿Estás seguro de cambiar el estado a "${getStatusLabel(newStatus)}"?`
    )

    if (!confirmed) return

    try {
      setUpdatingStatus(true)
      const token = localStorage.getItem('token')
      const response = await axios.put(`${API_URL}/orders/${order.id}/status`, {
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data.success) {
        alert('Estado actualizado exitosamente')
        onOrderUpdated()
      } else {
        alert('Error al actualizar estado: ' + response.data.message)
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Error al actualizar el estado de la orden')
    } finally {
      setUpdatingStatus(false)
    }
  }

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price)
  }

  // Obtener etiqueta de estado
  const getStatusLabel = (status) => {
    const labels = {
      created: 'Creada',
      pending: 'Pendiente',
      authorized: 'Autorizada',
      confirmed: 'Confirmada',
      processing: 'Procesando',
      shipped: 'Enviada',
      delivered: 'Entregada',
      cancelled: 'Cancelada',
      failed: 'Fallida'
    }
    return labels[status] || status
  }

  // Obtener descripción del código de respuesta de Transbank
  const getResponseCodeDescription = (code) => {
    const descriptions = {
      0: { text: 'Transacción aprobada', color: 'text-green-400', icon: '✓' },
      '-1': { text: 'Rechazo de transacción', color: 'text-red-400', icon: '✗' },
      '-2': { text: 'Transacción debe reintentarse', color: 'text-yellow-400', icon: '⚠' },
      '-3': { text: 'Error en transacción', color: 'text-red-400', icon: '✗' },
      '-4': { text: 'Rechazo de transacción', color: 'text-red-400', icon: '✗' },
      '-5': { text: 'Rechazo por error de tasa', color: 'text-red-400', icon: '✗' },
      '-6': { text: 'Excede cupo máximo mensual', color: 'text-orange-400', icon: '⚠' },
      '-7': { text: 'Excede límite diario por transacción', color: 'text-orange-400', icon: '⚠' },
      '-8': { text: 'Rubro no autorizado', color: 'text-red-400', icon: '✗' }
    }
    return descriptions[code] || descriptions[String(code)] || { text: 'Desconocido', color: 'text-gray-400', icon: '?' }
  }

  // Obtener nombre del tipo de pago
  const getPaymentTypeName = (code) => {
    const types = {
      'VD': 'Débito',
      'VN': 'Crédito',
      'VC': 'Crédito en cuotas',
      'SI': 'Crédito 3 cuotas sin interés',
      'S2': 'Crédito 2 cuotas sin interés',
      'NC': 'Crédito sin interés'
    }
    return types[code] || code
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
      <span className={`${config.bg} text-white px-4 py-2 rounded-full text-sm font-semibold`}>
        {config.text}
      </span>
    )
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-zinc-800 border-2 border-gray-500/30 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-yellow-500 border-b border-gray-700 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-zinc-800">Detalle de Orden</h2>
            <p className="text-gray-800 mt-1">Orden #{order.buy_order}</p>
          </div>
          <button
            onClick={onClose}
            className="text-black hover:text-white transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-800">Cargando detalle...</p>
          </div>
        ) : orderDetail ? (
          <div className="p-6 space-y-6">
            {/* Estado y Actualización */}
            <div className="bg-gray-800/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Estado de la Orden</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Estado actual
                  </label>
                  <div>{getStatusBadge(orderDetail.status)}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cambiar estado
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                    >
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
                    <button
                      onClick={handleUpdateStatus}
                      disabled={updatingStatus || newStatus === orderDetail.status}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                    >
                      {updatingStatus ? 'Actualizando...' : 'Actualizar'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Información del Cliente */}
            <div className="bg-gray-800/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Información del Cliente</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Nombre</label>
                  <p className="text-white">{orderDetail.customer_name || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                  {orderDetail.customer_email ? (
                    <a
                      href={`mailto:${orderDetail.customer_email}?subject=Consulta sobre orden ${orderDetail.buy_order}&body=Hola ${orderDetail.customer_name || 'Cliente'},%0A%0AMe contacto con respecto a su orden ${orderDetail.buy_order}.%0A%0ASaludos,%0ATESTheb`}
                      className="text-blue-400 hover:text-blue-300 flex items-center gap-2 hover:underline transition-colors"
                      title="Enviar email al cliente"
                    >
                      📧 {orderDetail.customer_email}
                    </a>
                  ) : (
                    <p className="text-gray-400">N/A</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Teléfono</label>
                  {orderDetail.customer_phone ? (
                    <a
                      href={`https://wa.me/56${orderDetail.customer_phone.replace(/[^0-9]/g, '')}?text=Hola ${orderDetail.customer_name || 'Cliente'}, me contacto desde TESTheb con respecto a su orden ${orderDetail.buy_order}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-400 hover:text-green-300 flex items-center gap-2 hover:underline transition-colors"
                      title="Enviar WhatsApp al cliente"
                    >
                      📱 {orderDetail.customer_phone}
                    </a>
                  ) : (
                    <p className="text-gray-400">N/A</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Ciudad</label>
                  <p className="text-white">{orderDetail.shipping_city || 'N/A'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Dirección de Envío</label>
                  <p className="text-white">{orderDetail.shipping_address || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Información de la Orden */}
            <div className="bg-gray-800/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Información de la Orden</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">N° de Orden</label>
                  <p className="text-yellow-400 font-mono">{orderDetail.buy_order}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Fecha de Creación</label>
                  <p className="text-white">{formatDate(orderDetail.created_at)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Última Actualización</label>
                  <p className="text-white">{formatDate(orderDetail.updated_at)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">ID de Sesión</label>
                  <p className="text-white font-mono text-sm">{orderDetail.session_id || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Información del Pago */}
            {orderDetail.authorization_code && (
              <div className="bg-gray-800/50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Información del Pago</h3>
                  <button
                    onClick={() => setShowCodeReference(!showCodeReference)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
                  >
                    <span>ℹ️</span>
                    {showCodeReference ? 'Ocultar' : 'Ver'} códigos de respuesta
                  </button>
                </div>

                {/* Referencia de códigos colapsable */}
                {showCodeReference && (
                  <div className="mb-4 bg-gray-900/50 rounded-lg p-4 border border-blue-500/30">
                    <h4 className="text-sm font-semibold text-blue-400 mb-3">📋 Referencia de Códigos de Respuesta Transbank</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-green-400 font-mono">0</span>
                        <span className="text-gray-300">→ Transacción aprobada ✓</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-red-400 font-mono">-1</span>
                        <span className="text-gray-300">→ Rechazo de transacción ✗</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400 font-mono">-2</span>
                        <span className="text-gray-300">→ Debe reintentarse ⚠</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-red-400 font-mono">-3</span>
                        <span className="text-gray-300">→ Error en transacción ✗</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-red-400 font-mono">-4</span>
                        <span className="text-gray-300">→ Rechazo de transacción ✗</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-red-400 font-mono">-5</span>
                        <span className="text-gray-300">→ Rechazo por error de tasa ✗</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-orange-400 font-mono">-6</span>
                        <span className="text-gray-300">→ Excede cupo máximo mensual ⚠</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-orange-400 font-mono">-7</span>
                        <span className="text-gray-300">→ Excede límite diario ⚠</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-red-400 font-mono">-8</span>
                        <span className="text-gray-300">→ Rubro no autorizado ✗</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <p className="text-xs text-gray-400">
                        <strong className="text-blue-400">Tipos de Pago:</strong> VD = Débito | VN = Crédito | VC = Crédito en cuotas | SI = 3 cuotas sin interés
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Código de Autorización</label>
                    <p className="text-green-400 font-mono">{orderDetail.authorization_code}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Código de Respuesta</label>
                    {orderDetail.response_code !== undefined && orderDetail.response_code !== null ? (
                      <div className="flex items-center gap-2">
                        <span className="text-white font-mono">{orderDetail.response_code}</span>
                        <span className={`${getResponseCodeDescription(orderDetail.response_code).color} font-medium`}>
                          {getResponseCodeDescription(orderDetail.response_code).icon} {getResponseCodeDescription(orderDetail.response_code).text}
                        </span>
                      </div>
                    ) : (
                      <p className="text-gray-400">N/A</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Tipo de Pago</label>
                    <p className="text-white">
                      {orderDetail.payment_type_code ? (
                        <>
                          {getPaymentTypeName(orderDetail.payment_type_code)}
                          {orderDetail.payment_type_code !== getPaymentTypeName(orderDetail.payment_type_code) && (
                            <span className="text-gray-400 text-xs ml-2">({orderDetail.payment_type_code})</span>
                          )}
                        </>
                      ) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Últimos 4 dígitos</label>
                    <p className="text-white">{orderDetail.card_last4 ? `**** ${orderDetail.card_last4}` : 'N/A'}</p>
                  </div>
                  {(orderDetail.installments_number || 0) > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Cuotas</label>
                      <p className="text-white">{orderDetail.installments_number}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Productos */}
            <div className="bg-gray-800/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Productos ({orderDetail.items?.length || 0})</h3>
              {orderDetail.items && orderDetail.items.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-900/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Producto</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase">SKU</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-300 uppercase">Cantidad</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-300 uppercase">Precio Unit.</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-300 uppercase">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {orderDetail.items.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-700/30">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              {item.product_image && (
                                <img
                                  src={item.product_image}
                                  alt={item.product_name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                              )}
                              <span className="text-white">{item.product_name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-gray-400 text-sm font-mono">{item.product_sku || '-'}</span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="text-white">{item.quantity}</span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="text-white">{formatPrice(item.price)}</span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="text-green-400 font-semibold">
                              {formatPrice(item.quantity * item.price)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-900/50">
                      <tr>
                        <td colSpan="4" className="px-4 py-3 text-right font-semibold text-white">
                          Total:
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-green-400 font-bold text-lg">
                            {formatPrice(orderDetail.total || orderDetail.amount)}
                          </span>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No hay productos en esta orden</p>
              )}
            </div>
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-gray-400">No se pudo cargar el detalle de la orden</p>
          </div>
        )}

        {/* Footer */}
        <div className="sticky bottom-0 bg-zinc-800 border-t border-gray-700 p-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            Cerrar
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default OrderDetailModal
