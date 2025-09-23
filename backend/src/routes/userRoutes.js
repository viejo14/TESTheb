import express from 'express'
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats
} from '../controllers/userController.js'

const router = express.Router()

// Rutas CRUD de usuarios
router.get('/', getAllUsers)                    // GET /api/users - Obtener todos los usuarios (con paginación)
router.get('/stats', getUserStats)              // GET /api/users/stats - Estadísticas de usuarios
router.get('/:id', getUserById)                 // GET /api/users/:id - Obtener usuario por ID
router.post('/', createUser)                    // POST /api/users - Crear nuevo usuario
router.put('/:id', updateUser)                  // PUT /api/users/:id - Actualizar usuario
router.delete('/:id', deleteUser)               // DELETE /api/users/:id - Eliminar usuario

export default router