-- Agregar campo stock a la tabla products si no existe
DO $$
BEGIN
    -- Verificar si la columna stock existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'products' AND column_name = 'stock'
    ) THEN
        -- Agregar la columna stock
        ALTER TABLE products ADD COLUMN stock INTEGER DEFAULT 0;

        -- Agregar comentario a la columna
        COMMENT ON COLUMN products.stock IS 'Stock disponible del producto';

        -- Actualizar productos existentes con stock inicial
        UPDATE products SET stock = 10 WHERE stock = 0 OR stock IS NULL;

        RAISE NOTICE 'Campo stock agregado a la tabla products';
    ELSE
        RAISE NOTICE 'Campo stock ya existe en la tabla products';
    END IF;
END $$;

-- Verificar la estructura actualizada
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'products' AND column_name = 'stock';