import { query } from '../src/config/database.js'

async function checkOrders() {
  try {
    //console.log('📦 Verificando órdenes en la base de datos...\n')

    // Ver todas las órdenes
    const orders = await query(`
      SELECT
        id,
        user_id,
        status,
        total,
        created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT 10
    `)

    //console.log(`Total de órdenes: ${orders.rows.length}\n`)

    if (orders.rows.length > 0) {
      //console.log('ID   | Estado      | Total    | Fecha')
      //console.log('-----|-------------|----------|-------------------')
      orders.rows.forEach(order => {
        //console.log(
          `${order.id.toString().padEnd(4)} | ${order.status.padEnd(11)} | $${order.total.toString().padEnd(7)} | ${new Date(order.created_at).toLocaleString('es-CL')}`
        )
      })
    } else {
      //console.log('❌ No hay órdenes en la base de datos')
    }

    // Ver order_items de la última orden
    if (orders.rows.length > 0) {
      const lastOrderId = orders.rows[0].id
      //console.log(`\n📋 Items de la orden #${lastOrderId}:\n`)

      const items = await query(`
        SELECT
          oi.id,
          oi.product_id,
          p.name as product_name,
          oi.quantity,
          oi.price
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = $1
      `, [lastOrderId])

      if (items.rows.length > 0) {
        //console.log('Producto               | Cantidad | Precio')
        //console.log('-----------------------|----------|--------')
        items.rows.forEach(item => {
          //console.log(`${item.product_name.padEnd(22)} | ${item.quantity.toString().padEnd(8)} | $${item.price}`)
        })
      } else {
        //console.log('❌ No hay items en esta orden')
      }
    }

    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

checkOrders()
