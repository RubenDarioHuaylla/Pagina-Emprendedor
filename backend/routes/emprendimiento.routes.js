const express = require('express');
const router = express.Router();
const controller = require('../controllers/emprendimiento.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const crearUpload = require('../middlewares/upload.middleware');
const upload = crearUpload('logos', 'logo');
// Ruta para crear emprendimiento (solo usuarios autenticados)
router.post('/', 
  authMiddleware, // <-- Solo verifica que esté logueado, no el rol
  controller.crearEmprendimiento
);

// Ruta para ver emprendimiento del usuario logueado
router.get('/mio', 
  authMiddleware, 
  controller.obtenerEmprendimiento
);

// Ruta par actualizar
router.put('/mio', authMiddleware, controller.actualizarEmprendimiento);


// Ruta para subir logo de emprendimiento

router.post('/subir-logo', authMiddleware, upload.single('logo'), async (req, res) => {
  try {
    
    // Guarda la ruta en tu base de datos si deseas
    const ruta = `${req.protocol}://${req.get('host')}/uploads/logos/${req.file.filename}`;
    res.json({ logo_url: ruta });
  } catch (err) {
    res.status(500).json({ error: 'Error al subir imagen' });
  }
});

router.get('/destacados', controller.destacados);

router.get('/', controller.listarEmprendimientos);
router.get('/:id', controller.detalleEmprendimiento);




module.exports = router;

