import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

const shouldUseSSL = process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production'

// Configuracion del pool de conexiones PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'bordados_testheb',
  password: process.env.DB_PASSWORD || 'admin123',
  port: process.env.DB_PORT || 5432,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: shouldUseSSL ? { rejectUnauthorized: false } : false,
})

// Verificar conexion al inicializar
pool.connect(async (err, client, release) => {
  if (err) {
    const { default: logger } = await import('./logger.js')
    logger.error('Error conectando a PostgreSQL', {
      error: err.message,
      stack: err.stack
    })
  } else {
    release()
  }
})

// Funcion helper para ejecutar consultas
export const query = async (text, params) => {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start

    // Importar logger dinamicamente para evitar dependencias circulares
    const { logQuery } = await import('./logger.js')
    logQuery(text, params, duration, res.rowCount)

    return res
  } catch (error) {
    const { default: logger } = await import('./logger.js')
    logger.error('Error en query:', { error: error.message, query: text, params })
    throw error
  }
}

export default pool
