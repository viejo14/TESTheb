import pg from 'pg';

// Configuración BD Local
const localConfig = {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'admin123',
  database: 'bordados_testheb'
};

// Configuración BD Railway
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

// Orden de tablas (respetando foreign keys)
const TABLES_ORDER = [
  'users',
  'categories',
  'sizes',
  'products',
  'product_images',
  'quotes',
  'orders',
  'order_items',
  'newsletter_subscribers'
];

async function migrateTable(localClient, railwayClient, tableName) {
  console.log(`\n📦 Migrando tabla: ${tableName}`);

  try {
    // 1. Obtener datos de local
    console.log(`   📥 Extrayendo datos de local...`);
    const localData = await localClient.query(`SELECT * FROM ${tableName}`);
    const rowCount = localData.rows.length;

    if (rowCount === 0) {
      console.log(`   ⚠️  Tabla vacía, saltando...`);
      return { table: tableName, rows: 0, status: 'empty' };
    }

    console.log(`   ✅ ${rowCount} registros extraídos`);

    // 2. Limpiar tabla en Railway (mantener estructura)
    console.log(`   🧹 Limpiando tabla en Railway...`);
    await railwayClient.query(`TRUNCATE TABLE ${tableName} CASCADE`);

    // 3. Si no hay datos, terminar
    if (rowCount === 0) {
      return { table: tableName, rows: 0, status: 'empty' };
    }

    // 4. Obtener columnas
    const columns = Object.keys(localData.rows[0]);
    const columnNames = columns.join(', ');
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');

    // 5. Insertar datos uno por uno (para manejar errores mejor)
    console.log(`   📤 Insertando datos en Railway...`);
    let insertedCount = 0;
    let errorCount = 0;

    for (const row of localData.rows) {
      try {
        // Convertir valores JSONB correctamente
        const values = columns.map(col => {
          const value = row[col];
          // Si es un objeto/array y la columna es jsonb, convertir a string JSON
          if (value !== null && typeof value === 'object' && !Buffer.isBuffer(value) && !(value instanceof Date)) {
            return JSON.stringify(value);
          }
          return value;
        });

        await railwayClient.query(
          `INSERT INTO ${tableName} (${columnNames}) VALUES (${placeholders})`,
          values
        );
        insertedCount++;
      } catch (error) {
        errorCount++;
        console.log(`   ⚠️  Error insertando fila: ${error.message.substring(0, 100)}`);
      }
    }

    // 6. Resetear secuencias (auto-increment)
    if (columns.includes('id')) {
      const maxIdResult = await railwayClient.query(`SELECT MAX(id) as max_id FROM ${tableName}`);
      const maxId = maxIdResult.rows[0].max_id || 0;
      if (maxId > 0) {
        await railwayClient.query(`SELECT setval('${tableName}_id_seq', ${maxId}, true)`);
        console.log(`   🔄 Secuencia actualizada a ${maxId}`);
      }
    }

    console.log(`   ✅ ${insertedCount} registros insertados${errorCount > 0 ? ` (${errorCount} errores)` : ''}`);
    return { table: tableName, rows: insertedCount, errors: errorCount, status: 'success' };

  } catch (error) {
    console.error(`   ❌ Error migrando ${tableName}: ${error.message}`);
    return { table: tableName, rows: 0, status: 'error', error: error.message };
  }
}

async function migrate() {
  const localClient = new pg.Client(localConfig);
  const railwayClient = new pg.Client(railwayConfig);

  try {
    // Conectar a ambas BDs
    console.log('🔌 Conectando a base de datos LOCAL...');
    await localClient.connect();
    console.log('✅ Conectado a BD local\n');

    console.log('🔌 Conectando a base de datos RAILWAY...');
    await railwayClient.connect();
    console.log('✅ Conectado a BD Railway\n');

    console.log('=' .repeat(60));
    console.log('🚀 INICIANDO MIGRACIÓN DE DATOS');
    console.log('=' .repeat(60));

    const results = [];

    // Migrar cada tabla en orden
    for (const table of TABLES_ORDER) {
      const result = await migrateTable(localClient, railwayClient, table);
      results.push(result);
    }

    // Resumen final
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN DE MIGRACIÓN');
    console.log('='.repeat(60));

    let totalRows = 0;
    let totalErrors = 0;

    results.forEach(result => {
      const status = result.status === 'success' ? '✅' :
                     result.status === 'empty' ? '⚪' : '❌';
      console.log(`${status} ${result.table.padEnd(25)} - ${result.rows} registros${result.errors ? ` (${result.errors} errores)` : ''}`);
      totalRows += result.rows;
      totalErrors += result.errors || 0;
    });

    console.log('='.repeat(60));
    console.log(`📈 TOTAL: ${totalRows} registros migrados`);
    if (totalErrors > 0) {
      console.log(`⚠️  ${totalErrors} errores durante la migración`);
    }
    console.log('='.repeat(60));

    console.log('\n🎉 ¡Migración completada!\n');

  } catch (error) {
    console.error('❌ Error crítico:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await localClient.end();
    await railwayClient.end();
    console.log('🔌 Conexiones cerradas');
  }
}

// Ejecutar migración
migrate();
