import pg from 'pg';

const connectionConfig = {
  host: 'ballast.proxy.rlwy.net',
  port: 23380,
  user: 'postgres',
  password: 'oyMZIKusAGlHtExNYfpRSsWDxpmFEFqh',
  database: 'railway',
  ssl: {
    rejectUnauthorized: false
  }
};

async function verifyDatabase() {
  const client = new pg.Client(connectionConfig);

  try {
    await client.connect();
    console.log('✅ Conectado a Railway\n');

    // Verificar usuarios
    console.log('👤 Usuarios en la base de datos:');
    const usersResult = await client.query('SELECT id, email, role, created_at FROM users ORDER BY id');

    if (usersResult.rows.length === 0) {
      console.log('   ⚠️  No hay usuarios creados');
    } else {
      usersResult.rows.forEach(user => {
        console.log(`   - ID: ${user.id} | Email: ${user.email} | Role: ${user.role}`);
      });
    }

    // Verificar categorías
    console.log('\n📁 Categorías:');
    const categoriesResult = await client.query('SELECT id, name FROM categories ORDER BY id');
    categoriesResult.rows.forEach(cat => {
      console.log(`   - ${cat.name}`);
    });

    // Verificar tallas
    console.log('\n📏 Tallas disponibles:');
    const sizesResult = await client.query('SELECT id, name FROM sizes ORDER BY id');
    sizesResult.rows.forEach(size => {
      console.log(`   - ${size.name}`);
    });

    console.log('\n✅ Verificación completa');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

verifyDatabase();
