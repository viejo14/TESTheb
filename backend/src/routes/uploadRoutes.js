import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import cloudinary from '../config/cloudinary.js'
import { Readable } from 'stream'
import { authenticateToken, requireRole } from '../middleware/auth.js'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Protege todos los endpoints de subida para admin/employee
router.use(authenticateToken, requireRole('admin', 'employee'))

// Configurar directorios de subida local
const categoriesUploadDir = path.join(__dirname, '../../..', 'frontend', 'public', 'images', 'categories')
const productsUploadDir = path.join(__dirname, '../../..', 'frontend', 'public', 'images', 'products')

// Crear directorios si no existen
if (!fs.existsSync(categoriesUploadDir)) {
  fs.mkdirSync(categoriesUploadDir, { recursive: true })
}

if (!fs.existsSync(productsUploadDir)) {
  fs.mkdirSync(productsUploadDir, { recursive: true })
}

// Configuración de multer para almacenamiento local de categorías
const localStorageCategories = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, categoriesUploadDir)
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now()
    const ext = path.extname(file.originalname)
    const name = path.basename(file.originalname, ext)
    const sanitizedName = name.replace(/[^a-zA-Z0-9_-]/g, '_')
    cb(null, `${sanitizedName}_${timestamp}${ext}`)
  }
})

// Configuración de multer para almacenamiento local de productos
const localStorageProducts = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, productsUploadDir)
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now()
    const ext = path.extname(file.originalname)
    const name = path.basename(file.originalname, ext)
    const sanitizedName = name.replace(/[^a-zA-Z0-9_-]/g, '_')
    cb(null, `${sanitizedName}_${timestamp}${ext}`)
  }
})

// Configuración de multer para memoria (Cloudinary)
const storage = multer.memoryStorage()

// Filtro para solo permitir imágenes
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Solo se permiten archivos de imagen'), false)
  }
}

// Multer para upload a Cloudinary
const uploadCloudinary = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  }
})

// Multer para upload local de categorías
const uploadLocalCategories = multer({
  storage: localStorageCategories,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  }
})

// Multer para upload local de productos
const uploadLocalProducts = multer({
  storage: localStorageProducts,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB máximo para productos
  }
})

// Helper para subir buffer a Cloudinary
const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'auto'
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      }
    )

    // Convertir buffer a stream
    const readable = Readable.from(buffer)
    readable.pipe(stream)
  })
}

// Helper para eliminar de Cloudinary
const deleteFromCloudinary = (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}

// Endpoint para subir imagen de categoría a Cloudinary
router.post('/category-image', uploadCloudinary.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó ninguna imagen'
      })
    }

    // Subir a Cloudinary
    const result = await uploadToCloudinary(
      req.file.buffer,
      process.env.CLOUDINARY_FOLDER || 'testheb/categories'
    )

    res.json({
      success: true,
      message: 'Imagen subida exitosamente',
      data: {
        filename: result.public_id,
        imageUrl: result.secure_url,
        originalName: req.file.originalname,
        size: req.file.size,
        cloudinaryId: result.public_id
      }
    })
  } catch (error) {
    console.error('❌ Error subiendo imagen:', error)
    res.status(500).json({
      success: false,
      message: 'Error subiendo imagen',
      error: error.message
    })
  }
})

// Endpoint para subir imagen de producto a Cloudinary
router.post('/product-image', uploadCloudinary.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó ninguna imagen'
      })
    }

    // Subir a Cloudinary
    const result = await uploadToCloudinary(
      req.file.buffer,
      process.env.CLOUDINARY_FOLDER || 'testheb/products'
    )

    res.json({
      success: true,
      message: 'Imagen subida exitosamente',
      data: {
        filename: result.public_id,
        imageUrl: result.secure_url,
        originalName: req.file.originalname,
        size: req.file.size,
        cloudinaryId: result.public_id
      }
    })
  } catch (error) {
    console.error('❌ Error subiendo imagen:', error)
    res.status(500).json({
      success: false,
      message: 'Error subiendo imagen',
      error: error.message
    })
  }
})

// Endpoint para eliminar imagen de categoría
router.delete('/category-image/:cloudinaryId', async (req, res) => {
  try {
    const cloudinaryId = decodeURIComponent(req.params.cloudinaryId)

    await deleteFromCloudinary(cloudinaryId)

    res.json({
      success: true,
      message: 'Imagen eliminada exitosamente'
    })
  } catch (error) {
    console.error('❌ Error eliminando imagen:', error)
    res.status(500).json({
      success: false,
      message: 'Error eliminando imagen',
      error: error.message
    })
  }
})

// Endpoint para eliminar imagen de producto
router.delete('/product-image/:cloudinaryId', async (req, res) => {
  try {
    const cloudinaryId = decodeURIComponent(req.params.cloudinaryId)

    await deleteFromCloudinary(cloudinaryId)

    res.json({
      success: true,
      message: 'Imagen eliminada exitosamente'
    })
  } catch (error) {
    console.error('❌ Error eliminando imagen:', error)
    res.status(500).json({
      success: false,
      message: 'Error eliminando imagen',
      error: error.message
    })
  }
})

// ==================== ENDPOINTS PARA UPLOAD LOCAL ====================

// Endpoint para subir imagen de categoría localmente
router.post('/category-image-local', uploadLocalCategories.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó ninguna imagen'
      })
    }

    // Devolver la URL relativa de la imagen
    const imageUrl = `/images/categories/${req.file.filename}`

    res.json({
      success: true,
      message: 'Imagen subida exitosamente',
      data: {
        filename: req.file.filename,
        imageUrl: imageUrl,
        originalName: req.file.originalname,
        size: req.file.size
      }
    })
  } catch (error) {
    console.error('❌ Error subiendo imagen local:', error)
    res.status(500).json({
      success: false,
      message: 'Error subiendo imagen',
      error: error.message
    })
  }
})

// Endpoint para subir imagen de producto localmente
router.post('/product-image-local', uploadLocalProducts.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó ninguna imagen'
      })
    }

    // Devolver la URL relativa de la imagen para productos
    const imageUrl = `/images/products/${req.file.filename}`

    res.json({
      success: true,
      message: 'Imagen subida exitosamente',
      data: {
        filename: req.file.filename,
        imageUrl: imageUrl,
        originalName: req.file.originalname,
        size: req.file.size
      }
    })
  } catch (error) {
    console.error('❌ Error subiendo imagen local:', error)
    res.status(500).json({
      success: false,
      message: 'Error subiendo imagen',
      error: error.message
    })
  }
})

// Endpoint para eliminar imagen local de categoría
router.delete('/category-image-local/:filename', (req, res) => {
  try {
    const { filename } = req.params

    // ✅ SEGURIDAD: Validar que el filename no contenga caracteres peligrosos
    // Previene Path Traversal attacks (../, ..\, etc.)
    if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({
        success: false,
        message: 'Nombre de archivo inválido'
      })
    }

    // ✅ SEGURIDAD: Usar path.basename para asegurar que solo se use el nombre del archivo
    // Esto elimina cualquier intento de acceder a directorios superiores
    const safeFilename = path.basename(filename)
    const filePath = path.join(categoriesUploadDir, safeFilename)

    // ✅ SEGURIDAD: Verificar que el path resultante esté dentro del directorio permitido
    const normalizedPath = path.normalize(filePath)
    if (!normalizedPath.startsWith(path.normalize(categoriesUploadDir))) {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado'
      })
    }

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      res.json({
        success: true,
        message: 'Imagen eliminada exitosamente'
      })
    } else {
      res.status(404).json({
        success: false,
        message: 'Imagen no encontrada'
      })
    }
  } catch (error) {
    console.error('❌ Error eliminando imagen local:', error)
    res.status(500).json({
      success: false,
      message: 'Error eliminando imagen',
      error: error.message
    })
  }
})

// Endpoint para eliminar imagen local de producto
router.delete('/product-image-local/:filename', (req, res) => {
  try {
    const { filename } = req.params

    // ✅ SEGURIDAD: Validar que el filename no contenga caracteres peligrosos
    // Previene Path Traversal attacks (../, ..\, etc.)
    if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({
        success: false,
        message: 'Nombre de archivo inválido'
      })
    }

    // ✅ SEGURIDAD: Usar path.basename para asegurar que solo se use el nombre del archivo
    // Esto elimina cualquier intento de acceder a directorios superiores
    const safeFilename = path.basename(filename)
    const filePath = path.join(productsUploadDir, safeFilename)

    // ✅ SEGURIDAD: Verificar que el path resultante esté dentro del directorio permitido
    const normalizedPath = path.normalize(filePath)
    if (!normalizedPath.startsWith(path.normalize(productsUploadDir))) {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado'
      })
    }

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      res.json({
        success: true,
        message: 'Imagen eliminada exitosamente'
      })
    } else {
      res.status(404).json({
        success: false,
        message: 'Imagen no encontrada'
      })
    }
  } catch (error) {
    console.error('❌ Error eliminando imagen local:', error)
    res.status(500).json({
      success: false,
      message: 'Error eliminando imagen',
      error: error.message
    })
  }
})

export default router
