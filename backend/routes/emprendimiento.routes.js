const express = require('express');
const router = express.Router();
const controller = require('../controllers/emprendimiento.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Ruta para crear emprendimiento (solo usuarios autenticados)
router.post('/', 
  authMiddleware, // <-- Solo verifica que esté logueado, no el rol
  controller.crearEmprendimiento
);

// Ruta para listar emprendimientos del usuario logueado
router.get('/mis', 
  authMiddleware, 
  controller.listarEmprendimientos
);

// Ruta para obtener un emprendimiento por ID
router.put('/:id', authMiddleware, controller.actualizarEmprendimiento);


module.exports = router;

