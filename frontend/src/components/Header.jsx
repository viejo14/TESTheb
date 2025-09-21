import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './Header.css'

const Header = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')

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

  return (
    <header className="header">
      <div className="header__container">
        {/* Logo and Brand */}
        <div className="header__brand">
          <Link to="/" className="header__logo">
            <span className="header__logo-icon">🧵</span>
            <span className="header__logo-text">TESTheb</span>
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
              🔍
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
                Registrarse
              </Link>
            </div>
          )}

          {/* Cart Icon (placeholder for future implementation) */}
          <Link to="/cart" className="header__cart">
            <span className="header__cart-icon">🛒</span>
            <span className="header__cart-count">0</span>
          </Link>
        </div>
      </div>

      {/* Mobile Menu Toggle (for future responsive implementation) */}
      <button className="header__mobile-toggle">
        ☰
      </button>
    </header>
  )
}

export default Header