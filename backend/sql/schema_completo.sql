-- ========================================
-- TESTheb - Esquema Completo de Base de Datos
-- ========================================
-- Versión: 1.0
-- Fecha: 2025-01-27
-- Base de datos: PostgreSQL 16
--
-- Este archivo contiene el esquema completo para crear
-- la base de datos TESTheb desde cero.
-- ========================================

-- ========================================
-- FUNCIONES
-- ========================================

-- Función para actualizar automáticamente el campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener el precio total de un producto
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

-- ========================================
-- TABLA: categories
-- ========================================
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    image_url TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_name ON categories(name);

COMMENT ON TABLE categories IS 'Categorías de productos (Colegios, Empresas, Deportes, etc.)';

-- ========================================
-- TABLA: sizes (tallas)
-- ========================================
CREATE TABLE sizes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(10) NOT NULL UNIQUE,
    display_name VARCHAR(50) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sizes_active ON sizes(active);
CREATE INDEX idx_sizes_sort_order ON sizes(sort_order);

-- Trigger para actualizar updated_at
CREATE TRIGGER update_sizes_updated_at
    BEFORE UPDATE ON sizes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE sizes IS 'Tallas disponibles para productos';

-- ========================================
-- TABLA: products
-- ========================================
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    sku VARCHAR(50) UNIQUE,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    size_id INTEGER REFERENCES sizes(id) ON DELETE SET NULL,
    image_url TEXT,
    stock INTEGER DEFAULT 0,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_size_id ON products(size_id);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_stock ON products(stock);

COMMENT ON TABLE products IS 'Productos disponibles en la tienda';
COMMENT ON COLUMN products.sku IS 'Código único del producto (generado automáticamente)';
COMMENT ON COLUMN products.stock IS 'Stock disponible del producto';

-- ========================================
-- TABLA: product_images
-- ========================================
CREATE TABLE product_images (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_primary ON product_images(product_id, is_primary);

COMMENT ON TABLE product_images IS 'Múltiples imágenes por producto (máximo 4)';
COMMENT ON COLUMN product_images.is_primary IS 'Indica si es la imagen principal del producto';

-- ========================================
-- TABLA: users
-- ========================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'employee')),
    active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP WITH TIME ZONE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(active);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Trigger para actualizar updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE users IS 'Usuarios del sistema TESTheb';
COMMENT ON COLUMN users.role IS 'Rol del usuario: customer, admin, employee';

-- ========================================
-- TABLA: orders (órdenes de compra WebPay)
-- ========================================
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    buy_order VARCHAR(255) UNIQUE NOT NULL,
    amount INTEGER NOT NULL,
    session_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'created',
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    token VARCHAR(255),
    order_data JSONB,
    result_data JSONB,
    authorization_code VARCHAR(255),
    response_code INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_orders_buy_order ON orders(buy_order);
CREATE INDEX idx_orders_session_id ON orders(session_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_created_at ON orders(created_at);

COMMENT ON TABLE orders IS 'Órdenes de compra procesadas con Transbank WebPay';
COMMENT ON COLUMN orders.status IS 'Estado: created, authorized, rejected, aborted, error';

-- ========================================
-- TABLA: order_items (items de cada orden)
-- ========================================
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(50),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

COMMENT ON TABLE order_items IS 'Items individuales de cada orden de compra';

-- ========================================
-- TABLA: quotes (cotizaciones)
-- ========================================
CREATE TABLE quotes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    client_phone VARCHAR(50),
    product_type VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL,
    description TEXT,
    image_url TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_process', 'completed', 'cancelled')),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_user_id ON quotes(user_id);
CREATE INDEX idx_quotes_client_email ON quotes(client_email);
CREATE INDEX idx_quotes_created_at ON quotes(created_at);

COMMENT ON TABLE quotes IS 'Solicitudes de cotización de clientes';
COMMENT ON COLUMN quotes.status IS 'Estado: pending, in_process, completed, cancelled';
COMMENT ON COLUMN quotes.image_url IS 'URL de imagen de referencia para la cotización';

-- ========================================
-- TABLA: newsletter_subscribers
-- ========================================
CREATE TABLE newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
    subscribed_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP WITHOUT TIME ZONE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_status ON newsletter_subscribers(status);

COMMENT ON TABLE newsletter_subscribers IS 'Suscriptores del newsletter';

-- ========================================
-- VISTA: products_simple
-- ========================================
CREATE OR REPLACE VIEW products_simple AS
SELECT
    p.id,
    p.name,
    p.description,
    p.price,
    p.sku,
    p.image_url,
    p.category_id,
    p.size_id,
    p.stock,
    p.created_at,
    p.updated_at,
    c.name AS category_name,
    s.name AS size_name,
    s.display_name AS size_display_name,
    CASE
        WHEN p.stock > 0 THEN TRUE
        ELSE FALSE
    END AS has_stock
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN sizes s ON p.size_id = s.id
ORDER BY p.id;

COMMENT ON VIEW products_simple IS 'Vista simplificada de productos con información de categoría y talla';

-- ========================================
-- FIN DEL ESQUEMA
-- ========================================

-- Mensaje de confirmación
SELECT 'Esquema de base de datos TESTheb creado exitosamente' AS resultado;
