# 🔒 Guía de Seguridad - TESTheb

## 🛡️ Gestión de Sesiones y Tokens

### ⏰ Tiempos de Expiración

El sistema implementa **expiración automática de sesiones** para proteger la seguridad de los usuarios:

| Token | Duración | Propósito |
|-------|----------|-----------|
| **Access Token (JWT)** | 24 horas | Autenticación principal |
| **Refresh Token** | 7 días | Renovar access token |
| **Password Reset Token** | 1 hora | Recuperación de contraseña |

### 🔄 Flujo de Autenticación

#### 1. Inicio de Sesión
```
Usuario → Login → Backend genera:
  ├─ Access Token (24h)
  └─ Refresh Token (7d)

Frontend guarda en localStorage:
  ├─ token
  ├─ refreshToken
  └─ user (datos del usuario)
```

#### 2. Verificación al Iniciar la App

Cuando el usuario abre la aplicación:

```javascript
1. Leer token de localStorage
2. ¿Token existe?
   │
   ├─ NO → Usuario no autenticado ❌
   │
   └─ SÍ → Verificar expiración
       │
       ├─ Expirado → Auto-logout 🔒
       │
       └─ Válido → Verificar con backend
           │
           ├─ Backend rechaza → Auto-logout ❌
           │
           └─ Backend acepta → Usuario autenticado ✅
```

#### 3. Verificación Periódica

Mientras el usuario usa la app:
- Cada **5 minutos** se verifica si el token expiró
- Si expira, se cierra sesión automáticamente con alerta

#### 4. Auto-Logout

El sistema cierra sesión automáticamente cuando:
- ✅ Token expirado (24 horas)
- ✅ Token inválido
- ✅ Usuario desactivado en backend
- ✅ Error al verificar con backend

---

## 🎯 Configuración Recomendada por Entorno

### 🔧 Desarrollo
```env
JWT_EXPIRES_IN=24h        # Sesión de 1 día
JWT_REFRESH_EXPIRES_IN=7d # Refresh por 1 semana
```

**Ventajas:**
- No molestas al desarrollador con logins constantes
- Testing cómodo

### 🏢 Producción - Usuarios Normales
```env
JWT_EXPIRES_IN=24h        # Sesión de 1 día
JWT_REFRESH_EXPIRES_IN=7d # Refresh por 1 semana
```

**Ventajas:**
- Balance entre seguridad y experiencia de usuario
- Usuario promedio no necesita loguearse todos los días

### 🔐 Producción - Alta Seguridad (Banking, Admin)
```env
JWT_EXPIRES_IN=1h         # Sesión de 1 hora
JWT_REFRESH_EXPIRES_IN=24h # Refresh por 1 día
```

**Ventajas:**
- Máxima seguridad
- Si alguien roba el token, solo es válido 1 hora

---

## 💡 Mejores Prácticas Implementadas

### ✅ En el Frontend

1. **Verificación de Expiración Local**
   ```javascript
   // AuthContext.jsx línea 16-27
   const isTokenExpired = (token) => {
     const decoded = jwtDecode(token)
     return decoded.exp < currentTime
   }
   ```

2. **Verificación con Backend al Iniciar**
   ```javascript
   // AuthContext.jsx línea 60-73
   const response = await fetch('/api/auth/profile', {
     headers: { 'Authorization': `Bearer ${token}` }
   })
   ```

3. **Verificación Periódica Cada 5 Minutos**
   ```javascript
   // AuthContext.jsx línea 90-104
   setInterval(() => {
     if (isTokenExpired(token)) {
       clearAuth()
       alert('Tu sesión ha expirado')
     }
   }, 5 * 60 * 1000)
   ```

4. **Auto-Logout en Errores 401**
   - Cualquier request que reciba 401 cierra sesión
   - El token se limpia completamente del localStorage

### ✅ En el Backend

1. **Tokens con Expiración**
   ```javascript
   // auth.js línea 132-141
   jwt.sign(payload, secret, {
     expiresIn: '24h',
     issuer: 'testheb-api',
     audience: 'testheb-users'
   })
   ```

2. **Verificación de Usuario Activo**
   ```javascript
   // auth.js línea 22-32
   const user = await query(
     'SELECT * FROM users WHERE id = $1 AND active = true'
   )
   ```

3. **Manejo de Tokens Expirados**
   ```javascript
   // auth.js línea 53-58
   if (error.name === 'TokenExpiredError') {
     return res.status(401).json({
       message: 'Token expirado'
     })
   }
   ```

---

## 🔐 Opciones de Configuración

### Opción 1: SessionStorage (Sesión por Pestaña)

Cambiar `localStorage` → `sessionStorage` en AuthContext:

```javascript
// Se cierra sesión al cerrar el navegador
sessionStorage.setItem('token', token)
```

**Pros:**
- ✅ Más seguro
- ✅ No persiste al cerrar navegador

**Contras:**
- ❌ Usuario debe loguearse cada vez que abre el navegador
- ❌ Experiencia de usuario menos cómoda

### Opción 2: localStorage con "Recordarme"

Agregar checkbox "Recordarme" en login:

```javascript
if (rememberMe) {
  localStorage.setItem('token', token)  // Persiste
} else {
  sessionStorage.setItem('token', token) // Temporal
}
```

**Pros:**
- ✅ Usuario elige
- ✅ Balance entre seguridad y comodidad

### Opción 3: Tokens de Corta Duración + Auto-Refresh

```javascript
// Token de 15 minutos, auto-renovar antes de expirar
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

**Pros:**
- ✅ Máxima seguridad
- ✅ Experiencia transparente para el usuario

**Contras:**
- ❌ Más complejo de implementar
- ❌ Más requests al backend

---

## 🎯 Recomendación para TESTheb

### Configuración Actual (Óptima para tu caso)

```env
JWT_EXPIRES_IN=24h        # ✅ Bien para e-commerce
JWT_REFRESH_EXPIRES_IN=7d # ✅ Usuario no se molesta mucho
```

**Justificación:**
- ✅ E-commerce no maneja datos súper sensibles (como banking)
- ✅ Usuario puede comprar sin re-loguearse constantemente
- ✅ 24 horas es un balance razonable
- ✅ Si roban el token, solo es válido 1 día
- ✅ Frontend verifica expiración automáticamente

### Si Quieres Más Seguridad

```env
JWT_EXPIRES_IN=2h         # Token de 2 horas
JWT_REFRESH_EXPIRES_IN=7d # Refresh semanal
```

Agregar auto-refresh 5 minutos antes de expirar.

---

## 🚨 Advertencias de Seguridad

### ❌ NUNCA hacer esto:

1. **Tokens sin expiración**
   ```javascript
   // ❌ MAL
   jwt.sign(payload, secret) // Sin expiresIn
   ```

2. **Guardar contraseñas en localStorage**
   ```javascript
   // ❌ MAL
   localStorage.setItem('password', password)
   ```

3. **No verificar expiración del token**
   ```javascript
   // ❌ MAL
   if (localStorage.getItem('token')) {
     setIsAuthenticated(true) // Sin verificar validez
   }
   ```

4. **Tokens demasiado largos**
   ```javascript
   // ❌ MAL para producción
   expiresIn: '365d' // 1 año es demasiado
   ```

---

## 📊 Testing de Seguridad

### Probar Auto-Logout

1. **Simular token expirado:**
   ```javascript
   // En consola del navegador
   const token = localStorage.getItem('token')
   console.log('Token actual:', token)

   // Modificar para que expire hace 1 día
   // Refrescar página → Debería hacer auto-logout
   ```

2. **Esperar 24 horas:**
   - Login como admin
   - Esperar 24 horas
   - Abrir app → Debería cerrar sesión automáticamente

3. **Desactivar usuario:**
   - Login como usuario
   - Admin desactiva el usuario
   - Refrescar app → Auto-logout

---

## 📝 Checklist de Seguridad

- [x] Tokens con expiración (24h)
- [x] Refresh tokens (7d)
- [x] Verificación de expiración en frontend
- [x] Verificación con backend al iniciar app
- [x] Auto-logout cuando expira
- [x] Verificación periódica cada 5 min
- [x] Manejo de errores 401
- [x] Limpieza completa de localStorage al logout
- [x] Verificación de usuario activo en backend
- [ ] HTTPS en producción (pendiente deploy)
- [ ] Rate limiting en endpoints de auth (opcional)
- [ ] 2FA para admin (opcional, futuro)

---

**Última actualización:** Octubre 2025
**Equipo:** TESTheb - Capstone APT122
