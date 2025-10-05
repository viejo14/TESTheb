import express from 'express'
import {
  subscribe,
  unsubscribe,
  getAllSubscribers,
  getSubscriberStats
} from '../controllers/newsletterController.js'
import { authenticateToken, requireRole } from '../middleware/auth.js'

const router = express.Router()

// Rutas públicas
router.post('/subscribe', subscribe)           // POST /api/newsletter/subscribe - Suscribirse
router.post('/unsubscribe', unsubscribe)       // POST /api/newsletter/unsubscribe - Desuscribirse

// Rutas protegidas (solo admin)
router.get('/subscribers', authenticateToken, requireRole('admin'), getAllSubscribers)  // GET /api/newsletter/subscribers - Listar suscriptores
router.get('/stats', authenticateToken, requireRole('admin'), getSubscriberStats)      // GET /api/newsletter/stats - Estadísticas

export default router
