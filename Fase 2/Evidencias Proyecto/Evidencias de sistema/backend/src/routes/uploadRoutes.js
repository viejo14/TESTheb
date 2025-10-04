import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import cloudinary from '../config/cloudinary.js'
import { Readable } from 'stream'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configurar directorio de subida local
const uploadDir = path.join(__dirname, '../../..', 'frontend', 'public', 'images', 'categories')

// Crear directorio si no existe
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Configuración de multer para almacenamiento local
const localStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
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

// Multer para upload local
const uploadLocal = multer({
  storage: localStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
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
router.post('/category-image-local', uploadLocal.single('image'), (req, res) => {
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
router.post('/product-image-local', uploadLocal.single('image'), (req, res) => {
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

// Endpoint para eliminar imagen local de categoría
router.delete('/category-image-local/:filename', (req, res) => {
  try {
    const { filename } = req.params
    const filePath = path.join(uploadDir, filename)

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
    const filePath = path.join(uploadDir, filename)

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