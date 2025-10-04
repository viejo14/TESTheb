import { query } from '../src/config/database.js'

async function migrateOrderItems() {
  try {
    console.log('🔄 Migrando order_items de órdenes existentes...\n')

    // Obtener todas las órdenes autorizadas
    const orders = await query(`
      SELECT id, buy_order, items, status
      FROM orders
      WHERE status = 'authorized'
      ORDER BY created_at DESC
    `)

    console.log(`📦 Órdenes autorizadas encontradas: ${orders.rows.length}\n`)

    let migratedCount = 0
    let skippedCount = 0
    let errorCount = 0

    for (const order of orders.rows) {
      try {
        // Verificar si ya tiene order_items
        const existingItems = await query(
          'SELECT COUNT(*) as count FROM order_items WHERE order_id = $1',
          [order.id]
        )

        if (existingItems.rows[0].count > 0) {
          console.log(`⏭️  Orden #${order.id} (${order.buy_order}) - ya tiene items, omitiendo...`)
          skippedCount++
          continue
        }

        // items ya viene parseado desde PostgreSQL (tipo JSONB)
        const items = order.items || []

        if (!Array.isArray(items) || items.length === 0) {
          console.log(`⚠️  Orden #${order.id} (${order.buy_order}) - sin items, omitiendo...`)
          skippedCount++
          continue
        }

        // Insertar cada item
        for (const item of items) {
          await query(`
            INSERT INTO order_items (order_id, product_id, quantity, price, created_at)
            VALUES ($1, $2, $3, $4, NOW())
          `, [
            order.id,
            item.id || item.product_id,
            item.quantity,
            parseFloat(item.price) // price puede venir como string
          ])
        }

        console.log(`✅ Orden #${order.id} (${order.buy_order}) - ${items.length} items migrados`)
        migratedCount++

      } catch (itemError) {
        console.error(`❌ Error migrando orden #${order.id}:`, itemError.message)
        errorCount++
      }
    }

    console.log('\n📊 Resumen de migración:')
    console.log(`  ✅ Órdenes migradas: ${migratedCount}`)
    console.log(`  ⏭️  Órdenes omitidas: ${skippedCount}`)
    console.log(`  ❌ Errores: ${errorCount}`)

    // Mostrar estadísticas finales
    const totalItems = await query('SELECT COUNT(*) as count FROM order_items')
    console.log(`\n📦 Total de order_items en la base de datos: ${totalItems.rows[0].count}`)

    process.exit(0)
  } catch (error) {
    console.error('❌ Error en migración:', error.message)
    process.exit(1)
  }
}

migrateOrderItems()
