-- Migración: Agregar sistema de tallas para productos TESTheb
-- Fecha: 2025-09-28
-- Descripción: Agrega tablas y campos necesarios para manejar tallas en productos

-- Crear tabla de tallas disponibles
CREATE TABLE IF NOT EXISTS sizes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(10) NOT NULL UNIQUE, -- XS, S, M, L, XL, XXL, etc.
  display_name VARCHAR(20) NOT NULL, -- Extra Small, Small, Medium, etc.
  sort_order INTEGER NOT NULL DEFAULT 0, -- Para ordenar las tallas
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla intermedia para productos y tallas con stock
CREATE TABLE IF NOT EXISTS product_sizes (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size_id INTEGER NOT NULL REFERENCES sizes(id) ON DELETE CASCADE,
  stock INTEGER NOT NULL DEFAULT 0,
  price_adjustment DECIMAL(10,2) DEFAULT 0, -- Ajuste de precio por talla si es necesario
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, size_id) -- Un producto no puede tener la misma talla duplicada
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_sizes_active ON sizes(active);
CREATE INDEX IF NOT EXISTS idx_sizes_sort_order ON sizes(sort_order);
CREATE INDEX IF NOT EXISTS idx_product_sizes_product_id ON product_sizes(product_id);
CREATE INDEX IF NOT EXISTS idx_product_sizes_size_id ON product_sizes(size_id);
CREATE INDEX IF NOT EXISTS idx_product_sizes_active ON product_sizes(active);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers para actualizar updated_at
DROP TRIGGER IF EXISTS update_sizes_updated_at ON sizes;
CREATE TRIGGER update_sizes_updated_at
    BEFORE UPDATE ON sizes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_product_sizes_updated_at ON product_sizes;
CREATE TRIGGER update_product_sizes_updated_at
    BEFORE UPDATE ON product_sizes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insertar tallas estándar
INSERT INTO sizes (name, display_name, sort_order) VALUES
('XS', 'Extra Small', 1),
('S', 'Small', 2),
('M', 'Medium', 3),
('L', 'Large', 4),
('XL', 'Extra Large', 5),
('XXL', 'XX Large', 6),
('XXXL', 'XXX Large', 7),
('UNICA', 'Talla Única', 8)
ON CONFLICT (name) DO NOTHING;

-- Agregar campo opcional para indicar si un producto usa tallas
ALTER TABLE products
ADD COLUMN IF NOT EXISTS uses_sizes BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS default_stock INTEGER DEFAULT 0;

-- Crear vista para obtener productos con sus tallas disponibles
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
                    'price_adjustment', 0,
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
                        'price_adjustment', ps.price_adjustment,
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

-- Función para obtener el precio total de un producto con talla
CREATE OR REPLACE FUNCTION get_product_total_price(product_id INTEGER, size_id INTEGER DEFAULT NULL)
RETURNS DECIMAL(10,2) AS $$
DECLARE
    base_price DECIMAL(10,2);
    price_adjustment DECIMAL(10,2) := 0;
    uses_sizes BOOLEAN;
BEGIN
    -- Obtener precio base y si usa tallas
    SELECT price, uses_sizes INTO base_price, uses_sizes
    FROM products
    WHERE id = product_id;

    -- Si el producto usa tallas y se especificó una talla, obtener ajuste de precio
    IF uses_sizes = true AND size_id IS NOT NULL THEN
        SELECT COALESCE(price_adjustment, 0) INTO price_adjustment
        FROM product_sizes
        WHERE product_id = get_product_total_price.product_id
        AND size_id = get_product_total_price.size_id
        AND active = true;
    END IF;

    RETURN base_price + price_adjustment;
END;
$$ LANGUAGE plpgsql;

-- Comentarios sobre las nuevas tablas
COMMENT ON TABLE sizes IS 'Tabla de tallas disponibles para productos';
COMMENT ON COLUMN sizes.name IS 'Código corto de la talla (S, M, L, etc.)';
COMMENT ON COLUMN sizes.display_name IS 'Nombre completo para mostrar al usuario';
COMMENT ON COLUMN sizes.sort_order IS 'Orden para mostrar las tallas';

COMMENT ON TABLE product_sizes IS 'Relación entre productos y tallas con stock individual';
COMMENT ON COLUMN product_sizes.stock IS 'Stock disponible para esta combinación producto-talla';
COMMENT ON COLUMN product_sizes.price_adjustment IS 'Ajuste de precio por talla (positivo o negativo)';

COMMENT ON VIEW products_with_sizes IS 'Vista que incluye productos con sus tallas y stock disponible';

-- Mostrar información de las tablas creadas
SELECT
    'sizes' as table_name,
    count(*) as total_sizes,
    count(*) FILTER (WHERE active = true) as active_sizes
FROM sizes

UNION ALL

SELECT
    'product_sizes' as table_name,
    count(*) as total_relations,
    count(*) FILTER (WHERE active = true) as active_relations
FROM product_sizes;

-- Mostrar las tallas insertadas
SELECT
    id,
    name,
    display_name,
    sort_order,
    'Talla creada' as status
FROM sizes
ORDER BY sort_order;