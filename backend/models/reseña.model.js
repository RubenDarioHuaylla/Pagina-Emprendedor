const pool = require('../config/db');

class Reseña {
  // Crear una nueva reseña
  static async create({ id_usuario, id_producto_servicio, id_emprendimiento, valoracion, comentario }) {

    let query , params;

    if (id_producto_servicio){
      query = `INSERT INTO Reseñas (id_usuario, id_producto_servicio, valoracion, comentario) 
               VALUES (?, ?, ?, ?)`;
      params = [id_usuario, id_producto_servicio, valoracion, comentario];
    } 
    else{
      query = `INSERT INTO Reseñas (id_usuario, id_emprendimiento, valoracion, comentario) 
               VALUES (?, ?, ?, ?)`;
      params = [id_usuario, id_emprendimiento, valoracion, comentario];
    }
    const [result] = await pool.query(query, params);
    return result.insertId; // Devuelve el ID de la nueva reseña
  }

  // Obtener reseñas de un producto
  static async findByProducto(id_producto_servicio) {
    const [rows] = await pool.query(
      `SELECT r.*, u.nombre, u.apellido 
       FROM Reseñas r
       JOIN Usuarios u ON r.id_usuario = u.id_usuario
       WHERE r.id_producto_servicio = ? AND r.aprobado = TRUE
       ORDER BY r.fecha_comentario DESC`,
      [id_producto_servicio]
    );
    return rows;
  }

  // Obtener reseñas de un emprendimiento
  static async findByEmprendimiento(id_emprendimiento) {
    const [rows] = await pool.query(
      `SELECT r.*, u.nombre, u.apellido 
       FROM Reseñas r
       JOIN Usuarios u ON r.id_usuario = u.id_usuario
       WHERE r.id_emprendimiento = ? AND r.aprobado = TRUE
       ORDER BY r.fecha_comentario DESC`,
      [id_emprendimiento]
    );
    return rows;
  }

  // Obtener reseñas para el dashboard del emprendedor
  static async findForEmprendedor(id_emprendedor) {
    // Obtener IDs de emprendimientos del emprendedor
    const [emprendimientos] = await pool.query(
      'SELECT id_emprendimiento FROM Emprendimientos WHERE id_usuario = ?',
      [id_emprendedor]
    );
    const emprendimientoIds = emprendimientos.map(e => e.id_emprendimiento);

    // Reseñas de emprendimientos
    const [reseñasEmprendimientos] = await pool.query(
      `SELECT r.*, u.nombre, u.apellido, e.nombre_negocio as nombre_objeto, 'emprendimiento' as tipo
       FROM Reseñas r
       JOIN Usuarios u ON r.id_usuario = u.id_usuario
       JOIN Emprendimientos e ON r.id_emprendimiento = e.id_emprendimiento
       WHERE r.id_emprendimiento IN (?)`,
      [emprendimientoIds]
    );

    // Reseñas de productos
    const [reseñasProductos] = await pool.query(
      `SELECT r.*, u.nombre, u.apellido, ps.nombre as nombre_objeto, 'producto' as tipo
       FROM Reseñas r
       JOIN Usuarios u ON r.id_usuario = u.id_usuario
       JOIN Productos_Servicios ps ON r.id_producto_servicio = ps.id_producto_servicio
       WHERE ps.id_emprendimiento IN (?)`,
      [emprendimientoIds]
    );

    return [...reseñasEmprendimientos, ...reseñasProductos]
      .sort((a, b) => new Date(b.fecha_comentario) - new Date(a.fecha_comentario));
  }

  // Verificar si usuario ya comentó un producto/emprendimiento
  static async userHasReviewed({ id_usuario, id_producto_servicio, id_emprendimiento }) {
    const [rows] = await pool.query(
      `SELECT id_comentario FROM Reseñas 
       WHERE id_usuario = ? AND 
       (id_producto_servicio = ? OR id_emprendimiento = ?)`,
      [id_usuario, id_producto_servicio || null, id_emprendimiento || null]
    );
    return rows.length > 0;
  }
  // 
  static async getForEmprendedor(emprendedorId, filters = {}) {
  const { tipo, orden, valoracion, page = 1, perPage = 10 } = filters;
  const offset = (page - 1) * perPage;

  let query = `
    SELECT 
      r.id_comentario,
      r.valoracion,
      r.comentario,
      r.fecha_comentario,
      r.id_producto_servicio,
      r.id_emprendimiento,
      u.nombre AS cliente_nombre,
      u.apellido AS cliente_apellido,
      ps.nombre AS producto_nombre,
      c.tipo AS tipo_oferta,
      CASE
        WHEN r.id_producto_servicio IS NOT NULL THEN 'producto'
        ELSE 'emprendimiento'
      END AS tipo
    FROM Reseñas r
    JOIN Usuarios u ON r.id_usuario = u.id_usuario
    LEFT JOIN Productos_Servicios ps ON r.id_producto_servicio = ps.id_producto_servicio
    LEFT JOIN Categorias c ON ps.id_categoria = c.id_categoria
    LEFT JOIN Emprendimientos e ON ps.id_emprendimiento = e.id_emprendimiento OR r.id_emprendimiento = e.id_emprendimiento
    WHERE e.id_usuario = ?
  `;

  const params = [emprendedorId];

  // 🔍 Filtro por tipo: producto, servicio, emprendimiento
  if (tipo === 'producto') {
    query += ` AND r.id_producto_servicio IS NOT NULL AND (c.tipo = 'producto' OR c.tipo = 'ambos')`;
  } else if (tipo === 'servicio') {
    query += ` AND r.id_producto_servicio IS NOT NULL AND (c.tipo = 'servicio' OR c.tipo = 'ambos')`;
  } else if (tipo === 'emprendimiento') {
    query += ` AND r.id_emprendimiento IS NOT NULL`;
  }
  
  // 🔍 Filtro por valoración (1 a 5)
  if (valoracion) {
    query += ' AND r.valoracion = ?';
    params.push(valoracion);
  }

  // 🔃 Ordenamiento
  switch (orden) {
    case 'antiguas':
      query += ' ORDER BY r.fecha_comentario ASC';
      break;
    case 'mejores':
      query += ' ORDER BY r.valoracion DESC';
      break;
    case 'peores':
      query += ' ORDER BY r.valoracion ASC';
      break;
    default: // recientes
      query += ' ORDER BY r.fecha_comentario DESC';
  }

  // 📄 Paginación
  query += ' LIMIT ? OFFSET ?';
  params.push(perPage, offset);

  const [rows] = await pool.query(query, params);
  return rows;
}

  // Obtener estadísticas de reseñas
  static async getStats(emprendedorId) {
    const query = `
      SELECT 
        AVG(r.valoracion) as promedio,
        COUNT(*) as total_reseñas,
        SUM(r.valoracion = 5) as cinco_estrellas,
        SUM(r.valoracion = 4) as cuatro_estrellas,
        SUM(r.valoracion = 3) as tres_estrellas,
        SUM(r.valoracion = 2) as dos_estrellas,
        SUM(r.valoracion = 1) as una_estrella
      FROM Reseñas r
      LEFT JOIN Productos_Servicios ps ON r.id_producto_servicio = ps.id_producto_servicio
      LEFT JOIN Emprendimientos e ON ps.id_emprendimiento = e.id_emprendimiento OR r.id_emprendimiento = e.id_emprendimiento
      WHERE e.id_usuario = ?
    `;

    const [rows] = await pool.query(query, [emprendedorId]);
    return rows[0];
  }

}

module.exports = Reseña;