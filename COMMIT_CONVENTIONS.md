# 📝 Convenciones de Commits - TESTheb

Esta guía define las convenciones para escribir mensajes de commit claros y consistentes, basadas en [Conventional Commits](https://www.conventionalcommits.org/).

## 📋 Tabla de Contenidos
- [Formato General](#formato-general)
- [Tipos de Commits](#tipos-de-commits)
- [Scopes (Ámbitos)](#scopes-ámbitos)
- [Ejemplos Completos](#ejemplos-completos)
- [Reglas y Buenas Prácticas](#reglas-y-buenas-prácticas)

---

## 📐 Formato General

```
<tipo>[scope opcional]: <descripción>

[cuerpo opcional]

[footer(s) opcional(es)]
```

### Estructura Básica (Mínima)

```
tipo: descripción breve en minúscula
```

**Ejemplos:**
```
feat: agregar sistema de autenticación
fix: corregir cálculo de total en carrito
docs: actualizar README con instrucciones de deploy
```

### Estructura Completa (Opcional)

```
tipo(scope): descripción breve (máx 72 caracteres)

Descripción detallada del cambio. Explicar el QUÉ y el POR QUÉ,
no el CÓMO (eso está en el código).

Puede tener múltiples párrafos.

BREAKING CHANGE: descripción del cambio que rompe compatibilidad
Fixes #123
Closes #456
```

---

## 🏷️ Tipos de Commits

### Tipos Principales

| Tipo         | Descripción                                  | Ejemplo                                |
|--------------|----------------------------------------------|----------------------------------------|
| `feat`       | Nueva funcionalidad                          | `feat: agregar login con Google`       |
| `fix`        | Corrección de bug                            | `fix: resolver error en validación`    |
| `docs`       | Solo documentación                           | `docs: actualizar API docs`            |
| `style`      | Formateo, espacios, sin cambios de lógica    | `style: formatear código con prettier` |
| `refactor`   | Refactorización sin cambios de funcionalidad | `refactor: simplificar authController` |
| `test`       | Agregar o modificar tests                    | `test: agregar tests de autenticación` |
| `chore`      | Tareas de mantenimiento, configs             | `chore: actualizar dependencias`       |
| `perf`       | Mejoras de performance                       | `perf: optimizar query de productos`   |
| `build`      | Cambios en build system o dependencias       | `build: actualizar webpack config`     |
| `ci`         | Cambios en CI/CD                             | `ci: agregar GitHub Actions workflow`  |
| `revert`     | Revertir un commit anterior                  | `revert: revert commit abc123`         |

### Descripción Detallada

#### `feat` - Nueva Funcionalidad

Agregar una nueva característica o funcionalidad al sistema.

```bash
feat: agregar recuperación de contraseña por email
feat: implementar filtros en catálogo de productos
feat: agregar panel de estadísticas en admin
```

#### `fix` - Corrección de Bugs

Arreglar un bug o error en el código existente.

```bash
fix: corregir cálculo de IVA en checkout
fix: resolver error 500 al subir imágenes
fix: arreglar redirección después de login
```

#### `docs` - Documentación

Cambios solo en documentación (README, comentarios, etc.).

```bash
docs: agregar guía de instalación local
docs: actualizar convenciones de commits
docs: documentar endpoints de API de productos
```

#### `style` - Estilo de Código

Cambios que no afectan la lógica (espacios, formateo, punto y coma).

```bash
style: formatear código con ESLint
style: corregir indentación en productController
style: remover espacios en blanco innecesarios
```

#### `refactor` - Refactorización

Cambios en código que no arreglan bugs ni agregan features.

```bash
refactor: simplificar lógica de validación de email
refactor: extraer función de cálculo de total
refactor: renombrar variables para mejor claridad
```

#### `test` - Tests

Agregar, modificar o arreglar tests.

```bash
test: agregar tests unitarios para authController
test: completar cobertura de productService
test: arreglar tests de integración de WebPay
```

#### `chore` - Tareas de Mantenimiento

Actualizaciones que no modifican src/ o test/.

```bash
chore: actualizar dependencias de npm
chore: agregar .gitignore para archivos de IDE
chore: configurar variables de entorno
```

#### `perf` - Performance

Cambios que mejoran el rendimiento.

```bash
perf: optimizar query de productos con índices
perf: implementar lazy loading de imágenes
perf: agregar caché de categorías en memoria
```

---

## 🎯 Scopes (Ámbitos)

Los scopes indican qué parte del código fue modificada.

### Scopes del Backend

```bash
feat(auth): agregar middleware de autorización
fix(products): corregir validación de stock
refactor(database): simplificar pool de conexiones
test(payments): agregar tests de WebPay
```

**Scopes comunes:**
- `auth` - Autenticación y autorización
- `products` - Sistema de productos
- `categories` - Gestión de categorías
- `users` - Gestión de usuarios
- `payments` - Sistema de pagos
- `email` - Servicio de emails
- `database` - Base de datos
- `api` - API general

### Scopes del Frontend

```bash
feat(cart): agregar funcionalidad de cupones de descuento
fix(checkout): resolver error en formulario de pago
style(ui): mejorar responsive en móviles
test(components): agregar tests de ProductCard
```

**Scopes comunes:**
- `cart` - Carrito de compras
- `checkout` - Proceso de checkout
- `catalog` - Catálogo de productos
- `admin` - Panel administrativo
- `ui` - Interfaz de usuario
- `components` - Componentes React
- `pages` - Páginas principales
- `context` - Context API

### Scope Global

Si el cambio afecta todo el proyecto:

```bash
chore(deps): actualizar todas las dependencias
docs(readme): actualizar guía completa del proyecto
```

---

## 💡 Ejemplos Completos

### Ejemplo 1: Feature Simple

```bash
feat: agregar búsqueda de productos por nombre

# Comando:
git commit -m "feat: agregar búsqueda de productos por nombre"
```

### Ejemplo 2: Feature con Scope

```bash
feat(catalog): agregar filtro por rango de precios

# Comando:
git commit -m "feat(catalog): agregar filtro por rango de precios"
```

### Ejemplo 3: Fix con Descripción Detallada

```bash
fix(checkout): corregir cálculo de total con descuentos

El total no consideraba correctamente los descuentos cuando
había múltiples productos en el carrito. Ahora se aplica
el descuento correctamente antes de calcular el IVA.

Fixes #234
```

**Comando:**
```bash
git commit -m "fix(checkout): corregir cálculo de total con descuentos" \
-m "El total no consideraba correctamente los descuentos cuando había múltiples productos en el carrito." \
-m "Fixes #234"
```

### Ejemplo 4: Breaking Change

```bash
feat(auth)!: cambiar estructura de JWT tokens

BREAKING CHANGE: Los tokens JWT ahora incluyen el campo 'permissions'
en lugar de solo 'role'. Los clientes deben actualizar su lógica
de autorización.

Migración:
- Antes: token.role === 'admin'
- Ahora: token.permissions.includes('admin')
```

**Comando:**
```bash
git commit -m "feat(auth)!: cambiar estructura de JWT tokens" \
-m "BREAKING CHANGE: Los tokens JWT ahora incluyen 'permissions'" \
-m "Ver commit message para migración"
```

### Ejemplo 5: Múltiples Cambios Relacionados

```bash
feat(products): sistema completo de tallas

- Agregar tabla 'sizes' en base de datos
- Crear endpoints CRUD para tallas
- Implementar selector de tallas en frontend
- Actualizar lógica de stock por talla

Closes #145, #167, #189
```

---

## ✅ Reglas y Buenas Prácticas

### ✅ HACER

#### 1. Usar Presente Imperativo

```bash
# ✅ CORRECTO
feat: agregar validación de email
fix: corregir error en login

# ❌ INCORRECTO
feat: agregado validación de email    # Pasado
feat: agregando validación de email   # Gerundio
fix: corrige error en login           # Presente simple
```

#### 2. Primera Letra en Minúscula

```bash
# ✅ CORRECTO
feat: agregar sistema de notificaciones

# ❌ INCORRECTO
feat: Agregar sistema de notificaciones
Feat: agregar sistema de notificaciones
```

#### 3. Sin Punto Final

```bash
# ✅ CORRECTO
fix: resolver error de validación

# ❌ INCORRECTO
fix: resolver error de validación.
```

#### 4. Máximo 72 Caracteres en Título

```bash
# ✅ CORRECTO (50 caracteres)
feat: agregar paginación en catálogo de productos

# ❌ INCORRECTO (más de 72)
feat: agregar sistema de paginación en catálogo de productos que permite navegar entre páginas
```

#### 5. Descripción Clara y Específica

```bash
# ✅ CORRECTO
fix(auth): corregir validación de contraseña en registro
feat(cart): agregar botón para vaciar carrito completo
refactor(api): extraer lógica de validación a middleware

# ❌ INCORRECTO
fix: arreglar bug           # ¿Qué bug?
feat: agregar cosa          # ¿Qué cosa?
update: cambios             # Muy genérico
```

#### 6. Un Commit por Cambio Lógico

```bash
# ✅ CORRECTO - Commits separados
git commit -m "feat(products): agregar campo de stock"
git commit -m "test(products): agregar tests de stock"

# ❌ INCORRECTO - Múltiples cambios no relacionados
git commit -m "feat: agregar stock, arreglar login y actualizar docs"
```

### ❌ NO HACER

```bash
# ❌ Mensajes genéricos
git commit -m "fix stuff"
git commit -m "wip"
git commit -m "changes"
git commit -m "update"

# ❌ Sin tipo
git commit -m "agregar login"
git commit -m "arreglar bug"

# ❌ Tipo incorrecto
git commit -m "feature: agregar tests"  # Debe ser 'test:'
git commit -m "bugfix: corregir error"  # Debe ser 'fix:'

# ❌ Mayúsculas incorrectas
git commit -m "FEAT: AGREGAR LOGIN"
git commit -m "Fix: Corregir Error"
```

---

## 🔗 Referenciar Issues

### Cerrar Issues Automáticamente

```bash
# Cerrar un issue
fix: corregir error de autenticación

Fixes #123
Closes #456
Resolves #789
```

### Referenciar sin Cerrar

```bash
# Solo mencionar
feat: agregar sistema de notificaciones

Ver #234 para más detalles
Relacionado con #456
```

**Keywords que cierran issues:**
- `Fixes #123`
- `Closes #123`
- `Resolves #123`
- `Fix #123`
- `Close #123`
- `Resolve #123`

---

## 🛠️ Configurar Git para Commits

### Template de Commit

Crear archivo `.gitmessage`:

```bash
# Crear template
cat > ~/.gitmessage << 'EOF'
# <tipo>[scope opcional]: <descripción>
#
# [cuerpo opcional]
#
# [footer(s) opcional(es)]
#
# Tipos: feat, fix, docs, style, refactor, test, chore, perf
# Scope: auth, products, cart, checkout, etc.
# Descripción: máximo 72 caracteres, presente imperativo, minúscula
# Cuerpo: explicar QUÉ y POR QUÉ, no CÓMO
# Footer: Fixes #123, BREAKING CHANGE, etc.
EOF

# Configurar Git para usar el template
git config --global commit.template ~/.gitmessage
```

Ahora al hacer `git commit` (sin `-m`), se abrirá el editor con el template.

### Hooks para Validación

Crear `.git/hooks/commit-msg`:

```bash
#!/bin/bash

commit_regex='^(feat|fix|docs|style|refactor|test|chore|perf|build|ci|revert)(\(.+\))?: .{1,72}'

if ! grep -qE "$commit_regex" "$1"; then
    echo "❌ ERROR: Mensaje de commit inválido"
    echo ""
    echo "Formato: <tipo>[scope]: <descripción>"
    echo "Ejemplo: feat(auth): agregar login con JWT"
    echo ""
    echo "Tipos válidos: feat, fix, docs, style, refactor, test, chore, perf"
    exit 1
fi
```

```bash
chmod +x .git/hooks/commit-msg
```

---

## 📊 Ejemplos del Proyecto TESTheb

### Backend

```bash
feat(auth): implementar sistema de autenticación JWT
fix(products): corregir query de productos por categoría
refactor(database): simplificar configuración de pool
test(payments): agregar tests de integración WebPay
chore(deps): actualizar transbank-sdk a v6.1.0
perf(api): agregar índices en tabla de productos
docs(api): documentar endpoints de autenticación
```

### Frontend

```bash
feat(cart): agregar persistencia con localStorage
fix(checkout): resolver error en formulario de pago
style(ui): mejorar responsive en móviles
refactor(components): extraer lógica de ProductCard
test(pages): agregar tests de HomePage
chore(config): configurar Tailwind para producción
perf(images): implementar lazy loading de imágenes
```

### Full Stack

```bash
feat: sistema completo de recuperación de contraseña
fix: resolver problema de CORS en producción
docs: actualizar README con guía de despliegue
chore: configurar variables de entorno para producción
```

---

## 📞 ¿Dudas?

Contacta al equipo:
- Francisco Campos
- Sebastian Mella

**Referencias:**
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Angular Commit Guidelines](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)

**Última actualización:** Octubre 2025
