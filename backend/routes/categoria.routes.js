// routes/categoria.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/categoria.controller');

// Obtener todas las categorías
router.get('/', controller.listarCategorias);

module.exports = router;
