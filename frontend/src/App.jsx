import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import CatalogPage from './pages/CatalogPage'
import ProductDetailPage from './pages/ProductDetailPage'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />

              {/* Placeholder routes for future implementation */}
              <Route path="/about" element={<PlaceholderPage title="Acerca de Nosotros" />} />
              <Route path="/contact" element={<PlaceholderPage title="Contacto" />} />
              <Route path="/login" element={<PlaceholderPage title="Iniciar Sesión" />} />
              <Route path="/register" element={<PlaceholderPage title="Registrarse" />} />
              <Route path="/cart" element={<PlaceholderPage title="Carrito de Compras" />} />

              {/* 404 Page */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

// Placeholder component for future pages
const PlaceholderPage = ({ title }) => (
  <div className="placeholder-page">
    <div className="container">
      <h1>{title}</h1>
      <p>Esta página estará disponible próximamente.</p>
      <a href="/" className="back-home">Volver al inicio</a>
    </div>
  </div>
)

// 404 Page component
const NotFoundPage = () => (
  <div className="not-found-page">
    <div className="container">
      <h1>404 - Página no encontrada</h1>
      <p>La página que buscas no existe.</p>
      <a href="/" className="back-home">Volver al inicio</a>
    </div>
  </div>
)

// Footer component
const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-content">
        <div className="footer-section">
          <h3>TESTheb</h3>
          <p>Bordados de calidad para cada ocasión</p>
        </div>
        <div className="footer-section">
          <h4>Enlaces</h4>
          <ul>
            <li><a href="/">Inicio</a></li>
            <li><a href="/catalog">Catálogo</a></li>
            <li><a href="/about">Nosotros</a></li>
            <li><a href="/contact">Contacto</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contacto</h4>
          <p>📧 info@testheb.cl</p>
          <p>📱 +56 9 1234 5678</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 TESTheb. Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>
)

export default App
