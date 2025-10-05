import { motion } from 'framer-motion'
import { HiDocumentText } from 'react-icons/hi'

const TermsPage = () => {
  const sections = [
    {
      title: '1. Aceptación de los Términos',
      content: 'Al acceder y utilizar el sitio web de TESTheb Bordados, usted acepta estos términos y condiciones en su totalidad. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestro sitio web.'
    },
    {
      title: '2. Uso del Sitio',
      content: 'El contenido de este sitio web es solo para su información general y uso. Está sujeto a cambios sin previo aviso. Usted no debe usar este sitio de manera que cause, o pueda causar, daño al sitio o perjudicar la disponibilidad o accesibilidad del mismo.'
    },
    {
      title: '3. Productos y Servicios',
      content: 'Todos los productos y servicios están sujetos a disponibilidad. Nos reservamos el derecho de limitar las cantidades de cualquier producto o servicio que ofrecemos. Todas las descripciones de productos o precios están sujetos a cambios en cualquier momento sin previo aviso.'
    },
    {
      title: '4. Precios y Pagos',
      content: 'Los precios mostrados en nuestro sitio web están en pesos chilenos (CLP) e incluyen IVA. Nos reservamos el derecho de modificar nuestros precios en cualquier momento. Los pagos se procesan de forma segura a través de Transbank WebPay Plus.'
    },
    {
      title: '5. Pedidos Personalizados',
      content: 'Los pedidos de bordados personalizados requieren confirmación y aprobación del diseño antes de la producción. Una vez aprobado el diseño y realizado el pago, no se aceptan cancelaciones. Los tiempos de producción pueden variar según la complejidad del pedido.'
    },
    {
      title: '6. Propiedad Intelectual',
      content: 'Todo el contenido incluido en este sitio, como texto, gráficos, logotipos, imágenes, clips de audio, descargas digitales y compilaciones de datos, es propiedad de TESTheb Bordados y está protegido por las leyes de propiedad intelectual de Chile.'
    },
    {
      title: '7. Limitación de Responsabilidad',
      content: 'TESTheb Bordados no será responsable de ningún daño directo, indirecto, incidental, especial o consecuente que resulte del uso o la imposibilidad de usar nuestro sitio web o nuestros productos, incluso si hemos sido advertidos de la posibilidad de tales daños.'
    },
    {
      title: '8. Enlaces a Sitios de Terceros',
      content: 'Nuestro sitio web puede contener enlaces a sitios web de terceros. Estos enlaces se proporcionan únicamente para su conveniencia. No tenemos control sobre el contenido de esos sitios y no asumimos ninguna responsabilidad por ellos.'
    },
    {
      title: '9. Protección de Datos Personales',
      content: 'El tratamiento de sus datos personales se rige por nuestra Política de Privacidad, que cumple con la Ley N° 19.628 sobre Protección de la Vida Privada de Chile. Al utilizar nuestro sitio, usted consiente el uso de sus datos según lo descrito en dicha política.'
    },
    {
      title: '10. Modificaciones de los Términos',
      content: 'Nos reservamos el derecho de revisar estos términos y condiciones en cualquier momento. Al continuar utilizando este sitio web después de que se publiquen dichos cambios, usted acepta estar sujeto a la versión revisada.'
    },
    {
      title: '11. Ley Aplicable',
      content: 'Estos términos y condiciones se regirán e interpretarán de acuerdo con las leyes de la República de Chile. Cualquier disputa relacionada con estos términos estará sujeta a la jurisdicción exclusiva de los tribunales de Santiago, Chile.'
    },
    {
      title: '12. Contacto',
      content: 'Si tiene alguna pregunta sobre estos Términos y Condiciones, puede contactarnos a través de: contacto@testheb.cl o al teléfono +56 9 1234 5678.'
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
              <HiDocumentText className="w-12 h-12 text-yellow-400" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Términos y Condiciones
          </h1>
          <p className="text-text-muted text-lg">
            Última actualización: Octubre 2025
          </p>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-bg-primary/50 border border-gray-500/20 rounded-xl p-6 mb-8"
        >
          <p className="text-text-muted leading-relaxed">
            Bienvenido a TESTheb Bordados. Estos términos y condiciones describen las reglas y regulaciones
            para el uso del sitio web de TESTheb Bordados. Al acceder a este sitio web, asumimos que acepta
            estos términos y condiciones. No continúe usando TESTheb Bordados si no está de acuerdo con todos
            los términos y condiciones establecidos en esta página.
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
            Al utilizar nuestro sitio web, usted reconoce haber leído, entendido y aceptado
            estar sujeto a estos términos y condiciones.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default TermsPage
