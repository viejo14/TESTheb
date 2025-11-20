import express from 'express'
import {
  createTransaction,
  commitTransaction,
  getOrderStatus
} from '../controllers/webpayController.js'

const router = express.Router()

// Crear nueva transacción WebPay
router.post('/create', createTransaction)

// Confirmar transacción (callback de Transbank)
// Acepta tanto POST como GET ya que Transbank puede usar ambos
router.post('/commit', commitTransaction)
router.get('/commit', commitTransaction)

// Obtener estado de una orden
router.get('/order/:buyOrder', getOrderStatus)

export default router