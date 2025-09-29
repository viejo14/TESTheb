-- Migración: Implementar sistema SIMPLE de tallas
-- Fecha: 2025-09-28
-- Un producto = Una talla + Un stock

-- 1. Primero asegurar que products tenga los campos necesarios
ALTER TABLE products
ADD COLUMN IF NOT EXISTS size_id INTEGER REFERENCES sizes(id),
ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;

-- 2. Eliminar campos que no necesitamos del sistema complejo
ALTER TABLE products
DROP COLUMN IF EXISTS uses_sizes,
DROP COLUMN IF EXISTS default_stock;

-- 3. Eliminar tabla product_sizes (ya no la necesitamos)
DROP TABLE IF EXISTS product_sizes CASCADE;

-- 4. Recrear vista simplificada para products
DROP VIEW IF EXISTS products_with_sizes CASCADE;

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

-- 5. Simplificar función de precio (ya no necesita tallas complejas)
DROP FUNCTION IF EXISTS get_product_total_price(INTEGER);

CREATE OR REPLACE FUNCTION get_product_total_price(product_id INTEGER)
RETURNS DECIMAL(10,2) AS $$
DECLARE
    product_price DECIMAL(10,2);
BEGIN
    SELECT price INTO product_price
    FROM products
    WHERE id = product_id;

    RETURN COALESCE(product_price, 0);
END;
$$ LANGUAGE plpgsql;

-- 6. Comentarios actualizados
COMMENT ON TABLE products IS 'Productos con sistema simple: un producto = una talla + stock';
COMMENT ON COLUMN products.size_id IS 'Talla del producto (referencia a sizes)';
COMMENT ON COLUMN products.stock IS 'Stock disponible del producto';
COMMENT ON VIEW products_simple IS 'Vista simplificada de productos con información de talla';

-- 7. Verificar estructura final
SELECT
    'ESTRUCTURA FINAL - SISTEMA SIMPLE' as status;

SELECT
    column_name as "CAMPO",
    data_type as "TIPO",
    is_nullable as "NULO",
    'SIMPLE ✅' as sistema
FROM information_schema.columns
WHERE table_name = 'products'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 8. Mostrar ejemplo de datos
SELECT
    'EJEMPLO DE DATOS' as info;

SELECT
    p.id,
    p.name,
    s.name as talla,
    p.stock,
    CASE WHEN p.stock > 0 THEN 'CON STOCK' ELSE 'SIN STOCK' END as estado
FROM products p
LEFT JOIN sizes s ON p.size_id = s.id
LIMIT 5;