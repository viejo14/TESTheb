import { motion } from 'framer-motion'

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary text-text-primary pb-16">
      <section className="pt-36 lg:pt-44 pb-16 px-4">
        <motion.div
          className="max-w-6xl mx-auto rounded-3xl border border-gray-500/30 bg-bg-secondary/60 px-10 lg:px-16 py-12 backdrop-blur"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            className="inline-flex items-center gap-2 rounded-full bg-yellow-500/10 px-4 py-1 text-sm font-semibold uppercase tracking-wider text-yellow-400"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Sobre Testheb Bordados
          </motion.span>
          <motion.h1
            className="mt-6 text-4xl sm:text-5xl font-bold leading-tight text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Arte textil que transforma ideas en identidad
          </motion.h1>
          <motion.p
            className="mt-6 text-lg text-text-secondary leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Testheb Bordados es una empresa chilena dedicada al bordado personalizado, fundada y liderada por Amaro Abate. Combinamos tradición artesanal con tecnología moderna para entregar piezas de alta calidad que reflejan la esencia de cada cliente. Nuestra misión es ser socios confiables de personas, PYMEs y comunidades educativas que necesitan diseños exclusivos para fortalecer su imagen.
          </motion.p>
        </motion.div>
      </section>

      <section className="px-4 pb-16">
        <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-2">
          <motion.article
            className="rounded-3xl border border-gray-500/30 bg-bg-secondary/60 p-10 backdrop-blur"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-3xl font-semibold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Nuestra misión
            </motion.h2>
            <motion.p
              className="text-lg text-text-secondary leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Crear bordados excepcionales que combinan calidad, creatividad y personalización. Entregamos un servicio rápido, cercano y confiable para impulsar la identidad de personas, pequeñas y medianas empresas y comunidades educativas, asegurando que cada proyecto exprese sus valores y visión.
            </motion.p>
          </motion.article>
          <motion.article
            className="rounded-3xl border border-gray-500/30 bg-bg-secondary/60 p-10 backdrop-blur"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-3xl font-semibold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Nuestra visión
            </motion.h2>
            <motion.p
              className="text-lg text-text-secondary leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              Ser la empresa líder en bordados personalizados en Chile, destacando por excelencia en calidad, innovación y un servicio al cliente que genera confianza y satisfacción en cada interacción, desde proyectos individuales hasta iniciativas corporativas e institucionales.
            </motion.p>
          </motion.article>
        </div>
      </section>

      <section className="px-4 pb-16">
        <motion.div
          className="max-w-6xl mx-auto rounded-3xl border border-gray-500/30 bg-bg-secondary/60 p-10 backdrop-blur"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-3xl font-semibold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            A quiénes acompañamos
          </motion.h2>
          <motion.p
            className="text-lg text-text-secondary leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Nos especializamos en tres públicos principales: personas que buscan bordados únicos para prendas, accesorios o elementos decorativos que cuenten su historia; PYMEs que necesitan uniformes corporativos, logos bordados o merchandising que eleve su presencia; y colegios e instituciones educativas que requieren uniformes, banderas, parches o emblemas que refuercen su sentido de pertenencia. Atendemos cada proyecto con el mismo compromiso y atención al detalle, sin importar su tamaño.
          </motion.p>
          <motion.p
            className="mt-6 text-lg text-text-secondary leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            La calidad es nuestro sello distintivo: trabajamos con hilos premium, maquinaria de última generación y técnicas precisas para garantizar resultados duraderos e impactantes. Nuestro equipo prioriza una atención cercana, con respuestas ágiles, comunicación fluida y acompañamiento personalizado que convierte cada experiencia en una relación de confianza.
          </motion.p>
        </motion.div>
      </section>

      <section className="px-4 pb-16">
        <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-[1.6fr,1fr]">
          <motion.article
            className="rounded-3xl border border-gray-500/30 bg-bg-secondary/60 p-10 backdrop-blur"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-3xl font-semibold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Nuestra historia
            </motion.h2>
            <motion.p
              className="text-lg text-text-secondary leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Testheb Bordados nació de la pasión de Amaro Abate por el arte textil y su sueño de ofrecer un servicio que combine creatividad con calidad. Lo que comenzó como un desafío personal hoy atiende a clientes de todo Chile, ayudándolos a expresar su identidad mediante bordados únicos. Cada proyecto es una nueva oportunidad para innovar y crecer, manteniendo vivos nuestros valores: calidad, compromiso, creatividad y cercanía.
            </motion.p>
          </motion.article>
          <motion.aside
            className="rounded-3xl border border-yellow-400/40 bg-yellow-500/10 p-8 text-text-primary"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.h3
              className="text-2xl font-semibold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Nuestros valores
            </motion.h3>
            <ul className="space-y-4 text-lg text-text-secondary">
              {[
                {
                  title: "Calidad sin compromisos:",
                  desc: "cada bordado refleja nuestro estándar de excelencia."
                },
                {
                  title: "Creatividad:",
                  desc: "transformamos ideas en diseños únicos que destacan."
                },
                {
                  title: "Confianza:",
                  desc: "construimos relaciones sólidas con comunicación transparente y entregas puntuales."
                },
                {
                  title: "Cercanía:",
                  desc: "escuchamos y acompañamos a nuestros clientes en cada paso del proceso."
                }
              ].map((valor, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <span className="font-semibold text-yellow-300">{valor.title}</span> {valor.desc}
                </motion.li>
              ))}
            </ul>
          </motion.aside>
        </div>
      </section>

      <section className="px-4">
        <motion.div
          className="max-w-6xl mx-auto rounded-3xl border border-gray-500/30 bg-bg-secondary/60 px-8 py-12 text-center backdrop-blur"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-3xl font-semibold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Hablemos de tu próximo proyecto
          </motion.h2>
          <motion.p
            className="text-lg text-text-secondary leading-relaxed mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            En Testheb Bordados estamos comprometidos con crear experiencias memorables. Si buscas un aliado para dar vida a tus ideas a través del bordado, estamos listos para ayudarte.
          </motion.p>
          <motion.a
            href="mailto:info@testheb.cl"
            className="inline-flex items-center justify-center rounded-full border border-yellow-400/80 bg-yellow-500 px-8 py-3 text-lg font-semibold text-black"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{
              y: -4,
              backgroundColor: "rgb(251, 191, 36)",
              boxShadow: "0 8px 25px rgba(251,191,36,0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            viewport={{ once: true }}
          >
            Contáctanos
          </motion.a>
        </motion.div>
      </section>
    </div>
  ) 
}

export default AboutPage
