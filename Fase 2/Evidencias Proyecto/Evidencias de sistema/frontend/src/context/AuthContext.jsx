/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Initialize auth state on app load
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedUser = localStorage.getItem('user')
        const token = localStorage.getItem('token')

        if (storedUser && token) {
          setUser(JSON.parse(storedUser))
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        // Clear invalid data
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true)

      // Make actual API call
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      })

      const data = await response.json()

      if (data.success && data.data) {
        const { user, token } = data.data

        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', token)

        setUser(user)
        setIsAuthenticated(true)

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
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })

      const data = await response.json()

      if (data.success && data.data) {
        const { user, token } = data.data

        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', token)

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
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
    setIsAuthenticated(false)
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