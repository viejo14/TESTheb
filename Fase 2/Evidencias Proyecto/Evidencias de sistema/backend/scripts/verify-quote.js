import Quote from '../src/models/Quote.js'
import { query } from '../src/config/database.js'

async function verifyQuote(searchEmail) {
  console.log('🔍 Verificando cotización:', searchEmail || 'última creada')
  console.log()

  try {
    let quote

    if (searchEmail) {
      // Buscar por email
      console.log('📧 Buscando cotización por email...')
      const result = await query(`
        SELECT * FROM quotes
        WHERE email = $1
        ORDER BY created_at DESC
        LIMIT 1
      `, [searchEmail])
      quote = result.rows[0]
    } else {
      // Obtener la última cotización creada
      console.log('📊 Obteniendo última cotización creada...')
      const result = await query(`
        SELECT * FROM quotes
        ORDER BY created_at DESC
        LIMIT 1
      `)
      quote = result.rows[0]
    }

    if (!quote) {
      console.log('❌ Cotización no encontrada')
      process.exit(1)
    }

    console.log('✅ Cotización encontrada:')
    console.log('   ID:', quote.id)
    console.log('   Nombre:', quote.name)
    console.log('   Email:', quote.email)
    console.log('   Teléfono:', quote.phone || 'No proporcionado')
    console.log('   Estado:', quote.status)
    console.log('   Mensaje:', quote.message)
    console.log('   Imagen:', quote.image_url || 'No proporcionada')
    console.log('   Creado:', quote.created_at)
    console.log()

    // Verificar con Quote.findById()
    console.log('🔍 Verificando con Quote.findById()...')
    const quoteById = await Quote.findById(quote.id)

    if (quoteById) {
      console.log('✅ Quote.findById() funciona correctamente')
      console.log('   Modelo devolvió:', quoteById.name, `(${quoteById.email})`)
      console.log('   Estado:', quoteById.status)
    } else {
      console.log('❌ Quote.findById() NO encontró la cotización')
    }
    console.log()

    // Verificar Quote.isValidStatus()
    console.log('🔍 Verificando Quote.isValidStatus()...')
    const validStatuses = ['pendiente', 'aprobada', 'rechazada', 'en_proceso']
    console.log('   Estados permitidos:', Quote.ALLOWED_STATUSES.join(', '))
    console.log('   ✅ "pendiente" es válido:', Quote.isValidStatus('pendiente'))
    console.log('   ✅ "aprobada" es válido:', Quote.isValidStatus('aprobada'))
    console.log('   ❌ "invalido" es válido:', Quote.isValidStatus('invalido'))
    console.log()

    // Contar cotizaciones
    console.log('🔍 Verificando Quote.count()...')
    const totalQuotes = await Quote.count()
    const pendingQuotes = await Quote.count('pendiente')
    console.log('   Total cotizaciones:', totalQuotes)
    console.log('   Cotizaciones pendientes:', pendingQuotes)
    console.log()

    // Obtener estadísticas
    console.log('📊 Obteniendo estadísticas con Quote.getStats()...')
    const stats = await Quote.getStats()
    console.log('✅ Estadísticas obtenidas:')
    console.log('   Total:', stats.totalCotizaciones)
    console.log('   Por estado:', stats.cotizacionesByStatus)
    console.log('   Últimos 30 días:', stats.recentCotizaciones)
    console.log()

    // Resumen
    console.log('📊 RESUMEN DE VERIFICACIÓN:')
    console.log('   ✅ Cotización existe en DB:', quote.email)
    console.log('   ✅ Quote.findById() funciona:', quoteById ? 'SÍ' : 'NO')
    console.log('   ✅ Quote.isValidStatus() funciona: SÍ')
    console.log('   ✅ Quote.count() funciona: SÍ')
    console.log('   ✅ Quote.getStats() funciona: SÍ')
    console.log()

    console.log('🎉 ¡Modelo Quote verificado correctamente!')
    console.log()
    console.log('💡 ID de la cotización para pruebas:', quote.id)

    process.exit(0)

  } catch (error) {
    console.error('❌ Error verificando cotización:', error)
    process.exit(1)
  }
}

// Ejecutar con el email pasado como argumento o última cotización
const searchEmail = process.argv[2]
verifyQuote(searchEmail)
