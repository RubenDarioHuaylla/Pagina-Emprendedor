const { Router } = require('express');
const { generateDescription } = require('../controllers/ai.controller.js');
const router = Router();

// Ruta para generar descripciones: POST /api/ai/generate-description
router.post('/generate-description', generateDescription);

module.exports = router;