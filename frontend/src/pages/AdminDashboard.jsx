import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { Navigate, useSearchParams } from 'react-router-dom'
import { useAdminData } from '../hooks/useAdminData'
import ProductsManager from '../components/admin/ProductsManager'
import CategoriesManager from '../components/admin/CategoriesManager'
import CotizacionesManager from '../components/admin/CotizacionesManager'
import NewsletterManager from '../components/admin/NewsletterManager'
import DashboardStats from '../components/admin/DashboardStats'

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth()
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState('dashboard')

  // Leer el parámetro 'tab' de la URL al cargar
  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam && ['dashboard', 'products', 'categories', 'cotizaciones', 'newsletter'].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  // Use admin data hook without auto-refresh (manual refresh only)
  const adminData = useAdminData()

  // Redirect if not admin
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'products', name: 'Productos', icon: '🛍️' },
    { id: 'categories', name: 'Categorías', icon: '📂' },
    { id: 'cotizaciones', name: 'Cotizaciones', icon: '📝' },
    { id: 'newsletter', name: 'Newsletter', icon: '📧' }
  ]

  if (adminData.loading) {
    return (
      <div className="min-h-screen pt-40 pb-8 bg-gradient-to-br from-bg-primary to-bg-secondary">
        <div className="flex flex-col items-center justify-center min-h-96">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-text-primary text-lg">Cargando panel de administración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-40 pb-8 bg-gradient-to-br from-bg-primary to-bg-secondary">
      <div className="max-w-8xl mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Panel de Administración
              </h1>
              <p className="text-lg text-white/90">
                Bienvenido, {user?.name}
              </p>
            </div>
            <button
              onClick={() => adminData.refreshData()}
              disabled={adminData.isRefreshing}
              className="mt-4 md:mt-0 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 mx-auto md:mx-0 enabled:hover:scale-105 enabled:active:scale-95"
            >
              {adminData.isRefreshing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Actualizando...
                </>
              ) : (
                <>🔄 Actualizar Datos</>
              )}
            </button>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          className="bg-bg-primary/80 border-2 border-gray-500/30 rounded-xl mb-8 backdrop-blur-sm"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-wrap border-b border-gray-500/30">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`px-6 py-4 font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'text-yellow-400 border-b-2 border-yellow-400 bg-yellow-400/10'
                    : 'text-white hover:text-yellow-400 hover:bg-yellow-400/5'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="text-xl">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          {activeTab === 'dashboard' && (
            <DashboardStats />
          )}

          {activeTab === 'products' && (
            <ProductsManager
              products={adminData.products}
              categories={adminData.categories}
              onRefresh={adminData.refreshData}
              adminData={adminData}
            />
          )}

          {activeTab === 'categories' && (
            <CategoriesManager
              categories={adminData.categories}
              onRefresh={adminData.refreshData}
              adminData={adminData}
            />
          )}

          {activeTab === 'cotizaciones' && (
            <CotizacionesManager />
          )}

          {activeTab === 'newsletter' && (
            <NewsletterManager />
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default AdminDashboard