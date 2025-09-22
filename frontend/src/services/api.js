const API_BASE_URL = '/api'

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