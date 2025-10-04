const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

// ==================== FUNCIONES PARA CLOUDINARY ====================

// Funciones para categorías (Cloudinary)
export const uploadCategoryImage = async (imageFile) => {
  try {
    const formData = new FormData()
    formData.append('image', imageFile)

    const response = await fetch(`${API_BASE_URL}/upload/category-image`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.message || 'Error subiendo imagen')
    }

    return data
  } catch (error) {
    console.error('Error uploading category image:', error)
    throw error
  }
}

export const deleteCategoryImage = async (cloudinaryId) => {
  try {
    const encodedId = encodeURIComponent(cloudinaryId)
    const response = await fetch(`${API_BASE_URL}/upload/category-image/${encodedId}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.message || 'Error eliminando imagen')
    }

    return data
  } catch (error) {
    console.error('Error deleting category image:', error)
    throw error
  }
}

// Funciones para productos
export const uploadProductImage = async (imageFile) => {
  try {
    const formData = new FormData()
    formData.append('image', imageFile)

    const response = await fetch(`${API_BASE_URL}/upload/product-image`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.message || 'Error subiendo imagen')
    }

    return data
  } catch (error) {
    console.error('Error uploading product image:', error)
    throw error
  }
}

export const deleteProductImage = async (cloudinaryId) => {
  try {
    const encodedId = encodeURIComponent(cloudinaryId)
    const response = await fetch(`${API_BASE_URL}/upload/product-image/${encodedId}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.message || 'Error eliminando imagen')
    }

    return data
  } catch (error) {
    console.error('Error deleting product image:', error)
    throw error
  }
}

// ==================== FUNCIONES PARA UPLOAD LOCAL ====================

// Funciones para categorías (Local)
export const uploadCategoryImageLocal = async (imageFile) => {
  try {
    const formData = new FormData()
    formData.append('image', imageFile)

    const response = await fetch(`${API_BASE_URL}/upload/category-image-local`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.message || 'Error subiendo imagen')
    }

    return data
  } catch (error) {
    console.error('Error uploading category image locally:', error)
    throw error
  }
}

export const deleteCategoryImageLocal = async (filename) => {
  try {
    const response = await fetch(`${API_BASE_URL}/upload/category-image-local/${filename}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.message || 'Error eliminando imagen')
    }

    return data
  } catch (error) {
    console.error('Error deleting category image locally:', error)
    throw error
  }
}

// Funciones para productos (Local)
export const uploadProductImageLocal = async (imageFile) => {
  try {
    const formData = new FormData()
    formData.append('image', imageFile)

    const response = await fetch(`${API_BASE_URL}/upload/product-image-local`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.message || 'Error subiendo imagen')
    }

    return data
  } catch (error) {
    console.error('Error uploading product image locally:', error)
    throw error
  }
}

export const deleteProductImageLocal = async (filename) => {
  try {
    const response = await fetch(`${API_BASE_URL}/upload/product-image-local/${filename}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.message || 'Error eliminando imagen')
    }

    return data
  } catch (error) {
    console.error('Error deleting product image locally:', error)
    throw error
  }
}