import express from 'express'
import { getDashboardStats } from '../controllers/statsController.js'
import { authenticateToken, requireRole } from '../middleware/auth.js'

const router = express.Router()

// Rutas protegidas - solo admin
router.use(authenticateToken, requireRole('admin'))

// GET /api/stats/dashboard - Estadísticas del dashboard
router.get('/dashboard', getDashboardStats)

export default router
