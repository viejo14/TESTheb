import User from '../src/models/User.js'
import { query } from '../src/config/database.js'

async function verifyUser(searchEmail) {
  //console.log('🔍 Verificando usuario:', searchEmail || 'último creado')
  //console.log()

  try {
    let user

    if (searchEmail) {
      // Buscar por email usando el modelo
      //console.log('📧 Buscando con User.findByEmail()...')
      user = await User.findByEmail(searchEmail)
    } else {
      // Obtener el último usuario creado
      //console.log('📊 Obteniendo último usuario creado...')
      const result = await query(`
        SELECT id, name, email, role, active, created_at, updated_at, last_login
        FROM users
        ORDER BY created_at DESC
        LIMIT 1
      `)
      user = result.rows[0]
    }

    if (!user) {
      //console.log('❌ Usuario no encontrado')
      process.exit(1)
    }

    //console.log('✅ Usuario encontrado:')
    //console.log('   ID:', user.id)
    //console.log('   Nombre:', user.name)
    //console.log('   Email:', user.email)
    //console.log('   Role:', user.role)
    //console.log('   Activo:', user.active ? 'Sí' : 'No')
    //console.log('   Creado:', user.created_at)
    //console.log('   Último login:', user.last_login || 'Nunca')
    //console.log()

    // Verificar con User.findById()
    //console.log('🔍 Verificando con User.findById()...')
    const userById = await User.findById(user.id)

    if (userById) {
      //console.log('✅ User.findById() funciona correctamente')
      //console.log('   Modelo devolvió:', userById.name, `(${userById.email})`)
    } else {
      //console.log('❌ User.findById() NO encontró el usuario')
    }
    //console.log()

    // Verificar con User.findByEmail()
    //console.log('🔍 Verificando con User.findByEmail()...')
    const userByEmail = await User.findByEmail(user.email)

    if (userByEmail) {
      //console.log('✅ User.findByEmail() funciona correctamente')
      //console.log('   Modelo devolvió:', userByEmail.name, `(ID: ${userByEmail.id})`)
    } else {
      //console.log('❌ User.findByEmail() NO encontró el usuario')
    }
    //console.log()

    // Verificar User.emailExists()
    //console.log('🔍 Verificando User.emailExists()...')
    const emailExists = await User.emailExists(user.email)
    //console.log(`   ${emailExists ? '✅' : '❌'} Email existe:`, emailExists)

    // Verificar con excludeId
    const emailExistsExclude = await User.emailExists(user.email, user.id)
    //console.log(`   ${!emailExistsExclude ? '✅' : '❌'} Email existe (excluyendo mismo ID):`, emailExistsExclude)
    //console.log()

    // Obtener stats
    //console.log('📊 Obteniendo estadísticas con User.getStats()...')
    const stats = await User.getStats()
    //console.log('✅ Estadísticas obtenidas:')
    //console.log('   Total usuarios:', stats.totalUsers)
    //console.log('   Por rol:', stats.usersByRole)
    //console.log('   Últimos 30 días:', stats.recentUsers)
    //console.log()

    // Resumen
    //console.log('📊 RESUMEN DE VERIFICACIÓN:')
    //console.log('   ✅ Usuario existe en DB:', user.email)
    //console.log('   ✅ User.findById() funciona:', userById ? 'SÍ' : 'NO')
    //console.log('   ✅ User.findByEmail() funciona:', userByEmail ? 'SÍ' : 'NO')
    //console.log('   ✅ User.emailExists() funciona:', emailExists ? 'SÍ' : 'NO')
    //console.log('   ✅ User.getStats() funciona: SÍ')
    //console.log()

    //console.log('🎉 ¡Modelo User verificado correctamente!')
    //console.log()
    //console.log('💡 Para probar login, usa:')
    //console.log(`   Email: ${user.email}`)
    //console.log('   Password: [la contraseña que usaste al registrarte]')

    process.exit(0)

  } catch (error) {
    console.error('❌ Error verificando usuario:', error)
    process.exit(1)
  }
}

// Ejecutar con el email pasado como argumento o último usuario
const searchEmail = process.argv[2]
verifyUser(searchEmail)
