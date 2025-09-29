-- Tabla para guardar las órdenes de WebPay
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    buy_order VARCHAR(255) UNIQUE NOT NULL,
    amount INTEGER NOT NULL,
    session_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'created',
    token VARCHAR(255),
    order_data JSONB,
    result_data JSONB,
    authorization_code VARCHAR(255),
    response_code INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_orders_buy_order ON orders(buy_order);
CREATE INDEX IF NOT EXISTS idx_orders_session_id ON orders(session_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Comentarios para documentar la tabla
COMMENT ON TABLE orders IS 'Órdenes de compra procesadas con Transbank WebPay';
COMMENT ON COLUMN orders.buy_order IS 'Identificador único de la orden de compra';
COMMENT ON COLUMN orders.amount IS 'Monto en pesos chilenos (entero, sin decimales)';
COMMENT ON COLUMN orders.session_id IS 'ID de sesión único para la transacción';
COMMENT ON COLUMN orders.status IS 'Estado: created, authorized, rejected, aborted, error';
COMMENT ON COLUMN orders.token IS 'Token de transacción de WebPay';
COMMENT ON COLUMN orders.order_data IS 'Datos de la orden (carrito, cliente, etc.) en formato JSON';
COMMENT ON COLUMN orders.result_data IS 'Respuesta completa de WebPay en formato JSON';
COMMENT ON COLUMN orders.authorization_code IS 'Código de autorización del banco';
COMMENT ON COLUMN orders.response_code IS 'Código de respuesta de la transacción';