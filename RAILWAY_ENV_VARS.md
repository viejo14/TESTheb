# Variables de Entorno para Railway

## Configuración rápida para copiar/pegar en Railway

---

## 🔧 BACKEND - Variables de Railway

**Ir a:** Railway → Backend Service → Variables → Raw Editor

```bash
# Database (Railway reference - automático)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Server
PORT=${{PORT}}
NODE_ENV=production

# JWT (CAMBIAR en producción por algo más seguro)
JWT_SECRET=testheb-super-secret-key-2025-CAMBIAR-ESTO
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=testheb-refresh-secret-key-2025-CAMBIAR-ESTO
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=dvmif7ngh
CLOUDINARY_API_KEY=344177843931449
CLOUDINARY_API_SECRET=OHOEEsFeZsqzCNaSOnr4WhpZP7c

# Email
EMAIL_SERVICE=gmail
EMAIL_USER=franciscocampos0754@gmail.com
EMAIL_PASS=hdgufefbhuquxyeu
EMAIL_FROM_NAME=TESTheb

# CORS (Railway reference al frontend)
FRONTEND_URL=${{Frontend.RAILWAY_PUBLIC_DOMAIN}}
CORS_ORIGINS=${{Frontend.RAILWAY_PUBLIC_DOMAIN}}

# Transbank (modo TEST)
TRANSBANK_INTEGRATION_MODE=TEST
TRANSBANK_COMMERCE_CODE=597055555532
TRANSBANK_API_KEY=tu_api_key_test

# Setup (cambiar a false después de configurar BD)
ALLOW_SETUP=true
```

---

## 🎨 FRONTEND - Variables de Railway

**Ir a:** Railway → Frontend Service → Variables → Raw Editor

```bash
# API URL (Railway reference al backend)
VITE_API_URL=${{Backend.RAILWAY_PUBLIC_DOMAIN}}/api

# Cloudinary (solo para frontend)
VITE_CLOUDINARY_CLOUD_NAME=dvmif7ngh
VITE_CLOUDINARY_UPLOAD_PRESET=testheb-products

# Environment
NODE_ENV=production
```

---

## 📝 Notas Importantes

### Después del primer deploy:

1. **Cambiar ALLOW_SETUP a false:**
   ```bash
   ALLOW_SETUP=false
   ```

2. **Generar JWT Secrets seguros:**
   ```bash
   # Ejecuta en tu terminal local:
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

   # Copia el resultado y actualiza:
   JWT_SECRET=resultado_generado_aqui
   JWT_REFRESH_SECRET=otro_resultado_diferente
   ```

3. **Para Transbank en PRODUCCIÓN:**
   ```bash
   TRANSBANK_INTEGRATION_MODE=PROD
   TRANSBANK_COMMERCE_CODE=tu_codigo_comercio_real
   TRANSBANK_API_KEY=tu_api_key_real
   ```

---

## ✅ Checklist de Variables

### Backend
- [x] DATABASE_URL (automático de Railway)
- [x] PORT (automático de Railway)
- [x] NODE_ENV=production
- [x] JWT_SECRET (cambiar por uno seguro)
- [x] Cloudinary credentials
- [x] Email credentials
- [x] FRONTEND_URL (reference a Frontend service)
- [x] CORS_ORIGINS (reference a Frontend service)
- [x] Transbank (modo TEST)
- [x] ALLOW_SETUP=true (cambiar a false después)

### Frontend
- [x] VITE_API_URL (reference a Backend service)
- [x] VITE_CLOUDINARY_CLOUD_NAME
- [x] NODE_ENV=production

---

## 🚀 Pasos para configurar en Railway

1. **Backend:**
   - Railway → Tu proyecto → Backend service
   - Click en "Variables"
   - Click en "Raw Editor"
   - Pegar todo el bloque de variables del backend
   - Save

2. **Frontend:**
   - Railway → Tu proyecto → Frontend service
   - Click en "Variables"
   - Click en "Raw Editor"
   - Pegar todo el bloque de variables del frontend
   - Save

3. **Deploy automático:**
   - Railway detectará los cambios y hará redeploy automáticamente
   - Espera 2-3 minutos

---

## 🔒 Seguridad

### Variables que DEBES cambiar en producción:
- `JWT_SECRET` → Generar uno aleatorio seguro
- `JWT_REFRESH_SECRET` → Generar otro diferente
- `ALLOW_SETUP` → Cambiar a `false` después del setup inicial

### Variables que son OK usar tal cual:
- Cloudinary credentials (ya son de tu cuenta)
- Email credentials (ya son de tu Gmail)
- Transbank TEST mode (para pruebas)

---

¡Listo para copiar y pegar en Railway! 🎉
