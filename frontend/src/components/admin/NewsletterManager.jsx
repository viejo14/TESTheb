import { useState, useEffect } from 'react'
import { HiMail, HiUserGroup, HiRefresh } from 'react-icons/hi'

const NewsletterManager = () => {
  const [subscribers, setSubscribers] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, active, unsubscribed
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [filter])

  const fetchData = async () => {
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')

      // Fetch stats
      const statsResponse = await fetch('/api/newsletter/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const statsData = await statsResponse.json()

      if (statsData.success) {
        setStats(statsData.data)
      }

      // Fetch subscribers
      const filterParam = filter !== 'all' ? `?status=${filter}` : ''
      const subscribersResponse = await fetch(`/api/newsletter/subscribers${filterParam}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const subscribersData = await subscribersResponse.json()

      if (subscribersData.success) {
        setSubscribers(subscribersData.data.subscribers)
      } else {
        setError(subscribersData.message)
      }

    } catch (err) {
      setError('Error al cargar datos del newsletter')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <HiMail className="text-yellow-400" />
            Newsletter
          </h2>
          <p className="text-text-muted text-sm mt-1">
            Administra los suscriptores del newsletter
          </p>
        </div>
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
        >
          <HiRefresh className="w-4 h-4" />
          Actualizar
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-bg-primary/50 border border-gray-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Total</p>
                <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
              </div>
              <HiUserGroup className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-bg-primary/50 border border-gray-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Activos</p>
                <p className="text-2xl font-bold text-green-400">{stats.active}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-green-400/20 flex items-center justify-center">
                <span className="text-green-400 text-xl">✓</span>
              </div>
            </div>
          </div>

          <div className="bg-bg-primary/50 border border-gray-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Últimos 7 días</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.last7Days}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-yellow-400/20 flex items-center justify-center">
                <span className="text-yellow-400 text-xl">7</span>
              </div>
            </div>
          </div>

          <div className="bg-bg-primary/50 border border-gray-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Últimos 30 días</p>
                <p className="text-2xl font-bold text-purple-400">{stats.last30Days}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-purple-400/20 flex items-center justify-center">
                <span className="text-purple-400 text-xl">30</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'all'
              ? 'bg-yellow-400 text-black font-semibold'
              : 'bg-gray-800 text-text-muted hover:bg-gray-700'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'active'
              ? 'bg-yellow-400 text-black font-semibold'
              : 'bg-gray-800 text-text-muted hover:bg-gray-700'
          }`}
        >
          Activos
        </button>
        <button
          onClick={() => setFilter('unsubscribed')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'unsubscribed'
              ? 'bg-yellow-400 text-black font-semibold'
              : 'bg-gray-800 text-text-muted hover:bg-gray-700'
          }`}
        >
          Desuscritos
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Subscribers Table */}
      <div className="bg-bg-primary/50 border border-gray-500/20 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Suscrito
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Desuscrito
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-500/20">
              {subscribers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-text-muted">
                    No hay suscriptores para mostrar
                  </td>
                </tr>
              ) : (
                subscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <HiMail className="text-yellow-400" />
                        <span className="text-text-primary">{subscriber.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        subscriber.status === 'active'
                          ? 'bg-green-400/20 text-green-400'
                          : 'bg-red-400/20 text-red-400'
                      }`}>
                        {subscriber.status === 'active' ? 'Activo' : 'Desuscrito'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-text-muted text-sm">
                      {formatDate(subscriber.subscribed_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-text-muted text-sm">
                      {subscriber.unsubscribed_at ? formatDate(subscriber.unsubscribed_at) : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default NewsletterManager
