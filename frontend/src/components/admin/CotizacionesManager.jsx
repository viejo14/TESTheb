import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  getAllCotizaciones,
  updateCotizacion,
  deleteCotizacion,
  getCotizacionStats,
  updateBulkStatus
} from '../../services/cotizacionService'
import Pagination from '../Pagination'

const CotizacionesManager = () => {
  const [cotizaciones, setCotizaciones] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedCotizaciones, setSelectedCotizaciones] = useState([])
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 10
  })

  useEffect(() => {
    fetchCotizaciones()
    fetchStats()
  }, [filters, pagination.currentPage])

  const fetchCotizaciones = async () => {
    setLoading(true)
    try {
      const params = {
        page: pagination.currentPage,
        limit: pagination.limit,
        ...(filters.status && { status: filters.status }),
        ...(filters.search && { search: filters.search })
      }
      const response = await getAllCotizaciones(params)
      setCotizaciones(response.data || [])
      setPagination(prev => ({
        ...prev,
        totalPages: response.pagination?.totalPages || 1
      }))
    } catch (error) {
      console.error('Error fetching cotizaciones:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await getCotizacionStats()
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateCotizacion(id, { status: newStatus })
      fetchCotizaciones()
      fetchStats()
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Error al actualizar el estado')
    }
  }

  const handleBulkStatusChange = async (newStatus) => {
    if (selectedCotizaciones.length === 0) {
      alert('Selecciona al menos una cotización')
      return
    }

    try {
      await updateBulkStatus(selectedCotizaciones, newStatus)
      setSelectedCotizaciones([])
      fetchCotizaciones()
      fetchStats()
    } catch (error) {
      console.error('Error updating bulk status:', error)
      alert('Error al actualizar estados')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta cotización?')) return

    try {
      await deleteCotizacion(id)
      fetchCotizaciones()
      fetchStats()
    } catch (error) {
      console.error('Error deleting cotización:', error)
      alert('Error al eliminar cotización')
    }
  }

  const toggleSelectCotizacion = (id) => {
    setSelectedCotizaciones(prev =>
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    )
  }

  const getStatusColor = (status) => {
    const colors = {
      pendiente: 'bg-yellow-400 text-yellow-800',
      aprobada: 'bg-green-100 text-green-800',
      rechazada: 'bg-red-100 text-red-800',
      en_proceso: 'bg-blue-100 text-blue-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status) => {
    const labels = {
      pendiente: 'Pendiente',
      aprobada: 'Aprobada',
      rechazada: 'Rechazada',
      en_proceso: 'En Proceso'
    }
    return labels[status] || status
  }

  if (loading && cotizaciones.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary p-6 rounded-lg shadow-md border border-gray-400/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-100 text-sm">Total Cotizaciones</p>
                <p className="text-3xl font-bold text-gray-300">{stats.totalCotizaciones}</p>
              </div>
              <div className="text-4xl">📝</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-primary p-6 rounded-lg shadow-md border border-gray-400/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-100 text-sm">Últimos 30 días</p>
                <p className="text-3xl font-bold text-gray-300">{stats.recentCotizaciones}</p>
              </div>
              <div className="text-4xl">📅</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-primary p-6 rounded-lg shadow-md border border-gray-400/30"
          >
            <div>
              <p className="text-gray-100 text-sm mb-2">Por Estado</p>
              <div className="space-y-1">
                {stats.cotizacionesByStatus.map(item => (
                  <div key={item.status} className="flex justify-between text-sm text-gray-300">
                    <span className="capitalize">{getStatusLabel(item.status)}:</span>
                    <span className="font-semibold">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Filters and Bulk Actions */}
      <div className="bg-primary p-4 rounded-lg shadow-md border border-gray-400/30">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col md:flex-row gap-3 flex-1">
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="bg-gray-800 px-4 py-2 text-zinc-100  border border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600"
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="en_proceso">En Proceso</option>
              <option value="aprobada">Aprobada</option>
              <option value="rechazada">Rechazada</option>
            </select>

            <input
              type="text"
              placeholder="Buscar por nombre, email o mensaje..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="bg-gray-800 flex-1 px-4 py-2 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500 text-zinc-100"
            />
          </div>

          {selectedCotizaciones.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkStatusChange('aprobada')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Aprobar ({selectedCotizaciones.length})
              </button>
              <button
                onClick={() => handleBulkStatusChange('rechazada')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Rechazar ({selectedCotizaciones.length})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cotizaciones Table */}
      <div className="bg-zinc-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-900">
            <thead className="bg-gray-400/10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCotizaciones(cotizaciones.map(c => c.id))
                      } else {
                        setSelectedCotizaciones([])
                      }
                    }}
                    checked={selectedCotizaciones.length === cotizaciones.length && cotizaciones.length > 0}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Mensaje
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Imagen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-zinc-800 divide-y divide-gray-600">
              <AnimatePresence>
                {cotizaciones.map((cotizacion) => (
                  <motion.tr
                    key={cotizacion.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedCotizaciones.includes(cotizacion.id)}
                        onChange={() => toggleSelectCotizacion(cotizacion.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-100">{cotizacion.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        href={`mailto:${cotizacion.email}?subject=Respuesta a cotización - TESTheb&body=Hola ${cotizacion.name},%0A%0AGracias por tu solicitud de cotización.%0A%0ASaludos,%0ATESTheb`}
                        className="text-gray-100 hover:text-blue-900 text-sm flex items-center gap-1 hover:underline transition-colors"
                        title="Enviar email al cliente"
                      >
                        📧 {cotizacion.email}
                      </a>
                      {cotizacion.phone && (
                        <a
                          href={`https://wa.me/56${cotizacion.phone.replace(/[^0-9]/g, '')}?text=Hola ${cotizacion.name}, gracias por contactarnos. Te respondo con respecto a tu cotización.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-100 hover:text-green-800 text-sm flex items-center gap-1 hover:underline transition-colors mt-1"
                          title="Enviar WhatsApp al cliente"
                        >
                          📱 {cotizacion.phone}
                        </a>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-100 max-w-xs truncate" title={cotizacion.message}>
                        {cotizacion.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {cotizacion.image_url ? (
                        <a
                          href={cotizacion.image_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <img
                            src={cotizacion.image_url}
                            alt="Referencia"
                            className="w-16 h-16 object-cover rounded border border-gray-300"
                          />
                        </a>
                      ) : (
                        <span className="text-gray-400 text-xs">Sin imagen</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={cotizacion.status}
                        onChange={(e) => handleStatusChange(cotizacion.id, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(cotizacion.status)}`}
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="en_proceso">En Proceso</option>
                        <option value="aprobada">Aprobada</option>
                        <option value="rechazada">Rechazada</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                      {new Date(cotizacion.created_at).toLocaleDateString('es-CL')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleDelete(cotizacion.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        🗑️
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={(page) => setPagination(prev => ({ ...prev, currentPage: page }))}
          />
        )}
      </div>

      {cotizaciones.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No se encontraron cotizaciones</p>
        </div>
      )}
    </div>
  )
}

export default CotizacionesManager
