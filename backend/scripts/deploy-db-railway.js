import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de conexión a Railway
const connectionConfig = {
  host: 'ballast.proxy.rlwy.net',
  port: 23380,
  user: 'postgres',
  password: 'oyMZIKusAGlHtExNYfpRSsWDxpmFEFqh',
  database: 'railway',
  ssl: {
    rejectUnauthorized: false // Railway requiere SSL pero con certificado auto-firmado
  }
};

async function deployDatabase() {
  const client = new pg.Client(connectionConfig);

  try {
    console.log('🔌 Conectando a Railway PostgreSQL...');
    await client.connect();
    console.log('✅ Conectado exitosamente\n');

    // 1. Verificar estado actual
    console.log('📊 Verificando estado actual de la base de datos...');
    const tablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    if (tablesResult.rows.length === 0) {
      console.log('⚠️  Base de datos vacía (sin tablas)\n');
    } else {
      console.log(`📋 Tablas existentes (${tablesResult.rows.length}):`);
      tablesResult.rows.forEach(row => console.log(`   - ${row.table_name}`));
      console.log('');
    }

    // 2. Ejecutar schema_completo.sql
    console.log('🏗️  Ejecutando schema_completo.sql...');
    const schemaPath = path.join(__dirname, '../sql/schema_completo.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

    await client.query(schemaSQL);
    console.log('✅ Schema ejecutado exitosamente\n');

    // 3. Ejecutar seed_data.sql
    console.log('🌱 Ejecutando seed_data.sql...');
    const seedPath = path.join(__dirname, '../sql/seed_data.sql');
    const seedSQL = fs.readFileSync(seedPath, 'utf8');

    await client.query(seedSQL);
    console.log('✅ Seed data ejecutado exitosamente\n');

    // 4. Verificar tablas creadas
    console.log('📊 Verificando tablas creadas...');
    const finalTablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log(`✅ Tablas creadas (${finalTablesResult.rows.length}):`);
    finalTablesResult.rows.forEach(row => console.log(`   - ${row.table_name}`));
    console.log('');

    // 5. Contar registros en tablas principales
    console.log('📈 Contando registros en tablas principales...');
    const tables = ['users', 'categories', 'products', 'sizes'];

    for (const table of tables) {
      try {
        const countResult = await client.query(`SELECT COUNT(*) FROM ${table}`);
        console.log(`   - ${table}: ${countResult.rows[0].count} registros`);
      } catch (error) {
        console.log(`   - ${table}: Error al contar (${error.message})`);
      }
    }

    console.log('\n🎉 ¡Base de datos desplegada exitosamente en Railway!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nDetalles completos:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 Conexión cerrada');
  }
}

// Ejecutar
deployDatabase();
