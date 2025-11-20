import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localConfig = {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'admin123',
  database: 'bordados_testheb'
};

async function extractSchema() {
  const client = new pg.Client(localConfig);

  try {
    console.log('🔌 Conectando a BD local...');
    await client.connect();
    console.log('✅ Conectado\n');

    // Obtener información de todas las tablas y sus columnas
    console.log('📊 Extrayendo estructura de tablas...\n');

    const tablesQuery = `
      SELECT
        table_name,
        column_name,
        data_type,
        character_maximum_length,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position
    `;

    const result = await client.query(tablesQuery);

    // Agrupar por tabla
    const tables = {};
    result.rows.forEach(row => {
      if (!tables[row.table_name]) {
        tables[row.table_name] = [];
      }
      tables[row.table_name].push(row);
    });

    // Mostrar estructura
    console.log('📋 Estructura de tablas en BD local:\n');
    console.log('='.repeat(80));

    for (const [tableName, columns] of Object.entries(tables)) {
      console.log(`\n📦 ${tableName}:`);
      columns.forEach(col => {
        const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
        const type = col.character_maximum_length
          ? `${col.data_type}(${col.character_maximum_length})`
          : col.data_type;
        const def = col.column_default ? ` DEFAULT ${col.column_default}` : '';
        console.log(`   - ${col.column_name.padEnd(30)} ${type.padEnd(20)} ${nullable}${def}`);
      });
    }

    console.log('\n' + '='.repeat(80));

    // Guardar a archivo para referencia
    const outputPath = path.join(__dirname, '../sql/schema_local_actual.txt');
    let output = 'ESTRUCTURA DE BASE DE DATOS LOCAL\n';
    output += '='.repeat(80) + '\n\n';

    for (const [tableName, columns] of Object.entries(tables)) {
      output += `\nTabla: ${tableName}\n`;
      output += '-'.repeat(80) + '\n';
      columns.forEach(col => {
        const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
        const type = col.character_maximum_length
          ? `${col.data_type}(${col.character_maximum_length})`
          : col.data_type;
        const def = col.column_default ? ` DEFAULT ${col.column_default}` : '';
        output += `${col.column_name.padEnd(30)} ${type.padEnd(20)} ${nullable}${def}\n`;
      });
      output += '\n';
    }

    fs.writeFileSync(outputPath, output, 'utf8');
    console.log(`\n💾 Estructura guardada en: ${outputPath}\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

extractSchema();
