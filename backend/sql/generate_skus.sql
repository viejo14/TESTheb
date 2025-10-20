-- Script para generar SKUs automáticos para productos existentes
-- Formato: [CATEGORIA]-[ID_PRODUCTO]-[TALLA]
-- Ejemplo: BOR-12-M (Bordados, producto 12, talla M)

-- Actualizar SKUs para todos los productos
UPDATE products
SET sku = CONCAT(
    -- Parte 1: Código de categoría (primeras 3 letras en mayúsculas, o 'GEN' si no hay)
    COALESCE(
        UPPER(SUBSTRING(c.name FROM 1 FOR 3)),
        'GEN'
    ),
    '-',
    -- Parte 2: ID del producto
    products.id,
    '-',
    -- Parte 3: Código de talla (nombre completo, o 'U' si no hay)
    COALESCE(s.name, 'U')
)
FROM categories c
LEFT JOIN sizes s ON products.size_id = s.id
WHERE products.category_id = c.id
  AND products.sku IS NULL;

-- Actualizar productos sin categoría
UPDATE products
SET sku = CONCAT('GEN-', id, '-', COALESCE(s.name, 'U'))
FROM sizes s
WHERE products.category_id IS NULL
  AND products.size_id = s.id
  AND products.sku IS NULL;

-- Actualizar productos sin categoría ni talla
UPDATE products
SET sku = CONCAT('GEN-', id, '-U')
WHERE products.category_id IS NULL
  AND products.size_id IS NULL
  AND products.sku IS NULL;

-- Verificar resultados
SELECT
    p.id,
    p.sku,
    p.name AS producto,
    c.name AS categoria,
    s.name AS talla
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN sizes s ON p.size_id = s.id
ORDER BY p.id;
