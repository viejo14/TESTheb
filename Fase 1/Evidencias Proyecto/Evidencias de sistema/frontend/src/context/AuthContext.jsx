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

  // Login function (placeholder for future implementation)
  const login = async (credentials) => {
    try {
      setLoading(true)
      // TODO: Implement actual login API call
      console.log('Login attempt:', credentials)

      // Placeholder response - replace with actual API call
      const mockUser = {
        id: 1,
        name: 'Usuario Demo',
        email: credentials.email,
        role: 'customer'
      }
      const mockToken = 'demo-jwt-token'

      localStorage.setItem('user', JSON.stringify(mockUser))
      localStorage.setItem('token', mockToken)

      setUser(mockUser)
      setIsAuthenticated(true)

      return { success: true, user: mockUser }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // Register function (placeholder for future implementation)
  const register = async (userData) => {
    try {
      setLoading(true)
      // TODO: Implement actual register API call
      console.log('Register attempt:', userData)

      // For now, automatically log in after registration
      return await login({ email: userData.email, password: userData.password })
    } catch (error) {
      console.error('Register error:', error)
      return { success: false, error: error.message }
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