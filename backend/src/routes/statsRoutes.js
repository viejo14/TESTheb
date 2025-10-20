import express from 'express'
import { getDashboardStats, getTopProducts } from '../controllers/statsController.js'
import { authenticateToken, requireRole } from '../middleware/auth.js'

const router = express.Router()

// Rutas públicas (sin autenticación)
// GET /api/stats/top-products - Productos más vendidos (para Home)
router.get('/top-products', getTopProducts)

// Rutas protegidas - solo admin
router.use(authenticateToken, requireRole('admin'))

// GET /api/stats/dashboard - Estadísticas del dashboard
router.get('/dashboard', getDashboardStats)

export default router
