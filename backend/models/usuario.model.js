const pool = require('../config/db');
const bcrypt = require('bcryptjs'); // Para hashear contraseñas

const Usuario = {
  // Registrar un nuevo usuario
  crear: async ({ nombre, apellido, email, password, rol }) => {
    const passwordHash = await bcrypt.hash(password, 10); // Hash seguro
    const [result] = await pool.query(
      'INSERT INTO Usuarios (nombre, apellido, email, password_hash, rol) VALUES (?, ?, ?, ?, ?)',
      [nombre, apellido, email, passwordHash, rol]
    );
    return result.insertId;
  },

  // Buscar por email (para login)
  buscarPorEmail: async (email) => {
    const [rows] = await pool.query(
      'SELECT * FROM Usuarios WHERE email = ?',
      [email]
    );
    return rows[0]; // Devuelve el usuario o undefined
  },

  // Verificar contraseña
  compararPassword: async (passwordIngresada, passwordHash) => {
    return await bcrypt.compare(passwordIngresada, passwordHash);
  },

  // En models/Usuario.js
  // En models/Usuario.js
buscarPorId: async (id) => {
  const [rows] = await pool.query(
    'SELECT id_usuario, nombre, email, rol FROM Usuarios WHERE id_usuario = ?',
    [id]
  );
  return rows[0]; // Devuelve el primer resultado o undefined
}

};

module.exports = Usuario;