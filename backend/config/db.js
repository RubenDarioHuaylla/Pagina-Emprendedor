const mysql = require('mysql2/promise');
require('dotenv').config();

// Crear el pool de conexiones
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Probar la conexión al iniciar
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Conexión exitosa a MySQL');
    connection.release();
  } catch (error) {
    console.error('Error al conectar a MySQL:', error);
    process.exit(1);
  }
}

testConnection();

module.exports = pool;