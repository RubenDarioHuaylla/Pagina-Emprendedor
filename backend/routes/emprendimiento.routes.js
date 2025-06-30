const express = require('express');
const router = express.Router();
const controller = require('../controllers/emprendimiento.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
// Ruta para crear emprendimiento (solo usuarios autenticados)
router.post('/', 
  authMiddleware, // <-- Solo verifica que esté logueado, no el rol
  controller.crearEmprendimiento
);

// Ruta para listar emprendimientos del usuario logueado
router.get('/mio', 
  authMiddleware, 
  controller.obtenerEmprendimiento
);

// Ruta para obtener un emprendimiento por ID
router.put('/mio', authMiddleware, controller.actualizarEmprendimiento);


// Ruta para subir logo de emprendimiento

router.post('/subir-logo', authMiddleware, upload.single('logo'), async (req, res) => {
  try {
    // Guarda la ruta en tu base de datos si deseas
    const ruta = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ logo_url: ruta });
  } catch (err) {
    res.status(500).json({ error: 'Error al subir imagen' });
  }
});

module.exports = router;

