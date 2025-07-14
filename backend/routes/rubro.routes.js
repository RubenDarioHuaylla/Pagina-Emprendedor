// routes/categoria.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/rubro.controller');

// Obtener todas las categorías
router.get('/', controller.listarRubros);

module.exports = router;
