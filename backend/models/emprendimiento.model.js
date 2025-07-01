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
    whatsapp_url = null
  }) => {
    const [result] = await pool.query(
      `INSERT INTO Emprendimientos (
        id_usuario, nombre_negocio, descripcion, logo_url,
        direccion, email_contacto, telefono_contacto ,facebook_url, instagram_url, whatsapp_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_usuario, nombre_negocio, descripcion, logo_url,
        direccion,email_contacto,telefono_contacto, facebook_url, instagram_url, whatsapp_url
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
  }


};

module.exports = Emprendimiento;