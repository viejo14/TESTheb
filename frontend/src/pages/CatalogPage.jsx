import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { fetchProducts, fetchProductsByCategory, searchProducts, fetchCategories } from '../services/api'
import './CatalogPage.css'

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
      <div className="catalog-page">
        <div className="loading">
          <div className="loading__spinner"></div>
          <p>Cargando productos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="catalog-page">
      <div className="container">
        {/* Page Header */}
        <div className="catalog-header">
          <h1 className="catalog-title">{getPageTitle()}</h1>
          <p className="catalog-subtitle">{getPageSubtitle()}</p>
        </div>

        {/* Filters Section */}
        <div className="catalog-filters">
          <div className="filters-section">
            <h3>Filtrar por categoría:</h3>
            <div className="category-filters">
              <button
                className={`filter-button ${!currentCategory ? 'filter-button--active' : ''}`}
                onClick={() => handleCategoryFilter(null)}
              >
                Todas
              </button>
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`filter-button ${currentCategory?.id === category.id ? 'filter-button--active' : ''}`}
                  onClick={() => handleCategoryFilter(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {(currentCategory || searchQuery) && (
            <div className="active-filters">
              <button
                className="clear-filters-button"
                onClick={clearFilters}
              >
                Limpiar filtros ✕
              </button>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="catalog-content">
          {error ? (
            <div className="error">
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>
                Intentar nuevamente
              </button>
            </div>
          ) : products.length > 0 ? (
            <div className="products-grid">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="no-products">
              <div className="no-products__icon">📦</div>
              <h3>No se encontraron productos</h3>
              <p>
                {searchQuery
                  ? `No hay productos que coincidan con "${searchQuery}"`
                  : currentCategory
                  ? `No hay productos en la categoría "${currentCategory.name}"`
                  : 'No hay productos disponibles en este momento'
                }
              </p>
              {(searchQuery || currentCategory) && (
                <button
                  className="view-all-button"
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