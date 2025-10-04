import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HiMail,
  HiPhone,
  HiLocationMarker,
  HiHeart
} from 'react-icons/hi'
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp
} from 'react-icons/fa'
import { RiShirtLine } from 'react-icons/ri'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const navigationLinks = [
    { label: 'Inicio', path: '/' },
    { label: 'Catálogo', path: '/catalog' },
    { label: 'Nosotros', path: '/about' },
    { label: 'Contacto', path: '/contact' }
  ]

  const legalLinks = [
    { label: 'Términos y Condiciones', path: '/terms' },
    { label: 'Política de Privacidad', path: '/privacy' },
    { label: 'Política de Devoluciones', path: '/returns' }
  ]

  const socialLinks = [
    {
      icon: FaFacebookF,
      href: 'https://facebook.com/testheb',
      label: 'Facebook',
      color: 'hover:text-blue-500'
    },
    {
      icon: FaInstagram,
      href: 'https://instagram.com/testheb',
      label: 'Instagram',
      color: 'hover:text-pink-500'
    },
    {
      icon: FaTwitter,
      href: 'https://twitter.com/testheb',
      label: 'Twitter',
      color: 'hover:text-sky-400'
    },
    {
      icon: FaLinkedinIn,
      href: 'https://linkedin.com/company/testheb',
      label: 'LinkedIn',
      color: 'hover:text-blue-600'
    },
    {
      icon: FaWhatsapp,
      href: 'https://wa.me/56912345678',
      label: 'WhatsApp',
      color: 'hover:text-green-500'
    }
  ]

  const contactInfo = [
    {
      icon: HiMail,
      text: 'contacto@testheb.cl',
      href: 'mailto:contacto@testheb.cl'
    },
    {
      icon: HiPhone,
      text: '+56 9 1234 5678',
      href: 'tel:+56912345678'
    },
    {
      icon: HiLocationMarker,
      text: 'Santiago, Chile',
      href: null
    }
  ]

  return (
    <footer className="bg-gradient-to-b from-bg-secondary to-bg-primary border-t border-gray-500/20">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <Link to="/" className="flex items-center gap-3 group">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <RiShirtLine className="h-12 w-12 text-yellow-400" />
                </motion.div>
                <span className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300">
                  TESTheb Bordados
                </span>
              </Link>
              <p className="text-text-muted text-sm leading-relaxed">
                Bordados personalizados de alta calidad.
                Convierte tus ideas en realidad con nuestros diseños únicos.
              </p>

              {/* Social Links */}
              <div className="flex gap-3 pt-2">
                {socialLinks.map(({ icon: Icon, href, label, color }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 bg-gray-800/50 rounded-lg text-text-muted transition-all duration-300 ${color} hover:bg-gray-800`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={label}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Navigation Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-bold text-white">Navegación</h3>
              <ul className="space-y-2">
                {navigationLinks.map(({ label, path }) => (
                  <li key={path}>
                    <Link
                      to={path}
                      className="text-text-muted hover:text-yellow-400 transition-colors duration-300 text-sm inline-block"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Legal Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-bold text-white">Legal</h3>
              <ul className="space-y-2">
                {legalLinks.map(({ label, path }) => (
                  <li key={path}>
                    <Link
                      to={path}
                      className="text-text-muted hover:text-yellow-400 transition-colors duration-300 text-sm inline-block"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-bold text-white">Contacto</h3>
              <ul className="space-y-3">
                {contactInfo.map(({ icon: Icon, text, href }) => (
                  <li key={text} className="flex items-start gap-3">
                    <Icon className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    {href ? (
                      <a
                        href={href}
                        className="text-text-muted hover:text-yellow-400 transition-colors duration-300 text-sm"
                      >
                        {text}
                      </a>
                    ) : (
                      <span className="text-text-muted text-sm">{text}</span>
                    )}
                  </li>
                ))}
              </ul>

              {/* Newsletter (Optional) */}
              <div className="pt-4">
                <h4 className="text-sm font-semibold text-white mb-2">
                  Newsletter
                </h4>
                <p className="text-text-muted text-xs mb-3">
                  Recibe ofertas exclusivas
                </p>
                <form className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Tu email"
                    className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white text-sm placeholder-text-muted focus:outline-none focus:border-yellow-400 transition-colors duration-300"
                  />
                  <motion.button
                    type="submit"
                    className="px-4 py-2 bg-yellow-400 text-black text-sm font-semibold rounded-lg hover:bg-yellow-300 transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    →
                  </motion.button>
                </form>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-gray-500/20 py-6"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-text-muted text-sm text-center md:text-left">
              © {currentYear} TESTheb Bordados. Todos los derechos reservados.
            </p>

            <div className="flex items-center gap-2 text-sm text-text-muted">
              <span>Hecho con</span>
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              >
                <HiHeart className="w-4 h-4 text-red-500" />
              </motion.div>
              <span>por Francisco Campos & Sebastian Mella</span>
            </div>

            <p className="text-text-muted text-xs">
              Proyecto Capstone APT122
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
