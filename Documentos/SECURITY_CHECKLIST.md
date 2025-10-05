# 🔒 Checklist de Seguridad - TESTheb

## ⚠️ CRÍTICO: Protección de Datos Sensibles

### 📋 Datos Sensibles en el Proyecto

#### 🔴 **Backend (.env)**
```env
DB_PASSWORD=admin123           # ⚠️ Contraseña de PostgreSQL
JWT_SECRET=...                 # ⚠️ Clave para firmar tokens
JWT_REFRESH_SECRET=...         # ⚠️ Clave para refresh tokens
EMAIL_USER=...                 # ⚠️ Email de Gmail
EMAIL_PASSWORD=...             # ⚠️ App password de Gmail
```

#### 🔴 **Frontend (.env.local)**
```env
VITE_CLOUDINARY_API_SECRET=... # ⚠️ API secret de Cloudinary
VITE_CLOUDINARY_API_KEY=...    # ⚠️ API key de Cloudinary
```

---

## ✅ Verificación de Seguridad

### 1️⃣ Verificar que .env está en .gitignore

**Raíz del proyecto:**
```bash
# Verificar
cat .gitignore | grep "\.env"

# Debería mostrar:
# .env
# .env.local
# .env.*.local
```

**Backend:**
```bash
# Verificar
cat backend/.gitignore | grep "\.env"

# Si no existe backend/.gitignore, está protegido por el .gitignore de la raíz
```

### 2️⃣ Verificar que .env NO está en git

```bash
# Estos comandos NO deben mostrar archivos .env
git ls-files | grep "\.env$"
git status | grep "\.env"
```

✅ **Si no aparecen archivos .env, estás seguro**

### 3️⃣ Verificar historial de Git

```bash
# Buscar si alguna vez se subió un .env
git log --all --full-history --pretty=format: --name-only -- "**/.env" | sort -u
```

🔴 **Si aparece algo, necesitas limpiar el historial (ver sección de emergencia)**

---

## 🚨 EMERGENCIA: Si ya subiste .env a GitHub

### Opción 1: Eliminar del historial (Recomendado)

```bash
# 1. Hacer backup del proyecto
cp -r testheb-proyecto testheb-proyecto-backup

# 2. Eliminar del historial con git filter-branch
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch backend/.env frontend/.env.local" \
  --prune-empty --tag-name-filter cat -- --all

# 3. Limpiar referencias
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 4. Forzar push (PELIGROSO - avisa al equipo)
git push origin --force --all
```

### Opción 2: Rotar credenciales (MÁS SEGURO)

Si ya subiste .env a GitHub público:

1. **Cambiar TODAS las contraseñas inmediatamente:**
   - ✅ Contraseña de PostgreSQL
   - ✅ JWT_SECRET (generar nuevo)
   - ✅ Email password (generar nuevo app password)
   - ✅ Cloudinary API keys (regenerar en panel)

2. **Eliminar el .env del repositorio:**
   ```bash
   git rm --cached backend/.env
   git rm --cached frontend/.env.local
   git commit -m "Remove sensitive .env files"
   git push
   ```

3. **Actualizar .gitignore y verificar**

---

## 🛡️ Mejores Prácticas

### ✅ QUE HACER

1. **Usar archivos .example**
   ```bash
   # Subir al repo
   backend/.env.example     ✅

   # NO subir al repo
   backend/.env            ❌
   ```

2. **Documentar variables necesarias**
   ```env
   # .env.example
   DB_PASSWORD=tu_password_aqui
   JWT_SECRET=genera_con_comando_abajo
   ```

3. **Generar secretos seguros**
   ```bash
   # Generar JWT_SECRET
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

4. **Variables de entorno en producción**
   - Usar variables de entorno del hosting (Vercel, Render, etc.)
   - NO hardcodear secretos en el código
   - Usar servicios como AWS Secrets Manager (avanzado)

### ❌ QUE NO HACER

1. ❌ Subir .env a GitHub
2. ❌ Hardcodear contraseñas en el código
3. ❌ Compartir .env por email/WhatsApp
4. ❌ Dejar contraseñas por defecto (admin123, password, etc.)
5. ❌ Usar el mismo secreto en dev y producción

---

## 📊 Estado Actual del Proyecto

### ✅ Protecciones Activas

- [x] `.gitignore` en raíz protege `.env`
- [x] `backend/.gitignore` protege archivos sensibles
- [x] `frontend/.gitignore` protege archivos sensibles
- [x] Archivos `.env.example` disponibles
- [x] Documentación de variables necesarias

### ⚠️ Pendientes

- [ ] Verificar que ningún .env está en GitHub
- [ ] Cambiar contraseñas por defecto en producción
- [ ] Rotar JWT_SECRET antes de producción
- [ ] Generar nuevos secretos para producción
- [ ] Configurar variables de entorno en el hosting

---

## 🔍 Comandos de Verificación Rápida

```bash
# 1. Ver archivos ignorados
git status --ignored

# 2. Ver si .env está tracked
git ls-files | grep "\.env"

# 3. Ver contenido de .gitignore
cat .gitignore | grep env

# 4. Verificar que .env no aparece en cambios
git status
```

---

## 📝 Para el Equipo

### Al clonar el proyecto:

1. **Copiar archivos de ejemplo:**
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.production.example frontend/.env.local
   ```

2. **Rellenar con tus credenciales locales**

3. **NUNCA hacer:**
   ```bash
   git add backend/.env  # ❌ NO HACER ESTO
   ```

---

## 🎯 Checklist Antes de Commit

Antes de cada commit, verificar:

- [ ] `git status` no muestra archivos .env
- [ ] No hay contraseñas en el código
- [ ] No hay API keys hardcodeadas
- [ ] Archivos .example están actualizados

---

## 📞 En Caso de Exposición

Si accidentalmente expusiste credenciales:

1. **INMEDIATAMENTE cambiar todas las contraseñas**
2. **Rotar todos los secretos y API keys**
3. **Revisar logs por accesos sospechosos**
4. **Notificar al equipo**
5. **Limpiar historial de git (ver arriba)**

---

**Última actualización:** Octubre 2025
**Criticidad:** 🔴 ALTA - Seguir estrictamente
