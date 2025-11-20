import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import CatalogPage from './pages/CatalogPage'
import ProductDetailPage from './pages/ProductDetailPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import PaymentReturnPage from './pages/PaymentReturnPage'
import PaymentResultPage from './pages/PaymentResultPage'
import AdminDashboard from './pages/AdminDashboard'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import TestEnvPage from './pages/TestEnvPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import ReturnsPage from './pages/ReturnsPage'
import UnsubscribePage from './pages/UnsubscribePage'
import AccountSettingsPage from './pages/AccountSettingsPage'
import PageTransition from './components/PageTransition'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
        <ScrollToTop />
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
        <Route
          path="/contact"
          element={(
            <PageTransition>
              <ContactPage />
            </PageTransition>
          )}
        />

        {/* Legal Pages */}
        <Route
          path="/terms"
          element={(
            <PageTransition>
              <TermsPage />
            </PageTransition>
          )}
        />
        <Route
          path="/privacy"
          element={(
            <PageTransition>
              <PrivacyPage />
            </PageTransition>
          )}
        />
        <Route
          path="/returns"
          element={(
            <PageTransition>
              <ReturnsPage />
            </PageTransition>
          )}
        />
        <Route
          path="/unsubscribe"
          element={(
            <PageTransition>
              <UnsubscribePage />
            </PageTransition>
          )}
        />

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
        <Route
          path="/account-settings"
          element={(
            <PageTransition>
              <AccountSettingsPage />
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

        {/* Test/Debug routes */}
        <Route
          path="/test-env"
          element={(
            <PageTransition>
              <TestEnvPage />
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

export default App
