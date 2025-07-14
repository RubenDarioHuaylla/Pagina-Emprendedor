const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
// POST /api/auth/registro
router.post('/registro', authController.registrar);

// Protegido 
router.get('/perfil', authMiddleware, authController.obtenerPerfil);

// POST /api/auth/login
router.post('/login', authController.login);

module.exports = router;