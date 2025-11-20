import { Router } from 'express'
import {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getAllSizes,
  updateProductSizeStock,
  getProductImages,
  addProductImage,
  addProductImages,
  updateProductImage,
  setProductImagePrimary,
  deleteProductImage,
  reorderProductImages
} from '../controllers/productController.js'
import { authenticateToken, requireRole } from '../middleware/auth.js'

const router = Router()

// GET /api/products - Listar todos los productos
router.get('/', getAllProducts)

// GET /api/products/search - Buscar productos
router.get('/search', searchProducts)

// GET /api/products/category/:categoryId - Productos por categoria
router.get('/category/:categoryId', getProductsByCategory)

// GET /api/products/sizes - Todas las tallas
router.get('/sizes/all', getAllSizes)

// POST /api/products - Crear nuevo producto
router.post('/', authenticateToken, requireRole('admin', 'employee'), createProduct)

// PUT /api/products/:id - Actualizar producto
router.put('/:id', authenticateToken, requireRole('admin', 'employee'), updateProduct)

// DELETE /api/products/:id - Eliminar producto
router.delete('/:id', authenticateToken, requireRole('admin', 'employee'), deleteProduct)

// PUT /api/products/:productId/sizes/:sizeId/stock - Actualizar stock de talla
router.put('/:productId/sizes/:sizeId/stock', authenticateToken, requireRole('admin', 'employee'), updateProductSizeStock)

// GET /api/products/:id - Obtener producto por ID
router.get('/:id', getProductById)

// ============ RUTAS DE IMAGENES ============

// GET /api/products/:productId/images - Obtener imagenes de un producto
router.get('/:productId/images', getProductImages)

// POST /api/products/:productId/images - Agregar una imagen
router.post('/:productId/images', authenticateToken, requireRole('admin', 'employee'), addProductImage)

// POST /api/products/:productId/images/bulk - Agregar multiples imagenes
router.post('/:productId/images/bulk', authenticateToken, requireRole('admin', 'employee'), addProductImages)

// PUT /api/products/images/:imageId - Actualizar una imagen
router.put('/images/:imageId', authenticateToken, requireRole('admin', 'employee'), updateProductImage)

// PUT /api/products/images/:imageId/primary - Marcar imagen como principal
router.put('/images/:imageId/primary', authenticateToken, requireRole('admin', 'employee'), setProductImagePrimary)

// DELETE /api/products/images/:imageId - Eliminar una imagen
router.delete('/images/:imageId', authenticateToken, requireRole('admin', 'employee'), deleteProductImage)

// PUT /api/products/:productId/images/reorder - Reordenar imagenes
router.put('/:productId/images/reorder', authenticateToken, requireRole('admin', 'employee'), reorderProductImages)

export default router
