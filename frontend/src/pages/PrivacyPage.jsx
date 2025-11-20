import { motion } from 'framer-motion'
import { HiShieldCheck } from 'react-icons/hi'

const PrivacyPage = () => {
  const sections = [
    {
      title: '1. Información que Recopilamos',
      content: 'Recopilamos información personal que usted nos proporciona directamente, como nombre, correo electrónico, teléfono y dirección de envío cuando realiza un pedido o crea una cuenta. También recopilamos información sobre su uso del sitio web mediante cookies y tecnologías similares.'
    },
    {
      title: '2. Uso de la Información',
      content: 'Utilizamos su información para procesar sus pedidos, comunicarnos con usted sobre su compra, mejorar nuestros servicios, enviarle actualizaciones sobre productos y ofertas (con su consentimiento), y cumplir con nuestras obligaciones legales.'
    },
    {
      title: '3. Protección de Datos',
      content: 'Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal contra acceso no autorizado, alteración, divulgación o destrucción. Utilizamos encriptación SSL para proteger datos sensibles transmitidos en línea.'
    },
    {
      title: '4. Compartir Información',
      content: 'No vendemos ni alquilamos su información personal a terceros. Podemos compartir su información con proveedores de servicios confiables que nos ayudan a operar nuestro sitio web y procesar pagos (como Transbank), bajo estrictos acuerdos de confidencialidad.'
    },
    {
      title: '5. Cookies y Tecnologías de Seguimiento',
      content: 'Utilizamos cookies para mejorar su experiencia en nuestro sitio web, recordar sus preferencias y analizar el tráfico del sitio. Puede configurar su navegador para rechazar cookies, aunque esto puede afectar la funcionalidad del sitio.'
    },
    {
      title: '6. Sus Derechos',
      content: 'De acuerdo con la Ley N° 19.628 de Chile, usted tiene derecho a acceder, rectificar, cancelar y oponerse al tratamiento de sus datos personales. Para ejercer estos derechos, contáctenos en contacto@testheb.cl.'
    },
    {
      title: '7. Retención de Datos',
      content: 'Conservamos su información personal solo durante el tiempo necesario para cumplir con los propósitos descritos en esta política o según lo requiera la ley chilena, que generalmente es de 3 a 7 años para registros comerciales.'
    },
    {
      title: '8. Menores de Edad',
      content: 'Nuestros servicios no están dirigidos a menores de 18 años. No recopilamos intencionalmente información personal de menores. Si descubrimos que hemos recopilado información de un menor, la eliminaremos de inmediato.'
    },
    {
      title: '9. Cambios en la Política',
      content: 'Podemos actualizar esta política de privacidad periódicamente. Le notificaremos sobre cambios significativos publicando la nueva política en esta página con una fecha de "última actualización" revisada.'
    },
    {
      title: '10. Contacto',
      content: 'Si tiene preguntas sobre esta Política de Privacidad o el tratamiento de sus datos personales, contáctenos en: contacto@testheb.cl o +56 9 1234 5678.'
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
              <HiShieldCheck className="w-12 h-12 text-yellow-400" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Política de Privacidad
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
            En TESTheb Bordados, nos comprometemos a proteger su privacidad y sus datos personales.
            Esta política describe cómo recopilamos, usamos, almacenamos y protegemos su información
            de acuerdo con la Ley N° 19.628 sobre Protección de la Vida Privada de Chile.
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
          className="mt-12 p-6 bg-yellow-400/10 border border-yellow-400/20 rounded-xl"
        >
          <p className="text-text-muted text-sm text-center">
            <strong className="text-yellow-400">Importante:</strong> Al utilizar nuestro sitio web,
            usted consiente la recopilación y uso de su información de acuerdo con esta política de privacidad.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default PrivacyPage
