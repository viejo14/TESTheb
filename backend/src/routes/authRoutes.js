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
import { validateBody } from '../middleware/validate.js'
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from '../validators/authValidator.js'

const router = express.Router()

// Rutas públicas (no requieren autenticación)
router.post('/register', validateBody(registerSchema), register)           // POST /api/auth/register - Registrar nuevo usuario
router.post('/login', validateBody(loginSchema), login)                 // POST /api/auth/login - Iniciar sesión
router.post('/forgot-password', validateBody(forgotPasswordSchema), forgotPassword) // POST /api/auth/forgot-password - Solicitar recuperación de contraseña
router.post('/reset-password', validateBody(resetPasswordSchema), resetPassword)   // POST /api/auth/reset-password - Restablecer contraseña con token

// Rutas protegidas (requieren autenticación)
router.get('/profile', authenticateToken, getProfile)           // GET /api/auth/profile - Obtener perfil
router.put('/profile', authenticateToken, validateBody(updateProfileSchema), updateProfile)        // PUT /api/auth/profile - Actualizar perfil
router.post('/change-password', authenticateToken, validateBody(changePasswordSchema), changePassword) // POST /api/auth/change-password - Cambiar contraseña
router.post('/logout', authenticateToken, logout)               // POST /api/auth/logout - Cerrar sesión
router.delete('/account', authenticateToken, deleteAccount)     // DELETE /api/auth/account - Eliminar cuenta

export default router
//