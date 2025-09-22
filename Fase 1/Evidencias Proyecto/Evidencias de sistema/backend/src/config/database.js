import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

// Configuración del pool de conexiones PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'bordados_testheb',
  password: process.env.DB_PASSWORD || 'admin123',
  port: process.env.DB_PORT || 5432,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Verificar conexión al inicializar
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error conectando a PostgreSQL:', err.stack)
  } else {
    console.log('✅ Conectado a PostgreSQL - Base de datos: bordados_testheb')
    console.log(`📊 Usuario: ${client.user}, Host: ${client.host}:${client.port}`)
    release()
  }
})

// Función helper para ejecutar consultas
export const query = async (text, params) => {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log(`🔍 Query ejecutada`, { text, duration: `${duration}ms`, rows: res.rowCount })
    return res
  } catch (error) {
    console.error('❌ Error en query:', error)
    throw error
  }
}

export default pool