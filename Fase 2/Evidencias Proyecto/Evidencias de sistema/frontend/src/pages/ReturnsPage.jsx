import { motion } from 'framer-motion'
import { HiRefresh } from 'react-icons/hi'

const ReturnsPage = () => {
  const sections = [
    {
      title: '1. Política General de Devoluciones',
      content: 'En TESTheb Bordados entendemos que a veces un producto puede no cumplir con sus expectativas. Aceptamos devoluciones dentro de los 7 días posteriores a la recepción del pedido, siempre que el producto esté en su estado original, sin usar y con todas las etiquetas.'
    },
    {
      title: '2. Productos Personalizados',
      content: 'IMPORTANTE: Los productos con bordados personalizados NO son elegibles para devolución o cambio, ya que son fabricados específicamente según las especificaciones de cada cliente. Por favor, revise cuidadosamente su diseño antes de confirmar el pedido.'
    },
    {
      title: '3. Productos con Defectos',
      content: 'Si recibe un producto con defectos de fabricación o daños, contáctenos dentro de las 48 horas posteriores a la recepción. Le proporcionaremos un reemplazo sin costo adicional o un reembolso completo, según su preferencia.'
    },
    {
      title: '4. Proceso de Devolución',
      content: 'Para iniciar una devolución: 1) Contáctenos por correo a contacto@testheb.cl con su número de pedido y motivo de devolución. 2) Espere nuestra autorización y las instrucciones de envío. 3) Envíe el producto en su empaque original. 4) Una vez recibido e inspeccionado, procesaremos su reembolso.'
    },
    {
      title: '5. Costos de Envío',
      content: 'Los costos de envío de devolución corren por cuenta del cliente, excepto en casos de productos defectuosos o errores de nuestra parte. Los gastos de envío originales no son reembolsables, salvo en casos de productos defectuosos.'
    },
    {
      title: '6. Tiempo de Reembolso',
      content: 'Los reembolsos se procesarán dentro de 5-10 días hábiles después de recibir y aprobar la devolución. El tiempo que tarde en reflejarse en su cuenta puede variar según su institución financiera.'
    },
    {
      title: '7. Cambios por Talla o Color',
      content: 'Para productos estándar (sin personalización), aceptamos cambios por talla o color diferente dentro de los 7 días. El nuevo producto debe tener el mismo valor o usted debe pagar la diferencia. Los cambios están sujetos a disponibilidad.'
    },
    {
      title: '8. Condiciones del Producto Devuelto',
      content: 'Los productos devueltos deben estar: sin usar, sin lavar, con todas las etiquetas originales, en su empaque original, sin olores (perfume, tabaco, etc.). Nos reservamos el derecho de rechazar devoluciones que no cumplan estas condiciones.'
    },
    {
      title: '9. Productos No Retornables',
      content: 'No aceptamos devoluciones de: productos personalizados o bordados a medida, artículos en oferta o liquidación (salvo defectos), productos higiénicos una vez abiertos, artículos dañados por uso indebido del cliente.'
    },
    {
      title: '10. Garantía de Calidad',
      content: 'Todos nuestros productos están garantizados contra defectos de fabricación por 30 días desde la compra. Esta garantía no cubre daños por uso normal, mal uso o desgaste natural del producto.'
    },
    {
      title: '11. Cancelaciones de Pedidos',
      content: 'Puede cancelar su pedido sin cargo si aún no ha sido procesado (generalmente dentro de 2 horas después de realizar el pedido). Una vez que el pedido entra en producción, especialmente si es personalizado, no se pueden aceptar cancelaciones.'
    },
    {
      title: '12. Contacto',
      content: 'Para consultas sobre devoluciones, cambios o garantías, contáctenos en: contacto@testheb.cl o +56 9 1234 5678. Nuestro equipo de atención al cliente responderá en un plazo de 24-48 horas hábiles.'
    }
  ]

  return (
    <div className="min-h-screen py-36 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-yellow-400/10 rounded-full">
              <HiRefresh className="w-12 h-12 text-yellow-400" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Política de Devoluciones
          </h1>
          <p className="text-text-muted text-lg">
            Última actualización: Octubre 2025
          </p>
        </motion.div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-yellow-400/10 border-2 border-yellow-400/30 rounded-xl p-6 mb-8"
        >
          <h3 className="text-lg font-bold text-yellow-400 mb-2">
            ⚠️ Aviso Importante
          </h3>
          <p className="text-text-muted leading-relaxed">
            Los productos con bordados personalizados NO admiten devolución ni cambio, ya que son
            fabricados exclusivamente para usted. Asegúrese de revisar cuidadosamente su diseño
            antes de confirmar el pedido.
          </p>
        </motion.div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="bg-bg-primary/50 border border-gray-500/20 rounded-xl p-6 hover:border-yellow-400/30 transition-colors duration-300"
            >
              <h2 className="text-xl font-bold text-text-primary mb-3">
                {section.title}
              </h2>
              <p className="text-text-muted leading-relaxed">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-text-muted text-sm">
            Estamos comprometidos con su satisfacción. Si tiene alguna pregunta o inquietud
            sobre su pedido, no dude en contactarnos.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default ReturnsPage
