import { API_BASE_URL } from '../config/api.js'

// Generic function to handle API requests
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('API Request Error:', error)
    throw error
  }
}

// Categories API functions
export const fetchCategories = async () => {
  return await apiRequest('/categories')
}

export const fetchCategoryById = async (id) => {
  return await apiRequest(`/categories/${id}`)
}

// Products API functions
export const fetchProducts = async () => {
  return await apiRequest('/products')
}

export const fetchProductById = async (id) => {
  return await apiRequest(`/products/${id}`)
}

export const fetchProductsByCategory = async (categoryId) => {
  return await apiRequest(`/products/category/${categoryId}`)
}

export const searchProducts = async (query) => {
  return await apiRequest(`/products/search?q=${encodeURIComponent(query)}`)
}

// Health check function
export const checkHealth = async () => {
  return await apiRequest('/health')
}

// Test database connection
export const testDatabase = async () => {
  return await apiRequest('/test-db')
}

// Admin Products API functions
export const createProduct = async (productData, token) => {
  return await apiRequest('/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(productData)
  })
}

export const updateProduct = async (id, productData, token) => {
  return await apiRequest(`/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(productData)
  })
}

export const deleteProduct = async (id, token) => {
  return await apiRequest(`/products/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

// Admin Categories API functions
export const createCategory = async (categoryData, token) => {
  return await apiRequest('/categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(categoryData)
  })
}

export const updateCategory = async (id, categoryData, token) => {
  return await apiRequest(`/categories/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(categoryData)
  })
}

export const deleteCategory = async (id, token) => {
  return await apiRequest(`/categories/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

// Authentication API functions
export const loginUser = async (credentials) => {
  return await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  })
}

export const registerUser = async (userData) => {
  return await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  })
}

export const getUserProfile = async (token) => {
  return await apiRequest('/auth/profile', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

export const updateUserProfile = async (token, userData) => {
  return await apiRequest('/auth/profile', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(userData)
  })
}

export const changePassword = async (token, passwordData) => {
  return await apiRequest('/auth/change-password', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(passwordData)
  })
}

export const logoutUser = async (token) => {
  return await apiRequest('/auth/logout', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}
