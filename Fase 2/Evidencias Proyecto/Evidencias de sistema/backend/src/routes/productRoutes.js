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

// GET /api/products/sizes - Obtener todas las tallas disponibles
router.get('/sizes/all', getAllSizes)

// PUT /api/products/:productId/sizes/:sizeId/stock - Actualizar stock de talla específica
router.put('/:productId/sizes/:sizeId/stock', updateProductSizeStock)

// ============ RUTAS DE IMÁGENES ============

// GET /api/products/:productId/images - Obtener todas las imágenes de un producto
router.get('/:productId/images', getProductImages)

// POST /api/products/:productId/images - Agregar una imagen a un producto
router.post('/:productId/images', addProductImage)

// POST /api/products/:productId/images/bulk - Agregar múltiples imágenes
router.post('/:productId/images/bulk', addProductImages)

// PUT /api/products/images/:imageId - Actualizar una imagen
router.put('/images/:imageId', updateProductImage)

// PUT /api/products/images/:imageId/primary - Marcar imagen como principal
router.put('/images/:imageId/primary', setProductImagePrimary)

// DELETE /api/products/images/:imageId - Eliminar una imagen
router.delete('/images/:imageId', deleteProductImage)

// PUT /api/products/:productId/images/reorder - Reordenar imágenes
router.put('/:productId/images/reorder', reorderProductImages)

export default router