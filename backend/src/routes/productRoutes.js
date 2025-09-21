import { Router } from 'express'
import {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts
} from '../controllers/productController.js'

const router = Router()

// GET /api/products - Obtener todos los productos
router.get('/', getAllProducts)

// GET /api/products/search - Buscar productos
router.get('/search', searchProducts)

// GET /api/products/category/:categoryId - Obtener productos por categoría
router.get('/category/:categoryId', getProductsByCategory)

// GET /api/products/:id - Obtener producto por ID
router.get('/:id', getProductById)

// POST /api/products - Crear nuevo producto
router.post('/', createProduct)

// PUT /api/products/:id - Actualizar producto
router.put('/:id', updateProduct)

// DELETE /api/products/:id - Eliminar producto
router.delete('/:id', deleteProduct)

export default router