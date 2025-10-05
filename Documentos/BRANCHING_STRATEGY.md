# 🌿 Estrategia de Ramas - TESTheb

Esta guía define la estrategia de branches (ramas) y el flujo de trabajo con Git para el proyecto TESTheb.

## 📋 Tabla de Contenidos
- [Estructura de Ramas](#estructura-de-ramas)
- [Flujo de Trabajo](#flujo-de-trabajo)
- [Naming Conventions](#naming-conventions)
- [Protección de Ramas](#protección-de-ramas)
- [Comandos Útiles](#comandos-útiles)

---

## 🌳 Estructura de Ramas

### Ramas Principales

```
main (protegida)
  ↓
develop
  ↓
feature/*, fix/*, hotfix/*
```

#### 1. `main` - Rama de Producción
- **Propósito**: Código en producción o listo para deploy
- **Protegida**: ✅ SÍ
- **Commits directos**: ❌ NO
- **Merges desde**: `develop`, `hotfix/*`
- **Estado**: Siempre debe funcionar correctamente

#### 2. `develop` - Rama de Desarrollo
- **Propósito**: Integración de nuevas features
- **Protegida**: ✅ SÍ (recomendado)
- **Commits directos**: ⚠️ Evitar (usar PRs)
- **Merges desde**: `feature/*`, `fix/*`
- **Estado**: Puede tener bugs menores

#### 3. `feature/*` - Nuevas Funcionalidades
- **Propósito**: Desarrollo de nuevas features
- **Creada desde**: `develop`
- **Merge a**: `develop`
- **Duración**: Temporal (se elimina después del merge)
- **Ejemplos**:
  - `feature/auth-system`
  - `feature/payment-integration`
  - `feature/admin-dashboard`

#### 4. `fix/*` - Corrección de Bugs
- **Propósito**: Arreglar bugs en `develop`
- **Creada desde**: `develop`
- **Merge a**: `develop`
- **Duración**: Temporal
- **Ejemplos**:
  - `fix/cart-total-calculation`
  - `fix/login-validation`
  - `fix/image-upload-error`

#### 5. `hotfix/*` - Correcciones Urgentes
- **Propósito**: Arreglar bugs críticos en producción
- **Creada desde**: `main`
- **Merge a**: `main` Y `develop`
- **Duración**: Temporal
- **Ejemplos**:
  - `hotfix/payment-crash`
  - `hotfix/security-vulnerability`

---

## 🔄 Flujo de Trabajo

### Diagrama General

```
main  ────────●─────────────●──────────────●──────────→
              ↑             ↑              ↑
develop ──●───┴───●───●─────┴──●───●───────┴──●───────→
          ↑       ↑   ↑        ↑   ↑          ↑
feature/  └───●───┘   │        │   │          │
fix/                  └────●───┘   │          │
hotfix/                             └──────────┘
```

### 1. Trabajar en una Nueva Feature

```bash
# 1. Asegurarse de estar en develop y actualizada
git checkout develop
git pull origin develop

# 2. Crear rama feature
git checkout -b feature/nombre-descriptivo

# 3. Hacer commits siguiendo convenciones
git add .
git commit -m "feat: agregar autenticación JWT"

# 4. Subir cambios
git push origin feature/nombre-descriptivo

# 5. Crear Pull Request en GitHub
# develop ← feature/nombre-descriptivo
```

### 2. Arreglar un Bug en Desarrollo

```bash
# 1. Desde develop
git checkout develop
git pull origin develop

# 2. Crear rama fix
git checkout -b fix/descripcion-del-bug

# 3. Hacer commits
git commit -m "fix: corregir cálculo de total en carrito"

# 4. Subir y crear PR
git push origin fix/descripcion-del-bug
```

### 3. Hotfix en Producción (Emergencia)

```bash
# 1. Desde main
git checkout main
git pull origin main

# 2. Crear rama hotfix
git checkout -b hotfix/descripcion-urgente

# 3. Hacer el fix
git commit -m "hotfix: corregir fallo de pago en WebPay"

# 4. Subir y crear PRs
git push origin hotfix/descripcion-urgente

# 5. Crear 2 PRs:
#    - main ← hotfix/descripcion-urgente
#    - develop ← hotfix/descripcion-urgente
```

### 4. Release a Producción

```bash
# 1. Asegurarse que develop está listo
git checkout develop
git pull origin develop

# 2. Crear PR: main ← develop
# 3. Hacer code review
# 4. Hacer merge (con squash opcional)
# 5. Taggear versión en main

git checkout main
git pull origin main
git tag -a v1.0.0 -m "Release v1.0.0 - Sistema de autenticación"
git push origin v1.0.0
```

---

## 📝 Naming Conventions

### Formato de Nombres de Ramas

```
tipo/descripcion-breve-en-kebab-case
```

### Tipos de Ramas

| Tipo      | Descripción                      | Ejemplo                          |
|-----------|----------------------------------|----------------------------------|
| `feature` | Nueva funcionalidad              | `feature/user-registration`      |
| `fix`     | Corrección de bug                | `fix/cart-total-error`           |
| `hotfix`  | Corrección urgente en producción | `hotfix/payment-crash`           |
| `refactor`| Refactorización sin cambios      | `refactor/clean-auth-controller` |
| `docs`    | Solo documentación               | `docs/update-readme`             |
| `test`    | Agregar tests                    | `test/add-product-tests`         |
| `chore`   | Tareas de mantenimiento          | `chore/update-dependencies`      |

### ✅ Buenos Nombres

```
feature/jwt-authentication
feature/admin-dashboard
fix/login-validation-error
fix/product-image-upload
hotfix/webpay-integration
refactor/cleanup-product-controller
docs/api-documentation
test/auth-endpoints
```

### ❌ Malos Nombres

```
feature/stuff           # Muy genérico
fix/bug                 # No descriptivo
my-branch               # Sin tipo
Feature/Auth            # Tipo con mayúscula
feature_auth_system     # Usar - no _
feature/AUTH-SYSTEM     # No usar MAYÚSCULAS
```

---

## 🔒 Protección de Ramas

### Configuración en GitHub (Recomendado)

#### Para `main`:

1. Ir a: **Settings → Branches → Branch protection rules**
2. Agregar regla para `main`:
   - ✅ Require pull request before merging
   - ✅ Require approvals (1 mínimo)
   - ✅ Dismiss stale reviews when new commits are pushed
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Include administrators (opcional)

#### Para `develop`:

1. Agregar regla para `develop`:
   - ✅ Require pull request before merging
   - ✅ Require approvals (1 mínimo)
   - ⚠️ Menos restrictivo que `main`

### Alternativa: Hook Local

Si no tienes permisos de administrador en GitHub, puedes crear un hook local:

```bash
# En la raíz del proyecto
mkdir -p .git/hooks

# Crear archivo .git/hooks/pre-push
cat > .git/hooks/pre-push << 'EOF'
#!/bin/bash

current_branch=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')

if [ "$current_branch" = "main" ]; then
    echo "❌ ERROR: No puedes hacer push directo a main."
    echo "ℹ️  Usa Pull Requests en GitHub."
    exit 1
fi

exit 0
EOF

# Dar permisos de ejecución
chmod +x .git/hooks/pre-push
```

---

## 🛠️ Comandos Útiles

### Ver todas las ramas

```bash
# Ramas locales
git branch

# Ramas remotas
git branch -r

# Todas las ramas
git branch -a
```

### Actualizar desde develop

```bash
# Estando en tu feature branch
git checkout develop
git pull origin develop
git checkout feature/mi-feature
git merge develop

# O usando rebase (preferido)
git checkout feature/mi-feature
git rebase develop
```

### Eliminar ramas

```bash
# Eliminar rama local (después del merge)
git branch -d feature/mi-feature

# Eliminar rama remota
git push origin --delete feature/mi-feature

# Limpiar ramas remotas eliminadas
git fetch --prune
```

### Ver diferencias entre ramas

```bash
# Comparar con develop
git diff develop

# Comparar con main
git diff main

# Ver commits que están en feature pero no en develop
git log develop..feature/mi-feature
```

### Sincronizar fork (si aplica)

```bash
# Agregar upstream (una sola vez)
git remote add upstream https://github.com/sebamellaisla-sketch/2025_MA_CAPSTONE_705D_GRUPO_7.git

# Actualizar desde upstream
git fetch upstream
git checkout develop
git merge upstream/develop
git push origin develop
```

---

## 🎯 Buenas Prácticas

### ✅ HACER

- **Crear rama nueva** para cada feature/fix
- **Commits pequeños** y frecuentes
- **Pull antes de push** para evitar conflictos
- **Actualizar desde develop** regularmente
- **Eliminar ramas** después del merge
- **Code review** antes de mergear a develop/main
- **Tests pasando** antes de crear PR
- **Squash commits** si tienes muchos commits pequeños

### ❌ NO HACER

- ❌ Commits directos a `main`
- ❌ Ramas de larga duración (más de 1 semana)
- ❌ Mezclar múltiples features en una rama
- ❌ Force push a ramas compartidas
- ❌ Merge sin code review
- ❌ Dejar ramas huérfanas sin eliminar

---

## 🚨 Resolución de Conflictos

### Conflicto al hacer merge de develop

```bash
# 1. Actualizar develop
git checkout develop
git pull origin develop

# 2. Volver a tu rama
git checkout feature/mi-feature

# 3. Merge develop (tendrás conflictos)
git merge develop

# 4. Resolver conflictos en VS Code o manualmente
# Busca marcadores: <<<<<<< HEAD, =======, >>>>>>>

# 5. Después de resolver
git add .
git commit -m "merge: resolve conflicts with develop"
git push origin feature/mi-feature
```

---

## 📊 Ejemplo Práctico Completo

### Desarrollar Sistema de Autenticación

```bash
# 1. Preparación
git checkout develop
git pull origin develop

# 2. Crear rama
git checkout -b feature/auth-system

# 3. Trabajar (varios commits)
git commit -m "feat: add user model"
git commit -m "feat: add login endpoint"
git commit -m "feat: add JWT middleware"
git commit -m "test: add auth tests"

# 4. Subir cambios
git push origin feature/auth-system

# 5. En GitHub: Crear PR
# Título: "feat: Sistema de Autenticación JWT"
# Base: develop ← Compare: feature/auth-system

# 6. Code Review → Aprobado

# 7. Merge en GitHub (Squash and merge recomendado)

# 8. Limpieza local
git checkout develop
git pull origin develop
git branch -d feature/auth-system
git push origin --delete feature/auth-system
```

---

## 📞 ¿Dudas?

Contacta al equipo:
- Francisco Campos
- Sebastian Mella

**Última actualización:** Octubre 2025
