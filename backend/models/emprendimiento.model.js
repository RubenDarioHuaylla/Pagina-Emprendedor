const pool = require('../config/db');
const { listar } = require('./categoria.model');

const Emprendimiento = {
  // Crear emprendimiento
  crear: async ({
    id_usuario,
    nombre_negocio,
    descripcion = null,
    logo_url = null,
    direccion = null,
    email_contacto = null,
    telefono_contacto = null,
    facebook_url = null,
    instagram_url = null,
    whatsapp_url = null,
    id_rubro
  }) => {
    const [result] = await pool.query(
      `INSERT INTO Emprendimientos (
        id_usuario, nombre_negocio, descripcion, logo_url,
        direccion, email_contacto, telefono_contacto ,facebook_url, instagram_url, whatsapp_url,id_rubro
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_usuario, nombre_negocio, descripcion, logo_url,
        direccion,email_contacto,telefono_contacto, facebook_url, instagram_url, whatsapp_url, id_rubro
      ]
    );
    return result.insertId;
  },

  buscarPorId: async (id) => {
    const [rows] = await pool.query(
      'SELECT * FROM Emprendimientos WHERE id_emprendimiento = ?',
      [id]
    );
    return rows[0];
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

    const sql = `UPDATE Emprendimientos SET ${campos.join(', ')} WHERE id_emprendimiento = ?`;
    valores.push(id);

    await pool.query(sql, valores);
  },
  // Obtener todos los emprendimientos de un usuario
  buscarPorUsuario: async (id_usuario) => {
    const [rows] = await pool.query(
      `SELECT *
       FROM Emprendimientos 
       WHERE id_usuario = ?`,
      [id_usuario]
    );
    return rows[0]; // Devuelve el primer resultado o undefined
  },


  listar: async (filtros = {}) => {
  let query = `
    SELECT 
      e.id_emprendimiento,
      e.nombre_negocio,
      e.logo_url,
      r.nombre AS rubro,
      COALESCE(
      (SELECT AVG(valoracion) FROM Reseñas WHERE id_emprendimiento = e.id_emprendimiento AND aprobado = TRUE),
      0
      ) AS promedio_valoracion
    FROM Emprendimientos e
    LEFT JOIN Rubros r ON e.id_rubro = r.id_rubro
    WHERE e.activo = TRUE
  `;
  
  const params = [];

  if (filtros.nombre) {
    query += ' AND e.nombre_negocio LIKE ?';
    params.push(`%${filtros.nombre}%`);
  }

  if (filtros.rubro ) {
    query += ' AND r.nombre = ?';
    params.push(filtros.rubro);
  }

  switch (filtros.orden) {
    case 'valoracion_desc':
      query += ' ORDER BY promedio_valoracion DESC';
      break;
    case 'valoracion_asc':
      query += ' ORDER BY promedio_valoracion ASC';
      break;
    case 'nombre_asc':
      query += ' ORDER BY e.nombre_negocio ASC';
      break;
    case 'nombre_desc':
      query += ' ORDER BY e.nombre_negocio DESC';
      break;
    case 'recientes':
      query += ' ORDER BY e.fecha_creacion DESC';
      break;
    case 'antiguos':
      query += ' ORDER BY e.fecha_creacion ASC';
      break;
    default:
      query += ' ORDER BY e.id_emprendimiento DESC';
  }

  const [rows] = await pool.query(query, params);
  return rows;
},


  detalle: async (id) => {
    const [rows] = await pool.query(`
      SELECT 
        e.*, r.nombre AS rubro,
        (SELECT AVG(valoracion) FROM Reseñas WHERE id_emprendimiento = e.id_emprendimiento AND aprobado = TRUE) AS promedio_valoracion,
        (SELECT COUNT(*) FROM Reseñas WHERE id_emprendimiento = e.id_emprendimiento AND aprobado = TRUE) AS total_reseñas
      FROM Emprendimientos e
      LEFT JOIN Rubros r ON e.id_rubro = r.id_rubro
      WHERE e.id_emprendimiento = ?
    `, [id]);
    return rows[0];
  },

  listarProductos: async (id_emprendimiento) => {
    const [rows] = await pool.query(`
      SELECT ps.*, c.nombre AS categoria
      FROM Productos_Servicios ps
      JOIN Categorias c ON ps.id_categoria = c.id_categoria
      WHERE ps.id_emprendimiento = ? AND ps.estado = 'disponible'
    `, [id_emprendimiento]);
    return rows;
  },

  reseñas: async (id_emprendimiento) => {
    const [rows] = await pool.query(`
      SELECT r.*, u.nombre AS cliente_nombre, u.apellido AS cliente_apellido
      FROM Reseñas r
      JOIN Usuarios u ON r.id_usuario = u.id_usuario
      WHERE r.id_emprendimiento = ? AND r.aprobado = TRUE
      ORDER BY r.fecha_comentario DESC
    `, [id_emprendimiento]);
    return rows;
  },

  // En tu modelo Emprendimiento.js
  destacados: async () => {
  const query = `
    SELECT 
      e.id_emprendimiento,
      e.nombre_negocio,
      e.logo_url,
      e.descripcion,
      r.nombre AS rubro,
      COALESCE(
        (SELECT AVG(valoracion) FROM Reseñas 
         WHERE id_emprendimiento = e.id_emprendimiento AND aprobado = TRUE),
        0
      ) AS promedio_valoracion,
      SUBSTRING(e.descripcion, 1, 100) AS descripcion_corta
    FROM Emprendimientos e
    LEFT JOIN Rubros r ON e.id_rubro = r.id_rubro
    WHERE e.activo = TRUE
    ORDER BY promedio_valoracion DESC
    LIMIT 3  -- Siempre devuelve 3 emprendimientos
  `;
  
  try {
    const [rows] = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error en modelo destacados:', error);
    throw error;
  }
}


};

module.exports = Emprendimiento;