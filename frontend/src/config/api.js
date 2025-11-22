/**
 * Configuración de la API
 *
 * En desarrollo: usa proxy de Vite (/api -> http://192.168.100.40:3000/api)
 * En producción: usa la URL completa del backend
 */

// RAILWAY FIX: Hardcodear URL en producción
// Railway tiene problemas con variables de entorno en build
const PRODUCTION_API_URL = 'https://backend-production-fc49.up.railway.app/api'
const isDevelopment = import.meta.env.DEV

export const API_BASE_URL = isDevelopment
  ? (import.meta.env.VITE_API_URL || '/api')
  : PRODUCTION_API_URL

/**
 * Helper para construir URLs de la API
 */
export const getApiUrl = (endpoint) => {
  // Asegurar que el endpoint empiece con /
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`

  // Si API_BASE_URL ya incluye /api, no duplicar
  if (API_BASE_URL.endsWith('/api')) {
    return `${API_BASE_URL}${normalizedEndpoint}`
  }

  return `${API_BASE_URL}${normalizedEndpoint}`
}

export default {
  API_BASE_URL,
  getApiUrl
}
