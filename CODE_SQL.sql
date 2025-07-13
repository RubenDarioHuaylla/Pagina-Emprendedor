-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS db_Emprendimientos;
USE db_Emprendimientos;

-- Tabla: Usuarios
CREATE TABLE Usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  apellido VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
  rol ENUM('cliente', 'emprendedor', 'admin') DEFAULT 'cliente',
  activo BOOLEAN DEFAULT TRUE
);

-- Tabla: Rubros
CREATE TABLE Rubros (
  id_rubro INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT
);

-- Tabla: Emprendimientos
CREATE TABLE Emprendimientos (
  id_emprendimiento INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_rubro INT, -- ahora es clave foránea
  nombre_negocio VARCHAR(100) NOT NULL,
  descripcion TEXT DEFAULT NULL,
  logo_url VARCHAR(255) DEFAULT NULL,
  direccion VARCHAR(255) DEFAULT NULL,
  email_contacto VARCHAR(255) DEFAULT NULL,
  telefono_contacto VARCHAR(255) DEFAULT NULL,
  facebook_url VARCHAR(255) DEFAULT NULL,
  instagram_url VARCHAR(255) DEFAULT NULL,
  whatsapp_url VARCHAR(255) DEFAULT NULL,
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  activo BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario),
  FOREIGN KEY (id_rubro) REFERENCES Rubros(id_rubro)
);

-- Tabla: Categorias
CREATE TABLE Categorias (
  id_categoria INT AUTO_INCREMENT PRIMARY KEY,
  tipo ENUM('producto', 'servicio', 'ambos') NOT NULL,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion VARCHAR(255)
);

-- Tabla: Productos_Servicios
CREATE TABLE Productos_Servicios (
  id_producto_servicio INT AUTO_INCREMENT PRIMARY KEY,
  id_emprendimiento INT NOT NULL,
  id_categoria INT NOT NULL,
  id_rubro INT,
  nombre VARCHAR(100) NOT NULL,
  descripcion_corta VARCHAR(255),
  descripcion_larga TEXT,
  precio DECIMAL(10,2),
  unidad_medida VARCHAR(50),
  imagen_url VARCHAR(255),
  fecha_publicacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  estado VARCHAR(20) NOT NULL, -- 'disponible', 'agotado', 'inactivo'
  FOREIGN KEY (id_emprendimiento) REFERENCES Emprendimientos(id_emprendimiento),
  FOREIGN KEY (id_categoria) REFERENCES Categorias(id_categoria),
  FOREIGN KEY (id_rubro) REFERENCES Rubros(id_rubro)
);

-- Tabla: Reseñas
CREATE TABLE Reseñas (
  id_comentario INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_producto_servicio INT NULL,
  id_emprendimiento INT NULL,
  valoracion TINYINT NOT NULL CHECK (valoracion BETWEEN 1 AND 5),
  comentario TEXT NULL,
  fecha_comentario DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  aprobado BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT chk_tipo_objeto CHECK (
    (id_producto_servicio IS NOT NULL AND id_emprendimiento IS NULL) OR
    (id_producto_servicio IS NULL AND id_emprendimiento IS NOT NULL)
  ),
  FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario),
  FOREIGN KEY (id_producto_servicio) REFERENCES Productos_Servicios(id_producto_servicio),
  FOREIGN KEY (id_emprendimiento) REFERENCES Emprendimientos(id_emprendimiento)
);


------------------------------------------------------------------------------------------------------------------

-- Borra los datos anteriores si es necesario para evitar duplicados al re-insertar
-- DELETE FROM Categorias;

-- Categorías que originalmente eran solo 'producto' o 'servicio'
INSERT INTO Categorias (tipo, nombre, descripcion) VALUES
('producto', 'Tecnología y Gadgets', 'Venta de equipos electrónicos, accesorios, software y componentes tecnológicos.'),
('servicio', 'Consultoría de Negocios', 'Asesoramiento en estrategia, marketing, finanzas y operaciones para empresas.'),
('producto', 'Moda y Accesorios', 'Diseño, confección y venta de ropa, joyería, bolsos y otros complementos.'),
('servicio', 'Educación y Tutorías', 'Cursos online, talleres presenciales, tutorías personalizadas y material educativo.'),
('producto', 'Hogar y Decoración', 'Venta de muebles, textiles, artículos de decoración y soluciones de organización para el hogar.'),
('servicio', 'Planificación de Eventos', 'Organización de eventos sociales como bodas y fiestas, y eventos corporativos.'),
('servicio', 'Turismo y Experiencias', 'Agencias de viajes boutique, tours locales, guías turísticos y experiencias de aventura.'),
('servicio', 'Reparación y Mantenimiento', 'Servicios técnicos para el hogar y la oficina, como plomería, electricidad y reparaciones de equipos.'),
('servicio', 'Marketing Digital', 'Gestión de redes sociales, SEO, SEM, creación de contenido y campañas de email marketing.'),
('producto', 'Artesanías y Manualidades', 'Venta de productos únicos hechos a mano, como cerámica, tejidos y carpintería.');

-- Desdoblamiento de 'Alimentos y Bebidas'
INSERT INTO Categorias (tipo, nombre, descripcion) VALUES
('producto', 'Alimentos y Bebidas (Productos)', 'Venta de productos gourmet, bebidas artesanales, ingredientes y más.'),
('servicio', 'Alimentos y Bebidas (Servicios)', 'Servicios de restaurantes, cafeterías, food trucks, catering y eventos gastronómicos.');

-- Desdoblamiento de 'Salud y Bienestar'
INSERT INTO Categorias (tipo, nombre, descripcion) VALUES
('producto', 'Salud y Bienestar (Productos)', 'Venta de productos naturales, suplementos vitamínicos, equipamiento para ejercicio y artículos de bienestar.'),
('servicio', 'Salud y Bienestar (Servicios)', 'Servicios de spa, entrenamiento personal, consultas de nutrición, clases de yoga y terapias alternativas.');

-- Desdoblamiento de 'Arte y Diseño'
INSERT INTO Categorias (tipo, nombre, descripcion) VALUES
('producto', 'Arte y Diseño (Productos)', 'Venta de obras de arte, esculturas, fotografías, ilustraciones y piezas de diseño.'),
('servicio', 'Arte y Diseño (Servicios)', 'Servicios de diseño gráfico, diseño web, diseño de interiores, ilustración por encargo y fotografía.');

-- Desdoblamiento de 'Mascotas'
INSERT INTO Categorias (tipo, nombre, descripcion) VALUES
('producto', 'Mascotas (Productos)', 'Venta de alimentos, juguetes, accesorios, ropa y productos de higiene para mascotas.'),
('servicio', 'Mascotas (Servicios)', 'Servicios de veterinaria, peluquería canina, paseo de perros, adiestramiento y guardería.');

-- Desdoblamiento de 'Belleza y Cuidado Personal'
INSERT INTO Categorias (tipo, nombre, descripcion) VALUES
('producto', 'Belleza y Cuidado Personal (Productos)', 'Venta de cosméticos, maquillaje, productos para el cuidado de la piel y el cabello.'),
('servicio', 'Belleza y Cuidado Personal (Servicios)', 'Servicios de salones de belleza, barberías, manicura, pedicura y tratamientos faciales.');

------------------------------------------------------------------------------------------------------------------


INSERT INTO Rubros (nombre, descripcion) VALUES
('Tecnología de la Información (TI)', 'Empresas dedicadas al desarrollo de software, ciberseguridad, servicios en la nube y soporte técnico.'),
('Comercio Electrónico (E-commerce)', 'Negocios cuya principal vitrina y canal de venta es una tienda online.'),
('Gastronomía', 'Emprendimientos relacionados con la preparación y venta de alimentos y bebidas, incluyendo restaurantes y catering.'),
('Moda Sostenible', 'Marcas de ropa y accesorios que utilizan materiales reciclados, orgánicos y procesos de producción éticos.'),
('Servicios Profesionales', 'Negocios que ofrecen conocimiento y servicios especializados como consultoría, contabilidad o servicios legales.'),
('EdTech (Tecnología Educativa)', 'Startups que aplican la tecnología para crear productos y servicios innovadores en el ámbito de la educación.'),
('Salud y Fitness', 'Gimnasios, centros de yoga, nutricionistas y empresas que promueven un estilo de vida activo y saludable.'),
('Industria Creativa', 'Agencias de diseño, productoras audiovisuales, estudios de fotografía y otros negocios basados en la creatividad.'),
('FinTech (Tecnología Financiera)', 'Empresas que utilizan la tecnología para ofrecer servicios financieros de forma más eficiente e innovadora.'),
('AgroTech (Tecnología Agrícola)', 'Emprendimientos que aplican tecnología para optimizar la producción agrícola y la gestión de recursos.'),
('Bienes Raíces', 'Negocios relacionados con la compra, venta, alquiler y administración de propiedades.'),
('Energías Renovables', 'Empresas enfocadas en la generación y/o instalación de soluciones de energía limpia como la solar o eólica.'),
('Logística y Última Milla', 'Servicios de almacenamiento, transporte, distribución y entrega de paquetería y mercancías.'),
('Impacto Social', 'Organizaciones y empresas que buscan generar un impacto social o medioambiental positivo a través de su actividad.'),
('Entretenimiento y Medios', 'Creación de contenido digital (podcasts, videos), organización de eventos masivos y medios de comunicación.');
