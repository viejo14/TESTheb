import { useState } from 'react'
import { motion } from 'framer-motion'
import CotizacionForm from '../components/CotizacionForm'
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi'

const ContactPage = () => {
  const [showCotizacionForm, setShowCotizacionForm] = useState(false)

  return (
    <div className="min-h-screen pt-32 pb-16 bg-gradient-to-br from-bg-primary to-bg-secondary">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Contáctanos
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            ¿Tienes alguna pregunta o proyecto en mente? Estamos aquí para ayudarte
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-bg-primary/80 border-2 border-gray-500/30 rounded-xl p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-6">Información de Contacto</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <HiMail className="text-3xl text-yellow-400 mt-1" />
                  <div>
                    <h3 className="text-white font-semibold mb-1">Email</h3>
                    <a href="mailto:contacto@testheb.cl" className="text-text-secondary hover:text-yellow-400 transition-colors">
                      contacto@testheb.cl
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <HiPhone className="text-3xl text-yellow-400 mt-1" />
                  <div>
                    <h3 className="text-white font-semibold mb-1">Teléfono</h3>
                    <a href="tel:+56912345678" className="text-text-secondary hover:text-yellow-400 transition-colors">
                      +56 9 1234 5678
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <HiLocationMarker className="text-3xl text-yellow-400 mt-1" />
                  <div>
                    <h3 className="text-white font-semibold mb-1">Ubicación</h3>
                    <p className="text-text-secondary">
                      Santiago, Chile
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Horarios */}
            <div className="bg-bg-primary/80 border-2 border-gray-500/30 rounded-xl p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-6">Horario de Atención</h2>
              <div className="space-y-2 text-text-secondary">
                <div className="flex justify-between">
                  <span>Lunes - Viernes:</span>
                  <span className="text-white font-semibold">9:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Sábado:</span>
                  <span className="text-white font-semibold">10:00 - 14:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Domingo:</span>
                  <span className="text-white font-semibold">Cerrado</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Cotización Card */}
          <motion.div
            className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-8 shadow-2xl"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Necesitas una cotización?
            </h2>
            <p className="text-gray-800 mb-6 text-lg">
              Cuéntanos sobre tu proyecto y te responderemos a la brevedad con una cotización personalizada.
            </p>

            <ul className="space-y-3 mb-8 text-gray-800">
              <li className="flex items-start gap-2">
                <span className="text-2xl">✓</span>
                <span>Respuesta en menos de 24 horas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-2xl">✓</span>
                <span>Cotización sin compromiso</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-2xl">✓</span>
                <span>Asesoría personalizada</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-2xl">✓</span>
                <span>Precios competitivos</span>
              </li>
            </ul>

            <button
              onClick={() => setShowCotizacionForm(true)}
              className="w-full px-8 py-4 bg-gray-900 text-white rounded-lg font-semibold text-lg transition-all duration-300 hover:bg-gray-800 hover:-translate-y-1 hover:shadow-xl"
            >
              📝 Solicitar Cotización Ahora
            </button>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          className="mt-16 bg-bg-primary/80 border-2 border-gray-500/30 rounded-xl p-8 backdrop-blur-sm"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Preguntas Frecuentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-white font-semibold mb-2">¿Cuál es el tiempo de entrega?</h3>
              <p className="text-text-secondary">
                El tiempo de entrega varía según el proyecto, pero generalmente entre 5-10 días hábiles.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">¿Hacen bordados personalizados?</h3>
              <p className="text-text-secondary">
                Sí, trabajamos con diseños personalizados según tus necesidades.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">¿Cuál es el pedido mínimo?</h3>
              <p className="text-text-secondary">
                No tenemos pedido mínimo, atendemos desde una unidad.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">¿Hacen envíos a regiones?</h3>
              <p className="text-text-secondary">
                Sí, realizamos envíos a todo Chile.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Cotizacion Form Modal */}
      {showCotizacionForm && (
        <CotizacionForm
          onClose={() => setShowCotizacionForm(false)}
          onSuccess={() => {
            setShowCotizacionForm(false)
          }}
        />
      )}
    </div>
  )
}

export default ContactPage
