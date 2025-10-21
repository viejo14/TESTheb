const BASE_URL = 'http://localhost:3000'
const email = process.argv[2] || 'alexistexas@gmail.com'
const password = process.argv[3] || '123456'

//console.log('🔐 Probando flujo de autenticación completo...')
//console.log('📧 Email:', email)
//console.log('🔑 Password:', password)
//console.log()

async function testAuthFlow() {
  try {
    // 1. LOGIN
    //console.log('1️⃣  Probando POST /api/auth/login...')
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    if (!loginResponse.ok) {
      const error = await loginResponse.json()
      //console.log('❌ Login falló:', error.message)
      //console.log('   Código:', loginResponse.status)
      //console.log()
      //console.log('💡 Verifica que:')
      //console.log('   - El email sea correcto')
      //console.log('   - La contraseña sea la correcta')
      //console.log('   - El usuario esté activo')
      process.exit(1)
    }

    const loginData = await loginResponse.json()
    //console.log('✅ Login exitoso!')

    const token = loginData.token || loginData.data?.token
    if (token) {
      //console.log('   Token recibido:', token.substring(0, 50) + '...')
    } else {
      //console.log('   Respuesta completa:', JSON.stringify(loginData, null, 2))
    }

    const user = loginData.user || loginData.data?.user
    if (user) {
      //console.log('   Usuario:', user.name)
      //console.log('   Role:', user.role)
    }
    //console.log()

    if (!token) {
      //console.log('❌ No se recibió token en la respuesta')
      process.exit(1)
    }

    // 2. GET PROFILE
    //console.log('2️⃣  Probando GET /api/auth/profile...')
    const profileResponse = await fetch(`${BASE_URL}/api/auth/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })

    if (!profileResponse.ok) {
      const error = await profileResponse.json()
      //console.log('❌ Get profile falló:', error.message)
      process.exit(1)
    }

    const profileData = await profileResponse.json()
    //console.log('✅ Perfil obtenido!')

    const profile = profileData.user || profileData.data || profileData
    //console.log('   ID:', profile.id)
    //console.log('   Nombre:', profile.name)
    //console.log('   Email:', profile.email)
    //console.log('   Role:', profile.role)
    //console.log('   Activo:', profile.active)
    //console.log()

    // 3. UPDATE PROFILE
    //console.log('3️⃣  Probando PUT /api/auth/profile...')
    const newName = `${profile.name} [UPDATED]`
    const updateResponse = await fetch(`${BASE_URL}/api/auth/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: newName
      })
    })

    if (!updateResponse.ok) {
      const error = await updateResponse.json()
      //console.log('❌ Update profile falló:', error.message)
      process.exit(1)
    }

    const updateData = await updateResponse.json()
    const updatedProfile = updateData.user || updateData.data || updateData
    //console.log('✅ Perfil actualizado!')
    //console.log('   Nombre anterior:', profile.name)
    //console.log('   Nombre nuevo:', updatedProfile.name)
    //console.log()

    // 4. REVERTIR CAMBIO
    //console.log('4️⃣  Revirtiendo cambio...')
    const revertResponse = await fetch(`${BASE_URL}/api/auth/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: profile.name // Nombre original
      })
    })

    if (revertResponse.ok) {
      //console.log('✅ Cambio revertido!')
    }
    //console.log()

    // RESUMEN
    //console.log('📊 RESUMEN DE VERIFICACIÓN:')
    //console.log('   ✅ POST /api/auth/login - Funciona correctamente')
    //console.log('   ✅ GET /api/auth/profile - Funciona correctamente')
    //console.log('   ✅ PUT /api/auth/profile - Funciona correctamente')
    //console.log()
    //console.log('🎉 ¡Flujo de autenticación verificado completamente!')
    //console.log()
    //console.log('💡 Modelos utilizados:')
    //console.log('   - User.findByEmail() en login')
    //console.log('   - User.findById() en GET /profile')
    //console.log('   - User.update() en PUT /profile')
    //console.log('   - User.emailExists() en validaciones')

    process.exit(0)

  } catch (error) {
    console.error('❌ Error en test:', error.message)
    process.exit(1)
  }
}

testAuthFlow()
