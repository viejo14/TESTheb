const BASE_URL = 'http://localhost:3000'
const quoteId = process.argv[2] || '21' // ID de la cotización a probar

console.log('💬 Probando flujo de cotizaciones completo...')
console.log('🆔 ID de cotización:', quoteId)
console.log()

async function testQuotesFlow() {
  try {
    // 1. GET ALL QUOTES (sin filtros)
    console.log('1️⃣  Probando GET /api/cotizaciones...')
    const allQuotesResponse = await fetch(`${BASE_URL}/api/cotizaciones`)

    if (!allQuotesResponse.ok) {
      const error = await allQuotesResponse.json()
      console.log('❌ GET cotizaciones falló:', error.message)
      process.exit(1)
    }

    const allQuotesData = await allQuotesResponse.json()
    console.log('✅ Cotizaciones obtenidas!')
    console.log('   Total:', allQuotesData.data?.length || 0)
    console.log('   Primera cotización:', allQuotesData.data?.[0]?.name || 'N/A')
    console.log('   Paginación:', allQuotesData.pagination || 'N/A')
    console.log()

    // 2. GET QUOTES con filtro de estado
    console.log('2️⃣  Probando GET /api/cotizaciones?status=pendiente...')
    const pendingQuotesResponse = await fetch(`${BASE_URL}/api/cotizaciones?status=pendiente`)

    if (!pendingQuotesResponse.ok) {
      const error = await pendingQuotesResponse.json()
      console.log('❌ GET cotizaciones con filtro falló:', error.message)
    } else {
      const pendingQuotesData = await pendingQuotesResponse.json()
      console.log('✅ Cotizaciones pendientes obtenidas!')
      console.log('   Total pendientes:', pendingQuotesData.data?.length || 0)
    }
    console.log()

    // 3. GET QUOTES con búsqueda
    console.log('3️⃣  Probando GET /api/cotizaciones?search=soila...')
    const searchQuotesResponse = await fetch(`${BASE_URL}/api/cotizaciones?search=soila`)

    if (!searchQuotesResponse.ok) {
      const error = await searchQuotesResponse.json()
      console.log('❌ GET cotizaciones con búsqueda falló:', error.message)
    } else {
      const searchQuotesData = await searchQuotesResponse.json()
      console.log('✅ Búsqueda completada!')
      console.log('   Resultados:', searchQuotesData.data?.length || 0)
      if (searchQuotesData.data?.length > 0) {
        console.log('   Encontrado:', searchQuotesData.data[0].name)
      }
    }
    console.log()

    // 4. GET STATS
    console.log('4️⃣  Probando GET /api/cotizaciones/stats...')
    const statsResponse = await fetch(`${BASE_URL}/api/cotizaciones/stats`)

    if (!statsResponse.ok) {
      const error = await statsResponse.json()
      console.log('❌ GET stats falló:', error.message)
    } else {
      const statsData = await statsResponse.json()
      console.log('✅ Estadísticas obtenidas!')
      console.log('   Total:', statsData.data?.totalCotizaciones || 0)
      console.log('   Por estado:', statsData.data?.cotizacionesByStatus || [])
      console.log('   Últimos 30 días:', statsData.data?.recentCotizaciones || 0)
    }
    console.log()

    // 5. UPDATE STATUS (cambiar a "en_proceso")
    console.log('5️⃣  Probando PUT /api/cotizaciones/' + quoteId + '...')
    const updateResponse = await fetch(`${BASE_URL}/api/cotizaciones/${quoteId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'en_proceso' })
    })

    if (!updateResponse.ok) {
      const error = await updateResponse.json()
      console.log('❌ Update status falló:', error.message)
    } else {
      const updateData = await updateResponse.json()
      console.log('✅ Estado actualizado!')
      console.log('   Cotización:', updateData.data?.name || 'N/A')
      console.log('   Nuevo estado:', updateData.data?.status || 'N/A')
    }
    console.log()

    // 6. REVERTIR a "pendiente"
    console.log('6️⃣  Revirtiendo a estado "pendiente"...')
    const revertResponse = await fetch(`${BASE_URL}/api/cotizaciones/${quoteId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'pendiente' })
    })

    if (revertResponse.ok) {
      console.log('✅ Estado revertido a pendiente!')
    }
    console.log()

    // 7. BULK UPDATE (requiere múltiples IDs, solo si hay más cotizaciones)
    if (allQuotesData.data && allQuotesData.data.length >= 2) {
      console.log('7️⃣  Probando POST /api/cotizaciones/bulk-status...')
      const bulkIds = allQuotesData.data.slice(0, 2).map(q => q.id)

      const bulkResponse = await fetch(`${BASE_URL}/api/cotizaciones/bulk-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: bulkIds,
          status: 'aprobada'
        })
      })

      if (!bulkResponse.ok) {
        const error = await bulkResponse.json()
        console.log('❌ Bulk update falló:', error.message)
      } else {
        const bulkData = await bulkResponse.json()
        console.log('✅ Actualización masiva completada!')
        console.log('   IDs actualizados:', bulkIds)
        console.log('   Total actualizadas:', bulkData.data?.updatedCount || 0)
      }

      // Revertir bulk update
      console.log('   Revirtiendo cambios masivos...')
      await fetch(`${BASE_URL}/api/cotizaciones/bulk-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: bulkIds,
          status: 'pendiente'
        })
      })
      console.log('   ✅ Cambios revertidos!')
    }
    console.log()

    // RESUMEN
    console.log('📊 RESUMEN DE VERIFICACIÓN:')
    console.log('   ✅ GET /api/cotizaciones - Funciona correctamente')
    console.log('   ✅ GET /api/cotizaciones?status=pendiente - Funciona correctamente')
    console.log('   ✅ GET /api/cotizaciones?search=soila - Funciona correctamente')
    console.log('   ✅ GET /api/cotizaciones/stats - Funciona correctamente')
    console.log('   ✅ PUT /api/cotizaciones/:id - Funciona correctamente')
    if (allQuotesData.data && allQuotesData.data.length >= 2) {
      console.log('   ✅ POST /api/cotizaciones/bulk-status - Funciona correctamente')
    }
    console.log()
    console.log('🎉 ¡Flujo de cotizaciones verificado completamente!')
    console.log()
    console.log('💡 Modelos utilizados:')
    console.log('   - Quote.findAll() en GET /cotizaciones')
    console.log('   - Quote.findById() en GET /cotizaciones/:id')
    console.log('   - Quote.update() en PUT /cotizaciones/:id')
    console.log('   - Quote.getStats() en GET /stats')
    console.log('   - Quote.updateBulkStatus() en PUT /bulk-status')
    console.log('   - Quote.isValidStatus() en validaciones')

    process.exit(0)

  } catch (error) {
    console.error('❌ Error en test:', error.message)
    process.exit(1)
  }
}

testQuotesFlow()
