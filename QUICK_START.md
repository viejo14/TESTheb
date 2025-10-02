# 🚀 Quick Start - TESTheb

Guía rápida para empezar a trabajar en el proyecto TESTheb en **menos de 10 minutos**.

## ⚡ Setup Rápido (TL;DR)

```bash
# 1. Clonar repositorio
git clone https://github.com/sebamellaisla-sketch/2025_MA_CAPSTONE_705D_GRUPO_7.git
cd testheb-proyecto

# 2. Backend
cd backend
npm install
cp .env.example .env
# Edita .env con tus credenciales
npm run dev

# 3. Frontend (nueva terminal)
cd ../frontend
npm install
npm run dev

# 4. Visita http://localhost:5173
```

---

## 📋 Prerrequisitos

Asegúrate de tener instalado:

- ✅ **Node.js 18+** → [Descargar](https://nodejs.org/)
- ✅ **PostgreSQL 15+** → [Descargar](https://www.postgresql.org/download/)
- ✅ **Git** → [Descargar](https://git-scm.com/)
- ⚠️ **Cuenta Cloudinary** (para imágenes) → [Registrarse](https://cloudinary.com/users/register/free)
- ⚠️ **Cuenta Gmail** (para emails) → Opcional

---

## 🔧 Instalación Detallada

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/sebamellaisla-sketch/2025_MA_CAPSTONE_705D_GRUPO_7.git
cd testheb-proyecto
```

### 2️⃣ Configurar Base de Datos

```bash
# Crear base de datos
createdb testheb_db

# O usando psql
psql -U postgres
CREATE DATABASE testheb_db;
\q
```

### 3️⃣ Configurar Backend

```bash
cd backend

# Instalar dependencias
npm install

# Crear archivo .env desde template
cp .env.example .env

# Editar .env con tus credenciales
# Usa tu editor favorito (VS Code, nano, vim, etc.)
code .env
```

**Mínimo necesario en `.env`:**

```env
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=testheb_db
DB_USER=tu_usuario
DB_PASSWORD=tu_password

# JWT (genera con: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=genera_un_secret_aleatorio_aqui
JWT_REFRESH_SECRET=otro_secret_diferente

# Cloudinary (obtener en https://cloudinary.com/console)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

```bash
# Iniciar servidor backend
npm run dev

# Debe mostrar:
# 🚀 Servidor TESTheb ejecutándose en http://localhost:3000
```

### 4️⃣ Crear Tablas en BD (Primera vez)

Visita estos endpoints en el navegador (solo la primera vez):

```bash
# 1. Crear tabla de usuarios
http://localhost:3000/api/setup/create-users-table

# 2. Crear tabla de órdenes
http://localhost:3000/api/setup/create-orders-table

# 3. Verificar conexión a BD
http://localhost:3000/api/test-db
```

### 5️⃣ Configurar Frontend

```bash
# En otra terminal
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Debe mostrar:
# Local: http://localhost:5173
```

### 6️⃣ Verificar Instalación

Abre el navegador en: **http://localhost:5173**

✅ Deberías ver la página de inicio de TESTheb.

---

## 🔑 Credenciales de Prueba

### Usuario Administrador

```
Email: admin@testheb.cl
Contraseña: admin123
```

### Crear Admin (si no existe)

Visita: `http://localhost:3000/api/setup/create-admin`

---

## 🌿 Flujo de Trabajo con Git

### Primera vez

```bash
# Crear rama desde develop
git checkout develop
git pull origin develop
git checkout -b feature/mi-nueva-funcionalidad

# Hacer cambios
# ... editar archivos ...

# Commit
git add .
git commit -m "feat: descripción de mi cambio"

# Push
git push origin feature/mi-nueva-funcionalidad

# Crear PR en GitHub
# develop ← feature/mi-nueva-funcionalidad
```

### Día a día

```bash
# Actualizar develop
git checkout develop
git pull origin develop

# Volver a tu rama
git checkout feature/mi-funcionalidad

# Sincronizar con develop
git merge develop

# Continuar trabajando
```

📖 Ver guías completas:
- [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md)
- [COMMIT_CONVENTIONS.md](./COMMIT_CONVENTIONS.md)

---

## 📂 Estructura del Proyecto

```
testheb-proyecto/
├── backend/                # Node.js + Express API
│   ├── src/
│   │   ├── controllers/   # Lógica de negocio
│   │   ├── routes/        # Endpoints
│   │   ├── config/        # Configuraciones
│   │   └── middleware/    # Middlewares
│   └── server.js          # Entrada principal
│
├── frontend/              # React + Vite
│   ├── src/
│   │   ├── components/   # Componentes React
│   │   ├── pages/        # Páginas
│   │   ├── context/      # Context API
│   │   └── services/     # API calls
│   └── index.html
│
└── README.md             # Documentación principal
```

---

## 🛠️ Comandos Útiles

### Backend

```bash
cd backend

# Desarrollo (con hot-reload)
npm run dev

# Producción
npm start

# Tests
npm test

# Ver logs
tail -f logs/combined.log
```

### Frontend

```bash
cd frontend

# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview de build
npm run preview

# Linter
npm run lint
```

### Base de Datos

```bash
# Conectar a PostgreSQL
psql -U postgres -d testheb_db

# Ver tablas
\dt

# Describir tabla
\d users

# Ver datos
SELECT * FROM users;

# Salir
\q
```

---

## 🐛 Solución de Problemas Comunes

### "Cannot connect to database"

```bash
# Verificar que PostgreSQL esté corriendo
sudo service postgresql status   # Linux
brew services list               # macOS

# Iniciar PostgreSQL
sudo service postgresql start    # Linux
brew services start postgresql   # macOS

# Verificar credenciales en .env
```

### "Port 3000 already in use"

```bash
# Ver qué proceso usa el puerto
lsof -i :3000        # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Matar proceso
kill -9 <PID>        # macOS/Linux

# O cambiar puerto en .env
PORT=3001
```

### "Cannot find module..."

```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### "Cloudinary upload fails"

```bash
# Verificar credenciales en .env
# Obtener credenciales correctas en:
# https://cloudinary.com/console
```

---

## 📚 Documentación Completa

### Guías Principales

- 📖 [README.md](./README.md) - Documentación completa
- 🤝 [CONTRIBUTING.md](./CONTRIBUTING.md) - Convenciones de código
- 🌿 [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md) - Estrategia de ramas
- 📝 [COMMIT_CONVENTIONS.md](./COMMIT_CONVENTIONS.md) - Convenciones de commits
- ⚙️ [.github/GITHUB_SETUP.md](./.github/GITHUB_SETUP.md) - Configurar GitHub

### Configuraciones

- 📧 [backend/EMAIL_SETUP.md](./backend/EMAIL_SETUP.md) - Configurar emails
- 🔐 [backend/.env.example](./backend/.env.example) - Variables de entorno

---

## 🎯 Próximos Pasos

Ahora que tienes todo configurado:

1. ✅ Lee [CONTRIBUTING.md](./CONTRIBUTING.md) para conocer las convenciones
2. ✅ Revisa [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md) para el flujo de trabajo
3. ✅ Explora el código en `backend/src/` y `frontend/src/`
4. ✅ Familiarízate con los endpoints en `backend/src/routes/`
5. ✅ Crea tu primera feature branch y haz un PR de prueba

---

## 💡 Tips

### Editor Recomendado: VS Code

Extensiones útiles:
- ESLint
- Prettier
- GitLens
- Tailwind CSS IntelliSense
- PostgreSQL

### Atajos de Teclado

```bash
# Abrir VS Code en directorio actual
code .

# Ver logs en tiempo real
npm run dev | grep ERROR

# Buscar en archivos
grep -r "palabra" src/
```

### Scripts Personalizados

Agrega a tu `~/.bashrc` o `~/.zshrc`:

```bash
# Alias para TESTheb
alias tbe='cd ~/path/to/testheb-proyecto/backend && npm run dev'
alias tfe='cd ~/path/to/testheb-proyecto/frontend && npm run dev'
alias tdb='psql -U postgres -d testheb_db'
```

---

## 🆘 ¿Necesitas Ayuda?

- 📧 Contacta al equipo:
  - Francisco Campos
  - Sebastian Mella

- 🐛 Reporta bugs en [GitHub Issues](https://github.com/sebamellaisla-sketch/2025_MA_CAPSTONE_705D_GRUPO_7/issues)

- 📖 Revisa la [documentación completa](./README.md)

---

**¡Listo para empezar! 🚀**

*Última actualización: Octubre 2025*
