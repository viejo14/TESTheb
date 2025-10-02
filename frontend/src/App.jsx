import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import CatalogPage from './pages/CatalogPage'
import ProductDetailPage from './pages/ProductDetailPage'
import AboutPage from './pages/AboutPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import PaymentReturnPage from './pages/PaymentReturnPage'
import PaymentResultPage from './pages/PaymentResultPage'
import AdminDashboard from './pages/AdminDashboard'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import PageTransition from './components/PageTransition'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-bg-primary to-bg-secondary">
          <Header />
          <main className="flex-1">
            <AnimatedRoutes />
          </main>
          <Footer />
        </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

const AnimatedRoutes = () => {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={(
            <PageTransition>
              <HomePage />
            </PageTransition>
          )}
        />
        <Route
          path="/catalog"
          element={(
            <PageTransition>
              <CatalogPage />
            </PageTransition>
          )}
        />
        <Route
          path="/product/:id"
          element={(
            <PageTransition>
              <ProductDetailPage />
            </PageTransition>
          )}
        />

        {/* Other routes */}
        <Route
          path="/about"
          element={(
            <PageTransition>
              <AboutPage />
            </PageTransition>
          )}
        />
        <Route path="/contact" element={<PlaceholderPage title="Contacto" />} />
        <Route
          path="/login"
          element={(
            <PageTransition>
              <LoginPage />
            </PageTransition>
          )}
        />
        <Route
          path="/register"
          element={(
            <PageTransition>
              <RegisterPage />
            </PageTransition>
          )}
        />
        <Route
          path="/forgot-password"
          element={(
            <PageTransition>
              <ForgotPasswordPage />
            </PageTransition>
          )}
        />
        <Route
          path="/reset-password"
          element={(
            <PageTransition>
              <ResetPasswordPage />
            </PageTransition>
          )}
        />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={(
            <PageTransition>
              <AdminDashboard />
            </PageTransition>
          )}
        />
        <Route
          path="/cart"
          element={(
            <PageTransition>
              <CartPage />
            </PageTransition>
          )}
        />
        <Route
          path="/checkout"
          element={(
            <PageTransition>
              <CheckoutPage />
            </PageTransition>
          )}
        />
        <Route
          path="/payment/return"
          element={(
            <PageTransition>
              <PaymentReturnPage />
            </PageTransition>
          )}
        />
        <Route
          path="/payment-result"
          element={(
            <PageTransition>
              <PaymentResultPage />
            </PageTransition>
          )}
        />

        {/* 404 Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  )
}

// Placeholder component for future pages
const PlaceholderPage = ({ title }) => (
  <PageTransition className="min-h-screen flex items-center justify-center px-4">
    <div className="max-w-md mx-auto text-center">
      <h1 className="text-3xl font-bold text-text-primary mb-4">{title}</h1>
      <p className="text-text-secondary mb-8">Esta página estará disponible próximamente.</p>
      <a
        href="/"
        className="inline-block px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-medium rounded-lg transition-colors duration-300"
      >
        Volver al inicio
      </a>
    </div>
  </PageTransition>
)

// 404 Page component
const NotFoundPage = () => (
  <PageTransition className="min-h-screen flex items-center justify-center px-4">
    <div className="max-w-md mx-auto text-center">
      <h1 className="text-3xl font-bold text-text-primary mb-4">404 - Página no encontrada</h1>
      <p className="text-text-secondary mb-8">La página que buscas no existe.</p>
      <a
        href="/"
        className="inline-block px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-medium rounded-lg transition-colors duration-300"
      >
        Volver al inicio
      </a>
    </div>
  </PageTransition>
)

// Footer component
const Footer = () => (
  <footer className="bg-bg-secondary/50 border-t border-gray-500/30 mt-auto">
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center md:text-left">
          <img src="/testheb-logo.png" alt="TESTheb Logo" className="h-12 w-12 rounded-full mx-auto md:mx-0 mb-4" />
          <h3 className="text-xl font-bold text-text-primary mb-2">TESTheb</h3>
          <p className="text-text-muted">Bordados de calidad para cada ocasión</p>
        </div>
        <div className="text-center md:text-left">
          <h4 className="text-lg font-semibold text-text-primary mb-4">Enlaces</h4>
          <ul className="space-y-2">
            <li><a href="/" className="text-text-secondary hover:text-yellow-400 transition-colors">Inicio</a></li>
            <li><a href="/catalog" className="text-text-secondary hover:text-yellow-400 transition-colors">Catálogo</a></li>
            <li><a href="/about" className="text-text-secondary hover:text-yellow-400 transition-colors">Nosotros</a></li>
            <li><a href="/contact" className="text-text-secondary hover:text-yellow-400 transition-colors">Contacto</a></li>
          </ul>
        </div>
        <div className="text-center md:text-left">
          <h4 className="text-lg font-semibold text-text-primary mb-4">Contacto</h4>
          <p className="text-text-secondary mb-2">📧 info@testheb.cl</p>
          <p className="text-text-secondary">📱 +56 9 1234 5678</p>
        </div>
      </div>
      <div className="border-t border-gray-500/30 pt-8 mt-8 text-center">
        <p className="text-text-muted mb-2">&copy; 2025 TESTheb. Todos los derechos reservados.</p>
        <p className="text-text-muted text-sm">Diseñado y creado por Francisco Campos - Sebastian Mella</p>
      </div>
    </div>
  </footer>
)

export default App
