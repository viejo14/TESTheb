-- Migración: Limpiar y migrar datos al sistema simple
-- Fecha: 2025-09-28

-- 1. Eliminar campos legacy con CASCADE
DROP VIEW IF EXISTS products_with_sizes CASCADE;

ALTER TABLE products
DROP COLUMN IF EXISTS uses_sizes CASCADE,
DROP COLUMN IF EXISTS default_stock CASCADE;

-- 2. Asegurar que tenemos los campos correctos
ALTER TABLE products
ADD COLUMN IF NOT EXISTS size_id INTEGER REFERENCES sizes(id),
ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;

-- 3. Migrar productos existentes sin talla a "ÚNICA"
-- Primero, obtener el ID de talla "ÚNICA"
UPDATE products
SET size_id = (SELECT id FROM sizes WHERE name = 'UNICA' LIMIT 1)
WHERE size_id IS NULL;

-- 4. Para productos que fueron creados recientemente, asignar stock básico
-- (Esto es para que no aparezcan sin stock)
UPDATE products
SET stock = 5  -- Stock básico de 5 unidades
WHERE stock = 0 OR stock IS NULL;

-- 5. Recrear vista limpia
CREATE OR REPLACE VIEW products_simple AS
SELECT
    p.id,
    p.name,
    p.description,
    p.price,
    p.image_url,
    p.category_id,
    p.size_id,
    p.stock,
    p.created_at,
    p.updated_at,
    c.name as category_name,
    s.name as size_name,
    s.display_name as size_display_name,
    CASE
        WHEN p.stock > 0 THEN true
        ELSE false
    END as has_stock
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN sizes s ON p.size_id = s.id
ORDER BY p.id;

-- 6. Verificar migración
SELECT
    'PRODUCTOS MIGRADOS AL SISTEMA SIMPLE' as status;

SELECT
    p.id,
    p.name,
    s.name as talla,
    p.stock,
    CASE
        WHEN p.stock > 0 THEN '✅ CON STOCK'
        ELSE '❌ SIN STOCK'
    END as estado
FROM products p
LEFT JOIN sizes s ON p.size_id = s.id
ORDER BY p.id;

-- 7. Verificar estructura final limpia
SELECT
    'ESTRUCTURA FINAL LIMPIA' as info;

SELECT
    column_name as "CAMPO",
    data_type as "TIPO",
    is_nullable as "NULO"
FROM information_schema.columns
WHERE table_name = 'products'
AND table_schema = 'public'
AND column_name NOT IN ('uses_sizes', 'default_stock')  -- Verificar que no existan
ORDER BY ordinal_position;

-- 8. Comentarios finales
COMMENT ON TABLE products IS 'Productos con sistema simple: un producto = una talla + stock';
COMMENT ON COLUMN products.size_id IS 'Talla del producto (referencia a sizes)';
COMMENT ON COLUMN products.stock IS 'Stock disponible del producto';

SELECT 'MIGRACIÓN COMPLETADA - SISTEMA SIMPLE ACTIVO' as resultado;