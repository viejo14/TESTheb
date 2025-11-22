import Order from '../models/Order.js'
import OrderItem from '../models/OrderItem.js'
import Product from '../models/Product.js'
import logger from '../config/logger.js'

/**
 * Obtiene todas las órdenes con paginación y filtros
 */
export const getAllOrders = async (req, res) => {
  try {
    const {
      status,
      startDate,
      endDate,
      page = 1,
      limit = 50,
      search
    } = req.query

    // Obtener todas las órdenes paginadas
    const orders = await Order.findAll({
      status,
      startDate,
      endDate,
      page: parseInt(page),
      limit: parseInt(limit),
      search
    })

    // Obtener el total de órdenes (sin paginación)
    const totalResult = await Order.countAll({ status, startDate, endDate, search })
    const total = totalResult.total
    const totalPages = Math.ceil(total / parseInt(limit))

    logger.info(`📦 Se obtuvieron ${orders.length} órdenes`)

    res.json({
      success: true,
      message: 'Órdenes obtenidas exitosamente',
      data: orders,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        limit: parseInt(limit)
      }
    })
  } catch (error) {
    logger.error('❌ Error obteniendo órdenes:', error)
    res.status(500).json({
      success: false,
      message: 'Error obteniendo órdenes',
      error: error.message
    })
  }
}

/**
 * Obtiene una orden específica con todos sus items y productos
 */
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params

    // Obtener la orden
    const order = await Order.findById(id)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      })
    }

    // Obtener los items de la orden
    const orderItems = await OrderItem.findByOrderId(id)

    // Enriquecer los items con información del producto
    const itemsWithProducts = await Promise.all(
      orderItems.map(async (item) => {
        const product = await Product.findById(item.product_id)
        return {
          ...item,
          product_name: product?.name || 'Producto no disponible',
          product_image: product?.image_url || null,
          product_sku: product?.sku || null
        }
      })
    )

    // Combinar orden con items
    const orderWithDetails = {
      ...order,
      items: itemsWithProducts,
      items_count: itemsWithProducts.length
    }

    logger.info(`📦 Orden ${id} obtenida con ${itemsWithProducts.length} items`)

    res.json({
      success: true,
      message: 'Orden obtenida exitosamente',
      data: orderWithDetails
    })
  } catch (error) {
    logger.error(`❌ Error obteniendo orden ${req.params.id}:`, error)
    res.status(500).json({
      success: false,
      message: 'Error obteniendo orden',
      error: error.message
    })
  }
}

/**
 * Actualiza el estado de una orden
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status, notes } = req.body

    // Validar que el estado sea válido
    const validStatuses = ['created', 'pending', 'authorized', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'failed']

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'El estado es requerido'
      })
    }

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Estado inválido. Estados válidos: ${validStatuses.join(', ')}`
      })
    }

    // Verificar que la orden existe
    const existingOrder = await Order.findById(id)
    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      })
    }

    // Actualizar el estado
    const updatedOrder = await Order.updateOrderStatus(id, status, notes)

    logger.info(`✅ Estado de orden ${id} actualizado: ${existingOrder.status} -> ${status}`)

    res.json({
      success: true,
      message: `Estado de orden actualizado a: ${status}`,
      data: updatedOrder
    })
  } catch (error) {
    logger.error(`❌ Error actualizando estado de orden ${req.params.id}:`, error)
    res.status(500).json({
      success: false,
      message: 'Error actualizando estado de orden',
      error: error.message
    })
  }
}

/**
 * Obtiene estadísticas generales de órdenes
 */
export const getOrdersStats = async (req, res) => {
  try {
    const stats = await Order.getStats()

    logger.info('📊 Estadísticas de órdenes obtenidas')

    res.json({
      success: true,
      message: 'Estadísticas obtenidas exitosamente',
      data: stats
    })
  } catch (error) {
    logger.error('❌ Error obteniendo estadísticas de órdenes:', error)
    res.status(500).json({
      success: false,
      message: 'Error obteniendo estadísticas',
      error: error.message
    })
  }
}
