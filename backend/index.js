
const express = require('express');
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(express.json()); // Para parsear JSON
// cors sirve para permitir solicitudes desde otros dominios
// En producción, deberías configurar CORS para permitir solo dominios específicos
app.use(cors()); // Habilitar CORS

// Rutas
const authRoutes = require('./routes/auth.routes');
const emprendimientoRoutes = require('./routes/emprendimiento.routes');
app.use('/api/auth', authRoutes);
app.use('/api/emprendimientos', emprendimientoRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});