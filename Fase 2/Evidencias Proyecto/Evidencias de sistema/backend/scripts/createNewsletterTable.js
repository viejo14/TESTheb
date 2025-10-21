import pg from 'pg'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

dotenv.config()

const { Pool } = pg

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'bordados_testheb',
  password: process.env.DB_PASSWORD || 'admin123',
  port: process.env.DB_PORT || 5432,
})

async function createNewsletterTable() {
  try {
    //console.log('📧 Creando tabla newsletter_subscribers...\n')

    const sql = `
-- Tabla para suscriptores del newsletter
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice para búsquedas rápidas por email
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);

-- Índice para filtrar por estado
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscribers(status);

-- Comentarios para documentación
COMMENT ON TABLE newsletter_subscribers IS 'Almacena suscriptores del newsletter';
COMMENT ON COLUMN newsletter_subscribers.email IS 'Email del suscriptor (único)';
COMMENT ON COLUMN newsletter_subscribers.status IS 'Estado: active o unsubscribed';
COMMENT ON COLUMN newsletter_subscribers.subscribed_at IS 'Fecha de suscripción';
COMMENT ON COLUMN newsletter_subscribers.unsubscribed_at IS 'Fecha de desuscripción (si aplica)';
    `

    await pool.query(sql)

    //console.log('✅ Tabla newsletter_subscribers creada exitosamente')
    //console.log('✅ Índices creados correctamente')
    //console.log('\n📊 Verificando estructura de la tabla...\n')

    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'newsletter_subscribers'
      ORDER BY ordinal_position;
    `)

    console.table(result.rows)

    //console.log('\n✅ ¡Todo listo! El sistema de newsletter está operativo.\n')

  } catch (error) {
    console.error('❌ Error creando tabla:', error.message)
    console.error(error)
  } finally {
    await pool.end()
  }
}

createNewsletterTable()
