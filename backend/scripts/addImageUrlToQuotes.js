import { query } from '../src/config/database.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function addImageUrlColumn() {
  try {
    console.log('📝 Agregando columna image_url a la tabla quotes...\n')

    const sqlPath = path.join(__dirname, '../sql/add_image_url_to_quotes.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')

    await query(sql)

    console.log('✅ Columna image_url agregada exitosamente')

    // Verificar la estructura actualizada
    const result = await query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'quotes'
      ORDER BY ordinal_position;
    `)

    console.log('\n📋 Estructura actualizada de quotes:\n')
    console.log('Columna              | Tipo              | Nullable')
    console.log('---------------------|-------------------|----------')
    result.rows.forEach(row => {
      const nullable = row.is_nullable === 'YES' ? 'SÍ' : 'NO'
      console.log(`${row.column_name.padEnd(20)} | ${row.data_type.padEnd(17)} | ${nullable}`)
    })

    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

addImageUrlColumn()
