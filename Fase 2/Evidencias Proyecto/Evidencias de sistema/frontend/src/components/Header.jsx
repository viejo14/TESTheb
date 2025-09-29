import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { HiSearch, HiShoppingCart, HiMenu, HiX } from 'react-icons/hi'
import { RiShirtLine } from 'react-icons/ri'

const SearchForm = ({ className = '', value, onChange, onSubmit }) => (
  <form onSubmit={onSubmit} className={`relative w-full ${className}`}>
    <input
      type="text"
      placeholder="Buscar..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full py-3 lg:py-3.5 pl-5 pr-14 bg-bg-secondary/60 border border-gray-500/30 rounded-full text-text-primary placeholder-text-muted text-base lg:text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
    />
    <button
      type="submit"
      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 lg:p-2.5 text-text-muted hover:text-yellow-400 transition-colors duration-300"
    >
      <HiSearch className="w-6 h-6 lg:w-7 lg:h-7" />
    </button>
  </form>
)

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated, logout } = useAuth()
  const { cartItems } = useCart()
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Calculate total items from cartItems directly
  const totalItems = cartItems.reduce((sum, item) => {
    const quantity = parseInt(item.quantity) || 0
    return sum + quantity
  }, 0)

  const navLinks = [
    { label: 'Inicio', path: '/' },
    { label: 'Catálogo', path: '/catalog' },
    { label: 'Nosotros', path: '/about' },
    { label: 'Contacto', path: '/contact' }
  ]

  const userInitial = user?.name?.charAt(0)?.toUpperCase() ?? 'U'

  const closeMobileMenu = () => setIsMobileMenuOpen(false)
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev)

  const handleSearch = (e) => {
    e.preventDefault()
    const trimmedQuery = searchQuery.trim()

    if (trimmedQuery) {
      navigate(`/catalog?search=${encodeURIComponent(trimmedQuery)}`)
      setSearchQuery('')
      closeMobileMenu()
    }
  }

  const handleLogout = () => {
    logout()
    closeMobileMenu()
    navigate('/')
  }

  const isActiveLink = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }

    return location.pathname.startsWith(path)
  }

  const renderAuthSection = (variant = 'desktop') => {
    if (isAuthenticated) {
      if (variant === 'mobile') {
        return (
          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium text-text-secondary">
              {user?.name || 'Usuario'}
            </span>
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                onClick={closeMobileMenu}
                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-md transition-colors duration-300 text-center"
              >
                🔧 Panel Admin
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-md transition-colors duration-300"
            >
              Salir
            </button>
          </div>
        )
      }

      return (
        <div className="flex items-center gap-3">
          <span className="text-base text-text-secondary hidden xl:block">
            {user?.name || 'Usuario'}
          </span>
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-md transition-colors duration-300"
            >
              🔧 Panel Admin
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-md transition-colors duration-300"
          >
            Salir
          </button>
        </div>
      )
    }

    if (variant === 'mobile') {
      return (
        <div className="flex flex-col gap-3">
          <Link
            to="/login"
            onClick={closeMobileMenu}
            className="w-full px-4 py-2 text-center text-text-secondary hover:text-yellow-400 transition-colors duration-300 text-sm font-medium rounded-md border border-transparent hover:border-yellow-400/60"
          >
            Login
          </Link>
          <Link
            to="/register"
            onClick={closeMobileMenu}
            className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black text-sm font-semibold rounded-md transition-colors duration-300"
          >
            Registro
          </Link>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-3">
        <Link
          to="/login"
            className="text-text-secondary hover:text-yellow-400 transition-colors duration-300 font-medium text-base"
        >
          Login
        </Link>
        <Link
          to="/register"
            className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold text-base rounded-md transition-colors duration-300"
        >
          Registro
        </Link>
      </div>
    )
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b border-gray-500/20 transition-all duration-300 ${
        isScrolled
          ? 'bg-bg-primary/95 backdrop-blur-md shadow-lg'
          : 'bg-bg-primary/90 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 py-5 lg:py-8">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3 text-decoration-none group">
              <motion.img
                src="/testheb-logo.png"
                alt="TESTheb Logo"
                className="h-14 w-14 rounded-full object-cover"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextElementSibling.style.display = 'inline'
                }}
              />
              <RiShirtLine className="h-14 w-14 text-yellow-400 hidden" />
              <motion.span
                className="text-2xl font-bold text-text-primary hidden sm:block"
                whileHover={{ color: "rgb(251, 191, 36)" }}
                transition={{ duration: 0.3 }}
              >
                TESTheb Bordados
              </motion.span>
            </Link>

            <nav className="hidden lg:flex flex-1 items-center justify-center gap-10">
              {navLinks.map(({ label, path }) => (
                <Link
                  key={path}
                  to={path}
                  className={`text-lg xl:text-xl font-semibold transition-colors duration-300 ${
                    isActiveLink(path)
                      ? 'text-yellow-400'
                      : 'text-text-secondary hover:text-yellow-400'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-5">
              <SearchForm
                className="max-w-sm xl:max-w-md"
                value={searchQuery}
                onChange={setSearchQuery}
                onSubmit={handleSearch}
              />
              {renderAuthSection('desktop')}
              <Link
                to="/cart"
                className="relative flex items-center justify-center rounded-full p-3 text-text-secondary hover:text-yellow-400 transition-colors duration-300"
              >
                <HiShoppingCart className="w-7 h-7" />
                {totalItems > 0 && (
                  <motion.span
                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {totalItems > 99 ? '99+' : totalItems}
                  </motion.span>
                )}
              </Link>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              {isAuthenticated ? (
                <span className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/15 text-yellow-300 text-base font-semibold uppercase">
                  {userInitial}
                </span>
              ) : (
                <Link
                  to="/register"
                  className="hidden sm:inline-flex items-center rounded-md bg-yellow-500 px-5 py-2 text-base font-semibold text-black transition-colors duration-300 hover:bg-yellow-400"
                >
                  Registro
                </Link>
              )}
              <Link
                to="/cart"
                className="relative flex items-center justify-center rounded-full p-3 text-text-secondary hover:text-yellow-400 transition-colors duration-300"
              >
                <HiShoppingCart className="w-6 h-6" />
                {totalItems > 0 && (
                  <motion.span
                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {totalItems > 99 ? '99+' : totalItems}
                  </motion.span>
                )}
              </Link>
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center rounded-md p-2 text-text-secondary hover:text-yellow-400 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                aria-label={
                  isMobileMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'
                }
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-navigation"
              >
                {isMobileMenuOpen ? <HiX className="w-8 h-8" /> : <HiMenu className="w-8 h-8" />}
              </button>
            </div>
          </div>

          <div className="hidden md:block lg:hidden">
            <SearchForm
              className="w-full"
              value={searchQuery}
              onChange={setSearchQuery}
              onSubmit={handleSearch}
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-navigation"
            className="lg:hidden overflow-hidden border-t border-gray-500/10 bg-bg-primary/95 backdrop-blur-lg"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <motion.div
              className="px-4 sm:px-6 space-y-4 py-4"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              exit={{ y: -20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <motion.div
                className="md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <SearchForm
                  className="w-full"
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSubmit={handleSearch}
                />
              </motion.div>
              <nav className="flex flex-col gap-2">
                {navLinks.map(({ label, path }, index) => (
                  <motion.div
                    key={path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  >
                    <Link
                      to={path}
                      onClick={closeMobileMenu}
                      className={`block rounded-md px-4 py-3 text-base font-medium transition-colors duration-300 ${
                        isActiveLink(path)
                          ? 'bg-yellow-500/10 text-yellow-400'
                          : 'text-text-secondary hover:bg-yellow-500/10 hover:text-yellow-400'
                      }`}
                    >
                      {label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <motion.div
                className="border-t border-gray-500/10 pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                {renderAuthSection('mobile')}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header