import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Crear nueva cotización
export const createCotizacion = async (cotizacionData) => {
  try {
    const response = await axios.post(`${API_URL}/cotizaciones`, cotizacionData)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Error al crear cotización' }
  }
}

// Obtener todas las cotizaciones (admin)
export const getAllCotizaciones = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/cotizaciones`, { params })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Error al obtener cotizaciones' }
  }
}

// Obtener cotización por ID
export const getCotizacionById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/cotizaciones/${id}`)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Error al obtener cotización' }
  }
}

// Actualizar cotización (admin)
export const updateCotizacion = async (id, updateData) => {
  try {
    const response = await axios.put(`${API_URL}/cotizaciones/${id}`, updateData)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Error al actualizar cotización' }
  }
}

// Eliminar cotización (admin)
export const deleteCotizacion = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/cotizaciones/${id}`)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Error al eliminar cotización' }
  }
}

// Obtener estadísticas de cotizaciones (admin)
export const getCotizacionStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/cotizaciones/stats`)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Error al obtener estadísticas' }
  }
}

// Actualizar estado masivo (admin)
export const updateBulkStatus = async (ids, status) => {
  try {
    const response = await axios.post(`${API_URL}/cotizaciones/bulk-status`, { ids, status })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Error al actualizar estados' }
  }
}
