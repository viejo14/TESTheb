import express from 'express'
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout,
  forgotPassword,
  resetPassword,
  deleteAccount
} from '../controllers/authController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Rutas públicas (no requieren autenticación)
router.post('/register', register)           // POST /api/auth/register - Registrar nuevo usuario
router.post('/login', login)                 // POST /api/auth/login - Iniciar sesión
router.post('/forgot-password', forgotPassword) // POST /api/auth/forgot-password - Solicitar recuperación de contraseña
router.post('/reset-password', resetPassword)   // POST /api/auth/reset-password - Restablecer contraseña con token

// Rutas protegidas (requieren autenticación)
router.get('/profile', authenticateToken, getProfile)           // GET /api/auth/profile - Obtener perfil
router.put('/profile', authenticateToken, updateProfile)        // PUT /api/auth/profile - Actualizar perfil
router.post('/change-password', authenticateToken, changePassword) // POST /api/auth/change-password - Cambiar contraseña
router.post('/logout', authenticateToken, logout)               // POST /api/auth/logout - Cerrar sesión
router.delete('/account', authenticateToken, deleteAccount)     // DELETE /api/auth/account - Eliminar cuenta

export default router