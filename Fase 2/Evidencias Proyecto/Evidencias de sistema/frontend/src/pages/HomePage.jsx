import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import CategoryCarousel from '../components/CategoryCarousel'
import ProductCard from '../components/ProductCard'
import CotizacionForm from '../components/CotizacionForm'
import { fetchCategories, fetchProducts } from '../services/api'
import { HiStar, HiColorSwatch, HiLightBulb, HiBriefcase } from 'react-icons/hi'

const HomePage = () => {
  const [categories, setCategories] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showWelcome, setShowWelcome] = useState(false)
  const [userName, setUserName] = useState('')
  const [isNewUser, setIsNewUser] = useState(false)
  const [showCotizacionForm, setShowCotizacionForm] = useState(false)

  // Check for welcome message on mount
  useEffect(() => {
    const justLoggedIn = sessionStorage.getItem('justLoggedIn')
    const name = sessionStorage.getItem('userName')
    const newUser = sessionStorage.getItem('isNewUser')

    if (justLoggedIn === 'true' && name) {
      setShowWelcome(true)
      setUserName(name)
      setIsNewUser(newUser === 'true')

      // Clear the flags
      sessionStorage.removeItem('justLoggedIn')
      sessionStorage.removeItem('userName')
      sessionStorage.removeItem('isNewUser')

      // Hide welcome message after 4 seconds
      const timer = setTimeout(() => {
        setShowWelcome(false)
      }, 4000)

      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        // Load categories and products in parallel
        const [categoriesResponse, productsResponse] = await Promise.all([
          fetchCategories(),
          fetchProducts()
        ])

        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data)
        }

        if (productsResponse.success) {
          // Show first 4 products as featured
          setFeaturedProducts(productsResponse.data.slice(0, 4))
        }
      } catch (err) {
        setError('Error cargando los datos')
        console.error('Error loading data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg-primary to-bg-secondary">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-text-primary text-lg">Cargando...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg-primary to-bg-secondary">
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-bg-accent text-text-primary rounded-lg border-2 border-gray-600 hover:border-yellow-400 transition-all duration-300 hover:-translate-y-1"
          >
            Intentar nuevamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Welcome Toast */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0, y: -100, x: '-50%' }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
          >
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-lg shadow-2xl p-4 border-2 border-yellow-300">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <span className="text-2xl">{isNewUser ? '🎉' : '👋'}</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-lg">
                    {isNewUser ? '¡Bienvenido a TESTheb!' : '¡Bienvenido de nuevo!'}
                  </p>
                  <p className="text-sm text-gray-800">{userName}</p>
                </div>
                <button
                  onClick={() => setShowWelcome(false)}
                  className="flex-shrink-0 text-gray-700 hover:text-gray-900 text-xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cotizacion Form Modal */}
      {showCotizacionForm && (
        <CotizacionForm
          onClose={() => setShowCotizacionForm(false)}
          onSuccess={() => {
            setShowCotizacionForm(false)
          }}
        />
      )}

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center text-center text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/banner_servicios.jpg"
            alt="Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-5 w-full">
          <motion.img
            src="/testheb-logo.png"
            alt="TESTheb Logo"
            className="h-45 w-45 mb-8 object-cover rounded-full border-2 border-white shadow-2xl mx-auto transition-all duration-200 ease-out hover:scale-105 hover:shadow-[0_0_40px_rgba(251,191,36,0.8),0_0_80px_rgba(251,191,36,0.6),0_12px_35px_rgba(0,0,0,0.4)]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Bordados de Calidad para Cada Ocasión
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl mb-10 opacity-90 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Personaliza tus prendas con los mejores bordados profesionales
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link
              to="/catalog"
              className="inline-block px-8 py-4 bg-bg-accent/80 text-text-primary no-underline rounded-full border-2 border-gray-500/30 font-medium text-lg transition-all duration-300 backdrop-blur-sm hover:border-yellow-400 hover:bg-bg-accent/90 hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(251,191,36,0.2)]"
            >
              Ver Catálogo
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <motion.section
        className="py-20 bg-gradient-to-br from-bg-primary to-bg-secondary"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-8xl mx-auto px-4">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center text-text-primary mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Nuestras Categorías
          </motion.h2>
          <motion.p
            className="text-lg text-center text-text-secondary mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Encuentra el bordado perfecto para tu necesidad
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <CategoryCarousel categories={categories} />
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <motion.section
          className="py-20 bg-gradient-to-br from-zinc-800 to-zinc-900"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-8xl mx-auto px-4">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-center text-text-primary mb-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Productos Destacados
            </motion.h2>
            <motion.p
              className="text-lg text-center text-text-secondary mb-12 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Algunos de nuestros trabajos más populares
            </motion.p>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.1 * index
                  }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.h3
                className="text-2xl md:text-3xl font-bold text-text-primary mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                viewport={{ once: true }}
              >
                Explora nuestros productos
              </motion.h3>
              <Link
                to="/catalog"
                className="inline-block px-38 py-4 bg-bg-accent/80 text-text-primary no-underline rounded-full border-2 border-gray-500/30 font-medium transition-all duration-300 backdrop-blur-sm hover:border-yellow-400 hover:bg-bg-accent/90 hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(251,191,36,0.2)]"
              >
                Ver Todos los Productos
              </Link>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* Call to Action - Cotización */}
      <motion.section
        className="py-20 bg-gradient-to-br from-yellow-500 to-yellow-600"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            ¿Tienes un proyecto en mente?
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl text-gray-800 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Solicita una cotización personalizada y te responderemos a la brevedad
          </motion.p>
          <motion.button
            onClick={() => setShowCotizacionForm(true)}
            className="px-8 py-4 bg-gray-900 text-white rounded-full font-medium text-lg transition-all duration-300 hover:bg-gray-800 hover:-translate-y-1 hover:shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📝 Solicitar Cotización
          </motion.button>
        </div>
      </motion.section>

      {/* About Section */}
      <motion.section
        className="py-20 bg-gradient-to-br from-bg-primary to-bg-secondary"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-8xl mx-auto px-4">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center text-text-primary mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            ¿Por qué TESTheb?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {[
              {
                icon: HiStar,
                title: "Calidad Premium",
                description: "Utilizamos las mejores técnicas y materiales para garantizar bordados duraderos"
              },
              {
                icon: HiColorSwatch,
                title: "Diseño Personalizado",
                description: "Creamos diseños únicos adaptados a tus necesidades específicas"
              },
              {
                icon: HiLightBulb,
                title: "Entrega Rápida",
                description: "Procesos eficientes que garantizan tiempos de entrega competitivos"
              },
              {
                icon: HiBriefcase,
                title: "Experiencia",
                description: "Años de experiencia trabajando con colegios, empresas y particulares"
              }
            ].map((item, index) => {
              const IconComponent = item.icon
              return (
                <motion.div
                  key={index}
                  className="group text-center p-8 bg-bg-primary/80 border-2 border-gray-500/30 hover:border-yellow-400 rounded-xl shadow-xl h-70 flex flex-col justify-center backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-2 hover:shadow-[0_8px_25px_rgba(251,191,36,0.2)]"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    ease: "easeOut"
                  }}
                  viewport={{ once: true }}
                >
                  <div className="transition-transform duration-200 ease-out group-hover:-translate-y-1 group-hover:scale-105">
                    <IconComponent className="text-6xl mb-6 text-yellow-400 mx-auto block drop-shadow-lg" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-4">{item.title}</h3>
                  <p className="text-text-muted leading-relaxed">{item.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.section>
    </div>
  )
}

export default HomePage