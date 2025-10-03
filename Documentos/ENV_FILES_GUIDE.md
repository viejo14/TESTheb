# 📋 Guía de Archivos .env - TESTheb

## 🎯 ¿Qué archivo va dónde?

### ✅ Archivos que SÍ se suben a GitHub (.example)

Estos archivos son **plantillas sin credenciales reales**:

```
backend/
├── .env.example ✅ SUBIR - Plantilla para otros desarrolladores

frontend/
├── .env.development.example ✅ SUBIR - Plantilla para desarrollo
└── .env.production.example ✅ SUBIR - Plantilla para producción
```

**Características:**
- ✅ Sin contraseñas reales
- ✅ Con placeholders: `tu_password_aqui`
- ✅ Con comentarios explicativos
- ✅ Se suben a GitHub para que el equipo sepa qué configurar

---

### ❌ Archivos que NUNCA se suben a GitHub

Estos archivos contienen **credenciales REALES**:

```
backend/
├── .env ❌ NO SUBIR - Credenciales reales del backend

frontend/
├── .env.local ❌ NO SUBIR - Credenciales reales (local override)
├── .env.development ❌ NO SUBIR - Credenciales reales para desarrollo
└── .env.production ❌ NO SUBIR - Credenciales reales para producción
```

**Características:**
- 🔴 Contienen contraseñas reales
- 🔴 Contienen API keys reales
- 🔴 Contienen secretos de JWT
- 🔴 Están en `.gitignore`

---

## 🔄 Workflow Correcto

### Para el primer desarrollador (tú):

1. **Crear archivos .example (ya hecho):**
   ```bash
   # Estos SÍ se suben a GitHub
   backend/.env.example
   frontend/.env.development.example
   frontend/.env.production.example
   ```

2. **Crear archivos con credenciales reales:**
   ```bash
   # Copiar plantilla
   cp backend/.env.example backend/.env
   cp frontend/.env.development.example frontend/.env.development

   # Editar y poner credenciales REALES
   nano backend/.env
   nano frontend/.env.development
   ```

3. **Commit solo los .example:**
   ```bash
   git add backend/.env.example
   git add frontend/.env.development.example
   git add frontend/.env.production.example
   git commit -m "Add environment templates"
   git push
   ```

### Para otros desarrolladores (clonan el repo):

1. **Clonar proyecto:**
   ```bash
   git clone https://github.com/tu-repo/testheb-proyecto.git
   cd testheb-proyecto
   ```

2. **Copiar archivos .example:**
   ```bash
   # Backend
   cp backend/.env.example backend/.env

   # Frontend
   cp frontend/.env.development.example frontend/.env.development
   ```

3. **Rellenar con SUS propias credenciales:**
   - Cada dev usa su propia base de datos local
   - Cada dev tiene sus propios API keys de Cloudinary
   - etc.

---

## 📊 Comparación de Archivos

### Backend

| Archivo | Subir a GitHub | Contenido | Uso |
|---------|----------------|-----------|-----|
| `.env.example` | ✅ SÍ | Placeholders | Plantilla para el equipo |
| `.env` | ❌ NO | Credenciales reales | Desarrollo local |

**Ejemplo .env.example (placeholders):**
```env
DB_PASSWORD=tu_password_aqui
JWT_SECRET=genera_con_comando_crypto
EMAIL_PASSWORD=tu_app_password_de_gmail
```

**Ejemplo .env (credenciales reales):**
```env
DB_PASSWORD=admin123
JWT_SECRET=a8f7d6e5c4b3a2...
EMAIL_PASSWORD=hdgufefbhuquxyeu
```

### Frontend

| Archivo | Subir a GitHub | Contenido | Uso |
|---------|----------------|-----------|-----|
| `.env.development.example` | ✅ SÍ | Placeholders | Plantilla dev |
| `.env.production.example` | ✅ SÍ | Placeholders | Plantilla prod |
| `.env.development` | ❌ NO | Credenciales reales | Desarrollo |
| `.env.local` | ❌ NO | Credenciales reales | Override local |
| `.env.production` | ❌ NO | Credenciales reales | Producción |

---

## 🔒 Protecciones Implementadas

### .gitignore de la raíz:
```gitignore
# Archivos protegidos (NO se suben)
.env
.env.local
.env.development        # ← Con credenciales reales
.env.production         # ← Con credenciales reales
.env.*.local

# Archivos permitidos (SÍ se suben)
!.env.example           # ← Solo plantillas
!.env.production.example
!.env.development.example
```

---

## 🚨 Errores Comunes

### ❌ ERROR 1: Credenciales en archivos .example

```env
# ❌ MAL - .env.example
VITE_CLOUDINARY_API_SECRET=OHOEEsFeZsqzCNaSOnr4WhpZP7c  # Real!

# ✅ BIEN - .env.example
VITE_CLOUDINARY_API_SECRET=tu_api_secret  # Placeholder
```

### ❌ ERROR 2: Subir .env.development

```bash
# ❌ MAL
git add frontend/.env.development  # Tiene credenciales reales!
git commit -m "Add env"

# ✅ BIEN
git add frontend/.env.development.example  # Solo plantilla
git commit -m "Add env template"
```

### ❌ ERROR 3: Compartir .env por WhatsApp

```
❌ "Hey, te paso mi .env por WhatsApp"
✅ "Copia el .env.example y te paso las credenciales por canal seguro"
```

---

## 🎯 Estado Actual de TU Proyecto

### ✅ Archivos Protegidos Correctamente:

- ✅ `backend/.env` - Ignorado por git
- ✅ `frontend/.env.local` - Ignorado por git
- ✅ `frontend/.env.development` - Ignorado por git

### ✅ Plantillas Disponibles:

- ✅ `backend/.env.example` - Listo para subir
- ✅ `frontend/.env.development.example` - Listo para subir
- ✅ `frontend/.env.production.example` - Limpiado, listo para subir

### ⚠️ Antes corregido:

- 🔧 `.env.production.example` tenía credenciales reales → Limpiado
- 🔧 `.gitignore` no protegía `.env.development` → Agregado

---

## 📝 Checklist Pre-Commit

Antes de cada `git push`, verificar:

```bash
# 1. ¿Qué archivos voy a subir?
git status

# 2. Verificar que NO aparezcan archivos .env (sin .example)
# ✅ BIEN: frontend/.env.production.example
# ❌ MAL: frontend/.env.production

# 3. Ver contenido de los .example que subirás
cat backend/.env.example
# Debe tener placeholders, NO credenciales reales

# 4. Verificar que archivos reales están ignorados
git check-ignore backend/.env frontend/.env.development
# Debe mostrar las rutas (están ignorados)
```

---

## 🔑 Credenciales Actuales (NO subir)

**Backend (.env):**
```env
DB_PASSWORD=admin123
JWT_SECRET=testheb-super-secret-key-2025
EMAIL_USER=franciscocampos0754@gmail.com
EMAIL_PASSWORD=hdgufefbhuquxyeu
```

**Frontend (.env.development + .env.local):**
```env
VITE_CLOUDINARY_CLOUD_NAME=dvmif7ngh
VITE_CLOUDINARY_API_KEY=344177843931449
VITE_CLOUDINARY_API_SECRET=OHOEEsFeZsqzCNaSOnr4WhpZP7c
```

⚠️ **Estas credenciales están seguras mientras NO se suban a GitHub.**

---

## 📞 Ayuda Rápida

### ¿Este archivo se sube a GitHub?

| Archivo | Respuesta |
|---------|-----------|
| `backend/.env.example` | ✅ SÍ - Es plantilla |
| `backend/.env` | ❌ NO - Credenciales reales |
| `frontend/.env.development.example` | ✅ SÍ - Es plantilla |
| `frontend/.env.development` | ❌ NO - Credenciales reales |
| `frontend/.env.local` | ❌ NO - Credenciales reales |
| `frontend/.env.production.example` | ✅ SÍ - Es plantilla |
| `frontend/.env.production` | ❌ NO - Credenciales reales |

**Regla simple:**
- ✅ Archivos `.example` → GitHub (plantillas)
- ❌ Archivos sin `.example` → NO GitHub (credenciales)

---

**Última actualización:** Octubre 2025
**Equipo:** TESTheb - Capstone APT122
