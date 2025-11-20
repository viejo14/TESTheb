import express from 'express'
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats
} from '../controllers/userController.js'
import { authenticateToken, requireRole } from '../middleware/auth.js'

const router = express.Router()

// Rutas CRUD de usuarios (restringidas a admin/employee)
router.get('/', authenticateToken, requireRole('admin', 'employee'), getAllUsers) // GET /api/users - Listado con paginacion
router.get('/stats', authenticateToken, requireRole('admin', 'employee'), getUserStats) // GET /api/users/stats - Estadisticas
router.get('/:id', authenticateToken, requireRole('admin', 'employee'), getUserById) // GET /api/users/:id - Detalle
router.post('/', authenticateToken, requireRole('admin', 'employee'), createUser) // POST /api/users - Crear
router.put('/:id', authenticateToken, requireRole('admin', 'employee'), updateUser) // PUT /api/users/:id - Actualizar
router.delete('/:id', authenticateToken, requireRole('admin', 'employee'), deleteUser) // DELETE /api/users/:id - Eliminar

export default router
