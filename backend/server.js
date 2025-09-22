import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { query } from './src/config/database.js'
import categoryRoutes from './src/routes/categoryRoutes.js'
import productRoutes from './src/routes/productRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares básicos
app.use(cors())
app.use(express.json())
app.use(express.static('uploads'))

// Rutas de la API
app.use('/api/categories', categoryRoutes)
app.use('/api/products', productRoutes)

// Health check básico
app.get('/api/health', (req, res) => {
  res.json({
    message: 'TESTheb API funcionando correctamente ✅',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    database: 'bordados_testheb'
  })
})

// Probar conexión a base de datos
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await query('SELECT NOW() as current_time, version() as pg_version')
    res.json({
      success: true,
      message: 'Conexión a PostgreSQL exitosa ✅',
      database: 'bordados_testheb',
      timestamp: result.rows[0].current_time,
      postgresql_version: result.rows[0].pg_version
    })
  } catch (error) {
    console.error('❌ Error conectando a base de datos:', error)
    res.status(500).json({
      success: false,
      message: 'Error conectando a base de datos ❌',
      error: error.message
    })
  }
})

// Obtener todos los usuarios (solo para testing)
app.get('/api/users', async (req, res) => {
  try {
    const result = await query('SELECT id, name, email, role, created_at FROM users ORDER BY id')
    res.json({
      success: true,
      message: 'Usuarios obtenidos exitosamente',
      data: result.rows,
      total: result.rowCount
    })
  } catch (error) {
    console.error('❌ Error obteniendo usuarios:', error)
    res.status(500).json({
      success: false,
      message: 'Error obteniendo usuarios',
      error: error.message
    })
  }
})

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack)
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  })
})

// Ruta 404 - debe ir al final de todas las rutas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.originalUrl
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor TESTheb ejecutándose en http://localhost:${PORT}`)
  console.log(`📋 Endpoints disponibles:`)
  console.log(`   ✅ Health check: http://localhost:${PORT}/api/health`)
  console.log(`   🗄️  Test DB: http://localhost:${PORT}/api/test-db`)
  console.log(`   📂 Categorías: http://localhost:${PORT}/api/categories`)
  console.log(`   🛍️  Productos: http://localhost:${PORT}/api/products`)
  console.log(`   👥 Usuarios: http://localhost:${PORT}/api/users`)
})