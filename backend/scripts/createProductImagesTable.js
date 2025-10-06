/**
 * Script para crear la tabla product_images
 * Ejecuta la migración SQL para permitir múltiples imágenes por producto
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { config } from 'dotenv'
import pkg from 'pg'
const { Client } = pkg

// Cargar variables de entorno
config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function runMigration() {
  const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'bordados_testheb',
    password: process.env.DB_PASSWORD || 'admin123',
    port: process.env.DB_PORT || 5432
  })

  try {
    console.log('🔌 Conectando a la base de datos...')
    await client.connect()
    console.log('✅ Conectado exitosamente')

    console.log('📄 Leyendo archivo de migración...')
    const sqlPath = join(__dirname, '..', 'sql', 'create_product_images_table.sql')
    const sql = readFileSync(sqlPath, 'utf8')

    console.log('🚀 Ejecutando migración...')
    await client.query(sql)

    console.log('✅ Tabla product_images creada exitosamente')
    console.log('📸 Ahora los productos pueden tener hasta 4 imágenes')

    // Verificar la creación
    const checkTable = await client.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_name = 'product_images'
    `)

    if (checkTable.rows[0].count > 0) {
      console.log('✓ Tabla verificada correctamente')
      
      // Contar imágenes migradas
      const migrated = await client.query('SELECT COUNT(*) as count FROM product_images')
      console.log(`📊 Imágenes migradas: ${migrated.rows[0].count}`)
    }

  } catch (error) {
    console.error('❌ Error ejecutando migración:', error.message)
    process.exit(1)
  } finally {
    await client.end()
    console.log('👋 Conexión cerrada')
  }
}

runMigration()
