import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const railwayConfig = {
  host: 'ballast.proxy.rlwy.net',
  port: 23380,
  user: 'postgres',
  password: 'oyMZIKusAGlHtExNYfpRSsWDxpmFEFqh',
  database: 'railway',
  ssl: {
    rejectUnauthorized: false
  }
};

async function applySchema() {
  const client = new pg.Client(railwayConfig);

  try {
    console.log('🔌 Conectando a Railway...');
    await client.connect();
    console.log('✅ Conectado\n');

    // 1. Drop todas las tablas existentes
    console.log('🗑️  Eliminando schema anterior...');
    await client.query(`
      DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;
      GRANT ALL ON SCHEMA public TO postgres;
      GRANT ALL ON SCHEMA public TO public;
    `);
    console.log('✅ Schema limpio\n');

    // 2. Leer y aplicar ACTUAL_schema.sql
    console.log('📥 Leyendo ACTUAL_schema.sql...');
    const schemaPath = path.join(__dirname, '../sql/ACTUAL_schema.sql');
    const schemaSQLRaw = fs.readFileSync(schemaPath, 'utf8');

    // Limpiar comandos que no son compatibles
    let schemaSQL = schemaSQLRaw
      .replace(/\\restrict.*$/gm, '') // Remover restricciones específicas
      .replace(/\\unrestrict.*$/gm, '')
      .replace(/-- Dumped.*$/gm, '')
      .trim();

    console.log('✅ Archivo leído\n');

    // 3. Ejecutar schema
    console.log('🏗️  Aplicando schema completo...');
    await client.query(schemaSQL);
    console.log('✅ Schema aplicado exitosamente\n');

    // 4. Verificar tablas creadas
    console.log('📊 Verificando tablas creadas...');
    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    console.log(`✅ ${result.rows.length} tablas creadas:`);
    result.rows.forEach(row => console.log(`   - ${row.table_name}`));

    console.log('\n🎉 Schema real aplicado exitosamente a Railway!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nDetalles:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Conexión cerrada');
  }
}

applySchema();
