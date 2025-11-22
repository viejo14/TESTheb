import { query } from '../config/database.js'
import { catchAsync } from '../middleware/errorHandler.js'

/**
 * Obtener productos más vendidos (público - para Home)
 */
export const getTopProducts = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit) || 6

  const topProducts = await query(`
    SELECT
      p.id,
      p.name,
      p.image_url,
      p.price,
      p.sku,
      p.stock,
      c.name as category_name,
      s.name as size_name,
      s.display_name as size_display_name,
      COALESCE(SUM(oi.quantity), 0) as total_vendido,
      COALESCE(SUM(oi.quantity * oi.price), 0) as ingresos_totales
    FROM products p
    LEFT JOIN order_items oi ON p.id = oi.product_id
    LEFT JOIN orders o ON oi.order_id = o.id
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN sizes s ON p.size_id = s.id
    WHERE (o.status IN ('authorized', 'completed', 'confirmed') OR o.id IS NULL)
      AND p.stock > 0
    GROUP BY p.id, p.name, p.image_url, p.price, p.sku, p.stock, c.name, s.name, s.display_name
    ORDER BY total_vendido DESC
    LIMIT $1
  `, [limit])

  res.json({
    success: true,
    message: 'Productos más vendidos obtenidos exitosamente',
    data: topProducts.rows
  })
})

/**
 * Obtener estadísticas del dashboard
 */
export const getDashboardStats = catchAsync(async (req, res) => {
  // 1. Productos más vendidos
  const topProducts = await query(`
    SELECT
      p.id,
      p.name,
      p.image_url,
      p.price,
      c.name as category_name,
      COALESCE(SUM(oi.quantity), 0) as total_vendido,
      COALESCE(SUM(oi.quantity * oi.price), 0) as ingresos_totales
    FROM products p
    LEFT JOIN order_items oi ON p.id = oi.product_id
    LEFT JOIN orders o ON oi.order_id = o.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE o.status IN ('authorized', 'completed', 'confirmed') OR o.id IS NULL
    GROUP BY p.id, p.name, p.image_url, p.price, c.name
    ORDER BY total_vendido DESC
    LIMIT 10
  `)

  // 2. Total de ventas y ingresos
  const salesStats = await query(`
    SELECT
      COUNT(DISTINCT o.id) as total_ordenes,
      COALESCE(SUM(o.total), 0) as ingresos_totales,
      COALESCE(AVG(o.total), 0) as ticket_promedio
    FROM orders o
    WHERE o.status IN ('authorized', 'completed', 'confirmed')
  `)

  // 3. Ventas por categoría (ordenado por cantidad vendida)
  const salesByCategory = await query(`
    SELECT
      c.name as categoria,
      COALESCE(SUM(oi.quantity), 0) as productos_vendidos,
      COALESCE(SUM(oi.quantity * oi.price), 0) as ingresos
    FROM categories c
    LEFT JOIN products p ON c.id = p.category_id
    LEFT JOIN order_items oi ON p.id = oi.product_id
    LEFT JOIN orders o ON oi.order_id = o.id
    WHERE o.status IN ('authorized', 'completed', 'confirmed') OR o.id IS NULL
    GROUP BY c.id, c.name
    ORDER BY productos_vendidos DESC
  `)

  // 4. Cotizaciones recientes
  const recentQuotes = await query(`
    SELECT
      COUNT(*) as total_cotizaciones,
      COUNT(CASE WHEN status = 'pendiente' THEN 1 END) as pendientes,
      COUNT(CASE WHEN status = 'aprobada' THEN 1 END) as aprobadas
    FROM quotes
    WHERE created_at >= NOW() - INTERVAL '30 days'
  `)

  // 5. Órdenes recientes (últimos 7 días)
  const recentOrders = await query(`
    SELECT
      DATE(created_at) as fecha,
      COUNT(*) as ordenes,
      COALESCE(SUM(total), 0) as ingresos
    FROM orders
    WHERE created_at >= NOW() - INTERVAL '7 days'
    GROUP BY DATE(created_at)
    ORDER BY fecha DESC
  `)

  // 6. Estadísticas de inventario
  const inventoryStats = await query(`
    SELECT
      COUNT(*) as total_productos,
      COALESCE(SUM(stock), 0) as total_stock,
      COUNT(CASE WHEN stock = 0 THEN 1 END) as productos_sin_stock,
      COUNT(CASE WHEN stock > 0 AND stock <= 5 THEN 1 END) as productos_stock_bajo
    FROM products
  `)

  res.json({
    success: true,
    data: {
      topProducts: topProducts.rows,
      salesStats: salesStats.rows[0],
      salesByCategory: salesByCategory.rows,
      recentQuotes: recentQuotes.rows[0],
      recentOrders: recentOrders.rows,
      inventoryStats: inventoryStats.rows[0]
    }
  })
})
