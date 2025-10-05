# 🚀 Guía de Configuración - TESTheb (Para Nuevo Desarrollador)

## 📋 Pre-requisitos

Antes de empezar, asegúrate de tener instalado:

- ✅ **Node.js v18+** - [Descargar aquí](https://nodejs.org/)
- ✅ **PostgreSQL v12+** - [Descargar aquí](https://www.postgresql.org/download/)
- ✅ **Git** - [Descargar aquí](https://git-scm.com/)

### Verificar instalaciones:
```powershell
node --version    # Debe mostrar v18 o superior
npm --version     # Debe mostrar 8 o superior
psql --version    # Debe mostrar PostgreSQL 12 o superior
```

---

## 🗂️ Paso 1: Obtener el Proyecto

### Opción A: Desde Git (Recomendado)
```powershell
git clone https://github.com/sebamellaisla-sketch/2025_MA_CAPSTONE_705D_GRUPO_7.git
cd 2025_MA_CAPSTONE_705D_GRUPO_7
git checkout dev-francisco  # O la rama que te compartieron
```

### Opción B: Desde ZIP
1. Descomprime el archivo del proyecto
2. Abre la carpeta en tu editor (VS Code recomendado)

---

## 🗄️ Paso 2: Configurar Base de Datos

### 2.1 Abrir PostgreSQL
```powershell
# Abrir psql (ajusta la ruta si es necesario)
psql -U postgres
```

### 2.2 Crear la Base de Datos
```sql
-- En el prompt de psql:
CREATE DATABASE testheb_db;
\c testheb_db;
```

### 2.3 Ejecutar Scripts SQL
```sql
-- Opción A: Ejecutar archivo por archivo
\i 'C:/ruta/completa/al/proyecto/backend/sql/create_tables.sql'
-- Repite para cada archivo SQL necesario

-- Opción B: Si tienes un dump completo
\i 'C:/ruta/al/dump.sql'
```

**IMPORTANTE:** Reemplaza `C:/ruta/completa/al/proyecto` con la ruta real en tu máquina.

### 2.4 Verificar que las tablas se crearon
```sql
\dt
-- Deberías ver: users, categories, products, quotes, orders, order_items, etc.
```

---

## ⚙️ Paso 3: Configurar Backend

### 3.1 Instalar Dependencias
```powershell
cd backend
npm install
```

### 3.2 Crear archivo `.env`
```powershell
# Copia el archivo de ejemplo
copy .env.example .env

# Abre el archivo .env y configura:
notepad .env
```

### 3.3 Configurar Variables de Entorno CRÍTICAS

Edita tu archivo `backend/.env`:

```env
# ==============================================
# BASE DE DATOS (OBLIGATORIO)
# ==============================================
DB_HOST=localhost
DB_PORT=5432
DB_NAME=testheb_db
DB_USER=postgres
DB_PASSWORD=TU_PASSWORD_DE_POSTGRES

# ==============================================
# JWT (OBLIGATORIO)
# ==============================================
# Genera un secreto único con este comando:
# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=pega_aqui_el_secreto_generado
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=pega_aqui_otro_secreto_diferente
JWT_REFRESH_EXPIRES_IN=7d

# ==============================================
# SERVIDOR (OBLIGATORIO)
# ==============================================
NODE_ENV=development
PORT=3000

# ==============================================
# FRONTEND URL (OBLIGATORIO para CORS)
# ==============================================
FRONTEND_URL=http://localhost:5173

# ==============================================
# CLOUDINARY (Necesario para subir imágenes)
# ==============================================
# Crea una cuenta gratuita en https://cloudinary.com
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# ==============================================
# TRANSBANK (Para pagos - Modo TEST por defecto)
# ==============================================
TRANSBANK_INTEGRATION_TYPE=TEST
TRANSBANK_COMMERCE_CODE=597055555532

# ⚠️ IMPORTANTE: En modo TEST, NO agregues TRANSBANK_API_KEY_ID ni TRANSBANK_API_KEY_SECRET
# El SDK usa credenciales integradas automáticamente para pruebas.
# Solo necesitas las líneas de arriba para modo TEST.

# Para modo PRODUCCIÓN (cuando tengas contrato con Transbank):
# TRANSBANK_INTEGRATION_TYPE=LIVE
# TRANSBANK_COMMERCE_CODE=tu_codigo_real
# TRANSBANK_API_KEY_ID=tu_key_id_real
# TRANSBANK_API_KEY_SECRET=tu_key_secret_real

# ==============================================
# EMAIL (Opcional - solo para recuperación de contraseña)
# ==============================================
EMAIL_SERVICE=gmail
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_contraseña_de_aplicacion
EMAIL_FROM_NAME=TESTheb
```

### 3.4 Generar Secretos JWT
```powershell
# Ejecuta esto DOS VECES para tener dos secretos diferentes
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3.5 Probar el Backend
```powershell
npm run dev
# Deberías ver: "✅ Servidor corriendo en puerto 3000"
# Prueba: http://localhost:3000/api/health
```

---

## 🎨 Paso 4: Configurar Frontend

### 4.1 Instalar Dependencias
```powershell
# Abre una NUEVA terminal (deja el backend corriendo)
cd frontend
npm install
```

### 4.2 Crear archivo `.env.local`
```powershell
copy .env.example .env.local
notepad .env.local
```

### 4.3 Configurar Variables del Frontend

Edita `frontend/.env.local`:

```env
# Backend API - Usa rutas relativas con el proxy de Vite
VITE_API_URL=/api

# Backend URL para desarrollo (para el proxy)
VITE_BACKEND_URL=http://localhost:3000

# Cloudinary (mismos valores que en backend)
VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name
VITE_CLOUDINARY_API_KEY=tu_api_key
VITE_CLOUDINARY_UPLOAD_PRESET=tu_upload_preset
VITE_CLOUDINARY_FOLDER=testheb_products
```

### 4.4 Probar el Frontend
```powershell
npm run dev
# Deberías ver: "Local: http://localhost:5173"
```

---

## 🎯 Paso 5: Verificar que Todo Funciona

### 5.1 Abrir la aplicación
- Navega a: http://localhost:5173
- Deberías ver la página de inicio de TESTheb

### 5.2 Probar el Login
```
Usuario de prueba (si existe en tu BD):
Email: admin@testheb.cl
Password: (consultar con tu compañero)
```

### 5.3 Crear un usuario nuevo
1. Click en "Registrarse"
2. Completa el formulario
3. Verifica que se cree correctamente

---

## 📚 Comandos Útiles

### Backend
```powershell
cd backend
npm run dev          # Modo desarrollo (con nodemon)
npm start            # Modo producción
npm test             # Ejecutar tests
```

### Frontend
```powershell
cd frontend
npm run dev          # Modo desarrollo
npm run build        # Build para producción
npm run preview      # Previsualizar build
```

### Base de Datos
```powershell
# Ver tablas
psql -U postgres -d testheb_db -c "\dt"

# Backup de la BD
pg_dump -U postgres testheb_db > backup.sql

# Restaurar desde backup
psql -U postgres testheb_db < backup.sql
```

---

## 🚨 Solución de Problemas Comunes

### ❌ Error: "Cannot connect to database"
- Verifica que PostgreSQL esté corriendo
- Revisa las credenciales en `backend/.env`
- Asegúrate que la BD `testheb_db` existe

### ❌ Error: "Port 3000 already in use"
- Cambia el puerto en `backend/.env`: `PORT=3001`
- O cierra el proceso que usa el puerto 3000

### ❌ Error: "Module not found"
- Elimina `node_modules` y reinstala:
  ```powershell
  rm -r node_modules
  npm install
  ```

### ❌ Error en Cloudinary
- Verifica tus credenciales en https://cloudinary.com/console
- Asegúrate de crear un "upload preset" sin firma (unsigned)

### ❌ Frontend no se conecta al Backend
- Verifica que ambos estén corriendo
- Revisa `VITE_BACKEND_URL` en `frontend/.env.local`
- Limpia caché de Vite: `npm run dev -- --force`

---

## 📞 Necesitas Ayuda?

1. **Revisa la documentación completa:**
   - `Documentos/INSTALLATION_GUIDE.md`
   - `Documentos/API_DOCUMENTATION.md`
   - `README.md`

2. **Contacta al equipo:**
   - Francisco Campos
   - Sebastian Mella

3. **Recursos útiles:**
   - [Documentación Node.js](https://nodejs.org/docs)
   - [Documentación React](https://react.dev)
   - [Documentación PostgreSQL](https://www.postgresql.org/docs)

---

## ✅ Checklist Final

Antes de empezar a desarrollar, verifica:

- [ ] PostgreSQL instalado y corriendo
- [ ] Base de datos `testheb_db` creada
- [ ] Tablas creadas correctamente
- [ ] Backend: `npm install` completado
- [ ] Backend: `.env` configurado
- [ ] Backend corriendo en http://localhost:3000
- [ ] Frontend: `npm install` completado
- [ ] Frontend: `.env.local` configurado
- [ ] Frontend corriendo en http://localhost:5173
- [ ] Puedes hacer login/registro
- [ ] Cuenta de Cloudinary creada (para imágenes)

---

## 🎉 ¡Listo para Desarrollar!

Si completaste todos los pasos, tu entorno de desarrollo está listo. 

**Próximos pasos:**
1. Familiarízate con la estructura del proyecto
2. Revisa la documentación de la API
3. Explora el código existente
4. ¡Empieza a programar!

**Buena suerte! 🚀**
