import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configurar directorio de subida
const uploadDir = path.join(__dirname, '../../..', 'frontend', 'public', 'images', 'categories')

// Crear directorio si no existe
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Configuración de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    // Generar nombre único basado en timestamp y nombre original
    const timestamp = Date.now()
    const ext = path.extname(file.originalname)
    const name = path.basename(file.originalname, ext)
    const sanitizedName = name.replace(/[^a-zA-Z0-9_-]/g, '_')
    cb(null, `${sanitizedName}_${timestamp}${ext}`)
  }
})

// Filtro para solo permitir imágenes
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Solo se permiten archivos de imagen'), false)
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  }
})

// Endpoint para subir imagen de categoría
router.post('/category-image', upload.single('image'), (req, res) => {
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
    console.error('❌ Error subiendo imagen:', error)
    res.status(500).json({
      success: false,
      message: 'Error subiendo imagen',
      error: error.message
    })
  }
})

// Endpoint para eliminar imagen de categoría
router.delete('/category-image/:filename', (req, res) => {
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
    console.error('❌ Error eliminando imagen:', error)
    res.status(500).json({
      success: false,
      message: 'Error eliminando imagen',
      error: error.message
    })
  }
})

export default router