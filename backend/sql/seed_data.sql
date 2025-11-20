-- ========================================
-- TESTheb - Datos Iniciales (Seeds)
-- ========================================
-- Versión: 1.0
-- Fecha: 2025-01-27
--
-- Este archivo contiene los datos iniciales necesarios
-- para que la aplicación TESTheb funcione correctamente.
-- ========================================

-- ========================================
-- TALLAS (sizes)
-- ========================================
INSERT INTO sizes (name, display_name, sort_order, active) VALUES
('XS', 'Extra Small', 1, TRUE),
('S', 'Small', 2, TRUE),
('M', 'Medium', 3, TRUE),
('L', 'Large', 4, TRUE),
('XL', 'Extra Large', 5, TRUE),
('XXL', 'Double XL', 6, TRUE),
('UNICA', 'Talla Única', 7, TRUE)
ON CONFLICT (name) DO NOTHING;

-- ========================================
-- CATEGORÍAS
-- ========================================
INSERT INTO categories (name, image_url) VALUES
('Colegios', NULL),
('Empresas/Pymes', NULL),
('Mascotas', NULL),
('Diseño Personalizado', NULL),
('Deporte', NULL),
('Dia de la mamá', NULL),
('Día de San Valentín', NULL),
('Dia del papa', NULL),
('Navidad', NULL)
ON CONFLICT (name) DO NOTHING;

-- ========================================
-- USUARIO ADMINISTRADOR POR DEFECTO
-- ========================================
-- Email: admin@testheb.cl
-- Password: admin123
-- IMPORTANTE: Cambiar la contraseña en producción
INSERT INTO users (name, email, password_hash, role, active, email_verified)
VALUES (
    'Administrador TESTheb',
    'admin@testheb.cl',
    '$2b$12$LQv3c1yqBwEHxkbxdUlhre3wd7uw8zZZhq0dJ8UwuOLc5vfJ6K5Ae',
    'admin',
    TRUE,
    TRUE
)
ON CONFLICT (email) DO NOTHING;

-- ========================================
-- RESUMEN DE DATOS INSERTADOS
-- ========================================
SELECT 'Datos iniciales insertados exitosamente' AS resultado;

-- Mostrar resumen
SELECT
    'Tallas' AS tabla,
    COUNT(*) AS total
FROM sizes
UNION ALL
SELECT 'Categorías', COUNT(*) FROM categories
UNION ALL
SELECT 'Usuarios', COUNT(*) FROM users
ORDER BY tabla;
