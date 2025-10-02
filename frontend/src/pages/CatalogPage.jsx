import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProductCard from '../components/ProductCard'
import { fetchProducts, fetchProductsByCategory, searchProducts, fetchCategories } from '../services/api'

const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentCategory, setCurrentCategory] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Get URL parameters
  const categoryParam = searchParams.get('category')
  const searchParam = searchParams.get('search')

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchCategories()
        if (response.success) {
          setCategories(response.data)
        }
      } catch (err) {
        console.error('Error loading categories:', err)
      }
    }

    loadCategories()
  }, [])

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        let response

        if (searchParam) {
          // Search products
          setSearchQuery(searchParam)
          response = await searchProducts(searchParam)
          setCurrentCategory(null)
        } else if (categoryParam) {
          // Filter by category
          response = await fetchProductsByCategory(categoryParam)
          const category = categories.find(cat => cat.id === parseInt(categoryParam))
          setCurrentCategory(category)
          setSearchQuery('')
        } else {
          // Load all products
          response = await fetchProducts()
          setCurrentCategory(null)
          setSearchQuery('')
        }

        if (response.success) {
          setProducts(response.data)
        } else {
          setError('Error cargando productos')
        }
      } catch (err) {
        setError('Error cargando productos')
        console.error('Error loading products:', err)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [categoryParam, searchParam, categories])

  const handleCategoryFilter = (categoryId) => {
    if (categoryId) {
      setSearchParams({ category: categoryId })
    } else {
      setSearchParams({})
    }
  }

  const clearFilters = () => {
    setSearchParams({})
  }

  const getPageTitle = () => {
    if (searchQuery) {
      return `Resultados para "${searchQuery}"`
    }
    if (currentCategory) {
      return `Categoría: ${currentCategory.name}`
    }
    return 'Catálogo de Productos'
  }

  const getPageSubtitle = () => {
    if (searchQuery) {
      return `${products.length} producto${products.length !== 1 ? 's' : ''} encontrado${products.length !== 1 ? 's' : ''}`
    }
    if (currentCategory) {
      return currentCategory.description || `${products.length} producto${products.length !== 1 ? 's' : ''} en esta categoría`
    }
    return `Explora nuestros ${products.length} productos disponibles`
  }

  if (loading) {
    return (
      <div className="min-h-screen py-8 bg-gradient-to-br from-bg-primary to-bg-secondary">
        <div className="flex flex-col items-center justify-center min-h-96">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-text-primary text-lg">Cargando productos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-40 pb-8 bg-gradient-to-br from-bg-primary to-bg-secondary">
      <div className="max-w-7xl mx-auto px-4">
        {/* Page Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="text-3xl md:text-4xl font-bold text-white mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {getPageTitle()}
          </motion.h1>
          <motion.p
            className="text-lg text-white/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {getPageSubtitle()}
          </motion.p>
        </motion.div>

        {/* Filters Section */}
        <motion.div
          className="bg-bg-primary/80 border-2 border-gray-500/30 p-8 rounded-xl mb-12 backdrop-blur-sm"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="mb-6">
            <motion.h3
              className="text-lg font-semibold text-white mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Filtrar por categoría:
            </motion.h3>
            <div className="flex flex-wrap gap-3">
              <motion.button
                className={`px-6 py-3 border-2 rounded-full font-medium transition-all duration-300 backdrop-blur-sm ${
                  !currentCategory
                    ? 'bg-bg-accent/90 text-text-primary border-yellow-400 shadow-lg shadow-yellow-400/30'
                    : 'bg-bg-primary/80 text-text-primary border-gray-500/30 hover:border-yellow-400 hover:bg-bg-accent/90 hover:-translate-y-1 hover:shadow-lg hover:shadow-yellow-400/20'
                }`}
                onClick={() => handleCategoryFilter(null)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 1.0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Todas
              </motion.button>
              {categories.map((category, index) => (
                <motion.button
                  key={category.id}
                  className={`px-6 py-3 border-2 rounded-full font-medium transition-all duration-300 backdrop-blur-sm ${
                    currentCategory?.id === category.id
                      ? 'bg-bg-accent/90 text-text-primary border-yellow-400 shadow-lg shadow-yellow-400/30'
                      : 'bg-bg-primary/80 text-text-primary border-gray-500/30 hover:border-yellow-400 hover:bg-bg-accent/90 hover:-translate-y-1 hover:shadow-lg hover:shadow-yellow-400/20'
                  }`}
                  onClick={() => handleCategoryFilter(category.id)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 1.0 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category.name}
                </motion.button>
              ))}
            </div>
          </div>

          {(currentCategory || searchQuery) && (
            <motion.div
              className="pt-6 border-t border-gray-500/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 1.5 }}
            >
              <motion.button
                className="px-4 py-2 bg-red-600 text-white border-none rounded-full cursor-pointer text-sm font-medium transition-all duration-300 hover:bg-red-700 hover:-translate-y-1"
                onClick={clearFilters}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Limpiar filtros ✕
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Products Grid */}
        <div className="mt-8">
          {error ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <p className="text-red-400 text-lg mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-bg-accent text-text-primary rounded-lg border-2 border-gray-600 hover:border-yellow-400 transition-all duration-300 hover:-translate-y-1"
              >
                Intentar nuevamente
              </button>
            </div>
          ) : products.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.5 + index * 0.1
                  }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16 px-8 bg-red-600/50 rounded-xl">
              <div className="text-6xl mb-6 opacity-50">📦</div>
              <h3 className="text-xl text-gray-100 mb-4">¡No queda ningun producto!</h3>
              <p className="text-gray-300 text-lg mb-8 max-w-lg mx-auto">
                {searchQuery
                  ? `No hay productos que coincidan con "${searchQuery}"`
                  : currentCategory
                  ? `No hay productos en la categoría "${currentCategory.name}"`
                  : 'No hay productos disponibles en este momento'
                }           
              </p>
              {(searchQuery || currentCategory) && (
                <button
                  className="inline-block px-8 py-4 bg-bg-accent/80 text-text-primary no-underline rounded-full border-2 border-gray-600 font-medium transition-all duration-300 backdrop-blur-sm hover:border-yellow-400 hover:bg-bg-accent/90 hover:-translate-y-1 hover:shadow-lg hover:shadow-yellow-400/20"
                  onClick={clearFilters}
                >
                  Ver todos los productos
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CatalogPage