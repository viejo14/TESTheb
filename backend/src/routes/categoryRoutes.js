import { Router } from 'express'
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js'
import { authenticateToken, requireRole } from '../middleware/auth.js'
import { validateParams, validateBody } from '../middleware/validate.js'
import { idParamSchema, createCategorySchema, updateCategorySchema } from '../validators/categoryValidator.js'

const router = Router()

// GET /api/categories - Obtener todas las categorías
router.get('/', getAllCategories)

// GET /api/categories/:id - Obtener categoría por ID
router.get('/:id', validateParams(idParamSchema), getCategoryById)

// POST /api/categories - Crear nueva categoría (requiere autenticación admin)
router.post('/', authenticateToken, requireRole('admin'), validateBody(createCategorySchema), createCategory)

// PUT /api/categories/:id - Actualizar categoría (requiere autenticación admin)
router.put('/:id', authenticateToken, requireRole('admin'), validateParams(idParamSchema), validateBody(updateCategorySchema), updateCategory)

// DELETE /api/categories/:id - Eliminar categoría (requiere autenticación admin)
router.delete('/:id', authenticateToken, requireRole('admin'), validateParams(idParamSchema), deleteCategory)

export default router