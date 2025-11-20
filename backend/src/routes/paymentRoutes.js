import express from 'express'
import { createTransaction, confirmTransaction, getTransactionStatus, createCheckout } from '../controllers/paymentController.js'

const router = express.Router()

// Crear nueva transacción de pago
router.post('/create', createTransaction)

// Crear checkout para carrito
router.post('/checkout', createCheckout)

// Confirmar transacción (callback desde Transbank)
router.post('/confirm', confirmTransaction)

// Obtener estado de transacción
router.get('/status/:token', getTransactionStatus)

// Endpoint para manejar el retorno desde Transbank (GET y POST)
router.get('/return', confirmTransaction)
router.post('/return', confirmTransaction)

export default router