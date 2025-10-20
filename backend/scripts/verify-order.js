import Order from './src/models/Order.js'
import OrderItem from './src/models/OrderItem.js'
import { query } from './src/config/database.js'

async function verifyLatestOrder() {
  //console.log('🔍 Verificando última orden...\n')

  try {
    // 1. Obtener la última orden
    const latestOrderResult = await query(`
      SELECT * FROM orders
      ORDER BY created_at DESC
      LIMIT 1
    `)

    if (latestOrderResult.rows.length === 0) {
      //console.log('❌ No se encontraron órdenes en la base de datos')
      process.exit(1)
    }

    const order = latestOrderResult.rows[0]
    //console.log('✅ Última orden encontrada:')
    //console.log('   Buy Order:', order.buy_order)
    //console.log('   Status:', order.status)
    //console.log('   Amount:', order.amount)
    //console.log('   Customer:', order.customer_name, `(${order.customer_email})`)
    //console.log('   Created:', order.created_at)
    //console.log('   Items (JSONB):', JSON.stringify(order.items, null, 2))
    //console.log()

    // 2. Verificar usando el modelo Order
    //console.log('🔍 Verificando con modelo Order.findByBuyOrder()...')
    const orderFromModel = await Order.findByBuyOrder(order.buy_order)

    if (orderFromModel) {
      //console.log('✅ Order.findByBuyOrder() funciona correctamente')
      //console.log('   Modelo devolvió:', orderFromModel.buy_order, '-', orderFromModel.status)
    } else {
      //console.log('❌ Order.findByBuyOrder() NO encontró la orden')
    }
    //console.log()

    // 3. Verificar order_items
    //console.log('🔍 Verificando order_items en la tabla...')
    const orderItemsResult = await query(`
      SELECT
        oi.id,
        oi.order_id,
        oi.product_id,
        oi.quantity,
        oi.price,
        p.name as product_name
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
    `, [order.id])

    if (orderItemsResult.rows.length > 0) {
      //console.log(`✅ Se encontraron ${orderItemsResult.rows.length} order_items:`)
      orderItemsResult.rows.forEach((item, index) => {
        //console.log(`   ${index + 1}. ${item.product_name} (ID: ${item.product_id})`)
        //console.log(`      Cantidad: ${item.quantity}, Precio: $${item.price}`)
      })
    } else {
      //console.log('⚠️  NO se encontraron order_items')
      //console.log('   Esto puede ser normal si el pago no fue autorizado')
    }
    //console.log()

    // 4. Verificar usando el modelo OrderItem
    //console.log('🔍 Verificando con modelo OrderItem.findByOrderId()...')
    const itemsFromModel = await OrderItem.findByOrderId(order.id)

    if (itemsFromModel.length > 0) {
      //console.log(`✅ OrderItem.findByOrderId() encontró ${itemsFromModel.length} items`)
    } else {
      //console.log('⚠️  OrderItem.findByOrderId() no encontró items')
    }
    //console.log()

    // 5. Verificar datos de pago
    if (order.authorization_code) {
      //console.log('💳 Información de pago:')
      //console.log('   Authorization Code:', order.authorization_code)
      //console.log('   Response Code:', order.response_code)
      //console.log('   Payment Type:', order.payment_type_code)
      //console.log('   Card (últimos 4):', order.card_last4)
      //console.log('   Cuotas:', order.installments_number)
    }
    //console.log()

    // 6. Resumen final
    //console.log('📊 RESUMEN DE VERIFICACIÓN:')
    //console.log('   ✅ Orden creada en DB:', order.buy_order)
    //console.log('   ✅ Modelo Order.findByBuyOrder() funciona:', orderFromModel ? 'SÍ' : 'NO')
    //console.log('   ✅ Order items en DB:', orderItemsResult.rows.length, 'items')
    //console.log('   ✅ Modelo OrderItem.findByOrderId() funciona:', itemsFromModel.length > 0 ? 'SÍ' : 'NO')
    //console.log()

    if (order.status === 'authorized' && orderItemsResult.rows.length > 0) {
      //console.log('🎉 ¡PERFECTO! La compra se procesó correctamente con los nuevos modelos')
    } else if (order.status === 'created') {
      //console.log('⏳ Orden creada pero pendiente de pago')
    } else if (order.status === 'aborted') {
      //console.log('❌ Pago cancelado por el usuario')
    } else {
      //console.log('⚠️  Estado de orden:', order.status)
    }

    process.exit(0)

  } catch (error) {
    console.error('❌ Error verificando orden:', error)
    process.exit(1)
  }
}

// Ejecutar verificación
verifyLatestOrder()
