-- TABLAS

CREATE TABLE clientes (
    cliente_id INT PRIMARY KEY,
    nombre VARCHAR(100),
    ciudad VARCHAR(100),
    fecha_registro DATE
);

CREATE TABLE categorias (
    categoria_id INT PRIMARY KEY,
    nombre_categoria VARCHAR(100)
);

CREATE TABLE productos (
    producto_id INT PRIMARY KEY,
    nombre_producto VARCHAR(100),
    categoria_id INT,
    precio DECIMAL(10,2),
    FOREIGN KEY (categoria_id)
        REFERENCES categorias(categoria_id)
);

CREATE TABLE pedidos (
    pedido_id INT PRIMARY KEY,
    cliente_id INT,
    fecha_pedido DATE,
    FOREIGN KEY (cliente_id)
        REFERENCES clientes(cliente_id)
);

CREATE TABLE detalle_pedidos (
    detalle_id INT PRIMARY KEY,
    pedido_id INT,
    producto_id INT,
    cantidad INT,
    FOREIGN KEY (pedido_id)
        REFERENCES pedidos(pedido_id),
    FOREIGN KEY (producto_id)
        REFERENCES productos(producto_id)
);

-- INSERTAR DATOS

INSERT INTO clientes VALUES
(1, 'Ana', 'Madrid', '2023-01-10'),
(2, 'Luis', 'Barcelona', '2023-02-15'),
(3, 'Marta', 'Valencia', '2023-03-20'),
(4, 'Pedro', 'Madrid', '2023-04-05'),
(5, 'Sofia', 'Sevilla', '2023-05-12');

INSERT INTO categorias VALUES
(1, 'Electrónica'),
(2, 'Hogar'),
(3, 'Deportes');

INSERT INTO productos VALUES
(1, 'Laptop', 1, 1200),
(2, 'Monitor', 1, 300),
(3, 'Teclado', 1, 50),
(4, 'Silla Oficina', 2, 200),
(5, 'Lámpara', 2, 40),
(6, 'Bicicleta', 3, 800),
(7, 'Mancuernas', 3, 100);

INSERT INTO pedidos VALUES
(1, 1, '2024-01-10'),
(2, 2, '2024-01-11'),
(3, 1, '2024-01-15'),
(4, 3, '2024-02-01'),
(5, 4, '2024-02-10'),
(6, 5, '2024-02-15');

INSERT INTO detalle_pedidos VALUES
(1, 1, 1, 1),
(2, 1, 3, 2),
(3, 2, 2, 1),
(4, 2, 5, 3),
(5, 3, 6, 1),
(6, 4, 7, 4),
(7, 4, 3, 2),
(8, 5, 4, 1),
(9, 6, 1, 1),
(10, 6, 2, 2);

-- CONSULTAS

-- Detalles de pedidos con datos legibles
SELECT dp.detalle_id, c.nombre, pr.nombre_producto, dp.cantidad
from clientes c
JOIN pedidos pe
ON pe.cliente_id = c.cliente_id
JOIN detalle_pedidos dp
ON dp.pedido_id = pe.pedido_id
JOIN productos pr
ON dp.producto_id = pr.producto_id

-- Total de cada pedido
SELECT ped.pedido_id,  ped.fecha_pedido, c.nombre, Total = dp.cantidad * pro.precio
FROM pedidos ped
JOIN clientes c
ON ped.cliente_id = c.cliente_id
JOIN detalle_pedidos dp
ON dp.pedido_id = ped.pedido_id
JOIN productos pro
ON pro.producto_id = dp.producto_id

-- Total de cada cliente
SELECT c.nombre, SUM(dp.cantidad * pro.precio) as Total
FROM clientes c
JOIN pedidos ped
ON ped.cliente_id = c.cliente_id
JOIN detalle_pedidos dp
ON dp.pedido_id = ped.pedido_id
JOIN productos pro
ON pro.producto_id = dp.producto_id
GROUP BY c.nombre

-- Clientes que hayan gastado mas de 500
SELECT c.nombre, SUM(dp.cantidad * pro.precio) as Total
FROM clientes c
JOIN pedidos ped
ON ped.cliente_id = c.cliente_id
JOIN detalle_pedidos dp
ON dp.pedido_id = ped.pedido_id
JOIN productos pro
ON pro.producto_id = dp.producto_id
GROUP BY c.nombre
HAVING SUM(dp.cantidad * pro.precio)> 500

-- Cantidad de pedidos por cliente
SELECT c. nombre, COUNT(p.pedido_id) AS numero_pedidos
FROM clientes c
JOIN pedidos p
ON c.cliente_id = p.cliente_id
GROUP BY c.nombre

-- Productos mas caros que el promedio
SELECT nombre_producto, precio
FROM productos 
WHERE precio > (
  SELECT AVG(precio)
  FROM productos)
  
-- Productos no vendidos
SELECT nombre_producto
FROM productos
WHERE NOT EXISTS(
  SELECT producto_id
  FROM pedidos ped
  JOIN detalle_pedidos dp
  ON dp.pedido_id = ped.pedido_id
  WHERE dp.producto_id = productos.producto_id)
  
-- Productos por precio segun categoria
Select productos.producto_id, productos.nombre_producto, cat.nombre_categoria, productos.precio, 
RANK() OVER(
  	PARTITION BY productos.categoria_id
    ORDER BY productos.precio DESC
  	) AS posicion
FROM productos
JOIN categorias cat
ON productos.categoria_id = cat.categoria_id

-- Cantidad de productos por categoria
SELECT nombre_producto, categoria_id,
COUNT(*) OVER (PARTITION BY categoria_id) AS cantidad
FROM productos;

-- Total gastado por cliente
WITH TotalClientes AS (
    SELECT c.cliente_id, c.nombre,
           SUM(dp.cantidad * p.precio) AS total_gastado
    FROM clientes c
    JOIN pedidos ped ON ped.cliente_id = c.cliente_id
    JOIN detalle_pedidos dp ON dp.pedido_id = ped.pedido_id
    JOIN productos p ON p.producto_id = dp.producto_id
    GROUP BY c.cliente_id, c.nombre
)
SELECT nombre, total_gastado
FROM TotalClientes;
