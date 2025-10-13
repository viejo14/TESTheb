import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import { query } from './src/config/database.js'
import logger from './src/config/logger.js'
import { globalErrorHandler, notFoundHandler } from './src/middleware/errorHandler.js'
import categoryRoutes from './src/routes/categoryRoutes.js'
import productRoutes from './src/routes/productRoutes.js'
import paymentRoutes from './src/routes/paymentRoutes.js'
import userRoutes from './src/routes/userRoutes.js'
import cotizacionRoutes from './src/routes/cotizacionRoutes.js'
import webpayRoutes from './src/routes/webpayRoutes.js'
import authRoutes from './src/routes/authRoutes.js'
import uploadRoutes from './src/routes/uploadRoutes.js'
import statsRoutes from './src/routes/statsRoutes.js'
import newsletterRoutes from './src/routes/newsletterRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// ✅ SEGURIDAD: Deshabilitar header X-Powered-By
// Previene que atacantes sepan que usas Express.js
app.disable('x-powered-by')

// ✅ SEGURIDAD: Rate limiting global
// Limita las peticiones por IP para prevenir ataques de fuerza bruta y DDoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 peticiones por ventana
  message: 'Demasiadas peticiones desde esta IP, por favor intenta de nuevo más tarde',
  standardHeaders: true,
  legacyHeaders: false,
})

// ✅ SEGURIDAD: Rate limiting para uploads (más restrictivo)
// Previene abuso en operaciones costosas de sistema de archivos
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20, // Máximo 20 uploads por ventana
  message: 'Demasiadas subidas de archivos, por favor intenta de nuevo más tarde',
  standardHeaders: true,
  legacyHeaders: false,
})

// ✅ SEGURIDAD: Rate limiting para autenticación (muy restrictivo)
// Previene ataques de fuerza bruta en login
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo 5 intentos de login por ventana
  message: 'Demasiados intentos de inicio de sesión, por favor intenta de nuevo más tarde',
  standardHeaders: true,
  legacyHeaders: false,
})

// Aplicar rate limiting global a todas las rutas
app.use(limiter)

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
app.use('/api/auth', authLimiter, authRoutes) // ✅ Rate limiting para autenticación
app.use('/api/categories', categoryRoutes)
app.use('/api/products', productRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/users', userRoutes)
app.use('/api/cotizaciones', cotizacionRoutes)
app.use('/api/webpay', webpayRoutes)
app.use('/api/upload', uploadLimiter, uploadRoutes) // ✅ Rate limiting para uploads
app.use('/api/stats', statsRoutes)
app.use('/api/newsletter', newsletterRoutes)

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

// Actualizar tabla users para autenticación (endpoint temporal)
app.get('/api/setup/update-users-table', async (req, res) => {
  try {
    // Agregar columnas faltantes para autenticación
    const updateTableQuery = `
      -- Cambiar nombre de columna password a password_hash
      ALTER TABLE users
      RENAME COLUMN password TO password_hash;

      -- Agregar columnas faltantes
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true,
      ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS email_verification_token VARCHAR(255),
      ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR(255),
      ADD COLUMN IF NOT EXISTS password_reset_expires TIMESTAMP WITH TIME ZONE,
      ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;

      -- Actualizar constraint de role
      ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
      ALTER TABLE users ADD CONSTRAINT users_role_check
      CHECK (role IN ('customer', 'admin', 'employee', 'client'));

      -- Hacer email único si no lo es
      ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email);

      -- Crear índices faltantes
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
      CREATE INDEX IF NOT EXISTS idx_users_active ON users(active);
      CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
    `

    await query(updateTableQuery)

    res.json({
      success: true,
      message: 'Tabla users actualizada exitosamente ✅'
    })
  } catch (error) {
    logger.error('Error actualizando tabla users:', error)
    res.status(500).json({
      success: false,
      message: 'Error actualizando tabla users ❌',
      error: error.message
    })
  }
})

// Crear tabla users (endpoint temporal)
app.get('/api/setup/create-users-table', async (req, res) => {
  try {
    const createTableQuery = `
      -- Crear tabla de usuarios para TESTheb
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'employee')),
        active BOOLEAN DEFAULT true,
        email_verified BOOLEAN DEFAULT false,
        email_verification_token VARCHAR(255),
        password_reset_token VARCHAR(255),
        password_reset_expires TIMESTAMP WITH TIME ZONE,
        last_login TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Crear índices para mejorar el rendimiento
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
      CREATE INDEX IF NOT EXISTS idx_users_active ON users(active);
      CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
    `

    await query(createTableQuery)

    // Crear función para actualizar updated_at automáticamente
    const createFunctionQuery = `
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `

    await query(createFunctionQuery)

    // Crear trigger para actualizar updated_at en cada UPDATE
    const createTriggerQuery = `
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      CREATE TRIGGER update_users_updated_at
          BEFORE UPDATE ON users
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
    `

    await query(createTriggerQuery)

    // Insertar usuario administrador por defecto
    const insertAdminQuery = `
      INSERT INTO users (name, email, password_hash, role, active, email_verified)
      VALUES (
        'Administrador TESTheb',
        'admin@testheb.cl',
        '$2b$12$LQv3c1yqBwEHxkbxdUlhre3wd7uw8zZZhq0dJ8UwuOLc5vfJ6K5Ae',
        'admin',
        true,
        true
      )
      ON CONFLICT (email) DO NOTHING;
    `

    const adminResult = await query(insertAdminQuery)

    res.json({
      success: true,
      message: 'Tabla users creada exitosamente ✅',
      adminCreated: adminResult.rowCount > 0
    })
  } catch (error) {
    logger.error('Error creando tabla users:', error)
    res.status(500).json({
      success: false,
      message: 'Error creando tabla users ❌',
      error: error.message
    })
  }
})

// Crear tabla orders (endpoint temporal)
app.get('/api/setup/create-orders-table', async (req, res) => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        buy_order VARCHAR(255) UNIQUE NOT NULL,
        amount INTEGER NOT NULL,
        session_id VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'created',
        token VARCHAR(255),
        order_data JSONB,
        result_data JSONB,
        authorization_code VARCHAR(255),
        response_code INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_orders_buy_order ON orders(buy_order);
      CREATE INDEX IF NOT EXISTS idx_orders_session_id ON orders(session_id);
      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
      CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
    `

    await query(createTableQuery)

    res.json({
      success: true,
      message: 'Tabla orders creada exitosamente ✅'
    })
  } catch (error) {
    logger.error('Error creando tabla orders:', error)
    res.status(500).json({
      success: false,
      message: 'Error creando tabla orders ❌',
      error: error.message
    })
  }
})

// Debug: Crear admin con contraseña correcta (endpoint temporal)
app.get('/api/setup/create-admin', async (req, res) => {
  try {
    const bcrypt = await import('bcrypt')

    // Eliminar admin existente si existe
    await query('DELETE FROM users WHERE email = $1', ['admin@testheb.cl'])

    // Hash de la contraseña "admin123"
    const saltRounds = 12
    const hashedPassword = await bcrypt.default.hash('admin123', saltRounds)

    // Crear nuevo admin
    const insertAdminQuery = `
      INSERT INTO users (name, email, password_hash, role, active, email_verified, created_at, updated_at)
      VALUES ($1, $2, $3, $4, true, true, NOW(), NOW())
      RETURNING id, name, email, role, created_at
    `

    const adminResult = await query(insertAdminQuery, [
      'Administrador TESTheb',
      'admin@testheb.cl',
      hashedPassword,
      'admin'
    ])

    res.json({
      success: true,
      message: 'Admin creado exitosamente ✅ (Credenciales: admin@testheb.cl / admin123)',
      admin: {
        id: adminResult.rows[0].id,
        name: adminResult.rows[0].name,
        email: adminResult.rows[0].email,
        role: adminResult.rows[0].role
      }
      // ✅ SEGURIDAD: No enviar password_hash ni contraseñas en respuestas
    })
  } catch (error) {
    logger.error('Error creando admin:', error)
    res.status(500).json({
      success: false,
      message: 'Error creando admin ❌',
      error: error.message
    })
  }
})

// Debug: ASIGNAR PRODUCTOS A CATEGORÍAS (endpoint temporal) - UPDATED
app.get('/api/debug/orders', async (req, res) => {
  try {
    // EJECUTAR LAS ASIGNACIONES
    await query('UPDATE products SET category_id = 8 WHERE id = 3') // Polerón Niño -> Colegios
    await query('UPDATE products SET category_id = 9 WHERE id = 1') // Polera Hombre -> Empresas/Pymes
    await query('UPDATE products SET category_id = 9 WHERE id = 4') // Camiseta Polo -> Empresas/Pymes
    await query('UPDATE products SET category_id = 11 WHERE id = 2') // Vestido Mujer -> Diseño Personalizado
    await query('UPDATE products SET category_id = 10 WHERE id = 5') // Calcetín -> Mascotas
    await query('UPDATE products SET category_id = 11 WHERE id = 7') // Pantalón -> Diseño Personalizado

    // Verificar resultado
    const result = await query(`
      SELECT p.id, p.name, p.category_id, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.id
    `)

    res.json({
      success: true,
      message: '🎉 PRODUCTOS ASIGNADOS A CATEGORÍAS EXITOSAMENTE ✅',
      products: result.rows
    })
  } catch (error) {
    logger.error('Error asignando productos:', error)
    res.status(500).json({
      success: false,
      message: 'Error asignando productos ❌',
      error: error.message
    })
  }
})

// Debug: Asignar productos a categorías (endpoint temporal)
app.get('/api/debug/table-structure', async (req, res) => {
  try {
    // Ejecutar asignaciones
    await query('UPDATE products SET category_id = 8, updated_at = NOW() WHERE id = 3')
    await query('UPDATE products SET category_id = 9, updated_at = NOW() WHERE id = 1')
    await query('UPDATE products SET category_id = 9, updated_at = NOW() WHERE id = 4')
    await query('UPDATE products SET category_id = 11, updated_at = NOW() WHERE id = 2')
    await query('UPDATE products SET category_id = 10, updated_at = NOW() WHERE id = 5')
    await query('UPDATE products SET category_id = 11, updated_at = NOW() WHERE id = 7')

    // Verificar asignaciones
    const result = await query(`
      SELECT
        p.id,
        p.name,
        p.category_id,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.id
    `)

    res.json({
      success: true,
      message: 'Productos asignados a categorías exitosamente ✅',
      products: result.rows
    })
  } catch (error) {
    logger.error('Error asignando productos:', error)
    res.status(500).json({
      success: false,
      message: 'Error asignando productos ❌',
      error: error.message
    })
  }
})

// Asignar productos a categorías (endpoint temporal)
app.get('/api/setup/assign-products-to-categories', async (req, res) => {
  try {
    // Asignar productos específicos a categorías
    const assignments = [
      { productId: 3, categoryId: 8, description: 'Polerón Niño -> Colegios' },
      { productId: 1, categoryId: 9, description: 'Polera Hombre -> Empresas/Pymes' },
      { productId: 4, categoryId: 9, description: 'Camiseta Polo Bordada -> Empresas/Pymes' },
      { productId: 2, categoryId: 11, description: 'Vestido Mujer -> Diseño Personalizado' },
      { productId: 5, categoryId: 10, description: 'Calcetín -> Mascotas' },
      { productId: 7, categoryId: 11, description: 'Pantalón -> Diseño Personalizado' }
    ]

    const results = []

    for (const assignment of assignments) {
      const result = await query(
        'UPDATE products SET category_id = $1, updated_at = NOW() WHERE id = $2',
        [assignment.categoryId, assignment.productId]
      )

      results.push({
        ...assignment,
        success: result.rowCount > 0
      })
    }

    res.json({
      success: true,
      message: 'Productos asignados a categorías exitosamente ✅',
      assignments: results
    })
  } catch (error) {
    logger.error('Error asignando productos a categorías:', error)
    res.status(500).json({
      success: false,
      message: 'Error asignando productos a categorías ❌',
      error: error.message
    })
  }
})

// Debug: Ver todas las tablas de la base de datos
app.get('/api/debug/all-tables', async (req, res) => {
  try {
    // Obtener todas las tablas
    const tablesResult = await query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `)

    const tables = {}

    // Para cada tabla, obtener su estructura
    for (const table of tablesResult.rows) {
      const tableName = table.table_name

      const columnsResult = await query(`
        SELECT
          column_name,
          data_type,
          is_nullable,
          column_default,
          character_maximum_length
        FROM information_schema.columns
        WHERE table_name = $1
        ORDER BY ordinal_position
      `, [tableName])

      // Obtener claves foráneas
      const foreignKeysResult = await query(`
        SELECT
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_name = $1
      `, [tableName])

      // Obtener claves primarias
      const primaryKeysResult = await query(`
        SELECT kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        WHERE tc.constraint_type = 'PRIMARY KEY'
          AND tc.table_name = $1
      `, [tableName])

      tables[tableName] = {
        columns: columnsResult.rows,
        foreignKeys: foreignKeysResult.rows,
        primaryKeys: primaryKeysResult.rows
      }
    }

    res.json({
      success: true,
      message: 'Estructura completa de la base de datos',
      database: 'bordados_testheb',
      tables
    })
  } catch (error) {
    logger.error('Error consultando estructura completa:', error)
    res.status(500).json({
      success: false,
      message: 'Error consultando estructura completa ❌',
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
  logger.info(`   💳 WebPay: http://localhost:${PORT}/api/webpay`)
})