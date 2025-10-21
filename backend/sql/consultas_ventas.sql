-- ======================================
-- CONSULTAS SQL PARA ANÁLISIS DE VENTAS
-- ======================================

-- 1. TODAS LAS VENTAS AUTORIZADAS (Exitosas)
-- Muestra todas las compras completadas exitosamente
SELECT
    id,
    buy_order AS "Orden de Compra",
    customer_name AS "Cliente",
    customer_email AS "Email",
    customer_phone AS "Teléfono",
    total AS "Total (CLP)",
    status AS "Estado",
    payment_type_code AS "Tipo de Pago",
    card_last4 AS "Últimos 4 dígitos",
    installments_number AS "Cuotas",
    authorization_code AS "Código Autorización",
    created_at AS "Fecha de Compra"
FROM orders
WHERE status IN ('authorized', 'completed', 'confirmed')
ORDER BY created_at DESC;


-- 2. RESUMEN DE VENTAS TOTALES
-- Muestra estadísticas generales de ventas
SELECT
    COUNT(*) AS "Total de Ventas",
    SUM(total) AS "Ingresos Totales (CLP)",
    AVG(total) AS "Ticket Promedio (CLP)",
    MIN(total) AS "Venta Mínima (CLP)",
    MAX(total) AS "Venta Máxima (CLP)"
FROM orders
WHERE status IN ('authorized', 'completed', 'confirmed');


-- 3. VENTAS POR DÍA
-- Agrupa las ventas por día
SELECT
    DATE(created_at) AS "Fecha",
    COUNT(*) AS "Número de Ventas",
    SUM(total) AS "Ingresos del Día (CLP)",
    AVG(total) AS "Ticket Promedio (CLP)"
FROM orders
WHERE status IN ('authorized', 'completed', 'confirmed')
GROUP BY DATE(created_at)
ORDER BY DATE(created_at) DESC;


-- 4. VENTAS POR MES
-- Agrupa las ventas por mes
SELECT
    DATE_TRUNC('month', created_at) AS "Mes",
    COUNT(*) AS "Número de Ventas",
    SUM(total) AS "Ingresos del Mes (CLP)",
    AVG(total) AS "Ticket Promedio (CLP)"
FROM orders
WHERE status IN ('authorized', 'completed', 'confirmed')
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY DATE_TRUNC('month', created_at) DESC;


-- 5. VENTAS DE HOY
-- Muestra solo las ventas de hoy
SELECT
    buy_order AS "Orden",
    customer_name AS "Cliente",
    total AS "Total (CLP)",
    TO_CHAR(created_at, 'HH24:MI:SS') AS "Hora",
    payment_type_code AS "Tipo de Pago"
FROM orders
WHERE DATE(created_at) = CURRENT_DATE
  AND status IN ('authorized', 'completed', 'confirmed')
ORDER BY created_at DESC;


-- 6. VENTAS DE ESTE MES
-- Total de ventas del mes actual
SELECT
    COUNT(*) AS "Ventas del Mes",
    SUM(total) AS "Ingresos del Mes (CLP)"
FROM orders
WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)
  AND status IN ('authorized', 'completed', 'confirmed');


-- 7. VENTAS POR MÉTODO DE PAGO
-- Agrupa por tipo de pago
SELECT
    CASE
        WHEN payment_type_code = 'VD' THEN 'Débito'
        WHEN payment_type_code = 'VP' THEN 'Prepago'
        WHEN payment_type_code = 'VN' THEN 'Crédito (sin cuotas)'
        WHEN payment_type_code = 'VC' THEN 'Crédito en cuotas'
        WHEN payment_type_code = 'SI' THEN '3 cuotas sin interés'
        WHEN payment_type_code = 'S2' THEN '2 cuotas sin interés'
        WHEN payment_type_code = 'NC' THEN 'N cuotas sin interés'
        ELSE payment_type_code
    END AS "Tipo de Pago",
    COUNT(*) AS "Número de Ventas",
    SUM(total) AS "Ingresos (CLP)",
    AVG(total) AS "Ticket Promedio (CLP)"
FROM orders
WHERE status IN ('authorized', 'completed', 'confirmed')
  AND payment_type_code IS NOT NULL
GROUP BY payment_type_code
ORDER BY COUNT(*) DESC;


-- 8. TOP 10 CLIENTES
-- Los clientes que más han comprado
SELECT
    customer_name AS "Cliente",
    customer_email AS "Email",
    COUNT(*) AS "Número de Compras",
    SUM(total) AS "Total Gastado (CLP)",
    AVG(total) AS "Ticket Promedio (CLP)"
FROM orders
WHERE status IN ('authorized', 'completed', 'confirmed')
  AND customer_email IS NOT NULL
  AND customer_email != ''
GROUP BY customer_name, customer_email
ORDER BY SUM(total) DESC
LIMIT 10;


-- 9. VENTAS DE LOS ÚLTIMOS 7 DÍAS
-- Detalle de ventas de la última semana
SELECT
    DATE(created_at) AS "Fecha",
    buy_order AS "Orden",
    customer_name AS "Cliente",
    total AS "Total (CLP)",
    payment_type_code AS "Método de Pago"
FROM orders
WHERE created_at >= NOW() - INTERVAL '7 days'
  AND status IN ('authorized', 'completed', 'confirmed')
ORDER BY created_at DESC;


-- 10. PRODUCTOS MÁS VENDIDOS
-- Extrae los productos del campo JSONB items
SELECT
    item->>'name' AS "Producto",
    item->>'sku' AS "SKU",
    SUM((item->>'quantity')::integer) AS "Cantidad Vendida",
    SUM((item->>'quantity')::integer * (item->>'price')::numeric) AS "Ingresos Totales (CLP)",
    COUNT(DISTINCT o.id) AS "Número de Órdenes"
FROM orders o,
     jsonb_array_elements(o.items) AS item
WHERE o.status IN ('authorized', 'completed', 'confirmed')
  AND o.items IS NOT NULL
GROUP BY item->>'name', item->>'sku'
ORDER BY SUM((item->>'quantity')::integer) DESC
LIMIT 20;


-- 11. TASA DE CONVERSIÓN
-- Compara órdenes creadas vs autorizadas
SELECT
    COUNT(*) AS "Total de Intentos",
    COUNT(CASE WHEN status IN ('authorized', 'completed', 'confirmed') THEN 1 END) AS "Pagos Exitosos",
    COUNT(CASE WHEN status = 'rejected' THEN 1 END) AS "Pagos Rechazados",
    COUNT(CASE WHEN status = 'aborted' THEN 1 END) AS "Pagos Cancelados",
    ROUND(
        (COUNT(CASE WHEN status IN ('authorized', 'completed', 'confirmed') THEN 1 END)::numeric /
         NULLIF(COUNT(*), 0)) * 100,
        2
    ) AS "Tasa de Conversión (%)"
FROM orders;


-- 12. VENTAS POR RANGO DE HORA
-- Identifica las horas con más ventas
SELECT
    EXTRACT(HOUR FROM created_at) AS "Hora del Día",
    COUNT(*) AS "Número de Ventas",
    SUM(total) AS "Ingresos (CLP)"
FROM orders
WHERE status IN ('authorized', 'completed', 'confirmed')
GROUP BY EXTRACT(HOUR FROM created_at)
ORDER BY "Hora del Día";


-- 13. DETALLE COMPLETO DE UNA VENTA ESPECÍFICA
-- Reemplaza 'O-XXXXXXXXX' con el número de orden que quieras consultar
SELECT
    o.id,
    o.buy_order AS "Orden de Compra",
    o.customer_name AS "Cliente",
    o.customer_email AS "Email",
    o.customer_phone AS "Teléfono",
    o.shipping_address AS "Dirección de Envío",
    o.shipping_city AS "Ciudad",
    o.total AS "Total (CLP)",
    o.status AS "Estado",
    o.payment_type_code AS "Tipo de Pago",
    o.card_last4 AS "Tarjeta",
    o.installments_number AS "Cuotas",
    o.authorization_code AS "Código de Autorización",
    o.response_code AS "Código de Respuesta",
    o.created_at AS "Fecha de Compra",
    o.items AS "Productos (JSON)"
FROM orders o
WHERE o.buy_order = 'O-XXXXXXXXX';  -- Cambia por el número de orden real


-- 14. COMPARACIÓN DE VENTAS: MES ACTUAL VS MES ANTERIOR
WITH current_month AS (
    SELECT
        COUNT(*) AS ventas_mes_actual,
        COALESCE(SUM(total), 0) AS ingresos_mes_actual
    FROM orders
    WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)
      AND status IN ('authorized', 'completed', 'confirmed')
),
previous_month AS (
    SELECT
        COUNT(*) AS ventas_mes_anterior,
        COALESCE(SUM(total), 0) AS ingresos_mes_anterior
    FROM orders
    WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
      AND created_at < DATE_TRUNC('month', CURRENT_DATE)
      AND status IN ('authorized', 'completed', 'confirmed')
)
SELECT
    cm.ventas_mes_actual AS "Ventas Mes Actual",
    cm.ingresos_mes_actual AS "Ingresos Mes Actual (CLP)",
    pm.ventas_mes_anterior AS "Ventas Mes Anterior",
    pm.ingresos_mes_anterior AS "Ingresos Mes Anterior (CLP)",
    cm.ventas_mes_actual - pm.ventas_mes_anterior AS "Diferencia en Ventas",
    cm.ingresos_mes_actual - pm.ingresos_mes_anterior AS "Diferencia en Ingresos (CLP)",
    ROUND(
        ((cm.ingresos_mes_actual - pm.ingresos_mes_anterior)::numeric /
         NULLIF(pm.ingresos_mes_anterior, 0)) * 100,
        2
    ) AS "Crecimiento (%)"
FROM current_month cm, previous_month pm;


-- 15. EXPORTAR TODAS LAS VENTAS A CSV (formato para Excel)
-- Esta consulta está lista para exportar a CSV
\copy (SELECT buy_order, customer_name, customer_email, customer_phone, shipping_address, shipping_city, total, status, payment_type_code, card_last4, installments_number, authorization_code, created_at FROM orders WHERE status IN ('authorized', 'completed', 'confirmed') ORDER BY created_at DESC) TO 'C:\Users\Francisco\testheb-proyecto\ventas_export.csv' WITH CSV HEADER DELIMITER ',';
