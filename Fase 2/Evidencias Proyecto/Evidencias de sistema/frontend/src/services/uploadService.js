const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

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
    console.error('Error uploading image:', error)
    throw error
  }
}

export const deleteCategoryImage = async (filename) => {
  try {
    const response = await fetch(`${API_BASE_URL}/upload/category-image/${filename}`, {
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
    console.error('Error deleting image:', error)
    throw error
  }
}