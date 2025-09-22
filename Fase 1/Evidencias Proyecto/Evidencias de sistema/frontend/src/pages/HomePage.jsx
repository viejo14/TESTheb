import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import CategoryCard from '../components/CategoryCard'
import ProductCard from '../components/ProductCard'
import { fetchCategories, fetchProducts } from '../services/api'
import './HomePage.css'

const HomePage = () => {
  const [categories, setCategories] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
      <div className="homepage">
        <div className="loading">
          <div className="loading__spinner"></div>
          <p>Cargando...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="homepage">
        <div className="error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Intentar nuevamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__container">
          <h1 className="hero__title">
            Bordados de Calidad para Cada Ocasión
          </h1>
          <p className="hero__subtitle">
            Personaliza tus prendas con los mejores bordados profesionales
          </p>
          <Link to="/catalog" className="hero__cta">
            Ver Catálogo
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Nuestras Categorías</h2>
          <p className="section-subtitle">
            Encuentra el bordado perfecto para tu necesidad
          </p>

          {categories.length > 0 ? (
            <div className="categories-grid">
              {categories.map(category => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          ) : (
            <div className="no-data">
              <p>No hay categorías disponibles</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="featured-products">
          <div className="container">
            <h2 className="section-title">Productos Destacados</h2>
            <p className="section-subtitle">
              Algunos de nuestros trabajos más populares
            </p>

            <div className="products-grid">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="featured-products__footer">
              <Link to="/catalog" className="view-all-button">
                Ver Todos los Productos
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="about-preview">
        <div className="container">
          <h2 className="section-title">¿Por qué TESTheb?</h2>
          <div className="features-grid">
            <div className="feature">
              <div className="feature__icon">🏆</div>
              <h3 className="feature__title">Calidad Premium</h3>
              <p className="feature__description">
                Utilizamos las mejores técnicas y materiales para garantizar bordados duraderos
              </p>
            </div>
            <div className="feature">
              <div className="feature__icon">🎨</div>
              <h3 className="feature__title">Diseño Personalizado</h3>
              <p className="feature__description">
                Creamos diseños únicos adaptados a tus necesidades específicas
              </p>
            </div>
            <div className="feature">
              <div className="feature__icon">⚡</div>
              <h3 className="feature__title">Entrega Rápida</h3>
              <p className="feature__description">
                Procesos eficientes que garantizan tiempos de entrega competitivos
              </p>
            </div>
            <div className="feature">
              <div className="feature__icon">💼</div>
              <h3 className="feature__title">Experiencia</h3>
              <p className="feature__description">
                Años de experiencia trabajando con colegios, empresas y particulares
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage