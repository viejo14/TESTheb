import { query } from '../src/config/database.js'

async function describeQuotesTable() {
  try {
    //console.log('📋 Estructura de la tabla quotes:\n')

    const result = await query(`
      SELECT
        column_name,
        data_type,
        character_maximum_length,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_name = 'quotes'
      ORDER BY ordinal_position;
    `)

    if (result.rows.length === 0) {
      //console.log('❌ La tabla quotes no existe.')
    } else {
      //console.log('Columna              | Tipo              | Nullable | Default')
      //console.log('---------------------|-------------------|----------|------------------')
      result.rows.forEach(row => {
        const type = row.character_maximum_length
          ? `${row.data_type}(${row.character_maximum_length})`
          : row.data_type
        const nullable = row.is_nullable === 'YES' ? 'SÍ' : 'NO'
        const defaultVal = row.column_default || '-'
        //console.log(
          `${row.column_name.padEnd(20)} | ${type.padEnd(17)} | ${nullable.padEnd(8)} | ${defaultVal}`
        )
      })
    }

    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

describeQuotesTable()
