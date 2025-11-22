/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { API_BASE_URL } from '../config/api.js'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Helper para verificar si el token está expirado
const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token)
    const currentTime = Date.now() / 1000 // Convertir a segundos

    // Agregar margen de 5 minutos antes de la expiración
    return decoded.exp < currentTime + 300
  } catch (error) {
    console.error('Error decoding token:', error)
    return true // Si no se puede decodificar, considerar expirado
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Función para limpiar sesión
  const clearAuth = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    setUser(null)
    setIsAuthenticated(false)
  }

  // Initialize auth state on app load
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user')
        const token = localStorage.getItem('token')

        if (storedUser && token) {
          // Verificar si el token está expirado
          if (isTokenExpired(token)) {
            console.warn('🔒 Token expirado. Cerrando sesión automáticamente...')
            clearAuth()
            setLoading(false)
            return
          }

          // Verificar validez del token con el backend
          try {
            const response = await fetch(`${API_BASE_URL}/auth/profile`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            })

            if (response.ok) {
              setUser(JSON.parse(storedUser))
              setIsAuthenticated(true)
            } else {
              console.warn('🔒 Token inválido. Cerrando sesión automáticamente...')
              clearAuth()
            }
          } catch (error) {
            console.error('Error verificando token:', error)
            clearAuth()
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        clearAuth()
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  // Verificar expiración del token periódicamente (cada 5 minutos)
  useEffect(() => {
    if (!isAuthenticated) return

    const interval = setInterval(() => {
      const token = localStorage.getItem('token')
      if (token && isTokenExpired(token)) {
        console.warn('🔒 Token expirado durante la sesión. Cerrando sesión...')
        clearAuth()
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.')
      }
    }, 5 * 60 * 1000) // Cada 5 minutos

    return () => clearInterval(interval)
  }, [isAuthenticated])

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true)

      // Make actual API call
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      })

      const data = await response.json()

      if (data.success && data.data) {
        const { user, token, refreshToken } = data.data

        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', token)
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken)
        }

        setUser(user)
        setIsAuthenticated(true)

        //console.log('✅ Inicio de sesión exitoso. Token expira en 24 horas.')

        return { success: true, user }
      } else {
        return { success: false, error: data.message || 'Error de inicio de sesión' }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Error de conexión. Intenta nuevamente.' }
    } finally {
      setLoading(false)
    }
  }

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true)

      // Make actual API call
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })

      const data = await response.json()

      if (data.success && data.data) {
        const { user, token, refreshToken } = data.data

        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', token)
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken)
        }

        setUser(user)
        setIsAuthenticated(true)

        return { success: true, user }
      } else {
        return { success: false, error: data.message || 'Error de registro' }
      }
    } catch (error) {
      console.error('Register error:', error)
      return { success: false, error: 'Error de conexión. Intenta nuevamente.' }
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    clearAuth()
    //console.log('👋 Sesión cerrada correctamente.')
  }

  // Update user profile (placeholder for future implementation)
  const updateProfile = async (updates) => {
    try {
      // TODO: Implement actual profile update API call
      const updatedUser = { ...user, ...updates }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      return { success: true, user: updatedUser }
    } catch (error) {
      console.error('Profile update error:', error)
      return { success: false, error: error.message }
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}