import express from 'express'
import {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getOrdersStats
} from '../controllers/orderController.js'
import { authenticateToken, requireRole } from '../middleware/auth.js'

const router = express.Router()

// Todas las rutas requieren autenticación de admin
router.use(authenticateToken)
router.use(requireRole('admin'))

// Obtener estadísticas de órdenes
router.get('/stats', getOrdersStats)

// Obtener todas las órdenes (con filtros opcionales)
router.get('/', getAllOrders)

// Obtener una orden específica con sus items
router.get('/:id', getOrderById)

// Actualizar estado de una orden
router.put('/:id/status', updateOrderStatus)

export default router
