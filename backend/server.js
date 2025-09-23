import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import { query } from './src/config/database.js'
import logger from './src/config/logger.js'
import { globalErrorHandler, notFoundHandler } from './src/middleware/errorHandler.js'
import categoryRoutes from './src/routes/categoryRoutes.js'
import productRoutes from './src/routes/productRoutes.js'
import paymentRoutes from './src/routes/paymentRoutes.js'
import userRoutes from './src/routes/userRoutes.js'
import cotizacionRoutes from './src/routes/cotizacionRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares básicos
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(express.static('uploads'))

// Logging de requests HTTP
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}))

// Rutas de la API
app.use('/api/categories', categoryRoutes)
app.use('/api/products', productRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/users', userRoutes)
app.use('/api/cotizaciones', cotizacionRoutes)

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
    logger.error('Error conectando a base de datos:', error)
    res.status(500).json({
      success: false,
      message: 'Error conectando a base de datos ❌',
      error: error.message
    })
  }
})


// Middleware para rutas no encontradas
app.use(notFoundHandler)

// Middleware global de manejo de errores
app.use(globalErrorHandler)

app.listen(PORT, () => {
  logger.info(`🚀 Servidor TESTheb ejecutándose en http://localhost:${PORT}`)
  logger.info(`📋 Endpoints disponibles:`)
  logger.info(`   ✅ Health check: http://localhost:${PORT}/api/health`)
  logger.info(`   🗄️  Test DB: http://localhost:${PORT}/api/test-db`)
  logger.info(`   📂 Categorías: http://localhost:${PORT}/api/categories`)
  logger.info(`   🛍️  Productos: http://localhost:${PORT}/api/products`)
  logger.info(`   👥 Usuarios: http://localhost:${PORT}/api/users`)
  logger.info(`   📋 Cotizaciones: http://localhost:${PORT}/api/cotizaciones`)
  logger.info(`   💳 Pagos: http://localhost:${PORT}/api/payments`)
})