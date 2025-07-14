const pool = require('../config/db');
const { actualizar, buscarPorId } = require('./emprendimiento.model');

const Producto_Servicio = {
  // Registrar un nuevo usuario
  crear: async ({ 
    id_emprendimiento,
    id_categoria,
    nombre,
    descripcion_corta = null,
    descripcion_larga = null,
    precio = null,
    unidad_medida = null,
    imagen_url = null,
    estado = 'activo' 
  }) => {
    const [result] = await pool.query(
      `INSERT INTO Productos_Servicios (
        id_emprendimiento, id_categoria, nombre, descripcion_corta,
        descripcion_larga, precio, unidad_medida, imagen_url, estado
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)`,
      [
        id_emprendimiento, id_categoria, nombre, descripcion_corta,
        descripcion_larga, precio, unidad_medida, imagen_url,estado
      ]
    );
    return result.insertId;
  },

  actualizar: async (id, datos) => {
    const campos = [];
    const valores = [];

    for (const [key, value] of Object.entries(datos)) {
      if (value !== undefined) { // Solo incluir campos que sí se enviaron
        campos.push(`${key} = ?`);
        valores.push(value);
      }
    }

    if (campos.length === 0) return; // No hay nada que actualizar

    const sql = `UPDATE Productos_Servicios SET ${campos.join(', ')} WHERE id_producto_servicio = ?`;
    valores.push(id);

    await pool.query(sql, valores);
  },

  buscarPorEmprendimiento: async (id_emprendimiento) => {
    const [rows] = await pool.query(
      `SELECT *
       FROM Productos_Servicios 
       WHERE id_emprendimiento = ?`,
      [id_emprendimiento]
    );
    return rows; // Devuelve todos los productos/servicios del emprendimiento
  },

  buscarPorId: async (id) => {
    const [rows] = await pool.query(
      'SELECT * FROM Productos_Servicios WHERE id_producto_servicio = ?',
      [id]
    );
    return rows[0]; // Devuelve el producto/servicio o undefined
  },


  agregarImagen :async (id_producto, rutaImagen, id_usuario) => {
  const sql = `
    UPDATE Productos_Servicios 
    SET imagen_url = ?
    WHERE id_producto_servicio = ? AND id_emprendimiento IN (
      SELECT id_emprendimiento FROM Emprendimientos WHERE id_usuario = ?
    )
  `;
  const [result] = await pool.query(sql, [rutaImagen, id_producto, id_usuario]);
  return result;
},

  eliminar: async (id) => {
  await pool.query('DELETE FROM Productos_Servicios WHERE id_producto_servicio = ?', [id]);
},

  // listar al publico
  listar: async (filtros = {}) => {
  let query = `
    SELECT ps.*, 
      c.nombre AS categoria, 
      c.tipo AS tipo_categoria,
      e.nombre_negocio AS emprendimiento_nombre,
      (SELECT AVG(valoracion) FROM Reseñas WHERE id_producto_servicio = ps.id_producto_servicio AND aprobado = TRUE) AS promedio_valoracion
    FROM Productos_Servicios ps
    JOIN Categorias c ON ps.id_categoria = c.id_categoria
    JOIN Emprendimientos e ON ps.id_emprendimiento = e.id_emprendimiento
    WHERE ps.estado = 'disponible' AND e.activo = TRUE
  `;

  const params = [];

  if (filtros.q) {
    query += ` AND ps.nombre LIKE ?`;
    params.push(`%${filtros.q}%`);
  }

  if (filtros.categoria) {
    query += ` AND c.nombre = ?`;
    params.push(filtros.categoria);
  }

  if (filtros.tipo) {
    query += ` AND c.tipo = ?`; // 'producto' o 'servicio'
    params.push(filtros.tipo);
  }

  if (filtros.precio_min !== undefined && filtros.precio_min !== '') {
  query += ` AND ps.precio >= ?`;
  params.push(Number(filtros.precio_min));
  }

  if (filtros.precio_max !== undefined && filtros.precio_max !== '') {
  query += ` AND ps.precio <= ?`;
  params.push(Number(filtros.precio_max));
  }

  
  // Ordenamiento
  switch (filtros.orden) {
    case 'precio_asc':
      query += ` ORDER BY ps.precio ASC`;
      break;
    case 'precio_desc':
      query += ` ORDER BY ps.precio DESC`;
      break;
    case 'valoracion_desc':
      query += ` ORDER BY promedio_valoracion DESC`;
      break;
    case 'valoracion_asc':
      query += ` ORDER BY promedio_valoracion ASC `
    case 'recientes':
      query += ` ORDER BY ps.fecha_publicacion DESC`;
      break;
    case `nombre_asc`:
      query += `emprendimiento_nombre ASC `
    case ` nombre_desc`:
      query += ` emprendimiento_nombre DESC`
    default:
      query += ` ORDER BY ps.id_producto_servicio DESC`;
  }

  const [rows] = await pool.query(query, params);
  return rows;
},


  detalle: async (id_producto_servicio) => {
    const [rows] = await pool.query(`
      SELECT 
        ps.*, 
        c.nombre AS categoria,
        e.nombre_negocio,
        e.logo_url AS logo_negocio,
        e.id_emprendimiento,
        (SELECT AVG(valoracion) FROM Reseñas WHERE id_producto_servicio = ps.id_producto_servicio AND aprobado = TRUE) AS promedio_valoracion,
        (SELECT COUNT(*) FROM Reseñas WHERE id_producto_servicio = ps.id_producto_servicio AND aprobado = TRUE) AS total_reseñas
      FROM Productos_Servicios ps
      JOIN Categorias c ON ps.id_categoria = c.id_categoria
      JOIN Emprendimientos e ON ps.id_emprendimiento = e.id_emprendimiento
      WHERE ps.id_producto_servicio = ?
    `, [id_producto_servicio]);
    return rows[0];
  },

  reseñas: async (id_producto_servicio) => {
    const [rows] = await pool.query(`
      SELECT r.*, u.nombre AS cliente_nombre, u.apellido AS cliente_apellido
      FROM Reseñas r
      JOIN Usuarios u ON r.id_usuario = u.id_usuario
      WHERE r.id_producto_servicio = ? AND r.aprobado = TRUE
      ORDER BY r.fecha_comentario DESC
    `, [id_producto_servicio]);
    return rows;
  }









};
module.exports = Producto_Servicio;