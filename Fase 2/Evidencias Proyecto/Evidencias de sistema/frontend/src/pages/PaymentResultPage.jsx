import { useEffect, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiDownload, FiHome, FiShoppingBag } from 'react-icons/fi'
import jsPDF from 'jspdf'

// Mapeo de tipos de pago según documentación Transbank
const PAYMENT_TYPES = {
  'VD': 'Débito',
  'VP': 'Prepago',
  'VN': 'Crédito (sin cuotas)',
  'VC': 'Crédito en cuotas',
  'SI': '3 cuotas sin interés',
  'S2': '2 cuotas sin interés',
  'NC': 'N cuotas sin interés'
}

const PaymentResultPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [paymentData, setPaymentData] = useState(null)
  const [loading, setLoading] = useState(true)

  const [orderItems, setOrderItems] = useState([])

  useEffect(() => {
    // Extraer parámetros de la URL
    const params = new URLSearchParams(location.search)

    const data = {
      status: params.get('status'),
      buyOrder: params.get('buyOrder'),
      amount: params.get('amount'),
      authorizationCode: params.get('authorizationCode'),
      responseCode: params.get('responseCode'),
      paymentTypeCode: params.get('paymentTypeCode'),
      installmentsNumber: params.get('installmentsNumber'),
      cardNumber: params.get('cardNumber'),
      message: params.get('message')
    }

    setPaymentData(data)

    // Recuperar productos de la orden
    try {
      const currentOrder = localStorage.getItem('testheb_current_order')
      if (currentOrder) {
        const orderData = JSON.parse(currentOrder)
        setOrderItems(orderData.cartItems || [])
      }
    } catch (err) {
      console.error('Error recuperando orden:', err)
    }

    setLoading(false)

    // Limpiar carrito si el pago fue exitoso
    if (data.status === 'authorized') {
      // Aquí podrías integrar con tu contexto de carrito
      localStorage.removeItem('cart')

      // Opcional: También limpiar otros datos relacionados con la compra
      localStorage.removeItem('shippingData')
      localStorage.removeItem('checkoutData')
    }
  }, [location])

  const getStatusConfig = () => {
    if (!paymentData) return { icon: FiAlertCircle, color: 'gray', title: 'Cargando...', message: '' }

    switch (paymentData.status) {
      case 'authorized':
        return {
          icon: FiCheckCircle,
          color: 'green',
          title: '¡Pago Autorizado!',
          message: 'Tu pago ha sido procesado exitosamente'
        }
      case 'aborted':
        return {
          icon: FiXCircle,
          color: 'yellow',
          title: 'Pago Cancelado',
          message: 'El pago fue cancelado por el usuario'
        }
      case 'rejected':
        return {
          icon: FiXCircle,
          color: 'red',
          title: 'Pago Rechazado',
          message: 'El pago fue rechazado por el banco'
        }
      case 'error':
        return {
          icon: FiAlertCircle,
          color: 'red',
          title: 'Error en el Pago',
          message: paymentData.message || 'Ocurrió un error procesando el pago'
        }
      default:
        return {
          icon: FiAlertCircle,
          color: 'gray',
          title: 'Estado Desconocido',
          message: 'No se pudo determinar el estado del pago'
        }
    }
  }

  const formatAmount = (amount) => {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDateTime = () => {
    return new Date().toLocaleString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const downloadVoucher = () => {
    if (!paymentData) return

    // Crear un nuevo documento PDF
    const doc = new jsPDF()

    // Configuración de colores
    const primaryColor = [59, 130, 246] // Azul
    const darkColor = [31, 41, 55] // Gris oscuro
    const grayColor = [107, 114, 128] // Gris medio
    const greenColor = [16, 185, 129] // Verde

    let yPosition = 20

    // === ENCABEZADO ===
    // Título principal
    doc.setFillColor(...primaryColor)
    doc.rect(0, 0, 210, 35, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('TESTheb', 105, 15, { align: 'center' })

    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('Bordados de Calidad', 105, 25, { align: 'center' })

    yPosition = 45

    // Estado del pago
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    if (paymentData.status === 'authorized') {
      doc.setTextColor(...greenColor)
      doc.text('¡PAGO AUTORIZADO!', 105, yPosition, { align: 'center' })
    } else {
      doc.setTextColor(220, 38, 38)
      doc.text(getStatusConfig().title.toUpperCase(), 105, yPosition, { align: 'center' })
    }

    yPosition += 5
    doc.setFontSize(10)
    doc.setTextColor(...grayColor)
    doc.text(getStatusConfig().message, 105, yPosition, { align: 'center' })

    yPosition += 15

    // === INFORMACIÓN DE LA TRANSACCIÓN ===
    doc.setFillColor(245, 245, 245)
    doc.rect(15, yPosition - 5, 180, 10, 'F')

    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...darkColor)
    doc.text('DETALLES DE LA TRANSACCIÓN', 20, yPosition)

    yPosition += 10

    // Grid de información
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')

    const leftColumn = 20
    const rightColumn = 110
    const lineHeight = 7

    // Columna izquierda
    doc.setTextColor(...grayColor)
    doc.text('Orden de Compra:', leftColumn, yPosition)
    doc.setTextColor(...darkColor)
    doc.setFont('helvetica', 'bold')
    doc.text(paymentData.buyOrder || 'N/A', leftColumn, yPosition + 4)

    // Columna derecha
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...grayColor)
    doc.text('Monto:', rightColumn, yPosition)
    doc.setTextColor(...darkColor)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text(formatAmount(paymentData.amount), rightColumn, yPosition + 4)

    yPosition += 12

    // Segunda fila
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...grayColor)
    doc.text('Fecha y Hora:', leftColumn, yPosition)
    doc.setTextColor(...darkColor)
    doc.setFont('helvetica', 'bold')
    doc.text(formatDateTime(), leftColumn, yPosition + 4)

    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...grayColor)
    doc.text('Estado:', rightColumn, yPosition)
    doc.setTextColor(...greenColor)
    doc.setFont('helvetica', 'bold')
    doc.text(getStatusConfig().title, rightColumn, yPosition + 4)

    yPosition += 15

    // Detalles adicionales solo para pagos autorizados
    if (paymentData.status === 'authorized') {
      doc.setFillColor(245, 245, 245)
      doc.rect(15, yPosition - 5, 180, 10, 'F')

      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...darkColor)
      doc.text('DETALLES DE AUTORIZACIÓN', 20, yPosition)

      yPosition += 10

      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')

      // Primera fila
      doc.setTextColor(...grayColor)
      doc.text('Código de Autorización:', leftColumn, yPosition)
      doc.setTextColor(...darkColor)
      doc.setFont('helvetica', 'bold')
      doc.text(paymentData.authorizationCode || 'N/A', leftColumn, yPosition + 4)

      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...grayColor)
      doc.text('Tipo de Pago:', rightColumn, yPosition)
      doc.setTextColor(...darkColor)
      doc.setFont('helvetica', 'bold')
      doc.text(PAYMENT_TYPES[paymentData.paymentTypeCode] || paymentData.paymentTypeCode || 'N/A', rightColumn, yPosition + 4)

      yPosition += 12

      // Segunda fila
      if (paymentData.installmentsNumber && paymentData.installmentsNumber > 1) {
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(...grayColor)
        doc.text('Cuotas:', leftColumn, yPosition)
        doc.setTextColor(...darkColor)
        doc.setFont('helvetica', 'bold')
        doc.text(paymentData.installmentsNumber.toString(), leftColumn, yPosition + 4)
      }

      if (paymentData.cardNumber) {
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(...grayColor)
        doc.text('Tarjeta:', rightColumn, yPosition)
        doc.setTextColor(...darkColor)
        doc.setFont('helvetica', 'bold')
        doc.text(`**** ${paymentData.cardNumber.slice(-4)}`, rightColumn, yPosition + 4)
      }

      yPosition += 15
    }

    // === PRODUCTOS COMPRADOS ===
    if (orderItems.length > 0 && paymentData.status === 'authorized') {
      doc.setFillColor(245, 245, 245)
      doc.rect(15, yPosition - 5, 180, 10, 'F')

      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...darkColor)
      doc.text('PRODUCTOS COMPRADOS', 20, yPosition)

      yPosition += 10

      doc.setFontSize(9)

      orderItems.forEach((item, index) => {
        // Verificar si necesitamos una nueva página
        if (yPosition > 250) {
          doc.addPage()
          yPosition = 20
        }

        // Fondo alternado para cada producto
        if (index % 2 === 0) {
          doc.setFillColor(250, 250, 250)
          doc.rect(15, yPosition - 3, 180, 18, 'F')
        }

        // Número del producto
        doc.setTextColor(...grayColor)
        doc.setFont('helvetica', 'bold')
        doc.text(`${index + 1}.`, leftColumn, yPosition)

        // Nombre del producto
        doc.setTextColor(...darkColor)
        doc.setFont('helvetica', 'bold')
        doc.text(item.name, leftColumn + 5, yPosition)

        yPosition += 5

        // SKU
        if (item.sku) {
          doc.setFont('helvetica', 'normal')
          doc.setTextColor(...grayColor)
          doc.text(`Código: ${item.sku}`, leftColumn + 5, yPosition)
          yPosition += 4
        }

        // Cantidad y precio
        doc.setTextColor(...grayColor)
        doc.text(`Cantidad: ${item.quantity} x ${formatAmount(item.price)}`, leftColumn + 5, yPosition)

        // Subtotal
        doc.setTextColor(...darkColor)
        doc.setFont('helvetica', 'bold')
        doc.text(formatAmount(item.price * item.quantity), 185, yPosition, { align: 'right' })

        yPosition += 10
      })

      // Total
      yPosition += 5
      doc.setDrawColor(...darkColor)
      doc.setLineWidth(0.5)
      doc.line(15, yPosition - 3, 195, yPosition - 3)

      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...darkColor)
      doc.text('TOTAL:', 150, yPosition)
      doc.setFontSize(12)
      doc.text(formatAmount(paymentData.amount), 185, yPosition, { align: 'right' })

      yPosition += 10
    }

    // === PIE DE PÁGINA ===
    // Línea separadora
    doc.setDrawColor(...grayColor)
    doc.setLineWidth(0.3)
    doc.line(15, 270, 195, 270)

    // Información de contacto
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...grayColor)
    doc.text('Gracias por tu compra en TESTheb - Bordados de Calidad', 105, 277, { align: 'center' })
    doc.text('Para consultas: contacto@testheb.cl', 105, 282, { align: 'center' })

    // Mensaje de autenticidad
    doc.setFontSize(7)
    doc.setTextColor(150, 150, 150)
    doc.text('Este es un documento electrónico válido. No requiere firma ni timbre.', 105, 287, { align: 'center' })

    // Guardar el PDF
    doc.save(`comprobante-${paymentData.buyOrder || 'pago'}.pdf`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const statusConfig = getStatusConfig()
  const StatusIcon = statusConfig.icon

  return (
    <div className="min-h-screen bg-gray-900 pt-40 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 rounded-lg shadow-xl p-8"
        >
          {/* Estado del pago */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                statusConfig.color === 'green' ? 'bg-green-100 text-green-600' :
                statusConfig.color === 'red' ? 'bg-red-100 text-red-600' :
                statusConfig.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                'bg-gray-100 text-gray-600'
              }`}
            >
              <StatusIcon size={40} />
            </motion.div>

            <h1 className={`text-3xl font-bold mb-2 ${
              statusConfig.color === 'green' ? 'text-green-400' :
              statusConfig.color === 'red' ? 'text-red-400' :
              statusConfig.color === 'yellow' ? 'text-yellow-400' :
              'text-gray-400'
            }`}>
              {statusConfig.title}
            </h1>

            <p className="text-gray-300 text-lg">
              {statusConfig.message}
            </p>
          </div>

          {/* Detalles del pago */}
          {paymentData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-700 rounded-lg p-6 mb-6"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Detalles de la Transacción</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Orden de Compra:</span>
                  <p className="text-white font-medium">{paymentData.buyOrder || 'N/A'}</p>
                </div>

                <div>
                  <span className="text-gray-400">Monto:</span>
                  <p className="text-white font-medium text-lg">{formatAmount(paymentData.amount)}</p>
                </div>

                <div>
                  <span className="text-gray-400">Fecha y Hora:</span>
                  <p className="text-white font-medium">{formatDateTime()}</p>
                </div>

                <div>
                  <span className="text-gray-400">Estado:</span>
                  <p className={`font-medium ${
                    statusConfig.color === 'green' ? 'text-green-400' :
                    statusConfig.color === 'red' ? 'text-red-400' :
                    statusConfig.color === 'yellow' ? 'text-yellow-400' :
                    'text-gray-400'
                  }`}>
                    {statusConfig.title}
                  </p>
                </div>

                {/* Detalles adicionales solo para pagos autorizados */}
                {paymentData.status === 'authorized' && (
                  <>
                    <div>
                      <span className="text-gray-400">Código de Autorización:</span>
                      <p className="text-white font-medium">{paymentData.authorizationCode || 'N/A'}</p>
                    </div>

                    <div>
                      <span className="text-gray-400">Tipo de Pago:</span>
                      <p className="text-white font-medium">
                        {PAYMENT_TYPES[paymentData.paymentTypeCode] || paymentData.paymentTypeCode || 'N/A'}
                      </p>
                    </div>

                    {paymentData.installmentsNumber && paymentData.installmentsNumber > 1 && (
                      <div>
                        <span className="text-gray-400">Cuotas:</span>
                        <p className="text-white font-medium">{paymentData.installmentsNumber}</p>
                      </div>
                    )}

                    {paymentData.cardNumber && (
                      <div>
                        <span className="text-gray-400">Tarjeta:</span>
                        <p className="text-white font-medium">****{paymentData.cardNumber.slice(-4)}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* Productos Comprados */}
          {orderItems.length > 0 && paymentData?.status === 'authorized' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-700 rounded-lg p-6 mb-6"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Productos Comprados</h2>
              <div className="space-y-3">
                {orderItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                    <div className="w-16 h-16 bg-gray-600 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          📦
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium">{item.name}</h4>
                      {item.sku && (
                        <p className="text-gray-400 text-sm font-mono">
                          SKU: {item.sku}
                        </p>
                      )}
                      <p className="text-gray-300 text-sm">
                        Cantidad: {item.quantity} x {formatAmount(item.price)}
                      </p>
                    </div>
                    <span className="text-yellow-400 font-semibold">
                      {formatAmount(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Acciones */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            {paymentData?.status === 'authorized' && (
              <button
                onClick={downloadVoucher}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                <FiDownload size={20} />
                Descargar Comprobante
              </button>
            )}

            <Link
              to="/"
              className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <FiHome size={20} />
              Volver al Inicio
            </Link>

            <Link
              to="/catalog"
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <FiShoppingBag size={20} />
              Seguir Comprando
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default PaymentResultPage