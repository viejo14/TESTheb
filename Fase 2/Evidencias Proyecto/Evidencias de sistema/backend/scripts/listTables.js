import { query } from '../src/config/database.js'

async function listTables() {
  try {
    //console.log('📋 Listando todas las tablas en bordados_testheb...\n')

    const result = await query(`
      SELECT
        table_name,
        (SELECT COUNT(*) FROM information_schema.columns WHERE columns.table_name = tables.table_name) as column_count
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `)

    if (result.rows.length === 0) {
      //console.log('No se encontraron tablas en la base de datos.')
    } else {
      //console.log(`Total de tablas: ${result.rows.length}\n`)
      //console.log('Tabla                      | Columnas')
      //console.log('---------------------------|---------')
      result.rows.forEach(row => {
        //console.log(`${row.table_name.padEnd(26)} | ${row.column_count}`)
      })
    }

    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

listTables()
