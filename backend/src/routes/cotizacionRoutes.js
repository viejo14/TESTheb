import express from 'express'
import {
  getAllCotizaciones,
  getCotizacionById,
  createCotizacion,
  updateCotizacion,
  deleteCotizacion,
  getCotizacionStats,
  updateBulkStatus
} from '../controllers/cotizacionController.js'

const router = express.Router()

// Rutas CRUD de cotizaciones
router.get('/', getAllCotizaciones)                      // GET /api/cotizaciones - Obtener todas las cotizaciones (con filtros y paginación)
router.get('/stats', getCotizacionStats)                 // GET /api/cotizaciones/stats - Estadísticas de cotizaciones
router.post('/bulk-status', updateBulkStatus)            // POST /api/cotizaciones/bulk-status - Actualizar estado masivo
router.get('/:id', getCotizacionById)                    // GET /api/cotizaciones/:id - Obtener cotización por ID
router.post('/', createCotizacion)                       // POST /api/cotizaciones - Crear nueva cotización
router.put('/:id', updateCotizacion)                     // PUT /api/cotizaciones/:id - Actualizar cotización
router.delete('/:id', deleteCotizacion)                  // DELETE /api/cotizaciones/:id - Eliminar cotización

export default router