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
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_emprendimiento, id_categoria, nombre, descripcion_corta,
        descripcion_larga, precio, unidad_medida, imagen_url, estado
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
}


};
module.exports = Producto_Servicio;