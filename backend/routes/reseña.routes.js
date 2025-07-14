const express = require('express');
const router = express.Router();
const resenaController = require('../controllers/reseña.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Crear reseña (requiere autenticación como cliente)
router.post('/', authMiddleware, resenaController.create);


// vericar si ya comento
router.get('/verificar', authMiddleware ,resenaController.verificar);

// Obtener reseñas de producto (público)
router.get('/producto/:id', resenaController.getByProducto);

// Obtener reseñas de emprendimiento (público)
router.get('/emprendimiento/:id', resenaController.getByEmprendimiento);

// Obtener reseñas para dashboard emprendedor (requiere autenticación)
//router.get('/dashboard', authMiddleware, resenaController.getForEmprendedor);
  
router.get('/dashboard', authMiddleware, resenaController.getDashboard);

module.exports = router;