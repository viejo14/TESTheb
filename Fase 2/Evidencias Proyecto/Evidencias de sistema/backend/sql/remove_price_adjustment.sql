-- Migración: Eliminar sistema de ajuste de precios por talla
-- Fecha: 2025-09-28
-- Descripción: Simplifica el sistema eliminando price_adjustment para código limpio

-- 1. Eliminar columna price_adjustment de product_sizes
ALTER TABLE product_sizes
DROP COLUMN IF EXISTS price_adjustment;

-- 2. Recrear la vista products_with_sizes sin price_adjustment
DROP VIEW IF EXISTS products_with_sizes;

CREATE OR REPLACE VIEW products_with_sizes AS
SELECT
    p.*,
    c.name as category_name,
    CASE
        WHEN p.uses_sizes = false THEN
            json_build_array(
                json_build_object(
                    'id', null,
                    'name', 'UNICA',
                    'display_name', 'Talla Única',
                    'stock', COALESCE(p.default_stock, 0),
                    'available', COALESCE(p.default_stock, 0) > 0
                )
            )
        ELSE
            COALESCE(
                json_agg(
                    json_build_object(
                        'id', ps.id,
                        'size_id', s.id,
                        'name', s.name,
                        'display_name', s.display_name,
                        'sort_order', s.sort_order,
                        'stock', ps.stock,
                        'available', ps.active AND ps.stock > 0
                    )
                    ORDER BY s.sort_order
                ) FILTER (WHERE ps.active = true),
                '[]'::json
            )
    END as sizes,
    CASE
        WHEN p.uses_sizes = false THEN COALESCE(p.default_stock, 0) > 0
        ELSE COALESCE(SUM(CASE WHEN ps.active THEN ps.stock ELSE 0 END), 0) > 0
    END as has_stock,
    CASE
        WHEN p.uses_sizes = false THEN COALESCE(p.default_stock, 0)
        ELSE COALESCE(SUM(CASE WHEN ps.active THEN ps.stock ELSE 0 END), 0)
    END as total_stock
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN product_sizes ps ON p.id = ps.product_id AND ps.active = true
LEFT JOIN sizes s ON ps.size_id = s.id AND s.active = true
GROUP BY p.id, c.name
ORDER BY p.id;

-- 3. Simplificar función de precio total (ya no necesita ajustes)
DROP FUNCTION IF EXISTS get_product_total_price(INTEGER, INTEGER);

CREATE OR REPLACE FUNCTION get_product_total_price(product_id INTEGER)
RETURNS DECIMAL(10,2) AS $$
DECLARE
    base_price DECIMAL(10,2);
BEGIN
    -- Obtener precio base del producto
    SELECT price INTO base_price
    FROM products
    WHERE id = product_id;

    -- Retornar precio base (sin ajustes por talla)
    RETURN COALESCE(base_price, 0);
END;
$$ LANGUAGE plpgsql;

-- 4. Actualizar comentarios
COMMENT ON TABLE product_sizes IS 'Relación entre productos y tallas con stock individual (precio único por producto)';
COMMENT ON VIEW products_with_sizes IS 'Vista que incluye productos con sus tallas y stock disponible (precio único)';
COMMENT ON FUNCTION get_product_total_price(INTEGER) IS 'Obtiene el precio del producto (precio único, sin ajustes por talla)';

-- 5. Mostrar resumen de cambios
SELECT
    'price_adjustment eliminado' as change,
    'Código más limpio y simple' as benefit;

-- 6. Verificar estructura final de product_sizes
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'product_sizes'
AND table_schema = 'public'
ORDER BY ordinal_position;