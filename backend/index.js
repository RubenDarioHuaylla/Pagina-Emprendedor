
const express = require('express');
require('dotenv').config();
const cors = require('cors');

const path = require('path');
const app = express();
app.use(express.json()); // Para parsear JSON
// cors sirve para permitir solicitudes desde otros dominios
// En producción, deberías configurar CORS para permitir solo dominios específicos
app.use(cors()); // Habilitar CORS

// Rutas
const authRoutes = require('./routes/auth.routes');
const emprendimientoRoutes = require('./routes/emprendimiento.routes');
const productoServicioRoutes = require('./routes/producto_servicio.routes');
const categoriaRoutes = require('./routes/categoria.routes');
const reseñaRoutes = require('./routes/reseña.routes');
const rubroRoutes = require('./routes/rubro.routes');

const aiRoutes = require('./routes/ai.routes.js');

app.use('/api/auth', authRoutes);
app.use('/api/emprendimientos', emprendimientoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/productos', productoServicioRoutes);
app.use('/api/resenas', reseñaRoutes);
app.use('/api/rubros', rubroRoutes);

app.use('/api/ai', aiRoutes);


app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});