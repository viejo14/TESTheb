import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { HiSearch, HiShoppingCart, HiMenu } from 'react-icons/hi'
import { RiShirtLine } from 'react-icons/ri'
import './Header.css'

const Header = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header__container">
        {/* Logo and Brand */}
        <div className="header__brand">
          <Link to="/" className="header__logo">
            <img
              src="/logo.png"
              alt="TESTheb Logo"
              className="header__logo-image"
              onError={(e) => {
                // Fallback to emoji if logo image fails to load
                e.target.style.display = 'none'
                e.target.nextElementSibling.style.display = 'inline'
              }}
            />
            <RiShirtLine className="header__logo-icon" style={{ display: 'none' }} />
            <span className="header__logo-text">Bordados TESTheb</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="header__search">
          <form onSubmit={handleSearch} className="header__search-form">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="header__search-input"
            />
            <button type="submit" className="header__search-button">
              <HiSearch />
            </button>
          </form>
        </div>

        {/* Navigation */}
        <nav className="header__nav">
          <ul className="header__nav-list">
            <li>
              <Link to="/" className="header__nav-link">
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/catalog" className="header__nav-link">
                Catálogo
              </Link>
            </li>
            <li>
              <Link to="/about" className="header__nav-link">
                Nosotros
              </Link>
            </li>
            <li>
              <Link to="/contact" className="header__nav-link">
                Contacto
              </Link>
            </li>
          </ul>
        </nav>

        {/* User Actions */}
        <div className="header__actions">
          {isAuthenticated ? (
            <div className="header__user">
              <span className="header__user-name">
                Hola, {user?.name || 'Usuario'}
              </span>
              <button
                onClick={handleLogout}
                className="header__logout-button"
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <div className="header__auth">
              <Link to="/login" className="header__auth-link">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="header__auth-link header__auth-link--primary">
                <span>Registrarse</span>
              </Link>
            </div>
          )}

          {/* Cart Icon (placeholder for future implementation) */}
          <Link to="/cart" className="header__cart">
            <HiShoppingCart className="header__cart-icon" />
            <span className="header__cart-count">0</span>
          </Link>
        </div>
      </div>

      {/* Mobile Menu Toggle (for future responsive implementation) */}
      <button className="header__mobile-toggle">
        <HiMenu />
      </button>
    </header>
  )
}

export default Header